import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { extractPublicId, uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { sendOTPEmail } from '../services/OTPGenerate.js';


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Error generating Token")
    }
};

// const loginUser = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email) {
//         throw new ApiError(400, "Email is required")
//     }

//     const user = await User.findOne({
//         $or: [{ email }]
//     })

//     if (!user) {
//         throw new ApiError(404, "User not found")
//     }

//     const isPasswordValid = await user.isPasswordCorrect(password)

//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid Crendentials")
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

//     const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

//     const options = {
//         httpOnly: true,
//         secure: false,
//     }

//     return res
//         .status(200)
//         .cookie('accessToken', accessToken, options)
//         .cookie('refreshToken', refreshToken, options)
//         .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }));

// });

// const logoutUser = asyncHandler(async (req, res) => {

//     await User.findByIdAndUpdate(

//         req.user._id,
//         {
//             $unset: {
//                 refreshToken: 1
//             },
//         },
//         {
//             new: true
//         }
//     )

//     const options = {
//         httpOnly: true,
//         secure: false,
//     }

//     return res
//         .status(200)
//         .clearCookie('accessToken', options)
//         .clearCookie('refreshToken', options)
//         .json(new ApiResponse(200, {}, "Logged out successfully"))
// });

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(new ApiResponse(
                200, { accessToken, newRefreshToken }
            ))
    } catch (error) {
        throw new ApiError(500, "Internal Server Error");
    }
})

// const forgotPassword = asyncHandler(async (req, res) => {

//     const { email } = req.body;

//     if (!email) {
//         throw new ApiError(400, "Email is required");
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//         throw new ApiError(404, "User not found");
//     }

//     // Generate OTP
//     try {

//         const otp = otpGenerator.generate(6, {
//             upperCaseAlphabets: false,
//             specialChars: false,
//             lowerCaseAlphabets: false
//         });

//         // Store OTP and expiry in user document
//         user.resetPasswordOTP = otp;
//         user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//         await user.save({ validateBeforeSave: false });

//         // Send email with OTP
//         const emailResult = await sendOTPEmail(email, otp);

//         if (!emailResult.success) {
//             throw new Error('Failed to send OTP email');
//         }

//     } catch (error) {
//         console.error('Error generating OTP:', error);
//         throw new ApiError(500, "Failed to generate OTP");
//     }
//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "OTP sent to email successfully"))
// })

// const verifyOTP = asyncHandler(async (req, res) => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         throw new ApiError(400, "Email and OTP are required");
//     }

//     const user = await User.findOne({
//         email,
//         resetPasswordOTP: otp,
//         resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//         throw new ApiError(400, "Invalid or expired OTP");
//     }

//     // OTP is valid, redirect to reset password page
//     return res
//     .status(200)
//     .json(new ApiResponse(200,{},"OTP verified ✅"))
// });

// const resetPassword = asyncHandler(async (req, res) => {
//     const { email ,newPassword, confirmPassword , otp } = req.body;

//     if (!email || !newPassword || !confirmPassword ||!otp) {
//         throw new ApiError(400, "All fields are required");
//     }

//     if (newPassword !== confirmPassword) {
//         throw new ApiError(400, "Passwords do not match");
//     }

//     if (newPassword.length < 6) {
//         throw new ApiError(400, "Password must be at least 6 characters long");
//     }

//     const user = await User.findOne({
//         email,
//         resetPasswordOTP: otp,  //token original
//         resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//         throw new ApiError(400, "Invalid or expired token");
//     }

//     // Reset password
//     user.password = newPassword;
//     user.resetPasswordOTP = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return res
//         .status(200)
//         .json(new ApiResponse(200, {}, "Password reset successfully"));
// });

const changeUserPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }

    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})

const getAllUser = asyncHandler(async (req,res)=>{
    const users = await User.find().select('-password -refreshToken');
    return res
        .status(200)
        .json(new ApiResponse(200, users, "All Users Fetched Successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Current User Fetched Successfully"))
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { currentPosition, company, location, phone, bio, linkedin, github } = req.body;

    if (!currentPosition || !company || !location || !phone || !bio || !linkedin || !github) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                currentPosition,
                company,
                location,
                phone,
                bio,
                linkedin,
                github
            }
        },
        { new: true }
    ).select('-password -refreshToken');
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Details Updated Successfully"))
});

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select('-password');

    const oldAvatarPublicId = extractPublicId(req.user?.avatar);

    if (!oldAvatarPublicId) {
        throw new ApiError(500, 'Failed to extract public ID from avatar URL');
    }

    await deleteFromCloudinary(oldAvatarPublicId);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar Updated Successfully"))

})

export {
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    getAllUser,
};


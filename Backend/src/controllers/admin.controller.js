import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import { extractPublicId, uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import otpGenerator from 'otp-generator';
import { sendOTPEmail } from '../services/OTPGenerate.js';
import { parseCsv } from "../utils/csvParser.js";

const generateAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }
        if (!admin.generateAccessToken || !admin.generateRefreshToken) {
            throw new ApiError(500, "Token generation methods not implemented");
        }
        const accessToken = await admin.generateAccessToken();
        const refreshToken = await admin.generateRefreshToken();
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Error generating Token")
    }
};

// const loginAdmin = asyncHandler(async (req, res) => {
//     const { email, password } = req.body;

//     if (!email) {
//         throw new ApiError(400, "Email is required")
//     }

//     const admin = await Admin.findOne({
//         $or: [{ email }]
//     })

//     if (!admin) {
//         throw new ApiError(404, "Admin not found")
//     }

//     const isPasswordValid = await admin.isPasswordCorrect(password)

//     if (!isPasswordValid) {
//         throw new ApiError(401, "Invalid Credentials")
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshToken(admin._id)

//     const loggedInAdmin = await Admin.findById(admin._id).select('-password -refreshToken');

//     const options = {
//         httpOnly: true,
//         secure: false,
//     }

//     return res
//         .status(200)
//         .cookie('accessToken', accessToken, options)
//         .cookie('refreshToken', refreshToken, options)
//         .json(new ApiResponse(200, { admin: loggedInAdmin, accessToken, refreshToken }));

// });

// const logoutAdmin = asyncHandler(async (req, res) => {

//     await Admin.findByIdAndUpdate(

//         req.admin._id,
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

        const admin = await Admin.findById(decodedToken?._id)

        if (!admin) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(admin._id)

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

const forgotPassword = asyncHandler(async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    // Generate OTP
    try {

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        // Store OTP and expiry in user document
        admin.resetPasswordOTP = otp;
        admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await admin.save({ validateBeforeSave: false });

        // Send email with OTP
        const emailResult = await sendOTPEmail(email, otp);

        if (!emailResult.success) {
            throw new ApiError(500, 'Failed to send OTP email');
        }

    } catch (error) {
        console.error('Error generating OTP:', error);
        throw new ApiError(500, "Failed to generate OTP");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP sent to email successfully"))
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const admin = await Admin.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    // OTP is valid, redirect to reset password page
    return res.status(200).json(new ApiResponse(200, {}, "OTP verified ✅"))
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const admin = await Admin.findOne({
        email,
        resetPasswordOTP: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
        throw new ApiError(400, "Invalid or expired token");
    }

    // Reset password
    admin.password = newPassword;
    admin.resetPasswordOTP = undefined;
    admin.resetPasswordExpires = undefined;
    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeAdminPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password must be different from old password");
    }

    const admin = await Admin.findById(req.admin._id);

    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    admin.password = newPassword;

    await admin.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Changed Successfully"))
})

const updateAdminAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Failed to upload avatar");
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select('-password');

    const oldAvatarPublicId = extractPublicId(req.admin?.avatar);

    if (oldAvatarPublicId) {
        try {
            await deleteFromCloudinary(oldAvatarPublicId);
        } catch (error) {
            console.error('Failed to delete old avatar:', error);
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Avatar Updated Successfully"))

})

const addStudentCsv = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, "CSV file is required");
    }

    // Process the CSV file and add users
    const users = await parseCsv(req.file.path);
    await User.insertMany(users);

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Users added successfully"));
})

const editUserDetails = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        throw new ApiError(400, "User ID is required");
    }

    const { name, email, role, avatar, graduationYear , course , currentPosition , company , location , phone } = req.body;

   try {
     const user = await User.findByIdAndUpdate(_id,{
         $set: {
             name,
             email,
             role,
             avatar,
             graduationYear,
             course,
             currentPosition,
             company,
             location,
             phone
         }
     } ,{ new: true });

        if (!user) {
           throw new ApiError(404, "User not found");
       }

         return res
                .status(200)
                .json(new ApiResponse(200, user, "User details updated successfully"));
   } catch (error) {
     throw new ApiError(500, "Internal Server Error");
   }
})

export {
   
    refreshAccessToken,
    forgotPassword,
    verifyOTP,
    resetPassword,
    changeAdminPassword,
    updateAdminAvatar,
    addStudentCsv,
    editUserDetails
}
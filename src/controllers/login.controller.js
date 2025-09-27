import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import otpGenerator from 'otp-generator';
import { sendOTPEmail } from '../services/OTPGenerate.js';
import jwt from "jsonwebtoken";

const generateUserAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Error generating User Token")
    }
};

const generateAdminAccessAndRefreshToken = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = await admin.generateAccessToken();
        const refreshToken = await admin.generateRefreshToken();
        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Error generating Admin Token")
    }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.body.token; // Add req.body.token

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const admin = await Admin.findById(decodedToken?._id)
        const user = await User.findById(decodedToken?._id)

        if (!user && !admin) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (user) {
            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh token is expired");
            }

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateUserAccessAndRefreshToken(user._id)

            return res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', newRefreshToken, options)
                .json(new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                ))
        }

        if (admin) {
            if (incomingRefreshToken !== admin?.refreshToken) {
                throw new ApiError(401, "Refresh token is expired");
            }

            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateAdminAccessAndRefreshToken(admin._id)

            return res
                .status(200)
                .cookie('accessToken', accessToken, options)
                .cookie('refreshToken', newRefreshToken, options)
                .json(new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                ))
        }
    } catch (error) {
        console.error('Refresh token error:', error);
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required")
    }

    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email });

    if (user) {
        const isPasswordValid = await user.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid Credentials")
        }

        const { accessToken, refreshToken } = await generateUserAccessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, {
                user: loggedInUser,
                admin: null,
                accessToken,
                refreshToken,
                userType: 'user'
            }, "User logged in successfully"));
    }

    if (admin) {
        const isPasswordValid = await admin.isPasswordCorrect(password)

        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid Credentials")
        }

        const { accessToken, refreshToken } = await generateAdminAccessAndRefreshToken(admin._id)

        const loggedInAdmin = await Admin.findById(admin._id).select('-password -refreshToken');

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        }

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, {
                admin: loggedInAdmin,
                user: null,
                accessToken,
                refreshToken,
                userType: 'admin'
            }, "Admin logged in successfully"));
    }

    throw new ApiError(404, "Invalid email or password")
});

const logout = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }

    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                },
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
            .json(new ApiResponse(200, {}, "User logged out successfully"))

    } else if (req.admin) {
        await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                $unset: {
                    refreshToken: 1
                },
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
            .json(new ApiResponse(200, {}, "Admin logged out successfully"))
    }

    throw new ApiError(400, "No active session found")
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ email })

    if (!user && !admin) {
        throw new ApiError(404, "User not found")
    }

    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });

        if (user) {
            user.resetPasswordOTP = otp;
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
            await user.save({ validateBeforeSave: false });
        }
        if (admin) {
            admin.resetPasswordOTP = otp;
            admin.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
            await admin.save({ validateBeforeSave: false });
        }

        // Send email with OTP with better error handling
        console.log('Attempting to send OTP email to:', email);
        const emailResult = await sendOTPEmail(email, otp);
        console.log('Email result:', emailResult);

        if (!emailResult || !emailResult.success) {
            // Clean up the OTP from database if email fails
            if (user) {
                user.resetPasswordOTP = undefined;
                user.resetPasswordExpires = undefined;
                await user.save({ validateBeforeSave: false });
            }
            if (admin) {
                admin.resetPasswordOTP = undefined;
                admin.resetPasswordExpires = undefined;
                await admin.save({ validateBeforeSave: false });
            }
            
            const errorMsg = emailResult?.message || 'Unknown email service error';
            console.error('Email service error:', errorMsg);
            throw new ApiError(500, `Failed to send OTP email: ${errorMsg}`);
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "OTP sent to email successfully"))

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        
        // If it's already an ApiError, rethrow it
        if (error instanceof ApiError) {
            throw error;
        }
        
        // For other errors, wrap them
        throw new ApiError(500, `Failed to process password reset request: ${error.message}`);
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    const admin = await Admin.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user && !admin) {
        throw new ApiError(400, "Invalid or expired OTP");
    }

    // OTP is valid, redirect to reset password page
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP verified ✅"))
});

const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword, confirmPassword, otp } = req.body;

    if (!email || !newPassword || !confirmPassword || !otp) {
        throw new ApiError(400, "All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    const user = await User.findOne({
        email,
        resetPasswordOTP: otp,  //token original
        resetPasswordExpires: { $gt: Date.now() }
    });

    const admin = await Admin.findOne({
        email,
        resetPasswordOTP: otp,  //token original
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user && !admin) {
        throw new ApiError(400, "Invalid or expired token");
    }

    // Reset password
    if (admin) {
        admin.password = newPassword;
        admin.resetPasswordOTP = undefined;
        admin.resetPasswordExpires = undefined;
        await admin.save({ validateBeforeSave: false });
    }
    if (user) {
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset successfully"));
});

export {
    login,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword
    , refreshAccessToken
}
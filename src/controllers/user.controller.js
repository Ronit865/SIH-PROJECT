import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { extractPublicId, uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import { sendOTPEmail } from '../services/OTPGenerate.js';
import mongoose from 'mongoose';


// const generateAccessAndRefreshToken = async (userId) => {
//     try {
//         const user = await User.findById(userId);
//         const accessToken = await user.generateAccessToken();
//         const refreshToken = await user.generateRefreshToken();
//         user.refreshToken = refreshToken;
//         await user.save({ validateBeforeSave: false });
//         return { accessToken, refreshToken };
//     } catch (err) {
//         throw new ApiError(500, "Error generating Token")
//     }
// };


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

const getAllUser = asyncHandler(async (req, res) => {
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
    const {name , email, currentPosition, company, location, phone, bio, linkedin, github } = req.body;

    

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                email,
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

const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    console.log('Attempting to delete user with ID:', userId); // Debug log
    
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    
    
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    // Delete avatar from cloudinary if exists
    if (user.avatar) {
        const avatarPublicId = extractPublicId(user.avatar);
        if (avatarPublicId) {
            await deleteFromCloudinary(avatarPublicId);
        }
    }

    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {

    changeUserPassword,
    getCurrentUser,
    updateUserDetails,
    updateUserAvatar,
    getAllUser,
    deleteUser
};


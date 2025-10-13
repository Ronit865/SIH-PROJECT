import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from "../utils/ApiResponse.js";
import { extractPublicId, uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
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

const updateAdminProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        throw new ApiError(400, "Name and Email are required");
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // Check if email already exists (if email is being updated)
    if (email) {
        const existingAdmin = await Admin.findOne({
            email,
            _id: { $ne: req.admin._id }
        });

        if (existingAdmin) {
            throw new ApiError(400, "Email already exists");
        }
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin._id,
        { $set: updateFields },
        { new: true }
    ).select('-password -refreshToken');

    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Profile updated successfully"));
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


const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.admin, "Admin fetched successfully"));
});

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

    const { name, email, role, graduationYear, course, phone } = req.body;

    try {
        const user = await User.findByIdAndUpdate(_id, {
            $set: {
                name,
                email,
                role,
                graduationYear,
                course,
                phone

            }
        }, { new: true });

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
    changeAdminPassword,
    updateAdminAvatar,
    addStudentCsv,
    editUserDetails,
    getCurrentAdmin,
    updateAdminProfile,
}
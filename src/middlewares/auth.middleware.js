import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Admin from "../models/admin.model.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Prioritize Authorization header over cookies for better cross-origin support
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }
        
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(404, "Invalid Access Token");
        }
        req.user = user;
        next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        } else if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired");
        } else if (err instanceof ApiError) {
            throw err;
        } else {
            throw new ApiError(401, "Authentication failed");
        }
    }
})

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        // Prioritize Authorization header over cookies
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }
        
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodeToken?._id).select("-password -refreshToken")

        if (!admin) {
            throw new ApiError(404, "Invalid Access Token");
        }
        req.admin = admin;
        next()
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        } else if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired");
        } else if (err instanceof ApiError) {
            throw err;
        } else {
            throw new ApiError(401, "Authentication failed");
        }
    }
})

export const verifyUserOrAdmin = asyncHandler(async (req, res, next) => {
    try {
        // Prioritize Authorization header over cookies
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;
        
        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }
        
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        // Try to find user first
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        
        if (user) {
            req.user = user;
            return next();
        }
        
        // If no user found, try admin
        const admin = await Admin.findById(decodeToken?._id).select("-password -refreshToken")
        
        if (admin) {
            req.admin = admin;
            return next();
        }
        
        // If neither user nor admin found
        throw new ApiError(404, "Invalid Access Token");
        
    } catch (err) {
        console.error('Auth error:', err);
        if (err.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        } else if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired");
        } else if (err instanceof ApiError) {
            throw err;
        } else {
            throw new ApiError(401, "Authentication failed");
        }
    }
});
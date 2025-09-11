import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import Admin from "../models/admin.model.js"


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized Request")
        }
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        console.log('user:', user);

        if (!user) {
            throw new ApiError(404, "Invalid Access Token");
        }
        req.user = user;
        next()
    } catch (err) {
        throw new ApiError(401, "AuthMiddleware error", err);
        // return res.redirect('/login?error=Authentication%20required');
    }

})
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

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
        throw new ApiError(401, "AuthMiddleware error", err);
    }
})
export const verifyUserOrAdmin = (req, res, next) => {
    verifyJWT(req, res, (err) => {
        if (!err) {
            return next();
        }

        verifyAdminJWT(req, res, (adminErr) => {
            if (!adminErr) {
                return next();
            }
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        });
    });
};

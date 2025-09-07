import express from 'express';
import { changeUserPassword, forgotPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, resetPassword, updateUserAvatar,  updateUserDetails, verifyOTP } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import User from '../models/user.models.js';

const router = express.Router();

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeUserPassword)

router.route("/forgot-password").post(forgotPassword)

router.route("/verify-otp").post(verifyOTP);

router.route("/reset-password").post(resetPassword);

router.route("/user").get(verifyJWT, getCurrentUser)

router.route("/update-user").patch(verifyJWT, updateUserDetails)

router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;
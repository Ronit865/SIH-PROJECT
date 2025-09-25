import express from 'express';
import { changeUserPassword,  getAllUser,  getCurrentUser,  updateUserAvatar,  updateUserDetails} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';

const router = express.Router();

// router.route("/login").post(loginUser)

// router.route("/logout").post(verifyJWT, logoutUser)

router.route("/user").get(verifyJWT, getAllUser)

router.route("/change-password").post(verifyJWT, changeUserPassword)

router.route("/user").get(verifyJWT, getCurrentUser)

router.route("/update-user").patch(verifyJWT, updateUserDetails)

router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;
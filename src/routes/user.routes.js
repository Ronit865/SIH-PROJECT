import express from 'express';
import { changeUserPassword,  getAllUser,  getCurrentUser,  getUserById,  updateUserAvatar,  updateUserDetails} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT, verifyUserOrAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// router.route("/login").post(loginUser)

// router.route("/logout").post(verifyJWT, logoutUser)

router.route("/alluser").get(getAllUser)

router.route("/change-password").post(verifyJWT, changeUserPassword)

router.route("/user").get(verifyUserOrAdmin, getCurrentUser)

router.route("/:userId").get( getUserById)

router.route("/update-user").patch(verifyJWT, updateUserDetails)

router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;
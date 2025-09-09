import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';

import { addStudentCsv, changeAdminPassword, editUserDetails, forgotPassword, loginAdmin, logoutAdmin, resetPassword, updateAdminAvatar, verifyOTP } from '../controllers/admin.controller.js';

const router = express.Router();

router.route("/Adminlogin").post(loginAdmin)

router.route("/Adminlogout").post(verifyAdminJWT, logoutAdmin)

router.route("/addcsv").post(verifyAdminJWT, upload.single("csv"), addStudentCsv)

router.route("/editdetails/:_id").patch(verifyAdminJWT, editUserDetails)

router.route("/change-password").post(verifyAdminJWT, changeAdminPassword)

router.route("/forgot-password").post(forgotPassword)

router.route("/verify-otp").post(verifyOTP);

router.route("/reset-password").post(resetPassword);

router.route("/update-avatar").patch(verifyAdminJWT, upload.single("avatar"), updateAdminAvatar)

export default router;
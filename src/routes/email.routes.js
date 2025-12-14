import express from 'express';
import { sendBulkEmails, getEmailHistory } from '../controllers/email.controller.js';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/sendEmail").post(verifyAdminJWT, sendBulkEmails);
router.route("/history").get(verifyAdminJWT, getEmailHistory);

export default router;
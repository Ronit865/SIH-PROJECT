import express from 'express';
import { sendBulkEmails } from '../controllers/email.controller.js';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/sendEmail").post(verifyAdminJWT, sendBulkEmails);

export default router;
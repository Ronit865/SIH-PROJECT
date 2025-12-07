import express from 'express';
import { sendBulkEmails } from '../controllers/email.controller.js';

const router = express.Router();

router.route("/sendEmail").post(sendBulkEmails);

export default router;
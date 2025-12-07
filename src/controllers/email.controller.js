import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Email from "../models/email.model.js";
import { sendEmail as sendEmailService, sendBulkEmail, sendTemplateEmail } from "../services/emailServices.js";

const sendBulkEmails = asyncHandler(async (req, res) => {
    const { subject, body, filter } = req.body;

    if (!subject || !body) {
        throw new ApiError(400, "Subject and body are required");
    }

    // Validate filter
    const validFilters = ['student', 'alumni', 'donor', 'all'];
    if (filter && !validFilters.includes(filter)) {
        throw new ApiError(400, "Invalid filter. Must be: student, alumni, donor, or all");
    }

    // Send bulk emails
    const result = await sendBulkEmail(subject, body, filter || 'all');

    if (!result.success) {
        throw new ApiError(500, result.error || "Failed to send bulk emails");
    }

    res
        .status(200)
        .json(new ApiResponse(
            true, 
            `Bulk emails sent. Success: ${result.totalSent}, Failed: ${result.totalFailed}`, 
            result
        ));
});

export { 
    sendBulkEmails
};
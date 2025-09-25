import express from 'express';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';
import { addCampaign, deleteCampaign, editCampaign, getCampaigns } from '../controllers/donation.controller.js';

const router = express.Router();

router.route("/addDonation").post(verifyAdminJWT, addCampaign)

router.route("/editDonation/:id").patch(verifyAdminJWT, editCampaign)

router.route("/deleteDonation/:id").delete(verifyAdminJWT, deleteCampaign)

router.route("/getDonations").get(getCampaigns)

export default router;
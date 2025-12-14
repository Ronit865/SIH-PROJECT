import express from 'express';
import { verifyAdminJWT, verifyJWT } from '../middlewares/auth.middleware.js';
import { addCampaign, deleteCampaign, donationAmount, editCampaign, getCampaignDonors, getCampaigns, getRecentDonors, getDonationStats } from '../controllers/donation.controller.js';

const router = express.Router();

router.route("/addDonation").post(verifyAdminJWT, addCampaign)

router.route("/editDonation/:id").patch(verifyAdminJWT, editCampaign)

router.route("/donate/:id").post(donationAmount);

router.route("/deleteDonation/:id").delete(verifyAdminJWT, deleteCampaign)

router.route("/getDonations").get(getCampaigns)

router.route("/donationAmount/:id").post(verifyJWT,donationAmount);

router.route("/getDonors/:id").get(getCampaignDonors);

router.route("/getRecentDonors").get(getRecentDonors);

router.route("/getDonationStats").get(getDonationStats);

export default router;
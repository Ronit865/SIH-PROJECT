import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from "../utils/ApiResponse.js";
import Donation from "../models/donation.model.js";

const addCampaign = asyncHandler(async (req, res) => {
    const { name, description, goal, endDate, category } = req.body;

    const newCampaign = new Donation({
        name,
        description,
        goal,
        endDate,
        category
    });

    await newCampaign.save();
    res
    .status(201)
    .json(new ApiResponse(201, newCampaign, "Donation created successfully"));
});

const editCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, goal, endDate, category } = req.body;

    const updatedCampaign = await Donation.findByIdAndUpdate(id, {
        name,
        description,
        goal,
        endDate,
        category
    }, { new: true });

    if (!updatedCampaign) {
        throw new ApiError(404, "Donation not found");
    }

    res
    .status(200)
    .json(new ApiResponse(200, updatedCampaign, "Donation updated successfully"));
});

const deleteCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCampaign = await Donation.findByIdAndDelete(id);
    if (!deletedCampaign) {
        throw new ApiError(404, "Donation not found");
    }

    res
    .status(200)
    .json(new ApiResponse(200, deletedCampaign, "Donation deleted successfully"));
});

const donationAmount = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;
    const { amount } = req.body;
    
    // Validate inputs
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }
    
    if (!amount || amount <= 0) {
        throw new ApiError(400, "Please provide a valid donation amount");
    }
    
    const campaign = await Donation.findById(id);
    if (!campaign) {
        throw new ApiError(404, "Donation campaign not found");
    }

    // Convert to numbers for proper comparison
    const numAmount = Number(amount);
    const currentRaised = Number(campaign.raisedAmount) || 0;
    const campaignGoal = Number(campaign.goal);

    if (currentRaised + numAmount > campaignGoal) {
        throw new ApiError(400, "Donation exceeds goal amount");
    }

    // Update raised amount
    campaign.raisedAmount = currentRaised + numAmount;

    // Ensure donors array exists and is clean
    if (!Array.isArray(campaign.donors)) {
        campaign.donors = [];
    }

    // Filter out any invalid donors
    campaign.donors = campaign.donors.filter(d => d.userId && d.amount);

    // Find existing donor or add new one
    const existingDonorIndex = campaign.donors.findIndex(
        d => d.userId.toString() === userId.toString()
    );
    
    if (existingDonorIndex !== -1) {
        campaign.donors[existingDonorIndex].amount = Number(campaign.donors[existingDonorIndex].amount) + numAmount;
    } else {
        campaign.donors.push({ 
            userId: userId.toString(),
            name: req.user?.name || 'Anonymous',
            email: req.user?.email || 'anonymous@example.com',
            amount: numAmount
        });
    }

    await campaign.save();
    res
    .status(200)
    .json(new ApiResponse(200, campaign, "Donation amount updated successfully"));
});

const getCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Donation.find();
    res
    .status(200)
    .json(new ApiResponse(200, campaigns, "Donations retrieved successfully"));
});

const getCampaignDonors = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await Donation.findById(id).populate('donors.userId', 'name email');
     
    if (!campaign) {
        throw new ApiError(404, "Donation campaign not found");
    }

    // Transform the donors array to flatten the structure
    const formattedDonors = campaign.donors.map(donor => ({
        _id: donor._id,
        userId: donor.userId._id,
        name: donor.userId.name,
        email: donor.userId.email,
        amount: donor.amount,
        donatedAt: donor.donatedAt
    }));

    res
    .status(200)
    .json(new ApiResponse(200, formattedDonors, "Donors retrieved successfully"));
});

const getRecentDonors = asyncHandler(async (req, res) => {
    // Get all campaigns with donors
    const campaigns = await Donation.find().populate('donors.userId', 'name email graduationYear');
    
    // Collect all donors from all campaigns
    const allDonors = [];
    campaigns.forEach(campaign => {
        if (campaign.donors && campaign.donors.length > 0) {
            campaign.donors.forEach(donor => {
                allDonors.push({
                    _id: donor._id,
                    name: donor.userId?.name || 'Anonymous',
                    email: donor.userId?.email || 'donor@anonymous.com',
                    graduationYear: donor.userId?.graduationYear,
                    campaign: campaign.name,
                    amount: donor.amount,
                    donatedAt: donor.donatedAt,
                    status: 'completed' // You can make this dynamic based on payment status if needed
                });
            });
        }
    });

    // Sort by donation date (most recent first)
    allDonors.sort((a, b) => new Date(b.donatedAt) - new Date(a.donatedAt));

    res
    .status(200)
    .json(new ApiResponse(200, allDonors, "Recent donors retrieved successfully"));
});

const getDonationStats = asyncHandler(async (req, res) => {
    // Get all campaigns
    const campaigns = await Donation.find();
    
    // Calculate total raised across all campaigns
    const totalRaised = campaigns.reduce((sum, campaign) => {
        return sum + (Number(campaign.raisedAmount) || 0);
    }, 0);
    
    // Calculate total goal across all campaigns
    const totalGoal = campaigns.reduce((sum, campaign) => {
        return sum + (Number(campaign.goal) || 0);
    }, 0);
    
    // Get unique donors across all campaigns
    const uniqueDonorIds = new Set();
    let totalDonations = 0;
    
    campaigns.forEach(campaign => {
        if (campaign.donors && Array.isArray(campaign.donors)) {
            campaign.donors.forEach(donor => {
                if (donor.userId) {
                    uniqueDonorIds.add(donor.userId.toString());
                    totalDonations += 1;
                }
            });
        }
    });
    
    const activeDonors = uniqueDonorIds.size;
    
    // Calculate average donation
    const avgDonation = activeDonors > 0 ? totalRaised / activeDonors : 0;
    
    // Calculate campaign goal percentage
    const campaignGoalPercentage = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0;
    
    const stats = {
        totalRaised,
        activeDonors,
        avgDonation,
        campaignGoalPercentage,
        totalGoal,
        totalCampaigns: campaigns.length
    };
    
    res
    .status(200)
    .json(new ApiResponse(200, stats, "Donation statistics retrieved successfully"));
});

export {
    addCampaign,
    editCampaign,
    getCampaigns,
    deleteCampaign,
    donationAmount,
    getCampaignDonors,
    getRecentDonors,
    getDonationStats
};
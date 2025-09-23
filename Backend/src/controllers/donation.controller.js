import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from "../utils/ApiResponse.js";
import Donation from "../models/donation.model.js";

const addCampaign = asyncHandler(async (req, res) => {
    const { name, description, goal } = req.body;

    const newCampaign = new Donation({
        name,
        description,
        goal,
    });

    await newCampaign.save();
    res.status(201).json(new ApiResponse(201, newCampaign, "Donation created successfully"));
});

const editCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, goal } = req.body;

    const updatedCampaign = await Donation.findByIdAndUpdate(id, {
        name,
        description,
        goal,
    }, { new: true });

    if (!updatedCampaign) {
        throw new ApiError(404, "Donation not found");
    }

    res.status(200).json(new ApiResponse(200, updatedCampaign, "Donation updated successfully"));
});

const deleteCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedCampaign = await Donation.findByIdAndDelete(id);
    if (!deletedCampaign) {
        throw new ApiError(404, "Donation not found");
    }

    res.status(200).json(new ApiResponse(200, deletedCampaign, "Donation deleted successfully"));
});

const getCampaigns = asyncHandler(async (req, res) => {
    const campaigns = await Donation.find();
    res.status(200).json(new ApiResponse(200, campaigns, "Donations retrieved successfully"));
});

export {
    addCampaign,
    editCampaign,
    getCampaigns,
    deleteCampaign
};
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from '../utils/ApiError.js';
import ApiResponse from "../utils/ApiResponse.js";
import Event from "../models/event.model.js";
import jwt from 'jsonwebtoken';
import Admin from "../models/admin.model.js";

const addEvent = asyncHandler(async (req, res) => {
    const admin = req.admin;
    if (admin.role !== 'admin') {
        throw new ApiError(403, "Forbidden: Only admin can add events");
    }
    const { title, description, date } = req.body;

    try {
        const event = await Event.create({
            title,
            description,
            date
        });
        res.status(201).json(new ApiResponse(201, event, "Event created successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to create event");
    }
});

const getEvents = asyncHandler(async (req, res) => {
  
    try {
        const events = await Event.find();
        res.status(200).json(new ApiResponse(200, events, "Events retrieved successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to retrieve events");
    }
});

const updateEvent = asyncHandler(async (req, res) => {
    const admin = req.admin;
    if (admin.role !== 'admin') {
        throw new ApiError(403, "Forbidden: Only admin can update events");
    }

    const { _id } = req.params;
    const { title, description, date, isactive } = req.body;
    try {
        const event = await Event.findByIdAndUpdate(_id, {
            title,
            description,
            date,
            isactive
        }, { new: true });
        res.status(200).json(new ApiResponse(200, event, "Event updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to update event");
    }
});

const deleteEvent = asyncHandler(async (req, res) => {
    const admin = req.admin;
    if (admin.role !== 'admin') {
        throw new ApiError(403, "Forbidden: Only admin can delete events");
    }
    const { _id } = req.params;
    try {
        await Event.findByIdAndDelete(_id);
        res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to delete event");
    }
});

const userEventJoin = asyncHandler(async (req, res) => {

    const user = req.user;

    if (!user) {
        throw new ApiError(401, "Unauthorized: Please log in");
    }

    const { eventID } = req.params;

    if (!eventID) {
        throw new ApiError(400, "Event ID is required");
    }

    try {
        const event = await Event.findById(_id);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        if (!event.isactive) {
            throw new ApiError(400, "Event is not active");
        }

        if (event.participants.includes(user._id)) {
            throw new ApiError(400, "User already joined the event");
        }

        event.participants.push(user._id);

        await event.save();
        res.status(200).json(new ApiResponse(200, event, "User joined the event successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to join event");
    }
});

const userEventLeave = asyncHandler(async (req, res) => {

    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized: Please log in");
    }
    const {eventID } = req.params;
    if (!eventID) {
        throw new ApiError(400, "Event ID is required");
    }
    try {
        const event = await Event.findById(_id);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }
        if (!event.participants.includes(user._id)) {
            throw new ApiError(400, "User has not joined the event");
        }
        event.participants = event.participants.filter(participantId => participantId.toString() !== user._id.toString());
        await event.save();
        res.status(200).json(new ApiResponse(200, event, "User left the event successfully"));

    } catch (error) {
        throw new ApiError(500, "Failed to leave event");
    }
});

export {
    addEvent,
    getEvents,
    updateEvent,
    deleteEvent,
    userEventJoin,
    userEventLeave
};
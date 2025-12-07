import express from 'express';
import { verifyAdminJWT, verifyJWT } from '../middlewares/auth.middleware.js';
import { addEvent, deleteEvent, eventParticipants, getEvents, updateEvent, userEventJoin, userEventLeave } from '../controllers/event.controller.js';

const router = express.Router();

router.route("/addEvent").post(verifyAdminJWT, addEvent)

router.route("/editEvent/:id").patch(verifyAdminJWT, updateEvent)

router.route("/deleteEvent/:_id").delete(verifyAdminJWT, deleteEvent)

router.route("/getEvents").get(getEvents)

router.route("/getEventParticipants/:eventID").get(eventParticipants)

router.route("/addUserToEvent/:eventID").post(verifyJWT, userEventJoin)

router.route("/removeUserFromEvent/:eventID").post(verifyJWT, userEventLeave)

export default router;
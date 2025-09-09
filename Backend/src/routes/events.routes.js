import express from 'express';
import { verifyAdminJWT } from '../middlewares/auth.middleware.js';
import { addEvent, deleteEvent, getEvents, updateEvent, userEventJoin } from '../controllers/event.controller.js';
import { get } from 'mongoose';


const router = express.Router();

router.route("/addEvent").post(verifyAdminJWT, addEvent)

router.route("/editEvent/:id").patch(verifyAdminJWT, updateEvent)

router.route("/deleteEvent/:_id").delete(verifyAdminJWT, deleteEvent)

router.route("/getEvents").get(getEvents)

router.route("/addUserToEvent/:eventId").post(verifyAdminJWT, userEventJoin)

router.route("/removeUserFromEvent/:eventId").post(verifyAdminJWT, userEventJoin)


export default router;
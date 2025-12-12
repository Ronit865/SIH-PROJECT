import { Router } from "express";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionStatus,
  getConnections,
  getPendingRequests,
  removeConnection
} from "../controllers/connection.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.post("/request", sendConnectionRequest);
router.get("/status/:userId", getConnectionStatus);
router.get("/", getConnections);
router.get("/pending", getPendingRequests);
router.patch("/:connectionId/accept", acceptConnectionRequest);
router.patch("/:connectionId/reject", rejectConnectionRequest);
router.delete("/:connectionId", removeConnection);

export default router;

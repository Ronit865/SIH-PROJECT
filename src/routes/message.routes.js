import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
  getUnreadCount
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

// Conversation routes
router.post("/conversation", getOrCreateConversation);
router.get("/conversations", getUserConversations);

// Message routes
router.post("/send", sendMessage);
router.get("/conversation/:conversationId", getConversationMessages);
router.patch("/conversation/:conversationId/read", markMessagesAsRead);
router.get("/unread-count", getUnreadCount);

export default router;

import express from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage
} from "../controllers/message.controller.js";
import { verifyUserOrAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication (user or admin)
router.use(verifyUserOrAdmin);

// Conversation routes
router.post("/conversation", getOrCreateConversation);
router.get("/conversations", getUserConversations);

// Message routes
router.post("/send", sendMessage);
router.get("/conversation/:conversationId", getConversationMessages);
router.patch("/conversation/:conversationId/read", markMessagesAsRead);
router.get("/unread-count", getUnreadCount);
router.delete("/:messageId", deleteMessage);

export default router;

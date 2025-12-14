import { Router } from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  getUnreadCount
} from "../controllers/notification.controller.js";
import { verifyUserOrAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication (user or admin)
router.use(verifyUserOrAdmin);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:notificationId/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

export default router;

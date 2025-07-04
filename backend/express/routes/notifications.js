const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const notificationsController = require("../controllers/notificationsController");
const router = express.Router();

// Endpoint to generate daily notifications (no authentication needed, for cron job)
router.post("/generate", notificationsController.generateNotifications);

// GET endpoint to retrieve user's notifications
router.get("/", authenticateUser, notificationsController.getUserNotifications);

// PUT endpoint to mark a notification as read
router.put(
  "/:notificationId/read",
  authenticateUser,
  notificationsController.markNotificationAsRead
);

// API endpoint to update user notification preferences
router.put(
  "/preferences",
  authenticateUser,
  notificationsController.updateNotificationPreferences
);

// API endpoint to get user notification preferences
router.get(
  "/preferences",
  authenticateUser,
  notificationsController.getNotificationPreferences
);

module.exports = router;

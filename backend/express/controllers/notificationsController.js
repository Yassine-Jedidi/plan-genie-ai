const notificationsService = require("../services/notificationsService");

class NotificationsController {
  async generateNotifications(req, res) {
    // Check for CRON_SECRET for cron job authentication
    if (
      process.env.CRON_SECRET &&
      req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      console.warn(
        "Unauthorized attempt to access /notifications/generate-daily (invalid CRON_SECRET)"
      );
      return res.status(401).end("Unauthorized");
    }

    console.log("Cron job route hit: /notifications/generate-daily");
    console.log("Incoming Request Headers:", req.headers);

    try {
      const result = await notificationsService.generateNotifications();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error generating daily notifications:", error);
      res.status(500).json({
        error: "Failed to generate daily notifications: " + error.message,
      });
    }
  }

  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await notificationsService.getUserNotifications(
        userId
      );

      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch notifications: " + error.message });
    }
  }

  async markNotificationAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const updatedNotification =
        await notificationsService.markNotificationAsRead(
          userId,
          notificationId
        );

      return res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res
        .status(500)
        .json({
          error: "Failed to mark notification as read: " + error.message,
        });
    }
  }

  async updateNotificationPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = req.body;

      const updatedUser =
        await notificationsService.updateNotificationPreferences(
          userId,
          preferences
        );

      res.json({
        message: "Notification preferences updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Failed to update notification preferences:", error);
      res
        .status(500)
        .json({ error: "Failed to update notification preferences" });
    }
  }

  async getNotificationPreferences(req, res) {
    try {
      const userId = req.user.id;
      const preferences = await notificationsService.getNotificationPreferences(
        userId
      );

      res.json(preferences);
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
      if (error.message === "User not found") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch notification preferences" });
    }
  }
}

module.exports = new NotificationsController();

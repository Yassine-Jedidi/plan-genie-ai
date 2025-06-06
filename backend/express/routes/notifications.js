const express = require("express");
const prisma = require("../config/prisma");
const { authenticateUser } = require("../middleware/auth");
const router = express.Router();

// Helper function to get tomorrow's date range
const getTomorrowDateRange = () => {
  const now = new Date();
  const tomorrowStart = new Date(now);
  tomorrowStart.setDate(now.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);

  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowStart.getDate() + 1);

  return { tomorrowStart, tomorrowEnd };
};

// Endpoint to generate daily notifications (no authentication needed, for cron job)
router.post("/generate-daily", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { tomorrowStart, tomorrowEnd } = getTomorrowDateRange();
    let notificationsCreatedCount = 0;

    // Get all users to generate notifications for each
    const users = await prisma.user.findMany({
      select: { id: true, email: true },
    });

    for (const user of users) {
      // Fetch tasks due tomorrow for this user
      const tasksDueTomorrow = await prisma.task.findMany({
        where: {
          user_id: user.id,
          deadline: {
            gte: tomorrowStart,
            lt: tomorrowEnd,
          },
          NOT: {
            status: "Done", // Exclude tasks that are in 'Done' status
          },
        },
      });

      for (const task of tasksDueTomorrow) {
        // Check if a notification for this task already exists for tomorrow
        const existingNotification = await prisma.notification.findFirst({
          where: {
            user_id: user.id,
            task_id: task.id,
            type: "task_due",
            scheduled_for: {
              gte: tomorrowStart,
              lt: tomorrowEnd,
            },
          },
        });

        if (!existingNotification) {
          const notificationTitle = `Task Reminder: ${task.title}`;
          const taskTime = task.deadline
            ? new Date(task.deadline).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "tomorrow";
          const notificationMessage = `Your task "${task.title}" is due tomorrow at ${taskTime}.`;

          await prisma.notification.create({
            data: {
              title: notificationTitle,
              message: notificationMessage,
              type: "task_due",
              user_id: user.id,
              task_id: task.id,
              scheduled_for: tomorrowStart, // Schedule for tomorrow's start
            },
          });
          notificationsCreatedCount++;
        }
      }

      // Fetch events happening tomorrow for this user
      const eventsTomorrow = await prisma.event.findMany({
        where: {
          user_id: user.id,
          date_time: {
            gte: tomorrowStart,
            lt: tomorrowEnd,
          },
        },
      });

      for (const event of eventsTomorrow) {
        // Check if a notification for this event already exists for tomorrow
        const existingNotification = await prisma.notification.findFirst({
          where: {
            user_id: user.id,
            event_id: event.id,
            type: "event_soon",
            scheduled_for: {
              gte: tomorrowStart,
              lt: tomorrowEnd,
            },
          },
        });

        if (!existingNotification) {
          const notificationTitle = `Event Reminder: ${event.title}`;
          const eventTime = event.date_time
            ? new Date(event.date_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "tomorrow";
          const notificationMessage = `Your event "${event.title}" is scheduled for tomorrow at ${eventTime}.`;

          await prisma.notification.create({
            data: {
              title: notificationTitle,
              message: notificationMessage,
              type: "event_soon",
              user_id: user.id,
              event_id: event.id,
              scheduled_for: tomorrowStart, // Schedule for tomorrow's start
            },
          });
          notificationsCreatedCount++;
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, notificationsCreated: notificationsCreatedCount });
  } catch (error) {
    console.error("Error generating daily notifications:", error);
    res.status(500).json({
      error: "Failed to generate daily notifications: " + error.message,
    });
  }
});

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET endpoint to retrieve user's notifications
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        task: true, // Include related task if available
        event: true, // Include related event if available
      },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch notifications: " + error.message });
  }
});

// PUT endpoint to mark a notification as read
router.put("/:notificationId/read", async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required" });
    }

    // Verify that the notification belongs to the authenticated user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.user_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized: This notification doesn't belong to you",
      });
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ error: "Failed to mark notification as read: " + error.message });
  }
});

module.exports = router;

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

const getSixHoursFromNow = () => {
  const now = new Date();
  const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
  return { start: now, end: sixHoursLater };
};

const getOneHourFromNow = () => {
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  return { start: now, end: oneHourLater };
};

const getFifteenMinutesFromNow = () => {
  const now = new Date();
  const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
  return { start: now, end: fifteenMinutesLater };
};

// Endpoint to generate daily notifications (no authentication needed, for cron job)
router.post("/generate", async (req, res) => {
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
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { tomorrowStart, tomorrowEnd } = getTomorrowDateRange();
    let notificationsCreatedCount = 0;

    // Get all users to generate notifications for each
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        receive_task_notifications: true,
        receive_event_notifications: true,
      },
    });

    const generateNotifications = async (
      userId,
      items,
      itemType,
      notificationType
    ) => {
      let createdCount = 0;
      for (const item of items) {
        const existingNotification = await prisma.notification.findFirst({
          where: {
            user_id: userId,
            [`${itemType}_id`]: item.id,
            type: notificationType,
          },
        });

        if (!existingNotification) {
          const notificationTitle = item.title;
          const itemTime =
            item.deadline || item.date_time
              ? new Date(item.deadline || item.date_time)
              : null;

          await prisma.notification.create({
            data: {
              title: notificationTitle,
              time: itemTime,
              type: notificationType,
              user_id: userId,
              [`${itemType}_id`]: item.id,
            },
          });
          createdCount++;
        }
      }
      return createdCount;
    };

    // New helper function to filter and generate notifications
    const filterAndGenerateNotifications = async (
      userId,
      items,
      itemType,
      notificationType,
      excludeTypes = []
    ) => {
      const filteredItems = [];
      for (const item of items) {
        let shouldExclude = false;
        for (const excludeType of excludeTypes) {
          const existing = await prisma.notification.findFirst({
            where: {
              user_id: userId,
              [`${itemType}_id`]: item.id,
              type: excludeType,
            },
          });
          if (existing) {
            shouldExclude = true;
            break;
          }
        }
        if (!shouldExclude) {
          filteredItems.push(item);
        }
      }
      return await generateNotifications(
        userId,
        filteredItems,
        itemType,
        notificationType
      );
    };

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
        // Check if user wants to receive task notifications
        if (!user.receive_task_notifications) {
          continue; // Skip if user has opted out of task notifications
        }

        // Check if a notification for this task already exists for tomorrow
        const existingNotification = await prisma.notification.findFirst({
          where: {
            user_id: user.id,
            task_id: task.id,
            type: "task_due_in_1day",
          },
        });

        if (!existingNotification) {
          const notificationTitle = task.title;
          const taskTime = task.deadline ? new Date(task.deadline) : null;

          await prisma.notification.create({
            data: {
              title: notificationTitle,
              time: taskTime,
              type: "task_due_in_1day",
              user_id: user.id,
              task_id: task.id,
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
        // Check if user wants to receive event notifications
        if (!user.receive_event_notifications) {
          continue; // Skip if user has opted out of event notifications
        }

        // Check if a notification for this event already exists for tomorrow
        const existingNotification = await prisma.notification.findFirst({
          where: {
            user_id: user.id,
            event_id: event.id,
            type: "event_in_1day",
          },
        });

        if (!existingNotification) {
          const notificationTitle = event.title;
          const eventTime = event.date_time ? new Date(event.date_time) : null;

          await prisma.notification.create({
            data: {
              title: notificationTitle,
              time: eventTime,
              type: "event_in_1day",
              user_id: user.id,
              event_id: event.id,
            },
          });
          notificationsCreatedCount++;
        }
      }

      // --- New notification logic for 6 hours, 1 hour, 15 minutes ---
      const { start: sixHoursStart, end: sixHoursEnd } = getSixHoursFromNow();
      const { start: oneHourStart, end: oneHourEnd } = getOneHourFromNow();
      const { start: fifteenMinutesStart, end: fifteenMinutesEnd } =
        getFifteenMinutesFromNow();

      // Tasks due in the next 15 minutes
      const tasksDueInFifteenMinutes = await prisma.task.findMany({
        where: {
          user_id: user.id,
          deadline: {
            gte: fifteenMinutesStart,
            lt: fifteenMinutesEnd,
          },
          NOT: { status: "Done" },
        },
      });
      // Only generate if user wants task notifications
      if (user.receive_task_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          tasksDueInFifteenMinutes,
          "task",
          "task_due_in_15m"
        );
      }

      // Events in the next 15 minutes
      const eventsInFifteenMinutes = await prisma.event.findMany({
        where: {
          user_id: user.id,
          date_time: {
            gte: fifteenMinutesStart,
            lt: fifteenMinutesEnd,
          },
        },
      });
      // Only generate if user wants event notifications
      if (user.receive_event_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          eventsInFifteenMinutes,
          "event",
          "event_in_15m"
        );
      }

      // Tasks due in the next 1 hour
      const tasksDueInOneHour = await prisma.task.findMany({
        where: {
          user_id: user.id,
          deadline: {
            gte: oneHourStart,
            lt: oneHourEnd,
          },
          NOT: { status: "Done" },
        },
      });
      // Only generate if user wants task notifications
      if (user.receive_task_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          tasksDueInOneHour,
          "task",
          "task_due_in_1h",
          ["task_due_in_15m"] // Exclude if 15m notification already exists
        );
      }

      // Events in the next 1 hour
      const eventsInOneHour = await prisma.event.findMany({
        where: {
          user_id: user.id,
          date_time: {
            gte: oneHourStart,
            lt: oneHourEnd,
          },
        },
      });
      // Only generate if user wants event notifications
      if (user.receive_event_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          eventsInOneHour,
          "event",
          "event_in_1h",
          ["event_in_15m"] // Exclude if 15m notification already exists
        );
      }

      // Tasks due in the next 6 hours
      const tasksDueInSixHours = await prisma.task.findMany({
        where: {
          user_id: user.id,
          deadline: {
            gte: sixHoursStart,
            lt: sixHoursEnd,
          },
          NOT: { status: "Done" },
        },
      });
      // Only generate if user wants task notifications
      if (user.receive_task_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          tasksDueInSixHours,
          "task",
          "task_due_in_6h",
          ["task_due_in_15m", "task_due_in_1h"] // Exclude if 15m or 1h notification exists
        );
      }

      // Events in the next 6 hours
      const eventsInSixHours = await prisma.event.findMany({
        where: {
          user_id: user.id,
          date_time: {
            gte: sixHoursStart,
            lt: sixHoursEnd,
          },
        },
      });
      // Only generate if user wants event notifications
      if (user.receive_event_notifications) {
        notificationsCreatedCount += await filterAndGenerateNotifications(
          user.id,
          eventsInSixHours,
          "event",
          "event_in_6h",
          ["event_in_15m", "event_in_1h"] // Exclude if 15m or 1h notification exists
        );
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

// GET endpoint to retrieve user's notifications
router.get("/", authenticateUser, async (req, res) => {
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
router.put("/:notificationId/read", authenticateUser, async (req, res) => {
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

// API endpoint to update user notification preferences
router.put("/preferences", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { receive_task_notifications, receive_event_notifications } =
      req.body;

    const updateData = {};
    if (typeof receive_task_notifications === "boolean") {
      updateData.receive_task_notifications = receive_task_notifications;
    }
    if (typeof receive_event_notifications === "boolean") {
      updateData.receive_event_notifications = receive_event_notifications;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ error: "No notification preferences provided for update." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

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
});

// API endpoint to get user notification preferences
router.get("/preferences", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        receive_task_notifications: true,
        receive_event_notifications: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Failed to fetch notification preferences:", error);
    res.status(500).json({ error: "Failed to fetch notification preferences" });
  }
});

module.exports = router;

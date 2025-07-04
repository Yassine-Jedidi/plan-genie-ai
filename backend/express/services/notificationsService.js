const prisma = require("../config/prisma");

class NotificationsService {
  // Helper function to get tomorrow's date range
  getTomorrowDateRange() {
    const now = new Date();
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(now.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowStart.getDate() + 1);

    return { tomorrowStart, tomorrowEnd };
  }

  getSixHoursFromNow() {
    const now = new Date();
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    return { start: now, end: sixHoursLater };
  }

  getOneHourFromNow() {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    return { start: now, end: oneHourLater };
  }

  getFifteenMinutesFromNow() {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);
    return { start: now, end: fifteenMinutesLater };
  }

  async generateNotifications() {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    const { tomorrowStart, tomorrowEnd } = this.getTomorrowDateRange();
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
      const { start: sixHoursStart, end: sixHoursEnd } =
        this.getSixHoursFromNow();
      const { start: oneHourStart, end: oneHourEnd } = this.getOneHourFromNow();
      const { start: fifteenMinutesStart, end: fifteenMinutesEnd } =
        this.getFifteenMinutesFromNow();

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

    return { success: true, notificationsCreated: notificationsCreatedCount };
  }

  async getUserNotifications(userId) {
    if (!userId) {
      throw new Error("User ID is required");
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

    return notifications;
  }

  async markNotificationAsRead(userId, notificationId) {
    if (!notificationId) {
      throw new Error("Notification ID is required");
    }

    // Verify that the notification belongs to the authenticated user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.user_id !== userId) {
      throw new Error("Unauthorized: This notification doesn't belong to you");
    }

    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return updatedNotification;
  }

  async updateNotificationPreferences(userId, preferences) {
    const { receive_task_notifications, receive_event_notifications } =
      preferences;

    const updateData = {};
    if (typeof receive_task_notifications === "boolean") {
      updateData.receive_task_notifications = receive_task_notifications;
    }
    if (typeof receive_event_notifications === "boolean") {
      updateData.receive_event_notifications = receive_event_notifications;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No notification preferences provided for update.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return updatedUser;
  }

  async getNotificationPreferences(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        receive_task_notifications: true,
        receive_event_notifications: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}

module.exports = new NotificationsService();

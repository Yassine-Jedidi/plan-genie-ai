const prisma = require("../config/prisma");

class BilanService {
  async getTodayBilan(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Get today's date at midnight in UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight UTC
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Find bilan for today or create a new one if it doesn't exist
    let bilan = await prisma.bilan.findFirst({
      where: {
        user_id: userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        entries: {
          include: {
            task: true,
          },
        },
      },
    });

    // If no bilan exists for today, create one
    if (!bilan) {
      bilan = await prisma.bilan.create({
        data: {
          user_id: userId,
          date: today,
        },
        include: {
          entries: true,
        },
      });
    }

    return bilan;
  }

  async getBilanByDate(userId, date) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!date) {
      throw new Error("Date parameter is required");
    }

    // Parse the date and set to midnight UTC
    const requestedDate = new Date(date);
    requestedDate.setUTCHours(0, 0, 0, 0);

    // Get next day at midnight UTC
    const nextDay = new Date(requestedDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    // Find bilan for the requested date
    let bilan = await prisma.bilan.findFirst({
      where: {
        user_id: userId,
        date: {
          gte: requestedDate,
          lt: nextDay,
        },
      },
      include: {
        entries: {
          include: {
            task: true,
          },
        },
      },
    });

    // If no bilan exists and the date is today or in the past, create one
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (!bilan && requestedDate <= today) {
      bilan = await prisma.bilan.create({
        data: {
          user_id: userId,
          date: requestedDate,
        },
        include: {
          entries: true,
        },
      });
    }

    if (!bilan) {
      throw new Error("No bilan found for the specified date");
    }

    return bilan;
  }

  async getRecentBilans(userId, limit = 7) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Find recent bilans
    const bilans = await prisma.bilan.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
      include: {
        entries: {
          include: {
            task: true,
          },
        },
      },
    });

    return bilans;
  }

  async addOrUpdateBilanEntry(userId, bilanId, taskId, minutesSpent, notes) {
    if (!bilanId || !taskId || minutesSpent === undefined) {
      throw new Error("Bilan ID, task ID, and minutes spent are required");
    }

    // Verify that the bilan belongs to the authenticated user
    const bilan = await prisma.bilan.findUnique({
      where: {
        id: bilanId,
      },
    });

    if (!bilan) {
      throw new Error("Bilan not found");
    }

    if (bilan.user_id !== userId) {
      throw new Error("Unauthorized: This bilan doesn't belong to you");
    }

    // Verify that the task belongs to the authenticated user
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.user_id !== userId) {
      throw new Error("Unauthorized: This task doesn't belong to you");
    }

    // Check if an entry already exists for this task in this bilan
    const existingEntry = await prisma.bilanEntry.findFirst({
      where: {
        bilan_id: bilanId,
        task_id: taskId,
      },
    });

    let entry;
    if (existingEntry) {
      // Update existing entry
      entry = await prisma.bilanEntry.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          minutes_spent: minutesSpent,
          notes: notes || existingEntry.notes,
        },
      });
    } else {
      // Create new entry
      entry = await prisma.bilanEntry.create({
        data: {
          bilan_id: bilanId,
          task_id: taskId,
          minutes_spent: minutesSpent,
          notes,
        },
      });
    }

    return entry;
  }

  async deleteBilanEntry(userId, entryId) {
    if (!entryId) {
      throw new Error("Entry ID is required");
    }

    // Get the entry with its related bilan to check ownership
    const entry = await prisma.bilanEntry.findUnique({
      where: {
        id: entryId,
      },
      include: {
        bilan: true,
      },
    });

    if (!entry) {
      throw new Error("Entry not found");
    }

    if (entry.bilan.user_id !== userId) {
      throw new Error("Unauthorized: This entry doesn't belong to you");
    }

    // Delete the entry
    await prisma.bilanEntry.delete({
      where: {
        id: entryId,
      },
    });

    return { message: "Entry deleted successfully" };
  }
}

module.exports = new BilanService();

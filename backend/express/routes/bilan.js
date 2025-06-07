const express = require("express");
const prisma = require("../config/prisma");
const { authenticateUser } = require("../middleware/auth");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET endpoint to retrieve today's bilan
router.get("/today", async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
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

    return res.status(200).json(bilan);
  } catch (error) {
    console.error("Error fetching today's bilan:", error);
    res.status(500).json({ error: "Failed to fetch bilan: " + error.message });
  }
});

// GET endpoint to retrieve bilan for a specific date
router.get("/date/:date", async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
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
      return res
        .status(404)
        .json({ error: "No bilan found for the specified date" });
    }

    return res.status(200).json(bilan);
  } catch (error) {
    console.error("Error fetching bilan by date:", error);
    res.status(500).json({ error: "Failed to fetch bilan: " + error.message });
  }
});

// GET endpoint to retrieve recent bilans
router.get("/recent", async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 7; // Default to 7 days

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
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

    return res.status(200).json(bilans);
  } catch (error) {
    console.error("Error fetching recent bilans:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch recent bilans: " + error.message });
  }
});

// POST endpoint to add/update a bilan entry
router.post("/entry", async (req, res) => {
  try {
    const userId = req.user.id;
    const { bilanId, taskId, minutesSpent, notes } = req.body;

    if (!bilanId || !taskId || minutesSpent === undefined) {
      return res.status(400).json({
        error: "Bilan ID, task ID, and minutes spent are required",
      });
    }

    // Verify that the bilan belongs to the authenticated user
    const bilan = await prisma.bilan.findUnique({
      where: {
        id: bilanId,
      },
    });

    if (!bilan) {
      return res.status(404).json({ error: "Bilan not found" });
    }

    if (bilan.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: This bilan doesn't belong to you" });
    }

    // Verify that the task belongs to the authenticated user
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: This task doesn't belong to you" });
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

    return res.status(200).json(entry);
  } catch (error) {
    console.error("Error updating bilan entry:", error);
    res.status(500).json({ error: "Failed to update entry: " + error.message });
  }
});

// DELETE endpoint to remove a bilan entry
router.delete("/entry/:entryId", async (req, res) => {
  try {
    const { entryId } = req.params;
    const userId = req.user.id;

    if (!entryId) {
      return res.status(400).json({ error: "Entry ID is required" });
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
      return res.status(404).json({ error: "Entry not found" });
    }

    if (entry.bilan.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "Unauthorized: This entry doesn't belong to you" });
    }

    // Delete the entry
    await prisma.bilanEntry.delete({
      where: {
        id: entryId,
      },
    });

    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting bilan entry:", error);
    res.status(500).json({ error: "Failed to delete entry: " + error.message });
  }
});

module.exports = router;

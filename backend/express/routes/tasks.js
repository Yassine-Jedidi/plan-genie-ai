const express = require("express");
const prisma = require("../config/prisma");
const { authenticateUser } = require("../middleware/auth");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Save task
router.post("/save", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { type, entities } = req.body;

    if (!type || !entities) {
      return res.status(400).json({ error: "Missing required data" });
    }

    if (type === "Tâche") {
      // Create task
      const title = entities.TITRE?.[0] || "Untitled Task";
      const deadline = entities.DELAI?.[0] || null;
      const deadline_text = entities.DELAI_TEXT?.[0] || null;
      const priority = entities.PRIORITE?.[0] || null;
      const status = "Planned";

      // Check if user exists in the database
      let dbUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      // If user doesn't exist in database, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: req.user.id,
            email: req.user.email,
          },
        });
      }

      const task = await prisma.task.create({
        data: {
          title,
          deadline,
          deadline_text,
          priority,
          status,
          user_id: req.user.id,
        },
      });

      return res.status(201).json(task);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ error: "Failed to save: " + error.message });
  }
});

// GET endpoint to retrieve user's tasks
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks: " + error.message });
  }
});

// DELETE endpoint to delete a task
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    if (!taskId) {
      return res.status(400).json({ error: "Task ID is required" });
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

    // Delete the task
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task: " + error.message });
  }
});

// PUT endpoint to update a task
router.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const { status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ error: "Task ID and status are required" });
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

    // Update the task
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task: " + error.message });
  }
});

module.exports = router;

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
    console.log("Entities received:", JSON.stringify(entities, null, 2));

    if (!type || !entities) {
      return res.status(400).json({ error: "Missing required data" });
    }

    if (type === "Tâche") {
      // Create task
      const title = entities.TITRE?.[0] || "Untitled Task";
      let deadline = null;
      let deadline_text = null;

      // First, explicitly check for DELAI_TEXT which should contain the original input
      if (entities.DELAI_TEXT && entities.DELAI_TEXT[0]) {
        deadline_text = entities.DELAI_TEXT[0];
        console.log("Using explicit DELAI_TEXT:", deadline_text);
      }
      // If no DELAI_TEXT, check the raw input
      else if (entities.DELAI && entities.DELAI[0]) {
        const rawDelai = entities.DELAI[0];

        // Don't use the raw input if it looks like a timestamp
        if (
          rawDelai.includes("T") &&
          rawDelai.includes("Z") &&
          rawDelai.includes("-")
        ) {
          console.log(
            "Raw DELAI looks like timestamp, not using for text:",
            rawDelai
          );
        } else {
          deadline_text = rawDelai;
          console.log("Using raw DELAI as text:", deadline_text);
        }
      }

      // Now handle the timestamp for deadline
      if (entities.DELAI_PARSED && entities.DELAI_PARSED[0]) {
        try {
          console.log(
            "Using DELAI_PARSED for timestamp:",
            entities.DELAI_PARSED[0]
          );
          deadline = new Date(entities.DELAI_PARSED[0]);

          // Validate the date
          if (isNaN(deadline.getTime())) {
            console.warn(
              "Invalid timestamp in DELAI_PARSED:",
              entities.DELAI_PARSED[0]
            );
            deadline = null;
          } else {
            console.log("Valid parsed deadline:", deadline);
          }
        } catch (e) {
          console.error("Error parsing DELAI_PARSED:", e);
          deadline = null;
        }
      }
      // Try parsing DELAI as a fallback
      else if (entities.DELAI && entities.DELAI[0]) {
        try {
          const rawDelai = entities.DELAI[0];

          // Check if it's JSON
          if (rawDelai.startsWith("{") && rawDelai.endsWith("}")) {
            try {
              const parsed = JSON.parse(rawDelai);

              // Set deadline_text from originalText if available
              if (parsed.originalText && !deadline_text) {
                deadline_text = parsed.originalText;
                console.log("Using originalText from JSON:", deadline_text);
              }

              // Set deadline from parsedDate
              if (parsed.parsedDate) {
                console.log("Using parsedDate from JSON:", parsed.parsedDate);
                deadline = new Date(parsed.parsedDate);

                // Validate
                if (isNaN(deadline.getTime())) {
                  console.warn(
                    "Invalid parsed date in JSON:",
                    parsed.parsedDate
                  );
                  deadline = null;
                }
              }
            } catch (e) {
              console.log("Failed to parse JSON:", e.message);
            }
          }
          // If it looks like a timestamp, try to parse it directly
          else if (rawDelai.includes("T") && rawDelai.includes("Z")) {
            console.log(
              "Raw DELAI looks like a timestamp, parsing directly:",
              rawDelai
            );
            deadline = new Date(rawDelai);

            // Validate
            if (isNaN(deadline.getTime())) {
              console.warn("Invalid timestamp in raw DELAI:", rawDelai);
              deadline = null;
            }
          }
        } catch (e) {
          console.error("Error parsing DELAI:", e);
          deadline = null;
        }
      }

      // If we still don't have deadline_text but have a deadline, set a fallback
      if (!deadline_text && deadline) {
        deadline_text = "Date specified";
        console.log("No deadline_text available, using fallback");
      }

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

      console.log("FINAL: Saving task with deadline:", deadline);
      console.log("FINAL: Saving task with deadline_text:", deadline_text);

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

// Manual task creation endpoint
router.post("/manual", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { title, deadline, priority, status } = req.body;

    // Check if user exists in the database
    let dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // If user doesn't exist in database
    if (!dbUser) res.status(500).json("You are not authenticated!");

    const task = await prisma.task.create({
      data: {
        title,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        status,
        user_id: req.user.id,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error("Error creating manual task:", error);
    res.status(500).json({ error: "Failed to create task: " + error.message });
  }
});

module.exports = router;

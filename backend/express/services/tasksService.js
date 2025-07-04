const prisma = require("../config/prisma");

class TasksService {
  async saveTask(userId, type, entities) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    if (!type || !entities) {
      throw new Error("Missing required data");
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
        where: { id: userId },
      });

      // If user doesn't exist in database, create them
      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: userId, // This might need to be adjusted based on your user structure
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
          user_id: userId,
        },
      });

      return task;
    } else {
      throw new Error("Invalid type");
    }
  }

  async getTasksByUserId(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return tasks;
  }

  async deleteTask(userId, taskId) {
    if (!taskId) {
      throw new Error("Task ID is required");
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

    // Delete the task
    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return { message: "Task deleted successfully" };
  }

  async updateTask(userId, taskId, taskData) {
    const { title, deadline, priority, status, completed_at } = taskData;

    if (!taskId || !title || !deadline || !priority || !status) {
      throw new Error(
        "Task ID, title, deadline, priority, and status are required"
      );
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

    // Update the task
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        status,
        completed_at: status === "Done" ? completed_at : null,
      },
    });

    return updatedTask;
  }

  async createManualTask(userId, taskData) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    const { title, deadline, priority, status } = taskData;

    // Check if user exists in the database
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist in database
    if (!dbUser) {
      throw new Error("You are not authenticated!");
    }

    const task = await prisma.task.create({
      data: {
        title,
        deadline: deadline ? new Date(deadline) : null,
        priority,
        status,
        user_id: userId,
      },
    });

    return task;
  }
}

module.exports = new TasksService();

const tasksService = require("../services/tasksService");

class TasksController {
  async saveTask(req, res) {
    try {
      const { type, entities } = req.body;
      const userId = req.user.id;

      console.log("Entities received:", JSON.stringify(entities, null, 2));

      const task = await tasksService.saveTask(userId, type, entities);

      return res.status(201).json(task);
    } catch (error) {
      console.error("Error saving task:", error);
      res.status(500).json({ error: "Failed to save: " + error.message });
    }
  }

  async getTasksByUserId(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await tasksService.getTasksByUserId(userId);

      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch tasks: " + error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const result = await tasksService.deleteTask(userId, taskId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to delete task: " + error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const taskData = req.body;
      const userId = req.user.id;

      const updatedTask = await tasksService.updateTask(
        userId,
        taskId,
        taskData
      );

      return res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to update task: " + error.message });
    }
  }

  async createManualTask(req, res) {
    try {
      const taskData = req.body;
      const userId = req.user.id;

      const task = await tasksService.createManualTask(userId, taskData);

      return res.status(201).json(task);
    } catch (error) {
      console.error("Error creating manual task:", error);
      res
        .status(500)
        .json({ error: "Failed to create task: " + error.message });
    }
  }
}

module.exports = new TasksController();

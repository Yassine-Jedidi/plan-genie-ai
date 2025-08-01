const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const tasksController = require("../controllers/tasksController");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Save task
router.post("/save", tasksController.saveTask);

// GET endpoint to retrieve user's tasks
router.get("/", tasksController.getTasksByUserId);

// DELETE endpoint to delete a task
router.delete("/:taskId", tasksController.deleteTask);

// PUT endpoint to update a task
router.put("/:taskId", tasksController.updateTask);

// Manual task creation endpoint
router.post("/manual", tasksController.createManualTask);

// Gemini API integration endpoints
router.get("/priorities", tasksController.getTaskPriorities);

module.exports = router;

const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const eventsController = require("../controllers/eventsController");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Save event
router.post("/save", eventsController.saveEvent);

// GET endpoint to retrieve user's events
router.get("/:userId", eventsController.getEventsByUserId);

// Save manual event from calendar
router.post("/manual", eventsController.saveManualEvent);

// Update event
router.put("/:eventId", eventsController.updateEvent);

// Delete event
router.delete("/:eventId", eventsController.deleteEvent);

module.exports = router;

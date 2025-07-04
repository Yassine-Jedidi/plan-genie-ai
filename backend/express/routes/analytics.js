const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const analyticsController = require("../controllers/analyticsController");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET endpoint for overall analytics
router.get("/overall", analyticsController.getOverallAnalytics);

module.exports = router;

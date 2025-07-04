const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const dashboardController = require("../controllers/dashboardController");
const router = express.Router();

router.use(authenticateUser);

router.get("/overall", dashboardController.getOverallDashboard);

module.exports = router;

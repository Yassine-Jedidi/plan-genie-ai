const express = require("express");
const { authenticateUser } = require("../middleware/auth");
const bilanController = require("../controllers/bilanController");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// GET endpoint to retrieve today's bilan
router.get("/today", bilanController.getTodayBilan);

// GET endpoint to retrieve bilan for a specific date
router.get("/date/:date", bilanController.getBilanByDate);

// GET endpoint to retrieve recent bilans
router.get("/recent", bilanController.getRecentBilans);

// POST endpoint to add/update a bilan entry
router.post("/entry", bilanController.addOrUpdateBilanEntry);

// DELETE endpoint to remove a bilan entry
router.delete("/entry/:entryId", bilanController.deleteBilanEntry);

module.exports = router;

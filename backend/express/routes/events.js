const express = require("express");
const prisma = require("../config/prisma");
const { authenticateUser } = require("../middleware/auth");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Save event
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

    if (type === "Événement") {
      // Create event
      const title = entities.TITRE?.[0] || "Untitled Event";
      const date_time = entities.DATE_HEURE?.[0] || new Date().toISOString();

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

      const event = await prisma.event.create({
        data: {
          title,
          date_time,
          user_id: req.user.id,
        },
      });

      return res.status(201).json(event);
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ error: "Failed to save: " + error.message });
  }
});

// GET endpoint to retrieve user's events
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const events = await prisma.event.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        date_time: "asc",
      },
    });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events: " + error.message });
  }
});

module.exports = router;

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
      let date_time = null;
      let date_time_text = null;

      // Handle date and time
      if (entities.DATE_HEURE?.[0]) {
        // The input text should be saved as date_time_text
        date_time_text = entities.DATE_HEURE[0];

        // Check if we have an interpretation (parsedDate)
        if (entities.DATE_HEURE_PARSED?.[0]) {
          try {
            // Convert the parsed date string to a JavaScript Date object
            date_time = new Date(entities.DATE_HEURE_PARSED[0]);

            // Check if the date is valid
            if (isNaN(date_time.getTime())) {
              console.warn(
                "Invalid date parsed:",
                entities.DATE_HEURE_PARSED[0]
              );
              date_time = null;
            }
          } catch (e) {
            console.error("Error parsing date:", e);
            date_time = null;
          }
        } else {
          // Fallback to the previous JSON parsing logic
          try {
            const parsed = JSON.parse(entities.DATE_HEURE[0]);
            if (parsed.originalText && parsed.parsedDate) {
              date_time_text = parsed.originalText;

              try {
                // Convert parsedDate to Date object
                date_time = new Date(parsed.parsedDate);

                // Validate the date
                if (isNaN(date_time.getTime())) {
                  console.warn("Invalid date from JSON:", parsed.parsedDate);
                  date_time = null;
                }
              } catch (e) {
                console.error("Error parsing JSON date:", e);
                date_time = null;
              }
            }
          } catch (e) {
            // Not JSON, already handled date_time_text above
            date_time = null;
          }
        }
      }

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
          date_time_text,
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

// Save manual event from calendar
router.post("/manual", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { title, date_time } = req.body;

    if (!title || !date_time) {
      return res
        .status(400)
        .json({ error: "Title and date_time are required" });
    }

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

    // Parse date_time if it's a string
    const parsedDateTime =
      typeof date_time === "string" ? new Date(date_time) : date_time;

    // Validate date
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const event = await prisma.event.create({
      data: {
        title,
        date_time: parsedDateTime,
        user_id: req.user.id,
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    console.error("Error saving manual event:", error);
    res.status(500).json({ error: "Failed to save: " + error.message });
  }
});

// Update event
router.put("/:eventId", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { eventId } = req.params;
    const { title, date_time } = req.body;

    if (!title || !date_time) {
      return res
        .status(400)
        .json({ error: "Title and date_time are required" });
    }

    // Check if event exists and belongs to the user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        user_id: req.user.id,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Parse date_time if it's a string
    const parsedDateTime =
      typeof date_time === "string" ? new Date(date_time) : date_time;

    // Validate date
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        date_time: parsedDateTime,
      },
    });

    return res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event: " + error.message });
  }
});

// Delete event
router.delete("/:eventId", async (req, res) => {
  try {
    if (!prisma) {
      return res
        .status(500)
        .json({ error: "Database connection not available" });
    }

    const { eventId } = req.params;

    // Check if event exists and belongs to the user
    const existingEvent = await prisma.event.findFirst({
      where: {
        id: eventId,
        user_id: req.user.id,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event: " + error.message });
  }
});

module.exports = router;

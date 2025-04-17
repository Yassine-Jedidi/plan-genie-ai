const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

// Create an instance of PrismaClient
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies["sb-access-token"];
    if (!accessToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Get user from Supabase with the access token
    const { supabase } = require("../config/supabase");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateUser);

// POST endpoint to save tasks and events
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

    if (type === "Tâche") {
      // Create task
      const title = entities.TITRE?.[0] || "Untitled Task";
      const deadline = entities.DELAI?.[0] || null;
      const priority = entities.PRIORITE?.[0] || null;

      const task = await prisma.task.create({
        data: {
          title,
          deadline,
          priority,
          user_id: req.user.id,
        },
      });

      return res.status(201).json(task);
    } else if (type === "Événement") {
      // Create event
      const title = entities.TITRE?.[0] || "Untitled Event";
      const date_time = entities.DATE_HEURE?.[0] || new Date().toISOString();

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
    console.error("Error saving task/event:", error);
    res.status(500).json({ error: "Failed to save: " + error.message });
  }
});

// GET endpoint to retrieve user's tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: req.user.id,
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

// GET endpoint to retrieve user's events
router.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        user_id: req.user.id,
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

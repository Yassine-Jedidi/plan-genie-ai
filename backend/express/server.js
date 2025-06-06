const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { corsMiddleware } = require("./middleware");

dotenv.config();

const app = express();

// Apply middleware
app.use(corsMiddleware());
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes = require("./routes/auth");
const fastApiRoutes = require("./routes/fastapi");
const tasksRoutes = require("./routes/tasks");
const eventsRoutes = require("./routes/events");
const audioRoutes = require("./routes/audio");
const bilanRoutes = require("./routes/bilan");
const notificationsRoutes = require("./routes/notifications");

// Apply routes
app.use("/auth", authRoutes);
app.use("/api", fastApiRoutes);
app.use("/tasks", tasksRoutes);
app.use("/events", eventsRoutes);
app.use("/audio", audioRoutes);
app.use("/bilan", bilanRoutes);
app.use("/notifications", notificationsRoutes);

// Handle OPTIONS preflight
app.options("*", corsMiddleware());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

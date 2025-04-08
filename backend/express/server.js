const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ✅ Import and use auth routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Proxy routes for FastAPI service
const FASTAPI_URL = "https://YassineJedidi-plan-genie-ai.hf.space";

app.post("/api/predict-type", async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/predict-type/`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

app.post("/api/extract-entities", async (req, res) => {
  try {
    const response = await axios.post(
      `${FASTAPI_URL}/extract-entities/`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

app.post("/api/analyze-text", async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/analyze-text/`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

// Handle OPTIONS preflight
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

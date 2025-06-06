const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get the FastAPI URL from environment variables or use the default
const HUGGINGFACE_SPACE = process.env.HUGGINGFACE_SPACE;

// Proxy route for predicting type
router.post("/predict-type", async (req, res) => {
  try {
    const response = await axios.post(
      `${HUGGINGFACE_SPACE}/predict-type/`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

// Proxy route for extracting entities
router.post("/extract-entities", async (req, res) => {
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

// Proxy route for analyzing text
router.post("/analyze-text", async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_URL}/analyze-text/`, req.body);
    res.json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

module.exports = router;

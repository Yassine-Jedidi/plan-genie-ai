const express = require("express");
const fastapiController = require("../controllers/fastapiController");
const router = express.Router();

// Get the FastAPI URL from environment variables or use the default
const HUGGINGFACE_SPACE = process.env.HUGGINGFACE_SPACE;

// Proxy route for predicting type
router.post("/predict-type", fastapiController.predictType);

// Proxy route for extracting entities
router.post("/extract-entities", fastapiController.extractEntities);

// Proxy route for analyzing text
router.post("/analyze-text", fastapiController.analyzeText);

module.exports = router;

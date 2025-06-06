const express = require("express");
const axios = require("axios");
const router = express.Router();
const FormData = require("form-data");
const fileUpload = require("express-fileupload");

// Get the FastAPI URL from environment variables or use the default
const HUGGINGFACE_SPACE = process.env.HUGGINGFACE_SPACE;

// Use express-fileupload middleware
router.use(fileUpload());

// Proxy route for transcribing audio
router.post("/transcribe", async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.files.file.data, {
      filename: req.files.file.name,
      contentType: req.files.file.mimetype,
    });

    const response = await axios.post(
      `${HUGGINGFACE_SPACE}/transcribe/`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Transcription error:", error);
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal server error" });
  }
});

module.exports = router;

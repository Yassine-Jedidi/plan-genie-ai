const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const audioController = require("../controllers/audioController");

// Use express-fileupload middleware
router.use(fileUpload());

// Proxy route for transcribing audio
router.post("/transcribe", audioController.transcribeAudio);

module.exports = router;

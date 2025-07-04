const audioService = require("../services/audioService");

class AudioController {
  async transcribeAudio(req, res) {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const transcription = await audioService.transcribeAudio(req.files.file);
      res.json(transcription);
    } catch (error) {
      console.error("Transcription error:", error);
      res
        .status(error.response?.status || 500)
        .json(error.response?.data || { error: "Internal server error" });
    }
  }
}

module.exports = new AudioController();

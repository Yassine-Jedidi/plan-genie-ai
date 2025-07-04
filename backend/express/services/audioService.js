const axios = require("axios");
const FormData = require("form-data");

// Get the FastAPI URL from environment variables or use the default
const HUGGINGFACE_SPACE = process.env.HUGGINGFACE_SPACE;

class AudioService {
  async transcribeAudio(file) {
    const formData = new FormData();
    formData.append("file", file.data, {
      filename: file.name,
      contentType: file.mimetype,
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

    return response.data;
  }
}

module.exports = new AudioService();

const axios = require("axios");

class FastapiService {
  constructor() {
    this.huggingfaceSpace = process.env.HUGGINGFACE_SPACE;
  }

  async predictType(data) {
    try {
      const response = await axios.post(
        `${this.huggingfaceSpace}/predict-type/`,
        data
      );
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        data: error.response?.data || { error: "Internal server error" },
      };
    }
  }

  async extractEntities(data) {
    try {
      const response = await axios.post(
        `${this.huggingfaceSpace}/extract-entities/`,
        data
      );
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        data: error.response?.data || { error: "Internal server error" },
      };
    }
  }

  async analyzeText(data) {
    try {
      const response = await axios.post(
        `${this.huggingfaceSpace}/analyze-text/`,
        data
      );
      return response.data;
    } catch (error) {
      throw {
        status: error.response?.status || 500,
        data: error.response?.data || { error: "Internal server error" },
      };
    }
  }
}

module.exports = new FastapiService();

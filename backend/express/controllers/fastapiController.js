const fastapiService = require("../services/fastapiService");

class FastapiController {
  async predictType(req, res) {
    try {
      const result = await fastapiService.predictType(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.status).json(error.data);
    }
  }

  async extractEntities(req, res) {
    try {
      const result = await fastapiService.extractEntities(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.status).json(error.data);
    }
  }

  async analyzeText(req, res) {
    try {
      const result = await fastapiService.analyzeText(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.status).json(error.data);
    }
  }
}

module.exports = new FastapiController();

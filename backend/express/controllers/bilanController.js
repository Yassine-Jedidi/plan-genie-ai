const bilanService = require("../services/bilanService");

class BilanController {
  async getTodayBilan(req, res) {
    try {
      const userId = req.user.id;
      const bilan = await bilanService.getTodayBilan(userId);

      return res.status(200).json(bilan);
    } catch (error) {
      console.error("Error fetching today's bilan:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch bilan: " + error.message });
    }
  }

  async getBilanByDate(req, res) {
    try {
      const userId = req.user.id;
      const { date } = req.params;

      const bilan = await bilanService.getBilanByDate(userId, date);

      return res.status(200).json(bilan);
    } catch (error) {
      console.error("Error fetching bilan by date:", error);
      if (error.message === "No bilan found for the specified date") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to fetch bilan: " + error.message });
    }
  }

  async getRecentBilans(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 7;

      const bilans = await bilanService.getRecentBilans(userId, limit);

      return res.status(200).json(bilans);
    } catch (error) {
      console.error("Error fetching recent bilans:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch recent bilans: " + error.message });
    }
  }

  async addOrUpdateBilanEntry(req, res) {
    try {
      const userId = req.user.id;
      const { bilanId, taskId, minutesSpent, notes } = req.body;

      const entry = await bilanService.addOrUpdateBilanEntry(
        userId,
        bilanId,
        taskId,
        minutesSpent,
        notes
      );

      return res.status(200).json(entry);
    } catch (error) {
      console.error("Error updating bilan entry:", error);
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to update entry: " + error.message });
    }
  }

  async deleteBilanEntry(req, res) {
    try {
      const { entryId } = req.params;
      const userId = req.user.id;

      const result = await bilanService.deleteBilanEntry(userId, entryId);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error deleting bilan entry:", error);
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Failed to delete entry: " + error.message });
    }
  }
}

module.exports = new BilanController();

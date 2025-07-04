const analyticsService = require("../services/analyticsService");

class AnalyticsController {
  async getOverallAnalytics(req, res) {
    try {
      const userId = req.user.id;
      const analytics = await analyticsService.getOverallAnalytics(userId);

      res.status(200).json(analytics);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch analytics data: " + error.message });
    }
  }
}

module.exports = new AnalyticsController();

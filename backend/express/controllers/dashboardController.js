const dashboardService = require("../services/dashboardService");

class DashboardController {
  async getOverallDashboard(req, res) {
    try {
      const userId = req.user.id;
      const dashboardData = await dashboardService.getOverallDashboard(userId);

      res.status(200).json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch dashboard data: " + error.message });
    }
  }
}

module.exports = new DashboardController();

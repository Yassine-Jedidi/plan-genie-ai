const express = require("express");
const prisma = require("../config/prisma");
const { authenticateUser } = require("../middleware/auth");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Helper function to calculate analytics for a given set of tasks
const calculateTaskAnalytics = (tasks, todayStart) => {
  const initialPriorityBreakdown = { low: 0, medium: 0, high: 0 };
  const initialAnalytics = {
    done: 0,
    undone: 0,
    completionPercentage: 0,
    priorityCounts: { ...initialPriorityBreakdown },
    donePriorityCounts: { ...initialPriorityBreakdown },
    undonePriorityCounts: { ...initialPriorityBreakdown },
    overdue: 0,
    overdue1_3Days: 0,
    overdue4_7Days: 0,
    overdueMoreThan7Days: 0,
  };

  tasks.forEach((task) => {
    const isDone = task.status === "Done";
    const priority = task.priority?.toLowerCase() || "medium";

    if (isDone) initialAnalytics.done++;
    else initialAnalytics.undone++;

    if (priority === "low") {
      initialAnalytics.priorityCounts.low++;
      if (isDone) initialAnalytics.donePriorityCounts.low++;
      else initialAnalytics.undonePriorityCounts.low++;
    } else if (priority === "medium") {
      initialAnalytics.priorityCounts.medium++;
      if (isDone) initialAnalytics.donePriorityCounts.medium++;
      else initialAnalytics.undonePriorityCounts.medium++;
    } else if (priority === "high") {
      initialAnalytics.priorityCounts.high++;
      if (isDone) initialAnalytics.donePriorityCounts.high++;
      else initialAnalytics.undonePriorityCounts.high++;
    }

    if (task.deadline && !isDone) {
      try {
        const deadlineDate = new Date(task.deadline);
        const daysOverdue = Math.floor(
          (todayStart.getTime() - deadlineDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (deadlineDate < todayStart) {
          initialAnalytics.overdue++;
          if (daysOverdue >= 1 && daysOverdue <= 3) {
            initialAnalytics.overdue1_3Days++;
          } else if (daysOverdue >= 4 && daysOverdue <= 7) {
            initialAnalytics.overdue4_7Days++;
          } else if (daysOverdue > 7) {
            initialAnalytics.overdueMoreThan7Days++;
          }
        }
      } catch (e) {
        console.error("Invalid date in task: ", task.deadline, e);
      }
    }
  });

  const total = initialAnalytics.done + initialAnalytics.undone;
  initialAnalytics.completionPercentage =
    total > 0
      ? parseFloat(((initialAnalytics.done / total) * 100).toFixed(2))
      : 0;

  return initialAnalytics;
};

// GET endpoint for overall analytics
router.get("/overall", async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
      },
    });

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // All tasks analytics
    const allAnalytics = calculateTaskAnalytics(tasks, todayStart);

    // Today's tasks analytics
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayTasks = tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      return deadlineDate >= todayStart && deadlineDate < tomorrow;
    });
    const todayAnalytics = calculateTaskAnalytics(todayTasks, todayStart);

    // This Week's tasks analytics
    const currentWeekStart = new Date(now);
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() -
        currentWeekStart.getDay() +
        (currentWeekStart.getDay() === 0 ? -6 : 1)
    ); // Adjust to Monday

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const thisWeekTasks = tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      return deadlineDate >= currentWeekStart && deadlineDate <= currentWeekEnd;
    });
    const thisWeekAnalytics = calculateTaskAnalytics(thisWeekTasks, todayStart);

    // This Month's tasks analytics
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    const thisMonthTasks = tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      return (
        deadlineDate >= currentMonthStart && deadlineDate <= currentMonthEnd
      );
    });
    const thisMonthAnalytics = calculateTaskAnalytics(
      thisMonthTasks,
      todayStart
    );

    res.status(200).json({
      all: allAnalytics,
      today: todayAnalytics,
      thisWeek: thisWeekAnalytics,
      thisMonth: thisMonthAnalytics,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch analytics data: " + error.message });
  }
});

module.exports = router;

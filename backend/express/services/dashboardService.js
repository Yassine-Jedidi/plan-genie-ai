const prisma = require("../config/prisma");

class DashboardService {
  async getOverallDashboard(userId) {
    if (!prisma) {
      throw new Error("Database connection not available");
    }

    // Fetch tasks
    const fetchedTasks = await prisma.task.findMany({
      where: { user_id: userId },
    });

    // Fetch bilans (daily summaries for time spent)
    const fetchedBilans = await prisma.bilan.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
      take: 7, // Get recent bilans for daily time spent chart
      include: { entries: true }, // Ensure entries are included
    });

    // Fetch events
    const fetchedEvents = await prisma.event.findMany({
      where: { user_id: userId },
    });

    // Process tasks data
    const statusCounts = {};
    fetchedTasks.forEach((task) => {
      const status = task.status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const tasksByStatus = Object.keys(statusCounts).map((status) => ({
      name: status,
      count: statusCounts[status],
    }));

    const priorityCounts = {};
    fetchedTasks.forEach((task) => {
      const priority = task.priority || "Unknown";
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });
    const tasksByPriority = [
      { name: "Low", count: priorityCounts.Low || 0 },
      { name: "Medium", count: priorityCounts.Medium || 0 },
      { name: "High", count: priorityCounts.High || 0 },
    ];

    const deadlineCounts = {
      "Completed On Time": 0,
      "Completed Late": 0,
      Overdue: 0,
      Upcoming: 0,
    };
    const now = new Date();
    fetchedTasks.forEach((task) => {
      if (task.status === "Done" && task.completed_at) {
        const completedDate = new Date(task.completed_at);
        const deadlineDate = task.deadline ? new Date(task.deadline) : null;
        if (deadlineDate && completedDate <= deadlineDate) {
          deadlineCounts["Completed On Time"]++;
        } else {
          deadlineCounts["Completed Late"]++;
        }
      } else if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        if (deadlineDate < now) {
          deadlineCounts["Overdue"]++;
        } else {
          deadlineCounts["Upcoming"]++;
        }
      }
    });
    const tasksByDeadline = Object.keys(deadlineCounts).map((range) => ({
      name: range,
      count: deadlineCounts[range],
    }));

    const completionData = [
      {
        name: "Done",
        count: fetchedTasks.filter((t) => t.status === "Done").length,
      },
      {
        name: "Undone",
        count: fetchedTasks.filter((t) => t.status !== "Done").length,
      },
    ];

    // Correctly calculate minutes spent by priority
    const minutesSpentByPriority = { low: 0, medium: 0, high: 0 };
    // Create a map of task_id to priority for quick lookup
    const taskPriorityMap = {};
    fetchedTasks.forEach((task) => {
      // Normalize to lowercase for consistency
      const priority = (task.priority || "medium").toLowerCase();
      taskPriorityMap[task.id] = priority;
    });
    fetchedBilans.forEach((bilan) => {
      bilan.entries.forEach((entry) => {
        const priority = taskPriorityMap[entry.task_id] || "medium";
        if (minutesSpentByPriority[priority] !== undefined) {
          minutesSpentByPriority[priority] += entry.minutes_spent;
        }
      });
    });

    const timeByPriority = [
      { name: "Low", count: minutesSpentByPriority.low },
      { name: "Medium", count: minutesSpentByPriority.medium },
      { name: "High", count: minutesSpentByPriority.high },
    ];

    // Declare today and fifteenDaysAgo once for both timeSpentPerDay and eventsByDay
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 30 days including today

    // Process bilans data for time spent per day
    const dailyTime = {};
    // Fill dailyTime with 0 for each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyTime[dateStr] = 0;
    }
    fetchedBilans.forEach((bilan) => {
      const date = new Date(bilan.date);
      date.setHours(0, 0, 0, 0);
      if (date >= thirtyDaysAgo && date <= today) {
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const totalMinutesForDay = bilan.entries.reduce(
          (sum, entry) => sum + entry.minutes_spent,
          0
        );
        dailyTime[dateStr] = (dailyTime[dateStr] || 0) + totalMinutesForDay;
      }
    });
    const timeSpentPerDay = Object.keys(dailyTime).map((date) => ({
      name: date,
      count: dailyTime[date],
    }));
    timeSpentPerDay.sort((a, b) => {
      const aDate = new Date(a.name + ", " + today.getFullYear());
      const bDate = new Date(b.name + ", " + today.getFullYear());
      return aDate - bDate;
    });

    // Process events data
    const dailyEvents = {};
    // Fill dailyEvents with 0 for each day in the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(thirtyDaysAgo.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyEvents[dateStr] = 0;
    }
    fetchedEvents.forEach((event) => {
      const eventDate = new Date(event.date_time);
      eventDate.setHours(0, 0, 0, 0);
      if (eventDate >= thirtyDaysAgo && eventDate <= today) {
        const date = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dailyEvents[date] = (dailyEvents[date] || 0) + 1;
      }
    });
    const eventsByDay = Object.keys(dailyEvents).map((date) => ({
      name: date,
      count: dailyEvents[date],
    }));
    eventsByDay.sort((a, b) => {
      const aDate = new Date(a.name + ", " + today.getFullYear());
      const bDate = new Date(b.name + ", " + today.getFullYear());
      return aDate - bDate;
    });

    const upcoming = fetchedEvents.filter(
      (event) => new Date(event.date_time) >= now
    ).length;
    const past = fetchedEvents.filter(
      (event) => new Date(event.date_time) < now
    ).length;
    const eventDistribution = [
      { name: "Upcoming", count: upcoming },
      { name: "Past", count: past },
    ];

    // --- Task Completion Rate for Each Day (Mon-Sun) ---
    // Get start of current week (Monday)
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay(); // 0 (Sun) - 6 (Sat)
    // Calculate how many days to subtract to get to Monday
    const diffToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(todayDate);
    monday.setDate(todayDate.getDate() - diffToMonday);
    monday.setHours(0, 0, 0, 0);

    // Prepare a map for each weekday
    const dailyCompletionRates = weekDays.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      date.setHours(0, 0, 0, 0);
      // Get all tasks with a deadline on this day
      const tasksForDay = fetchedTasks.filter((task) => {
        if (!task.deadline) return false;
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        return deadline.getTime() === date.getTime();
      });
      // Of those, how many are completed on or before this day (using completed_at)?
      const completed = tasksForDay.filter((task) => {
        if (task.status !== "Done" || !task.completed_at) return false;
        const completedAt = new Date(task.completed_at);
        completedAt.setHours(0, 0, 0, 0);
        // completed_at is on or before the deadline day
        return completedAt.getTime() <= date.getTime();
      }).length;
      return {
        day,
        completed,
        total: tasksForDay.length,
      };
    });

    return {
      tasksByStatus,
      tasksByPriority,
      tasksByDeadline,
      completionData,
      timeByPriority,
      timeSpentPerDay,
      eventsByDay,
      eventDistribution,
      dailyCompletionRates,
    };
  }
}

module.exports = new DashboardService();

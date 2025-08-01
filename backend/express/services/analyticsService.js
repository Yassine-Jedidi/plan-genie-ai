const prisma = require("../config/prisma");

// Helper function to calculate analytics for a given set of tasks and their associated bilan entries
const calculateTaskAnalytics = (tasks, bilanEntries, todayStart) => {
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
    totalMinutesWorked: 0,
    minutesSpentByPriority: { ...initialPriorityBreakdown },
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

  // Calculate total minutes worked and minutes spent by priority from provided bilan entries
  bilanEntries.forEach((entry) => {
    const task = tasks.find((t) => t.id === entry.task_id);
    if (task) {
      const priority = task.priority?.toLowerCase() || "medium";
      initialAnalytics.totalMinutesWorked += entry.minutes_spent;
      if (initialAnalytics.minutesSpentByPriority[priority] !== undefined) {
        initialAnalytics.minutesSpentByPriority[priority] +=
          entry.minutes_spent;
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

// Helper function to calculate analytics for a given set of events
const calculateEventAnalytics = (events, referenceDate) => {
  let totalEvents = events.length;
  let upcomingEvents = 0;
  let pastEvents = 0;

  events.forEach((event) => {
    if (event.date_time) {
      const eventDateTime = new Date(event.date_time);
      if (eventDateTime >= referenceDate) {
        upcomingEvents++;
      } else {
        pastEvents++;
      }
    }
  });

  return {
    totalEvents,
    upcomingEvents,
    pastEvents,
  };
};

class AnalyticsService {
  async getOverallAnalytics(userId) {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
      },
    });

    const events = await prisma.event.findMany({
      where: {
        user_id: userId,
      },
    });

    const bilans = await prisma.bilan.findMany({
      where: {
        user_id: userId,
      },
      include: {
        entries: {
          include: {
            task: true,
          },
        },
      },
    });

    const allBilanEntries = bilans.flatMap((bilan) =>
      bilan.entries.map((entry) => ({
        ...entry,
        bilanDate: bilan.date,
        task: entry.task,
      }))
    );

    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // All tasks analytics
    const allAnalytics = calculateTaskAnalytics(
      tasks,
      allBilanEntries,
      todayStart
    );
    const allEventAnalytics = calculateEventAnalytics(events, todayStart);

    // Today's tasks analytics - include all tasks that have activity today
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get tasks that have bilan entries for today OR have deadlines today
    const todayBilanEntries = allBilanEntries.filter((entry) => {
      const bilanDate = new Date(entry.bilanDate);
      return bilanDate >= todayStart && bilanDate < tomorrow;
    });

    // Get unique task IDs from today's bilan entries
    const todayTaskIds = [
      ...new Set(todayBilanEntries.map((entry) => entry.task_id)),
    ];

    // Include tasks that either have activity today OR have deadlines today
    const todayTasks = tasks.filter((task) => {
      // Include if task has activity today
      if (todayTaskIds.includes(task.id)) {
        return true;
      }
      // Include if task has deadline today
      if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        return deadlineDate >= todayStart && deadlineDate < tomorrow;
      }
      return false;
    });

    const todayAnalytics = calculateTaskAnalytics(
      todayTasks,
      todayBilanEntries,
      todayStart
    );
    const todayEvents = events.filter((event) => {
      if (!event.date_time) return false;
      const eventDateTime = new Date(event.date_time);
      return eventDateTime >= todayStart && eventDateTime < tomorrow;
    });
    const todayEventAnalytics = calculateEventAnalytics(
      todayEvents,
      todayStart
    );

    // This Week's tasks analytics
    const currentWeekStart = new Date(now);
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() -
        currentWeekStart.getDay() +
        (currentWeekStart.getDay() === 0 ? -6 : 1)
    ); // Adjust to Monday

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 7);
    currentWeekEnd.setHours(0, 0, 0, 0);

    // Get tasks that have bilan entries this week OR have deadlines this week
    const thisWeekBilanEntries = allBilanEntries.filter((entry) => {
      const bilanDate = new Date(entry.bilanDate);
      return bilanDate >= currentWeekStart && bilanDate < currentWeekEnd;
    });

    const thisWeekTaskIds = [
      ...new Set(thisWeekBilanEntries.map((entry) => entry.task_id)),
    ];

    const thisWeekTasks = tasks.filter((task) => {
      // Include if task has activity this week
      if (thisWeekTaskIds.includes(task.id)) {
        return true;
      }
      // Include if task has deadline this week
      if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        return (
          deadlineDate >= currentWeekStart && deadlineDate < currentWeekEnd
        );
      }
      return false;
    });

    const thisWeekAnalytics = calculateTaskAnalytics(
      thisWeekTasks,
      thisWeekBilanEntries,
      todayStart
    );
    const thisWeekEvents = events.filter((event) => {
      if (!event.date_time) return false;
      const eventDateTime = new Date(event.date_time);
      return (
        eventDateTime >= currentWeekStart && eventDateTime < currentWeekEnd
      );
    });
    const thisWeekEventAnalytics = calculateEventAnalytics(
      thisWeekEvents,
      todayStart
    );

    // This Month's tasks analytics
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    nextMonthStart.setHours(0, 0, 0, 0);

    // Get tasks that have bilan entries this month OR have deadlines this month
    const thisMonthBilanEntries = allBilanEntries.filter((entry) => {
      const bilanDate = new Date(entry.bilanDate);
      return bilanDate >= currentMonthStart && bilanDate < nextMonthStart;
    });

    const thisMonthTaskIds = [
      ...new Set(thisMonthBilanEntries.map((entry) => entry.task_id)),
    ];

    const thisMonthTasks = tasks.filter((task) => {
      // Include if task has activity this month
      if (thisMonthTaskIds.includes(task.id)) {
        return true;
      }
      // Include if task has deadline this month
      if (task.deadline) {
        const deadlineDate = new Date(task.deadline);
        return (
          deadlineDate >= currentMonthStart && deadlineDate < nextMonthStart
        );
      }
      return false;
    });

    const thisMonthAnalytics = calculateTaskAnalytics(
      thisMonthTasks,
      thisMonthBilanEntries,
      todayStart
    );
    const thisMonthEvents = events.filter((event) => {
      if (!event.date_time) return false;
      const eventDateTime = new Date(event.date_time);
      return (
        eventDateTime >= currentMonthStart && eventDateTime < nextMonthStart
      );
    });
    const thisMonthEventAnalytics = calculateEventAnalytics(
      thisMonthEvents,
      todayStart
    );

    return {
      all: { ...allAnalytics, events: allEventAnalytics },
      today: { ...todayAnalytics, events: todayEventAnalytics },
      thisWeek: { ...thisWeekAnalytics, events: thisWeekEventAnalytics },
      thisMonth: { ...thisMonthAnalytics, events: thisMonthEventAnalytics },
    };
  }
}

module.exports = new AnalyticsService();

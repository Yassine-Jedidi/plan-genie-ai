import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { taskService, Task } from "@/services/taskService";
import { toast } from "sonner";
import { bilanService, Bilan } from "@/services/bilanService";
import api from "@/components/api/api";
import { eventService, Event } from "@/services/eventService";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, BarChart2, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartDataItem {
  name: string;
  count: number;
}

// Define the necessary analytics interfaces directly in this file
interface TaskAnalytics {
  done: number;
  undone: number;
  completionPercentage: number;
  priorityCounts: { low: number; medium: number; high: number };
  donePriorityCounts: { low: number; medium: number; high: number };
  undonePriorityCounts: { low: number; medium: number; high: number };
  overdue: number;
  overdue1_3Days: number;
  overdue4_7Days: number;
  overdueMoreThan7Days: number;
  totalMinutesWorked: number;
  minutesSpentByPriority: { low: number; medium: number; high: number };
}

interface EventAnalytics {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

interface OverallAnalyticsResponse {
  all: TaskAnalytics & { events: EventAnalytics };
  today: TaskAnalytics & { events: EventAnalytics };
  thisWeek: TaskAnalytics & { events: EventAnalytics };
  thisMonth: TaskAnalytics & { events: EventAnalytics };
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasksByStatus, setTasksByStatus] = useState<ChartDataItem[]>([]);
  const [tasksByPriority, setTasksByPriority] = useState<ChartDataItem[]>([]);
  const [tasksByDeadline, setTasksByDeadline] = useState<ChartDataItem[]>([]);
  const [timeSpentPerDay, setTimeSpentPerDay] = useState<ChartDataItem[]>([]);
  const [completionData, setCompletionData] = useState<ChartDataItem[]>([]);
  const [timeByPriority, setTimeByPriority] = useState<ChartDataItem[]>([]);
  const [eventsByDay, setEventsByDay] = useState<ChartDataItem[]>([]);
  const [eventDistribution, setEventDistribution] = useState<ChartDataItem[]>(
    []
  );

  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const fetchedTasks = await taskService.getTasks();
        processChartData(fetchedTasks);

        const fetchedBilans = await bilanService.getRecentBilans(7);
        processBilanChartData(fetchedBilans);

        const { data: fetchedAnalytics } =
          await api.get<OverallAnalyticsResponse>("/analytics/overall");
        processAnalyticsChartData(fetchedAnalytics);

        const fetchedEvents = await eventService.getEvents(user.id);
        processEventChartData(fetchedEvents);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const processChartData = (fetchedTasks: Task[]) => {
    // Chart 1: Tasks by Status
    const statusCounts: { [key: string]: number } = {};
    fetchedTasks.forEach((task) => {
      const status = task.status || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusChartData: ChartDataItem[] = Object.keys(statusCounts).map(
      (status) => ({
        name: status,
        count: statusCounts[status],
      })
    );
    setTasksByStatus(statusChartData);

    // Chart 2: Tasks by Priority
    const priorityCounts: { [key: string]: number } = {};
    fetchedTasks.forEach((task) => {
      const priority = task.priority || "Unknown";
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });
    const priorityChartData: ChartDataItem[] = Object.keys(priorityCounts).map(
      (priority) => ({
        name: priority,
        count: priorityCounts[priority],
      })
    );
    // Sort priorityChartData to be Low, Medium, High
    priorityChartData.sort((a, b) => {
      const order = { Low: 1, Medium: 2, High: 3, Unknown: 4 };
      return (
        order[a.name as keyof typeof order] -
        order[b.name as keyof typeof order]
      );
    });
    setTasksByPriority(priorityChartData);

    // Chart 3: Tasks by Deadline
    const deadlineCounts: { [key: string]: number } = {
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

    const deadlineChartData: ChartDataItem[] = Object.keys(deadlineCounts).map(
      (range) => ({
        name: range,
        count: deadlineCounts[range],
      })
    );
    setTasksByDeadline(deadlineChartData);
  };

  const processBilanChartData = (fetchedBilans: Bilan[]) => {
    // Chart 4: Total Time Spent per Day
    const dailyTime: { [key: string]: number } = {};
    fetchedBilans.forEach((bilan) => {
      const date = new Date(bilan.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const totalMinutesForDay = bilan.entries.reduce(
        (sum, entry) => sum + entry.minutes_spent,
        0
      );
      dailyTime[date] = (dailyTime[date] || 0) + totalMinutesForDay;
    });
    const timeSpentPerDayData: ChartDataItem[] = Object.keys(dailyTime).map(
      (date) => ({
        name: date,
        count: dailyTime[date],
      })
    );
    // Sort by date to ensure the line chart is correct
    timeSpentPerDayData.sort(
      (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
    );
    setTimeSpentPerDay(timeSpentPerDayData);
  };

  const processAnalyticsChartData = (
    fetchedAnalytics: OverallAnalyticsResponse
  ) => {
    // Chart 6: Overall Task Completion Percentage
    const done = fetchedAnalytics.all.done;
    const undone = fetchedAnalytics.all.undone;

    const completionChartData: ChartDataItem[] = [
      { name: "Done", count: done },
      { name: "Undone", count: undone },
    ];
    setCompletionData(completionChartData);

    // Chart 7: Time Spent by Priority
    const minutesSpentByPriority = fetchedAnalytics.all.minutesSpentByPriority;
    const timeByPriorityData: ChartDataItem[] = [
      { name: "Low", count: minutesSpentByPriority.low },
      { name: "Medium", count: minutesSpentByPriority.medium },
      { name: "High", count: minutesSpentByPriority.high },
    ];
    setTimeByPriority(timeByPriorityData);
  };

  const processEventChartData = (fetchedEvents: Event[]) => {
    // Chart: Events by Day
    const dailyEvents: { [key: string]: number } = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    fetchedEvents.forEach((event) => {
      const eventDate = new Date(event.date_time);
      if (eventDate >= thirtyDaysAgo) {
        // Only count events from the last 30 days
        const date = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dailyEvents[date] = (dailyEvents[date] || 0) + 1;
      }
    });
    const eventsByDayData: ChartDataItem[] = Object.keys(dailyEvents).map(
      (date) => ({
        name: date,
        count: dailyEvents[date],
      })
    );
    eventsByDayData.sort(
      (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
    );
    setEventsByDay(eventsByDayData);

    // Chart: Upcoming vs. Past Events
    const now = new Date();
    let upcoming = 0;
    let past = 0;
    fetchedEvents.forEach((event) => {
      const eventDate = new Date(event.date_time);
      if (eventDate >= now) {
        upcoming++;
      } else {
        past++;
      }
    });
    const eventDistributionData: ChartDataItem[] = [
      { name: "Upcoming", count: upcoming },
      { name: "Past", count: past },
    ];
    setEventDistribution(eventDistributionData);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full mx-4">
        <h1 className="text-3xl font-semibold mb-8 text-primary flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Dashboard Overview
        </h1>

        <div className="w-full max-w-7xl mb-8">
          <h2 className="text-2xl font-thin mb-6 text-center lg:text-left flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            Task Analytics
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="col-span-1">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="w-full max-w-7xl mt-8">
          <h2 className="text-2xl font-thin mb-6 text-center lg:text-left flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-primary" />
            Event Analytics
          </h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="col-span-1">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusChartConfig = {
    count: {
      label: "Number of Tasks",
    },
    Planned: { label: "Planned", color: "hsl(var(--chart-1))" },
    "In Progress": { label: "In Progress", color: "hsl(var(--chart-2))" },
    Done: { label: "Done", color: "hsl(var(--chart-3))" },
    Unknown: { label: "Unknown", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const priorityChartConfig = {
    count: {
      label: "Number of Tasks",
    },
    High: { label: "High", color: "hsl(var(--chart-1))" },
    Medium: { label: "Medium", color: "hsl(var(--chart-2))" },
    Low: { label: "Low", color: "hsl(var(--chart-3))" },
    Unknown: { label: "Unknown", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const deadlineChartConfig = {
    count: {
      label: "Number of Tasks",
    },
    "Completed On Time": {
      label: "Completed On Time",
      color: "hsl(var(--chart-1))",
    },
    "Completed Late": { label: "Completed Late", color: "hsl(var(--chart-2))" },
    Overdue: { label: "Overdue", color: "hsl(var(--chart-3))" },
    Upcoming: { label: "Upcoming", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const timeSpentPerDayConfig = {
    count: {
      label: "Minutes Spent",
    },
    totalMinutes: { label: "Total Minutes", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  const completionChartConfig = {
    count: {
      label: "Number of Tasks",
    },
    Done: { label: "Done", color: "hsl(var(--chart-1))" },
    Undone: { label: "Undone", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const timeByPriorityConfig = {
    count: {
      label: "Minutes Spent",
    },
    Low: { label: "Low", color: "hsl(var(--chart-1))" },
    Medium: { label: "Medium", color: "hsl(var(--chart-2))" },
    High: { label: "High", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  const eventsByDayConfig = {
    count: {
      label: "Number of Events",
    },
    events: { label: "Events", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  const eventDistributionConfig = {
    count: {
      label: "Number of Events",
    },
    Upcoming: { label: "Upcoming", color: "hsl(var(--chart-1))" },
    Past: { label: "Past", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF00BF",
    "#8B008B",
    "#808000",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full mx-4">
      <h1 className="text-3xl font-semibold mb-8 text-primary flex items-center gap-3">
        <LayoutDashboard className="w-8 h-8 text-primary" />
        Dashboard Overview
      </h1>

      <div className="w-full max-w-7xl mb-8">
        <h2 className="text-2xl font-thin mb-6 text-center lg:text-left flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary" />
          Task Analytics
        </h2>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {/* Chart 1: Tasks by Status - Pie Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tasks by Status</CardTitle>
              <CardDescription>
                Distribution of tasks by their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig}>
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <Pie
                    data={tasksByStatus}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {tasksByStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Tasks by Priority - Bar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
              <CardDescription>
                Number of tasks categorized by priority.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={priorityChartConfig}>
                <BarChart data={tasksByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Bar dataKey="count">
                    {tasksByPriority.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 3: Tasks by Deadline - Horizontal Bar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Tasks by Deadline</CardTitle>
              <CardDescription>Overview of task deadlines.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={deadlineChartConfig}>
                <BarChart layout="vertical" data={tasksByDeadline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="count" />
                  <YAxis type="category" dataKey="name" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Bar dataKey="count">
                    {tasksByDeadline.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 6: Overall Task Completion Percentage - Pie Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Overall Task Completion</CardTitle>
              <CardDescription>Percentage of tasks completed.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={completionChartConfig}>
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <Pie
                    data={completionData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {completionData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 7: Time Spent by Priority - Bar Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Time Spent by Priority</CardTitle>
              <CardDescription>
                Minutes spent on tasks categorized by priority.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={timeByPriorityConfig}>
                <BarChart data={timeByPriority}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Bar dataKey="count">
                    {timeByPriority.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 4: Total Time Spent per Day - Line Chart (now chart 4 in new numbering) */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Time Spent Daily</CardTitle>
              <CardDescription>
                Total minutes spent on tasks per day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={timeSpentPerDayConfig}>
                <LineChart data={timeSpentPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="totalMinutes"
                    stroke="var(--color-totalMinutes)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full max-w-7xl mt-8">
        <h2 className="text-2xl font-thin mb-6 text-center lg:text-left flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-primary" />
          Event Analytics
        </h2>
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          {/* Chart 8: Events by Day - Line Chart (now chart 5) */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Events by Day</CardTitle>
              <CardDescription>
                Number of events scheduled per day (last 30 days).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={eventsByDayConfig}>
                <LineChart data={eventsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="events"
                    stroke="var(--color-events)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 9: Event Distribution (Upcoming vs. Past) - Pie Chart (now chart 6) */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Event Distribution</CardTitle>
              <CardDescription>
                Breakdown of upcoming and past events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={eventDistributionConfig}>
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent nameKey="name" labelKey="count" />
                    }
                  />
                  <Pie
                    data={eventDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {eventDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

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
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, BarChart2, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService, DashboardData } from "@/services/dashboardService";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  CartesianGrid as ReCartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer as ReResponsiveContainer,
} from "recharts";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface ChartDataItem {
  name: string;
  count: number;
}

const FULL_DAY_NAMES: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

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
  const [dailyCompletionRates, setDailyCompletionRates] = useState<
    { day: string; completed: number; total: number }[]
  >([]);
  const [weekDateRange, setWeekDateRange] = useState<string>("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // Fetch new dashboard data (including dailyCompletionRates)
        const dashboardData: DashboardData =
          await dashboardService.getDashboardData();
        setDailyCompletionRates(dashboardData.dailyCompletionRates);
        setTasksByStatus(dashboardData.tasksByStatus);
        setTasksByPriority(dashboardData.tasksByPriority);
        setTasksByDeadline(dashboardData.tasksByDeadline);
        setCompletionData(dashboardData.completionData);
        setTimeByPriority(dashboardData.timeByPriority);
        setTimeSpentPerDay(dashboardData.timeSpentPerDay);
        setEventsByDay(dashboardData.eventsByDay);
        setEventDistribution(dashboardData.eventDistribution);

        // Calculate and set current week number and date range
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
        const diffToMonday = (dayOfWeek + 6) % 7; // Days to subtract to get to Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6); // Monday + 6 days = Sunday
        sunday.setHours(23, 59, 59, 999);

        const options: Intl.DateTimeFormatOptions = {
          weekday: "short",
          month: "short",
          day: "numeric",
        };
        const formattedMonday = monday.toLocaleDateString("en-US", options);
        const formattedSunday = sunday.toLocaleDateString("en-US", options);
        setWeekDateRange(`${formattedMonday} - ${formattedSunday}`);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <>
        <div className="px-4 py-2">
          <SidebarTrigger className="h-4 w-4 mt-2" />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full mx-4">
          <h1 className="text-3xl font-semibold mb-8 text-primary flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Dashboard Overview
          </h1>

          {/* Skeleton for Task Completion Rate Section (Top) */}
          <div className="w-full max-w-7xl mb-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                  {/* Progress Bars Skeleton */}
                  <div className="flex-1 space-y-3 min-w-[220px] flex flex-col justify-center">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-4"
                        style={{ height: "1.5rem" }}
                      >
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="flex-1 h-4 w-full" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                  {/* Bar Chart Skeleton */}
                  <div className="flex-1 min-w-[140px] h-56">
                    <Skeleton className="h-full w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
      </>
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
    <>
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2 w-full mx-4">
        <h1 className="text-3xl font-semibold mb-8 text-primary flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          Dashboard Overview
        </h1>

        {/* --- Task Completion Rate Section (Top) --- */}
        <div className="w-full max-w-7xl mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>
                Completion rate for each day of the current week.
                {weekDateRange && ` (${weekDateRange})`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                {/* Progress Bars */}
                <div className="flex-1 space-y-3 min-w-[220px] flex flex-col justify-center">
                  {dailyCompletionRates.map((item) => {
                    const percent =
                      item.total > 0 ? (item.completed / item.total) * 100 : 0;
                    return (
                      <div
                        key={item.day}
                        className="flex items-center space-x-4"
                        style={{ height: "1.5rem" }} // 24px per bar
                      >
                        <span className="w-12 font-medium text-sm">
                          {item.day}
                        </span>
                        <div className="flex-1 h-4 bg-primary-foreground rounded-full overflow-hidden relative border border-primary">
                          <div
                            className="h-4 bg-primary rounded-full absolute left-0 top-0 transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right text-xs text-muted-foreground">
                          {item.completed}/{item.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Bar Chart */}
                <div className="flex-1 min-w-[140px] h-56">
                  <ChartContainer config={{}}>
                    <ReResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={dailyCompletionRates.map((item) => ({
                          day: item.day,
                          completed: item.completed,
                          total: item.total,
                          percent:
                            item.total > 0
                              ? Math.round((item.completed / item.total) * 100)
                              : 0,
                        }))}
                        layout="horizontal"
                        margin={{ top: 10, right: 20, left: 20, bottom: 60 }}
                        barCategoryGap={10}
                        barSize={18}
                      >
                        <ReCartesianGrid strokeDasharray="3 3" />
                        <ReXAxis type="category" dataKey="day" />
                        <ReYAxis
                          type="number"
                          dataKey="percent"
                          tickFormatter={(v) => `${v}%`}
                        />
                        <ReTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const fullDay = FULL_DAY_NAMES[label] || label;
                              return (
                                <div className="bg-white p-2 border rounded shadow-md text-sm text-black">
                                  <p className="font-bold">{fullDay}</p>
                                  <p>
                                    Completion: {data.completed}/{data.total} (
                                    {data.percent}%)
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <ReBar
                          dataKey="percent"
                          fill="hsl(var(--primary))"
                          radius={[8, 8, 0, 0]}
                          isAnimationActive={false}
                        />
                      </ReBarChart>
                    </ReResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                <CardDescription>
                  Percentage of tasks completed.
                </CardDescription>
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
                  Total minutes spent on tasks per day (last 30 days).
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
    </>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import {
  analyticsService,
  AnalyticsData,
  TaskAnalytics,
  EventAnalytics,
} from "./services/analyticsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialAnalyticsState: AnalyticsData = {
  all: {
    done: 0,
    undone: 0,
    completionPercentage: 0,
    priorityCounts: { low: 0, medium: 0, high: 0 },
    donePriorityCounts: { low: 0, medium: 0, high: 0 },
    undonePriorityCounts: { low: 0, medium: 0, high: 0 },
    overdue: 0,
    overdue1_3Days: 0,
    overdue4_7Days: 0,
    overdueMoreThan7Days: 0,
    totalMinutesWorked: 0,
    minutesSpentByPriority: { low: 0, medium: 0, high: 0 },
    events: { totalEvents: 0, upcomingEvents: 0, pastEvents: 0 },
  },
  today: {
    done: 0,
    undone: 0,
    completionPercentage: 0,
    priorityCounts: { low: 0, medium: 0, high: 0 },
    donePriorityCounts: { low: 0, medium: 0, high: 0 },
    undonePriorityCounts: { low: 0, medium: 0, high: 0 },
    overdue: 0,
    overdue1_3Days: 0,
    overdue4_7Days: 0,
    overdueMoreThan7Days: 0,
    totalMinutesWorked: 0,
    minutesSpentByPriority: { low: 0, medium: 0, high: 0 },
    events: { totalEvents: 0, upcomingEvents: 0, pastEvents: 0 },
  },
  thisWeek: {
    done: 0,
    undone: 0,
    completionPercentage: 0,
    priorityCounts: { low: 0, medium: 0, high: 0 },
    donePriorityCounts: { low: 0, medium: 0, high: 0 },
    undonePriorityCounts: { low: 0, medium: 0, high: 0 },
    overdue: 0,
    overdue1_3Days: 0,
    overdue4_7Days: 0,
    overdueMoreThan7Days: 0,
    totalMinutesWorked: 0,
    minutesSpentByPriority: { low: 0, medium: 0, high: 0 },
    events: { totalEvents: 0, upcomingEvents: 0, pastEvents: 0 },
  },
  thisMonth: {
    done: 0,
    undone: 0,
    completionPercentage: 0,
    priorityCounts: { low: 0, medium: 0, high: 0 },
    donePriorityCounts: { low: 0, medium: 0, high: 0 },
    undonePriorityCounts: { low: 0, medium: 0, high: 0 },
    overdue: 0,
    overdue1_3Days: 0,
    overdue4_7Days: 0,
    overdueMoreThan7Days: 0,
    totalMinutesWorked: 0,
    minutesSpentByPriority: { low: 0, medium: 0, high: 0 },
    events: { totalEvents: 0, upcomingEvents: 0, pastEvents: 0 },
  },
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(
    initialAnalyticsState
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        setError("Failed to fetch analytics data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format minutes as hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  const renderPriorityCards = (data: TaskAnalytics) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Priority
              </CardTitle>
              <ArrowDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.low}
              </div>
              <p className="text-xs text-muted-foreground">
                Done: {data.donePriorityCounts.low}, Undone:{" "}
                {data.undonePriorityCounts.low}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Time Spent: {formatTime(data.minutesSpentByPriority.low)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Medium Priority
              </CardTitle>
              <Minus className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.medium}
              </div>
              <p className="text-xs text-muted-foreground">
                Done: {data.donePriorityCounts.medium}, Undone:{" "}
                {data.undonePriorityCounts.medium}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Time Spent: {formatTime(data.minutesSpentByPriority.medium)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Priority
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.high}
              </div>
              <p className="text-xs text-muted-foreground">
                Done: {data.donePriorityCounts.high}, Undone:{" "}
                {data.undonePriorityCounts.high}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Time Spent: {formatTime(data.minutesSpentByPriority.high)}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderPriorityCardSkeletons = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tasks by Priority
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Medium Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderOverdueCard = (data: TaskAnalytics) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Overdue Tasks Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                1-3 Days Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overdue1_3Days}</div>
              <p className="text-xs text-muted-foreground">
                Tasks overdue by 1 to 3 days.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                4-7 Days Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overdue4_7Days}</div>
              <p className="text-xs text-muted-foreground">
                Tasks overdue by 4 to 7 days.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                More Than 7 Days Overdue
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overdueMoreThan7Days}
              </div>
              <p className="text-xs text-muted-foreground">
                Tasks overdue by more than 7 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderOverdueCardSkeleton = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Overdue Tasks Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>1-3 Days Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4-7 Days Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>More Than 7 Days Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderTotalTimeCard = (data: TaskAnalytics) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Total Time Spent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            {formatTime(data.totalMinutesWorked)}
          </div>
          <Clock className="h-6 w-6 text-teal-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Total time recorded for tasks.
        </p>
      </CardContent>
    </Card>
  );

  const renderTotalTimeCardSkeleton = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Total Time Spent
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );

  const renderEventCards = (data: EventAnalytics) => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Event Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
              <BarChart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Total number of events created.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Events
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled for the future.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Past Events</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pastEvents}</div>
              <p className="text-xs text-muted-foreground">
                Events that have already occurred.
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const renderEventCardSkeletons = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Event Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-4 max-w-[1200px] mx-auto text-primary">
        <div className="text-3xl font-bold mb-6 flex items-center">
          <BarChart className="mr-2" /> Analytics
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="this-week">This Week</TabsTrigger>
            <TabsTrigger value="this-month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle>Done Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Undone Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4 mb-4">
              <CardHeader>
                <CardTitle>Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
            {renderEventCardSkeletons()}
            {renderPriorityCardSkeletons()}
            {renderOverdueCardSkeleton()}
            {renderTotalTimeCardSkeleton()}
          </TabsContent>
          <TabsContent value="today">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Done Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Undone Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
            {renderEventCardSkeletons()}
            {renderPriorityCardSkeletons()}
            {renderOverdueCardSkeleton()}
            {renderTotalTimeCardSkeleton()}
          </TabsContent>
          <TabsContent value="this-week">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Done This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Undone This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
            {renderEventCardSkeletons()}
            {renderPriorityCardSkeletons()}
            {renderOverdueCardSkeleton()}
            {renderTotalTimeCardSkeleton()}
          </TabsContent>
          <TabsContent value="this-month">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Done This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Undone This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Completion Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-full" />
              </CardContent>
            </Card>
            {renderEventCardSkeletons()}
            {renderPriorityCardSkeletons()}
            {renderOverdueCardSkeleton()}
            {renderTotalTimeCardSkeleton()}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-[1200px] mx-auto text-primary">
      <div className="text-3xl font-bold mb-6 flex items-center">
        <BarChart className="mr-2" /> Analytics
      </div>
      <Tabs defaultValue="all" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="this-month">This Month</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Done Tasks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.all.done}
                </div>
                <p className="text-xs text-muted-foreground">
                  Number of tasks marked as complete.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Undone Tasks
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.all.undone}
                </div>
                <p className="text-xs text-muted-foreground">
                  Number of tasks that are still pending.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4 mb-4 col-span-full">
            <CardHeader>
              <CardTitle>Completion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress
                  value={analyticsData.all.completionPercentage}
                  className="w-[90%]"
                />
                <span className="text-sm font-medium">
                  {analyticsData.all.completionPercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress of your tasks.
              </p>
            </CardContent>
          </Card>
          {renderEventCards(analyticsData.all.events)}
          {renderPriorityCards(analyticsData.all)}
          {renderOverdueCard(analyticsData.all)}
          {renderTotalTimeCard(analyticsData.all)}
        </TabsContent>
        <TabsContent value="today">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Done Today
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.today.done}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks completed today.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Undone Today
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.today.undone}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks with a deadline today that are not yet complete.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Completion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress
                  value={analyticsData.today.completionPercentage}
                  className="w-[90%]"
                />
                <span className="text-sm font-medium">
                  {analyticsData.today.completionPercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress of your tasks due today.
              </p>
            </CardContent>
          </Card>
          {renderEventCards(analyticsData.today.events)}
          {renderPriorityCards(analyticsData.today)}
          {renderOverdueCard(analyticsData.today)}
          {renderTotalTimeCard(analyticsData.today)}
        </TabsContent>
        <TabsContent value="this-week">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Done This Week
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.thisWeek.done}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks completed this week.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Undone This Week
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.thisWeek.undone}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks with a deadline this week that are not yet complete.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Completion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress
                  value={analyticsData.thisWeek.completionPercentage}
                  className="w-[90%]"
                />
                <span className="text-sm font-medium">
                  {analyticsData.thisWeek.completionPercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress of your tasks due this week.
              </p>
            </CardContent>
          </Card>
          {renderEventCards(analyticsData.thisWeek.events)}
          {renderPriorityCards(analyticsData.thisWeek)}
          {renderOverdueCard(analyticsData.thisWeek)}
          {renderTotalTimeCard(analyticsData.thisWeek)}
        </TabsContent>
        <TabsContent value="this-month">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Done This Month
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.thisMonth.done}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks completed this month.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Undone This Month
                </CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.thisMonth.undone}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks with a deadline this month that are not yet complete.
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Completion Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress
                  value={analyticsData.thisMonth.completionPercentage}
                  className="w-[90%]"
                />
                <span className="text-sm font-medium">
                  {analyticsData.thisMonth.completionPercentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress of your tasks due this month.
              </p>
            </CardContent>
          </Card>
          {renderEventCards(analyticsData.thisMonth.events)}
          {renderPriorityCards(analyticsData.thisMonth)}
          {renderOverdueCard(analyticsData.thisMonth)}
          {renderTotalTimeCard(analyticsData.thisMonth)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

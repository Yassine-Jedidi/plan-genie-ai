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
import { SidebarTrigger } from "./components/ui/sidebar";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          {t("analytics.tasksByPriority")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.lowPriority")}
              </CardTitle>
              <ArrowDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.low}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.done")}: {data.donePriorityCounts.low},{" "}
                {t("analytics.undone")}: {data.undonePriorityCounts.low}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("analytics.timeSpent")}:{" "}
                {formatTime(data.minutesSpentByPriority.low)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.mediumPriority")}
              </CardTitle>
              <Minus className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.medium}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.done")}: {data.donePriorityCounts.medium},{" "}
                {t("analytics.undone")}: {data.undonePriorityCounts.medium}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("analytics.timeSpent")}:{" "}
                {formatTime(data.minutesSpentByPriority.medium)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.highPriority")}
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.priorityCounts.high}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.done")}: {data.donePriorityCounts.high},{" "}
                {t("analytics.undone")}: {data.undonePriorityCounts.high}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("analytics.timeSpent")}:{" "}
                {formatTime(data.minutesSpentByPriority.high)}
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
          {t("analytics.tasksByPriority")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.lowPriority")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.mediumPriority")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.highPriority")}</CardTitle>
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
          {t("analytics.overdueTasksBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.oneToThreeDaysOverdue")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overdue1_3Days}</div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.tasksOverdueBy", { days: "1 to 3" })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.fourToSevenDaysOverdue")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.overdue4_7Days}</div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.tasksOverdueBy", { days: "4 to 7" })}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.moreThanSevenDaysOverdue")}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overdueMoreThan7Days}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.tasksOverdueBy", { days: "more than 7" })}
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
          {t("analytics.overdueTasksBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.oneToThreeDaysOverdue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.fourToSevenDaysOverdue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.moreThanSevenDaysOverdue")}</CardTitle>
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
          {t("analytics.totalTimeSpent")}
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
          {t("analytics.totalTimeRecorded")}
        </p>
      </CardContent>
    </Card>
  );

  const renderTotalTimeCardSkeleton = () => (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t("analytics.totalTimeSpent")}
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
        <CardTitle className="text-xl font-semibold">
          {t("analytics.eventOverview")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.totalEvents")}
              </CardTitle>
              <BarChart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.totalNumberEventsCreated")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.upcomingEvents")}
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.eventsScheduledForFuture")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("analytics.pastEvents")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pastEvents}</div>
              <p className="text-xs text-muted-foreground">
                {t("analytics.eventsThatOccurred")}
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
        <CardTitle className="text-xl font-semibold">
          {t("analytics.eventOverview")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.totalEvents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.upcomingEvents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-20" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("analytics.pastEvents")}</CardTitle>
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
      <main className="flex-1 min-w-0 w-full">
        <div className="px-4 py-2">
          <SidebarTrigger className="h-4 w-4 mt-2" />
        </div>
        <div className="p-4 max-w-[1200px] mx-auto text-primary">
          <div className="text-3xl font-bold mb-6 flex items-center">
            <BarChart className="mr-2" /> {t("analytics.analytics")}
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">{t("analytics.all")}</TabsTrigger>
              <TabsTrigger value="today">{t("analytics.today")}</TabsTrigger>
              <TabsTrigger value="this-week">
                {t("analytics.thisWeek")}
              </TabsTrigger>
              <TabsTrigger value="this-month">
                {t("analytics.thisMonth")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("analytics.doneTasks")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("analytics.undoneTasks")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4 mb-4">
                <CardHeader>
                  <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                    <CardTitle>{t("analytics.doneToday")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("analytics.undoneToday")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                    <CardTitle>{t("analytics.doneThisWeek")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("analytics.undoneThisWeek")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                    <CardTitle>{t("analytics.doneThisMonth")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("analytics.undoneThisMonth")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-20" />
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
      </main>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">{t("analytics.failedToFetch")}</div>
    );
  }

  return (
    <main className="flex-1 min-w-0 w-full">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="p-4 max-w-[1200px] mx-auto text-primary">
        <div className="text-3xl font-bold mb-6 flex items-center">
          <BarChart className="mr-2" /> {t("analytics.analytics")}
        </div>
        <Tabs defaultValue="all" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">{t("analytics.all")}</TabsTrigger>
            <TabsTrigger value="today">{t("analytics.today")}</TabsTrigger>
            <TabsTrigger value="this-week">
              {t("analytics.thisWeek")}
            </TabsTrigger>
            <TabsTrigger value="this-month">
              {t("analytics.thisMonth")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("analytics.doneTasks")}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.all.done}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.numberTasksMarkedComplete")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("analytics.undoneTasks")}
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.all.undone}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.numberTasksPending")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4 mb-4 col-span-full">
              <CardHeader>
                <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                  {t("analytics.overallProgress")}
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
                    {t("analytics.doneToday")}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.today.done}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksCompletedToday")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("analytics.undoneToday")}
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.today.undone}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksDeadlineTodayNotComplete")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                  {t("analytics.overallProgressTasksToday")}
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
                    {t("analytics.doneThisWeek")}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.thisWeek.done}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksCompletedThisWeek")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("analytics.undoneThisWeek")}
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.thisWeek.undone}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksDeadlineThisWeekNotComplete")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                  {t("analytics.overallProgressTasksThisWeek")}
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
                    {t("analytics.doneThisMonth")}
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.thisMonth.done}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksCompletedThisMonth")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("analytics.undoneThisMonth")}
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analyticsData.thisMonth.undone}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("analytics.tasksDeadlineThisMonthNotComplete")}
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t("analytics.completionProgress")}</CardTitle>
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
                  {t("analytics.overallProgressTasksThisMonth")}
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
    </main>
  );
};

export default Analytics;

interface PriorityBreakdown {
  low: number;
  medium: number;
  high: number;
}

export interface EventAnalytics {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

export interface TaskAnalytics {
  done: number;
  undone: number;
  completionPercentage: number;
  priorityCounts: PriorityBreakdown;
  donePriorityCounts: PriorityBreakdown;
  undonePriorityCounts: PriorityBreakdown;
  minutesSpentByPriority: PriorityBreakdown;
  overdue: number;
  overdue1_3Days: number;
  overdue4_7Days: number;
  overdueMoreThan7Days: number;
  totalMinutesWorked: number;
}

export interface AnalyticsData {
  all: TaskAnalytics & { events: EventAnalytics };
  today: TaskAnalytics & { events: EventAnalytics };
  thisWeek: TaskAnalytics & { events: EventAnalytics };
  thisMonth: TaskAnalytics & { events: EventAnalytics };
} 
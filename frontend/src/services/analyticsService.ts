import api from "@/components/api/api";
import { AxiosError } from "axios";

interface PriorityBreakdown {
  low: number;
  medium: number;
  high: number;
}

export interface TaskAnalytics {
  done: number;
  undone: number;
  completionPercentage: number;
  priorityCounts: PriorityBreakdown;
  donePriorityCounts: PriorityBreakdown;
  undonePriorityCounts: PriorityBreakdown;
  overdue: number;
  overdue1_3Days: number;
  overdue4_7Days: number;
  overdueMoreThan7Days: number;
}

export interface AnalyticsData {
  all: TaskAnalytics;
  today: TaskAnalytics;
  thisWeek: TaskAnalytics;
  thisMonth: TaskAnalytics;
}

export const analyticsService = {
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const { data } = await api.get("/analytics/overall");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch analytics data");
      }
      throw new Error("Failed to fetch analytics data");
    }
  },
}; 
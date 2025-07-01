import api from "@/components/api/api";
import { AxiosError } from "axios";

interface ChartDataItem {
  name: string;
  count: number;
}

export interface DashboardData {
  tasksByStatus: ChartDataItem[];
  tasksByPriority: ChartDataItem[];
  tasksByDeadline: ChartDataItem[];
  completionData: ChartDataItem[];
  timeByPriority: ChartDataItem[];
  timeSpentPerDay: ChartDataItem[];
  eventsByDay: ChartDataItem[];
  eventDistribution: ChartDataItem[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    try {
      const { data } = await api.get<DashboardData>("/dashboard/overall");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(
          error.response.data?.error || "Failed to fetch dashboard data"
        );
      }
      throw new Error("Failed to fetch dashboard data");
    }
  },
};

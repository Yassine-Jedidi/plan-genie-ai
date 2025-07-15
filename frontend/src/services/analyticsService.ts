import api from "@/components/api/api";
import { AxiosError } from "axios";
import { AnalyticsData } from "../../types/analytics";

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
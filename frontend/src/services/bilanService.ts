import api from "@/components/api/api";
import { AxiosError } from "axios";
import { BilanEntry, Bilan } from "../../types/bilan";

export const bilanService = {
  async getTodayBilan(): Promise<Bilan> {
    try {
      const { data } = await api.get("/bilan/today");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch today's bilan");
      }
      throw new Error("Failed to fetch today's bilan");
    }
  },

  async getBilanByDate(date: string | Date): Promise<Bilan> {
    try {
      // Convert Date object to ISO string if needed
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const { data } = await api.get(`/bilan/date/${formattedDate}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch bilan for this date");
      }
      throw new Error("Failed to fetch bilan for this date");
    }
  },

  async getRecentBilans(limit = 7): Promise<Bilan[]> {
    try {
      const { data } = await api.get(`/bilan/recent?limit=${limit}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch recent bilans");
      }
      throw new Error("Failed to fetch recent bilans");
    }
  },

  async updateEntry(bilanId: string, taskId: string, minutesSpent: number, notes?: string): Promise<BilanEntry> {
    try {
      const { data } = await api.post("/bilan/entry", {
        bilanId,
        taskId,
        minutesSpent,
        notes
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to update bilan entry");
      }
      throw new Error("Failed to update bilan entry");
    }
  },

  async deleteEntry(entryId: string): Promise<void> {
    try {
      await api.delete(`/bilan/entry/${entryId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to delete bilan entry");
      }
      throw new Error("Failed to delete bilan entry");
    }
  }
}; 
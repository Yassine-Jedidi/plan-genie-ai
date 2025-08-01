import api from "@/components/api/api";
import { AxiosError } from "axios";
import { Task } from "../../types/task";

export interface TaskPrioritizationResult {
  prioritizedTasks: Task[];
  reasoning: Record<string, string>;
  estimatedTimePerTask: Record<string, string>;
  timeColors: Record<string, string>;
}

export const geminiService = {
  async getTaskPriorities(): Promise<TaskPrioritizationResult> {
    try {
      // Get user's language preference from localStorage
      const userLanguage = localStorage.getItem("i18nextLng") || "en";
      
      const { data } = await api.get("/tasks/priorities", {
        headers: {
          "Accept-Language": userLanguage,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to get task priorities");
      }
      throw new Error("Failed to get task priorities");
    }
  },
}; 
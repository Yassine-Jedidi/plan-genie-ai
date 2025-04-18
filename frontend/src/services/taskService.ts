import api from "@/components/api/api";
import { AxiosError } from "axios";
import { AnalysisResult } from "./nlpService";

export interface Task {
  id: string;
  title: string;
  deadline: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Event {
  id: string;
  title: string;
  date_time: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const taskService = {
  async saveTask(analysisResult: AnalysisResult): Promise<Task | Event> {
    try {
      const { data } = await api.post("/tasks/save", analysisResult);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to save task");
      }
      throw new Error("Failed to save task");
    }
  },

  async getTasks(): Promise<Task[]> {
    try {
      const { data } = await api.get("/tasks/tasks");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch tasks");
      }
      throw new Error("Failed to fetch tasks");
    }
  },

  async getEvents(userId: string): Promise<Event[]> {
    try {
      const { data } = await api.get(`/tasks/events/${userId}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch events");
      }
      throw new Error("Failed to fetch events");
    }
  },

  async getAllItems(userId: string): Promise<{ tasks: Task[], events: Event[] }> {
    try {
      const [tasksResponse, eventsResponse] = await Promise.all([
        this.getTasks(),
        this.getEvents(userId)
      ]);
      
      return {
        tasks: tasksResponse,
        events: eventsResponse
      };
    } catch {
      throw new Error("Failed to fetch all items");
    }
  }
}; 
import api from "@/components/api/api";
import { AxiosError } from "axios";
import { AnalysisResult } from "./nlpService";

export interface Event {
  id: string;
  title: string;
  date_time: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const eventService = {
  async saveEvent(analysisResult: AnalysisResult): Promise<Event> {
    try {
      const { data } = await api.post("/events/save", analysisResult);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to save event");
      }
      throw new Error("Failed to save event");
    }
  },

  async getEvents(userId: string): Promise<Event[]> {
    try {
      const { data } = await api.get(`/events/${userId}`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch events");
      }
      throw new Error("Failed to fetch events");
    }
  }
}; 
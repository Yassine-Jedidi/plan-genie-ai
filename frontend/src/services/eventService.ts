import api from "@/components/api/api";
import { AxiosError } from "axios";
import { AnalysisResult } from "./nlpService";

export interface Event {
  id: string;
  title: string;
  date_time: Date;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

export interface CalendarEvent {
  title: string;
  date_time: Date;
}

export interface CalendarEventForApi {
  title: string;
  date_time: string;
}

export interface UpdateEventData {
  title: string;
  date_time: string;
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
  },
  
  async createManualEvent(event: CalendarEventForApi): Promise<Event> {
    try {
      const { data } = await api.post("/events/manual", event);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to save event");
      }
      throw new Error("Failed to save event");
    }
  },

  async updateEvent(eventId: string, eventData: UpdateEventData): Promise<Event> {
    try {
      const { data } = await api.put(`/events/${eventId}`, eventData);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to update event");
      }
      throw new Error("Failed to update event");
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await api.delete(`/events/${eventId}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to delete event");
      }
      throw new Error("Failed to delete event");
    }
  },
};

import api from "@/components/api/api";
import { AxiosError } from "axios";
import { Task } from "./taskService";
import { Event } from "./eventService";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  scheduled_for?: string;
  user_id: string;
  task_id?: string;
  task?: Task;
  event_id?: string;
  event?: Event;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    try {
      const { data } = await api.get("/notifications");
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch notifications");
      }
      throw new Error("Failed to fetch notifications");
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    try {
      const { data } = await api.put(`/notifications/${notificationId}/read`);
      return data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to mark notification as read");
      }
      throw new Error("Failed to mark notification as read");
    }
  },
}; 
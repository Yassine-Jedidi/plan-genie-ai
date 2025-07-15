import api from "@/components/api/api";
import { AxiosError } from "axios";
import { Notification } from "../../types/notification";

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

  async updateNotificationPreferences(preferences: { receive_task_notifications?: boolean; receive_event_notifications?: boolean; }): Promise<void> {
    try {
      await api.put("/notifications/preferences", preferences);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to update notification preferences");
      }
      throw new Error("Failed to update notification preferences");
    }
  },

  async getNotificationPreferences(): Promise<{ receive_task_notifications: boolean; receive_event_notifications: boolean }> {
    try {
      const { data } = await api.get("/notifications/preferences");
      return {
        receive_task_notifications: data.receive_task_notifications,
        receive_event_notifications: data.receive_event_notifications,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        throw new Error(error.response.data?.error || "Failed to fetch notification preferences");
      }
      throw new Error("Failed to fetch notification preferences");
    }
  },
}; 
export interface Notification {
  id: string;
  title: string;
  time: string;
  type: string;
  read: boolean;
  created_at: string;
  scheduled_for?: string;
  user_id: string;
  task_id?: string;
  task?: import('./task').Task;
  event_id?: string;
  event?: import('./event').Event;
} 
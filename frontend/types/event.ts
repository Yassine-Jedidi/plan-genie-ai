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
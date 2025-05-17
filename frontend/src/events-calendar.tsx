"use client";

import { FullScreenCalendar } from "@/components/ui/calendar";
import { SidebarTrigger } from "./components/ui/sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { eventService, Event } from "@/services/eventService";

function groupEventsByDay(events: Event[]): { day: Date; events: Event[] }[] {
  const map = new Map<string, { day: Date; events: Event[] }>();
  events.forEach((event) => {
    const dateStr = new Date(event.date_time).toDateString();
    if (!map.has(dateStr)) {
      map.set(dateStr, { day: new Date(event.date_time), events: [] });
    }
    map.get(dateStr)!.events.push(event);
  });
  return Array.from(map.values());
}

function EventsCalendar() {
  const { user, loading: authLoading } = useAuth();
  const [calendarData, setCalendarData] = useState<
    { day: Date; events: Event[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    eventService
      .getEvents(user.id)
      .then((events) => setCalendarData(groupEventsByDay(events)))
      .catch((err) => setError(err.message || "Failed to load events"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="flex h-screen flex-1 flex-col scale-90">
        {authLoading || loading ? (
          <div className="flex items-center justify-center h-full">
            Loading events...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
          <FullScreenCalendar data={calendarData} />
        )}
      </div>
    </>
  );
}

export { EventsCalendar };

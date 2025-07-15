import { FullScreenCalendar } from "@/components/events/calendar";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { eventService, Event } from "@/services/eventService";
import { CalendarSkeleton } from "@/components/events/calendar-skeleton";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const fetchEvents = () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    eventService
      .getEvents(user.id)
      .then((events) => setCalendarData(groupEventsByDay(events)))
      .catch((err) =>
        setError(err.message || t("eventsCalendar.failedToLoadEvents"))
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  return (
    <>
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>
      <div className="flex h-screen flex-1 flex-col scale-90">
        {authLoading || loading ? (
          <CalendarSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {t("eventsCalendar.failedToLoadEvents")}
          </div>
        ) : (
          <FullScreenCalendar data={calendarData} onEventChange={fetchEvents} />
        )}
      </div>
    </>
  );
}

export { EventsCalendar };

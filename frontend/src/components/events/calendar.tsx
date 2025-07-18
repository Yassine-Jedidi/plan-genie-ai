import * as React from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn, formatTime } from "@/lib/dateUtils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { eventService } from "@/services/eventService";
import { Event, CalendarEvent } from "../../../types/event";
import { EventDialog } from "@/components/events/event-dialog";
import { EditEventDialog } from "@/components/events/edit-event-dialog";
import { Calendar } from "@/components/tasks/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CalendarData {
  day: Date;
  events: Event[];
}

interface FullScreenCalendarProps {
  data: CalendarData[];
  onEventChange?: () => void;
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export function FullScreenCalendar({
  data,
  onEventChange,
}: FullScreenCalendarProps) {
  const { t } = useTranslation();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy")
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = React.useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] =
    React.useState(false);
  const [eventToEdit, setEventToEdit] = React.useState<Event | null>(null);
  const [newEvent, setNewEvent] = React.useState<CalendarEvent>({
    title: "",
    date_time: new Date(),
  });
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
  }

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };

  const handleNewEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    console.log("newEvent.date_time before sending:", newEvent.date_time);

    eventService
      .createManualEvent({
        ...newEvent,
        date_time: newEvent.date_time.toISOString(),
      })
      .then(() => {
        setIsLoading(false);
        toast.success("Event created successfully");
        console.log("Event created successfully", newEvent);
        setIsNewEventDialogOpen(false);
        setNewEvent({ title: "", date_time: new Date() });
        if (onEventChange) {
          onEventChange();
        }
      })
      .catch((error: Error) => {
        toast.error("Failed to create event: " + error.message);
        setIsLoading(false);
      });
  };

  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setIsEditEventDialogOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      toast.success("Event deleted successfully");
      if (onEventChange) {
        onEventChange();
      }
    } catch (error) {
      toast.error(
        `Failed to delete event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleEventUpdated = () => {
    if (onEventChange) {
      onEventChange();
    }
  };

  const filteredData = React.useMemo(() => {
    if (!searchQuery) {
      return data;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    return data.map((dayData) => ({
      ...dayData,
      events: dayData.events.filter((event) =>
        event.title.toLowerCase().includes(lowerCaseQuery)
      ),
    }));
  }, [data, searchQuery]);

  const selectedDayEvents =
    filteredData.find((d) => isSameDay(d.day, selectedDay))?.events || [];

  return (
    <div className="flex flex-1 flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM")}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="relative w-full lg:w-60">
            <SearchIcon
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder={t("calendar.searchEvents")}
              className="w-full ps-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label={t("calendar.prevMonth")}
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button onClick={goToToday} variant="outline">
              {t("calendar.today")}
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label={t("calendar.nextMonth")}
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Separator
            orientation="horizontal"
            className="block w-full md:hidden"
          />

          <Button
            className="w-full gap-2 md:w-auto"
            onClick={() => setIsNewEventDialogOpen(true)}
          >
            <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span>{t("calendar.newEvent")}</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r py-2.5">{t("calendar.sun")}</div>
          <div className="border-r py-2.5">{t("calendar.mon")}</div>
          <div className="border-r py-2.5">{t("calendar.tue")}</div>
          <div className="border-r py-2.5">{t("calendar.wed")}</div>
          <div className="border-r py-2.5">{t("calendar.thu")}</div>
          <div className="border-r py-2.5">{t("calendar.fri")}</div>
          <div className="py-2.5">{t("calendar.sat")}</div>
        </div>

        {/* Calendar Days */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) =>
              !isMobile ? (
                <div
                  key={dayIdx}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "bg-accent/50 text-muted-foreground",
                    "relative flex flex-col border-b border-r hover:bg-muted focus:z-10 cursor-pointer",
                    !isEqual(day, selectedDay) && "hover:bg-accent/75"
                  )}
                >
                  <header className="flex items-center justify-between p-2.5">
                    <button
                      type="button"
                      className={cn(
                        isEqual(day, selectedDay) && "text-primary-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-foreground",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-muted-foreground",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "border-none bg-primary",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-foreground",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>
                  </header>
                  <div className="flex-1 p-2.5">
                    {filteredData
                      .filter((event) => isSameDay(event.day, day))
                      .map((day) => (
                        <div key={day.day.toString()} className="space-y-1.5">
                          {day.events.slice(0, 1).map((event) => (
                            <div
                              key={event.id}
                              className="flex flex-col items-start gap-1 rounded-lg border bg-muted/50 p-2 text-xs leading-tight"
                            >
                              <p className="font-medium leading-none">
                                {event.title}
                              </p>
                              <p className="leading-none text-muted-foreground">
                                {formatTime(event.date_time)}
                              </p>
                            </div>
                          ))}
                          {day.events.length > 1 && (
                            <div className="text-xs text-muted-foreground">
                              + {day.events.length - 1} more
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleDayClick(day)}
                  key={dayIdx}
                  type="button"
                  className={cn(
                    isEqual(day, selectedDay) && "text-primary-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-foreground",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-muted-foreground",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10"
                  )}
                >
                  <time
                    dateTime={format(day, "yyyy-MM-dd")}
                    className={cn(
                      "ml-auto flex size-6 items-center justify-center rounded-full",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-primary text-primary-foreground",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-primary text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </time>
                  {filteredData.filter((date) => isSameDay(date.day, day))
                    .length > 0 && (
                    <div>
                      {filteredData
                        .filter((date) => isSameDay(date.day, day))
                        .map((date) => (
                          <div
                            key={date.day.toString()}
                            className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                          >
                            {date.events.map((event) => (
                              <span
                                key={event.id}
                                className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                                title={`${event.title} @ ${new Date(
                                  event.date_time
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`}
                              />
                            ))}
                          </div>
                        ))}
                    </div>
                  )}
                </button>
              )
            )}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
            {days.map((day, dayIdx) => (
              <button
                onClick={() => handleDayClick(day)}
                key={dayIdx}
                type="button"
                className={cn(
                  isEqual(day, selectedDay) && "text-primary-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-foreground",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-muted-foreground",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10"
                )}
              >
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "ml-auto flex size-6 items-center justify-center rounded-full",
                    isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "bg-primary text-primary-foreground",
                    isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </time>
                {filteredData.filter((date) => isSameDay(date.day, day))
                  .length > 0 && (
                  <div>
                    {filteredData
                      .filter((date) => isSameDay(date.day, day))
                      .map((date) => (
                        <div
                          key={date.day.toString()}
                          className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                        >
                          {date.events.map((event) => (
                            <span
                              key={event.id}
                              className="mx-0.5 mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground"
                              title={`${event.title} @ ${new Date(
                                event.date_time
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`}
                            />
                          ))}
                        </div>
                      ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={selectedDay}
        events={selectedDayEvents}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <EditEventDialog
        isOpen={isEditEventDialogOpen}
        onClose={() => setIsEditEventDialogOpen(false)}
        event={eventToEdit}
        onEventUpdated={handleEventUpdated}
      />

      <Dialog
        open={isNewEventDialogOpen}
        onOpenChange={setIsNewEventDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleNewEventSubmit}>
            <DialogHeader>
              <DialogTitle>{t("calendar.createNewEvent")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  {t("calendar.title")}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-5">
                <Label className="text-right pt-2">
                  {t("calendar.dateTime")}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="col-span-3">
                  <div className="rounded-lg border border-border">
                    <Calendar
                      mode="single"
                      className="p-2 bg-background"
                      selected={newEvent.date_time}
                      onSelect={(date) =>
                        date &&
                        setNewEvent((prev) => {
                          const newDateTime = new Date(date);
                          newDateTime.setHours(
                            prev.date_time.getHours(),
                            prev.date_time.getMinutes(),
                            0,
                            0
                          );
                          return { ...prev, date_time: newDateTime };
                        })
                      }
                    />
                    <div className="border-t border-border p-3">
                      <div className="flex items-center gap-3">
                        <Label htmlFor="event-time" className="text-xs">
                          {t("calendar.enterTime")}
                        </Label>
                        <div className="relative grow">
                          <Input
                            id="event-time"
                            type="time"
                            value={`${String(
                              newEvent.date_time.getHours()
                            ).padStart(2, "0")}:${String(
                              newEvent.date_time.getMinutes()
                            ).padStart(2, "0")}`}
                            className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                            onChange={(e) => {
                              const [hours, minutes] = e.target.value
                                .split(":")
                                .map(Number);
                              const newDateTime = new Date(newEvent.date_time);
                              newDateTime.setHours(hours, minutes, 0, 0);
                              setNewEvent({
                                ...newEvent,
                                date_time: newDateTime,
                              });
                            }}
                          />
                          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <Clock
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewEventDialogOpen(false)}
              >
                {t("calendar.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    {t("calendar.creating")}
                  </>
                ) : (
                  t("calendar.createEvent")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

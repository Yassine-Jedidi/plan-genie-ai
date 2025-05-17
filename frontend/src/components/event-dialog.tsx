import { format } from "date-fns";
import { Event } from "@/services/eventService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock } from "lucide-react";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  events: Event[];
}

export function EventDialog({
  isOpen,
  onClose,
  selectedDate,
  events,
}: EventDialogProps) {
  // Group events by morning, afternoon, evening
  const groupedEvents = {
    morning: events.filter((event) => {
      const hour = new Date(event.date_time).getHours();
      return hour >= 5 && hour < 12;
    }),
    afternoon: events.filter((event) => {
      const hour = new Date(event.date_time).getHours();
      return hour >= 12 && hour < 17;
    }),
    evening: events.filter((event) => {
      const hour = new Date(event.date_time).getHours();
      return hour >= 17 || hour < 5;
    }),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 rounded-lg overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {format(selectedDate, "MMMM d, yyyy")}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {events.length === 1
                  ? "1 event scheduled"
                  : `${events.length} events scheduled`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          defaultValue={events.length > 0 ? "view" : "empty"}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-none border-y">
            <TabsTrigger
              value="view"
              disabled={events.length === 0}
              className="data-[state=active]:bg-background"
            >
              View Events
            </TabsTrigger>
            <TabsTrigger
              value="empty"
              disabled={events.length > 0}
              className="data-[state=active]:bg-background"
            >
              No Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="p-0 m-0">
            <ScrollArea className="h-[450px]">
              <div className="relative py-6">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 h-full w-px bg-border" />

                <div className="space-y-8 px-6">
                  {Object.entries(groupedEvents).map(
                    ([time, timeEvents]) =>
                      timeEvents.length > 0 && (
                        <div key={time} className="relative">
                          <h3 className="mb-4 ml-12 font-medium text-muted-foreground capitalize">
                            {time}
                          </h3>

                          <div className="space-y-6">
                            {timeEvents.map((event) => (
                              <div key={event.id} className="relative group">
                                {/* Timeline dot */}
                                <div className="absolute left-6 -translate-x-1/2 top-6">
                                  <div
                                    className="h-5 w-5 rounded-full border-2 border-primary bg-background 
                                  group-hover:scale-110 transition-transform"
                                  />
                                </div>

                                {/* Event card */}
                                <div className="ml-12">
                                  <Card
                                    className="group overflow-hidden transition-all 
                                  hover:shadow-md hover:border-primary/50"
                                  >
                                    <CardHeader className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <h4 className="font-semibold text-base">
                                            {event.title}
                                          </h4>
                                          <CardDescription className="flex items-center mt-1 gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>
                                              {format(
                                                new Date(event.date_time),
                                                "h:mm a"
                                              )}
                                            </span>
                                          </CardDescription>
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="empty" className="p-0 m-0">
            <div className="flex flex-col items-center justify-center p-12 gap-4 h-[300px]">
              <div className="rounded-full bg-muted p-4">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-medium text-lg">No events scheduled</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  There are no events scheduled for{" "}
                  {format(selectedDate, "MMMM d, yyyy")}.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

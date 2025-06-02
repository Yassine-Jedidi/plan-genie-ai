import { format } from "date-fns";
import { Event } from "@/services/eventService";
import { motion, AnimatePresence } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  events: Event[];
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const timeSlotVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export function EventDialog({
  isOpen,
  onClose,
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
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

  // Get time period colors
  const getTimeColor = (period: string) => {
    switch (period) {
      case "morning":
        return "bg-amber-500";
      case "afternoon":
        return "bg-sky-500";
      case "evening":
        return "bg-indigo-500";
      default:
        return "bg-zinc-500";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[550px] p-0 rounded-lg overflow-hidden border-none shadow-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-bl from-background to-muted">
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {format(selectedDate, "MMMM d, yyyy")}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {events.length === 1
                          ? "1 event scheduled"
                          : `${events.length} events scheduled`}
                      </span>
                    </DialogDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-base font-medium border-primary bg-primary/10"
                  >
                    {format(selectedDate, "EEEE")}
                  </Badge>
                </div>
              </DialogHeader>

              {events.length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <div className="relative py-8">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 h-full w-px bg-border" />

                    <motion.div
                      className="space-y-8 px-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {Object.entries(groupedEvents).map(
                        ([time, timeEvents]) =>
                          timeEvents.length > 0 && (
                            <motion.div
                              key={time}
                              className="relative"
                              variants={timeSlotVariants}
                            >
                              <div className="flex items-center mb-5 ml-12">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    getTimeColor(time)
                                  )}
                                ></div>
                                <h3 className="font-medium text-muted-foreground capitalize">
                                  {time}
                                </h3>
                              </div>

                              <motion.div
                                className="space-y-6"
                                variants={containerVariants}
                              >
                                {timeEvents.map((event) => (
                                  <motion.div
                                    key={event.id}
                                    className="relative group"
                                    variants={itemVariants}
                                    whileHover={{ y: -2 }}
                                  >
                                    {/* Timeline dot - now centered vertically */}
                                    <div className="absolute left-6 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
                                      <motion.div
                                        className={cn(
                                          "flex items-center justify-center"
                                        )}
                                        whileHover={{ scale: 1.2 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 400,
                                          damping: 10,
                                        }}
                                      >
                                        <div
                                          className={cn(
                                            "h-2 w-2 rounded-full",
                                            getTimeColor(time)
                                          )}
                                        ></div>
                                      </motion.div>
                                    </div>

                                    {/* Event card */}
                                    <div className="ml-12">
                                      <Card
                                        className="group overflow-hidden transition-all border-border/50
                                        hover:shadow-md hover:border-primary/50 relative"
                                      >
                                        <div
                                          className={cn(
                                            "absolute h-full w-1 left-0",
                                            getTimeColor(time)
                                          )}
                                        />
                                        <CardHeader className="p-4 pb-2">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-semibold text-base line-clamp-1">
                                                {event.title}
                                              </h4>
                                              <CardDescription className="flex items-center mt-1 gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>
                                                  {format(
                                                    new Date(event.date_time),
                                                    "HH:mm"
                                                  )}
                                                </span>
                                              </CardDescription>
                                            </div>

                                            {/* Action buttons positioned at top right */}
                                            <div className="flex items-center gap-1">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full hover:bg-primary/10"
                                                onClick={() => {
                                                  if (onEditEvent) {
                                                    onEditEvent(event);
                                                  } else {
                                                    console.log(
                                                      "Edit event handler not provided for:",
                                                      event.id
                                                    );
                                                  }
                                                }}
                                              >
                                                <Pencil className="h-3.5 w-3.5" />
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive"
                                                onClick={() => {
                                                  if (onDeleteEvent) {
                                                    onDeleteEvent(event.id);
                                                  } else {
                                                    console.log(
                                                      "Delete event handler not provided for:",
                                                      event.id
                                                    );
                                                  }
                                                }}
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                            </div>
                                          </div>
                                        </CardHeader>
                                      </Card>
                                    </div>
                                  </motion.div>
                                ))}
                              </motion.div>
                            </motion.div>
                          )
                      )}
                    </motion.div>
                  </div>
                </ScrollArea>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center p-12 gap-4 h-[300px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="rounded-full bg-muted p-4"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <div className="text-center space-y-2">
                    <h3 className="font-medium text-lg">No events scheduled</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      There are no events scheduled for{" "}
                      {format(selectedDate, "MMMM d, yyyy")}.
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

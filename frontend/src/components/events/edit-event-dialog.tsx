import { useState, useEffect } from "react";
import { Event } from "@/services/eventService";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Loader2 } from "lucide-react";
import { eventService } from "@/services/eventService";

interface EditEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  onEventUpdated: () => void;
}

export function EditEventDialog({
  isOpen,
  onClose,
  event,
  onEventUpdated,
}: EditEventDialogProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date_time: new Date(),
  });

  // Update form data when event changes
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date_time: new Date(event.date_time),
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event || !formData.title || !formData.date_time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await eventService.updateEvent(event.id, {
        title: formData.title,
        date_time: formData.date_time.toISOString(),
      });

      toast.success("Event updated successfully");
      onEventUpdated();
      onClose();
    } catch (error) {
      toast.error(
        `Failed to update event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original event data
    if (event) {
      setFormData({
        title: event.title,
        date_time: new Date(event.date_time),
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("calendar.editEvent")}</DialogTitle>
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
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
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
                    selected={formData.date_time}
                    onSelect={(date) =>
                      date &&
                      setFormData((prev) => {
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
                            formData.date_time.getHours()
                          ).padStart(2, "0")}:${String(
                            formData.date_time.getMinutes()
                          ).padStart(2, "0")}`}
                          className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value
                              .split(":")
                              .map(Number);
                            const newDateTime = new Date(formData.date_time);
                            newDateTime.setHours(hours, minutes, 0, 0);
                            setFormData({
                              ...formData,
                              date_time: newDateTime,
                            });
                          }}
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                          <Clock size={16} strokeWidth={2} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t("calendar.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  {t("calendar.updating")}
                </>
              ) : (
                t("calendar.updateEvent")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

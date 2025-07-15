import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "./date-time-picker";
import { Clock } from "lucide-react";
import React from "react";
import { Task } from "types/task";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  loading: boolean;
  onSubmit: () => void;
  t: (key: string) => string;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  onOpenChange,
  selectedTask,
  setSelectedTask,
  loading,
  onSubmit,
  t,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={() => onOpenChange(false)}
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>{t("tasksTable.editTask")}</DialogTitle>
          <DialogDescription>{t("tasksTable.edit")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title">{t("tasksTable.title")}</Label>
            <Input
              id="edit-title"
              placeholder="Enter task title"
              value={selectedTask?.title || ""}
              onChange={(e) =>
                setSelectedTask((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-priority">{t("tasksTable.priority")}</Label>
            <Select
              value={selectedTask?.priority || ""}
              onValueChange={(value) =>
                setSelectedTask((prev) =>
                  prev ? { ...prev, priority: value } : null
                )
              }
            >
              <SelectTrigger id="edit-priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-status">{t("tasksTable.status")}</Label>
            <Select
              value={selectedTask?.status || ""}
              onValueChange={(value) =>
                setSelectedTask((prev) =>
                  prev ? { ...prev, status: value } : null
                )
              }
            >
              <SelectTrigger id="edit-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-deadline">{t("tasksTable.deadline")}</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Calendar
                mode="single"
                selected={
                  selectedTask?.deadline
                    ? new Date(selectedTask.deadline)
                    : new Date()
                }
                onSelect={(date: Date | undefined) => {
                  const newDateTime = date || new Date();
                  setSelectedTask((prev) => {
                    if (prev && prev.deadline) {
                      const existingDate = new Date(prev.deadline);
                      newDateTime.setHours(
                        existingDate.getHours(),
                        existingDate.getMinutes(),
                        existingDate.getSeconds(),
                        existingDate.getMilliseconds()
                      );
                    }
                    return prev ? { ...prev, deadline: newDateTime } : null;
                  });
                }}
                initialFocus
              />
              <div className="flex items-center gap-3">
                <div className="relative grow">
                  <Input
                    id="edit-task-time"
                    type="time"
                    value={
                      selectedTask?.deadline
                        ? `${String(
                            new Date(selectedTask.deadline).getHours()
                          ).padStart(2, "0")}:${String(
                            new Date(selectedTask.deadline).getMinutes()
                          ).padStart(2, "0")}`
                        : "00:00"
                    }
                    className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      setSelectedTask((prev) => {
                        if (!prev) return null;
                        const newDateTime = prev.deadline
                          ? new Date(prev.deadline)
                          : new Date();
                        newDateTime.setHours(hours, minutes, 0, 0);
                        return { ...prev, deadline: newDateTime };
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
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedTask(null);
            }}
          >
            {t("tasksTable.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {!loading ? t("tasksTable.saveChanges") : t("tasksTable.saving")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

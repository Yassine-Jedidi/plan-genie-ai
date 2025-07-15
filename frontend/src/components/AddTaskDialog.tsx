import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
import { Clock, Plus } from "lucide-react";
import React from "react";

export interface TaskFormData {
  title: string;
  priority: string;
  status: string;
  deadline: Date;
}

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  loading: boolean;
  onSubmit: () => void;
  t: (key: string) => string;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onOpenChange,
  formData,
  setFormData,
  loading,
  onSubmit,
  t,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-primary/80">
          <Plus
            className="-ms-1 me-2"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
          {t("tasksTable.newTask")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={() => onOpenChange(false)}
        onPointerDownOutside={() => onOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle>{t("tasksTable.addNewTask")}</DialogTitle>
          <DialogDescription>{t("tasksTable.createTask")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              {t("tasksTable.title")}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">
              {t("tasksTable.priority")}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger id="priority">
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
            <Label htmlFor="deadline">
              {t("tasksTable.deadline")}
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Calendar
                mode="single"
                selected={formData.deadline}
                onSelect={(date: Date | undefined) => {
                  const newDateTime = date || new Date();
                  if (formData.deadline) {
                    newDateTime.setHours(
                      formData.deadline.getHours(),
                      formData.deadline.getMinutes(),
                      formData.deadline.getSeconds(),
                      formData.deadline.getMilliseconds()
                    );
                  }
                  setFormData((prev) => ({
                    ...prev,
                    deadline: newDateTime,
                  }));
                }}
                initialFocus
              />
              <div className="flex items-center gap-3">
                <div className="relative grow">
                  <Input
                    id="task-time"
                    type="time"
                    value={`${String(formData.deadline.getHours()).padStart(
                      2,
                      "0"
                    )}:${String(formData.deadline.getMinutes()).padStart(
                      2,
                      "0"
                    )}`}
                    className="peer ps-9 [&::-webkit-calendar-picker-indicator]:hidden"
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      const newDateTime = new Date(formData.deadline);
                      newDateTime.setHours(hours, minutes, 0, 0);
                      setFormData((prev) => ({
                        ...prev,
                        deadline: newDateTime,
                      }));
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
              setFormData({
                title: "",
                priority: "",
                status: "",
                deadline: new Date(),
              });
            }}
          >
            {t("tasksTable.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {!loading ? t("tasksTable.createTask") : t("tasksTable.creating")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;

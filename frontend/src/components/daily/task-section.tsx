import React from "react";
import { Task } from "types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Clock, CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";
import TimeEntryForm from "./time-entry-form";

interface TaskSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  borderColor: string;
  headerBgColor: string;
  tasks: Task[];
  selectedDate: Date;
  editingTaskId: string | null;
  timeInput: string;
  notesInput: string;
  isSaving: boolean;
  isDateToday: (date: Date) => boolean;
  onStartEditing: (taskId: string) => void;
  onCancelEditing: () => void;
  onTimeInputChange: (value: string) => void;
  onNotesInputChange: (value: string) => void;
  onSaveTimeEntry: (taskId: string) => void;
  onMarkTaskAsDone: (task: Task) => void;
  formatDeadline: (deadline: Date | null) => string | null;
}

const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  description,
  icon,
  borderColor,
  headerBgColor,
  tasks,
  selectedDate,
  editingTaskId,
  timeInput,
  notesInput,
  isSaving,
  isDateToday,
  onStartEditing,
  onCancelEditing,
  onTimeInputChange,
  onNotesInputChange,
  onSaveTimeEntry,
  onMarkTaskAsDone,
  formatDeadline,
}) => {
  const { t } = useTranslation();

  if (tasks.length === 0) return null;

  return (
    <Card className={`mt-8 ${borderColor}`}>
      <CardHeader className={`${headerBgColor} rounded-t-lg`}>
        <CardTitle className="text-xl flex items-center">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("bilan.task")}</TableHead>
              <TableHead>{t("bilan.deadline")}</TableHead>
              <TableHead>{t("bilan.priority")}</TableHead>
              <TableHead>{t("bilan.status")}</TableHead>
              <TableHead className="text-right">{t("bilan.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <React.Fragment key={task.id}>
                <TableRow>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-800 border-slate-300"
                    >
                      {formatDeadline(task.deadline) || "No deadline"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.priority ? (
                      <Badge
                        variant="outline"
                        className={cn(
                          task.priority === "High" &&
                            "bg-red-100 text-red-800 border-red-300",
                          task.priority === "Medium" &&
                            "bg-yellow-100 text-yellow-800 border-yellow-300",
                          task.priority === "Low" &&
                            "bg-green-100 text-green-800 border-green-300"
                        )}
                      >
                        {task.priority === "High" && t("bilan.priorityHigh")}
                        {task.priority === "Medium" &&
                          t("bilan.priorityMedium")}
                        {task.priority === "Low" && t("bilan.priorityLow")}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("bilan.none")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        task.status === "Done" &&
                          "bg-green-100 text-green-800 border-green-300",
                        task.status === "In Progress" &&
                          "bg-orange-100 text-orange-800 border-orange-300",
                        (!task.status || task.status === "Planned") &&
                          "bg-gray-100 text-gray-800 border-gray-300"
                      )}
                    >
                      {t(`bilan.${task.status || "planned"}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingTaskId === task.id ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancelEditing}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t("bilan.cancel")}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStartEditing(task.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t("bilan.addTime")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkTaskAsDone(task)}
                          disabled={!isDateToday(selectedDate)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t("bilan.markAsDone")}
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {editingTaskId === task.id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <TimeEntryForm
                        timeInput={timeInput}
                        notesInput={notesInput}
                        isSaving={isSaving}
                        onTimeInputChange={onTimeInputChange}
                        onNotesInputChange={onNotesInputChange}
                        onCancel={onCancelEditing}
                        onSave={() => onSaveTimeEntry(task.id)}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskSection;

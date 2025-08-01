import React from "react";
import { Bilan } from "types/bilan";
import { Task } from "types/task";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Clock, AlertCircle, Pencil, Save, X, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface BilanTaskTableProps {
  bilan: Bilan;
  totalMinutes: number;
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
  onDeleteTimeEntry: (entryId: string) => void;
  formatTime: (minutes: number) => string;
}

const BilanTaskTable: React.FC<BilanTaskTableProps> = ({
  bilan,
  totalMinutes,
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
  onDeleteTimeEntry,
  formatTime,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="border-green-300">
      <CardHeader className="bg-green-50 dark:bg-green-950/40 rounded-t-lg">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2 text-green-600" />
          <div className="flex justify-between items-center w-full">
            <span>{t("bilan.dailyTasks")}</span>
            <Badge variant="secondary">
              {t("bilan.total")}: {formatTime(totalMinutes)}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>{t("bilan.trackTime")}</CardDescription>
      </CardHeader>
      <CardContent>
        {bilan.entries.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <AlertCircle className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>{t("bilan.noTasks")}</p>
            {isDateToday(new Date()) && (
              <p className="text-sm">{t("bilan.addTimeToTasksBelow")}</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("bilan.task")}</TableHead>
                <TableHead>{t("bilan.timeSpent")}</TableHead>
                <TableHead>{t("bilan.notes")}</TableHead>
                <TableHead className="text-right">
                  {t("bilan.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bilan.entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.task?.title || "Unknown Task"}
                  </TableCell>
                  <TableCell>
                    {editingTaskId === entry.task_id ? (
                      <Input
                        value={timeInput}
                        onChange={(e) => onTimeInputChange(e.target.value)}
                        placeholder="e.g., 1h 30m"
                        className="w-24"
                      />
                    ) : (
                      formatTime(entry.minutes_spent)
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    {editingTaskId === entry.task_id ? (
                      <Textarea
                        value={notesInput}
                        onChange={(e) => onNotesInputChange(e.target.value)}
                        placeholder="Optional notes about your work"
                        className="min-h-[80px]"
                      />
                    ) : (
                      entry.notes || (
                        <span className="text-muted-foreground italic">
                          {t("bilan.noNotes")}
                        </span>
                      )
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingTaskId === entry.task_id ? (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onCancelEditing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          {t("bilan.cancel")}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onSaveTimeEntry(entry.task_id)}
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                              {t("bilan.saving")}
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              {t("bilan.save")}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStartEditing(entry.task_id)}
                          disabled={!isDateToday(new Date())}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          {t("bilan.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onMarkTaskAsDone(entry.task!)}
                          disabled={
                            !isDateToday(new Date()) ||
                            entry.task?.status === "Done"
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t("bilan.markAsDone")}
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => onDeleteTimeEntry(entry.id)}
                                disabled={!isDateToday(new Date())}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("bilan.deleteTimeEntry")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default BilanTaskTable;

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Check, Trash, CircleAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Task, taskService } from "@/services/taskService";
import { toast } from "sonner";
import { Row, Table } from "@tanstack/react-table";

interface TaskRowActionsProps {
  row: Row<Task>;
  setSelectedTask: (task: Task) => void;
  setEditTaskDialogOpen: (open: boolean) => void;
  setLocalTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  fetchTasks: () => void;
  t: (key: string) => string;
  table: Table<Task>;
}

const TaskRowActions: React.FC<TaskRowActionsProps> = ({
  row,
  setSelectedTask,
  setEditTaskDialogOpen,
  setLocalTasks,
  fetchTasks,
  t,
  table,
}) => {
  const task = row.original;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(task.id);
      window.dispatchEvent(new CustomEvent("taskDeleted", { detail: task.id }));
      table.resetRowSelection();
      setDeleteConfirmOpen(false);
      setDropdownOpen(false);
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleMarkAsDone = async (taskToUpdate: Task) => {
    if (taskToUpdate) {
      try {
        if (taskToUpdate.status === "Done")
          toast.error(t("tasksTable.actions.taskAlreadyDone"));
        else {
          const updatedTask = await taskService.updateTask({
            ...taskToUpdate,
            status: "Done",
            completed_at: new Date().toISOString(),
          });
          setLocalTasks((prev) =>
            prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
          );
          fetchTasks();
          toast.success(t("tasksTable.actions.taskMarkedDone"));
          setDropdownOpen(false);
        }
      } catch (error) {
        console.error("Error marking task as done:", error);
        toast.error(t("tasksTable.actions.failedToMarkDone"));
      }
    }
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit task"
          >
            <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setSelectedTask(task);
              setEditTaskDialogOpen(true);
              setDropdownOpen(false);
            }}
          >
            <Pencil
              className="me-2 h-4 w-4 text-yellow-500"
              aria-hidden="true"
            />
            <span className="text-yellow-500">
              {t("tasksTable.actions.edit")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleMarkAsDone(task)}>
            <Check className="me-2 h-4 w-4 text-green-500" aria-hidden="true" />
            <span className="text-green-500">
              {t("tasksTable.actions.markAsDone")}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <AlertDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
        >
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={(e) => {
                e.preventDefault();
                setDeleteConfirmOpen(true);
              }}
            >
              <Trash className="me-2 h-4 w-4 text-red-500" aria-hidden="true" />
              <span className="text-red-500">
                {t("tasksTable.actions.delete")}
              </span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("tasksTable.actions.areYouSure")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("tasksTable.actions.deleteWarning")}
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("tasksTable.actions.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                {t("tasksTable.actions.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskRowActions;

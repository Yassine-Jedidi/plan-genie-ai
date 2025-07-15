import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kanban";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import type { FC } from "react";
import { Task, taskService } from "../../services/taskService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
// Make sure you have this import for DndContext if needed
// import { DndContext } from '@dnd-kit/core';

// Tasks per page for pagination
const TASKS_PER_PAGE = 4;

interface TasksKanbanProps {
  tasks?: Task[];
}

const TasksKanban: FC<TasksKanbanProps> = ({ tasks = [] }) => {
  const { t } = useTranslation();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    Planned: 1,
    "In Progress": 1,
    Done: 1,
  });

  // Define statuses and priorityColors after t is available
  const statuses = [
    {
      id: "1",
      value: "Planned",
      label: t("tasksKanban.planned"),
      color: "#6B7280",
    },
    {
      id: "2",
      value: "In Progress",
      label: t("tasksKanban.inProgress"),
      color: "#F59E0B",
    },
    { id: "3", value: "Done", label: t("tasksKanban.done"), color: "#10B981" },
  ];

  const priorityColors: Record<string, string> = {
    Low: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    High: "bg-red-100 text-red-800 border-red-300",
  };

  // Use passed tasks or fetch them if not provided
  useEffect(() => {
    if (tasks.length > 0) {
      setLocalTasks(tasks);
      setLoadingTasks(false);
    } else {
      const fetchTasks = async () => {
        try {
          setLoadingTasks(true);
          const fetchedTasks = await taskService.getTasks();
          setLocalTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          toast.error(t("tasksKanban.failedToLoad"));
        } finally {
          setLoadingTasks(false);
        }
      };
      fetchTasks();
    }
  }, [tasks]);

  // Function to handle drag and drop
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((status) => status.value === over.id);

    if (!status) {
      return;
    }

    // Find the actual task object that's being dragged
    const draggedTask = localTasks.find((task) => task.id === active.id);
    if (!draggedTask) {
      console.error("Could not find the dragged task", active.id);
      return;
    }

    // If the task is already in this status, do nothing to prevent spam
    if (draggedTask.status === status.value) {
      console.log("Task already in this status, ignoring drop");
      return;
    }

    console.log("Updating task:", draggedTask.id, "to status:", status.value);

    // Update local state first (optimistic update)
    setLocalTasks(
      localTasks.map((task) => {
        if (task.id === draggedTask.id) {
          return { ...task, status: status.value };
        }
        return task;
      })
    );

    try {
      // The taskId must be a string from the actual task
      await taskService.updateTask({ ...draggedTask, status: status.value });
      console.log("Backend update successful for task ID:", draggedTask.id);
      toast.success(t("tasksKanban.moveSuccess", { status: status.label }), {
        duration: 1000,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error(t("tasksKanban.moveError"));

      // Revert the UI change if the API call fails
      setLocalTasks(localTasks);
    }
  };

  // Map tasks to statuses with pagination
  const getTasksByStatus = (statusValue: string) => {
    // Get tasks with matching status
    const tasksWithStatus = localTasks.filter(
      (task) => task.status === statusValue
    );

    // Get current page for this status
    const page = currentPage[statusValue] || 1;

    // Calculate pagination
    const startIndex = (page - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;

    return {
      tasks: tasksWithStatus.slice(startIndex, endIndex),
      totalTasks: tasksWithStatus.length,
      totalPages: Math.ceil(tasksWithStatus.length / TASKS_PER_PAGE),
    };
  };

  const handlePageChange = (statusValue: string, newPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [statusValue]: newPage,
    }));
  };

  // Loading skeleton component
  if (loadingTasks) {
    return (
      <div className="flex flex-1 gap-4 overflow-auto">
        {statuses.map((status) => (
          <div key={status.id} className="flex-1 space-y-4 min-w-64">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Key fix: Use a fixed height container without nested overflow scrolls */}
      <div className="h-full">
        <KanbanProvider onDragEnd={handleDragEnd} className="flex h-full gap-4">
          {statuses.map((status) => {
            const {
              tasks: statusTasks,
              totalTasks,
              totalPages,
            } = getTasksByStatus(status.value);
            const currentStatusPage = currentPage[status.value] || 1;

            return (
              <KanbanBoard
                key={status.value}
                id={status.value}
                className="flex-1 min-w-[280px] flex flex-col h-full bg-primary/10 dark:bg-primary/20"
              >
                {/* Header section */}
                <div className="mb-2">
                  <KanbanHeader name={status.label} color={status.color} />
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="text-xs text-muted-foreground">
                      {totalTasks}{" "}
                      {totalTasks === 1
                        ? t("tasksKanban.task")
                        : t("tasksKanban.tasks")}
                    </span>
                  </div>
                </div>

                {/* Card container - crucial for drag and drop */}
                <KanbanCards className="space-y-3 flex-1 p-2">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      {t("tasksKanban.noTasks")}
                    </div>
                  ) : (
                    statusTasks.map((task, index) => (
                      <KanbanCard
                        key={task.id}
                        id={task.id}
                        name={task.title}
                        parent={status.value}
                        index={index}
                        // Important: Make sure the card is not position:relative
                        className="p-3 shadow-sm hover:shadow mb-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <p className="m-0 flex-1 font-medium text-sm">
                              {task.title}
                            </p>
                            <p className="m-0 text-xs text-muted-foreground">
                              {t("tasksKanban.priority")}:{" "}
                              {task.priority ? (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "px-2 py-0.5 text-xs h-5",
                                    priorityColors[task.priority] ||
                                      "bg-muted-foreground/60 text-primary-foreground"
                                  )}
                                >
                                  {task.priority === "Low" &&
                                    t("tasksKanban.low")}
                                  {task.priority === "Medium" &&
                                    t("tasksKanban.medium")}
                                  {task.priority === "High" &&
                                    t("tasksKanban.high")}
                                </Badge>
                              ) : (
                                t("tasksKanban.priorityNone")
                              )}
                            </p>
                          </div>
                        </div>
                        {task.deadline && (
                          <p className="m-0 text-xs text-muted-foreground">
                            {format(new Date(task.created_at), "MMM d")} -{" "}
                            {formatDate(task.deadline, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </p>
                        )}
                      </KanbanCard>
                    ))
                  )}
                </KanbanCards>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center p-2 border-t mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentStatusPage === 1}
                      onClick={() =>
                        handlePageChange(status.value, currentStatusPage - 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      &lt;
                    </Button>
                    <span className="text-xs">
                      {t("tasksKanban.page", {
                        current: currentStatusPage,
                        total: totalPages,
                      })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentStatusPage === totalPages}
                      onClick={() =>
                        handlePageChange(status.value, currentStatusPage + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      &gt;
                    </Button>
                  </div>
                )}
              </KanbanBoard>
            );
          })}
        </KanbanProvider>
      </div>
    </div>
  );
};

export { TasksKanban };

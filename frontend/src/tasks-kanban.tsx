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
import { Task, taskService } from "./services/taskService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
// Make sure you have this import for DndContext if needed
// import { DndContext } from '@dnd-kit/core';

// Define statuses
const statuses = [
  { id: "1", name: "Planned", color: "#6B7280" },
  { id: "2", name: "In Progress", color: "#F59E0B" },
  { id: "3", name: "Done", color: "#10B981" },
];

// Define priority colors
const priorityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  High: "bg-red-100 text-red-800 border-red-300",
};

// Tasks per page for pagination
const TASKS_PER_PAGE = 4;

interface TasksKanbanProps {
  tasks?: Task[];
}

const TasksKanban: FC<TasksKanbanProps> = ({ tasks = [] }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    Planned: 1,
    "In Progress": 1,
    Done: 1,
  });

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
          toast.error("Failed to load tasks. Please try again.");
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

    const status = statuses.find((status) => status.name === over.id);

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
    if (draggedTask.status === status.name) {
      console.log("Task already in this status, ignoring drop");
      return;
    }

    console.log("Updating task:", draggedTask.id, "to status:", status.name);

    // Update local state first (optimistic update)
    setLocalTasks(
      localTasks.map((task) => {
        if (task.id === draggedTask.id) {
          return { ...task, status: status.name };
        }
        return task;
      })
    );

    try {
      // The taskId must be a string from the actual task
      await taskService.updateTask(draggedTask.id, status.name);
      console.log("Backend update successful for task ID:", draggedTask.id);
      toast.success(`Task moved to ${status.name}`, { duration: 1000 });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");

      // Revert the UI change if the API call fails
      setLocalTasks(localTasks);
    }
  };

  // Map tasks to statuses with pagination
  const getTasksByStatus = (statusName: string) => {
    // Get tasks with matching status
    const tasksWithStatus = localTasks.filter(
      (task) => task.status === statusName
    );

    // Get current page for this status
    const page = currentPage[statusName] || 1;

    // Calculate pagination
    const startIndex = (page - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;

    return {
      tasks: tasksWithStatus.slice(startIndex, endIndex),
      totalTasks: tasksWithStatus.length,
      totalPages: Math.ceil(tasksWithStatus.length / TASKS_PER_PAGE),
    };
  };

  const handlePageChange = (statusName: string, newPage: number) => {
    setCurrentPage((prev) => ({
      ...prev,
      [statusName]: newPage,
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
            } = getTasksByStatus(status.name);
            const currentStatusPage = currentPage[status.name] || 1;

            return (
              <KanbanBoard
                key={status.name}
                id={status.name}
                className="flex-1 min-w-[280px] flex flex-col h-full bg-primary/10 dark:bg-primary/20"
              >
                {/* Header section */}
                <div className="mb-2">
                  <KanbanHeader name={status.name} color={status.color} />
                  <div className="flex items-center justify-between mt-1 px-2">
                    <span className="text-xs text-muted-foreground">
                      {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                    </span>
                  </div>
                </div>

                {/* Card container - crucial for drag and drop */}
                <KanbanCards className="space-y-3 flex-1 p-2">
                  {statusTasks.length === 0 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No tasks found
                    </div>
                  ) : (
                    statusTasks.map((task, index) => (
                      <KanbanCard
                        key={task.id}
                        id={task.id}
                        name={task.title}
                        parent={status.name}
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
                              Priority:{" "}
                              {task.priority ? (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "px-2 py-0.5 text-xs h-5", // small size styles
                                    priorityColors[task.priority] ||
                                      "bg-muted-foreground/60 text-primary-foreground"
                                  )}
                                >
                                  {task.priority}
                                </Badge>
                              ) : (
                                "Priority: None"
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
                        handlePageChange(status.name, currentStatusPage - 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      &lt;
                    </Button>
                    <span className="text-xs">
                      Page {currentStatusPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentStatusPage === totalPages}
                      onClick={() =>
                        handlePageChange(status.name, currentStatusPage + 1)
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

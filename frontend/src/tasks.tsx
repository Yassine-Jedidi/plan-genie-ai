import { Task } from "./services/taskService";
import { useEffect, useState } from "react";
import { taskService } from "./services/taskService";
import { TasksTable } from "./components/tasks-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const tasks = await taskService.getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <main className="flex-1 min-w-0 w-full">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>

      <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>

        <div className="flex-grow overflow-auto pb-4 flex justify-center">
          <div className="w-full max-w-5xl">
            {loadingTasks ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <TasksTable tasks={tasks} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TasksPage;

import React, { useEffect, useState } from "react";
import { Task, taskService } from "./services/taskService";
import TasksTable from "./components/tasks-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksKanban } from "./tasks-kanban";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activeTab, setActiveTab] = useState("table");

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

  // Loading skeleton component
  if (loadingTasks) {
    return (
      <main className="flex-1 min-w-0 w-full">
        <div className="px-4 py-2">
          <SidebarTrigger className="h-4 w-4 mt-2" />
        </div>
        <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
          <h1 className="text-2xl font-bold mb-4">Tasks</h1>
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 min-w-0 w-full">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>

      <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>

        <Tabs
          defaultValue="table"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 bg-primary text-white">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="w-full">
            <div className="flex-grow overflow-auto pb-4">
              <TasksTable tasks={tasks} />
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="w-full h-[calc(100vh-180px)]">
            {activeTab === "kanban" && <TasksKanban tasks={tasks} />}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default TasksPage;

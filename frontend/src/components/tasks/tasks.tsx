import { useEffect, useState } from "react";
import { taskService } from "../../services/taskService";
import TasksTable from "./tasks-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TasksKanban } from "./tasks-kanban";
import { useTranslation } from "react-i18next";
import { Task } from "types/task";
import AiAssistantPage from "./tasks-ai-assistant";

const TasksPage = () => {
  const { t } = useTranslation();
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
        toast.error(t("tasks.failedToLoad"));
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchTasks();
  }, [t]);

  // Loading skeleton component
  if (loadingTasks) {
    return (
      <main className="flex-1 min-w-0 w-full">
        <div className="px-4 py-2">
          <SidebarTrigger className="h-4 w-4 mt-2" />
        </div>
        <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
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
        <Tabs
          defaultValue="table"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 bg-primary/80 text-primary-foreground">
            <TabsTrigger value="table">{t("tasks.table")}</TabsTrigger>
            <TabsTrigger value="kanban">{t("tasks.kanban")}</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="w-full">
            <div className="flex-grow overflow-auto pb-4">
              <TasksTable tasks={tasks} />
            </div>
          </TabsContent>

          <TabsContent value="kanban" className="w-full h-[calc(100vh-180px)]">
            {activeTab === "kanban" && <TasksKanban tasks={tasks} />}
          </TabsContent>

          <TabsContent value="ai" className="w-full h-[calc(100vh-180px)]">
            {activeTab === "ai" && <AiAssistantPage />}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default TasksPage;

import React, { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { Task } from "types/task";
import { bilanService } from "../../services/bilanService";
import { Bilan, BilanEntry } from "types/bilan";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertTriangle, Calendar } from "lucide-react";
import { addDays, subDays } from "date-fns";
import { useTranslation } from "react-i18next";

// Import new components
import BilanStats from "./bilan-stats";
import BilanHistory from "./bilan-history";
import BilanHeader from "./bilan-header";
import BilanTaskTable from "./bilan-task-table";
import TaskSection from "./task-section";

// Import utilities
import {
  formatTime,
  formatDeadline,
  isDeadlineApproaching,
  isTaskOverdue,
  isDateToday,
  parseTimeInput,
} from "./bilan-utils";

const BilanPage = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [recentBilans, setRecentBilans] = useState<Bilan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingBilan, setLoadingBilan] = useState(true);
  const [loadingRecentBilans, setLoadingRecentBilans] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [timeInput, setTimeInput] = useState<string>("");
  const [notesInput, setNotesInput] = useState<string>("");
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUtcTime, setCurrentUtcTime] = useState("");

  // Calculate total time spent
  const calculateTotalTime = (entries: BilanEntry[]) => {
    const total = entries.reduce((sum, entry) => sum + entry.minutes_spent, 0);
    setTotalMinutes(total);
    return total;
  };

  // Calculate number of non-overdue tasks
  const getNonOverdueTasksCount = () => {
    return tasks.filter(
      (task) =>
        !isTaskOverdue(task.deadline) &&
        (task.status !== "Done" ||
          bilan?.entries.some((entry) => entry.task_id === task.id))
    ).length;
  };

  // Get the bilan entry for a specific task
  const getEntryForTask = (taskId: string) => {
    if (!bilan) return null;
    return bilan.entries.find((entry) => entry.task_id === taskId);
  };

  // Start editing a task's time
  const startEditing = (taskId: string) => {
    setEditingTaskId(taskId);
    const entry = getEntryForTask(taskId);

    if (entry) {
      // Convert minutes to a human-friendly format for editing
      const hours = Math.floor(entry.minutes_spent / 60);
      const minutes = entry.minutes_spent % 60;

      if (hours > 0) {
        setTimeInput(`${hours}h ${minutes > 0 ? minutes + "m" : ""}`);
      } else {
        setTimeInput(`${minutes}m`);
      }

      setNotesInput(entry.notes || "");
    } else {
      // For new entries, start with empty values
      setTimeInput("");
      setNotesInput("");
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null);
    setTimeInput("");
    setNotesInput("");
  };

  // Save time entry
  const saveTimeEntry = async (taskId: string) => {
    if (!bilan) return;

    try {
      setIsSaving(true);
      const minutes = parseTimeInput(timeInput);

      if (isNaN(minutes) || minutes < 0) {
        toast.error(
          "Please enter a valid time format (e.g., 1h 30m, 90m, etc.)",
          {
            position: "top-right",
          }
        );
        setIsSaving(false);
        return;
      }

      await bilanService.updateEntry(bilan.id, taskId, minutes, notesInput);

      // Find the task and update its status to "In Progress" if it's not already "Done"
      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (
        taskToUpdate &&
        taskToUpdate.status !== "Done" &&
        taskToUpdate.status !== "In Progress"
      ) {
        await taskService.updateTask({
          ...taskToUpdate,
          status: "In Progress",
        });
      }

      // Refresh bilan data and tasks concurrently
      await Promise.all([fetchBilanForDate(selectedDate), fetchTasks()]);

      toast.success("Task time updated successfully");
      cancelEditing();
    } catch (error) {
      console.error("Error saving task time:", error);
      toast.error("Failed to update task time");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete time entry
  const deleteTimeEntry = async (entryId: string) => {
    try {
      await bilanService.deleteEntry(entryId);

      // Refresh bilan data
      await fetchBilanForDate(selectedDate);

      toast.success("Task time deleted");
    } catch (error) {
      console.error("Error deleting task time:", error);
      toast.error("Failed to delete task time");
    }
  };

  // Move to previous day
  const goToPreviousDay = () => {
    const newDate = subDays(selectedDate, 1);
    // Set to noon to avoid timezone issues
    newDate.setHours(12, 0, 0, 0);
    setSelectedDate(newDate);
  };

  // Move to next day
  const goToNextDay = () => {
    const newDate = addDays(selectedDate, 1);
    // Set to noon to avoid timezone issues
    newDate.setHours(12, 0, 0, 0);
    setSelectedDate(newDate);
    if (isDateToday(newDate)) {
      setShowHistory(false);
    }
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    // Set to noon to avoid timezone issues
    today.setHours(12, 0, 0, 0);
    setSelectedDate(today);
    setShowHistory(false);
  };

  // Helper function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // Set to noon to avoid timezone issues, and clone the date to avoid mutation
    const newDate = new Date(date);
    // Make sure we're using the exact selected date by normalizing time
    newDate.setHours(12, 0, 0, 0);
    setSelectedDate(newDate);
    if (isDateToday(newDate)) {
      setShowHistory(false);
    }
  };

  // Fetch bilan for a specific date
  const fetchBilanForDate = async (date: Date) => {
    try {
      setLoadingBilan(true);
      // Create a new date object from the date to avoid timezone issues
      const fetchDate = new Date(date);
      // Remove time component to ensure consistent date handling
      fetchDate.setHours(12, 0, 0, 0);

      const bilanData = isDateToday(fetchDate)
        ? await bilanService.getTodayBilan()
        : await bilanService.getBilanByDate(fetchDate);

      setBilan(bilanData);
      calculateTotalTime(bilanData.entries);
    } catch (error) {
      console.error("Error fetching bilan:", error);
      toast.error("Failed to load daily summary. Please try again.");
    } finally {
      setLoadingBilan(false);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      // setLoadingTasks(true); // Removed unused loadingTasks
      const tasksData = await taskService.getTasks();
      // Convert deadline strings to Date objects for consistent comparisons
      const processedTasks = tasksData.map((task) => {
        console.log(`Original deadline string: ${task.deadline}`);
        const deadlineDate = task.deadline ? new Date(task.deadline) : null;
        console.log(`Processed deadline Date object: ${deadlineDate}`);
        return {
          ...task,
          deadline: deadlineDate,
        };
      });
      setTasks(processedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      // setLoadingTasks(false); // Removed unused loadingTasks
    }
  };

  // Fetch recent bilans
  const fetchRecentBilans = async () => {
    try {
      setLoadingRecentBilans(true);
      const bilansData = await bilanService.getRecentBilans(7);

      // Create an array of the last 7 days, starting with today
      const last7Days = [];
      for (let i = 0; i <= 6; i++) {
        const date = subDays(new Date(), i);
        date.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
        last7Days.push(date);
      }

      // Create a map of existing bilans by date
      const bilansByDate = new Map();
      bilansData.forEach((bilan) => {
        const bilanDate = new Date(bilan.date);
        bilanDate.setHours(12, 0, 0, 0);
        bilansByDate.set(bilanDate.getTime(), bilan);
      });

      // Create the final array with all 7 days, today first
      const allBilans = last7Days.map((date) => {
        const existingBilan = bilansByDate.get(date.getTime());
        if (existingBilan) {
          return existingBilan;
        } else {
          // Create a placeholder bilan for days without data
          return {
            id: `placeholder-${date.getTime()}`,
            date: date.toISOString(),
            entries: [],
            created_at: date.toISOString(),
            updated_at: date.toISOString(),
          };
        }
      });

      setRecentBilans(allBilans);
    } catch (error) {
      console.error("Error fetching recent bilans:", error);
      toast.error("Failed to load recent summaries. Please try again.");
    } finally {
      setLoadingRecentBilans(false);
    }
  };

  // Fetch data when date changes
  useEffect(() => {
    fetchBilanForDate(selectedDate);
  }, [selectedDate]);

  // Initial data loading
  useEffect(() => {
    fetchTasks();
    fetchRecentBilans();

    const updateUtcTime = () => {
      const now = new Date();
      const utcHours = now.getUTCHours().toString().padStart(2, "0");
      const utcMinutes = now.getUTCMinutes().toString().padStart(2, "0");
      const utcSeconds = now.getUTCSeconds().toString().padStart(2, "0");
      setCurrentUtcTime(`${utcHours}:${utcMinutes}:${utcSeconds} UTC`);
    };

    updateUtcTime(); // Set initial time
    const intervalId = setInterval(updateUtcTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  // Mark task as done
  const markTaskAsDone = async (task: Task) => {
    try {
      await taskService.updateTask({
        ...task,
        status: "Done",
        completed_at: new Date().toISOString(),
      });
      toast.success("Task marked as done!");
      // Refresh tasks and bilans
      fetchTasks();
      fetchBilanForDate(selectedDate);
    } catch (error) {
      console.error("Error marking task as done:", error);
      toast.error("Failed to mark task as done.");
    }
  };

  // Get tasks without time entries
  const getTasksWithoutEntries = () => {
    if (!bilan) return [];
    return tasks.filter(
      (task) =>
        !bilan.entries.some((entry) => entry.task_id === task.id) &&
        task.status !== "Done"
    );
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const tasksWithoutEntries = getTasksWithoutEntries();
    return tasksWithoutEntries.filter((task) => isTaskOverdue(task.deadline));
  };

  // Get upcoming deadline tasks
  const getUpcomingDeadlineTasks = () => {
    const tasksWithoutEntries = getTasksWithoutEntries();
    return tasksWithoutEntries.filter(
      (task) =>
        isDeadlineApproaching(task.deadline) && !isTaskOverdue(task.deadline)
    );
  };

  // Get other tasks
  const getOtherTasks = () => {
    const tasksWithoutEntries = getTasksWithoutEntries();
    return tasksWithoutEntries.filter(
      (task) =>
        !isDeadlineApproaching(task.deadline) && !isTaskOverdue(task.deadline)
    );
  };

  return (
    <main className="flex-1 min-w-0 w-full">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>

      <div className="p-4 flex flex-col h-[calc(100vh-60px)] overflow-auto">
        <BilanHeader
          selectedDate={selectedDate}
          currentUtcTime={currentUtcTime}
          showHistory={showHistory}
          isDateToday={isDateToday}
          onDateSelect={handleDateSelect}
          onGoToPreviousDay={goToPreviousDay}
          onGoToToday={goToToday}
          onGoToNextDay={goToNextDay}
          onToggleHistory={() => setShowHistory(!showHistory)}
        />

        {showHistory && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {t("bilan.recentSummaries")}
              </CardTitle>
              <CardDescription>
                {t("bilan.viewRecentSummaries")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BilanHistory
                recentBilans={recentBilans}
                loadingRecentBilans={loadingRecentBilans}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </CardContent>
          </Card>
        )}

        {loadingBilan ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : bilan ? (
          <>
            <BilanStats
              bilan={bilan}
              totalMinutes={totalMinutes}
              getNonOverdueTasksCount={getNonOverdueTasksCount}
            />

            <BilanTaskTable
              bilan={bilan}
              totalMinutes={totalMinutes}
              editingTaskId={editingTaskId}
              timeInput={timeInput}
              notesInput={notesInput}
              isSaving={isSaving}
              isDateToday={isDateToday}
              onStartEditing={startEditing}
              onCancelEditing={cancelEditing}
              onTimeInputChange={setTimeInput}
              onNotesInputChange={setNotesInput}
              onSaveTimeEntry={saveTimeEntry}
              onMarkTaskAsDone={markTaskAsDone}
              onDeleteTimeEntry={deleteTimeEntry}
              formatTime={formatTime}
            />

            {isDateToday(selectedDate) && (
              <>
                <TaskSection
                  title={t("bilan.overdueTasks")}
                  description={t("bilan.tasksPassedDeadline")}
                  icon={<AlertTriangle className="h-5 w-5 mr-2 text-red-600" />}
                  borderColor="border-red-300"
                  headerBgColor="bg-red-50 dark:bg-red-950/40"
                  tasks={getOverdueTasks()}
                  selectedDate={selectedDate}
                  editingTaskId={editingTaskId}
                  timeInput={timeInput}
                  notesInput={notesInput}
                  isSaving={isSaving}
                  isDateToday={isDateToday}
                  onStartEditing={startEditing}
                  onCancelEditing={cancelEditing}
                  onTimeInputChange={setTimeInput}
                  onNotesInputChange={setNotesInput}
                  onSaveTimeEntry={saveTimeEntry}
                  onMarkTaskAsDone={markTaskAsDone}
                  formatDeadline={formatDeadline}
                />

                <TaskSection
                  title={t("bilan.upcomingDeadlines")}
                  description={t("bilan.tasksWithUpcomingDeadlines")}
                  icon={<Calendar className="h-5 w-5 mr-2 text-amber-600" />}
                  borderColor="border-amber-300"
                  headerBgColor="bg-amber-50 dark:bg-amber-950/40"
                  tasks={getUpcomingDeadlineTasks()}
                  selectedDate={selectedDate}
                  editingTaskId={editingTaskId}
                  timeInput={timeInput}
                  notesInput={notesInput}
                  isSaving={isSaving}
                  isDateToday={isDateToday}
                  onStartEditing={startEditing}
                  onCancelEditing={cancelEditing}
                  onTimeInputChange={setTimeInput}
                  onNotesInputChange={setNotesInput}
                  onSaveTimeEntry={saveTimeEntry}
                  onMarkTaskAsDone={markTaskAsDone}
                  formatDeadline={formatDeadline}
                />

                <TaskSection
                  title={t("bilan.tasksBeyond7Days")}
                  description={t("bilan.tasksWithFutureDeadlines")}
                  icon={<Calendar className="h-5 w-5 mr-2 text-slate-600" />}
                  borderColor="border-slate-300"
                  headerBgColor="bg-slate-50 dark:bg-slate-950/40"
                  tasks={getOtherTasks()}
                  selectedDate={selectedDate}
                  editingTaskId={editingTaskId}
                  timeInput={timeInput}
                  notesInput={notesInput}
                  isSaving={isSaving}
                  isDateToday={isDateToday}
                  onStartEditing={startEditing}
                  onCancelEditing={cancelEditing}
                  onTimeInputChange={setTimeInput}
                  onNotesInputChange={setNotesInput}
                  onSaveTimeEntry={saveTimeEntry}
                  onMarkTaskAsDone={markTaskAsDone}
                  formatDeadline={formatDeadline}
                />
              </>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p>{t("bilan.failedToLoadSummary")}</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => fetchBilanForDate(selectedDate)}
            >
              {t("bilan.retry")}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BilanPage;

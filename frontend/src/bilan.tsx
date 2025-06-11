import React, { useEffect, useState } from "react";
import { Task, taskService } from "./services/taskService";
import { Bilan, BilanEntry, bilanService } from "./services/bilanService";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  format as dateFormat,
  isSameDay,
  isToday,
  addDays,
  isBefore,
  subDays,
} from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Save,
  X,
  AlertCircle,
  Clock,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  History,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DatePicker } from "@/components/date-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BilanPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bilan, setBilan] = useState<Bilan | null>(null);
  const [recentBilans, setRecentBilans] = useState<Bilan[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingBilan, setLoadingBilan] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingRecentBilans, setLoadingRecentBilans] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [timeInput, setTimeInput] = useState<string>("");
  const [notesInput, setNotesInput] = useState<string>("");
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUtcTime, setCurrentUtcTime] = useState("");

  // Format date for display - fixing potential timezone issues
  const formatDateDisplay = (dateString: string) => {
    try {
      const date = new Date(dateString);

      // Get offset in minutes and convert to hours
      const offsetMinutes = date.getTimezoneOffset(); // e.g., -60 for GMT+1
      const offsetHours = -offsetMinutes / 60;

      // Format offset string
      const gmtOffset =
        "GMT" + (offsetHours >= 0 ? "+" : "") + offsetHours.toString();

      // Format date without timezone name
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      }).format(date);

      return `${formattedDate} ${gmtOffset}`;
    } catch {
      return dateString;
    }
  };

  // Calculate total time spent
  const calculateTotalTime = (entries: BilanEntry[]) => {
    const total = entries.reduce((sum, entry) => sum + entry.minutes_spent, 0);
    setTotalMinutes(total);
    return total;
  };

  // Format minutes as hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Format deadline for display
  const formatDeadline = (deadline: Date | null) => {
    if (!deadline) return null;

    try {
      if (isToday(deadline)) {
        return "Today";
      }

      return formatDate(deadline, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return deadline.toString();
    }
  };

  // Check if a task deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline: Date | null) => {
    if (!deadline) return false;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Task is due today or in the past
      if (isBefore(deadline, addDays(today, 1))) {
        return true;
      }

      // Task is due within the next 7 days
      return isBefore(deadline, addDays(today, 8));
    } catch {
      return false;
    }
  };

  // Check if a task is overdue
  const isTaskOverdue = (deadline: Date | null) => {
    if (!deadline) return false;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return isBefore(deadline, today);
    } catch {
      return false;
    }
  };

  // Check if a date is today
  const isDateToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  // Format date for history selector
  const formatDateForHistory = (date: Date) => {
    if (isDateToday(date)) {
      return "Today";
    }
    return dateFormat(date, "EEE, MMM d");
  };

  // Calculate total time for a bilan
  const calculateBilanTotalTime = (bilan: Bilan) => {
    return bilan.entries.reduce((sum, entry) => sum + entry.minutes_spent, 0);
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

  // Parse time input to minutes
  const parseTimeInput = (input: string): number => {
    let minutes = 0;

    // Handle empty input
    if (!input || input.trim() === "") {
      return 0;
    }

    // Check for negative values which are invalid
    if (input.includes("-")) {
      return -1; // Return negative to trigger the validation error
    }

    // Match hours pattern (e.g., "2h" or "2 h")
    const hoursMatch = input.match(/(\d+)\s*h/i);
    if (hoursMatch) {
      minutes += parseInt(hoursMatch[1], 10) * 60;
    }

    // Match minutes pattern (e.g., "30m" or "30 m")
    const minutesMatch = input.match(/(\d+)\s*m/i);
    if (minutesMatch) {
      minutes += parseInt(minutesMatch[1], 10);
    }

    // If no pattern matched but it's a number, assume minutes
    if (minutes === 0) {
      if (/^\d+$/.test(input.trim())) {
        minutes = parseInt(input.trim(), 10);
      } else if (!hoursMatch && !minutesMatch) {
        // If input contains text but no valid patterns were found
        return -1; // Return negative to trigger the validation error
      }
    }

    return minutes;
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

      // Refresh bilan data
      await fetchBilanForDate(selectedDate);

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
      setLoadingTasks(true);
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setLoadingTasks(false);
    }
  };

  // Fetch recent bilans
  const fetchRecentBilans = async () => {
    try {
      setLoadingRecentBilans(true);
      const bilansData = await bilanService.getRecentBilans(7);

      // Filter to ensure we only have the last 7 days
      const lastWeek = subDays(new Date(), 7);
      lastWeek.setHours(0, 0, 0, 0);

      const filteredBilans = bilansData.filter((bilan) => {
        const bilanDate = new Date(bilan.date);
        return bilanDate >= lastWeek;
      });

      setRecentBilans(filteredBilans);
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

  // Render the time entry form for a task that doesn't have an entry yet
  const renderTimeEntryForm = (taskId: string) => {
    return (
      <div className="flex flex-col space-y-3 p-4 bg-muted/30 rounded-md">
        <div className="text-sm font-medium mb-1">Add time for this task:</div>
        <div className="flex items-center">
          <span className="w-24 text-sm">Time spent:</span>
          <Input
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
            placeholder="e.g., 1h 30m"
            className="w-32"
          />
        </div>
        <div className="flex items-start">
          <span className="w-24 text-sm mt-2">Notes:</span>
          <Textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Optional notes about your work"
            className="min-h-[80px] flex-1"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" size="sm" onClick={cancelEditing}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => saveTimeEntry(taskId)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Render recent bilans history
  const renderBilanHistory = () => {
    if (loadingRecentBilans) {
      return (
        <div className="flex flex-col space-y-2 py-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-1 max-h-80 overflow-y-auto p-1">
        {recentBilans.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No history available
          </div>
        ) : (
          recentBilans.map((bilan) => {
            const date = new Date(bilan.date);
            const isSelected = isSameDay(date, selectedDate);
            const totalTime = calculateBilanTotalTime(bilan);

            return (
              <Button
                key={bilan.id}
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "justify-between px-3 py-2 h-auto",
                  isSelected && "font-medium"
                )}
                onClick={() => handleDateSelect(date)}
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 opacity-70" />
                  <span>{formatDateForHistory(date)}</span>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {formatTime(totalTime)}
                </Badge>
              </Button>
            );
          })
        )}
      </div>
    );
  };

  // Render tasks with upcoming deadlines
  const renderUpcomingDeadlineTasks = () => {
    if (!bilan || loadingTasks || loadingBilan) return null;

    // Get tasks that have no time entries yet and are not done
    const tasksWithoutEntries = tasks.filter(
      (task) =>
        !bilan.entries.some((entry) => entry.task_id === task.id) &&
        task.status !== "Done"
    );

    // Filter tasks with approaching deadlines
    const upcomingTasks = tasksWithoutEntries.filter(
      (task) =>
        isDeadlineApproaching(task.deadline) && !isTaskOverdue(task.deadline)
    );

    if (upcomingTasks.length === 0) return null;

    return (
      <Card className="mt-8 border-amber-300">
        <CardHeader className="bg-amber-50 dark:bg-amber-950/40 rounded-t-lg">
          <CardTitle className="text-xl flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-600" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
          <CardDescription>
            Tasks with deadlines approaching that need your attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <TableRow>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        {formatDeadline(task.deadline)}
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
                          {task.priority}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          task.status === "Done" &&
                            "bg-green-100 text-green-800 border-green-300",
                          task.status === "In Progress" &&
                            "bg-blue-100 text-blue-800 border-blue-300",
                          (!task.status || task.status === "Planned") &&
                            "bg-amber-100 text-amber-800 border-amber-300"
                        )}
                      >
                        {task.status || "Planned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingTaskId === task.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(task.id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Add Time
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markTaskAsDone(task)}
                            disabled={!isDateToday(selectedDate)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Done
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                  {editingTaskId === task.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {renderTimeEntryForm(task.id)}
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

  // Render overdue tasks
  const renderOverdueTasks = () => {
    if (!bilan || loadingTasks || loadingBilan) return null;

    // Get tasks that have no time entries yet and are not done
    const tasksWithoutEntries = tasks.filter(
      (task) =>
        !bilan.entries.some((entry) => entry.task_id === task.id) &&
        task.status !== "Done"
    );

    // Filter overdue tasks
    const overdueTasks = tasksWithoutEntries.filter((task) =>
      isTaskOverdue(task.deadline)
    );

    if (overdueTasks.length === 0) return null;

    return (
      <Card className="mt-8 border-red-300">
        <CardHeader className="bg-red-50 dark:bg-red-950/40 rounded-t-lg">
          <CardTitle className="text-xl flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <span>Overdue Tasks</span>
          </CardTitle>
          <CardDescription>
            Tasks that have passed their deadline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <TableRow>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {formatDeadline(task.deadline)}
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
                          {task.priority}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          task.status === "Done" &&
                            "bg-green-100 text-green-800 border-green-300",
                          task.status === "In Progress" &&
                            "bg-blue-100 text-blue-800 border-blue-300",
                          (!task.status || task.status === "Planned") &&
                            "bg-amber-100 text-amber-800 border-amber-300"
                        )}
                      >
                        {task.status || "Planned"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingTaskId === task.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(task.id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Add Time
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markTaskAsDone(task)}
                            disabled={!isDateToday(selectedDate)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark as Done
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                  {editingTaskId === task.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        {renderTimeEntryForm(task.id)}
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

  // Render other tasks without time entries and without urgent deadlines
  const renderOtherTasks = () => {
    if (!bilan || loadingTasks || loadingBilan) return null;

    // Get tasks that have no time entries yet and are not done
    const tasksWithoutEntries = tasks.filter(
      (task) =>
        !bilan.entries.some((entry) => entry.task_id === task.id) &&
        task.status !== "Done"
    );

    // Filter tasks with no urgent deadlines
    const otherTasks = tasksWithoutEntries.filter(
      (task) =>
        !isDeadlineApproaching(task.deadline) && !isTaskOverdue(task.deadline)
    );

    if (otherTasks.length === 0) return null;
  };

  return (
    <main className="flex-1 min-w-0 w-full">
      <div className="px-4 py-2">
        <SidebarTrigger className="h-4 w-4 mt-2" />
      </div>

      <div className="p-4 flex flex-col h-[calc(100vh-60px)] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Daily Summary</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center">
                    Current UTC Time: {currentUtcTime}
                    <Info className="ml-2 h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Summaries are generated on UTC midnight</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <DatePicker date={selectedDate} onSelect={handleDateSelect} />

            <div className="inline-flex w-auto -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
              <Button
                onClick={goToPreviousDay}
                className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                variant="outline"
                size="icon"
                aria-label="Navigate to previous day"
              >
                <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <Button onClick={goToToday} variant="outline">
                Today
              </Button>
              <Button
                onClick={goToNextDay}
                className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
                variant="outline"
                size="icon"
                disabled={isDateToday(selectedDate)}
                aria-label="Navigate to next day"
              >
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>

            <Button
              variant={showHistory ? "default" : "outline"}
              size="icon"
              onClick={() => setShowHistory(!showHistory)}
              className="ml-1 rounded-lg"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showHistory && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Summaries</CardTitle>
              <CardDescription>
                View your daily summaries from the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>{renderBilanHistory()}</CardContent>
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
            <p className="text-primary dark:text-primary/80 mb-4">
              {formatDateDisplay(bilan.date)}
            </p>

            <Card className="border-green-300">
              <CardHeader className="bg-green-50 dark:bg-green-950/40 rounded-t-lg">
                <CardTitle className="text-xl flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  <div className="flex justify-between items-center w-full">
                    <span>Daily Tasks</span>
                    <Badge variant="secondary">
                      Total: {formatTime(totalMinutes)}
                    </Badge>
                  </div>
                </CardTitle>
                <CardDescription>
                  Track the time you've spent on each task
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bilan.entries.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 mb-2 opacity-20" />
                    <p>You didn't do any task today.</p>
                    {isDateToday(selectedDate) && (
                      <p className="text-sm">Add time to your tasks below.</p>
                    )}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Time Spent</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                onChange={(e) => setTimeInput(e.target.value)}
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
                                onChange={(e) => setNotesInput(e.target.value)}
                                placeholder="Optional notes about your work"
                                className="min-h-[80px]"
                              />
                            ) : (
                              entry.notes || (
                                <span className="text-muted-foreground italic">
                                  No notes
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
                                  onClick={cancelEditing}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => saveTimeEntry(entry.task_id)}
                                  disabled={isSaving}
                                >
                                  {isSaving ? (
                                    <>
                                      <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="h-4 w-4 mr-1" />
                                      Save
                                    </>
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(entry.task_id)}
                                  disabled={!isDateToday(selectedDate)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markTaskAsDone(entry.task!)}
                                  disabled={
                                    !isDateToday(selectedDate) ||
                                    entry.task?.status === "Done"
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark as Done
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => deleteTimeEntry(entry.id)}
                                  disabled={!isDateToday(selectedDate)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
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

            {isDateToday(selectedDate) && (
              <>
                {renderOverdueTasks()}
                {renderUpcomingDeadlineTasks()}
                {renderOtherTasks()}
              </>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p>Failed to load daily summary. Please try again.</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => fetchBilanForDate(selectedDate)}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default BilanPage;

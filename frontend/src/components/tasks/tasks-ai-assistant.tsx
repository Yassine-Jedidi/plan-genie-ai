import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Clock, AlertTriangle, Target } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
  geminiService,
  TaskPrioritizationResult,
} from "../../services/geminiService";
import { taskService } from "../../services/taskService";
import { Task } from "../../../types/task";

// Local storage key for saving prioritization results
const PRIORITIZATION_STORAGE_KEY = "plan-genie-ai-prioritization-result";

export default function AiAssistantPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [prioritizationResult, setPrioritizationResult] =
    useState<TaskPrioritizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPriorities, setLoadingPriorities] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);

  useEffect(() => {
    loadTasks();
    loadPrioritizationFromStorage();
  }, []);

  // Load prioritization result from localStorage
  const loadPrioritizationFromStorage = () => {
    try {
      const stored = localStorage.getItem(PRIORITIZATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrioritizationResult(parsed);
      }
    } catch (error) {
      console.error("Error loading prioritization from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem(PRIORITIZATION_STORAGE_KEY);
    }
  };

  // Save prioritization result to localStorage
  const savePrioritizationToStorage = (result: TaskPrioritizationResult) => {
    try {
      localStorage.setItem(PRIORITIZATION_STORAGE_KEY, JSON.stringify(result));
    } catch (error) {
      console.error("Error saving prioritization to localStorage:", error);
    }
  };

  // Clear prioritization result from localStorage
  const clearPrioritizationFromStorage = () => {
    try {
      localStorage.removeItem(PRIORITIZATION_STORAGE_KEY);
      setPrioritizationResult(null);
      toast.success(t("aiAssistant.toast.resultsCleared"));
    } catch (error) {
      console.error("Error clearing prioritization from localStorage:", error);
    }
  };

  // Auto-scroll to results when they're generated
  useEffect(() => {
    if (prioritizationResult) {
      const resultsElement = document.getElementById(
        "prioritized-tasks-results"
      );
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [prioritizationResult]);

  // Show loading text after 3 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (loadingPriorities) {
      timeoutId = setTimeout(() => {
        setShowLoadingText(true);
      }, 3000);
    } else {
      setShowLoadingText(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loadingPriorities]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error("Failed to load tasks");
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks to show only active and on-time tasks
  const getActiveTasks = () => {
    return tasks.filter((task) => {
      // Skip completed tasks
      if (task.status === "Done") {
        return false;
      }

      // Skip overdue tasks
      if (task.deadline) {
        const deadline = new Date(task.deadline);
        const now = new Date();
        if (deadline < now) {
          return false;
        }
      }

      return true;
    });
  };

  const activeTasks = getActiveTasks();

  const handleGetPriorities = async () => {
    try {
      setLoadingPriorities(true);
      const result = await geminiService.getTaskPriorities();
      setPrioritizationResult(result);
      savePrioritizationToStorage(result);
      toast.success(t("aiAssistant.toast.prioritiesGenerated"));
    } catch (error) {
      toast.error(t("aiAssistant.toast.failedToGetPriorities"));
      console.error("Error getting priorities:", error);
    } finally {
      setLoadingPriorities(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t("aiAssistant.noDeadline");
    return new Date(date).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Button */}
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGetPriorities}
              disabled={loadingPriorities || activeTasks.length === 0}
              className="flex items-center gap-2 px-8 py-3 text-base"
            >
              {loadingPriorities ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Target className="h-5 w-5" />
              )}
              {loadingPriorities
                ? t("aiAssistant.prioritizingTasks")
                : t("aiAssistant.prioritizeWithAI")}
            </Button>
            {prioritizationResult && (
              <Button
                onClick={clearPrioritizationFromStorage}
                variant="outline"
                className="flex items-center gap-2 px-4 py-3 text-sm"
              >
                {t("aiAssistant.clearResults")}
              </Button>
            )}
          </div>
          {loadingPriorities && showLoadingText && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t("aiAssistant.thisMightTakeSeconds")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Current Tasks Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            {t("aiAssistant.activeTasks")} ({activeTasks.length})
          </CardTitle>
          <CardDescription>
            {t("aiAssistant.activeTasksDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">{t("aiAssistant.loadingTasks")}</span>
            </div>
          ) : activeTasks.length === 0 ? (
            <div className="flex items-center gap-2 p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                {t("aiAssistant.noTasksFound")}
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div key={task.id} className="relative group">
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-colors duration-200">
                    {/* Task Status Indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-muted text-muted-foreground">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            task.status === "completed" ||
                            task.status === "done"
                              ? "bg-green-500"
                              : task.status === "In Progress" ||
                                task.status === "in-progress"
                              ? "bg-orange-500"
                              : task.status === "Planned"
                              ? "bg-gray-400"
                              : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-medium text-foreground leading-tight">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              task.priority === "High"
                                ? "border-red-200 text-red-700 bg-red-50"
                                : task.priority === "Medium"
                                ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                : task.priority === "Low"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-gray-200 text-gray-700 bg-gray-50"
                            }`}
                          >
                            {task.priority === "High"
                              ? t("aiAssistant.badges.priority.high")
                              : task.priority === "Medium"
                              ? t("aiAssistant.badges.priority.medium")
                              : task.priority === "Low"
                              ? t("aiAssistant.badges.priority.low")
                              : t("aiAssistant.priority.medium")}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              task.status === "In Progress" ||
                              task.status === "in-progress"
                                ? "border-orange-200 text-orange-700 bg-orange-50"
                                : task.status === "Planned"
                                ? "border-gray-200 text-gray-700 bg-gray-50"
                                : task.status === "completed" ||
                                  task.status === "done"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-gray-200 text-gray-700 bg-gray-50"
                            }`}
                          >
                            {task.status === "In Progress" ||
                            task.status === "in-progress"
                              ? t("aiAssistant.badges.status.inProgress")
                              : task.status === "Planned"
                              ? t("aiAssistant.badges.status.planned")
                              : task.status === "completed" ||
                                task.status === "done"
                              ? t("aiAssistant.badges.status.done")
                              : t("aiAssistant.badges.status.pending")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {t("aiAssistant.due")}: {formatDate(task.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {prioritizationResult && (
        <div className="space-y-6">
          {/* Prioritized Tasks */}
          <Card id="prioritized-tasks-results">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                {t("aiAssistant.prioritizedTasks")}
              </CardTitle>
              <CardDescription>
                {t("aiAssistant.prioritizedTasksDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prioritizationResult.prioritizedTasks.map((task, index) => (
                  <div key={task.id} className="relative group">
                    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-card hover:bg-accent/50 transition-colors duration-200">
                      {/* Priority Number */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              index === 0
                                ? "bg-primary text-primary-foreground"
                                : index === 1
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                : index === 2
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index + 1}
                          </div>
                        </div>
                      </div>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-medium text-foreground leading-tight">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                task.priority === "High"
                                  ? "border-red-200 text-red-700 bg-red-50"
                                  : task.priority === "Medium"
                                  ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                                  : task.priority === "Low"
                                  ? "border-green-200 text-green-700 bg-green-50"
                                  : "border-gray-200 text-gray-700 bg-gray-50"
                              }`}
                            >
                              {task.priority === "High"
                                ? t("aiAssistant.badges.priority.high")
                                : task.priority === "Medium"
                                ? t("aiAssistant.badges.priority.medium")
                                : task.priority === "Low"
                                ? t("aiAssistant.badges.priority.low")
                                : t("aiAssistant.priority.medium")}
                            </Badge>
                            {prioritizationResult.estimatedTimePerTask[
                              String(index + 1)
                            ] && (
                              <Badge
                                variant="secondary"
                                className={`text-xs ${(() => {
                                  const color =
                                    prioritizationResult.timeColors[
                                      String(index + 1)
                                    ];
                                  if (!color)
                                    return "bg-gray-100 text-gray-700 border-gray-200";

                                  switch (color.toLowerCase()) {
                                    case "green":
                                      return "bg-green-100 text-green-700 border-green-200";
                                    case "yellow":
                                      return "bg-yellow-100 text-yellow-700 border-yellow-200";
                                    case "red":
                                      return "bg-red-100 text-red-700 border-red-200";
                                    default:
                                      return "bg-gray-100 text-gray-700 border-gray-200";
                                  }
                                })()}`}
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {
                                  prioritizationResult.estimatedTimePerTask[
                                    String(index + 1)
                                  ]
                                }
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(task.deadline)}</span>
                          </div>
                        </div>

                        {/* AI Reasoning */}
                        {prioritizationResult.reasoning[String(index + 1)] && (
                          <div className="bg-muted/30 rounded-md p-3 border-l-2 border-primary/30">
                            <div className="flex items-start gap-2">
                              <Sparkles className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-xs font-medium text-foreground mb-1">
                                  {t("aiAssistant.aiInsight")}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {
                                    prioritizationResult.reasoning[
                                      String(index + 1)
                                    ]
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subtle accent for top 3 priorities */}
                    {index < 3 && (
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                          index === 0
                            ? "bg-primary"
                            : index === 1
                            ? "bg-orange-400"
                            : "bg-yellow-400"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

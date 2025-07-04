import { useState } from "react";
import { toast } from "sonner";
import { Edit, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnalysisResult } from "@/services/nlpService";
import { taskService } from "@/services/taskService";
import { eventService } from "@/services/eventService";
import { priorityService, PriorityLevel } from "@/services/priorityService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { formatDate as formatDateUtil } from "@/lib/utils";
import * as chrono from "chrono-node";
import { useTranslation } from "react-i18next";

// Create custom select components
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const Select = ({ value, onValueChange }: SelectProps) => {
  const { t } = useTranslation();

  const getDisplayValue = (val: string) => {
    if (val === "Task") return t("analysis.task");
    if (val === "Event") return t("analysis.event");
    return val;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {getDisplayValue(value)} <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onValueChange("Task")}>
          {t("analysis.task")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onValueChange("Event")}>
          {t("analysis.event")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Priority select component
const PrioritySelect = ({
  value,
  onValueChange,
}: {
  value: PriorityLevel;
  onValueChange: (value: PriorityLevel) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-[120px] justify-between ${priorityService.getPriorityColor(
            value
          )}`}
        >
          {priorityService.getPriorityLabel(value)}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onSelect={() => onValueChange("high")}
          className="text-red-500"
        >
          High
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onValueChange("medium")}
          className="text-amber-500"
        >
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onValueChange("low")}
          className="text-green-500"
        >
          Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  setResults: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  onSave?: () => void; // Add optional onSave callback
  isSaved?: boolean; // Add optional isSaved flag
}

// Use the French parser as demonstrated by the user
const frenchParser = chrono.fr;
const englishParser = chrono.en;

export function AnalysisResults({
  results,
  setResults,
  onSave,
  isSaved = false,
}: AnalysisResultsProps) {
  const { t } = useTranslation();
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  if (!results) return null;

  // Function to parse date from text using chrono-node with French priority
  const parseDate = (
    text: string
  ): { originalText: string; parsedDate: Date | null } => {
    if (!text) return { originalText: text, parsedDate: null };

    try {
      const now = new Date(); // Get the current date and time
      console.log(`Current 'now' for parsing: ${now.toLocaleString()}`); // Log the current date and time

      // First try with French parser, providing the current date as reference
      let parsedDate = frenchParser.parseDate(text, now);
      console.log(
        `French parser: "${text}" → ${
          parsedDate ? parsedDate.toLocaleString() : "null"
        }`
      );

      // If French parser gives today's date for 'tomorrow' or 'demain', advance it by one day
      if (parsedDate && parsedDate.toDateString() === now.toDateString()) {
        const lowerCaseText = text.toLowerCase();
        if (
          lowerCaseText.includes("tomorrow") ||
          lowerCaseText.includes("demain")
        ) {
          parsedDate.setDate(parsedDate.getDate() + 1);
          console.log(
            "Adjusted for 'tomorrow' misinterpretation by French parser."
          );
        }
      }

      // Fall back to English parser if French fails, providing the current date as reference
      if (!parsedDate) {
        parsedDate = englishParser.parseDate(text, now);
        console.log(
          `English parser: "${text}" → ${
            parsedDate ? parsedDate.toLocaleString() : "null"
          }`
        );
      }

      // Logic for future dates for days of the week when only day name is provided
      if (parsedDate) {
        const now = new Date(); // Re-fetch current time for accurate comparison
        const dayNames = [
          "lundi",
          "mardi",
          "mercredi",
          "jeudi",
          "vendredi",
          "samedi",
          "dimanche", // French
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday", // English
        ];
        const lowerCaseText = text.toLowerCase().trim();
        const isDayOfWeek = dayNames.some((day) => lowerCaseText === day);

        // If it's a day of the week and it's in the past (or earlier today), move it to next week
        if (isDayOfWeek && parsedDate < now) {
          parsedDate.setDate(parsedDate.getDate() + 7);
          console.log(
            `Adjusted '${text}' to next occurrence (moved by 7 days) as it was in the past.`
          );
        }
      }

      return {
        originalText: text,
        parsedDate: parsedDate,
      };
    } catch (error) {
      console.error("Error parsing date:", error);
      return { originalText: text, parsedDate: null };
    }
  };

  // Format date to display in a readable format
  const formatDate = (date: Date | null): string => {
    if (!date) return "Invalid date";

    // Convert the Date to ISO string and use our utility
    return formatDateUtil(date.toISOString(), {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleTypeChange = (newType: string) => {
    if (results) {
      // Create a new entities object with the appropriate structure for the new type
      const newEntities: Record<string, string[]> = {};

      if (newType === "Task") {
        // For Task type, ensure TITRE, DELAI, and PRIORITE exist
        newEntities["TITRE"] = results.entities["TITRE"] || [];
        newEntities["DELAI"] = results.entities["DELAI"] || [];
        newEntities["PRIORITE"] = results.entities["PRIORITE"] || [];
      } else if (newType === "Event") {
        // For Event type, ensure TITRE and DATE_HEURE exist
        newEntities["TITRE"] = results.entities["TITRE"] || [];
        newEntities["DATE_HEURE"] = results.entities["DATE_HEURE"] || [];
      }

      setResults({
        ...results,
        type: newType,
        entities: newEntities,
      });
    }
  };

  const startEditEntity = (
    entityType: string,
    value: string,
    index: number
  ) => {
    setEditingEntity(`${entityType}_${index}`);
    setEditValue(value);
  };

  const saveEntityEdit = (entityType: string, index: number) => {
    if (results && editValue.trim()) {
      const updatedEntities = { ...results.entities };

      // Ensure the entity array exists
      if (!updatedEntities[entityType]) {
        updatedEntities[entityType] = [];
      }

      // If editing a deadline or date_time, parse the date
      if (entityType === "DELAI" || entityType === "DATE_HEURE") {
        const { originalText, parsedDate } = parseDate(editValue);

        // Store both the original text and the parsed date if available
        if (parsedDate) {
          // Store as a JSON string with both values
          updatedEntities[entityType][index] = JSON.stringify({
            originalText,
            parsedDate: parsedDate.toISOString(),
          });
        } else {
          // Just store the original text if parsing failed
          updatedEntities[entityType][index] = editValue;
        }
      } else {
        // For other entity types, just store the value as before
        if (index >= updatedEntities[entityType].length) {
          updatedEntities[entityType].push(editValue);
        } else {
          updatedEntities[entityType][index] = editValue;
        }
      }

      setResults({
        ...results,
        entities: updatedEntities,
      });
      setEditingEntity(null);
    }
  };

  // Function to update priority level
  const handlePriorityChange = (priorityLevel: PriorityLevel) => {
    if (results && results.type === "Task") {
      const updatedEntities = { ...results.entities };
      // Store the standardized priority value
      updatedEntities["PRIORITE"] = [
        priorityService.getPriorityLabel(priorityLevel),
      ];

      setResults({
        ...results,
        entities: updatedEntities,
      });
    }
  };

  // Get current priority level
  const getCurrentPriorityLevel = (): PriorityLevel => {
    const priorityText = results.entities["PRIORITE"]?.[0];
    return priorityService.classifyPriority(priorityText);
  };

  // Function to save task to the database
  const saveTask = async () => {
    if (!results) {
      toast.error("No task to save", {
        position: "top-right",
      });
      return;
    }

    if (isSaved) {
      toast.info("This task has already been saved", {
        position: "top-right",
      });
      return;
    }

    setSaving(true);
    try {
      // Map type back to French for backend compatibility
      const typeMap: Record<string, string> = {
        Task: "Tâche",
        Event: "Événement",
      };

      // Make a deep copy of the results to avoid modifying the original
      const updatedEntities = JSON.parse(JSON.stringify(results.entities));
      let modifiedPayload = false;

      console.log("Original entities:", updatedEntities);

      // If saving an event, ensure correct field mapping from task fields if needed
      if (results.type === "Event") {
        // If we have DELAI but not DATE_HEURE, map task fields to event fields
        if (
          updatedEntities["DELAI"]?.length &&
          !updatedEntities["DATE_HEURE"]?.length
        ) {
          console.log("Converting task deadline to event date_time");
          updatedEntities["DATE_HEURE"] = updatedEntities["DELAI"];
          modifiedPayload = true;

          // Also convert the parsed date if available
          if (updatedEntities["DELAI_PARSED"]?.length) {
            updatedEntities["DATE_HEURE_PARSED"] =
              updatedEntities["DELAI_PARSED"];
          }

          // And convert the text representation if available
          if (updatedEntities["DELAI_TEXT"]?.length) {
            updatedEntities["DATE_HEURE_TEXT"] = updatedEntities["DELAI_TEXT"];
          }
        }

        // Extract parsed date from DATE_HEURE if it's in JSON format
        if (updatedEntities["DATE_HEURE"]?.[0]) {
          try {
            const dateValue = updatedEntities["DATE_HEURE"][0];
            const parsed = JSON.parse(dateValue);

            if (parsed.originalText && parsed.parsedDate) {
              console.log("Extracting parsed date from JSON in DATE_HEURE");
              // Store the original text and parsed date separately
              updatedEntities["DATE_HEURE"] = [parsed.originalText];
              updatedEntities["DATE_HEURE_PARSED"] = [parsed.parsedDate];
              modifiedPayload = true;
            }
          } catch {
            // Not JSON, try to parse it directly if DATE_HEURE_PARSED is not already set
            if (!updatedEntities["DATE_HEURE_PARSED"]?.length) {
              const { parsedDate } = parseDate(
                updatedEntities["DATE_HEURE"][0]
              );
              if (parsedDate) {
                console.log(
                  "Successfully parsed date from DATE_HEURE text:",
                  parsedDate
                );
                updatedEntities["DATE_HEURE_PARSED"] = [
                  parsedDate.toISOString(),
                ];
                modifiedPayload = true;
              }
            }
          }
        }

        // Ensure we have DATE_HEURE_TEXT for display purposes
        if (
          updatedEntities["DATE_HEURE"]?.length &&
          !updatedEntities["DATE_HEURE_TEXT"]?.length
        ) {
          updatedEntities["DATE_HEURE_TEXT"] = updatedEntities["DATE_HEURE"];
        }
      }

      // If we have DELAI in JSON format for tasks, extract it correctly
      if (results.type === "Task" && updatedEntities["DELAI"]?.[0]) {
        try {
          const delaiValue = updatedEntities["DELAI"][0];
          const parsed = JSON.parse(delaiValue);

          if (parsed.originalText && parsed.parsedDate) {
            console.log("Extracting parsed date from JSON in DELAI");
            // Store the original text and parsed date separately
            updatedEntities["DELAI"] = [parsed.originalText];
            updatedEntities["DELAI_PARSED"] = [parsed.parsedDate];
            modifiedPayload = true;
          }
        } catch {
          // Not JSON, try to parse it directly if DELAI_PARSED is not already set
          if (!updatedEntities["DELAI_PARSED"]?.length) {
            const { parsedDate } = parseDate(updatedEntities["DELAI"][0]);
            if (parsedDate) {
              console.log(
                "Successfully parsed date from DELAI text:",
                parsedDate
              );
              updatedEntities["DELAI_PARSED"] = [parsedDate.toISOString()];
              modifiedPayload = true;
            }
          }
        }

        // Ensure we have DELAI_TEXT for display purposes
        if (
          updatedEntities["DELAI"]?.length &&
          !updatedEntities["DELAI_TEXT"]?.length
        ) {
          updatedEntities["DELAI_TEXT"] = updatedEntities["DELAI"];
        }
      }

      if (modifiedPayload) {
        console.log("Modified entities for saving:", updatedEntities);
      }

      const payload = {
        ...results,
        type: typeMap[results.type] || results.type,
        entities: updatedEntities,
      };

      if (results.type === "Event") {
        await eventService.saveEvent(payload);
      } else {
        await taskService.saveTask(payload);
      }

      toast.success(`${results.type} saved successfully!`, {
        position: "top-right",
      });

      // If onSave callback is provided, call it to move to next result
      if (onSave) {
        onSave();
      } else {
        // Default behavior if no onSave provided
        setResults(null);
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save. Please try again.",
        {
          position: "top-right",
        }
      );
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get a display-friendly name for entity types
  const getEntityDisplayName = (entityType: string) => {
    const displayNames: Record<string, string> = {
      TITRE: t("analysis.title"),
      DELAI: t("analysis.deadline"),
      PRIORITE: t("analysis.priority"),
      DATE_HEURE: t("analysis.date"),
    };
    return displayNames[entityType] || entityType;
  };

  // Helper function to ensure all required entities exist and order them correctly
  const getOrderedEntitiesForDisplay = (
    type: string,
    entities: Record<string, string[]>
  ): Array<[string, string[]]> => {
    // Clone entities to avoid modifying the original
    const result = { ...entities };

    if (type === "Task") {
      // Ensure all required properties exist
      if (!result["TITRE"]) result["TITRE"] = [];
      if (!result["DELAI"]) result["DELAI"] = [];
      if (!result["PRIORITE"]) result["PRIORITE"] = [];

      // Return entities in the specific order
      return [
        ["TITRE", result["TITRE"]],
        ["DELAI", result["DELAI"]],
        ["PRIORITE", result["PRIORITE"]],
      ];
    } else if (type === "Event") {
      // Ensure all required properties exist
      if (!result["TITRE"]) result["TITRE"] = [];
      if (!result["DATE_HEURE"]) result["DATE_HEURE"] = [];

      // Return entities in the specific order
      return [
        ["TITRE", result["TITRE"]],
        ["DATE_HEURE", result["DATE_HEURE"]],
      ];
    }

    // Fallback to object entries if type is unknown
    return Object.entries(result);
  };

  // Render priority selector or regular field editor based on entity type
  const renderEntityEditor = (entityType: string, values: string[]) => {
    if (entityType === "PRIORITE" && results.type === "Task") {
      return (
        <div className="flex items-center gap-3 mt-2">
          <PrioritySelect
            value={getCurrentPriorityLevel()}
            onValueChange={handlePriorityChange}
          />
          <span className="text-xs text-muted-foreground">
            {values.length > 0
              ? `Detected: ${values[0]}`
              : "Not detected (default: Medium)"}
          </span>
        </div>
      );
    } else if (
      (entityType === "DELAI" && results.type === "Task") ||
      (entityType === "DATE_HEURE" && results.type === "Event")
    ) {
      return (
        <div className="space-y-2">
          {values.length > 0 ? (
            values.map((value, index) => {
              // Try to parse the value as JSON to check if it's already a structured date
              let originalText = value;
              let parsedDate: Date | null = null;

              try {
                const parsed = JSON.parse(value);
                if (parsed.originalText && parsed.parsedDate) {
                  originalText = parsed.originalText;
                  parsedDate = new Date(parsed.parsedDate);
                }
              } catch {
                // If not JSON, try to parse with French first, then English
                console.log(`Trying to parse raw value: "${value}"`);
                // First try with French parser
                parsedDate = frenchParser.parseDate(value);

                // If French fails, try English
                if (!parsedDate) {
                  parsedDate = englishParser.parseDate(value);
                }

                originalText = value;
              }

              // Log the parsing result for debugging
              console.log(
                `Parsed date for "${originalText}": ${
                  parsedDate ? formatDate(parsedDate) : "No date found"
                }`
              );

              return (
                <div key={index} className="flex items-center gap-2">
                  {editingEntity === `${entityType}_${index}` ? (
                    <div className="flex items-center gap-1 w-full">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEntityEdit(entityType, index);
                          }
                        }}
                        autoFocus
                        className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
                        placeholder={
                          entityType === "DELAI"
                            ? "ex: tomorrow, next week, 05/05/2025"
                            : "ex: tomorrow at 3pm, next Monday at 10am"
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => saveEntityEdit(entityType, index)}
                        className="h-7 w-7 hover:text-primary"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEntity(null)}
                        className="h-7 w-7 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col w-full group hover:bg-background/50 rounded-md transition-colors"
                      onClick={() =>
                        startEditEntity(entityType, originalText, index)
                      }
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 px-3 py-1.5 rounded-md text-sm cursor-pointer">
                          {originalText}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="px-3 pb-1.5 text-xs text-muted-foreground">
                        {parsedDate
                          ? `Interpreted as: ${formatDate(parsedDate)}`
                          : "Date not recognized"}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex items-center gap-2">
              {editingEntity === `${entityType}_0` ? (
                <div className="flex items-center gap-1 w-full">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEntityEdit(entityType, 0);
                      }
                    }}
                    autoFocus
                    className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
                    placeholder={
                      entityType === "DELAI"
                        ? "ex: tomorrow, next week, 05/05/2025"
                        : "ex: tomorrow at 3pm, next Monday at 10am"
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveEntityEdit(entityType, 0)}
                    className="h-7 w-7 hover:text-primary"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingEntity(null)}
                    className="h-7 w-7 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-between w-full group bg-background/30 hover:bg-background/50 rounded-md transition-colors"
                  onClick={() => startEditEntity(entityType, "", 0)}
                >
                  <div className="flex-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground cursor-pointer">
                    Click to add
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {values.length > 0 ? (
          values.map((value, index) => (
            <div key={index} className="flex items-center gap-2">
              {editingEntity === `${entityType}_${index}` ? (
                <div className="flex items-center gap-1 w-full">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        saveEntityEdit(entityType, index);
                      }
                    }}
                    autoFocus
                    className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => saveEntityEdit(entityType, index)}
                    className="h-7 w-7 hover:text-primary"
                  >
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingEntity(null)}
                    className="h-7 w-7 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center justify-between w-full group hover:bg-background/50 rounded-md transition-colors"
                  onClick={() => startEditEntity(entityType, value, index)}
                >
                  <div className="flex-1 px-3 py-1.5 rounded-md text-sm cursor-pointer">
                    {value}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2">
            {editingEntity === `${entityType}_0` ? (
              <div className="flex items-center gap-1 w-full">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEntityEdit(entityType, 0);
                    }
                  }}
                  autoFocus
                  className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveEntityEdit(entityType, 0)}
                  className="h-7 w-7 hover:text-primary"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingEntity(null)}
                  className="h-7 w-7 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center justify-between w-full group bg-background/30 hover:bg-background/50 rounded-md transition-colors"
                onClick={() => startEditEntity(entityType, "", 0)}
              >
                <div className="flex-1 px-3 py-1.5 rounded-md text-sm text-muted-foreground cursor-pointer">
                  Click to add
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="shadow-md border border-primary/30 overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{t("analysis.resultsTitle")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium">{t("analysis.type")}</h3>
          <Select value={results.type} onValueChange={handleTypeChange} />
        </div>

        <div className="space-y-3">
          {getOrderedEntitiesForDisplay(results.type, results.entities).map(
            ([entityType, values]) => (
              <div
                key={entityType}
                className="bg-muted/10 p-3 rounded-lg border border-primary/5 transition-all hover:shadow-sm hover:border-primary/20"
              >
                <h4 className="text-sm font-medium text-primary/80 mb-2">
                  {getEntityDisplayName(entityType)}
                </h4>
                {renderEntityEditor(entityType, values)}
              </div>
            )
          )}
        </div>
      </CardContent>
      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-background to-transparent pt-6">
        <CardFooter className="flex justify-between p-3 border-t border-border/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setResults(null)}
            className="text-xs h-8"
          >
            {t("analysis.clear")}
          </Button>
          <Button
            size="sm"
            onClick={saveTask}
            disabled={saving || isSaved}
            className={`text-xs h-8 ${
              isSaved
                ? "bg-green-500/70 hover:bg-green-500/70 cursor-not-allowed"
                : ""
            }`}
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />{" "}
                {t("analysis.saving")}
              </div>
            ) : isSaved ? (
              t("analysis.saved")
            ) : (
              t("analysis.save")
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

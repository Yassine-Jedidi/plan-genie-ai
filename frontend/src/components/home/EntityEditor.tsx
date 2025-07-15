import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import PrioritySelect from "@/components/home/PrioritySelect";
import { frenchParser, englishParser } from "@/lib/analysisUtils";
import { PriorityLevel } from "@/services/priorityService";
import { formatDate as formatDateUtil } from "@/lib/dateUtils";
import React from "react";

interface EntityEditorProps {
  entityType: string;
  values: string[];
  editingEntity: string | null;
  editValue: string;
  onStartEdit: (entityType: string, value: string, index: number) => void;
  onEditChange: (value: string) => void;
  onSaveEdit: (entityType: string, index: number) => void;
  onCancelEdit: () => void;
  resultsType: string;
  getCurrentPriorityLevel: () => PriorityLevel;
  handlePriorityChange: (priorityLevel: PriorityLevel) => void;
}

const EntityEditor: React.FC<EntityEditorProps> = ({
  entityType,
  values,
  editingEntity,
  editValue,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  resultsType,
  getCurrentPriorityLevel,
  handlePriorityChange,
}) => {
  if (entityType === "PRIORITE" && resultsType === "Task") {
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
    (entityType === "DELAI" && resultsType === "Task") ||
    (entityType === "DATE_HEURE" && resultsType === "Event")
  ) {
    return (
      <div className="space-y-2">
        {values.length > 0 ? (
          values.map((value, index) => {
            let originalText = value;
            let parsedDate: Date | null = null;
            try {
              const parsed = JSON.parse(value);
              if (parsed.originalText && parsed.parsedDate) {
                originalText = parsed.originalText;
                parsedDate = new Date(parsed.parsedDate);
              }
            } catch {
              parsedDate = frenchParser.parseDate(value);
              if (!parsedDate) {
                parsedDate = englishParser.parseDate(value);
              }
              originalText = value;
            }
            return (
              <div key={index} className="flex items-center gap-2">
                {editingEntity === `${entityType}_${index}` ? (
                  <div className="flex items-center gap-1 w-full">
                    <Input
                      value={editValue}
                      onChange={(e) => onEditChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onSaveEdit(entityType, index);
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
                      onClick={() => onSaveEdit(entityType, index)}
                      className="h-7 w-7 hover:text-primary"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onCancelEdit}
                      className="h-7 w-7 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col w-full group hover:bg-background/50 rounded-md transition-colors"
                    onClick={() => onStartEdit(entityType, originalText, index)}
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
                        ? `Interpreted as: ${formatDateUtil(
                            parsedDate.toISOString(),
                            {
                              weekday: "long",
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}`
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
                  onChange={(e) => onEditChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSaveEdit(entityType, 0);
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
                  onClick={() => onSaveEdit(entityType, 0)}
                  className="h-7 w-7 hover:text-primary"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-7 w-7 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center justify-between w-full group bg-background/30 hover:bg-background/50 rounded-md transition-colors"
                onClick={() => onStartEdit(entityType, "", 0)}
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

  // Default: simple text entity
  return (
    <div className="space-y-2">
      {values.length > 0 ? (
        values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            {editingEntity === `${entityType}_${index}` ? (
              <div className="flex items-center gap-1 w-full">
                <Input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSaveEdit(entityType, index);
                    }
                  }}
                  autoFocus
                  className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onSaveEdit(entityType, index)}
                  className="h-7 w-7 hover:text-primary"
                >
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-7 w-7 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center justify-between w-full group hover:bg-background/50 rounded-md transition-colors"
                onClick={() => onStartEdit(entityType, value, index)}
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
                onChange={(e) => onEditChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onSaveEdit(entityType, 0);
                  }
                }}
                autoFocus
                className="flex-1 h-8 text-sm focus-visible:ring-primary/30"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onSaveEdit(entityType, 0)}
                className="h-7 w-7 hover:text-primary"
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancelEdit}
                className="h-7 w-7 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between w-full group bg-background/30 hover:bg-background/50 rounded-md transition-colors"
              onClick={() => onStartEdit(entityType, "", 0)}
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

export default EntityEditor;

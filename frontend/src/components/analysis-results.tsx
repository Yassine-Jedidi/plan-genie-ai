import { useState } from "react";
import { toast } from "sonner";
import { Edit, Save, X } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";

// Create custom select components
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const Select = ({ value, onValueChange }: SelectProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {value} <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => onValueChange("Tâche")}>
          Tâche
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onValueChange("Événement")}>
          Événement
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  setResults: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
}

export function AnalysisResults({ results, setResults }: AnalysisResultsProps) {
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  if (!results) return null;

  const handleTypeChange = (newType: string) => {
    if (results) {
      // Create a new entities object with the appropriate structure for the new type
      const newEntities: Record<string, string[]> = {};

      if (newType === "Tâche") {
        // For Tâche type, ensure TITRE, DELAI, and PRIORITE exist
        newEntities["TITRE"] = results.entities["TITRE"] || [];
        newEntities["DELAI"] = results.entities["DELAI"] || [];
        newEntities["PRIORITE"] = results.entities["PRIORITE"] || [];
      } else if (newType === "Événement") {
        // For Événement type, ensure TITRE and DATE_HEURE exist
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

      // If index is beyond current length, add a new item
      if (index >= updatedEntities[entityType].length) {
        updatedEntities[entityType].push(editValue);
      } else {
        // Otherwise update existing item
        updatedEntities[entityType][index] = editValue;
      }

      setResults({
        ...results,
        entities: updatedEntities,
      });
      setEditingEntity(null);
    }
  };

  // Function to save task to the database
  const saveTask = async () => {
    if (!results) {
      toast.error("No task to save");
      return;
    }

    setSaving(true);
    try {
      await taskService.saveTask(results);
      toast.success(`${results.type} saved successfully!`);
      setResults(null); // Clear the form after saving
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Helper function to get a display-friendly name for entity types
  const getEntityDisplayName = (entityType: string) => {
    const displayNames: Record<string, string> = {
      TITRE: "Titre",
      DELAI: "Délai",
      PRIORITE: "Priorité",
      DATE_HEURE: "Date",
    };
    return displayNames[entityType] || entityType;
  };

  // Helper function to ensure all required entities exist
  const getEntitiesForDisplay = (
    type: string,
    entities: Record<string, string[]>
  ) => {
    const result = { ...entities };

    if (type === "Tâche") {
      if (!result["TITRE"]) result["TITRE"] = [];
      if (!result["DELAI"]) result["DELAI"] = [];
      if (!result["PRIORITE"]) result["PRIORITE"] = [];
    } else if (type === "Événement") {
      if (!result["TITRE"]) result["TITRE"] = [];
      if (!result["DATE_HEURE"]) result["DATE_HEURE"] = [];
    }

    return result;
  };

  return (
    <Card className="shadow-md border border-primary/10 overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Analysis Results</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium">Task Type:</h3>
          <Select value={results.type} onValueChange={handleTypeChange} />
        </div>

        <div className="space-y-3">
          {Object.entries(
            getEntitiesForDisplay(results.type, results.entities)
          ).map(([entityType, values]) => (
            <div
              key={entityType}
              className="bg-muted/10 p-3 rounded-lg border border-primary/5 transition-all hover:shadow-sm hover:border-primary/20"
            >
              <h4 className="text-sm font-medium text-primary/80 mb-2">
                {getEntityDisplayName(entityType)}
              </h4>
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
                          onClick={() =>
                            startEditEntity(entityType, value, index)
                          }
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
                          Cliquez pour ajouter
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
            </div>
          ))}
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
            Clear
          </Button>
          <Button
            size="sm"
            onClick={saveTask}
            disabled={saving}
            className="text-xs h-8"
          >
            {saving ? "Saving..." : "Save Task"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

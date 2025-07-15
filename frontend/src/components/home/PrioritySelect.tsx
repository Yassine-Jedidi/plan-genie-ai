import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { priorityService, PriorityLevel } from "@/services/priorityService";

interface PrioritySelectProps {
  value: PriorityLevel;
  onValueChange: (value: PriorityLevel) => void;
}

const PrioritySelect = ({ value, onValueChange }: PrioritySelectProps) => {
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

export default PrioritySelect;

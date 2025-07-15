import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectType = ({ value, onValueChange }: SelectProps) => {
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

export default SelectType;

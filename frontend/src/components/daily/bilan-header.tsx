import React from "react";
import { ChevronLeft, ChevronRight, History, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/daily/date-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface BilanHeaderProps {
  selectedDate: Date;
  currentUtcTime: string;
  showHistory: boolean;
  isDateToday: (date: Date) => boolean;
  onDateSelect: (date: Date | undefined) => void;
  onGoToPreviousDay: () => void;
  onGoToToday: () => void;
  onGoToNextDay: () => void;
  onToggleHistory: () => void;
}

const BilanHeader: React.FC<BilanHeaderProps> = ({
  selectedDate,
  currentUtcTime,
  showHistory,
  isDateToday,
  onDateSelect,
  onGoToPreviousDay,
  onGoToToday,
  onGoToNextDay,
  onToggleHistory,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live : {currentUtcTime}</span>
                  <Info className="h-3 w-3" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("bilan.summariesGenerated")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <DatePicker date={selectedDate} onSelect={onDateSelect} />

        <div className="inline-flex w-auto -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
          <Button
            onClick={onGoToPreviousDay}
            className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
            variant="outline"
            size="icon"
            aria-label="Navigate to previous day"
          >
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
          <Button onClick={onGoToToday} variant="outline">
            {t("bilan.today")}
          </Button>
          <Button
            onClick={onGoToNextDay}
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
          onClick={onToggleHistory}
          className="ml-1 rounded-lg"
        >
          <History className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BilanHeader;

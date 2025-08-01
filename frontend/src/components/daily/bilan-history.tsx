import React from "react";
import { format as dateFormat, isSameDay } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bilan } from "types/bilan";
import { cn } from "@/lib/dateUtils";
import { useTranslation } from "react-i18next";

interface BilanHistoryProps {
  recentBilans: Bilan[];
  loadingRecentBilans: boolean;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const BilanHistory: React.FC<BilanHistoryProps> = ({
  recentBilans,
  loadingRecentBilans,
  selectedDate,
  onDateSelect,
}) => {
  const { t } = useTranslation();

  // Format date for history selector
  const formatDateForHistory = (date: Date) => {
    const today = new Date();
    if (isSameDay(date, today)) {
      return "Today";
    }
    return dateFormat(date, "EEE, MMM d");
  };

  // Calculate total time for a bilan
  const calculateBilanTotalTime = (bilan: Bilan) => {
    return bilan.entries.reduce((sum, entry) => sum + entry.minutes_spent, 0);
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
          {t("bilan.noHistory")}
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
              onClick={() => onDateSelect(date)}
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

export default BilanHistory;

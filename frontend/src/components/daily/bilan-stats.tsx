import React from "react";
import { Clock, Target, TrendingUp } from "lucide-react";
import { Bilan } from "types/bilan";

interface BilanStatsProps {
  bilan: Bilan;
  totalMinutes: number;
  getNonOverdueTasksCount: () => number;
}

const BilanStats: React.FC<BilanStatsProps> = ({
  bilan,
  totalMinutes,
  getNonOverdueTasksCount,
}) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200/50 dark:border-green-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Time</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatTime(totalMinutes)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Tasks Tracked</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {bilan.entries.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-xl">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Productivity</p>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">
              {totalMinutes > 0
                ? Math.round(
                    (bilan.entries.length / getNonOverdueTasksCount()) * 100
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BilanStats;

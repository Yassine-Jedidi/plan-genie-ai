import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

interface ThemeToggleProps {
  className?: string;
}

export function ModeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, colorTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Get the color based on the current color theme
  const getThemeColor = () => {
    switch (colorTheme) {
      case "red":
        return isDark ? "#ef4444" : "#ef4444";
      case "blue":
        return isDark ? "#3b82f6" : "#3b82f6";
      case "green":
        return isDark ? "#10b981" : "#10b981";
      case "purple":
        return isDark ? "#a855f7" : "#a855f7";
      case "orange":
        return isDark ? "#f97316" : "#f97316";
      case "pink":
        return isDark ? "#ec4899" : "#ec4899";
      case "teal":
        return isDark ? "#14b8a6" : "#14b8a6";
      default:
        return isDark ? "#ffffff" : "#000000";
    }
  };

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
          ? "bg-zinc-950 border border-zinc-800"
          : "bg-white border border-zinc-200",
        className
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark ? "transform translate-x-0" : "transform translate-x-8"
          )}
          style={{
            backgroundColor: isDark ? "#1e293b" : "#f8fafc",
            borderColor: getThemeColor(),
            borderWidth: "1px",
          }}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-white" strokeWidth={1.5} />
          ) : (
            <Sun className="w-4 h-4 text-gray-700" strokeWidth={1.5} />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
}

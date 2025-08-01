import { isToday, isBefore, addDays } from "date-fns";
import { formatDate, formatTime as formatTimeUtils } from "@/lib/dateUtils";

// Format minutes as hours and minutes
export const formatTime = (minutes: number) => {
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

// Format deadline for display
export const formatDeadline = (deadline: Date | null) => {
  if (!deadline) return null;

  try {
    if (isToday(deadline)) {
      return `Today at ${formatTimeUtils(deadline)}`;
    }

    return formatDate(deadline, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return deadline.toString();
  }
};

// Check if a task deadline is approaching (within 7 days, excluding overdue tasks)
export const isDeadlineApproaching = (deadline: Date | null) => {
  if (!deadline) return false;

  try {
    const now = new Date();
    // Ensure the deadline is in the future (not overdue)
    if (isBefore(deadline, now)) {
      return false; // Already overdue, or in the past
    }

    // Check if the deadline is within the next 7 days from now
    return isBefore(deadline, addDays(now, 7));
  } catch {
    return false;
  }
};

// Check if a task is overdue
export const isTaskOverdue = (deadline: Date | null) => {
  if (!deadline) return false;

  try {
    const now = new Date(); // Use current time for comparison
    return isBefore(deadline, now);
  } catch {
    return false;
  }
};

// Check if a date is today
export const isDateToday = (date: Date) => {
  return isToday(date);
};

// Parse time input to minutes
export const parseTimeInput = (input: string): number => {
  let minutes = 0;

  // Handle empty input
  if (!input || input.trim() === "") {
    return 0;
  }

  // Check for negative values which are invalid
  if (input.includes("-")) {
    return -1; // Return negative to trigger the validation error
  }

  // Match hours pattern (e.g., "2h" or "2 h")
  const hoursMatch = input.match(/(\d+)\s*h/i);
  if (hoursMatch) {
    minutes += parseInt(hoursMatch[1], 10) * 60;
  }

  // Match minutes pattern (e.g., "30m" or "30 m")
  const minutesMatch = input.match(/(\d+)\s*m/i);
  if (minutesMatch) {
    minutes += parseInt(minutesMatch[1], 10);
  }

  // If no pattern matched but it's a number, assume minutes
  if (minutes === 0) {
    if (/^\d+$/.test(input.trim())) {
      minutes = parseInt(input.trim(), 10);
    } else if (!hoursMatch && !minutesMatch) {
      // If input contains text but no valid patterns were found
      return -1; // Return negative to trigger the validation error
    }
  }

  return minutes;
};

import { Row } from "@tanstack/react-table";
import { Task } from "types/task";

// Custom filter function for multi-column searching
export const multiColumnFilterFn = (row: Row<Task>, _columnId: string, filterValue: string) => {
  const searchableRowContent = `${row.original.title} ${row.original.priority || ""}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

export const priorityFilterFn = (row: Row<Task>, columnId: string, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const priority = row.getValue(columnId) as string;
  return filterValue.includes(priority);
};

export const statusFilterFn = (row: Row<Task>, columnId: string, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export const dueInFilterFn = (row: Row<Task>, columnId: string, filterValue: string[]) => {
  const deadline = row.getValue(columnId) as string | null;
  const completedAt = row.original.completed_at;

  if (completedAt) {
    if (!deadline && filterValue.includes("noDeadline")) {
      return true;
    }
    return false;
  }

  if (!deadline && filterValue.includes("noDeadline")) {
    return true;
  }

  if (!deadline) {
    return false;
  }

  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(todayStart);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date(todayStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const isOverdue = deadlineDate < todayStart;
    const isToday = deadlineDate >= todayStart && deadlineDate < tomorrow;
    const isThisWeek = deadlineDate >= tomorrow && deadlineDate < nextWeek;
    const isThisMonth = deadlineDate >= nextWeek && deadlineDate < nextMonth;
    const isLater = deadlineDate >= nextMonth;

    if (filterValue.length === 0) {
      return true;
    }

    return (
      (isOverdue && filterValue.includes("overdue")) ||
      (isToday && filterValue.includes("today")) ||
      (isThisWeek && filterValue.includes("thisWeek")) ||
      (isThisMonth && filterValue.includes("thisMonth")) ||
      (isLater && filterValue.includes("later"))
    );
  } catch {
    return false;
  }
}; 
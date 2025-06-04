import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { formatDistanceToNowStrict, isPast } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleX,
  Columns3,
  Ellipsis,
  Filter,
  ListFilter,
  Plus,
  Trash,
} from "lucide-react";
import { useId, useMemo, useRef, useState, useEffect } from "react";
import { Task, taskService } from "@/services/taskService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Task> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.title} ${
    row.original.priority || ""
  }`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const priorityFilterFn: FilterFn<Task> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const priority = row.getValue(columnId) as string;
  return filterValue.includes(priority);
};

const statusFilterFn: FilterFn<Task> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

// Due In filter function
const dueInFilterFn: FilterFn<Task> = (row, columnId, filterValue) => {
  const deadline = row.getValue(columnId) as string | null;

  // If no deadline and "noDeadline" filter is active, show this task
  if (!deadline && filterValue.includes("noDeadline")) {
    return true;
  }

  // If there's no deadline and "noDeadline" filter is not active, don't show this task
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

    // Pre-calculate conditions to avoid lexical declarations in case blocks
    const isOverdue = deadlineDate < todayStart;
    const isToday = deadlineDate >= todayStart && deadlineDate < tomorrow;
    const isThisWeek = deadlineDate >= tomorrow && deadlineDate < nextWeek;
    const isThisMonth = deadlineDate >= nextWeek && deadlineDate < nextMonth;
    const isLater = deadlineDate >= nextMonth;

    // If filter value is empty, show all tasks
    if (filterValue.length === 0) {
      return true;
    }

    // Check if the task matches any of the active filters
    return (
      (isOverdue && filterValue.includes("overdue")) ||
      (isToday && filterValue.includes("today")) ||
      (isThisWeek && filterValue.includes("thisWeek")) ||
      (isThisMonth && filterValue.includes("thisMonth")) ||
      (isLater && filterValue.includes("later"))
    );
  } catch {
    // For invalid dates, don't show the task
    return false;
  }
};

const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 40,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("title")}</div>
    ),
    size: 300,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Deadline",
    accessorKey: "deadline",
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as string | null;
      const deadlineText = row.original.deadline_text;

      if (!deadline) return <span className="text-muted-foreground">None</span>;

      try {
        // Format the date using our utility function that handles timezones
        const formattedDate = formatDate(deadline, {
          weekday: "long",
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        });

        // Extract the date and time parts more reliably
        const lastSpaceIndex = formattedDate.lastIndexOf(" ");
        const datePart = formattedDate.substring(0, lastSpaceIndex);
        const timePart = formattedDate.substring(lastSpaceIndex + 1);

        const formattedWithEmoji = (
          <span>
            📅 {datePart} ·{" "}
            <Badge
              variant="outline"
              className="px-1.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-medium"
            >
              {timePart}
            </Badge>
          </span>
        );

        // If we have the original text, display it with the formatted date
        if (deadlineText) {
          return (
            <div className="flex flex-col">
              <span>{formattedWithEmoji}</span>
              <span className="text-xs text-muted-foreground">
                {deadlineText}
              </span>
            </div>
          );
        }

        return formattedWithEmoji;
        // eslint-disable-next-line no-empty
      } catch {
        // If parsing fails, just return the raw deadline
        return deadline;
      }
    },
    size: 240,
  },
  {
    header: "Due In",
    accessorKey: "deadline",
    cell: ({ row }) => {
      const deadline = row.getValue("deadline") as string | null;
      if (!deadline) return <span className="text-muted-foreground">—</span>;

      try {
        const date = new Date(deadline);

        // Check if the deadline is in the past
        if (isPast(date)) {
          return (
            <Badge
              variant="outline"
              className="bg-red-100 text-red-800 border-red-300"
            >
              ⏱️ Overdue
            </Badge>
          );
        }

        // Calculate time remaining
        const timeRemaining = formatDistanceToNowStrict(date, {
          addSuffix: false,
        });

        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            ⏱️ {timeRemaining} left
          </Badge>
        );
      } catch {
        return <span className="text-muted-foreground">Invalid date</span>;
      }
    },
    size: 130,
    filterFn: dueInFilterFn,
  },
  {
    header: "Priority",
    accessorKey: "priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string | null;
      if (!priority) return <span className="text-muted-foreground">None</span>;

      const priorityColors: Record<string, string> = {
        High: "bg-red-100 text-red-800 border-red-300",
        Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
        Low: "bg-green-100 text-green-800 border-green-300",
      };

      const priorityEmojis: Record<string, string> = {
        High: "🔴",
        Medium: "🟡",
        Low: "🟢",
      };

      const colorClass =
        priorityColors[priority] ||
        "bg-muted-foreground/60 text-primary-foreground";

      return (
        <Badge className={cn(colorClass)} variant="outline">
          {priorityEmojis[priority] || ""} {priority}
        </Badge>
      );
    },
    size: 120,
    filterFn: priorityFilterFn,
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      if (!status)
        return <span className="text-muted-foreground">Planned</span>;

      const statusColors: Record<string, string> = {
        Done: "bg-green-100 text-green-800 border-green-300",
        "In Progress": "bg-blue-100 text-blue-800 border-blue-300",
        Planned: "bg-amber-100 text-amber-800 border-amber-300",
      };

      const statusEmojis: Record<string, string> = {
        Done: "✅",
        "In Progress": "🔄",
        Planned: "📝",
      };

      const colorClass =
        statusColors[status] || "bg-amber-100 text-amber-800 border-amber-300"; // Default to Planned style

      return (
        <Badge className={cn(colorClass)} variant="outline">
          {statusEmojis[status] || ""} {status || "Planned"}
        </Badge>
      );
    },
    size: 140,
    filterFn: statusFilterFn,
  },
  {
    header: "Created",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(date);

      return <span>🕒 {formattedDate}</span>;
    },
    size: 180,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: () => null,
    size: 60,
    enableHiding: false,
  },
];

interface TasksTableProps {
  tasks: Task[];
}

export default function TasksTable({ tasks }: TasksTableProps) {
  const navigate = useNavigate();
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useMemo(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Add event listener for task deletion from row actions
  useEffect(() => {
    const handleTaskDeleted = (event: CustomEvent<string>) => {
      const taskId = event.detail;
      setLocalTasks((prev) => prev.filter((task) => task.id !== taskId));
    };

    window.addEventListener("taskDeleted", handleTaskDeleted as EventListener);

    return () => {
      window.removeEventListener(
        "taskDeleted",
        handleTaskDeleted as EventListener
      );
    };
  }, []);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "created_at",
      desc: true,
    },
  ]);

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    // Collect task IDs to delete
    const taskIds = selectedRows.map((row) => row.original.id);

    // Create array of deletion promises without updating UI for each one
    const deletePromises = taskIds.map((taskId) =>
      taskService.deleteTask(taskId)
    );

    Promise.all(deletePromises)
      .then(() => {
        // Update UI once after all tasks are deleted
        setLocalTasks((prev) =>
          prev.filter((task) => !taskIds.includes(task.id))
        );
        table.resetRowSelection();
        if (selectedRows.length === 1)
          toast.success(`1 task deleted successfully`);
        else toast.success(`${selectedRows.length} tasks deleted successfully`);
      })
      .catch((error) => {
        toast.error("Failed to delete tasks");
        console.error("Error deleting tasks:", error);
      });
  };

  const table = useReactTable({
    data: localTasks,
    columns: useMemo(
      () => [
        ...columns.slice(0, -1),
        {
          ...columns[columns.length - 1],
          cell: ({ row }) => <RowActions row={row} />,
        },
      ],
      []
    ),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  // Get unique priority values
  const uniquePriorityValues = useMemo(() => {
    const priorityColumn = table.getColumn("priority");

    if (!priorityColumn) return [];

    const values = Array.from(
      priorityColumn.getFacetedUniqueValues().keys()
    ).filter((value) => value !== null && value !== undefined);

    return values.sort();
  }, [table.getColumn("priority")?.getFacetedUniqueValues()]);

  // Get unique status values
  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status");

    if (!statusColumn) return [];

    const values = Array.from(
      statusColumn.getFacetedUniqueValues().keys()
    ).filter((value) => value !== null && value !== undefined);

    return values.sort();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  // Get counts for each priority
  const priorityCounts = useMemo(() => {
    const priorityColumn = table.getColumn("priority");
    if (!priorityColumn) return new Map();
    return priorityColumn.getFacetedUniqueValues();
  }, [table.getColumn("priority")?.getFacetedUniqueValues()]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status");
    if (!statusColumn) return new Map();
    return statusColumn.getFacetedUniqueValues();
  }, [table.getColumn("status")?.getFacetedUniqueValues()]);

  // Get due in filter counts
  const dueCounts = useMemo(() => {
    if (!localTasks)
      return {
        overdue: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        later: 0,
        noDeadline: 0,
      };

    let overdue = 0;
    let today = 0;
    let thisWeek = 0;
    let thisMonth = 0;
    let later = 0;
    let noDeadline = 0;

    // Set up date boundaries
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(todayStart);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date(todayStart);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    localTasks.forEach((task) => {
      if (!task.deadline) {
        noDeadline++;
        return;
      }

      try {
        const deadlineDate = new Date(task.deadline);

        if (deadlineDate < todayStart) {
          overdue++;
        } else if (deadlineDate >= todayStart && deadlineDate < tomorrow) {
          today++;
        } else if (deadlineDate >= tomorrow && deadlineDate < nextWeek) {
          thisWeek++;
        } else if (deadlineDate >= nextWeek && deadlineDate < nextMonth) {
          thisMonth++;
        } else if (deadlineDate >= nextMonth) {
          later++;
        }
      } catch {
        // Skip invalid dates
      }
    });

    return { overdue, today, thisWeek, thisMonth, later, noDeadline };
  }, [localTasks]);

  const selectedPriorities = useMemo(() => {
    const filterValue = table
      .getColumn("priority")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("priority")?.getFilterValue()]);

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("status")?.getFilterValue()]);

  // Selected Due In filters
  const selectedDueIn = useMemo(() => {
    const filterValue = table
      .getColumn("deadline")
      ?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn("deadline")?.getFilterValue()]);

  const handlePriorityChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("priority")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("priority")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table
      .getColumn("status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  // Handle due in filter selection
  const handleDueInChange = (checked: boolean, value: string) => {
    const dueColumn = table.getColumn("deadline");
    if (!dueColumn) return;

    const currentFilters = (dueColumn.getFilterValue() as string[]) || [];
    let newFilters: string[];

    if (checked) {
      newFilters = [...currentFilters, value];
    } else {
      newFilters = currentFilters.filter((item) => item !== value);
    }

    dueColumn.setFilterValue(newFilters);
  };

  // Define the RowActions component inside TasksTable to access table state
  function RowActions({ row }: { row: Row<Task> }) {
    const task = row.original;
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleDelete = async () => {
      try {
        await taskService.deleteTask(task.id);
        // Update the local tasks directly using the TasksTable component's state setter
        window.dispatchEvent(
          new CustomEvent("taskDeleted", { detail: task.id })
        );
        // Reset row selection after deleting the task
        table.resetRowSelection();
        // Close the delete confirmation dialog and dropdown menu
        setDeleteConfirmOpen(false);
        setDropdownOpen(false);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Error deleting task:", error);
      }
    };

    return (
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit task"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Mark as complete</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Archive</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <AlertDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
          >
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteConfirmOpen(true);
                }}
              >
                <span>Delete</span>
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                  aria-hidden="true"
                >
                  <CircleAlert
                    className="opacity-80"
                    size={16}
                    strokeWidth={2}
                  />
                </div>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-4 w-full min-w-full border border-primary/30 rounded-lg p-2 sm:p-4 shadow-sm">
      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-1 mb-1">
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 text-xs",
            selectedStatuses.includes("Planned") && "ring-2 ring-amber-400"
          )}
          onClick={() => {
            // Toggle filter for "Planned" status
            const currentFilter =
              (table.getColumn("status")?.getFilterValue() as string[]) || [];
            const isSelected = currentFilter.includes("Planned");
            const newFilter = isSelected
              ? currentFilter.filter((s) => s !== "Planned")
              : [...currentFilter, "Planned"];

            table
              .getColumn("status")
              ?.setFilterValue(newFilter.length ? newFilter : undefined);
          }}
        >
          📝 Planned
          <span className="ml-1 inline-flex h-4 items-center rounded bg-background-200 px-1 text-xs font-medium text-amber-800">
            {`(${statusCounts.get("Planned") || 0})`}
          </span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 text-xs",
            selectedStatuses.includes("In Progress") && "ring-2 ring-blue-400"
          )}
          onClick={() => {
            // Toggle filter for "In Progress" status
            const currentFilter =
              (table.getColumn("status")?.getFilterValue() as string[]) || [];
            const isSelected = currentFilter.includes("In Progress");
            const newFilter = isSelected
              ? currentFilter.filter((s) => s !== "In Progress")
              : [...currentFilter, "In Progress"];

            table
              .getColumn("status")
              ?.setFilterValue(newFilter.length ? newFilter : undefined);
          }}
        >
          🔄 In Progress
          <span className="ml-1 inline-flex h-4 items-center rounded bg-background-200 px-1 text-xs font-medium text-blue-800">
            {`(${statusCounts.get("In Progress") || 0})`}
          </span>
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 text-xs",
            selectedStatuses.includes("Done") && "ring-2 ring-green-400"
          )}
          onClick={() => {
            // Toggle filter for "Done" status
            const currentFilter =
              (table.getColumn("status")?.getFilterValue() as string[]) || [];
            const isSelected = currentFilter.includes("Done");
            const newFilter = isSelected
              ? currentFilter.filter((s) => s !== "Done")
              : [...currentFilter, "Done"];

            table
              .getColumn("status")
              ?.setFilterValue(newFilter.length ? newFilter : undefined);
          }}
        >
          ✅ Done
          <span className="ml-1 inline-flex h-4 items-center rounded bg-background-200 px-1 text-xs font-medium text-green-800">
            {`(${statusCounts.get("Done") || 0})`}
          </span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Filter by title or priority */}
          <div className="relative w-full sm:w-auto">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer w-full sm:min-w-60 ps-9",
                Boolean(table.getColumn("title")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("title")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("title")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by title or priority..."
              type="text"
              aria-label="Filter by title or priority"
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("title")?.getFilterValue()) && (
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("title")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0 w-full">
            {/* Filter by priority */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Priority
                  {selectedPriorities.length > 0 && (
                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {selectedPriorities.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Filters
                  </div>
                  <div className="space-y-3">
                    {uniquePriorityValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-${i}`}
                          checked={selectedPriorities.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handlePriorityChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="ms-2 text-xs text-muted-foreground">
                            {priorityCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Filter by status */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Status
                  {selectedStatuses.length > 0 && (
                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {selectedStatuses.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Filters
                  </div>
                  <div className="space-y-3">
                    {uniqueStatusValues.map((value, i) => (
                      <div key={value} className="flex items-center gap-2">
                        <Checkbox
                          id={`${id}-status-${i}`}
                          checked={selectedStatuses.includes(value)}
                          onCheckedChange={(checked: boolean) =>
                            handleStatusChange(checked, value)
                          }
                        />
                        <Label
                          htmlFor={`${id}-status-${i}`}
                          className="flex grow justify-between gap-2 font-normal"
                        >
                          {value}{" "}
                          <span className="ms-2 text-xs text-muted-foreground">
                            {statusCounts.get(value)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Filter by due date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Due In
                  {selectedDueIn.length > 0 && (
                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                      {selectedDueIn.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="min-w-36 p-3" align="start">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Time Frames
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-overdue`}
                        checked={selectedDueIn.includes("overdue")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "overdue")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-overdue`}
                        className="flex grow justify-between gap-2 font-normal text-red-600"
                      >
                        Overdue{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.overdue}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-today`}
                        checked={selectedDueIn.includes("today")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "today")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-today`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Today{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.today}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-week`}
                        checked={selectedDueIn.includes("thisWeek")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "thisWeek")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-week`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        This Week{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.thisWeek}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-month`}
                        checked={selectedDueIn.includes("thisMonth")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "thisMonth")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-month`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        This Month{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.thisMonth}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-later`}
                        checked={selectedDueIn.includes("later")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "later")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-later`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        Later{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.later}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-due-none`}
                        checked={selectedDueIn.includes("noDeadline")}
                        onCheckedChange={(checked: boolean) =>
                          handleDueInChange(checked, "noDeadline")
                        }
                      />
                      <Label
                        htmlFor={`${id}-due-none`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        No Deadline{" "}
                        <span className="ms-2 text-xs text-muted-foreground">
                          {dueCounts.noDeadline}
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            {/* Toggle columns visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Columns3
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  View
                </Button>
              </DropdownMenuTrigger>
              {/* Add task button */}
              <Button
                className="w-full sm:w-auto"
                variant="outline"
                onClick={() => navigate("/home")}
              >
                <Plus
                  className="-ms-1 me-2 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Add task
              </Button>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onSelect={(event) => event.preventDefault()}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full sm:w-auto" variant="outline">
                  <Trash
                    className="-ms-1 me-2 opacity-60"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                    aria-hidden="true"
                  >
                    <CircleAlert
                      className="opacity-80"
                      size={16}
                      strokeWidth={2}
                    />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "task"
                        : "tasks"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-lg border border-border bg-card min-w-full">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: `${header.getSize()}px` }}
                        className="h-11"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <div
                            className={cn(
                              header.column.getCanSort() &&
                                "flex h-full cursor-pointer select-none items-center justify-between gap-2"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                            onKeyDown={(e) => {
                              // Enhanced keyboard handling for sorting
                              if (
                                header.column.getCanSort() &&
                                (e.key === "Enter" || e.key === " ")
                              ) {
                                e.preventDefault();
                                header.column.getToggleSortingHandler()?.(e);
                              }
                            }}
                            tabIndex={
                              header.column.getCanSort() ? 0 : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <ChevronUp
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                              desc: (
                                <ChevronDown
                                  className="shrink-0 opacity-60"
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="last:py-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="flex grow justify-start sm:justify-end whitespace-nowrap text-sm text-muted-foreground order-3 sm:order-2">
          <p
            className="whitespace-nowrap text-sm text-muted-foreground"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div className="order-2 sm:order-3">
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirst size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

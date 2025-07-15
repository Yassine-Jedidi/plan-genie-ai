import { Skeleton } from "@/components/ui/skeleton";

export function CalendarSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex flex-col space-y-4 mb-6 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto items-center gap-4">
          <Skeleton className="hidden h-14 w-20 rounded-lg md:block" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Skeleton className="hidden h-9 w-9 rounded-lg lg:block" />
          <Skeleton className="hidden h-6 w-px lg:block" />
          <Skeleton className="h-9 w-full rounded-lg md:w-32" />
          <Skeleton className="hidden h-6 w-px md:block" />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>

      <div className="mt-2 grid flex-1 grid-cols-7 gap-2 text-sm">
        {[...Array(42)].map((_, i) => (
          <div key={i} className="relative h-28 rounded-lg border p-2">
            <Skeleton className="mb-1 h-4 w-8" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

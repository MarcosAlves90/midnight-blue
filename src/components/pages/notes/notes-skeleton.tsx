import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export function NotesSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 text-sm font-mono overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 px-2 h-8">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />
        <div className="flex items-center gap-1.5 px-2 h-8">
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {/* Folders Placeholders */}
        {[...Array(2)].map((_, i) => (
          <div key={`folder-${i}`} className="rounded-xl border border-border bg-card/50 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16 opacity-50" />
            </div>
          </div>
        ))}

        {/* Notes Placeholders */}
        {[...Array(8)].map((_, i) => (
          <div key={`note-${i}`} className="rounded-xl border border-border bg-card p-3 flex flex-col h-40 gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 flex-1">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-[90%]" />
              <Skeleton className="h-3 w-[40%]" />
            </div>
            <Skeleton className="h-2 w-16 opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
}

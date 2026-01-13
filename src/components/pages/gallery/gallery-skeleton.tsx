import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

export function GridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 animate-in fade-in duration-500">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-card overflow-hidden flex flex-col shadow-md"
        >
          {/* Mugshot Area Skeleton */}
          <div className="h-40 w-full bg-muted/20 relative border-b border-border">
            <Skeleton className="absolute inset-0" />
          </div>

          {/* Info Area Skeleton */}
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 opacity-50" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>

            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>

            <div className="flex gap-2 pt-1">
              <Skeleton className="h-8 flex-1 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-64" />
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
      <GridSkeleton />
    </div>
  );
}

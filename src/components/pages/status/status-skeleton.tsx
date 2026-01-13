import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Star, Zap, Sparkles, Lock } from "lucide-react";

export function StatusSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Main Grid Layout matching status-page-content.tsx */}
      <div className="flex flex-1 gap-4 pt-0 max-xl:flex-col">
        {/* Left Column: Attributes and Advanced Status */}
        <div className="flex flex-col gap-4 w-full max-w-120">
          {/* Attributes Grid Skeleton */}
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="p-2 rounded bg-muted-foreground/10 text-muted-foreground/40">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background/40 p-3 rounded-lg border border-border/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-2 w-10 opacity-50" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-10 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Status Skeleton */}
          <div className="bg-muted/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-32" />
              <div className="p-2 rounded bg-muted-foreground/10 text-muted-foreground/40">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Power Level and Points */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 flex-1 rounded-md" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              {/* Defense Cards */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-400/20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-background/30 p-2 border border-border/10 flex items-center justify-between rounded"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-8 rounded" />
                        <Skeleton className="h-6 w-12 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initiative/Speed */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-background/30 p-3 rounded-lg border border-border/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-yellow-400/20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
                <div className="bg-background/30 p-3 rounded-lg border border-border/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-green-400/20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills and Powers */}
        <div className="flex gap-4 flex-1 max-xl:flex-col">
          {/* Skills List Skeleton */}
          <div className="bg-muted/50 flex-1 rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-8 rounded-full opacity-50" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>

            {/* Search and Sort Placeholders */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>

            <div className="space-y-1">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-border/5"
                >
                  <Skeleton className="h-4 w-4 rounded-full opacity-30" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-8 opacity-20" />
                  <Skeleton className="h-6 w-10 rounded bg-muted/30" />
                </div>
              ))}
            </div>
          </div>

          {/* Powers Section Skeleton */}
          <div className="bg-muted/50 flex-1 rounded-xl p-6 h-fit">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-8 rounded-full opacity-50" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>

            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background/30 border border-border/10 rounded-lg overflow-hidden"
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-purple-500/5">
                        <Sparkles className="h-4 w-4 text-purple-500/20" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <div className="flex gap-1">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                </div>
              ))}

              {/* Empty state placeholder if few powers */}
              <div className="border-2 border-dashed border-border/5 rounded-xl h-32 flex items-center justify-center">
                <Skeleton className="h-4 w-32 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

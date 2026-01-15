import { Skeleton } from "@/components/ui/skeleton";

export function IndividualSkeleton() {
  return (
    <div className="pb-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-3">
          <div className="sticky top-6">
            {/* Identity Card Skeleton */}
            <div className="space-y-4 max-w-[380px] mx-auto">
              <div className="border-2 rounded-2xl overflow-hidden bg-card/30 border-border/50">
                {/* Card Header */}
                <div className="p-3 border-b-2 border-border/30 flex justify-between items-center bg-muted/20">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>

                {/* Image Area */}
                <div className="aspect-[4/3] w-full bg-muted/10 flex items-center justify-center relative overflow-hidden">
                  <Skeleton className="absolute inset-0 w-full h-full" />
                  <div className="z-10 flex flex-col items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-full opacity-20" />
                    <Skeleton className="h-3 w-24 opacity-20" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3 bg-black/20">
                  <div className="space-y-1.5 border-l-2 border-border/30 pl-3">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="space-y-1.5 border-l-2 border-border/30 pl-3">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-9 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Biometric Data */}
              <div className="p-6 border rounded-none border-white/5 bg-card/20 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Data */}
              <div className="p-6 border rounded-none border-white/5 bg-card/20 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Confidential File */}
              <div className="p-6 border rounded-none border-white/5 bg-card/20 space-y-6 flex flex-col h-fit">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-9 w-full rounded-md" />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-20 w-full rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Complications */}
        <div className="p-6 border rounded-none border-white/5 space-y-4 bg-card/20">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 border rounded-lg bg-black/10 border-border/10"
              >
                <Skeleton className="h-5 w-5 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* History */}
        <div className="p-6 border rounded-none border-white/5 space-y-4 bg-card/20 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex-1 border rounded-md p-4 bg-black/20 border-border/20 space-y-3 min-h-[160px]">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-[90%]" />
            <Skeleton className="h-3 w-[95%]" />
            <Skeleton className="h-3 w-[85%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

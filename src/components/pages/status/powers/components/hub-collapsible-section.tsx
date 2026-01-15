"use client";

import { memo, ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface HubCollapsibleSectionProps {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  icon: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  variant?: "default" | "emerald" | "blue" | "zinc";
}

export const HubCollapsibleSection = memo(({
  id,
  isOpen,
  onToggle,
  icon,
  title,
  subtitle,
  actions,
  children,
  className,
  headerClassName,
  variant = "default"
}: HubCollapsibleSectionProps) => {
  const variants = {
    default: "border-white/5 bg-zinc-900/40 hover:border-white/10",
    blue: "border-blue-500/20 bg-blue-500/[0.03] hover:border-blue-500/40",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/40",
    zinc: "border-white/5 bg-black/20"
  };

  const iconVariants = {
    default: "bg-zinc-800 text-zinc-400",
    blue: "bg-blue-500/20 text-blue-400",
    emerald: "bg-emerald-500/20 text-emerald-400",
    zinc: "bg-zinc-800 text-zinc-500"
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={() => onToggle(id)}
      className={cn(
        "group border overflow-hidden",
        isOpen && variant === "blue" && "border-blue-500/40 shadow-lg shadow-blue-500/5",
        variants[variant],
        className
      )}
    >
      <div className={cn("flex items-center gap-4 p-2 cursor-pointer select-none", headerClassName)}>
        <CollapsibleTrigger asChild>
          <div className="flex-1 flex items-center gap-4">
            <div className={cn(
              "p-2.5 transition-all",
              isOpen && variant === "blue" ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : iconVariants[variant]
            )}>
              {icon}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-black uppercase tracking-tight truncate">
                  {title}
                </div>
              </div>
              {subtitle && (
                <div className="mt-0.5">
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <div className="flex items-center gap-4">
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
          
          <CollapsibleTrigger asChild>
            <button className="p-2 text-zinc-600 hover:text-white transition-all">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
});

HubCollapsibleSection.displayName = "HubCollapsibleSection";

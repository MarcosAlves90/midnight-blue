"use client";

import { Edit3, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditToggleProps {
  isActive: boolean;
  onToggle: () => void;
  activeTitle?: string;
  inactiveTitle?: string;
  className?: string;
}

export function EditToggle({
  isActive,
  onToggle,
  activeTitle = "Trancar Modificações",
  inactiveTitle = "Hackear Sistema",
  className,
}: EditToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "p-2 border transition-all duration-300 active:scale-90",
        isActive
          ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10",
        className
      )}
      title={isActive ? activeTitle : inactiveTitle}
    >
      {isActive ? (
        <Edit3 className="w-4 h-4" />
      ) : (
        <Lock className="w-4 h-4" />
      )}
    </button>
  );
}

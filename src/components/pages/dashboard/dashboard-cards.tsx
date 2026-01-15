"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QuickActionLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function QuickActionLink({
  href,
  icon,
  title,
  description,
}: QuickActionLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl border border-primary/10 bg-muted/10 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/40 transition-all group shadow-lg shadow-black/5"
    >
      <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold uppercase tracking-tighter text-xs group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wide font-mono">
          {description}
        </p>
      </div>
      <div className="p-1 rounded-full bg-primary/5 group-hover:bg-primary/20 transition-all">
        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

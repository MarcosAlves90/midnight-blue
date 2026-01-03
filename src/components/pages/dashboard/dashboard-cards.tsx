"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number | null;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

export function StatCard({ title, value, description, icon, valueClassName }: StatCardProps) {
  return (
    <Card className="overflow-hidden relative group bg-muted/20 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary/50 transition-all" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">{title}</CardTitle>
        <div className="p-1.5 rounded-md bg-primary/5 text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-xl font-black tracking-tighter italic uppercase text-foreground/90 group-hover:text-primary transition-colors", valueClassName)}>
          {value === null ? <Skeleton className="h-8 w-16 bg-primary/5" /> : value}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
          <p className="text-[9px] text-muted-foreground/60 uppercase font-mono tracking-tight">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function QuickActionLink({ href, icon, title, description }: QuickActionLinkProps) {
  return (
    <a 
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl border border-primary/10 bg-muted/10 backdrop-blur-sm hover:bg-primary/5 hover:border-primary/40 transition-all group shadow-lg shadow-black/5"
    >
      <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold uppercase tracking-tighter text-xs group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[9px] text-muted-foreground/70 uppercase tracking-wide font-mono">{description}</p>
      </div>
      <div className="p-1 rounded-full bg-primary/5 group-hover:bg-primary/20 transition-all">
        <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}

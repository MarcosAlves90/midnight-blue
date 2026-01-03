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
    <Card className="overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-1 bg-muted group-hover:bg-primary/50 transition-colors" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-black tracking-tighter italic uppercase", valueClassName)}>
          {value === null ? <Skeleton className="h-8 w-16" /> : value}
        </div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-tight mt-1">{description}</p>
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
      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/50 transition-all group shadow-sm"
    >
      <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold uppercase tracking-tight text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
    </a>
  );
}

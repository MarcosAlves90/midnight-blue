"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";

export const DashboardHeader = React.memo(function DashboardHeader() {
  const renderRef = React.useRef(0);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderRef.current += 1;
      if (renderRef.current <= 10) {
        // eslint-disable-next-line no-console
        console.debug(`[dev-dashboard-header] render #${renderRef.current}`);
      }
      if (renderRef.current === 10) {
        // eslint-disable-next-line no-console
        console.debug("[dev-dashboard-header] further renders will be suppressed in logs");
      }
    }
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb />
      </div>
    </header>
  );
});

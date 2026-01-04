"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DynamicBreadcrumb } from "@/components/ui/custom/dynamic-breadcrumb";
import { useIdentityContext } from "@/contexts/IdentityContext";
import { useAttributesContext } from "@/contexts/AttributesContext";
import { useSkillsContext } from "@/contexts/SkillsContext";
import { useStatusContext } from "@/contexts/StatusContext";
import { usePowersContext } from "@/contexts/PowersContext";
import { useCustomDescriptors } from "@/contexts/CustomDescriptorsContext";
import { Cloud, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SyncStatus = () => {
  const { isSyncing: identitySyncing } = useIdentityContext();
  const { isSyncing: attributesSyncing } = useAttributesContext();
  const { isSyncing: skillsSyncing } = useSkillsContext();
  const { isSyncing: statusSyncing } = useStatusContext();
  const { isSyncing: powersSyncing } = usePowersContext();
  const { isSyncing: descriptorsSyncing } = useCustomDescriptors();

  const isSyncing = identitySyncing || attributesSyncing || skillsSyncing || statusSyncing || powersSyncing || descriptorsSyncing;

  return (
    <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground transition-opacity duration-300">
      {isSyncing ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
          <span className="hidden sm:inline">Sincronizando...</span>
        </>
      ) : (
        <>
          <Cloud className="h-3 w-3 text-green-500" />
          <span className="hidden sm:inline">Sincronizado</span>
        </>
      )}
    </div>
  );
};

export const DashboardHeader = React.memo(function DashboardHeader() {
  const { loading } = useAuth();
  const renderRef = React.useRef(0);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderRef.current += 1;
      if (renderRef.current <= 10) {
        console.debug(`[dev-dashboard-header] render #${renderRef.current}`);
      }
      if (renderRef.current === 10) {
        console.debug("[dev-dashboard-header] further renders will be suppressed in logs");
      }
    }
  });

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb isLoading={loading} />
      </div>
      <div className="flex items-center gap-4 px-4">
        <SyncStatus />
      </div>
    </header>
  );
});

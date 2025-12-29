"use client";

import React, { useMemo } from "react";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemComponent,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

function BreadcrumbNode({
  item,
  index,
  total,
}: {
  item: ReturnType<typeof useBreadcrumb>[0];
  index: number;
  total: number;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <>
      <BreadcrumbItemComponent className={isFirst ? "hidden md:block" : ""}>
        {item.isCurrentPage ? (
          <BreadcrumbPage className="flex items-center gap-1.5">
            {isFirst && <Home className="h-4 w-4" />}
            {item.label}
          </BreadcrumbPage>
        ) : (
          <BreadcrumbLink href={item.href} className="flex items-center gap-1.5">
            {isFirst && <Home className="h-4 w-4" />}
            {item.label}
          </BreadcrumbLink>
        )}
      </BreadcrumbItemComponent>
      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
    </>
  );
}

const MemoBreadcrumbNode = React.memo(
  BreadcrumbNode,
  (prev, next) =>
    prev.item.href === next.item.href &&
    prev.item.label === next.item.label &&
    prev.item.isCurrentPage === next.item.isCurrentPage &&
    prev.index === next.index &&
    prev.total === next.total
);

function DynamicBreadcrumbInner() {
  const breadcrumbItems = useBreadcrumb();

  // Dev-only render counter to help diagnose excessive renders
  const renderCount = React.useRef(0);
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCount.current += 1;
      if (renderCount.current <= 10) {
        // Log first few renders to avoid noisy console
        // eslint-disable-next-line no-console
        console.debug(`[dev-breadcrumb] render #${renderCount.current}`);
      }
      if (renderCount.current === 10) {
        // eslint-disable-next-line no-console
        console.debug("[dev-breadcrumb] further renders will be suppressed in logs");
      }
    }
  });

  const nodes = useMemo(() => {
    return breadcrumbItems.map((item, index) => (
      <MemoBreadcrumbNode
        key={item.href}
        item={item}
        index={index}
        total={breadcrumbItems.length}
      />
    ));
  }, [breadcrumbItems]);

  if (nodes.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>{nodes}</BreadcrumbList>
    </Breadcrumb>
  );
}

export const DynamicBreadcrumb = React.memo(DynamicBreadcrumbInner);


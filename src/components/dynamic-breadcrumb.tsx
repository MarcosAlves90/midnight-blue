"use client";

import { useBreadcrumb, BreadcrumbItem } from "@/hooks/use-breadcrumb";
import {
    Breadcrumb,
    BreadcrumbItem as BreadcrumbItemComponent,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Home } from "lucide-react";

export function DynamicBreadcrumb() {
    const breadcrumbItems = useBreadcrumb();

    if (breadcrumbItems.length === 0) {
        return null;
    }

    const renderItemContent = (item: BreadcrumbItem, index: number) => (
        <>
            {index === 0 && <Home className="h-4 w-4" />}
            {item.label}
        </>
    );

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <Fragment key={item.href}>
                        <BreadcrumbItemComponent
                            className={index === 0 ? "hidden md:block" : ""}
                        >
                            {item.isCurrentPage ? (
                                <BreadcrumbPage className="flex items-center gap-1.5">
                                    {renderItemContent(item, index)}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink
                                    href={item.href}
                                    className="flex items-center gap-1.5"
                                >
                                    {renderItemContent(item, index)}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItemComponent>
                        {index < breadcrumbItems.length - 1 && (
                            <BreadcrumbSeparator className="hidden md:block" />
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

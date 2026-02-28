"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// import { Home } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

export function FrontendBreadcrumbs() {
    const pathname = usePathname();
    // Normalize pathname (remove trailing slash)
    const cleanPath = pathname.replace(/\/$/, "");

    // 1. List of routes where breadcrumbs should not be shown (e.g., home, listing pages)
    const hiddenRoutes = ["", "/", "/stories", "/startups", "/categories", "/cities"];
    if (hiddenRoutes.includes(cleanPath)) return null;

    const segments = cleanPath.split("/").filter((segment) => segment !== "");

    const getBreadcrumbLabel = (segment: string) => {
        // Basic title casing: "my-story" -> "My Story"
        return segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="bg-white relative z-20 border-y border-zinc-300">
            <div className="container-wide py-3">
                <Breadcrumb className="font-sans">
                    <BreadcrumbList className="text-[13px] font-medium text-zinc-400 gap-2 flex-nowrap overflow-hidden">
                        <BreadcrumbItem className="shrink-0">
                            <BreadcrumbLink asChild>
                                <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {segments.map((segment, index) => {
                            const isLast = index === segments.length - 1;
                            const href = `/${segments.slice(0, index + 1).join("/")}`;
                            const label = getBreadcrumbLabel(segment);

                            return (
                                <Fragment key={href}>
                                    <BreadcrumbSeparator className="text-zinc-400">
                                        <span className="text-[10px] font-bold">&gt;</span>
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="text-zinc-900 font-medium max-w-[150px] md:max-w-xs truncate">{label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={href} className="hover:text-zinc-900 transition-colors">{label}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </div>
    );
}

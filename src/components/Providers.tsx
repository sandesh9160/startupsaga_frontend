"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, lazy, Suspense } from "react";

// Lazy-load toasters — they're rarely needed on initial page load
// and add unnecessary JS to the critical rendering path.
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
                <Suspense fallback={null}>
                    <Toaster />
                    <Sonner />
                </Suspense>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";

interface LogoProps {
    className?: string;
    iconClassName?: string;
    showText?: boolean;
    variant?: "default" | "light";
    initialSettings?: any;
}

export function Logo({ className, iconClassName, showText = true, variant = "default", initialSettings }: LogoProps) {
    const isLight = variant === "light";
    const [isMounted, setIsMounted] = useState(false);
    const [settings, setSettings] = useState<{ site_name?: string; site_logo?: string } | null>(initialSettings || null);

    useEffect(() => {
        setIsMounted(true);
        fetch(`${API_BASE_URL}/layout-settings/`)
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load logo settings", err));
    }, []);

    const siteName = settings?.site_name || "StartupSaga";

    return (
        <div className={cn("flex items-center gap-3 select-none transition-opacity hover:opacity-90", className)} suppressHydrationWarning>
            {settings?.site_logo ? (
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-transparent",
                    iconClassName
                )}>
                    <img
                        src={settings.site_logo}
                        alt={siteName}
                        className="w-full h-full object-contain"
                    />
                </div>
            ) : (
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-transform active:scale-95 flex-shrink-0",
                    isLight ? "bg-white text-primary" : "bg-[#0F172A] text-white",
                    iconClassName
                )}>
                    <span className="font-serif text-2xl font-black">
                        {siteName.charAt(0)}
                    </span>
                </div>
            )}

            {showText && (
                <div className="flex flex-col">
                    <div className={cn(
                        "font-serif text-2xl font-bold leading-none tracking-tight",
                        isLight ? "text-white" : "text-[#0F172A]"
                    )}>
                        {siteName}
                        {!settings?.site_name && <span className="text-orange-600">.in</span>}
                    </div>
                </div>
            )}
        </div>
    );
}

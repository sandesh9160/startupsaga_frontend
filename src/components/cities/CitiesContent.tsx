"use client";

import { CityCard } from "@/components/cards/CityCard";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { getCities, getPlatformStats } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Building2, TrendingUp, Filter, ArrowRight, MapPin } from "lucide-react";

interface CitiesContentProps {
    title?: string;
    description?: string;
    content?: string;
}

export function CitiesContent({
    title,
    description,
    content
}: CitiesContentProps) {
    const [cities, setCities] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | '1' | '2' | '3'>('all');
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [platformStats, setPlatformStats] = useState<any>({ total_startups: 0, total_unicorns: 0 });

    useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
        Promise.all([
            getCities().then(setCities),
            getPlatformStats().then(setPlatformStats)
        ])
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const filteredCities = useMemo(() => {
        return filter === 'all'
            ? cities
            : cities.filter(c => String(c.tier).includes(filter));
    }, [cities, filter]);

    const totalStartups = platformStats?.total_startups || 0;
    const totalUnicorns = platformStats?.total_unicorns || 0;

    // Format counts only after mounting to avoid locale mismatch during SSR
    const formattedStartups = isMounted && totalStartups > 0 ? totalStartups.toLocaleString('en-US') : "1";
    const formattedUnicorns = isMounted && totalUnicorns > 0 ? totalUnicorns.toLocaleString('en-US') : "1";

    return (
        <div className="bg-[#FAF9FB] min-h-screen font-sans">
            {/* Elegant Hero Section */}
            {(title || description || content) && (
                <section className="relative py-12 md:py-16 overflow-hidden bg-[#FAF5F2] border-b border-border/60">
                    <div className="container-wide relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-6 mb-10">
                            {title && (
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] font-serif tracking-tight leading-[1.1]"
                                    dangerouslySetInnerHTML={{ __html: title }}
                                />
                            )}

                            <div className="max-w-3xl mx-auto space-y-4">
                                {description && (
                                    <div className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                )}
                                {content && (
                                    <div className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto opacity-80"
                                        dangerouslySetInnerHTML={{ __html: content }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Stats Section exactly as in screenshot */}
                        <div className="flex items-center justify-center gap-6 py-2 px-4 mx-auto w-fit bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#FF5C00]" strokeWidth={2} />
                                <div className="text-left font-medium text-sm text-zinc-500 flex items-center gap-1.5">
                                    <span className="font-bold text-zinc-900">{formattedStartups}</span>
                                    <span>Startups</span>
                                </div>
                            </div>

                            <div className="h-4 w-px bg-zinc-300" />

                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#FF5C00]" strokeWidth={2} />
                                <div className="text-left font-medium text-sm text-zinc-500 flex items-center gap-1.5">
                                    <span className="font-bold text-zinc-900">{formattedUnicorns}</span>
                                    <span>Unicorns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Sticky Filters Bar */}
            <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200 py-5 mb-8">
                <div className="container-wide">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-zinc-500 mr-2">
                                <Filter className="w-4 h-4" strokeWidth={2} />
                                <span className="text-sm font-medium">
                                    Filter by tier:
                                </span>
                            </div>

                            {[
                                { id: 'all', label: 'All Cities' },
                                { id: '1', label: 'Tier 1' },
                                { id: '2', label: 'Tier 2' },
                                { id: '3', label: 'Tier 3' },
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setFilter(t.id as any)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                                        filter === t.id
                                            ? "bg-[#FF5C00] text-white border-[#FF5C00] shadow-md shadow-orange-600/20"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                                    )}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Recommendation Links */}
                        <div className="hidden lg:flex items-center gap-3 text-sm font-medium">
                            <span className="text-zinc-500">Recommended:</span>
                            <div className="flex gap-4">
                                <button onClick={() => setFilter('2')} className="text-[#FF5C00] hover:underline font-semibold">Tier 2 Cities</button>
                                <button onClick={() => setFilter('3')} className="text-[#FF5C00] hover:underline font-semibold">Tier 3 Cities</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities Grid Section */}
            <main className="container-wide pb-12 relative z-20">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-[380px] rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredCities.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {filteredCities.map((city) => (
                                <CityCard
                                    key={city.slug}
                                    {...city}
                                    variant="featured"
                                    description={city.description?.replace(/<[^>]*>/g, '')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white max-w-2xl mx-auto">
                            <MapPin className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                            <p className="text-zinc-500 font-bold text-sm">No matching cities found for this tier.</p>
                            <Button onClick={() => setFilter('all')} variant="outline" className="mt-4 rounded-xl px-6">
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}

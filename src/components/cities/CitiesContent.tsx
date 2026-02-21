"use client";

import { CityCard } from "@/components/cards/CityCard";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { getCities } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Building2, TrendingUp, Filter } from "lucide-react";

export function CitiesContent() {
    const [cities, setCities] = useState<any[]>([]);
    const [filter, setFilter] = useState<'all' | '1' | '2' | '3'>('all');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        getCities().then(setCities).catch(err => console.error(err));
    }, []);

    const filteredCities = useMemo(() => {
        return filter === 'all'
            ? cities
            : cities.filter(c => String(c.tier).includes(filter));
    }, [cities, filter]);

    const totalStartups = useMemo(() =>
        cities.reduce((sum, c) => sum + (c.startupCount || 0), 0)
        , [cities]);

    const totalUnicorns = useMemo(() =>
        cities.reduce((sum, c) => sum + (c.unicornCount || 0), 0)
        , [cities]);

    // Format counts only after mounting to avoid locale mismatch during SSR
    const formattedStartups = isMounted ? totalStartups.toLocaleString('en-US') : "0";
    const formattedUnicorns = isMounted ? totalUnicorns.toLocaleString('en-US') : "0";

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Hero Section */}
            <section className="container-wide pt-12 pb-10 md:pt-16 md:pb-12 text-center">
                <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-zinc-900 mb-6 font-serif leading-[1.1] max-w-4xl mx-auto tracking-tight">
                    Startup Hubs in India - Bengaluru, Mumbai, Delhi NCR & More
                </h1>

                <div className="space-y-4 mb-10">
                    <p className="text-base md:text-lg text-zinc-600 max-w-4xl mx-auto leading-relaxed">
                        India's startup revolution extends far beyond Bengaluru. Explore thriving entrepreneurial ecosystems in metros, emerging Tier 2 hubs, and ambitious Tier 3 cities building the next wave of innovation.
                    </p>
                    <p className="text-sm text-zinc-500 max-w-3xl mx-auto leading-relaxed">
                        Each city profile features local unicorns, top-funded startups, leading investors, co-working spaces, and the unique strengths shaping its startup culture.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 py-6 border-t border-zinc-50 max-w-2xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100/50">
                            <Building2 className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl md:text-2xl font-bold text-zinc-900 leading-none tabular-nums">
                                {formattedStartups}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 block">Startups</span>
                        </div>
                    </div>

                    <div className="hidden md:block h-8 w-px bg-zinc-100" />

                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl md:text-2xl font-bold text-zinc-900 leading-none tabular-nums">
                                {formattedUnicorns}
                            </span>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 block">Unicorns</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filters Bar */}
            <div className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-xl border-y border-zinc-100 shadow-sm">
                <div className="container-wide py-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Filter Controls */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Filter className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                    Filter by tier:
                                </span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                                {[
                                    { id: 'all', label: 'All Cities' },
                                    { id: '1', label: 'Tier 1' },
                                    { id: '2', label: 'Tier 2' },
                                    { id: '3', label: 'Tier 3' },
                                ].map((t) => (
                                    <Button
                                        key={t.id}
                                        variant={filter === t.id ? "accent" : "outline"}
                                        onClick={() => setFilter(t.id as any)}
                                        className={cn(
                                            "px-4 py-1 h-8 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap",
                                            filter === t.id
                                                ? "bg-accent text-white border-transparent shadow-md shadow-accent/20"
                                                : "border-zinc-200 hover:border-accent/40 text-zinc-500"
                                        )}
                                    >
                                        {t.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Recommendation Links */}
                        <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-wider">
                            <span className="text-zinc-400">Recommended:</span>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setFilter('2')}
                                    className="text-accent hover:text-accent/80 transition-colors"
                                >
                                    Tier 2 Hubs
                                </button>
                                <button
                                    onClick={() => setFilter('3')}
                                    className="text-accent hover:text-accent/80 transition-colors"
                                >
                                    Tier 3 Hubs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities Grid Section */}
            <section className="container-wide py-12 md:py-16">
                {filteredCities.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredCities.map((city) => (
                            <div key={city.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CityCard {...city} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-zinc-50 rounded-2xl">
                        <p className="text-zinc-400 font-medium text-sm">No cities found for this criteria.</p>
                    </div>
                )}
            </section>
        </div>
    );
}

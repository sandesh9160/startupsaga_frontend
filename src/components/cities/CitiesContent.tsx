"use client";

import { CityCard } from "@/components/cards/CityCard";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
    const [activeTier, setActiveTier] = useState<'all' | '1' | '2' | '3'>('all');
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [platformStats, setPlatformStats] = useState<any>({ total_startups: 0, total_unicorns: 0 });

    const tier1Ref = useRef<HTMLElement>(null);
    const tier2Ref = useRef<HTMLElement>(null);
    const tier3Ref = useRef<HTMLElement>(null);

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

    // Group cities by tier
    const tier1Cities = useMemo(() => cities.filter(c => String(c.tier).includes('1')), [cities]);
    const tier2Cities = useMemo(() => cities.filter(c => String(c.tier).includes('2')), [cities]);
    const tier3Cities = useMemo(() => cities.filter(c => String(c.tier).includes('3')), [cities]);

    const totalStartups = platformStats?.total_startups || 0;
    const totalUnicorns = platformStats?.total_unicorns || 0;

    // Compute dynamic stats based on active tier
    const activeStats = useMemo(() => {
        const tierMap: Record<string, any[]> = {
            '1': tier1Cities,
            '2': tier2Cities,
            '3': tier3Cities,
        };
        const tierCities = activeTier === 'all' ? cities : (tierMap[activeTier] || []);
        const startups = activeTier === 'all'
            ? totalStartups
            : tierCities.reduce((sum: number, c: any) => sum + (c.startupCount || c.startup_count || 0), 0);
        const unicorns = activeTier === 'all'
            ? totalUnicorns
            : tierCities.reduce((sum: number, c: any) => sum + (c.unicornCount || c.unicorn_count || 0), 0);
        return { startups: startups || 0, unicorns: unicorns || 0 };
    }, [activeTier, cities, tier1Cities, tier2Cities, tier3Cities, totalStartups, totalUnicorns]);



    const scrollToTier = useCallback((tier: 'all' | '1' | '2' | '3') => {
        setActiveTier(tier);
        const refMap: Record<string, React.RefObject<HTMLElement>> = {
            '1': tier1Ref,
            '2': tier2Ref,
            '3': tier3Ref,
        };
        if (tier === 'all') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const targetRef = refMap[tier];
        if (targetRef?.current) {
            const yOffset = -140; // account for sticky header + filter bar
            const y = targetRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    // Intersection observer to highlight active tier on scroll
    useEffect(() => {
        if (!isMounted) return;
        const refs = [
            { tier: '1' as const, ref: tier1Ref },
            { tier: '2' as const, ref: tier2Ref },
            { tier: '3' as const, ref: tier3Ref },
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const found = refs.find(r => r.ref.current === entry.target);
                        if (found) setActiveTier(found.tier);
                    }
                }
            },
            { rootMargin: '-150px 0px -60% 0px' }
        );

        refs.forEach(({ ref }) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, [isMounted, cities]);

    const renderTierSection = (
        tierRef: React.RefObject<HTMLElement>,
        tierId: string,
        tierLabel: string,
        tierCities: any[]
    ) => {
        if (tierCities.length === 0) return null;
        return (
            <section ref={tierRef} id={`tier-${tierId}`} className="scroll-mt-36">
                <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl md:text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
                        {tierLabel}
                    </h2>
                    <span className="text-[11px] font-bold text-zinc-400 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200 uppercase tracking-wider">
                        {tierCities.length} {tierCities.length === 1 ? 'city' : 'cities'}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tierCities.map((city) => (
                        <CityCard
                            key={city.slug}
                            {...city}
                            variant="featured"
                            description={city.description?.replace(/<[^>]*>/g, '')}
                        />
                    ))}
                </div>
            </section>
        );
    };

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

                        {/* Stats Section */}
                        <div className="flex items-center justify-center gap-6 py-3 px-6 mx-auto w-fit bg-white/50 backdrop-blur-sm rounded-2xl border border-white/50">
                            <div className="flex items-center gap-2.5">
                                <Building2 className="w-6 h-6 text-[#FF5C00]" strokeWidth={2} />
                                <div className="text-left flex flex-col">
                                    <span className="font-bold text-2xl text-zinc-900 leading-tight">{activeStats.startups}</span>
                                    <span className="text-xs font-medium text-zinc-500">Startups</span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-zinc-300" />

                            <div className="flex items-center gap-2.5">
                                <TrendingUp className="w-6 h-6 text-[#FF5C00]" strokeWidth={2} />
                                <div className="text-left flex flex-col">
                                    <span className="font-bold text-2xl text-zinc-900 leading-tight">{activeStats.unicorns}</span>
                                    <span className="text-xs font-medium text-zinc-500">Unicorns</span>
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
                                    onClick={() => scrollToTier(t.id as any)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all border",
                                        activeTier === t.id
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
                                <button onClick={() => scrollToTier('2')} className="text-[#FF5C00] hover:underline font-semibold">Tier 2 Cities</button>
                                <button onClick={() => scrollToTier('3')} className="text-[#FF5C00] hover:underline font-semibold">Tier 3 Cities</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cities Grouped by Tier */}
            <main className="container-wide pb-12 relative z-20">
                <div className="max-w-7xl mx-auto space-y-16">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-[380px] rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {renderTierSection(tier1Ref, '1', 'Tier 1 — Metro Cities', tier1Cities)}
                            {renderTierSection(tier2Ref, '2', 'Tier 2 — Rising Hubs', tier2Cities)}
                            {renderTierSection(tier3Ref, '3', 'Tier 3 — Emerging Cities', tier3Cities)}

                            {cities.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white max-w-2xl mx-auto">
                                    <MapPin className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
                                    <p className="text-zinc-500 font-bold text-sm">No cities found.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

        </div>
    );
}

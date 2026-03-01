"use client";

import Link from "next/link";
import { StartupCard } from "@/components/cards/StartupCard";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Rocket,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { getStartups, getCategories, getCities } from "@/lib/api";
import { Startup, Category, City } from "@/types";
import { cn } from "@/lib/utils";

interface StartupsContentProps {
    title?: string;
    description?: string;
    content?: string;
}

export function StartupsContent({
    title,
    description,
    content
}: StartupsContentProps) {
    const [startups, setStartups] = useState<Startup[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [selectedStage, setSelectedStage] = useState("all");

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const params: any = {};
                if (searchQuery) params.search = searchQuery;
                if (selectedCategory !== "all") params.category = selectedCategory;
                if (selectedCity !== "all") params.city = selectedCity;
                if (selectedStage !== "all") params.stage = selectedStage;

                const [startupsData, categoriesData, citiesData] = await Promise.all([
                    getStartups(params),
                    getCategories(),
                    getCities()
                ]);
                setStartups((startupsData || []).filter(Boolean));
                setCategories((categoriesData || []).filter(Boolean));
                setCities((citiesData || []).filter(Boolean));
            } catch (err) {
                console.error("Failed to load startups data", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [searchQuery, selectedCategory, selectedCity, selectedStage]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedCity("all");
        setSelectedStage("all");
    };

    const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCity !== "all" || selectedStage !== "all";

    return (
        <div className="bg-transparent min-h-screen font-sans" suppressHydrationWarning>
            {/* Hero Section — Warm peach/cream background with search */}
            <section className="relative py-10 md:py-14 overflow-hidden bg-[#FAF5F2] border-b border-border/60">
                <div className="container-wide relative z-10 text-center">
                    <div className="max-w-4xl mx-auto space-y-5">
                        {title && (
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 font-serif tracking-tight leading-[1.1]"
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        )}

                        <div className="max-w-3xl mx-auto space-y-3">
                            {description && (
                                <div className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl mx-auto"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            )}
                            {content && (
                                <div className="text-sm text-zinc-400 leading-relaxed max-w-2xl mx-auto"
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            )}
                        </div>

                        {/* Search Bar inside Hero */}
                        <div className="max-w-2xl mx-auto pt-3">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                    <Search className="h-4.5 w-4.5 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
                                </div>
                                <Input
                                    placeholder="Search startups by name or description..."
                                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-white border-zinc-200 shadow-sm focus:ring-0 focus:border-zinc-300 text-zinc-700 text-sm transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-5 inset-y-0 flex items-center text-zinc-400 hover:text-zinc-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filters Bar */}
            <section className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-md border-y border-zinc-300 py-4 mb-4">
                <div className="container-wide">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest mr-1">
                            <Filter size={12} /> Filters:
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[160px] h-9 rounded-xl bg-zinc-50/50 border-zinc-200 text-[11px] font-semibold hover:bg-zinc-100 transition-all">
                                <SelectValue placeholder="All Sectors" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-200 shadow-2xl">
                                <SelectItem value="all">All Sectors</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="w-[160px] h-9 rounded-xl bg-zinc-50/50 border-zinc-200 text-[11px] font-semibold hover:bg-zinc-100 transition-all">
                                <SelectValue placeholder="All Cities" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-200 shadow-2xl">
                                <SelectItem value="all">All Cities</SelectItem>
                                {cities.map(city => (
                                    <SelectItem key={city.slug} value={city.name}>{city.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedStage} onValueChange={setSelectedStage}>
                            <SelectTrigger className="w-[160px] h-9 rounded-xl bg-zinc-50/50 border-zinc-200 text-[11px] font-semibold hover:bg-zinc-100 transition-all">
                                <SelectValue placeholder="All Stages" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-200 shadow-2xl">
                                <SelectItem value="all">All Stages</SelectItem>
                                <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
                                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                <SelectItem value="Seed">Seed</SelectItem>
                                <SelectItem value="Series A">Series A</SelectItem>
                                <SelectItem value="Series B+">Series B+</SelectItem>
                                <SelectItem value="IPO">IPO</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 h-9 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all"
                            >
                                Clear All
                            </button>
                        )}

                        <div className="ml-auto">
                            {!isLoading && (
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                    <span className="text-zinc-900">{startups.length}</span> startups
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <main className="container-wide py-8 pb-20">
                {/* Results Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-[220px] rounded-2xl bg-white border border-zinc-100 animate-pulse" />
                        ))}
                    </div>
                ) : startups.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {startups.map((startup) => (
                            <StartupCard key={startup.slug} {...startup} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-zinc-100">
                        <Rocket className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-zinc-900 mb-1">No startups found</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto mb-6">
                            Try adjusting your search or filters to find what you're looking for.
                        </p>
                        <Button onClick={clearFilters} variant="outline" className="rounded-2xl px-6 h-12 font-bold uppercase tracking-wider text-xs">
                            Reset Filters
                        </Button>
                    </div>
                )}

                {/* Simple Pagination */}
                {!isLoading && startups.length > 0 && (
                    <div className="flex items-center justify-center gap-2 pt-16">
                        <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-100 font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map(p => (
                                <Button
                                    key={p}
                                    variant={p === 1 ? "default" : "ghost"}
                                    className={cn(
                                        "h-11 w-11 rounded-xl font-black text-xs",
                                        p === 1
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                                            : "text-zinc-400 hover:bg-zinc-100"
                                    )}
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>
                        <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-100 font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 transition-all">
                            Next
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

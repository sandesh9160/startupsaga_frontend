"use client";

import Link from "next/link";
import { StartupCard } from "@/components/cards/StartupCard";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    Rocket
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

export function StartupsContent() {
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
                setStartups(startupsData || []);
                setCategories(categoriesData || []);
                setCities(citiesData || []);
            } catch (err) {
                console.error("Failed to load startups data", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [searchQuery, selectedCategory, selectedCity, selectedStage]);

    const filteredStartups = startups;

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedCity("all");
        setSelectedStage("all");
    };

    const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCity !== "all" || selectedStage !== "all";

    return (
        <div className="bg-[#FAF9FB] min-h-screen font-sans" suppressHydrationWarning>
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Visual Polish: Subtle Background Gradient */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[120%] h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-orange-50/40 opacity-70" />
                </div>

                <div className="container-wide relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-[1.2] font-serif">
                                India Startup Directory - Discover <br />
                                <span className="text-zinc-900">5,000+ Companies</span>
                            </h1>
                            <div className="max-w-3xl mx-auto space-y-6">
                                <p className="text-lg md:text-xl text-zinc-500 leading-relaxed">
                                    The most comprehensive directory of Indian startups—from early-stage disruptors to
                                    established unicorns. Browse companies across fintech, SaaS, D2C, healthtech, and more,
                                    all building the future of India's digital economy.
                                </p>
                                <p className="text-zinc-500 text-base">
                                    Filter by sector, city, or funding stage to find startups that match your interests, whether you're an investor, job seeker, or fellow entrepreneur.
                                </p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-3xl mx-auto pt-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
                                </div>
                                <Input
                                    placeholder="Search startups by name or description..."
                                    className="w-full h-16 pl-14 pr-12 rounded-2xl bg-white border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:ring-orange-500/20 text-lg transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-6 inset-y-0 flex items-center text-zinc-400 hover:text-zinc-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Filter Bar */}
            <div className="sticky top-[72px] z-40 bg-white/100 border-y border-zinc-100/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                <div className="container-wide py-4">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <span className="text-sm flex items-center gap-2">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-400">
                                        <path d="M2.25 4.5H15.75M4.5 9H13.5M7.5 13.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Filters:
                                </span>
                            </div>

                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px] h-11 rounded-xl bg-zinc-50/50 border-zinc-100 text-sm font-medium hover:bg-zinc-100/50 transition-colors">
                                    <SelectValue placeholder="All Sectors" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedCity} onValueChange={setSelectedCity}>
                                <SelectTrigger className="w-[180px] h-11 rounded-xl bg-zinc-50/50 border-zinc-100 text-sm font-medium hover:bg-zinc-100/50 transition-colors">
                                    <SelectValue placeholder="All Cities" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                    <SelectItem value="all">All Cities</SelectItem>
                                    {cities.map(city => (
                                        <SelectItem key={city.slug} value={city.name}>{city.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedStage} onValueChange={setSelectedStage}>
                                <SelectTrigger className="w-[180px] h-11 rounded-xl bg-zinc-50/50 border-zinc-100 text-sm font-medium hover:bg-zinc-100/50 transition-colors">
                                    <SelectValue placeholder="All Stages" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
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
                                <Button
                                    onClick={clearFilters}
                                    variant="ghost"
                                    className="h-11 rounded-xl text-zinc-400 hover:text-orange-600 hover:bg-orange-50 text-sm font-medium px-4"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <section className="container-wide py-12">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        {!isLoading && (
                            <div className="flex items-center gap-2 text-zinc-500 font-medium">
                                <span>Showing <span className="text-zinc-900 font-bold">{startups.length}</span> startups</span>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="h-[300px] rounded-[2.5rem] bg-white border border-zinc-100 animate-pulse shadow-sm" />
                            ))}
                        </div>
                    ) : startups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {startups.map((startup) => (
                                <StartupCard key={startup.slug} {...startup} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
                            <div className="w-20 h-20 rounded-3xl bg-zinc-50 flex items-center justify-center mx-auto mb-6">
                                <Rocket className="h-10 w-10 text-zinc-200" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-2">No startups found</h3>
                            <p className="text-zinc-500 max-w-sm mx-auto mb-8">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <Button onClick={clearFilters} variant="outline" className="rounded-xl px-8 h-12 font-bold">
                                Reset Filters
                            </Button>
                        </div>
                    )}

                    {/* Simple Pagination */}
                    {!isLoading && startups.length > 0 && (
                        <div className="flex items-center justify-center gap-2 pt-12">
                            <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-100 font-medium text-zinc-600 hover:bg-zinc-50">
                                Previous
                            </Button>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3].map(p => (
                                    <Button
                                        key={p}
                                        variant={p === 1 ? "default" : "ghost"}
                                        className={cn(
                                            "h-11 w-11 rounded-xl font-bold",
                                            p === 1 ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-600/20" : "text-zinc-500"
                                        )}
                                    >
                                        {p}
                                    </Button>
                                ))}
                            </div>
                            <Button variant="outline" className="h-11 px-6 rounded-xl border-zinc-100 font-medium text-zinc-600 hover:bg-zinc-50">
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Submit CTA */}
            <section className="container-wide pb-24 pt-12">
                <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    {/* Abstract decorative circles */}
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-orange-600/20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight font-serif">
                            Build the next big thing?
                        </h2>
                        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                            Join 5,000+ startups already listed on India's most active startup network.
                            Showcase your company to investors, potential hires, and partners.
                        </p>
                        <Button size="lg" className="h-16 px-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-xl shadow-orange-600/20 transition-all hover:scale-105 active:scale-95" asChild>
                            <Link href="/submit">
                                Submit Your Startup
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}


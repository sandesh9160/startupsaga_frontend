"use client";

import { StoryCard } from "@/components/cards/StoryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    X
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getStoriesPage, getCategories, getCities } from "@/lib/api";
import { Story, Category, City } from "@/types";
import { cn } from "@/lib/utils";

export function StoriesContent() {
    const searchParams = useSearchParams();
    const [stories, setStories] = useState<Story[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCity, setSelectedCity] = useState("all");
    const [selectedStage, setSelectedStage] = useState("all");
    const [sortKey, setSortKey] = useState<"latest" | "trending" | "most_viewed">("latest");
    const [page, setPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        const q = searchParams.get("search");
        const pageParam = searchParams.get("page");
        if (q) {
            setSearchQuery(q);
        }
        if (pageParam) {
            const p = parseInt(pageParam, 10);
            if (!Number.isNaN(p) && p > 0) {
                setPage(p);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        async function loadFilters() {
            try {
                const [categoriesData, citiesData] = await Promise.all([
                    getCategories(),
                    getCities()
                ]);
                setCategories(categoriesData);
                setCities(citiesData);
            } catch (err) {
                console.error("Failed to load filters", err);
            }
        }
        loadFilters();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const handle = setTimeout(async () => {
            try {
                const response = await getStoriesPage({
                    search: searchQuery || undefined,
                    category: selectedCategory !== "all" ? selectedCategory : undefined,
                    city: selectedCity !== "all" ? selectedCity : undefined,
                    stage: selectedStage !== "all" ? selectedStage : undefined,
                    sort: sortKey,
                    page,
                    page_size: pageSize,
                });
                setStories(response.results || []);
                setTotalCount(response.count || 0);
                setTotalPages(response.total_pages || 1);
            } catch (err) {
                console.error("Failed to load stories data", err);
                setStories([]);
                setTotalCount(0);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        }, searchQuery ? 300 : 0);

        return () => clearTimeout(handle);
    }, [searchQuery, selectedCategory, selectedCity, selectedStage, sortKey, page]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedCategory, selectedCity, selectedStage]);

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
        setSelectedCity("all");
        setSelectedStage("all");
        setPage(1);
    };

    const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedCity !== "all" || selectedStage !== "all";

    return (
        <div className="bg-background min-h-screen">
            <section className="container-wide py-12 md:py-16 border-b border-border/60">
                <div className="max-w-4xl space-y-5">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground font-serif tracking-tight">
                        Latest Indian Startup Stories & Founder Journeys
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        Your window into India's startup revolution. From bootstrapped beginnings to billion-dollar exits,
                        we bring you the untold stories of founders who are reshaping industries.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Explore in-depth features on funding rounds, pivot moments, growth strategies, and the people behind
                        India's most ambitious ventures. Updated regularly with the latest from Bengaluru, Mumbai, Delhi NCR,
                        and emerging startup hubs nationwide.
                    </p>
                </div>
            </section>

            <section className="container-wide py-8 border-b border-border/60">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    <div className="lg:col-span-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search stories..."
                                className="h-10 pl-10 rounded-xl border-border/60 bg-card text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-10 rounded-xl border-border/60 bg-card text-xs">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/60 shadow-2xl">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2">
                        <Select value={selectedCity} onValueChange={setSelectedCity}>
                            <SelectTrigger className="h-10 rounded-xl border-border/60 bg-card text-xs">
                                <SelectValue placeholder="All Cities" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/60 shadow-2xl">
                                <SelectItem value="all">All Cities</SelectItem>
                                {cities.map(city => (
                                    <SelectItem key={city.slug} value={city.name}>{city.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2">
                        <Select value={selectedStage} onValueChange={setSelectedStage}>
                            <SelectTrigger className="h-10 rounded-xl border-border/60 bg-card text-xs">
                                <SelectValue placeholder="All Stages" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/60 shadow-2xl">
                                <SelectItem value="all">All Stages</SelectItem>
                                <SelectItem value="Bootstrapped">Bootstrapped</SelectItem>
                                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                <SelectItem value="Seed">Seed</SelectItem>
                                <SelectItem value="Series A">Series A</SelectItem>
                                <SelectItem value="Series B+">Series B+</SelectItem>
                                <SelectItem value="IPO">IPO</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-2 text-xs">
                        <span className="text-muted-foreground hidden lg:inline">Sort:</span>
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant={sortKey === "latest" ? "accent" : "ghost"}
                                className={cn("h-8 rounded-full px-3 text-[10px] font-bold", sortKey === "latest" && "shadow-md shadow-accent/10")}
                                onClick={() => { setSortKey("latest"); setPage(1); }}
                            >
                                Latest
                            </Button>
                            <Button
                                variant={sortKey === "trending" ? "accent" : "ghost"}
                                className="h-8 rounded-full px-3 text-[10px] font-bold"
                                onClick={() => { setSortKey("trending"); setPage(1); }}
                            >
                                Trending
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Showing <span className="text-foreground">{stories.length}</span> of {totalCount} stories
                    </p>
                    {hasActiveFilters && (
                        <Button variant="ghost" className="h-8 px-3 rounded-full text-[10px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 uppercase tracking-widest" onClick={clearFilters}>
                            Clear filters
                        </Button>
                    )}
                </div>
            </section>

            <div className="container-wide py-10">
                <div className="space-y-10">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-[240px] rounded-2xl bg-muted animate-pulse border border-border/50" />
                            ))}
                        </div>
                    ) : stories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stories.map((story) => (
                                <StoryCard
                                    key={story.slug}
                                    slug={story.slug}
                                    title={story.title}
                                    excerpt={story.excerpt}
                                    thumbnail={story.thumbnail}
                                    og_image={(story as any).og_image}
                                    category={story.category}
                                    categorySlug={(story as any).category_slug}
                                    city={story.city}
                                    citySlug={(story as any).city_slug}
                                    publishDate={story.publishDate || (story as any).publish_date}
                                    author_name={(story as any).author_name || (story as any).author}
                                    read_time={(story as any).read_time}
                                    featured={false}
                                    isFeatured={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card border-2 border-dashed border-border/50 rounded-2xl">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/5 text-accent mb-4">
                                <X className="h-6 w-6 opacity-20" />
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-[1.2] font-serif">
                                No Results
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                                We couldn't find any stories matching your current filters.
                            </p>
                            <Button size="sm" variant="outline" onClick={clearFilters} className="rounded-xl px-8 border-accent/20 text-accent font-bold">
                                Clear all filters
                            </Button>
                        </div>
                    )}

                    {!isLoading && stories.length > 0 && (
                        <div className="flex items-center justify-between border-t border-border/50 pt-12">
                            <p className="text-sm text-muted-foreground font-medium">
                                Showing <span className="text-foreground font-bold">{stories.length}</span> stories
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl border-border/60"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                                        const p = idx + 1;
                                        return (
                                            <Button
                                                key={p}
                                                variant={p === page ? "accent" : "ghost"}
                                                className={cn("h-11 w-11 rounded-xl font-bold transition-all", p === page ? "shadow-lg shadow-accent/20" : "")}
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-11 w-11 rounded-xl border-border/60"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

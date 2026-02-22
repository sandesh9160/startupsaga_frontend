"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, Building2, MapPin, Sparkles, Image as ImageIcon, Briefcase, Cpu, GraduationCap, Heart, Wallet, Store, ShoppingBag } from "lucide-react";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { CityCard } from "@/components/cards/CityCard";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { Newsletter } from "@/components/sections/Newsletter";
// import { Banner } from "@/components/sections/Banner";
import { TrendingStories } from "@/components/stories/TrendingStories";
import { useState, useEffect, useRef, useMemo } from "react";
import { getTrendingStories, getSections, getStories, getStartups, getCities, getCategories, getPlatformStats } from "@/lib/api";
import { getIcon } from "@/lib/icons";
import { getSafeImageSrc } from "@/lib/images";

interface HomeContentProps {
    initialTrending?: any[];
    initialSections?: any[];
    initialStories?: any[];
    initialStartups?: any[];
    initialCities?: any[];
    initialCategories?: any[];
    initialPlatformStats?: { total_startups: number; total_stories: number; total_unicorns?: number };
    hasError?: boolean;
}

export function HomeContent({
    initialTrending = [],
    initialSections = [],
    initialStories = [],
    initialStartups = [],
    initialCities = [],
    initialCategories = [],
    initialPlatformStats = { total_startups: 3160, total_stories: 861, total_unicorns: 0 },
    hasError = false
}: HomeContentProps) {
    const isHydrated = useRef(false);
    const [latestStories, setLatestStories] = useState<any[]>(initialStories);
    const [featuredStartups, setFeaturedStartups] = useState<any[]>(initialStartups);
    const [topCities, setTopCities] = useState<any[]>(initialCities);
    const [topCategories, setTopCategories] = useState<any[]>(initialCategories);
    const [platformStats, setPlatformStats] = useState(initialPlatformStats);
    const [trendingStories, setTrendingStories] = useState<any[]>(initialTrending);
    const [pageSections, setPageSections] = useState<any[]>(initialSections);

    // Initialize hero data from initialSections if available and active to avoid hydration mismatch
    const initialHero = initialSections.find((s: any) => s.section_type === 'hero' && s.is_active === true);
    const [heroData, setHeroData] = useState({
        title: initialHero?.title || initialHero?.name || "Startup Stories of India",
        content: initialHero?.description || initialHero?.content || "Discover the journeys, milestones, and lessons from India's most inspiring founders and startups."
    });

    const [isClient, setIsClient] = useState(false);

    // Mark hydration complete
    useEffect(() => {
        setIsClient(true);
        isHydrated.current = true;
    }, []);

    // Compute active and sorted sections
    const activeSections = useMemo(() => {
        return [...pageSections]
            .filter(s => {
                const val = s.is_active;
                return val === true || val === 1 || String(val).toLowerCase() === 'true';
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [pageSections]);

    // Load additional data after hydration only if missing
    useEffect(() => {
        if (!isHydrated.current) return;

        async function loadData() {
            try {
                // Fetch missing data in parallel
                const promises: Promise<any>[] = [];

                if (initialStories.length === 0) {
                    promises.push(getStories().then((data) => {
                        setLatestStories(data.slice(0, 4));
                    }));
                }

                if (initialStartups.length === 0) {
                    promises.push(getStartups().then((data) => {
                        setFeaturedStartups(data.slice(0, 4));
                    }));
                }

                if (initialCities.length === 0) {
                    promises.push(getCities().then(setTopCities));
                }

                if (initialCategories.length === 0) {
                    promises.push(getCategories().then((data) => {
                        setTopCategories(data.slice(0, 14));
                    }));
                }

                if (!initialPlatformStats || (initialPlatformStats.total_startups === 3160 && initialPlatformStats.total_stories === 861)) {
                    promises.push(getPlatformStats().then(setPlatformStats).catch(() => null));
                }

                if (initialSections.length === 0) {
                    // Try both 'homepage' and 'home' for better compatibility
                    promises.push(getSections('homepage').then((sections) => {
                        if (sections && sections.length > 0) {
                            setPageSections(sections);
                            const hero = sections.find((s: any) => s.section_type === 'hero');
                            if (hero) {
                                setHeroData({
                                    title: hero.title || hero.name,
                                    content: hero.description || hero.content
                                });
                            }
                        } else {
                            // Fallback to 'home' if 'homepage' returns nothing
                            return getSections('home').then((altSections) => {
                                setPageSections(altSections);
                                const hero = altSections.find((s: any) => s.section_type === 'hero');
                                if (hero) {
                                    setHeroData({
                                        title: hero.title || hero.name,
                                        content: hero.description || hero.content
                                    });
                                }
                            });
                        }
                    }));
                }

                if (initialTrending.length === 0) {
                    promises.push(getTrendingStories().then(setTrendingStories));
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }

            } catch (error) {
                console.error("Failed to fetch home content", error);
            }
        }

        loadData();
    }, [isClient, initialSections, initialTrending, initialStories, initialStartups, initialCities, initialCategories]);

    return (
        <div className="bg-[#FFFFFF]">

            {activeSections.length > 0 ? (
                <div className="flex flex-col w-full">
                    {activeSections.map((section: any, index: number) => {
                        // Section-specific data
                        const sSettings = section.settings || {};
                        const bgColor = sSettings.backgroundColor || '#FFFFFF';
                        const textColor = sSettings.textColor || '#0F172A';

                        // Spacing from backend (paddingY = vertical, paddingX = horizontal)
                        const paddingY = sSettings.paddingY !== undefined ? sSettings.paddingY : null;
                        const paddingX = sSettings.paddingX !== undefined ? sSettings.paddingX : null;

                        // Common wrappers
                        const items = sSettings.items || [];
                        const align = sSettings.align || 'center';

                        switch (section.section_type) {
                            case 'hero':
                                return (
                                    <section
                                        key={section.id || index}
                                        className="relative overflow-hidden mb-0"
                                        style={{
                                            backgroundColor: (bgColor === '#FFFFFF' || bgColor === 'FFFFFF') ? '#0F172A' : bgColor,
                                            paddingTop: paddingY !== null ? paddingY : 48,
                                            paddingBottom: paddingY !== null ? paddingY : 64,
                                            paddingLeft: paddingX !== null ? paddingX : 0,
                                            paddingRight: paddingX !== null ? paddingX : 0,
                                        }}
                                    >
                                        <div className="container-wide relative z-10 text-center">
                                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black font-serif mb-6 max-w-5xl mx-auto leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000" style={{ color: (textColor === '#0F172A' || textColor === '0F172A') ? '#FFFFFF' : textColor.startsWith('#') ? textColor : '#' + textColor }}>
                                                {section.title || heroData.title}
                                            </h1>
                                            <div
                                                className={cn(
                                                    "text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 prose prose-lg text-center marker:text-zinc-500",
                                                    (textColor === '#FFFFFF' || textColor === 'FFFFFF' || (textColor === '#0F172A' || textColor === '0F172A')) ? 'prose-invert' : 'prose-zinc'
                                                )}
                                                style={{ color: (textColor === '#FFFFFF' || textColor === 'FFFFFF' || (textColor === '#0F172A' || textColor === '0F172A')) ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)' }}
                                                dangerouslySetInnerHTML={{ __html: section.description || section.subtitle || heroData.content }}
                                            />
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                                                <Button className={cn(
                                                    "w-full sm:w-auto h-14 px-10 rounded-xl shadow-xl transition-all group border-none",
                                                    (section.settings?.buttonStyle === 'secondary') ? "bg-white hover:bg-zinc-100 text-slate-900 border border-zinc-200" :
                                                        (section.settings?.buttonStyle === 'outline') ? "bg-transparent border-2 border-current hover:bg-white/10" :
                                                            "bg-[#F2542D] hover:bg-[#D94111] text-white shadow-orange-600/20"
                                                )} asChild>
                                                    <Link href={section.link_url || "/stories"} className="flex items-center gap-2">
                                                        <span className="font-bold text-lg">{section.link_text || "Explore Stories"}</span>
                                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>

                                                <Button className={cn(
                                                    "w-full sm:w-auto h-14 px-10 rounded-xl active:scale-95 transition-all border-none bg-white hover:bg-zinc-100 text-[#0F172A]",
                                                )} asChild>
                                                    <Link href={section.settings?.secondaryButtonLink || "/submit"} className="font-bold text-lg text-[#0F172A]">
                                                        {section.settings?.secondaryButtonText || "Submit Your Startup"}
                                                    </Link>
                                                </Button>
                                                {(section.settings?.extraButtons || []).map((btn: { text: string; link: string; style: string }, i: number) => (
                                                    <Button key={i} className={cn(
                                                        "w-full sm:w-auto h-14 px-10 rounded-xl active:scale-95 transition-all border-none",
                                                        btn.style === 'primary' ? "bg-orange-600 hover:bg-orange-700 text-white shadow-xl" :
                                                            btn.style === 'outline' ? "bg-transparent border-2 border-current hover:bg-white/10" :
                                                                "bg-white hover:bg-zinc-100 text-[#0F172A]"
                                                    )} asChild>
                                                        <Link href={btn.link || "/"} className="font-bold text-lg">
                                                            {btn.text}
                                                        </Link>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'latest_stories':
                                return (
                                    <section key={section.id || index} className="mb-0" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                                <div className="lg:col-span-8">
                                                    <div className="flex items-baseline justify-between mb-10">
                                                        <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Latest Stories"}</h2>
                                                        <Link href="/stories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                            View all <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {(items.length > 0 ? items : initialStories).slice(0, 6).map((story: any) => (
                                                            <StoryCard
                                                                key={story.slug}
                                                                slug={story.slug}
                                                                title={story.title}
                                                                excerpt={story.excerpt}
                                                                thumbnail={story.thumbnail}
                                                                category={story.category}
                                                                categorySlug={story.category_slug}
                                                                city={story.city}
                                                                citySlug={story.city_slug}
                                                                publishDate={story.publish_date}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="lg:col-span-4">
                                                    <TrendingStories stories={initialTrending} />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'trending_stories':
                                return (
                                    <section key={section.id || index} className="mb-0" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="flex items-baseline justify-between mb-10">
                                                <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Most Read Across Hubs"}</h2>
                                                <Link href="/stories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                    View all trending <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                {(items.length > 0 ? items : initialTrending).slice(0, 4).map((story: any) => (
                                                    <StoryCard
                                                        key={story.slug}
                                                        slug={story.slug}
                                                        title={story.title}
                                                        excerpt={story.excerpt}
                                                        thumbnail={story.thumbnail}
                                                        category={story.category}
                                                        categorySlug={story.category_slug}
                                                        city={story.city}
                                                        citySlug={story.city_slug}
                                                        publishDate={story.publish_date}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'featured_stories':
                                return (
                                    <section key={section.id || index} className="mb-0" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="flex items-baseline justify-between mb-10">
                                                <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Most Read Across Hubs"}</h2>
                                                <Link href="/stories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                    View all <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                                {(items.length > 0 ? items : initialStories.slice(0, 4)).map((story: any) => (
                                                    <StoryCard
                                                        key={story.slug}
                                                        slug={story.slug}
                                                        title={story.title}
                                                        excerpt={story.excerpt}
                                                        thumbnail={story.thumbnail}
                                                        category={story.category}
                                                        categorySlug={story.category_slug}
                                                        city={story.city}
                                                        citySlug={story.city_slug}
                                                        publishDate={story.publish_date}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'category_grid':
                                return (
                                    <section key={section.id || index} className="mb-0 overflow-hidden" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="flex items-baseline justify-between mb-10">
                                                <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Top Categories"}</h2>
                                                <Link href="/categories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                    All categories <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                                                {(items.length > 0 ? items : topCategories.slice(0, 7)).map((category: any) => (
                                                    <CategoryCard
                                                        key={category.slug || category.id}
                                                        slug={category.slug || (category.title || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}
                                                        name={category.name || category.title}
                                                        icon={getIcon(category.iconName || category.icon || "help-circle")}
                                                        startupCount={category.startup_count || category.startupCount || 0}
                                                        storyCount={category.story_count || category.storyCount || 0}
                                                        description={category.description || ""}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'city_grid':
                                return (
                                    <section key={section.id || index} className="w-full mb-0 border-b border-zinc-100/50" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="flex items-baseline justify-between mb-10">
                                                <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Explore by City"}</h2>
                                                <Link href="/cities" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                    All cities <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                                                {(items.length > 0 ? items : topCities.filter((c: any) => !c.tier || String(c.tier) === '1').slice(0, 6)).map((city: any) => {
                                                    const citySlug = city.slug || (city.title || city.name || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                                    return (
                                                        <CityCard
                                                            key={city.slug || city.id || citySlug}
                                                            slug={citySlug}
                                                            name={city.name || city.title}
                                                            image={city.image || city.imageUrl || city.thumbnail}
                                                            startupCount={city.startup_count || city.startupCount || 0}
                                                            storyCount={city.story_count || city.storyCount || 0}
                                                            tier={city.tier}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'rising_hubs':
                                return (
                                    <section key={section.id || index} className="w-full mb-0 bg-[#fdfdfd] border-b border-zinc-100/50" style={{ paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide">
                                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
                                                <div className="max-w-3xl">
                                                    <h2 className="text-xl md:text-2xl lg:text-[2rem] font-bold text-[#0F172A] mb-2 font-serif tracking-tight leading-tight">
                                                        {section.title || "Rising Startup Hubs"}
                                                    </h2>
                                                    <p className="text-zinc-500 text-lg">{section.subtitle || "Tier 2 & Tier 3 cities driving India's startup growth"}</p>
                                                </div>
                                                <Link href="/cities" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all pb-1">
                                                    View all rising hubs <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                                                {(items.length > 0 ? items : topCities.filter((c: any) => String(c.tier).includes('2') || String(c.tier).includes('3'))).slice(0, 12).map((city: any) => {
                                                    const citySlug = city.slug || (city.title || city.name || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                                    return (
                                                        <CityCard
                                                            key={city.slug || city.id || citySlug}
                                                            slug={citySlug}
                                                            name={city.name || city.title}
                                                            image={city.image || city.imageUrl || city.thumbnail}
                                                            startupCount={city.startup_count || city.startupCount || 0}
                                                            storyCount={city.story_count || city.storyCount || 0}
                                                            tier={city.tier}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'featured_startups':
                                {
                                    const fs = items.length > 0 ? items[0] : featuredStartups[0];
                                    if (!fs) return null;
                                    const fsSlug = fs.slug || (fs.title || fs.name || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                                    return (
                                        <section key={section.id || index} className="container-wide mb-0" style={{ paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                            <div className="flex items-center gap-3 mb-10">
                                                <Sparkles className="h-6 w-6 text-[#D94111] fill-[#D94111]" />
                                                <h2 className="text-xl md:text-2xl lg:text-[2rem] font-bold text-[#0F172A] font-serif">{section.title || "Featured Startup of the Week"}</h2>
                                            </div>
                                            <div className="bg-[#FFF8F5] rounded-[2rem] border border-orange-100 shadow-sm overflow-hidden group">
                                                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]">
                                                    <div className="lg:col-span-4 p-12 flex flex-col items-center justify-center text-center border-r border-orange-100/50">
                                                        <div className="w-40 h-40 rounded-3xl bg-white shadow-xl flex items-center justify-center p-8 mb-8 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                                                            {(fs.logo || fs.og_image || fs.image || fs.imageUrl) ? (
                                                                <Image
                                                                    src={getSafeImageSrc(fs.logo || fs.og_image || fs.image || fs.imageUrl)}
                                                                    alt={fs.name || fs.title}
                                                                    fill
                                                                    className="object-contain p-8"
                                                                    sizes="160px"
                                                                    unoptimized={getSafeImageSrc(fs.logo || fs.og_image || fs.image || fs.imageUrl).endsWith('.svg')}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 font-bold text-6xl font-serif">
                                                                    {(fs.name || fs.title)?.[0] || 'S'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h3 className="text-3xl font-bold text-[#0F172A] mb-2 font-serif">{fs.name || fs.title}</h3>
                                                        <p className="text-zinc-500 text-sm leading-relaxed">{fs.tagline || fs.subtitle || "Premium electric scooters designed for the new India"}</p>
                                                    </div>
                                                    <div className="lg:col-span-8 p-12 flex flex-col justify-center">
                                                        <div className="flex flex-wrap gap-3 mb-8">
                                                            <span className="px-5 py-2 rounded-full bg-white text-[#D94111] text-xs font-bold border border-orange-100 shadow-sm">{fs.category?.name || fs.category || "EV & Mobility"}</span>
                                                            <span className="px-5 py-2 rounded-full bg-white text-zinc-500 text-xs font-bold border border-zinc-100 shadow-sm">{fs.city?.name || fs.city || "Bengaluru"}</span>
                                                            <span className="px-5 py-2 rounded-full bg-white text-zinc-500 text-xs font-bold border border-zinc-100 shadow-sm">{(fs as any).funding_stage ?? fs.stage ?? "Series E"}</span>
                                                        </div>
                                                        <p className="text-zinc-600 text-lg leading-relaxed mb-10 max-w-2xl">
                                                            {fs.description || fs.content ? ((fs.description || fs.content).length > 300 ? (fs.description || fs.content).substring(0, 300) + "..." : (fs.description || fs.content)) : "Leading innovation in the Indian startup ecosystem."}
                                                        </p>
                                                        <div className="grid grid-cols-3 gap-8 mb-10">
                                                            <div><p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Founded</p><p className="font-bold text-[#0F172A] text-lg">{fs.founded_year || "2013"}</p></div>
                                                            <div><p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Team Size</p><p className="font-bold text-[#0F172A] text-lg">{fs.team_size || "2000+"}</p></div>
                                                            <div><p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-2">Founders</p><p className="font-bold text-[#0F172A] text-lg truncate">{fs.founder_name || fs.founders || "Founders"}</p></div>
                                                        </div>
                                                        <Button className="w-fit h-14 px-10 rounded-xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold text-lg group shadow-lg shadow-orange-600/20" asChild>
                                                            <Link href={`/startups/${fsSlug}`} className="flex items-center gap-2">
                                                                View Full Profile <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    );
                                }

                            case 'startup_cards':
                                return (
                                    <section key={section.id || index} className="container-wide mb-0" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="flex items-baseline justify-between mb-10">
                                            <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-[#0F172A] font-serif" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title || "Featured Startups"}</h2>
                                            <Link href="/startups" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                                View all <ArrowRight className="h-4 w-4" />
                                            </Link>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {(items.length > 0 ? items : featuredStartups.slice(0, 8)).map((startup: any) => (
                                                <StartupCard key={startup.slug || startup.id} {...startup} />
                                            ))}
                                        </div>
                                    </section>
                                );

                            case 'newsletter':
                                return (
                                    <div key={section.id || index} className="mb-0">
                                        <Newsletter />
                                    </div>
                                );

                            case 'cta':
                            case 'banner':
                                return (
                                    <section key={section.id || index} className="bg-[#0F172A] text-center overflow-hidden relative mb-0 pb-16" style={{ backgroundColor: bgColor, paddingTop: paddingY !== null ? paddingY : 48, paddingBottom: paddingY !== null ? paddingY : 48 }}>
                                        {/* Decorative gradients */}
                                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F2542D]/10 rounded-full blur-[120px]" />
                                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

                                        <div className="container-wide relative z-10">
                                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-serif tracking-tight leading-tight" style={{ color: '#' + (textColor.replace('#', '') === '0F172A' ? 'FFFFFF' : textColor.replace('#', '')) }}>
                                                {section.title || "Stay Updated with India's Startup Ecosystem"}
                                            </h2>
                                            <div className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium text-zinc-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.description || section.subtitle || "Get the latest funding news, founder stories, and industry insights." }} />

                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                                                <Button className={cn(
                                                    "w-full sm:w-auto h-14 px-10 rounded-2xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold text-lg group shadow-xl shadow-orange-600/20 transition-all",
                                                )} asChild={!!section.link_url}>
                                                    {section.link_url ? (
                                                        <Link href={section.link_url} className="flex items-center gap-2">
                                                            {section.link_text || "Get Started"}
                                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    ) : (
                                                        <span>{section.link_text || "Subscribe"}</span>
                                                    )}
                                                </Button>

                                                {(section.settings?.secondaryButtonText || section.settings?.secondaryButtonLink) && (
                                                    <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm font-bold text-lg" asChild>
                                                        <Link href={section.settings?.secondaryButtonLink || "/submit"}>
                                                            {section.settings?.secondaryButtonText || "Learn More"}
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'text':
                                return (
                                    <section key={section.id || index} className="container-wide mb-0" style={{ backgroundColor: bgColor, textAlign: align as any, paddingTop: paddingY !== null ? paddingY : 20, paddingBottom: paddingY !== null ? paddingY : 20 }}>
                                        {section.title && <h2 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold mb-4" style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }}>{section.title}</h2>}
                                        {section.subtitle && <h3 className="text-xl text-zinc-500 mb-4">{section.subtitle}</h3>}
                                        <div className="prose prose-lg max-w-none mx-auto mb-8" dangerouslySetInnerHTML={{ __html: section.content || section.description || "" }} style={{ color: '#' + (textColor.replace('#', '') === 'FFFFFF' ? 'FFFFFF' : '0F172A') }} />

                                        {(section.link_text || section.settings?.secondaryButtonText || (section.settings?.extraButtons || []).length > 0) && (
                                            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                                                {section.link_text && (
                                                    <Button className={cn(
                                                        "h-12 px-8 rounded-xl font-bold border-none transition-all active:scale-95",
                                                        sSettings.buttonStyle === 'outline' ? "bg-transparent border-2 hover:bg-zinc-50" : "bg-orange-600 hover:bg-orange-700 text-white"
                                                    )} asChild>
                                                        <Link href={section.link_url || "#"}>{section.link_text}</Link>
                                                    </Button>
                                                )}
                                                {sSettings.secondaryButtonText && (
                                                    <Button className="h-12 px-8 rounded-xl font-bold bg-white hover:bg-zinc-50 text-slate-900 border border-zinc-200 transition-all active:scale-95" asChild>
                                                        <Link href={sSettings.secondaryButtonLink || "#"}>{sSettings.secondaryButtonText}</Link>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </section>
                                );

                            case 'image':
                                return (
                                    <section key={section.id || index} className="container-wide mb-0" style={{ backgroundColor: bgColor, textAlign: align as any, paddingTop: paddingY !== null ? paddingY : 20, paddingBottom: paddingY !== null ? paddingY : 20 }}>
                                        {(section.image || section.settings?.imageUrl) && (
                                            <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                                                <Image src={getSafeImageSrc(section.image || section.settings?.imageUrl)} alt={section.title || "Section Image"} fill className="object-cover" />
                                            </div>
                                        )}
                                        {section.description && <p className="mt-4 text-zinc-500 text-center max-w-2xl mx-auto italic">{section.description}</p>}
                                    </section>
                                );

                            case 'video':
                                return (
                                    <section key={section.id || index} className="container-wide mb-0" style={{ backgroundColor: bgColor, textAlign: align as any, paddingTop: paddingY !== null ? paddingY : 20, paddingBottom: paddingY !== null ? paddingY : 20 }}>
                                        {(section.settings?.videoUrl) && (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                                                <iframe
                                                    src={section.settings.videoUrl.indexOf('watch?v=') !== -1 ? section.settings.videoUrl.replace('watch?v=', 'embed/') : section.settings.videoUrl}
                                                    className="absolute inset-0 w-full h-full border-0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}
                                        {section.settings?.caption && <p className="mt-4 text-zinc-500 text-center max-w-2xl mx-auto italic">{section.settings.caption}</p>}
                                    </section>
                                );

                            case 'custom_content':
                                return (
                                    <section
                                        key={section.id || index}
                                        className="container-wide mb-0"
                                        style={{
                                            backgroundColor: bgColor,
                                            textAlign: align as any,
                                            paddingTop: paddingY !== null ? paddingY : 28,
                                            paddingBottom: paddingY !== null ? paddingY : 28,
                                            paddingLeft: paddingX !== null ? paddingX : undefined,
                                            paddingRight: paddingX !== null ? paddingX : undefined,
                                        }}
                                    >
                                        {section.title && (
                                            <h2
                                                className="text-xl md:text-3xl font-bold mb-4 font-serif"
                                                style={{ color: textColor.startsWith('#') ? textColor : '#0F172A', fontFamily: sSettings.fontFamily || undefined }}
                                            >
                                                {section.title}
                                            </h2>
                                        )}
                                        {section.subtitle && (
                                            <h3 className="text-xl text-zinc-500 mb-6">{section.subtitle}</h3>
                                        )}
                                        {(section.settings?.imageUrl || section.image) && (
                                            <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl mb-8">
                                                <Image
                                                    src={getSafeImageSrc(section.settings?.imageUrl || section.image)}
                                                    alt={section.title || 'Section image'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div
                                            className="prose prose-lg max-w-none"
                                            style={{
                                                color: textColor.startsWith('#') ? textColor : '#0F172A',
                                                fontFamily: sSettings.fontFamily || undefined,
                                                fontSize: sSettings.fontSize ? `${sSettings.fontSize}px` : undefined,
                                            }}
                                            dangerouslySetInnerHTML={{ __html: section.content || section.description || '' }}
                                        />
                                        {(section.link_text || section.link_url) && (
                                            <div className="mt-8 flex justify-center">
                                                <Link
                                                    href={section.link_url || '#'}
                                                    className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-all"
                                                >
                                                    {section.link_text || 'Learn More'}
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        )}
                                    </section>
                                );

                            case 'mission_vision':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide">
                                            {section.title && (
                                                <div className="text-center mb-10">
                                                    <h2 className="text-3xl font-bold font-serif" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>
                                                    {section.subtitle && <p className="text-zinc-500 mt-2 text-lg">{section.subtitle}</p>}
                                                </div>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : [
                                                    { icon: '🎯', title: 'Our Mission', description: '', color: '#FEF3E8' },
                                                    { icon: '🌐', title: 'Our Vision', description: '', color: '#EEF6FF' }
                                                ]).map((card: any, i: number) => (
                                                    <div key={i} className="rounded-2xl p-6 border border-zinc-100" style={{ backgroundColor: card.color || '#F8FAFC' }}>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
                                                                {card.icon || '⭐'}
                                                            </div>
                                                            <h3 className="text-xl font-bold text-slate-900">{card.title || 'Section Title'}</h3>
                                                        </div>
                                                        <p className="text-zinc-600 leading-relaxed">{card.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'stats_bar':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 20, paddingBottom: paddingY !== null ? paddingY : 20 }}>
                                        <div className="container-wide">
                                            {section.title && <h2 className="text-2xl font-bold text-center mb-8 font-serif" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <div key={i} className="text-center p-6 rounded-2xl border border-zinc-100 bg-white shadow-sm">
                                                        <div className="text-3xl font-black text-orange-600 mb-1">{card.stat_value || '0'}</div>
                                                        <div className="text-sm text-zinc-500 font-medium">{card.stat_label || 'Stat'}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'team_grid':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide">
                                            <div className="flex items-center gap-3 mb-10">
                                                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-lg">👤</div>
                                                <h2 className="text-2xl font-bold font-serif" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title || 'Our Team'}</h2>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <div key={i} className="text-center group">
                                                        <div className="w-24 h-24 mx-auto rounded-2xl mb-3 bg-zinc-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
                                                            {card.image ? (
                                                                <img src={getSafeImageSrc(card.image)} alt={card.title} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-2xl font-bold text-zinc-400">{(card.title || 'T')[0]}</span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-zinc-900">{card.title || 'Name'}</h4>
                                                        <p className="text-sm text-orange-600 font-medium">{card.role || ''}</p>
                                                        {card.description && <p className="text-xs text-zinc-500 mt-1 max-w-[180px] mx-auto">{card.description}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'values_grid':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide">
                                            <div className="flex items-center gap-3 mb-10">
                                                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 text-lg">🏅</div>
                                                <h2 className="text-2xl font-bold font-serif" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title || 'Our Values'}</h2>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <div key={i} className="p-6 rounded-2xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                        <h3 className="font-bold text-zinc-900 text-lg mb-2">{card.title || 'Value'}</h3>
                                                        <p className="text-zinc-500 text-sm leading-relaxed">{card.description || ''}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'policy_section':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide max-w-4xl mx-auto px-4 md:px-8">
                                            {section.title && <h2 className="text-2xl font-bold font-serif mb-6 pb-4 border-b border-zinc-200" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>}
                                            {(sSettings.body || section.content || section.description) && (
                                                <div className="prose prose-zinc max-w-none leading-relaxed text-zinc-700"
                                                    dangerouslySetInnerHTML={{ __html: sSettings.body || section.content || section.description || '' }} />
                                            )}
                                        </div>
                                    </section>
                                );

                            case 'faq':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#f8fafc', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide max-w-3xl mx-auto px-4 md:px-8">
                                            {section.title && <h2 className="text-2xl font-bold font-serif mb-8 text-center" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>}
                                            <div className="space-y-4">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <details key={i} className="group bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                                                        <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-zinc-900 hover:text-orange-600 transition-colors">
                                                            <span>{card.question || card.title}</span>
                                                            <span className="text-zinc-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4">▼</span>
                                                        </summary>
                                                        <div className="px-6 pb-4 text-zinc-600 text-sm leading-relaxed border-t border-zinc-100 pt-3">
                                                            {card.answer || card.description}
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'callout':
                                return (
                                    <section key={section.id || index} style={{ paddingTop: paddingY !== null ? paddingY : 16, paddingBottom: paddingY !== null ? paddingY : 16 }}>
                                        <div className="container-wide px-4 md:px-8">
                                            <div className="flex items-start gap-4 px-6 py-5 rounded-xl border" style={{ backgroundColor: sSettings.backgroundColor || '#FEF3E8', borderColor: `${sSettings.textColor || '#F97316'}40` }}>
                                                <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
                                                <div>
                                                    {section.title && <p className="font-bold mb-1" style={{ color: sSettings.textColor || '#9A3412' }}>{section.title}</p>}
                                                    <p className="text-sm leading-relaxed" style={{ color: sSettings.textColor || '#9A3412' }}>
                                                        {sSettings.body || section.content || section.description || 'This is an important notice.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'related_cards':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#f8fafc', paddingTop: paddingY !== null ? paddingY : 28, paddingBottom: paddingY !== null ? paddingY : 28 }}>
                                        <div className="container-wide px-4 md:px-8">
                                            {section.title && <h2 className="text-2xl font-bold font-serif mb-8" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <Link key={i} href={card.link || '#'} className="flex items-start gap-3 p-5 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all group no-underline">
                                                        <span className="text-2xl shrink-0">{card.icon || '📄'}</span>
                                                        <div>
                                                            <p className="font-bold text-zinc-900 text-sm group-hover:text-orange-600 transition-colors">{card.title}</p>
                                                            {card.description && <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{card.description}</p>}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'image_gallery':
                                return (
                                    <section key={section.id || index} style={{ backgroundColor: sSettings.backgroundColor || '#ffffff', paddingTop: paddingY !== null ? paddingY : 24, paddingBottom: paddingY !== null ? paddingY : 24 }}>
                                        <div className="container-wide px-4 md:px-8">
                                            {section.title && <h2 className="text-2xl font-bold font-serif mb-8" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>{section.title}</h2>}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm group">
                                                        {card.image ? (
                                                            <Image src={getSafeImageSrc(card.image)} alt={card.title || `Gallery image ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl">🖼️</div>
                                                        )}
                                                        {card.title && (
                                                            <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                                                                <p className="text-white text-xs font-medium">{card.title}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </section>
                                );

                            case 'table_of_contents':
                                return (
                                    <section key={section.id || index} style={{ paddingTop: paddingY !== null ? paddingY : 16, paddingBottom: paddingY !== null ? paddingY : 16 }}>
                                        <div className="container-wide max-w-2xl px-4 md:px-8">
                                            <div className="p-6 rounded-xl border border-zinc-200 shadow-sm" style={{ backgroundColor: sSettings.backgroundColor || '#f8fafc' }}>
                                                {section.title && <p className="font-bold text-zinc-900 mb-4 text-sm uppercase tracking-wider">{section.title}</p>}
                                                <ol className="space-y-2">
                                                    {(sSettings.cards && sSettings.cards.length > 0 ? sSettings.cards : []).map((card: any, i: number) => (
                                                        <li key={i} className="flex items-center gap-3">
                                                            <span className="text-orange-600 font-bold font-mono text-sm">{String(i + 1).padStart(2, '0')}</span>
                                                            <a href={card.link || '#'} className="text-zinc-700 hover:text-orange-600 transition-colors text-sm font-medium">{card.title}</a>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    </section>
                                );

                            default:
                                // Generic renderer for any unrecognized section type that has content
                                // This ensures custom page types always render rather than silently return null
                                if (!section.title && !section.content && !section.description && !sSettings.imageUrl) return null;

                                return (
                                    <section
                                        key={section.id || index}
                                        className="container-wide mb-0"
                                        style={{
                                            backgroundColor: bgColor,
                                            textAlign: align as any,
                                            paddingTop: paddingY !== null ? paddingY : 20,
                                            paddingBottom: paddingY !== null ? paddingY : 20,
                                        }}
                                    >
                                        {section.title && (
                                            <h2 className="text-3xl font-bold mb-4 font-serif" style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}>
                                                {section.title}
                                            </h2>
                                        )}
                                        {section.subtitle && <h3 className="text-xl text-zinc-500 mb-4">{section.subtitle}</h3>}
                                        {(sSettings.imageUrl || section.image) && (
                                            <div className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-xl mb-6">
                                                <Image src={getSafeImageSrc(sSettings.imageUrl || section.image)} alt={section.title || ''} fill className="object-cover" />
                                            </div>
                                        )}
                                        {(section.content || section.description) && (
                                            <div
                                                className="prose prose-lg max-w-none"
                                                style={{ color: textColor.startsWith('#') ? textColor : '#0F172A' }}
                                                dangerouslySetInnerHTML={{ __html: section.content || section.description || '' }}
                                            />
                                        )}
                                    </section>
                                );
                        }
                    })}
                </div>
            ) : (
                <>
                    {/* Hero Banner Section */}
                    <section className="relative overflow-hidden bg-[#0F172A] py-16 md:py-24 lg:py-32 mb-8">
                        <div className="container-wide relative z-10 text-center">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white mb-6 max-w-4xl mx-auto leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
                                {heroData.title}
                            </h1>
                            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                                {heroData.content}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                                <Button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/20 active:scale-95 transition-all group border-none" asChild>
                                    <Link href="/stories" className="flex items-center gap-2">
                                        <span className="font-bold text-lg">Explore Stories</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                                <Button className="w-full sm:w-auto h-14 px-10 rounded-xl bg-white hover:bg-zinc-100 text-[#0F172A] active:scale-95 transition-all border-none" asChild>
                                    <Link href="/submit" className="font-bold text-lg">
                                        Submit Your Journey
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Latest & Trending Section */}
                    <section className="container-wide py-8 mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Main Content: Latest Stories */}
                            <div className="lg:col-span-8">
                                <div className="flex items-baseline justify-between mb-8 border-b border-zinc-100 pb-4">
                                    <h2 className="text-3xl font-bold text-[#0F172A] mb-0">Latest Stories</h2>
                                    <Link href="/stories" className="text-orange-600 font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                        View all <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {latestStories.map((story) => (
                                        <StoryCard
                                            key={story.slug}
                                            slug={story.slug}
                                            title={story.title}
                                            excerpt={story.excerpt}
                                            thumbnail={story.thumbnail}
                                            og_image={story.og_image}
                                            category={story.category}
                                            categorySlug={story.category_slug}
                                            city={story.city}
                                            citySlug={story.city_slug}
                                            publishDate={story.publish_date}
                                            author_name={story.author_name || story.author}
                                            read_time={story.read_time}
                                            featured={false}
                                            isFeatured={false}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar: Trending */}
                            <div className="lg:col-span-4">
                                <TrendingStories stories={trendingStories} />
                            </div>
                        </div>
                    </section>

                    {/* Top Categories */}
                    <section className="bg-[#F8F9FA] py-12 mb-8">
                        <div className="container-wide">
                            <div className="flex items-baseline justify-between mb-10">
                                <h2 className="text-3xl font-bold text-[#0F172A] font-serif">Top Categories</h2>
                                <Link href="/categories" className="text-orange-600 font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                    All categories <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
                                {topCategories.slice(0, 7).map((category, idx) => {
                                    // Map exact icons for the 7 top categories based on screenshot
                                    const slug = (category.slug || "").toLowerCase();
                                    const name = (category.name || "").toLowerCase();
                                    let icon = null;

                                    if (slug.includes('saas') || name.includes('saas')) icon = <Briefcase strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('ai') || name.includes('ai')) icon = <Cpu strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('edtech') || name.includes('edtech')) icon = <GraduationCap strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('health') || name.includes('health')) icon = <Heart strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('fintech') || name.includes('fintech')) icon = <Wallet strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('retail') || name.includes('retail')) icon = <Store strokeWidth={1.5} className="w-7 h-7" />;
                                    else if (slug.includes('d2c') || name.includes('d2c')) icon = <ShoppingBag strokeWidth={1.5} className="w-7 h-7" />;
                                    else {
                                        const IconComponent = getIcon(category.iconName || "folder");
                                        icon = <IconComponent strokeWidth={1.5} className="w-7 h-7" />;
                                    }

                                    const storiesCount = category.storyCount || category.story_count || category.storiesCount || 0;

                                    return (
                                        <Link href={`/categories/${category.slug}`} key={category.slug} className="group bg-white rounded-[1.5rem] flex flex-col items-center justify-center py-5 px-4 border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
                                            <div className="w-[60px] h-[60px] rounded-full bg-orange-50 flex items-center justify-center mb-2 text-orange-600 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                                                {icon}
                                            </div>
                                            <h3 className="font-bold text-[#0F172A] text-[15px] font-serif mb-1 group-hover:text-[#0F172A] transition-colors text-center">
                                                {category.name}
                                            </h3>
                                            <p className="text-zinc-400 text-xs font-medium">{storiesCount} stories</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Explore by City (Tier 1) */}
                    <section className="container-wide py-12 mb-8 bg-white">
                        <div className="flex items-baseline justify-between mb-8">
                            <h2 className="text-3xl font-bold text-[#0F172A] font-serif tracking-tight">Explore by City</h2>
                            <Link href="/cities" className="text-orange-600 font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                                All cities <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                            {topCities.filter(c => !c.tier || String(c.tier).includes('1')).slice(0, 5).map((city) => (
                                <CityCard key={city.slug} {...city} />
                            ))}
                        </div>
                    </section>

                    {/* Rising Startup Hubs (Tier 2 & 3) */}
                    <section className="bg-white py-8 mb-8">
                        <div className="container-wide overflow-hidden relative">
                            <div className="flex flex-col mb-8">
                                <div className="flex items-baseline justify-between mb-2">
                                    <h2 className="text-3xl font-bold text-[#0F172A] font-serif tracking-tight">Rising Startup Hubs</h2>
                                    <Link href="/cities" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all text-sm">
                                        View all rising hubs <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                                <p className="text-zinc-400 text-sm">Tier 2 & Tier 3 cities driving India's startup growth</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {topCities.filter(c => String(c.tier).includes('2') || String(c.tier).includes('3')).slice(0, 12).map((city) => (
                                    <CityCard key={city.slug} {...city} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Featured Startup of the Week */}
                    <section className="container-wide py-12 mb-12">
                        <div className="flex items-center gap-3 mb-10">
                            <Sparkles className="h-6 w-6 text-orange-600 fill-orange-600" />
                            <h2 className="text-3xl font-bold text-[#0F172A]">Featured Startup of the Week</h2>
                        </div>
                        {featuredStartups[0] && (
                            <div className="bg-[#FFFFFF] rounded-[2rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden group">
                                <div className="grid grid-cols-1 lg:grid-cols-12">
                                    {/* Left Side: Brand */}
                                    <div className="lg:col-span-4 bg-[#FFF5F1] p-12 flex flex-col items-center justify-center text-center border-r border-zinc-50">
                                        <div className="w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center p-6 mb-8 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                                            {(featuredStartups[0].logo || featuredStartups[0].og_image) ? (
                                                <Image
                                                    src={getSafeImageSrc(featuredStartups[0].logo || featuredStartups[0].og_image)}
                                                    alt={featuredStartups[0].name}
                                                    fill
                                                    className="object-contain p-6"
                                                    sizes="128px"
                                                    unoptimized={getSafeImageSrc(featuredStartups[0].logo || featuredStartups[0].og_image).endsWith('.svg')}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 font-bold text-5xl font-serif">
                                                    {featuredStartups[0].name?.[0] || 'S'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#0F172A] mb-2 font-serif">{featuredStartups[0].name}</h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed">{featuredStartups[0].tagline}</p>
                                    </div>

                                    {/* Right Side: Details */}
                                    <div className="lg:col-span-8 p-12">
                                        <div className="flex flex-wrap gap-3 mb-8">
                                            <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest">{featuredStartups[0].category?.name || "Startup"}</span>
                                            <span className="px-4 py-1.5 rounded-full bg-zinc-50 text-zinc-500 text-xs font-bold uppercase tracking-widest">{featuredStartups[0].city?.name || "India"}</span>
                                            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">{(featuredStartups[0] as any).funding_stage ?? featuredStartups[0].stage ?? "Series E"}</span>
                                        </div>

                                        <p className="text-zinc-600 text-lg leading-relaxed mb-10">
                                            {featuredStartups[0].description ? (
                                                featuredStartups[0].description.length > 300
                                                    ? featuredStartups[0].description.substring(0, 300) + "..."
                                                    : featuredStartups[0].description
                                            ) : "Leading innovation in the Indian startup ecosystem with groundbreaking solutions and visionary leadership."}
                                        </p>

                                        <div className="grid grid-cols-3 gap-8 mb-10 border-t border-zinc-100 pt-8">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Founded</p>
                                                <p className="font-bold text-[#0F172A]">{featuredStartups[0].founded_year || "2013"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Team Size</p>
                                                <p className="font-bold text-[#0F172A]">{featuredStartups[0].team_size || "2000+"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">Founders</p>
                                                <p className="font-bold text-[#0F172A] truncate">{featuredStartups[0].founder_name || "Tarun Mehta, Swapnil Jain"}</p>
                                            </div>
                                        </div>

                                        <Button className="h-12 px-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold group" asChild>
                                            <Link href={`/startups/${featuredStartups[0].slug}`} className="flex items-center gap-2">
                                                View Full Profile <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Newsletter Section */}
                    <div className="mb-24">
                        <Newsletter />
                    </div>

                </>
            )
            }
        </div >
    );
}


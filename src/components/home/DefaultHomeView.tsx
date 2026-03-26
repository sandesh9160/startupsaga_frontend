import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { CityCard } from "@/components/cards/CityCard";
import { Newsletter } from "@/components/sections/Newsletter";
import { getSafeImageSrc } from "@/lib/images";
import { SmartImage } from "@/components/ui/SmartImage";

import {
    getTrendingStories,
    getStories,
    getStartups,
    getCities
} from "@/lib/api";

import { Story, Startup, City } from "@/types";

interface DefaultHomeViewProps {
    trendingStories?: Story[];
    latestStories?: Story[];
    featuredStartups?: Startup[];
    topCities?: City[];
}

const getDisplayName = (val: string | { name?: string } | null | undefined) =>
    typeof val === 'string' ? val : val?.name;

export async function DefaultHomeView({
    trendingStories: initialTrending,
    latestStories: initialLatest,
    featuredStartups: initialFeatured,
    topCities: initialCities
}: DefaultHomeViewProps) {
    // Fetch data in parallel if not provided
    const [trendingStories, latestStories, featuredStartups, topCities] = await Promise.all([
        initialTrending && initialTrending.length > 0 ? Promise.resolve(initialTrending) : getTrendingStories().catch(() => []),
        initialLatest && initialLatest.length > 0 ? Promise.resolve(initialLatest) : getStories({ page_size: 6 }).catch(() => []),
        initialFeatured && initialFeatured.length > 0 ? Promise.resolve(initialFeatured) : getStartups({ page_size: 6 }).catch(() => []),
        initialCities && initialCities.length > 0 ? Promise.resolve(initialCities) : getCities().catch(() => [])
    ]);

    return (
        <div className="flex flex-col w-full">
            {/* Latest Stories & Trending Sidebar Section */}
            <section className="container-wide py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side: Latest Stories */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-4xl font-bold text-[#0F172A] font-serif tracking-tight">Latest Stories</h2>
                            <Link href="/stories" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all text-sm group">
                                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {latestStories.slice(0, 6).map((story, idx: number) => (
                                <StoryCard key={story.slug} {...story} priority={idx === 0} />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Trending Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm shadow-zinc-200/50">
                            <div className="flex items-center gap-2 mb-8 border-b border-zinc-50 pb-4">
                                <TrendingUp className="h-5 w-5 text-orange-600" />
                                <h2 className="text-2xl font-bold text-[#0F172A] font-serif">Trending This Week</h2>
                            </div>
                            <div className="space-y-6">
                                {trendingStories.slice(0, 5).map((story, idx: number) => (
                                    <Link
                                        key={story.slug}
                                        href={`/stories/${story.slug}`}
                                        className="flex items-start gap-5 group"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center font-bold text-3xl font-serif text-zinc-300 group-hover:text-orange-600 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1.5 opacity-80 group-hover:opacity-100 italic">
                                                {getDisplayName(story.category) || "Startup"}
                                            </div>
                                            <h3 className="text-[15px] font-bold font-serif leading-snug line-clamp-2 text-[#0F172A] group-hover:text-orange-600 transition-colors">
                                                {story.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-center">
                                <Link href="/stories?sort=trending" className="w-full">
                                    <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-[#0F172A] transition-all">
                                        View Full List
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Featured Startups Section */}
            <section className="bg-[#f8f9fb] py-16 content-auto">
                <div className="container-wide">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-semibold text-[#0F172A] font-serif">Featured Startups</h2>
                        <Link href="/startups" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                            View all startups <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredStartups.slice(0, 8).map((startup) => (
                            <StartupCard key={startup.slug || startup.id} {...startup} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Cities Section */}
            <section className="container-wide py-16 border-b border-zinc-200 content-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-semibold text-[#0F172A] font-serif">Explore by City</h2>
                    <Link href="/cities" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        All cities <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {topCities.filter(c => !c.tier || String(c.tier) === '1').slice(0, 6).map((city) => (
                        <CityCard key={city.slug} {...city} />
                    ))}
                </div>
            </section>

            {/* Rising Hubs */}
            <section className="bg-white py-16 mb-8 content-auto">
                <div className="container-wide">
                    <div className="flex flex-col mb-10">
                        <div className="flex items-baseline justify-between mb-2">
                            <h2 className="text-3xl font-semibold text-[#0F172A] font-serif tracking-tight">Rising Startup Hubs</h2>
                            <Link href="/cities" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all text-sm">
                                View all rising hubs <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium">Tier 2 &amp; Tier 3 cities driving India&apos;s startup growth</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                        {topCities.filter(c => String(c.tier).includes('2') || String(c.tier).includes('3')).slice(0, 12).map((city) => (
                            <CityCard key={city.slug} {...city} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Startup of the Week */}
            {featuredStartups[0] && (
                <section className="container-wide py-16 mb-12 content-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <Sparkles className="h-8 w-8 text-orange-600 fill-orange-600" />
                        <h2 className="text-3xl font-semibold text-[#0F172A] font-serif">Featured Startup of the Week</h2>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-3xl border border-zinc-100 shadow-xl overflow-hidden group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
                            <div className="lg:col-span-4 bg-[#FFF5F1] p-10 flex flex-col items-center justify-center text-center border-r border-zinc-50">
                                <div className="w-40 h-40 rounded-3xl bg-white shadow-md flex items-center justify-center p-8 mb-6 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                                    {(featuredStartups[0].logo || featuredStartups[0].og_image) ? (
                                        <SmartImage
                                            src={getSafeImageSrc(featuredStartups[0].logo || featuredStartups[0].og_image)}
                                            alt={featuredStartups[0].name}
                                            fill
                                            className="object-contain p-6"
                                            sizes="160px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100/50 text-orange-600 font-bold text-6xl font-serif">
                                            {featuredStartups[0].name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F172A] mb-2 font-serif">{featuredStartups[0].name}</h3>
                            </div>
                            <div className="lg:col-span-8 p-10 flex flex-col justify-center">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest">{getDisplayName(featuredStartups[0].category) || "Startup"}</span>
                                    <span className="px-4 py-1.5 rounded-full bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{getDisplayName(featuredStartups[0].city) || "India"}</span>
                                </div>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-2xl line-clamp-3">
                                    {featuredStartups[0].tagline || featuredStartups[0].description || "Leading innovation in the Indian startup ecosystem."}
                                </p>
                                <Link href={`/startups/${featuredStartups[0].slug}`} className="w-fit">
                                    <Button className="h-14 px-10 rounded-xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold group shadow-lg shadow-orange-600/20">
                                        <span className="flex items-center gap-2">
                                            View Full Profile <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="mb-20">
                <Newsletter />
            </div>
        </div>
    );
}

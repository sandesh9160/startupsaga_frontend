import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { CityCard } from "@/components/cards/CityCard";
import { Newsletter } from "@/components/sections/Newsletter";
import { getSafeImageSrc } from "@/lib/images";

interface DefaultHomeViewProps {
    trendingStories: any[];
    latestStories: any[];
    featuredStartups: any[];
    topCities: any[];
}

export function DefaultHomeView({
    trendingStories = [],
    latestStories = [],
    featuredStartups = [],
    topCities = []
}: DefaultHomeViewProps) {
    return (
        <div className="flex flex-col w-full">
            {/* Trending Section */}
            <section className="container-wide py-12">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-semibold text-[#0F172A] font-serif">Most Read Across India</h2>
                    <Link href="/stories" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        View all trending <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trendingStories.slice(0, 4).map((story, idx) => (
                        <StoryCard key={story.slug} {...story} priority={idx < 4} />
                    ))}
                </div>
            </section>

            {/* Featured Startups Section */}
            <section className="bg-[#f8f9fb] py-16">
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
            <section className="container-wide py-16 border-b border-zinc-200">
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
            <section className="bg-white py-16 mb-8">
                <div className="container-wide">
                    <div className="flex flex-col mb-10">
                        <div className="flex items-baseline justify-between mb-2">
                            <h2 className="text-3xl font-semibold text-[#0F172A] font-serif tracking-tight">Rising Startup Hubs</h2>
                            <Link href="/cities" className="text-orange-600 font-bold tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all text-sm">
                                View all rising hubs <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium">Tier 2 & Tier 3 cities driving India's startup growth</p>
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
                <section className="container-wide py-16 mb-12">
                    <div className="flex items-center gap-3 mb-10">
                        <Sparkles className="h-8 w-8 text-orange-600 fill-orange-600" />
                        <h2 className="text-3xl font-semibold text-[#0F172A] font-serif">Featured Startup of the Week</h2>
                    </div>
                    <div className="bg-[#FFFFFF] rounded-3xl border border-zinc-100 shadow-xl overflow-hidden group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[350px]">
                            <div className="lg:col-span-4 bg-[#FFF5F1] p-10 flex flex-col items-center justify-center text-center border-r border-zinc-50">
                                <div className="w-40 h-40 rounded-3xl bg-white shadow-md flex items-center justify-center p-8 mb-6 group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                                    {(featuredStartups[0].logo || featuredStartups[0].og_image) ? (
                                        <Image
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
                                    <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest">{featuredStartups[0].category?.name || "Startup"}</span>
                                    <span className="px-4 py-1.5 rounded-full bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{featuredStartups[0].city?.name || "India"}</span>
                                </div>
                                <p className="text-zinc-600 text-lg leading-relaxed mb-8 max-w-2xl line-clamp-3">
                                    {featuredStartups[0].tagline || featuredStartups[0].description || "Leading innovation in the Indian startup ecosystem."}
                                </p>
                                <Button className="w-fit h-14 px-10 rounded-xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold group shadow-lg shadow-orange-600/20" asChild>
                                    <Link href={`/startups/${featuredStartups[0].slug}`} className="flex items-center gap-2">
                                        View Full Profile <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
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

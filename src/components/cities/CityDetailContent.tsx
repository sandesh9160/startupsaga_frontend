"use client";

import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building2, TrendingUp, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { getSafeImageSrc } from "@/lib/images";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CityDetailContentProps {
    city: any;
    cityStartups: any[];
    cityStories: any[];
    topCategories: any[];
}

export function CityDetailContent({ city, cityStartups, cityStories, topCategories }: CityDetailContentProps) {
    const [selectedStage, setSelectedStage] = useState("all");
    const heroImage = city.image ? getSafeImageSrc(city.image) : "https://images.unsplash.com/photo-1562426620-1e71f9cf3d1c?q=80&w=2600&auto=format&fit=crop";

    const filteredStartups = useMemo(() => {
        if (selectedStage === "all") return cityStartups;
        return cityStartups.filter(s => ((s as any).funding_stage ?? s.stage) === selectedStage);
    }, [cityStartups, selectedStage]);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-[#0F172A] py-16 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt={`${city.name} skyline`}
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
                </div>

                <div className="relative z-10 container-wide text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-serif mb-8 text-white tracking-tight">
                        Startups in {city.name}
                    </h1>

                    <div className="flex items-center justify-center gap-8 text-[11px] md:text-[13px] font-bold text-white/90">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-4.5 w-4.5 text-white/60" />
                            <span>{(city.startupCount || city.startup_count || cityStartups.length || 0).toLocaleString()}+ startups</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4.5 w-4.5 text-white/60" />
                            <span>
                                {city.tier === "1" ? "India's Premier Hub" :
                                    city.tier === "2" ? "Major Growth Hub" :
                                        "Emerging Startup Hub"}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4.5 w-4.5 text-white/60" />
                            <span>
                                {city.unicornCount > 0 ? `${city.unicornCount} Unicorns` : "Accelerating Ecosystem"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ecosystem Description Card */}
            <section className="container-wide mt-4 relative z-20 mb-6">
                <div className="bg-white rounded-md p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-zinc-100 max-w-[1400px] mx-auto">
                    <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-3 font-serif">
                        The {city.name} Startup Ecosystem
                    </h2>
                    <div className="prose prose-sm md:prose-base max-w-none text-zinc-600/90 leading-relaxed font-medium">
                        {city.description ? (
                            <div dangerouslySetInnerHTML={{ __html: city.description }} />
                        ) : (
                            <div className="space-y-2">
                                <p>
                                    {city.name} has emerged as one of India's most vibrant startup ecosystems, attracting entrepreneurs, investors, and talent from across the country and beyond. Known for its strong IT infrastructure, favorable government policies, and quality of life, the city has become a preferred destination for building technology companies.
                                </p>
                                <p>
                                    The city is home to over {(city.startupCount || 8500).toLocaleString()} startups spanning diverse sectors including SaaS, HealthTech, SpaceTech, FinTech, and Electric Vehicles. Major success stories like Darwinbox, Zenoti, and Skyroot Aerospace have put {city.name} on the global startup map, attracting significant venture capital investments and inspiring the next generation of founders.
                                </p>
                                <p>
                                    The startup ecosystem is supported by a robust network of incubators, accelerators, and co-working spaces. Government initiatives provide crucial support for early-stage ventures. The presence of top engineering colleges and research institutions ensures a steady pipeline of technical talent, while operational costs compared to other major hubs make it an attractive base for startups.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Explore Header */}
            <section className="container-wide py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-zinc-900 tracking-tight">
                    Explore Startups in {city.name}
                </h2>

                <div className="flex items-center gap-3">
                    <Select value="all">
                        <SelectTrigger className="w-[180px] h-11 rounded-xl bg-zinc-50 border-none text-[12px] font-bold text-zinc-500 shadow-sm">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                            <SelectItem value="all" className="text-[12px] font-medium py-2.5">All Categories</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={selectedStage} onValueChange={setSelectedStage}>
                        <SelectTrigger className="w-[180px] h-11 rounded-xl bg-zinc-50 border-none text-[12px] font-bold text-zinc-500 shadow-sm">
                            <SelectValue placeholder="All Stages" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                            <SelectItem value="all" className="text-[12px] font-medium py-2.5">All Stages</SelectItem>
                            <SelectItem value="Seed" className="text-[12px] font-medium py-2.5">Seed</SelectItem>
                            <SelectItem value="Series A" className="text-[12px] font-medium py-2.5">Series A</SelectItem>
                            <SelectItem value="Series B" className="text-[12px] font-medium py-2.5">Series B</SelectItem>
                            <SelectItem value="Unicorn" className="text-[12px] font-medium py-2.5">Unicorn</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>

            {/* Featured Startups Section */}
            <section className="container-wide py-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 font-serif">Featured Startups</h2>
                    <Link href="/startups" className="text-orange-600 font-black text-[10px] uppercase tracking-[0.15em] flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                        View all startups <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                {filteredStartups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStartups.slice(0, 6).map((startup) => (
                            <StartupCard key={startup.slug} {...startup} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border-2 border-dashed border-zinc-100">
                        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">No startups found in this category.</p>
                    </div>
                )}
            </section>

            {/* Latest Stories Section */}
            <section className="container-wide py-6 border-t border-zinc-50 mt-6">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-lg font-bold text-zinc-900 font-serif">Latest Stories from {city.name}</h2>
                    <Link href="/stories" className="text-orange-600 font-black text-[9px] uppercase tracking-[0.15em] flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                        View all stories <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cityStories.slice(0, 4).map((story) => (
                        <StoryCard key={story.slug} {...story} />
                    ))}
                    {cityStories.length === 0 && (
                        <div className="col-span-full py-12 text-center bg-zinc-50/50 rounded-2xl">
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Coming soon: Stories from {city.name}.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="container-wide py-8 bg-[#FDFDFD] border-y border-zinc-100/50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-serif">
                            {(city.startupCount || cityStartups.length || 0).toLocaleString()}+
                        </div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Active Startups</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-serif">
                            {(city.unicornCount || 0) > 0 ? city.unicornCount : '10'}+
                        </div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Unicorns & Soonicorns</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-serif">
                            $1.2B
                        </div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Total Funding (2025)</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-serif">
                            50+
                        </div>
                        <div className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Active Investors</div>
                    </div>
                </div>
            </section>

            {/* Other Hubs Section */}
            <section className="container-wide py-8">
                <h2 className="text-xl font-bold text-zinc-900 font-serif mb-8">Explore Other Startup Hubs</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {['Bengaluru', 'Delhi NCR', 'Pune', 'Chennai', 'Jaipur', 'Ahmedabad', 'Kolkata'].map((name) => (
                        <Link
                            key={name}
                            href={`/cities/${name.toLowerCase().replace(' ', '-')}`}
                            className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-xl text-center group hover:border-orange-200 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-orange-100/50 flex items-center justify-center mx-auto mb-3 text-orange-600">
                                <MapPin size={16} />
                            </div>
                            <h3 className="text-xs font-bold text-zinc-700">{name}</h3>
                            <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold tracking-widest">800+ startups</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Banner Section */}
            <section className="container-wide pb-8">
                <div className="bg-[#FFF5F1] rounded-3xl p-4 md:p-6 border border-orange-100/50 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif mb-3 tracking-tight">
                            Building a startup in {city.name}?
                        </h2>
                        <p className="text-zinc-600 text-base md:text-lg mb-8 leading-relaxed">
                            Get featured on StartupSaga and connect with investors, customers, and talent.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white font-bold">
                                Submit Your Startup
                            </Button>
                            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-transparent border-zinc-200 font-bold hover:bg-white">
                                Partner With Us
                            </Button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 -mr-20 -mt-20 rounded-full blur-3xl pointer-events-none" />
                </div>
            </section>
        </div>
    );
}

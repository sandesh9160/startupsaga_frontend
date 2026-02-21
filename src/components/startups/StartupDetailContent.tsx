"use client";

import Link from "next/link";
import Image from "next/image";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { Button } from "@/components/ui/button";
import {
    ExternalLink,
    MapPin,
    Tag,
    Calendar,
    TrendingUp,
    Users,
    ShieldCheck,
    Star,
    Linkedin,
    Share2,
    ChevronRight,
    CircleDashed,
    Layers,
    Pocket,
    Edit3,
    Folder,
    FolderKanban,
    BookOpen,
    List
} from "lucide-react";
import { getSafeImageSrc } from "@/lib/images";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface StartupDetailContentProps {
    startup: any;
    relatedStories: any[];
    similarStartups: any[];
}

export function StartupDetailContent({ startup, relatedStories, similarStartups }: StartupDetailContentProps) {
    const logoSrc = getSafeImageSrc(startup.logo || startup.og_image);
    const isSvgLogo = logoSrc.toLowerCase().endsWith(".svg");

    const founders = startup.founders_data && Array.isArray(startup.founders_data) ? startup.founders_data : (startup.founder_name ? [{
        name: startup.founder_name,
        role: "Founder",
        linkedin: startup.founder_linkedin,
        initials: startup.founder_name.split(' ').map((n: string) => n[0]).join('')
    }] : []);

    const handleShare = () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({
                title: startup.name,
                text: startup.tagline,
                url: window.location.href,
            }).catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
        }
    };

    const [tableOfContents, setTableOfContents] = useState<Array<{ id: number; title: string; anchor: string }>>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        if (startup.description && typeof startup.description === 'string') {
            // Attempt to generate TOC based on simple paragraphs or newlines as sections
            const paras = startup.description.split('\n\n').filter((p: string) => p.trim().length > 0);
            if (paras.length > 3) {
                setTableOfContents([
                    { id: 1, title: 'Introduction', anchor: 'introduction' },
                    { id: 2, title: 'The Journey', anchor: 'journey' }
                ]);
            }
        }
    }, [startup.description]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -70% 0px" }
        );

        tableOfContents.forEach((item: any) => {
            const el = document.getElementById(item.anchor);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [tableOfContents]);

    return (
        <div className="bg-[#FAFBFD] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-zinc-100 pt-8 pb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-50/20 to-transparent pointer-events-none" />
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
                        {/* Logo / Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-shrink-0"
                        >
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center p-6 overflow-hidden shadow-sm">
                                <Image
                                    src={logoSrc}
                                    alt={`${startup.name} logo`}
                                    width={128}
                                    height={128}
                                    className="object-contain w-full h-full"
                                    unoptimized={isSvgLogo}
                                />
                            </div>
                        </motion.div>

                        {/* Middle Content */}
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-tight pt-2">
                                    {startup.name}
                                </h1>
                                <p className="text-lg text-zinc-500 font-medium max-w-2xl">
                                    {startup.tagline}
                                </p>
                            </div>

                            {/* Badges Row */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="bg-orange-50/50 text-orange-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-orange-100 flex items-center gap-1.5 shadow-sm">
                                    <MapPin size={10} className="text-orange-400" />
                                    {startup.city}
                                </div>
                                <div className="bg-zinc-50 text-zinc-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-zinc-200 flex items-center gap-1.5 shadow-sm">
                                    <Tag size={10} className="text-zinc-400" />
                                    {startup.category}
                                </div>
                                <div className="bg-zinc-50 text-zinc-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-zinc-200 flex items-center gap-1.5 shadow-sm">
                                    <Calendar size={10} className="text-zinc-400" />
                                    Founded {startup.founded_year || '2021'}
                                </div>
                                <div className="bg-zinc-50 text-zinc-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-zinc-200 flex items-center gap-1.5 shadow-sm">
                                    <TrendingUp size={10} className="text-zinc-400" />
                                    {(startup as any).funding_stage ?? startup.stage ?? 'Seed'}
                                </div>
                                <div className="bg-emerald-50/50 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                    <Pocket size={10} className="text-emerald-400" />
                                    {(startup as any).business_model ?? startup.sector ?? 'B2B'}
                                </div>
                                <div className="bg-zinc-50 text-zinc-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border border-zinc-200 flex items-center gap-1.5 shadow-sm">
                                    <Users size={10} className="text-zinc-400" />
                                    {startup.team_size || '10-50'} members
                                </div>
                            </div>

                            {/* Founders Summary in Hero */}
                            {founders.length > 0 && (
                                <div className="flex items-center gap-3 py-2 border-y border-zinc-50">
                                    <div className="flex -space-x-1.5">
                                        {founders.map((founder: any, idx: number) => (
                                            <div key={idx} className="w-7 h-7 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center overflow-hidden" title={founder.name}>
                                                {founder.image ? (
                                                    <Image src={getSafeImageSrc(founder.image)} alt={founder.name} width={28} height={28} className="object-cover" />
                                                ) : (
                                                    <span className="text-[9px] font-bold text-zinc-400">{founder.initials || founder.name[0]}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-[11px]">
                                        <p className="font-bold text-zinc-900 leading-none mb-0.5">Founders</p>
                                        <p className="text-zinc-500 leading-none">{founders.map((f: any) => f.name).join(', ')}</p>
                                    </div>
                                    <div className="ml-4 pl-4 border-l border-zinc-200 text-[11px]">
                                        <p className="font-bold text-zinc-900 leading-none mb-0.5">Read Time</p>
                                        <p className="text-zinc-500 leading-none">3 min read</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-4">
                                {startup.website_url && (
                                    <Button asChild className="bg-[#FF5C00] hover:bg-[#E65300] text-white rounded-xl h-10 px-5 text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02] shadow-md shadow-orange-200">
                                        <a href={startup.website_url} target="_blank" rel="noopener noreferrer">
                                            Visit Website
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </Button>
                                )}
                                <Button variant="outline" size="icon" onClick={handleShare} className="h-10 w-10 rounded-xl border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Side Tools */}
                        <div className="flex flex-col gap-2 lg:items-end">
                            <Button variant="outline" className="rounded-xl border-zinc-200 text-zinc-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 h-10 px-4 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm">
                                <Edit3 className="h-3.5 w-3.5" />
                                Claim Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="container-wide py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: About */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* In-Body Table of Contents */}
                        {tableOfContents.length > 0 && (
                            <section className="bg-white rounded-2xl p-6 md:p-7 border border-zinc-100 shadow-sm mb-8">
                                <h2 className="text-lg font-serif font-bold text-zinc-900 mb-6 flex items-center gap-2 tracking-tight">
                                    <List className="h-5 w-5 text-orange-500" />
                                    Table of Contents
                                </h2>
                                <ul className="space-y-4">
                                    {tableOfContents.map((item: any, idx: number) => (
                                        <li key={item.id} className="flex items-start gap-3">
                                            <span className="text-orange-500 font-serif font-bold text-[15px] mt-px">{idx + 1}.</span>
                                            <a
                                                href={`#${item.anchor}`}
                                                className="text-zinc-600 hover:text-orange-600 font-medium font-serif text-[17px] transition-colors"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <div id="introduction" className="bg-white rounded-2xl border border-zinc-100 p-8 md:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] relative overflow-hidden">
                            {/* Subtle background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100/50">
                                    <BookOpen size={16} className="text-orange-600" />
                                </div>
                                <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">
                                    Journey Details
                                </h2>
                            </div>
                            <div id="journey" className="prose prose-zinc prose-sm md:prose-base max-w-none text-zinc-600 font-medium leading-relaxed relative z-10">
                                {startup.description?.split('\n\n').map((para: string, idx: number) => (
                                    <p key={idx} className="mb-4">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex flex-wrap items-center gap-3">
                            <Button variant="outline" size="sm" onClick={handleShare} className="h-10 rounded-xl bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 px-5 font-bold text-[11px] uppercase tracking-widest transition-all">
                                <Share2 className="h-3.5 w-3.5 mr-2" />
                                Copy Link
                            </Button>
                            <Button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                variant="outline" size="sm" className="h-10 rounded-xl bg-white border-zinc-200 text-[#0077B5] hover:bg-[#0077B5]/5 px-5 font-bold text-[11px] uppercase tracking-widest transition-all"
                            >
                                <Linkedin className="h-3.5 w-3.5 mr-2 fill-current" />
                                Share on LinkedIn
                            </Button>
                        </div>

                        {/* Section: News & Stories */}
                        {relatedStories.length > 0 && (
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-orange-500" />
                                        Stories & Updates
                                    </h3>
                                    <Link href="/stories" className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest transition-colors">View All</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedStories.map((story) => (
                                        <StoryCard key={story.slug} {...story} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Founders Card */}
                        {founders.length > 0 && (
                            <div className="bg-white rounded-2xl border border-zinc-100 p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-5">
                                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                    <Users size={14} className="text-orange-600" />
                                    Founders
                                </h3>
                                <div className="space-y-5">
                                    {founders.map((founder: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-100 overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-zinc-400 text-xs italic shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                    {founder.image ? (
                                                        <Image src={founder.image} alt={founder.name} fill className="object-cover" />
                                                    ) : (
                                                        founder.initials || founder.name[0]
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-sm text-zinc-900 truncate leading-tight">{founder.name}</h4>
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">{founder.role}</p>
                                                </div>
                                            </div>
                                            {founder.linkedin && (
                                                <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-[#0077B5] hover:scale-110 transition-transform opacity-60 hover:opacity-100">
                                                    <Linkedin size={16} className="fill-current" />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Stats Grid */}
                        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] pb-3 border-b border-zinc-50 flex items-center gap-2 relative z-10">
                                <Folder size={12} className="text-orange-600" />
                                Company Profile
                            </h3>
                            <div className="grid grid-cols-1 gap-4 relative z-10">
                                <div className="flex items-center gap-3 group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50 group-hover:bg-orange-100 transition-colors">
                                        <Calendar size={14} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Founded</p>
                                        <p className="text-[12px] font-bold text-zinc-900">{startup.founded_year || '2014'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100/50 group-hover:bg-blue-100 transition-colors">
                                        <TrendingUp size={14} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Funding Stage</p>
                                        <p className="text-[12px] font-bold text-zinc-900">{(startup as any).funding_stage ?? startup.stage ?? 'Bootstrapped'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100/50 group-hover:bg-purple-100 transition-colors">
                                        <Users size={14} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Team Size</p>
                                        <p className="text-[12px] font-bold text-zinc-900">{startup.team_size || '1000+'} Members</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 group transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:bg-emerald-100 transition-colors">
                                        <FolderKanban size={14} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-0.5">Business Model</p>
                                        <p className="text-[12px] font-bold text-zinc-900">{(startup as any).business_model ?? startup.sector ?? 'B2B'} • {startup.category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Discover Similar */}
                        {similarStartups.length > 0 && (
                            <div className="space-y-4 pt-4">
                                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layers className="h-3.5 w-3.5 text-zinc-300" />
                                    Similar Startups
                                </h3>
                                <div className="space-y-4">
                                    {similarStartups.slice(0, 3).map((s) => (
                                        <StartupCard key={s.slug} {...s} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}

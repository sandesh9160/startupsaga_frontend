"use client";

import Link from "next/link";
import Image from "next/image";
// import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import {
    ExternalLink,
    MapPin,
    Tag,
    TrendingUp,
    Linkedin,
    Share2,
    // Layers,
    Edit3,
    // BookOpen,
    List,
    ArrowRight,
    Sparkles,
    Lightbulb
} from "lucide-react";
import { getSafeImageSrc } from "@/lib/images";
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

    const founders: any[] =
        startup.founders_data && Array.isArray(startup.founders_data)
            ? startup.founders_data
            : startup.founder_name
                ? [{
                    name: startup.founder_name,
                    role: "Founder",
                    linkedin: startup.founder_linkedin,
                    initials: startup.founder_name.split(" ").map((n: string) => n[0]).join(""),
                }]
                : [];

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title: startup.name, text: startup.tagline, url: window.location.href })
                .catch(() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
        }
    };

    // Parse H2/H3 headings from HTML description for TOC
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: number; title: string; anchor: string }>>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        let toc: Array<{ id: number; title: string; anchor: string }> = [];

        if (startup.description && typeof startup.description === "string") {
            const headingRegex = /<(h2)[^>]*>([\s\S]*?)<\/\1>/gi;
            const matches = [...startup.description.matchAll(headingRegex)];
            if (matches.length > 0) {
                toc = matches.map((m, i) => {
                    const title = m[2].replace(/<[^>]*>/g, '').trim();
                    return {
                        id: i + 1,
                        title: title,
                        anchor: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
                    };
                }).filter(item => {
                    const ut = item.title.toUpperCase();
                    return ut !== 'TL;DR' && ut !== 'INTRODUCTION' && ut !== 'THE STARTUP JOURNEY' && ut !== 'OVERVIEW' && ut !== 'ABOUT';
                });
            }
        }

        setTableOfContents(toc);
    }, [startup.description]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
            { rootMargin: "-100px 0px -70% 0px" }
        );
        tableOfContents.forEach((item) => {
            const el = document.getElementById(item.anchor);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [tableOfContents]);

    const getDisplayName = (field: any, fallbackField: string) => {
        if (typeof field === "object" && field?.name) return field.name;
        if (startup[fallbackField]) return startup[fallbackField];
        if (typeof field === "string" && !/^\d+$/.test(field)) return field;
        return "";
    };

    const cityName = getDisplayName(startup.city, "city_name");
    const categoryName = getDisplayName(startup.category, "category_name");
    const foundersString = founders.map((f: any) => f.name).join(", ");

    const infoRows = [
        { label: "Founded", value: startup.founded_year },
        { label: "Employees", value: startup.team_size },
        { label: "Founders", value: foundersString },
    ].filter((r) => r.value);

    const websiteUrl = startup.website_url || (startup as any).website;
    const industryTags: string[] = (startup as any).industry_tags ?? [];
    const displayCategory = typeof startup.category === 'object' ? startup.category.name : (startup.category || 'this sector');

    return (
        <div className="bg-white min-h-screen font-sans pb-16">

            {/* ── Compact Hero Strip ── */}
            <div className="bg-white relative z-10 pt-8 pb-8">
                <div className="container-wide">
                    <div className="flex flex-col lg:flex-row items-start gap-7">

                        {/* Brand Info Wrapper */}
                        <div className="flex flex-col sm:flex-row items-start gap-6 flex-1 w-full">
                            {/* Logo */}
                            <div className="w-24 h-24 rounded-[20px] border border-zinc-100 bg-white flex items-center justify-center p-4 shadow-sm shrink-0 overflow-hidden">
                                <Image src={logoSrc} alt={startup.name} width={96} height={96}
                                    className="object-contain w-full h-full" unoptimized={isSvgLogo} />
                            </div>

                            {/* Name + badges + founders */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                    <h1 className="text-3xl md:text-5xl font-serif font-semibold text-zinc-900 tracking-tight leading-none">{startup.name}</h1>
                                    {cityName && (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm">
                                            <MapPin size={10} className="text-[#FF4F18]" strokeWidth={2.5} />{cityName}
                                        </span>
                                    )}
                                    {categoryName && (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm">
                                            <Tag size={10} className="text-[#FF4F18]" strokeWidth={2.5} />{categoryName}
                                        </span>
                                    )}
                                    {((startup as any).funding_stage ?? startup.stage) && (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm">
                                            <TrendingUp size={10} className="text-[#FF4F18]" strokeWidth={2.5} />{(startup as any).funding_stage ?? startup.stage}
                                        </span>
                                    )}
                                    {startup.founded_year && (
                                        <span className="text-[11px] font-medium text-zinc-400">Est. {startup.founded_year}</span>
                                    )}
                                </div>

                                {startup.tagline && (
                                    <p className="text-[15px] md:text-lg text-zinc-500 mt-3 leading-relaxed max-w-2xl font-normal">{startup.tagline}</p>
                                )}

                                {industryTags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {industryTags.map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-400 bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {founders.length > 0 && (
                                    <div className="flex items-center gap-3 mt-4 pt-1">
                                        <div className="flex -space-x-2">
                                            {founders.map((f: any, i: number) => (
                                                <div key={i} title={f.name}
                                                    className="w-7 h-7 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-600 overflow-hidden shadow-sm">
                                                    {f.image
                                                        ? <Image src={getSafeImageSrc(f.image)} alt={f.name} width={28} height={28} className="object-cover" />
                                                        : f.name?.[0]}
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[13px] font-semibold text-zinc-900">{founders.map((f: any) => f.name).join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2.5 w-full lg:w-auto mt-4 lg:mt-0 pt-6 lg:pt-0 border-t lg:border-none border-zinc-100">
                            {websiteUrl && (
                                <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#FF4F18] hover:bg-[#E54316] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-100 hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
                                    Visit Now <ExternalLink size={14} />
                                </a>
                            )}
                            <button onClick={handleShare}
                                className="h-11 w-11 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-[#FF4F18] hover:border-orange-100 transition-all shadow-sm">
                                <Share2 size={16} />
                            </button>
                            <button className="h-11 px-6 rounded-xl border border-zinc-200 bg-white flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:bg-zinc-50 transition-all shadow-sm uppercase tracking-wider">
                                <Edit3 size={14} /> Claim
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Grid ── */}
            <main className="container-wide py-7">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                    {/* Left — Content */}
                    <div className="lg:col-span-8 space-y-5">

                        {/* Table of Contents */}
                        {tableOfContents.length > 0 && (
                            <div className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm pb-5">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <List size={16} className="text-[#FF4F18]" />
                                    <h2 className="text-base font-serif font-bold text-[#0F172A] mb-0">Table of Contents</h2>
                                </div>
                                <nav>
                                    <ol className="flex flex-col gap-y-3">
                                        {tableOfContents.map((item, idx) => (
                                            <li key={item.anchor} className="flex items-start gap-2 group">
                                                <span className="text-[#FF4F18] font-medium text-[13px] shrink-0 font-serif">
                                                    {idx + 1}.
                                                </span>
                                                <a href={`#${item.anchor}`}
                                                    className={`text-[13px] font-medium leading-snug transition-all ${activeSection === item.anchor ? "text-[#FF4F18]" : "text-zinc-500 group-hover:text-[#FF4F18]"}`}>
                                                    {item.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            </div>
                        )}

                        {/* TL;DR Section */}
                        <div id="tldr" className="bg-[#FEF6F2] rounded-xl border border-orange-100 p-4 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Lightbulb className="h-16 w-16 text-[#D94111]" />
                            </div>
                            <div className="flex items-center gap-2 mb-2 relative z-10">
                                <Sparkles className="h-3.5 w-3.5 fill-[#FF4F18] text-[#FF4F18]" />
                                <h2 className="text-[16px] font-serif font-bold text-[#D94111] mb-0 tracking-tight">TL;DR</h2>
                            </div>
                            <div className="text-zinc-700 text-[13px] md:text-[14px] leading-relaxed font-normal relative z-10">
                                <p>
                                    {startup.tagline} As a leading {categoryName} player based in {cityName}, {startup.name} operates as an {startup.funding_stage || startup.stage} venture with a team of {startup.team_size} employees. Since its founding in {startup.founded_year}, the company has maintained a strong focus on {startup.business_model || startup.sector} solutions.
                                </p>
                            </div>
                        </div>

                        {/* About / Description (Journey) */}
                        <div id="introduction" className="bg-transparent p-0">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={14} className="text-indigo-600" />
                                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 font-serif">The Startup Journey</h2>
                            </div>
                            <div
                                id="journey"
                                className="prose prose-zinc max-w-none leading-relaxed
                                    prose-headings:font-semibold prose-headings:text-[#0F172A] prose-headings:tracking-tight
                                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:font-serif prose-h2:leading-[1.2]
                                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-serif
                                    prose-p:text-zinc-600 prose-p:mb-5 prose-p:text-[15px] prose-p:leading-relaxed prose-p:font-medium
                                    prose-strong:text-[#0F172A] prose-strong:font-semibold
                                    prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8"
                                dangerouslySetInnerHTML={{
                                    __html: (startup.description || "")
                                        .replace(
                                            /<(h[23])([^>]*)>([^<]*)<\/\1>/gi,
                                            (match: string, tag: string, attrs: string, content: string) => {
                                                const title = content.replace(/<[^>]*>/g, '').trim();
                                                const id = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                                                return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
                                            }
                                        )
                                }}
                            />
                        </div>

                        {/* Share actions */}
                        <div className="flex items-center gap-4">
                            <button onClick={handleShare}
                                className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-xl border border-zinc-100 bg-white text-[13px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                                className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-xl border border-zinc-100 bg-white text-[13px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm">
                                <Linkedin size={16} /> LinkedIn
                            </button>
                        </div>


                    </div>

                    {/* Right — Infobox */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-4">

                            {/* Main Info Card — Balanced Design */}
                            <div className="rounded-xl border border-zinc-100 overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 font-sans">

                                {/* Header - More compact */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-16 h-16 rounded-xl border border-zinc-100 bg-white shadow-inner flex items-center justify-center overflow-hidden shrink-0">
                                        <Image src={logoSrc} alt={startup.name} width={64} height={64}
                                            className="object-contain w-full h-full" unoptimized={isSvgLogo} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[20px] font-serif font-bold text-zinc-900 leading-tight tracking-tight">{startup.name}</p>
                                        {cityName && <p className="text-[14px] text-zinc-500 mt-1 font-medium">{cityName}</p>}
                                    </div>
                                </div>

                                {/* Divider & Info Rows - Increased verticality */}
                                <div className="space-y-4 pt-4 border-t border-zinc-100">
                                    <div className="space-y-3.5">
                                        {infoRows.map((row, i) => (
                                            <div key={i} className="flex items-start justify-between text-[14px]">
                                                <span className="text-zinc-500 font-medium">{row.label}</span>
                                                <span className="font-serif font-bold text-zinc-900 text-right max-w-[170px]">{String(row.value)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Industry Tags for Sidebar - Moved below info rows per reference */}
                                    {industryTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {industryTags.map((tag: string) => (
                                                <span key={tag} className="px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Button - Balanced height */}
                                    {websiteUrl && (
                                        <div className="pt-3">
                                            <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2.5 w-full h-12 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 text-zinc-900 text-[15px] font-bold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]">
                                                <ExternalLink size={18} />
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Similar Startups */}
                {similarStartups.length > 0 && (
                    <div id="similar-ventures" className="mt-16 pt-12 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-xl md:text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
                                    Discover Similar Startups
                                </h2>
                                <p className="text-zinc-500 text-sm font-medium">Explore more ventures in {displayCategory}.</p>
                            </div>
                            <Link href="/startups" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1">
                                View Directory <ArrowRight className="h-2.5 w-2.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {similarStartups.map((s) => (
                                <StartupCard key={s.slug} {...s} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

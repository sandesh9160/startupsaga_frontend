"use client";

import Link from "next/link";
import Image from "next/image";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import {
    ExternalLink,
    MapPin,
    Tag,
    TrendingUp,
    Linkedin,
    Share2,
    Layers,
    Edit3,
    BookOpen,
    List,
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
        if (startup.description && typeof startup.description === "string") {
            const headingRegex = /<(h[23])[^>]*>([^<]*)<\/\1>/gi;
            const matches = [...startup.description.matchAll(headingRegex)];
            if (matches.length > 0) {
                setTableOfContents([
                    { id: 0, title: "TL;DR", anchor: "tldr" },
                    ...matches.map((m, i) => ({
                        id: i + 1,
                        title: m[2].trim(),
                        anchor: `toc-${i}`,
                    }))
                ]);
            }
        }
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

    const infoRows = [
        { label: "Founded", value: startup.founded_year },
        { label: "Employees", value: startup.team_size },
        { label: "Stage", value: (startup as any).funding_stage ?? startup.stage },
        { label: "Model", value: (startup as any).business_model ?? startup.sector },
        { label: "Category", value: categoryName },
        { label: "City", value: cityName },
    ].filter((r) => r.value);

    const websiteUrl = startup.website_url || (startup as any).website;
    const industryTags: string[] = (startup as any).industry_tags ?? [];

    return (
        <div className="bg-[#F8F9FA] min-h-screen font-sans pb-16">

            {/* ── Compact Hero Strip ── */}
            <div className="bg-white border-b border-zinc-100 mt-6">
                <div className="container-wide py-6">
                    <div className="flex items-start gap-5">

                        {/* Logo */}
                        <div className="w-16 h-16 rounded-xl border border-zinc-200 bg-white flex items-center justify-center p-2 shadow-sm shrink-0 overflow-hidden">
                            <Image src={logoSrc} alt={startup.name} width={64} height={64}
                                className="object-contain w-full h-full" unoptimized={isSvgLogo} />
                        </div>

                        {/* Name + badges + founders */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-3xl font-black text-zinc-900 tracking-tight leading-none">{startup.name}</h1>
                                {cityName && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                                        <MapPin size={10} />{cityName}
                                    </span>
                                )}
                                {categoryName && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                        <Tag size={10} />{categoryName}
                                    </span>
                                )}
                                {((startup as any).funding_stage ?? startup.stage) && (
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                        <TrendingUp size={10} />{(startup as any).funding_stage ?? startup.stage}
                                    </span>
                                )}
                                {startup.founded_year && (
                                    <span className="text-[11px] font-medium text-zinc-400">Est. {startup.founded_year}</span>
                                )}
                            </div>

                            {startup.tagline && (
                                <p className="text-base text-zinc-500 mt-2 leading-snug max-w-2xl">{startup.tagline}</p>
                            )}

                            {founders.length > 0 && (
                                <div className="flex items-center gap-2 mt-3">
                                    <div className="flex -space-x-2">
                                        {founders.map((f: any, i: number) => (
                                            <div key={i} title={f.name}
                                                className="w-6 h-6 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[9px] font-bold text-white overflow-hidden shadow-sm">
                                                {f.image
                                                    ? <Image src={getSafeImageSrc(f.image)} alt={f.name} width={24} height={24} className="object-cover" />
                                                    : f.name?.[0]}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[13px] font-medium text-zinc-500">{founders.map((f: any) => f.name).join(", ")}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            {websiteUrl && (
                                <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[#FF5C00] hover:bg-[#E55300] text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-md shadow-orange-100">
                                    Visit <ExternalLink size={12} />
                                </a>
                            )}
                            <button onClick={handleShare}
                                className="h-10 w-10 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                                <Share2 size={15} />
                            </button>
                            <button className="h-10 px-4 rounded-lg border border-zinc-200 bg-white flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 hover:bg-zinc-50 transition-all shadow-sm">
                                <Edit3 size={13} /> Claim
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
                            <div className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <List size={13} className="text-indigo-600" />
                                    <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Table of Contents</h2>
                                </div>
                                <ol className="space-y-2">
                                    {tableOfContents.map((item, idx) => (
                                        <li key={item.id} className="flex items-start gap-2">
                                            <span className="text-indigo-600 font-bold text-xs w-4 shrink-0">{idx + 1}.</span>
                                            <a href={`#${item.anchor}`}
                                                className={`text-sm font-medium transition-colors ${activeSection === item.anchor ? "text-indigo-600" : "text-zinc-600 hover:text-indigo-600"}`}>
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {/* TL;DR Section */}
                        <div id="tldr" className="bg-[#FAF5FF] rounded-xl border border-purple-100 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Layers size={14} className="text-purple-600" />
                                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">TL;DR</h2>
                            </div>
                            <div className="text-zinc-700 text-sm leading-relaxed font-medium">
                                <p className="mb-2"><strong>Quick Take:</strong> {startup.tagline}</p>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span><strong>Impact:</strong> Leading {categoryName} player in {cityName}.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span><strong>Status:</strong> {startup.funding_stage || startup.stage} company with {startup.team_size} employees.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span><strong>DNA:</strong> {startup.business_model || startup.sector} focused, founded in {startup.founded_year}.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About / Description (Journey) */}
                        <div id="introduction" className="bg-white rounded-xl border border-zinc-100 p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={14} className="text-indigo-600" />
                                <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">The Startup Journey</h2>
                            </div>
                            <div
                                id="journey"
                                className="prose prose-zinc prose-sm max-w-none leading-relaxed
                                    prose-headings:font-bold prose-headings:text-zinc-900 prose-headings:tracking-tight
                                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:font-serif
                                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                                    prose-p:text-zinc-600 prose-p:mb-4 prose-p:text-base
                                    prose-strong:text-zinc-900"
                                dangerouslySetInnerHTML={{ __html: startup.description || "" }}
                            />
                        </div>

                        {/* Share actions */}
                        <div className="flex items-center gap-4">
                            <button onClick={handleShare}
                                className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-xl border border-indigo-100 bg-white text-[13px] font-bold text-indigo-600 hover:bg-indigo-50 transition-all shadow-md shadow-indigo-100/50">
                                <Share2 size={16} /> Share
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
                                className="inline-flex items-center justify-center gap-3 h-12 px-8 rounded-xl border border-[#0077B5]/20 bg-white text-[13px] font-bold text-[#0077B5] hover:bg-[#0077B5]/5 transition-all shadow-md shadow-blue-100/50">
                                <Linkedin size={16} className="fill-current" /> LinkedIn
                            </button>
                        </div>


                    </div>

                    {/* Right — Infobox */}
                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-4">

                            {/* Main Info Card */}
                            <div className="rounded-xl border border-indigo-100 overflow-hidden bg-white shadow-sm">

                                {/* Logo + Name + City */}
                                <div className="bg-gradient-to-r from-indigo-50 to-white flex items-center gap-3 p-4 border-b border-indigo-100">
                                    <div className="w-12 h-12 rounded-lg border border-white bg-white flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-sm">
                                        <Image src={logoSrc} alt={startup.name} width={48} height={48}
                                            className="object-contain w-full h-full" unoptimized={isSvgLogo} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-indigo-900 leading-tight truncate">{startup.name}</p>
                                        {cityName && <p className="text-xs text-indigo-400 mt-0.5 font-medium">{cityName}</p>}
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="divide-y divide-indigo-50/50 bg-indigo-50/20">
                                    {infoRows.map((row, i) => (
                                        <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-white transition-colors">
                                            <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider">{row.label}</span>
                                            <span className="text-[12px] font-semibold text-zinc-800">{String(row.value)}</span>
                                        </div>
                                    ))}

                                    {/* Founders */}
                                    {founders.length > 0 && (
                                        <div className="flex items-start justify-between px-4 py-2.5 gap-4 hover:bg-white transition-colors">
                                            <span className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider shrink-0">Founders</span>
                                            <span className="text-[12px] font-semibold text-zinc-800 text-right leading-snug">
                                                {founders.map((f: any) => f.name).join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Industry Tags */}
                                    {industryTags.length > 0 && (
                                        <div className="px-4 py-3 flex flex-wrap gap-1.5 bg-white/50">
                                            {industryTags.map((tag) => (
                                                <span key={tag} className="text-[10px] bg-white text-indigo-600 px-2.5 py-1 rounded-full font-bold border border-indigo-100 shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Visit Website */}
                                {websiteUrl && (
                                    <div className="px-4 py-3 border-t border-indigo-100 bg-white">
                                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all shadow-md shadow-indigo-100">
                                            <ExternalLink size={14} className="text-white/80" />
                                            Visit Website
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Similar Startups */}
                {similarStartups.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-zinc-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-black text-zinc-900 flex items-center gap-2 uppercase tracking-widest">
                                <Layers className="h-4 w-4 text-indigo-600" /> Recommended Startups
                            </h2>
                            <Link href="/startups" className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-widest">
                                View All Startups
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

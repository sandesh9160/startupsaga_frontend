"use client";

import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { CompanyInfoSidebar } from "@/components/stories/CompanyInfoSidebar";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Twitter,
    Linkedin,
    Link as LinkIcon,
    Share2,
    MapPin,
    Building2,
    Lightbulb,
    Layers,
    List,
    Clock,
    TrendingUp,
    Share
} from "lucide-react";
import { useState, useEffect } from "react";
import { getSafeImageSrc } from "@/lib/images";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StoryDetailContentProps {
    story: any;
    relatedStories: any[];
    cityStartups: any[];
}

export function StoryDetailContent({ story, relatedStories, cityStartups }: StoryDetailContentProps) {
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: number; title: string; anchor: string }>>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        if (story.sections && Array.isArray(story.sections) && story.sections.length > 0) {
            const toc = story.sections.map((section: any, idx: number) => ({
                id: idx + 1,
                title: section.title || section.heading || '',
                anchor: (section.title || section.heading || '').toLowerCase().replace(/\s+/g, '-')
            }));
            setTableOfContents(toc);
        } else if (story.content && typeof story.content === 'string') {
            // Support both h2 and h3 for TOC
            const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
            const matches = [...story.content.matchAll(headingRegex)];
            const toc = matches.map((match, idx) => {
                const title = match[1].replace(/<[^>]*>/g, '').trim();
                return {
                    id: idx + 1,
                    title,
                    anchor: title.toLowerCase().replace(/\s+/g, '-')
                };
            }).filter(item => item.title.length > 0);
            setTableOfContents(toc);
        }
    }, [story.content, story.sections]);

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

        tableOfContents.forEach((item) => {
            const el = document.getElementById(item.anchor);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [tableOfContents]);

    return (
        <article className="bg-[#FAFBFD] min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 pb-20">
            {/* Header / Hero Section */}
            <header className="bg-white pt-16 pb-12">
                <div className="container max-w-[1400px] mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 max-w-5xl lg:pl-10"
                    >
                        {/* Category Label */}
                        <div>
                            <span className="inline-flex items-center px-4 py-1.5 bg-[#F97316] text-white text-[11px] font-extrabold uppercase tracking-wide rounded-full shadow-sm">
                                {story.category || 'Funding'}
                            </span>
                        </div>

                        {/* Story Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-serif font-bold tracking-tight text-zinc-900 leading-[1.15] text-pretty">
                            {story.title}
                        </h1>

                        {/* Excerpt / Subheading */}
                        {story.excerpt && (
                            <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed font-medium max-w-4xl">
                                {story.excerpt}
                            </p>
                        )}

                        {/* Meta Detailed Row */}
                        <div className="flex flex-wrap items-center gap-y-5 gap-x-10 text-[13px] font-semibold text-zinc-500">
                            {story.city && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-orange-500" />
                                    <span>{story.city}</span>
                                </div>
                            )}
                            {story.category && (
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-orange-500" />
                                    <span>{story.category}</span>
                                </div>
                            )}
                            {story.related_startup?.founded_year && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    <span>Founded {story.related_startup.founded_year}</span>
                                </div>
                            )}
                            {story.stage && (
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    <span>{story.stage}</span>
                                </div>
                            )}
                            {story.read_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    <span>{story.read_time} min read</span>
                                </div>
                            )}
                        </div>

                        {/* Author & Status */}
                        <div className="pt-2 flex items-center gap-4">
                            <p className="text-sm font-extrabold text-zinc-900">
                                By {story.author || 'Priya Sharma'}
                                <span className="text-zinc-400 font-semibold ml-4">{story.publishDate || 'Feb 4, 2026'}</span>
                            </p>
                        </div>

                        {/* Share Links */}
                        <div className="flex items-center gap-4 pt-2">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Share:</span>
                            <div className="flex gap-2">
                                <button className="h-10 w-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-orange-600 transition-all shadow-sm">
                                    <Linkedin className="h-4.5 w-4.5" />
                                </button>
                                <button className="h-10 w-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-orange-600 transition-all shadow-sm">
                                    <Twitter className="h-4.5 w-4.5" />
                                </button>
                                <button className="h-10 w-10 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 hover:text-orange-600 transition-all shadow-sm">
                                    <Share2 className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container max-w-[1400px] mx-auto py-4 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">

                    {/* Left Column: Story Content */}
                    <div className="lg:col-span-8 space-y-8 lg:pl-10">
                        {/* Featured Image */}
                        {(story.thumbnail || story.og_image) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden bg-zinc-100 shadow-xl shadow-zinc-200/50"
                            >
                                <img
                                    src={getSafeImageSrc(story.thumbnail || story.og_image)}
                                    alt={story.image_alt || story.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        )}

                        {/* TL;DR / Summary */}
                        {story.excerpt && (
                            <section className="bg-[#FEF6F2] rounded-2xl p-6 md:p-7 border border-orange-100/50 shadow-sm relative overflow-hidden">
                                <h2 className="text-sm font-bold text-[#D94111] mb-4 flex items-center gap-2 tracking-tight">
                                    <Lightbulb className="h-4 w-4 fill-[#D94111]" />
                                    TL;DR
                                </h2>
                                <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
                                    {story.excerpt}
                                </p>
                            </section>
                        )}

                        {/* In-Body Table of Contents */}
                        {tableOfContents.length > 0 && story.show_table_of_contents !== false && (
                            <section className="bg-white rounded-2xl p-6 md:p-7 border border-zinc-100 shadow-sm">
                                <h2 className="text-lg font-serif font-bold text-zinc-900 mb-6 flex items-center gap-2 tracking-tight">
                                    <List className="h-5 w-5 text-orange-500" />
                                    Table of Contents
                                </h2>
                                <ul className="space-y-4">
                                    {tableOfContents.map((item, idx) => (
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

                        {/* Narrative Content */}
                        <section className="prose prose-zinc prose-lg max-w-none 
                            prose-headings:font-serif prose-headings:font-bold prose-headings:text-zinc-900 prose-headings:tracking-tight
                            prose-h2:text-3xl md:prose-h2:text-[2.2rem] prose-h2:mt-16 prose-h2:mb-8 prose-h2:scroll-mt-24
                            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                            prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:mb-10 prose-p:font-normal prose-p:text-[1.1rem]
                            prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-zinc-900 prose-strong:font-bold
                            prose-ul:my-10 prose-li:text-zinc-600 prose-li:mb-2
                            prose-img:rounded-[2rem] prose-img:my-16 prose-img:border prose-img:border-zinc-100 shadow-lg shadow-zinc-200/50"
                        >
                            {story.content ? (
                                <div dangerouslySetInnerHTML={{
                                    __html: story.content.replace(
                                        /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
                                        (match: string, tag: string, attrs: string, content: string) => {
                                            const title = content.replace(/<[^>]*>/g, '').trim();
                                            const id = title.toLowerCase().replace(/\s+/g, '-');
                                            return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
                                        }
                                    )
                                }} />
                            ) : (
                                <div className="bg-zinc-50 rounded-2xl p-16 text-center border border-dashed border-zinc-200">
                                    <p className="text-zinc-400 text-sm font-medium">This narrative is being detailed by our editors.</p>
                                </div>
                            )}
                        </section>

                        {/* Actions */}
                        <div className="pt-10 border-t border-zinc-100 flex flex-wrap items-center gap-3">
                            <Button variant="outline" size="sm" className="h-10 rounded-xl bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 px-5 font-bold text-[11px] uppercase tracking-widest transition-all">
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
                    </div>

                    {/* Right Column: Sidebar */}
                    <aside className="lg:col-span-4 space-y-10">
                        {story.related_startup && (
                            <div className="sticky top-24">
                                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5 text-zinc-300" />
                                    Profile Focus
                                </h2>
                                <CompanyInfoSidebar
                                    company={{
                                        name: story.related_startup?.name || 'Company',
                                        logo: getSafeImageSrc(story.related_startup?.logo),
                                        city: story.related_startup?.city || story.city,
                                        founded: story.related_startup?.founded_year,
                                        employees: story.related_startup?.team_size,
                                        founders: story.related_startup?.founders_data?.map((f: any) => f.name),
                                        categories: story.related_startup?.category ? [story.related_startup.category] : (story.category ? [story.category] : []),
                                        website: story.related_startup?.website_url,
                                        slug: story.related_startup?.slug,
                                    }}
                                />
                            </div>
                        )}

                        {/* City Context if no startup focus */}
                        {!story.related_startup && cityStartups.length > 0 && (
                            <div className="sticky top-24 space-y-6">
                                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Layers className="h-3.5 w-3.5 text-zinc-300" />
                                    Local Ecosystem
                                </h2>
                                <div className="space-y-3">
                                    {cityStartups.slice(0, 3).map((startup) => (
                                        <Link
                                            key={startup.slug}
                                            href={`/startups/${startup.slug}`}
                                            className="block p-4 bg-white rounded-2xl border border-zinc-100 hover:shadow-lg hover:shadow-zinc-200/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-50 border border-zinc-100 p-1.5 flex flex-shrink-0 items-center justify-center">
                                                    {startup.logo ? (
                                                        <img src={startup.logo} alt={startup.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Building2 className="h-4 w-4 text-zinc-200" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-xs text-zinc-900 group-hover:text-orange-600 transition-colors truncate">{startup.name}</h4>
                                                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest mt-0.5">{startup.category}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            {/* Recommendations Section */}
            {relatedStories.length > 0 && (
                <section className="bg-white border-t border-zinc-100 py-24">
                    <div className="container max-w-7xl mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">Expand Your Horizon</h2>
                                <p className="text-zinc-500 font-medium text-lg">More analysis from the {story.category} sector.</p>
                            </div>
                            <Button asChild variant="ghost" className="text-[10px] font-bold uppercase tracking-widest gap-2 h-11 px-6 rounded-xl border border-zinc-100 hover:bg-zinc-50">
                                <Link href="/stories">
                                    All Stories
                                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {relatedStories.map((s) => (
                                <StoryCard key={s.slug} {...s} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}

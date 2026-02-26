"use client";

import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { StartupCard } from "@/components/cards/StartupCard";
import { CompanyInfoSidebar } from "@/components/stories/CompanyInfoSidebar";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Calendar,
    Link as LinkIcon,
    Share2,
    MapPin,
    Lightbulb,
    List,
    Clock,
    TrendingUp,
    Linkedin,
    Twitter,
    Facebook,
    Tag,
    User,
    Sparkles,
    MessageCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getSafeImageSrc } from "@/lib/images";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/api";
import dynamic from "next/dynamic";
import { Story, Startup } from "@/types";
import Image from "next/image";
interface StoryDetailContentProps {
    story: Story;
    relatedStories: Story[];
    categoryStartups: Startup[];
}

export function StoryDetailContent({ story, relatedStories, categoryStartups }: StoryDetailContentProps) {
    const [tableOfContents, setTableOfContents] = useState<Array<{ id: number; title: string; anchor: string }>>([]);
    const [activeSection, setActiveSection] = useState<string>("");

    const handleShare = () => {
        const shareTitle = story.meta_title || story.title;
        const shareText = story.meta_description || story.excerpt || "";
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
                .catch(() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success("Link copied!");
                });
        } else {
            navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied!");
        }
    };

    useEffect(() => {
        let toc: Array<{ id: number; title: string; anchor: string }> = [];

        if (story.sections && Array.isArray(story.sections) && story.sections.length > 0) {
            const sectionToc = story.sections.map((section: { title?: string; heading?: string }, idx: number) => ({
                id: idx + 1,
                title: section.title || section.heading || '',
                anchor: (section.title || section.heading || '').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
            }));
            toc = [...toc, ...sectionToc];
        } else if (story.content && typeof story.content === 'string') {
            const headingRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
            const matches = [...story.content.matchAll(headingRegex)];
            const contentToc = matches.map((match, idx) => {
                const title = match[1].replace(/<[^>]*>/g, '').trim();
                return {
                    id: idx + 1,
                    title,
                    anchor: title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
                };
            }).filter(item => item.title.length > 0);
            toc = [...toc, ...contentToc];
        }
        setTableOfContents(toc);
    }, [story.content, story.excerpt, story.sections]);

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
        <article className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 pb-12">
            {/* Header / Hero Section */}
            <header className="bg-white pt-10 pb-8">
                <div className="container-wide">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 max-w-5xl"
                    >
                        {/* Category Label */}
                        <div className="mb-2">
                            <span className="inline-flex items-center px-2.5 py-1 bg-[#FF4F18] text-white text-[10px] font-bold uppercase tracking-wider rounded-md">
                                {story.category || 'Funding'}
                            </span>
                        </div>

                        {/* Story Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-[56px] font-serif font-semibold tracking-tight text-[#0F172A] leading-[1.05] max-w-5xl">
                            {story.title}
                        </h1>

                        {/* Excerpt / Subheading */}
                        {story.excerpt && (
                            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-4xl font-normal">
                                {story.excerpt}
                            </p>
                        )}

                        {/* Meta Detailed Row */}
                        <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-[13px] font-medium text-zinc-400 pt-2">
                            {story.city && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-[#FF4F18]" />
                                    <span>{story.city}</span>
                                </div>
                            )}
                            {story.category && (
                                <div className="flex items-center gap-1.5">
                                    <Tag className="h-4 w-4 text-[#FF4F18]" />
                                    <span>{story.category}</span>
                                </div>
                            )}
                            {story.related_startup?.founded_year && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-[#FF4F18]" />
                                    <span>Founded {story.related_startup.founded_year}</span>
                                </div>
                            )}
                            {story.stage && (
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4 text-[#FF4F18]" />
                                    <span>{story.stage}</span>
                                </div>
                            )}
                            {story.read_time && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-[#FF4F18]" />
                                    <span>{story.read_time} min read</span>
                                </div>
                            )}
                        </div>

                        {/* Author & Status */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-[#FF4F18]" />
                                <span className="text-[15px] font-semibold text-zinc-900">By {story.author_name || story.author || 'Priya Sharma'}</span>
                            </div>
                            <span className="text-zinc-400 text-sm font-medium">{story.publishDate || story.publish_date || 'Feb 4, 2026'}</span>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <span className="text-[13px] font-medium text-zinc-500">Share:</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                                    className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-orange-600 hover:border-orange-200 transition-all bg-white shadow-sm"
                                    title="Share on LinkedIn"
                                >
                                    <Linkedin className="h-[18px] w-[18px]" />
                                </button>
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(story.meta_title || story.title || '')}`, '_blank')}
                                    className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-orange-600 hover:border-orange-200 transition-all bg-white shadow-sm"
                                    title="Share on Twitter"
                                >
                                    <Twitter className="h-[18px] w-[18px]" />
                                </button>
                                <button
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                                    className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-orange-600 hover:border-orange-200 transition-all bg-white shadow-sm"
                                    title="Share on Facebook"
                                >
                                    <Facebook className="h-[18px] w-[18px]" />
                                </button>
                                <button
                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${story.title} - ${story.excerpt || ''} ${window.location.href}`)}`, '_blank')}
                                    className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-green-600 hover:border-green-200 transition-all bg-white shadow-sm"
                                    title="Share on WhatsApp"
                                >
                                    <MessageCircle className="h-[18px] w-[18px]" />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-orange-600 hover:border-orange-200 transition-all bg-white shadow-sm"
                                    title="More Options"
                                >
                                    <Share2 className="h-[18px] w-[18px]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container-wide py-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14">

                    {/* Left Column: Story Content */}
                    <div className={cn(
                        "space-y-8 max-w-4xl",
                        story.related_startup ? "lg:col-span-8" : "lg:col-span-12"
                    )}>
                        {/* Featured Image */}
                        {(story.thumbnail || story.og_image) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-lg shadow-zinc-200/50"
                            >
                                <Image
                                    src={getSafeImageSrc(story.thumbnail || story.og_image)}
                                    alt={story.image_alt || story.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </motion.div>
                        )}


                        {/* TL;DR / Summary */}
                        {story.excerpt && (
                            <section id="tldr" className="bg-[#FEF6F2] rounded-xl p-4 border border-orange-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Lightbulb className="h-16 w-16 text-[#D94111]" />
                                </div>
                                <h2 className="text-[16px] font-serif font-bold text-[#D94111] mb-2 flex items-center gap-2 tracking-tight relative z-10">
                                    <Sparkles className="h-3.5 w-3.5 fill-[#FF4F18] text-[#FF4F18]" />
                                    TL;DR
                                </h2>
                                <p className="text-zinc-700 text-[13px] md:text-[14px] leading-relaxed font-normal relative z-10">
                                    {story.excerpt}
                                </p>
                            </section>
                        )}

                        {/* In-Body Table of Contents */}
                        {tableOfContents.length > 0 && story.show_table_of_contents !== false && (
                            <div className="bg-white rounded-xl border border-zinc-100 p-4 shadow-sm">
                                <div className="flex items-center gap-2.5 mb-4">
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

                        {/* Narrative Content */}
                        <section className="prose prose-zinc max-w-none leading-relaxed
                            prose-headings:font-semibold prose-headings:text-[#0F172A] prose-headings:tracking-tight
                            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:font-serif prose-h2:leading-[1.4]
                            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h3:font-serif
                            prose-p:text-zinc-600 prose-p:mb-5 prose-p:text-[15px] prose-p:leading-relaxed prose-p:font-medium
                            prose-strong:text-[#0F172A] prose-strong:font-semibold
                            prose-img:rounded-xl prose-img:shadow-sm prose-img:my-8
                            prose-table:text-[13px] prose-table:border-collapse prose-th:bg-zinc-50 prose-th:border prose-th:border-zinc-200 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-zinc-200 prose-td:px-3 prose-td:py-2">
                            {story.content ? (
                                <div dangerouslySetInnerHTML={{
                                    __html: story.content
                                        // .replace(
                                        //     /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
                                        //     (match: string, tag: string, attrs: string, content: string) => {
                                        //         const title = content.replace(/<[^>]*>/g, '').trim();
                                        //         const id = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                                        //         return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
                                        //     }
                                        // )
                                        .replace(
                                            /<img([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi,
                                            (match: string, p1: string, p2: string, p3: string) => {
                                                return `<img${p1}src="${getSafeImageSrc(p2)}"${p3}>`;
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
                        {/* Share actions - Card Style per reference */}
                        <div className="mt-16 p-8 bg-white rounded-2xl border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <p className="text-[14px] text-zinc-500 mb-6 font-medium">Enjoyed this story? Share this journey with your network.</p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-8 h-12 bg-white border border-zinc-200 rounded-xl text-zinc-900 font-bold hover:bg-zinc-50 transition-all shadow-sm group"
                                >
                                    <Linkedin className="h-5 w-5 text-[#0077B5]" />
                                    LinkedIn
                                </button>
                                <button
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(story.meta_title || story.title || '')}`, '_blank')}
                                    className="inline-flex items-center gap-3 px-8 h-12 bg-white border border-zinc-200 rounded-xl text-zinc-900 font-bold hover:bg-zinc-50 transition-all shadow-sm group"
                                >
                                    <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                                    Twitter
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar (if related startup) */}
                    {story.related_startup && (
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24">
                                <CompanyInfoSidebar
                                    company={{
                                        name: story.related_startup.name,
                                        logo: getSafeImageSrc(story.related_startup.logo),
                                        city: story.related_startup.city,
                                        founded: story.related_startup.founded_year,
                                        employees: story.related_startup.team_size,
                                        founders: story.related_startup.founders_data?.map((f: { name?: string }) => f.name || "") || [],
                                        categories: ([story.related_startup.category] as string[]).filter(Boolean),
                                        website: story.related_startup.website_url,
                                        slug: story.related_startup.slug,
                                        stage: story.related_startup.funding_stage || story.related_startup.stage,
                                        sector: story.related_startup.category_name || story.related_startup.category
                                    }}
                                />

                                {/* Quick TOC Sidebar for desktop */}
                                {tableOfContents.length > 0 && (
                                    <div className="mt-8 p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hidden lg:block">
                                        <div className="flex items-center gap-2 mb-4 text-indigo-600">
                                            <List className="h-4 w-4" />
                                            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 font-serif">
                                                On this page
                                            </h3>
                                        </div>
                                        <nav className="flex flex-col gap-3">
                                            {tableOfContents.map((item) => (
                                                <a
                                                    key={item.id}
                                                    href={`#${item.anchor}`}
                                                    className={cn(
                                                        "text-sm font-medium transition-colors hover:text-indigo-600",
                                                        activeSection === item.anchor ? "text-indigo-600" : "text-zinc-500"
                                                    )}
                                                >
                                                    {item.title}
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Recommendations Section */}
            {
                (relatedStories.length > 0 || categoryStartups.length > 0) && (
                    <section className="bg-transparent border-t border-zinc-100 py-16 md:py-20">
                        <div className="container-wide space-y-20">

                            {/* Related Stories */}
                            {relatedStories.length > 0 && (
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#0F172A] tracking-tight font-serif">Explore Related Stories</h2>
                                            <p className="text-zinc-500 font-medium text-lg">More insights from the {story.category} ecosystem.</p>
                                        </div>
                                        <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-wider gap-2 h-11 px-6 rounded-xl border border-zinc-100 hover:bg-zinc-50 w-fit">
                                            <Link href="/stories">
                                                All Stories
                                                <ArrowLeft className="h-4 w-4 rotate-180" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {relatedStories.map((s) => (
                                            <StoryCard
                                                key={s.slug}
                                                slug={s.slug}
                                                title={s.title}
                                                excerpt={s.excerpt}
                                                thumbnail={s.thumbnail}
                                                og_image={s.og_image}
                                                category={s.category}
                                                categorySlug={s.category_slug}
                                                city={s.city}
                                                citySlug={s.city_slug}
                                                publishDate={s.publishDate || s.publish_date}
                                                author_name={s.author_name || s.author}
                                                read_time={s.read_time}
                                                featured={false}
                                                isFeatured={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Category Startups */}
                            {categoryStartups.length > 0 && (
                                <div className="space-y-10">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 border-t border-zinc-50">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight font-serif">Companies in this Sector</h2>
                                            <p className="text-zinc-500 font-medium text-lg">Explore ventures shaping the future of {story.category}.</p>
                                        </div>
                                        <Button asChild variant="ghost" className="text-xs font-bold uppercase tracking-wider gap-2 h-11 px-6 rounded-xl border border-zinc-100 hover:bg-zinc-50 w-fit">
                                            <Link href="/startups">
                                                Manage Directory
                                                <ArrowLeft className="h-4 w-4 rotate-180" />
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {categoryStartups.map((s) => (
                                            <StartupCard key={s.slug} {...s} />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </section>
                )
            }
        </article >
    );
}

import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface StoriesGridSectionProps {
    id?: string;
    index: number;
    title?: string;
    type: 'latest_stories' | 'featured_stories' | 'trending_stories';
    stories: any[];
    trendingStories?: any[];
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

export function StoriesGridSection({
    id,
    index,
    title,
    type,
    stories = [],
    trendingStories = [],
    settings = {}
}: StoriesGridSectionProps) {
    const bgColor = settings.backgroundColor || '#ffffffae';
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 64;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

    const sectionTitle = title || (
        type === 'trending_stories' ? "Most Read Across India" :
            type === 'latest_stories' ? "Latest Stories" :
                "Featured Stories"
    );

    const isLatest = type === 'latest_stories';
    const hasSidebar = isLatest && trendingStories.length > 0;

    return (
        <section
            key={id || index}
            className="mb-0 overflow-hidden"
            style={{
                backgroundColor: bgColor.startsWith('#') ? bgColor : '#' + bgColor,
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX
            }}
        >
            <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className={cn(hasSidebar ? "lg:col-span-8" : "lg:col-span-12")}>
                        <div className={cn(
                            "flex items-baseline justify-between mb-8",
                            align === 'left' ? 'flex-row' : align === 'right' ? 'flex-row-reverse' : 'flex-row'
                        )}>
                            <h2
                                className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif tracking-tight"
                                style={{
                                    color: textColor.startsWith('#') ? textColor : '#' + textColor,
                                    textAlign: align as any
                                }}
                            >
                                {sectionTitle}
                            </h2>
                            <Link href="/stories" className="text-orange-600 font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all group">
                                View all <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className={cn(
                            "grid gap-8",
                            hasSidebar ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        )}>
                            {stories.slice(0, hasSidebar ? 6 : 8).map((story, idx: number) => (
                                <StoryCard
                                    key={story.slug}
                                    {...story}
                                    variant="standard"
                                    priority={index < 1 && idx < 4}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    {hasSidebar && (
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm">
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
                                                    {story.category?.name || "Startup"}
                                                </div>
                                                <h3 className="text-[15px] font-bold font-serif leading-snug line-clamp-2 text-[#0F172A] group-hover:text-orange-600 transition-colors">
                                                    {story.title}
                                                </h3>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-zinc-100">
                                    <Link href="/stories?sort=trending">
                                        <Button variant="outline" className="w-full rounded-2xl h-12 font-bold text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-[#0F172A] transition-all">
                                            View Full List
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>
        </section>
    );
}

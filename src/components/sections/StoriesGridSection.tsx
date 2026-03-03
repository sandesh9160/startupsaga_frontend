import Link from "next/link";
import { StoryCard } from "@/components/cards/StoryCard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoriesGridSectionProps {
    id?: string;
    index: number;
    title?: string;
    type: 'latest_stories' | 'featured_stories' | 'trending_stories';
    stories: any[];
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
    settings = {}
}: StoriesGridSectionProps) {
    const bgColor = settings.backgroundColor || '#ffffffae';
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

    const sectionTitle = title || (
        type === 'trending_stories' ? "Most Read Across India" :
            type === 'latest_stories' ? "Latest Stories" :
                "Featured Stories"
    );

    return (
        <section
            key={id || index}
            className="mb-0"
            style={{
                backgroundColor: bgColor.startsWith('#') ? bgColor : '#' + bgColor,
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX
            }}
        >
            <div className="container-wide">
                <div className={cn(
                    "flex items-baseline justify-between mb-10",
                    align === 'left' ? 'flex-row' : align === 'right' ? 'flex-row-reverse' : 'flex-row'
                )}>
                    <h2
                        className="text-xl md:text-2xl lg:text-[1.75rem] font-semibold font-serif"
                        style={{
                            color: textColor.startsWith('#') ? textColor : '#' + textColor,
                            textAlign: align as any
                        }}
                    >
                        {sectionTitle}
                    </h2>
                    <Link href="/stories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        View all <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stories.slice(0, 4).map((story, idx) => (
                        <StoryCard
                            key={story.slug}
                            {...story}
                            priority={index < 1 && idx < 4}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";

interface CategoryGridSectionProps {
    id?: string;
    index: number;
    title?: string;
    categories: any[];
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

export function CategoryGridSection({
    id,
    index,
    title,
    categories = [],
    settings = {}
}: CategoryGridSectionProps) {
    const bgColor = settings.backgroundColor || '#ffffffae';
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

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
                        {title || "Top Categories"}
                    </h2>
                    <Link href="/categories" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        All categories <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {categories.slice(0, 14).map((category: any) => (
                        <CategoryCard
                            key={category.slug || category.id}
                            slug={category.slug || (category.title || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}
                            name={category.name || category.title}
                            iconName={category.iconName || category.icon || "help-circle"}
                            startupCount={category.startup_count || category.startupCount || 0}
                            storyCount={category.story_count || category.storyCount || 0}
                            description={category.description || ""}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

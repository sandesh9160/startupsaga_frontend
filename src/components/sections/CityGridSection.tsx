import Link from "next/link";
import { CityCard } from "@/components/cards/CityCard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityGridSectionProps {
    id?: string;
    index: number;
    title?: string;
    subtitle?: string;
    type: 'city_grid' | 'rising_hubs';
    cities: any[];
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

export function CityGridSection({
    id,
    index,
    title,
    subtitle,
    type,
    cities = [],
    settings = {}
}: CityGridSectionProps) {
    const bgColor = settings.backgroundColor || (type === 'rising_hubs' ? '#fdfdfd' : '#FFFFFF');
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

    const isRising = type === 'rising_hubs';
    const sectionTitle = title || (isRising ? "Rising Startup Hubs" : "Explore by City");
    const sectionSubtitle = subtitle || (isRising ? "Tier 2 & Tier 3 cities driving India's startup growth" : "");

    // Logic from HomeContent for filtering cities
    const items = isRising
        ? cities.filter((c: any) => String(c.tier).includes('2') || String(c.tier).includes('3')).slice(0, 12)
        : cities.filter((c: any) => !c.tier || String(c.tier) === '1').slice(0, 6);

    return (
        <section
            key={id || index}
            className={cn(
                "w-full mb-0 border-b border-zinc-300",
                isRising && "bg-[#fdfdfd]"
            )}
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
                    isRising ? "flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10" : "flex items-baseline justify-between mb-10",
                    align === 'left' ? '' : align === 'right' ? 'lg:flex-row-reverse' : ''
                )}>
                    <div className={cn(
                        isRising && "max-w-3xl",
                        align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center mx-auto'
                    )}>
                        <h2
                            className={cn(
                                "text-xl md:text-2xl font-semibold font-serif",
                                isRising ? "lg:text-[2rem] mb-2 tracking-tight leading-tight" : "lg:text-[1.75rem]"
                            )}
                            style={{ color: textColor.startsWith('#') ? textColor : '#' + textColor }}
                        >
                            {sectionTitle}
                        </h2>
                        {sectionSubtitle && <p className="text-zinc-500 text-lg">{sectionSubtitle}</p>}
                    </div>
                    <Link href="/cities" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        {isRising ? "View all rising hubs" : "All cities"} <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className={cn(
                    "grid gap-6",
                    isRising ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                )}>
                    {items.map((city: any) => {
                        const citySlug = city.slug || (city.title || city.name || "").toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
                        return (
                            <CityCard
                                key={city.slug || city.id || citySlug}
                                slug={citySlug}
                                name={city.name || city.title}
                                image={city.image || city.imageUrl || city.thumbnail}
                                startupCount={city.startup_count || city.startupCount || 0}
                                storyCount={city.story_count || city.storyCount || 0}
                                tier={city.tier}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

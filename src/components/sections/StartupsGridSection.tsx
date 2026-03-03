import Link from "next/link";
import { StartupCard } from "@/components/cards/StartupCard";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartupsGridSectionProps {
    id?: string;
    index: number;
    title?: string;
    startups: any[];
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

export function StartupsGridSection({
    id,
    index,
    title,
    startups = [],
    settings = {}
}: StartupsGridSectionProps) {
    const bgColor = settings.backgroundColor || '#ffffffae';
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

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
                        {title || "Featured Startups"}
                    </h2>
                    <Link href="/startups" className="text-[#D94111] font-bold text-sm tracking-tight flex items-center gap-1.5 hover:gap-2 transition-all">
                        View all startups <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {startups.slice(0, 8).map((startup, idx: number) => (
                        <StartupCard
                            key={startup.slug || startup.id}
                            {...startup}
                            priority={index < 1 && idx < 4}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

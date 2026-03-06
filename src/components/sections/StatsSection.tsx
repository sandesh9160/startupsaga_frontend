import { MapPin, Building2, Sparkles, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsSectionProps {
    id?: string;
    index: number;
    title?: string;
    stats: {
        total_startups?: number;
        total_stories?: number;
        total_unicorns?: number;
    };
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
    };
}

export function StatsSection({
    id,
    index,
    stats,
    settings = {}
}: StatsSectionProps) {
    const bgColor = settings.backgroundColor || '#F2542D';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 64;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'center';

    const statItems = [
        { label: "Total Startups", value: stats.total_startups || 3160, icon: Building2 },
        { label: "Success Stories", value: stats.total_stories || 861, icon: Sparkles },
        { label: "Active Cities", value: 25, icon: MapPin },
        { label: "Industry Categories", value: 18, icon: Store },
    ];

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {statItems.map((item, i) => (
                        <div key={i} className={cn(
                            "flex flex-col items-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15",
                            align === 'left' ? 'items-start' : align === 'right' ? 'items-end' : 'items-center'
                        )}>
                            <item.icon className="h-8 w-8 text-white/50 mb-4" />
                            <span className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {item.value.toLocaleString()}+
                            </span>
                            <span className="text-white/70 font-medium uppercase tracking-widest text-[11px]">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

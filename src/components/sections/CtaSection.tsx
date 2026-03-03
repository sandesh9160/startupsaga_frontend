import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
    id?: string;
    index: number;
    title?: string;
    subtitle?: string;
    description?: string;
    link_text?: string;
    link_url?: string;
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
        secondaryButtonText?: string;
        secondaryButtonLink?: string;
    };
}

export function CtaSection({
    id,
    index,
    title,
    subtitle,
    description,
    link_text,
    link_url,
    settings = {}
}: CtaSectionProps) {
    const bgColor = settings.backgroundColor || '#0F172A';
    const textColor = settings.textColor || '#FFFFFF';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'center';

    return (
        <section
            key={id || index}
            className={cn(
                "overflow-hidden relative mb-0",
                align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
            )}
            style={{
                backgroundColor: bgColor.startsWith('#') ? bgColor : '#' + bgColor,
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX
            }}
        >
            {/* Decorative gradients from original HomeContent */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F2542D]/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="container-wide relative z-10">
                <h2
                    className={cn(
                        "text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 font-serif tracking-tight leading-tight",
                        align === 'left' ? 'mr-auto ml-0' : align === 'right' ? 'ml-auto mr-0' : 'mx-auto'
                    )}
                    style={{ color: textColor.startsWith('#') ? textColor : '#' + textColor }}
                >
                    {title || "Stay Updated with India's Startup Ecosystem"}
                </h2>
                <div
                    className={cn(
                        "text-lg md:text-xl mb-12 max-w-2xl font-medium text-zinc-400 leading-relaxed",
                        align === 'left' ? 'mr-auto ml-0' : align === 'right' ? 'ml-auto mr-0' : 'mx-auto text-center'
                    )}
                    dangerouslySetInnerHTML={{ __html: description || subtitle || "Get the latest funding news, founder stories, and industry insights." }}
                />

                <div className={cn(
                    "flex flex-col sm:flex-row items-center gap-5",
                    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
                )}>
                    <Button className={cn(
                        "w-full sm:w-auto h-14 px-10 rounded-2xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold text-lg group shadow-xl shadow-orange-600/20 transition-all",
                    )} asChild>
                        <Link href={link_url || "/stories"}>
                            <span className="flex items-center gap-2">
                                {link_text || "Get Started"}
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </Button>

                    {(settings?.secondaryButtonText || settings?.secondaryButtonLink) && (
                        <Button variant="outline" className="w-full sm:w-auto h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm font-bold text-lg" asChild>
                            <Link href={settings?.secondaryButtonLink || "/submit"}>
                                {settings?.secondaryButtonText || "Learn More"}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionSettings {
    backgroundColor?: string;
    textColor?: string;
    paddingY?: number;
    paddingX?: number;
    align?: 'left' | 'center' | 'right';
    buttonStyle?: 'primary' | 'secondary' | 'outline';
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    extraButtons?: Array<{ text: string, link: string, style: string }>;
}

interface HeroSectionProps {
    id?: string;
    index: number;
    title?: string;
    description?: string;
    subtitle?: string;
    link_text?: string;
    link_url?: string;
    settings?: SectionSettings;
    heroData?: { title: string, content: string };
    HeadingTag?: 'h1' | 'h2';
}

export function HeroSection({
    id,
    index,
    title,
    description,
    subtitle,
    link_text,
    link_url,
    settings = {},
    heroData = { title: '', content: '' },
    HeadingTag = 'h1'
}: HeroSectionProps) {
    const bgColor = settings.backgroundColor || '#0F172A';
    const textColor = settings.textColor || '#FFFFFF';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'left';

    const displayTitle = title || heroData.title;
    const displayContent = description || subtitle || heroData.content;

    return (
        <section
            key={id || index}
            className="relative overflow-hidden mb-0"
            style={{
                backgroundColor: bgColor.startsWith('#') ? bgColor : '#' + bgColor,
                paddingTop: paddingY,
                paddingBottom: paddingY,
                paddingLeft: paddingX,
                paddingRight: paddingX,
            }}
        >
            <div className={cn(
                "container-wide relative z-10",
                align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center'
            )}>

                <HeadingTag
                    className={cn(
                        "text-3xl md:text-5xl lg:text-7xl font-semibold font-serif mb-6 max-w-5xl leading-[1.1] tracking-tight",
                        index === 0 ? "" : "animate-in fade-in slide-in-from-bottom-4 duration-500",
                        align === 'left' ? 'mr-auto ml-0' : align === 'right' ? 'ml-auto mr-0' : 'mx-auto'
                    )}
                    style={{ color: textColor.startsWith('#') ? textColor : '#' + textColor }}
                >
                    {displayTitle}
                </HeadingTag>

                <div
                    className={cn(
                        "text-base md:text-lg mb-8 max-w-2xl leading-relaxed prose prose-slate marker:text-zinc-500",
                        index === 0 ? "" : "animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150",
                        align === 'left' ? 'text-left mr-auto ml-0' : align === 'right' ? 'text-right ml-auto mr-0' : 'text-center mx-auto',
                        (textColor === '#FFFFFF' || textColor === 'FFFFFF' || (textColor === '#0F172A' || textColor === '0F172A')) ? 'prose-invert' : 'prose-zinc'
                    )}
                    style={{ color: textColor.startsWith('#') ? textColor : '#' + textColor, opacity: 0.8 }}
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                />
                <div className={cn(
                    "flex flex-col sm:flex-row items-center gap-5",
                    index === 0 ? "" : "animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300",
                    align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center'
                )}>
                    <Link href={link_url || "/stories"} className="w-full sm:w-auto">
                        <Button className={cn(
                            "w-full h-14 px-10 rounded-xl shadow-xl transition-all group border-none",
                            (settings?.buttonStyle === 'secondary') ? "bg-white hover:bg-zinc-100 text-slate-900 border border-zinc-200" :
                                (settings?.buttonStyle === 'outline') ? "bg-transparent border-2 border-current hover:bg-white/10" :
                                    "bg-[#F2542D] hover:bg-[#D94111] text-white shadow-orange-600/20"
                        )}>
                            <span className="flex items-center gap-2">
                                <span className="font-bold text-lg">{link_text || "Explore Stories"}</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </Link>

                    {(settings?.secondaryButtonText || settings?.secondaryButtonLink) && (
                        <Link href={settings?.secondaryButtonLink || "/submit"} className="w-full sm:w-auto">
                            <Button className={cn(
                                "w-full h-14 px-10 rounded-xl active:scale-95 transition-all border-none bg-white hover:bg-zinc-100 text-[#0F172A]",
                            )}>
                                <span className="font-bold text-lg text-[#0F172A]">
                                    {settings?.secondaryButtonText || "Submit Your Startup"}
                                </span>
                            </Button>
                        </Link>
                    )}
                    {(settings?.extraButtons || []).map((btn: { text: string; link: string; style: string }, i: number) => (
                        <Link key={i} href={btn.link || "/"} className="w-full sm:w-auto">
                            <Button className={cn(
                                "w-full h-14 px-10 rounded-xl active:scale-95 transition-all border-none",
                                btn.style === 'primary' ? "bg-orange-600 hover:bg-orange-700 text-white shadow-xl" :
                                    btn.style === 'outline' ? "bg-transparent border-2 border-current hover:bg-white/10" :
                                        "bg-white hover:bg-zinc-100 text-[#0F172A]"
                            )}>
                                <span className="font-bold text-lg">
                                    {btn.text}
                                </span>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

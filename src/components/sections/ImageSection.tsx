import Image from "next/image";
import { getSafeImageSrc } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ImageSectionProps {
    id?: string;
    index: number;
    title?: string;
    description?: string;
    image?: string;
    settings?: {
        backgroundColor?: string;
        paddingY?: number;
        paddingX?: number;
        align?: 'left' | 'center' | 'right';
        textColor?: string;
        imageUrl?: string;
    };
}

export function ImageSection({
    id,
    index,
    title,
    description,
    image,
    settings = {}
}: ImageSectionProps) {
    const bgColor = settings.backgroundColor || '#FFFFFF';
    const textColor = settings.textColor || '#0F172A';
    const paddingY = settings.paddingY !== undefined ? settings.paddingY : 48;
    const paddingX = settings.paddingX !== undefined ? settings.paddingX : 0;
    const align = settings.align || 'center';

    const src = getSafeImageSrc(image || settings.imageUrl);

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
                {src && (
                    <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={src}
                            alt={title || "Section Image"}
                            fill
                            className="object-cover"
                            priority={index < 2}
                        />
                    </div>
                )}
                {description && (
                    <p
                        className={cn(
                            "mt-6 text-zinc-500 italic max-w-2xl text-lg",
                            align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center mx-auto'
                        )}
                        style={{ color: textColor.startsWith('#') ? textColor : '#' + textColor }}
                    >
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}

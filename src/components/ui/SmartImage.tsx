import Image, { type ImageProps } from "next/image";
import { isLocalImageUrl } from "@/lib/images";

type SmartImageProps = ImageProps;

export function SmartImage({ src, alt, fill, width, height, style, ...props }: SmartImageProps) {
    const isLocalSrc = typeof src === "string" && isLocalImageUrl(src);

    if (isLocalSrc) {
        // Local backend media is not whitelisted in next.config, so fall back to img.
        // eslint-disable-next-line @next/next/no-img-element
        return (
            <img
                src={src}
                alt={alt}
                width={!fill && typeof width === "number" ? width : undefined}
                height={!fill && typeof height === "number" ? height : undefined}
                className={props.className}
                sizes={props.sizes}
                style={
                    fill
                        ? { position: "absolute", inset: 0, ...style }
                        : style
                }
            />
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill={fill}
            width={width}
            height={height}
            style={style}
            {...props}
        />
    );
}

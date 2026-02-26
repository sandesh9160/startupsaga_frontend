"use client";

/**
 * SafeImage — a drop-in wrapper around next/image.
 *
 * If the remote image fails to load (e.g. 404, wrong extension, network
 * error) it silently switches to a branded placeholder so the UI never
 * shows a broken-image icon.
 *
 * Usage is identical to <Image>. Extra props:
 *   fallbackSrc   – optional custom fallback image URL (default: inline SVG)
 *   fallbackLabel – text drawn inside the SVG placeholder (default: alt text)
 */

import { useState } from "react";
import Image, { ImageProps } from "next/image";

// ── Inline SVG placeholder ──────────────────────────────────────────────────
// Returns a data-URI SVG so we never need a file on disk.
function buildPlaceholderSrc(label: string, accent = "#FF4F18"): string {
    const safe = label.replace(/[<>&"]/g, "");
    const initials = safe
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#F8F8F8"/>
      <rect x="0" y="0" width="400" height="4" fill="${accent}"/>
      <circle cx="200" cy="130" r="44" fill="#F1F1F1" stroke="#E2E2E2" stroke-width="1.5"/>
      <text x="200" y="138" text-anchor="middle" dominant-baseline="middle"
            font-family="Georgia,serif" font-size="28" font-weight="700"
            fill="${accent}">${initials || "?"}</text>
      <text x="200" y="196" text-anchor="middle"
            font-family="-apple-system,sans-serif" font-size="13" fill="#9CA3AF"
            font-weight="500">${safe.slice(0, 32)}</text>
    </svg>`.trim();

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// ── Component ────────────────────────────────────────────────────────────────
interface SafeImageProps extends Omit<ImageProps, "onError"> {
    fallbackSrc?: string;
    fallbackLabel?: string;
}

export function SafeImage({
    src,
    alt = "",
    fallbackSrc,
    fallbackLabel,
    unoptimized,
    ...rest
}: SafeImageProps) {
    const [errored, setErrored] = useState(false);

    const effectiveSrc = errored
        ? (fallbackSrc ?? buildPlaceholderSrc(fallbackLabel ?? alt))
        : src;

    // SVG data-URIs must bypass Next.js image optimization
    const isDataUri =
        typeof effectiveSrc === "string" && effectiveSrc.startsWith("data:");

    return (
        <Image
            {...rest}
            src={effectiveSrc}
            alt={alt}
            unoptimized={isDataUri || unoptimized}
            onError={() => setErrored(true)}
        />
    );
}

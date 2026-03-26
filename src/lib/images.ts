const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL ?? "";

/**
 * Ensures an image URL is safe to use with Next.js Image component.
 * Handles both absolute URLs from the backend and relative media paths.
 * Prevents double-prefixing.
 */
export function getSafeImageSrc(
  src: unknown,
  fallback: string = "/placeholder.svg"
): string {
  if (!src || typeof src !== "string") return fallback;

  const trimmed = src.trim();
  if (trimmed.length === 0) return fallback;

  // 1. If it's already an absolute external URL, return as is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("//") || trimmed.startsWith("data:")) {
    // Check if it's double-prefixed with our own BASE_URL
    // e.g. https://api.startupsaga.inhttps://api.startupsaga.in/media/...
    if (BASE_URL && trimmed.startsWith(BASE_URL) && trimmed.substring(BASE_URL.length).startsWith("http")) {
      return trimmed.substring(BASE_URL.length);
    }
    return trimmed;
  }

  // 2. Handle relative paths (ensuring no double slashes)
  const normalizedBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalizedSrc = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${normalizedBase}${normalizedSrc}`;
}

export function isLocalImageUrl(src: string): boolean {
  return src.startsWith("http://127.0.0.1:") || src.startsWith("http://localhost:");
}

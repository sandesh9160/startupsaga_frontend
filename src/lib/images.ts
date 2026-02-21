import { API_BASE_URL } from "./api";

const BASE_URL = API_BASE_URL.replace("/api", "");

export function getSafeImageSrc(src: unknown, fallback: string = "/placeholder.svg") {
  if (typeof src === "string") {
    const trimmed = src.trim();
    if (trimmed.length > 0) {
      if (trimmed.startsWith("http") || trimmed.startsWith("//") || trimmed.startsWith("data:")) {
        // If it's a local absolute URL, convert it to relative to use Next.js rewrites
        if (trimmed.includes("localhost:8000") || trimmed.includes("127.0.0.1:8000")) {
          return trimmed.split(":8000")[1];
        }
        return trimmed;
      }
      // Handle relative paths from Django (e.g. /media/...)
      // When running with Next.js rewrites, we can just use relative paths
      if (trimmed.startsWith("/media/") || trimmed.startsWith("media/")) {
        const separator = trimmed.startsWith("/") ? "" : "/";
        return `${separator}${trimmed}`;
      }

      const separator = trimmed.startsWith("/") ? "" : "/";
      return `${BASE_URL}${separator}${trimmed}`;
    }
  }
  return fallback;
}

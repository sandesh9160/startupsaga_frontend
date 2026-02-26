// import { API_BASE_URL } from "./api";

// const BASE_URL = API_BASE_URL.replace("/api", "");

// export function getSafeImageSrc(src: unknown, fallback: string = "/placeholder.svg") {
//   if (typeof src === "string") {
//     const trimmed = src.trim();
//     if (trimmed.length > 0) {
//       if (trimmed.startsWith("http") || trimmed.startsWith("//") || trimmed.startsWith("data:")) {
//         // If it's a local absolute URL, convert it to relative to use Next.js rewrites
//         if (trimmed.includes("localhost:8000") || trimmed.includes("127.0.0.1:8000")) {
//           if (trimmed.includes("/media")) {
//             return "/media" + trimmed.split("/media")[1];
//           }
//           return trimmed.split(":8000")[1];
//         }
//         return trimmed;
//       }
//       // Handle relative paths from Django (e.g. /media/...)
//       // When running with Next.js rewrites, we can just use relative paths
//       if (trimmed.startsWith("/media/") || trimmed.startsWith("media/")) {
//         const separator = trimmed.startsWith("/") ? "" : "/";
//         return `${separator}${trimmed}`;
//       }

//       const separator = trimmed.startsWith("/") ? "" : "/";
//       return `${BASE_URL}${separator}${trimmed}`;
//     }
//   }
//   return fallback;
// }

import { API_BASE_URL } from "./api";

const BASE_URL =
  typeof API_BASE_URL === "string"
    ? API_BASE_URL.replace(/\/api\/?$/, "")
    : "";

export function getSafeImageSrc(
  src: unknown,
  fallback: string = "/placeholder.svg"
) {
  if (typeof src !== "string") return fallback;

  const trimmed = src.trim();
  if (!trimmed) return fallback;

  // Fully qualified external URLs (CDN, S3, etc.)
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Django absolute URLs (localhost or backend host)
  if (trimmed.includes(":8000")) {
    const path = trimmed.split(":8000")[1];
    return path ? path : fallback;
  }

  // Relative Django media paths
  if (trimmed.startsWith("/media/")) {
    return `${BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("media/")) {
    return `${BASE_URL}/${trimmed}`;
  }

  // Any other relative backend path
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${BASE_URL}${normalized}`;
}


import { getSEOSettings } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://startupsaga.in";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await getSEOSettings();

        // If the backend provides robots_txt, we use it. 
        // Otherwise, we use a robust default inspired by the SEO audit.
        let robotsTxt = settings?.robots_txt;

        if (!robotsTxt) {
            robotsTxt = [
                "User-agent: *",
                "Allow: /",
                "Disallow: /api/",
                "Disallow: /admin/",
                "Disallow: /unsubscribe",
                "Disallow: /*?*",
                "",
                `Sitemap: ${SITE_URL}/sitemap.xml`
            ].join("\n");
        } else if (!robotsTxt.includes("Sitemap:")) {
            // Ensure sitemap is present if not in dynamic string
            robotsTxt += `\n\nSitemap: ${SITE_URL}/sitemap.xml`;
        }

        return new Response(robotsTxt, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        // Fallback if API fails
        const fallback = [
            "User-agent: *",
            "Allow: /",
            "Disallow: /api/",
            "Disallow: /admin/",
            "",
            `Sitemap: ${SITE_URL}/sitemap.xml`
        ].join("\n");

        return new Response(fallback, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });
    }
}


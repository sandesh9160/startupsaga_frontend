
import { getSEOSettings } from "@/lib/api";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const settings = await getSEOSettings();
        const robotsTxt = settings?.robots_txt || "User-agent: *\nAllow: /";

        return new Response(robotsTxt, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        // Fallback if API fails
        return new Response("User-agent: *\nAllow: /", {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }
}

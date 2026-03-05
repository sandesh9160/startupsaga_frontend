import Script from "next/script";
import { cache } from "react";
import { getSEOSettings } from "@/lib/api";

// Reuse the same cache key as the root layout so we don't
// trigger a separate fetch call for SEO settings.
const getCachedSEO = cache(() => getSEOSettings().catch(() => ({})));

export async function GoogleAnalytics() {
    const seo = await getCachedSEO() as { google_analytics_id?: string };
    const gaId = seo?.google_analytics_id;

    if (!gaId) return null;

    return (
        <>
            {/* afterInteractive ensures GA loads post-hydration and is detectable by audit tools */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                        page_path: window.location.pathname,
                        send_page_view: true
                    });
                `}
            </Script>
        </>
    );
}

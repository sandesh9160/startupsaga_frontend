import Script from "next/script";
import { getSEOSettings } from "@/lib/api";

export async function GoogleAnalytics() {
    // Fetch directly. Next.js cache ensures this doesn't duplicate work too much.
    const seo = await getSEOSettings().catch(() => ({}));
    const gaId = seo?.google_analytics_id;

    if (!gaId) return null;

    return (
        <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `}
            </Script>
        </>
    );
}

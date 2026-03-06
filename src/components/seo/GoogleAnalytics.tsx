import Script from "next/script";
interface GoogleAnalyticsProps {
    gaId: string;
}

export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
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

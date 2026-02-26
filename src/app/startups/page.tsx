import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupsContent } from "@/components/startups/StartupsContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getStartups, getPlatformStats, getStartupsPage } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";


export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const resolved = searchParams ? await searchParams : undefined;
    const hasQuery = !!(resolved && Object.keys(resolved).length > 0);
    const title = "Startups in India | StartupSaga.in";
    const description = "Explore India’s most innovative startups across fintech, edtech, healthtech, and more.";

    return {
        title,
        description,
        alternates: {
            canonical: `${SITE_URL}/startups`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/startups`,
            siteName: "StartupSaga.in",
            type: "website",
            images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Startups in India on StartupSaga.in" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
        robots: hasQuery ? { index: false, follow: true } : undefined,
    };
}


export default async function StartupsPage() {
    let pageSections: any[] = [];
    let startupsResponse: any = {};
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const [sectionsData, startupsData, statsData] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("startups").then(data =>
                data.length > 0 ? data : getSections("", "startups")
            ),
            getStartupsPage({ page_size: 15 }),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        startupsResponse = startupsData;
        if (statsData) platformStats = statsData;
    } catch (error) {
        hasError = true;
        console.error("Error fetching startups data:", error);
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: any) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Indian Startups";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: any) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialStartups={startupsResponse.results || []}
                initialPlatformStats={platformStats}
                hasError={hasError}
                defaultView={
                    <StartupsContent
                        title={displayTitle}
                        description={displaySubtitle}
                        content={displayContent}
                    />
                }
            />
        </Layout>
    );
}

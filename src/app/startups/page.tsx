import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupsContent } from "@/components/startups/StartupsContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getPlatformStats, getStartupsPage, getPageBySlug } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import { PageSection, PaginatedResponse, Startup } from "@/types";

// ISR: serve cached page, regenerate every 120 seconds in the background
export const revalidate = 120;

export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const resolved = searchParams ? await searchParams : undefined;
    const hasQuery = !!(resolved && Object.keys(resolved).length > 0);

    const page = await getPageBySlug('startups').catch(() => null);

    const rawTitle = page?.meta_title || "Startups in India | StartupSaga.in";
    const rawDescription = page?.meta_description || "Explore India’s most innovative startups across fintech, edtech, healthtech, and more.";

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

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
            images: [{ url: page?.og_image || "/og-image.jpg", width: 1200, height: 630, alt: "Startups in India on StartupSaga.in" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
        robots: hasQuery ? { index: false, follow: true } : undefined,
    };
}

export default async function StartupsPage() {
    let pageSections: PageSection[] = [];
    let startupsResponse: PaginatedResponse<Startup> = { count: 0, next: null, previous: null, results: [] };
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const [sectionsData, startupsData, statsData] = await Promise.all([
            getSections("startups").then(data =>
                data.length > 0 ? (data as PageSection[]) : (getSections("", "startups") as Promise<PageSection[]>)
            ),
            getStartupsPage({ page_size: 15 }),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        startupsResponse = startupsData;
        if (statsData) platformStats = statsData;
    } catch {
        hasError = true;
    }

    // Extract header data from sections
    const headerSection = pageSections.find((s: PageSection) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Indian Startups";
    const displaySubtitle = headerSection?.description || "";
    const displayContent = headerSection?.content || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: PageSection) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialStartups={startupsResponse.results || []}
                initialPlatformStats={platformStats}
                hasError={hasError}
                defaultView={
                    <StartupsContent
                        title={displayTitle}
                        description={displaySubtitle}
                        content={displayContent}
                        initialStartups={startupsResponse.results || []}
                    />
                }
            />
        </Layout>
    );
}

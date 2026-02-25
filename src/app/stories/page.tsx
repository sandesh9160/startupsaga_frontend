import { Suspense } from "react";
import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoriesContent } from "@/components/stories/StoriesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getStories, getPlatformStats } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const resolved = searchParams ? await searchParams : undefined;
    const hasQuery = !!(resolved && Object.keys(resolved).length > 0);
    return {
        title: "Startup Stories in India | StartupSaga.in",
        description:
            "Explore the latest Indian startup stories, founder journeys, funding rounds, and growth strategies.",
        alternates: {
            canonical: `${SITE_URL}/stories`,
        },
        robots: hasQuery ? { index: false, follow: true } : undefined,
    };
}

export default async function StoriesPage() {
    let pageSections: any[] = [];
    let stories: any[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const [sectionsData, storiesData, statsData] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("stories").then(data =>
                data.length > 0 ? data : getSections("", "stories")
            ),
            getStories({ page_size: 10 }),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        stories = storiesData || [];
        if (statsData) platformStats = statsData;
    } catch (error) {
        hasError = true;
        console.error("Error fetching stories page data:", error);
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: any) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Stories";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: any) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialStories={stories}
                initialPlatformStats={platformStats}
                hasError={hasError}
                defaultView={
                    <Suspense fallback={
                        <div className="container-wide py-20">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-[240px] rounded-2xl bg-muted animate-pulse border border-border/50" />
                                ))}
                            </div>
                        </div>
                    }>
                        <StoriesContent
                            title={displayTitle}
                            description={displaySubtitle}
                            content={displayContent}
                        />
                    </Suspense>
                }
            />
        </Layout>
    );
}

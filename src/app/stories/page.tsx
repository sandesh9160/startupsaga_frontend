import { Suspense } from "react";
import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoriesContent } from "@/components/stories/StoriesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getPlatformStats, getPageBySlug, getSEOSettings, getStoriesPage } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import type { PageSection, Story } from "@/types";

// ISR: serve cached page, regenerate every 60 seconds in the background
export const revalidate = 60;

export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const resolved = searchParams ? await searchParams : undefined;
    const hasQuery = !!(resolved && Object.keys(resolved).length > 0);

    const [page, seo] = await Promise.all([
        getPageBySlug('stories').catch(() => null),
        getSEOSettings().catch(() => ({})),
    ]);

    const rawTitle = page?.meta_title || "Startup Stories in India";
    const rawDescription = page?.meta_description || seo.default_meta_description || "Explore the latest Indian startup stories, founder journeys, funding rounds, and growth strategies.";

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title: title.includes('|') ? { absolute: title } : title,
        description,
        keywords: [
            ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
            ...(page?.meta_keywords ? (Array.isArray(page.meta_keywords) ? page.meta_keywords : [page.meta_keywords]) : [])
        ].filter(Boolean).join(", "),
        alternates: {
            canonical: `${SITE_URL}/stories`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/stories`,
            siteName: "StartupSaga.in",
            type: "website",
            images: [{ url: page?.og_image || "/og-image.jpg", width: 1200, height: 630, alt: "Startup Stories on StartupSaga.in" }],
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

export default async function StoriesPage() {
    let pageSections: PageSection[] = [];
    let initialData: { results: Story[]; count: number; total_pages: number } = { results: [], count: 0, total_pages: 1 };
    let platformStats = { total_startups: 0, total_stories: 0 };

    try {
        const [sectionsData, response, statsData] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("stories").then(data =>
                data.length > 0 ? data : getSections("", "stories")
            ),
            getStoriesPage({ page_size: 12 }),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        if (response) {
            initialData = {
                results: response.results || [],
                count: response.count || 0,
                total_pages: response.total_pages || 1
            };
        }
        if (statsData) platformStats = statsData;
    } catch {
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: PageSection) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Stories";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    // return (
    //     <Layout>
    //         <HomeContent
    //             initialSections={pageSections.filter((s: any) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
    //             initialStories={stories}
    //             initialPlatformStats={platformStats}
    //             hasError={hasError}
    //             defaultView={
    //                 <StoriesContent
    //                     title={displayTitle}
    //                     description={displaySubtitle}
    //                     content={displayContent}
    //                 />
    //             }
    //         />
    //     </Layout>
    return (
        <Layout>
            <Suspense fallback={<div>Loading...</div>}>
                <HomeContent
                    initialSections={pageSections.filter((s: PageSection) =>
                        s.id ? s.id !== headerSection?.id : s !== headerSection
                    )}
                    initialStories={initialData.results}
                    initialPlatformStats={platformStats}
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
                                initialStories={initialData.results}
                                initialTotalCount={initialData.count}
                                initialTotalPages={initialData.total_pages}
                            />
                        </Suspense>
                    }
                />
            </Suspense>
        </Layout>
        // );
    );
}

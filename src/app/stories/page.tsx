import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoriesContent } from "@/components/stories/StoriesContent";
import { DynamicSections } from "@/components/sections/DynamicSections";
import { getSections, getPageBySlug, getSEOSettings, getStoriesPage } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import type { PageSection, Story } from "@/types";
import { Suspense } from "react";

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

    try {
        const [sectionsData, response] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("stories").then(data =>
                data.length > 0 ? data : getSections("", "stories")
            ),
            getStoriesPage({ page_size: 12 }),
        ]);

        pageSections = sectionsData || [];
        if (response) {
            initialData = {
                results: (response.results || []).map((s: Story) => ({
                    slug: s.slug || "",
                    title: s.title || "",
                    excerpt: typeof s.excerpt === 'string' ? s.excerpt.slice(0, 200) : (typeof s.content === 'string' ? s.content.slice(0, 200) : ""),
                    content: "",
                    thumbnail: s.thumbnail || s.og_image || "",
                    category_name: s.category_name || (typeof s.category === 'object' && s.category !== null && 'name' in s.category ? String((s.category as { name: string }).name) : ""),
                    city_name: s.city_name || (typeof s.city === 'object' && s.city !== null && 'name' in s.city ? String((s.city as { name: string }).name) : ""),
                    publish_date: s.publish_date || s.publishDate || "",
                    publishDate: s.publishDate || s.publish_date || "",
                    author_name: s.author_name || (typeof s.author === 'string' ? s.author : ""),
                    read_time: typeof s.read_time === 'number' ? s.read_time : 5,
                    category: s.category || "",
                    city: s.city || "",
                    author: s.author || ""
                })),
                count: response.count || 0,
                total_pages: response.total_pages || 1
            };
        }
    } catch (e) {
        console.error("Error fetching stories page data:", e);
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

    return (
        <Layout>
            <DynamicSections
                sections={pageSections.filter((s: PageSection) =>
                    s.id ? s.id !== headerSection?.id : s !== headerSection
                )}
                defaultView={
                    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
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
        </Layout>
    );
}

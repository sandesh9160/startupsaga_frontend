import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupsContent } from "@/components/startups/StartupsContent";
import { DynamicSections } from "@/components/sections/DynamicSections";
import { getSections, getStartupsPage, getPageBySlug, getSEOSettings } from "@/lib/api";
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

    const [page, seo] = await Promise.all([
        getPageBySlug('startups').catch(() => null),
        getSEOSettings().catch(() => ({})),
    ]);

    const rawTitle = page?.meta_title || "Startups in India";
    const rawDescription = page?.meta_description || seo.default_meta_description || "Explore India’s most innovative startups across fintech, edtech, healthtech, and more.";

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


    try {
        const [sectionsData, startupsData] = await Promise.all([
            getSections("startups").then(data =>
                data.length > 0 ? (data as PageSection[]) : (getSections("", "startups") as Promise<PageSection[]>)
            ),
            getStartupsPage({ page_size: 15 }),
        ]);

        pageSections = sectionsData || [];
        startupsResponse = {
            ...startupsData,
            results: (startupsData.results || []).map((s: Startup) => ({
                slug: s.slug || "",
                name: s.name || "",
                logo: s.logo || "",
                tagline: s.tagline || "",
                category_name: s.category_name || "",
                city_name: s.city_name || "",
                stage: s.stage || "",
                is_featured: !!s.is_featured,
                valuation: s.valuation || "",
                category: s.category || "",
                city: s.city || "",
                description: s.description || ""
            }))
        };
    } catch {
        // error handling
    }

    // Extract header data from sections
    const headerSection = pageSections.find((s: PageSection) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Indian Startups";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <DynamicSections
                sections={pageSections.filter((s: PageSection) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
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

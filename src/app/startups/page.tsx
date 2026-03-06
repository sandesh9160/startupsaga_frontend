import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupsContent } from "@/components/startups/StartupsContent";
import { DynamicSections } from "@/components/sections/DynamicSections";
import { getSections, getStartupsPage, getPageBySlug, getSEOSettings } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import { PageSection, PaginatedResponse, Startup } from "@/types";

// ISR: serve cached page, regenerate every 120 seconds in the background
export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([
        getPageBySlug('startups').catch(() => null),
        getSEOSettings().catch(() => ({})),
    ]);

    const rawTitle = page?.meta_title || "Startups in India";
    const rawDescription = page?.meta_description || seo.default_meta_description || "Explore India's most innovative startups across fintech, edtech, healthtech, and more.";

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
            getStartupsPage({ page_size: 12 }),
        ]);

        pageSections = sectionsData || [];
        // Strip startups to minimum fields for card rendering to reduce HTML payload.
        const categoryName = (s: Startup) => s.category_name || (typeof s.category === 'string' ? s.category : "");
        const cityName = (s: Startup) => s.city_name || (typeof s.city === 'string' ? s.city : "");
        startupsResponse = {
            count: startupsData.count || 0,
            next: startupsData.next || null,
            previous: startupsData.previous || null,
            results: (startupsData.results || []).map((s: Startup) => ({
                slug: s.slug || "",
                name: s.name || "",
                logo: s.logo || "",
                tagline: (s.tagline || "").slice(0, 120),
                category_name: categoryName(s),
                city_name: cityName(s),
                stage: s.stage || "",
                is_featured: !!s.is_featured,
                valuation: s.valuation || "",
                category: categoryName(s),
                city: cityName(s),
                description: (s.description || "").slice(0, 120),
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

    // Strip heavy "settings" and "data" fields from sections before passing to client.
    const leanSections = pageSections
        .filter((s: PageSection) => s.id ? s.id !== headerSection?.id : s !== headerSection)
        .map((s) => ({ id: s.id, section_type: s.section_type, type: s.type, title: s.title, name: s.name, description: s.description, subtitle: s.subtitle, content: s.content, order: s.order, is_active: s.is_active, link_url: s.link_url, link_text: s.link_text, image: s.image }));

    return (
        <Layout>
            <DynamicSections
                sections={leanSections as PageSection[]}
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

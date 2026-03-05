import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CitiesContent } from "@/components/cities/CitiesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getCities, getPlatformStats, getPageBySlug, getSEOSettings } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import type { PageSection, City } from "@/types";

// ISR: serve cached page, regenerate every 5 minutes in the background
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([
        getPageBySlug('cities').catch(() => null),
        getSEOSettings().catch(() => ({})),
    ]);

    const rawTitle = page?.meta_title || "Startup Cities in India";
    const rawDescription = page?.meta_description || seo.default_meta_description || "Explore India’s thriving startup hubs. From Bengaluru to Mumbai, discover where innovation happens.";

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title: title.includes('|') ? { absolute: title } : title,
        description,
        alternates: {
            canonical: `${SITE_URL}/cities`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/cities`,
            siteName: "StartupSaga.in",
            type: "website",
            images: [{ url: page?.og_image || "/og-image.jpg", width: 1200, height: 630, alt: "Startup Cities in India on StartupSaga.in" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
    };
}


export default async function CitiesPage() {
    let pageSections: PageSection[] = [];
    let cities: City[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };

    try {
        const [sectionsData, citiesData, statsData] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("cities").then(data =>
                data.length > 0 ? data : getSections("", "cities")
            ),
            getCities(),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        cities = citiesData || [];
        if (statsData) platformStats = statsData;
    } catch (_error) {
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: PageSection) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Cities";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: PageSection) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialCities={cities}
                initialPlatformStats={platformStats}
                defaultView={
                    <CitiesContent
                        title={displayTitle}
                        description={displaySubtitle}
                        content={displayContent}
                    />
                }
            />
        </Layout>
    );
}

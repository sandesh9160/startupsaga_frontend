import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CitiesContent } from "@/components/cities/CitiesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getCities, getPlatformStats } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Startup Cities in India | StartupSaga.in",
    description:
        "Explore India’s thriving startup hubs. From Bengaluru to Mumbai, discover where innovation happens.",
    alternates: {
        canonical: `${SITE_URL}/cities`,
    },
};

export default async function CitiesPage() {
    let pageSections: any[] = [];
    let cities: any[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

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
    } catch (error) {
        hasError = true;
        console.error("Error fetching cities data:", error);
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: any) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Cities";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: any) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialCities={cities}
                initialPlatformStats={platformStats}
                hasError={hasError}
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

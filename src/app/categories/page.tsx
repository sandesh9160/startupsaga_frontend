import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CategoriesContent } from "@/components/categories/CategoriesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getCategories, getPlatformStats } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Startup Categories | StartupSaga.in",
    description:
        "Explore startups by industry. From fintech to healthtech, edtech to SaaS, discover companies transforming every sector of India’s economy.",
    alternates: {
        canonical: `${SITE_URL}/categories`,
    },
};

export default async function CategoriesPage() {
    let pageSections: any[] = [];
    let categories: any[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const [sectionsData, categoriesData, statsData] = await Promise.all([
            // Try both page_key and page_slug to ensure we get sections from admin
            getSections("categories").then(data =>
                data.length > 0 ? data : getSections("", "categories")
            ),
            getCategories(),
            getPlatformStats().catch(() => null),
        ]);

        pageSections = sectionsData || [];
        categories = categoriesData || [];
        if (statsData) platformStats = statsData;
    } catch (error) {
        hasError = true;
        console.error("Error fetching categories data:", error);
    }

    // Extract header data from sections
    // We look for 'hero', 'banner', or 'text' sections
    const headerSection = pageSections.find((s: any) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text') &&
        (s.is_active === true || s.is_active === 1 || String(s.is_active).toLowerCase() === 'true')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Categories";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: any) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
                initialCategories={categories}
                initialPlatformStats={platformStats}
                hasError={hasError}
                defaultView={
                    <CategoriesContent
                        title={displayTitle}
                        description={displaySubtitle}
                        content={displayContent}
                    />
                }
            />
        </Layout>
    );
}

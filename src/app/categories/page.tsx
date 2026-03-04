import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CategoriesContent } from "@/components/categories/CategoriesContent";
import { HomeContent } from "@/components/home/HomeContent";
import { getSections, getCategories, getPlatformStats, getPageBySlug } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import { PageSection, Category } from "@/types";

// ISR: serve cached page, regenerate every 5 minutes in the background
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug('categories').catch(() => null);

    const rawTitle = page?.meta_title || "Startup Categories | StartupSaga.in";
    const rawDescription = page?.meta_description || "Explore startups by industry. From fintech to healthtech, edtech to SaaS, discover companies transforming every sector of India’s economy.";

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title,
        description,
        alternates: {
            canonical: `${SITE_URL}/categories`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/categories`,
            siteName: "StartupSaga.in",
            type: "website",
            images: [{ url: page?.og_image || "/og-image.jpg", width: 1200, height: 630, alt: "Startup Categories on StartupSaga.in" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
    };
}

export default async function CategoriesPage() {
    let pageSections: PageSection[] = [];
    let categories: Category[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const [sectionsData, categoriesData, statsData] = await Promise.all([
            getSections("categories").then((data) =>
                data.length > 0 ? (data as PageSection[]) : (getSections("", "categories") as Promise<PageSection[]>)
            ),
            getCategories(),
            getPlatformStats().catch(() => ({ total_startups: 0, total_stories: 0 })),
        ]);

        pageSections = sectionsData || [];
        categories = categoriesData || [];
        if (statsData) platformStats = statsData;
    } catch {
        hasError = true;
    }

    // Extract header data from sections
    const headerSection = pageSections.find((s: PageSection) =>
        (s.section_type === 'hero' || s.section_type === 'banner' || s.section_type === 'text')
    ) || pageSections[0];

    const displayTitle = headerSection?.title || headerSection?.name || "Startup Categories";
    const displaySubtitle = headerSection?.subtitle || "";
    const displayContent = (headerSection?.description || headerSection?.content) || "";

    return (
        <Layout>
            <HomeContent
                initialSections={pageSections.filter((s: PageSection) => s.id ? s.id !== headerSection?.id : s !== headerSection)}
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

import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { HomeContent } from "@/components/home/HomeContent";
import { FAQSchema } from "@/components/seo/Schema/FAQSchema";
import { getTrendingStories, getSections, getStories, getStartups, getCities, getCategories, getPlatformStats, getPageBySlug } from "@/lib/api";
import { SITE_URL } from "@/config/site";

import { DynamicSections } from "@/components/sections/DynamicSections";
import { DefaultHomeView } from "@/components/home/DefaultHomeView";

// ISR: serve cached page, regenerate every 60 seconds in the background
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPageBySlug('home').catch(() => null);

    const rawTitle = page?.meta_title || "StartupSaga.in | Startup Stories of India";
    const rawDescription = page?.meta_description || "Discover the most inspiring stories from the Indian startup ecosystem.";

    // Strip HTML for head compatibility
    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title,
        description,
        alternates: {
            canonical: SITE_URL,
        },
        openGraph: {
            title,
            description,
            url: SITE_URL,
            siteName: "StartupSaga.in",
            type: "website",
            images: [
                {
                    url: page?.og_image || "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: "StartupSaga.in",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
    };
}

export default async function IndexPage() {
    // Fetch data on the server in parallel
    let trendingStories: any[] = [];
    let pageSections: any[] = [];
    let latestStories: any[] = [];
    let featuredStartups: any[] = [];
    let topCities: any[] = [];
    let topCategories: any[] = [];
    let platformStats = { total_startups: 0, total_stories: 0 };
    let hasError = false;

    try {
        const sectionsData = await getSections('homepage');
        pageSections = sectionsData && sectionsData.length > 0
            ? sectionsData
            : await getSections('home');

        let statsData = null;
        [
            trendingStories,
            latestStories,
            featuredStartups,
            topCities,
            topCategories,
            statsData
        ] = await Promise.all([
            getTrendingStories(),
            getStories({ page_size: 6 }),
            getStartups({ page_size: 6 }),
            getCities(),
            getCategories(),
            getPlatformStats().catch(() => null)
        ]);

        if (statsData) platformStats = statsData;
    }
    catch (error) {
        hasError = true;
    }

    // Extract FAQ items for Schema integration
    const faqItems = (pageSections || [])
        .filter((s: any) => (s.section_type || s.type) === 'faq')
        .flatMap((s: any) => (s.settings?.cards || []))
        .filter((c: any) => (c.question || c.title) && (c.answer || c.description))
        .map((c: any) => ({
            question: c.question || c.title,
            answer: c.answer || c.description
        }));

    return (
        <>
            {faqItems.length > 0 && <FAQSchema items={faqItems} />}
            <Layout>
                {pageSections && pageSections.length > 0 ? (
                    <DynamicSections
                        sections={pageSections}
                        data={{
                            trendingStories,
                            latestStories,
                            featuredStartups,
                            topCities,
                            topCategories,
                            platformStats,
                            heroData: {
                                title: (pageSections || []).find((s: any) => (s.section_type || s.type) === 'hero')?.title || "StartupSaga.in | Startup Stories of India",
                                content: (pageSections || []).find((s: any) => (s.section_type || s.type) === 'hero')?.description || "Discover the most inspiring stories from the Indian startup ecosystem."
                            }
                        }}
                    />
                ) : (
                    <DefaultHomeView
                        trendingStories={trendingStories}
                        latestStories={latestStories}
                        featuredStartups={featuredStartups}
                        topCities={topCities}
                    />
                )}
            </Layout>
        </>
    );
}

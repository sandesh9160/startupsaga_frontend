import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { HomeContent } from "@/components/home/HomeContent";
import { getTrendingStories, getSections, getStories, getStartups, getCities, getCategories, getPlatformStats } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "StartupSaga.in | Startup Stories of India",
    description: "Discover the most inspiring stories from the Indian startup ecosystem.",
    alternates: {
        canonical: SITE_URL,
    },
};

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
            : await getSections('home'); // Try 'home' as fallback

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
    } catch (error) {
        hasError = true;
        console.error("Error fetching home data on server:", error);
    }

    return (
        <Layout>
            <HomeContent
                initialTrending={trendingStories}
                initialSections={pageSections}
                initialStories={latestStories}
                initialStartups={featuredStartups}
                initialCities={topCities}
                initialCategories={topCategories}
                initialPlatformStats={platformStats}
                hasError={hasError}
            />
        </Layout>
    );
}

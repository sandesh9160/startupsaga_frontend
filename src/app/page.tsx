import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { getSections, getPageBySlug, getStories, getTrendingStories, getSEOSettings } from "@/lib/api";
import { SITE_URL } from "@/config/site";

import { DynamicSections } from "@/components/sections/DynamicSections";
import { DefaultHomeView } from "@/components/home/DefaultHomeView";
import { PageSection, Story } from "@/types";

// ISR: serve cached page, regenerate every 60 seconds in the background
export const revalidate = 60;

// Deduplicate between generateMetadata and IndexPage
const getCachedHomePage = cache(() => getPageBySlug('home').catch(() => null));
const getCachedSEO = cache(() => getSEOSettings().catch(() => ({})));

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([
        getCachedHomePage(),
        getCachedSEO(),
    ]);

    const rawTitle = page?.meta_title || seo.default_meta_title || "Startup Stories of India";
    const rawDescription = page?.meta_description || seo.default_meta_description || "Discover the most inspiring stories from the Indian startup ecosystem.";

    // Strip HTML for head compatibility
    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = (rawDescription || "Explore the journey of founders, the growth of startups, and the cities driving innovation across India.").replace(/<[^>]*>?/gm, '');

    return {
        title: title.includes('|') ? { absolute: title } : title,
        description,
        alternates: {
            canonical: SITE_URL,
        },
        openGraph: {
            title,
            description,
            url: SITE_URL,
            type: "website",
            images: [
                {
                    url: page?.og_image || "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: title,
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

/**
 * Homepage - Optimized for FCP and LCP.
 * Uses a "shell-first" streaming approach where the Layout and Header are flushed
 * to the browser immediately while the slower dynamic content fetches in the background.
 */
export default function IndexPage() {
    return (
        <Layout>
            <Suspense fallback={<HomeSkeleton />}>
                <HomeContent />
            </Suspense>
        </Layout>
    );
}

/**
 * Main content fetcher for the homepage.
 * Wrapping this in Suspense allows the page shell to render immediately.
 */
async function HomeContent() {
    // 1. Fetch sections AND critical above-the-fold story data in parallel.
    // Pre-seeding stories bypasses the LatestStoriesWrapper Suspense waterfall,
    // so the LCP image appears in the initial HTML stream.
    const [sectionsData, storiesData, trendingData] = await Promise.all([
        getSections('homepage').catch(() => []),
        getStories({ page_size: 6 }).catch(() => []),
        getTrendingStories().catch(() => []),
    ]);

    const latestStories = (storiesData || []) as Story[];
    const trendingStories = (trendingData || []) as Story[];
    const pageSections = (sectionsData && sectionsData.length > 0
        ? sectionsData
        : await getSections('home').catch(() => [])) as PageSection[];

    // 2. LCP is handled by next/image with priority={true} in the rendered components.
    // Manual preloading here using the raw API URL causes "preloaded but not used" warnings 
    // because next/image uses the /_next/image proxy URL.


    if (pageSections && pageSections.length > 0) {
        return (
            <DynamicSections
                sections={pageSections}
                data={{
                    latestStories,
                    trendingStories,
                    heroData: {
                        title: (pageSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.title || "StartupSaga.in | Startup Stories of India",
                        content: (pageSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.description || "Discover the most inspiring stories from the Indian startup ecosystem."
                    },
                }}
            />
        );
    }

    return (
        <DefaultHomeView
            trendingStories={trendingStories}
            latestStories={latestStories}
            featuredStartups={[]}
            topCities={[]}
        />
    );
}

/**
 * Minimal skeleton to prevent layout shift while content streams.
 */
function HomeSkeleton() {
    return (
        <div className="w-full animate-pulse">
            <div className="h-[400px] md:h-[600px] bg-zinc-900 flex items-center justify-center">
                <div className="container-wide">
                    <div className="h-12 w-3/4 bg-white/10 rounded-lg mb-4" />
                    <div className="h-6 w-1/2 bg-white/5 rounded-lg" />
                </div>
            </div>
            <div className="container-wide py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-video bg-zinc-100 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

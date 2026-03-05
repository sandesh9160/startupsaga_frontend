import type { Metadata } from "next";
import { cache } from "react";
import { preload as preloadResource } from "react-dom";
import { Layout } from "@/components/layout/Layout";
import { getSections, getPageBySlug, getStories, getTrendingStories, getSEOSettings } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import { getSafeImageSrc } from "@/lib/images";

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
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

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
    let pageSections: PageSection[] = [];
    let latestStories: Story[] = [];
    let trendingStories: Story[] = [];

    // Fetch sections AND critical above-the-fold story data in parallel.
    // Pre-seeding stories bypasses the LatestStoriesWrapper Suspense waterfall,
    // so the LCP image appears in the initial HTML stream.
    const [sectionsData, storiesData, trendingData] = await Promise.all([
        getSections('homepage').catch(() => []),
        getStories({ page_size: 6 }).catch(() => []),
        getTrendingStories().catch(() => []),
    ]);

    try {
        pageSections = sectionsData && sectionsData.length > 0
            ? sectionsData as PageSection[]
            : await getSections('home').catch(() => []) as PageSection[];
        latestStories = storiesData as Story[];
        trendingStories = trendingData as Story[];
    } catch {
        // silently handle fetch errors — fallback values are already set
    }

    // ── LCP optimisation: preload the first story's thumbnail ──────────
    // Inject a <link rel="preload"> into <head> so the browser starts the
    // image download immediately, before the <img> tag is even parsed.
    const lcpStory = latestStories[0] ?? null;
    const lcpImageSrc = lcpStory
        ? getSafeImageSrc(lcpStory.thumbnail || lcpStory.og_image)
        : null;

    if (lcpImageSrc && lcpImageSrc !== '/placeholder.svg') {
        preloadResource(lcpImageSrc, {
            as: 'image',
            fetchPriority: 'high',
        });
    }


    return (
        <Layout>
            {pageSections && pageSections.length > 0 ? (
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
            ) : (
                <DefaultHomeView
                    trendingStories={trendingStories}
                    latestStories={latestStories}
                    featuredStartups={[]}
                    topCities={[]}
                />
            )}
        </Layout>
    );
}

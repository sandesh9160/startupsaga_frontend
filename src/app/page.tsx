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
        keywords: [
            ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
            ...(page?.meta_keywords ? (Array.isArray(page.meta_keywords) ? page.meta_keywords : [page.meta_keywords]) : [])
        ].filter(Boolean).join(", "),
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
    const [sectionsData, storiesRaw, trendingRaw] = await Promise.all([
        getSections('homepage').catch(() => []),
        getStories({ page_size: 6 }).catch(() => []),
        getTrendingStories().catch(() => []),
    ]);

    // Strip stories to only fields needed for card rendering — reduces RSC payload.
    const mapStory = (s: Story) => ({
        slug: s.slug || "",
        title: s.title || "",
        thumbnail: s.thumbnail || "",
        excerpt: (s.excerpt || "").slice(0, 160),
        category_name: s.category_name || "",
        city_name: s.city_name || "",
        author_name: s.author_name || "",
        read_time: typeof s.read_time === 'number' ? s.read_time : 5,
        publish_date: s.publish_date || "",
        publishDate: s.publishDate || s.publish_date || "",
        category: s.category_name || "",
        city: s.city_name || "",
        content: "",
        author: ""
    });

    const latestStories = (storiesRaw || []).map(mapStory) as Story[];
    const trendingStories = (trendingRaw || []).map(mapStory) as Story[];
    const rawSections = (sectionsData && sectionsData.length > 0
        ? sectionsData
        : await getSections('home').catch(() => [])) as PageSection[];

    // Strip heavy fields from sections before passing to client.
    // settings.cards, settings.items, and data can contain massive JSON blobs that bloat HTML.
    const pageSections = rawSections.map((s: PageSection) => ({
        id: s.id,
        section_type: s.section_type,
        type: s.type,
        title: s.title,
        name: s.name,
        description: s.description,
        subtitle: s.subtitle,
        content: s.content,
        order: s.order,
        is_active: s.is_active,
        link_url: s.link_url,
        link_text: s.link_text,
        image: s.image,
        // Keep only display-relevant settings
        settings: s.settings ? {
            backgroundColor: (s.settings as Record<string, unknown>).backgroundColor,
            textColor: (s.settings as Record<string, unknown>).textColor,
            paddingY: (s.settings as Record<string, unknown>).paddingY,
            paddingX: (s.settings as Record<string, unknown>).paddingX,
            align: (s.settings as Record<string, unknown>).align,
            buttonStyle: (s.settings as Record<string, unknown>).buttonStyle,
            secondaryButtonText: (s.settings as Record<string, unknown>).secondaryButtonText,
            secondaryButtonLink: (s.settings as Record<string, unknown>).secondaryButtonLink,
            extraButtons: (s.settings as Record<string, unknown>).extraButtons,
        } : undefined,
    })) as PageSection[];

    if (pageSections && pageSections.length > 0) {
        return (
            <DynamicSections
                sections={pageSections}
                data={{
                    latestStories,
                    trendingStories,
                    heroData: {
                        title: (rawSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.title || "StartupSaga.in | Startup Stories of India",
                        content: (rawSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.description || "Discover the most inspiring stories from the Indian startup ecosystem."
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

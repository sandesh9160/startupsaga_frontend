import type { Metadata } from "next";
import { cache, Suspense } from "react";
import { Layout } from "@/components/layout/Layout";
import { getSections, getPageBySlug, getStories, getTrendingStories, getSEOSettings } from "@/lib/api";

import { DynamicSections } from "@/components/sections/DynamicSections";
import { DefaultHomeView } from "@/components/home/DefaultHomeView";
import { PageSection, Story } from "@/types";

// ISR: serve cached page, regenerate every 60 seconds in the background
export const revalidate = 60;

// Deduplicate between generateMetadata and IndexPage
const getCachedHomePage = cache(() => getPageBySlug('home').catch(() => null));

export async function generateMetadata(): Promise<Metadata> {
    const page = await getCachedHomePage();

    const title = page?.meta_title || "StartupSaga | Startup Stories of India";
    const description = page?.meta_description || "Discover inspiring startup stories from India. Explore founder journeys, milestones, and lessons. Find startups by industry, city hubs, latest insights.";
    const keywords = page?.meta_keywords || "startup stories India, Indian startups, Indian founders, startup journeys, startup insights, startup hubs India, featured startups, tier 2 cities startups, startup ecosystem";

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        }
    };
}

/**
 * Homepage - Optimized for FCP and LCP.
 * Uses a "shell-first" streaming approach where the Layout and Header are flushed
 * to the browser immediately while the slower dynamic content fetches in the background.
 */
export default function IndexPage() {
    return (
        <Layout pageKey="homepage">
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
    // 1. Fetch sections first - this defines the page structure.
    const sectionsData = await getSections('homepage').catch(() => []) as PageSection[];
    const rawSections = sectionsData.length > 0 ? sectionsData : await getSections('home').catch(() => []) as PageSection[];

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

    // 2. Identify Hero section to render it immediately
    const heroSection = pageSections.find(s => (s.section_type || s.type) === 'hero');
    const remainingSections = pageSections.filter(s => s !== heroSection);

    return (
        <div className="flex flex-col w-full">
            {/* Render Hero immediately - this targets FCP and LCP */}
            {heroSection && (
                <DynamicSections
                    sections={[heroSection]}
                    data={{
                        heroData: {
                            title: heroSection.title || "StartupSaga.in | Startup Stories of India",
                            content: heroSection.description || "Discover the most inspiring stories from the Indian startup ecosystem."
                        }
                    }}
                />
            )}

            {/* Suspense the rest of the dynamic content (stories, etc) */}
            <Suspense fallback={<RemainingContentSkeleton />}>
                <DynamicContent
                    sections={remainingSections}
                    heroData={heroSection ? { title: heroSection.title || "", content: heroSection.description || "" } : undefined}
                />
            </Suspense>
        </div>
    );
}

/**
 * Separate component to fetch stories and render remaining sections.
 * This allows the Hero to be flushed to the browser first.
 */
async function DynamicContent({ sections, heroData }: { sections: PageSection[], heroData?: { title: string, content: string } }) {
    const [storiesRaw, trendingRaw] = await Promise.all([
        getStories({ page_size: 4 }).catch(() => []),
        getTrendingStories().catch(() => []),
    ]);

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

    if (sections && sections.length > 0) {
        return (
            <DynamicSections
                sections={sections}
                data={{
                    latestStories,
                    trendingStories,
                    heroData
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

function RemainingContentSkeleton() {
    return (
        <div className="container-wide py-12 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video bg-zinc-100 rounded-xl" />
                ))}
            </div>
        </div>
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

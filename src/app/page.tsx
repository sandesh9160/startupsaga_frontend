import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { getSections, getPageBySlug, getStories } from "@/lib/api";
import { SITE_URL } from "@/config/site";

import { DynamicSections } from "@/components/sections/DynamicSections";
import { DefaultHomeView } from "@/components/home/DefaultHomeView";
import { PageSection } from "@/types";
import { getSafeImageSrc } from "@/lib/images";

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
    // Fetch critical data only
    let pageSections: PageSection[] = [];

    // Fetch sections AND first page of stories in parallel so we can
    // inject a <link rel="preload"> for the LCP image before any Suspense boundary.
    const [sectionsResult, storiesResult] = await Promise.allSettled([
        getSections('homepage').catch(() => []),
        getStories({ page_size: 4 }).catch(() => []),
    ]);

    try {
        const sectionsData = sectionsResult.status === 'fulfilled' ? sectionsResult.value : [];

        // Fallback for sections if 'homepage' is empty
        pageSections = sectionsData && sectionsData.length > 0
            ? sectionsData as PageSection[]
            : await getSections('home').catch(() => []) as PageSection[];
    }
    catch (error) {
        console.error("Home page sections fetching error:", error);
    }

    // Determine LCP image preload URL (first story thumbnail)
    const stories = storiesResult.status === 'fulfilled' ? storiesResult.value : [];
    const lcpImageRaw = stories[0]?.thumbnail || stories[0]?.og_image;
    const lcpImageSrc = lcpImageRaw ? getSafeImageSrc(lcpImageRaw) : null;
    // Build the Next.js image optimization URL for the LCP image
    const lcpPreloadUrl = lcpImageSrc
        ? `/_next/image?url=${encodeURIComponent(lcpImageSrc)}&w=828&q=75`
        : null;

    return (
        <>
            {lcpPreloadUrl && (
                // Inject preload before the Layout/Suspense boundaries so browser
                // discovers and fetches LCP image as early as possible
                <link
                    rel="preload"
                    as="image"
                    href={lcpPreloadUrl}
                    // @ts-expect-error - fetchpriority is a valid HTML attribute not yet in React types
                    fetchpriority="high"
                />
            )}
            <Layout>
                {pageSections && pageSections.length > 0 ? (
                    <DynamicSections
                        sections={pageSections}
                        data={{
                            heroData: {
                                title: (pageSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.title || "StartupSaga.in | Startup Stories of India",
                                content: (pageSections || []).find((s: PageSection) => (s.section_type || s.type) === 'hero')?.description || "Discover the most inspiring stories from the Indian startup ecosystem."
                            }
                        }}
                    />
                ) : (
                    <DefaultHomeView
                        trendingStories={[]}
                        latestStories={[]}
                        featuredStartups={[]}
                        topCities={[]}
                    />
                )}
            </Layout>
        </>
    );
}

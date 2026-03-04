import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { getSections, getPageBySlug } from "@/lib/api";
import { SITE_URL } from "@/config/site";

import { DynamicSections } from "@/components/sections/DynamicSections";
import { DefaultHomeView } from "@/components/home/DefaultHomeView";
import { PageSection } from "@/types";

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

    try {
        // Only await sections as they define the page structure.
        // Other data fetching has been moved into individual sections via DynamicSections.
        const sectionsData = await getSections('homepage').catch(() => []);

        // Fallback for sections if 'homepage' is empty
        pageSections = sectionsData && sectionsData.length > 0
            ? sectionsData as PageSection[]
            : await getSections('home').catch(() => []) as PageSection[];
    }
    catch (error) {
        console.error("Home page sections fetching error:", error);
    }

    return (
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
                    // Fallback view might still need data, but the path forward is DynamicSections anyway.
                    // If DefaultHomeView is used, it will fetch its own data on the client or we can just leave it as is.
                    trendingStories={[]}
                    latestStories={[]}
                    featuredStartups={[]}
                    topCities={[]}
                />
            )}
        </Layout>
    );
}

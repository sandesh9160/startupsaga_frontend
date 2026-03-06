import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoryDetailContent } from "@/components/stories/StoryDetailContent";
import { getStoryBySlug, getStories, getStartups, getSEOSettings } from "@/lib/api";
import { Story, Startup, PaginatedResponse } from "@/types";
import { StorySchema } from "@/components/seo/Schema/StorySchema";
import { notFound, redirect } from "next/navigation";
import { resolveRedirect } from "@/lib/api";
import { SITE_URL } from "@/config/site";
import { Suspense } from "react";
import { preload } from "react-dom";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function getAbsoluteImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? `${API_BASE.replace("/api", "")}${url}` : `${API_BASE.replace("/api", "")}/${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [story, seo] = await Promise.all([
        getStoryBySlug(slug),
        getSEOSettings().catch(() => ({})),
    ]);
    if (!story || !story.slug || (story.status !== undefined && story.status !== 'published')) {
        notFound();
    }
    // FIX-002: Respect canonical_override from CMS if set
    const canonical = story.canonical_override
        ? (story.canonical_override.startsWith("http") ? story.canonical_override : `${SITE_URL}${story.canonical_override.startsWith("/") ? "" : "/"}${story.canonical_override}`)
        : `${SITE_URL}/stories/${story.slug}`;
    const cleanContent = story.content?.replace(/<[^>]*>?/gm, '') || "";
    const rawDescription = story.meta_description || story.excerpt || (cleanContent.slice(0, 160) || seo.default_meta_description || "Startup story on StartupSaga.in");
    const ogImage = getAbsoluteImageUrl(story.og_image || story.thumbnail);
    const rawTitle = story.meta_title || `${story.title}`;

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = (rawDescription || "Read inspiring startup stories, founder interviews, and ecosystem updates on StartupSaga.in.").replace(/<[^>]*>?/gm, '');

    return {
        title: title,
        description,
        keywords: [
            ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
            ...(Array.isArray(story.meta_keywords) ? story.meta_keywords : [story.meta_keywords || ""])
        ].filter(Boolean).join(", "),
        alternates: { canonical },
        ...(story.noindex ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

// Force dynamic to ensure notFound() returns a real 404 status in the network tab
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 3600;


/**
 * Story detail page - Optimized for FCP.
 */
export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Preliminary check for navigation
    if (slug === "stories") redirect("/stories");
    if (slug === "startups") redirect("/startups");
    if (slug === "categories") redirect("/categories");
    if (slug === "cities") redirect("/cities");

    // Parallelize redirect check and story fetch
    const [redirectTo] = await Promise.all([
        resolveRedirect(`/stories/${slug}`),
        getStoryBySlug(slug), // Primes cache
    ]);

    if (redirectTo) redirect(redirectTo);

    return (
        <Layout>
            <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
                <StoryContent slug={slug} />
            </Suspense>
        </Layout>
    );
}

/**
 * Async content component for story detail.
 */
async function StoryContent({ slug }: { slug: string }) {
    const story = await getStoryBySlug(slug);

    if (!story || !story.slug || (story.status !== undefined && story.status !== 'published')) {
        notFound();
    }

    const storyImage = getAbsoluteImageUrl(story.og_image || story.thumbnail);
    // Preload hero image
    preload(storyImage, { as: "image" });

    const canonical = story.canonical_override
        ? (story.canonical_override.startsWith("http") ? story.canonical_override : `${SITE_URL}${story.canonical_override.startsWith("/") ? "" : "/"}${story.canonical_override}`)
        : `${SITE_URL}/stories/${story.slug}`;

    return (
        <>
            <StorySchema story={story} canonical={canonical} />
            <StoryDetailContent
                story={story}
                relatedStories={[]}
                categoryStartups={[]}
            />
            {/* Load recommendations in a separate stream */}
            <Suspense fallback={<div className="h-96 animate-pulse bg-zinc-50 rounded-xl" />}>
                <StoryRecommendationsSection story={story} />
            </Suspense>
        </>
    );
}

/**
 * Recommendations section component to avoid blocking the main story content.
 */
async function StoryRecommendationsSection({ story }: { story: Story }) {
    const [allStories, allStartups] = await Promise.all([
        getStories(),
        getStartups()
    ]);

    const stories = (Array.isArray(allStories) ? allStories : (allStories as PaginatedResponse<Story>).results || []) as Story[];
    const startups = (Array.isArray(allStartups) ? allStartups : (allStartups as PaginatedResponse<Startup>).results || []) as Startup[];

    // Related stories: same category or same city, excluding current story
    const relatedStories = stories
        .filter((s: Story) => s.slug !== story.slug && (s.categorySlug === story.categorySlug || s.citySlug === story.citySlug))
        .slice(0, 3);

    // Fallback to latest stories if none related
    if (relatedStories.length === 0) {
        relatedStories.push(...stories.filter((s: Story) => s.slug !== story.slug).slice(0, 3));
    }

    // Startups by category
    const categoryStartups = startups
        .filter((s: Startup) => s.categorySlug === story.categorySlug)
        .slice(0, 4);

    return (
        <StoryDetailContent
            story={story}
            relatedStories={relatedStories}
            categoryStartups={categoryStartups}
            onlyRecommendations={true}
        />
    );
}


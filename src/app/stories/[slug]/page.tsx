import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoryDetailContent } from "@/components/stories/StoryDetailContent";
import { getStoryBySlug, getStories, getStartups } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { notFound, redirect } from "next/navigation";
import { resolveRedirect } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function getAbsoluteImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    return url.startsWith("/") ? `${API_BASE.replace("/api", "")}${url}` : `${API_BASE.replace("/api", "")}/${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const story = await getStoryBySlug(slug);
        if (!story) return { title: "Story Not Found" };
        const canonical = `${SITE_URL}/stories/${story.slug}`;
        const description = story.meta_description || story.excerpt || (story.content?.slice(0, 160) ?? "Startup story on StartupSaga.in");
        const ogImage = getAbsoluteImageUrl(story.thumbnail);
        const title = story.meta_title || `${story.title} | StartupSaga.in`;
        return {
            title,
            description,
            keywords: story.meta_keywords,
            alternates: {
                canonical,
            },
            openGraph: {
                title,
                description,
                url: canonical,
                type: "article",
                images: [{ url: ogImage }],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [ogImage],
            },
        };
    } catch (error) {
        return { title: "Story Not Found" };
    }
}

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const redirectTo = await resolveRedirect(`/stories/${slug}`);
    if (redirectTo) redirect(redirectTo);
    try {
        const [story, allStories, allStartups] = await Promise.all([
            getStoryBySlug(slug),
            getStories(),
            getStartups()
        ]);

        if (!story) {
            notFound();
        }

        const stories = Array.isArray(allStories) ? allStories : (allStories as any)?.results || [];
        const startups = Array.isArray(allStartups) ? allStartups : (allStartups as any)?.results || [];

        // Related stories: same category or same city, excluding current story
        const relatedStories = stories
            .filter((s: any) => s.slug !== story.slug && (s.categorySlug === story.categorySlug || s.citySlug === story.citySlug))
            .slice(0, 3);

        // Fallback to latest stories if none related
        if (relatedStories.length === 0) {
            relatedStories.push(...stories.filter((s: any) => s.slug !== story.slug).slice(0, 3));
        }

        // Startups by category
        const categoryStartups = startups
            .filter((s: any) => s.categorySlug === story.categorySlug)
            .slice(0, 4);

        const canonical = `${SITE_URL}/stories/${story.slug}`;
        const description = story.meta_description || story.excerpt || (story.content?.slice(0, 160) ?? "Startup story on StartupSaga.in");
        const ogImage = getAbsoluteImageUrl(story.thumbnail);

        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: story.title,
            description,
            image: ogImage,
            author: {
                "@type": "Person",
                name: story.author || "Editorial Team",
            },
            publisher: {
                "@type": "Organization",
                name: "StartupSaga.in",
                logo: {
                    "@type": "ImageObject",
                    url: `${SITE_URL}/og-image.jpg`,
                },
            },
            datePublished: story.published_at || undefined,
            dateModified: story.updated_at || undefined,
            mainEntityOfPage: canonical,
        };

        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: SITE_URL,
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Stories",
                    item: `${SITE_URL}/stories`,
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: story.title,
                    item: canonical,
                },
            ],
        };

        return (
            <>
                <JsonLd data={articleSchema} />
                <JsonLd data={breadcrumbSchema} />
                <Layout>
                    <StoryDetailContent
                        story={story}
                        relatedStories={relatedStories}
                        categoryStartups={categoryStartups}
                    />
                </Layout>
            </>
        );
    } catch (error) {
        console.error("Error loading story:", error);
        notFound();
    }
}

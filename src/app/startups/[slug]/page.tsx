import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupDetailContent } from "@/components/startups/StartupDetailContent";
import { getStartupBySlug, getStories, getStartups, getSEOSettings } from "@/lib/api";
import { StartupPageSchema } from "@/components/seo/Schema/StartupPageSchema";
import { notFound, redirect } from "next/navigation";
import { resolveRedirect } from "@/lib/api";
import { SITE_URL } from "@/config/site";


const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [startup, seo] = await Promise.all([
        getStartupBySlug(slug),
        getSEOSettings().catch(() => ({})),
    ]);
    if (!startup || !startup.slug || (startup.is_active !== undefined && !startup.is_active)) {
        notFound();
    }
    // FIX-002: Respect canonical_override from CMS if set
    const canonical = startup.canonical_override
        ? (startup.canonical_override.startsWith("http") ? startup.canonical_override : `${SITE_URL}${startup.canonical_override.startsWith("/") ? "" : "/"}${startup.canonical_override}`)
        : `${SITE_URL}/startups/${startup.slug}`;
    const rawDescription = startup.meta_description || startup.tagline || startup.description || seo.default_meta_description;

    // FIX-006: Prefer og_image over logo (logos are often small/square)
    const ogImage = getAbsoluteImageUrl(startup.og_image || startup.logo);
    const rawTitle = startup.meta_title || `${startup.name}`;

    // Safety: strip accidental tags from CMS strings
    const title = (rawTitle || "").replace(/<[^>]*>?/gm, '');
    const description = (rawDescription || "").replace(/<[^>]*>?/gm, '');

    return {
        title: title.includes('|') ? { absolute: title } : title,
        description,
        keywords: startup.meta_keywords,
        alternates: { canonical },
        // FIX-002: Respect noindex from CMS
        ...(startup.noindex ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "StartupSaga.in",
            type: "website",
            locale: "en_IN",
            // FIX-005: Add width + height to OG image
            images: [{ url: ogImage, width: 1200, height: 630, alt: startup.name }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

// ISR: startup detail pages are cached for 1 hour then regenerated on next request
export const revalidate = 3600;

export default async function StartupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Cleanup routing for common accidental paths
    if (slug === 'startups') redirect('/startups');
    if (slug === 'categories') redirect('/categories');
    if (slug === 'cities') redirect('/cities');
    if (slug === 'stories') redirect('/stories');

    const redirectTo = await resolveRedirect(`/startups/${slug}`);
    if (redirectTo) redirect(redirectTo);

    // Fetch startup first to determine if we should 404 immediately
    const startup = await getStartupBySlug(slug);

    if (!startup || !startup.slug || (startup.is_active !== undefined && !startup.is_active)) {
        notFound();
    }

    const [allStories, allStartups] = await Promise.all([
        getStories(),
        getStartups()
    ]);

    const stories = Array.isArray(allStories) ? allStories : [];
    const startups = Array.isArray(allStartups) ? allStartups : [];

    const startupCategorySlug = startup.categorySlug || (typeof startup.category === 'object' ? startup.category?.slug : null);
    const relatedStories = stories.filter((s: { categorySlug?: string; category?: { slug?: string } | string }) => {
        const sCatSlug = s.categorySlug || (typeof s.category === 'object' ? (s.category as { slug?: string })?.slug : null);
        return sCatSlug && sCatSlug === startupCategorySlug;
    }).slice(0, 3);
    const currentCategorySlug = startup.categorySlug || (typeof startup.category === 'object' ? startup.category?.slug : null);
    const currentCitySlug = startup.citySlug || (typeof startup.city === 'object' ? startup.city?.slug : null);

    type StartupItem = {
        slug: string;
        categorySlug?: string;
        category?: { slug?: string } | string;
        citySlug?: string;
        city?: { slug?: string } | string;
        tagline?: string;
        description?: string;
    };

    const similarStartups = (startups as StartupItem[])
        .filter((s: StartupItem) => {
            if (s.slug === startup.slug) return false;
            const sCatSlug = s.categorySlug || (typeof s.category === 'object' ? (s.category as { slug?: string })?.slug : null);
            const sCitySlug = s.citySlug || (typeof s.city === 'object' ? (s.city as { slug?: string })?.slug : null);

            return (currentCategorySlug && sCatSlug === currentCategorySlug) ||
                (currentCitySlug && sCitySlug === currentCitySlug);
        })
        .sort((a: StartupItem, b: StartupItem) => {
            const aCatSlug = a.categorySlug || (typeof a.category === 'object' ? (a.category as { slug?: string })?.slug : null);
            const aCitySlug = a.citySlug || (typeof a.city === 'object' ? (a.city as { slug?: string })?.slug : null);
            const bCatSlug = b.categorySlug || (typeof b.category === 'object' ? (b.category as { slug?: string })?.slug : null);
            const bCitySlug = b.citySlug || (typeof b.city === 'object' ? (b.city as { slug?: string })?.slug : null);

            const scoreA = (currentCategorySlug && aCatSlug === currentCategorySlug ? 1 : 0) +
                (currentCitySlug && aCitySlug === currentCitySlug ? 1 : 0);
            const scoreB = (currentCategorySlug && bCatSlug === currentCategorySlug ? 1 : 0) +
                (currentCitySlug && bCitySlug === currentCitySlug ? 1 : 0);
            return scoreB - scoreA;
        })
        .slice(0, 4)
        .map((s: StartupItem) => ({ ...s, tagline: s.tagline || s.description?.slice(0, 140) }));


    const canonical = startup.canonical_override
        ? (startup.canonical_override.startsWith("http") ? startup.canonical_override : `${SITE_URL}${startup.canonical_override.startsWith("/") ? "" : "/"}${startup.canonical_override}`)
        : `${SITE_URL}/startups/${startup.slug}`;

    return (
        <>
            <StartupPageSchema startup={startup} canonical={canonical} />
            <Layout>
                <StartupDetailContent
                    startup={{ ...startup, tagline: startup.tagline || startup.description?.slice(0, 140) }}
                    relatedStories={relatedStories}
                    similarStartups={similarStartups}
                />
            </Layout>
        </>
    );
}

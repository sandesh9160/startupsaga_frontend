import type { Metadata } from "next";
import { Story, Startup } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { CityDetailContent } from "@/components/cities/CityDetailContent";
import { getCityBySlug, getCategories, getCities, resolveRedirect, getSEOSettings } from "@/lib/api";
import { JsonLd } from "@/components/seo/Schema/JsonLd";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { SITE_URL } from "@/config/site";
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const [city, seo] = await Promise.all([
        getCityBySlug(slug),
        getSEOSettings().catch(() => ({})),
    ]);
    if (!city || !city.slug) {
        notFound();
    }
    // Respect canonical_override from CMS if set
    const canonical = city.canonical_override || `${SITE_URL}/cities/${slug}`;
    const rawDescription = city.meta_description || city.description || seo.default_meta_description || `Explore startups and stories from ${city.name}.`;
    const ogImage = getAbsoluteImageUrl(city.og_image || city.image);
    const rawTitle = city.meta_title || `Startups in ${city.name}`;

    // Security: strip tags
    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title: title,
        description,
        keywords: [
            ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
            ...(Array.isArray(city.meta_keywords) ? city.meta_keywords : [city.meta_keywords || ""])
        ].filter(Boolean).join(", "),
        alternates: { canonical },
        // Respect noindex from CMS
        ...(city.noindex ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title,
            description,
            url: canonical,
            type: "website",
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

// ISR: city detail pages cached for 1 hour
// Force dynamic to ensure notFound() returns a real 404 status in the network tab
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 3600;

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Preliminary check for navigation
    if (slug === "cities") redirect("/cities");
    if (slug === "startups") redirect("/startups");
    if (slug === "categories") redirect("/categories");
    if (slug === "stories") redirect("/stories");

    // Parallelize redirect check and city fetch (primes cache)
    const [redirectTo] = await Promise.all([
        resolveRedirect(`/cities/${slug}`),
        getCityBySlug(slug),
    ]);

    if (redirectTo) redirect(redirectTo);

    return (
        <Layout>
            <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
                <CityContent slug={slug} />
            </Suspense>
        </Layout>
    );
}

/**
 * Async content component for city detail.
 */
async function CityContent({ slug }: { slug: string }) {
    const cityData = await getCityBySlug(slug);

    if (!cityData || !cityData.slug) {
        notFound();
    }

    // 1. LCP is handled by next/image with priority={true} in CityDetailContent.
    // Manual preloading here using the raw API URL causes "preloaded but not used" warnings 
    // because next/image uses the /_next/image proxy URL.
    const [allCategories, allCities] = await Promise.all([
        getCategories(),
        getCities()
    ]);

    const city = {
        name: cityData.name,
        slug: cityData.slug,
        description: cityData.description,
        image: cityData.image,
        state: cityData.state,
        startupCount: cityData.startupCount ?? (cityData.startups || []).length,
        storyCount: cityData.storyCount ?? (cityData.stories || []).length,
    };
    const cityStartups = (cityData.startups || []).map((s: Startup) => ({
        slug: s.slug || "",
        name: s.name || s.title || "",
        logo: s.logo || s.og_image || "",
        category: s.category || "",
        city: s.city || cityData.name || "",
        stage: s.stage || "",
        funding_stage: s.funding_stage || s.stage || "",
        team_size: s.team_size || "",
        tagline: s.tagline || (typeof s.description === 'string' ? s.description.slice(0, 140) : ""),
        description: "",
    }));
    const cityStories = (cityData.stories || []).map((s: Story) => ({
        slug: s.slug || "",
        title: s.title || "",
        excerpt: typeof s.excerpt === 'string' ? s.excerpt.slice(0, 200) : (typeof s.content === 'string' ? s.content.slice(0, 200) : ""),
        content: "",
        thumbnail: s.thumbnail || s.og_image || "",
        category: s.category || "",
        category_slug: s.category_slug || "",
        city: s.city || cityData.name || "",
        city_slug: s.city_slug || cityData.slug || "",
        publish_date: s.publish_date || s.publishDate || "",
        publishDate: s.publishDate || s.publish_date || "",
        author: s.author || s.author_name || "",
        author_name: s.author_name || s.author || "",
        read_time: s.read_time || null,
    }));
    const topCategories = (Array.isArray(allCategories) ? allCategories : []).slice(0, 4);
    const canonical = `${SITE_URL}/cities/${slug}`;
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Cities", item: `${SITE_URL}/cities` },
            { "@type": "ListItem", position: 3, name: city.name, item: canonical },
        ],
    };

    return (
        <>
            <JsonLd data={breadcrumbSchema} />
            <CityDetailContent
                city={city}
                cityStartups={cityStartups}
                cityStories={cityStories}
                topCategories={topCategories}
                allCities={allCities}
            />
        </>
    );
}

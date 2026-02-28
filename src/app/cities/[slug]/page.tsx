import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CityDetailContent } from "@/components/cities/CityDetailContent";
import { getCityBySlug, getCategories, getCities } from "@/lib/api";
import { JsonLd } from "@/components/seo/Schema/JsonLd";
import { notFound, redirect } from "next/navigation";
import { resolveRedirect } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url: string | null | undefined): string {
    if (!url) return `${SITE_URL}/og-image.jpg`;
    if (url.startsWith("http")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const city = await getCityBySlug(slug);
    if (!city) notFound();
    // Respect canonical_override from CMS if set
    const canonical = city.canonical_override || `${SITE_URL}/cities/${slug}`;
    const description = city.meta_description || city.description || `Explore startups and stories from ${city.name}.`;
    const ogImage = getAbsoluteImageUrl(city.og_image || city.image);
    const title = city.meta_title || `Startups in ${city.name} | StartupSaga.in`;
    return {
        title,
        description,
        keywords: city.meta_keywords,
        alternates: { canonical },
        // Respect noindex from CMS
        ...(city.noindex ? { robots: { index: false, follow: false } } : {}),
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "StartupSaga.in",
            type: "website",
            locale: "en_IN",
            images: [{ url: ogImage, width: 1200, height: 630, alt: city.name }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (slug === "cities") redirect("/cities");
    if (slug === "startups") redirect("/startups");
    if (slug === "categories") redirect("/categories");
    if (slug === "stories") redirect("/stories");

    const redirectTo = await resolveRedirect(`/cities/${slug}`);
    if (redirectTo) redirect(redirectTo);

    // Fetch city data first to determine if we should 404 immediately
    const cityData = await getCityBySlug(slug);

    if (!cityData) {
        notFound();
    }

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
    const cityStartups = (cityData.startups || []).map((s: any) => ({
        ...s,
        tagline: s.tagline || s.description?.slice(0, 140) || s.description,
    }));
    const cityStories = cityData.stories || [];
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
            <Layout>
                <CityDetailContent
                    city={city}
                    cityStartups={cityStartups}
                    cityStories={cityStories}
                    topCategories={topCategories}
                    allCities={allCities}
                />
            </Layout>
        </>
    );
}

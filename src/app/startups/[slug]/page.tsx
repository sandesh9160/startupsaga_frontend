import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupDetailContent } from "@/components/startups/StartupDetailContent";
import { getStartupBySlug, getStories, getStartups } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
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
    try {
        const startup = await getStartupBySlug(slug);
        if (!startup) return { title: "Startup Not Found" };
        const canonical = `${SITE_URL}/startups/${startup.slug}`;
        const description = startup.meta_description || startup.tagline || startup.description;
        const ogImage = getAbsoluteImageUrl(startup.logo);
        const title = startup.meta_title || `${startup.name} | StartupSaga.in`;
        return {
            title,
            description,
            keywords: startup.meta_keywords,
            alternates: { canonical },
            openGraph: {
                title,
                description,
                url: canonical,
                type: "website",
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
        return { title: "Startup Not Found" };
    }
}

export default async function StartupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const redirectTo = await resolveRedirect(`/startups/${slug}`);
    if (redirectTo) redirect(redirectTo);
    try {
        const [startup, allStories, allStartups] = await Promise.all([
            getStartupBySlug(slug),
            getStories(),
            getStartups()
        ]);

        if (!startup) {
            notFound();
        }

        const stories = Array.isArray(allStories) ? allStories : (allStories as any)?.results || [];
        const startups = Array.isArray(allStartups) ? allStartups : [];

        const startupCategorySlug = startup.categorySlug || (typeof startup.category === 'object' ? startup.category?.slug : null);
        const relatedStories = stories.filter((s: any) => {
            const sCatSlug = s.categorySlug || (typeof s.category === 'object' ? s.category?.slug : null);
            return sCatSlug && sCatSlug === startupCategorySlug;
        }).slice(0, 3);
        const currentCategorySlug = startup.categorySlug || (typeof startup.category === 'object' ? startup.category?.slug : null);
        const currentCitySlug = startup.citySlug || (typeof startup.city === 'object' ? startup.city?.slug : null);

        const similarStartups = startups
            .filter((s: any) => {
                if (s.slug === startup.slug) return false;
                const sCatSlug = s.categorySlug || (typeof s.category === 'object' ? s.category?.slug : null);
                const sCitySlug = s.citySlug || (typeof s.city === 'object' ? s.city?.slug : null);

                return (currentCategorySlug && sCatSlug === currentCategorySlug) ||
                    (currentCitySlug && sCitySlug === currentCitySlug);
            })
            .sort((a: any, b: any) => {
                const aCatSlug = a.categorySlug || (typeof a.category === 'object' ? a.category?.slug : null);
                const aCitySlug = a.citySlug || (typeof a.city === 'object' ? a.city?.slug : null);
                const bCatSlug = b.categorySlug || (typeof b.category === 'object' ? b.category?.slug : null);
                const bCitySlug = b.citySlug || (typeof b.city === 'object' ? b.city?.slug : null);

                const scoreA = (currentCategorySlug && aCatSlug === currentCategorySlug ? 1 : 0) +
                    (currentCitySlug && aCitySlug === currentCitySlug ? 1 : 0);
                const scoreB = (currentCategorySlug && bCatSlug === currentCategorySlug ? 1 : 0) +
                    (currentCitySlug && bCitySlug === currentCitySlug ? 1 : 0);
                return scoreB - scoreA;
            })
            .slice(0, 4)
            .map((s: any) => ({ ...s, tagline: s.tagline || s.description?.slice(0, 140) }));

        const canonical = `${SITE_URL}/startups/${startup.slug}`;
        const orgSchema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: startup.name,
            url: canonical,
            description: startup.description,
        };

        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Startups", item: `${SITE_URL}/startups` },
                { "@type": "ListItem", position: 3, name: startup.name, item: canonical },
            ],
        };

        return (
            <>
                <JsonLd data={orgSchema} />
                <JsonLd data={breadcrumbSchema} />
                <Layout>
                    <StartupDetailContent
                        startup={{ ...startup, tagline: startup.tagline || startup.description?.slice(0, 140) }}
                        relatedStories={relatedStories}
                        similarStartups={similarStartups}
                    />
                </Layout>
            </>
        );
    } catch (error) {
        console.error("Error loading startup:", error);
        notFound();
    }
}

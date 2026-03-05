import { Layout } from "@/components/layout/Layout";
import { CategoryDetailContent } from "@/components/categories/CategoryDetailContent";
import { getCategoryBySlug, getCities, resolveRedirect, getSEOSettings } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/Schema/JsonLd";
import { SITE_URL } from "@/config/site";
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return `${SITE_URL}/og-image.jpg`;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  const [category, seo] = await Promise.all([
    getCategoryBySlug(slug),
    getSEOSettings().catch(() => ({})),
  ]);

  if (!category || !category.slug) {
    notFound();
  }

  const rawTitle = category.meta_title || `${category.name} Startups in India`;
  const rawDescription =
    category.meta_description ||
    category.description ||
    seo.default_meta_description ||
    `Explore top ${category.name} startups in India.`;

  // Safety: strip tags
  const title = rawTitle.replace(/<[^>]*>?/gm, '');
  const description = rawDescription.replace(/<[^>]*>?/gm, '');

  // Respect canonical_override from CMS if set
  const canonical = category.canonical_override || `${SITE_URL}/categories/${slug}`;
  const ogImage = getAbsoluteImageUrl(category.og_image);

  return {
    title: title,
    description,
    keywords: [
      ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
      ...(Array.isArray(category.meta_keywords) ? category.meta_keywords : [category.meta_keywords || ""])
    ].filter(Boolean).join(", "),
    alternates: { canonical },
    // Respect noindex from CMS
    ...(category.noindex ? { robots: { index: false, follow: false } } : {}),
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

/**
 * Category page
 */
// ISR: category detail pages cached for 1 hour
export const revalidate = 3600;

export default async function CategoryDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (slug === "categories") redirect("/categories");
  if (slug === "startups") redirect("/startups");
  if (slug === "cities") redirect("/cities");
  if (slug === "stories") redirect("/stories");

  const redirectTo = await resolveRedirect(`/categories/${slug}`);
  if (redirectTo) redirect(redirectTo);

  // Fetch category data first to determine if we should 404 immediately
  const categoryData = await getCategoryBySlug(slug);

  if (!categoryData || !categoryData.slug) {
    notFound();
  }

  const [allCities] = await Promise.all([
    getCities(),
  ]);

  const category = {
    name: categoryData.name,
    slug: categoryData.slug,
    description: categoryData.description,
    icon: categoryData.icon,
    startupCount: categoryData.startupCount ?? (categoryData.startups || []).length,
  };
  const categoryStartups = (categoryData.startups || []).map((s: { slug: string; description?: string;[key: string]: unknown }) => ({
    ...s,
    tagline: s.description?.slice(0, 140) || s.description,
  }));
  const categoryStories = categoryData.stories || [];
  const topCities = (Array.isArray(allCities) ? allCities : []).slice(0, 4);
  const canonical = `${SITE_URL}/categories/${slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: canonical },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Layout>
        <CategoryDetailContent
          category={category}
          categoryStartups={categoryStartups}
          categoryStories={categoryStories}
          topCities={topCities}
        />
      </Layout>
    </>
  );
}

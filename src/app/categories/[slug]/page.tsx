import { Layout } from "@/components/layout/Layout";
import { CategoryDetailContent } from "@/components/categories/CategoryDetailContent";
import { getCategoryBySlug, getCities } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { resolveRedirect } from "@/lib/api";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";

function getAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return `${BASE_URL}/og-image.jpg`;
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;

  try {
    const category = await getCategoryBySlug(slug);
    if (!category) {
      return {
        title: "Category Not Found | StartupSaga.in",
        description: "The requested category does not exist.",
      };
    }

    const title = category.meta_title || `${category.name} Startups in India | StartupSaga.in`;
    const description =
      category.meta_description ||
      category.description ||
      `Explore top ${category.name} startups in India.`;

    const canonical = `${BASE_URL}/categories/${slug}`;
    const ogImage = getAbsoluteImageUrl(category.og_image);

    return {
      title,
      description,
      keywords: category.meta_keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: "StartupSaga.in",
        type: "website",
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: "Category Not Found | StartupSaga.in",
      description: "The requested category does not exist.",
    };
  }
}

/**
 * Category page
 */
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

  try {
    const [categoryData, allCities] = await Promise.all([
      getCategoryBySlug(slug),
      getCities(),
    ]);

    if (!categoryData) {
      notFound();
    }

    const category = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      icon: categoryData.icon,
    };
    const categoryStartups = (categoryData.startups || []).map((s: any) => ({
      ...s,
      tagline: s.description?.slice(0, 140) || s.description,
    }));
    const categoryStories = categoryData.stories || [];
    const topCities = (Array.isArray(allCities) ? allCities : []).slice(0, 4);

    const canonical = `${BASE_URL}/categories/${slug}`;
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Categories", item: `${BASE_URL}/categories` },
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
  } catch (error) {
    console.error("Error loading category:", error);
    notFound();
  }
}

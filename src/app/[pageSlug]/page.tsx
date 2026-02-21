import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { notFound, redirect } from "next/navigation";
import { getPageBySlug, resolveRedirect, getSections } from "@/lib/api";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageSections } from "@/components/sections/PageSections";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const RESERVED_SLUGS = [
    "stories", "startups", "categories", "cities", "submit",
    "dashboard", "admin", "api", "sitemap.xml", "robots.txt", "favicon.ico"
];

export async function generateMetadata({ params }: { params: Promise<{ pageSlug: string }> }): Promise<Metadata> {
    const { pageSlug } = await params;
    if (RESERVED_SLUGS.includes(pageSlug)) return {};
    try {
        const page = await getPageBySlug(pageSlug);
        if (!page) return { title: "Page Not Found" };
        const canonical = `${SITE_URL}/${page.slug}`;
        return {
            title: page.meta_title || `${page.title} | StartupSaga.in`,
            description: page.meta_description || page.content?.slice(0, 160) || "",
            alternates: { canonical },
            openGraph: {
                title: page.meta_title || `${page.title} | StartupSaga.in`,
                description: page.meta_description || "",
                url: canonical,
            },
        };
    } catch {
        return { title: "Page Not Found" };
    }
}

export default async function StaticPageRoute({ params }: { params: Promise<{ pageSlug: string }> }) {
    const { pageSlug } = await params;
    if (RESERVED_SLUGS.includes(pageSlug)) {
        notFound();
    }

    // Special case: Redirect /home to /
    if (pageSlug === 'home') {
        redirect('/');
    }

    const redirectTo = await resolveRedirect(`/${pageSlug}`);
    if (redirectTo) redirect(redirectTo);

    try {
        const [page, slugSections] = await Promise.all([
            getPageBySlug(pageSlug),
            getSections('', pageSlug) // Fetch by slug via sections_list endpoint
        ]);

        if (!page) notFound();

        // Use sections from sections_list endpoint first.
        // Fall back to sections embedded in page_detail response (page.sections).
        // This ensures content shows even if one endpoint has stale cache.
        const sections = (slugSections && slugSections.length > 0)
            ? slugSections
            : ((page as any).sections || []);

        const hasSections = sections && sections.length > 0;

        const canonical = `${SITE_URL}/${page.slug}`;
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: page.title, item: canonical },
            ],
        };

        return (
            <>
                <JsonLd data={breadcrumbSchema} />
                <Layout>
                    {hasSections ? (
                        <PageSections pageSlug={pageSlug} initialSections={sections} />
                    ) : (
                        <div className="container-wide py-12 md:py-20">
                            <article>
                                <h1 className="text-4xl font-bold font-serif text-foreground mb-8">{page.title}</h1>
                                <div
                                    className="prose prose-lg max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: page.content || "" }}
                                />
                            </article>
                        </div>
                    )}
                </Layout>
            </>
        );
    } catch {
        notFound();
    }
}

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
        // Respect canonical_override from CMS if set
        const canonical = page.canonical_override || `${SITE_URL}/${page.slug}`;
        const title = page.meta_title || `${page.title} | StartupSaga.in`;
        const description = page.meta_description || page.content?.replace(/<[^>]*>?/gm, '').slice(0, 160) || "";
        return {
            title,
            description,
            alternates: { canonical },
            // Respect noindex from CMS
            ...(page.noindex ? { robots: { index: false, follow: false } } : {}),
            openGraph: {
                title,
                description,
                url: canonical,
                siteName: "StartupSaga.in",
                type: "website",
                locale: "en_IN",
                images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
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
                                <h1 className="text-4xl font-semibold font-serif text-foreground mb-8">{page.title}</h1>
                                <div
                                    className="prose prose-zinc prose-sm max-w-none leading-relaxed
                                        prose-headings:font-semibold prose-headings:text-zinc-900 prose-headings:tracking-tight
                                        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:font-serif prose-h2:leading-[1.2]
                                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-serif
                                        prose-p:text-zinc-600 prose-p:mb-6 prose-p:text-[18px] prose-p:leading-relaxed
                                        prose-strong:text-zinc-900 prose-strong:font-bold
                                        prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10"
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

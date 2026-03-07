import { Layout } from "@/components/layout/Layout";
import { SubmitContent } from "@/components/submit/SubmitContent";
import { SITE_URL } from "@/config/site";

import type { Metadata } from "next";
import { getPageBySlug, getSEOSettings } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([
        getPageBySlug('submit').catch(() => null),
        getSEOSettings().catch(() => ({})),
    ]);

    const rawTitle = page?.meta_title || "Submit Your Startup | StartupSaga.in";
    const rawDescription = page?.meta_description || "Share your startup story with the world. Submit your details, founder journey, and vision to be featured on StartupSaga.";

    const title = rawTitle.replace(/<[^>]*>?/gm, '');
    const description = rawDescription.replace(/<[^>]*>?/gm, '');

    return {
        title,
        description,
        keywords: [
            ...(Array.isArray(seo.global_keywords) ? seo.global_keywords : [seo.global_keywords || ""]),
            ...(page?.meta_keywords ? (Array.isArray(page.meta_keywords) ? page.meta_keywords : [page.meta_keywords]) : [])
        ].filter(Boolean).join(", "),
        alternates: {
            canonical: `${SITE_URL}/submit`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/submit`,
            siteName: "StartupSaga.in",
            type: "website",
            images: [{ url: page?.og_image || "/og-image.jpg", width: 1200, height: 630, alt: "Submit Your Startup" }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [page?.og_image || "/og-image.jpg"],
        },
    };
}


export default function SubmitPage() {
    return (
        <Layout>
            <SubmitContent />
        </Layout>
    );
}

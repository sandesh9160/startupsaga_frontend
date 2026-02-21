import { Suspense } from "react";
import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StoriesContent } from "@/components/stories/StoriesContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
    const resolved = searchParams ? await searchParams : undefined;
    const hasQuery = !!(resolved && Object.keys(resolved).length > 0);
    return {
        title: "Startup Stories in India | StartupSaga.in",
        description:
            "Explore the latest Indian startup stories, founder journeys, funding rounds, and growth strategies.",
        alternates: {
            canonical: `${SITE_URL}/stories`,
        },
        robots: hasQuery ? { index: false, follow: true } : undefined,
    };
}

export default function StoriesPage() {
    return (
        <Layout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <StoriesContent />
            </Suspense>
        </Layout>
    );
}

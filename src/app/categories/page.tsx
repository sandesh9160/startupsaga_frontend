import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CategoriesContent } from "@/components/categories/CategoriesContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Startup Categories | StartupSaga.in",
    description:
        "Explore startups by industry. From fintech to healthtech, edtech to SaaS, discover companies transforming every sector of India’s economy.",
    alternates: {
        canonical: `${SITE_URL}/categories`,
    },
};

export default function CategoriesPage() {
    return (
        <Layout>
            <CategoriesContent />
        </Layout>
    );
}

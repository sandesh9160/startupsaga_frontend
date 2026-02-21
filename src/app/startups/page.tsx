import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { StartupsContent } from "@/components/startups/StartupsContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Startups in India | StartupSaga.in",
    description:
        "Explore India’s most innovative startups across fintech, edtech, healthtech, and more.",
    alternates: {
        canonical: `${SITE_URL}/startups`,
    },
};

export default function StartupsPage() {
    return (
        <Layout>
            <StartupsContent />
        </Layout>
    );
}

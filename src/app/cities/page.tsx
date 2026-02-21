import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { CitiesContent } from "@/components/cities/CitiesContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Startup Cities in India | StartupSaga.in",
    description:
        "Explore India’s thriving startup hubs. From Bengaluru to Mumbai, discover where innovation happens.",
    alternates: {
        canonical: `${SITE_URL}/cities`,
    },
};

export default function CitiesPage() {
    return (
        <Layout>
            <CitiesContent />
        </Layout>
    );
}

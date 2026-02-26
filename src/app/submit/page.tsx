import { Layout } from "@/components/layout/Layout";
import { SubmitContent } from "@/components/submit/SubmitContent";


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
    title: "Submit Your Startup | StartupSaga.in",
    description: "Share your startup story with the world. Submit your details, founder journey, and vision to be featured on StartupSaga.",
    alternates: {
        canonical: `${SITE_URL}/submit`,
    },
    openGraph: {
        title: "Submit Your Startup | StartupSaga.in",
        description: "Share your startup story with the world. Submit your details, founder journey, and vision to be featured on StartupSaga.",
        url: `${SITE_URL}/submit`,
        siteName: "StartupSaga.in",
        type: "website",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Submit Your Startup to StartupSaga.in" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Submit Your Startup | StartupSaga.in",
        description: "Share your startup story with the world. Submit your details, founder journey, and vision to be featured on StartupSaga.",
        images: ["/og-image.jpg"],
    },
};


export default function SubmitPage() {
    return (
        <Layout>
            <SubmitContent />
        </Layout>
    );
}

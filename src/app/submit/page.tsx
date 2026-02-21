import { Layout } from "@/components/layout/Layout";
import { SubmitContent } from "@/components/submit/SubmitContent";

export const metadata = {
    title: "Submit Your Startup | StartupSaga.in",
    description: "Share your startup story with the world. Submit your details, founder journey, and vision to be featured on StartupSaga.",
};

export default function SubmitPage() {
    return (
        <Layout>
            <SubmitContent />
        </Layout>
    );
}

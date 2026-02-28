// Removed unnecessary "use client" to allow async Layout component usage

import { Layout } from "@/components/layout/Layout";

export default function Loading() {
    return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        </Layout>
    );
}

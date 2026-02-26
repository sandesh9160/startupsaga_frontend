
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { UnsubscribeContent } from "./UnsubscribeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unsubscribe | StartupSaga.in",
    description: "Unsubscribe from the StartupSaga newsletter.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function UnsubscribePage() {
    return (
        <main className="min-h-[70vh] flex items-center justify-center p-4 bg-zinc-50">
            <Suspense fallback={
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-zinc-400 animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Loading...</p>
                </div>
            }>
                <UnsubscribeContent />
            </Suspense>
        </main>
    );
}

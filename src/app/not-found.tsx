import Link from "next/link";
import Image from "next/image";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function NotFound() {
    const notFoundImageUrl = `${API_BASE_URL.replace("/api", "")}/media/site/not-found.png`;

    return (
        <Layout>
            <div className="flex min-h-[70vh] items-center justify-center bg-white px-4">
                <div className="text-center max-w-2xl w-full flex flex-col items-center">

                    {/* Robot Illustration */}
                    <div className="relative w-full max-w-[400px] aspect-square mb-6">
                        <Image
                            src={notFoundImageUrl}
                            alt="404 Page Not Found"
                            fill
                            className="object-contain mix-blend-multiply"
                            priority
                        />
                    </div>

                    {/* Typography */}
                    <h1 className="mb-4 text-4xl md:text-6xl font-black text-[#0F172A] font-serif tracking-tight leading-tight">
                        Journey Interrupted <span className="text-[#FF4F18]">404</span>
                    </h1>
                    <p className="mb-10 text-lg md:text-xl text-zinc-500 font-medium leading-relaxed max-w-lg">
                        The startup story you're looking for has moved or hasn't been founded yet. Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
                        <Button asChild className="h-14 px-10 rounded-2xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold text-lg shadow-lg shadow-orange-600/20 transition-all active:scale-95 group w-full sm:w-auto">
                            <Link href="/">
                                <Home className="mr-2 w-5 h-5" />
                                Return Home
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-14 px-10 rounded-2xl border-zinc-200 text-[#0F172A] font-bold text-lg hover:bg-zinc-50 transition-all active:scale-95 w-full sm:w-auto">
                            <Link href="/stories">
                                <Search className="mr-2 w-5 h-5" />
                                Browse Stories
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

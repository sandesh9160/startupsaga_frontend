import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function NotFound() {
    const notFoundImageUrl = `${API_BASE_URL.replace("/api", "")}/media/site/not-found.png`;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fafbfc]">
            <div className="text-center p-8 max-w-2xl w-full flex flex-col items-center animate-fade-up">

                {/* Robot Illustration */}
                <div className="relative w-[300px] h-[300px] md:w-[350px] md:h-[350px] mb-8">
                    <img
                        src={notFoundImageUrl}
                        alt="No results found illustration"
                        className="object-contain w-full h-full mix-blend-multiply"
                    />
                </div>

                {/* Typography */}
                <h1 className="mb-4 text-4xl md:text-[52px] font-black text-[#7a95d7] tracking-tight leading-[1.1]">
                    Oops! Page Not Found
                </h1>
                <p className="mb-10 text-[18px] md:text-[20px] text-zinc-500 font-medium leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex justify-center items-center gap-6 ">
                    <Button asChild className="h-12 px-8 rounded-full bg-[#7a95d7] hover:bg-[#6881c2] text-white font-bold text-base tracking-wide shadow-lg shadow-[#7a95d7]/30 transition-all active:scale-95 group">
                        <Link href="/">
                            <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

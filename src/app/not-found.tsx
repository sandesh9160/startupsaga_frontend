import Link from "next/link";
import Image from "next/image";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function NotFound() {
  const notFoundImageUrl = `${API_BASE_URL.replace(
    "/api",
    ""
  )}/media/site/not-found.png`;

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-xl w-full text-center flex flex-col items-center">

          {/* Image */}
          <div className="relative w-72 h-72 mb-8">
            <Image
              src={notFoundImageUrl}
              alt="Page Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            The page you’re looking for doesn’t exist or may have been moved.
            Please check the URL or return to the homepage.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              asChild
              className="h-12 px-8 rounded-xl bg-[#F2542D] hover:bg-[#D94111] text-white font-semibold transition"
            >
              <Link href="/">
                <Home className="mr-2 w-5 h-5" />
                Go to Homepage
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 px-8 rounded-xl border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition"
            >
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
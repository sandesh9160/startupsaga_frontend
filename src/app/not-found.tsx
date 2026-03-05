import type { Metadata } from "next";
import { SITE_URL } from "@/config/site";
import Link from "next/link";
import Image from "next/image";
import { Home, Search, ArrowRight, BookOpen, Rocket, MapPin } from "lucide-react";


export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist on StartupSaga.in.",
  alternates: {
    canonical: `${SITE_URL}/404`,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {/* Minimal top bar */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xl text-[#0F172A] tracking-tight">
            Startup<span className="text-[#F2542D]">Saga</span><span className="text-zinc-400">.in</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-[#F2542D] transition-colors"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text Content */}
            <div className="order-2 lg:order-1">
              {/* Error badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0EB] border border-orange-100 text-[#F2542D] text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2542D] animate-pulse" />
                404 — Page Not Found
              </div>

              <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#0F172A] leading-[1.1] tracking-tight mb-4">
                Looks like this story hasn&apos;t been written yet.
              </h1>

              <p className="text-base text-zinc-500 leading-relaxed mb-8 max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                But don&apos;t worry — India&apos;s best startup stories are just a click away.
              </p>

              {/* Primary actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[#F2542D] hover:bg-[#D94111] text-white font-bold text-sm transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30 hover:-translate-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  Go to Homepage
                </Link>
                <Link
                  href="/stories"
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white border border-zinc-200 text-[#0F172A] font-bold text-sm transition-all hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  Browse Stories
                </Link>
              </div>

              {/* Quick navigation */}
              <div className="border-t border-zinc-100 pt-8">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  Explore these sections
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { href: "/startups", label: "Startups", icon: Rocket, desc: "3000+ profiles" },
                    { href: "/stories", label: "Stories", icon: BookOpen, desc: "Founder journeys" },
                    { href: "/cities", label: "Cities", icon: MapPin, desc: "Top ecosystems" },
                  ].map(({ href, label, icon: Icon, desc }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex items-center gap-3 p-3.5 rounded-xl border border-zinc-100 bg-white hover:border-orange-100 hover:bg-[#FFF8F5] transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                        <Icon className="w-4 h-4 text-[#F2542D]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#0F172A] leading-none mb-0.5">{label}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">{desc}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 ml-auto group-hover:text-[#F2542D] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {/* Decorative blobs */}
                <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-orange-50/80 blur-3xl pointer-events-none" />

                {/* 404 large text behind image */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[12rem] font-black font-serif text-zinc-100 select-none pointer-events-none leading-none"
                >
                  404
                </div>

                {/* Image */}
                <div className="relative w-72 h-72 md:w-96 md:h-96 z-10">
                  <Image
                    src="/not-found.png"
                    alt="Page not found illustration"
                    fill
                    className="object-contain drop-shadow-xl"
                    priority
                    sizes="(max-width: 768px) 288px, 384px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="border-t border-zinc-200 py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-zinc-400 font-medium">
          <span>© {new Date().getFullYear()} StartupSaga.in — India&apos;s Startup Story Platform</span>
          <div className="flex items-center gap-6">
            <Link href="/stories" className="hover:text-[#F2542D] transition-colors">Stories</Link>
            <Link href="/startups" className="hover:text-[#F2542D] transition-colors">Startups</Link>
            <Link href="/cities" className="hover:text-[#F2542D] transition-colors">Cities</Link>
            <Link href="/submit" className="hover:text-[#F2542D] transition-colors">Submit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterProps {
  title?: string;
  description?: string;
  buttonText?: string;
  align?: string;
  paddingY?: number | null;
  bgColor?: string;
}

export function Newsletter({ title, description, buttonText, align = 'center', paddingY, bgColor }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const { subscribeNewsletter } = await import("@/lib/api");
      await subscribeNewsletter(email);
      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-12 md:py-16"
      style={{
        backgroundColor: bgColor?.startsWith('#') ? bgColor : (bgColor ? '#' + bgColor : 'transparent'),
      }}
    >
      <div className="container-wide">
        <div className="bg-[#15233D] rounded-[32px] p-8 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle Decorative Glows */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-tight leading-tight">
                {title || "Stay Updated with India's Startup Ecosystem"}
              </h2>
              <p className="text-zinc-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
                {description || "Get the latest funding news, founder stories, and industry insights delivered to your inbox every week."}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-white/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-400/20 backdrop-blur-sm">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">You're on the list!</h4>
                  <p className="text-zinc-400">Check your inbox for a confirmation email coming soon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-14 bg-white/10 border-white/10 text-white placeholder:text-zinc-500 text-lg rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-white/20 transition-all backdrop-blur-sm"
                        required
                        disabled={isSubmitting}
                        suppressHydrationWarning
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-14 px-10 rounded-2xl bg-[#F2542D] hover:bg-[#E54820] text-white font-bold text-lg shadow-lg shadow-orange-950/20 transition-all active:scale-[0.98] whitespace-nowrap"
                      disabled={isSubmitting}
                      suppressHydrationWarning
                    >
                      {isSubmitting ? "Subscribing..." : (buttonText || "Subscribe")}
                    </Button>
                  </form>
                  {error && (
                    <p className="text-rose-400 text-sm animate-shake">
                      {error}
                    </p>
                  )}
                  <p className="text-[11px] md:text-xs text-zinc-500 font-medium">
                    Join 50,000+ founders, investors, and startup enthusiasts. Unsubscribe anytime.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

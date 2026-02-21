"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export function Newsletter() {
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
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-alt py-12 md:py-16">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6">
            <Mail className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Updated with Startup Stories
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Get the latest startup stories, founder insights, and ecosystem updates
            delivered to your inbox every week.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 p-6 rounded-xl bg-accent/10 animate-fade-in">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-foreground font-medium">
                Thanks for subscribing! Check your inbox soon.
              </span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 bg-background"
                  required
                  disabled={isSubmitting}
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="gap-2"
                  disabled={isSubmitting}
                  suppressHydrationWarning
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
              {error && (
                <p className="text-red-500 text-sm mt-2 animate-shake">
                  {error}
                </p>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}

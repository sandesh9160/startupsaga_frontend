/**
 * @file FAQSchema.tsx
 * @description Generates FAQPage JSON-LD schema for CMS pages with FAQ sections.
 *
 * Resolves FIX-011 from SEO Audit:
 * FAQ schema enables Google's FAQ rich results — accordion-style
 * Q&A directly in the SERP.
 *
 * Usage (in a CMS page with FAQ sections):
 *   <FAQSchema
 *     items={faqSection.settings?.items?.map((q: any) => ({
 *       question: q.question,
 *       answer: q.answer,
 *     }))}
 *   />
 *
 * Or directly:
 *   <FAQSchema items={[
 *     { question: "What is StartupSaga?", answer: "StartupSaga is..." },
 *     { question: "How do I submit my startup?", answer: "Visit /submit..." },
 *   ]} />
 */

import { JsonLd } from "./JsonLd";

export interface FAQItem {
    question: string;
    /** Plain text or minimal HTML answer */
    answer: string;
}

interface FAQSchemaProps {
    items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
    if (!items || items.length === 0) return null;

    // Strip HTML tags from answers for plain text in schema
    const stripHtml = (html: string) =>
        html.replace(/<[^>]*>?/gm, "").trim();

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: stripHtml(item.answer),
            },
        })),
    };

    return <JsonLd data={schema} />;
}

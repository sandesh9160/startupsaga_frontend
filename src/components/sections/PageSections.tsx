"use client";

import { HomeContent } from "@/components/home/HomeContent";
import { useEffect, useState } from "react";
import { getSections } from "@/lib/api";

interface PageSectionsProps {
    pageSlug: string;
    initialSections?: any[];
}

export function PageSections({ pageSlug, initialSections = [] }: PageSectionsProps) {
    const [sections, setSections] = useState(initialSections);
    const [isLoading, setIsLoading] = useState(initialSections.length === 0);

    useEffect(() => {
        if (initialSections.length === 0) {
            getSections('', pageSlug).then(data => {
                setSections(data || []);
                setIsLoading(false);
            });
        }
    }, [pageSlug]);

    if (isLoading) return null;
    if (sections.length === 0) return null;

    // We can reuse HomeContent by passing it the sections
    // but we need to satisfy other props too
    return (
        <HomeContent
            initialSections={sections}
            initialStories={[]}
            initialStartups={[]}
            initialCities={[]}
            initialCategories={[]}
            initialTrending={[]}
        />
    );
}

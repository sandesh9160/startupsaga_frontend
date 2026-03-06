import { DynamicSections } from "@/components/sections/DynamicSections";
import { getSections } from "@/lib/api";
import { PageSection } from "@/types";

interface PageSectionsProps {
    pageSlug: string;
    initialSections?: PageSection[];
}

export async function PageSections({ pageSlug, initialSections }: PageSectionsProps) {
    let sections = initialSections;

    if (!sections || sections.length === 0) {
        sections = await getSections('', pageSlug).catch(() => []);
    }

    if (!sections || sections.length === 0) return null;

    return (
        <DynamicSections
            sections={sections}
        />
    );
}

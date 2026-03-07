import { Suspense, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HeroSection } from "./HeroSection";
import { StoriesGridSection } from "./StoriesGridSection";
import { StartupsGridSection } from "./StartupsGridSection";
import { CityGridSection } from "./CityGridSection";
import { CategoryGridSection } from "./CategoryGridSection";
import { StatsSection } from "./StatsSection";
import { CtaSection } from "./CtaSection";
import { ImageSection } from "./ImageSection";
import { Newsletter } from "./Newsletter";
import { FAQSchema } from "@/components/seo/Schema/FAQSchema";
import {
    getTrendingStories,
    getStories,
    getStartups,
    getCities,
    getCategories,
    getPlatformStats
} from "@/lib/api";
import { Story, City, Category, PageSection, Startup } from "@/types";

interface DynamicSectionsProps {
    sections: PageSection[];
    // Transitioning to internal fetching, data prop is now optional for backward compatibility
    data?: {
        trendingStories?: Story[];
        latestStories?: Story[];
        featuredStartups?: Startup[];
        topCities?: City[];
        topCategories?: Category[];
        platformStats?: Record<string, number>;
        heroData?: { title: string, content: string };
    };
    defaultView?: ReactNode;
}

/**
 * Strip heavy fields from a section object before passing it to child components.
 * This prevents large JSON blobs (settings.cards, settings.items, data arrays, etc.)
 * from being serialized into the RSC payload, dramatically reducing HTML size.
 */
function toLeanSection(s: PageSection): PageSection {
    // Extract only the display-relevant fields from settings
    const settings = s.settings as Record<string, unknown> | undefined;
    const leanSettings = settings ? {
        backgroundColor: settings.backgroundColor,
        textColor: settings.textColor,
        paddingY: settings.paddingY,
        paddingX: settings.paddingX,
        align: settings.align,
        buttonStyle: settings.buttonStyle,
        secondaryButtonText: settings.secondaryButtonText,
        secondaryButtonLink: settings.secondaryButtonLink,
        extraButtons: settings.extraButtons,
        // Keep cards only for FAQ sections (needed for schema)
        ...(((s.section_type || s.type) === 'faq') ? { cards: settings.cards } : {}),
    } : undefined;

    return {
        id: s.id,
        section_type: s.section_type,
        type: s.type,
        title: s.title,
        name: s.name,
        description: s.description,
        subtitle: s.subtitle,
        content: s.content,
        order: s.order,
        is_active: s.is_active,
        link_url: s.link_url,
        link_text: s.link_text,
        image: s.image,
        settings: leanSettings,
    } as PageSection;
}

/** 
 * Wrappers for individual sections that fetch their own data
 */

async function TrendingStoriesWrapper({ ...props }: PageSection & { index: number }) {
    const data = await getTrendingStories().catch(() => []);
    return <StoriesGridSection {...props} stories={data} type="trending_stories" />;
}

async function LatestStoriesWrapper({ seededStories, seededTrending, ...props }: PageSection & { index: number; seededStories?: Story[]; seededTrending?: Story[] }) {
    // If stories were pre-fetched at the page level, skip fetch entirely (no Suspense waterfall)
    const [latest, trending] = seededStories && seededStories.length > 0
        ? [seededStories, seededTrending ?? []]
        : await Promise.all([
            getStories({ page_size: 6 }).catch(() => []),
            getTrendingStories().catch(() => [])
        ]);

    return <StoriesGridSection {...props} stories={latest} trendingStories={trending} type="latest_stories" />;
}

async function FeaturedStartupsWrapper(props: PageSection & { index: number }) {
    const data = await getStartups({ page_size: 8 }).catch(() => []);
    return <StartupsGridSection startups={data} {...props} />;
}

async function CitiesWrapper({ section_type, ...props }: PageSection & { index: number }) {
    const data = await getCities().catch(() => []);
    const sectionType = (section_type === 'rising_hubs' ? 'rising_hubs' : 'city_grid') as 'city_grid' | 'rising_hubs';
    return <CityGridSection {...props} cities={data} type={sectionType} />;
}

async function CategoriesWrapper(props: PageSection & { index: number }) {
    const data = await getCategories().catch(() => []);
    return <CategoryGridSection categories={data} {...props} />;
}

async function StatsWrapper(props: PageSection & { index: number }) {
    const data = await getPlatformStats().catch(() => ({ total_startups: 0, total_stories: 0 }));
    return <StatsSection stats={data} {...props} />;
}

/** 
 * Skeletons for smooth loading experience
 */
function SectionSkeleton() {
    return (
        <div className="w-full py-12 animate-pulse bg-white">
            <div className="container-wide">
                <div className="h-8 w-1/4 bg-zinc-100 rounded mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[4/3] bg-zinc-50 rounded-xl" />)}
                </div>
            </div>
        </div>
    );
}

export function DynamicSections({ sections, data = {}, defaultView }: DynamicSectionsProps) {
    if (!sections || sections.length === 0) return defaultView ? <div>{defaultView}</div> : null;

    let h1Rendered = false;

    // Extract FAQ items for Schema integration (needs full settings.cards)
    const faqItems = (sections || [])
        .filter((s: PageSection) => (s.section_type || s.type) === 'faq')
        .flatMap((s: PageSection) => ((s.settings?.cards || []) as Array<{ question?: string; title?: string; answer?: string; description?: string }>))
        .filter((c) => (c.question || c.title) && (c.answer || c.description))
        .map((c) => ({
            question: (c.question || c.title) as string,
            answer: (c.answer || c.description) as string
        }));

    return (
        <div className="flex flex-col w-full">
            {faqItems.length > 0 && <FAQSchema items={faqItems} />}
            {sections.map((rawSection, index) => {
                // Strip heavy fields to reduce serialized HTML payload
                const section = toLeanSection(rawSection);
                const type = section.section_type || section.type;
                const isDeeplyBelowFold = index > 2;

                const HeadingTag = (!h1Rendered) ? 'h1' : 'h2';
                if (HeadingTag === 'h1') h1Rendered = true;

                // Wrap in a div to apply content-visibility: auto for below-fold sections.
                // This significantly improves FCP by skipping initial rendering work.
                const renderSection = () => {
                    switch (type) {
                        case 'hero':
                            return (
                                <HeroSection
                                    key={section.id || index}
                                    index={index}
                                    {...section}
                                    heroData={data?.heroData}
                                    HeadingTag={HeadingTag}
                                />
                            );

                        case 'trending_stories':
                            return (
                                <Suspense key={section.id || index} fallback={<SectionSkeleton />}>
                                    <TrendingStoriesWrapper index={index} {...section} />
                                </Suspense>
                            );

                        case 'latest_stories':
                        case 'featured_stories': {
                            const hasSeeded = data?.latestStories && data.latestStories.length > 0;
                            if (hasSeeded) {
                                return (
                                    <StoriesGridSection
                                        key={section.id || index}
                                        index={index}
                                        {...section}
                                        stories={data.latestStories!}
                                        trendingStories={data?.trendingStories ?? []}
                                        type="latest_stories"
                                    />
                                );
                            }
                            return (
                                <Suspense key={section.id || index} fallback={<SectionSkeleton />}>
                                    <LatestStoriesWrapper
                                        index={index}
                                        {...section}
                                        seededStories={data?.latestStories}
                                        seededTrending={data?.trendingStories}
                                    />
                                </Suspense>
                            );
                        }

                        case 'featured_startups':
                            return (
                                <Suspense key={section.id || index} fallback={<SectionSkeleton />}>
                                    <FeaturedStartupsWrapper index={index} {...section} />
                                </Suspense>
                            );

                        case 'city_grid':
                        case 'rising_hubs':
                            return (
                                <Suspense key={section.id || index} fallback={<SectionSkeleton />}>
                                    <CitiesWrapper index={index} {...section} />
                                </Suspense>
                            );

                        case 'category_grid':
                            return (
                                <Suspense key={section.id || index} fallback={<SectionSkeleton />}>
                                    <CategoriesWrapper index={index} {...section} />
                                </Suspense>
                            );

                        case 'stats':
                            return (
                                <Suspense key={section.id || index} fallback={<div className="h-40 bg-white" />}>
                                    <StatsWrapper index={index} {...section} />
                                </Suspense>
                            );

                        case 'cta':
                        case 'banner':
                            return <CtaSection key={section.id || index} index={index} {...section} />;

                        case 'image':
                            return <ImageSection key={section.id || index} index={index} {...section} />;

                        case 'text':
                        case 'custom_content':
                            return <CtaSection key={section.id || index} index={index} {...section} />;

                        case 'newsletter':
                            return (
                                <div key={section.id || index} className="py-12 bg-white">
                                    <Newsletter />
                                </div>
                            );

                        case 'main_content':
                            return defaultView ? <div key={section.id || index} className="mb-12">{defaultView}</div> : null;

                        default:
                            return null;
                    }
                };

                return (
                    <div key={section.id || index} className={cn(isDeeplyBelowFold ? "content-auto" : "")}>
                        {renderSection()}
                    </div>
                );
            })}

            {defaultView && !sections.some(s => (s.section_type || s.type) === 'main_content') && (
                <div>{defaultView}</div>
            )}
        </div>
    );
}

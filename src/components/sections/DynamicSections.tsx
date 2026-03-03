import { HeroSection } from "./HeroSection";
import { StoriesGridSection } from "./StoriesGridSection";
import { StartupsGridSection } from "./StartupsGridSection";
import { CityGridSection } from "./CityGridSection";
import { CategoryGridSection } from "./CategoryGridSection";
import { StatsSection } from "./StatsSection";
import { CtaSection } from "./CtaSection";
import { ImageSection } from "./ImageSection";
import { Newsletter } from "./Newsletter";

interface DynamicSectionsProps {
    sections: any[];
    data: {
        trendingStories: any[];
        latestStories: any[];
        featuredStartups: any[];
        topCities: any[];
        topCategories: any[];
        platformStats: any;
        heroData?: { title: string, content: string };
    };
}

export function DynamicSections({ sections, data }: DynamicSectionsProps) {
    if (!sections || sections.length === 0) return null;

    let h1Rendered = false;

    return (
        <div className="flex flex-col w-full">
            {sections.map((section, index) => {
                const type = section.section_type || section.type;
                const isHero = type === 'hero';

                // Decide on heading tag for SEO (only one H1 per page)
                // Hierarchy: If no H1 has been rendered, the first section gets it.
                const HeadingTag = (!h1Rendered) ? 'h1' : 'h2';
                if (HeadingTag === 'h1') h1Rendered = true;

                switch (type) {
                    case 'hero':
                        return (
                            <HeroSection
                                key={section.id || index}
                                index={index}
                                {...section}
                                heroData={data.heroData}
                                HeadingTag={HeadingTag}
                            />
                        );

                    case 'trending_stories':
                    case 'latest_stories':
                    case 'featured_stories':
                        return (
                            <StoriesGridSection
                                key={section.id || index}
                                index={index}
                                type={type}
                                stories={
                                    type === 'trending_stories' ? data.trendingStories :
                                        data.latestStories // fallback for latest and featured
                                }
                                {...section}
                            />
                        );

                    case 'featured_startups':
                        return (
                            <StartupsGridSection
                                key={section.id || index}
                                index={index}
                                startups={data.featuredStartups}
                                {...section}
                            />
                        );

                    case 'city_grid':
                    case 'rising_hubs':
                        return (
                            <CityGridSection
                                key={section.id || index}
                                index={index}
                                type={type}
                                cities={data.topCities}
                                {...section}
                            />
                        );

                    case 'category_grid':
                        return (
                            <CategoryGridSection
                                key={section.id || index}
                                index={index}
                                categories={data.topCategories}
                                {...section}
                            />
                        );

                    case 'stats':
                        return (
                            <StatsSection
                                key={section.id || index}
                                index={index}
                                stats={data.platformStats}
                                {...section}
                            />
                        );

                    case 'cta':
                    case 'banner':
                        return (
                            <CtaSection
                                key={section.id || index}
                                index={index}
                                {...section}
                            />
                        );

                    case 'image':
                        return (
                            <ImageSection
                                key={section.id || index}
                                index={index}
                                {...section}
                            />
                        );

                    case 'text':
                    case 'custom_content':
                        return (
                            <CtaSection
                                key={section.id || index}
                                index={index}
                                {...section}
                            />
                        );

                    case 'newsletter':
                        return (
                            <div key={section.id || index} className="py-12 bg-white">
                                <Newsletter />
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
}

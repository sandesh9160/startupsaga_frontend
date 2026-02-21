/**
 * @file config/site.ts
 * @description Global site configuration and constants.
 */

export const siteConfig = {
    name: "StartupSaga",
    fullName: "StartupSaga.in",
    description: "Indian startup stories, founder journeys, and ecosystem directory.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    links: {
        twitter: "https://twitter.com/startupsaga",
    },
    ogImage: "/og-image.jpg",
};

export type SiteConfig = typeof siteConfig;

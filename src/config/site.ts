/**
 * @file config/site.ts
 * @description Global site configuration and constants.
 */

/** The canonical site URL — always https://www.startupsaga.in in production */
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.startupsaga.in";

export const siteConfig = {
    name: "StartupSaga",
    fullName: "StartupSaga.in",
    description: "Indian startup stories, founder journeys, and ecosystem directory.",
    url: SITE_URL,
    links: {
        twitter: "https://twitter.com/startupsaga",
    },
    ogImage: "/og-image.jpg",
};

export type SiteConfig = typeof siteConfig;

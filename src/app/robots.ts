import type { MetadataRoute } from "next";

import { siteConfig } from "@config/site";

// Generated so the sitemap URL follows siteConfig.url. /_next/ stays crawlable:
// search engines need the CSS and JS there to render the pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/test"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

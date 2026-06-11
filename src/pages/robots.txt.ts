import type { APIRoute } from "astro";
import { resolveSiteUrl } from "../utils/site";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = resolveSiteUrl("/sitemap-index.xml", site ?? "https://healthcalchub.51nav.com");
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};

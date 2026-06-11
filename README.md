# HealthCalcHub

HealthCalcHub is a static health and fitness tools site built with Astro, TypeScript, Tailwind CSS, MDX, and Fuse.js.

## Included in this starter

- 21 calculator landing pages generated from shared data
- SEO-friendly page structure with educational sections
- FAQ schema and calculator schema
- Blog collection with seeded internal-link articles
- GitHub Pages deployment workflow
- Client-side search powered by Fuse.js

## Local development

```bash
npm install
npm run dev
```

## GitHub Pages setup

1. Push the project to a GitHub repository.
2. In repository settings, enable GitHub Pages with GitHub Actions as the source.
3. Set repository variables:
   - `SITE_URL` for the production domain. Default: `https://healthcalchub.51nav.com`
   - `BASE_PATH` only if deploying to a project subpath such as `/healthcalchub`
   - `GA4_MEASUREMENT_ID` for Google Analytics 4
   - `GOOGLE_SITE_VERIFICATION` for the Google Search Console verification token
4. The repo already includes `public/CNAME` for `healthcalchub.51nav.com`.
5. After deploy, submit `/sitemap-index.xml` in Google Search Console.

## Content scaling plan

- Expand the search index to include every calculator and article
- Add the remaining long-form blog articles until you reach the 50-post target
- Introduce Google AdSense blocks only after traffic and UX data justify it

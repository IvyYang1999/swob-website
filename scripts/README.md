# Documentation SEO

`npm run build` runs `docs-seo.mjs` before Next.js. Run `npm run docs:seo` after importing a fresh `public/docs` snapshot if inspecting it without building.

The website owns the canonical, sitemap and language-alternate signals for that snapshot. Reserved English documents remain accessible with `noindex, follow`, and cannot appear in the sitemap or either side's hreflang links. Robots must continue to allow crawling those pages so crawlers can read noindex.

Replace the entire placeholder with a reviewed translation before publishing it. When both language versions are real, the build restores reciprocal hreflang links and includes the translated route. Explicit editorial noindex tags outside the generated block remain authoritative.

`node --test scripts/docs-seo.test.mjs` covers placeholders, repeat generation, publication of a translation, and editorial noindex. These checks prevent indexing mistakes; they do not judge translation quality or guarantee search-engine indexing.

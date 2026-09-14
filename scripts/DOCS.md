# Docs publication

`public/docs/**/*.html` is the published content source for this Next.js website.
The September 2026 restoration imports the previously redesigned 33-page snapshot
from the separate `swob-website-docs-markdown` workspace. It includes its existing
CSS, navigation, search, theme, TOC and 22 illustrations. It does not import that
workspace's Vite homepage or its Pandoc/Markdown authoring pipeline.

Preserved newer content: both real English guides, the Chinese overview's search
and public installer notes, and the Chinese Resume guide's release boundary.
Docs illustrations live under `public/docs/assets/media/` so they cannot replace
homepage assets. The old snapshot's analytics script is not imported.

`npm run build` runs Docs SEO generation and publication checks before Next.js.
`scripts/docs-seo.mjs` owns canonical, reciprocal translation links, placeholder
noindex, sitemap routes and search visibility. Search titles/descriptions come
from published HTML; curated keywords/sections remain in `search-index.json`.

When publishing a new English translation, remove its placeholder/editorial
noindex and add its English path to the matching page in `docs.js` navigation.
Never re-import an old snapshot over newer bodies without comparing them.
Keep the main website's Docs entry at `/docs/`; `/docs/en/` contains the available
English guides and links back to the full Chinese documentation.

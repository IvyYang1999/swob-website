# swob.app

Marketing site for [Swob](https://github.com/IvyYang1999/swob). Next.js 15, no UI framework, one stylesheet.

- `data/site.ts` — every word on the site, English and Chinese. Edit copy here.
- `components/Site.tsx` — page structure (hero → pains → two lines / four doors → engine → company → download).
- `components/Sources.tsx` + `public/source-matrix.json` — capability matrix, regenerated from the desktop repo's `scripts/generate-source-matrix.mjs`.
- `app/swob.css` — all styles, prefixed `.sw`. Same tokens as darkconstant.com.
- `public/docs/` — publication snapshot of the docs site, copied from the desktop repo.

```bash
npm ci && npm run dev   # http://localhost:3000  (/zh for Chinese)
npm run build
```

Release: bump `VERSION` in `data/site.ts` when a new DMG is published.

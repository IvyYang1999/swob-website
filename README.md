# Swob website

Official source for [swob.app](https://swob.app), deployed independently from the
[Swob desktop application](https://github.com/IvyYang1999/swob).

## Development

```bash
npm ci
npm run check
npm run dev
```

## Release contract

The website does not import application source code. A desktop release only
requires one explicit website update:

1. Set `version` in `package.json`.
2. Set `RELEASE_VERSION` in `src/download.ts`.
3. Update the SoftwareApplication metadata in `index.html`.
4. Run `npm run check && npm run build`.

`src/download.ts` is the single runtime source for both Apple Silicon and Intel
DMG URLs. `scripts/check-release-contract.mjs` prevents the page metadata,
download buttons, license, canonical domain, and package version from drifting.

The files under `public/docs/` are a publication snapshot. They may be refreshed
from the desktop repository for a release, but the website build never depends
on a sibling checkout.

## License

[Apache License 2.0](LICENSE). See [NOTICE](NOTICE).

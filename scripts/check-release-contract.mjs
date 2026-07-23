import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const downloadSource = fs.readFileSync(new URL('../src/download.ts', import.meta.url), 'utf8')
const analyticsSource = fs.readFileSync(new URL('../src/analytics.ts', import.meta.url), 'utf8')
const downloadSurfaces = [
  fs.readFileSync(new URL('../src/components/Hero.tsx', import.meta.url), 'utf8'),
  fs.readFileSync(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8'),
  fs.readFileSync(new URL('../src/components/Footer.tsx', import.meta.url), 'utf8'),
].join('\n')
const indexHtml = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const robots = fs.readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')
const sitemap = fs.readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
const version = packageJson.version

const failures = []
const requireText = (content, expected, label) => {
  if (!content.includes(expected)) failures.push(`${label} is missing ${JSON.stringify(expected)}`)
}

requireText(downloadSource, `RELEASE_VERSION = '${version}'`, 'src/download.ts')
requireText(downloadSource, 'swob-${RELEASE_VERSION}-${architecture}.dmg', 'src/download.ts')
requireText(indexHtml, `"softwareVersion": "${version}"`, 'index.html')
requireText(indexHtml, `/releases/download/v${version}/swob-${version}-arm64.dmg`, 'index.html')
requireText(indexHtml, '"url": "https://swob.app/"', 'index.html')
requireText(indexHtml, '"license": "https://www.apache.org/licenses/LICENSE-2.0"', 'index.html')
requireText(indexHtml, 'data-domain="swob.app"', 'index.html')
requireText(indexHtml, 'src="https://plausible.io/js/script.js"', 'index.html')
requireText(analyticsSource, "window.plausible?.('Download'", 'src/analytics.ts')
for (const property of ['architecture', 'placement', 'version']) {
  requireText(analyticsSource, property, 'src/analytics.ts')
}
for (const placement of [
  'hero-primary',
  'hero-alternate',
  'navbar-desktop',
  'navbar-mobile',
  'footer-primary',
  'footer-alternate',
]) {
  requireText(downloadSurfaces, `'${placement}'`, 'download surfaces')
}
requireText(robots, 'Sitemap: https://swob.app/sitemap.xml', 'public/robots.txt')
requireText(sitemap, '<loc>https://swob.app/</loc>', 'public/sitemap.xml')

for (const [label, content] of [
  ['index.html', indexHtml],
  ['public/robots.txt', robots],
  ['public/sitemap.xml', sitemap],
]) {
  if (/swob-iota\.vercel\.app|releases\/latest|AGPL-3\.0/i.test(content)) {
    failures.push(`${label} contains retired public metadata`)
  }
}

if (failures.length > 0) {
  console.error('Website release contract failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Website release contract passed for Swob v${version}.`)

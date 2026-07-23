import fs from 'node:fs'
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(repositoryRoot, 'public')
const publicOrigin = 'https://swob.app'
const spaRoutes = new Set(['/', '/zh', '/zh/'])
const failures = []

async function walk(directory) {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(absolute))
    else files.push(absolute)
  }
  return files
}

function report(source, message) {
  failures.push(`${path.relative(repositoryRoot, source)}: ${message}`)
}

function resolvePublicReference(source, value) {
  if (!value || value.startsWith('data:') || value.startsWith('javascript:')) return null
  let url
  try {
    const sourceRoute = `/${path.relative(publicRoot, source).split(path.sep).join('/')}`
    url = new URL(value, `${publicOrigin}${sourceRoute}`)
  } catch {
    report(source, `invalid URL: ${value}`)
    return null
  }
  if (url.origin !== publicOrigin) return null

  let pathname
  try {
    pathname = decodeURIComponent(url.pathname)
  } catch {
    report(source, `invalid URL encoding: ${value}`)
    return null
  }
  if (spaRoutes.has(pathname)) return { spa: true, fragment: url.hash.slice(1), value }

  let target = path.join(publicRoot, pathname.replace(/^\/+/, ''))
  if (pathname.endsWith('/') || (fs.existsSync(target) && fs.statSync(target).isDirectory())) {
    target = path.join(target, 'index.html')
  }
  return { target, fragment: url.hash.slice(1), value }
}

function verifyReference(source, value) {
  const resolved = resolvePublicReference(source, value)
  if (!resolved || resolved.spa) return
  if (!fs.existsSync(resolved.target) || !fs.statSync(resolved.target).isFile()) {
    report(source, `missing public target ${resolved.value}`)
    return
  }
  if (!resolved.fragment || path.extname(resolved.target).toLowerCase() !== '.html') return

  const fragment = decodeURIComponent(resolved.fragment)
  const html = fs.readFileSync(resolved.target, 'utf8')
  const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (!new RegExp(`(?:id|name)=["']${escaped}["']`).test(html)) {
    report(source, `missing fragment #${fragment} in ${path.relative(publicRoot, resolved.target)}`)
  }
}

function verifyHtml(file) {
  const html = fs.readFileSync(file, 'utf8')
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    verifyReference(file, match[1])
  }
  if (!/<title>\s*[^<]+\s*<\/title>/i.test(html)) report(file, 'missing non-empty title')
  if (!/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html)) {
    report(file, 'missing meta description')
  }
  if (!/<meta\s+name=["']viewport["']/i.test(html)) report(file, 'missing viewport metadata')
  if (!/<link\s+rel=["'][^"']*icon[^"']*["']/i.test(html)) report(file, 'missing favicon')
  if (!/<script\s+defer\s+data-domain=["']swob\.app["']\s+src=["']https:\/\/plausible\.io\/js\/script\.js["']><\/script>/i.test(html)) {
    report(file, 'missing Plausible pageview tracking for swob.app')
  }

  const relative = path.relative(publicRoot, file).split(path.sep).join('/')
  if (relative.startsWith('docs/en/') && !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    report(file, 'reserved English placeholder must remain noindex')
  }
}

const publicFiles = await walk(publicRoot)
const htmlFiles = publicFiles.filter((file) => path.extname(file).toLowerCase() === '.html')
for (const file of htmlFiles) verifyHtml(file)

const sitemapFile = path.join(publicRoot, 'sitemap.xml')
const sitemap = fs.readFileSync(sitemapFile, 'utf8')
for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const resolved = resolvePublicReference(sitemapFile, match[1])
  if (!resolved) report(sitemapFile, `sitemap URL is outside ${publicOrigin}: ${match[1]}`)
  else if (!resolved.spa && (!fs.existsSync(resolved.target) || !fs.statSync(resolved.target).isFile())) {
    report(sitemapFile, `sitemap route has no public artifact: ${match[1]}`)
  }
}

if (failures.length > 0) {
  console.error(`Website public-link check failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Website public-link check passed: ${htmlFiles.length} documentation pages.`)

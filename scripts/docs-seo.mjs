import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const origin = 'https://swob.app';
const managed = /\n?<!-- docs-seo:start -->[\s\S]*?<!-- docs-seo:end -->\n?/g;
export function preparePages(input) {
  const pages = input.map(({ file, html }) => {
    const clean = html.replace(managed, '\n');
    const placeholder = /Reserved English documentation route\.|Not translated yet/.test(clean);
    const noindex = /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex)[^>]*>/i.test(clean);
    const route = '/docs/' + file.replace(/index\.html$/, '');
    return { file, clean, route, indexable: !placeholder && !noindex, placeholder };
  });
  return pages.map(page => {
    const english = page.file.startsWith('en/');
    const counterpart = pages.find(other => other.file === (english ? page.file.slice(3) : 'en/' + page.file));
    const links = [`<link rel="canonical" href="${origin}${page.route}">`];
    if (page.placeholder) links.push('<meta name="robots" content="noindex, follow">');
    if (page.indexable && counterpart?.indexable) {
      for (const current of [page, counterpart]) links.push(`<link rel="alternate" hreflang="${current.file.startsWith('en/') ? 'en' : 'zh-CN'}" href="${origin}${current.route}">`);
    }
    // The website owns these signals after each docs snapshot import.
    const clean = page.clean.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '')
      .replace(/<link\b(?=[^>]*\bhreflang=)[^>]*>\s*/gi, '');
    return { ...page, html: clean.replace(/\s*<\/head>/, `\n<!-- docs-seo:start -->\n${links.join('\n')}\n<!-- docs-seo:end -->\n</head>`) };
  });
}

async function walk(root, prefix = '') {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await walk(new URL(entry.name + '/', root), name + '/'));
    else if (name.endsWith('.html')) files.push({ file: name, html: await readFile(new URL(entry.name, root), 'utf8') });
  }
  return files;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = new URL('../public/docs/', import.meta.url);
  const pages = preparePages(await walk(root));
  for (const page of pages) await writeFile(new URL(page.file, root), page.html);
  const routes = pages.filter(page => page.indexable).map(page => page.route).sort();
  await writeFile(new URL('../app/docs-routes.json', import.meta.url), JSON.stringify(routes, null, 2) + '\n');
  // Derive search visibility and current titles from the same publication decision.
  const searchFile = new URL('search-index.json', root);
  const priorIndex = JSON.parse(await readFile(searchFile, 'utf8').catch(() => '[]'));
  const searchIndex = pages.filter(page => page.indexable).map(page => {
    const prior = priorIndex.find(item => item.href === page.file);
    const title = page.clean.match(/<title>([\s\S]*?)<\/title>/i)?.[1].replace(/\s*· Swob Docs$/, '') || page.file;
    const description = page.clean.match(/<meta name="description" content="([^"]*)"/i)?.[1] || '';
    return { ...prior, lang: page.file.startsWith('en/') ? 'en' : 'zh', title, description, section: prior?.section || (page.file.startsWith('en/') ? 'Guides' : '文档'), href: page.file };
  });
  await writeFile(searchFile, JSON.stringify(searchIndex, null, 2) + '\n');
  console.log(`Docs SEO: ${routes.length} indexable, ${pages.length - routes.length} excluded; language links require both translations.`);
}

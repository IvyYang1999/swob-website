import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

const root = new URL('../public/docs/', import.meta.url);
async function pages(dir = root) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? pages(new URL(entry.name + '/', dir))
    : entry.name.endsWith('.html') ? [new URL(entry.name, dir)] : []))).flat();
}

test('the redesigned snapshot has all pages and working local visual assets', async () => {
  const files = await pages();
  assert.equal(files.length, 33);
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    assert.match(html, /src="\/docs\/assets\/docs.js"/);
    assert.doesNotMatch(html, /plausible\.io/);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(?:https?:|#|mailto:)/.test(ref)) continue;
      const url = ref.startsWith('/') ? new URL('../public' + ref, import.meta.url) : new URL(ref, file);
      if (/\.(?:png|svg|css|js)$/.test(url.pathname)) await access(url);
    }
  }
});

test('search covers published pages and excludes untranslated English routes', async () => {
  const routes = JSON.parse(await readFile(new URL('../app/docs-routes.json', import.meta.url)));
  const index = JSON.parse(await readFile(new URL('search-index.json', root)));
  assert.equal(routes.length, 23);
  assert.deepEqual(index.map(page => '/docs/' + page.href.replace(/index\.html$/, '')).sort(), [...routes].sort());
  assert.deepEqual(index.filter(page => page.lang === 'en').map(page => page.href).sort(), ['en/guides/resume.html', 'en/index.html']);
});

test('recent English guides and Chinese release/search corrections survive snapshot import', async () => {
  const en = await readFile(new URL('en/index.html', root), 'utf8');
  const resume = await readFile(new URL('en/guides/resume.html', root), 'utf8');
  const zh = await readFile(new URL('index.html', root), 'utf8');
  const zhResume = await readFile(new URL('guides/resume.html', root), 'utf8');
  assert.match(en, /Find old AI conversations\./);
  assert.match(en, /⌘Enter/);
  assert.match(resume, /v1\.3\.1/);
  assert.match(zh, /先找到要继续的会话/);
  assert.match(zh, /核对公开安装包/);
  assert.match(zhResume, /版本边界/);
  assert.match(zhResume, /v1\.3\.1/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { preparePages } from './docs-seo.mjs';
const document = body => `<html><head><title>Docs</title></head><body>${body}</body></html>`;
test('a placeholder cannot advertise itself or receive a language alternate', () => {
  const pages = preparePages([{file:'index.html', html:document('中文')}, {file:'en/index.html', html:document('Not translated yet')}]);
  assert.deepEqual(pages.map(p => p.indexable), [true, false]);
  assert.ok(pages[1].html.includes('noindex, follow'));
  assert.ok(pages.every(p => !p.html.includes('hreflang')));
  assert.deepEqual(preparePages(pages).map(p => p.html), pages.map(p => p.html));
});
test('real translations receive reciprocal links and lose the managed noindex', () => {
  const old = preparePages([{file:'en/index.html', html:document('Not translated yet')}])[0].html;
  const pages = preparePages([{file:'index.html', html:document('中文')}, {file:'en/index.html', html:old.replace('Not translated yet','Actual guide')}]);
  assert.ok(pages.every(p => p.indexable && p.html.includes('hreflang="en"') && p.html.includes('hreflang="zh-CN"')));
  assert.ok(!pages[1].html.includes('noindex'));
});
test('an editorial noindex remains excluded even after real content is supplied', () => {
  const html = document('Actual guide').replace('</head>', '<meta content="noindex,follow" name="robots"></head>');
  assert.equal(preparePages([{file:'en/index.html',html}])[0].indexable, false);
});

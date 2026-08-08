#!/usr/bin/env node
/*
 * Static checks on the markup and stylesheet.
 *
 * The theming contract is the interesting one: components read tokens, so a
 * token defined in one theme block and missing from another resolves to
 * nothing in that theme. That produces an invisible-text bug that only shows
 * up for viewers whose theme differs from the one you were looking at.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SRC = path.join(__dirname, '..', 'src');
const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');

let passed = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); process.exitCode = 1; }
}

/* Pull the declarations out of one selector's block. */
function blockFor(selector) {
  const at = css.indexOf(selector + ' {');
  assert.notStrictEqual(at, -1, 'selector not found: ' + selector);
  const open = css.indexOf('{', at);
  let depth = 0, i = open;
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}') { depth--; if (depth === 0) break; }
  }
  return css.slice(open + 1, i);
}

function tokensIn(text) {
  const out = new Set();
  const re = /(--[a-z0-9-]+)\s*:/gi;
  let m;
  while ((m = re.exec(text)) !== null) out.add(m[1]);
  return out;
}

console.log('\nPracticum assets\n');

check('every var() reference resolves to a defined token', () => {
  const defined = tokensIn(css);
  const used = new Set();
  const re = /var\((--[a-z0-9-]+)/gi;
  let m;
  while ((m = re.exec(css)) !== null) used.add(m[1]);
  const missing = [...used].filter(t => !defined.has(t));
  assert.deepStrictEqual(missing, [], 'undefined tokens: ' + missing.join(', '));
});

check('both dark blocks define an identical token set', () => {
  const media = tokensIn(blockFor(':root:not([data-theme="light"])'));
  const attr = tokensIn(blockFor(':root[data-theme="dark"]'));
  const onlyMedia = [...media].filter(t => !attr.has(t));
  const onlyAttr = [...attr].filter(t => !media.has(t));
  assert.deepStrictEqual(onlyMedia, [], 'only in the media query: ' + onlyMedia.join(', '));
  assert.deepStrictEqual(onlyAttr, [], 'only in the attribute block: ' + onlyAttr.join(', '));
});

check('no token is dark-only, so light is never left undefined', () => {
  const light = tokensIn(blockFor(':root'));
  const dark = tokensIn(blockFor(':root[data-theme="dark"]'));
  const darkOnly = [...dark].filter(t => !light.has(t));
  assert.deepStrictEqual(darkOnly, [], 'defined only in dark: ' + darkOnly.join(', '));
});

check('the explicit toggle can override the OS preference both ways', () => {
  // Dark-by-attribute must appear after the media query to win the specificity tie,
  // and the media query must exempt an explicit light choice.
  const mediaAt = css.indexOf(':root:not([data-theme="light"])');
  const attrAt = css.indexOf(':root[data-theme="dark"] {');
  assert.ok(mediaAt !== -1, 'media query must exempt data-theme="light"');
  assert.ok(attrAt > mediaAt, 'dark attribute block must come after the media query');
});

check('braces balance', () => {
  let depth = 0;
  for (const ch of css) {
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    assert.ok(depth >= 0, 'unmatched closing brace');
  }
  assert.strictEqual(depth, 0, 'unclosed block');
});

check('reduced motion and both-theme support are present', () => {
  assert.ok(css.includes('prefers-reduced-motion'), 'missing reduced-motion guard');
  assert.ok(css.includes('prefers-color-scheme: dark'), 'missing dark media query');
  assert.ok(css.includes(':focus-visible'), 'missing visible focus state');
});

check('wide content scrolls inside its own container, not the page', () => {
  // Long prompts and JSON backups are the only things here that can exceed
  // the measure, so they are the ones that need their own overflow.
  assert.ok(/\.deepdive__text\s*\{[^}]*overflow:\s*auto/s.test(css),
    '.deepdive__text needs overflow: auto');
  assert.ok(/@media \(max-width: 60rem\)[\s\S]*\.nav\s*\{[^}]*overflow-x:\s*auto/.test(css),
    'the narrow-viewport nav needs overflow-x: auto');
});

check('no CDN or remote asset survives in the stylesheet', () => {
  assert.ok(!/@import|https?:\/\//.test(css), 'CSP blocks external hosts; nothing may be linked');
  assert.ok(!/url\(\s*['"]?https?:/.test(css), 'remote url() found');
});

check('markup carries no forbidden document-level tags', () => {
  // The Artifact host supplies the doctype/html/head/body skeleton.
  for (const tag of ['<!doctype', '<html', '<head', '<body']) {
    assert.ok(!html.toLowerCase().includes(tag), 'must not declare ' + tag);
  }
});

check('every element app.js touches at boot exists in the markup', () => {
  // Ids created later by innerHTML are legitimately absent from the shell.
  const dynamic = new Set(['note-field', 'note-state', 'prompt-text', 'lib-search',
    'export-text', 'import-box', 'import-field']);
  const needed = new Set();
  const re = /el\('([a-z0-9-]+)'\)/gi;
  let m;
  while ((m = re.exec(app)) !== null) if (!dynamic.has(m[1])) needed.add(m[1]);
  const missing = [...needed].filter(id => !html.includes('id="' + id + '"'));
  assert.deepStrictEqual(missing, [], 'ids missing from index.html: ' + missing.join(', '));
});

check('the built artifact is self-contained and within the size limit', () => {
  const dist = path.join(__dirname, '..', 'dist', 'index.html');
  assert.ok(fs.existsSync(dist), 'run node build.js first');
  const out = fs.readFileSync(dist, 'utf8');
  assert.ok(!/<script src=|<link rel="stylesheet"/.test(out), 'external reference survived inlining');
  assert.ok(!/https?:\/\/[^\s"')]+/.test(out.replace(/[a-z]+:\/\/localhost[^\s"')]*/g, '')),
    'remote URL in built output');
  const mb = Buffer.byteLength(out) / (1024 * 1024);
  assert.ok(mb < 16, 'over the 16MB artifact limit: ' + mb.toFixed(1) + 'MB');
});

console.log('\n' + passed + ' checks passed\n');

/*
 * Boots the real engine/app.js against an injected DOM, so what is under test
 * is the shipped code rather than a reimplementation of it.
 *
 * The clock is injectable because almost everything interesting is
 * date-dependent: which entry you are served, whether a card is due, whether a
 * streak survives, whether an entry has lapsed, whether a forecast is ripe.
 */
const fs = require('fs');
const path = require('path');

/* Same split as lib/build.js: the engine sits beside this harness, the site
 * under test is the working directory. */
const SHARED = path.join(__dirname, '..');
const ENGINE = path.join(SHARED, 'engine');
const ROOT = process.cwd();

function fakeDate(nowMs) {
  return class D extends Date {
    constructor(...a) { if (a.length === 0) super(nowMs); else super(...a); }
    static now() { return nowMs; }
  };
}

function makeEl(id) {
  const el = {
    id, _html: '', _text: '', hidden: false, dataset: {}, value: '',
    selectionStart: 0, attrs: {},
    get innerHTML() { return el._html; },
    set innerHTML(v) { el._html = String(v); },
    get textContent() { return el._text; },
    set textContent(v) { el._text = String(v); },
    setAttribute(k, v) { el.attrs[k] = String(v); },
    getAttribute(k) { return k in el.attrs ? el.attrs[k] : null; },
    removeAttribute(k) { delete el.attrs[k]; },
    addEventListener(t, fn) { (el._h = el._h || {})[t] = fn; },
    scrollIntoView() {}, focus() {}, setSelectionRange() {}, select() {},
    appendChild() {}, removeChild() {}, click() {}
  };
  return el;
}

function makeEnv(nowMs, storageKey) {
  const els = {};
  const store = {};
  const handlers = {};
  const fields = {};                       // querySelector-addressable inputs

  const documentElement = makeEl('html');
  const document = {
    documentElement,
    body: { appendChild() {}, removeChild() {} },
    getElementById: id => els[id] || (els[id] = makeEl(id)),
    /* Nav items are parsed back out of what the app itself rendered, so the
     * harness never has to know which tabs a site config produces. */
    querySelectorAll(sel) {
      if (sel !== '.nav__item') return [];
      const html = (els['nav'] && els['nav']._html) || '';
      const views = [...html.matchAll(/data-view="([a-z]+)"/g)].map(m => m[1]);
      return views.map(v => {
        const key = 'nav-' + v;
        const e = els[key] || (els[key] = makeEl(key));
        e.dataset.view = v;
        return e;
      });
    },
    querySelector(sel) {
      const m = /^\.attempt__field\[data-id="(.+)"\]$/.exec(sel);
      if (m) return fields[m[1]] || null;
      return null;
    },
    addEventListener: (t, fn) => { (handlers[t] = handlers[t] || []).push(fn); },
    createElement: () => makeEl('tmp'),
    execCommand: () => true
  };

  const window = { LESSONS: [], SITE: null, matchMedia: () => ({ matches: false }) };

  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };

  return {
    els, window, document, localStorage, store, handlers, fields,
    fire(type, target) { (handlers[type] || []).forEach(fn => fn({ target })); },
    setAttemptField(id, text) {
      const e = makeEl('attempt-' + id);
      e.value = text;
      fields[id] = e;
    },
    state() { return JSON.parse(store[storageKey] || '{}'); },
    Date: fakeDate(nowMs)
  };
}

/* Synthetic event targets. Building these directly rather than parsing the
 * rendered HTML keeps handler tests independent of markup details. */
function target(dataset, isNav) {
  const t = {
    dataset, id: dataset.elId || '', value: dataset.value || '',
    closest(sel) {
      if (sel === '.nav__item') return isNav ? t : null;
      if (sel === '[data-act]') return dataset.act ? t : null;
      return null;
    }
  };
  return t;
}

function readSite(siteDir) {
  const win = {};
  new Function('window', fs.readFileSync(path.join(siteDir, 'site.js'), 'utf8'))(win);
  return win.SITE;
}

function contentOf(siteDir) {
  const dir = path.join(siteDir, 'content');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort()
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8'));
}

function boot(siteDir, nowMs, seedStore, mutate) {
  const cfg = readSite(siteDir);
  const env = makeEnv(nowMs, cfg.key);
  if (seedStore) Object.assign(env.store, seedStore);
  if (mutate) mutate(env);

  new Function('window', fs.readFileSync(path.join(siteDir, 'site.js'), 'utf8'))(env.window);
  contentOf(siteDir).forEach(src => new Function('window', src)(env.window));

  // expr.js publishes window.EXPR and app.js reads it, same order as the page.
  new Function('self', fs.readFileSync(path.join(ENGINE, 'expr.js'), 'utf8'))(env.window);

  const app = fs.readFileSync(path.join(ENGINE, 'app.js'), 'utf8');
  new Function('window', 'document', 'localStorage', 'navigator', 'setTimeout',
    'clearTimeout', 'Date', 'URL', 'Blob', app)(
    env.window, env.document, env.localStorage, {},
    fn => { fn(); return 0; }, () => {}, env.Date,
    { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    function Blob() {}
  );
  env.cfg = cfg;
  env.api = env.window.__daily;
  return env;
}

/* --- Tiny test runner ---------------------------------------------------- */
let passed = 0;
let failed = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); failed++; process.exitCode = 1; }
}
function report(label) {
  console.log('\n' + passed + ' checks passed' + (failed ? ', ' + failed + ' FAILED' : '') + (label ? ' — ' + label : '') + '\n');
  return failed === 0;
}

const DAY = 86400000;

/* A template hole is a missing field that reached the markup, not the word
 * "undefined" occurring in prose - an entry about significant figures is
 * entitled to say a population is undefined. esc() renders a missing field as
 * empty, so a real hole only shows up where a string was concatenated into
 * markup: at a tag boundary or inside an attribute. */
const HOLE = /\[object |>\s*(?:undefined|null)\b|\b(?:undefined|null)\s*<\/|="(?:undefined|null)"/;

function templateHole(html) {
  const m = HOLE.exec(html);
  return m ? html.slice(Math.max(0, m.index - 40), m.index + 60) : null;
}

module.exports = { boot, target, makeEnv, readSite, check, report, templateHole, DAY, ROOT, ENGINE };

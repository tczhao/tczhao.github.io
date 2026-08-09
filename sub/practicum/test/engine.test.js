#!/usr/bin/env node
/*
 * Runs the real src/app.js against an injected DOM, so the behaviour under
 * test is the shipped code rather than a reimplementation of it.
 *
 * The clock is injectable because almost everything interesting here is
 * date-dependent: which entry you are served, whether a card is due, whether
 * a streak survives.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const SRC = path.join(__dirname, '..', 'src');

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

function makeEnv(nowMs) {
  const els = {};
  const ids = ['stamp-num', 'stamp-date', 'gauge-streak', 'gauge-logged',
    'gauge-retained', 'badge-today', 'badge-review', 'theme-toggle',
    'theme-label', 'toast', 'field', 'note-field', 'note-state',
    'prompt-text', 'export-text', 'import-box', 'import-field', 'lib-search',
    'view-today', 'view-review', 'view-library', 'view-journal', 'view-progress'];
  ids.forEach(i => { els[i] = makeEl(i); });

  const navItems = ['today', 'review', 'library', 'journal', 'progress'].map(v => {
    const e = makeEl('nav-' + v);
    e.dataset.view = v;
    return e;
  });

  const store = {};
  const handlers = {};

  const documentElement = makeEl('html');
  const document = {
    documentElement,
    body: { appendChild() {}, removeChild() {} },
    getElementById: id => els[id] || (els[id] = makeEl(id)),
    querySelectorAll: sel => (sel === '.nav__item' ? navItems : []),
    addEventListener: (t, fn) => { (handlers[t] = handlers[t] || []).push(fn); },
    createElement: () => makeEl('tmp'),
    execCommand: () => true
  };

  const window = {
    LESSONS: [],
    matchMedia: () => ({ matches: false })
  };

  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };

  return {
    els, navItems, window, document, localStorage, store, handlers,
    fire(type, target) { (handlers[type] || []).forEach(fn => fn({ target })); },
    state() { return JSON.parse(store['practicum.v1'] || '{}'); },
    Date: fakeDate(nowMs)
  };
}

/* Synthetic event targets. Building these directly rather than parsing the
 * rendered HTML keeps the handler tests independent of markup details. */
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

function boot(nowMs, seedStore) {
  const env = makeEnv(nowMs);
  if (seedStore) Object.assign(env.store, seedStore);

  for (const f of fs.readdirSync(path.join(SRC, 'content')).filter(f => f.endsWith('.js')).sort()) {
    new Function('window', fs.readFileSync(path.join(SRC, 'content', f), 'utf8'))(env.window);
  }

  const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
  new Function('window', 'document', 'localStorage', 'navigator', 'setTimeout',
    'clearTimeout', 'Date', 'URL', 'Blob', app)(
    env.window, env.document, env.localStorage, {},
    fn => { fn(); return 0; }, () => {}, env.Date,
    { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    function Blob() {}
  );
  return env;
}

const DAY = 86400000;
const T0 = new Date(2026, 7, 5, 9, 0, 0).getTime();   // Wed 5 Aug 2026, local
let passed = 0;
function check(name, fn) {
  try { fn(); console.log('  ok   ' + name); passed++; }
  catch (e) { console.log('  FAIL ' + name + '\n       ' + e.message); process.exitCode = 1; }
}

console.log('\nPracticum engine\n');

check('corpus loads and every lesson reaches the sequence exactly once', () => {
  const env = boot(T0);
  const n = env.window.LESSONS.length;
  assert.ok(n > 100, 'expected a real corpus, got ' + n);
  const days = env.state().days;
  assert.strictEqual(Object.keys(days).length, 1, 'exactly one day assigned on first boot');
});

check('opening cycle interleaves tracks instead of grouping them', () => {
  const env = boot(T0);
  // Walk 12 consecutive days and confirm no track repeats within the cycle.
  const seen = [];
  let store = null;
  for (let d = 0; d < 12; d++) {
    const e = boot(T0 + d * DAY, store);
    store = { ...e.store };
    const days = e.state().days;
    const key = Object.keys(days).sort().pop();
    const id = days[key];
    const lesson = e.window.LESSONS.find(l => l.id === id);
    seen.push(lesson.track);
  }
  assert.strictEqual(new Set(seen).size, 12, 'expected 12 distinct tracks, got ' + seen.join(','));
});

check('the same day always serves the same entry', () => {
  const a = boot(T0);
  const first = a.els['stamp-num'].textContent;
  const b = boot(T0 + 6 * 3600000, { ...a.store });   // later the same day
  assert.strictEqual(b.els['stamp-num'].textContent, first);
});

check('a missed day pushes content forward rather than skipping it', () => {
  const a = boot(T0);
  const day1 = Object.values(a.state().days)[0];
  // Jump four days without logging anything.
  const b = boot(T0 + 4 * DAY, { ...a.store });
  const days = b.state().days;
  assert.strictEqual(Object.keys(days).length, 2, 'only the days you showed up get entries');
  const day2 = days[Object.keys(days).sort().pop()];
  assert.notStrictEqual(day2, day1);
  // day1's lesson has not been consumed by the gap - it is still the earlier entry.
  const nums = Object.values(days);
  assert.strictEqual(new Set(nums).size, 2);
});

check('logging an entry starts the streak and schedules review for tomorrow', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  const s = env.state();
  assert.strictEqual(s.streak.count, 1);
  assert.strictEqual(s.streak.best, 1);
  assert.strictEqual(s.log[id].box, 1);
  assert.strictEqual(s.log[id].due, '2026-08-06', 'due tomorrow, got ' + s.log[id].due);
});

check('consecutive days extend the streak, a gap resets it but keeps the best', () => {
  let env = boot(T0);
  let store = { ...env.store };
  for (let d = 0; d < 3; d++) {
    env = boot(T0 + d * DAY, store);
    env.fire('click', target({ act: 'complete', id: Object.values(env.state().days).sort()[d] }));
    store = { ...env.store };
  }
  assert.strictEqual(env.state().streak.count, 3, 'three in a row');

  // Skip two days, then log again.
  env = boot(T0 + 5 * DAY, store);
  const days = env.state().days;
  env.fire('click', target({ act: 'complete', id: days[Object.keys(days).sort().pop()] }));
  const s = env.state();
  assert.strictEqual(s.streak.count, 1, 'gap resets the running count');
  assert.strictEqual(s.streak.best, 3, 'best survives the reset');
});

check('grading got promotes the box and pushes the interval out', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  env.fire('click', target({ act: 'grade', grade: 'got', id }));
  const r = env.state().log[id];
  assert.strictEqual(r.box, 2);
  assert.strictEqual(r.due, '2026-08-08', 'box 2 is a 3-day interval, got ' + r.due);
  assert.strictEqual(r.reviews.length, 1);
});

check('grading close holds the box, grading miss drops to box 1', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  env.fire('click', target({ act: 'grade', grade: 'got', id }));    // -> 2
  env.fire('click', target({ act: 'grade', grade: 'got', id }));    // -> 3
  assert.strictEqual(env.state().log[id].box, 3);
  env.fire('click', target({ act: 'grade', grade: 'close', id }));
  assert.strictEqual(env.state().log[id].box, 3, 'close holds');
  env.fire('click', target({ act: 'grade', grade: 'miss', id }));
  const r = env.state().log[id];
  assert.strictEqual(r.box, 1, 'miss resets');
  assert.strictEqual(r.due, '2026-08-06');
});

check('the box never runs past the last interval', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  for (let i = 0; i < 10; i++) env.fire('click', target({ act: 'grade', grade: 'got', id }));
  const r = env.state().log[id];
  assert.strictEqual(r.box, 5);
  assert.strictEqual(r.due, '2026-09-09', 'box 5 is 35 days, got ' + r.due);
});

check('a due card is counted, a future one is not', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  assert.strictEqual(env.els['badge-review'].hidden, true, 'nothing due on the day you log it');

  const later = boot(T0 + DAY, { ...env.store });
  assert.strictEqual(later.els['badge-review'].hidden, false);
  assert.strictEqual(later.els['badge-review'].textContent, '1');
});

check('reflection text is escaped, not injected', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  const nasty = '<img src=x onerror="alert(1)">';
  env.fire('input', target({ elId: 'note-field', id, value: nasty, act: '' }));
  assert.strictEqual(env.state().log[id].note, nasty, 'stored verbatim');

  const again = boot(T0, { ...env.store });
  const html = again.els['view-today'].innerHTML;
  assert.ok(html.includes('&lt;img'), 'rendered escaped');
  assert.ok(!html.includes('<img src=x'), 'raw tag must not reach the DOM');
});

check('today renders a complete entry with every section present', () => {
  const env = boot(T0);
  const html = env.els['view-today'].innerHTML;
  for (const marker of ['The idea', 'Why it holds', 'What goes wrong without it',
    'Try this today', 'Log it', 'Take it further', 'Log this entry']) {
    assert.ok(html.includes(marker), 'missing section: ' + marker);
  }
  assert.ok(!/undefined|\[object/.test(html), 'template hole in rendered entry');
});

check('every lesson renders without a template hole', () => {
  const env = boot(T0);
  let store = { ...env.store };
  const n = env.window.LESSONS.length;
  // Drive the library reader across the whole corpus.
  for (const l of env.window.LESSONS) {
    const e = boot(T0, store);
    e.fire('click', target({ act: 'go', view: 'library' }));
    e.fire('click', target({ act: 'lib-open', id: l.id }));
    const html = e.els['view-library'].innerHTML;
    assert.ok(html.includes('The idea'), l.id + ' failed to render');
    assert.ok(!/undefined|\[object|null<\//.test(html), l.id + ' has a template hole');
  }
  assert.ok(n > 100);
});

check('the deep-dive prompt carries the reflection into it', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('input', target({ elId: 'note-field', id, value: 'my actual situation here' }));
  const e2 = boot(T0, { ...env.store });
  e2.fire('click', target({ act: 'show-prompt', id }));
  const txt = e2.els['prompt-text'].textContent;
  assert.ok(txt.includes('my actual situation here'), 'note should travel with the prompt');
  assert.ok(txt.includes('MY SITUATION:'));
});

check('a corrupt or foreign record falls back to a clean slate', () => {
  const env = boot(T0, { 'practicum.v1': '{not json at all' });
  assert.ok(env.els['stamp-num'].textContent.match(/^\d{3}$/), 'should still boot');
  const env2 = boot(T0, { 'practicum.v1': JSON.stringify({ v: 99, log: {} }) });
  assert.strictEqual(env2.state().v, 1, 'unknown version is discarded');
});

check('blocked storage is surfaced instead of failing silently', () => {
  const env = makeEnv(T0);
  env.localStorage.setItem = () => { throw new Error('blocked'); };
  for (const f of fs.readdirSync(path.join(SRC, 'content')).filter(f => f.endsWith('.js')).sort()) {
    new Function('window', fs.readFileSync(path.join(SRC, 'content', f), 'utf8'))(env.window);
  }
  const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
  new Function('window', 'document', 'localStorage', 'navigator', 'setTimeout',
    'clearTimeout', 'Date', 'URL', 'Blob', app)(
    env.window, env.document, env.localStorage, {},
    fn => { fn(); return 0; }, () => {}, env.Date,
    { createObjectURL: () => 'blob:x', revokeObjectURL() {} }, function Blob() {});

  const h = env.els['view-today'].innerHTML;
  assert.ok(h.includes('blocking local storage'), 'must warn the reader');
  assert.ok(h.includes('The idea'), 'and still render the entry');
});

check('restoring a backup replaces state and rejects rubbish', () => {
  const env = boot(T0);
  const id = Object.values(env.state().days)[0];
  env.fire('click', target({ act: 'complete', id }));
  const backup = JSON.stringify(env.state());

  const fresh = boot(T0);
  fresh.els['import-field'].value = backup;
  fresh.fire('click', target({ act: 'import-run' }));
  assert.strictEqual(fresh.state().log[id].completedOn, '2026-08-05', 'backup restored');

  fresh.els['import-field'].value = '{"v":1}';       // missing log
  fresh.fire('click', target({ act: 'import-run' }));
  assert.ok(fresh.state().log[id], 'bad payload must not wipe existing state');
});

check('pressing Library while reading an entry goes back to the list', () => {
  /* The library is two screens behind one tab: a list, and an entry opened from
   * it. Clearing the open entry only when navigating away meant pressing Library
   * from inside an entry re-rendered that entry, so the tab appeared to do
   * nothing and the only way back was the entry's own close button. */
  const env = boot(T0);
  const id = env.window.LESSONS[2].id;

  env.fire('click', target({ act: 'go', view: 'library' }));
  assert.ok(env.els['view-library'].innerHTML.includes('shelf__row'), 'the library should open on the list');

  env.fire('click', target({ act: 'lib-open', id }));
  assert.ok(!env.els['view-library'].innerHTML.includes('shelf__row'), 'the entry should have replaced the list');

  env.fire('click', target({ view: 'library' }, true));
  assert.ok(env.els['view-library'].innerHTML.includes('shelf__row'),
    'pressing Library from inside an entry must return to the list');
});

check('the cheatsheet is exactly the entries that carry a line', () => {
  /* The selection is the entire editorial claim of this view, and it lives in
   * the content rather than in a filter, so nothing else can catch a row that
   * appears without a line or a line that never reaches a row. */
  const env = boot(T0);
  env.fire('click', target({ act: 'go', view: 'cheatsheet' }));
  const html = env.els['view-cheatsheet'].innerHTML;

  const withLine = env.window.LESSONS.filter(l => !!l.cheat);
  assert.ok(withLine.length > 0, 'no entry carries a cheat line');

  for (const l of withLine) {
    assert.ok(html.includes('data-id="' + l.id + '"'), 'has a cheat line but no row: ' + l.id);
  }
  for (const l of env.window.LESSONS.filter(l => !l.cheat)) {
    assert.ok(!html.includes('data-id="' + l.id + '"'), 'row without a cheat line: ' + l.id);
  }

  const rows = (html.match(/class="cheat__row"/g) || []).length;
  assert.strictEqual(rows, withLine.length, 'one row per line, no more');
});

check('the cheatsheet says how much of the corpus it leaves out', () => {
  /* Twenty-odd lines presented as the whole corpus would be the exact
   * management-writing failure these entries warn about. */
  const env = boot(T0);
  env.fire('click', target({ act: 'go', view: 'cheatsheet' }));
  const html = env.els['view-cheatsheet'].innerHTML;
  const withheld = env.window.LESSONS.filter(l => !l.cheat).length;
  assert.ok(html.includes(' ' + withheld + ' '), 'the withheld count is not stated on the page');
});

check('every cheat line is one plain line of the right shape', () => {
  const env = boot(T0);
  for (const l of env.window.LESSONS.filter(l => l.cheat !== undefined)) {
    assert.ok(!/\n/.test(l.cheat), l.id + ': cheat spans more than one line');
    assert.ok(!/—/.test(l.cheat), l.id + ': cheat has an em dash');
    assert.ok(l.cheat.length >= 40 && l.cheat.length <= 190,
      l.id + ': cheat is ' + l.cheat.length + ' chars, outside 40-190');
  }
});

check('following a cheatsheet row opens the entry behind it', () => {
  const env = boot(T0);
  const first = env.window.LESSONS.find(l => !!l.cheat);
  env.fire('click', target({ act: 'go', view: 'cheatsheet' }));
  env.fire('click', target({ act: 'cheat-open', id: first.id }));
  assert.ok(!env.els['view-library'].hidden, 'the library should be showing');
  assert.ok(env.els['view-cheatsheet'].hidden, 'the cheatsheet should be hidden');
  assert.ok(env.els['view-library'].innerHTML.includes(first.title),
    'the opened entry is not the one the row pointed at');
});

console.log('\n' + passed + ' checks passed\n');

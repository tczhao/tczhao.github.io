#!/usr/bin/env node
/*
 * Engine behaviour, driven against synthetic fixtures rather than real
 * content. The fixtures exist so engine correctness does not wait on a corpus
 * and does not silently change when one is edited.
 */
const path = require('path');
const assert = require('assert');
const { boot, target, makeEnv, check, report, templateHole, DAY, ENGINE } = require('./harness');
const { validate, validateConfig } = require('../lib/build');
const fs = require('fs');

const FULL = path.join(__dirname, 'fixtures', 'full');
const PLAIN = path.join(__dirname, 'fixtures', 'plain');
const EVIDENCE = path.join(__dirname, 'fixtures', 'evidence');
const COMPUTE = path.join(__dirname, 'fixtures', 'compute');
const COMPUTE_INTRO = path.join(__dirname, 'fixtures', 'compute-intro');
const WORKED = path.join(__dirname, 'fixtures', 'worked');
const T0 = new Date(2026, 7, 5, 9, 0, 0).getTime();     // Wed 5 Aug 2026, local

function todayId(env) {
  const days = env.state().days;
  return days[Object.keys(days).sort().pop()];
}

console.log('\nDaily engine\n');

/* --- Sequence and the daily pick ---------------------------------------- */

check('corpus loads and exactly one day is assigned on first boot', () => {
  const env = boot(FULL, T0);
  assert.strictEqual(env.window.LESSONS.length, 9);
  assert.strictEqual(Object.keys(env.state().days).length, 1);
});

check('a lapsed entry never enters the sequence', () => {
  const env = boot(FULL, T0);
  const seq = env.api.seq();
  assert.strictEqual(seq.length, 8, 'nine entries, one expired');
  assert.ok(!seq.includes('alpha-stale'), 'expired entry must not be scheduled');
});

check('an entry whose expiry has not yet passed stays in the sequence', () => {
  // Boot before the fixture expiry date: all nine are live.
  const early = boot(FULL, new Date(2025, 11, 1, 9, 0, 0).getTime());
  assert.strictEqual(early.api.seq().length, 9);
});

check('the opening cycle interleaves tracks instead of grouping them', () => {
  const seen = [];
  let store = null;
  for (let d = 0; d < 3; d++) {
    const e = boot(FULL, T0 + d * DAY, store);
    store = { ...e.store };
    const id = todayId(e);
    seen.push(e.window.LESSONS.find(l => l.id === id).track);
  }
  assert.strictEqual(new Set(seen).size, 3, 'expected three distinct tracks, got ' + seen.join(','));
});

check('the same day always serves the same entry', () => {
  const a = boot(FULL, T0);
  const first = a.els['stamp-num'].textContent;
  const b = boot(FULL, T0 + 6 * 3600000, { ...a.store });
  assert.strictEqual(b.els['stamp-num'].textContent, first);
});

check('a missed day pushes content forward rather than skipping it', () => {
  const a = boot(FULL, T0);
  const day1 = todayId(a);
  const b = boot(FULL, T0 + 4 * DAY, { ...a.store });
  const days = b.state().days;
  assert.strictEqual(Object.keys(days).length, 2, 'only days you showed up get entries');
  assert.notStrictEqual(days[Object.keys(days).sort().pop()], day1);
  assert.strictEqual(new Set(Object.values(days)).size, 2);
});

/* --- The gate ------------------------------------------------------------ */

check('the gate withholds the entry body until something is committed', () => {
  const env = boot(FULL, T0);
  const html = env.els['view-today'].innerHTML;
  assert.ok(html.includes('Call it first'), 'gate must be shown');
  assert.ok(html.includes('opens once you have committed'), 'curtain must be shown');
  assert.ok(!html.includes('The idea'), 'body must stay withheld');
  assert.ok(!html.includes('Log this entry'), 'you cannot log past a closed gate');
});

check('committing an answer opens the body and freezes what was written', () => {
  const env = boot(FULL, T0);
  const id = todayId(env);
  env.document.getElementById('gate-field').value = 'my first call';
  env.fire('click', target({ act: 'gate-unlock', id }));

  const s = env.state();
  assert.strictEqual(s.log[id].gate.answer, 'my first call');
  assert.strictEqual(s.log[id].gate.on, '2026-08-05');

  const html = env.els['view-today'].innerHTML;
  assert.ok(html.includes('The idea'), 'body must open');
  assert.ok(html.includes('my first call'), 'the committed answer stays visible');
  assert.ok(!html.includes('id="gate-field"'), 'the field is gone once committed');
});

check('a committed answer cannot be revised after the reveal', () => {
  const env = boot(FULL, T0);
  const id = todayId(env);
  env.document.getElementById('gate-field').value = 'original call';
  env.fire('click', target({ act: 'gate-unlock', id }));
  assert.strictEqual(env.api.unlockGate(id, 'a better answer now that I know'), false);
  assert.strictEqual(env.state().log[id].gate.answer, 'original call');
});

check('an empty or too-short commitment is refused', () => {
  const env = boot(FULL, T0);
  const id = todayId(env);
  env.document.getElementById('gate-field').value = '  ';
  env.fire('click', target({ act: 'gate-unlock', id }));
  assert.strictEqual(env.state().log[id], undefined, 'nothing should be recorded');
  assert.ok(!env.els['view-today'].innerHTML.includes('The idea'));
});

check('the committed answer travels into the deep-dive prompt', () => {
  const env = boot(FULL, T0);
  const id = todayId(env);
  env.document.getElementById('gate-field').value = 'I think it is a retry storm';
  env.fire('click', target({ act: 'gate-unlock', id }));
  env.fire('input', target({ elId: 'note-field', id, value: 'what actually happened' }));

  const again = boot(FULL, T0, { ...env.store });
  again.fire('click', target({ act: 'show-prompt', id }));
  const txt = again.els['prompt-text'].textContent;
  assert.ok(txt.includes('I think it is a retry storm'), 'the pre-commitment must travel');
  assert.ok(txt.includes('what actually happened'), 'the note must travel');
  assert.ok(txt.includes('Fixture intro line.'), 'site prompt preamble is used');
});

check('the library reader is not gated - reading ahead stays free', () => {
  const env = boot(FULL, T0);
  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-open', id: 'beta-two' }));
  const html = env.els['view-library'].innerHTML;
  assert.ok(html.includes('The idea'), 'library reading is ungated');
  assert.ok(!html.includes('id="gate-field"'));
});

/* --- Scheduling ---------------------------------------------------------- */

function logToday(env) {
  const id = todayId(env);
  env.document.getElementById('gate-field').value = 'a committed call';
  env.fire('click', target({ act: 'gate-unlock', id }));
  env.fire('click', target({ act: 'complete', id }));
  return id;
}

check('logging starts the streak and schedules review for tomorrow', () => {
  const env = boot(FULL, T0);
  const id = logToday(env);
  const s = env.state();
  assert.strictEqual(s.streak.count, 1);
  assert.strictEqual(s.streak.best, 1);
  assert.strictEqual(s.log[id].box, 1);
  assert.strictEqual(s.log[id].due, '2026-08-06');
});

check('consecutive days extend the streak, a gap resets it but keeps the best', () => {
  let store = null;
  let env;
  for (let d = 0; d < 3; d++) {
    env = boot(FULL, T0 + d * DAY, store);
    logToday(env);
    store = { ...env.store };
  }
  assert.strictEqual(env.state().streak.count, 3);

  env = boot(FULL, T0 + 5 * DAY, store);
  logToday(env);
  const s = env.state();
  assert.strictEqual(s.streak.count, 1, 'gap resets the running count');
  assert.strictEqual(s.streak.best, 3, 'best survives the reset');
});

check('grading moves the box and the interval follows', () => {
  const env = boot(FULL, T0);
  const id = logToday(env);
  env.fire('click', target({ act: 'grade', grade: 'got', id }));
  assert.strictEqual(env.state().log[id].box, 2);
  assert.strictEqual(env.state().log[id].due, '2026-08-08', 'box 2 is 3 days');

  env.fire('click', target({ act: 'grade', grade: 'got', id }));
  env.fire('click', target({ act: 'grade', grade: 'close', id }));
  assert.strictEqual(env.state().log[id].box, 3, 'close holds the box');

  env.fire('click', target({ act: 'grade', grade: 'miss', id }));
  assert.strictEqual(env.state().log[id].box, 1, 'miss resets');
  assert.strictEqual(env.state().log[id].due, '2026-08-06');
});

check('the box never runs past the last interval', () => {
  const env = boot(FULL, T0);
  const id = logToday(env);
  for (let i = 0; i < 10; i++) env.fire('click', target({ act: 'grade', grade: 'got', id }));
  assert.strictEqual(env.state().log[id].box, 5);
  assert.strictEqual(env.state().log[id].due, '2026-09-09', 'box 5 is 35 days');
});

check('a due card is counted, a future one is not', () => {
  const env = boot(FULL, T0);
  logToday(env);
  assert.strictEqual(env.els['badge-review'].hidden, true, 'nothing due the day you log it');
  const later = boot(FULL, T0 + DAY, { ...env.store });
  assert.strictEqual(later.els['badge-review'].hidden, false);
  assert.strictEqual(later.els['badge-review'].textContent, '1');
});

check('a card that lapses after being learned leaves the review deck', () => {
  // Learn the entry while it is still live, then boot past its expiry.
  const early = new Date(2025, 11, 1, 9, 0, 0).getTime();
  let env = boot(FULL, early);
  const seeded = {
    'fixt-full.v1': JSON.stringify({
      v: 1, startedOn: '2025-12-01',
      log: { 'alpha-stale': { box: 1, due: '2025-12-02', note: '', reviews: [], completedOn: '2025-12-01', gate: null, attempts: [] } },
      days: { '2025-12-01': 'alpha-stale' },
      streak: { count: 1, best: 1, lastOn: '2025-12-01' }, forecasts: {}, theme: null
    })
  };
  const before = boot(FULL, new Date(2025, 11, 3, 9, 0, 0).getTime(), seeded);
  assert.deepStrictEqual(before.api.dueList(), ['alpha-stale'], 'due while live');

  const after = boot(FULL, T0, seeded);
  assert.deepStrictEqual(after.api.dueList(), [], 'lapsed cards leave the deck');
});

/* --- Forecast book ------------------------------------------------------- */

check('Brier is the mean squared error of the probability against the outcome', () => {
  const env = boot(FULL, T0);
  const a = env.api.addForecast('will a happen', 0.8, '2026-09-01', null);
  const b = env.api.addForecast('will b happen', 0.3, '2026-09-01', null);
  assert.strictEqual(env.api.brier(), null, 'nothing resolved yet');

  env.api.resolveForecast(a, 1);      // (0.8-1)^2 = 0.04
  env.api.resolveForecast(b, 0);      // (0.3-0)^2 = 0.09
  const br = env.api.brier();
  assert.strictEqual(br.n, 2);
  assert.ok(Math.abs(br.score - 0.065) < 1e-9, 'expected 0.065, got ' + br.score);
});

check('an always-fifty-percent forecaster scores exactly 0.25', () => {
  const env = boot(FULL, T0);
  [1, 0, 1, 0].forEach((o, i) => {
    const f = env.api.addForecast('q' + i, 0.5, '2026-09-01', null);
    env.api.resolveForecast(f, o);
  });
  assert.ok(Math.abs(env.api.brier().score - 0.25) < 1e-9);
});

check('a resolved forecast cannot be re-resolved', () => {
  const env = boot(FULL, T0);
  const f = env.api.addForecast('q', 0.9, '2026-09-01', null);
  env.api.resolveForecast(f, 1);
  env.api.resolveForecast(f, 0);
  assert.strictEqual(env.state().forecasts[f].outcome, 1);
});

check('calibration buckets by predicted probability and counts hits', () => {
  const env = boot(FULL, T0);
  const a = env.api.addForecast('a', 0.85, '2026-09-01', null);
  const b = env.api.addForecast('b', 0.82, '2026-09-01', null);
  const c = env.api.addForecast('c', 0.25, '2026-09-01', null);
  env.api.resolveForecast(a, 1);
  env.api.resolveForecast(b, 0);
  env.api.resolveForecast(c, 0);
  const buckets = env.api.calibration();
  assert.strictEqual(buckets[8].n, 2, 'two forecasts in the 80-90 band');
  assert.strictEqual(buckets[8].hits, 1);
  assert.strictEqual(buckets[2].n, 1, 'one in the 20-30 band');
  assert.strictEqual(buckets[2].hits, 0);
});

check('an unresolved forecast is excluded from both score and calibration', () => {
  const env = boot(FULL, T0);
  env.api.addForecast('open one', 0.7, '2026-12-01', null);
  assert.strictEqual(env.api.brier(), null);
  assert.strictEqual(env.api.calibration().reduce((n, b) => n + b.n, 0), 0);
});

check('a ripe forecast is badged, a pending one is not', () => {
  const env = boot(FULL, T0);
  env.api.addForecast('pending', 0.5, '2026-12-01', null);
  env.api.render();
  assert.strictEqual(env.els['badge-forecast'].hidden, true);
  env.api.addForecast('ripe', 0.5, '2026-08-01', null);
  env.api.render();
  assert.strictEqual(env.els['badge-forecast'].hidden, false);
  assert.strictEqual(env.els['badge-forecast'].textContent, '1');
});

/* --- The plain fixture: no review rotation ------------------------------- */

check('a site with no review model has no review tab and no boxes', () => {
  const env = boot(PLAIN, T0);
  const nav = env.els['nav'].innerHTML;
  assert.ok(!nav.includes('data-view="review"'), 'no review tab');
  assert.ok(nav.includes('data-view="attempts"'), 'attempts tab instead');

  const id = todayId(env);
  env.fire('click', target({ act: 'complete', id }));
  const r = env.state().log[id];
  assert.strictEqual(r.box, 0, 'no Leitner box is opened');
  assert.strictEqual(r.due, null, 'nothing is scheduled');
  assert.deepStrictEqual(env.api.dueList(), []);
});

check('the attempts log records what happened, dated, and keeps history', () => {
  const env = boot(PLAIN, T0);
  const id = todayId(env);
  env.fire('click', target({ act: 'complete', id }));
  env.fire('click', target({ act: 'go', view: 'attempts' }));

  env.setAttemptField(id, 'first go, it split');
  env.fire('click', target({ act: 'attempt-add', id }));
  env.setAttemptField(id, 'second go, held together');
  env.fire('click', target({ act: 'attempt-add', id }));

  const att = env.state().log[id].attempts;
  assert.strictEqual(att.length, 2);
  assert.strictEqual(att[0].text, 'first go, it split');
  assert.strictEqual(att[1].on, '2026-08-05');
  assert.ok(env.els['view-attempts'].innerHTML.includes('first go, it split'));
});

check('a site without recall cards still renders a full entry', () => {
  const env = boot(PLAIN, T0);
  const html = env.els['view-today'].innerHTML;
  ['The idea', 'Why it holds', 'Try this today', 'Log it', 'Take it further'].forEach(m => {
    assert.ok(html.includes(m), 'missing section: ' + m);
  });
  assert.ok(!templateHole(html), 'template hole');
});

/* --- Safety and durability ----------------------------------------------- */

check('two sites never collide in storage', () => {
  const shared = {};
  const a = boot(FULL, T0, shared);
  Object.assign(shared, a.store);
  const b = boot(PLAIN, T0, shared);
  assert.ok('fixt-full.v1' in b.store);
  assert.ok('fixt-plain.v1' in b.store);
  assert.notDeepStrictEqual(
    JSON.parse(b.store['fixt-full.v1']).days,
    JSON.parse(b.store['fixt-plain.v1']).days
  );
});

check('written text is escaped, not injected', () => {
  const env = boot(FULL, T0);
  const id = todayId(env);
  const nasty = '<img src=x onerror="alert(1)">';
  env.document.getElementById('gate-field').value = nasty;
  env.fire('click', target({ act: 'gate-unlock', id }));
  env.fire('input', target({ elId: 'note-field', id, value: nasty }));

  const again = boot(FULL, T0, { ...env.store });
  const html = again.els['view-today'].innerHTML;
  assert.strictEqual(again.state().log[id].note, nasty, 'stored verbatim');
  assert.ok(html.includes('&lt;img'), 'rendered escaped');
  assert.ok(!html.includes('<img src=x'), 'raw tag must not reach the DOM');
});

check('a corrupt or foreign record falls back to a clean slate', () => {
  const a = boot(FULL, T0, { 'fixt-full.v1': '{not json at all' });
  assert.ok(/^\d{3}$/.test(a.els['stamp-num'].textContent), 'should still boot');
  const b = boot(FULL, T0, { 'fixt-full.v1': JSON.stringify({ v: 99, log: {} }) });
  assert.strictEqual(b.state().v, 1, 'unknown version is discarded');
});

check('a partial record boots by merging onto a blank', () => {
  const env = boot(FULL, T0, { 'fixt-full.v1': JSON.stringify({ v: 1, log: {} }) });
  const s = env.state();
  assert.ok(s.streak, 'streak restored');
  assert.ok(s.forecasts, 'forecasts restored');
  assert.ok(/^\d{3}$/.test(env.els['stamp-num'].textContent));
});

check('blocked storage is surfaced instead of failing silently', () => {
  const env = makeEnv(T0, 'fixt-full.v1');
  env.localStorage.setItem = () => { throw new Error('blocked'); };
  new Function('window', fs.readFileSync(path.join(FULL, 'site.js'), 'utf8'))(env.window);
  new Function('window', fs.readFileSync(path.join(FULL, 'content', '01.js'), 'utf8'))(env.window);
  new Function('window', fs.readFileSync(path.join(ENGINE, 'speech.js'), 'utf8'))(env.window);
  const app = fs.readFileSync(path.join(ENGINE, 'app.js'), 'utf8');
  new Function('window', 'document', 'localStorage', 'navigator', 'setTimeout',
    'clearTimeout', 'Date', 'URL', 'Blob', app)(
    env.window, env.document, env.localStorage, {},
    fn => { fn(); return 0; }, () => {}, env.Date,
    { createObjectURL: () => 'blob:x', revokeObjectURL() {} }, function Blob() {});

  const h = env.els['view-today'].innerHTML;
  assert.ok(h.includes('blocking local storage'), 'must warn the reader');
  assert.ok(h.includes('Call it first'), 'and still render the gate');
});

check('restoring a backup replaces state and rejects rubbish', () => {
  const env = boot(FULL, T0);
  const id = logToday(env);
  const backup = JSON.stringify(env.state());

  const fresh = boot(FULL, T0);
  fresh.document.getElementById('import-field').value = backup;
  fresh.fire('click', target({ act: 'import-run' }));
  assert.strictEqual(fresh.state().log[id].completedOn, '2026-08-05');

  fresh.document.getElementById('import-field').value = '{"v":1}';
  fresh.fire('click', target({ act: 'import-run' }));
  assert.ok(fresh.state().log[id], 'a bad payload must not wipe existing state');
});

check('every fixture entry renders through the library without a hole', () => {
  const env = boot(FULL, T0);
  for (const l of env.window.LESSONS) {
    const e = boot(FULL, T0, { ...env.store });
    e.fire('click', target({ act: 'go', view: 'library' }));
    e.fire('click', target({ act: 'lib-open', id: l.id }));
    const html = e.els['view-library'].innerHTML;
    assert.ok(html.includes('The idea'), l.id + ' failed to render');
    assert.ok(!templateHole(html), l.id + ' has a template hole');
  }
});

/* --- The evidence gate --------------------------------------------------- */
/* Every check below traces to a real miss found when a corpus design was
 * adversarially fact-checked. The pattern there was that citations were never
 * invented - they were correct in the fields and wrong in the prose, or true
 * but quoted one-sided. A gate that only checks a field is present catches
 * none of that, so these enforce shape rather than existence. */

const evidenceCfg = () => ({
  key: 'x.v1', slug: 'x', name: 'X', tagline: 'x',
  tracks: [{ id: 'alpha', name: 'Alpha' }],
  review: 'none', evidenceGate: true
});

const evidenceEntry = over => Object.assign({
  id: 'e1', track: 'alpha', title: 'T', source: 'S',
  evidence: '48 studies, n = 900, d = 0.30',
  interval: { lo: 0.09, hi: 0.52, measure: 'd' },
  replication: 'replicated',
  idea: 'i', why: 'w', failureMode: 'f', experiment: 'x',
  reflection: 'r', deepDive: 'd'
}, over);

const errsFor = over => validate(evidenceCfg(), [evidenceEntry(over)]).errs;

check('the evidence gate demands a citation and a verdict on every entry', () => {
  assert.deepStrictEqual(errsFor({}), [], 'a complete entry must pass');
  assert.ok(errsFor({ evidence: '' }).some(e => /evidence/.test(e)), 'missing evidence must fail');
  assert.ok(errsFor({ replication: '' }).some(e => /replication/.test(e)), 'missing replication must fail');
});

check('a replication verdict outside the vocabulary is refused', () => {
  assert.ok(errsFor({ replication: 'probably-true' }).some(e => /replication/.test(e)));
  // The two values that exist because the four-value version misfiled them.
  for (const v of ['single', 'overclaimed']) {
    assert.deepStrictEqual(
      errsFor({ replication: v }), [],
      v + ' must be a legal verdict - it is why the vocabulary was widened'
    );
  }
});

check('a one-sided interval is refused wherever an interval is given', () => {
  // Quoting "extends to 2.2" while hiding a lower bound near 1.0 was a real
  // finding. One-sided is the failure, so one-sided is what must not build.
  assert.ok(errsFor({ interval: { lo: 0.09, measure: 'd' } }).some(e => /interval/.test(e)),
    'an interval missing its upper bound must fail');
  assert.ok(errsFor({ interval: { hi: 0.52, measure: 'd' } }).some(e => /interval/.test(e)),
    'an interval missing its lower bound must fail');
});

check('whether an interval is compulsory is the site\'s policy, not the engine\'s', () => {
  // A field that reports confidence intervals as a matter of course should
  // demand them. One that reports historical simulation has no interval to
  // give, and forcing the field there buys invented numbers, not rigour.
  const strict = { ...evidenceCfg(), requireInterval: true };
  const lax = evidenceCfg();
  const bare = evidenceEntry({ interval: undefined });

  assert.ok(validate(strict, [bare]).errs.some(e => /interval/.test(e)),
    'a strict site must refuse a measured verdict with no interval');
  assert.deepStrictEqual(validate(lax, [bare]).errs, [],
    'a lax site must accept it');
  assert.deepStrictEqual(
    validate(strict, [evidenceEntry({ replication: 'craft', interval: undefined })]).errs, [],
    'craft is exempt even under the strict policy'
  );
});

check('craft and statute are exempt from the interval rule', () => {
  // Neither is a measured effect, so demanding an interval would push authors
  // to invent one - the opposite of the point.
  assert.deepStrictEqual(errsFor({ replication: 'craft', interval: undefined }), []);
  assert.deepStrictEqual(
    errsFor({ replication: 'statute', interval: undefined, asAt: '2026-07-01', sourceUrl: 'https://example.invalid/x' }),
    []
  );
});

/* --- Cheatsheet ----------------------------------------------------------
 * The one view meant to be read at speed rather than studied, so its whole
 * value is the narrowness of what reaches it. These guard the filter. */

check('a verdict-filtered cheatsheet without the evidence gate that feeds it is refused', () => {
  // The filter reads the replication verdict, and nothing carries one without
  // the gate. Left unguarded this builds clean and renders an empty page, which
  // is the failure mode the rest of this file exists to prevent. An opt-in
  // cheatsheet reads no such field and is legal on any site.
  const base = { key: 'x.v1', slug: 'x', name: 'X', tagline: 'x', tracks: [{ id: 'alpha', name: 'Alpha' }] };
  const verdicts = { verdicts: ['replicated'] };
  assert.ok(validateConfig({ ...base, cheatsheet: verdicts }).some(e => /cheatsheet/.test(e)),
    'a verdict filter without evidenceGate must not build');
  assert.ok(validateConfig({ ...base, cheatsheet: verdicts, evidenceGate: true }).every(e => !/cheatsheet/.test(e)),
    'the pair together is the supported configuration');
  assert.ok(validateConfig({ ...base, cheatsheet: true }).every(e => !/cheatsheet/.test(e)),
    'an opt-in cheatsheet needs no evidence gate');
  assert.ok(validateConfig({ ...base, evidenceGate: true, cheatsheet: { verdicts: ['probably-true'] } })
    .some(e => /cheatsheet/.test(e)), 'a verdict outside the vocabulary must not build');
  assert.ok(validateConfig({ ...base, evidenceGate: true, cheatsheet: { verdicts: [] } })
    .some(e => /cheatsheet/.test(e)), 'an empty verdict list would render an empty page');
});

check('an opt-in cheatsheet takes a line on any entry and demands none', () => {
  /* Where a corpus grades its own evidence the filter is derived and the
   * author gets no say. Where it does not, there is nothing to derive from,
   * so the line itself is the selection and no entry is obliged to carry one. */
  const cfg = { key: 'x.v1', slug: 'x', name: 'X', tagline: 'x', review: 'none',
    tracks: [{ id: 'alpha', name: 'Alpha' }], cheatsheet: true };
  const entry = over => Object.assign({
    id: 'e1', track: 'alpha', title: 'T', source: 'S',
    idea: 'i', why: 'w', failureMode: 'f', experiment: 'x', reflection: 'r', deepDive: 'd'
  }, over);

  assert.deepStrictEqual(validate(cfg, [entry({ cheat: 'A line worth acting on.' })]).errs, []);
  assert.ok(validate(cfg, [entry({})]).errs.some(e => /cheat/.test(e)),
    'a cheatsheet with no lines anywhere is a blank tab and must not build');
  assert.deepStrictEqual(
    validate(cfg, [entry({ cheat: 'A line.' }), entry({ id: 'e2' })]).errs, [],
    'one line is enough - the rest of the corpus is not obliged to carry one'
  );
});

check('the cheatsheet demands a line on every qualifying entry and only those', () => {
  const on = { ...evidenceCfg(), cheatsheet: { verdicts: ['replicated'] } };
  const errs = over => validate(on, [evidenceEntry(over)]).errs;

  assert.ok(errs({}).some(e => /cheat/.test(e)),
    'a replicated entry with no cheat line leaves a hole in the page');
  assert.deepStrictEqual(errs({ cheat: 'Train it, the effect is real and small.' }), []);
  assert.ok(errs({ cheat: '' }).some(e => /cheat/.test(e)), 'an empty cheat line must fail');
  assert.ok(errs({ cheat: 'Two\nlines.' }).some(e => /one line/.test(e)),
    'the cheatsheet renders one row, so a cheat line is one line');

  // Content that can never render is as much a defect as content that is
  // missing, and it is the harder of the two to notice.
  assert.ok(
    errs({ replication: 'craft', interval: undefined, cheat: 'Do the thing.' }).some(e => /cheat/.test(e)),
    'a cheat line on a verdict that never reaches the cheatsheet must fail'
  );
  assert.ok(validate(evidenceCfg(), [evidenceEntry({ cheat: 'x' })]).errs.some(e => /cheat/.test(e)),
    'a cheat line on a site with no cheatsheet must fail');
});

check('a site that does not ask for a cheatsheet does not get one', () => {
  // Thirteen other sites share this engine and none of them declare the flag.
  const env = boot(EVIDENCE, T0);
  assert.ok(!env.els['view-cheatsheet'], 'the cheatsheet view mounted without being declared');
  assert.ok(!((env.els['nav'] || {})._html || '').includes('cheatsheet'),
    'a cheatsheet tab appeared in a site that never asked for one');
});

check('pressing Library while reading an entry goes back to the list', () => {
  /* The library is two screens behind one tab: a list, and an entry opened from
   * it. Clearing the open entry only when navigating away meant pressing Library
   * from inside an entry re-rendered that entry, so the tab appeared to do
   * nothing and the only way back was the entry's own close button. */
  const env = boot(FULL, T0);
  const id = env.window.LESSONS[2].id;

  env.fire('click', target({ act: 'go', view: 'library' }));
  const list = env.els['view-library'].innerHTML;
  assert.ok(list.includes('shelf__row'), 'the library should open on the list');

  env.fire('click', target({ act: 'lib-open', id }));
  assert.ok(!env.els['view-library'].innerHTML.includes('shelf__row'), 'the entry should have replaced the list');

  env.fire('click', target({ view: 'library' }, true));
  assert.ok(env.els['view-library'].innerHTML.includes('shelf__row'),
    'pressing Library from inside an entry must return to the list');
});

/* --- The library pager --------------------------------------------------- */

/* Which entry each half of the pager points at. Read off the markup rather
 * than off an exported function, because the bug this guards against is the
 * pager offering a different entry from the one the shelf would have. */
function pager(html) {
  const at = dir => {
    const m = new RegExp('pager__btn--' + dir + '"[^>]*data-id="([^"]+)"').exec(html);
    return m ? m[1] : null;
  };
  return { prev: at('prev'), next: at('next') };
}

check('reading an entry offers the one either side of it', () => {
  const env = boot(FULL, T0);
  const seq = env.api.seq();

  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-open', id: seq[1] }));

  assert.deepStrictEqual(pager(env.els['view-library'].innerHTML),
    { prev: seq[0], next: seq[2] }, 'the pager must follow library order');
});

check('stepping to the next entry stays in the reader', () => {
  const env = boot(FULL, T0);
  const seq = env.api.seq();
  const byId = {};
  env.window.LESSONS.forEach(l => { byId[l.id] = l; });

  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-open', id: seq[0] }));
  env.fire('click', target({ act: 'lib-open', id: pager(env.els['view-library'].innerHTML).next }));

  const html = env.els['view-library'].innerHTML;
  assert.ok(!html.includes('shelf__row'), 'stepping must not drop back to the list');
  assert.ok(html.includes(byId[seq[1]].title), 'expected the next entry to be open');
});

check('the ends of the library are stops, not wraps', () => {
  /* Wrapping would make the pager a loop with no edge, and the library is a
   * finite ordered corpus - reaching the end of it is information.
   *
   * The ends come off the shelf rather than off SEQ: a lapsed entry leaves the
   * sequence but stays on the shelf, so the last row is not the last id in
   * SEQ. Reading the shelf is also what makes this a real check that the two
   * agree, rather than a check that the pager matches its own idea of order. */
  const env = boot(FULL, T0);
  env.fire('click', target({ act: 'go', view: 'library' }));

  const shelf = [...env.els['view-library'].innerHTML
    .matchAll(/class="shelf__row"[^>]*data-id="([^"]+)"/g)].map(m => m[1]);
  assert.ok(shelf.length > 2, 'expected a shelf to read the ends off');

  env.fire('click', target({ act: 'lib-open', id: shelf[0] }));
  assert.strictEqual(pager(env.els['view-library'].innerHTML).prev, null, 'the first entry has nothing before it');

  env.fire('click', target({ act: 'lib-open', id: shelf[shelf.length - 1] }));
  assert.strictEqual(pager(env.els['view-library'].innerHTML).next, null, 'the last entry has nothing after it');
});

check('the pager follows the filtered shelf, not the raw sequence', () => {
  /* The shelf you stepped off is the list you expect to be walking. Stepping
   * out of a filtered shelf onto an entry it never showed is the whole failure
   * this shares libraryRows() with renderLibrary() to avoid. */
  const env = boot(FULL, T0);
  const byId = {};
  env.window.LESSONS.forEach(l => { byId[l.id] = l; });

  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-track', track: 'beta' }));
  env.fire('click', target({ act: 'lib-open', id: 'beta-one' }));

  const next = pager(env.els['view-library'].innerHTML).next;
  assert.ok(next, 'a filtered shelf still has a next entry');
  assert.strictEqual(byId[next].track, 'beta', 'the pager left the track the shelf was filtered to');
});

check('an entry opened from outside the filter still has neighbours', () => {
  /* A cheatsheet row opens an entry directly and leaves whatever filter was
   * set behind it, so the open entry can be absent from its own shelf. Without
   * a fallback the pager renders empty and the reader is stranded. */
  const env = boot(FULL, T0);

  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-track', track: 'beta' }));
  env.fire('click', target({ act: 'lib-open', id: 'gamma-two' }));

  const p = pager(env.els['view-library'].innerHTML);
  assert.ok(p.prev && p.next, 'expected the unfiltered order to supply neighbours, got ' + JSON.stringify(p));
});

check('following a cheatsheet row still opens the entry, not the list', () => {
  /* cheat-open routes through go('library'), which now clears the open entry,
   * so it depends on setting libOpen after that call rather than before. */
  const env = boot(EVIDENCE, T0);
  const first = env.window.LESSONS[0];
  env.fire('click', target({ act: 'cheat-open', id: first.id }));
  const html = env.els['view-library'].innerHTML;
  assert.ok(!html.includes('shelf__row'), 'a cheatsheet row must open the entry, not the list');
  assert.ok(html.includes(first.title), 'and it must be the entry the row pointed at');
});

check('a statutory entry must carry an as-at date and a primary source', () => {
  const base = { replication: 'statute', interval: undefined, asAt: '2026-07-01', sourceUrl: 'https://example.invalid/x' };
  assert.ok(errsFor({ ...base, asAt: undefined }).some(e => /asAt/.test(e)), 'statute needs an as-at date');
  assert.ok(errsFor({ ...base, sourceUrl: undefined }).some(e => /sourceUrl/.test(e)), 'statute needs a source url');
  assert.ok(errsFor({ ...base, asAt: 'July 2026' }).some(e => /asAt/.test(e)), 'as-at must be an ISO date');
});

check('evidence fields are refused on a site that has no evidence gate', () => {
  // Same shape as the existing expiry and forecast guards: a mechanic that is
  // half-configured fails loudly rather than silently doing nothing.
  const cfg = { ...evidenceCfg(), evidenceGate: false };
  const errs = validate(cfg, [evidenceEntry({})]).errs;
  assert.ok(errs.some(e => /evidenceGate/.test(e)), 'got: ' + errs.join('; '));
});

check('the entry shows its citation and its verdict', () => {
  const env = boot(EVIDENCE, T0);
  for (const l of env.window.LESSONS) {
    const e = boot(EVIDENCE, T0, { ...env.store });
    e.fire('click', target({ act: 'go', view: 'library' }));
    e.fire('click', target({ act: 'lib-open', id: l.id }));
    const html = e.els['view-library'].innerHTML;
    assert.ok(html.includes(l.evidence), l.id + ' does not show its evidence line');
    assert.ok(/data-rep="/.test(html), l.id + ' does not show a replication chip');
    assert.ok(!templateHole(html), l.id + ' has a template hole');
  }
});

check('an interval renders with both bounds or not at all', () => {
  const env = boot(EVIDENCE, T0);
  const e = boot(EVIDENCE, T0, { ...env.store });
  e.fire('click', target({ act: 'go', view: 'library' }));
  e.fire('click', target({ act: 'lib-open', id: 'alpha-replicated' }));
  const html = e.els['view-library'].innerHTML;
  assert.ok(html.includes('1.42') && html.includes('1.59'), 'both bounds must be visible');
});

check('a citation past its re-verification interval is marked stale', () => {
  // Expiry covers statutory rot. Nothing covered citation rot, which is where
  // the fact-check actually found the failures.
  const fresh = boot(EVIDENCE, T0);
  const f = boot(EVIDENCE, T0, { ...fresh.store });
  f.fire('click', target({ act: 'go', view: 'library' }));
  f.fire('click', target({ act: 'lib-open', id: 'alpha-replicated' }));
  assert.ok(!/data-stale="1"/.test(f.els['view-library'].innerHTML), 'a fresh citation is not stale');

  const later = T0 + 200 * DAY;                    // reverifyDays is 180
  const s = boot(EVIDENCE, later);
  s.fire('click', target({ act: 'go', view: 'library' }));
  s.fire('click', target({ act: 'lib-open', id: 'alpha-replicated' }));
  assert.ok(/data-stale="1"/.test(s.els['view-library'].innerHTML),
    'a citation older than reverifyDays must be marked');
});

/* --- The worked example -------------------------------------------------- */
/* A gate that promises an answer has to produce one. Compositor's gate copy
 * said "the worked example opens once you have pasted something of yours" and
 * nothing rendered, because no entry carried the field. These pin the contract
 * in both directions: hidden until the gate opens, shown once it does. */

check('a worked example stays hidden until the gate opens', () => {
  const env = boot(WORKED, T0);
  const html = env.els['view-today'].innerHTML;
  assert.ok(!html.includes('Alpha one repaired'), 'the answer must not be in the DOM while gated');
  assert.ok(!/class="worked"/.test(html), 'nor the block that holds it');
});

check('committing opens the worked example next to what you wrote', () => {
  const env = boot(WORKED, T0);
  const id = todayId(env);
  env.document.getElementById('gate-field').value = 'my own attempt at the edit';
  env.fire('click', target({ act: 'gate-unlock', id }));

  const html = env.els['view-today'].innerHTML;
  assert.ok(html.includes('Alpha one repaired'), 'the worked example must open with the entry');
  assert.ok(html.includes('my own attempt at the edit'), 'your own edit stays on screen to compare against');
  // Broken then fixed: the diagnosis has to come before the repair to read as a pair.
  assert.ok(html.indexOf('Alpha one failure.') < html.indexOf('Alpha one repaired'),
    'the worked example belongs after the failure mode, not before it');
});

check('an entry with no worked example still renders', () => {
  // The field is optional, so a corpus can gain answers entry by entry rather
  // than needing all of them before any of them ship.
  const env = boot(WORKED, T0);
  env.fire('click', target({ act: 'go', view: 'library' }));
  env.fire('click', target({ act: 'lib-open', id: 'beta-bare' }));
  const html = env.els['view-library'].innerHTML;
  assert.ok(html.includes('The idea'), 'the entry must still render');
  assert.ok(!/class="worked"/.test(html), 'and must not render an empty worked block');
  assert.ok(!templateHole(html), 'no template hole');
});

/* --- The arithmetic gate ------------------------------------------------- */
/* A text gate proves you thought about it. This proves you did the sum, which
 * is a different and higher bar: the site holds your own figures, computes what
 * the entry's number should be for you, and refuses to show its answer until
 * you have written yours. What it keeps is the signed gap, because the
 * interesting quantity is not whether you were right but which direction you
 * are consistently wrong in. */

const computeCfg = over => Object.assign({
  key: 'c.v1', slug: 'c', name: 'C', tagline: 'c',
  tracks: [{ id: 'alpha', name: 'Alpha' }],
  review: 'none',
  profile: {
    fields: [
      { id: 'marginalRate', label: 'Marginal rate', unit: '%', min: 0, max: 60 },
      { id: 'balance', label: 'Balance', unit: '$', min: 0, max: 1e7 }
    ]
  }
}, over);

const computeEntry = over => Object.assign({
  id: 'c1', track: 'alpha', title: 'T', source: 'S',
  idea: 'i', why: 'w', failureMode: 'f', experiment: 'x',
  reflection: 'r', deepDive: 'd',
  compute: { question: 'Your wedge?', expr: 'marginalRate - 30', unit: '%' }
}, over);

const cErrs = (cfgOver, entryOver) =>
  validate(computeCfg(cfgOver), [computeEntry(entryOver)]).errs;

check('a computed entry needs a question and an expression', () => {
  assert.deepStrictEqual(cErrs({}, {}), []);
  assert.ok(cErrs({}, { compute: { expr: 'marginalRate' } }).some(e => /question/.test(e)));
  assert.ok(cErrs({}, { compute: { question: 'q' } }).some(e => /expr/.test(e)));
});

check('an expression may only name fields the profile declares', () => {
  // A typo here would otherwise surface as a silent NaN on the one day that
  // entry comes up, months after it was written.
  assert.ok(
    cErrs({}, { compute: { question: 'q', expr: 'marginalRat - 30' } })
      .some(e => /marginalRat/.test(e)),
    'an undeclared identifier must fail the build'
  );
  assert.deepStrictEqual(
    cErrs({}, { compute: { question: 'q', expr: '(marginalRate - 30) * balance / 100' } }), []
  );
});

check('an expression outside the permitted grammar is refused', () => {
  // Allowlist rather than denylist: the evaluator never sees anything it has
  // not already parsed into numbers, declared names and five operators.
  for (const bad of ['marginalRate; drop()', 'fetch("x")', 'balance ** 2', '1 + [0]']) {
    assert.ok(cErrs({}, { compute: { question: 'q', expr: bad } }).length,
      'must refuse: ' + bad);
  }
});

check('a computed entry on a site with no profile is refused', () => {
  const errs = validate({ ...computeCfg({}), profile: undefined }, [computeEntry({})]).errs;
  assert.ok(errs.some(e => /profile/.test(e)), 'got: ' + errs.join('; '));
});

/* The gate asks for the profile fields this entry needs, at the moment it
 * needs them, rather than sending you to a settings page first. */
/* getElementById in the harness materialises whatever you ask for, so presence
 * has to be asserted against the rendered markup rather than against the
 * lookup, which never returns null. */
function fillProfile(env, vals) {
  const html = env.els['view-today'].innerHTML;
  for (const k in vals) {
    assert.ok(html.includes('id="prof-' + k + '"'), 'the gate should be asking for ' + k);
    env.document.getElementById('prof-' + k).value = String(vals[k]);
  }
  env.fire('click', target({ act: 'profile-save', id: todayId(env) }));
}

check('the arithmetic gate withholds the answer until a number is committed', () => {
  const env = boot(COMPUTE, T0);
  const id = todayId(env);
  assert.ok(!env.api.gateOpen(id), 'the gate starts closed');
  assert.ok(!/17/.test(env.els['view-today'].innerHTML),
    'the computed answer must not be in the DOM before it is earned');
});

check('committing a number reveals the answer and stores the signed gap', () => {
  const env = boot(COMPUTE, T0);
  const id = todayId(env);
  fillProfile(env, { marginalRate: 47 });
  env.document.getElementById('compute-field').value = '12';
  env.fire('click', target({ act: 'compute-commit', id: id }));

  const rec = env.state().log[id].compute;
  assert.ok(rec, 'a compute record must be written');
  assert.strictEqual(rec.computed, 17, '47 - 30 should compute to 17');
  assert.strictEqual(rec.yours, 12);
  assert.strictEqual(rec.gap, -5, 'the gap is signed: yours minus computed');
  assert.ok(env.api.gateOpen(id), 'committing opens the entry');
});

check('a committed number cannot be revised once the answer is visible', () => {
  const env = boot(COMPUTE, T0);
  const id = todayId(env);
  fillProfile(env, { marginalRate: 47 });
  env.document.getElementById('compute-field').value = '12';
  env.fire('click', target({ act: 'compute-commit', id: id }));
  env.document.getElementById('compute-field').value = '17';
  env.fire('click', target({ act: 'compute-commit', id: id }));
  assert.strictEqual(env.state().log[id].compute.yours, 12, 'the first number stands');
});

check('the gate will not open until the profile it depends on is filled', () => {
  // Committing against an empty profile would score you against NaN and read
  // as though you had done the work.
  const env = boot(COMPUTE, T0);
  const id = todayId(env);
  assert.ok(!env.els['view-today'].innerHTML.includes('id="compute-field"'),
    'the number field should not be rendered while the profile is empty');
  env.fire('click', target({ act: 'compute-commit', id: id }));
  assert.ok(!env.api.gateOpen(id), 'no profile means no commit');
  assert.ok(!(env.state().log[id] || {}).compute, 'and no record');
});

check('an entry that switched to the arithmetic gate keeps its setup', () => {
  // computeHTML replaces gateHTML, so gateIntro has to be rendered by both or
  // it becomes content that exists in the corpus and never appears on screen.
  const env = boot(COMPUTE_INTRO, T0);
  assert.ok(env.els['view-today'].innerHTML.includes('A situation, stated before the sum.'),
    'gateIntro must survive the switch to the arithmetic gate');
});

check('the profile survives a reload', () => {
  const a = boot(COMPUTE, T0);
  fillProfile(a, { marginalRate: 47 });
  const b = boot(COMPUTE, T0 + DAY, { ...a.store });
  assert.strictEqual(b.state().profile.marginalRate, 47);
});

check('the median absolute gap is reported across committed entries', () => {
  // The headline number for this site: not whether you were right, but how far
  // off you are and in which direction.
  const env = boot(COMPUTE, T0);
  fillProfile(env, { marginalRate: 47 });
  env.document.getElementById('compute-field').value = '12';
  env.fire('click', target({ act: 'compute-commit', id: todayId(env) }));
  assert.strictEqual(env.api.gapStats().n, 1);
  assert.strictEqual(env.api.gapStats().medianAbs, 5);
  assert.strictEqual(env.api.gapStats().signedMean, -5);

  env.fire('click', target({ act: 'go', view: 'progress' }));
  const html = env.els['view-progress'].innerHTML;
  assert.ok(/Median gap/.test(html), 'the gap has to reach the progress view, not just the api');
  assert.ok(/you read low/.test(html), 'and it has to say which direction');
});

/* --- The reader ----------------------------------------------------------
   What the reader must never do is speak something the page is withholding, so
   the checks below are mostly about silence: what it refuses to read, and what
   is not in the page for it to read in the first place. */

/* A stand-in for a rendered entry. querySelectorAll returning the marked nodes
   in the order they were written is the only thing speakableParts asks of a
   real one. */
function markedEntry(marks) {
  return {
    querySelectorAll: () => marks.map(m => ({
      getAttribute: k => (k === 'data-speak' ? m[0] : null),
      innerText: m[1]
    }))
  };
}

check('the reader speaks the named parts, in the order they are written', () => {
  const env = boot(PLAIN, T0);
  const parts = env.api.speakableParts(markedEntry([
    ['title', 'The title'],
    ['source', 'After somebody'],
    ['idea', 'The idea'],
    ['why', 'The mechanism']
  ]));
  assert.deepStrictEqual(parts.map(p => p.text), ['The title', 'The idea', 'The mechanism'],
    'the citation is marked but unread, and document order decides the rest');
});

check('a part nobody named is silent, however it is marked', () => {
  // Fail-closed, which is the point. A block added to the entry later stays out
  // of the audio until somebody decides it belongs, rather than being read
  // aloud the day it ships.
  const env = boot(PLAIN, T0);
  const parts = env.api.speakableParts(markedEntry([
    ['answer', 'The recall answer'],
    ['idea', 'The idea']
  ]));
  assert.deepStrictEqual(parts.map(p => p.text), ['The idea']);
});

check('a gated entry offers no reader, because there is nothing yet to read', () => {
  const env = boot(FULL, T0);
  const shut = env.els['view-today'].innerHTML;
  assert.ok(!shut.includes('data-act="speak"'), 'no reader over a gate');
  assert.ok(!/data-speak="idea"/.test(shut), 'and the body it would read is not in the page at all');

  env.document.getElementById('gate-field').value = 'a real call, written first';
  env.fire('click', target({ act: 'gate-unlock', id: todayId(env) }));

  const open = env.els['view-today'].innerHTML;
  assert.ok(open.includes('data-act="speak"'), 'past the gate it is offered');
  assert.ok(/data-speak="idea"/.test(open), 'and now there is a body to read');
});

check('a browser with no synthesiser is offered nothing', () => {
  const env = boot(PLAIN, T0, null, e => {
    delete e.window.speechSynthesis;
    delete e.window.SpeechSynthesisUtterance;
  });
  assert.strictEqual(env.window.SPEECH.available, false);
  assert.ok(!env.els['view-today'].innerHTML.includes('data-act="speak"'),
    'no control where pressing it could do nothing');
});

check('speaking drains every part and ends idle', () => {
  const env = boot(PLAIN, T0);
  env.window.SPEECH.speak([{ text: 'First part. Second sentence.' }, { text: 'Another part.' }], {});
  assert.deepStrictEqual(env.spoken, ['First part.', 'Second sentence.', 'Another part.']);
  assert.strictEqual(env.window.SPEECH.state(), 'idle', 'a finished read must not stay stuck playing');
});

check('prose is split into utterances short enough to finish', () => {
  // Chrome gives up on one utterance after about fifteen seconds and says
  // nothing, so the read has to arrive already in small pieces.
  const env = boot(PLAIN, T0);
  const long = 'Alpha beta gamma. ' + 'delta epsilon zeta eta theta, '.repeat(20) + 'and it ends.';
  const chunks = env.window.SPEECH.split(long);
  assert.ok(chunks.length > 2, 'it has to actually split');
  assert.strictEqual(chunks[0], 'Alpha beta gamma.', 'and split on sentences first');
  chunks.forEach(c => assert.ok(c.length <= 200, 'chunk left over the limit at ' + c.length));
});

/* The voice list is the single biggest thing between this and sounding like a
   person, and the API says nothing about quality, so these pin the name rules
   that stand in for it. */
function withVoices(list) {
  return boot(PLAIN, T0, null, e => { e.window.speechSynthesis.getVoices = () => list; });
}
const v = (name, lang, localService, def) => ({ name, lang, localService, default: !!def });

check('a downloaded neural voice beats the old default', () => {
  const env = withVoices([
    v('Samantha', 'en-US', true, true),
    v('Zarvox', 'en-US', true),
    v('Ava (Premium)', 'en-US', true)
  ]);
  assert.strictEqual(env.window.SPEECH.voice().name, 'Ava (Premium)');
});

check('a network voice beats the local 1990s set', () => {
  const env = withVoices([
    v('Samantha', 'en-US', true, true),
    v('Google UK English Female', 'en-GB', false)
  ]);
  assert.strictEqual(env.window.SPEECH.voice().name, 'Google UK English Female',
    'offline-first must not mean settling for the worst voice on the machine');
});

check('but a local neural voice beats a network one', () => {
  const env = withVoices([
    v('Google UK English Female', 'en-GB', false),
    v('Daniel (Enhanced)', 'en-GB', true)
  ]);
  assert.strictEqual(env.window.SPEECH.voice().name, 'Daniel (Enhanced)');
});

check('with nothing marked, the browser default is taken rather than guessed at', () => {
  const env = withVoices([
    v('Bubbles', 'en-US', true),
    v('Zarvox', 'en-US', true),
    v('Samantha', 'en-US', true, true)
  ]);
  assert.strictEqual(env.window.SPEECH.voice().name, 'Samantha',
    'list order must never decide this, or the reader speaks in a novelty voice');
});

check('offline, a network voice is dropped rather than chosen and failed on', () => {
  const env = boot(PLAIN, T0, null, e => {
    e.window.navigator.onLine = false;
    e.window.speechSynthesis.getVoices = () => [
      v('Google US English', 'en-US', false),
      v('Samantha', 'en-US', true, true)
    ];
  });
  env.window.SPEECH.speak([{ text: 'Something.' }], {});
  assert.strictEqual(env.window.SPEECH.voice().name, 'Samantha',
    'the offline-forever property has to survive the quality ranking');
});

check('online, the same pair picks the better voice', () => {
  // The pair above with one thing changed, so the guard is doing the work
  // rather than the ranking having quietly reverted.
  const env = withVoices([v('Google US English', 'en-US', false), v('Samantha', 'en-US', true, true)]);
  env.window.SPEECH.speak([{ text: 'Something.' }], {});
  assert.strictEqual(env.window.SPEECH.voice().name, 'Google US English');
});

check('connectivity is re-read at the moment of use, not at boot', () => {
  const env = withVoices([v('Google US English', 'en-US', false), v('Samantha', 'en-US', true, true)]);
  assert.strictEqual(env.window.SPEECH.voice().name, 'Google US English', 'online at boot');
  env.window.navigator.onLine = false;
  env.window.SPEECH.speak([{ text: 'Something.' }], {});
  assert.strictEqual(env.window.SPEECH.voice().name, 'Samantha',
    'a laptop that loses wifi between entries must not fail on the next click');
});

check('offline with nothing local leaves the choice to the browser', () => {
  const env = boot(PLAIN, T0, null, e => {
    e.window.navigator.onLine = false;
    e.window.speechSynthesis.getVoices = () => [v('Google US English', 'en-US', false)];
  });
  assert.strictEqual(env.window.SPEECH.voice(), null);
});

check('a network voice that will not answer says which kind of failure it was', () => {
  // navigator.onLine cannot see a captive portal, so this path is the only
  // thing standing between the reader and a button that silently does nothing.
  const env = boot(PLAIN, T0, null, e => {
    e.window.speechSynthesis.getVoices = () => [v('Google US English', 'en-US', false)];
    e.window.speechSynthesis.speak = u => { u.onerror({ error: 'network' }); };
  });
  let why = null;
  env.window.SPEECH.speak([{ text: 'Something.' }], { onFail: r => { why = r; } });
  assert.strictEqual(why, 'network');
  assert.strictEqual(env.window.SPEECH.state(), 'idle', 'and it must not stay stuck playing');
});

check('a local voice that will not speak is reported as itself', () => {
  const env = boot(PLAIN, T0, null, e => {
    e.window.speechSynthesis.getVoices = () => [v('Samantha', 'en-US', true, true)];
    e.window.speechSynthesis.speak = u => { u.onerror({ error: 'synthesis-failed' }); };
  });
  let why = null;
  env.window.SPEECH.speak([{ text: 'Something.' }], { onFail: r => { why = r; } });
  assert.strictEqual(why, 'voice');
});

check('a cancelled read is not reported as a failure', () => {
  // stop() cancels, and browsers deliver that as an error on the utterance in
  // flight. Reporting it would fire a toast every time somebody pressed Stop.
  const env = boot(PLAIN, T0, null, e => {
    e.window.speechSynthesis.speak = u => { e.window.__live = u; };
  });
  let why = null;
  env.window.SPEECH.speak([{ text: 'Something.' }], { onFail: r => { why = r; } });
  env.window.SPEECH.stop();
  env.window.__live.onerror({ error: 'canceled' });
  assert.strictEqual(why, null);
});

check('a pool of nothing but toys yields no preference at all', () => {
  // Declining to choose hands it to the browser. Choosing anything here picks a
  // toy, which is worse than any default could be.
  const env = withVoices([v('Bubbles', 'en-US', true), v('Zarvox', 'en-US', true)]);
  assert.strictEqual(env.window.SPEECH.voice(), null);
});

check('a sentence with nowhere to break is spoken whole rather than cut badly', () => {
  // One long utterance beats a pause dropped into the middle of a clause. The
  // limit exists to dodge a browser bug; a stumble every time is the worse
  // trade of the two.
  const env = boot(PLAIN, T0);
  const unbroken = 'word '.repeat(80).trim() + '.';
  assert.ok(unbroken.length > 200, 'the fixture has to be over the limit to test anything');
  assert.deepStrictEqual(env.window.SPEECH.split(unbroken), [unbroken]);
});

report('engine');

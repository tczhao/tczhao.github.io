#!/usr/bin/env node
/*
 * Contracts this site has to meet: the corpus validates, every single entry
 * renders without a template hole, the built file is genuinely self-contained,
 * and the mechanics the config declares are the mechanics the content uses.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { boot, target, check, report, templateHole, ROOT } = require('./harness');
const { validate, validateConfig, loadSite, loadEntries } = require('../lib/build');

const T0 = new Date(2026, 7, 5, 9, 0, 0).getTime();
const ARTIFACT_CEILING = 16 * 1024 * 1024;

const { config } = loadSite();

console.log('\n' + (config ? config.name : '(no config)') + '\n');

check('every asset the dev page links actually resolves', () => {
  // dev.html links the shared engine in place rather than inlining it, so its
  // paths are relative to this site. Nothing else checks them, and a broken one
  // fails as a blank page rather than as an error.
  const dev = path.join(ROOT, 'dev.html');
  assert.ok(fs.existsSync(dev), 'dev.html has not been built');
  const html = fs.readFileSync(dev, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map(m => m[1])
    .filter(r => !/^(#|https?:|mailto:|data:|\/\/)/.test(r));   // in-page and remote refs are not files
  assert.ok(refs.length > 3, 'expected the dev page to link its parts');
  for (const r of refs) {
    assert.ok(fs.existsSync(path.join(ROOT, r)), 'dev.html links a missing file: ' + r);
  }
});

check('the site config is valid', () => {
  const errs = loadSite().errs.concat(config ? validateConfig(config) : ['no config']);
  assert.deepStrictEqual(errs, [], errs.join('; '));
});

/* Reads a sibling's declared key without running its content. site.js is a
   single assignment to window.SITE, so evaluating it in a bare object is
   enough and is what lib/build.js already does to load a config. Returns null
   for a directory that is not an engine site. */
function siblingKey(dir) {
  const p = path.join(ROOT, '..', dir, 'site.js');
  if (!fs.existsSync(p)) return null;
  const win = {};
  try {
    new Function('window', fs.readFileSync(p, 'utf8'))(win);
  } catch (e) {
    return null;
  }
  return win.SITE ? win.SITE.key : null;
}

function siblingSites() {
  return fs.readdirSync(path.join(ROOT, '..'))
    .filter(d => d !== path.basename(ROOT) && !d.startsWith('_') && !d.startsWith('.'))
    .map(d => ({ dir: d, key: siblingKey(d) }))
    .filter(s => s.key);
}

check('the storage key is this site\'s own', () => {
  // Every site in this family ships as a separate page against the same
  // origin, so a shared key would have one silently eat another's history.
  assert.ok(/^[a-z]+\.v\d+$/.test(config.key), 'key should look like <slug>.v<n>, got ' + config.key);
  assert.notStrictEqual(config.key, 'daily.v1', 'the engine default is not a site key');

  // TODO(you): assert no sibling site declares this same key.
  //
  // siblingSites() returns [{ dir, key }] for every other engine site under
  // sub/, already excluding this one, _shared, and dotfiles. There are 11
  // sites sharing one origin and until now only practicum was protected, by
  // name; two siblings colliding with each other was never checked at all.
  //
  // Worth deciding as you write it:
  //   - what the failure message needs to name for someone to act on it
  //   - whether a sibling that fails to parse should be silently skipped
  //     (siblingKey returns null today) or should fail this check loudly
});

check('the corpus validates', () => {
  const { entries, errs: loadErrs } = loadEntries();
  const { errs } = validate(config, entries);
  const all = loadErrs.concat(errs);
  assert.deepStrictEqual(all.slice(0, 8), [], all.length + ' problems, first few shown');
});

check('every entry renders without a template hole', () => {
  const env = boot(ROOT, T0);
  assert.ok(env.window.LESSONS.length > 0, 'no entries loaded');
  for (const l of env.window.LESSONS) {
    const e = boot(ROOT, T0, { ...env.store });
    e.fire('click', target({ act: 'go', view: 'library' }));
    e.fire('click', target({ act: 'lib-open', id: l.id }));
    const html = e.els['view-library'].innerHTML;
    assert.ok(html.length > 400, l.id + ' rendered almost nothing');
    const hole = templateHole(html);
    assert.ok(!hole, l.id + ' has a template hole near: ' + hole);
  }
});

check('every live entry is reachable in the sequence exactly once', () => {
  const env = boot(ROOT, T0);
  const seq = env.api.seq();
  const live = env.window.LESSONS.filter(l => !env.api.lapsed(l));
  assert.strictEqual(seq.length, live.length, 'sequence length must match the live corpus');
  assert.strictEqual(new Set(seq).size, seq.length, 'an entry appears twice in the sequence');
});

check('the first cycle serves one entry from every track', () => {
  const env = boot(ROOT, T0);
  const byId = {};
  env.window.LESSONS.forEach(l => { byId[l.id] = l; });
  const first = env.api.seq().slice(0, config.tracks.length).map(id => byId[id].track);
  assert.strictEqual(new Set(first).size, config.tracks.length,
    'expected ' + config.tracks.length + ' distinct tracks, got ' + new Set(first).size);
});

check('declared mechanics match what the content uses', () => {
  const { entries } = loadEntries();
  const hasExpiry = entries.some(l => l.expires !== undefined);
  const hasForecast = entries.some(l => l.forecast !== undefined);
  const hasGateIntro = entries.some(l => l.gateIntro !== undefined);
  if (config.expiry) assert.ok(hasExpiry, 'expiry is on but no entry carries an expires date');
  if (config.forecastBook) assert.ok(hasForecast, 'forecast book is on but no entry seeds a forecast');
  if (config.gate && (config.extraRequired || []).includes('gateIntro')) {
    assert.ok(hasGateIntro, 'gate requires an intro but no entry has one');
  }
  if (!config.expiry) assert.ok(!hasExpiry, 'entries carry expires but the site has no expiry');
  if (!config.forecastBook) assert.ok(!hasForecast, 'entries seed forecasts but there is no forecast book');
});

if (config.gate && (config.extraRequired || []).includes('gateIntro')) {
  check('no gateIntro hands over its own answer verbatim', () => {
    /* Whether an intro leaks its mechanism semantically is a judgement, and
     * this cannot make it - that was done by reading a sample. What it can
     * catch is the mechanical version: a clause copied out of the answer and
     * into the question, which is how a leak actually gets written.
     *
     * Seven words is where the signal starts. At five and six the only hits
     * are domain scenery - "across a multi tenant cluster", "a mean time to
     * recovery and" - which carry no answer. Below seven this measures
     * vocabulary; at seven and above it measures leaks. */
    const N = 7;
    const { entries } = loadEntries();
    const grams = (t, n) => {
      const w = String(t).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      return new Set(w.slice(0, Math.max(0, w.length - n + 1)).map((_, i) => w.slice(i, i + n).join(' ')));
    };
    for (const l of entries) {
      assert.ok(l.gateIntro.length >= 150,
        l.id + ': gateIntro is too short to be a real situation (' + l.gateIntro.length + ' chars)');
      const intro = grams(l.gateIntro, N);
      for (const field of ['idea', 'why']) {
        const shared = [...grams(l[field], N)].filter(g => intro.has(g));
        assert.strictEqual(shared.length, 0,
          l.id + ': gateIntro shares a phrase with ' + field + ': "' + shared[0] + '"');
      }
    }
  });
}

if (config.cheatsheet) {
  const VERDICTS = config.cheatsheet.verdicts || null;
  const qualifies = l => (VERDICTS ? VERDICTS.includes(l.replication) : !!l.cheat);
  const rule = VERDICTS ? 'the ' + VERDICTS.join('/') + ' slice' : 'the entries that carry a line';

  check('the cheatsheet is exactly ' + rule, () => {
    /* The filter is the entire editorial claim of this view. A single contested
     * or single-study finding leaking onto a page designed to be read at speed
     * and acted on is the one failure that matters here, so it is asserted in
     * both directions rather than by counting rows. */
    const env = boot(ROOT, T0);
    env.fire('click', target({ act: 'go', view: 'cheatsheet' }));
    const html = env.els['view-cheatsheet'].innerHTML;

    const hole = templateHole(html);
    assert.ok(!hole, 'the cheatsheet has a template hole near: ' + hole);

    const solid = env.window.LESSONS.filter(qualifies);
    assert.ok(solid.length > 0, 'the cheatsheet is on but nothing in the corpus qualifies');

    for (const l of solid) {
      assert.ok(html.includes('data-id="' + l.id + '"'), 'qualifies but missing from the cheatsheet: ' + l.id);
    }
    for (const l of env.window.LESSONS.filter(l => !qualifies(l))) {
      assert.ok(!html.includes('data-id="' + l.id + '"'),
        l.id + ' does not qualify and must not reach the cheatsheet');
    }

    const rows = (html.match(/class="cheat__row"/g) || []).length;
    assert.strictEqual(rows, solid.length, 'one row per qualifying entry, no more');
  });

  check('every cheat line is one plain line of the right shape', () => {
    /* The build enforces this too. It is repeated here because these lines are
     * the only prose in the corpus written to be acted on without reading the
     * entry behind it, and a line that runs long or carries markup is a line
     * that was written as a paragraph. */
    for (const l of loadEntries().entries.filter(l => l.cheat !== undefined)) {
      assert.ok(!/\n/.test(l.cheat), l.id + ': cheat spans more than one line');
      assert.ok(!/—/.test(l.cheat), l.id + ': cheat has an em dash');
      assert.ok(!/\*\*|^#/.test(l.cheat), l.id + ': cheat carries markdown');
      assert.ok(l.cheat.length >= 40 && l.cheat.length <= 190,
        l.id + ': cheat is ' + l.cheat.length + ' chars, outside 40-190');
    }
  });

  check('the cheatsheet states how much of the corpus it leaves out', () => {
    /* A cheatsheet that shows fourteen findings without saying sixteen were
     * withheld reads as the whole corpus, which would invert the point of a
     * site built to make you feel how thin the evidence is. */
    const env = boot(ROOT, T0);
    env.fire('click', target({ act: 'go', view: 'cheatsheet' }));
    const html = env.els['view-cheatsheet'].innerHTML;
    const withheld = env.window.LESSONS.filter(l => !qualifies(l) && !env.api.lapsed(l)).length;
    assert.ok(html.includes(' ' + withheld + ' '),
      'the number of entries left off the cheatsheet is not stated on it');
  });
}

check('the built file is self-contained and under the artifact ceiling', () => {
  const dist = path.join(ROOT, 'dist', 'index.html');
  assert.ok(fs.existsSync(dist), 'not built yet - run npm run build');
  const html = fs.readFileSync(dist, 'utf8');
  assert.ok(!/<script\s+src=/i.test(html), 'a script src survived inlining');
  assert.ok(!/<link\s+rel="stylesheet"/i.test(html), 'a stylesheet link survived inlining');

  /* What the CSP actually blocks is a fetch, so the check is for a URL in a
   * position that causes one. A URL sitting in escaped prose - an entry about
   * OAuth redirect URIs is entitled to show one - is inert text. */
  const fetching = [
    /\b(?:src|href|poster|data|action|formaction)\s*=\s*["']?https?:/i,
    /url\(\s*["']?https?:/i,
    /@import\s+(?:url\()?["']?https?:/i,
    /<(?:img|iframe|video|audio|embed|object|source|track)\b/i
  ];
  for (const re of fetching) {
    assert.ok(!re.test(html), 'the page would fetch something external: ' + re);
  }
  assert.ok(Buffer.byteLength(html) < ARTIFACT_CEILING, 'over the 16MB artifact ceiling');
  assert.ok(html.includes(config.name), 'the site name is missing from the built page');
});

report(config ? config.name : 'site');

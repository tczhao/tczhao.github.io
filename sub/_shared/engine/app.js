/* ==========================================================================
   Daily — shared engine

   One engine, many sites. Everything that differs between sites lives in
   window.SITE: the storage key, the tracks, the second facet, every string
   of visible copy, the review model, the commitment gate and whether the
   forecast book exists at all.

   State lives in localStorage under one versioned key. Nothing here talks to
   the network, so a built page works offline and forever.
   ========================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var LESSONS = window.LESSONS || [];
  var EXPR = window.EXPR;                    // engine/expr.js, loaded before this

  var KEY = SITE.key;
  var TRACKS = SITE.tracks || [];
  var LEVELS = SITE.levels || {};
  var COPY = SITE.copy || {};
  var GATE = SITE.gate || null;
  var PROMPT = SITE.prompt || {};

  var HAS_REVIEW = SITE.review !== 'none';
  var HAS_EXPIRY = SITE.expiry === true;
  var HAS_FORECAST = SITE.forecastBook === true;
  var HAS_EVIDENCE = SITE.evidenceGate === true;
  /* Two ways to earn a cheatsheet row, because the sites disagree about what
     "worth acting on from memory" can even mean.

     Where the corpus carries a replication verdict, the filter is derived:
     `cheatsheet: { verdicts: ['replicated'] }` and the corpus decides. Nobody
     is exercising judgement, which is the point - Nomogram refuses to let the
     author grade their own evidence, and the cheatsheet must not be the hole
     in that.

     Where it does not, there is nothing to derive from, so the row is opt-in:
     `cheatsheet: true`, and an entry appears if the author wrote it a line.
     That is editorial and the page says so rather than dressing a selection up
     as a filter. */
  var CHEAT = SITE.cheatsheet || null;
  var CHEAT_VERDICTS = CHEAT && CHEAT.verdicts ? CHEAT.verdicts : null;
  var HAS_CHEAT = !!CHEAT && (!CHEAT_VERDICTS || HAS_EVIDENCE);

  function onCheatsheet(l) {
    return CHEAT_VERDICTS ? CHEAT_VERDICTS.indexOf(l.replication) !== -1 : !!l.cheat;
  }

  /* Expiry retires a claim the author already knew would rot. This retires the
     author's confidence in a claim they thought was settled, which is where
     checking actually finds the failures. Nothing leaves the sequence: a stale
     citation is still true more often than not, it is just no longer checked. */
  var REVERIFY_DAYS = SITE.reverifyDays || 0;

  function stale(l) {
    if (!REVERIFY_DAYS || !l.verifiedOn) return false;
    return shift(l.verifiedOn, REVERIFY_DAYS) < today();
  }

  function evidenceHTML(l) {
    var h = '<div class="evidence" data-rep="' + esc(l.replication) + '"' +
      (stale(l) ? ' data-stale="1"' : '') + '>';
    h += '<p class="block__label">' + esc(COPY.labelEvidence || 'The evidence') + '</p>';
    h += '<p class="evidence__cite">' + esc(l.evidence) + '</p>';
    if (l.interval && typeof l.interval.lo === 'number' && typeof l.interval.hi === 'number') {
      h += '<p class="evidence__interval">' + esc(l.interval.measure || 'interval') + ' ' +
        l.interval.lo + ' to ' + l.interval.hi + '</p>';
    }
    h += '<p class="evidence__meta">';
    h += '<span class="rep-chip">' + esc(REP_LABEL[l.replication] || l.replication) + '</span>';
    if (l.replication === 'statute' && l.asAt) {
      h += '<span class="evidence__asat">as at ' + esc(shortDate(l.asAt)) + '</span>';
    }
    if (stale(l)) {
      h += '<span class="evidence__stale">' +
        esc(COPY.staleNote || 'not re-checked since ' + shortDate(l.verifiedOn)) + '</span>';
    }
    h += '</p></div>';
    return h;
  }

  var REP_LABEL = {
    replicated:  'Replicated',
    single:      'One study, never repeated',
    contested:   'Contested',
    failed:      'Failed to replicate',
    overclaimed: 'Real, but overclaimed',
    craft:       'Craft, no trial behind it',
    statute:     'Statute'
  };

  /* ------------------------------------------------------------------------
     THE POLICY DIAL

     This one function decides the whole rhythm of retention: how long an
     entry rests before it comes back, and how badly a miss sets you back.
     Leitner boxes, intervals from the site config.

     Three alternatives, if the default does not fit how you learn:

       Forgiving   — a miss drops you one box instead of all the way to 1.
                     Kinder, but genuinely-forgotten material resurfaces
                     slowly, which is the failure mode you care about.
       Aggressive  — intervals 1/2/4/8/16. Roughly twice the review load for
                     noticeably better recall. Costs you minutes a day.
       Long tail   — add a sixth box at 90 days so solid material still gets
                     checked twice a year rather than disappearing.

     Change the arithmetic here and the whole schedule follows; nothing else
     in the engine hardcodes an interval.
     --------------------------------------------------------------------- */
  var INTERVALS = SITE.intervals || [1, 3, 7, 16, 35];
  var MAX_BOX = INTERVALS.length;

  function reviewInterval(box, grade) {
    var next;
    if (grade === 'miss') next = 1;
    else if (grade === 'close') next = box;
    else next = Math.min(box + 1, MAX_BOX);
    return { box: next, days: INTERVALS[next - 1] };
  }

  /* --- Dates: local, not UTC. A logbook runs on the reader's clock. ------- */
  function dayKey(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function today() { return dayKey(new Date()); }
  function parseKey(k) {
    var p = String(k).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0);
  }
  function shift(k, days) {
    var d = parseKey(k);
    d.setDate(d.getDate() + days);
    return dayKey(d);
  }
  function daysBetween(a, b) {
    return Math.round((parseKey(b) - parseKey(a)) / 86400000);
  }
  function longDate(k) {
    return parseKey(k).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  function shortDate(k) {
    return parseKey(k).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* --- Expiry -------------------------------------------------------------
     Fast-moving material carries a date past which it is more likely to be
     folklore than fact. A lapsed entry leaves the sequence and the review
     deck rather than being quietly reinforced forever. It stays visible in
     the library, marked, because knowing what went stale is itself useful. */
  function lapsed(l) {
    return HAS_EXPIRY && !!l.expires && daysBetween(l.expires, today()) > 0;
  }
  function live() {
    return LESSONS.filter(function (l) { return !lapsed(l); });
  }

  /* --- Sequence -----------------------------------------------------------
     Round-robin across tracks, rotating the track order each cycle. Because
     each track file is ordered foundational first, the opening cycle serves
     the most foundational entry from every track before anything advanced. */
  function buildSequence() {
    var pool = live();
    var byTrack = TRACKS.map(function (t) {
      return pool.filter(function (l) { return l.track === t.id; });
    });
    var out = [];
    var cycle = 0;
    var guard = pool.length + TRACKS.length + 1;
    while (out.length < pool.length && cycle < guard) {
      for (var i = 0; i < TRACKS.length; i++) {
        var bucket = byTrack[(i + cycle) % TRACKS.length];
        var lesson = bucket[cycle];
        if (lesson) out.push(lesson.id);
      }
      cycle++;
    }
    // Anything a ragged track length left behind.
    pool.forEach(function (l) { if (out.indexOf(l.id) === -1) out.push(l.id); });
    return out;
  }

  var SEQ = buildSequence();
  var BY_ID = {};
  LESSONS.forEach(function (l) { BY_ID[l.id] = l; });

  /* --- State ------------------------------------------------------------- */
  var blank = {
    v: 1,
    startedOn: today(),
    log: {},
    days: {},
    streak: { count: 0, best: 0, lastOn: null },
    forecasts: {},
    profile: {},
    theme: null
  };

  /* Everything here depends on being able to write locally. If a browser or
     an embedding blocks storage, say so plainly rather than losing a month of
     someone's notes without telling them. */
  function storageWorks() {
    try {
      localStorage.setItem(KEY + '.probe', '1');
      localStorage.removeItem(KEY + '.probe');
      return true;
    } catch (e) {
      return false;
    }
  }

  var STORAGE_OK = storageWorks();
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(blank);
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1) return clone(blank);
      // Merge onto the blank so a partial or older record still boots.
      var s = clone(blank);
      Object.keys(parsed).forEach(function (k) { s[k] = parsed[k]; });
      s.log = parsed.log || {};
      s.days = parsed.days || {};
      s.streak = parsed.streak || clone(blank.streak);
      s.forecasts = parsed.forecasts || {};
      return s;
    } catch (e) {
      return clone(blank);
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Could not save — browser storage is full or blocked'); }
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function record(id) {
    if (!state.log[id]) {
      state.log[id] = { box: 0, due: null, note: '', reviews: [], completedOn: null, gate: null, attempts: [] };
    }
    var r = state.log[id];
    if (!r.reviews) r.reviews = [];
    if (!r.attempts) r.attempts = [];
    return r;
  }

  /* --- The daily pick ----------------------------------------------------
     Written once per date, then read back. Stable across reloads, honest as
     a history, and a missed day pushes the corpus forward instead of
     silently dropping an entry. You cannot refresh to skip ahead, which is
     the property that makes a commitment mean anything. */
  function lessonForToday() {
    var t = today();
    if (state.days[t] && BY_ID[state.days[t]]) return BY_ID[state.days[t]];
    if (!SEQ.length) return null;

    var served = {};
    Object.keys(state.days).forEach(function (d) { served[state.days[d]] = true; });

    var pick = null;
    for (var i = 0; i < SEQ.length; i++) {
      if (!served[SEQ[i]]) { pick = SEQ[i]; break; }
    }
    // Corpus exhausted: begin a second pass from the top of the sequence.
    if (!pick) pick = SEQ[Object.keys(state.days).length % SEQ.length];

    state.days[t] = pick;
    save();
    return BY_ID[pick];
  }

  function entryNumber(id) {
    var n = SEQ.indexOf(id);
    return n === -1 ? '—' : String(n + 1).padStart(3, '0');
  }

  function dueList() {
    if (!HAS_REVIEW) return [];
    var t = today();
    return Object.keys(state.log)
      .filter(function (id) {
        var r = state.log[id];
        return BY_ID[id] && !lapsed(BY_ID[id]) && r.due && r.box > 0 && daysBetween(r.due, t) >= 0;
      })
      .sort(function (a, b) {
        var d = state.log[a].box - state.log[b].box;   // shakiest first
        return d !== 0 ? d : (state.log[a].due < state.log[b].due ? -1 : 1);
      });
  }

  function completedToday() {
    var t = today();
    var l = state.days[t];
    return !!(l && state.log[l] && state.log[l].completedOn === t);
  }

  function markComplete(id) {
    var t = today();
    var r = record(id);
    if (r.completedOn === t) return;
    r.completedOn = t;
    if (HAS_REVIEW && r.box === 0) { r.box = 1; r.due = shift(t, INTERVALS[0]); }

    var s = state.streak;
    if (s.lastOn === t) { /* already counted */ }
    else if (s.lastOn && daysBetween(s.lastOn, t) === 1) s.count += 1;
    else s.count = 1;
    s.lastOn = t;
    s.best = Math.max(s.best || 0, s.count);

    save();
  }

  function gradeCard(id, grade) {
    var r = record(id);
    var next = reviewInterval(r.box || 1, grade);
    r.box = next.box;
    r.due = shift(today(), next.days);
    r.reviews.push({ on: today(), grade: grade });
    save();
  }

  /* --- The gate -----------------------------------------------------------
     A commitment device. Where a site sets one, the body of the entry stays
     withheld until something has been written, and what was written is
     frozen the moment the answer appears. An editable answer is not a
     commitment, it is a draft, and the whole value is in being able to read
     back what you actually thought before you knew. */
  /* ------------------------------------------------------------------------
     THE ARITHMETIC GATE

     A text gate proves you thought about the question. This proves you did the
     sum. The site holds a small profile of your own figures, each entry
     declares its answer as an expression over them, and the entry stays shut
     until you have written your own number to be compared against.

     What it keeps is the signed gap rather than a right/wrong mark, because
     the useful quantity is which direction you are consistently wrong in. A
     reader who is reliably optimistic about their own tax position learns more
     from that than from a score. */

  var PROFILE = SITE.profile || null;
  var PROFILE_FIELDS = (PROFILE && PROFILE.fields) || [];

  function byId(id) {
    for (var i = 0; i < LESSONS.length; i++) {
      if (LESSONS[i].id === id) return LESSONS[i];
    }
    return null;
  }

  function profileField(id) {
    for (var i = 0; i < PROFILE_FIELDS.length; i++) {
      if (PROFILE_FIELDS[i].id === id) return PROFILE_FIELDS[i];
    }
    return null;
  }

  /* Which declared fields this entry's sum actually needs. Asking for the whole
     profile up front is how a settings page gets abandoned; asking for the two
     numbers today's entry needs is a question someone will answer. */
  /* No try/catch. build.js compiles every expression and checks every
     identifier against the declared profile, so a throw here means the page was
     assembled wrong - and a gate that silently asks for nothing would render as
     an entry that opens itself, which is the one outcome worth crashing over. */
  function computeNeeds(l) {
    if (!l || !l.compute || !l.compute.expr) return [];
    return EXPR.names(l.compute.expr).filter(function (n) { return !!profileField(n); });
  }

  function computeMissing(l) {
    return computeNeeds(l).filter(function (n) {
      return typeof state.profile[n] !== 'number';
    });
  }

  /* null rather than NaN when a field is missing or a divisor is zero. NaN
     would render as "NaN" and read as an answer. */
  function computeAnswer(l) {
    return EXPR.run(l.compute.expr, state.profile);
  }

  function saveProfile(vals) {
    var wrote = false;
    for (var k in vals) {
      var f = profileField(k);
      if (!f) continue;
      var n = parseFloat(vals[k]);
      if (!isFinite(n)) continue;
      if (typeof f.min === 'number' && n < f.min) continue;
      if (typeof f.max === 'number' && n > f.max) continue;
      state.profile[k] = n;
      wrote = true;
    }
    if (wrote) save();
    return wrote;
  }

  function commitCompute(id, raw) {
    var l = byId(id);
    if (!l || !l.compute) return false;
    if (computeMissing(l).length) return false;
    var r = record(id);
    if (r.compute) return false;                 // first number stands
    var yours = parseFloat(raw);
    if (!isFinite(yours)) return false;
    var computed = computeAnswer(l);
    if (computed === null) return false;
    r.compute = {
      yours: yours,
      computed: computed,
      gap: yours - computed,
      on: today()
    };
    save();
    return true;
  }

  function gapStats() {
    var gaps = [];
    for (var id in state.log) {
      var c = state.log[id].compute;
      if (c && typeof c.gap === 'number') gaps.push(c.gap);
    }
    if (!gaps.length) return { n: 0, medianAbs: null, signedMean: null };
    var abs = gaps.map(Math.abs).sort(function (a, b) { return a - b; });
    var mid = Math.floor(abs.length / 2);
    var medianAbs = abs.length % 2 ? abs[mid] : (abs[mid - 1] + abs[mid]) / 2;
    var mean = gaps.reduce(function (a, b) { return a + b; }, 0) / gaps.length;
    return { n: gaps.length, medianAbs: medianAbs, signedMean: mean };
  }

  function computeDone(id) {
    var r = state.log[id];
    return !!(r && r.compute);
  }

  function gateOpen(id) {
    var l = byId(id);
    if (l && l.compute) return computeDone(id);
    if (!GATE) return true;
    var r = state.log[id];
    return !!(r && r.gate && r.gate.answer);
  }

  function unlockGate(id, text) {
    var r = record(id);
    if (r.gate && r.gate.answer) return false;
    var body = String(text || '').trim();
    if (body.length < (GATE.minChars || 1)) return false;
    r.gate = { answer: body, on: today() };
    save();
    return true;
  }

  /* --- Small helpers ----------------------------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function paras(text) {
    return String(text).split(/\n\n+/).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  }
  function trackName(id) {
    var t = TRACKS.filter(function (x) { return x.id === id; })[0];
    return t ? t.name : id;
  }
  function readMinutes(l) {
    var words = [l.idea, l.why, l.failureMode, l.experiment, l.reflection].join(' ').split(/\s+/).length;
    return Math.max(3, Math.round(words / 200) + 2);
  }
  function el(id) { return document.getElementById(id); }

  var toastTimer = null;
  function toast(msg) {
    var t = el('toast');
    if (!t) return;
    t.textContent = msg;
    t.setAttribute('data-open', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.removeAttribute('data-open'); }, 2600);
  }

  /* --- Deep-dive prompt --------------------------------------------------
     Folds whatever was written into the prompt, so the conversation arrives
     already about a real situation rather than about the abstraction. This
     is the only bridge from a page with no model in it to one that has. */
  function deepDivePrompt(l) {
    var r = state.log[l.id] || {};
    var note = (r.note || '').trim();
    var lines = [
      PROMPT.intro || 'I am working through a daily entry and want to apply it to my actual situation.',
      '',
      'ENTRY: ' + l.title,
      'IDEA: ' + l.idea,
      'MECHANISM: ' + l.why,
      'FAILURE MODE: ' + l.failureMode
    ];
    if (GATE && r.gate && r.gate.answer) {
      lines.push('', 'WHAT I COMMITTED TO BEFORE READING IT (' + shortDate(r.gate.on) + '): ' + r.gate.answer);
    }
    lines.push('', l.deepDive, '',
      'MY SITUATION: ' + (note || '(I have not written this up yet — ask me for it first, one question at a time.)'),
      '',
      PROMPT.closing || 'Push back on my reasoning rather than agreeing with me. Name the thing I am avoiding. Be concrete and brief.');
    return lines.join('\n');
  }

  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? okMsg : 'Copy blocked here — select the text below instead');
      return ok;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, fallback);
    } else {
      fallback();
    }
  }

  /* ==========================================================================
     Forecast book

     The only self-scoring mechanic here. A site that cannot detect its own
     inertness will feel productive while teaching nothing; a Brier score
     going sideways for three months is the one signal that cannot be
     rationalised. Brier is the mean squared error of a probability against
     a binary outcome, so lower is better and an always-fifty-percent
     forecaster scores 0.25.
     ========================================================================== */
  function forecastList() {
    return Object.keys(state.forecasts).map(function (fid) {
      var f = state.forecasts[fid];
      return { id: fid, q: f.q, p: f.p, made: f.made, resolvesOn: f.resolvesOn, outcome: f.outcome, resolvedOn: f.resolvedOn, source: f.source || null };
    }).sort(function (a, b) { return a.resolvesOn < b.resolvesOn ? -1 : 1; });
  }

  function brier() {
    var resolved = forecastList().filter(function (f) { return f.outcome === 0 || f.outcome === 1; });
    if (!resolved.length) return null;
    var sum = resolved.reduce(function (n, f) { return n + Math.pow(f.p - f.outcome, 2); }, 0);
    return { score: sum / resolved.length, n: resolved.length };
  }

  function calibration() {
    var buckets = [];
    for (var i = 0; i < 10; i++) buckets.push({ lo: i / 10, hi: (i + 1) / 10, n: 0, hits: 0 });
    forecastList().forEach(function (f) {
      if (f.outcome !== 0 && f.outcome !== 1) return;
      var idx = Math.min(9, Math.floor(f.p * 10));
      buckets[idx].n += 1;
      buckets[idx].hits += f.outcome;
    });
    return buckets;
  }

  function addForecast(q, p, resolvesOn, source) {
    var fid = 'f' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
    state.forecasts[fid] = {
      q: q, p: p, made: today(), resolvesOn: resolvesOn,
      outcome: null, resolvedOn: null, source: source || null
    };
    save();
    return fid;
  }

  function resolveForecast(fid, outcome) {
    var f = state.forecasts[fid];
    if (!f || f.outcome === 0 || f.outcome === 1) return;
    f.outcome = outcome;
    f.resolvedOn = today();
    save();
  }

  function calibrationSVG() {
    var b = calibration();
    var W = 320, H = 200, PAD = 34;
    var x = function (v) { return PAD + v * (W - PAD - 8); };
    var y = function (v) { return H - PAD - v * (H - PAD - 12); };

    var s = '<svg class="cal" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Calibration: predicted probability against observed frequency">';
    s += '<line class="cal__ref" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(1) + '" y2="' + y(1) + '"/>';
    s += '<line class="cal__axis" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(1) + '" y2="' + y(0) + '"/>';
    s += '<line class="cal__axis" x1="' + x(0) + '" y1="' + y(0) + '" x2="' + x(0) + '" y2="' + y(1) + '"/>';

    b.forEach(function (bk) {
      if (!bk.n) return;
      var mid = (bk.lo + bk.hi) / 2;
      var obs = bk.hits / bk.n;
      var r = Math.min(9, 3 + Math.sqrt(bk.n) * 1.6);
      s += '<circle class="cal__dot" cx="' + x(mid).toFixed(1) + '" cy="' + y(obs).toFixed(1) +
        '" r="' + r.toFixed(1) + '"><title>' + Math.round(bk.lo * 100) + '-' + Math.round(bk.hi * 100) +
        '%: ' + bk.hits + ' of ' + bk.n + ' happened</title></circle>';
    });

    s += '<text class="cal__t" x="' + x(0.5) + '" y="' + (H - 8) + '" text-anchor="middle">you said</text>';
    s += '<text class="cal__t" x="10" y="' + y(0.5) + '" text-anchor="middle" transform="rotate(-90 10 ' + y(0.5) + ')">it happened</text>';
    s += '</svg>';
    return s;
  }

  /* ==========================================================================
     Views
     ========================================================================== */
  var VIEWS = ['today', HAS_REVIEW ? 'review' : 'attempts', 'library'];
  if (HAS_CHEAT) VIEWS.push('cheatsheet');
  if (HAS_FORECAST) VIEWS.push('forecast');
  VIEWS.push('journal', 'progress');

  var VIEW_LABEL = {
    today: COPY.tabToday || 'Today',
    review: COPY.tabReview || 'Review',
    attempts: COPY.tabAttempts || 'Attempts',
    library: COPY.tabLibrary || 'Library',
    cheatsheet: COPY.tabCheatsheet || 'Cheatsheet',
    forecast: COPY.tabForecast || 'Forecasts',
    journal: COPY.tabJournal || 'Journal',
    progress: COPY.tabProgress || 'Progress'
  };

  var view = 'today';
  var reviewIdx = 0;
  var reviewQueue = [];
  var revealed = false;
  var libFilter = { q: '', track: null, level: null, lapsed: false };
  var libOpen = null;

  function mountShell() {
    el('wordmark').textContent = SITE.name || 'Daily';
    el('eyebrow').textContent = SITE.eyebrow || 'Logbook';
    el('spine-sub').textContent = SITE.tagline || '';
    if (SITE.name) document.title = SITE.name + (SITE.tagline ? ' - ' + SITE.tagline : '');

    var nav = el('nav');
    nav.innerHTML = VIEWS.map(function (v) {
      return '<button class="nav__item" data-view="' + v + '">' +
        '<span class="nav__key">' + esc(VIEW_LABEL[v]) + '</span>' +
        '<span class="nav__badge" id="badge-' + v + '" hidden></span></button>';
    }).join('');

    el('gauge').innerHTML = [
      ['streak', COPY.gaugeStreak || 'Streak'],
      ['logged', COPY.gaugeLogged || 'Logged'],
      ['retained', COPY.gaugeRetained || 'Retained']
    ].map(function (g) {
      return '<div class="gauge__cell"><dt>' + esc(g[1]) + '</dt><dd id="gauge-' + g[0] + '">0</dd></div>';
    }).join('');

    el('field').innerHTML = VIEWS.map(function (v) {
      return '<section class="view" id="view-' + v + '" aria-label="' + esc(VIEW_LABEL[v]) + '"' +
        (v === 'today' ? '' : ' hidden') + '></section>';
    }).join('');
  }

  function renderChrome() {
    var l = lessonForToday();
    el('stamp-num').textContent = l ? entryNumber(l.id) : '—';
    el('stamp-date').textContent = longDate(today());

    el('gauge-streak').textContent = state.streak.count || 0;
    el('gauge-logged').textContent = Object.keys(state.log).filter(function (id) {
      return state.log[id].completedOn;
    }).length;
    el('gauge-retained').textContent = HAS_REVIEW
      ? Object.keys(state.log).filter(function (id) { return state.log[id].box >= 4; }).length
      : Object.keys(state.log).reduce(function (n, id) { return n + (state.log[id].attempts || []).length; }, 0);

    if (HAS_REVIEW) {
      var due = dueList().length;
      var bR = el('badge-review');
      if (due) { bR.textContent = due; bR.hidden = false; } else { bR.hidden = true; }
    }

    var bT = el('badge-today');
    if (!completedToday()) { bT.textContent = 'new'; bT.hidden = false; } else { bT.hidden = true; }

    if (HAS_FORECAST) {
      var ripe = forecastList().filter(function (f) {
        return f.outcome === null && daysBetween(f.resolvesOn, today()) >= 0;
      }).length;
      var bF = el('badge-forecast');
      if (ripe) { bF.textContent = ripe; bF.hidden = false; } else { bF.hidden = true; }
    }

    Array.prototype.forEach.call(document.querySelectorAll('.nav__item'), function (b) {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    el('theme-label').textContent = dark ? (COPY.themeLight || 'Daylight') : (COPY.themeDark || 'Lamplight');
  }

  /* --- Gate block -------------------------------------------------------- */
  function num(n) {
    var r = Math.round(n * 100) / 100;
    return String(r);
  }

  function computeHTML(l) {
    var missing = computeMissing(l);
    var r = state.log[l.id] || {};
    var unit = l.compute.unit ? ' ' + l.compute.unit : '';

    var h = '<div class="compute' + (r.compute ? ' compute--done' : '') + '">';
    h += '<p class="block__label">' + esc(COPY.labelCompute || 'Work it out first') + '</p>';
    // Same setup the text gate shows. Without this an entry that switched to
    // the arithmetic gate would silently drop the situation it was written for.
    if (l.gateIntro) h += '<div class="gate__intro">' + paras(l.gateIntro) + '</div>';
    h += '<p class="compute__q">' + esc(l.compute.question) + '</p>';

    if (r.compute) {
      h += '<p class="compute__result">You wrote <b>' + esc(num(r.compute.yours)) + esc(unit) +
        '</b>. It computes to <b>' + esc(num(r.compute.computed)) + esc(unit) + '</b>.</p>';
      h += '<p class="compute__gap" data-dir="' + (r.compute.gap < 0 ? 'under' : r.compute.gap > 0 ? 'over' : 'exact') + '">' +
        (r.compute.gap === 0 ? 'Exact.'
          : esc(num(Math.abs(r.compute.gap)) + unit) + (r.compute.gap < 0 ? ' under.' : ' over.')) +
        '</p>';
      return h + '</div>';
    }

    if (missing.length) {
      h += '<p class="compute__note">' + esc((PROFILE && PROFILE.note) ||
        'Held in this browser only, and never sent anywhere.') + '</p>';
      h += '<div class="compute__fields">';
      missing.forEach(function (id) {
        var f = profileField(id);
        h += '<label class="compute__lab" for="prof-' + esc(id) + '">' + esc(f.label) +
          (f.unit ? ' <span class="compute__unit">' + esc(f.unit) + '</span>' : '') + '</label>';
        h += '<input class="compute__input" id="prof-' + esc(id) + '" type="number" inputmode="decimal">';
      });
      h += '</div>';
      h += '<button class="btn" data-act="profile-save" data-id="' + esc(l.id) + '">Save and continue</button>';
    } else {
      h += '<div class="compute__row">';
      h += '<input class="compute__input" id="compute-field" type="number" inputmode="decimal" ' +
        'placeholder="' + esc(COPY.computePlaceholder || 'Your number') + '">';
      h += '<button class="btn" data-act="compute-commit" data-id="' + esc(l.id) + '">' +
        esc(COPY.computeCta || 'Commit it') + '</button>';
      h += '</div>';
    }

    h += '<p class="gate__curtain">' + esc(COPY.computeCurtain ||
      'The entry opens once you have written your own number above.') + '</p>';
    return h + '</div>';
  }

  function gateHTML(l) {
    var r = state.log[l.id] || {};
    var answered = !!(r.gate && r.gate.answer);

    var h = '<div class="gate' + (answered ? ' gate--done' : '') + '">';
    h += '<p class="block__label">' + esc(GATE.label) + '</p>';

    if (l.gateIntro) h += '<div class="gate__intro">' + paras(l.gateIntro) + '</div>';
    h += '<p class="gate__prompt">' + esc(l.gatePrompt || GATE.prompt) + '</p>';

    if (answered) {
      h += '<div class="gate__locked"><p class="gate__stamp">Committed ' + esc(shortDate(r.gate.on)) + '</p>';
      h += '<div class="gate__answer">' + paras(r.gate.answer) + '</div></div>';
    } else {
      if (l.fallback) {
        h += '<details class="gate__fallback"><summary>' + esc(GATE.fallbackLabel || 'Nothing of your own to hand') +
          '</summary><div class="gate__fallbacktext">' + paras(l.fallback) + '</div>' +
          '<button class="btn btn--quiet" data-act="gate-fallback" data-id="' + esc(l.id) + '">Use this one</button></details>';
      }
      h += '<textarea class="reflect__field gate__field" id="gate-field" data-id="' + esc(l.id) + '" placeholder="' +
        esc(GATE.placeholder || '') + '"></textarea>';
      h += '<div class="actions" style="border-top:0;padding-top:0">';
      h += '<button class="btn" data-act="gate-unlock" data-id="' + esc(l.id) + '">' + esc(GATE.cta || 'Commit and read on') + '</button>';
      h += '</div>';
      h += '<p class="gate__note">' + esc(GATE.note || 'Once you commit, this is frozen and the entry opens. That is the point.') + '</p>';
    }
    h += '</div>';
    return h;
  }

  /* --- Entry (shared by Today and Library reader) ------------------------ */
  function entryHTML(l, opts) {
    opts = opts || {};
    var r = state.log[l.id] || {};
    var done = r.completedOn === today();
    var computed = !!(l.compute && PROFILE);
    var locked = (computed || GATE) && opts.canComplete && !gateOpen(l.id);

    var h = '';
    h += '<article class="entry">';
    h += '<header class="entry__head">';
    h += '<div class="tags">';
    h += '<span class="tag">' + esc(trackName(l.track)) + '</span>';
    if (LEVELS[l.level]) h += '<span class="tag tag--level">' + esc(LEVELS[l.level]) + '</span>';
    h += '<span class="tag tag--time">' + readMinutes(l) + ' min</span>';
    if (lapsed(l)) h += '<span class="tag tag--lapsed">lapsed ' + esc(shortDate(l.expires)) + '</span>';
    h += '</div>';
    h += '<h2 class="entry__title">' + esc(l.title) + '</h2>';
    h += '<div class="entry__rule"></div>';
    h += '<p class="entry__source">' + esc(COPY.sourcePrefix || 'After') + ' <em>' + esc(l.source) + '</em></p>';
    h += '</header>';

    /* An entry that declares a sum uses the arithmetic gate. Anything else on
       the same site falls back to the text gate if one is configured. */
    if (opts.canComplete) {
      if (computed) h += computeHTML(l);
      else if (GATE) h += gateHTML(l);
    }

    if (locked) {
      // The arithmetic gate draws its own curtain, because what it says depends
      // on whether it is still asking for profile figures or for the answer.
      if (!computed) {
        h += '<p class="gate__curtain">' + esc(GATE.curtain || 'The entry opens once you have committed an answer above.') + '</p>';
      }
      h += '</article>';
      return h;
    }

    if (lapsed(l)) {
      h += '<div class="block block--failure"><p class="block__label">Past its date</p><div class="block__body"><p>' +
        esc(COPY.lapsedNote || 'This entry carried an expiry and it has passed. Treat it as history rather than as current fact. It has left the sequence and the review deck.') +
        '</p></div></div>';
    }

    h += '<div class="block"><p class="block__label">' + esc(COPY.labelIdea || 'The idea') + '</p>';
    h += '<div class="block__body"><p class="lead">' + esc(l.idea) + '</p></div></div>';

    /* Above the mechanism rather than below it. The prose is what drifts past
       the citation, so the citation has to be read first to be a check on it. */
    if (HAS_EVIDENCE && l.evidence) h += evidenceHTML(l);

    h += '<div class="block"><p class="block__label">' + esc(COPY.labelWhy || 'Why it holds') + '</p>';
    h += '<div class="block__body">' + paras(l.why) + '</div></div>';

    h += '<div class="block block--failure"><p class="block__label">' + esc(COPY.labelFailure || 'What goes wrong without it') + '</p>';
    h += '<div class="block__body">' + paras(l.failureMode) + '</div></div>';

    /* Immediately after the diagnosis, because broken then repaired is the pair
       the reader is actually comparing. Only reachable past the gate: this is
       the answer a site promised not to show first, so everything above returns
       early while the entry is locked. */
    if (l.worked) {
      h += '<div class="worked"><p class="block__label">' + esc(COPY.labelWorked || 'One good repair') + '</p>';
      h += '<div class="worked__body">' + paras(l.worked) + '</div></div>';
    }

    h += '<div class="experiment"><p class="experiment__label">' + esc(COPY.labelExperiment || 'Try this today') + '</p>';
    h += '<div class="experiment__body">' + paras(l.experiment) + '</div></div>';

    if (HAS_FORECAST && l.forecast) {
      var already = forecastList().filter(function (f) { return f.source === l.id; })[0];
      h += '<div class="fc-seed"><p class="block__label">' + esc(COPY.labelForecast || 'Put a number on it') + '</p>';
      h += '<p class="fc-seed__q">' + esc(l.forecast.q) + '</p>';
      if (already) {
        h += '<p class="reflect__state">Recorded at ' + Math.round(already.p * 100) + '%, resolves ' + esc(shortDate(already.resolvesOn)) + '.</p>';
      } else {
        h += '<div class="fc-seed__row">';
        h += '<label class="fc-seed__lab">Probability <input class="fc-seed__p" id="seed-p" type="number" min="1" max="99" step="1" value="50">%</label>';
        h += '<label class="fc-seed__lab">Resolves <input class="fc-seed__d" id="seed-d" type="date" value="' + esc(l.forecast.resolvesOn || shift(today(), 30)) + '"></label>';
        h += '<button class="btn btn--quiet" data-act="seed-forecast" data-id="' + esc(l.id) + '">Record it</button>';
        h += '</div>';
      }
      h += '</div>';
    }

    h += '<div class="reflect">';
    h += '<p class="block__label">' + esc(COPY.labelReflect || 'Log it') + '</p>';
    h += '<p class="reflect__prompt">' + esc(l.reflection) + '</p>';
    h += '<textarea class="reflect__field" id="note-field" data-id="' + esc(l.id) + '" ' +
      'placeholder="' + esc(COPY.reflectPlaceholder || 'Write what actually happened, not what should have.') + '">' + esc(r.note || '') + '</textarea>';
    h += '<p class="reflect__state" id="note-state"></p>';
    h += '</div>';

    h += '<div class="deepdive">';
    h += '<p class="block__label">' + esc(COPY.labelDeepDive || 'Take it further') + '</p>';
    h += '<p class="deepdive__note">' + esc(COPY.deepDiveNote ||
      'Copy this into Claude to work the idea against your real situation. Whatever you logged above travels with it.') + '</p>';
    h += '<div class="actions" style="border-top:0;padding-top:0">';
    h += '<button class="btn btn--quiet" data-act="copy-prompt" data-id="' + esc(l.id) + '">Copy the prompt</button>';
    h += '<button class="btn btn--quiet" data-act="show-prompt" data-id="' + esc(l.id) + '">Show it</button>';
    h += '</div>';
    h += '<pre class="deepdive__text" id="prompt-text" hidden></pre>';
    h += '</div>';

    h += '<div class="actions">';
    if (opts.canComplete) {
      h += done
        ? '<button class="btn btn--done" disabled>Logged for ' + esc(shortDate(today())) + '</button>'
        : '<button class="btn" data-act="complete" data-id="' + esc(l.id) + '">' + esc(COPY.completeCta || 'Log this entry') + '</button>';
      if (done && HAS_REVIEW && state.log[l.id].due) {
        h += '<span class="reflect__state">In the review deck. Next up ' + esc(shortDate(state.log[l.id].due)) + '.</span>';
      }
    } else {
      h += '<button class="btn btn--quiet" data-act="lib-close">Back to the library</button>';
      h += '<span class="reflect__state">Reading ahead. Entries are logged on their own day.</span>';
    }
    h += '</div>';

    h += '</article>';
    return h;
  }

  function renderToday() {
    var l = lessonForToday();
    var h = '';

    if (!STORAGE_OK) {
      h += '<div class="card" style="border-top-color:var(--action)">';
      h += '<div class="card__meta"><span>Nothing is being saved</span></div>';
      h += '<p class="card__q">This browser is blocking local storage.</p>';
      h += '<p>You can read today\'s entry, but streaks, notes and the schedule ' +
        'will not survive a reload. Private browsing is the usual cause. Open the page in a ' +
        'normal window, or download the file and open it directly.</p>';
      h += '</div>';
    }

    if (!l) {
      h += '<p class="empty">No live entries. Everything in the corpus has passed its expiry date.</p>';
      el('view-today').innerHTML = h;
      return;
    }

    var due = dueList();
    if (due.length && !completedToday()) {
      h += '<div class="card" style="border-top-color:var(--action)">';
      h += '<div class="card__meta"><span>Before you read on</span><span>' + due.length + ' due</span></div>';
      h += '<p class="card__q">' + due.length + (due.length === 1 ? ' card is' : ' cards are') + ' due from earlier entries.</p>';
      h += '<p>' + esc(COPY.recallFirst || 'Recall first, then read. Pulling something back out of your head is what moves it.') + '</p>';
      h += '<div class="actions" style="border-top:0;padding-top:0">';
      h += '<button class="btn" data-act="go" data-view="review">Run the review</button>';
      h += '</div></div>';
    }

    h += entryHTML(l, { canComplete: true });
    el('view-today').innerHTML = h;
  }

  function renderReview() {
    var host = el('view-review');
    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.review) + '</h2>' +
      '<p class="section__note">' + esc(COPY.reviewNote ||
        'Answer out loud before you turn the card. Grade yourself honestly — the schedule is only as good as the grading.') + '</p></div>';

    if (!reviewQueue.length) reviewQueue = dueList();

    if (!reviewQueue.length) {
      var next = null;
      Object.keys(state.log).forEach(function (id) {
        var d = state.log[id].due;
        if (state.log[id].box > 0 && d && (!next || d < next)) next = d;
      });
      h += '<p class="empty">Nothing due. ' +
        (next ? 'The next card comes back on ' + esc(shortDate(next)) + '.' : 'Log an entry and cards start arriving tomorrow.') +
        '</p>';
      host.innerHTML = h;
      return;
    }

    if (reviewIdx >= reviewQueue.length) {
      h += '<p class="empty">Deck cleared — ' + reviewQueue.length +
        (reviewQueue.length === 1 ? ' card' : ' cards') + ' done. That is the part that compounds.</p>';
      h += '<div class="actions"><button class="btn" data-act="go" data-view="today">Read today\'s entry</button></div>';
      host.innerHTML = h;
      return;
    }

    var id = reviewQueue[reviewIdx];
    var l = BY_ID[id];
    var r = state.log[id];

    h += '<div class="card">';
    h += '<div class="card__meta">';
    h += '<span>Entry ' + entryNumber(id) + ' &middot; ' + esc(trackName(l.track)) + '</span>';
    h += '<span>' + (reviewIdx + 1) + ' / ' + reviewQueue.length + ' &middot; box ' + r.box + '</span>';
    h += '</div>';
    h += '<p class="card__q">' + esc(l.recall.q) + '</p>';

    if (!revealed) {
      h += '<div class="actions" style="border-top:0;padding-top:0">';
      h += '<button class="btn" data-act="reveal">Turn the card</button>';
      h += '</div>';
    } else {
      h += '<div class="card__a">' + paras(l.recall.a) + '</div>';
      h += '<div class="grades">';
      h += '<button class="grade grade--miss" data-act="grade" data-grade="miss" data-id="' + esc(id) + '">Missed it<span class="grade__hint">back to box 1</span></button>';
      h += '<button class="grade grade--close" data-act="grade" data-grade="close" data-id="' + esc(id) + '">Nearly<span class="grade__hint">hold this box</span></button>';
      h += '<button class="grade grade--got" data-act="grade" data-grade="got" data-id="' + esc(id) + '">Had it<span class="grade__hint">move up</span></button>';
      h += '</div>';
      h += '<p class="reflect__state">' + esc(l.title) + '</p>';
    }
    h += '</div>';
    host.innerHTML = h;
  }

  /* --- Attempts, for sites with no recall rotation ------------------------
     Where the knowledge is procedural, recalling a number is trivia unless
     the pan is hot. So the second tab is not a deck, it is a record of what
     happened the last time you actually did the thing. */
  function renderAttempts() {
    var host = el('view-attempts');
    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.attempts) + '</h2>' +
      '<p class="section__note">' + esc(COPY.attemptsNote ||
        'Entries you have logged. Write down what happened when you tried it - that is the only review worth doing here.') + '</p></div>';

    var done = Object.keys(state.log)
      .filter(function (id) { return BY_ID[id] && state.log[id].completedOn; })
      .sort(function (a, b) {
        var da = state.log[a].completedOn, db = state.log[b].completedOn;
        return db < da ? -1 : db > da ? 1 : 0;
      });

    if (!done.length) {
      h += '<p class="empty">Nothing logged yet.</p>';
      host.innerHTML = h;
      return;
    }

    done.forEach(function (id) {
      var l = BY_ID[id], r = state.log[id];
      h += '<div class="attempt">';
      h += '<div class="note__meta"><span>Entry ' + entryNumber(id) + '</span><span>' +
        esc(shortDate(r.completedOn)) + '</span><span>' + esc(trackName(l.track)) + '</span></div>';
      h += '<p class="note__title">' + esc(l.title) + '</p>';
      (r.attempts || []).forEach(function (a) {
        h += '<p class="attempt__past"><span>' + esc(shortDate(a.on)) + '</span> ' + esc(a.text) + '</p>';
      });
      h += '<div class="attempt__new">';
      h += '<textarea class="reflect__field attempt__field" data-id="' + esc(id) + '" placeholder="' +
        esc(COPY.attemptPlaceholder || 'What happened last time you did this?') + '"></textarea>';
      h += '<button class="btn btn--quiet" data-act="attempt-add" data-id="' + esc(id) + '">Record it</button>';
      h += '</div>';
      h += '</div>';
    });
    host.innerHTML = h;
  }

  function renderLibrary() {
    var host = el('view-library');

    if (libOpen && BY_ID[libOpen]) {
      host.innerHTML = entryHTML(BY_ID[libOpen], { canComplete: false });
      return;
    }

    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.library) + '</h2>' +
      '<p class="section__note">All ' + LESSONS.length + ' entries, in the order they will arrive. ' +
      'Read ahead freely — logging stays a daily act.</p></div>';

    h += '<div class="filters">';
    h += '<input class="search" id="lib-search" type="search" placeholder="Search entries" value="' + esc(libFilter.q) + '">';
    if (Object.keys(LEVELS).length) {
      h += '<button class="chip" data-act="lib-level" data-level="" aria-pressed="' + (!libFilter.level) + '">' +
        esc(COPY.allLevels || 'All levels') + '</button>';
      Object.keys(LEVELS).forEach(function (k) {
        h += '<button class="chip" data-act="lib-level" data-level="' + k + '" aria-pressed="' +
          (libFilter.level === k) + '">' + esc(LEVELS[k]) + '</button>';
      });
    }
    if (HAS_EXPIRY) {
      h += '<button class="chip" data-act="lib-lapsed" aria-pressed="' + libFilter.lapsed + '">Lapsed only</button>';
    }
    h += '</div>';

    h += '<div class="filters">';
    h += '<button class="chip" data-act="lib-track" data-track="" aria-pressed="' + (!libFilter.track) + '">All tracks</button>';
    TRACKS.forEach(function (t) {
      h += '<button class="chip" data-act="lib-track" data-track="' + t.id + '" aria-pressed="' +
        (libFilter.track === t.id) + '">' + esc(t.name) + '</button>';
    });
    h += '</div>';

    var q = libFilter.q.trim().toLowerCase();
    var ordered = SEQ.map(function (id) { return BY_ID[id]; });
    LESSONS.forEach(function (l) { if (ordered.indexOf(l) === -1) ordered.push(l); });

    var rows = ordered.filter(function (l) {
      if (!l) return false;
      if (libFilter.lapsed && !lapsed(l)) return false;
      if (libFilter.track && l.track !== libFilter.track) return false;
      if (libFilter.level && l.level !== libFilter.level) return false;
      if (q) {
        var hay = (l.title + ' ' + l.idea + ' ' + l.source + ' ' + trackName(l.track)).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (!rows.length) {
      h += '<p class="empty">Nothing matches that.</p>';
      host.innerHTML = h;
      return;
    }

    h += '<div class="shelf">';
    rows.forEach(function (l) {
      var r = state.log[l.id];
      var cls = 'pip';
      var label = 'not yet served';
      if (lapsed(l)) { cls += ' pip--lapsed'; label = 'lapsed ' + shortDate(l.expires); }
      else if (r && HAS_REVIEW && r.box >= 4) { cls += ' pip--solid'; label = 'solid'; }
      else if (r && HAS_REVIEW && r.box > 0) { cls += ' pip--shaky'; label = 'in review, box ' + r.box; }
      else if (r && r.completedOn) { cls += ' pip--logged'; label = 'logged'; }
      h += '<button class="shelf__row" data-act="lib-open" data-id="' + esc(l.id) + '">';
      h += '<span class="shelf__num">' + entryNumber(l.id) + '</span>';
      h += '<span class="shelf__title"><span class="' + cls + '" title="' + esc(label) + '"></span>' + esc(l.title) + '</span>';
      h += '<span class="shelf__track">' + esc(trackName(l.track)) + '</span>';
      h += '</button>';
    });
    h += '</div>';
    host.innerHTML = h;
  }

  /* The one view that is not a study aid. Everything else here is built to slow
     you down; this is built to be read at speed, which is why it is restricted
     to the verdict that survived being re-run. A cheatsheet of contested and
     single-study findings would be a list of things to be confidently wrong
     about, and the corpus is mostly those - so the count of what was left off
     is stated rather than quietly dropped. */
  function renderCheatsheet() {
    var host = el('view-cheatsheet');
    /* live() rather than LESSONS. A lapsed entry stays in the library marked,
       because knowing what went stale is useful, but a cheatsheet row is the
       purest form of the quiet reinforcement that expiry exists to stop. */
    var pool = live();
    var solid = pool.filter(onCheatsheet);

    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.cheatsheet) + '</h2>';
    h += '<p class="section__note">' + esc(COPY.cheatNote || '') +
      ' <b>' + solid.length + '</b> of ' + pool.length + ' entries. ';
    /* The withheld count is generated and the reason is the site's to write,
       because the reasons differ: a verdict-filtered site withheld what did not
       replicate, an opt-in site withheld what does not compress. Stating the
       count either way stops a short page reading as the whole corpus. */
    if (COPY.cheatWithheld) {
      h += 'The other ' + (pool.length - solid.length) + ' ' + esc(COPY.cheatWithheld);
    }
    h += '</p></div>';

    TRACKS.forEach(function (t) {
      var rows = solid.filter(function (l) { return l.track === t.id; });
      if (!rows.length) return;

      h += '<section class="cheat">';
      h += '<h3 class="cheat__track">' + esc(t.name) + '</h3>';
      rows.forEach(function (l) {
        h += '<button class="cheat__row" data-act="cheat-open" data-id="' + esc(l.id) + '"' +
          (l.replication ? ' data-rep="' + esc(l.replication) + '"' : '') +
          (stale(l) ? ' data-stale="1"' : '') + '>';
        h += '<span class="cheat__do">' + esc(l.cheat) + '</span>';
        h += '<span class="cheat__claim">' + esc(l.title) + '</span>';
        h += '<span class="cheat__meta">';
        /* A page carrying more than one verdict has to say which is which, or a
           legislated fact and a replicated finding read as the same kind of
           thing. One verdict needs no chip: the section note already said it. */
        if (CHEAT_VERDICTS && CHEAT_VERDICTS.length > 1) {
          h += '<span class="rep-chip">' + esc(REP_LABEL[l.replication] || l.replication) + '</span>';
        }
        if (l.interval && typeof l.interval.lo === 'number' && typeof l.interval.hi === 'number') {
          /* Both bounds or neither. Half an interval is the single most common
             way a number gets laundered into sounding settled, and a cheatsheet
             is exactly where that happens. */
          h += '<span class="cheat__interval">' + esc(l.interval.measure || 'interval') + ' ' +
            l.interval.lo + ' to ' + l.interval.hi + '</span>';
        }
        h += '<span class="cheat__source">' + esc(l.source) + '</span>';
        // Statute is true as at a date and not before or necessarily after it.
        if (l.replication === 'statute' && l.asAt) {
          h += '<span class="cheat__stale">as at ' + esc(shortDate(l.asAt)) + '</span>';
        }
        if (stale(l)) {
          h += '<span class="cheat__stale">not re-checked since ' + esc(shortDate(l.verifiedOn)) + '</span>';
        }
        h += '</span></button>';
      });
      h += '</section>';
    });

    host.innerHTML = h;
  }

  function renderForecast() {
    var host = el('view-forecast');
    var all = forecastList();
    var open = all.filter(function (f) { return f.outcome === null; });
    var ripe = open.filter(function (f) { return daysBetween(f.resolvesOn, today()) >= 0; });
    var pending = open.filter(function (f) { return daysBetween(f.resolvesOn, today()) < 0; });
    var closed = all.filter(function (f) { return f.outcome !== null; });
    var b = brier();

    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.forecast) + '</h2>' +
      '<p class="section__note">' + esc(COPY.forecastNote ||
        'A number you wrote down before you knew. Brier is mean squared error against the outcome, so lower is better and always saying fifty percent scores 0.25.') + '</p></div>';

    h += '<div class="readout">';
    h += cell('Brier', b ? b.score.toFixed(3) : '—', b ? 'over ' + b.n + ' resolved' : 'nothing resolved yet');
    h += cell('Open', open.length, ripe.length ? ripe.length + ' ready to resolve' : 'none ready');
    h += cell('Resolved', closed.length, closed.length ? Math.round(100 * closed.filter(function (f) { return f.outcome === 1; }).length / closed.length) + '% happened' : 'no data yet');
    h += '</div>';

    if (b && b.n >= 5) {
      h += '<div class="calwrap"><p class="block__label">Calibration</p>' + calibrationSVG() +
        '<p class="deepdive__note">Dots on the diagonal mean the number meant what it said. Above it you are underconfident, below it overconfident. Dot size is how many forecasts landed in that band.</p></div>';
    }

    if (ripe.length) {
      h += '<div class="fc-group"><p class="block__label">Ready to resolve</p>';
      ripe.forEach(function (f) {
        h += '<div class="fc-row fc-row--ripe">';
        h += '<div class="fc-row__body"><p class="fc-row__q">' + esc(f.q) + '</p>';
        h += '<p class="fc-row__meta">You said ' + Math.round(f.p * 100) + '% on ' + esc(shortDate(f.made)) + '</p></div>';
        h += '<div class="fc-row__acts">';
        h += '<button class="btn btn--quiet" data-act="fc-resolve" data-fid="' + esc(f.id) + '" data-outcome="1">It happened</button>';
        h += '<button class="btn btn--quiet" data-act="fc-resolve" data-fid="' + esc(f.id) + '" data-outcome="0">It did not</button>';
        h += '</div></div>';
      });
      h += '</div>';
    }

    h += '<div class="fc-group"><p class="block__label">New forecast</p>';
    h += '<textarea class="reflect__field fc-new__q" id="fc-q" placeholder="A question that will have a yes or no answer on a known date"></textarea>';
    h += '<div class="fc-seed__row">';
    h += '<label class="fc-seed__lab">Probability <input class="fc-seed__p" id="fc-p" type="number" min="1" max="99" step="1" value="50">%</label>';
    h += '<label class="fc-seed__lab">Resolves <input class="fc-seed__d" id="fc-d" type="date" value="' + esc(shift(today(), 30)) + '"></label>';
    h += '<button class="btn" data-act="fc-add">Record it</button>';
    h += '</div></div>';

    if (pending.length) {
      h += '<div class="fc-group"><p class="block__label">Open</p>';
      pending.forEach(function (f) {
        h += '<div class="fc-row"><div class="fc-row__body"><p class="fc-row__q">' + esc(f.q) + '</p>';
        h += '<p class="fc-row__meta">' + Math.round(f.p * 100) + '% &middot; resolves ' + esc(shortDate(f.resolvesOn)) + '</p></div></div>';
      });
      h += '</div>';
    }

    if (closed.length) {
      h += '<div class="fc-group"><p class="block__label">Resolved</p>';
      closed.slice().reverse().forEach(function (f) {
        var err = Math.pow(f.p - f.outcome, 2);
        h += '<div class="fc-row fc-row--' + (err < 0.09 ? 'good' : err > 0.36 ? 'bad' : 'mid') + '">';
        h += '<div class="fc-row__body"><p class="fc-row__q">' + esc(f.q) + '</p>';
        h += '<p class="fc-row__meta">Said ' + Math.round(f.p * 100) + '%, ' +
          (f.outcome ? 'it happened' : 'it did not') + ' &middot; squared error ' + err.toFixed(2) + '</p></div></div>';
      });
      h += '</div>';
    }

    host.innerHTML = h;
  }

  function renderJournal() {
    var notes = Object.keys(state.log)
      .filter(function (id) {
        var r = state.log[id];
        return BY_ID[id] && ((r.note || '').trim() || (r.gate && r.gate.answer));
      })
      .sort(function (a, b) {
        var da = state.log[a].completedOn || '', db = state.log[b].completedOn || '';
        return db < da ? -1 : db > da ? 1 : 0;
      });

    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.journal) + '</h2>' +
      '<p class="section__note">' + esc(COPY.journalNote ||
        'Everything you have written down. In a year this is the most valuable thing here — it is a record of your own judgement changing.') + '</p></div>';

    if (!notes.length) {
      h += '<p class="empty">Nothing logged yet. The reflection field on any entry writes here.</p>';
    } else {
      notes.forEach(function (id) {
        var l = BY_ID[id], r = state.log[id];
        h += '<div class="note">';
        h += '<div class="note__meta"><span>Entry ' + entryNumber(id) + '</span>' +
          (r.completedOn ? '<span>' + esc(shortDate(r.completedOn)) + '</span>' : '') +
          '<span>' + esc(trackName(l.track)) + '</span></div>';
        h += '<p class="note__title">' + esc(l.title) + '</p>';
        if (r.gate && r.gate.answer) {
          h += '<p class="note__label">' + esc(GATE && GATE.journalLabel || 'Before reading') + '</p>';
          h += '<p class="note__body note__body--gate">' + esc(r.gate.answer) + '</p>';
        }
        if ((r.note || '').trim()) {
          if (r.gate && r.gate.answer) h += '<p class="note__label">After</p>';
          h += '<p class="note__body">' + esc(r.note) + '</p>';
        }
        h += '</div>';
      });
    }
    el('view-journal').innerHTML = h;
  }

  function cell(label, value, unit) {
    return '<div class="readout__cell"><span class="readout__label">' + esc(label) + '</span>' +
      '<span class="readout__value">' + esc(value) + '</span>' +
      '<span class="readout__unit">' + esc(unit) + '</span></div>';
  }

  function renderProgress() {
    var ids = Object.keys(state.log);
    var logged = ids.filter(function (i) { return state.log[i].completedOn; }).length;
    var reviews = ids.reduce(function (n, i) { return n + (state.log[i].reviews || []).length; }, 0);
    var hits = ids.reduce(function (n, i) {
      return n + (state.log[i].reviews || []).filter(function (v) { return v.grade === 'got'; }).length;
    }, 0);
    var accuracy = reviews ? Math.round((hits / reviews) * 100) : null;
    var daysActive = Object.keys(state.days).length;

    var h = '<div class="section__head"><h2 class="section__title">' + esc(VIEW_LABEL.progress) + '</h2>' +
      '<p class="section__note">' + esc(COPY.progressNote ||
        'Streaks measure showing up. Retention measures whether it stuck. The second one is the one that matters.') + '</p></div>';

    h += '<div class="readout">';
    h += cell('Streak', state.streak.count || 0, (state.streak.count === 1 ? 'day' : 'days') + ' running');
    h += cell('Best streak', state.streak.best || 0, 'days');
    h += cell('Entries logged', logged, 'of ' + LESSONS.length);
    if (HAS_REVIEW) {
      h += cell('Cards reviewed', reviews, accuracy === null ? 'no data yet' : accuracy + '% recalled');
      h += cell('Solid', ids.filter(function (i) { return state.log[i].box >= 4; }).length, 'box 4 or 5');
    } else {
      var attempts = ids.reduce(function (n, i) { return n + (state.log[i].attempts || []).length; }, 0);
      h += cell('Attempts recorded', attempts, 'across ' + ids.filter(function (i) { return (state.log[i].attempts || []).length; }).length + ' entries');
    }
    h += cell('Days on the books', daysActive, 'since ' + shortDate(state.startedOn));
    if (HAS_EXPIRY) {
      h += cell('Lapsed', LESSONS.filter(lapsed).length, 'out of rotation');
    }
    if (GATE) {
      var gated = ids.filter(function (i) { return state.log[i].gate && state.log[i].gate.answer; }).length;
      h += cell(GATE.statLabel || 'Committed', gated, 'answers frozen before reading');
    }
    /* Two cells rather than one. The median says how far off you are; the
       signed mean says which side you are wrong on, and a reader who is
       reliably optimistic about their own position learns more from the
       direction than from the size. */
    if (PROFILE) {
      var g = gapStats();
      h += cell('Median gap', g.n ? num(g.medianAbs) : '-',
        g.n ? 'across ' + g.n + (g.n === 1 ? ' sum' : ' sums') : 'nothing computed yet');
      if (g.n) {
        h += cell('Typical direction', (g.signedMean > 0 ? '+' : '') + num(g.signedMean),
          g.signedMean > 0 ? 'you read high' : g.signedMean < 0 ? 'you read low' : 'no lean');
      }
    }
    h += '</div>';

    h += '<div class="coverage"><p class="block__label">Coverage by track</p>';
    TRACKS.forEach(function (t) {
      var all = LESSONS.filter(function (l) { return l.track === t.id; });
      var done = all.filter(function (l) { return state.log[l.id] && state.log[l.id].completedOn; }).length;
      var pct = all.length ? Math.round((done / all.length) * 100) : 0;
      h += '<div class="cov">';
      h += '<span class="cov__name">' + esc(t.name) + '</span>';
      h += '<span class="cov__bar"><span class="cov__fill" style="width:' + pct + '%"></span></span>';
      h += '<span class="cov__n">' + done + '/' + all.length + '</span>';
      h += '</div>';
    });
    h += '</div>';

    h += '<div class="deepdive">';
    h += '<p class="block__label">Your record</p>';
    h += '<p class="deepdive__note">Everything lives in this browser only. Clearing site data wipes it, ' +
      'so take a copy occasionally — especially the journal.</p>';
    h += '<div class="actions" style="border-top:0;padding-top:0">';
    h += '<button class="btn btn--quiet" data-act="export">Download a backup</button>';
    h += '<button class="btn btn--quiet" data-act="export-show">Show as text</button>';
    h += '<button class="btn btn--quiet" data-act="import-open">Restore from backup</button>';
    h += '</div>';
    h += '<pre class="deepdive__text" id="export-text" hidden></pre>';
    h += '<div id="import-box" hidden>';
    h += '<textarea class="reflect__field" id="import-field" placeholder="Paste a backup here"></textarea>';
    h += '<div class="actions" style="border-top:0"><button class="btn" data-act="import-run">Restore</button></div>';
    h += '</div>';
    h += '</div>';

    el('view-progress').innerHTML = h;
  }

  function render() {
    renderChrome();
    VIEWS.forEach(function (v) { el('view-' + v).hidden = v !== view; });
    if (view === 'today') renderToday();
    else if (view === 'review') renderReview();
    else if (view === 'attempts') renderAttempts();
    else if (view === 'library') renderLibrary();
    else if (view === 'cheatsheet') renderCheatsheet();
    else if (view === 'forecast') renderForecast();
    else if (view === 'journal') renderJournal();
    else renderProgress();
  }

  function go(v) {
    if (VIEWS.indexOf(v) === -1) return;
    view = v;
    if (v === 'review') { reviewQueue = dueList(); reviewIdx = 0; revealed = false; }
    /* Unconditionally, including when v is already the library. Clearing only on
       the way out left the open entry in place, so pressing Library while
       reading one re-rendered that entry and the tab looked dead - the one way
       back to the list was the entry's own close button. Going to a view means
       the top of it. Anything that wants an entry open sets libOpen after the
       call, which is what cheat-open does. */
    libOpen = null;
    render();
    el('field').scrollIntoView({ block: 'start', behavior: 'auto' });
  }

  /* ==========================================================================
     Wiring
     ========================================================================== */
  document.addEventListener('click', function (ev) {
    var nav = ev.target.closest('.nav__item');
    if (nav) { go(nav.dataset.view); return; }

    var b = ev.target.closest('[data-act]');
    if (!b) return;
    var act = b.dataset.act;
    var id = b.dataset.id;

    if (act === 'go') { go(b.dataset.view); return; }

    if (act === 'complete') {
      markComplete(id);
      toast(HAS_REVIEW ? 'Entry logged. It comes back for review tomorrow.' : 'Entry logged.');
      render();
      return;
    }

    if (act === 'gate-fallback') {
      var ff = el('gate-field');
      var lf = BY_ID[id];
      if (ff && lf && lf.fallback) { ff.value = lf.fallback; ff.focus(); }
      return;
    }

    if (act === 'gate-unlock') {
      var gf = el('gate-field');
      if (!gf || !unlockGate(id, gf.value)) {
        toast(GATE && GATE.tooShort || 'Write something first — that is the whole mechanism');
        return;
      }
      render();
      return;
    }

    if (act === 'profile-save') {
      var l = byId(id);
      var vals = {};
      computeNeeds(l).forEach(function (n) {
        var f = el('prof-' + n);
        if (f) vals[n] = f.value;
      });
      if (!saveProfile(vals)) {
        toast('Put a number in each field first');
        return;
      }
      render();
      return;
    }

    if (act === 'compute-commit') {
      var cf = el('compute-field');
      if (!cf || !commitCompute(id, cf.value)) {
        toast(COPY.computeRefused || 'Write your own number first — that is the whole mechanism');
        return;
      }
      render();
      return;
    }

    if (act === 'attempt-add') {
      var af = document.querySelector('.attempt__field[data-id="' + id + '"]');
      var txt = af ? af.value.trim() : '';
      if (!txt) { toast('Nothing to record'); return; }
      record(id).attempts.push({ on: today(), text: txt });
      save();
      renderChrome();
      renderAttempts();
      return;
    }

    if (act === 'seed-forecast') {
      var sp = el('seed-p'), sd = el('seed-d');
      var lz = BY_ID[id];
      var pv = sp ? Math.max(1, Math.min(99, parseInt(sp.value, 10) || 50)) : 50;
      if (!sd || !sd.value) { toast('Give it a resolution date'); return; }
      addForecast(lz.forecast.q, pv / 100, sd.value, id);
      toast('Recorded. It lands in the forecast book.');
      render();
      return;
    }

    if (act === 'fc-add') {
      var q = el('fc-q').value.trim();
      var p = Math.max(1, Math.min(99, parseInt(el('fc-p').value, 10) || 50));
      var d = el('fc-d').value;
      if (!q) { toast('Write the question first'); return; }
      if (!d) { toast('Give it a resolution date'); return; }
      addForecast(q, p / 100, d, null);
      renderForecast();
      renderChrome();
      return;
    }

    if (act === 'fc-resolve') {
      resolveForecast(b.dataset.fid, parseInt(b.dataset.outcome, 10));
      renderForecast();
      renderChrome();
      return;
    }

    if (act === 'reveal') { revealed = true; renderReview(); return; }

    if (act === 'grade') {
      gradeCard(id, b.dataset.grade);
      reviewIdx += 1;
      revealed = false;
      renderChrome();
      renderReview();
      return;
    }

    if (act === 'copy-prompt') {
      copyText(deepDivePrompt(BY_ID[id]), 'Prompt copied — paste it into Claude');
      return;
    }
    if (act === 'show-prompt') {
      var pt = el('prompt-text');
      pt.textContent = deepDivePrompt(BY_ID[id]);
      pt.hidden = !pt.hidden;
      return;
    }

    if (act === 'lib-open') { libOpen = id; renderLibrary(); el('field').scrollIntoView({ block: 'start' }); return; }
    if (act === 'lib-close') { libOpen = null; renderLibrary(); return; }
    if (act === 'lib-track') { libFilter.track = b.dataset.track || null; renderLibrary(); return; }
    if (act === 'lib-level') { libFilter.level = b.dataset.level || null; renderLibrary(); return; }
    if (act === 'lib-lapsed') { libFilter.lapsed = !libFilter.lapsed; renderLibrary(); return; }

    /* A cheatsheet row is a summary of an entry, so following one hands you the
       entry itself rather than a second, longer summary. go() clears libOpen, so
       it is set after the switch rather than before. */
    if (act === 'cheat-open') { go('library'); libOpen = id; renderLibrary(); return; }

    if (act === 'export') {
      var json = JSON.stringify(state, null, 2);
      try {
        var url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
        var a = document.createElement('a');
        a.href = url;
        a.download = (SITE.slug || 'daily') + '-' + today() + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast('Backup downloaded');
      } catch (e) {
        el('export-text').textContent = json;
        el('export-text').hidden = false;
        toast('Download blocked here — copy the text instead');
      }
      return;
    }
    if (act === 'export-show') {
      var et = el('export-text');
      et.textContent = JSON.stringify(state, null, 2);
      et.hidden = !et.hidden;
      return;
    }
    if (act === 'import-open') {
      var ib = el('import-box');
      ib.hidden = !ib.hidden;
      return;
    }
    if (act === 'import-run') {
      var txt2 = el('import-field').value.trim();
      if (!txt2) { toast('Paste a backup first'); return; }
      try {
        var next = JSON.parse(txt2);
        if (!next || next.v !== 1 || typeof next.log !== 'object') throw new Error('shape');
        state = next;
        state.log = state.log || {};
        state.days = state.days || {};
        state.forecasts = state.forecasts || {};
        state.streak = state.streak || clone(blank.streak);
        save();
        toast('Restored');
        go('today');
      } catch (e) {
        toast('That is not a ' + (SITE.name || 'Daily') + ' backup — check you pasted the whole file');
      }
      return;
    }
  });

  // Autosave the reflection field. Debounced so it does not thrash storage.
  var noteTimer = null;
  document.addEventListener('input', function (ev) {
    if (ev.target.id === 'lib-search') {
      libFilter.q = ev.target.value;
      var pos = ev.target.selectionStart;
      renderLibrary();
      var again = el('lib-search');
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
      return;
    }

    if (ev.target.id !== 'note-field') return;
    var nid = ev.target.dataset.id;
    var val = ev.target.value;
    var st = el('note-state');
    if (st) st.textContent = 'Saving…';
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () {
      record(nid).note = val;
      save();
      var s = el('note-state');
      if (s) s.textContent = 'Saved to this browser';
    }, 500);
  });

  /* ==========================================================================
     Boot
     ========================================================================== */
  mountShell();

  el('theme-toggle').addEventListener('click', function () {
    var root = document.documentElement;
    var dark = root.getAttribute('data-theme') === 'dark' ||
      (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.setAttribute('data-theme', dark ? 'light' : 'dark');
    state.theme = dark ? 'light' : 'dark';
    save();
    renderChrome();
  });

  if (state.theme) document.documentElement.setAttribute('data-theme', state.theme);

  if (!LESSONS.length) {
    el('view-today').innerHTML = '<p class="empty">No entries loaded. The content files did not run.</p>';
  } else {
    render();
  }

  // Exposed for the test harness only. The page itself never reads this.
  window.__daily = {
    reviewInterval: reviewInterval, buildSequence: buildSequence, lessonForToday: lessonForToday,
    dueList: dueList, markComplete: markComplete, gradeCard: gradeCard, unlockGate: unlockGate,
    gateOpen: gateOpen, lapsed: lapsed, brier: brier, calibration: calibration,
    addForecast: addForecast, resolveForecast: resolveForecast, deepDivePrompt: deepDivePrompt,
    gapStats: gapStats, commitCompute: commitCompute, saveProfile: saveProfile,
    state: function () { return state; }, seq: function () { return SEQ; }, go: go, render: render
  };
})();

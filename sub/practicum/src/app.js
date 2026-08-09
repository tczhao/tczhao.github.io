/* ==========================================================================
   Practicum — engine

   State lives in localStorage under one versioned key. Nothing here talks to
   the network, so the page works offline and forever.
   ========================================================================== */
(function () {
  'use strict';

  var KEY = 'practicum.v1';
  var LESSONS = window.LESSONS || [];

  var TRACKS = [
    { id: 'leverage',      name: 'Leverage and time' },
    { id: 'people',        name: 'People and growth' },
    { id: 'trust',         name: 'Trust and safety' },
    { id: 'decisions',     name: 'Decisions' },
    { id: 'communication', name: 'Communication' },
    { id: 'systems',       name: 'Systems and org design' },
    { id: 'strategy',      name: 'Strategy and scope' },
    { id: 'influence',     name: 'Influence without authority' },
    { id: 'performance',   name: 'Performance and hard conversations' },
    { id: 'hiring',        name: 'Hiring and onboarding' },
    { id: 'change',        name: 'Change and incidents' },
    { id: 'self',          name: 'Leading yourself' }
  ];

  var LEVELS = { team: 'Team lead', cross: 'Cross-org', both: 'Any level' };

  /* ------------------------------------------------------------------------
     THE POLICY DIAL

     This one function decides the whole rhythm of retention: how long a
     lesson rests before it comes back, and how badly a miss sets you back.
     It ships as Leitner boxes with 1 / 3 / 7 / 16 / 35 day intervals, which
     is the right default for a corpus this size at one pass per day.

     Three alternatives, if the default doesn't fit how you learn:

       Forgiving   — a miss drops you one box instead of all the way to 1.
                     Kinder, but genuinely-forgotten material resurfaces
                     slowly, which is the failure mode you care about.
       Aggressive  — intervals 1/2/4/8/16. Roughly twice the review load for
                     noticeably better recall. Costs you minutes a day.
       Long tail   — add a sixth box at 90 days so solid material still gets
                     checked twice a year rather than disappearing.

     Change the arithmetic here and the whole schedule follows; nothing else
     in the app hardcodes an interval.
     --------------------------------------------------------------------- */
  var INTERVALS = [1, 3, 7, 16, 35];
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
    var p = k.split('-');
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
    var d = parseKey(k);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  function shortDate(k) {
    return parseKey(k).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* --- Sequence -----------------------------------------------------------
     Round-robin across tracks, rotating the track order each cycle. Because
     each track file is ordered foundational first, the opening cycle serves
     the twelve most foundational lessons before anything advanced. */
  function buildSequence() {
    var byTrack = TRACKS.map(function (t) {
      return LESSONS.filter(function (l) { return l.track === t.id; });
    });
    var out = [];
    var cycle = 0;
    var guard = LESSONS.length + TRACKS.length + 1;
    while (out.length < LESSONS.length && cycle < guard) {
      for (var i = 0; i < TRACKS.length; i++) {
        var bucket = byTrack[(i + cycle) % TRACKS.length];
        var lesson = bucket[cycle];
        if (lesson) out.push(lesson.id);
      }
      cycle++;
    }
    // Anything a ragged track length left behind.
    LESSONS.forEach(function (l) { if (out.indexOf(l.id) === -1) out.push(l.id); });
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
    if (!state.log[id]) state.log[id] = { box: 0, due: null, note: '', reviews: [], completedOn: null };
    return state.log[id];
  }

  /* --- The daily pick ----------------------------------------------------
     Written once per date, then read back. Stable across reloads, honest as
     a history, and a missed day pushes the corpus forward instead of
     silently dropping an entry. */
  function lessonForToday() {
    var t = today();
    if (state.days[t] && BY_ID[state.days[t]]) return BY_ID[state.days[t]];

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
    var t = today();
    return Object.keys(state.log)
      .filter(function (id) {
        var r = state.log[id];
        return BY_ID[id] && r.due && r.box > 0 && daysBetween(r.due, t) >= 0;
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
    if (r.box === 0) { r.box = 1; r.due = shift(t, INTERVALS[0]); }

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
    t.textContent = msg;
    t.setAttribute('data-open', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.removeAttribute('data-open'); }, 2600);
  }

  /* --- Deep-dive prompt --------------------------------------------------
     Folds whatever you wrote in the reflection field into the prompt, so it
     arrives already about your situation rather than about the abstraction. */
  function deepDivePrompt(l) {
    var note = (state.log[l.id] && state.log[l.id].note || '').trim();
    return [
      'I am working through a management lesson and want to apply it to my actual situation.',
      '',
      'LESSON: ' + l.title,
      'IDEA: ' + l.idea,
      'MECHANISM: ' + l.why,
      'FAILURE MODE: ' + l.failureMode,
      '',
      l.deepDive,
      '',
      'MY SITUATION: ' + (note || '(I have not written this up yet — ask me for it first, one question at a time.)'),
      '',
      'Push back on my reasoning rather than agreeing with me. Name the thing I am avoiding. Be concrete and brief.'
    ].join('\n');
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
     Views
     ========================================================================== */
  var view = 'today';
  var reviewIdx = 0;
  var reviewQueue = [];
  var revealed = false;
  var libFilter = { q: '', track: null, level: null };
  var libOpen = null;

  function renderChrome() {
    var l = lessonForToday();
    el('stamp-num').textContent = entryNumber(l.id);
    el('stamp-date').textContent = longDate(today());

    el('gauge-streak').textContent = state.streak.count || 0;
    el('gauge-logged').textContent = Object.keys(state.log).filter(function (id) {
      return state.log[id].completedOn;
    }).length;
    el('gauge-retained').textContent = Object.keys(state.log).filter(function (id) {
      return state.log[id].box >= 4;
    }).length;

    var due = dueList().length;
    var bR = el('badge-review');
    if (due) { bR.textContent = due; bR.hidden = false; } else { bR.hidden = true; }

    var bT = el('badge-today');
    if (!completedToday()) { bT.textContent = 'new'; bT.hidden = false; } else { bT.hidden = true; }

    Array.prototype.forEach.call(document.querySelectorAll('.nav__item'), function (b) {
      if (b.dataset.view === view) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });

    var dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    el('theme-label').textContent = dark ? 'Daylight' : 'Lamplight';
  }

  /* --- Entry (shared by Today and Library reader) ------------------------ */
  function entryHTML(l, opts) {
    opts = opts || {};
    var r = state.log[l.id] || {};
    var done = r.completedOn === today();

    var h = '';
    h += '<article class="entry">';
    h += '<header class="entry__head">';
    h += '<div class="tags">';
    h += '<span class="tag">' + esc(trackName(l.track)) + '</span>';
    h += '<span class="tag tag--level">' + esc(LEVELS[l.level] || l.level) + '</span>';
    h += '<span class="tag tag--time">' + readMinutes(l) + ' min</span>';
    h += '</div>';
    h += '<h2 class="entry__title">' + esc(l.title) + '</h2>';
    h += '<div class="entry__rule"></div>';
    h += '<p class="entry__source">After <em>' + esc(l.source) + '</em></p>';
    h += '</header>';

    h += '<div class="block"><p class="block__label">The idea</p>';
    h += '<div class="block__body"><p class="lead">' + esc(l.idea) + '</p></div></div>';

    h += '<div class="block"><p class="block__label">Why it holds</p>';
    h += '<div class="block__body">' + paras(l.why) + '</div></div>';

    h += '<div class="block block--failure"><p class="block__label">What goes wrong without it</p>';
    h += '<div class="block__body">' + paras(l.failureMode) + '</div></div>';

    h += '<div class="experiment"><p class="experiment__label">Try this today</p>';
    h += '<div class="experiment__body">' + paras(l.experiment) + '</div></div>';

    h += '<div class="reflect">';
    h += '<p class="block__label">Log it</p>';
    h += '<p class="reflect__prompt">' + esc(l.reflection) + '</p>';
    h += '<textarea class="reflect__field" id="note-field" data-id="' + esc(l.id) + '" ' +
      'placeholder="Write what actually happened, not what should have.">' + esc(r.note || '') + '</textarea>';
    h += '<p class="reflect__state" id="note-state"></p>';
    h += '</div>';

    h += '<div class="deepdive">';
    h += '<p class="block__label">Take it further</p>';
    h += '<p class="deepdive__note">Copy this into Claude to work the idea against your real situation. ' +
      'Whatever you logged above travels with it.</p>';
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
        : '<button class="btn" data-act="complete" data-id="' + esc(l.id) + '">Log this entry</button>';
      if (done) h += '<span class="reflect__state">In the review deck. Next up ' +
        esc(shortDate(state.log[l.id].due)) + '.</span>';
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
    var due = dueList();
    var h = '';

    if (!STORAGE_OK) {
      h += '<div class="card" style="border-top-color:var(--action)">';
      h += '<div class="card__meta"><span>Nothing is being saved</span></div>';
      h += '<p class="card__q">This browser is blocking local storage.</p>';
      h += '<p>You can read today\'s entry, but streaks, notes and the review schedule ' +
        'will not survive a reload. Private browsing is the usual cause. Open the page in a ' +
        'normal window, or download the file and open it directly.</p>';
      h += '</div>';
    }

    if (due.length && !completedToday()) {
      h += '<div class="card" style="border-top-color:var(--action)">';
      h += '<div class="card__meta"><span>Before you read on</span><span>' + due.length + ' due</span></div>';
      h += '<p class="card__q">' + due.length + (due.length === 1 ? ' card is' : ' cards are') + ' due from earlier entries.</p>';
      h += '<p>Recall first, then read. Pulling something back out of your head is what moves it.</p>';
      h += '<div class="actions" style="border-top:0;padding-top:0">';
      h += '<button class="btn" data-act="go" data-view="review">Run the review</button>';
      h += '</div></div>';
    }

    h += entryHTML(l, { canComplete: true });
    el('view-today').innerHTML = h;
  }

  function renderReview() {
    var host = el('view-review');
    var h = '<div class="section__head"><h2 class="section__title">Review</h2>' +
      '<p class="section__note">Answer out loud before you turn the card. Grade yourself honestly — ' +
      'the schedule is only as good as the grading.</p></div>';

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

  function renderLibrary() {
    var host = el('view-library');

    if (libOpen && BY_ID[libOpen]) {
      host.innerHTML = entryHTML(BY_ID[libOpen], { canComplete: false });
      return;
    }

    var h = '<div class="section__head"><h2 class="section__title">Library</h2>' +
      '<p class="section__note">All ' + LESSONS.length + ' entries, in the order they will arrive. ' +
      'Read ahead freely — logging stays a daily act.</p></div>';

    h += '<div class="filters">';
    h += '<input class="search" id="lib-search" type="search" placeholder="Search entries" value="' + esc(libFilter.q) + '">';
    h += '<button class="chip" data-act="lib-level" data-level="" aria-pressed="' + (!libFilter.level) + '">All levels</button>';
    Object.keys(LEVELS).forEach(function (k) {
      h += '<button class="chip" data-act="lib-level" data-level="' + k + '" aria-pressed="' +
        (libFilter.level === k) + '">' + esc(LEVELS[k]) + '</button>';
    });
    h += '</div>';

    h += '<div class="filters">';
    h += '<button class="chip" data-act="lib-track" data-track="" aria-pressed="' + (!libFilter.track) + '">All tracks</button>';
    TRACKS.forEach(function (t) {
      h += '<button class="chip" data-act="lib-track" data-track="' + t.id + '" aria-pressed="' +
        (libFilter.track === t.id) + '">' + esc(t.name) + '</button>';
    });
    h += '</div>';

    var q = libFilter.q.trim().toLowerCase();
    var rows = SEQ.map(function (id) { return BY_ID[id]; }).filter(function (l) {
      if (!l) return false;
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
      if (r && r.box >= 4) { cls += ' pip--solid'; label = 'solid'; }
      else if (r && r.box > 0) { cls += ' pip--shaky'; label = 'in review, box ' + r.box; }
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
     you down; this is built to be read before a one-to-one you are already late
     for. Nothing in this corpus grades its own evidence, so there is no verdict
     to filter on and the row is opt-in: an entry appears if it was written a
     cheat line. That is a selection rather than a filter, and the note says so
     - a page of twenty-odd lines that implied it was the whole corpus would be
     the exact management-writing failure the entries themselves warn about. */
  function renderCheatsheet() {
    var host = el('view-cheatsheet');
    var rows = LESSONS.filter(function (l) { return !!l.cheat; });

    var h = '<div class="section__head"><h2 class="section__title">Cheatsheet</h2>' +
      '<p class="section__note">The entries that survive being compressed to one line. ' +
      '<b>' + rows.length + '</b> of ' + LESSONS.length + ' entries. The other ' +
      (LESSONS.length - rows.length) + ' are not weaker, they are less compressible - ' +
      'their value is in the reasoning, and a one-line version would be a slogan.</p></div>';

    TRACKS.forEach(function (t) {
      var inTrack = rows.filter(function (l) { return l.track === t.id; });
      if (!inTrack.length) return;

      h += '<section class="cheat">';
      h += '<h3 class="cheat__track">' + esc(t.name) + '</h3>';
      inTrack.forEach(function (l) {
        h += '<button class="cheat__row" data-act="cheat-open" data-id="' + esc(l.id) + '">';
        h += '<span class="cheat__do">' + esc(l.cheat) + '</span>';
        h += '<span class="cheat__claim">' + esc(l.title) + '</span>';
        h += '<span class="cheat__meta"><span class="cheat__source">' + esc(l.source) + '</span></span>';
        h += '</button>';
      });
      h += '</section>';
    });

    host.innerHTML = h;
  }

  function renderJournal() {
    var notes = Object.keys(state.log)
      .filter(function (id) { return BY_ID[id] && (state.log[id].note || '').trim(); })
      .sort(function (a, b) {
        var da = state.log[a].completedOn || '', db = state.log[b].completedOn || '';
        return db < da ? -1 : db > da ? 1 : 0;
      });

    var h = '<div class="section__head"><h2 class="section__title">Journal</h2>' +
      '<p class="section__note">Everything you have written down. In a year this is the most valuable ' +
      'thing here — it is a record of your own judgement changing.</p></div>';

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
        h += '<p class="note__body">' + esc(r.note) + '</p>';
        h += '</div>';
      });
    }
    el('view-journal').innerHTML = h;
  }

  function renderProgress() {
    var ids = Object.keys(state.log);
    var logged = ids.filter(function (i) { return state.log[i].completedOn; }).length;
    var reviews = ids.reduce(function (n, i) { return n + state.log[i].reviews.length; }, 0);
    var hits = ids.reduce(function (n, i) {
      return n + state.log[i].reviews.filter(function (v) { return v.grade === 'got'; }).length;
    }, 0);
    var accuracy = reviews ? Math.round((hits / reviews) * 100) : null;
    var daysActive = Object.keys(state.days).length;

    var h = '<div class="section__head"><h2 class="section__title">Progress</h2>' +
      '<p class="section__note">Streaks measure showing up. Retention measures whether it stuck. ' +
      'The second one is the one that matters.</p></div>';

    h += '<div class="readout">';
    h += cell('Streak', state.streak.count || 0, (state.streak.count === 1 ? 'day' : 'days') + ' running');
    h += cell('Best streak', state.streak.best || 0, 'days');
    h += cell('Entries logged', logged, 'of ' + LESSONS.length);
    h += cell('Cards reviewed', reviews, accuracy === null ? 'no data yet' : accuracy + '% recalled');
    h += cell('Solid', ids.filter(function (i) { return state.log[i].box >= 4; }).length, 'box 4 or 5');
    h += cell('Days on the books', daysActive, 'since ' + shortDate(state.startedOn));
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

    function cell(label, value, unit) {
      return '<div class="readout__cell"><span class="readout__label">' + esc(label) + '</span>' +
        '<span class="readout__value">' + esc(value) + '</span>' +
        '<span class="readout__unit">' + esc(unit) + '</span></div>';
    }
  }

  function render() {
    renderChrome();
    ['today', 'review', 'library', 'cheatsheet', 'journal', 'progress'].forEach(function (v) {
      el('view-' + v).hidden = v !== view;
    });
    if (view === 'today') renderToday();
    else if (view === 'review') renderReview();
    else if (view === 'library') renderLibrary();
    else if (view === 'cheatsheet') renderCheatsheet();
    else if (view === 'journal') renderJournal();
    else renderProgress();
  }

  function go(v) {
    view = v;
    if (v === 'review') { reviewQueue = dueList(); reviewIdx = 0; revealed = false; }
    if (v !== 'library') libOpen = null;
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
      toast('Entry logged. It comes back for review tomorrow.');
      render();
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

    /* A cheatsheet row is a summary of an entry, so following one hands you the
       entry itself rather than a second, longer summary. go() clears libOpen on
       any move away from the library, so it is set after the switch. */
    if (act === 'cheat-open') { go('library'); libOpen = id; renderLibrary(); return; }

    if (act === 'export') {
      var json = JSON.stringify(state, null, 2);
      try {
        var url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
        var a = document.createElement('a');
        a.href = url;
        a.download = 'practicum-' + today() + '.json';
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
      var txt = el('import-field').value.trim();
      if (!txt) { toast('Paste a backup first'); return; }
      try {
        var next = JSON.parse(txt);
        if (!next || next.v !== 1 || typeof next.log !== 'object') throw new Error('shape');
        state = next;
        state.log = state.log || {};
        state.days = state.days || {};
        state.streak = state.streak || clone(blank.streak);
        save();
        toast('Restored');
        go('today');
      } catch (e) {
        toast('That is not a Practicum backup — check you pasted the whole file');
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
    var id = ev.target.dataset.id;
    var val = ev.target.value;
    var st = el('note-state');
    if (st) st.textContent = 'Saving…';
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () {
      record(id).note = val;
      save();
      var s = el('note-state');
      if (s) s.textContent = 'Saved to this browser';
    }, 500);
  });

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
})();

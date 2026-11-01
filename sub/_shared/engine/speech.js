/* ==========================================================================
   Daily — the reader

   Speaks a rendered entry aloud through the browser's own synthesiser. Nothing
   is fetched and nothing is stored, which is the only way a corpus this size
   gets an audio track at all: narrated as files the shared corpus runs to tens
   of hours, and a built page has to stay one self-contained file that works
   offline.

   The reader is handed text and speaks it. It never reads the corpus itself,
   and that division is load-bearing. app.js hands it only blocks that are on
   screen, and a locked entry returns before its body is built, so gated prose
   is not withheld here - it does not exist to be read. The recall answer is
   never part of an entry at all. Neither rule is enforced in this file and
   neither needs to be.

   Every utterance is short. Chrome stops synthesising after roughly fifteen
   seconds of a single utterance, reports no error, and leaves the queue
   looking healthy, so a paragraph handed over whole goes quiet halfway and
   nothing says why. Splitting to sentences keeps every utterance well inside
   that limit, which fixes it without a timer fighting the browser for control.
   ========================================================================== */
(function () {
  'use strict';

  var API = window.speechSynthesis;
  var Utterance = window.SpeechSynthesisUtterance;
  var NAV = window.navigator;
  var AVAILABLE = !!(API && Utterance);

  /* Only ever asked in this direction. navigator.onLine reports whether a
     network interface exists, not whether anything is reachable, so a true is
     worth nothing: a captive portal, a router with no uplink and a dead
     endpoint all report it. A false is the one answer it gets right, and it is
     the only one needed here. Compared against false explicitly so a browser
     that does not implement the property reads as online rather than as
     permanently offline. */
  function offline() {
    return !!NAV && NAV.onLine === false;
  }

  /* Long enough that the splits fall on real sentence ends most of the time,
     short enough that even the slowest voice finishes one inside the limit. */
  var MAX_CHUNK = 200;

  /* The same budget for Chinese and Japanese, counted in their characters.
     Mandarin synthesis runs at about four and a half characters a second, so
     sixty is roughly the thirteen seconds two hundred English letters take.
     Full-width punctuation is in the count, so a chunk of pure Chinese never
     runs past sixty characters. Korean is left out: it spaces its words and
     uses Latin punctuation, which the English rules already split on. */
  var MAX_CJK = 60;
  var CJK = /[\u2E80-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]/;

  var voice = null;
  var queue = [];
  var at = 0;
  var mode = 'idle';                    // idle | playing | paused
  var hooks = {};

  /* Bumped by everything that ends a read. A cancelled utterance still fires
     onend or onerror, and without this the handler advances a queue that has
     already been replaced, which starts the next entry reading itself. */
  var gen = 0;

  /* --- Splitting ---------------------------------------------------------- */
  function split(text) {
    var clean = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    var out = [];
    if (!clean) return out;

    /* Chinese ends a sentence with a full-width mark and leaves no space after
       it, so those marks are sentence ends too, or a Chinese paragraph reaches
       the synthesiser as one utterance. The full-width semicolon is among them
       because Chinese prose strings long runs of clauses on it. None of these
       occur in English text, so English splits on its own marks alone. */
    var re = /[^.!?。！？；]+[.!?。！？；]*/g;
    var m;
    while ((m = re.exec(clean)) !== null) {
      var s = m[0].trim();
      if (s) push(out, s);
    }
    return out;
  }

  /* A sentence long enough to trip the limit is broken again at its last
     clause boundary. Cutting mid-clause is audible as a stumble, so a sentence
     with nowhere good to break goes over whole: a rare long utterance beats a
     reliable wrong pause.

     Chinese and Japanese past MAX_CJK break the same way, at the last
     full-width comma, semicolon, colon or enumeration comma that fits. A run
     with none of those is the one thing cut at the budget itself, because a
     gap between two of these characters is always a gap between syllables,
     where a cut in English text could land inside a word. */
  function push(out, s) {
    var over = cjkOver(s);
    if (over !== -1) {
      var pause = -1;
      ['，', '；', '：', '、'].forEach(function (mark) {
        pause = Math.max(pause, s.lastIndexOf(mark, over - 1));
      });
      var end = pause === -1 ? over : pause + 1;
      out.push(s.slice(0, end).trim());
      push(out, s.slice(end).trim());
      return;
    }

    if (s.length <= MAX_CHUNK) { out.push(s); return; }

    var cut = -1;
    ['; ', ': ', ', ', ' - '].forEach(function (mark) {
      var found = s.lastIndexOf(mark, MAX_CHUNK);
      if (found !== -1 && found + mark.length > cut) cut = found + mark.length;
    });

    if (cut === -1) { out.push(s); return; }
    out.push(s.slice(0, cut).trim());
    push(out, s.slice(cut).trim());
  }

  /* Where the first Chinese or Japanese character past MAX_CJK sits in s, or
     -1 when all of s fits. */
  function cjkOver(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      if (CJK.test(s.charAt(i)) && ++n > MAX_CJK) return i;
    }
    return -1;
  }

  /* --- Voice --------------------------------------------------------------
     Nothing in the API reports how good a voice sounds, so the name is the
     only evidence there is. The tiers matter more than they look: a Mac offers
     around forty-seven English voices, most of them the 1990s concatenative
     set and a dozen of them novelty toys, so taking the first of anything is a
     coin flip that can land on Zarvox.

     Neural voices say so in their names. macOS ships its good ones as Premium
     or Enhanced downloads, Chrome's network voices are the Google family, and
     Edge exposes Microsoft's as Natural or Online. Anything unmarked falls
     through to whatever the browser itself calls default, which is at least a
     choice rather than a stumble, and then to no preference at all. Guessing
     is what produces the toys, so the last tier declines to guess. */
  var TIERS = [
    /premium|enhanced|neural|natural/i,
    /^(google|microsoft)\b/i
  ];

  /* A voice in the wrong language does not read badly, it reads nothing a
     listener can follow, so the page's language decides which voices are in
     the running before any tier gets a say. An exact tag wins over a regional
     sibling: zh-HK is Cantonese, and would read a Mandarin page in the wrong
     spoken language. Tags compare with - and _ alike and case ignored, because
     Android reports zh_CN where everything else says zh-CN. A page that
     declares nothing is read as English.

     Read from SITE directly because the first choice is made as this file
     loads, before app.js exists to hand anything over. */
  var DECLARED = (window.SITE && window.SITE.lang) || '';
  var LANG = norm(DECLARED);
  var PRIMARY = LANG ? LANG.split('-')[0] : 'en';

  function norm(tag) {
    return String(tag || '').replace(/_/g, '-').toLowerCase();
  }

  function inLanguage(voices) {
    var exact = LANG ? voices.filter(function (v) { return norm(v.lang) === LANG; }) : [];
    if (exact.length) return exact;
    return voices.filter(function (v) { return norm(v.lang).split('-')[0] === PRIMARY; });
  }

  function pickVoice() {
    var all = API.getVoices() || [];
    if (!all.length) return;

    /* A voice that is served over the network cannot work with the network
       down, so it is dropped from the running rather than chosen and then
       failed on. This is what keeps the tiers below from trading away the one
       property these pages are built on. It runs before the language match, so
       an offline page whose own language is only served over the network can
       still find a regional sibling installed locally. */
    if (offline()) all = all.filter(function (v) { return v.localService; });
    var own = inLanguage(all);
    if (!own.length) { voice = null; return; }

    /* Local wins inside a tier but never across one. A downloaded Premium beats
       a Google voice that needs the network, and a Google voice beats the local
       1990s set: these pages are built to work offline, but not at the price of
       sounding like a train announcement when something better is installed. */
    function best(pool) {
      var local = pool.filter(function (v) { return v.localService; });
      return (local.length ? local : pool)[0];
    }

    for (var i = 0; i < TIERS.length; i++) {
      var tier = own.filter(function (v) { return TIERS[i].test(v.name); });
      if (tier.length) { voice = best(tier); return; }
    }

    voice = own.filter(function (v) { return v.default; })[0] || null;
  }

  /* getVoices() is empty until the list loads, and browsers disagree about
     whether voiceschanged fires when it was already populated. Both paths ask. */
  if (AVAILABLE) {
    pickVoice();
    API.addEventListener('voiceschanged', pickVoice);
  }

  /* --- Queue --------------------------------------------------------------- */
  function announce(next) {
    mode = next;
    if (hooks.onState) hooks.onState(next);
  }

  function finish() {
    gen += 1;
    queue = [];
    at = 0;
    if (hooks.onPart) hooks.onPart(-1);
    announce('idle');
  }

  function step() {
    /* The one place a read is known to have reached the end, and so the only
       place onDone fires. stop() and a refused utterance both land in finish()
       as well, and neither of those means the entry was heard through -
       collapsing the three would have pressing Stop start the next entry. */
    if (at >= queue.length) {
      finish();
      if (hooks.onDone) hooks.onDone();
      return;
    }

    var mine = gen;
    var item = queue[at];
    if (at === 0 || item.part !== queue[at - 1].part) {
      if (hooks.onPart) hooks.onPart(item.part);
    }

    var u = new Utterance(item.text);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    /* With no voice chosen the browser picks one. Not every browser weighs the
       page's language when it does, and its default voice is usually English,
       so a declared language is named on the utterance itself. A page that
       declares none leaves the utterance's language unset. */
    else if (DECLARED) u.lang = DECLARED;
    u.onend = function () {
      if (gen !== mine) return;
      at += 1;
      step();
    };
    /* Cancellations arrive here too and the generation check has already
       swallowed those, so anything reaching the body is a voice that will not
       speak. The read ends rather than stuttering through the rest of the
       queue in silence, and the caller is told which kind of failure it was.

       Worth separating because only one of the two has anything the reader can
       act on. A network voice fails whenever the endpoint does not answer, and
       navigator.onLine cannot see most of the ways that happens - a captive
       portal reports itself as online - so this is where those cases surface
       rather than in the guard above. */
    u.onerror = function () {
      if (gen !== mine) return;
      var networked = !!(voice && !voice.localService);
      finish();
      if (hooks.onFail) hooks.onFail(networked ? 'network' : 'voice');
    };
    API.speak(u);
  }

  /* --- Public ------------------------------------------------------------ */
  function stop() {
    if (!AVAILABLE) return;
    gen += 1;
    queue = [];
    at = 0;
    API.cancel();
    if (mode !== 'idle') {
      if (hooks.onPart) hooks.onPart(-1);
      announce('idle');
    }
  }

  /* parts is [{ text }] in the order they should be heard. Anything else on
     those objects is the caller's and is passed back untouched by index.

     Returns false rather than starting where nothing would come out. A browser
     can carry the whole synthesis API and have no voice behind it - Chrome on
     a Linux box with no speech-dispatcher is the usual one - and in that state
     speak() is accepted, never finishes, and never errors. Left alone the
     button sits on Pause for a read that was never going to happen, so the
     caller is told instead. */
  function speak(parts, opts) {
    if (!AVAILABLE) return false;
    stop();
    if (!(API.getVoices() || []).length) return false;

    /* Re-chosen at the moment of use rather than watched for. Connectivity and
       the voice list can both have moved since boot, and one filter over a few
       dozen voices per click is cheaper than keeping online, offline and
       voiceschanged handlers honest between them. */
    pickVoice();

    hooks = opts || {};
    queue = [];
    (parts || []).forEach(function (p, i) {
      split(p.text).forEach(function (text) { queue.push({ text: text, part: i }); });
    });
    if (!queue.length) return false;

    at = 0;
    announce('playing');
    step();
    return true;
  }

  function pause() {
    if (mode !== 'playing') return;
    API.pause();
    announce('paused');
  }

  function resume() {
    if (mode !== 'paused') return;
    API.resume();
    announce('playing');
  }

  /* Chrome can restore a page with the synthesiser still parked in the paused
     state it was in when the page left, and every later speak() lands in it
     silently. Clearing on the way in and on the way out costs nothing. */
  if (AVAILABLE) {
    API.cancel();
    window.addEventListener('pagehide', stop);
  }

  window.SPEECH = {
    available: AVAILABLE,
    speak: speak,
    stop: stop,
    pause: pause,
    resume: resume,
    state: function () { return mode; },
    split: split,                       // exposed for the test harness only
    voice: function () { return voice; }
  };
})();

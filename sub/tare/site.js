/* Tare - what survives fees, tax, inflation and you.
 *
 * The gate is what stops this being a personal finance blog. Reading that
 * Division 293 costs you seventeen points changes nothing; typing your own
 * marginal rate in before the number appears is the only part that transfers.
 *
 * Roughly half this corpus is statute rather than finding, and statute rots
 * silently: a cap moves in July and the entry still reads as authoritative in
 * December. So `replication: 'statute'` carries a mandatory as-at date and a
 * link to the primary source, and reverifyDays marks any citation that has
 * not been re-checked inside six months. Expiry retires a claim the author
 * already knew would go stale. This retires the author's confidence in one
 * they thought was settled, which is where checking actually finds the misses.
 *
 * requireInterval is off deliberately. Half the useful evidence here is
 * historical simulation over overlapping periods, which has a failure rate and
 * a SAFEMAX but no confidence interval. Demanding one would buy invented
 * numbers rather than rigour. Nomogram, whose literature reports intervals as
 * a matter of course, should switch it on. */
window.SITE = {
  key: 'tare.v1',
  slug: 'tare',
  name: 'Tare',
  eyebrow: 'Docket',
  tagline: 'what survives fees, tax, inflation and you',

  /* A track exists once there is checked material for it, not before. An empty
     track is a promise the corpus has not kept, and build.js enforces it. */
  tracks: [
    { id: 'compounding', name: 'Compounding and drag' },
    { id: 'active', name: 'What active management costs' },
    { id: 'super', name: 'Superannuation and the caps' },
    { id: 'tax', name: 'Tax structure' },
    { id: 'risk', name: 'Risk capacity and sequence' },
    { id: 'property', name: 'Property and leverage' },
    { id: 'behaviour', name: 'The behaviour gap' },
    { id: 'decumulation', name: 'Drawing it down' }
  ],

  levels: { core: 'Core', applied: 'Applied', advanced: 'Advanced' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  evidenceGate: true,
  requireInterval: false,
  reverifyDays: 180,

  /* Statute rather than replication, which is the opposite of Nomogram and for
     the same reason. This corpus has exactly one replicated finding and ten
     that rest on a single study, so a replication filter here would produce a
     one-row page that said nothing. What is actually settled in this material
     is the legislation: a cap is a cap because it is written down, and every
     statute entry carries the date it was true and a link to the primary
     source. The one replicated finding rides along because it earned it. */
  cheatsheet: { verdicts: ['statute', 'replicated'] },

  /* The arithmetic gate reads these. Each entry declares its answer as a sum
     over them, and the entry stays shut until you have written your own number
     to be scored against. Fields are asked for one at a time, at the moment an
     entry needs them, because a settings page you fill in advance is a settings
     page you abandon. Nothing here leaves the browser. */
  profile: {
    note: 'Held in this browser only, never sent anywhere, and included in your export.',
    fields: [
      { id: 'marginalRate', label: 'Your marginal tax rate, including the Medicare levy', unit: '%', min: 0, max: 60 },
      { id: 'income', label: 'Gross annual income', unit: 'AUD', min: 0, max: 5000000 },
      { id: 'superBalance', label: 'Total superannuation balance', unit: 'AUD', min: 0, max: 20000000 },
      { id: 'concessional', label: 'Concessional contributions you expect this year', unit: 'AUD', min: 0, max: 200000 },
      { id: 'invested', label: 'Invested outside super', unit: 'AUD', min: 0, max: 20000000 },
      { id: 'targetBalance', label: 'Balance you are aiming to retire on', unit: 'AUD', min: 0, max: 50000000 }
    ]
  },

  gate: {
    label: 'Put your number down first',
    prompt: 'Work this out against your own figures and write the number before you read on. A guess you commit to is worth more than an answer you agree with.',
    placeholder: 'Your number, and the arithmetic that got you there',
    cta: 'Commit and read on',
    curtain: 'The figure below stays covered until you have written your own.',
    minChars: 6,
    journalLabel: 'What I computed',
    statLabel: 'Computed'
  },

  copy: {
    labelIdea: 'The idea',
    labelEvidence: 'What is behind it',
    labelWhy: 'Why it holds',
    labelFailure: 'What it costs to get wrong',
    labelExperiment: 'Run this against your own numbers',
    labelReflect: 'Log it',
    sourcePrefix: 'After',
    staleNote: 'not re-checked since',
    reflectPlaceholder: 'The number you got, and whether it changed what you will do.',
    tabCheatsheet: 'Cheatsheet',
    cheatNote: 'The numbers that are settled because somebody legislated them, each true as at the date beside it, plus the one finding here that has actually been replicated.',
    cheatWithheld: 'rest on a single study, are real but sold past their effect size, or are contested - worth reading, and not worth carrying in your head as fact.',
    progressNote: 'Entries logged measures reading. The gap between your number and the real one measures whether any of it reached your arithmetic. Watch the second one.'
  },

  /* A weighbridge docket. Carbonless duplicate stock, which is warm and faintly
     green rather than white; brass for structure because the instrument is
     brass; oxide for anything that costs money if you get it wrong. */
  palette: {
    faceDisplay: 'Optima, Candara, "Gill Sans", "Gill Sans MT", "Trebuchet MS", sans-serif',
    light: {
      paper: '#EFEEE6', paperRaised: '#FBFAF5', paperSunk: '#E3E1D5',
      gridTint: '#2A2718', rule: '#D8D5C6', ruleStrong: '#B3AF9B',
      ink: '#1B1A14', inkMuted: '#5A5647', inkFaint: '#8B8674',
      accent: '#7A5C1E', accentInk: '#5E4715', action: '#8C3A1C',
      solid: '#3F6B45', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#12120D', paperRaised: '#1A1913', paperSunk: '#0C0C08',
      gridTint: '#C8C0A0', rule: '#282618', ruleStrong: '#403D2C',
      ink: '#E2DFD0', inkMuted: '#9C9682', inkFaint: '#6E6957',
      accent: '#C9A44E', accentInk: '#DCBC72', action: '#D97A55',
      solid: '#6FAE79', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an entry on personal finance and want to apply it to my own position. I am in Australia.',
    closing: 'Attack the arithmetic rather than agreeing with it. Name the assumption that would have to hold, tell me what would falsify it, and flag anything that depends on a threshold that may have moved. Be concrete and brief.'
  }
};

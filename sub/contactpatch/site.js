/* Contact Patch - what four hands of rubber can actually do.
 *
 * Two halves that argue with each other. The physics half is settled and
 * mostly ignored; the epidemiology half is settled and mostly unwelcome,
 * because its central finding is that teaching people the physics does not
 * make them safer. Both are in here on purpose. A site that carried only the
 * first would be a track-day blog, and a site that carried only the second
 * would have nothing to practise.
 *
 * The recall deck is deleted, for the same reason it is deleted in Maillard
 * and more so. Knowing that lateral force peaks near seven degrees of slip is
 * trivia at a desk; the only place it exists is a corner you are already in.
 * So the second tab is a dated record of what happened last time you drove,
 * and that is the only review a procedural skill responds to.
 *
 * requireInterval is off, and the split is down the middle of the corpus.
 * Crash epidemiology reports odds ratios with bounds as a matter of course and
 * those entries carry them. Vehicle dynamics reports measured curves, not
 * confidence intervals, and demanding one would buy invented numbers rather
 * than rigour. That is the same call Tare made, for a different reason. */
window.SITE = {
  key: 'contactpatch.v1',
  slug: 'contactpatch',
  name: 'Contact Patch',
  eyebrow: 'Setup sheet',
  tagline: 'what four hands of rubber can actually do',

  /* A track exists once there is checked material for it. Seven more are
     planned - load transfer, vision and scanning, braking, line and rotation,
     low grip, and what the electronics actually do - and none of them are
     declared here, because build.js refuses a track with no entries and an
     empty track is a promise the corpus has not kept. */
  tracks: [
    { id: 'grip', name: 'The contact patch' },
    { id: 'risk', name: 'What the crash data says' }
  ],

  /* Everyday is what applies on the drive you are doing anyway. At the limit
     is what only matters when the tyres are near what they can do, which on a
     public road should be almost never. The split is deliberate: it lets the
     library separate the things worth practising in traffic from the things
     that need a circuit or an empty surface. */
  levels: { everyday: 'Everyday', limit: 'At the limit' },

  review: 'none',

  evidenceGate: true,
  requireInterval: false,

  /* Craft is excluded from the cheatsheet, and that exclusion is the whole
     editorial claim. Driving instruction is mostly craft presented as fact,
     and a page built to be read at speed is exactly where that laundering
     would happen. Statute is declared because the road-rule and design-rule
     entries belong there; none have landed yet, and the build will demand a
     cheat line from the first one that does. */
  cheatsheet: { verdicts: ['replicated', 'statute'] },

  copy: {
    labelIdea: 'The idea',
    labelEvidence: 'What is behind it',
    labelWhy: 'Why it holds',
    labelFailure: 'What it costs to get wrong',
    labelExperiment: 'Try this',
    labelReflect: 'Log it',
    sourcePrefix: 'After',
    tabCheatsheet: 'Cheatsheet',
    cheatNote: 'The claims settled enough to act on without reading the entry behind them. Craft is deliberately absent: a coaching heuristic that has never been measured does not belong on a page built to be read at speed.',
    cheatWithheld: 'rest on one study, are contested, are real but sold past their effect size, or are craft with no trial behind them - worth reading once, and not worth carrying as fact.',
    tabAttempts: 'Drive log',
    gaugeRetained: 'Drives logged',
    reflectPlaceholder: 'What you noticed, on which road, and whether it changed an input.',
    attemptsNote: 'Entries you have taken out and driven. Write down the road, the conditions and what actually happened - for a procedural skill that is the only review worth doing, and it is the one that catches you kidding yourself.',
    attemptPlaceholder: 'Where you drove this, and what the car actually did.',
    progressNote: 'Drives logged is the number, because none of this exists at a desk. An entry you have read and never driven has taught you nothing you can use.'
  },

  /* An instrument binnacle at night and a tyre data sheet by day. Deep green
     for structure because that is the colour of every workshop this material
     comes out of; the action colour is a warning lamp, and it is the only
     warm thing on the page. */
  palette: {
    faceDisplay: 'Futura, "Avenir Next Condensed", Avenir, "Trebuchet MS", sans-serif',
    light: {
      paper: '#F2F3F1', paperRaised: '#FBFCFA', paperSunk: '#E5E7E3',
      gridTint: '#1C2320', rule: '#D5D8D3', ruleStrong: '#AAAFA9',
      ink: '#171A18', inkMuted: '#545A54', inkFaint: '#878D86',
      accent: '#2E5E4E', accentInk: '#23483C', action: '#B5401C',
      solid: '#3F6B45', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0E1211', paperRaised: '#161B19', paperSunk: '#090C0B',
      gridTint: '#A8C0B4', rule: '#202826', ruleStrong: '#36403C',
      ink: '#DFE5E1', inkMuted: '#97A099', inkFaint: '#6B736D',
      accent: '#6FB394', accentInk: '#8ECBAF', action: '#E07A52',
      solid: '#6FAE79', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an entry on driving technique and want to apply it to a car and a road I actually drive. I am in Australia.',
    closing: 'Give me the mechanism and what I could observe, not a coaching slogan. If the claim is craft rather than measured, say so. Do not propose anything that involves exploring a limit on a public road - if it needs an empty surface or a circuit, say that instead.'
  }
};

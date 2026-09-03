/* Standing Order - the wealth that comes from what you install.
 *
 * This site is built against its own strongest finding. The best-established
 * result in the personal finance literature is that financial education barely
 * changes financial behaviour: Fernandes, Lynch and Netemeyer meta-analysed
 * 168 papers and recovered about a tenth of one percent of variance in
 * downstream behaviour, decaying to nothing inside twenty months. Meanwhile
 * the interventions with the largest and most replicated effects require no
 * knowledge at all. They move a default.
 *
 * So a site that teaches you things is the wrong shape, and the corpus is
 * organised around installs rather than insights. Every entry terminates in an
 * instruction you set up once and then forget about, and the gate makes you
 * write that instruction before the entry opens. Reading this is not the
 * mechanism. The standing order is.
 *
 * requireInterval is off, for the same reason it is off in Tare and Andon. The
 * strongest evidence here is natural experiments and administrative data -
 * Danish tax records, Swedish lottery registers, 401(k) plan switchovers - and
 * those report a point estimate against an enormous n rather than a quoted
 * interval. Demanding both bounds would buy invented numbers rather than
 * rigour. Where a source does report an interval, the entry carries it.
 *
 * The cheatsheet filters to replicated and statute, which in this field is a
 * short list. That shortness is the editorial claim, not a gap: most of what
 * gets said confidently about building wealth rests on one study, on one
 * country's best century, or on nothing at all. The page states how many
 * entries it withheld rather than implying the list is the corpus.
 */
window.SITE = {
  key: 'standingorder.v1',
  slug: 'standingorder',
  name: 'Standing Order',
  eyebrow: 'Instruction',
  tagline: 'the wealth that comes from what you install',

  /* Ordered so the first cycle runs from the mechanism that works without you
     through to the part no instruction can carry. A track exists once there is
     checked material for it, and build.js refuses an empty one. */
  tracks: [
    { id: 'defaults', name: 'Defaults and automation' },
    { id: 'rate', name: 'The savings rate arithmetic' },
    { id: 'commitment', name: 'Commitment and friction' },
    { id: 'costs', name: 'What you control and what you forecast' },
    { id: 'income', name: 'Earnings and human capital' },
    { id: 'shocks', name: 'Shocks, windfalls and ruin' },
    { id: 'structure', name: 'Where the money sits' },
    { id: 'evidence', name: 'What this field does not know' },
    { id: 'install', name: 'Building the thing that survives you' }
  ],

  /* An escalation in how much of you the thing needs, which is the only
     dimension that matters once you accept that attention is the scarce
     input. Standing runs without you. Annual wants one afternoon a year.
     Judgement cannot be delegated to an instruction at all. */
  levels: { standing: 'Standing', annual: 'Annual', judgement: 'Judgement' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  evidenceGate: true,
  requireInterval: false,
  reverifyDays: 180,

  cheatsheet: { verdicts: ['replicated', 'statute'] },

  /* Predict your own adherence, then get scored on it. This is the only
     mechanic here that cannot be argued with. A site about habits whose
     readers never install anything would otherwise feel productive for
     months, and the Brier score is what makes that visible: forecast that the
     transfer will still be running in ninety days, resolve it honestly, and
     watch whether your estimate of your own follow-through is any good. */
  forecastBook: true,

  /* Not the arithmetic gate that Tare uses. You cannot compute a standing
     order, and the thing that transfers here is having written the actual
     instruction - the amount, the date, the account, the trigger - before you
     are allowed to read what the evidence says about it. */
  extraRequired: ['gateIntro', 'worked'],

  gate: {
    label: 'Write the instruction first',
    prompt: 'Write the instruction you would actually set up: the amount, the day it runs, the account it leaves and the account it lands in. A worse instruction you install beats a better one you read about.',
    placeholder: 'The instruction, in the words you would use to set it up',
    cta: 'Commit and read on',
    curtain: 'The entry below stays covered until you have written an instruction of your own.',
    minChars: 20,
    journalLabel: 'What I set up',
    statLabel: 'Instructions written'
  },

  copy: {
    labelIdea: 'The idea',
    labelEvidence: 'What is behind it',
    labelWhy: 'Why it holds',
    labelFailure: 'What it costs to get wrong',
    labelWorked: 'The instruction, written out',
    labelExperiment: 'Install it today',
    labelForecast: 'Forecast your own follow-through',
    labelReflect: 'Log it',
    labelDeepDive: 'Take it further',
    sourcePrefix: 'After',
    staleNote: 'not re-checked since',
    tabCheatsheet: 'Cheatsheet',
    tabForecast: 'Forecasts',
    cheatNote: 'The instructions worth carrying in your head, because they either rest on a finding that has actually been replicated or on a number somebody legislated. Each statute row is true as at the date beside it.',
    cheatWithheld: 'rest on a single study, are real but sold far past their effect size, are contested, or have no trial behind them at all. Worth reading. Not worth repeating as fact.',
    reflectPlaceholder: 'What you actually set up, and what you had to change to make it run.',
    forecastNote: 'A probability you wrote down about your own behaviour before you knew. Brier is mean squared error against the outcome, so lower is better and always saying fifty percent scores exactly 0.25. If your score is worse than that on your own follow-through, the instructions are not the problem.',
    progressNote: 'Entries logged measures reading, which this site has just told you is worth about a tenth of one percent. Instructions written measures installs. The Brier score measures whether you know yourself. Watch the second two.'
  },

  /* A bank mandate. Cool security-paper stock, mandate-ink blue for structure,
     and a stamped red for anything that costs money if you get it wrong. Slab
     for the display face, because the form it is imitating was set in one. */
  palette: {
    faceDisplay: 'Rockwell, "Rockwell Nova", "Roboto Slab", "Bookman Old Style", Georgia, serif',
    light: {
      paper: '#F1F3F7', paperRaised: '#FBFCFE', paperSunk: '#E4E8EF',
      gridTint: '#16233A', rule: '#D3DAE5', ruleStrong: '#A9B4C6',
      ink: '#111826', inkMuted: '#4C5768', inkFaint: '#828C9E',
      accent: '#28527A', accentInk: '#1B3D5E', action: '#A83E2B',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0C1016', paperRaised: '#131923', paperSunk: '#070A0F',
      gridTint: '#8FAAD0', rule: '#1D2431', ruleStrong: '#313B4C',
      ink: '#D9DEE8', inkMuted: '#94A0B2', inkFaint: '#687385',
      accent: '#6E9CC8', accentInk: '#96BCE0', action: '#D8785C',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an entry on building wealth through things I install rather than things I know, and I want to set one up against my own position. I am in Australia.',
    closing: 'Attack the instruction rather than agreeing with it. Name the way it fails when I stop paying attention, tell me what would make me switch it off in month three, and flag anything that depends on a threshold or a rate that may have moved. Be concrete and brief.'
  }
};

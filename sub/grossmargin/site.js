/* Gross Margin - the architecture decisions a CFO later reports.
 *
 * The rule that keeps this honest is in the corpus, not the engine: every
 * entry cites a filing, a paper, or a benchmark with a stated n. The failure
 * mode for this subject is 150 days of confident heuristics with nothing
 * behind them, and it fails invisibly because the prose reads authoritative. */
window.SITE = {
  key: 'grossmargin.v1',
  slug: 'grossmargin',
  name: 'Gross Margin',
  eyebrow: 'Ledger',
  tagline: 'the architecture decisions a CFO later reports',

  tracks: [
    { id: 'pnl', name: 'Reading a P and L' },
    { id: 'cogs', name: 'Cloud COGS' },
    { id: 'architecture', name: 'Architecture as a cost decision' },
    { id: 'metrics', name: 'SaaS metrics with an n' },
    { id: 'pricing', name: 'Pricing and packaging' },
    { id: 'filings', name: 'Reading a filing' },
    { id: 'capital', name: 'Capital allocation' },
    { id: 'valuation', name: 'What investors actually price' },
    { id: 'compliance', name: 'Compliance as cost and gate' }
  ],

  levels: { read: 'Read it', model: 'Model it', decide: 'Decide with it' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  copy: {
    labelIdea: 'The idea',
    labelWhy: 'How the number actually works',
    labelFailure: 'What engineers get wrong about it',
    labelExperiment: 'Compute this today',
    labelReflect: 'Log it',
    sourcePrefix: 'Source:',
    reflectPlaceholder: 'The number you got for your own system, and what surprised you.',
    reviewNote: 'Say the number and its unit out loud. A metric you cannot state the denominator of is not a metric you know.',
    progressNote: 'Every entry here cites a filing, a paper, or a benchmark with a stated n. If one does not, it is a bug, not a shortcut.'
  },

  /* Ledger stock. Cream paper, ledger green for structure, red ink for
     anything that asks you to act, and a broadsheet serif for the display. */
  palette: {
    faceDisplay: '"Hoefler Text", Baskerville, Georgia, "Times New Roman", serif',
    light: {
      paper: '#F9F7F0', paperRaised: '#FFFFFF', paperSunk: '#EFEBE0',
      gridTint: '#1E3226', rule: '#DFD9C9', ruleStrong: '#B6AE9A',
      ink: '#1B1A14', inkMuted: '#575344', inkFaint: '#8D8877',
      accent: '#1F5136', accentInk: '#17402A', action: '#9E2B2B',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#12130E', paperRaised: '#191A14', paperSunk: '#0C0D09',
      gridTint: '#C8D2AA', rule: '#262820', ruleStrong: '#3D4034',
      ink: '#E4E2D5', inkMuted: '#A29E8D', inkFaint: '#726F61',
      accent: '#6FB58F', accentInk: '#95CDAE', action: '#D96C6C',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an entry on infrastructure unit economics and want to apply it to my own service.',
    closing: 'Show the arithmetic rather than the conclusion. Where you need a number I have not given you, tell me exactly which one and where to find it, and do not fill it in with a plausible guess.'
  }
};

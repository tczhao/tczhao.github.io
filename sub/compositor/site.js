/* Compositor - sentence and paragraph craft, drilled on his own drafts.
 *
 * The gate is the whole design. Every other site here teaches a body of
 * knowledge; this one teaches a skill whose target he generates himself every
 * day, and it only works if the paragraph under the knife is genuinely his.
 * The fallback paragraph exists so a day he wrote nothing is still playable,
 * and five fallback days in a row is the signal to stop. */
window.SITE = {
  key: 'compositor.v1',
  slug: 'compositor',
  name: 'Compositor',
  eyebrow: 'Workbook',
  tagline: 'sentence craft, drilled on your own drafts',

  tracks: [
    { id: 'characters', name: 'Characters and actions' },
    { id: 'cohesion', name: 'Cohesion and coherence' },
    { id: 'concision', name: 'Concision' },
    { id: 'architecture', name: 'Sentence architecture' },
    { id: 'argument', name: 'Shape of an argument' },
    { id: 'register', name: 'Register and audience' },
    { id: 'revision', name: 'Revision, and editing others' },
    { id: 'evidential', name: 'Technical and evidential prose' },
    { id: 'usage', name: 'Usage, myths and the evidence' }
  ],

  levels: { sentence: 'Sentence', paragraph: 'Paragraph', document: 'Document' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  gate: {
    label: 'Bring a paragraph',
    prompt: 'Paste a paragraph you wrote, then apply today\'s move to it before you read the worked example.',
    placeholder: 'Your paragraph, then your edit of it.',
    cta: 'Commit the edit and read on',
    curtain: 'The worked example opens once you have pasted something of yours and edited it.',
    note: 'Frozen the moment you commit. Reading the answer first is the one way to learn nothing here.',
    fallbackLabel: 'Nothing of your own to hand',
    tooShort: 'Paste a real paragraph and edit it - that is the whole mechanism',
    journalLabel: 'Your edit, before the example',
    statLabel: 'Edits committed',
    minChars: 80
  },

  /* The gate promises a worked example three times over, so the build refuses
     an entry that does not carry one. For a long while none of them did, and
     nothing failed: the reader just committed an edit and never saw the answer.
     A promise the corpus cannot keep has to break the build, not the trust. */
  extraRequired: ['fallback', 'gatePrompt', 'worked'],

  copy: {
    labelIdea: 'The move',
    labelWhy: 'Why it works on a reader',
    labelFailure: 'What it looks like when it is missing',
    /* Verbatim the phrase the gate promises three times over. If the label and
       the promise drift apart, the reader has to work out that this is the
       thing they were told was coming. */
    labelWorked: 'The worked example',
    labelExperiment: 'Run it on your own prose',
    labelReflect: 'Log the edit',
    labelDeepDive: 'Take it further',
    sourcePrefix: 'After',
    completeCta: 'Log this entry',
    reflectPlaceholder: 'What the edit changed, and what you could not fix.',
    gaugeRetained: 'Solid',
    reviewNote: 'Say the move out loud before you turn the card. Naming it is the difference between taste and craft.',
    progressNote: 'The number that matters is not the streak. It is whether your edit note on someone else\'s draft names the move rather than the symptom.'
  },

  /* Letterpress. Warm ivory stock, indigo for structure, and the action
     colour is a proofreader's red because that is literally what it marks. */
  palette: {
    faceDisplay: 'Baskerville, "Baskerville Old Face", "Hoefler Text", Georgia, serif',
    light: {
      paper: '#F7F4ED', paperRaised: '#FFFDF8', paperSunk: '#EEEAE0',
      gridTint: '#282014', rule: '#DFD8C9', ruleStrong: '#B9AF9C',
      ink: '#1E1A14', inkMuted: '#5C5546', inkFaint: '#938A78',
      accent: '#2E3A6B', accentInk: '#253059', action: '#A3302A',
      solid: '#35664A', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#14120E', paperRaised: '#1C1915', paperSunk: '#0E0C09',
      gridTint: '#D6C8AC', rule: '#2A251E', ruleStrong: '#443C31',
      ink: '#E6DFD2', inkMuted: '#A79E8C', inkFaint: '#766E5F',
      accent: '#8B9BD4', accentInk: '#AEBBE4', action: '#D97A6C',
      solid: '#6FB58F', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through a prose craft entry and want to apply it to writing I actually have to do.',
    closing: 'Do not rewrite it for me. Name what is wrong using the vocabulary of the move above, show me one sentence fixed as a demonstration, and let me do the rest.'
  }
};

/* Cascade - a failure-mechanism case library.
 *
 * The gate is mandatory rather than encouraged, and the reason is that these
 * cases are entertaining. Without a forced call before the reveal this decays
 * into a war-story feed inside three weeks, which is pleasant and teaches
 * recognition of nothing. */
window.SITE = {
  key: 'cascade.v1',
  slug: 'cascade',
  name: 'Cascade',
  eyebrow: 'Case book',
  tagline: 'what failed, what amplified it, what made recovery slow',

  tracks: [
    { id: 'retry', name: 'Retry and amplification' },
    { id: 'saturation', name: 'Saturation and queueing' },
    { id: 'metastable', name: 'Metastable failure' },
    { id: 'config', name: 'Configuration and deploy' },
    { id: 'data', name: 'Data, schema and migration' },
    { id: 'time', name: 'Time, clocks and expiry' },
    { id: 'dependency', name: 'Dependency and control plane' },
    { id: 'recovery', name: 'Recovery and its cost' },
    { id: 'human', name: 'Detection and human factors' }
  ],

  levels: { mechanism: 'Mechanism', amplifier: 'Amplifier', recovery: 'Recovery' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  gate: {
    label: 'Call it before you read it',
    prompt: 'What fired, what amplified it, and what made recovery slow? Commit an answer before the write-up opens.',
    placeholder: 'Fired: ...\nAmplified by: ...\nRecovery was slow because: ...',
    cta: 'Commit the call and read the write-up',
    curtain: 'The write-up opens once you have committed a call.',
    note: 'Frozen on commit. In six months the value of this page is the record of the calls you got wrong.',
    tooShort: 'Name a mechanism first, even a wrong one - a guess you have to defend is the whole exercise',
    journalLabel: 'Your call, before the write-up',
    statLabel: 'Calls committed',
    minChars: 30
  },

  extraRequired: ['gateIntro'],

  copy: {
    labelIdea: 'The mechanism',
    labelWhy: 'Why it propagates',
    labelFailure: 'What made it worse',
    labelExperiment: 'Find this shape in your own system',
    labelReflect: 'Log it',
    sourcePrefix: 'Case:',
    reflectPlaceholder: 'Where this shape already exists in what you run.',
    reviewNote: 'Name the mechanism out loud before you turn the card. Speed of recognition is the skill; derivation at 2am is too slow.',
    progressNote: 'Cases read is not the number. The number is whether your call before the reveal is landing on the mechanism rather than the symptom.'
  },

  /* Console grey with a steel structural colour and an amber for anything
     that asks you to act. Amber rather than red on purpose: red is what the
     graphs in these cases were already showing. */
  palette: {
    faceDisplay: '"Helvetica Neue", Inter, "Segoe UI", Arial, sans-serif',
    light: {
      paper: '#F1F2F4', paperRaised: '#FFFFFF', paperSunk: '#E4E7EA',
      gridTint: '#12161E', rule: '#D6DADF', ruleStrong: '#AEB5BD',
      ink: '#12161C', inkMuted: '#4E5660', inkFaint: '#858D97',
      accent: '#3B5A73', accentInk: '#2E4A61', action: '#A85E00',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0C0F13', paperRaised: '#12171D', paperSunk: '#070A0D',
      gridTint: '#A0B9D2', rule: '#1E252D', ruleStrong: '#313C47',
      ink: '#D9E0E7', inkMuted: '#939DA8', inkFaint: '#656E78',
      accent: '#7FA9C9', accentInk: '#A5C6DE', action: '#E09B45',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through an incident case and want to find the same failure shape in a system I actually run.',
    closing: 'Do not reassure me. Tell me where this shape is most likely already present in a multi-tenant Kubernetes and Temporal estate, and what single measurement would confirm or rule it out.'
  }
};

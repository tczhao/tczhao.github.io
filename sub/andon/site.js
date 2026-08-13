/* Andon - saying the unwelcome thing, in the room, in time.
 *
 * Named after the cord on a Toyota line that any worker can pull to stop
 * production, because that is the argument: what changes whether people speak
 * is the mechanism, not the nerve. A culture that asks for courage is asking
 * the least powerful person in the room to supply the thing the organisation
 * failed to build.
 *
 * The gate is the entire design. Every other site here gates on a judgement -
 * name the mechanism, put your number down. This one gates on a sentence,
 * because the failure mode of this material is uniquely specific: people read
 * about candour, agree with all of it, and then say nothing. Agreement is free.
 * Composing the words you would use, in advance, to a named person, is the only
 * part that survives contact with the meeting. If the gate asked what you would
 * raise rather than what you would say, this site would teach nothing.
 *
 * The evidence gate is on, and it earns its place here more than anywhere else
 * in this family. No subject is more heavily colonised by social psychology
 * that did not survive: Asch is quoted as proof that people cave when it shows
 * the opposite about two thirds of the time, the thirty-eight silent witnesses
 * to the Genovese murder were largely a newspaper's invention, and groupthink
 * is a vocabulary rather than a finding. A site that teaches you to challenge
 * a confident claim cannot itself run on folklore.
 *
 * Most verdicts here are `craft`, and that is the honest answer rather than an
 * embarrassment. The two-challenge rule was written by aviation and adopted by
 * medicine because it works in the room, not because anyone randomised it.
 * Saying so is more useful than dressing it in a citation.
 *
 * requireInterval is off. The organisational behaviour literature this draws on
 * reports regression coefficients over survey scales, and the aviation and
 * production material has no trial behind it at all. Demanding an interval
 * would buy invented numbers rather than rigour.
 */
window.SITE = {
  key: 'andon.v1',
  slug: 'andon',
  name: 'Andon',
  eyebrow: 'Pull log',
  tagline: 'saying the unwelcome thing, in the room, in time',

  /* Ordered as the act itself runs: you notice, you shape it, you say it, you
     say it to someone with power, you use the room, you put it in writing, you
     escalate when it bounces. The last two tracks are the ones people skip -
     how you take it, and what you do the morning after. */
  tracks: [
    { id: 'noticing', name: 'Noticing the disagreement' },
    { id: 'framing', name: 'Framing the objection' },
    { id: 'sentence', name: 'The sentence itself' },
    { id: 'upward', name: 'Disagreeing upward' },
    { id: 'room', name: 'Working the room' },
    { id: 'written', name: 'Dissent in writing' },
    { id: 'escalation', name: 'When it does not land' },
    { id: 'receiving', name: 'Being disagreed with' },
    { id: 'after', name: 'After you have said it' }
  ],

  /* Graded by what it costs you rather than by seniority. Seniority is the
     wrong axis: a staff engineer contradicting a VP in front of the board is
     doing something a VP contradicting a peer is not. */
  levels: { everyday: 'Everyday', costly: 'Costly', line: 'On the line' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  evidenceGate: true,
  requireInterval: false,

  /* Opt-in rather than verdict-filtered. A verdict filter would be the wrong
     instrument here: the rows worth carrying are sentences, and the sentences
     are craft, so filtering on `replicated` would produce a near-empty page
     that implied the useful material was the thin research rather than the
     thick practice. An entry earns a row when it gives you words. */
  cheatsheet: true,

  extraRequired: ['gateIntro', 'worked'],

  gate: {
    label: 'Draft the sentence before you read',
    prompt: 'Write what you would actually say out loud, to that person, in that room. Not the point you would make. The words.',
    placeholder: 'The exact wording. First sentence is enough.',
    cta: 'Commit the sentence and read on',
    curtain: 'The entry opens once you have written a sentence of your own.',
    note: 'Frozen on commit. In six months the value of this page is the record of what you were and were not willing to say.',
    tooShort: 'A sentence, not a topic. Wording you would have to stand behind is the whole exercise.',
    fallbackLabel: 'Stuck? A frame to start from',
    journalLabel: 'What I would have said',
    statLabel: 'Sentences drafted',
    minChars: 25
  },

  copy: {
    labelIdea: 'The move',
    labelEvidence: 'What is behind it',
    labelWhy: 'Why it works',
    labelFailure: 'How it goes wrong',
    labelWorked: 'The wording',
    labelExperiment: 'Use it this week',
    labelReflect: 'Log it',
    sourcePrefix: 'After',
    tabCheatsheet: 'Lines',
    cheatNote: 'The sentences worth having ready, because in the moment you need one you will not be composing prose.',
    cheatWithheld: 'explain why something works rather than handing you words for it - read once, not reached for mid-meeting.',
    reflectPlaceholder: 'What you said, who to, and what happened next.',
    reviewNote: 'Answer out loud, in the words you would use. Recognising the move is not the skill. Producing the sentence with your pulse up is.',
    progressNote: 'Entries logged measures reading, and reading this material is the easy half. The number that matters is in your journal: how many of those drafted sentences you went on to actually say.'
  },

  /* An andon board: green while the line runs, amber when somebody has called
     for help, red when it is stopped. Those three states are already tokens in
     the engine, so the palette is the board. Structure is the dark teal of
     machine enamel, on the grey card stock a kanban is printed on. */
  palette: {
    faceDisplay: 'Futura, "Century Gothic", "URW Gothic", "Trebuchet MS", sans-serif',
    light: {
      paper: '#F0EFEA', paperRaised: '#FBFAF7', paperSunk: '#E2E0D8',
      gridTint: '#22252A', rule: '#D5D2C8', ruleStrong: '#ADA99D',
      ink: '#191B1E', inkMuted: '#555A60', inkFaint: '#8B8F97',
      accent: '#2F5D62', accentInk: '#254A4E', action: '#B03A2E',
      solid: '#3F7A4F', shaky: '#B07A18'
    },
    dark: {
      paper: '#0E1012', paperRaised: '#15181B', paperSunk: '#090B0D',
      gridTint: '#9FB4B8', rule: '#20252A', ruleStrong: '#343B42',
      ink: '#DDE2E4', inkMuted: '#97A0A6', inkFaint: '#69717A',
      accent: '#6FA8AD', accentInk: '#95C6CA', action: '#E0705C',
      solid: '#6FB585', shaky: '#D8A94A'
    }
  },

  prompt: {
    intro: 'I am working through an entry on voicing disagreement at work and want to apply it to a specific conversation I actually have to have.',
    closing: 'Do not reassure me and do not soften the wording. Give me the sentence, then tell me the most likely way this person deflects it and what I say next.'
  }
};

/* Parallax - what you sent and what they received.
 *
 * Named after the apparent shift of an object against its background when the
 * observer moves, because that is the whole claim: the message you sent and the
 * message they received are two different objects, and the difference is not
 * noise. It is geometry. You are standing somewhere else, holding context they
 * do not have, and the gap opens whether or not you were careless.
 *
 * The seam with its two nearest siblings is deliberate and worth stating.
 * Compositor works on how a sentence reads and drills on paragraphs you wrote.
 * Andon works on whether you say the unwelcome thing at all. This one starts
 * after both: the thing is worth saying, the prose is fine, and the reader
 * still took away something you did not send. The unit here is a whole message
 * and the axis is the reader's position rather than the prose.
 *
 * The gate is predict-the-misread rather than rewrite-it, and that choice is
 * the site. A rewrite gate teaches the fix for the entry in front of you. The
 * misread is the part that generalises, because in six months you will not
 * remember the moves and you will still have to look at your own draft from the
 * other chair. Getting the misreading down in writing, before the rewrite
 * opens, is the only version of that skill you can practise alone.
 *
 * The evidence gate is on. This subject is more heavily colonised by confident
 * folklore than almost any other - the seven per cent figure, the myth that
 * tone survives text, the tapping study quoted as a measurement when it is one
 * unpublished dissertation - so a site about being misread cannot itself run on
 * claims nobody checked. Most verdicts will be `craft`, and that is the honest
 * answer rather than an embarrassment.
 *
 * requireInterval is off. What research exists here reports effects over survey
 * scales and small lab tasks, and the ordering claims that make up most of the
 * corpus have never been isolated by anyone. Demanding an interval would buy
 * invented numbers rather than rigour.
 */
window.SITE = {
  key: 'parallax.v1',
  slug: 'parallax',
  name: 'Parallax',
  eyebrow: 'Send log',
  tagline: 'what you sent and what they received',

  /* Ordered as drafting runs: you work out what is actually being asked, you
     decide what goes first, you settle what the message says about the reader,
     you draw the boundary, you land it on the specific case. Then the three
     that get skipped - what it will read as, who is reading it, and what you
     owe afterwards.

     Planned: question, order, standing, boundary, specific, reads, distance,
     commitment, after. Only the populated ones are declared, because the build
     refuses a track with no entries and a declared empty track would ship as a
     hole in the sequence. */
  tracks: [
    { id: 'question', name: 'The live question' },
    { id: 'order', name: 'Where the answer goes' },
    { id: 'standing', name: 'Standing' },
    { id: 'boundary', name: 'The boundary' },
    { id: 'specific', name: 'This case, not the policy' },
    { id: 'reads', name: 'What it will read as' },
    { id: 'distance', name: 'Distance' },
    { id: 'commitment', name: 'The commitment' },
    { id: 'after', name: 'After it lands' }
  ],

  /* Graded by how far the message travels and how hard it is to take back. A
     reply reaches one person who can ask you what you meant. A broadcast
     reaches people who cannot. Something on the record is read later, by people
     who were not there, with none of the context that made it sound reasonable
     at the time. */
  levels: { reply: 'Reply', broadcast: 'Broadcast', record: 'On the record' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  evidenceGate: true,
  requireInterval: false,

  /* Opt-in rather than verdict-filtered. Almost everything here is craft, so a
     verdict filter would return a near-empty page implying the thin research
     was the useful part. An entry earns a row when the line hands you something
     to do to a draft. The entries that only explain why a gap opens are worth
     reading once and are not worth reaching for mid-message. */
  cheatsheet: true,

  extraRequired: ['gateIntro', 'gatePrompt', 'worked'],

  gate: {
    label: 'Predict the misread',
    prompt: 'Write what this person takes away from the draft above. Not what it says. What they believe about the work, about you, and about their own standing once they have read it.',
    placeholder: 'What they will think you meant.',
    cta: 'Commit the misread and read on',
    curtain: 'The rewrite opens once you have written what they will take away.',
    note: 'Frozen on commit. In six months the value of this page is the record of how often you could see your own draft from the other chair before somebody told you.',
    tooShort: 'A reading, not a verdict. Write the sentence they would say to a colleague afterwards.',
    journalLabel: 'What I predicted they would hear',
    statLabel: 'Misreads predicted',
    minChars: 40
  },

  copy: {
    labelIdea: 'The move',
    labelEvidence: 'What is behind it',
    labelWhy: 'Why the gap opens',
    labelFailure: 'How it goes wrong',
    labelWorked: 'The rewrite',
    labelExperiment: 'Try it this week',
    labelReflect: 'Log it',
    labelDeepDive: 'Take it further',
    sourcePrefix: 'After',
    completeCta: 'Log this entry',
    tabCheatsheet: 'Moves',
    cheatNote: 'The moves that survive being reduced to one line: something to do to a draft, not something to understand about readers.',
    cheatWithheld: 'explain why a gap opens rather than handing you something to do about it mid-draft - worth reading once, not worth reaching for with the message half-written.',
    reflectPlaceholder: 'What you sent, what came back, and whether the reply told you it landed.',
    reviewNote: 'Answer before you turn the card, and answer with the move rather than the principle. Knowing readers drift is not the skill. Catching your own draft doing it is.',
    progressNote: 'Entries logged measures reading. The number that matters is not here: it is whether the replies you get back now answer the message you meant to send.'
  },

  /* A surveyor's sheet. Two sightlines from two positions and the baseline
     between them is the entire idea of the site, so the palette is the
     instrument: chart paper, the deep blue of a theodolite scale, and the
     vermilion of a range pole, which is the one colour on a survey site chosen
     to be impossible to misread at distance. */
  palette: {
    faceDisplay: '"Avenir Next", Avenir, "Segoe UI", Inter, sans-serif',
    light: {
      paper: '#F3F1EB', paperRaised: '#FBFAF6', paperSunk: '#E5E2D9',
      gridTint: '#1C2B45', rule: '#D7D2C5', ruleStrong: '#ADA695',
      ink: '#171D28', inkMuted: '#525A68', inkFaint: '#8A9099',
      accent: '#2C4A7C', accentInk: '#20395F', action: '#C0562A',
      solid: '#3D7A54', shaky: '#B0821C'
    },
    dark: {
      paper: '#0C1017', paperRaised: '#131924', paperSunk: '#080B10',
      gridTint: '#93A9C9', rule: '#1E2634', ruleStrong: '#333D4E',
      ink: '#DCE2EA', inkMuted: '#96A0AE', inkFaint: '#68727F',
      accent: '#7BA3DC', accentInk: '#A2C1EC', action: '#E5825A',
      solid: '#6FB585', shaky: '#D8A94A'
    }
  },

  prompt: {
    intro: 'I am working through an entry on how a message gets read differently from how it was meant, and I want to apply it to something I actually have to send.',
    closing: 'Do not tell me the draft is fine. Tell me the most likely thing the reader takes away that I did not intend, then give me the rewrite and say what each change is buying.'
  }
};

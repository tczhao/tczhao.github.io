/* Drivetrain - how platform work reaches the business.
 *
 * The siblings already cover the parts. Gross Margin teaches the finance
 * vocabulary, Compositor the sentence, Parallax how a message lands, Practicum
 * management. None of them drills the translation itself: a ticket traced back
 * to the problem it was written for, the problem priced, the cheapest fix
 * chosen on business terms, and the result said outcome first to someone who
 * does not run the system.
 *
 * The gate carries the method. Every entry hands over a specimen from platform
 * work - a ticket, a draft update, a question from a director - and stays shut
 * until you have done the move, ideally on something of your own from this
 * week. The worked answer then shows the move done once, and what doing it
 * cost. Reading the answer first is the one way to learn nothing here.
 *
 * The profile is the other half. Leading with a number is only possible if you
 * know the numbers, and most engineers cannot state their own company's
 * contract value or customer count. Entries that declare a sum ask for the
 * figures they need at the moment they need them, so the first exercise is
 * often finding out. */
window.SITE = {
  key: 'drivetrain.v1',
  slug: 'drivetrain',
  name: 'Drivetrain',
  eyebrow: 'Workshop manual',
  tagline: 'how platform work reaches the business',

  tracks: [
    { id: 'problem', name: 'The problem behind the ticket' },
    { id: 'reach', name: 'How platform work reaches the business' },
    { id: 'numbers', name: 'Put a number on it' },
    { id: 'cheapest', name: 'The cheapest thing that works' },
    { id: 'outcome', name: 'Outcome first' },
    { id: 'channel', name: 'Pick the channel' },
    { id: 'room', name: 'Hold the room' },
    { id: 'metric', name: 'Own a metric' },
    { id: 'unassigned', name: 'Find the problem nobody assigned' }
  ],

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  /* Opt-in, as on Practicum and Compositor: an entry appears if it was written
     a cheat line, and the page states how many it leaves off. A row is earned
     by a rule, an ordering or a move you could apply on the way into a
     meeting. A lens is not a row. */
  cheatsheet: true,

  /* Figures are asked for one at a time, when an entry's sum first needs them.
     Counts carry no unit because the label already names the thing counted. */
  profile: {
    note: 'Held in this browser only, never sent anywhere, and included in your export. Use the currency your finance team reports in. A figure you do not know yet is the exercise: ask finance or sales operations, or read the last board update.',
    fields: [
      { id: 'customers', label: 'Paying customers on the platform today', min: 0, max: 10000000 },
      { id: 'acv', label: 'Average annual contract value per customer', unit: 'dollars', min: 0, max: 100000000 },
      { id: 'newPerMonth', label: 'New customers added per month, recent average', min: 0, max: 1000000 },
      { id: 'ceiling', label: 'Customers the platform can carry before something breaks, your best estimate', min: 0, max: 100000000 },
      { id: 'cloudMonthly', label: 'Monthly cloud bill for the platform you run', unit: 'dollars', min: 0, max: 1000000000 },
      { id: 'engWeek', label: 'Fully loaded cost of one engineer-week', unit: 'dollars', min: 0, max: 1000000 },
      { id: 'engineers', label: 'Engineers whose daily work runs on your platform', min: 0, max: 100000 },
      { id: 'churnPct', label: 'Customers lost per year', unit: '%', min: 0, max: 100 }
    ]
  },

  gate: {
    label: 'Do the move first',
    prompt: 'Apply today\'s move to something from your own week - a ticket, an update, a question you were asked - before you read the worked answer.',
    placeholder: 'What you started from, then your version of it.',
    cta: 'Commit and read on',
    curtain: 'The entry opens once you have committed an attempt of your own.',
    note: 'Frozen the moment you commit. The gap between your attempt and the worked answer is the lesson, and reading the answer first deletes it.',
    fallbackLabel: 'Nothing of your own to hand',
    tooShort: 'Write a real attempt - one sentence is not a translation',
    journalLabel: 'Your attempt, before the worked answer',
    statLabel: 'Attempts committed',
    minChars: 80
  },

  /* The gate promises a worked answer, so the build refuses an entry without
     one. gatePrompt and fallback cannot be required the same way: an entry
     that declares a sum uses the arithmetic gate, which shows neither. */
  extraRequired: ['worked'],

  copy: {
    labelIdea: 'The move',
    labelWhy: 'Why it works',
    labelFailure: 'What it looks like without it',
    /* Verbatim the phrase the gate promises, so the reader recognises it. */
    labelWorked: 'The worked answer',
    labelExperiment: 'Run it at work this week',
    labelReflect: 'Log it',
    labelDeepDive: 'Take it further',
    labelCompute: 'Put your number down first',
    sourcePrefix: 'After',
    reflectPlaceholder: 'What you found out, and the number you were missing.',
    tabCheatsheet: 'Cheatsheet',
    cheatNote: 'The moves that survive being cut to one line, for reading on the way into the meeting.',
    cheatWithheld: 'need a ticket or a draft in front of you to mean anything - they are drills, and a row can only hold a rule.',
    reviewNote: 'Answer out loud, in two sentences, as if a director had just asked you. Then turn the card.',
    progressNote: 'Entries logged measures reading. The real score is whether your last three updates to leadership opened with a number they already track. Go and check.'
  },

  /* A workshop manual. Cool grey service-manual stock, petrol teal for
     structure, and safety orange kept for anything that asks you to act. The
     display face is DIN, the industrial standard lettering of engineering
     drawings and road signs, with Bahnschrift as its Windows counterpart. */
  palette: {
    faceDisplay: '"DIN Alternate", "DIN Condensed", Bahnschrift, "Arial Narrow", sans-serif',
    light: {
      paper: '#EEF1F2', paperRaised: '#FAFBFB', paperSunk: '#E3E8EA',
      gridTint: '#1B2A30', rule: '#D3DBDE', ruleStrong: '#AAB7BC',
      ink: '#141C20', inkMuted: '#4E5D64', inkFaint: '#85939A',
      accent: '#0F5B66', accentInk: '#0B4750', action: '#A9481A',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0F1416', paperRaised: '#161D20', paperSunk: '#0A0E10',
      gridTint: '#9FC4CC', rule: '#223035', ruleStrong: '#364A51',
      ink: '#DDE5E8', inkMuted: '#97A7AD', inkFaint: '#6A7A80',
      accent: '#5FB3BF', accentInk: '#8ECDD6', action: '#E58A4E',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am a senior platform engineer working through an entry on turning platform work into business outcomes, and I want to apply it to my actual situation.',
    closing: 'Push back wherever my reasoning stays in the engine room. If my case is missing a number, ask me for it rather than inventing one. Be concrete and brief.'
  }
};

/* Fixture: every optional mechanic switched on at once - gate, expiry,
   forecast book, Leitner review. Deliberately small so failures are legible. */
window.SITE = {
  key: 'fixt-full.v1',
  slug: 'fixt-full',
  name: 'Fixture Full',
  eyebrow: 'Fixture',
  tagline: 'every mechanic on',
  tracks: [
    { id: 'alpha', name: 'Alpha' },
    { id: 'beta', name: 'Beta' },
    { id: 'gamma', name: 'Gamma' }
  ],
  levels: { easy: 'Easy', hard: 'Hard' },
  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],
  expiry: true,
  forecastBook: true,
  extraRequired: ['gateIntro'],
  gate: {
    label: 'Call it first',
    prompt: 'What do you think is going on here?',
    placeholder: 'Your call',
    cta: 'Commit and read on',
    curtain: 'The entry opens once you have committed an answer above.',
    minChars: 4,
    journalLabel: 'Before reading',
    statLabel: 'Committed'
  },
  copy: { labelIdea: 'The idea', labelWhy: 'Why it holds' },
  prompt: { intro: 'Fixture intro line.', closing: 'Fixture closing line.' }
};

/* Fixture: the arithmetic gate. The site holds a small profile of the reader's
   own figures, each entry declares an expression over them, and the entry stays
   shut until the reader has written their own answer to compare against. */
window.SITE = {
  key: 'fixt-comp.v1',
  slug: 'fixt-comp',
  name: 'Fixture Compute',
  eyebrow: 'Fixture',
  tagline: 'do the sum first',
  tracks: [
    { id: 'alpha', name: 'Alpha' },
    { id: 'beta', name: 'Beta' }
  ],
  review: 'none',
  profile: {
    note: 'Held in this browser only, and never sent anywhere.',
    fields: [
      { id: 'marginalRate', label: 'Marginal rate', unit: '%', min: 0, max: 60 },
      { id: 'balance', label: 'Balance', unit: '$', min: 0, max: 10000000 }
    ]
  },
  copy: { labelIdea: 'The idea', tabAttempts: 'Trials' },
  prompt: { intro: 'Fixture intro line.', closing: 'Fixture closing line.' }
};

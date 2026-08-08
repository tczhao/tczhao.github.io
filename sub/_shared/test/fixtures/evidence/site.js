/* Fixture: the evidence gate on. Every entry carries a citation, a replication
   verdict and, for empirical verdicts, both bounds of an interval. Review is
   off so the fixture isolates the gate from the Leitner machinery. */
window.SITE = {
  key: 'fixt-evid.v1',
  slug: 'fixt-evid',
  name: 'Fixture Evidence',
  eyebrow: 'Fixture',
  tagline: 'every claim carries its interval',
  tracks: [
    { id: 'alpha', name: 'Alpha' },
    { id: 'beta', name: 'Beta' }
  ],
  review: 'none',
  evidenceGate: true,
  reverifyDays: 180,
  copy: {
    labelIdea: 'The idea',
    labelEvidence: 'The evidence',
    tabAttempts: 'Trials'
  },
  prompt: { intro: 'Fixture intro line.', closing: 'Fixture closing line.' }
};

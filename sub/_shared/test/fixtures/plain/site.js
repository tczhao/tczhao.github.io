/* Fixture: the opposite corner - no gate, no expiry, no forecast book, and
   the recall rotation deleted in favour of an attempts log. */
window.SITE = {
  key: 'fixt-plain.v1',
  slug: 'fixt-plain',
  name: 'Fixture Plain',
  eyebrow: 'Fixture',
  tagline: 'no review rotation',
  tracks: [
    { id: 'one', name: 'One' },
    { id: 'two', name: 'Two' }
  ],
  levels: {},
  review: 'none',
  copy: {
    tabAttempts: 'Attempts',
    attemptPlaceholder: 'What happened last time?'
  }
};

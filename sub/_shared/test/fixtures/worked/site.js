/* Fixture: a gate that promises an answer, and the answer. One entry carries a
   worked example and one deliberately does not, because the field is optional
   and a corpus gains answers entry by entry. */
window.SITE = {
  key: 'fixt-work.v1',
  slug: 'fixt-work',
  name: 'Fixture Worked',
  eyebrow: 'Fixture',
  tagline: 'the answer opens with the entry',
  tracks: [
    { id: 'alpha', name: 'Alpha' },
    { id: 'beta', name: 'Beta' }
  ],
  review: 'none',
  gate: {
    label: 'Bring a paragraph',
    prompt: 'Edit it before you read the worked example.',
    cta: 'Commit and read on',
    curtain: 'The worked example opens once you have committed an edit.',
    minChars: 4
  },
  copy: { labelIdea: 'The idea', labelWorked: 'One good repair', tabAttempts: 'Trials' },
  prompt: { intro: 'Fixture intro line.', closing: 'Fixture closing line.' }
};

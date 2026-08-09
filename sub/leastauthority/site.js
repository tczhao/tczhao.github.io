/* Least Authority - securing systems that act on untrusted input.
 *
 * Half this corpus is classical and will outlive the reader; half of it is
 * eighteen months old and some of it is already wrong. Expiry is the honest
 * answer to that split. A lapsed entry leaves the sequence and the review deck
 * rather than being quietly reinforced into folklore, and it stays visible in
 * the library because knowing what went stale is itself worth something. */
window.SITE = {
  key: 'leastauthority.v1',
  slug: 'leastauthority',
  name: 'Least Authority',
  eyebrow: 'Field notes',
  tagline: 'systems that act on untrusted input',

  tracks: [
    { id: 'principles', name: 'Principles' },
    { id: 'authority', name: 'Authority and capabilities' },
    { id: 'confinement', name: 'Confinement and information flow' },
    { id: 'isolation', name: 'Isolation and multi-tenancy' },
    { id: 'input', name: 'Untrusted input' },
    { id: 'injection', name: 'Prompt injection and agent boundaries' },
    { id: 'defences', name: 'Agent defences' },
    { id: 'credentials', name: 'Credentials and delegation' },
    { id: 'modelling', name: 'Threat modelling and review' }
  ],

  levels: { classical: 'Classical', modern: 'Modern', practice: 'Practice' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  /* No replication verdict anywhere in this corpus, so there is nothing to
     derive a cheatsheet from and the row is opt-in: an entry appears if it was
     written a cheat line. That is a selection rather than a filter, and the
     page states the count it leaves off rather than implying it is the whole
     corpus. */
  cheatsheet: true,
  expiry: true,

  copy: {
    tabCheatsheet: 'Cheatsheet',
    cheatNote: 'The rules worth having in your head while you are writing the code, rather than after somebody reviews it.',
    cheatWithheld: 'are attacks and histories rather than rules - they are why the rules exist, and they need their full account to land.',
    labelIdea: 'The principle',
    labelWhy: 'Why it holds',
    labelFailure: 'What an attacker does without it',
    labelExperiment: 'Check this today',
    labelReflect: 'Log it',
    sourcePrefix: 'After',
    reflectPlaceholder: 'Where your own surface fails this, and who owns fixing it.',
    lapsedNote: 'This entry carried an expiry and it has passed. The modern half of this field turns over fast, so treat it as history rather than current fact. It has left the sequence and the review deck; re-harvest it or let it go.',
    progressNote: 'Lapsed entries are not a defect, they are the mechanic working. A security corpus with no expiry dates is a folklore generator.'
  },

  /* Specification sheet. A mono display face because most of this canon was
     first typeset that way, slate green for structure, signal orange for the
     things that want a hand on a keyboard. */
  palette: {
    faceDisplay: '"SF Mono", SFMono-Regular, Menlo, "Cascadia Mono", Consolas, monospace',
    light: {
      paper: '#F3F5F2', paperRaised: '#FFFFFF', paperSunk: '#E6EAE4',
      gridTint: '#141E1A', rule: '#D6DCD3', ruleStrong: '#AFB8AB',
      ink: '#141A17', inkMuted: '#4F5A54', inkFaint: '#858E88',
      accent: '#2C5347', accentInk: '#214238', action: '#BE5320',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#0D110F', paperRaised: '#141A17', paperSunk: '#080B09',
      gridTint: '#A5C8B4', rule: '#1F2723', ruleStrong: '#333E38',
      ink: '#DAE2DC', inkMuted: '#93A099', inkFaint: '#64706A',
      accent: '#6FB79E', accentInk: '#96CFBA', action: '#E58551',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through a security principle and want to apply it to the agent runtime my team owns.',
    closing: 'Assume a multi-tenant metadata platform where the runtime holds tenant credentials and reads customer-authored text. Tell me where the authority boundary actually sits, not where the documentation says it sits.'
  }
};

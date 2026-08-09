/* Maillard - the chemistry under the cooking.
 *
 * The one site here with the recall rotation deleted. The knowledge is
 * procedural: recalling that collagen converts to gelatin around 70C is trivia
 * unless the braise is on the stove. So the second tab is not a deck, it is a
 * record of what happened the last time you actually cooked the thing. */
window.SITE = {
  key: 'maillard.v1',
  slug: 'maillard',
  name: 'Maillard',
  eyebrow: 'Kitchen notes',
  tagline: 'the chemistry under the cooking',

  tracks: [
    { id: 'protein', name: 'Proteins and heat' },
    { id: 'browning', name: 'Browning' },
    { id: 'emulsion', name: 'Emulsions and foams' },
    { id: 'starch', name: 'Starch, gels and thickening' },
    { id: 'flavour', name: 'Flavour chemistry and perception' },
    { id: 'acid', name: 'Acid, salt and fermentation' },
    { id: 'heat', name: 'Heat transfer and equipment' },
    { id: 'sichuan', name: 'One tradition in depth' }
  ],

  levels: { weeknight: 'Weeknight', project: 'Project' },

  review: 'none',

  /* No replication verdict anywhere in this corpus, so there is nothing to
     derive a cheatsheet from and the row is opt-in: an entry appears if it was
     written a cheat line. That is a selection rather than a filter, and the
     page states the count it leaves off rather than implying it is the whole
     corpus. */
  cheatsheet: true,

  copy: {
    tabCheatsheet: 'Cheatsheet',
    cheatNote: 'What to actually do at the stove, and the temperature, timing or ratio that makes it work.',
    cheatWithheld: 'explain what is happening rather than what to do - worth reading once, and not the kind of thing you check mid-cook.',
    labelIdea: 'What is actually happening',
    labelWhy: 'The chemistry',
    labelFailure: 'What goes wrong, and why',
    labelExperiment: 'Try it tonight',
    labelReflect: 'Log the result',
    tabAttempts: 'Kitchen log',
    sourcePrefix: 'After',
    gaugeRetained: 'Attempts',
    reflectPlaceholder: 'What you cooked, what you measured, what happened.',
    attemptsNote: 'Entries you have logged. Write down what happened when you actually cooked it - that is the only review worth doing for a procedural skill.',
    attemptPlaceholder: 'What happened last time you cooked this?',
    progressNote: 'There is no review deck here on purpose. Attempts recorded is the number, because the knowledge only exists in the pan.'
  },

  /* Warm cream and browned copper, which is the reaction the site is named
     after. The only palette here that is allowed to look appetising. */
  palette: {
    faceDisplay: 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif',
    light: {
      paper: '#FAF6EE', paperRaised: '#FFFCF6', paperSunk: '#F0EADE',
      gridTint: '#3C2818', rule: '#E2D8C7', ruleStrong: '#BCAE99',
      ink: '#201A13', inkMuted: '#5F5445', inkFaint: '#968A77',
      accent: '#6B4423', accentInk: '#573619', action: '#B5541F',
      solid: '#4F6B2F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#16120D', paperRaised: '#1E1913', paperSunk: '#100D09',
      gridTint: '#DCC3A0', rule: '#2C251C', ruleStrong: '#473D2F',
      ink: '#EBE1D2', inkMuted: '#AB9E8B', inkFaint: '#796E5E',
      accent: '#C99A6B', accentInk: '#DCB68C', action: '#E0834A',
      solid: '#8CB36A', shaky: '#C9A651'
    }
  },

  prompt: {
    intro: 'I am working through a piece of food chemistry and want to apply it to something I am actually cooking.',
    closing: 'Give me the mechanism and the measurable, not a recipe. Tell me what to measure and what number would tell me it worked.'
  }
};

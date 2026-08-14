/* Practicum - a daily logbook for management practice.
 *
 * This site is where the engine came from. It ran on its own copy of app.js
 * and its own build.js for long enough that the shared engine grew features it
 * never got - the library pager being the one you notice, because every other
 * site offers the next entry at the foot of the one you are reading and this
 * one silently did not. Nothing here is a port: the corpus already satisfied
 * the shared validator, the stylesheet was already a subset of the shared
 * sheets, and the engine defaults are practicum's own strings because they
 * were lifted from here. What follows is the small residue that is genuinely
 * this site's rather than everyone's.
 *
 * key is load-bearing and must not change. A year of journal entries lives in
 * one browser under practicum.v1, and the shared engine merges an existing
 * record onto its blank rather than replacing it, so the migration is
 * invisible to anyone who has been reading.
 *
 * No gate, which is the one deliberate difference from its siblings. Cascade
 * forces a call before the reveal because its cases are entertaining enough to
 * decay into a war-story feed. This corpus is not read for the reveal - the
 * entry names a thing to try today, and a commitment box in front of it would
 * be ceremony rather than a mechanic. */
window.SITE = {
  key: 'practicum.v1',
  slug: 'practicum',
  name: 'Practicum',
  eyebrow: 'Logbook',
  tagline: 'a daily logbook for management practice',

  tracks: [
    { id: 'leverage', name: 'Leverage and time' },
    { id: 'people', name: 'People and growth' },
    { id: 'trust', name: 'Trust and safety' },
    { id: 'decisions', name: 'Decisions' },
    { id: 'communication', name: 'Communication' },
    { id: 'systems', name: 'Systems and org design' },
    { id: 'strategy', name: 'Strategy and scope' },
    { id: 'influence', name: 'Influence without authority' },
    { id: 'performance', name: 'Performance and hard conversations' },
    { id: 'hiring', name: 'Hiring and onboarding' },
    { id: 'change', name: 'Change and incidents' },
    { id: 'self', name: 'Leading yourself' }
  ],

  levels: { team: 'Team lead', cross: 'Cross-org', both: 'Any level' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  /* Nothing in this corpus grades its own evidence, so there is no verdict to
     filter on and the row is opt-in: an entry appears if it carries a cheat
     line. That is a selection rather than a filter, and the page states the
     count it leaves out rather than implying it is the whole corpus.

     The bar is deliberately high, because management writing compresses into
     platitude faster than any other material here. An entry earns a row when
     the useful part is a rule, an ordering or a specific move, and it is
     denied one when the value lives in the reasoning. Most entries do not
     earn a row. */
  cheatsheet: true,

  /* Every other label the engine asks for already defaults to what this site
     was hardcoding, because the defaults were taken from here. These two are
     the exception: the reason a corpus withholds a row is the site's to write,
     and this one withholds on compressibility rather than on evidence. */
  copy: {
    cheatNote: 'The entries that survive being compressed to one line.',
    cheatWithheld: 'are not weaker, they are less compressible - their value is in the reasoning, and a one-line version would be a slogan.'
  },

  /* An engineering lab notebook rather than a self-help app: pale technical
     paper stock, drafting blue for structure, oxide red-pen reserved for
     anything that asks you to act. faceDisplay is omitted because the shared
     default is already this site's slab. */
  palette: {
    light: {
      paper: '#F5F6F3', paperRaised: '#FFFFFF', paperSunk: '#EBEEE8',
      gridTint: '#141A22', rule: '#DBDFD7', ruleStrong: '#B6BEB4',
      ink: '#141A22', inkMuted: '#545F6A', inkFaint: '#8B949D',
      accent: '#1D4E80', accentInk: '#163D66', action: '#9E3A26',
      solid: '#2F6B4F', shaky: '#8A6A1F'
    },
    dark: {
      paper: '#101418', paperRaised: '#171D24', paperSunk: '#0B0E12',
      gridTint: '#9EBED6', rule: '#232C34', ruleStrong: '#37444E',
      ink: '#DCE3E9', inkMuted: '#96A2AD', inkFaint: '#68737D',
      accent: '#6EA8D4', accentInk: '#9AC4E4', action: '#D9755C',
      solid: '#63B08A', shaky: '#C9A651'
    }
  },

  /* closing is omitted: the engine default is the line this site already sent. */
  prompt: {
    intro: 'I am working through a management lesson and want to apply it to my actual situation.'
  }
};

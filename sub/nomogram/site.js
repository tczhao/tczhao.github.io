/* Nomogram - what training does, and how well that is known.
 *
 * The gate is what stops this being another training blog. Reading that
 * beetroot juice buys about one percent in a time trial changes nothing;
 * writing your own guess down first, and finding it was four times too big,
 * is the only part that transfers.
 *
 * This corpus decays differently from the others. Nothing here is repealed,
 * it just shrinks. A finding arrives from twelve trained men over six weeks,
 * gets repeated in reviews for a decade, and then an adequately powered
 * replication halves the effect and widens the interval past zero. The entry
 * never looks wrong on the day you read it, which is exactly why you would
 * keep training on it.
 *
 * So requireInterval is on, which Tare could not afford. This literature
 * reports intervals as a matter of course, and an effect quoted here without
 * one means the number came from a press release rather than a paper. The
 * seven replication verdicts carry the rest: an entry may state a large
 * effect and still be marked as resting on a single unblinded crossover of
 * fourteen people. reverifyDays is 365 rather than Tare's 180, because
 * meta-analyses are superseded on a slower clock than statute, but they are
 * superseded. */
window.SITE = {
  key: 'nomogram.v1',
  slug: 'nomogram',
  name: "Nomogram",
  eyebrow: "Alignment chart",
  tagline: "what training does, and how well that is known",

  tracks: [
    { id: 'cardio', name: 'Cardiorespiratory fitness' },
    { id: 'strength', name: 'Strength and resistance' },
    { id: 'ageing', name: 'Ageing curves' },
    { id: 'sleep', name: 'Sleep and measurement' },
    { id: 'load', name: 'Load, recovery and injury' },
    { id: 'noise', name: 'Signal and noise in nutrition' },
  ],

  levels: { core: 'Core', applied: 'Applied', advanced: 'Advanced' },

  review: 'leitner',
  intervals: [1, 3, 7, 16, 35],

  evidenceGate: true,
  /* On, unlike Tare. This literature reports confidence intervals as a matter of
     course, so an entry without one is a signal the paper was not read properly
     rather than a finding that genuinely lacks an interval. */
  requireInterval: true,
  reverifyDays: 180,

  /* The one place in this site that is meant to be read quickly, and therefore
     the one place that has to be restricted hardest. Only the replicated
     verdict appears. Fourteen of thirty entries qualify, which is the honest
     yield of this literature and is worth seeing stated as a fraction.

     Derived rather than chosen: the corpus already grades its own evidence, and
     letting the author pick the cheatsheet by hand would put the judgement back
     in exactly the place this site removes it from. */
  cheatsheet: { verdicts: ['replicated'] },

  gate: {
    label: "Draw your line first",
    prompt: "Write down how big you think the effect is, and how sure you think the evidence is, before either appears. Being wrong on the record is what calibrates you. Nodding along to a result does nothing.",
    placeholder: "Your estimate of the effect size, and how confident the evidence sounds to you",
    cta: "Draw the line and read on",
    curtain: "The effect size and its interval stay covered until you have written your own estimate.",
    minChars: 6,
    journalLabel: "What I predicted",
    statLabel: "Predicted"
  },

  copy: {
    labelIdea: "The claim",
    labelEvidence: "What was actually measured",
    labelWhy: "The mechanism",
    labelFailure: "Where it breaks down",
    labelExperiment: "Run this in your own training",
    labelReflect: "Log it",
    sourcePrefix: "After",
    staleNote: "not re-checked since",
    reflectPlaceholder: "The effect you predicted, the effect that was measured, and what you changed.",
    tabCheatsheet: "Cheatsheet",
    cheatNote: "What survived being re-run by someone else, and what it is worth in training you would actually do.",
    cheatWithheld: "rest on one study, are contested, are real but sold past their effect size, or have no trial behind them at all - they are worth reading and are not worth acting on from memory.",
    progressNote: "Entries logged measures reading. The gap between the effect you predicted and the effect that was measured tells you whether you have any feel for how small these effects are. Watch the second one."
  },

  /* A printed alignment chart. Cool chart stock with fine tick rules, the
     scales themselves in graphite so nothing on the page competes, and one
     red line kept for anything that asks you to change what you do. */
  palette: {
    faceDisplay: 'Optima, Candara, "Gill Sans", "Gill Sans MT", "Trebuchet MS", sans-serif',
    light: {
      paper: "#F1F2F6", paperRaised: "#FBFBFD", paperSunk: "#E4E6EC",
      gridTint: "#171C26", rule: "#D6D9E2", ruleStrong: "#AFB4C1",
      ink: "#14171F", inkMuted: "#4C525F", inkFaint: "#838A98",
      accent: "#3A4557", accentInk: "#2B3444", action: "#C42F2A",
      solid: "#336B57", shaky: "#8A6A1F"
    },
    dark: {
      paper: "#0E1014", paperRaised: "#161A20", paperSunk: "#090B0E",
      gridTint: "#A8B2C6", rule: "#202531", ruleStrong: "#353C4B",
      ink: "#DDE1E9", inkMuted: "#98A0AE", inkFaint: "#6A7280",
      accent: "#8FA0BC", accentInk: "#B2C0D8", action: "#E5584E",
      solid: "#68B295", shaky: "#C9A651"
    }
  },

  prompt: {
    intro: "I am working through an entry on training and physical capacity and want to apply it to my own running and lifting. I am in Australia.",
    closing: "Attack the evidence rather than agreeing with it. Give me the sample size, how the effect was measured, and what would have to be true for it to transfer to a trained recreational runner rather than the people who were studied. Say plainly when the interval is wide enough that the honest answer is that nobody knows."
  }
};

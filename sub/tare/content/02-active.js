/* Track: What active management costs. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "the-behaviour-gap-shrank",
  track: "active", level: "core",
  title: "The behaviour gap is roughly a tenth of what you were told",
  source: "Fulkerson, Jordan, Riley and Yan, Financial Analysts Journal 82(3), May 2026",
  evidence: "Re-analysis using Morningstar's own Mind the Gap sample. Timing cost over 2015-2024 is 0.10% per year against the 1.2% published.",
  replication: "overclaimed",
  verifiedOn: "2026-08-08",
  gateIntro: "The standard claim is that investors lose somewhere between one and two percentage points a year to bad timing. Before reading on: write down what you think the real figure is, and what would have to be true about the arithmetic for the published one to be inflated.",
  compute: { question: "What is the corrected timing cost on the money you hold outside super?", expr: "invested * 0.1 / 100", unit: "AUD a year" },
  idea: "The investor behaviour gap is real and roughly a tenth of the size the industry reports. The published figure is mostly an artefact of comparing a dollar-weighted return against a time-weighted one.",
  why: "The gap is computed by comparing what investors earned, weighted by when their money was actually in, against what the fund earned over the whole period. Those two numbers answer different questions.\n\nAnyone contributing steadily gets scored as a bad timer by construction, because their dollars arrive gradually and therefore miss part of a rising market. Dollar-cost averaging, the least behavioural strategy available, produces a gap on this method.\n\nCorrecting for that on Morningstar's own sample takes a decade's timing cost from 1.2% a year to 0.10%. The direction survives. The magnitude, which is what every argument built on it depended on, does not.",
  failureMode: "You accept that you are losing over a percentage point a year to your own psychology, and buy a product or an adviser to fix it. The problem was mostly in the measurement, and you have now paid a real fee to solve an artefact.",
  experiment: "Take any fee you pay that is justified by protecting you from yourself. Compare it against 0.10% of your invested balance. Write down which is larger.",
  reflection: "What are you paying to fix a gap of about a tenth of a percent?",
  recall: {
    q: "What makes the published investor behaviour gap so much larger than the corrected one?",
    a: "It compares a dollar-weighted investor return against a time-weighted fund return, which charges steady contributors for the timing of contributions they made deliberately.\n\nCorrected on Morningstar's own sample, the 2015-2024 figure falls from 1.2% a year to 0.10%."
  },
  deepDive: "Work out what I actually pay in fees justified by behavioural protection, and compare it against a tenth of a percent of my balance."
}
);

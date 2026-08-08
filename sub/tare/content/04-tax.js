/* Track: Tax structure. Ordered foundational first.
 *
 * Every entry here is statute rather than finding, so every one carries an
 * as-at date and a link to the primary source. These three were confirmed
 * against the ATO by an independent check on 2026-08-08; anything added later
 * needs the same treatment before it ships. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "division-293-wedge",
  track: "tax", level: "core",
  title: "The comparison is thirty against forty-seven",
  source: "ATO, Division 293 tax",
  evidence: "Division 293 threshold $250,000, unchanged since 2017-18. Top marginal rate 45% plus 2% Medicare levy above $190,000.",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-your-super/division-293-tax",
  verifiedOn: "2026-08-08",
  gateIntro: "You earn above the Division 293 threshold, so concessional contributions are taxed at 30% inside super rather than 15%. Before reading on: what is the tax saving on the next dollar you salary sacrifice?",
  compute: { question: "On the next dollar you salary sacrifice, how many percentage points do you save?", expr: "marginalRate - 30", unit: "percentage points" },
  idea: "Once Division 293 applies, the contributions tax on concessional super doubles from 15% to 30%. The comparison that matters is still 30% against 47%, not 15% against 30%.",
  why: "Division 293 is widely read as the point where salary sacrificing stops being worth it. That reading compares the new rate against the old one, which is the wrong pair. The rate you avoid by putting a dollar into super is your marginal rate outside it.\n\nAbove $190,000 that is 45% plus the 2% Medicare levy, so 47%. Against a 30% contributions rate the wedge is seventeen percentage points on every dollar, and it persists for as long as the money stays in the concessional environment.\n\nThe wedge narrows, it does not close. Deciding it has closed is a decision to hand over seventeen points.",
  failureMode: "You read that Division 293 doubled your contributions tax, conclude super has stopped working for you, and stop salary sacrificing. You have swapped a 30% rate for a 47% one on the strength of a comparison against your own past rather than against your alternative.",
  experiment: "Take the concessional contribution you are actually making this year. Multiply it by 0.17. That is what stopping would cost you this year alone, before any growth on the difference.",
  reflection: "What is your actual marginal rate including the levy, and what wedge does that leave against 30%?",
  recall: {
    q: "Under Division 293, which two rates should a top-bracket earner be comparing?",
    a: "30% inside super against 47% outside it - the top marginal rate of 45% plus the 2% Medicare levy.\n\nNot 15% against 30%. Comparing the new contributions rate to the old one measures how much worse super got, which is not the question. The question is what the money is taxed at if it does not go in."
  },
  deepDive: "Work out my real wedge at my marginal rate and tell me at what income, if any, the concessional strategy actually stops paying."
},
{
  id: "division-293-not-bounded",
  track: "tax", level: "applied",
  title: "The liability is not capped at the cap",
  source: "ATO, Division 293 tax and carry-forward concessional contributions",
  evidence: "Concessional cap $32,500 for 2026-27, AWOTE-indexed. Carried-forward amounts counted for Division 293 purposes. Unused cap carries forward five years.",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-your-super/division-293-tax",
  verifiedOn: "2026-08-08",
  gateIntro: "You have five years of unused concessional cap and you are about to use all of it in one year, on an income well above the Division 293 threshold. Before reading on: what is the largest Division 293 bill that year can produce?",
  compute: { question: "What is the Division 293 bill on this year's concessional contributions?", expr: "concessional * 15 / 100", unit: "AUD" },
  idea: "Division 293 is 15% of the lesser of your taxable super contributions and your excess over $250,000. When carry-forward lifts your concessional cap, every contribution inside the higher cap counts.",
  why: "It is tempting to bound the worst case at 15% of the standard concessional cap, because that is the most you can normally contribute concessionally in a year. On that arithmetic the maximum liability is small and fixed, and the entry writes itself.\n\nCarry-forward breaks the bound. Five years of unused cap can lift a single year's concessional contributions far above the standard cap, and the ATO counts all of it. The liability scales with what you actually contributed, not with what you could have contributed in a normal year.\n\nThe strategy still works. What does not work is planning against a ceiling that is not there.",
  failureMode: "You model a catch-up year against a bounded worst case, get a comfortable number, and contribute the lot. The assessment arrives several times larger, in a year you have already spent the cash flow that would have covered it.",
  experiment: "Look up your actual unused concessional cap in myGov. Multiply the total you could contribute this year by 0.15. Compare that against the number you would have guessed from the standard cap alone.",
  reflection: "What is your real carry-forward balance, and what does a full catch-up year actually cost in Division 293?",
  recall: {
    q: "Why is Division 293 liability not bounded by 15% of the standard concessional cap?",
    a: "Because carried-forward concessional amounts count for Division 293, and unused cap carries forward five years.\n\nA catch-up year can therefore carry contributions well above the standard cap, and the tax is assessed on what went in."
  },
  deepDive: "Pull my carry-forward position apart and model the Division 293 cost of using it in one year against spreading it."
},
{
  id: "the-threshold-that-does-not-move",
  track: "tax", level: "core",
  title: "One number is indexed and the other is not",
  source: "ATO, Division 293 tax",
  evidence: "Division 293 threshold $250,000, no indexation mechanism in the legislation since 2017-18. Concessional cap AWOTE-indexed, $32,500 for 2026-27, up from $30,000.",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-your-super/division-293-tax",
  verifiedOn: "2026-08-08",
  gateIntro: "Two numbers govern how much extra tax high earners pay on super: the $250,000 threshold and the concessional cap. Before reading on: which of them moves with wages, and what does that do to the affected population over a decade?",
  idea: "The Division 293 threshold has no indexation mechanism. The concessional cap it interacts with is indexed to average weekly ordinary time earnings. The affected population therefore grows every year by construction, without anyone legislating it.",
  why: "A threshold fixed in nominal terms is a tax increase on a schedule, and it does not appear in any budget as one. Wages rise, the threshold does not, and each year more people cross it.\n\nThe interaction is what makes it sharp here. The cap rises with AWOTE, so the contributions that can be caught grow at the same time as the population being caught. Both edges move toward each other.\n\nThis is worth knowing not because you can avoid it but because it changes what a long-horizon plan should assume. Modelling on today's threshold assumes a policy that is quietly reversing itself.",
  failureMode: "You build a twenty-year contribution plan on the assumption that Division 293 applies to people meaningfully richer than you. Real wage growth moves you inside it without any announcement, and the plan's tax assumption was wrong from about year six.",
  experiment: "Take your current income and grow it at 3% a year. Write down the year it crosses $250,000. That is the year your plan's assumption breaks, unless the threshold is legislated upward before then.",
  reflection: "In what year does your income cross a threshold that is not moving, and what in your plan depends on it not happening?",
  recall: {
    q: "Which of the Division 293 threshold and the concessional cap is indexed, and what follows?",
    a: "The concessional cap is indexed to AWOTE. The $250,000 threshold has no indexation mechanism and has not moved since 2017-18.\n\nSo the population paying Division 293 grows every year without legislation, and the contributions exposed to it grow at the same time."
  },
  deepDive: "Project when I cross the Division 293 threshold on realistic wage growth, and tell me what in a long-horizon super plan is sensitive to that date."
}
);

/* Track: Superannuation and the caps. Ordered foundational first.
 *
 * Statute, so every entry carries an as-at date and a primary source. These
 * figures are 2026-27 and were confirmed against the ATO on 2026-08-08. They
 * move every July. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "preservation-age-is-not-a-release",
  track: "super", level: "core",
  title: "Turning sixty is necessary, not sufficient",
  source: "ATO, Preservation age and conditions of release",
  evidence: "Preservation age is 60 for everyone born after 30 June 1964, flat since 1 July 2024. A condition of release is separately required.",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/withdrawing-and-using-your-super/when-you-can-access-your-super",
  verifiedOn: "2026-08-08",
  gateIntro: "You reach preservation age. Before reading on: write down what you believe you can withdraw the following morning, and under what condition.",
  cheat: "Preservation age is 60 for everyone born after 30 June 1964, and a separate condition of release still gates access.",
  idea: "Preservation age and a condition of release are two separate requirements. Reaching sixty satisfies the first and does nothing about the second.",
  why: "The two get collapsed into one date in almost every conversation about retiring early, and the collapse is what makes a plan fail at the exact moment it is supposed to pay out.\n\nPreservation age is now flat at sixty for anyone born after June 1964, so the phased schedule people remember no longer applies. But the money is still preserved until something happens: retirement as the legislation defines it, ceasing an employment arrangement after sixty, turning sixty-five, or a transition-to-retirement stream with its own limits.\n\nThe practical consequence is that the bridge between stopping work and unrestricted access is built from money outside super, and its length is set by which condition you expect to satisfy.",
  failureMode: "You plan to stop work at sixty and live on super. You have satisfied preservation age but not a condition of release, so the balance is unavailable and the bridge you needed outside super was never built.",
  experiment: "Write down the condition of release you are actually relying on and the date you expect to satisfy it. If the two differ, the gap between them is how much you need outside super.",
  reflection: "Which condition of release does your plan depend on, and what funds the gap before it?",
  recall: {
    q: "What does reaching preservation age entitle you to?",
    a: "Nothing on its own. Preservation age is sixty for anyone born after 30 June 1964, and a condition of release is separately required.\n\nRetiring as defined, ceasing an employment arrangement after sixty, or turning sixty-five are the usual ones."
  },
  deepDive: "Work out which condition of release my plan depends on and how long the bridge outside super needs to be."
},
{
  id: "two-caps-one-lifetime",
  track: "super", level: "applied",
  title: "The cap that limits contributions is not the cap that limits the pension",
  source: "ATO, Contributions caps and Transfer balance cap",
  evidence: "Concessional cap $32,500 and non-concessional $130,000 for 2026-27, three-year bring-forward $390,000. General transfer balance cap $2.1 million, indexed from $2 million. Superannuation guarantee 12%.",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds",
  verifiedOn: "2026-08-08",
  gateIntro: "Two different caps govern superannuation: one on what goes in each year, one on what can move into a tax-free pension. Before reading on: write down which one binds first for you, and at roughly what balance.",
  compute: { question: "How much of your target balance lands outside the transfer balance cap?", expr: "targetBalance - 2100000", unit: "AUD" },
  cheat: "For 2026-27 the concessional cap is $32,500; the general transfer balance cap of $2.1 million limits what reaches tax-free pension.",
  idea: "Annual contributions caps limit the rate of accumulation. The transfer balance cap limits how much of the result can ever be moved into a tax-free retirement pension. They bind at different times and neither implies the other.",
  why: "Almost all attention goes to the annual caps, because they are the number you interact with every payslip. The transfer balance cap is the one that decides what the exercise was for.\n\nAt $2.1 million general cap, an accumulation balance well past that is entirely possible and entirely legal. What is not possible is moving all of it into the tax-free pension phase. The excess stays in accumulation, taxed at 15% on earnings rather than nil.\n\nThe personal cap is proportional to unused cap space rather than a flat number, so the timing of when you first start a retirement phase income stream affects the cap you personally get for life.",
  failureMode: "You optimise hard on the annual caps for twenty years, land well above the transfer balance cap, and discover the surplus was accumulated into an environment that taxes it at 15% forever rather than the nil you were planning around.",
  experiment: "Project your balance to your intended retirement date. Subtract $2.1 million. Whatever is left is the part of your plan that does not get the tax outcome you assumed.",
  reflection: "Does your projected balance exceed the transfer balance cap, and what was the plan for the excess?",
  recall: {
    q: "What does the transfer balance cap limit, and how does it differ from the contributions caps?",
    a: "It caps what can be moved into a tax-free retirement phase income stream, currently $2.1 million general cap. The contributions caps limit what goes in each year.\n\nThe personal transfer balance cap is proportional to unused cap space, so when you first start a retirement phase stream sets your lifetime cap."
  },
  deepDive: "Project my balance against the transfer balance cap and tell me what the excess should be doing instead."
}
);

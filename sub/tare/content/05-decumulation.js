/* Track: Drawing it down. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "four-percent-is-a-us-number",
  track: "decumulation", level: "core",
  title: "Four percent was never measured here",
  source: "Drew and Walk, Finsia (2014)",
  evidence: "82 overlapping 30-year retirements on Australian data. A 50/45/5 portfolio gave a never-failed rate of 2.96%, 3.62% at a 10% ruin tolerance. Four percent carried roughly a one-in-five chance of ruin.",
  replication: "single",
  verifiedOn: "2026-08-08",
  gateIntro: "The four percent rule is the most repeated number in retirement planning. Before reading on: write down what withdrawal rate you would actually plan on for an Australian portfolio, and what probability of running out you are accepting.",
  compute: { question: "What annual income does your target balance give at the rate that never failed on Australian data?", expr: "targetBalance * 2.96 / 100", unit: "AUD" },
  idea: "On Australian data over 82 overlapping thirty-year retirements, the rate that never failed was 2.96%. Four percent carried roughly a one-in-five chance of ruin.",
  why: "The four percent rule comes from United States market history, and the United States had one of the best equity centuries in the sample. Importing the rule imports the market it was fitted to.\n\nThe gap between 2.96% and 4% does not sound large and is close to a third of your income. On a $2 million balance it is the difference between roughly $59,000 and $80,000 a year, and the second figure fails about one time in five.\n\nThis is one study on one country's history, never independently re-run, which is exactly the standard of evidence the four percent rule itself rests on. The point is not that 2.96% is the truth. It is that four percent was never a measurement of this market.",
  failureMode: "You plan a thirty-year retirement at four percent because everyone does, and accept a one-in-five failure probability you were never shown and would not have agreed to if you had been.",
  experiment: "Take your target balance. Compute the annual income at 4% and at 2.96%. The difference is what the imported rule is quietly assuming about which country's market history you retire into.",
  reflection: "What withdrawal rate does your plan use, and what failure probability comes attached to it?",
  recall: {
    q: "What did Australian data give as a never-failed thirty-year withdrawal rate, and what did four percent cost?",
    a: "2.96% never failed across 82 overlapping thirty-year retirements on a 50/45/5 portfolio; 3.62% at a 10% ruin tolerance.\n\nFour percent carried roughly a one-in-five chance of ruin. Note this is a single study, never independently re-run."
  },
  deepDive: "Re-run my drawdown plan at the Australian rates rather than the US rule, and tell me what the income difference does to the plan."
}
);

/* One entry per replication verdict, so the renderer is exercised across the
   whole vocabulary rather than only the comfortable end of it. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "alpha-replicated", track: "alpha",
  title: "A finding that was re-run",
  source: "Fixture et al., Journal of Fixtures (2019)",
  evidence: "148 studies, N = 308,849, OR 1.50",
  interval: { lo: 1.42, hi: 1.59, measure: "odds ratio" },
  replication: "replicated",
  verifiedOn: "2026-08-01",
  idea: "Alpha replicated idea.",
  why: "It holds because of a mechanism.\n\nSecond paragraph.",
  failureMode: "Alpha replicated failure.",
  experiment: "Do the alpha replicated thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
},
{
  id: "alpha-single", track: "alpha",
  title: "A finding nobody has repeated",
  source: "Fixture, European Journal of Fixtures (2010)",
  evidence: "96 recruited, 39 usable curves, median 66 days",
  interval: { lo: 18, hi: 254, measure: "days" },
  replication: "single",
  verifiedOn: "2026-08-01",
  idea: "Alpha single idea.",
  why: "One study, never repeated.\n\nThat is not the same as disputed.",
  failureMode: "Alpha single failure.",
  experiment: "Do the alpha single thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
},
{
  id: "beta-overclaimed", track: "beta",
  title: "A real effect, wildly oversold",
  source: "Fixture, Meta-analysis of Fixtures (2016)",
  evidence: "88 samples, r = 0.18 against conscientiousness r = 0.66",
  interval: { lo: 0.12, hi: 0.24, measure: "r" },
  replication: "overclaimed",
  verifiedOn: "2026-08-01",
  idea: "Beta overclaimed idea.",
  why: "The effect is there. The popular version is not.\n\nSecond paragraph.",
  failureMode: "Beta overclaimed failure.",
  experiment: "Do the beta overclaimed thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
},
{
  id: "beta-statute", track: "beta",
  title: "A threshold set by law",
  source: "Fixture Revenue Office",
  evidence: "Concessional cap $32,500 for 2026-27",
  replication: "statute",
  asAt: "2026-07-01",
  sourceUrl: "https://example.invalid/fixture-cap",
  verifiedOn: "2026-08-01",
  idea: "Beta statute idea.",
  why: "This is not a finding. It is a number somebody legislated.\n\nIt rots on a schedule.",
  failureMode: "Beta statute failure.",
  experiment: "Do the beta statute thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
},
{
  id: "beta-craft", track: "beta",
  title: "Practitioner knowledge with no trial behind it",
  source: "Fixture practice",
  evidence: "No controlled evidence. Practitioner consensus only.",
  replication: "craft",
  verifiedOn: "2026-08-01",
  idea: "Beta craft idea.",
  why: "Nobody has tested this.\n\nIt is still worth knowing, labelled as what it is.",
  failureMode: "Beta craft failure.",
  experiment: "Do the beta craft thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
}
);

(window.LESSONS = window.LESSONS || []).push(
{
  id: "alpha-wedge", track: "alpha",
  title: "Alpha wedge",
  source: "Fixture",
  compute: { question: "What is your wedge?", expr: "marginalRate - 30", unit: "%" },
  idea: "Alpha wedge idea.",
  why: "It holds because of a mechanism.\n\nSecond paragraph.",
  failureMode: "Alpha wedge failure.",
  experiment: "Do the alpha wedge thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
},
{
  id: "beta-scaled", track: "beta",
  title: "Beta scaled",
  source: "Fixture",
  compute: { question: "What does it cost on your balance?", expr: "(marginalRate - 30) * balance / 100", unit: "$" },
  idea: "Beta scaled idea.",
  why: "It holds because of a mechanism.\n\nSecond paragraph.",
  failureMode: "Beta scaled failure.",
  experiment: "Do the beta scaled thing.",
  reflection: "What happened?",
  deepDive: "Help me apply this."
}
);

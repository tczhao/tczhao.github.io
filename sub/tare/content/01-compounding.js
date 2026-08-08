/* Track: Compounding and drag. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "australia-was-the-outlier",
  track: "compounding", level: "core",
  title: "You are standing on the best hundred years anyone got",
  source: "Dimson, Marsh and Staunton, Triumph of the Optimists and the annual yearbooks",
  evidence: "19 countries, 1900-2011. Australia highest real annualised equity return at 7.22% with 18.23% standard deviation, ahead of South Africa 7.21% and the United States 6.19%.",
  replication: "single",
  verifiedOn: "2026-08-08",
  gateIntro: "You are about to project an Australian portfolio forward on historical returns. Before reading on: what real annualised equity return do you plan to use, and where did that number come from?",
  idea: "Australia posted the highest real equity return of nineteen countries over 1900 to 2011. Planning on the Australian historical average is planning on the best outcome in the sample.",
  why: "The number is not wrong. It is the top of a distribution, and it is being used as though it were the middle of one.\n\nThere is only one 112-year Australian history, so the standard error on that mean is not something you can shrink by collecting more of it. The honest comparison is the cross-country spread: the same period gave the United States 6.19% and gave several markets far less, including two that went to zero for a period.\n\nSurvivorship is the mechanism. The countries with long clean price histories are the ones whose exchanges stayed open, and the sample is selected on exactly the outcome being measured.",
  failureMode: "You model thirty years at the Australian historical average, arrive at a retirement date, and organise your working life around it. A realised return one or two points lower does not move the date by a year. It moves it by most of a decade.",
  experiment: "Take whatever real return your plan assumes. Re-run it at 6.19%, the United States figure from the same dataset and period. Write down how far the date moves.",
  reflection: "What return does your plan assume, and what happens to it at one point lower?",
  recall: {
    q: "Why is the Australian long-run equity return a poor default for planning?",
    a: "Because it was the highest of nineteen countries over 1900-2011, so using it as a central estimate takes the top of the cross-country distribution as the middle of it.\n\nThere is also only one such history, so its uncertainty cannot be reduced by gathering more data."
  },
  deepDive: "Re-run my projection across the plausible range rather than the Australian point estimate, and tell me which decisions actually flip."
}
);

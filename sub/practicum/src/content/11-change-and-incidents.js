/* Track: Change and incidents. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "mitigate-before-diagnose",
  track: "change", level: "both",
  title: "Stop the bleeding before you find the wound",
  source: "Google SRE practice",
  idea: "During an incident, restoring service takes precedence over understanding the cause. Curiosity is the most common reason outages last longer than they need to.",
  why: "Engineers are trained to understand problems, and that instinct is actively harmful mid-incident. The rollback, the failover, the feature flag - these end customer impact without requiring you to know why, and they preserve the evidence for later.\n\nThe discipline is to separate the two phases explicitly and say which one you are in. Diagnosis after mitigation is calmer, better, and costs nothing. Diagnosis during impact costs minutes per minute.",
  failureMode: "A forty-minute outage where the first thirty were spent understanding an interesting failure mode that a two-minute rollback would have ended. The investigation was excellent and could have happened afterwards.",
  experiment: "In your next incident, have someone ask out loud: are we mitigating or diagnosing? If the answer is diagnosing and customers are affected, mitigate first. Make this a standing question in your process.",
  reflection: "In your last incident, how much of the duration was diagnosis that could have happened after mitigation?",
  recall: {
    q: "Why does diagnosis belong after mitigation?",
    a: "Rollback, failover and flags end customer impact without requiring you to know why, and they preserve evidence for later.\n\nDiagnosis afterwards is calmer, better and free. During impact it costs minutes per minute - and the engineering instinct to understand first is what makes outages long."
  },
  deepDive: "Help me build an incident process that reliably enforces mitigation before diagnosis under pressure."
},
{
  id: "incident-command-roles",
  track: "change", level: "both",
  title: "Separate commanding from fixing",
  source: "Incident command practice, via Google SRE and PagerDuty",
  idea: "One person coordinates and communicates; different people investigate and fix. The commander does not debug, and the debuggers do not handle stakeholders.",
  why: "Debugging requires deep focus; coordination requires constant context switching. One person cannot do both, and when they try, the usual outcome is that coordination is dropped - so stakeholders are uninformed, nobody knows who is doing what, and two people investigate the same thing.\n\nThe roles also protect the fixers. A designated commander absorbs the incoming questions that would otherwise interrupt the people actually working, which is the single largest source of avoidable delay in a long incident.",
  failureMode: "An incident where the most senior engineer is simultaneously debugging, updating the status page, and answering four executives. They are excellent and the incident takes three times longer than it should, because every context switch costs them their place.",
  experiment: "Write down who plays commander for your next incident, and make it explicit that they will not be debugging. Practise it on a low-severity one, before you need it.",
  reflection: "In your last significant incident, who was protecting the people doing the work from interruption?",
  recall: {
    q: "Why must incident command be separate from investigation?",
    a: "Debugging needs deep focus, coordination needs constant switching - one person doing both drops coordination, so stakeholders go dark and work gets duplicated.\n\nThe commander also absorbs incoming questions, which is the largest source of avoidable delay in a long incident."
  },
  deepDive: "Help me define incident roles for my team's size, and how to practise them before a real incident."
},
{
  id: "complex-systems-run-degraded",
  track: "change", level: "both",
  title: "Your system is already running in a degraded state",
  source: "Richard Cook, How Complex Systems Fail",
  idea: "Cook's observation is that complex systems always contain latent faults, and run anyway. Failure requires multiple faults to align, so there is never a single root cause.",
  why: "This changes what you look for. If failure needs several contributing conditions, then removing any one of them prevents that specific accident - which means the highest-value question is not 'what caused this' but 'which of these conditions is cheapest to eliminate'.\n\nIt also explains why systems that have been reliable for a year are not therefore safe. They have been running with the same latent faults the whole time and simply have not had the alignment yet. Absence of incidents is weak evidence of safety.",
  failureMode: "A postmortem that identifies one root cause, fixes it, and closes. Three of the four contributing conditions remain, so the same class of failure recurs through a slightly different path and is logged as an unrelated incident.",
  experiment: "Take your last incident and list every condition that had to be true for it to happen - at least four. Rank them by cost to remove. Fix the cheapest two, not the one you called the root cause.",
  reflection: "What latent faults do you know your system currently has that have not aligned with anything yet?",
  recall: {
    q: "Why is there no single root cause in a complex system?",
    a: "Complex systems always carry latent faults and run anyway; failure requires several to align.\n\nSo the useful question is which contributing condition is cheapest to eliminate, not which one was the cause. It also means a quiet year is weak evidence of safety."
  },
  deepDive: "Help me list all the contributing conditions for an incident I describe, and rank them by cost to remove."
},
{
  id: "normalisation-of-deviance",
  track: "change", level: "both",
  title: "The warning sign becomes normal",
  source: "Diane Vaughan, The Challenger Launch Decision",
  idea: "When an anomaly appears repeatedly without causing harm, teams gradually reclassify it as acceptable. The reclassification is unconscious and is how catastrophes get built.",
  why: "Vaughan's finding was not that anyone ignored the risk. It was that each individual decision to proceed was reasonable given the previous ones, and the collective effect was a drift in what counted as safe. The standard moves without anyone deciding to move it.\n\nThe practical defence is to notice reclassification as it happens. When someone says 'that alert always fires' or 'that error is expected', that is the moment a signal became noise, and it is worth asking when that decision was made and by whom.",
  failureMode: "A dashboard with four permanently-red panels that everyone has learned to read past. When a fifth thing goes wrong nobody notices for two hours, because the visual signal for 'something is wrong' was consumed years ago.",
  experiment: "Ask your team what alert or error they have learned to ignore. For each, decide explicitly: fix it, or delete it. Leaving it is the option that is not available.",
  reflection: "What does your team currently treat as normal that would alarm someone joining tomorrow?",
  recall: {
    q: "How does normalisation of deviance happen?",
    a: "An anomaly recurs without harm, so it gets unconsciously reclassified as acceptable - each decision reasonable given the previous one, the standard drifting with nobody deciding to move it.\n\nCatch it at the language: 'that alert always fires' is the moment a signal became noise."
  },
  deepDive: "Help me find what my team has normalised that should still be alarming, from what I describe about our alerts and dashboards."
},
{
  id: "on-call-health-is-a-metric",
  track: "change", level: "team",
  title: "Measure on-call load or it will be paid silently",
  source: "Google SRE practice",
  idea: "Pages per shift, out-of-hours interruptions and time spent on toil are real numbers that should be tracked and have limits. Unmeasured, the cost is absorbed by individuals until they leave.",
  why: "On-call burden is uniquely invisible in delivery accounting. It does not appear on a roadmap, and the people carrying it tend to under-report because complaining reads as not coping. So it degrades quietly until someone resigns and cites it in an exit interview.\n\nHaving a number makes it negotiable. 'On-call had eleven out-of-hours pages last month' is an argument for reliability investment. 'On-call is rough' is a personality observation.",
  failureMode: "A rota everyone describes as manageable, quietly costing two nights of sleep per rotation. It is never prioritised because it is never quantified, and the first hard evidence arrives as attrition.",
  experiment: "Count last month's out-of-hours pages and how many were actionable. Bring the number to your next planning conversation as a delivery risk rather than a wellbeing item.",
  reflection: "Do you know how many times your team was woken up last month? If not, you cannot be managing it.",
  recall: {
    q: "Why does on-call burden degrade silently?",
    a: "It does not appear in delivery accounting, and carriers under-report because complaining reads as not coping - so the first hard evidence is attrition.\n\nA number makes it negotiable: eleven out-of-hours pages is an argument for investment; 'on-call is rough' is a personality observation."
  },
  deepDive: "Help me define the on-call health metrics my team should track and what limits to argue for."
},
{
  id: "alert-on-symptoms",
  track: "change", level: "team",
  title: "Alert on what users experience",
  source: "Google SRE practice",
  idea: "Page on symptoms - requests failing, latency breached - not on causes like CPU or queue depth. Cause-based alerts produce noise and miss the failures you did not predict.",
  why: "A cause-based alert fires when a specific predicted mechanism occurs, which means it misses everything else and also fires when the mechanism occurs harmlessly. High CPU with users unaffected is not an emergency; users failing with normal CPU very much is.\n\nSymptom alerts are also stable across refactors. Rewrite the service and 'error rate above 1%' still means the same thing, whereas the twelve cause-based alerts now describe a system that no longer exists.",
  failureMode: "Forty alerts on infrastructure metrics, most of which fire routinely and are muted, and no alert on whether the product works. An outage is discovered by a customer while every dashboard is technically green.",
  experiment: "Count your alerts. Sort into symptom-based and cause-based. If you have no symptom-based alert on your primary user journey, add one today and delete two noisy cause alerts.",
  reflection: "If your service silently returned errors to 5% of users right now, how would you find out and how long would it take?",
  recall: {
    q: "Why alert on symptoms rather than causes?",
    a: "Cause alerts fire on one predicted mechanism, so they miss everything else and also fire when the mechanism is harmless.\n\nSymptom alerts survive refactors: 'error rate above 1%' means the same thing after a rewrite, while cause alerts describe a system that no longer exists."
  },
  deepDive: "Help me audit my alerting for symptom versus cause coverage and identify the gaps on our main user journeys."
},
{
  id: "study-what-goes-right",
  track: "change", level: "both",
  title: "Study the times it nearly failed and did not",
  source: "Erik Hollnagel, on Safety-II",
  idea: "Hollnagel's argument is that reliability comes from people constantly adapting, and almost all of that is invisible because it succeeds. Only studying failures misses where safety actually comes from.",
  why: "Incidents are a tiny and biased sample. The far larger population is the near misses and the daily adjustments - the engineer who noticed something odd and checked, the person who happened to know the runbook was wrong. Those adaptations are what keep the system up, and none of them are recorded anywhere.\n\nSurfacing them tells you where the system depends on human judgement rather than on design. That is both a source of resilience and a fragility, because it works right up until the person who knows is unavailable.",
  failureMode: "An organisation with excellent postmortems that has no idea how much of its reliability rests on three people's undocumented instincts. It looks robust and has a specific, invisible dependency on individuals.",
  experiment: "Ask your team for one thing that almost went wrong recently and did not, and why. Do this in a retrospective where no incident occurred. The answers are usually more informative than the incident reports.",
  reflection: "What went right last month that could easily have gone wrong, and who or what prevented it?",
  recall: {
    q: "Why is studying only incidents insufficient?",
    a: "Incidents are a tiny biased sample; the large population is near misses and daily human adaptation, which is invisible because it succeeds.\n\nSurfacing it shows where reliability depends on individual judgement rather than design - a source of resilience and a hidden single-person dependency."
  },
  deepDive: "Help me design a near-miss review that surfaces the invisible adaptations keeping my systems up."
},
{
  id: "error-budget",
  track: "change", level: "cross",
  title: "An error budget converts an argument into arithmetic",
  source: "Google SRE practice",
  idea: "Agree an acceptable unreliability level in advance. While you are within budget, ship freely. When you exhaust it, reliability work takes priority automatically.",
  why: "Without a budget, the reliability-versus-velocity argument is recurring, political, and settled by whoever is most senior in the room that week. The budget replaces it with a rule agreed while nobody was under pressure, which is the only time such a rule can be agreed fairly.\n\nIt also legitimises both sides. Shipping fast within budget stops being reckless, and stopping to fix things stops being a favour - it is what the agreement says happens.",
  failureMode: "A permanent tension where product pushes for velocity, engineering pushes for stability, and the outcome depends on whether the last incident was recent. Both sides believe the other is unreasonable and both are arguing from the same missing agreement.",
  experiment: "Propose a budget for one service: an availability target, and what changes when it is missed. Getting agreement on the consequence is the hard and valuable part, not the number.",
  reflection: "How does your team currently settle reliability against velocity? Is it a rule or a recurring negotiation?",
  recall: {
    q: "What problem does an error budget solve?",
    a: "It replaces a recurring political argument, settled by whoever is most senior that week, with a rule agreed before anyone was under pressure.\n\nIt legitimises both sides: shipping fast within budget is not reckless, and stopping to fix is not a favour."
  },
  deepDive: "Help me propose an error budget for a service, focusing on what should happen when it is exhausted."
},
{
  id: "urgency-then-coalition",
  track: "change", level: "cross",
  title: "Change needs a reason to move and a group to move it",
  source: "John Kotter, Leading Change",
  idea: "Kotter's first two steps are establishing genuine urgency and building a coalition with enough credibility to carry it. Skipping either is why well-designed changes stall.",
  why: "Without urgency, a change is one more good idea competing with everyone's existing work, and existing work always wins because it has deadlines. Urgency does not mean manufactured panic - it means a concrete, credible answer to 'why now rather than next year'.\n\nWithout a coalition, the change depends entirely on your own authority, which limits it to what you can personally enforce. A small group of respected people carrying the same message reaches places you cannot, and survives your attention moving elsewhere.",
  failureMode: "A well-designed initiative announced by one enthusiastic manager, receiving polite agreement and no behaviour change. Everyone had more urgent things, and nobody else was invested enough to push when the manager was busy.",
  experiment: "For a change you want, write your one-sentence answer to 'why now'. Then name three people whose visible support would make it credible, and go recruit them before announcing anything.",
  reflection: "For your current initiative, who else would argue for it if you were not in the room?",
  recall: {
    q: "What do urgency and a coalition each provide?",
    a: "Urgency answers 'why now rather than next year', without which the change competes with work that has deadlines and loses.\n\nA coalition reaches places your authority does not and survives your attention moving elsewhere - otherwise the change is limited to what you can personally enforce."
  },
  deepDive: "Help me articulate genuine urgency for a change I want to drive, and identify whose support would make it credible."
},
{
  id: "resistance-is-information",
  track: "change", level: "cross",
  title: "Resistance usually contains a real objection",
  source: "Standard change practice",
  idea: "People resisting a change are often protecting something legitimate you have not accounted for. Treating resistance as an obstacle to overcome discards the information in it.",
  why: "The person pushing back usually has local knowledge you lack - a customer commitment, a fragile dependency, a workflow the new approach breaks. Their objection is frequently poorly articulated because it is a felt sense from experience rather than an argument, which makes it easy to dismiss.\n\nThe useful move is to assume it is real and go find it. 'What breaks for you if we do this?' converts vague resistance into a specific problem, which is either solvable or a reason to change the plan.",
  failureMode: "A change pushed through over objections, which then fails for exactly the reason someone raised badly in week two. The objection was right and was dismissed because it was expressed as reluctance rather than as analysis.",
  experiment: "Find the person most resistant to your current change. Ask what specifically breaks for them. Do not defend the plan in that conversation - just collect it.",
  reflection: "Who is resisting something you are pushing, and have you found out what they are protecting?",
  recall: {
    q: "Why is resistance worth investigating rather than overcoming?",
    a: "The resister usually holds local knowledge you lack - a commitment, a fragile dependency, a broken workflow - expressed as a felt sense rather than an argument, which makes it easy to dismiss.\n\nAsk what specifically breaks for them: that converts reluctance into a solvable problem or a reason to change the plan."
  },
  deepDive: "Help me work out what someone resisting my change might be legitimately protecting, and how to ask."
},
{
  id: "wartime-peacetime",
  track: "change", level: "both",
  title: "The right leadership style depends on whether you are under threat",
  source: "Ben Horowitz, The Hard Thing About Hard Things",
  idea: "Horowitz distinguishes peacetime from wartime. Peacetime rewards process, broad input and developing people. Wartime rewards directness, narrow focus and speed. The same behaviour is right in one and wrong in the other.",
  why: "In peacetime the organisation is winning and the job is to expand and improve, which tolerates and benefits from consensus-building. In wartime there is an existential threat and a single path through, which makes extensive consultation an expensive luxury.\n\nThe failure is not picking the wrong style but failing to notice the switch. Wartime behaviour in peacetime is destructive and reads as autocratic. Peacetime behaviour in wartime is fatal and reads as complacent.",
  failureMode: "A manager who runs an inclusive, consultative process during a genuine crisis, because that is their identity as a leader. The decisions are well-supported and two weeks too late.",
  experiment: "Decide honestly which one your team is in right now, and name one behaviour you should change to match. If you are in peacetime, this may mean slowing down deliberately.",
  reflection: "Are you currently leading as though there is a crisis when there is not, or the reverse?",
  recall: {
    q: "What distinguishes wartime from peacetime leadership, and what is the actual failure?",
    a: "Peacetime rewards process, broad input and developing people; wartime rewards directness, narrow focus and speed.\n\nThe failure is not picking wrong but failing to notice the switch - wartime behaviour in peacetime reads as autocratic, peacetime behaviour in wartime as complacent."
  },
  deepDive: "Help me assess whether my team is in wartime or peacetime and what I should change about how I am operating."
},
{
  id: "adaptive-capacity",
  track: "change", level: "cross",
  title: "Resilience is the capacity you have not spent",
  source: "David Woods, on resilience engineering",
  idea: "Woods distinguishes robustness - handling anticipated disturbances - from resilience, the ability to stretch for the unanticipated. Resilience requires reserve capacity, which efficiency drives eliminate first.",
  why: "Optimising a system to handle known load precisely leaves nothing for the surprise. That reserve is invisible in normal operation, so it looks like waste and is the first thing removed in any efficiency effort. Its absence only becomes apparent during the event it would have covered.\n\nThis applies to teams as much as to infrastructure. A team with no spare attention cannot absorb an unexpected escalation, so the escalation displaces committed work, which produces a second problem. The reserve was the mechanism that prevented cascades.",
  failureMode: "An organisation that has removed every buffer in the name of efficiency and is now unable to respond to anything unplanned without something else breaking. Each individual optimisation was justified and the aggregate is brittleness.",
  experiment: "Identify one reserve your team has lost in the last year - slack time, a second person who knew a system, headroom in a service. Decide whether to restore it, and say out loud what it is for.",
  reflection: "What would your team be unable to absorb right now, and what capacity would have absorbed it a year ago?",
  recall: {
    q: "What is the difference between robustness and resilience?",
    a: "Robustness handles anticipated disturbances; resilience is the capacity to stretch for the unanticipated, and it requires reserve.\n\nReserve is invisible in normal operation, so it looks like waste and gets cut first - its absence is only apparent during the event it would have covered."
  },
  deepDive: "Help me identify what reserve capacity my team has lost and make the case for restoring some of it."
}
);

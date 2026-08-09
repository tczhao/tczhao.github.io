/* Track: Detection and human factors. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "human-time-to-detect",
  track: "human", level: "recovery",
  title: "Time to detect is usually the bigger half of time to recover",
  source: "Beyer, Jones, Petoff and Murphy, Site Reliability Engineering, on monitoring",
  gateIntro: "A team reviews a quarter of incidents and finds their median repair time is stubborn. Every write-up ends with an action item about the fix being faster: a scripted rollback, a pre-warmed standby, a runbook rewrite. The next quarter the median has not moved.",
  idea: "Recovery time is detection plus diagnosis plus repair, and teams optimise the third because it is the only one they were watching.",
  why: "The three intervals have completely different levers. Repair is engineering: automation, rehearsal, a tested rollback. Diagnosis is observability and familiarity. Detection is almost entirely a question of whether a signal exists and whether anyone is looking at it, which is cheap to improve and easy to leave alone because nobody writes an action item about the forty minutes before the page.\n\nThe reason repair gets all the attention is that it is the part the write-up describes in detail. The timeline starts when the incident was declared, so the interval before that is invisible in the document that drives the follow-up work. Measuring from first customer impact rather than from declaration is a one-line change to the template that reallocates a quarter of engineering effort.",
  failureMode: "An incident where the fix took four minutes once someone understood the problem, and the ticket that produced the action item records a two hour outage. The action item is about the four minutes.",
  experiment: "Take your last five incidents. For each, write three numbers: first customer impact to first alert, first alert to correct hypothesis, correct hypothesis to resolved. If you cannot reconstruct the first number, that is the finding.",
  reflection: "Which of the three intervals does your incident template actually make visible, and which one is your team currently funding?",
  recall: {
    q: "Recovery time decomposes into which three intervals, and which one do teams systematically underinvest in?",
    a: "Detection, diagnosis, repair. Teams overinvest in repair because it is the part the write-up describes in detail.\n\nDetection is invisible in most templates because the timeline begins at declaration rather than at first customer impact, so no action item is ever written against it."
  },
  deepDive: "Help me redesign my incident template so the interval before declaration is recorded, and tell me what data I would need to reconstruct it reliably."
},
{
  id: "human-alert-precision",
  track: "human", level: "amplifier",
  title: "A low-precision alert is a base rate problem wearing a pager",
  source: "Rob Ewaschuk, My Philosophy on Alerting, appendix to Site Reliability Engineering",
  gateIntro: "A service has thorough alerting: forty rules, most of them firing a few times a week. During a real degradation the correct alert fires within ninety seconds. Nobody acts on it for twenty five minutes.",
  cheat: "Count fires against actions per rule over ninety days; anything below roughly one in four wants deleting or rewriting.",
  idea: "An alert that is usually wrong trains the responder to be slow, and the training is rational.",
  why: "This is conditional probability with a human attached. If a rule fires thirty times a month and two of those are real, the responder's posterior on any given page is about seven percent, so the correct individual response is to finish what they are doing and look in a minute. Every one of those decisions is locally reasonable and the aggregate is a team that cannot respond quickly to anything.\n\nThe damage is not confined to the noisy rule. Precision is learned at the level of the pager, not the rule, so one high-volume low-precision alert degrades response time for every other alert that shares the channel. That is why deleting alerts is usually a bigger availability win than adding them, and why it feels wrong to everyone."
,
  failureMode: "A dashboard with forty alert rules where the team can name the three that mean something. The other thirty seven are not neutral: they are what makes the three slow.",
  experiment: "Pull the last ninety days of pages for one service. For each rule, count fires and count how many led to an action. Any rule below roughly one in four wants deleting or rewriting, and say which out loud to the person who added it.",
  reflection: "Which alert on your rotation has the worst precision, and what has stopped you from deleting it?",
  recall: {
    q: "Why does a noisy alert slow down response to unrelated alerts?",
    a: "Precision is learned at the level of the pager rather than per rule. A responder's prior that any page is real is set by the whole stream, so one high-volume low-precision rule raises the response latency of every alert sharing the channel.\n\nDeleting alerts is therefore often a larger availability improvement than adding them."
  },
  deepDive: "Help me work out a defensible precision threshold for deleting an alert rule, and how to have that conversation with whoever added it."
},
{
  id: "human-symptom-not-cause",
  track: "human", level: "mechanism",
  title: "Page on what the user is feeling, not on what you think causes it",
  source: "Rob Ewaschuk, My Philosophy on Alerting, appendix to Site Reliability Engineering",
  gateIntro: "Alerts exist for queue depth, replica lag, pod restarts, cache hit rate and CPU on every tier. During a two hour degradation in which requests were failing for a subset of tenants, none of them fired.",
  idea: "Alert on the symptom the user experiences, and treat cause-based signals as diagnosis rather than as detection.",
  why: "Cause-based alerts encode a hypothesis about how the system will fail, so they cover the failures you already imagined and miss the ones you did not. Symptom-based alerts have no such dependency: if error rate or latency for a real user journey is bad, something is wrong regardless of which of your hypotheses was right.\n\nThe secondary effect matters as much. Cause-based rules multiply, because every new subsystem brings its own set, and each one is individually plausible. That is how you arrive at forty rules with poor precision. A small number of symptom alerts with good precision, backed by rich cause-level metrics that you look at after being paged, is both more sensitive and quieter."
,
  failureMode: "Full coverage of every internal component and no alert on the thing the customer actually noticed, which is that their syncs stopped completing.",
  experiment: "Write down the three user journeys your service exists to serve. For each, name the single metric that would go bad if it were broken, and check whether an alert exists on it. Count how many of your current rules are causes rather than symptoms.",
  reflection: "How many of your alert rules would still be correct if the architecture changed next quarter?",
  recall: {
    q: "What is the difference between a symptom alert and a cause alert, and why does the distinction affect coverage?",
    a: "A symptom alert fires on what a user experiences; a cause alert fires on an internal condition you believe leads to that. Cause alerts encode a hypothesis, so they cover only the failure modes you already imagined.\n\nCause rules also multiply per subsystem, which is the usual route to a large low-precision alert set. Keep causes as diagnosis and alert on symptoms."
  },
  deepDive: "Help me pick the symptom metrics for a multi-tenant workflow execution service, and identify which of my existing alerts should become dashboards instead."
},
{
  id: "human-local-rationality",
  track: "human", level: "mechanism",
  title: "Everything the responder did made sense from inside the incident",
  source: "Sidney Dekker, The Field Guide to Understanding Human Error",
  gateIntro: "A postmortem records that an engineer restarted a service that did not need restarting, which cleared a cache and extended the outage by an hour. The write-up lists the restart as a contributing factor and the action item is a runbook warning.",
  idea: "People act on the situation as it appeared to them, so the useful question is what made the wrong action look right, not why they chose wrongly.",
  why: "Dekker's central move is to reconstruct the unfolding view rather than judge against the final one. From outside, after the fact, the responder had the whole picture and picked badly. From inside they had a partial, contradictory, time-pressured picture in which the action was the obvious one, and every other competent engineer on the team would have done the same.\n\nThis is not generosity, it is diagnostic technique. If the action was locally rational, then the thing to fix is whatever made it look right: an ambiguous dashboard, a runbook that did not mention the cache, a metric that had gone stale without saying so. A warning in a runbook fixes nothing, because the responder was not short of warnings. They were short of the information that would have made the warning apply to them."
,
  failureMode: "An action item that reads \"remind the team not to restart the service during an incident\", written about an engineer who had no way to know that this time was different.",
  experiment: "Take a decision from your last incident that turned out wrong. Write down only what was visible on screen at that moment, with no later knowledge. Then ask what would have had to be different on that screen for the other choice to look obvious.",
  reflection: "Where in your last write-up did you describe a decision using information the person did not have at the time?",
  recall: {
    q: "What does local rationality mean, and what does it change about an action item?",
    a: "People act sensibly given the information available to them at the time, so a wrong action indicates the situation looked different from inside than it does in hindsight.\n\nThe action item therefore has to change what was visible - a dashboard, a signal, a default - rather than tell people to be more careful, because they were not short of care."
  },
  deepDive: "Take a decision from an incident I will describe and help me reconstruct what was visible at the time, then tell me which signal would have changed it."
},
{
  id: "human-complex-systems-fail",
  track: "human", level: "mechanism",
  title: "Your system is already running in degraded mode right now",
  source: "Richard I. Cook, How Complex Systems Fail",
  gateIntro: "A service has run without incident for eight months. In the week after a routine dependency upgrade it fails twice in three days, in two apparently unrelated ways.",
  idea: "Complex systems run continuously in a partially broken state, and an incident is when several of those latent faults line up rather than when one thing breaks.",
  why: "Cook's argument is that catastrophe requires multiple contributors, each insufficient alone. That has an uncomfortable corollary: the system was already carrying most of the faults involved in today's incident yesterday, and the day before, while it appeared healthy. Apparent health is the system's defences absorbing faults, not the absence of faults.\n\nThis reframes two things. Root cause becomes the wrong shape of question, because there is no single point whose removal prevents the outcome; you are choosing which of several necessary contributors to name. And it explains why change so often precedes failure without being the cause: a change does not usually introduce all the contributors, it removes one of the defences that was quietly absorbing the others."
,
  failureMode: "A write-up that names one root cause, fixes it, and is surprised when a different combination of the same latent faults produces a similar outcome two months later.",
  experiment: "List the things currently broken or degraded in your system that nobody is treating as an incident: a disabled alert, a retry with no cap, a stale runbook, a node pool at ninety percent. That list is the raw material for your next outage.",
  reflection: "Which single defence, if removed tomorrow, would turn three tolerable faults you already have into an incident?",
  recall: {
    q: "Why is root cause the wrong shape of question in a complex system?",
    a: "Catastrophe requires several contributors, each insufficient on its own, so there is no single point whose removal would have prevented the outcome. Naming one root cause is choosing which necessary contributor to write down.\n\nIt also explains why change precedes failure so often: change usually removes a defence that was absorbing faults already present rather than introducing every contributor."
  },
  deepDive: "Help me build the list of latent faults my platform is currently carrying, and rank them by how many other faults they would have to combine with to cause an incident."
},
{
  id: "human-hindsight-bias",
  track: "human", level: "amplifier",
  title: "The write-up reads as obvious because you already know the ending",
  source: "Baruch Fischhoff, Hindsight is not equal to Foresight, 1975",
  gateIntro: "A review meeting for a four hour outage keeps returning to the same point: the signal was on the dashboard the whole time. Several people say some version of how did nobody see it. The engineer who was on call says very little.",
  idea: "Knowing the outcome makes the path to it look inevitable, which systematically corrupts both the analysis and the action items.",
  why: "Fischhoff called it creeping determinism: once an outcome is known, people cannot recover their own prior uncertainty, and they overestimate how predictable it was. In an incident review this does specific damage. The signal that mattered is obvious now because you know which of the forty signals mattered; at the time it was one of forty, most of which were also anomalous.\n\nThe practical consequence is that hindsight-driven action items are almost always some form of look harder, which cannot be implemented. Worse, the bias falls on a person who is in the room, so the review teaches the team that being on call during a bad incident is professionally expensive. That is the mechanism by which a nominally blameless process still suppresses reporting."
,
  failureMode: "The phrase \"it should have been obvious that\" appearing in a document written by people who have known the answer for a week, about a person who had ninety seconds and no answer.",
  experiment: "In your next review, before revealing the cause, show the group only the signals that were visible at the thirty minute mark and ask them to write down a hypothesis. Keep the hypotheses. They are the honest measure of how obvious it was.",
  reflection: "When you last thought someone missed something obvious during an incident, how many other things were simultaneously anomalous on that screen?",
  recall: {
    q: "What is creeping determinism and what does it do to incident action items?",
    a: "Fischhoff's finding that knowing an outcome makes it seem more predictable than it was, and that people cannot recover their own prior uncertainty.\n\nIt produces action items of the form look harder, which cannot be implemented, and it concentrates implied blame on whoever was on call, which suppresses future reporting even in a nominally blameless process."
  },
  deepDive: "Help me design a review format that surfaces what was actually knowable at each point in the timeline rather than what is obvious now."
},
{
  id: "human-dashboard-ambiguity",
  track: "human", level: "amplifier",
  title: "A signal that stops when the situation worsens teaches the wrong lesson",
  source: "BEA, Final Report on the accident to Airbus A330-203 flight AF 447, 2012",
  gateIntro: "Air France 447, 1 June 2009, over the Atlantic. Airspeed indications became briefly unreliable and the autopilot disengaged, handing an aircraft in cruise to the crew. During the descent that followed, a warning that was correctly indicating the aircraft's condition ceased whenever the crew moved the controls toward the recovery action, and resumed when they moved them back.",
  cheat: "Work out what your first-look panel renders when the service is fully down; blank or zero reads as healthy, so add a no-data alert.",
  idea: "An indicator whose validity logic silences it in the extreme case can invert the feedback a responder is learning from.",
  why: "The stall warning on the A330 is suppressed when measured airspeed falls below a validity threshold, on the reasonable ground that the sensors cannot be trusted at very low airspeed. At the extreme angle of attack the aircraft reached, that condition was met, so the warning stopped. Pushing the nose down restored valid airspeed and the warning resumed. Every correct input was followed by the alarm returning, and every incorrect input by silence.\n\nThe transferable point is not about aviation. Any signal with a validity gate can go quiet in exactly the regime where it matters most, and a responder cannot distinguish quiet-because-fine from quiet-because-unmeasurable. A metric that disappears when a service is fully down looks identical to a metric that is healthy, and dashboards render both as an absence."
,
  failureMode: "A latency panel that goes blank when the service stops serving entirely, next to an error rate that also goes to zero because no requests are being recorded. Both read as green to someone scanning.",
  experiment: "Pick one Grafana panel you would look at first during an incident. Work out what it renders when the service is completely down rather than degraded. If the answer is an empty chart or a zero, add a no-data alert or a staleness indicator today.",
  reflection: "Which of your dashboards cannot distinguish between healthy and not reporting?",
  recall: {
    q: "What is the failure mode of a signal with a validity gate, and what is the dashboard equivalent?",
    a: "The signal can be suppressed precisely in the extreme regime where it matters, so the responder receives feedback that rewards the wrong action. AF447's stall warning stopped at very low measured airspeed and resumed when the crew pushed forward.\n\nThe dashboard equivalent is a metric that goes to zero or blank when a service is fully down, which renders identically to healthy."
  },
  deepDive: "Help me audit my primary incident dashboard for panels that render the same way when the service is healthy and when it is not reporting at all."
},
{
  id: "human-fixation",
  track: "human", level: "amplifier",
  title: "Three people on the interesting problem and nobody on the boring one",
  source: "NTSB, Aircraft Accident Report AAR-73-14, Eastern Air Lines Flight 401, 1972",
  gateIntro: "Eastern Air Lines 401, 29 December 1972, approaching Miami at night. A single indicator lamp for the nose landing gear failed to illuminate. The aircraft was placed in a hold at two thousand feet while the crew investigated the lamp. All three flight crew and a jump-seat occupant became involved in the investigation.",
  idea: "A team that converges on one salient problem stops monitoring the state that was previously safe, and nobody notices the handoff because nobody made one.",
  why: "The Everglades crash is the standard case because the presenting fault was trivial and entirely survivable: a burnt-out bulb. What killed the aircraft was that the autopilot was inadvertently disengaged and a slow descent went unobserved while every qualified person present was looking at the same small thing. Attention had been silently reallocated without anyone deciding to reallocate it.\n\nIncidents produce exactly this geometry. The interesting hypothesis attracts everyone, partly because it is interesting and partly because being on it is visibly useful. The unglamorous work of watching whether the overall situation is getting worse is nobody's job unless it is explicitly somebody's job, which is the entire reason incident command separates the commander from the investigators."
,
  failureMode: "A war room where six engineers are deep in one theory for forty minutes, the theory turns out to be wrong, and in the meantime a second region started failing and nobody saw it.",
  experiment: "In your next incident of more than twenty minutes, name one person whose only task is to watch top-level state and the clock, and who is explicitly barred from investigating. Note at the end whether they caught anything.",
  reflection: "In your last multi-person incident, who was watching whether the overall situation was deteriorating, and did they know that was their job?",
  recall: {
    q: "What is the failure mode Eastern 401 illustrates, and what is the structural fix?",
    a: "Collective fixation: every qualified person converged on one salient minor fault while the previously safe overall state deteriorated unobserved, because attention was reallocated without anyone deciding to.\n\nThe fix is structural rather than a reminder - separate the incident commander from the investigators and make monitoring overall state an explicit assigned role."
  },
  deepDive: "Help me write a lightweight incident command role split for a team of six that does not feel like bureaucracy for a twenty minute incident."
},
{
  id: "human-ironies-of-automation",
  track: "human", level: "mechanism",
  title: "Automation takes the easy work and leaves the operator the hard part, unpractised",
  source: "Lisanne Bainbridge, Ironies of Automation, Automatica, 1983",
  gateIntro: "A platform team automates failover. For fourteen months it works, and the manual procedure is not run. In month fifteen the automation fails partway through, leaving the system in a state the runbook does not describe, and the person on call has never performed the manual steps.",
  idea: "Automating the routine cases leaves humans responsible for exactly the rare, hard cases, while removing the practice that would have made them competent at those cases.",
  why: "Bainbridge's two ironies are still the sharpest statement of this. The designer automates what they can and leaves the operator whatever could not be automated, which is by construction the harder residue. And the operator is then asked to monitor a process they no longer perform, which humans are poor at, and to take over at precisely the moments when the automation has given up, which are the worst moments.\n\nThe skill decay is the part teams underestimate. Competence at a manual procedure is maintained by performing it, and successful automation removes every routine opportunity to perform it. So the capability curve falls exactly while confidence in the automation rises, and the two cross somewhere before the first partial failure."
,
  failureMode: "A runbook whose first line is \"normally this is automatic\" and whose remaining steps have not been executed by anyone currently on the team.",
  experiment: "Name one thing your platform does automatically that a human would have to finish if it half-failed. Check when a human last did it end to end. If the answer is more than six months or nobody currently on the team, schedule a rehearsal.",
  reflection: "Which of your automated procedures has the largest gap between how confident the team is and when they last performed it manually?",
  recall: {
    q: "What are Bainbridge's two ironies of automation?",
    a: "First, the designer automates what is easy to automate and leaves the operator the residue, which is by construction the harder part. Second, the operator is asked to monitor a process they no longer perform and take over when the automation fails, which is the worst possible moment.\n\nThe consequence is skill decay: competence falls while confidence in the automation rises."
  },
  deepDive: "Help me identify which of my team's automated operational procedures need a scheduled manual rehearsal, and how often."
},
{
  id: "human-normalised-deviance",
  track: "human", level: "mechanism",
  title: "The signal did not get missed, it got reclassified as normal",
  source: "Diane Vaughan, The Challenger Launch Decision, 1996",
  gateIntro: "A metric that was defined as an alert condition two years ago now exceeds that threshold most weeks. The threshold has been raised twice. Nobody has ever decided that the underlying condition is acceptable; each individual adjustment was reasonable given the data at the time.",
  idea: "Repeated exposure to an anomaly that has not yet caused harm converts it into the expected state, one defensible decision at a time.",
  why: "Vaughan's study of Challenger found no villain and no moment of recklessness. O-ring erosion had been observed on earlier flights, and each time it was analysed, bounded, and accepted, because each time the flight had succeeded. The evidence of a problem was continuously reinterpreted as evidence that the problem was survivable. She called the result normalisation of deviance, and its defining feature is that every step is locally defensible.\n\nWhat makes it hard to catch from inside is that there is no decision to point at. The organisation never decides to accept the risk; it accumulates a series of narrow judgements whose combined effect is exactly that. The only reliable countermeasure is a written record of the original threshold and why it was set there, because the argument you cannot reconstruct is the one you cannot re-examine."
,
  failureMode: "An alert that has been muted, then rescoped, then rethresholded, and a team that would struggle to say what the original number was protecting against.",
  experiment: "Pick one threshold your team has relaxed in the last year. Find the original value and the reason it was set. If the reason is not written anywhere, that is the finding, and writing it down now is the day's work.",
  reflection: "Which recurring anomaly in your system has become background noise without anyone ever deciding it was acceptable?",
  recall: {
    q: "What is normalisation of deviance and why is it hard to detect from inside?",
    a: "Repeated exposure to an anomaly that has not yet caused harm converts it into the expected state through a series of individually defensible judgements. Vaughan found this in Challenger's O-ring erosion history.\n\nIt is hard to detect because there is no decision to point at - the organisation never accepts the risk explicitly, it accumulates narrow judgements whose combined effect is acceptance."
  },
  deepDive: "Help me audit the thresholds my team has relaxed over the past year and work out which ones were protecting against something we have stopped thinking about."
},
{
  id: "human-drift-to-danger",
  track: "human", level: "mechanism",
  title: "Efficiency pressure moves the system toward the boundary and nothing pushes back",
  source: "Jens Rasmussen, Risk management in a dynamic society, Safety Science, 1997",
  gateIntro: "Over eighteen months a team's deploy process loses its staging soak, then its manual approval, then its canary window shrinks from an hour to ten minutes. Each change was justified by a real cost, shipped without incident, and never reviewed as a set.",
  idea: "Systems migrate toward the boundary of safe operation under continuous pressure for efficiency, because every step toward it is rewarded and only crossing it is punished.",
  why: "Rasmussen models the operating point as pushed by gradients: management pressure toward efficiency, individual pressure toward least effort, and a boundary of acceptable performance that is invisible until crossed. Nothing in that field pushes back toward safety, because the margin you are consuming is by definition not being used. Every removal of a safeguard that did not cause an outage is evidence, of a kind, that the safeguard was unnecessary.\n\nThe operational implication is that safety margin has to be defended explicitly by someone whose job it is, or it will be spent. It also explains why the incident that finally happens is so often preceded by a long run of successful changes in the same direction: that run is not evidence against the risk, it is the mechanism of the drift."
,
  failureMode: "An outage whose write-up says the canary window was too short, in a team that shortened it three times, each time correctly observing that the previous shortening had caused no problems.",
  experiment: "List the safeguards your deploy or migration process has shed in the last year, as a single set rather than individually. Ask whether you would adopt the current process from scratch today.",
  reflection: "What margin is your team currently spending that nobody has been assigned to defend?",
  recall: {
    q: "In Rasmussen's model, why does a system drift toward its safety boundary?",
    a: "Management pressure toward efficiency and individual pressure toward least effort both push the operating point toward the boundary, and nothing pushes back, because unused margin looks like waste.\n\nEach step that does not cause an incident reads as evidence the margin was unnecessary, so a run of successful changes in one direction is the mechanism of the drift rather than evidence against the risk."
  },
  deepDive: "Help me list the safety margins in my deployment and migration process and identify which ones currently have a named defender."
},
{
  id: "human-handover",
  track: "human", level: "recovery",
  title: "The second shift inherits the conclusions and not the evidence",
  source: "Sidney Dekker, The Field Guide to Understanding Human Error, on handover and coordination",
  gateIntro: "An incident passes six hours and crosses a timezone. The incoming responders are briefed in ten minutes. Over the next two hours they re-run two diagnostic steps the previous shift had already completed, and they continue pursuing a hypothesis the previous shift had privately started to doubt.",
  idea: "A handover transfers the current theory efficiently and the reasons for it badly, so the incoming shift inherits a conclusion they cannot re-examine.",
  why: "Under time pressure a briefing compresses to state and plan: here is what is broken, here is what we think, here is what to try next. What compresses away is the evidence trail and, critically, the confidence level. The incoming responders receive the hypothesis as established rather than as a leading candidate, so the natural act of questioning it is skipped precisely when a fresh perspective was the main thing the handover had to offer.\n\nRuled-out branches suffer the same way in reverse. If the outgoing shift does not hand over what they eliminated and how, the incoming shift either wastes time re-eliminating it or, worse, assumes it was eliminated properly when it was eliminated in a hurry. Both failure directions are fixed by the same discipline: hand over evidence and confidence, not just conclusions."
,
  failureMode: "Hour seven of an incident, with the current theory being the one someone proposed in hour two, still unchallenged, because everyone since has received it as background rather than as a claim.",
  experiment: "Write a handover template with four fields and put it in the runbook today: what we know and how we know it, what we have ruled out and how confidently, current hypothesis with a confidence level, and what we have not looked at.",
  reflection: "In your last long incident, did the incoming shift ever challenge the standing hypothesis, and if not, was that because it was right?",
  recall: {
    q: "What does a compressed incident handover lose, and what is the consequence?",
    a: "It transfers state and plan but drops the evidence trail and the confidence level, so the incoming shift receives a leading hypothesis as an established one and does not question it.\n\nIt also loses what was ruled out and how carefully, which either wastes time on re-elimination or hides a branch that was dismissed in a hurry."
  },
  deepDive: "Help me write an incident handover template for a team spanning Sydney and a European timezone, short enough to actually be used at 3am."
},
{
  id: "human-blameless-requires",
  track: "human", level: "recovery",
  title: "Blameless is a property of the consequences, not of the wording",
  source: "John Allspaw, Blameless PostMortems and a Just Culture, Etsy, 2012",
  gateIntro: "A company adopts blameless postmortems. The template says so and the facilitator opens by saying so. Eighteen months later, engineers still quietly resolve small incidents without declaring them, and the phrase used internally is that it is not worth the paperwork.",
  idea: "A postmortem is blameless only if being the person at the centre of one is professionally free, which is a claim about promotion and performance rather than about language.",
  why: "Allspaw's argument is that the point of the practice is to buy information: the only person who can explain why an action looked right is the person who took it, and they will only explain it fully if doing so is safe. Removing accusatory language is necessary and does almost nothing on its own, because people calibrate on what happens afterwards rather than on how the meeting was phrased.\n\nSo the test is behavioural. Does the person at the centre of a large incident get asked to present it, and does that presentation read as expertise rather than as penance. Does an incident appear in a performance review. Do near misses with no customer impact get written up at all, which is the sharpest indicator, because reporting a near miss is pure cost to the reporter unless the culture genuinely rewards it. A drop in reported incidents after adopting the practice is not an improvement."
,
  failureMode: "A blameless template, a facilitator who uses the word, and a near-miss reporting rate of zero, which means the information the practice exists to collect is not being collected.",
  experiment: "Count near misses reported in the last quarter: incidents with no customer impact that were written up anyway. If the number is near zero, the practice is not working regardless of what the template says.",
  reflection: "What would happen to someone on your team who wrote up a near miss that made their own earlier decision look bad?",
  recall: {
    q: "What is the behavioural test for whether a postmortem process is genuinely blameless?",
    a: "Whether being at the centre of an incident is professionally free: whether that person presents it as expertise, whether it reaches a performance review, and above all whether near misses with no customer impact get written up.\n\nRemoving accusatory language is necessary and nearly inert on its own, because people calibrate on consequences rather than on wording."
  },
  deepDive: "Help me design a near-miss reporting mechanism for my team that has a low enough cost to the reporter that it actually gets used."
},
{
  id: "human-public-postmortems-understate",
  track: "human", level: "recovery",
  title: "Read every public postmortem knowing what it is not allowed to say",
  source: "Columbia Accident Investigation Board, Report Volume I, 2003",
  gateIntro: "A collection of a hundred public incident write-ups is analysed for causes. Configuration change, dependency failure and capacity dominate the list. Staffing, ownership gaps, schedule pressure and known-but-unfunded risk appear almost nowhere.",
  idea: "Public postmortems are written by the organisation being described, so they systematically report the causes that are safe to report.",
  why: "This is the correction to apply to every other entry in this library. A vendor write-up is simultaneously an engineering document and a customer communication, and the second role rules out whole categories of true cause: we were understaffed, we had known for a year, the owner left and nobody replaced them, the fix was deprioritised for a launch. What survives is technical, specific and blameless in the corporate sense, which is exactly why the corpus of public postmortems is so heavily weighted toward mechanism.\n\nThe contrast worth studying is an investigation with subpoena power and no reputation to protect. The Columbia board devoted a substantial part of its report to organisational causes, concluding that they were rooted in the programme's history and culture, and it treated those as causes rather than as context. Aviation and marine investigators write the same way. Reading one of those alongside a vendor write-up is the fastest way to calibrate how much is missing from the vendor one."
,
  failureMode: "A team that has read two hundred public postmortems and has an excellent catalogue of technical mechanisms and no model at all of how organisations arrive at them.",
  experiment: "Take one vendor postmortem you found useful. Write the three sentences it would contain if the organisation had nothing to protect. Then check whether any of those three describe your own team.",
  reflection: "In your own last write-up, what was true, causal, and left out because of who would read it?",
  recall: {
    q: "Why are public postmortems systematically biased, and what corrects for it?",
    a: "They are written by the organisation described and double as customer communication, so causes like understaffing, ownership gaps, schedule pressure and known-but-unfunded risk are omitted, leaving a technical, mechanism-heavy record.\n\nThe correction is to read investigations by bodies with subpoena power and no reputation at stake - the CAIB report on Columbia treats organisational causes as causes - and to note the difference."
  },
  deepDive: "Help me write the organisational half of a postmortem for an incident on my team, the part a public version would leave out, so I can decide what to raise internally."
}
);

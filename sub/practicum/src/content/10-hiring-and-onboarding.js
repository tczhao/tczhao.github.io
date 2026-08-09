/* Track: Hiring and onboarding. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "structured-beats-intuition",
  track: "hiring", level: "both",
  title: "Your interview intuition is worse than a checklist",
  source: "Laszlo Bock, Work Rules!",
  idea: "The selection research is consistent and unflattering: unstructured interviews predict job performance poorly. Structured interviews - same questions, defined rubric, independent scoring - predict substantially better.",
  why: "An unstructured interview mostly measures how comfortable the interviewer feels, which correlates with similarity rather than capability. Because the impression forms in the first minutes, the remaining time is spent gathering support for it, and the interviewer experiences that as evidence.\n\nStructure works by removing the degrees of freedom that let bias operate. Same questions in the same order means candidates are compared on the same axis. A rubric written in advance means you decide what good looks like before you know who gave the answer.",
  failureMode: "A loop where each interviewer improvises, everyone reports a strong gut feel, and the hire fails within a year. The debrief was confident and unanimous. Nobody can reconstruct what was actually assessed.",
  experiment: "For your next role, write the four questions every interviewer will ask and what a strong, adequate and weak answer looks like for each. Do this before you see any applications.",
  reflection: "In your last interview, what specifically did you assess, and could another interviewer have scored the same answer the same way?",
  recall: {
    q: "Why does an unstructured interview predict poorly?",
    a: "It largely measures interviewer comfort, which tracks similarity rather than capability - and the impression forms in minutes, so the rest is spent gathering support for it.\n\nStructure removes the degrees of freedom bias operates in: same questions, and a rubric written before you know who answered."
  },
  deepDive: "Help me design a structured interview for a role I will describe, including the rubric for each question."
},
{
  id: "work-sample-is-the-signal",
  track: "hiring", level: "both",
  title: "Watch them do the work",
  source: "Laszlo Bock, Work Rules!",
  idea: "The best available predictor is a sample of the actual work. Any interview format that resembles the job beats any format that tests adjacent abilities.",
  why: "Puzzles, trivia and algorithm recall test something, but not the thing you are hiring for. A candidate debugging unfamiliar code, reviewing a design, or writing a short document shows you judgement under realistic conditions - and shows the candidate what the job is, which improves their decision too.\n\nThe practical constraint is fairness and time. A good work sample is bounded, does not require unpaid work of real value, and is the same for every candidate. Those constraints are satisfiable and mostly ignored.",
  failureMode: "A loop of whiteboard algorithm questions hiring for a role that is 80% reading unfamiliar code and negotiating with other teams. The people who pass are good at the filter, and the correlation with the job is weak enough to be luck.",
  experiment: "Write down the three things someone in this role will actually do most. Then check whether any stage of your current loop resembles any of them. Replace the least relevant stage.",
  reflection: "What does your interview loop select for, and how close is that to what the job requires?",
  recall: {
    q: "What is the strongest predictor in hiring, and what constrains its use?",
    a: "A sample of the actual work - it shows judgement under realistic conditions and shows the candidate what the job is.\n\nConstraints: bounded in time, not unpaid work of real value, and identical for every candidate. All satisfiable, mostly ignored."
  },
  deepDive: "Help me design a fair, bounded work sample for a role, based on what the job actually involves day to day."
},
{
  id: "define-the-bar-first",
  track: "hiring", level: "both",
  title: "Write the bar before you meet anyone",
  source: "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise",
  idea: "Decide what the role requires and what evidence would demonstrate it before seeing candidates. Afterwards, the criteria bend to fit whoever you liked.",
  why: "Once you have met an impressive person, the requirements quietly reshape around their strengths - this is motivated reasoning, and it is undetectable from inside. Written criteria are a commitment device that survives contact with a charming candidate.\n\nIt also protects against the opposite error. A candidate strong on exactly what the role needs but weak on something you never actually required can be correctly hired, which is hard to do when 'the bar' is a feeling reconstructed per candidate.",
  failureMode: "A team that hires an impressive generalist for a role needing deep specific expertise, having revised the job description in the debrief without noticing. Six months later the gap is obvious and nobody made a wrong-feeling decision at any point.",
  experiment: "Before opening a role, write the three must-haves and the three nice-to-haves, and what evidence would satisfy each. Circulate it to the loop. Refer back to it in the debrief, out loud.",
  reflection: "In your last hire, would the written criteria have selected the person you chose?",
  recall: {
    q: "Why must criteria be written before meeting candidates?",
    a: "After meeting someone impressive the requirements quietly reshape around their strengths, and the motivated reasoning is undetectable from inside.\n\nWritten criteria are a commitment device - and they also let you correctly hire someone weak on things you never actually required."
  },
  deepDive: "Help me write must-have and nice-to-have criteria for a role, with the evidence that would satisfy each."
},
{
  id: "independent-before-discussion",
  track: "hiring", level: "both",
  title: "Score independently before anyone speaks",
  source: "Daniel Kahneman, Olivier Sibony and Cass Sunstein, Noise",
  cheat: "Collect a written score and one line of reasoning from every interviewer before anyone talks in the debrief.",
  idea: "In a debrief, the first confident opinion anchors everyone else. Collecting written independent assessments before discussion preserves the information you convened the group to get.",
  why: "The value of multiple interviewers is multiple independent observations. Discussion-first destroys the independence: people update toward the first strong view, especially if it comes from someone senior, and the group converges on an opinion held by one person while feeling like consensus.\n\nWriting first costs three minutes and preserves the disagreement, which is the useful part. Two interviewers who scored differently on the same dimension have found something worth examining.",
  failureMode: "A debrief where the hiring manager speaks first, decisively. Everyone else moderates their reservations, the hire proceeds, and two people later admit they had concerns. The process gathered five opinions and used one.",
  experiment: "In your next debrief, require everyone to submit a written score and one line of reasoning before anyone talks. Read them out before discussing. Note how much more disagreement exists than usually surfaces.",
  reflection: "In your last debrief, who spoke first, and how much did the discussion diverge from their view?",
  recall: {
    q: "Why collect written assessments before a hiring discussion?",
    a: "Multiple interviewers are only valuable as independent observations, and discussion-first destroys that - people update toward the first strong view, especially a senior one, and call the result consensus.\n\nWriting first preserves the disagreement, which is the informative part."
  },
  deepDive: "Help me redesign my debrief process to preserve independent judgement, and anticipate the objections."
},
{
  id: "cost-of-bad-hire-vs-missed-hire",
  track: "hiring", level: "both",
  title: "Know which error you are optimising against",
  source: "Standard hiring practice",
  idea: "A bad hire and a missed good candidate are both costly, and the costs are wildly asymmetric depending on team size and context. Decide which one you are guarding against, explicitly.",
  why: "On a small team a bad hire is close to catastrophic - they consume mentoring capacity, damage delivery, and are slow and painful to remove. There, a high bar and tolerating an empty seat is correct. On a large team with strong onboarding and a functioning performance process, the calculus shifts and excessive caution costs more.\n\nThe error is having no position on this, which defaults to whichever error is more socially visible. Rejecting a good candidate is invisible; a bad hire is not. So teams drift toward over-caution without ever deciding to.",
  failureMode: "An eight-month vacancy on a five-person team while the bar is held at a level nobody currently on the team would clear. The team burns out covering the gap, which costs more than any plausible mis-hire would have.",
  experiment: "Write down which error is more expensive for your team right now, and one sentence why. Share it with your interview loop so they calibrate the same way.",
  reflection: "What has your open role already cost your team, and how does that compare to the risk you are avoiding?",
  recall: {
    q: "Why do teams drift toward over-caution in hiring?",
    a: "Rejecting a good candidate is invisible; a bad hire is highly visible - so absent an explicit position, the default guards against the socially costly error.\n\nThe right answer depends on team size, onboarding strength and how well the performance process works."
  },
  deepDive: "Help me reason about which hiring error is more expensive for my team right now, given our size and situation."
},
{
  id: "diverse-slate",
  track: "hiring", level: "both",
  title: "One candidate from an underrepresented group has almost no chance",
  source: "Johnson, Hekman and Chan, Harvard Business Review",
  cheat: "If your finalist pool has exactly one of anything, hold the decision and extend sourcing rather than deciding from that slate.",
  idea: "Research on finalist pools found that when only one candidate differs from the norm, their odds of selection are close to zero. Two changes the outcome substantially.",
  why: "A single different candidate is read as an exception against a pattern, and the pattern is what feels like the safe choice. With two, difference stops being the distinguishing feature and the comparison moves to actual merits.\n\nThis makes slate composition a decision point rather than a passive outcome. It is also actionable at exactly the moment when most processes have stopped paying attention - the point where you have a finalist list and are about to compare.",
  failureMode: "A conscientious process that sources widely and ends with one candidate from an underrepresented group among four finalists. They are not selected, everyone's reasoning is defensible, and the outcome was largely determined before the comparison began.",
  experiment: "Look at your current finalist pool. If it has exactly one of anything, hold the decision and extend sourcing rather than deciding from that slate.",
  reflection: "What has the composition of your last three finalist pools been, and did you notice at the time?",
  recall: {
    q: "What did the research find about single underrepresented candidates in finalist pools?",
    a: "Their odds of selection are close to zero, because one different candidate reads as an exception against a pattern and the pattern feels like the safe choice.\n\nWith two, difference stops being the distinguishing feature and the comparison shifts to actual merits."
  },
  deepDive: "Help me think through how to build genuinely comparable finalist slates rather than fixing composition at the last stage."
},
{
  id: "sell-the-role-honestly",
  track: "hiring", level: "both",
  title: "Describe the job as it is, including the bad parts",
  source: "Standard hiring practice",
  idea: "Overselling a role gets you an acceptance and a resignation nine months later. Naming the genuinely unattractive parts filters correctly and buys enormous credibility with whoever accepts.",
  why: "Candidates discount enthusiasm heavily because every company is enthusiastic. Specific honesty is unusual and therefore informative: 'the on-call is genuinely heavy right now and here is what we are doing about it' is more persuasive to a good candidate than any list of perks, because it signals you can be trusted about everything else.\n\nIt also selects for fit. Someone who joins knowing about the legacy system does not resent it in month three, because it was part of what they agreed to.",
  failureMode: "A hire made on a description of the role as it will be after a planned migration. They arrive to the current state, feel misled, and leave within the year. Nobody lied - the pitch was aspirational and the candidate heard it as a description.",
  experiment: "Write the three least attractive true things about the role. Say them in your next candidate conversation, with what you are doing about each. Notice which candidates lean in.",
  reflection: "What does your job pitch omit that a new hire discovers in their first month?",
  recall: {
    q: "Why does naming the bad parts of a role persuade good candidates?",
    a: "Candidates discount enthusiasm because everyone is enthusiastic - specific honesty is unusual and signals you can be trusted about everything else.\n\nIt also selects for fit: someone who joined knowing about the legacy system does not resent it in month three."
  },
  deepDive: "Help me articulate the genuinely unattractive parts of a role honestly, with credible mitigations."
},
{
  id: "first-week-should-ship",
  track: "hiring", level: "team",
  title: "Get them to production in week one",
  source: "Standard onboarding practice",
  idea: "A small real change deployed in the first few days teaches the whole delivery path and establishes that they can contribute. Weeks of reading documentation teaches neither.",
  why: "The first shipped change forces them through every step - environment, build, review, deploy, verify - which is the knowledge they need most and the hardest to acquire by reading. It also surfaces the broken parts of your onboarding immediately, while someone is looking at them with fresh eyes.\n\nThe psychological effect matters too. Contributing early converts a new person from a guest into a participant, and the alternative - two weeks of reading with no output - produces anxiety that slows everything that follows.",
  failureMode: "A structured two-week reading programme followed by a first task in week three. The new hire has absorbed context they cannot yet use, has not touched the pipeline, and feels unproven. The first real change takes twice as long as it should.",
  experiment: "Keep a standing list of genuinely small, genuinely useful changes suitable for a first day. Add to it whenever you notice one. Have the next new person ship one before they finish reading anything.",
  reflection: "How long did your last new hire take to deploy something, and what did they spend that time doing instead?",
  recall: {
    q: "Why does shipping something small in week one beat reading documentation?",
    a: "It forces them through the whole delivery path - environment, build, review, deploy, verify - which is the hardest knowledge to acquire by reading, and it surfaces broken onboarding while someone has fresh eyes.\n\nIt also converts them from guest to participant, which removes the anxiety that slows everything after."
  },
  deepDive: "Help me build a first-week onboarding plan that gets someone to production quickly without setting them up to fail."
},
{
  id: "first-90-days-diagnose",
  track: "hiring", level: "both",
  title: "Diagnose the situation before you prescribe",
  source: "Michael Watkins, The First 90 Days",
  idea: "Watkins separates situations - a turnaround, a realignment, sustaining success, a startup - because each requires a different opening move. Applying the wrong playbook is the standard new-leader failure.",
  why: "A turnaround needs decisive action and tolerates disruption, because the current state is failing and everyone knows it. Sustaining success needs the opposite: the existing system works, and aggressive change destroys value while looking like leadership. The same behaviour is correct in one and disastrous in the other.\n\nSo the first task is diagnosis, not action - which is uncomfortable, because new leaders feel pressure to demonstrate impact early and diagnosis is invisible.",
  failureMode: "A new manager who arrives at a healthy team and reorganises it, because that is what leadership looked like in their last role, which was a turnaround. The team was working. Six months of value is lost and the manager is confident they showed initiative.",
  experiment: "If you are new to a team, write down which of the four situations you are in and the evidence. If you are not new, do it anyway - your read may be out of date.",
  reflection: "What situation is your team actually in, and does your current behaviour match it?",
  recall: {
    q: "Why does the same leadership behaviour succeed and fail depending on situation?",
    a: "A turnaround needs decisive disruption because the current state is visibly failing. Sustaining success needs the opposite - aggressive change destroys working value while looking like leadership.\n\nSo diagnosis comes before action, which is uncomfortable because it is invisible and new leaders feel pressure to show impact."
  },
  deepDive: "Help me diagnose which situation my team is in, and what opening moves that implies."
},
{
  id: "reference-checks-work",
  track: "hiring", level: "both",
  title: "Back-channel references, asked properly",
  source: "Standard hiring practice",
  idea: "References are usually wasted by asking questions that can only be answered positively. A specific comparative question produces real information.",
  why: "'Would you recommend them?' has one socially available answer. 'What would they need to be successful in a role that is mostly ambiguous, cross-team work?' invites a real answer, because it is framed as helping rather than as judging. So does 'where would you place them among the engineers you have worked with at that level?'\n\nThe most informative signal is often what is not said, and the willingness of a former colleague to be enthusiastic in specifics. Vague warmth from someone who worked closely with a candidate is data.",
  failureMode: "A reference call that consists of confirming employment dates and receiving generic praise. It has told you nothing, has taken half an hour, and creates a false sense that the candidate was checked.",
  experiment: "For your next reference call, prepare two questions: one about the conditions under which the person does their best work, and one comparative. Ask nothing that can be answered with 'yes, they were great'.",
  reflection: "What did your last reference check actually tell you that you did not already believe?",
  recall: {
    q: "What makes a reference question informative?",
    a: "Framing it as helping rather than judging, and making it specific or comparative - what would they need to succeed in this kind of role, or where would you place them among peers at that level.\n\nVague warmth from someone who worked closely with them is itself data."
  },
  deepDive: "Help me write reference-check questions that produce real information for a specific role."
},
{
  id: "hiring-is-the-managers-job",
  track: "hiring", level: "both",
  title: "Sourcing is your job, not the recruiter's",
  source: "Standard practice among fast-growing teams",
  idea: "The strongest candidates are usually not applying. Reaching them requires the hiring manager's own network and time, which no recruiter can substitute for.",
  why: "Inbound applications are drawn from people currently looking, which is a specific and not-especially-favourable sample. The people who would be best are employed, not searching, and reachable mainly through someone they already trust.\n\nWhich means the highest-leverage hiring activity is maintaining relationships with good engineers over years, before you have a role. Managers who treat hiring as something that begins when a requisition opens are structurally limited to whoever happens to be available.",
  failureMode: "A role open for five months, filled from inbound applications with an adequate candidate, while three people the manager has worked with previously and rates highly were never contacted because it felt awkward.",
  experiment: "List five engineers you have worked with who you would hire. Contact one this week with no role attached - just to catch up. This is the pipeline.",
  reflection: "When you last had a role open, how many people did you personally reach out to?",
  recall: {
    q: "Why can a recruiter not substitute for the hiring manager in sourcing?",
    a: "The strongest candidates are employed and not searching, so they are reachable mainly through someone they already trust.\n\nThat makes the highest-leverage activity maintaining relationships over years, before a role exists - managers who start at the requisition are limited to whoever is available."
  },
  deepDive: "Help me build a habit of maintaining a personal hiring pipeline, including how to reach out without it being transactional."
},
{
  id: "onboarding-buddy-not-manager",
  track: "hiring", level: "team",
  title: "Give a new hire someone who is not their manager",
  source: "Standard onboarding practice",
  idea: "New people need to ask questions that feel too basic to ask a manager. A designated peer makes those questions cheap, which dramatically speeds up ramp.",
  why: "There is a class of question - what does this acronym mean, is this normal, who actually decides this - that people will not ask upward because they are being evaluated. Unasked, each one costs hours of independent flailing.\n\nMaking it someone's explicit job removes the social cost of asking. Unassigned, the new person rations their questions across colleagues to avoid being a burden, which is exactly the wrong behaviour and entirely rational.",
  failureMode: "A new hire with an attentive manager and no peer contact, who spends their first month not asking things and slowly assembling a partial picture. They appear to be ramping fine and are actually stuck on four things nobody knows about.",
  experiment: "For your next hire, name a buddy explicitly, tell both people it is a real responsibility, and tell the new person that no question is too small for that channel.",
  reflection: "Who did your last new hire ask their embarrassing questions to? If the answer is nobody, what did that cost?",
  recall: {
    q: "Why does a new hire need a peer rather than only a manager?",
    a: "A whole class of question - what does this mean, is this normal, who really decides - will not be asked upward because they are being evaluated, and each unasked one costs hours of flailing.\n\nUnassigned, they ration questions across colleagues to avoid being a burden, which is rational and exactly wrong."
  },
  deepDive: "Help me design an onboarding buddy role with clear enough expectations that it actually functions."
}
);

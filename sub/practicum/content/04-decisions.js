/* Track: Decisions. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "two-way-doors",
  track: "decisions", level: "both",
  title: "Sort decisions by whether you can walk back through the door",
  source: "Jeff Bezos, shareholder letters",
  idea: "Some decisions are one-way doors: expensive or impossible to reverse. Most are two-way. The two deserve completely different amounts of deliberation, and treating them alike is the common error.",
  why: "One-way doors - a public API shape, a data model, a tenant identity scheme, a key hire - deserve slow, heavily scrutinised process, because the cost of being wrong runs for years. Two-way doors deserve a fast decision by whoever is closest, because the cost of being wrong is one revert.\n\nBezos's observation is that organisations default to the heavyweight process for everything as they grow, which makes them slow at the ninety percent of decisions where speed is nearly free. The classification step is what buys back the speed.",
  failureMode: "A team that runs a two-week design review on a choice that could be changed in an afternoon, and simultaneously ships a public API shape in a sprint because it seemed small. Both the caution and the speed were applied to the wrong decision.",
  experiment: "Take the decision currently sitting heaviest on you. Ask what it would cost to reverse it in three months. If the answer is 'an afternoon', decide it today. If it is 'a migration and a customer conversation', slow down deliberately and say why.",
  reflection: "Which decision are you agonising over that is actually reversible, and which one did you make quickly that was not?",
  recall: {
    q: "What distinguishes a one-way door from a two-way door, and what is the common organisational failure?",
    a: "The cost of reversal. One-way doors - API shapes, data models, key hires - run for years; two-way doors cost a revert.\n\nOrganisations default to heavyweight process for everything as they grow, which makes them slow on the ninety percent where speed is nearly free."
  },
  deepDive: "Help me classify the decisions on my plate as one-way or two-way doors, and tell me where I have the deliberation level wrong."
},
{
  id: "name-the-decider",
  track: "decisions", level: "cross",
  title: "Name the decider before the discussion, not after",
  source: "Bain, the RAPID framework",
  cheat: "Before a decision meeting, send one line naming who decides, by when, and who is only giving input.",
  idea: "Most stuck decisions are not stuck on information. They are stuck because nobody established who decides, so the group is waiting for a consensus that has no mechanism to arrive.",
  why: "Separating the roles is what unsticks it: who provides input, who must be consulted, who decides, who executes. The critical one is a single named decider. Groups do not decide; people do, sometimes after listening to a group.\n\nDoing this before the discussion also changes its quality. If everyone knows they are giving input rather than negotiating a veto, they argue about the substance instead of positioning for leverage.",
  failureMode: "A decision that resurfaces in four consecutive meetings. Each time the discussion is good and nothing concludes, because no one in the room believes they have the authority and nobody wants to say so. Eventually it gets decided by whoever is most stubborn, or by the deadline.",
  experiment: "Take a decision that has bounced more than twice. Before the next conversation, write one line: 'X decides by Friday, after input from Y and Z.' Send it in advance. Note how much shorter the meeting is.",
  reflection: "Which decision on your team is currently circling because nobody has been named to make it?",
  recall: {
    q: "Why do decisions get stuck, and what unsticks them?",
    a: "Rarely information - usually that nobody established who decides, so the group waits for a consensus with no mechanism to arrive.\n\nName a single decider in advance, plus who gives input and who is consulted. It also improves the discussion, because people argue substance instead of positioning for a veto."
  },
  deepDive: "Help me write the decision rights for a specific stuck decision, and anticipate who will object to being input rather than decider."
},
{
  id: "disagree-and-commit",
  track: "decisions", level: "both",
  title: "Disagree and commit, out loud",
  source: "Jeff Bezos, 2016 shareholder letter",
  idea: "You can lose an argument and still execute wholeheartedly - but only if you say the disagreement out loud first, and then say the commitment out loud too.",
  why: "The phrase has two halves and people drop one. Skipping the disagreement gives you false consensus, and the objection resurfaces later as friction. Skipping the commitment gives you visible half-execution, where someone follows the letter of the decision while everyone can tell they think it is wrong.\n\nSaying both is what makes it work. The disagreement gets on record, so if the risk materialises you learn from it rather than relitigating who was right. The commitment is public, so the team is not reading ambiguity in your behaviour.",
  failureMode: "A senior person who lost the argument and now executes with visible reluctance. The team cannot tell whether the decision is real, so they hedge too. The project moves at the speed of the most ambivalent senior person on it.",
  experiment: "Next time a decision goes against you, say both sentences explicitly to the group: what you think the risk is, and that you are backing the decision anyway. Then behave consistently with the second one.",
  reflection: "Where are you currently executing something you disagree with, without having said either half out loud?",
  recall: {
    q: "What are the two halves of disagree and commit, and what happens when one is dropped?",
    a: "Voice the disagreement, then voice the commitment.\n\nDrop the first and you get false consensus that resurfaces as friction. Drop the second and you get visible half-execution, which sets the project's pace to the most ambivalent senior person on it."
  },
  deepDive: "I disagree with a decision I now have to execute. Help me write both halves so the disagreement is on record without undermining the commitment."
},
{
  id: "judge-the-decision-not-the-outcome",
  track: "decisions", level: "both",
  title: "Do not grade decisions by their outcomes",
  source: "Annie Duke, Thinking in Bets",
  idea: "Duke calls it resulting: judging a decision by how it turned out. Under uncertainty, good decisions sometimes lose and bad ones sometimes win, so outcomes are a noisy grade.",
  why: "If you only reward good outcomes you teach people to avoid uncertainty rather than to reason well, and you learn the wrong lessons from your own history - retaining a reckless approach that happened to work and abandoning a sound one that happened not to.\n\nThe alternative is to grade the process: what did we know, what did we assume, what did we consider, was the reasoning sound given the information available at the time. That question has a stable answer regardless of how the dice landed.",
  failureMode: "A team that took a well-reasoned bet, lost, and was punished for it. Everyone learns to pick safe options with predictable mediocre returns. Meanwhile the person who shipped without a rollback plan and got lucky is held up as an example of decisiveness.",
  experiment: "Take a recent bad outcome. Ask specifically whether the reasoning was wrong or the luck was, and write down which. Then do the same for a recent good outcome - that direction is harder and more useful.",
  reflection: "What are you currently taking credit for that was mostly luck, and what are you blaming yourself for that was actually a sound call?",
  recall: {
    q: "What is resulting, and what should you grade instead?",
    a: "Judging a decision by its outcome, when under uncertainty good decisions sometimes lose and bad ones sometimes win.\n\nGrade the process: what was known, what was assumed, what was considered, whether the reasoning was sound given the information at the time."
  },
  deepDive: "Help me separate decision quality from luck in something that recently went badly, and tell me honestly which it was."
},
{
  id: "premortem",
  track: "decisions", level: "both",
  title: "Imagine it has already failed",
  source: "Gary Klein, Performing a Project Premortem",
  cheat: "Run the premortem as it is six months on and this failed, with everyone writing causes silently before anyone reads out.",
  idea: "Instead of asking what might go wrong, tell the team it is a year later and the project failed badly. Then ask why. The change in tense unlocks concerns that a risk register never gets.",
  why: "Klein's mechanism is prospective hindsight: assuming an outcome has occurred makes people generate reasons far more fluently than asking them to speculate about possibilities. The research he draws on finds a substantial increase in the number of causes identified.\n\nIt also removes the social cost. Asking 'what are the risks?' makes the speaker sound negative about a plan colleagues are invested in. Asking 'why did it fail?' makes it a puzzle everyone is solving together, so the person with the real concern can voice it safely.",
  failureMode: "A risk register full of generic entries - dependency delay, scope creep, resourcing - written to satisfy a template. The actual killer was known by two people who never found a comfortable moment to say it.",
  experiment: "Before your next commitment, give the team five minutes: it is six months from now and this failed embarrassingly. Everyone writes reasons silently first, then reads them out. Silent-first is what stops the loudest voice anchoring the room.",
  reflection: "If your current biggest project failed, what would the most likely reason be? Have you said it to anyone?",
  recall: {
    q: "Why does a premortem surface more risks than asking what might go wrong?",
    a: "Prospective hindsight: assuming the failure happened makes people generate causes far more fluently than speculating about possibilities.\n\nIt also removes the social cost - explaining a failure is a shared puzzle, whereas raising a risk sounds like negativity about a plan colleagues are invested in."
  },
  deepDive: "Run a premortem with me on a project I will describe. Generate the failure causes yourself first, then push me on which I am underrating."
},
{
  id: "decision-records",
  track: "decisions", level: "both",
  title: "Write down why, not just what",
  source: "Michael Nygard, Documenting Architecture Decisions",
  idea: "A short record of each significant decision - the context, the options, the choice, the consequences - saves enormous cost later. The expensive missing piece is always the context, not the choice.",
  why: "Code tells you what was decided. It never tells you what the alternatives were or which constraint ruled them out. So eighteen months later someone finds an odd design, assumes it was an accident, and either preserves it superstitiously or removes it and reintroduces the problem it solved.\n\nThe format is deliberately cheap: a page, written at the time, immutable afterwards. Superseding decisions get a new record. The discipline is in writing it while the reasoning is still in your head, because a week later you will have forgotten the constraint that decided it.",
  failureMode: "An architecture nobody can explain. Every senior engineer has a partial folk history and no two agree. Onboarding takes months longer than it should, and half the technical debt conversations are archaeology rather than engineering.",
  experiment: "Write one for the last significant decision you made. Four headings: context, options considered, decision, consequences. Cap it at a page and put it where the code lives, not in a wiki nobody reads.",
  reflection: "What decision on your system can nobody currently explain the reasoning for? Who is the last person who might still know?",
  recall: {
    q: "What is the expensive missing piece in undocumented decisions?",
    a: "The context and the rejected options, not the choice itself.\n\nCode shows what was decided but never which constraint ruled out the alternatives - so odd designs get preserved superstitiously or removed, reintroducing the problem they solved."
  },
  deepDive: "Help me write a decision record for something I decided recently, and interrogate whether my stated reasoning is the real one."
},
{
  id: "outside-view",
  track: "decisions", level: "both",
  title: "Ask how long it took last time, not how long it should take",
  source: "Daniel Kahneman and Dan Lovallo, on the inside and outside view",
  idea: "Estimating from the details of your specific plan - the inside view - produces systematic optimism. Estimating from how similar projects actually went is far more accurate and always less comfortable.",
  why: "The inside view builds a path from your plan's steps, and a plan is by construction a story where things go right. It cannot include the unknown unknowns, because they are unknown. The outside view includes them automatically, because they are already baked into the historical record of similar work.\n\nThe move is mechanical: identify the reference class, find out how long those actually took, and start from that number. Then adjust for genuine differences, sparingly, because everybody believes their case is the exception.",
  failureMode: "A migration estimated at one quarter from a detailed and sensible task breakdown. It takes three. The last four migrations also took three. Nobody looked, because this one was going to be different - and the task breakdown felt more rigorous than history.",
  experiment: "For your current estimate, find the three most similar past projects and their actual durations. Compare with your estimate. If your estimate is lower than all three, write down specifically why this one is different.",
  reflection: "What is your team's historical ratio of estimate to actual? Do you know, or have you never checked?",
  recall: {
    q: "Why is the outside view more accurate than estimating from your plan?",
    a: "A plan is a story where things go right, and cannot include unknown unknowns. Historical durations of similar work already contain them.\n\nSo start from what the reference class actually took, then adjust sparingly - everyone believes their case is the exception."
  },
  deepDive: "Help me build a reference class for a project I am estimating, and challenge my reasons for thinking this one is different."
},
{
  id: "match-approach-to-problem-type",
  track: "decisions", level: "cross",
  title: "Complicated and complex need opposite approaches",
  source: "Dave Snowden, the Cynefin framework",
  idea: "Complicated problems have knowable right answers and reward analysis. Complex problems have no knowable answer in advance and reward small probes. Applying analysis to a complex problem burns months producing false confidence.",
  why: "Snowden's distinction is the useful part. A complicated problem - a database migration, a compiler bug - yields to expertise: analyse, then act. A complex problem - will this team structure work, will users adopt this - only reveals cause and effect in retrospect. There, the right move is to probe, sense what happens, then respond.\n\nMost organisational and product questions are complex, and most organisations treat them as complicated. That is why the twelve-week analysis produces a confident document that reality contradicts in week two.",
  failureMode: "A reorganisation designed exhaustively on paper over a quarter, launched fully, and wrong in ways nobody could have predicted from the design. A complex problem was handled as a complicated one, so there was no cheap way to find out and no way to partially back out.",
  experiment: "Take a decision you are analysing. Ask whether an expert could in principle know the right answer in advance. If not, stop analysing and design the smallest probe that would tell you something real within two weeks.",
  reflection: "What are you currently trying to think your way to an answer on, when you could cheaply find out instead?",
  recall: {
    q: "How do you tell a complicated problem from a complex one, and what does each require?",
    a: "Complicated problems have knowable right answers - analyse, then act. Complex ones only reveal cause and effect in hindsight - probe, sense, then respond.\n\nMost organisational and product questions are complex and get treated as complicated, which is why long analyses produce confident documents reality contradicts immediately."
  },
  deepDive: "Help me classify a problem I am facing as complicated or complex, and if complex, design the smallest useful probe."
},
{
  id: "cost-of-delay",
  track: "decisions", level: "cross",
  title: "Deciding late has a price, and it is usually unpriced",
  source: "Donald Reinertsen, Principles of Product Development Flow",
  idea: "Waiting for more information has a cost that almost nobody quantifies: the value forgone while everyone waits. Compared against the cost of being somewhat wrong, it is often larger.",
  why: "The instinct to gather more data feels responsible and is invisible in any accounting. Nobody is charged for the three weeks a decision sat pending. Meanwhile eight people worked around the ambiguity, two of them built on an assumption that will turn out wrong, and the market moved.\n\nReinertsen's point is that once you assign a number to delay, the trade becomes explicit rather than a matter of temperament. Frequently the honest calculation says decide now on 70% information, because the missing 30% costs more to acquire than it saves.",
  failureMode: "A culture that treats deferring a decision as free and being wrong as costly. It optimises hard for one visible error type and accumulates enormous invisible losses in the other. Careful people are promoted; the organisation is slow and nobody can point to why.",
  experiment: "For your longest-pending decision, estimate the weekly cost of not having decided - people blocked, work at risk of rework, opportunity moving. Put a number on it. Then decide whether the missing information is worth that per week.",
  reflection: "What are you calling due diligence that is actually just discomfort with committing?",
  recall: {
    q: "What is the usually-unpriced cost in a deferred decision?",
    a: "The value forgone while people wait - work built on assumptions that will change, workarounds, opportunity lost.\n\nNobody is charged for it, so gathering more data always looks responsible. Priced, the honest answer is often to decide on 70% information."
  },
  deepDive: "Help me quantify the cost of delay on a decision I have been deferring, and tell me whether the missing information is worth it."
},
{
  id: "what-would-change-my-mind",
  track: "decisions", level: "both",
  title: "State in advance what would change your mind",
  source: "Philip Tetlock, Superforecasting",
  idea: "Before committing, write down the observation that would make you reverse. If you cannot name one, you are not holding a position, you are holding an identity.",
  why: "Naming the falsifier in advance does two things. It makes updating socially cheap later - you are following a rule you set, not losing an argument. And it forces you to notice now whether your view is actually responsive to evidence, which is uncomfortable and useful.\n\nTetlock's better forecasters update frequently and in small increments. What lets them do that without looking unprincipled is having said in advance what kind of news would move them.",
  failureMode: "A technical direction defended for eighteen months past the point where it stopped working, because reversing became a status question rather than a technical one. Everyone involved can see it. Nobody has a cheap way to change position.",
  experiment: "For your current strongest technical opinion, write the sentence 'I would abandon this if ___'. Make it specific and observable. Then check whether that thing has quietly already happened.",
  reflection: "What position are you holding that no evidence could shift? What does that tell you about why you hold it?",
  recall: {
    q: "Why write down your falsifier before committing?",
    a: "It makes later updating cheap - you are following your own rule rather than losing an argument - and it exposes now whether the view is responsive to evidence at all.\n\nGood forecasters update often in small increments, and pre-committing to what would move them is what makes that look principled rather than flaky."
  },
  deepDive: "Take a technical position I hold strongly, help me name what would falsify it, and tell me if that has already happened."
},
{
  id: "satisfice-the-reversible",
  track: "decisions", level: "both",
  title: "Good enough is the correct answer to most questions",
  source: "Herbert Simon, on satisficing",
  idea: "Simon's finding is that real decision makers do not optimise, they satisfice - take the first option that clears the bar. For reversible decisions that is not laziness, it is correct.",
  why: "Optimising has a cost that scales with the number of options considered, and for most decisions the gap between the best option and a good one is small while the search cost is not. Spending a week to find a marginally better linter is a straightforward loss.\n\nThe skill is in setting the bar explicitly, then stopping. 'Any option that supports these three requirements and is maintained' converts an open-ended search into a bounded one, and lets you take the first thing that qualifies without residual anxiety.",
  failureMode: "Three weeks comparing four broadly equivalent libraries, producing a comparison matrix nobody will read, ending with the obvious choice. The deliberation cost far exceeded the difference between the options, and the team learned that small choices deserve big process.",
  experiment: "Take a small pending choice. Write the two or three criteria that actually matter. Pick the first option that meets them, today, and note the decision took ten minutes.",
  reflection: "What small decision are you over-engineering right now because the process feels like rigour?",
  recall: {
    q: "What does satisficing mean, and when is it the right approach?",
    a: "Taking the first option that clears an explicitly-set bar, rather than searching for the best.\n\nCorrect whenever the decision is reversible and the gap between best and good is smaller than the search cost - which is most decisions."
  },
  deepDive: "Help me set an explicit bar for a choice I am overthinking, so I can take the first qualifying option and stop."
},
{
  id: "consent-not-consensus",
  track: "decisions", level: "cross",
  title: "Consent is a lower bar than consensus, and a better one",
  source: "Sociocratic decision practice",
  idea: "Consensus asks whether everyone agrees. Consent asks whether anyone has a principled objection. The second is achievable and produces decisions people will actually support.",
  why: "Consensus is close to unattainable in any group above about five, so groups that require it either never decide or fake it. Consent moves the question from 'is this your preferred option?' to 'is there a reason this will not work?', which most people can answer honestly and quickly.\n\nThe important discipline is that an objection must be about the proposal failing, not about preferring something else. 'I would rather do X' is not an objection. 'This breaks under condition Y' is. That distinction is what keeps the process fast.",
  failureMode: "A team that either waits for unanimity and stalls, or declares consensus that does not exist because nobody wanted to be the last holdout. Both produce decisions with no real backing, and both are read as agreement.",
  experiment: "In your next group decision, ask explicitly: 'does anyone have a reason this will not work?' rather than 'is everyone happy with this?' Rule preferences out of scope, out loud, before you ask.",
  reflection: "Where is your team requiring agreement when it only needs absence of objection?",
  recall: {
    q: "What is the difference between consensus and consent, and what makes an objection valid?",
    a: "Consensus asks if everyone agrees; consent asks if anyone has a principled objection.\n\nAn objection must be that the proposal will fail - 'this breaks under condition Y' - not that you prefer something else. That distinction is what keeps it fast."
  },
  deepDive: "Help me run a stuck group decision on a consent basis, including how to handle someone dressing a preference up as an objection."
},
{
  id: "escalation-is-a-feature",
  track: "decisions", level: "cross",
  title: "Escalation is a working mechanism, not a failure",
  source: "Will Larson, An Elegant Puzzle",
  idea: "Two teams with genuinely conflicting mandates cannot resolve it between themselves, because neither has the authority to change a mandate. Escalating is the correct move, and treating it as failure just makes it late.",
  why: "There is a real category of disagreement where both parties are behaving correctly and the conflict is structural - two teams optimising for goals that were set in tension. No amount of good faith at that level resolves it. Only someone who owns both goals can.\n\nBecause escalation is culturally coded as tattling, people delay it for weeks, burn the relationship trying to win locally, and arrive at the escalation with damaged trust and less time. Naming it as a normal mechanism early is what keeps it cheap.",
  failureMode: "Two teams grinding against each other for a quarter, each convinced the other is being unreasonable, both correct about their own incentives. By the time it escalates the technical problem is small and the relationship problem is large.",
  experiment: "Identify a cross-team disagreement you have been grinding on. Ask whether either side has the authority to change what they are being measured on. If not, escalate this week - jointly, with an agreed statement of the conflict.",
  reflection: "What conflict are you trying to solve through relationship-building when it is actually a mandate problem?",
  recall: {
    q: "When is escalation the correct first move rather than a failure?",
    a: "When the conflict is structural - two teams optimising goals set in tension, and neither has authority to change their mandate.\n\nGood faith cannot resolve that; only whoever owns both goals can. Delaying it burns the relationship and arrives with less time."
  },
  deepDive: "Help me work out whether a cross-team conflict I describe is structural, and if so draft the joint escalation."
}
);

/* Track: Trust and safety. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "safety-is-not-niceness",
  track: "trust", level: "both",
  title: "Psychological safety is not niceness",
  source: "Amy Edmondson, The Fearless Organization",
  idea: "Psychological safety is the shared belief that you can take an interpersonal risk - admit a mistake, ask a naive question, disagree with the senior person - without being punished for it.",
  why: "Edmondson's definition is precise and often mangled. It is not comfort, agreement, or a lowered bar. It is specifically about the perceived cost of speaking up, and it is a property of a group rather than a personality trait.\n\nIt matters because in complex work the information needed to avoid failure is distributed. The person who noticed the anomaly is usually junior and usually unsure. If the cost of being wrong out loud exceeds the cost of staying quiet, they stay quiet, and you lose the signal that would have prevented the incident.",
  failureMode: "A team that is pleasant and quiet. Reviews pass frictionlessly, nobody challenges the senior engineer's design, and the same class of bug keeps shipping. Everyone was being polite. Politeness was the problem.",
  experiment: "In your next technical discussion, count how many times someone other than the two most senior people raises an objection. If it is zero, ask one specific quiet person directly what they think is weakest about the plan.",
  reflection: "What happened the last time someone on your team said something wrong in public? What did everyone else learn from watching?",
  recall: {
    q: "What precisely is psychological safety, and what is it not?",
    a: "The shared belief that interpersonal risk - admitting error, asking a naive question, disagreeing upward - will not be punished. It is a property of a group.\n\nIt is not comfort, agreement, or lowered standards."
  },
  deepDive: "Help me assess the actual level of psychological safety on my team from specific things I have observed, not from how pleasant meetings feel."
},
{
  id: "project-aristotle",
  track: "trust", level: "both",
  title: "Who is on the team matters less than how they behave",
  source: "Google, Project Aristotle",
  idea: "Google's study of its own teams found that composition - seniority, tenure, individual brilliance - predicted effectiveness poorly. Group norms predicted it well, and psychological safety was the strongest of them.",
  why: "This is an uncomfortable result for anyone who believes in assembling talent. Two teams with identical rosters can perform very differently depending on how airtime is distributed and how mistakes are received.\n\nIt is also good news, because norms are changeable and rosters mostly are not. You cannot re-hire your team this quarter. You can change how the next twelve meetings run, and that is apparently where most of the variance lives.",
  failureMode: "A manager whose theory of improvement is entirely about hiring and performance-managing individuals. They churn the roster, the norms stay identical, and performance does not move - which they read as evidence they need to churn harder.",
  experiment: "In your next team meeting, track roughly how airtime distributes. If two people hold most of it, change something structural next time - round-robin the risks question, or ask for written input before the discussion.",
  reflection: "If your team's roster were fixed for two years, what would you change about how it works? Why are you not doing that now?",
  recall: {
    q: "What did Project Aristotle find predicted team effectiveness, and what did not?",
    a: "Group norms predicted it, with psychological safety the strongest factor. Composition - seniority, tenure, individual brilliance - predicted it poorly.\n\nWhich is encouraging, because norms are changeable this quarter and rosters are not."
  },
  deepDive: "Help me identify the norms on my team that are actually driving performance, and pick one to change deliberately."
},
{
  id: "safety-plus-standards",
  track: "trust", level: "both",
  title: "Safety without standards is just comfortable",
  source: "Amy Edmondson, The Fearless Organization",
  idea: "Edmondson maps safety against performance standards. High safety with low standards produces a comfort zone. You want high safety and high standards together - that combination is the learning zone.",
  why: "The two are frequently treated as a trade-off, so managers pick a side: demanding and fearful, or warm and slack. Both underperform. High standards with low safety produces anxiety, hidden problems, and defensive work. High safety with low standards produces a pleasant team that does not improve.\n\nHeld together, they reinforce each other. Ambitious goals are only reachable if people can flag problems early, and safety only produces learning if there is a standard worth learning toward.",
  failureMode: "A manager who reads about psychological safety and responds by softening every standard. The team feels better and gets worse. When results slip, the manager concludes safety was a nice idea that does not survive contact with delivery pressure.",
  experiment: "Say both halves in the same sentence this week: name a standard you are not going to lower, and invite people explicitly to tell you what is going to make it hard. Then act on the first thing someone tells you.",
  reflection: "Which quadrant is your team actually in? Would your team give the same answer as you?",
  recall: {
    q: "What are the four quadrants of safety against standards, and where do you want to be?",
    a: "Low safety and low standards is apathy. Low safety with high standards is anxiety. High safety with low standards is comfort. High safety with high standards is the learning zone.\n\nThey reinforce rather than trade off: ambitious goals need early problem reporting, and safety needs a standard to learn toward."
  },
  deepDive: "Help me work out which quadrant my team is in from concrete evidence, and what the specific move is to get to the learning zone."
},
{
  id: "go-first-with-fallibility",
  track: "trust", level: "both",
  title: "Safety is set by whoever has the most power in the room",
  source: "Amy Edmondson, The Fearless Organization",
  idea: "People calibrate what is safe by watching the most senior person. So safety is created by leaders visibly being wrong, asking questions they do not know the answer to, and thanking people for bad news.",
  why: "Nobody believes a stated policy of openness. They believe what they observe happening to the first person who tests it. The cheapest way to establish the norm is to test it on yourself: say plainly that you got something wrong, in a setting where it costs you a little.\n\nEdmondson's specific leader behaviours are framing the work as a learning problem rather than an execution problem, acknowledging your own fallibility, and modelling curiosity by asking real questions. All three are demonstrations, not announcements.",
  failureMode: "A manager who says 'my door is always open' and 'there are no stupid questions', and who visibly bristles the one time someone questions their design in public. The stated policy is now worthless, and the demonstration is the thing everyone remembers.",
  experiment: "In a group setting this week, say out loud something you were wrong about recently and what you now think instead. No caveats softening it. Watch whether anyone follows.",
  reflection: "When did you last change your mind publicly in front of your team? If you cannot recall, what are they learning about the cost of being wrong?",
  recall: {
    q: "What actually establishes psychological safety, and what does not?",
    a: "Demonstration by the most powerful person in the room: being visibly wrong, asking real questions, thanking people for bad news.\n\nStated policies do nothing. People calibrate on what they see happen to the first person who tests the norm."
  },
  deepDive: "Help me find something I have been wrong about that would be genuinely useful to say out loud to my team, and how to say it without performing."
},
{
  id: "blameless-postmortem",
  track: "trust", level: "both",
  title: "Blameless review buys you the information",
  source: "John Allspaw, Blameless PostMortems and a Just Culture",
  idea: "Removing blame from incident review is not generosity. It is the price of getting an accurate account of what happened, which is the only thing that lets you fix the system.",
  why: "When there is a plausible chance of punishment, people narrate defensively. They tell you a version that is technically true and strategically incomplete, and the detail you most needed - the confusing dashboard, the runbook nobody trusted, the alert everyone had learned to ignore - never surfaces.\n\nThe trade is explicit: you give up the satisfaction of accountability-as-consequence in exchange for the detail that prevents recurrence. Allspaw's point is that the second is worth vastly more, because the person involved is almost never the cause.",
  failureMode: "A review where someone is named as the root cause. It concludes with 'be more careful' and a training action item. The conditions that made the mistake likely remain untouched, and the next person to hit them has now watched what happens to whoever admits it.",
  experiment: "In your next incident review, ban the words 'should have' and 'failed to'. Replace every instance with 'what made that seem like the right action at the time'. Notice how much more you learn.",
  reflection: "In your last incident review, did anyone volunteer information that made themselves look worse? If not, you probably did not get the full account.",
  recall: {
    q: "What is the actual trade being made in a blameless postmortem?",
    a: "You give up accountability-as-consequence in exchange for an accurate account.\n\nUnder threat of punishment people narrate defensively, and the details that matter most - the untrusted runbook, the ignored alert - never surface."
  },
  deepDive: "Help me redesign my team's incident review format to get better information, and tell me where my current one invites defensiveness."
},
{
  id: "human-error-is-a-symptom",
  track: "trust", level: "both",
  title: "Human error is where the investigation starts",
  source: "Sidney Dekker, The Field Guide to Understanding Human Error",
  idea: "Dekker's new view: human error is not an explanation, it is a finding that needs explaining. The useful question is why the action made sense to a reasonable person at the time.",
  why: "Hindsight makes bad decisions look obviously bad, which is a bias, not an insight. At the moment of action the person had partial information, time pressure, competing goals, and a system that gave misleading signals. Reconstructing that view is where the fixable causes live.\n\nThis reframes the output of a review. Instead of 'the operator ran the wrong command', you get 'production and staging are distinguished by one character in a prompt nobody reads under pressure' - which is something you can actually change.",
  failureMode: "Reviews that terminate at a person. The action item is training or a checklist, the underlying trap is untouched, and the same incident recurs with a different name attached. Each time, the organisation is confident it found the cause.",
  experiment: "Take your most recent incident. Write one sentence explaining why the action taken was reasonable given what that person could see at the time. If you cannot write it honestly, you have not finished investigating.",
  reflection: "What in your systems currently makes a wrong action feel identical to a right one?",
  recall: {
    q: "Under the new view of human error, what does 'human error' tell you?",
    a: "That the investigation has more to do. Error is a finding, not an explanation.\n\nThe productive question is why the action made sense at the time given partial information, time pressure, and competing goals - which surfaces causes you can actually fix."
  },
  deepDive: "Take an incident I describe and help me rewrite the causal account from the operator's point of view at the time."
},
{
  id: "westrum-information-flow",
  track: "trust", level: "cross",
  title: "How your organisation handles bad news predicts its performance",
  source: "Ron Westrum, via Forsgren, Humble and Kim, Accelerate",
  idea: "Westrum classifies cultures by what happens to information. Pathological cultures hoard it and shoot messengers. Bureaucratic ones route it through channels. Generative ones seek it out and reward the bearer.",
  why: "The distinguishing behaviour is what happens to the person carrying bad news. That single variable shapes everything downstream, because it determines whether leadership is operating on reality or on a sanitised summary.\n\nThe Accelerate research found Westrum-generative culture predicts both software delivery performance and organisational performance. It is not a soft nicety measured for completeness - it turned out to be one of the load-bearing variables.",
  failureMode: "A bureaucratic middle layer that faithfully passes information upward while smoothing every edge. Nobody lies. By the time a summary reaches the decision maker, the risk has been rounded down four times and reads as green.",
  experiment: "Trace one recent piece of bad news from where it originated to where a decision maker heard it. Note what got softened at each hop, and who softened it. Do not confront anyone - just look at the pattern.",
  reflection: "What happened to the last person who brought your leadership genuinely unwelcome news? What did everyone watching conclude?",
  recall: {
    q: "What single behaviour distinguishes Westrum's three culture types?",
    a: "What happens to the messenger. Pathological cultures punish them, bureaucratic ones route the message through channels, generative ones seek the message out and reward the bearer.\n\nAccelerate found generative culture predicts both delivery and organisational performance."
  },
  deepDive: "Help me diagnose where my organisation sits on Westrum's typology using specific things I have seen happen, and what I can change from my position."
},
{
  id: "vulnerability-based-trust",
  track: "trust", level: "both",
  title: "Trust is the precondition for useful conflict",
  source: "Patrick Lencioni, The Five Dysfunctions of a Team",
  idea: "Lencioni's chain runs trust, then conflict, then commitment, then accountability, then results. Each layer depends on the one below, so an artificially harmonious team fails at the top.",
  why: "The trust in question is specifically the willingness to be vulnerable - to say 'I do not understand this' or 'I made that call and it was wrong' in front of peers. Without it people protect themselves, which means they do not argue properly.\n\nAnd without real argument there is no commitment, only compliance. People who never got to voice their objection have not agreed to anything; they have declined to fight. That reappears later as passive non-execution, which gets misdiagnosed as an accountability problem three layers up the chain.",
  failureMode: "A leadership team with no visible disagreement and no follow-through. Every meeting concludes in apparent alignment; nothing happens afterwards. Leadership responds by adding accountability mechanisms, treating the symptom at the top while the missing layer is at the bottom.",
  experiment: "In your next team decision, ask explicitly for the strongest case against the option you favour, and wait through the silence. If nobody offers one, ask the person most likely to be affected what they would worry about.",
  reflection: "When did your team last have a genuine, unresolved disagreement in a meeting? If it has been a while, that is not harmony.",
  recall: {
    q: "Why does a team with no visible disagreement fail to execute?",
    a: "Because commitment requires having voiced and lost the argument. People who never got to object have not agreed - they have declined to fight.\n\nThat shows up later as passive non-execution and gets misdiagnosed as an accountability problem."
  },
  deepDive: "Help me surface the disagreements my team is currently suppressing, and design a way to get them argued properly."
},
{
  id: "the-system-not-the-people",
  track: "trust", level: "both",
  title: "Most of the variation is the system",
  source: "W. Edwards Deming",
  idea: "Deming put the overwhelming majority of problems down to the system people work in rather than the people themselves. Replacing individuals rarely changes outcomes if the system is unchanged.",
  why: "The test is a thought experiment: if you swapped this person for a competent stranger, would the outcome be much different? For most recurring problems the answer is no, which means you are looking at a property of the system - the incentives, the tooling, the information available, the constraints.\n\nThis does not deny that individual performance varies. It says that when the same failure recurs across different people, the variable that is constant is the system, and that is where the leverage is.",
  failureMode: "A role that has burned through three people in two years. Each time the conclusion is that the hire was wrong. The job as designed is impossible - conflicting mandates, no authority, unbounded scope - and the fourth person will also fail.",
  experiment: "Find a problem you have blamed on an individual. Ask whether a competent stranger in that seat, with the same information and constraints, would likely have done the same thing. If yes, list the constraints.",
  reflection: "What recurring failure on your team have you been attributing to people, and what stays constant across every instance?",
  recall: {
    q: "What is the test for whether a problem is systemic or individual?",
    a: "Would a competent stranger in the same seat, with the same information and constraints, have done much the same thing?\n\nWhen the same failure recurs across different people, the constant is the system - and that is where the leverage sits."
  },
  deepDive: "Help me tell apart the systemic and individual causes of a recurring problem I will describe, and design the system change."
},
{
  id: "humility-respect-trust",
  track: "trust", level: "both",
  title: "Almost every team conflict is one of three things missing",
  source: "Brian Fitzpatrick and Ben Collins-Sussman, Team Geek",
  idea: "Humility, respect and trust. Most interpersonal friction on engineering teams traces back to one of the three being absent, and naming which one makes the conflict tractable.",
  why: "The value is diagnostic. 'They are difficult to work with' is not actionable. 'They do not believe anyone else's code is any good' is a respect problem, and has different remedies from 'they cannot admit when they are unsure', which is humility, or 'they re-review work they already approved', which is trust.\n\nThe three also fail in a specific order. Absent humility damages respect, which destroys trust, and by the time trust is gone the original cause is hard to see.",
  failureMode: "A long-running feud that everyone works around with process - separate reviewers, split ownership, careful scheduling. The process cost accumulates forever because the actual missing ingredient was never named.",
  experiment: "Take a friction you are currently managing around. Decide which of the three is missing, and in which direction. Then have a conversation about that specific thing rather than about the general difficulty.",
  reflection: "Which of the three are you personally weakest on, on a bad day? What does your team see when that happens?",
  recall: {
    q: "What are the three ingredients, and why does naming the missing one matter?",
    a: "Humility, respect, trust.\n\n'Difficult to work with' is not actionable; 'does not believe anyone else's code is good' is a respect problem with different remedies from a humility or trust problem. They also fail in that order, which obscures the original cause."
  },
  deepDive: "Help me diagnose a specific team friction I will describe against humility, respect and trust, and plan the conversation."
},
{
  id: "silence-is-data",
  track: "trust", level: "both",
  title: "Silence is not agreement",
  source: "Edgar Schein, Humble Inquiry",
  idea: "The absence of objection tells you nothing about whether people agree. It usually means the cost of objecting looked higher than the cost of staying quiet.",
  why: "Objecting in a group is expensive: you risk looking slow, contradicting a senior person, or extending a meeting everyone wants to end. Agreement is free. So silence is the default output of any group, and reading it as consent means systematically mistaking your own proposals for consensus.\n\nSchein's remedy is genuine inquiry rather than rhetorical questions. 'Any concerns?' invites silence. 'What is the weakest part of this?' presupposes there is one, which makes answering safe.",
  failureMode: "A decision made in a meeting where nobody objected, which then fails to happen. Three people had reservations and none of them were asked in a way that made raising it easy. The manager experiences this as an execution failure.",
  experiment: "Replace your next 'does anyone have concerns?' with 'what is the biggest risk with this plan?' and then wait a full ten seconds without filling the gap. Count who speaks.",
  reflection: "What decision have you recorded as agreed that was really just unopposed?",
  recall: {
    q: "Why is silence the default output of a group, and what question works instead?",
    a: "Objecting costs something - looking slow, contradicting seniority, prolonging a meeting - while agreement is free.\n\nAsk questions that presuppose a problem exists: 'what is the weakest part of this?' rather than 'any concerns?', then wait through the silence."
  },
  deepDive: "Help me rewrite the questions I habitually ask in meetings so they actually surface disagreement."
},
{
  id: "reward-the-messenger",
  track: "trust", level: "both",
  title: "Make bringing bad news the winning move",
  source: "Ron Westrum, on generative culture",
  idea: "In a healthy team, the person who surfaces a problem early gets visible credit. If bad news costs the bearer anything at all, you will get it late.",
  why: "Every person deciding whether to escalate is doing a private cost calculation. If raising a risk means becoming the owner of it, being questioned about why it was not caught earlier, or being seen as negative, the rational choice is to wait and hope. Many risks do resolve themselves, which makes the strategy locally sensible.\n\nThe fix is to make the calculation come out the other way, deliberately and visibly. Not gratitude in private - credit in the same forum where the news landed, so everyone updates their estimate of what it costs.",
  failureMode: "Risks that surface exactly when they become undeniable, which is always too late to be cheap. Leadership concludes the team has poor foresight. The team has excellent foresight and a correct read on the incentives.",
  experiment: "Next time someone brings you an early warning, thank them publicly and by name in the channel where it matters, and make sure raising it did not make them the owner of fixing it.",
  reflection: "What does it currently cost someone on your team to be the person who says a project is in trouble?",
  recall: {
    q: "Why do people rationally sit on bad news?",
    a: "Because raising a risk often makes you its owner, invites questions about why it was not caught sooner, or gets read as negativity - and many risks do quietly resolve.\n\nThe fix is public credit in the forum where the news landed, and not making the messenger the owner."
  },
  deepDive: "Help me figure out what surfacing a risk currently costs people on my team, and how to visibly invert that."
},
{
  id: "defensive-routines",
  track: "trust", level: "cross",
  title: "Smart teams are especially good at not learning",
  source: "Chris Argyris, on defensive routines",
  idea: "Argyris found that skilled professionals are unusually good at avoiding uncomfortable learning, because they are skilled at constructing defences. Competence protects the ego efficiently.",
  why: "The mechanism is that high performers have rarely failed, so they have little practice at examining failure and a lot of identity invested in being right. When something goes wrong, the reflex is a well-argued explanation that locates the cause outside themselves - the requirements changed, the other team was slow, the data was bad.\n\nArgyris called the deeper fix double-loop learning: questioning the assumptions that generated the approach, not just correcting the approach. That requires someone to make the assumptions discussable, which is uncomfortable in exactly the rooms where it matters most.",
  failureMode: "A retrospective full of articulate people producing sophisticated external explanations. Every point is defensible. Nothing about how the team makes decisions is examined, so the same pattern recurs next quarter with a different external cause.",
  experiment: "In your next retrospective, ask what assumption everyone held at the start that turned out to be wrong. Answer it yourself first, honestly, before asking anyone else.",
  reflection: "What explanation for a recent failure did you find immediately satisfying? What would you have to accept if that explanation were incomplete?",
  recall: {
    q: "Why are highly skilled teams particularly bad at learning from failure?",
    a: "They have rarely failed, so they have little practice examining failure and heavy identity investment in being right - and enough skill to construct well-argued external explanations.\n\nThe fix is double-loop learning: questioning the assumptions that produced the approach, not just correcting the approach."
  },
  deepDive: "Take a recent failure I describe and push me past the comfortable external explanation to the assumption I got wrong."
}
);

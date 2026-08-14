/* Track: Leverage and time. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "output-of-your-team",
  track: "leverage", level: "both",
  title: "Your output is your team's output",
  source: "Andy Grove, High Output Management",
  idea: "A manager's output is not what they personally produce. It is the output of their organisation, plus the output of neighbouring organisations they influence.",
  why: "This is the arithmetic that makes every other management idea follow. If your output is your own work, then time spent on someone else's problem is time stolen from your real job, and the rational move is to hoard your hours.\n\nOnce your output is measured as the team's, the calculus inverts. An hour spent unblocking two engineers can be worth more than an hour of your own best work, because it multiplies rather than adds. The influence clause matters too: work you do to make an adjacent team faster counts, even though nobody assigned it to you.",
  failureMode: "New managers keep scoring themselves on personal throughput. They stay the top committer, feel productive, and cannot understand why the team is slow. The team is slow because the person best placed to remove friction is busy generating output that only ever adds.",
  experiment: "Look at yesterday. Write down the three things you spent the most time on, and next to each write whether it added to output or multiplied it. Do not fix anything yet. Just notice the ratio.",
  reflection: "What did you do this week that only you could have done, and what did you do that you should have handed off?",
  recall: {
    q: "By Grove's definition, what exactly is a manager's output?",
    a: "The output of your organisation, plus the output of neighbouring organisations you influence.\n\nThe second half is the part people forget. Work that makes an adjacent team faster counts as your output even when nobody asked you to do it."
  },
  deepDive: "Help me audit where my hours actually went last week against this definition, and identify the single biggest multiplier I am not pulling."
},
{
  id: "leverage-arithmetic",
  track: "leverage", level: "both",
  title: "Leverage arithmetic",
  source: "Andy Grove, High Output Management",
  idea: "The output of any managerial activity equals the activity multiplied by its leverage. So the job is not to do more activities, it is to pick activities with a bigger multiplier.",
  why: "Grove names three things that raise leverage: how many people the activity affects, how long its effect lasts, and whether it supplies information or skill that people could not get elsewhere. An hour writing a decision doc that fifteen engineers will follow for a year is enormously levered. An hour reviewing one pull request is not.\n\nThe useful part is that leverage can be negative. A manager who waffles on a decision for two weeks while eight people wait has produced strongly negative output from a small amount of activity.",
  failureMode: "Days full of low-leverage activity feel excellent. You answered everything, attended everything, unblocked nobody structurally. Meanwhile the ambiguous decision that would have unlocked four people stayed on the list because it was hard and nothing forced it.",
  experiment: "Find the decision you have been deferring longest. Estimate how many people are waiting on it and for how many days. Multiply. Then either make it today or write down explicitly what information you are waiting for and when it arrives.",
  reflection: "Which of your recurring commitments has the worst leverage, and what would actually break if you stopped it?",
  recall: {
    q: "What three properties make a managerial activity high-leverage?",
    a: "It affects many people, its effect lasts a long time, or it supplies information and skill that people could not otherwise get.\n\nAnd leverage runs negative: a delayed decision multiplies idle time across everyone waiting."
  },
  deepDive: "Rank my current recurring commitments by leverage using these three properties, and argue for the two I should drop."
},
{
  id: "task-relevant-maturity",
  track: "leverage", level: "team",
  title: "Task-relevant maturity",
  source: "Andy Grove, High Output Management",
  cheat: "Rate maturity task by task: if three tasks on one person score the same, you are probably rating the person.",
  idea: "How much you should delegate depends not on how senior someone is, but on how experienced they are at this specific task. Maturity is per-task, not per-person.",
  why: "A staff engineer running their first incident review has low task-relevant maturity, and needs structure they would find insulting in their own domain. A mid-level engineer who has shipped this kind of migration four times needs to be left alone.\n\nGrove's mapping is direct: low maturity wants structured, task-oriented direction. Medium wants two-way conversation and support. High wants goals, then monitoring. The mistake is picking one style and applying it to a whole person, when the right style changes as you move across their work.",
  failureMode: "You decide someone is senior, so you give them everything with no scaffolding, and they quietly drown on the one part they have never done. Or you decide someone is junior and keep specifying their work long after they have outgrown it, and they leave.",
  experiment: "Pick one person. List three things currently on their plate. Rate their task-relevant maturity on each from low to high. If all three get the same rating, you are probably rating the person, not the tasks. Look again.",
  reflection: "Where are you managing someone's title instead of their actual experience with the work in front of them?",
  recall: {
    q: "Task-relevant maturity is relative to what, and what does it imply about management style?",
    a: "Relative to the specific task, not the person or their seniority.\n\nSo style has to vary within one person: structured direction where their maturity is low, goals and monitoring where it is high. Applying one style to a whole person is the error."
  },
  deepDive: "Walk through my direct reports with me and help me spot where I have mismatched my style to their actual task-relevant maturity."
},
{
  id: "delegation-is-not-abdication",
  track: "leverage", level: "team",
  title: "Delegation without monitoring is abdication",
  source: "Andy Grove, High Output Management",
  idea: "Handing work over and looking away is not delegation. Delegation includes a monitoring plan, and the monitoring has to happen at the cheapest point of detection.",
  why: "You remain accountable for delegated work. That is not a formality - it means you need a way to find out early if it is going wrong, and the cost of finding out varies enormously by when you look. Reviewing an approach sketch costs minutes. Reviewing the finished implementation costs a rewrite.\n\nGrove's inspection principle is to check at the lowest-value stage, when the work is cheap to change. That is also the least intrusive moment, which is why it feels less like surveillance than a late review does.",
  failureMode: "The manager who says 'you own it, let me know if you need me' and then reappears at the deadline horrified. The engineer did nothing wrong. They were given no checkpoint, so the first feedback they got was expensive, late, and felt like a betrayal.",
  experiment: "Take something you delegated recently with no checkpoint. Go set one now, framed as a cheap early look rather than a review: ask for the approach in a paragraph before the code exists. Say explicitly that this is so feedback stays cheap.",
  reflection: "Which delegated piece of work would you be genuinely surprised by if you looked at it today? That surprise is your missing checkpoint.",
  recall: {
    q: "Where in a piece of delegated work should you inspect, and why there?",
    a: "At the lowest-value stage - as early as the work is legible.\n\nEarly review is cheap to act on and feels least like surveillance. Waiting until the work is finished makes your feedback expensive and turns it into a rewrite."
  },
  deepDive: "Help me design lightweight checkpoints for the things I have currently delegated, without turning them into status theatre."
},
{
  id: "delegate-the-decision",
  track: "leverage", level: "team",
  title: "Delegate the decision, not the task",
  source: "David Marquet, Turn the Ship Around",
  idea: "Handing over tasks while keeping all the decisions makes you the bottleneck at higher volume. The thing worth pushing down is decision authority.",
  why: "Marquet's crew stopped asking permission and started stating intent: 'I intend to take the boat to periscope depth.' The leader's job shrank to voicing an objection when there was one. Throughput went up because the queue at the top disappeared.\n\nThis also changes what people learn. Someone executing your decisions gets practice at execution. Someone making decisions inside constraints you set gets practice at judgement, which is the scarce thing.",
  failureMode: "A team where every non-trivial call routes through you. It looks like a strong manager with high engagement. It is actually a single point of failure, and nobody on the team is building the judgement to replace you, which is why you cannot take a holiday or a promotion.",
  experiment: "Next time someone asks you to decide something, do not decide. Ask what they would do and why. If it is reasonable, say 'do that' - even if it is not what you would have picked. Note whether the outcome was actually worse.",
  reflection: "What decision are you still making that someone on your team could make at 90% of your quality, and what is the real cost of that 10%?",
  recall: {
    q: "What is the difference between delegating tasks and delegating decisions, in terms of what people learn?",
    a: "Executing your decisions builds execution skill. Making decisions inside constraints you set builds judgement.\n\nJudgement is the scarce thing, and it only develops through reps. Keeping the decisions keeps you the bottleneck and keeps the team junior."
  },
  deepDive: "Help me find the decisions I am hoarding and design the constraints that would let me hand them over safely."
},
{
  id: "managers-schedule",
  track: "leverage", level: "both",
  title: "The maker's schedule and the manager's schedule",
  source: "Paul Graham, Maker's Schedule Manager's Schedule",
  idea: "Managers live in one-hour units, makers need half-day units. A meeting dropped into the middle of an engineer's afternoon does not cost an hour, it costs the afternoon.",
  why: "Deep work has a start-up cost. You have to load the problem into your head, and that loading is lost every time you break. A meeting at 2pm does not leave two usable blocks either side, it leaves two fragments too short to load anything into.\n\nBecause your own day is already fragmented, this cost is invisible from where you sit. An 11am slot looks free to you and identical to a 4pm slot. To the person building something, they are not remotely the same.",
  failureMode: "A team whose calendar is confetti. Everyone is at 100% utilisation and nothing hard ever ships, because hard things need contiguous hours and nobody has any. The manager concludes the team lacks focus.",
  experiment: "Open your team's calendars. Count how many uninterrupted three-hour blocks exist this week for each person. If the answer is under two for anyone, move one of your own meetings to protect a block, and tell them why you moved it.",
  reflection: "When you booked your last meeting, did you pick the time that was cheapest for you or cheapest for the people attending?",
  recall: {
    q: "Why does one midday meeting cost a maker more than an hour?",
    a: "Deep work has a loading cost, and a meeting in the middle leaves fragments on either side that are too short to load anything into.\n\nFrom a manager's fragmented day this is invisible - 11am and 4pm look like identical open slots."
  },
  deepDive: "Audit my team's calendars for contiguous focus time and propose a meeting layout that protects it without losing the coordination we need."
},
{
  id: "know-thy-time",
  track: "leverage", level: "both",
  title: "Record your time before you try to manage it",
  source: "Peter Drucker, The Effective Executive",
  idea: "Nobody can recall where their time went. Drucker's instruction is to log it in real time for a few weeks, because the log always contradicts the memory.",
  why: "Memory reconstructs the week around what felt significant, which is usually the emotionally charged thing rather than the time-consuming one. People routinely believe they spend a third of their week on strategy and discover it is four percent.\n\nThe log is also the only argument that works on yourself. You can dismiss a feeling that you are spread too thin. It is harder to dismiss a page showing eleven hours of meetings you could have skipped.",
  failureMode: "Endless resolutions to spend more time on the important thing, made from a false picture of where the time currently goes. The plan fails because it was built on a fiction, and the failure gets attributed to discipline.",
  experiment: "For the rest of today, keep a running note of what you switch to and when, at the moment you switch. No categories, no analysis. Just timestamps and a few words. Do it again tomorrow.",
  reflection: "Guess the percentage of last week you spent on your stated top priority. Now find the evidence. How far off were you?",
  recall: {
    q: "Why does Drucker insist on logging time in real time rather than reconstructing it?",
    a: "Memory organises the week around what felt significant, not what consumed hours, so recall is systematically wrong.\n\nThe log is also the only evidence persuasive enough to change your own behaviour."
  },
  deepDive: "I will paste a rough log of my week. Categorise it, compare it against the priorities I say I have, and name the gap."
},
{
  id: "meetings-are-the-medium",
  track: "leverage", level: "both",
  title: "Meetings are the medium, not the interruption",
  source: "Andy Grove, High Output Management",
  idea: "Grove refuses the idea that meetings are a waste. They are the medium through which managerial work happens. A bad meeting is bad craft, not evidence that the form is wrong.",
  why: "If your output is your team's output, then almost everything you do involves other people, and the mechanism for doing things with other people is a meeting. Complaining about meetings is like a writer complaining about sentences.\n\nGrove separates process-oriented meetings, which are regular and about information flow - one-on-ones, staff meetings, reviews - from mission-oriented meetings, which are irregular and exist to produce a specific decision. The two want different designs. Most bad meetings are a mission-oriented decision trapped inside a process-oriented format, or the reverse.",
  failureMode: "A culture that treats all meetings as waste cancels the regular ones first, because they have no urgent agenda. Information flow collapses, so coordination moves into ad-hoc interruptions, which are worse. Everyone concludes they need fewer meetings.",
  experiment: "Take your next meeting and label it: process or mission. If mission, write the decision it must produce at the top of the agenda and name who decides. If process, write what information must move and in which direction.",
  reflection: "Which of your recurring meetings has no clear answer to 'what would we lose if this stopped'? Ask the attendees rather than guessing.",
  recall: {
    q: "What is the difference between a process-oriented and a mission-oriented meeting?",
    a: "Process-oriented meetings are regular and exist to move information - one-on-ones, staff meetings, reviews. Mission-oriented meetings are irregular and exist to produce one specific decision.\n\nMost bad meetings are one type forced into the other's format."
  },
  deepDive: "Go through my recurring meetings, classify each as process or mission, and redesign the two worst ones."
},
{
  id: "paired-indicators",
  track: "leverage", level: "both",
  title: "Pair every indicator with its counterweight",
  source: "Andy Grove, High Output Management",
  cheat: "Next to your team's headline number, write the one that gets worse when it is gamed, and start tracking that too.",
  idea: "Any single metric will be optimised at the expense of something it does not measure. Grove's answer is to always pair it with an indicator that catches the damage.",
  why: "Measure tickets closed and quality quietly drops. Measure velocity and estimates inflate. This is not dishonesty, it is what attention does: the metric tells people where to look, and they stop looking elsewhere.\n\nPairing makes the trade visible instead of hidden. Tickets closed against reopen rate. Deploy frequency against change failure rate. Interview throughput against first-year attrition. Neither number alone is trustworthy; together they bound the behaviour.",
  failureMode: "A team hits its number for two quarters and the system underneath rots. Because the counter-indicator was never tracked, the rot is only discovered when it becomes an incident, and by then the causal link back to the metric is deniable.",
  experiment: "Write down the one number your team is currently judged on. Now write the number that would get worse if someone gamed it. Check whether anyone tracks the second one. If not, start tracking it this week.",
  reflection: "What behaviour is your current headline metric quietly encouraging that nobody would defend out loud?",
  recall: {
    q: "Why does Grove insist indicators come in pairs?",
    a: "Because an indicator directs attention, and whatever it does not measure gets sacrificed.\n\nA counter-indicator makes the trade-off visible: tickets closed paired with reopen rate, deploy frequency paired with change failure rate."
  },
  deepDive: "Here are the metrics my team reports. Propose the counter-indicator for each and tell me which pair is most dangerously incomplete."
},
{
  id: "the-limiting-step",
  track: "leverage", level: "both",
  title: "Build the schedule around the step you cannot move",
  source: "Andy Grove, High Output Management",
  idea: "Every workflow has one step that is slowest, most expensive, or least flexible. Plan around that step first and let everything else arrange itself in support.",
  why: "Grove's example is a breakfast factory: the egg boiler sets the pace, so you design the whole line around it. In engineering the limiting step is usually not code. It is a security review, a partner team's release train, a single person who understands the legacy path, a hardware lead time.\n\nOptimising anything other than the limiting step produces no improvement in output. It produces inventory piling up in front of the constraint, which looks like progress and is not.",
  failureMode: "A team speeds up the parts it controls, feels faster, and delivers on exactly the same date because the external review still takes three weeks. Effort went into the visible half of the pipeline while the actual constraint was never negotiated.",
  experiment: "Take your current biggest deliverable and list the steps between now and shipped. Mark the one with the least slack. If it is not the step you spent the most attention on this week, that is the finding.",
  reflection: "What is the real constraint on your team's delivery right now, and when did you last try to change it rather than work around it?",
  recall: {
    q: "What happens when you optimise a step that is not the limiting one?",
    a: "Output does not improve. You just accumulate work waiting in front of the constraint.\n\nThat queue looks like productivity, which is why the mistake survives so long."
  },
  deepDive: "Help me map the steps to shipping my current project, find the true constraint, and plan how to attack it rather than route around it."
},
{
  id: "unblock-first",
  track: "leverage", level: "team",
  title: "Unblocking beats producing, every time",
  source: "Eliyahu Goldratt, The Goal",
  idea: "When someone is blocked on you, their idle time is part of your cost. Clearing blockers takes priority over your own production, almost regardless of how important your production feels.",
  why: "Blocked work does not pause neatly. People context-switch to something lower value, lose the thread, and pay reloading costs when they come back. A two-day block often destroys more than two days of output, and it destroys morale on top.\n\nThe asymmetry is what makes the rule simple. Your unfinished document waits at zero cost. A blocked engineer does not.",
  failureMode: "A manager deep in their own important work, with three people waiting on a review, an access grant and an answer. All three eventually route around them - by guessing, by escalating, or by giving up on the approach. The manager's document is excellent.",
  experiment: "Before your next block of focused work, spend ten minutes clearing anything where someone is waiting on you specifically. Then start. Notice whether ten minutes bought back more than ten minutes of team throughput.",
  reflection: "Who is waiting on you right now, and how long have they been waiting? Do you actually know, or are you guessing?",
  recall: {
    q: "Why does a two-day block often cost more than two days of output?",
    a: "The blocked person switches to lower-value work, loses context, and pays a reloading cost on return - plus the morale hit.\n\nMeanwhile your own unfinished work waits at zero cost. That asymmetry is why unblocking goes first."
  },
  deepDive: "Help me build a lightweight habit for spotting who is blocked on me before they have to chase me."
},
{
  id: "one-top-priority",
  track: "leverage", level: "cross",
  title: "An organisation can only really do one thing at a time",
  source: "Will Larson, An Elegant Puzzle",
  idea: "Three top priorities is zero top priorities. Sequencing work so that one thing gets genuine organisational attention finishes more, sooner, than running everything in parallel.",
  why: "Parallel initiatives share the same scarce resources: senior attention, review capacity, the few people who understand the system deeply. Splitting those three ways does not give you three streams at a third speed. It gives you three streams at a fifth speed, because coordination overhead grows with the number of concurrent efforts.\n\nSequencing also lets you finish. A finished thing stops consuming attention forever. Three half-finished things consume attention indefinitely and deliver nothing.",
  failureMode: "A roadmap with five concurrent bets, all at 60%, none shipped, every one accruing maintenance and explanation cost. Leadership reads it as an execution problem and adds process, which consumes more of the same scarce attention.",
  experiment: "List everything your team is currently trying to do. Force-rank it, no ties. Then ask what would have to be true to pause everything below rank two for a month. Take that answer to your next planning conversation.",
  reflection: "If you had to pick one initiative to be the only thing your team is known for this quarter, which would it be, and what does the rest of your roadmap say instead?",
  recall: {
    q: "Why is running three initiatives in parallel slower than a third-speed each?",
    a: "They compete for the same scarce inputs - senior attention, review capacity, deep system knowledge - and coordination overhead grows with concurrency.\n\nAnd nothing finishes, so nothing ever stops consuming attention."
  },
  deepDive: "Here is my team's current portfolio of work. Help me force-rank it and build the argument for pausing everything below the top two."
},
{
  id: "firefighting-is-negative-leverage",
  track: "leverage", level: "both",
  title: "A team at full utilisation cannot change",
  source: "Tom DeMarco, Slack",
  idea: "Slack is not waste, it is the capacity to respond and to improve. Load a team to 100% and it loses the ability to absorb surprise or fix the thing generating the surprises.",
  why: "Utilisation and responsiveness trade against each other - the queueing result is that as utilisation approaches 100%, waiting time goes to infinity. A fully loaded team has no capacity to handle the unexpected, so every surprise becomes a crisis and everything queues behind it.\n\nWorse, improvement work is exactly what gets cut first when there is no slack. So the causes of the firefighting never get fixed, and the firefighting compounds. Slack is what pays for escaping that loop.",
  failureMode: "A team permanently at capacity, permanently in incident mode, permanently unable to invest in the fix that would end the incidents. Every quarter someone proposes hardening work and it gets cut for delivery commitments. This is stable and can run for years.",
  experiment: "Find out your team's actual committed load as a percentage of capacity. If it is above 85%, pick one thing to formally drop this week and say out loud that the reason is to create room. Do not let the room be silently absorbed.",
  reflection: "When did your team last complete a piece of work whose only purpose was to make future work easier? If you cannot remember, you have no slack.",
  recall: {
    q: "What does a team lose at 100% utilisation, and why does the problem compound?",
    a: "It loses the ability to absorb surprise, so every surprise becomes a crisis and queues everything behind it.\n\nIt compounds because improvement work is cut first when there is no slack, so the causes of the firefighting are never fixed."
  },
  deepDive: "Help me make the case to my leadership for deliberately running my team below full capacity, in terms they will actually accept."
}
);

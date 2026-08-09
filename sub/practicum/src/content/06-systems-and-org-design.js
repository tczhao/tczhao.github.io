/* Track: Systems and org design. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "conways-law",
  track: "systems", level: "cross",
  title: "Your architecture will copy your org chart",
  source: "Melvin Conway, How Do Committees Invent?",
  idea: "Systems end up structured like the communication paths of the organisation that built them. This is not a tendency to resist, it is close to a constraint.",
  why: "The mechanism is simple. An interface between two components requires agreement between whoever owns them, and agreement is expensive in proportion to communication distance. So teams naturally build the interfaces they can cheaply negotiate and avoid the ones they cannot, regardless of what the design document says.\n\nWhich means an architecture that cuts against your team boundaries will not survive. The design will erode toward the org chart, one pragmatic decision at a time, and everyone will experience it as unrelated instances of technical debt.",
  failureMode: "A clean service boundary drawn between two components owned by teams in different reporting lines with no shared goals. Within a year the boundary is full of leaks and special cases, and nobody can point to the decision that ruined it.",
  experiment: "Draw your current architecture, then draw your team boundaries over it. Where they disagree, that seam is where your integration pain is coming from. Check whether that matches your incident history.",
  reflection: "Which architectural boundary in your system does not correspond to a team boundary, and how much of your friction lives there?",
  recall: {
    q: "What is the mechanism behind Conway's law?",
    a: "Interfaces require agreement between owners, and agreement costs in proportion to communication distance - so teams build the interfaces they can cheaply negotiate and avoid those they cannot.\n\nAn architecture cutting against team boundaries erodes toward the org chart one pragmatic decision at a time, experienced as unrelated technical debt."
  },
  deepDive: "Help me map my system's boundaries against my org's team boundaries and identify where the mismatch is generating friction."
},
{
  id: "inverse-conway",
  track: "systems", level: "cross",
  title: "Design the teams to get the architecture",
  source: "Matthew Skelton and Manuel Pais, Team Topologies",
  idea: "If structure determines architecture, then organising teams around the architecture you want is a lever - and often a stronger one than any technical decision.",
  why: "The inverse Conway manoeuvre takes the constraint and uses it. Want a decoupled system? Create teams that can deliver independently and stop them needing to coordinate. Want a shared platform? Give it a dedicated team with a real mandate rather than a rota of volunteers.\n\nThis reframes reorganisation as a technical instrument, which makes it both more powerful and more dangerous. It also explains why architecture initiatives run purely as engineering programmes tend to fail: the communication structure that produced the old design is still fully intact.",
  failureMode: "A two-year decomposition programme with no change to team structure or ownership. The new services exist and every change still requires four teams to coordinate, because the coupling was in the organisation and only the code was refactored.",
  experiment: "Take an architectural change you want. Write down which teams would need to coordinate to make a routine change afterwards. If the answer is more than one for common changes, the team design is wrong, not the diagram.",
  reflection: "Is the architecture you want achievable without changing who owns what? If not, are you treating it as an engineering problem?",
  recall: {
    q: "What is the inverse Conway manoeuvre?",
    a: "Deliberately shaping teams and their communication paths to produce the architecture you want, using Conway's law as a lever rather than fighting it.\n\nIt also explains why pure-engineering decomposition programmes fail: the communication structure that produced the old design is untouched."
  },
  deepDive: "Help me work out what team structure would be needed to make the architecture I want actually stick."
},
{
  id: "cognitive-load",
  track: "systems", level: "cross",
  title: "Cognitive load is the real limit on a team",
  source: "Matthew Skelton and Manuel Pais, Team Topologies",
  cheat: "An overloaded team is over-scoped, not under-staffed - hiring does not shrink what each person must know for on-call.",
  idea: "A team can only hold so much in its head. Ownership should be bounded by the team's cognitive capacity, not by headcount or by what happens to be adjacent in the codebase.",
  why: "Skelton and Pais separate three loads: intrinsic - the fundamental difficulty of the domain, extraneous - accidental complexity from tooling and process, and germane - the useful thinking about the actual problem. Only the third produces value, and the first two crowd it out.\n\nThe practical consequence is that a team owning eight loosely-related services is not under-resourced, it is over-scoped. Adding a person does not reduce the number of things everyone must understand to be on call. The fix is reducing what the team must hold, usually by giving something away or by lowering extraneous load with better platform.",
  failureMode: "A team with too many systems that responds to being overloaded by hiring. The new person takes six months to be useful, the surface area is unchanged, and on-call is still brutal because everyone still has to know everything.",
  experiment: "List everything your team is on call for. For each, ask whether every team member could debug it at 3am. Anything where the answer is 'only one person' is either over-scope or a knowledge gap - decide which, per item.",
  reflection: "What could your team stop owning that would most reduce what everyone has to hold in their head?",
  recall: {
    q: "What are the three kinds of cognitive load, and what follows for team scope?",
    a: "Intrinsic (domain difficulty), extraneous (accidental complexity from tooling and process), and germane (useful thinking about the problem). Only germane creates value.\n\nAn overloaded team is over-scoped, not under-staffed - adding people does not reduce what each person must understand to be on call."
  },
  deepDive: "Help me assess my team's cognitive load across what we own and identify what to give away or automate first."
},
{
  id: "four-team-types",
  track: "systems", level: "cross",
  title: "Four team types, and only one delivers value directly",
  source: "Matthew Skelton and Manuel Pais, Team Topologies",
  idea: "Stream-aligned teams deliver to users. Platform, enabling and complicated-subsystem teams exist to reduce stream-aligned teams' cognitive load. Confusing the types produces teams with incoherent mandates.",
  why: "Each type has a different success measure, which is the reason the distinction earns its keep. A stream-aligned team is judged on flow of user-visible change. A platform team is judged on whether stream-aligned teams go faster. An enabling team is judged on capability it leaves behind - and should actively be trying to make itself unnecessary in each engagement.\n\nWhen the type is unstated, the team gets measured on the wrong thing. Platform teams asked for feature counts start building things nobody adopts; enabling teams measured on delivery become permanent extra hands.",
  failureMode: "A platform team judged on features shipped. It builds an impressive catalogue with low adoption, because the metric never asked whether anyone was faster. Meanwhile the friction that actually slows every team down is unglamorous and unrewarded.",
  experiment: "Name your team's type explicitly. Then write the success measure that type implies. If it differs from what you are currently reported against, that gap is worth a conversation with your manager this month.",
  reflection: "Is your team's actual mandate one of the four types, or a blend that lets everyone judge you by a different standard?",
  recall: {
    q: "What are the four team types, and how do their success measures differ?",
    a: "Stream-aligned - flow of user-visible change. Platform - whether stream-aligned teams go faster. Enabling - capability left behind, aiming to become unnecessary. Complicated-subsystem - specialist depth held so others need not.\n\nUnstated types get measured on the wrong thing: platform teams judged on feature counts build unadopted catalogues."
  },
  deepDive: "Help me classify my team against the four types and work out what success measure I should be arguing for."
},
{
  id: "interaction-modes",
  track: "systems", level: "cross",
  title: "Collaboration is expensive, so make it temporary",
  source: "Matthew Skelton and Manuel Pais, Team Topologies",
  idea: "Three ways teams interact: collaboration, x-as-a-service, and facilitating. Collaboration is for discovering unknowns and should always be time-boxed, because sustained collaboration is just high coupling.",
  why: "Collaboration has high communication cost and produces high learning, which makes it right for figuring out a new interface and wrong as a steady state. X-as-a-service has low communication cost and low learning, which makes it right once the interface is understood. The pattern is to collaborate briefly to discover the boundary, then move to service.\n\nNaming the mode explicitly is what prevents the drift. Teams that never name it stay in permanent collaboration, which feels cooperative and delivers the coordination cost of a single team with none of the shared context.",
  failureMode: "Two teams in a standing weekly sync that has run for a year. Everyone considers the relationship healthy. In practice neither team can ship independently, and the sync exists because the interface between them was never made good enough to not need conversation.",
  experiment: "For your most collaboration-heavy relationship, ask what would have to be true to move to a service interface. Set a date to reassess. If the answer is 'nothing would work', name what is missing from the interface.",
  reflection: "Which of your standing cross-team meetings is compensating for an interface that should have been finished?",
  recall: {
    q: "What are the three interaction modes, and why must collaboration be time-boxed?",
    a: "Collaboration, x-as-a-service, and facilitating.\n\nCollaboration is high-cost, high-learning - right for discovering a boundary, wrong as a steady state. Sustained collaboration is coupling: neither team can ship independently, and the standing sync compensates for an unfinished interface."
  },
  deepDive: "Help me classify my team's cross-team relationships by interaction mode and find which should have graduated to a service."
},
{
  id: "platform-as-product",
  track: "systems", level: "cross",
  title: "A platform nobody chooses is not a platform",
  source: "Evan Bottcher, What I Talk About When I Talk About Platforms",
  idea: "Bottcher's test is whether the platform is a compelling internal product - something teams adopt because it is genuinely the easiest path, not because they were told to.",
  why: "Mandated platforms hide their own failure. Adoption tells you nothing about value when there was no alternative, so the feedback loop that would reveal a bad interface is severed. Voluntary adoption is a harsh but honest signal.\n\nThis implies the standard product disciplines apply: you have users with alternatives, you must understand their actual workflow, you need documentation and support, and you have to earn migration rather than requiring it. Platform teams that skip this build technically sound things that people route around.",
  failureMode: "An internal platform with a mandate and a compliance dashboard. Adoption is 100%, satisfaction is terrible, and three teams have quietly built shadow tooling on top to make it usable. Leadership sees a successful rollout.",
  experiment: "Ask three engineers outside your team what they would use instead if your platform were optional. The answer tells you what your real competition is - and it is often a shell script.",
  reflection: "If your platform lost its mandate tomorrow, what would adoption be in six months?",
  recall: {
    q: "What is the test for whether something is really a platform?",
    a: "Whether teams would choose it if they had an alternative - a compelling internal product rather than a mandate.\n\nMandates sever the feedback loop that would reveal a bad interface, so adoption numbers stop carrying information about value."
  },
  deepDive: "Help me evaluate my platform as if it were a product competing for voluntary adoption, and find where it would lose."
},
{
  id: "brooks-law",
  track: "systems", level: "both",
  title: "Adding people to a late project makes it later",
  source: "Frederick Brooks, The Mythical Man-Month",
  idea: "New people consume the time of existing people to become useful, and every addition increases communication paths quadratically. Late in a project, both costs land before any benefit does.",
  why: "The onboarding cost is paid by exactly the people who are already the constraint. The communication cost is structural: n people have n(n-1)/2 pairs, so each addition adds more coordination than the last. Neither effect is about the quality of the new person.\n\nThe corollary matters more than the law: work that can be cleanly partitioned with few dependencies does absorb people. Work requiring shared context does not. So the honest question when offered more headcount is whether the remaining work partitions.",
  failureMode: "Two engineers added to a slipping project six weeks from the deadline. The three people who understood the system spend a fortnight explaining it. The date slips further and the conclusion drawn is that the team was under-resourced all along.",
  experiment: "If you are considering adding someone to something late, write down what they could do in their first two weeks with no help from the current team. If the answer is nothing, you have your answer.",
  reflection: "When did you last accept extra headcount that made things slower? What did you tell yourself at the time?",
  recall: {
    q: "Why does adding people to a late project slow it down, and what is the corollary?",
    a: "Onboarding consumes exactly the people who are already the constraint, and communication paths grow quadratically.\n\nThe corollary: cleanly partitionable work with few dependencies does absorb people. Work needing shared context does not - so ask whether the remaining work partitions."
  },
  deepDive: "Help me assess whether the remaining work on a project I describe can actually absorb more people."
},
{
  id: "conceptual-integrity",
  track: "systems", level: "cross",
  title: "Coherence beats a collection of good ideas",
  source: "Frederick Brooks, The Mythical Man-Month",
  idea: "Brooks argued conceptual integrity is the most important attribute of a system, and it is better to reflect one set of design ideas than many good but uncoordinated ones.",
  why: "A system with one coherent model is learnable: understand the model and you can predict the parts you have not read. A system that is a union of individually excellent decisions has no such property, so every area must be learned separately and every change requires local archaeology.\n\nThis is why Brooks favoured a small number of architects over design by committee. Coherence is not the average of good judgements - it requires someone holding the whole shape, which is a role rather than a process.",
  failureMode: "A codebase where each module is defensible and no two agree on error handling, configuration, or naming. Every code review argues fundamentals from scratch. Onboarding takes a year because there is no model to learn, only territory to memorise.",
  experiment: "Pick two recently-touched areas of your system and compare how they handle one cross-cutting concern - errors, config, retries. If they differ, ask whether anyone currently holds the whole shape.",
  reflection: "Could a new engineer on your team predict how an unfamiliar part of your system behaves? If not, what is the missing model?",
  recall: {
    q: "Why does Brooks rank conceptual integrity above a collection of good decisions?",
    a: "One coherent model is learnable - understand it and you can predict unread parts. A union of individually good decisions must be learned area by area.\n\nCoherence is not the average of good judgements; it needs someone holding the whole shape, which is a role rather than a process."
  },
  deepDive: "Help me find where my system has lost conceptual integrity and what the unifying model should be."
},
{
  id: "long-lived-teams",
  track: "systems", level: "cross",
  title: "Move work to teams, not teams to work",
  source: "Matthew Skelton and Manuel Pais, Team Topologies",
  idea: "Teams take months to become effective and that investment is destroyed by reshuffling. Keep teams stable and flow work through them, rather than reassembling people per project.",
  why: "A team's value is largely in accumulated shared context - the system knowledge, the working agreements, the calibration on quality. None of that transfers with the individuals. Disband and reform and you restart the clock, having kept only the résumés.\n\nThe implication is that project-based staffing is far more expensive than it appears, because the cost is invisible: it shows up as slowness in the first months of every new formation, which gets attributed to ramp-up rather than to a structural choice.",
  failureMode: "An organisation that forms a team per initiative. Every team spends its first two months finding its feet, initiatives run about two quarters, and consequently no team is ever past the awkward phase. Delivery is permanently mediocre and nobody can identify why.",
  experiment: "Work out how long your teams have existed in their current shape. If the median is under a year, count how much of your delivery time is being spent in formation rather than in flow.",
  reflection: "What would you have to change to stop reorganising people around work and start routing work to stable teams?",
  recall: {
    q: "Why is project-based team formation more expensive than it looks?",
    a: "A team's value is accumulated shared context - system knowledge, working agreements, quality calibration - and none of it transfers with individuals.\n\nThe cost is invisible: it appears as slowness early in every new formation and gets excused as ramp-up rather than recognised as a structural choice."
  },
  deepDive: "Help me make the case for stable teams with work flowing to them, against the flexibility argument for project staffing."
},
{
  id: "reorg-cost",
  track: "systems", level: "cross",
  title: "A reorganisation costs a quarter before it returns anything",
  source: "Will Larson, An Elegant Puzzle",
  idea: "Reorganisations reset relationships, ownership, and trust. The cost is large, front-loaded and certain; the benefit is speculative and delayed. That asymmetry should raise the bar considerably.",
  why: "The visible cost is the transition. The hidden cost is that everyone spends weeks working out who to ask about what, on-call knowledge is redistributed, informal ownership evaporates, and any political capital individuals had accumulated is reset.\n\nSo the bar should be a structural problem that no other intervention addresses - a genuine Conway mismatch, a team past cognitive capacity, an unstaffed critical function. Reorganising to signal change, to solve a personality conflict, or to flatter a new leader's preferences reliably costs more than it returns.",
  failureMode: "Annual reorganisations, each defensible in isolation. The organisation spends most of its existence in transition, never accumulates institutional knowledge, and every leader inherits a structure they did not design and therefore wants to change.",
  experiment: "If you are contemplating a structural change, write down the specific problem it solves and one non-structural alternative you have genuinely tried. If you cannot name the alternative, try it first.",
  reflection: "What problem is your last reorganisation supposed to have solved? Did it?",
  recall: {
    q: "Why should the bar for reorganising be high?",
    a: "The cost is large, front-loaded and certain - relationships, ownership, on-call knowledge and accumulated political capital all reset - while the benefit is speculative and delayed.\n\nJustified only by structural problems nothing else addresses: a real Conway mismatch, a team past cognitive capacity, an unstaffed critical function."
  },
  deepDive: "Help me pressure-test whether a structural change I am considering is justified, and what non-structural alternatives exist."
},
{
  id: "meadows-leverage-points",
  track: "systems", level: "cross",
  title: "Adjusting numbers is the weakest way to change a system",
  source: "Donella Meadows, Leverage Points",
  cheat: "Before raising a target, ask what information the people involved lack and get it in front of them within a week.",
  idea: "Meadows ranks intervention points by power. Tuning parameters is near the bottom. Changing information flows, rules, goals, and the paradigm behind them is progressively more powerful and progressively harder.",
  why: "Most management attention goes to the weakest levers, because they are the visible and available ones: adjust the headcount, change the target, tweak the process step. These rarely move behaviour, because the structure generating the behaviour is untouched.\n\nThe strongest accessible lever for most managers is information flow - who finds out what, when. Making a previously invisible consequence visible to the person causing it changes behaviour without needing any authority over goals or rules.",
  failureMode: "A team whose quality problem is addressed by raising the coverage target. The number is met, quality is unchanged, because the actual issue was that nobody found out about production failures unless a customer complained. The available lever was pulled; the effective one was not.",
  experiment: "Take a behaviour you want to change. Instead of adjusting a target, ask what information the people involved currently lack, and how you could get it in front of them within a week.",
  reflection: "What consequence of your team's work is currently invisible to the people who cause it?",
  recall: {
    q: "Where do parameter changes sit in Meadows's hierarchy, and what is the strongest lever most managers can actually reach?",
    a: "Near the bottom - tuning numbers rarely moves behaviour because the generating structure is untouched.\n\nInformation flow is the strongest accessible one: making a previously invisible consequence visible to whoever causes it changes behaviour without authority over goals or rules."
  },
  deepDive: "Help me find the information flow I could change to shift a behaviour I have been trying to fix with targets."
},
{
  id: "the-informal-network",
  track: "systems", level: "cross",
  title: "The org chart is not the organisation",
  source: "Rob Cross and Andrew Parker, The Hidden Power of Social Networks",
  idea: "Information and influence flow through an informal network that only partly matches the reporting structure. Knowing who is actually consulted matters more than knowing who reports to whom.",
  why: "Every organisation has a handful of people who are disproportionately consulted - not necessarily senior, often long-tenured or unusually helpful. They are the real transmission mechanism for both information and norms, and they are invisible on the chart.\n\nPractically, this changes who you talk to. A change endorsed by three network hubs propagates; the same change announced through formal channels alone often does not. It also identifies bottlenecks: a hub who is overloaded slows down everything routed through them, and nobody can see it in any system of record.",
  failureMode: "A well-designed change communicated impeccably through the formal hierarchy that quietly fails to take, because the two people everyone actually asks were never consulted and are privately sceptical.",
  experiment: "Ask three people on different teams who they go to when they are stuck on something outside their area. The names that repeat are your network hubs. Note whether you have talked to them about your current priority.",
  reflection: "Who are the three most consulted people in your organisation, and how do you know?",
  recall: {
    q: "Why does the informal network matter more than the reporting structure for driving change?",
    a: "A few disproportionately-consulted people - often not senior - are the real transmission mechanism for information and norms, and they are invisible on the chart.\n\nChange endorsed by network hubs propagates; the same change announced only through formal channels often does not."
  },
  deepDive: "Help me map the informal network in my organisation and work out whose endorsement my current initiative actually needs."
}
);

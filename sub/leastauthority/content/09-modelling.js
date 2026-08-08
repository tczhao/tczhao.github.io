/* Track: Threat modelling and review. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "modelling-stride-on-a-diagram",
  track: "modelling", level: "practice",
  title: "STRIDE is applied to a diagram, not recited as a list",
  source: "Adam Shostack, Threat Modeling: Designing for Security (Wiley, 2014)",
  idea: "Spoofing, tampering, repudiation, information disclosure, denial of service and elevation of privilege are six questions you ask at each element of a specific diagram, and nothing at all as a slide.",
  why: "Each letter is the negation of a property you were relying on: spoofing negates authentication, tampering negates integrity, repudiation negates accountability, disclosure negates confidentiality, denial of service negates availability, elevation negates authorisation. Walking them across a drawn element is a forcing function, because the mnemonic asks the question at the place you would otherwise have skimmed.\n\nThe unit of work is the element, not the system. A process, a data store, a data flow and an external entity each attract a different subset, and the yield comes from doing all six at one box rather than one letter at the whole architecture.",
  failureMode: "The review minutes say STRIDE was applied and contain zero findings. Nobody asked the tampering question at the flow where a tenant's asset description reaches the agent's context, so the field stays attacker-controlled and unlabelled, and the first person to notice is whoever reads the incident timeline.",
  experiment: "Pick one flow in your runtime, say retrieval of tenant metadata into a prompt, and write the six letters down the left of a page. Write one concrete threat per letter or write 'not applicable, because'. Count how many of the six you cannot answer without asking someone else.",
  reflection: "Which of the six did you have no answer for, and is that a gap in the design or a gap in what you know about the design?",
  recall: {
    q: "What is the unit of work in a STRIDE pass, and what security property does each of the six letters negate?",
    a: "The unit is the individual element on a data flow diagram: process, data store, flow, or external entity. You run all six letters at one element rather than one letter across the system.\n\nSpoofing negates authentication, tampering integrity, repudiation non-repudiation, information disclosure confidentiality, denial of service availability, elevation of privilege authorisation."
  },
  deepDive: "Take the flow where customer-authored metadata reaches my agent's context window and run all six STRIDE letters at each element, telling me which ones I have no mitigation for."
},
{
  id: "modelling-four-questions",
  track: "modelling", level: "practice",
  title: "Four questions carry the whole method",
  source: "Threat Modeling Manifesto (2020), Braiterman, Shostack, Zalewski et al.",
  idea: "What are we working on, what can go wrong, what are we going to do about it, and did we do a good job is the smallest process that still produces a threat model.",
  why: "The four questions are ordered by dependency. You cannot enumerate threats against a system you have not described, you cannot choose mitigations without threats, and you cannot judge the method without checking mitigations against reality. Any heavier framework is an elaboration of one of the four, which means you can adopt the frameworks selectively and still have a complete method.\n\nThe fourth question is the one teams drop, and it is the only one that improves the method rather than the system. Without it a threat model is a one-way write of opinions with no error signal.",
  failureMode: "A team spends two weeks on question two, produces forty threats in a spreadsheet, ships none of the mitigations because question three was never scheduled, and the spreadsheet becomes evidence at the next audit that a risk was known and unaddressed.",
  experiment: "Take the last design doc your team shipped and answer all four questions in four sentences on one page. If question one takes more than three sentences, the scope is too large and you are modelling a product rather than a change.",
  reflection: "Which of the four questions does your team routinely skip, and what would have to change for the fourth to have an owner?",
  recall: {
    q: "What are the four questions of the Threat Modeling Manifesto, and which one do teams most often drop?",
    a: "What are we working on, what can go wrong, what are we going to do about it, and did we do a good job. They are ordered by dependency: each needs the answer to the one before it.\n\nThe fourth is dropped most often. It is the only question that produces an error signal about the method itself, which is why its absence lets a bad method persist for years."
  },
  deepDive: "Answer the four threat modelling questions for the change I am about to describe, and be blunt about which answers are guesses."
},
{
  id: "modelling-trust-boundary",
  track: "modelling", level: "practice",
  title: "The trust boundary is the only line on the diagram that matters",
  source: "Microsoft Security Development Lifecycle, threat modelling guidance",
  idea: "A data flow diagram earns its keep at the moment two people argue about where a boundary goes, because that argument surfaces an assumption nobody had stated.",
  why: "Boxes and arrows are documentation. The boundary is a claim: data crossing this line changes trust level, so it must be authenticated, validated, or authorised here. Every STRIDE finding of consequence sits on a boundary crossing, which is why the standard advice is to draw boundaries first and elements second.\n\nThe argument is the deliverable. When one engineer draws the boundary around the whole agent runtime and another draws it between the model and the tool executor, they have just discovered they hold incompatible beliefs about whether model output is trusted input. That disagreement was already in the code; the diagram only made it sayable.",
  failureMode: "Everyone draws the boundary at the public API and stops. Model output flowing into a tool call is drawn as an internal arrow, so it inherits the trust of the process it lives in, and a paragraph of customer-authored text ends up selecting which credential gets used.",
  experiment: "Draw your runtime in five boxes on paper and put a dashed line everywhere you believe trust changes. Show it to one other engineer and ask them to move one line. Write down the assumption their move exposed.",
  reflection: "Where did the two of you disagree, and which of you is currently right about what the code does?",
  recall: {
    q: "Why is the trust boundary the load-bearing element of a data flow diagram rather than the boxes?",
    a: "A boundary is a claim that data crossing it changes trust level and therefore needs authentication, validation or authorisation at the crossing. Findings cluster on crossings, so boundaries are drawn before elements.\n\nIts second function is social: two engineers placing the boundary differently have surfaced a disagreement about what is trusted that already existed in the code and was previously unsayable."
  },
  deepDive: "Here is my runtime architecture; tell me where you would draw the trust boundaries and where you think I have drawn them wrong."
},
{
  id: "modelling-attack-trees",
  track: "modelling", level: "classical",
  title: "Attack trees make an adversary's options enumerable",
  source: "Bruce Schneier, Attack Trees, Dr. Dobb's Journal, December 1999",
  idea: "Put the attacker's goal at the root, refine it into alternative sub-goals, and you can cost each leaf and see which mitigation removes a branch rather than a leaf.",
  why: "The tree separates goal from method. Root nodes are what the attacker wants, child nodes are OR-alternatives or AND-conjunctions of how, and leaves are concrete acts. Annotating leaves with a value - cost, skill required, whether special equipment is needed, legality - propagates upward, so the cheapest path to the root is computable rather than argued.\n\nThat propagation is what makes the tree a decision tool. A control that raises the cost of one leaf leaves the sibling leaves untouched and the root reachable at the same price, whereas a control at a branch node invalidates everything beneath it. Most security spend is leaf spend defended as branch spend.",
  failureMode: "You add prompt-level guardrails to the summarisation tool because that is where last quarter's demo attack landed. The root goal was exfiltrate another tenant's metadata, and the sibling leaves - the search tool, the export tool, the webhook - are all still there at the original price.",
  experiment: "Write one root: attacker reads tenant B's data through the agent. Refine it into three sub-goals and two leaves each. Mark which of your existing controls sit at a branch and which sit at a leaf. The count of branch-level controls is usually zero or one, and that number is the finding.",
  reflection: "What is the cheapest path from a leaf to your root today, and what would move that cost by an order of magnitude?",
  recall: {
    q: "In an attack tree, what is the difference between mitigating at a leaf and mitigating at a branch node?",
    a: "A leaf mitigation raises the cost of one concrete act. Sibling leaves under the same OR node remain, so the cheapest path to the root usually shifts sideways rather than getting more expensive.\n\nA branch mitigation invalidates everything beneath that node. Costing the leaves and propagating upward is what tells you which of the two you just bought."
  },
  deepDive: "Build an attack tree with the root 'reads another tenant's data through the agent' for my runtime, and cost the leaves so I can see where my controls actually sit."
},
{
  id: "modelling-misuse-cases",
  track: "modelling", level: "classical",
  title: "Misuse cases describe what the system must refuse to do",
  source: "Sindre and Opdahl, Eliciting Security Requirements with Misuse Cases, Requirements Engineering Journal 10(1), 2005",
  idea: "Writing the hostile actor's case in the same notation as the user's puts negative requirements into the same backlog as features, which is the only place they get built.",
  why: "A misuse case inverts the use case: an actor with hostile intent, a goal the system must prevent, and threatens and mitigates relations linking it to the normal cases it attacks. Because it uses the same notation and lives in the same artefact, it competes for sprint capacity on equal terms instead of living in a security document nobody sizes.\n\nThe inversion also fixes the elicitation problem. Asked what the system should do, people describe features; asked what an actor with the same access and opposite intent would do, the same people produce specific answers, because they are still reasoning about a concrete actor and a concrete goal.",
  failureMode: "The security requirements live in a Confluence page called Security Considerations. Nothing on it has a ticket number, so nothing on it has a sprint, and at launch the answer to 'did we build the rate limit' is that it was considered.",
  experiment: "Take one user story from your current sprint and write its mirror: same actor capabilities, hostile goal, one sentence. Put it in the tracker with a real ticket number and see whether anyone sizes it. Whether it gets sized is the checkable result.",
  reflection: "How many of your negative requirements currently exist as tickets rather than prose, and who would notice if none of them shipped?",
  recall: {
    q: "What does a misuse case add over a paragraph of security requirements written in prose?",
    a: "It uses the same notation as a use case - hostile actor, goal, and threatens or mitigates links to the normal cases - so it enters the same backlog and gets sized against features rather than sitting in a separate document.\n\nIt also elicits better. People asked to describe an actor with equal access and opposite intent give concrete answers, where people asked for security requirements give abstractions."
  },
  deepDive: "Take these three user stories from my agent runtime and write the mirrored misuse case for each, phrased so I can put them straight into the tracker."
},
{
  id: "modelling-assumptions-are-the-output",
  track: "modelling", level: "practice",
  title: "The assumptions are the output, not the diagram",
  source: "Ross Anderson, Security Engineering, 3rd edition (Wiley, 2020)",
  idea: "A threat model's durable artefact is the numbered list of things you assumed true, because those are what you re-check when the architecture or the vendor changes.",
  why: "Every finding you closed rests on a premise: the sandbox contains the process, the token expires in fifteen minutes, the vector store only holds documents the caller can already read, the vendor does not train on our traffic. Those premises are the model's load-bearing structure, and they are the parts most likely to change without anyone re-opening the diagram.\n\nNumbering matters because it makes them addressable. A mitigation review that can say assumption four no longer holds is doing configuration management on a security argument. A prose paragraph containing the same claim cannot be cited, diffed, or invalidated.",
  failureMode: "The model assumed tool calls run under a short-lived per-request token. Six months later someone adds a background job that needs a token outliving the request, the token becomes long-lived for everyone, and the assumption dies silently because it was a sentence in a doc rather than a numbered line with a review date.",
  experiment: "Open your most recent design doc and extract every load-bearing security assumption into a numbered list. For each, write the observable that would tell you it had stopped being true. Any assumption with no observable is one you cannot monitor, and that count is the finding.",
  reflection: "Which assumption on your list would be the most expensive to have been quietly wrong about for six months?",
  recall: {
    q: "Why is the numbered assumption list a more durable threat model artefact than the diagram?",
    a: "Findings are closed on the strength of premises: the sandbox holds, the token is short-lived, the store only contains readable documents. Those premises change without anyone reopening the diagram, and they are what the model actually rests on.\n\nNumbering makes them addressable, so a later review can say assumption four no longer holds. Prose containing the same claim cannot be cited or invalidated."
  },
  deepDive: "Read this design doc and extract the numbered list of security assumptions it depends on, plus the observable that would show each one had stopped holding."
},
{
  id: "modelling-flows-not-behaviours",
  track: "modelling", level: "modern",
  title: "Threat modelling a non-deterministic system means modelling flows, not behaviours",
  source: "NIST AI 100-2, Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations",
  idea: "You cannot enumerate what a model will do, so enumerate what can enter its context, what authority it can invoke and where output can go, and reason over that graph instead.",
  why: "Classical threat modelling assumes an element with specifiable behaviour, so you can argue that a given input produces a bounded set of outputs. A language model breaks that assumption: the behaviour is a distribution, and any argument of the form the model will not do X is a probabilistic claim you cannot audit. What remains specifiable is the topology - the set of sources that can reach the context, the set of tools the runtime will execute, and the set of sinks output can reach.\n\nThat topology is enumerable, testable and enforceable outside the model. It is also the level at which the useful controls exist: you cannot make the model refuse reliably, but you can make the tool unreachable, the credential absent, or the sink closed. Willison's lethal trifecta framing and Meta's Agents Rule of Two are both statements about this graph rather than about model behaviour.",
  failureMode: "The design review spends an hour on system prompt wording and none on the fact that the agent holds a tenant-wide read credential while summarising customer-authored descriptions and can post to a webhook. The wording is untestable, and the three-way flow is the whole vulnerability.",
  experiment: "Write three columns for one agent you run: sources that can reach the context, tools the runtime can execute, sinks output can reach. Fill them exhaustively for one code path. If any source is customer-authored and any sink is external while a privileged tool sits in the middle, you have found today's finding without touching the model.",
  reflection: "Which of the three columns is longest, and which one could you actually shorten this quarter?",
  expires: "2028-02-01",
  deepDive: "Help me build the sources, tools and sinks table for one code path in my agent runtime, and tell me which combinations are the dangerous ones.",
  recall: {
    q: "Why does classical element-level threat modelling break on a language model, and what do you enumerate instead?",
    a: "Classical modelling assumes an element whose behaviour is specifiable, so you can bound the outputs of a given input. Model behaviour is a distribution, so any 'the model will not do X' claim is unauditable.\n\nEnumerate the topology instead: what can enter the context, what authority the runtime will execute, where output can go. That graph is testable and enforceable outside the model, and it is where the real controls live."
  }
},
{
  id: "modelling-attribution-maestro-owasp",
  track: "modelling", level: "modern",
  title: "MAESTRO is Cloud Security Alliance and the LLM Top 10 is OWASP",
  source: "Cloud Security Alliance, Agentic AI Threat Modeling Framework MAESTRO (2025); OWASP Top 10 for LLM Applications",
  idea: "MAESTRO is a Cloud Security Alliance layered threat modelling framework for agentic systems, and the LLM and agentic Top 10 lists are OWASP, and confusing the two costs you the room.",
  why: "They are different artefacts for different audiences. The OWASP lists are a ranked catalogue of weakness classes aimed at builders who want to know what commonly goes wrong. MAESTRO is a layered decomposition aimed at someone doing a structured threat model of an agentic architecture, closer in shape to STRIDE than to a top ten.\n\nThe attribution matters beyond pedantry. In a security review or an enterprise questionnaire, misciting a framework is the cheapest available signal that you are quoting rather than using it, and it costs you the benefit of the doubt on every claim you make afterwards. Both bodies publish dated documents; cite the version you actually read.",
  failureMode: "You tell a prospect's security team you threat modelled against the OWASP MAESTRO framework. One person in the room knows it is CSA, and now every other assurance in your deck is being read as recited rather than done.",
  experiment: "Open the two documents and write one sentence each on what artefact they produce and who the intended reader is. Note the version and publication date of each next to the sentence. This is a note, not a command to run, and the checkable output is that you can name both bodies correctly without looking.",
  reflection: "Which of the two are you actually using in your reviews, and which one do you only cite?",
  expires: "2027-10-01",
  recall: {
    q: "Who publishes MAESTRO, who publishes the LLM Top 10, and how do the two artefacts differ in kind?",
    a: "MAESTRO is Cloud Security Alliance. The Top 10 for LLM and agentic applications is OWASP.\n\nThey differ in kind, not just in publisher. The OWASP lists are a ranked catalogue of weakness classes for builders; MAESTRO is a layered decomposition for someone running a structured threat model of an agentic architecture, closer in shape to STRIDE than to a top ten."
  },
  deepDive: "Compare MAESTRO and the OWASP LLM Top 10 as artefacts and tell me which one fits a design review of my agent runtime and which fits a vulnerability checklist."
},
{
  id: "modelling-review-comment-names-the-flow",
  track: "modelling", level: "practice",
  title: "A useful review comment names the flow",
  source: "Google, Code Review Developer Guide (google/eng-practices)",
  idea: "Have you considered X puts the work back on the author and dodges accountability, while attacker writes here, agent reads here, credential used here is a claim the author can refute or fix.",
  why: "A question transfers the burden of proof without transferring any information. The author now has to reconstruct what you were worried about, and the cheapest way to close the thread is a reassuring sentence that neither of you can check. A named flow is falsifiable: either the attacker can write to that field or they cannot, and the disagreement resolves against the code.\n\nIt also puts your reputation behind the finding, which is the point. Reviewers who only ask questions accumulate no track record, so their comments carry no weight when they need to block something. Reviewers who make specific claims are occasionally wrong in public and are listened to when they are right.",
  failureMode: "The review comment reads 'have you thought about prompt injection here?'. The author replies that the system prompt instructs the model to ignore instructions in data. Both parties feel the thread is resolved, the LGTM lands, and no one has established whether the description field is tenant-writable.",
  experiment: "Find the last three security comments you left in a pull request. Rewrite each into the form: attacker controls A, it reaches B, which invokes C with authority D. Count how many you can complete without opening the code, because the ones you cannot complete were questions dressed as findings.",
  reflection: "Which of your three comments turned out to be wrong once you named the flow, and would you rather have found that out now or in the thread?",
  recall: {
    q: "What makes 'attacker writes here, agent reads here, credential used here' a better review comment than 'have you considered prompt injection'?",
    a: "The named flow is falsifiable. Either the attacker controls that field or not, so the thread resolves against the code rather than against a reassuring reply, and the burden of proof stays with the reviewer who raised it.\n\nIt also builds a track record. A reviewer who makes specific claims is sometimes wrong in public and is listened to when they need to block something; a reviewer who only asks questions has no standing."
  },
  deepDive: "Rewrite these review comments of mine into named flows, and tell me which ones I cannot actually substantiate."
},
{
  id: "modelling-paved-road-not-bottleneck",
  track: "modelling", level: "practice",
  title: "Review other people's designs without becoming their bottleneck",
  source: "OWASP SAMM, Design domain and security champions guidance",
  idea: "Publish the paved road and the five questions, review the designs that leave the road, and let everything on it ship without you.",
  why: "Review capacity is fixed and design volume is not, so any policy of reviewing everything degrades into either a queue or a rubber stamp. Both are worse than triage, because a queue teaches teams to route around you and a stamp teaches them that review means nothing.\n\nThe paved road converts most reviews into a build-time property. If the standard runtime already gives short-lived per-tenant credentials, an egress allowlist and a tool registry, then a design that uses it inherits those answers and needs no meeting. Your attention goes to the designs that opt out, and the opt-outs are where the interesting threats live anyway.",
  failureMode: "You insist on reviewing every design touching the agent runtime. Within a quarter the queue is three weeks deep, two teams have shipped by not calling their thing an agent, and you find out at the incident review that one of them wired a tool to a service account with tenant-wide write.",
  experiment: "Write the five questions whose answers decide whether a design is on your paved road, in under a page, and send it to one team about to start a design. Checkable result: they self-assess and only one of the five needs you.",
  reflection: "What fraction of your last ten reviews would the paved road have handled without you, and what stopped you writing it down?",
  recall: {
    q: "Why does reviewing every design fail, and what replaces it?",
    a: "Review capacity is fixed while design volume is not, so universal review becomes a queue or a rubber stamp. A queue teaches teams to route around the reviewer and a stamp teaches them the review is meaningless.\n\nA published paved road plus a short self-assessment converts the common case into an inherited property of the platform. Reviewer attention goes to designs that leave the road, which is where the novel threats are."
  },
  deepDive: "Help me draft the five questions that decide whether a design is on my agent runtime's paved road and can ship without a security review."
},
{
  id: "modelling-accepted-risk-has-a-name",
  track: "modelling", level: "practice",
  title: "Accepted risk is written down and owned by a person",
  source: "NIST SP 800-37 Revision 2, Risk Management Framework for Information Systems and Organizations",
  idea: "An accepted risk with no named accepter and no review date is an unaccepted risk that will be rediscovered during an incident with your name on it.",
  why: "Acceptance is a decision with an owner, a scope and an expiry, which is why the RMF puts a named authorising official at the point of authorisation rather than a committee. The name does two things: it makes the decision reversible by identifying who can revisit it, and it makes the tradeoff visible to the person who actually bears the consequence.\n\nThe review date is the other half. Risks are accepted against a context - this many tenants, this data class, this blast radius - and the context moves. Without a date the acceptance silently converts from a considered tradeoff into a permanent property of the system that no living person chose.",
  failureMode: "The agent runs tools under a shared service account because per-tenant credentials were three weeks of work. Everyone agrees it is temporary. Eighteen months later nobody can name who accepted it, the engineers who made the call have moved teams, and the incident writeup records it as an unknown gap rather than a known tradeoff.",
  experiment: "List every security shortcut currently live in your runtime. For each write a name, a date it was accepted, and a date it gets revisited. Any row where you cannot fill the name column is a risk nobody accepted, and the count of those rows goes to your skip-level this week.",
  reflection: "Whose name is on the largest accepted risk in your system, and does that person know it?",
  recall: {
    q: "What are the three fields that turn a known weakness into an accepted risk?",
    a: "A named accepter, an explicit scope, and a review date. The name identifies who can revisit the decision and who bears the consequence; the RMF places a single authorising official at that point for exactly this reason.\n\nThe review date matters because acceptance was made against a context - tenant count, data class, blast radius - that moves. Without it the tradeoff quietly becomes a permanent property nobody chose."
  },
  deepDive: "Turn this list of known shortcuts in my runtime into a risk acceptance register with owners, scopes and review dates, and tell me which ones I should not be accepting."
},
{
  id: "modelling-arrive-with-an-architecture",
  track: "modelling", level: "practice",
  title: "Arrive at the security gate with an architecture, not a promise",
  source: "Cloud Security Alliance, Consensus Assessments Initiative Questionnaire",
  idea: "Enterprise buyers ask the same structured questions every time, so a one-page diagram of tenant boundary, credential lifetime and egress control converts a blocking review into a short meeting.",
  why: "The buyer's security team is working from a standard questionnaire mapped to a control matrix. The questions are known in advance, they are about mechanism rather than intent, and the reviewer's job is to find the gap between what your marketing says and what your architecture does. A diagram answers twenty of those questions at once because it shows mechanism, and mechanism is what maps to a control.\n\nA promise fails the same review for a structural reason: it is unverifiable, so the reviewer must either take it on trust or escalate. Escalation is the expensive path, and it is the default when there is nothing on the page to point at.",
  failureMode: "You go into the call saying tenant data is isolated and the model does not see other tenants' content. The reviewer asks how isolation is enforced at the tool layer, you say by design, and the deal acquires a security dependency and a six week schedule that lands on your team.",
  experiment: "Draw the one-pager now, before anyone asks: tenant boundary, where credentials come from and how long they live, what egress is permitted and who allowlists it. Then open the CAIQ and count how many of its questions your single page already answers.",
  reflection: "Which question on the page do you currently answer with intent rather than mechanism, and what would it take to make it mechanism?",
  recall: {
    q: "Why does a one-page architecture diagram beat a set of assurances in an enterprise security review?",
    a: "The buyer's reviewer works from a standard questionnaire mapped to a control matrix, so the questions are known ahead of time and are about mechanism. A diagram showing tenant boundary, credential lifetime and egress control answers many of them at once because each maps to a control.\n\nA promise is unverifiable, so the reviewer must either trust it or escalate, and escalation is the default. That is how a review turns into a schedule dependency."
  },
  deepDive: "Help me draft the one-page security architecture for my agent runtime: tenant boundary, credential lifetime, egress control, in the form an enterprise reviewer expects."
},
{
  id: "modelling-what-to-bring-security",
  track: "modelling", level: "practice",
  title: "Bring security the flows, the authority and the decision you want",
  source: "Adkins, Beyer, Blankinship, Lewandowski, Oprea and Stubblefield, Building Secure and Reliable Systems (O'Reilly, 2020)",
  idea: "Engage early with a data flow diagram, the list of credentials in play and a specific ask, because a request to look at this returns a queue position and a diagram returns a decision.",
  why: "A security function is a shared, oversubscribed resource, and its cost per engagement is dominated by context acquisition. If you supply the context, the marginal cost of your request collapses and you jump the queue legitimately. If you do not, they must reconstruct your architecture in a meeting, which is the slow and error-prone path for both of you.\n\nThe specific ask matters as much as the diagram. Reviewers answer questions; they do not generate opinions on unbounded surfaces. Is this credential scope acceptable for a tool invoked from customer-authored text is answerable in one meeting. Please review our agent is not a question and will be treated accordingly.",
  failureMode: "You send a Slack message asking for a security review of the agent runtime three days before the launch date. It gets triaged behind two other reviews, the first meeting is spent explaining what a tenant is, and the finding that would have changed the design arrives after the design is frozen.",
  experiment: "Before your next engagement, prepare three things: a flow diagram of one page, a table of every credential the path touches with its scope and lifetime, and one sentence beginning 'the decision I need from you is'. Checkable result: the first meeting produces a decision rather than a follow-up meeting.",
  reflection: "What decision do you actually need from security this quarter, and could you state it in one sentence right now?",
  recall: {
    q: "What three things should you bring to a security engagement, and why does each one shorten it?",
    a: "A one-page flow diagram, a table of credentials in play with scope and lifetime, and a single sentence naming the decision you need. The first two remove the context acquisition that dominates the reviewer's cost.\n\nThe named decision matters because reviewers answer questions rather than generating opinions on unbounded surfaces. 'Please review our agent' is not a question and gets a queue position instead of an answer."
  },
  deepDive: "Prepare my security engagement package for this feature: the flow diagram, the credential table, and the single decision sentence."
},
{
  id: "modelling-incident-to-assumption",
  track: "modelling", level: "practice",
  title: "Close the loop by mapping each incident to the assumption that failed",
  source: "Beyer, Murphy, Rensin, Kawahara and Thorne, The Site Reliability Workbook (O'Reilly, 2018), postmortem culture",
  idea: "Did we do a good job is answered by checking whether the incident appears in the model, and if it does not, the gap is in the method rather than in the engineer.",
  why: "An incident is the only unforgeable test of a threat model. Three outcomes are possible and they demand different responses: the threat was modelled and mitigated and the mitigation failed, which is an implementation problem; the threat was modelled and accepted, which is a risk decision you can now re-price with real data; or the threat was never modelled, which is a coverage problem in the method.\n\nOnly the third tells you to change how you model. Blameless postmortem practice exists to keep that signal clean, because the moment the answer to why was this missed can be a person's name, the honest answer stops being available and the method stops improving.",
  failureMode: "The postmortem action items are three code fixes and a runbook. Nobody asks whether the threat model contained the flow, so the same blind spot - say, tool output being treated as trusted input to the next tool call - produces a second incident in a different tool six months later.",
  experiment: "Take your last two security-adjacent incidents and try to find each one in the threat model. Classify each as mitigated-and-failed, accepted, or never-modelled. Two never-modelled out of two is a method finding, and it is worth more than either code fix.",
  reflection: "Which of the three categories did your last incident fall into, and did the postmortem's action items match that category?",
  recall: {
    q: "What are the three possible outcomes when you map an incident back to the threat model, and which one changes the method?",
    a: "The threat was modelled and mitigated and the mitigation failed, which is an implementation problem. The threat was modelled and accepted, which lets you re-price a risk decision with real data. Or the threat was never modelled at all.\n\nOnly the third is a coverage problem in the method itself. Keeping the postmortem blameless is what keeps that answer available, because once 'why was this missed' can name a person, the honest answer disappears."
  },
  deepDive: "Take this incident timeline and tell me which threat model assumption failed, and whether the gap was implementation, acceptance or coverage."
}
);

/* Track: Principles. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "principles-name-the-attacker",
  track: "principles", level: "classical",
  title: "Secure is not a property until you name the attacker",
  source: "Ross Anderson, Security Engineering, 3rd edition, chapter 1 (free from his Cambridge page)",
  idea: "A security claim carries no information until you state the asset, the adversary and the boundary that must hold.",
  why: "Secure is a three-place predicate wearing the costume of a one-place one. Secure against whom, protecting what, at which boundary. Drop the arguments and the sentence cannot be falsified, and a claim that cannot be falsified cannot be reviewed, tested or refuted by an incident. It can only be believed or disbelieved, which is how security review degrades into a discussion of vibes and vendor logos.\n\nNaming the three also tells you when you are done. A threat model is not a document that lists every bad thing; it is the shortest statement of what you are choosing to defend against and, just as importantly, what you are not. The out-of-scope list is the part that makes the in-scope list mean something, and it is the part almost every design doc omits.",
  failureMode: "Someone asks whether the agent runtime is secure and gets the answer yes, it runs in a sandbox. The sandbox is real. It also holds live tenant warehouse credentials and reads asset descriptions authored by anyone with editor access in that tenant, so the honest answer is that the runtime is secure against a container escape and wide open to a colleague who writes an instruction into a column description. Nobody notices, because the question never named an adversary.",
  experiment: "Pick one agent feature that is live. Write three lines: the asset an attacker would want, the adversary by role rather than by adjective, and the boundary that must hold. If the adversary line says a hacker or a bad actor, you do not have a threat model yet. Rewrite it as a named role with existing access, such as a tenant user with editor rights on one glossary.",
  reflection: "Which of the three lines was hardest to write, and what does that difficulty tell you about where your design is vague?",
  recall: {
    q: "Why is the sentence our agent runtime is secure not a claim you can review?",
    a: "Because secure takes three arguments that the sentence hides: which asset, against which adversary, at which boundary. Without them the statement cannot be falsified by any test or incident.\n\nNaming the three converts it into something a reviewer can attack, and it forces an explicit out-of-scope list, which is what gives the in-scope list any meaning."
  },
  deepDive: "Help me write the asset, adversary and boundary lines for one feature of my agent runtime, and push back where my adversary is an adjective rather than a role with existing access."
},
{
  id: "principles-eight-from-1975",
  track: "principles", level: "classical",
  title: "Eight principles from 1975 still carry the load",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, Proceedings of the IEEE 63(9), 1975",
  idea: "Economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism and psychological acceptability are the eight, and nearly every control shipped since is a restatement of one of them.",
  why: "The eight are not a checklist, they are a compression of what makes protection arguments work at all. Each one names a way that an enforcement story quietly stops being true: it got too big to review, it defaulted the wrong way, it got bypassed, it depended on secrecy, it had a single point of compromise, it handed out more authority than the task needed, it shared a resource that became a channel, or the humans routed around it.\n\nKnowing the list by name is worth more than knowing it by feel, because the names give you a diagnostic vocabulary in a design review. Saying this design fails complete mediation lands differently from saying this feels risky, and it points at the fix.",
  failureMode: "A team reinvents one of the eight badly and gives it a new name. An agent allowlist that is checked once at session start rather than at each call is complete mediation reinvented and broken, but because nobody said the phrase, the review discussed the allowlist contents instead of the moment of checking.",
  experiment: "Write the eight from memory, then check them against the paper. Whichever ones you missed are the ones your reviews are not applying. Then take your runtime design doc and mark, for each of the eight, whether the doc says anything about it. Count the blanks.",
  reflection: "Which of the eight did you fail to recall, and does that match the gaps you found in the design doc?",
  recall: {
    q: "Name all eight Saltzer and Schroeder principles.",
    a: "Economy of mechanism, fail-safe defaults, complete mediation, open design, separation of privilege, least privilege, least common mechanism, psychological acceptability.\n\nThey come from The Protection of Information in Computer Systems, Proceedings of the IEEE, September 1975. Each names a distinct way an enforcement argument stops being true."
  },
  deepDive: "Walk my agent runtime design past all eight Saltzer and Schroeder principles one at a time and tell me which ones the design has no answer for."
},
{
  id: "principles-economy-of-mechanism",
  track: "principles", level: "classical",
  title: "Economy of mechanism means the trusted part must be small enough to read",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "Assurance comes from being able to review the entire enforcement path, so the size of the thing you trust is itself a security metric.",
  why: "You cannot test your way to confidence in a protection mechanism, because a bug in enforcement usually shows up only under an input the attacker chooses and you did not. The only technique that scales is inspection, and inspection has a hard ceiling set by how much code a competent reviewer can hold in their head. Past that ceiling the review still happens, it just stops finding things.\n\nThis is why the metric is the size of the trusted computing base and not the size of the system. A large application with a small, sharply bounded enforcement core is reviewable. A small application where every module can reach the credential store is not, no matter how few lines it has in total.",
  failureMode: "The permission check for an agent tool call is spread across a middleware, a decorator on the tool function, a conditional in the LLM prompt template and a rule in the gateway. No single person can state the enforcement path, so when a fifth path is added that skips the decorator, the review approves it because the other four still look right.",
  experiment: "Trace the code path from the model emitting a tool call to a tenant credential being used, and count the files and the lines. That number is your trusted computing base for tool calling. If you cannot finish the trace in twenty minutes, you have found today's result.",
  reflection: "How much of what you counted is actually enforcing anything, and how much is there because the path grew rather than because it was designed?",
  recall: {
    q: "Why does the size of the trusted part function as a security metric rather than just a maintainability one?",
    a: "Because assurance in enforcement comes from inspection, not testing, and inspection has a ceiling set by what a reviewer can hold in their head. Past that ceiling reviews continue but stop finding defects.\n\nThe relevant size is the enforcement core, not the whole system. A big application with a small bounded core is reviewable; a small one where any module can reach credentials is not."
  },
  deepDive: "Help me identify the true trusted computing base for tool calling in my runtime and propose a smaller boundary that the same enforcement could live behind."
},
{
  id: "principles-fail-safe-defaults",
  track: "principles", level: "classical",
  title: "Fail-safe defaults make the absence of permission the answer",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "Base access decisions on explicit permission rather than explicit exclusion, so that a missing rule produces a denial you notice instead of an allow you do not.",
  why: "The two designs differ in what a mistake looks like. Under deny by default, a gap in the rules breaks a legitimate workflow, and someone files a ticket within the hour. Under allow by default, the same gap opens an unintended path, and nothing at all happens until an attacker finds it. One error mode is self-reporting and the other is silent, and over a system's life you will make many of these errors.\n\nThe subtle version is the error path rather than the rule set. Code that returns allow when the policy service times out, when the tenant id is null, when the tool name is unrecognised, or when an exception is swallowed has a deny-by-default rule set and an allow-by-default failure mode, which is the one that matters during an incident.",
  failureMode: "The tool dispatcher matches the model's requested tool name against a policy map and, on a miss, falls through to a generic handler that executes it anyway. A new tool is registered without a policy entry and is callable by every tenant for three weeks. Tests pass throughout, because the tests only exercise tools that have policy entries.",
  experiment: "Grep the authorisation path for the default branches: the else, the except, the catch, the timeout handler, the null tenant case. For each one write allow or deny. Any allow is today's finding. Ten minutes, and the output is a count.",
  reflection: "Which of the allows you found were deliberate, and which were the accidental shape of a happy-path code path?",
  recall: {
    q: "What is the practical difference between deny by default and allow by default, expressed in terms of what your mistakes do?",
    a: "Under deny by default, a gap in the rules breaks a legitimate workflow and someone reports it immediately. Under allow by default, the same gap silently opens a path that only an attacker will find.\n\nThe version that bites is the error path rather than the rule set: timeouts, null tenants, unrecognised names and swallowed exceptions that return allow give you a deny-by-default policy with an allow-by-default failure mode."
  },
  deepDive: "Review the error and default branches in my authorisation path and tell me which ones fail open, ranked by what an attacker gets from each."
},
{
  id: "principles-complete-mediation",
  track: "principles", level: "classical",
  title: "Complete mediation dies the moment you cache an authorisation decision",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "Every access to every object must be checked against current authority, and every performance shortcut around that check is a window in which revoked permission still works.",
  why: "Authorisation is a claim about the present, and a cached decision is a claim about the past presented as the present. The gap between the two is the staleness window, and its length is not an implementation detail, it is the answer to the question your customer will ask after they fire someone: how long until that person stops being able to act.\n\nAgents make this worse in a specific way. A human session is short and mostly synchronous; an agent run can hold a decision made at planning time and spend it minutes or hours later across dozens of tool calls, sometimes after the run has been resumed from a checkpoint. The authority that authorised the plan and the authority present when the plan executes are two different things.",
  failureMode: "A tenant admin revokes a user's access to a source. The agent run that user started ninety seconds earlier holds a token minted at start with a fifteen minute lifetime, and continues to read that source for the rest of its plan. The audit log shows the revocation and the reads, in that order, and the customer reasonably calls that a breach.",
  experiment: "List every cache between a permission change and a tool call: token lifetime, policy cache TTL, session object, in-process memoisation, connection pool binding, any plan or checkpoint that stores a resolved identity. Add the worst case. That sum in seconds is your revocation latency. Write the number down; most teams have never computed it.",
  reflection: "Is that number one you would put in a customer-facing document, and if not, which cache would you shorten first?",
  recall: {
    q: "What is the concrete cost of caching an authorisation decision, stated as a number?",
    a: "The revocation latency: the worst-case time between a permission being removed and the system actually refusing the access. It is the sum of every cache in the path, including token lifetime, policy TTL, session state and any checkpointed identity.\n\nAgents stretch it further than human sessions do, because a plan authorised at start can execute tool calls long afterwards, including after a resume."
  },
  deepDive: "Help me enumerate every cached authorisation decision in one agent run and compute the worst-case revocation latency end to end."
},
{
  id: "principles-open-design",
  track: "principles", level: "classical",
  title: "Open design puts the secret in the key, not the blueprint",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "A design that only holds while its details stay unpublished has no security argument, only a delay.",
  why: "Secrecy of mechanism fails on both ends. It fails at the start because you cannot get review from people who are not allowed to see the design, so the flaws stay in. It fails at the end because mechanism leaks continuously through job ads, error messages, conference talks, decompiled clients, departing staff and support transcripts, and unlike a key it cannot be rotated when it does.\n\nThe practical form of the principle is a question you can ask of any control: if I published the full design tomorrow and changed nothing else, what would break? Anything that would break is a dependency on secrecy, and you should either convert it into a key or accept that its protection value is a delay rather than a boundary.",
  failureMode: "An agent's guardrail is a set of undisclosed regex patterns for dangerous instructions. The list leaks in a stack trace surfaced in an error message. There is no rotation procedure because a pattern list is not a credential, so the fix is to write new patterns and hope, which is the same position as before with less time.",
  experiment: "Take one security control your team owns and write the paragraph you would publish about it in customer documentation. Where you hit something you cannot write down, that is a secrecy dependency. Note-shaped, but the output is checkable: a list of the specific items you would not publish, and for each one whether it can be rotated.",
  reflection: "Of the items you could not publish, how many are genuine keys and how many are just mechanism you would rather not explain?",
  recall: {
    q: "What is the test for whether a control depends on secrecy of mechanism?",
    a: "Ask what would break if the full design were published tomorrow with nothing else changed. Anything that breaks is a secrecy dependency.\n\nSecrecy of mechanism fails twice over: it blocks the review that would find flaws, and it leaks through error messages, staff turnover and reverse engineering without any way to rotate."
  },
  deepDive: "Take one of my guardrails and tell me exactly what an attacker gains from reading its implementation, so I can see whether its protection is a boundary or a delay."
},
{
  id: "principles-kerckhoffs-prompt-not-key",
  track: "principles", level: "classical",
  title: "Kerckhoffs says your system prompt is not a key",
  source: "Auguste Kerckhoffs, La cryptographie militaire, Journal des sciences militaires, 1883",
  idea: "A key is a secret you can rotate and whose loss you can detect, and instructions embedded in a model context are neither, so hiding them is not a control.",
  why: "Kerckhoffs' point was never that secrets are useless, it was that the secret must be small, replaceable and separable from the mechanism. A system prompt fails all three. It is not small, it cannot be replaced without changing behaviour, and it is fused to the mechanism it is supposed to protect.\n\nWorse, its disclosure is undetectable. A leaked API key shows up as anomalous use from an unexpected source; a leaked system prompt shows up as nothing at all, because the attacker's next request looks exactly like everyone else's. So you get a secret with no rotation story, no detection story, and a high chance of extraction, which means the correct security assumption is that it is public and the protection must live somewhere the model cannot reach.",
  failureMode: "The prompt says never call the delete tool unless the user is an admin. Nothing in the tool layer checks the caller's role, because the prompt is doing it. Any input that displaces or contradicts those instructions, including a document the agent was asked to summarise, converts the model into a caller with admin authority. The prompt was the entire control.",
  experiment: "In a dev tenant, spend fifteen minutes trying to get your own agent to reproduce its system prompt. Then, whether or not you succeed, write out the assumption you would have to change if it were posted publicly tomorrow. If the answer is nothing changes, your prompt is documentation rather than a control, which is the position you want to be in.",
  reflection: "Which behaviours in your runtime are currently enforced only by prompt text, and which of those need to move into the tool layer this quarter?",
  recall: {
    q: "Why does a system prompt fail as a key even though it is genuinely secret at first?",
    a: "A key must be small, rotatable and separable from the mechanism, and its loss must be detectable. A system prompt is large, cannot be rotated without changing behaviour, is fused to the mechanism, and leaks silently because a holder's requests look like anyone else's.\n\nSo the correct assumption is that it is public, and any behaviour that matters must be enforced below the model, in the tool layer."
  },
  deepDive: "List the behaviours my agent enforces only through system prompt text and propose where each one should sit in the tool layer instead."
},
{
  id: "principles-separation-of-privilege",
  track: "principles", level: "classical",
  title: "Separation of privilege buys a second independent failure",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "Requiring two keys only helps when the two are genuinely independent, and independence is the check that most two-person and dual-approval schemes skip.",
  why: "The value of two conditions is the product of two probabilities, and that multiplication is only valid when the events are independent. Where the two share a cause, you have paid the full cost of the control for a fraction of the protection, and you have bought a story that makes the residual risk harder to see rather than easier.\n\nShared causes are usually mundane rather than exotic: both approvers authenticate with the same identity provider, both signing keys sit in the same HSM partition, both reviewers read the same summary generated by the tool being reviewed, or both approvals are granted by the same person holding two roles because the on-call roster was thin that week. The question to ask is not are there two approvals, it is name the single event that produces both.",
  failureMode: "A destructive agent action requires a human approval in the product UI. The approval prompt is rendered from a summary the agent itself produced. An attacker who controls the agent's input controls the description of the action the human is approving, so the second factor is downstream of the first and adds nothing but latency and a defensible-looking audit record.",
  experiment: "Pick one dual-control you rely on and write the single event that defeats both halves. Not a list of risks, one sentence naming one event. This is a note rather than a command, and if you cannot write the sentence in five minutes it is usually because the two halves share more than you thought.",
  reflection: "Does the second half of your dual control derive any of its information from the first half, and if so is it a control or a receipt?",
  recall: {
    q: "What is the check that separation of privilege schemes usually skip?",
    a: "Independence. Two conditions multiply probabilities only when they have no shared cause, so the test is to name the single event that defeats both halves.\n\nCommon shared causes are one identity provider behind both approvers, one key store behind both keys, one person holding both roles, or a second reviewer whose only information came from the thing being reviewed."
  },
  deepDive: "Take my human-in-the-loop approval step and tell me what an attacker who controls the agent's input can make the approver see."
},
{
  id: "principles-least-privilege-unit",
  track: "principles", level: "classical",
  title: "Least privilege needs a unit of privilege you can actually name",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "The principle is trivial to state and hard to apply because most systems have no granularity below the whole identity, so the first piece of work is inventing the unit.",
  why: "Least privilege is a comparative: less than what, measured in what. If your system's smallest expressible grant is a service account with a role attached, then every reduction you make is a reduction between coarse buckets and the phrase means very little. The engineering work is not tightening the policy, it is creating a unit fine enough for the policy to say something, whether that is a per-run credential, a scoped token, a capability handle or a per-tool subject.\n\nAgent runtimes make the unit question unavoidable, because the natural granularity is neither the service nor the user. It is the run: this plan, for this user, over this set of assets, for this many minutes. A runtime that can mint authority at run granularity can express least privilege; one that shares a single warehouse credential across all runs cannot, regardless of how carefully the policy document is worded.",
  failureMode: "The runtime holds one connection credential per tenant source and every agent run for that tenant uses it. A run that only needed to read one table's schema had, for its whole lifetime, exactly the authority of the most demanding run in the system. When an injected instruction turns one run malicious, the blast radius is set by the union of every use case rather than by that run's task.",
  experiment: "Take one tool your runtime exposes and write two columns: what this call needs, and what the credential it uses can actually do. Express both in units your IAM or connector layer can express today. The gap between the columns is your over-grant, and if you cannot write the left column in the same units as the right, you have found the missing unit.",
  reflection: "What is the smallest unit of authority your runtime can mint today, and what would it take to make that unit the run rather than the tenant?",
  recall: {
    q: "Why is least privilege hard to apply even when everyone agrees with it?",
    a: "Because it is a comparative that needs a unit, and most systems cannot express anything finer than a whole identity with a role. Reductions between coarse buckets barely say anything.\n\nFor an agent runtime the useful unit is the run: this plan, this user, these assets, this time window. Without run-scoped authority, every run inherits the union of every use case."
  },
  deepDive: "Help me design a run-scoped credential for one tool in my runtime, including how it is minted, bounded and revoked."
},
{
  id: "principles-least-common-mechanism",
  track: "principles", level: "classical",
  title: "Least common mechanism says every shared resource is a channel",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "Anything two principals both depend on becomes a path between them, whether or not you designed it as one.",
  why: "Sharing creates coupling in both directions. One direction is influence: if tenant A can change the state of something tenant B reads, A can write to B. The other is observation: if A can measure the resource, A can read what B did to it, through timing, eviction, error rates, quota exhaustion or sequence numbers. Neither direction requires a bug, only a shared thing.\n\nThis is the principle that makes multi-tenancy expensive and it is the one most often traded away for cost, usually correctly and usually without writing down what was traded. The discipline is not to eliminate sharing, it is to enumerate the shared mechanisms and decide for each one whether the channel it creates is acceptable, so that the decision exists somewhere other than in the head of whoever chose the cache key format.",
  failureMode: "A semantic cache in front of the model keys on a hash of the prompt text to save cost. Two tenants ask about a table with the same name and the same three columns and the cache returns tenant A's generated description, containing A's sample values, to tenant B. Nothing in the code is wrong; the key just did not include a tenant.",
  experiment: "List the mechanisms shared across tenants in the agent path: model provider connection, semantic or embedding cache, vector index, rate limiter, connection pool, queue, log stream, error aggregator, metrics labels. For each, write whether the key or partition includes a tenant identifier. Grep the cache key construction to check rather than trusting the design doc. The output is a count of unkeyed shared mechanisms.",
  reflection: "For each shared mechanism you kept, can you state the reason in cost terms, and is that reason written down anywhere a future reviewer would find it?",
  recall: {
    q: "In what two directions does a shared resource leak between principals?",
    a: "Influence and observation. If A can change state that B reads, A can write to B; if A can measure the resource, A can read B's activity through timing, eviction, quota, error rates or sequence numbers.\n\nNeither direction needs a bug. Sharing alone creates the channel, which is why every shared mechanism in a multi-tenant path needs an explicit decision rather than a default."
  },
  deepDive: "Enumerate the cross-tenant shared mechanisms in an agent request path like mine and tell me which ones leak even when the code is correct."
},
{
  id: "principles-psychological-acceptability",
  track: "principles", level: "classical",
  title: "Psychological acceptability decides whether a control is deployed or bypassed",
  source: "Saltzer and Schroeder, The Protection of Information in Computer Systems, 1975",
  idea: "A control that makes the correct path harder than the incorrect one converts into a documented exception process within two quarters.",
  why: "Controls compete with delivery pressure, and delivery pressure does not go away because a control exists. If the secure route costs an engineer twenty extra minutes per change, that cost is paid every change, by people whose performance is measured on shipping. The predictable outcome is not defiance, it is an exception process: a form, an approver, a ticket type, and then a queue, and then a rubber stamp.\n\nThe useful reframing is that friction is a design parameter you control, not an unavoidable side effect of taking security seriously. Making the secure path the fastest path is real engineering work that produces more protection per unit of effort than tightening the control does, because a control at ninety percent strength with ninety percent adoption beats a perfect control with a bypass everyone uses.",
  failureMode: "Every new agent tool must pass a manual security review with a five-day turnaround. Within a quarter, teams register their tools as parameters on an existing approved tool to avoid the queue. The review board's metrics look excellent and the actual tool surface has grown without anyone reviewing it.",
  experiment: "For one control your team owns, time both paths: how long the approved route takes end to end, and how long the workaround takes. Then count the exceptions granted in the last quarter. Two numbers and a count, all obtainable today from your ticket system.",
  reflection: "If the exception count is low, is that because the control fits, or because people found a route that never generates a ticket?",
  recall: {
    q: "What predicts whether a security control survives contact with a delivery team?",
    a: "The relative cost of the correct path against the incorrect one. If the secure route is slower, its cost is paid on every change by people measured on shipping, and an exception process appears within a couple of quarters.\n\nFriction is a design parameter. A control at ninety percent strength with ninety percent adoption protects more than a perfect control everyone routes around."
  },
  deepDive: "Look at one security control in my team's workflow and suggest how to make the secure path faster than the workaround rather than stronger."
},
{
  id: "principles-usability-is-security",
  track: "principles", level: "classical",
  title: "Usability failures are security failures, not user failures",
  source: "Whitten and Tygar, Why Johnny Can't Encrypt: A Usability Evaluation of PGP 5.0, USENIX Security 1999",
  idea: "When competent users cannot operate a security mechanism correctly, the mechanism is broken, and blaming the operator ends the investigation exactly where it should start.",
  why: "Whitten and Tygar gave educated participants ninety minutes and a functioning implementation of good cryptography, and most of them could not send an encrypted message correctly; several sent the plaintext, and some encrypted to the wrong key. The cryptography was sound. The security property was still not delivered, which is the whole point: correctness of the primitive is not the same as correctness of the outcome, and only the outcome protects anyone.\n\nThe argument transfers directly to anything where a human is placed in the enforcement path. If your design says the user will review the diff, the admin will scope the token, or the approver will notice the unusual action, you have added a component with a failure rate and you have not measured it. Treating that component as reliable because it is a person is the same error as treating an unmeasured library as bug free.",
  failureMode: "An approval dialogue for an agent action shows a JSON payload with forty fields, and the risky one is a resource identifier in position thirty-one. Approvers approve, because the dialogue trained them that approving is what happens next. The control exists, is displayed, is logged, and stops nothing.",
  experiment: "Watch one competent colleague who does not own the feature attempt the security-relevant task cold, with a ten minute limit and no help from you. Count the points where they go wrong or ask a question. This is a scheduled experiment rather than a command you can run now, so book it; the finding is the count and where the count clusters.",
  reflection: "Where in your runtime does a human sit in the enforcement path, and what failure rate have you actually assumed for them?",
  recall: {
    q: "What did Why Johnny Can't Encrypt demonstrate that a cryptographic proof cannot?",
    a: "That sound primitives do not deliver a security outcome if competent users cannot operate them. Most participants failed to send an encrypted message in ninety minutes, and some sent plaintext or encrypted to the wrong key.\n\nThe generalisation is that any human placed in the enforcement path is a component with an unmeasured failure rate, and calling the failure user error ends the investigation where it should begin."
  },
  deepDive: "Review the approval step in my agent runtime as a usability problem and tell me what an approver can and cannot actually verify from what we show them."
},
{
  id: "principles-defence-in-depth",
  track: "principles", level: "modern",
  title: "Defence in depth is a property of independent layers, not a count of them",
  source: "Ross Anderson, Security Engineering, 3rd edition",
  idea: "Layers that share an assumption fail together, so the phrase is a real argument only when you can state what each layer holds after the one above it is fully bypassed.",
  why: "Depth is measured in independent assumptions, not in components. Three filters that all assume they can recognise malicious instructions in text are one layer implemented three times, and one input that defeats the recognition defeats all three at once. The count on the architecture diagram is not the number you want; the number you want is how many distinct things an attacker must separately solve.\n\nThe phrase also has a specific abuse: it is used to justify shipping a control that does not hold on its own, on the grounds that something else will catch it. That is a valid argument only when you can name the something else and state what it does when this layer is at zero. If the answer is that another probabilistic filter looks at the same text, you have a single layer and a comfortable slogan.",
  failureMode: "An agent design lists four injection defences: input filtering, a hardened system prompt, an output classifier and model-side refusal training. All four depend on distinguishing instructions from data inside one token stream. A phrasing that reads as legitimate to the model reads as legitimate to all four, and the design review counted four layers.",
  experiment: "Write your defence layers in a column. Beside each, write one sentence answering what this holds when the layer above it is fully bypassed. Where two rows say the model or the classifier notices, merge them, because they are one layer. Checkable output: the row count after merging, which is your actual depth.",
  reflection: "After merging, how many layers do you have, and is at least one of them non-probabilistic?",
  recall: {
    q: "How do you count layers of defence in depth honestly?",
    a: "Count independent assumptions, not components. Merge any two layers that fail to the same input, then count what is left.\n\nThe common abuse is justifying a weak control by saying something else will catch it, without naming that something else or stating what it does when this layer contributes nothing. Several probabilistic text filters in a row are one layer."
  },
  deepDive: "Take my list of agent injection defences and merge the ones that share a failure assumption, then tell me my real layer count."
},
{
  id: "principles-weakest-link",
  track: "principles", level: "classical",
  title: "The weakest link beats the average link",
  source: "Bruce Schneier, Secrets and Lies: Digital Security in a Networked World (2000)",
  idea: "Security composes like a chain rather than a portfolio, so adding a strong control next to a weak one raises your score and not your safety.",
  why: "An attacker picks the entry point; you do not. That single fact means your security level is a minimum over paths, while almost every measurement instrument teams use, from control coverage percentages to maturity scores to compliance frameworks, computes an average. Averages reward adding controls where they are easy, which is exactly where they were already strong, and the minimum does not move.\n\nThe corollary is uncomfortable in resource terms: work on the strongest area has close to zero marginal value, and the highest-value work is usually the least interesting, in the oldest system, owned by the team with the least time. Any prioritisation process that ranks by effort or enthusiasm rather than by minimum over paths will systematically fund the wrong thing.",
  failureMode: "The agent's tool calls are covered by careful policy, structured audit and a scoped token. The internal admin endpoint that seeds agent configuration authenticates with a shared static token in an environment variable, because it was built for one demo in 2024 and never removed. The security review covers the agent and the score is high.",
  experiment: "List every authenticated path that can reach the tool-calling surface, including internal tooling, admin endpoints, replay and debug utilities, scheduled jobs and support impersonation. Rank them by how much you would want to defend each in front of a customer. Today's finding is the bottom of that list, not the top.",
  reflection: "When did the item at the bottom of your list last receive attention, and who currently believes they own it?",
  recall: {
    q: "Why do coverage and maturity scores mislead about security posture?",
    a: "They average, and security is a minimum over paths because the attacker chooses the entry point. Adding controls where it is easy raises the average while leaving the minimum untouched.\n\nThe implication is that marginal work on your strongest area is close to worthless, and the highest-value work is usually in the oldest, least interesting system."
  },
  deepDive: "Help me enumerate every authenticated path into my agent tool surface, including internal and debug ones, and rank them by weakest rather than by how recently we touched them."
},
{
  id: "principles-secure-by-default",
  track: "principles", level: "modern",
  title: "Secure by default means the insecure path costs work",
  source: "CISA, NSA and international partners, Shifting the Balance of Cybersecurity Risk: Principles and Approaches for Security-by-Design and -Default (2023)",
  idea: "The distribution of security outcomes across your tenants is set by the default configuration, because almost nobody changes it.",
  why: "Configuration is a cost, and defaults are the option with zero cost. Whatever you ship as the default becomes the state of the overwhelming majority of your installed base, indefinitely, regardless of what the documentation recommends. A hardening guide is a way of saying the secure configuration exists; the default is what determines how many customers have it.\n\nThis inverts the usual direction of effort. If the secure setting is opt-in, every customer must individually spend effort to be safe, and the ones who do not are the ones with the least security capacity, which is to say the ones most likely to be breached. If it is opt-out, one customer with a genuine reason spends effort to accept the risk, and that exception is visible to you. Same code, same options, completely different population outcome.",
  failureMode: "A tenant-level setting controls whether agent tool calls require approval for write operations. It defaults to off so pilots feel responsive. Eighteen months later the feature is broadly adopted, the setting is still off for nearly every tenant, and the on state has been exercised so rarely that it no longer works properly when someone finally enables it.",
  experiment: "Pick one security-relevant tenant setting and query what fraction of tenants are on the default. Then check the last time the non-default path ran in production. Two numbers. If the non-default path has not run this quarter, you have an untested branch that customers believe protects them.",
  reflection: "For the setting you checked, would you defend the current default in front of the customer least equipped to change it?",
  recall: {
    q: "Why does the default configuration matter more than the hardening guide?",
    a: "Because configuration costs effort and the default costs none, so the default is what nearly the entire installed base runs, permanently. The guide only establishes that a secure configuration is possible.\n\nOpt-in security makes every customer spend effort to be safe and fails hardest for those with the least capacity. Opt-out makes one customer spend effort to accept risk, and makes that exception visible to you."
  },
  deepDive: "Go through the security-relevant defaults in my product surface and tell me which ones would be safe to invert, and what breaks for existing tenants if I do."
},
{
  id: "principles-boundary-vs-speed-bump",
  track: "principles", level: "practice",
  title: "A security boundary is something you would ship a patch for",
  source: "Microsoft Security Response Center, Security Servicing Criteria for Windows",
  idea: "The operational test that separates a boundary from a speed bump is whether a bypass earns an emergency fix, and applying that test out loud settles most architecture arguments in one sentence.",
  why: "Microsoft's servicing criteria work because they tie a security claim to an obligation the organisation must actually honour. A defined security boundary means a bypass gets a security update; a defence-in-depth feature is useful, may still be fixed, but does not carry that promise. Being explicit about which is which stops the ambiguity from being resolved during an incident, at the worst possible moment, by whoever is on the call.\n\nThe test is useful internally because it is cheap and it forces a real answer. Ask whether a bypass of this control wakes someone at 3am, and the room stops arguing about how strong the control is and starts agreeing on what it is for. Most disputes about whether a filter is real security are actually disputes about the obligation nobody wanted to accept, and this question surfaces that in one round.",
  failureMode: "A prompt-injection classifier is described in the design doc as a security control. A researcher demonstrates a bypass. Nobody knows whether this is a P0, and the argument about severity takes longer than the fix would have, while the customer conversation happens without an agreed position. Had it been labelled defence in depth from the start, the same bypass would have been a normal backlog item and everyone would have said so immediately.",
  experiment: "List your agent runtime's controls in two columns: we would ship an emergency fix for a bypass, and we would not. Have one other person do it independently from the same list. Count the disagreements. Each disagreement is an unresolved severity argument that would otherwise surface during an incident.",
  reflection: "For each control in the left column, is there anyone outside your team who would agree that a bypass is an emergency?",
  recall: {
    q: "What is the one-sentence test that distinguishes a security boundary from a speed bump?",
    a: "Would a bypass earn an emergency fix. If yes, it is a boundary and the organisation is accepting a servicing obligation; if no, it is a defence-in-depth measure that adds cost to an attack without promising to hold.\n\nDeciding this in advance stops the severity argument from being improvised during an incident, which is where it otherwise happens."
  },
  deepDive: "Sort the controls in my agent runtime into boundaries and defence-in-depth measures using the would-we-patch-it test, and flag the ones we are currently describing as stronger than we would defend."
}
);

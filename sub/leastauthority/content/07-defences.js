/* Track: Agent defences. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "defences-agentdojo-measures",
  track: "defences", level: "modern",
  title: "AgentDojo measures a defence instead of asserting it",
  source: "Debenedetti, Zhang, Balunović, Beurer-Kellner, Fischer and Tramèr, AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents, NeurIPS 2024 Datasets and Benchmarks",
  idea: "A defence claim that cannot be expressed as a pair of numbers on a shared benchmark is a marketing claim.",
  why: "AgentDojo is an environment rather than a dataset. It gives an agent real tool suites across a workspace, a Slack-like system, a travel booking system and a bank, then scores two things separately: benign utility, which is whether the agent completed the user's actual task, and attack success rate, which is whether an injected instruction achieved the attacker's goal. Because the injection lives inside tool output rather than in the prompt, the setup reproduces the shape of the real problem instead of the demo version of it.\n\nThe reason this matters more than the specific scores is that it converts an argument into an experiment. Before AgentDojo, a vendor could say the model resists injection and you had no way to disagree except by trying harder. After it, the honest question is which suite, which attacker, which model version, and what were both numbers. In the original paper the strongest agents solved well under two thirds of the benign tasks even with no attacker present, which is a useful reminder that the utility baseline is not one hundred.",
  failureMode: "You buy a guardrail because the vendor deck says it blocks prompt injection, deploy it in front of your metadata agent, and have no instrument that would tell you the difference between it working and it being switched off. Six months later someone reports the agent leaked a column description across tenants and you cannot say whether the control ever functioned.",
  experiment: "Open the AgentDojo task suite descriptions and list the tools each of the four environments exposes. Beside them, list the tools your own runtime exposes. Count how many of yours have no analogue in any suite. That count is the part of your surface no public benchmark currently exercises, and it is the part you will have to measure yourself.",
  reflection: "Which of my tools sits outside every public benchmark, and what would the cheapest in-house harness for it look like?",
  recall: {
    q: "What makes AgentDojo an environment rather than a dataset, and where does the injection sit?",
    a: "It runs a live agent against working tool suites and scores the outcome of its calls, so the same suite can be replayed against a new model, a new attack or a new defence rather than being fixed at authoring time.\n\nThe injection sits in tool output, not in the user prompt. That is what makes it a test of the indirect case, which is the one that matches an agent reading customer-authored content."
  },
  expires: "2028-02-01",
  deepDive: "Help me design a minimal AgentDojo-style harness for my own runtime: pick three of my tools, write one benign task and one injected variant for each, and tell me what the scoring function should assert."
},
{
  id: "defences-rule-of-two",
  track: "defences", level: "modern",
  title: "Meta's Agents Rule of Two constrains a session to two of three properties",
  source: "Meta AI, Agents Rule of Two: A Practical Approach to AI Agent Security (2025)",
  idea: "Within a single session an agent may process untrustworthy input, hold access to sensitive systems or private data, or change state and communicate externally, and it should have at most two of the three.",
  why: "This is the lethal trifecta restated as a design constraint you can enforce rather than a hazard you can notice. The unit is the session, which is what makes it operational: a session that has read customer-authored text is thereafter tainted, and if you want it to also hold tenant credentials then it must not be able to write or send. If you need all three capabilities to serve a workflow, you split the workflow into sessions and pass only structured, reviewed values between them, or you put a human in the loop at the join.\n\nThe framing borrows directly from Chromium's Rule of 2, and it inherits the same virtue: it is a rule an architecture review can apply in five minutes without reading the prompt. You are not reasoning about whether the model will be persuaded. You are reasoning about which capabilities are simultaneously present.",
  failureMode: "A metadata agent that summarises table descriptions written by customers, holds the tenant's warehouse credential, and can post to Slack has all three legs in one session. A description containing instructions is now a channel from one tenant's data into an attacker-chosen Slack message, and no amount of system prompt hardening closes it.",
  experiment: "Take the three highest-traffic workflows your runtime serves. For each, write the three properties as columns and tick the ones that hold within a single session. Any row with three ticks is a design bug, not a monitoring problem. Write next to it which capability you would drop and what breaks if you do.",
  reflection: "Which of my workflows has three ticks, and is the fix a session split or a human at the join?",
  recall: {
    q: "State the three properties in the Agents Rule of Two and the unit the rule applies over.",
    a: "Processing untrustworthy input, having access to sensitive systems or private data, and being able to change state or communicate externally. At most two may hold at once.\n\nThe unit is the session. A session that has touched untrusted content stays tainted for its lifetime, so the remedy is a fresh session with a narrower grant rather than a mid-session cleanup."
  },
  expires: "2027-11-01",
  deepDive: "Apply the Rule of Two to my runtime's session model and tell me where a session boundary would have to be introduced, including what state would have to be dropped at that boundary."
},
{
  id: "defences-dual-llm",
  track: "defences", level: "modern",
  title: "The dual LLM pattern keeps the privileged planner away from untrusted text",
  source: "Simon Willison, The Dual LLM pattern for building AI assistants that can resist prompt injection (2023)",
  idea: "A privileged model that plans and holds tool access must never read untrusted content, and a quarantined model that reads it must return only values the privileged model treats as opaque.",
  why: "The attack path in indirect injection is text reaching the context of the component that can act. Cut that path structurally and the attack has nowhere to land. The privileged model issues a plan referring to variables. The quarantined model, which has no tools, reads the customer-authored description and writes its output into a variable. The privileged model then routes that variable to a tool argument without ever seeing its contents, so attacker prose cannot rewrite the plan because the planner never observes it.\n\nThe cost is real and worth naming. The privileged model is now planning blind, so it cannot adapt to what the content actually said, and any branch that depends on the content has to be expressed as an explicit request to the quarantined model with an enumerated answer set. That constraint is why CaMeL exists: it is what happens when you take the pattern seriously enough to build the interpreter.",
  failureMode: "Someone adds a debug line that logs the quarantined model's output into the planner's transcript so the planner can produce a better summary. The variable is now text in the privileged context, the boundary is gone, and nothing in the test suite notices because the feature works.",
  experiment: "Trace one request through your agent and mark every point where a string that originated in customer-authored content enters the context of the component that decides which tool to call next. If there is more than zero, you do not have this pattern. Write the count down with the file and line for each.",
  reflection: "Where does untrusted text reach my planner today, and which of those points is load-bearing for a feature users actually use?",
  recall: {
    q: "In the dual LLM pattern, what may cross from the quarantined model to the privileged one?",
    a: "Only opaque handles or values the privileged model does not inspect: variable references, and at most a choice from an enumerated set the privileged model defined in advance.\n\nFree text crossing that line, including summaries and error messages, reintroduces the attack path the pattern exists to remove."
  },
  expires: "2028-02-01",
  deepDive: "Sketch how the dual LLM split would work for a summarise-this-table workflow in my runtime, and be specific about which decisions the planner can no longer make."
},
{
  id: "defences-camel-interpreter",
  track: "defences", level: "modern",
  title: "CaMeL enforces the plan with an interpreter outside the model",
  source: "Beurer-Kellner et al., Defeating Prompt Injections by Design (CaMeL), arXiv:2503.18813",
  idea: "Extracting control flow and data flow out of the model into a program that carries capability metadata on every value converts prompt injection from a persuasion problem into a policy violation the runtime can refuse.",
  why: "CaMeL has a privileged model emit a program in a restricted Python subset from the user's query alone. A custom interpreter runs that program. Every value the interpreter holds carries provenance and a capability describing where it came from and who may read it, and the interpreter checks a security policy at each tool call rather than asking the model to behave. A quarantined model parses untrusted content into typed values but never influences control flow, because control flow was fixed before any untrusted byte was read.\n\nThe honest part of the paper is the coverage. It reports solving a substantial share of AgentDojo tasks with provable guarantees, which means a share it does not solve, and the failures are the tasks whose control flow genuinely depends on content the agent has not read yet. Treat CaMeL as the right architecture for the subset of your workflows that can be planned in advance, and be explicit that the remainder needs a human or a narrower tool.",
  failureMode: "You adopt the idea halfway: you build the interpreter but let the planner regenerate the program after seeing tool output, so it can handle the cases that did not fit. The regeneration step reads untrusted content, and the guarantee you paid for evaporates on exactly the tasks you added it for.",
  experiment: "Pick your five most common agent requests and try to write each as a fixed sequence of tool calls with holes for values, using only the words of the request. Count how many you can write without needing to see any tool output first. That fraction is your upper bound on CaMeL-style coverage today.",
  reflection: "Which of my workflows are plannable in advance, and for the rest, is the dependency on content essential or just convenient?",
  recall: {
    q: "What does CaMeL attach to values, and what does the interpreter do with it?",
    a: "Capability metadata recording provenance and the permitted readers and destinations for each value. The interpreter checks a security policy against that metadata at every tool call.\n\nBecause the program's control flow was generated before any untrusted content was read, an injection can at most corrupt a value, and a corrupted value carrying untrusted provenance is refused at the boundary rather than acted on."
  },
  expires: "2027-12-01",
  deepDive: "Take one of my workflows and write the CaMeL-style program for it, including the capability labels each value would carry and the policy check that would fire at the tool call."
},
{
  id: "defences-policy-at-the-boundary",
  track: "defences", level: "modern",
  title: "Policy belongs at the tool boundary, deterministically",
  source: "Díaz, Kern and Olive, An Introduction to Google's Approach to AI Agent Security (Google, 2025)",
  idea: "Security rules must be evaluated by deterministic code inspecting the concrete tool call and its arguments, because that is the only layer whose behaviour you can test.",
  why: "Google's paper argues for a hybrid: reasoning-based defences for the fuzzy cases layered over runtime policy enforcement for the ones that must hold. The division of labour is the point. A prompt expresses intent and degrades probabilistically under adversarial pressure. A policy engine sitting between the agent and the tool sees the resolved call, with the tenant id, the resource path and the write flag already concrete, and returns allow or deny from code you can unit test and diff in review.\n\nThe practical consequence is that every rule you care about has to be expressible over the arguments of a call. If a rule can only be stated as do not do anything harmful, it cannot live at the boundary and it is therefore not enforced, it is merely requested. That reframing is useful in design review: it forces the vague rules to become specific or to be replaced by a narrower tool.",
  failureMode: "The system prompt says never query a table outside the current tenant's namespace. The runtime passes whatever namespace string the model produced straight through to the warehouse client. A description containing a plausible-looking namespace gets one cross-tenant read, and the only artefact is a query log entry nobody diffs.",
  experiment: "Take the three rules currently written in your system prompt as instructions to the model. For each, try to write it as a predicate over a tool call's arguments. Rules that convert cleanly should move to the boundary this week. Rules that do not convert are the ones to say out loud in review as unenforced.",
  reflection: "Which of my prompt-level rules refused to become a predicate, and what would have to change about the tool signature to make it one?",
  recall: {
    q: "Why is a rule stated only in the system prompt not a control?",
    a: "Because its evaluation happens inside a probabilistic component whose behaviour under adversarial input cannot be enumerated or tested, and which the attacker can address directly through untrusted content.\n\nA control has to be code that sees the resolved call and returns allow or deny. If the rule cannot be written as a predicate over arguments, it is a request, and design review should record it as such."
  },
  expires: "2028-02-01",
  deepDive: "Look at one of my tool signatures and tell me which security-relevant facts are missing from its arguments, so that the policy engine cannot currently decide the call."
},
{
  id: "defences-per-task-credential",
  track: "defences", level: "practice",
  title: "Issue a per-task credential scoped to the task's targets",
  source: "Model Context Protocol specification, authorization and security best practices",
  idea: "An agent task should execute under a credential minted for that task's tenant, resource set and time window, never a standing token whose scope is the union of everything the runtime might need.",
  why: "A standing service token turns every injection into a full-authority injection. The blast radius of a successful attack is the scope of the credential in hand at the moment it lands, so the cheapest way to shrink the worst case is to shrink the credential rather than to try to prevent the landing. Mint at task start, bind to the specific tenant and the specific resources the request named, expire in minutes.\n\nThe MCP authorization spec makes the audience part explicit through resource indicators, and its security best practices page names the two failure modes directly: token passthrough, where a server forwards a token it was given to a downstream API, and the confused deputy, where a server uses its own privileged credential on behalf of a caller who does not hold that privilege. Both are Hardy's 1988 problem in current clothing, and both are prevented by audience-bound, per-task tokens rather than by careful coding.",
  failureMode: "The runtime holds one warehouse credential with read access to every tenant's schemas because provisioning per tenant looked like a scaling problem. An injection in one customer's table description reaches that credential, and the incident is now a cross-tenant data breach rather than a single-tenant annoyance.",
  experiment: "Print the scope of the credential your agent process actually holds at runtime, without printing the credential itself. Write the answer to two columns: what this task needs, and what the token permits. If the second column is longer, you have quantified your blast radius in one line.",
  reflection: "How much wider than the task is my token, and what is the concrete blocker to minting per task?",
  recall: {
    q: "Name the two credential failure modes the MCP security guidance calls out, and the property that prevents both.",
    a: "Token passthrough, where a server forwards a token issued for it to a downstream service, and the confused deputy, where a server applies its own broader authority on behalf of a less privileged caller.\n\nAudience-bound tokens minted per task prevent both: a token that names its intended resource cannot be replayed downstream, and a token carrying only the caller's authority cannot be used to exceed it."
  },
  expires: "2027-10-01",
  deepDive: "Design the per-task credential mint for my runtime: what the task declares up front, what the authorisation server checks, and how the tool call fails when the declared scope was too narrow."
},
{
  id: "defences-sandbox-the-tool",
  track: "defences", level: "practice",
  title: "Sandbox the tool, not the model",
  source: "Chromium security documentation, The Rule of 2",
  idea: "The model is not a containment boundary, so isolation spend belongs on the process that executes a tool call.",
  why: "Alignment training reduces the probability that a model emits a harmful call. It does not bound what happens when one is emitted, and probability reduction is not containment. The process that runs the call is ordinary software, so ordinary isolation applies to it: a separate process, a read-only filesystem except for a scratch mount, no ambient cloud credentials, no host network, a wall clock limit and a memory limit.\n\nChromium's Rule of 2 gives the same pick-two logic for that process. Untrustworthy input, an unsafe implementation language and high privilege: choose at most two. A tool that shells out to a parser written in C over customer-supplied bytes while holding the tenant credential has all three, and the answer is to strip the privilege, because you are not going to change the parser and you cannot stop the input being hostile.",
  failureMode: "A code-execution tool runs in the same container as the agent orchestrator, so the instance metadata endpoint is reachable. One generated snippet fetches the node's cloud credentials and the sandbox was never a sandbox, it was a naming convention.",
  experiment: "Exec into the process that runs your most powerful tool and try three things: reach the cloud instance metadata endpoint, open an outbound connection to an arbitrary host, and write to a path outside the scratch directory. Record which of the three succeed. Each success is a line item on the isolation backlog.",
  reflection: "Which of the three succeeded, and which one is cheapest to close before the end of the week?",
  recall: {
    q: "State Chromium's Rule of 2 and how it maps onto a tool sandbox.",
    a: "Untrustworthy input, an unsafe implementation language, and high privilege: a component may have at most two of the three, and the third has to be given up.\n\nA tool process handling customer bytes through a memory-unsafe parser while holding a tenant credential has all three. Privilege is usually the one you can actually drop."
  },
  expires: "2028-06-01",
  deepDive: "Review the execution environment of my highest-privilege tool against the Rule of 2 and tell me which of the three properties is cheapest to remove."
},
{
  id: "defences-egress-allowlist",
  track: "defences", level: "practice",
  title: "An egress allowlist breaks the third leg of the trifecta",
  source: "Simon Willison, The Lethal Trifecta for AI Agents (2025), applied at the network layer",
  idea: "Deny outbound network from the tool sandbox by default and allowlist per task, because exfiltration needs a destination and a destination is the one thing you can enumerate.",
  why: "The trifecta is private data, exposure to untrusted content and a way to communicate externally. The first two are usually load-bearing for the product. The third is almost never load-bearing in the general case: a task needs the warehouse, the metadata store and maybe one SaaS API, not the internet. Denying by default and allowlisting the handful of hosts a task actually declared removes the leg you can most afford to lose.\n\nThis is also the mitigation with the best durability, which matters for a corpus like this one. It does not depend on a model version, a prompt template or a classifier's training distribution. It keeps working through a model upgrade, and the failure mode when it is too tight is a loud connection error rather than a silent leak.",
  failureMode: "The classic markdown image exfiltration: injected text asks the agent to render an image whose URL embeds the rows it just read. With open egress the render fetches it and the data is in an attacker's access log. With a default-deny policy the fetch fails and you get an alert instead of a breach.",
  experiment: "From inside the tool sandbox, curl a host that is not in any allowlist and record whether it resolves and connects. Then list the hosts your allowlist actually contains and count how many are wildcards. A wildcard entry over a CDN or a storage provider is an open channel wearing an allowlist's clothing.",
  reflection: "How many wildcard entries does my egress policy contain, and which of them could be narrowed to a specific host today?",
  recall: {
    q: "Why is egress control the most durable of the trifecta mitigations?",
    a: "Because it does not depend on model behaviour. It is enforced by network policy outside the agent, so it survives model upgrades, prompt rewrites and novel injection phrasings without re-evaluation.\n\nIt also fails loudly. A blocked connection produces an error and a log line, whereas a defeated prompt-level defence produces a successful-looking task."
  },
  expires: "2028-06-01",
  deepDive: "Help me derive the minimum egress allowlist for my runtime from the tools it exposes, and flag which entries have to stay wildcards and why."
},
{
  id: "defences-human-where-irreversible",
  track: "defences", level: "practice",
  title: "Put the human where the action is irreversible, not where it is frequent",
  source: "OWASP Top 10 for LLM Applications (2025), LLM06 Excessive Agency",
  idea: "Approval prompts should fire only on cross-tenant reach, spend, deletion and outbound communication, because a control that fires constantly is a control that gets clicked through.",
  why: "Human review is a real boundary only while the human is still reading. Approval fatigue is not a discipline failure, it is the predictable result of a signal-to-noise ratio the design chose. If you confirm every read, the confirmation dialog becomes muscle memory and the one that mattered gets the same reflexive click as the four hundred that did not.\n\nSo spend the interrupt budget where reversibility is genuinely absent. OWASP's LLM06 frames the same idea from the other side: excessive agency comes from excessive functionality, permissions and autonomy, and the remedy is to narrow all three so that the residue needing a human is small enough that a human will actually attend to it. Design the prompt to show the resolved call, not the model's description of it, because the description is attacker-influenced text.",
  failureMode: "Your agent asks for confirmation on every tool call. An operator approves ninety in a morning. Number ninety-one deletes a production glossary across the wrong tenant, and the postmortem finding is that the control worked exactly as designed and the human was the fuse.",
  experiment: "Count the approval prompts your agent raised in the last week and how many were denied. If the denial rate is under two percent, the control is decorative. Then classify the tool surface into reversible and irreversible, and propose an approval policy that fires only on the second list.",
  reflection: "What was my denial rate, and which irreversible action is currently running without an interrupt?",
  recall: {
    q: "What determines whether a human-in-the-loop step is a real control?",
    a: "Whether the human is still reading. That depends on how often it fires relative to how often it matters, so the placement rule is irreversibility rather than risk-in-general.\n\nIt also depends on what the prompt displays. Showing the resolved tool call and its arguments is evidence; showing the model's summary of what it intends to do is attacker-influenced prose."
  },
  expires: "2027-12-01",
  deepDive: "Partition my tool list into reversible and irreversible actions and draft the approval policy, including what the confirmation UI must show for the human to be able to refuse correctly."
},
{
  id: "defences-spotlighting-is-advisory",
  track: "defences", level: "modern",
  title: "Spotlighting marks provenance to the model and does not gate anything",
  source: "Hines, Lopez, Hall, Zarfati, Zunger and Kiciman, Defending Against Indirect Prompt Injection Attacks With Spotlighting (Microsoft, 2024)",
  idea: "Delimiting, datamarking and encoding untrusted spans measurably lower attack success rate and remain advice to the model, so they belong in the stack as a layer and never as the boundary.",
  why: "Spotlighting makes provenance legible inside the context. Delimiting wraps untrusted content in markers, datamarking interleaves a token through every whitespace in the span so its extent cannot be forged by content that merely writes a closing marker, and encoding transforms the span into base64 or similar so the model handles it as data. The Microsoft paper reports large reductions in attack success across their test set, which makes it a cheap and worthwhile addition.\n\nIt is still the model deciding to respect the marking. There is no code path that refuses an action because it originated in a marked span, so the guarantee is statistical and specific to the models and attacks tested. Use it to raise the cost of the easy attacks, and keep the thing that actually stops the hard ones at the tool boundary, where a refusal is a return value rather than a choice.",
  failureMode: "You adopt delimiters, see injections stop working in your test set, and skip the egress policy that was on the roadmap. A model upgrade changes how the new model treats the delimiter tokens, the reduction quietly reverses, and nothing in your monitoring is watching a marking convention.",
  experiment: "Take the last tool output your agent consumed and check how the untrusted portion is demarcated in the assembled context. Then write a hostile version of that content that includes your own closing delimiter and see whether the assembly escapes it. If it does not, your delimiting is forgeable by the content it delimits.",
  reflection: "Is my untrusted-span marking forgeable by the span itself, and where in the pipeline would the escaping have to live?",
  recall: {
    q: "What does datamarking do that plain delimiting does not?",
    a: "It interleaves a marker token throughout the untrusted span rather than only at its edges, so content cannot end the span early by emitting a closing delimiter.\n\nBoth remain advisory. Neither creates a code path that refuses an action because its origin was untrusted, which is why they sit under the boundary rather than at it."
  },
  expires: "2027-08-01",
  deepDive: "Show me where in my context assembly the untrusted spans are joined, and write the escaping and datamarking step that makes the boundary unforgeable by the content."
},
{
  id: "defences-detectors-fall-to-adaptive",
  track: "defences", level: "classical",
  title: "Detection based defences fall to attackers who know the detector",
  source: "Carlini and Wagner, Adversarial Examples Are Not Easily Detected: Bypassing Ten Detection Methods, ACM AISec 2017",
  idea: "Ten published detection defences were broken by attacks constructed against each one specifically, which is the historical reason to treat output filters as noise reduction rather than containment.",
  why: "Each of the ten defences reported strong results against the standard attacks of the day. Carlini and Wagner constructed a loss function per defence that optimised for both the original objective and evading that defence's detector, and every one fell, most of them to near-chance detection. The generalisation is not about images. It is that a detector added downstream of an attacker-controllable channel becomes part of the attacker's objective function the moment they learn it exists.\n\nThis is the oldest and most transferable result in the defences track, which is why it carries no expiry. It tells you what to expect from any classifier, heuristic or output scanner placed in the path of a motivated adversary: a real reduction in undirected noise, and approximately nothing against someone who has read your docs or probed your API a few hundred times.",
  failureMode: "You add an output filter that catches messages containing base64 blobs, because that is how the last exfiltration attempt looked. The next one splits the payload across three innocuous-looking sentences of a table description. The filter reports a clean week and the data left on day two.",
  experiment: "Take whatever output filter or content scanner you currently run and spend fifteen minutes as the attacker: write three payloads designed specifically to pass it while achieving the goal. Count how many pass. If you manage two of three in fifteen minutes with full knowledge, assume an outsider gets there in a day.",
  reflection: "How long did it take me to defeat my own filter, and what am I now willing to claim it does?",
  recall: {
    q: "What is the transferable lesson from the ten-detector result, stated without reference to images?",
    a: "A detector placed downstream of an attacker-controllable channel becomes a term in the attacker's optimisation once they know about it, so results measured against attacks that predate the detector overstate its value.\n\nDetectors are therefore rate-limiters on undirected noise. They are not containment, and a security argument that rests on one has no floor."
  },
  deepDive: "Play the adaptive attacker against my current content filter: given its rules, generate the payloads that would pass it, and tell me which of them a boundary control would still have stopped."
},
{
  id: "defences-guardrail-classifiers",
  track: "defences", level: "modern",
  title: "Guardrail classifiers buy coverage, latency cost and a false sense of a boundary",
  source: "Meta, Llama Guard and Prompt Guard model cards",
  idea: "A classifier in front of the context catches the unsophisticated majority and will be evaded by anyone targeting you specifically, so size the investment to that reality.",
  why: "Meta's own model cards are unusually candid about this. Prompt Guard is described as a starting point that should be tuned on application-specific data, and as something an adaptive attacker can evade; Llama Guard classifies content against a taxonomy rather than deciding whether an action is safe to take. Read together they describe a filter, not a boundary, and the vendor says so.\n\nThe economics still work at the low end. Most of what hits a public agent surface is opportunistic, and removing that traffic reduces incident volume and log noise materially for a small inference cost. What it must not do is buy schedule. If the classifier lets the boundary work slip a quarter, you have converted a cheap layer into an expensive one.",
  failureMode: "The classifier sits on the user's prompt only, because that is where the API examples put it, while the injection arrives inside a tool result the agent fetches on turn four. The guardrail dashboard shows zero detections for a month and the team reads that as an absence of attacks.",
  experiment: "Find where your guardrail actually runs in the request path and write down which channels it inspects: user input, tool output, retrieved documents, previous turns. Any channel it does not inspect is uncovered. Also record the added p95 latency, because that is the number someone will ask you to trade away later.",
  reflection: "Which channels does my classifier not see, and is the guardrail currently justifying a delay to boundary work?",
  recall: {
    q: "What is the correct role for a guardrail classifier in an agent architecture?",
    a: "Volume reduction against opportunistic attacks, sitting on every untrusted channel rather than only the user prompt, with its latency cost measured.\n\nIt cannot be the layer a security argument rests on, because a targeted attacker adapts to it and the vendor documentation says as much."
  },
  expires: "2027-08-01",
  deepDive: "Map every untrusted channel entering my agent's context and tell me which ones my current classifier placement misses."
},
{
  id: "defences-log-plan-call-provenance",
  track: "defences", level: "practice",
  title: "Log the plan, the call and the provenance, because the prose is not evidence",
  source: "Adkins, Beyer, Blankinship, Lewandowski, Oprea and Stubblefield, Building Secure and Reliable Systems (O'Reilly, 2020)",
  idea: "The auditable record of a non-deterministic system is the ordered sequence of tool calls with their resolved arguments, the authority each executed under, and the origin of every value that flowed into them.",
  why: "Reasoning text is a plausible narrative generated alongside the actions, not a causal account of them, and under injection it is exactly the part the attacker had most influence over. An incident investigation that has only the transcript can establish what the model said it was doing. It cannot establish what happened. What answers the question is the call log: tool name, resolved arguments, credential identity and scope, tenant context, policy decision, and for each argument the source it came from.\n\nProvenance is the field teams skip and then need first. When you are asked whether a value that ended up in an outbound call originated in customer-authored content, the answer has to be a lookup rather than a reconstruction. Emit it as structured events, not prose, and retain it long enough to cover the gap between an injection landing and someone noticing.",
  failureMode: "An incident report arrives and your logs contain the full chain of thought and the tool names, but not the arguments. You cannot say which tenant's rows were read, so the notification decision has to assume the worst case for every tenant on the cluster.",
  experiment: "Pull the log record for one real agent run from last week. Try to answer four questions from it alone: which tools ran in what order, what arguments they received, which credential and scope each ran under, and where each argument's value came from. Count how many you can answer. The unanswerable ones are your instrumentation backlog, in priority order.",
  reflection: "Which of the four questions could I not answer, and what does the missing field cost me during an actual incident?",
  recall: {
    q: "Why is the model's reasoning text unsuitable as an audit record?",
    a: "It is generated text correlated with the actions rather than a record of them, and under injection it is the surface the attacker most directly influenced, so it can describe a benign intent alongside a hostile call.\n\nThe record that holds up is structured: ordered tool calls, resolved arguments, the authority each ran under, the policy decision, and the provenance of each value."
  },
  expires: "2028-06-01",
  deepDive: "Define the structured audit event for one of my tool calls, including the provenance field, and tell me what has to change upstream for provenance to be populated rather than inferred."
},
{
  id: "defences-adaptive-attacker-required",
  track: "defences", level: "modern",
  title: "A defence evaluated against a fixed attack set is unevaluated",
  source: "Tramèr, Carlini, Brendel and Madry, On Adaptive Attacks to Adversarial Example Defenses, NeurIPS 2020",
  idea: "A defence's reported success rate is meaningless unless the attacks it was measured against were constructed with knowledge of the defence.",
  why: "Tramèr and colleagues took thirteen defences published at major venues, each already claiming an adaptive evaluation, and substantially reduced the robustness of every one by tailoring the attack to the specific mechanism. The failure was not that the authors were careless. It was that adaptive evaluation is a craft skill and running a standard attack suite with more iterations looks like it from the inside.\n\nCarry that directly into agent defences. If a vendor reports a low attack success rate, the questions are: which attacks, were they written after the defence was known, who wrote them, and were they allowed to see the system prompt, the delimiter scheme and the classifier thresholds. A defence measured only against last year's public injection corpus has been tested against attacks that could not have targeted it, which tells you about the corpus and not about the defence.",
  failureMode: "You harden your agent until the published injection benchmark reports zero successes, then ship. The first real attempt is written by someone who read your public docs, knows your tool names and phrases the injection as a legitimate-looking metadata operation. It was never in the corpus and there is no reason it would have been.",
  experiment: "Before your next defence lands, write the adaptive attack yourself with full white-box knowledge and time-box it to an hour. Record the attack success rate with the defence on and off. If you cannot beat your own defence in an hour, that is a modestly informative result. If you can, you have saved a launch.",
  reflection: "What is my adaptive attack success rate against my own newest defence, and who else should try before I trust the number?",
  recall: {
    q: "What question should you ask about any reported attack success rate?",
    a: "Whether the attacks were constructed with knowledge of the defence, and by whom. A rate measured against a fixed public corpus predates the defence and cannot have targeted it.\n\nThirteen defences at top venues, all claiming adaptive evaluation, were substantially weakened by attacks tailored per mechanism. Assume the same margin exists in agent defence claims."
  },
  expires: "2028-06-01",
  deepDive: "Act as the adaptive attacker against a defence I describe: assume full knowledge of the mechanism and give me the three attacks you would try first, ordered by expected success."
},
{
  id: "defences-report-both-numbers",
  track: "defences", level: "modern",
  title: "Every defence costs utility, so report both numbers",
  source: "Debenedetti, Zhang, Balunović, Beurer-Kellner, Fischer and Tramèr, AgentDojo (NeurIPS 2024)",
  idea: "A defence that drives attack success to zero by refusing half the legitimate tasks has relocated the failure rather than removed it, and only paired metrics make that visible.",
  why: "AgentDojo's defence evaluations show the tradeoff explicitly: the mechanisms that most reduce attack success also reduce benign utility, and some do so sharply. That is not a flaw in those mechanisms, it is the shape of the problem. Constraining what an agent may do with untrusted content necessarily constrains what it can do for a user whose task genuinely requires acting on that content.\n\nThe managerial consequence is that a defence decision is a product decision and has to be taken with the utility number in the room. A twenty point drop in task completion is a support load, a churn signal and eventually a pressure to switch the defence off in production, which is the worst of both outcomes. Choose the defence whose utility cost falls on tasks you are willing to lose, and say which tasks those are before you ship.",
  failureMode: "You ship a strict tool-argument policy, attack success goes to zero, and completion drops from seventy percent to forty. Within a month someone adds a bypass flag for a large customer, the flag spreads, and the policy is now a default that the important paths do not take.",
  experiment: "For the last defence you shipped, find or reconstruct the benign completion rate before and after. If nobody measured before, that is the finding, and the next defence gets a baseline captured first. Write both numbers and the date next to the defence in your design doc.",
  reflection: "What did my last defence cost in completion, and which specific tasks did it break?",
  recall: {
    q: "What is the failure pattern of shipping a defence without a utility number?",
    a: "The utility cost surfaces later as support load and customer pressure, and the remedy applied under that pressure is a bypass rather than a redesign. The bypass then propagates to exactly the high-value paths that most needed the control.\n\nCapturing benign completion before and after makes the tradeoff a decision taken deliberately rather than one reversed reactively."
  },
  expires: "2028-02-01",
  deepDive: "Help me define the benign task set I would measure completion against, so my next defence ships with both numbers instead of one."
},
{
  id: "defences-five-questions-per-tool",
  track: "defences", level: "practice",
  title: "A new tool gets five questions before it ships",
  source: "OWASP GenAI Security Project, Securing Agentic Applications Guide (2025)",
  idea: "Whose authority does it run under, what can it reach, can it write, can it reach the network, and what does a hostile argument do: asked once per tool, written down, and reviewed.",
  why: "Agent risk accumulates one tool at a time, and each addition looks small in isolation. The compounding happens because tools share a session: a read tool that reaches customer text and a send tool that reaches Slack are individually unremarkable and jointly a trifecta. A fixed five-question record per tool is what makes the compounding visible, because you can read the answers across the whole tool list and see the combination.\n\nThe fifth question is the one that changes designs. Take each argument, assume it was chosen by an attacker rather than by the model, and say what happens. It surfaces path traversal in a file argument, cross-tenant reads in an identifier argument and injection in anything concatenated into a query, and it does so in the fifteen minutes before the tool exists rather than in the incident after.",
  failureMode: "Tool number twelve is a helpful fetch-a-URL utility added by a well-meaning engineer to support documentation lookups. Nobody asks question four. Every earlier tool that reads tenant data is now paired with a general-purpose exfiltration channel, and the review that would have caught it never happened because the tool was three files.",
  experiment: "Make the five-column table and fill it in for every tool your runtime exposes today. Then read down column four and column two together and mark any pair where one tool reaches private data and another reaches the network. Those pairs are your live trifectas, and the count is a number you can put in front of your director.",
  reflection: "How many live trifecta pairs does my current tool list contain, and which single tool's removal collapses the most of them?",
  recall: {
    q: "Recite the five questions, and say which one most often changes a design.",
    a: "Whose authority it runs under, what it can reach, whether it can write, whether it can reach the network, and what a hostile argument does.\n\nThe fifth. Assuming each argument was attacker-chosen rather than model-chosen surfaces traversal, cross-tenant identifiers and query injection while the tool is still a design rather than a dependency."
  },
  expires: "2028-02-01",
  deepDive: "Run the five questions over a tool I am about to add and be adversarial about the fifth: give me the three hostile argument values you would try first."
}
);

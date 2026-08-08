/* Track: Authority and capabilities. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "authority-access-matrix",
  track: "authority", level: "classical",
  title: "The access matrix is the one model of authority worth memorising",
  source: "Butler Lampson, Protection, 5th Princeton Conference on Information Sciences and Systems, 1971 (reprinted in ACM SIGOPS Operating Systems Review 8(1), 1974)",
  idea: "Every access control system you will ever build or buy is a partial, compressed representation of one conceptual table: subjects down the side, objects across the top, rights in the cells.",
  why: "The matrix is not an implementation. Nobody materialises it, because it is sparse and enormous. Its value is that it is the ground truth every real design approximates, so you can ask of any system: which slice of the matrix does this actually store, and what queries can it therefore answer cheaply?\n\nOnce you hold the matrix in your head, most authority arguments collapse into bookkeeping. A permissions table on the object is a column. A token in a request is a row fragment. A role is a factored intermediate. A network policy is a matrix over hosts. The interesting question is never whether a design is 'secure', it is which cells the design can enumerate, which cells it can only test one at a time, and which cells nobody can name at all.",
  failureMode: "You inherit a system that can answer 'who can read this table' in one query and cannot answer 'what can this service account reach' at any price. That gap is not an oversight, it is the storage layout. Nobody notices until an incident asks the row question and the honest answer is a week of grepping IAM policies.",
  experiment: "Pick one authority mechanism in your runtime - the tenant token, the tool allowlist, the Kubernetes RBAC binding, whichever. Write on one line whether it stores rows or columns, then write the query it cannot answer. Two sentences, done in five minutes.",
  reflection: "Which slice does your agent runtime store, and which question did you discover you cannot answer about it?",
  recall: {
    q: "What are the three axes of Lampson's access matrix, and why does it matter which axis a system indexes on?",
    a: "Subjects, objects, and the rights held in each cell. Nothing materialises the full matrix, so every real system stores a slice of it.\n\nThe indexing choice decides which questions are cheap. Index by object and per-object audit is a lookup while per-subject reasoning is a scan. Index by subject and the two swap."
  },
  deepDive: "Take one authority mechanism in my agent runtime and tell me which slice of the access matrix it stores, then name the question it structurally cannot answer."
},
{
  id: "authority-acl-vs-capability",
  track: "authority", level: "classical",
  title: "ACLs answer who can reach this, capabilities answer what this can reach",
  source: "Miller, Yee and Shapiro, Capability Myths Demolished, Johns Hopkins University Systems Research Laboratory Technical Report SRL2003-02",
  idea: "An access control list is the matrix stored by column and a capability set is the matrix stored by row, and that single storage decision determines which security questions are one lookup and which are a full scan.",
  why: "Store by column and each object carries the list of subjects permitted to touch it. Per-object audit is trivial: read the list. Per-subject reasoning is a scan of every object in the system, which is why nobody can tell you what a service account can actually reach. Store by row and each subject holds a set of references it can exercise. Now the subject's total authority is enumerable by construction, and the per-object question becomes the expensive one.\n\nThe second consequence matters more. Column storage requires that a request name its target, and the system then decides using the requester's identity. That naming step is the seam where the confused deputy lives. Row storage passes the reference itself, so the request cannot name something the caller does not already hold. The tradeoff is not about strength - both can express the same matrix - it is about which mistakes each layout makes easy to write and which it makes impossible to express.",
  failureMode: "Your ACL-shaped platform can tell an auditor precisely who is on the read list for a customer's metadata. When the agent runtime misbehaves, the same platform cannot tell you the set of objects one agent session could have touched, so the incident scope becomes 'everything the tenant credential covers' by default.",
  experiment: "Take one object your agent can act on and list its column, the subjects permitted. Then take one agent session and try to list its row. Time both. The ratio is the argument.",
  reflection: "Which of the two lists took longer to produce, and what did you have to reconstruct by hand to produce it?",
  recall: {
    q: "Both ACLs and capabilities can express the same access matrix, so what is the actual difference?",
    a: "Storage orientation, and what that makes cheap. ACLs are columns, so per-object audit is a lookup and per-subject reachability is a scan. Capabilities are rows, so a subject's total authority is enumerable and the per-object question costs more.\n\nThe follow-on is that ACL requests must name a target and are resolved against caller identity, which is exactly the seam a confused deputy exploits. Capability requests carry the reference, so there is no name to forge."
  },
  deepDive: "For one tool in my runtime, work out what the column looks like and what the row looks like, and tell me which one my platform can actually produce."
},
{
  id: "authority-ambient-authority",
  track: "authority", level: "classical",
  title: "Ambient authority is why code does things nobody asked it to",
  source: "Mark S. Miller, Robust Composition: Towards a Unified Approach to Access Control and Concurrency Control, PhD thesis, Johns Hopkins University, 2006",
  idea: "Authority is ambient when a subject can exercise it merely by naming a target rather than by holding a reference, and ambient authority is the precondition for almost every confused-deputy bug ever written.",
  why: "In an ambient system, a request is just a string: a path, a URL, a table name, an object id. The runtime resolves that string against the caller's identity and applies whatever the identity is permitted to do. The code that constructed the string and the authority that executes it are completely decoupled. Nothing in the call site records the intent to touch that particular object, so nothing can check it.\n\nThat decoupling is what makes injection profitable. If a piece of untrusted text can influence the string, it inherits the caller's full identity for free. This is not a bug in the caller's logic, it is the system working as designed: `open('/etc/shadow')` and `open('./scratch')` are the same operation with different bytes. Object capability discipline removes the seam by removing the string. You cannot ask for what you were not handed.",
  failureMode: "Your agent runtime authenticates once to a tenant's warehouse and then passes model-generated table names into the query path. A customer-authored column description says to summarise the payroll table. The model produces the name, the runtime resolves it under the tenant credential, and every access check passes because the identity genuinely is allowed to read payroll.",
  experiment: "Grep your tool implementations for arguments that are identifiers resolved server side - table names, asset GUIDs, file paths, URLs, connection ids. Count them. Each one is an ambient authority surface and the count is your first number.",
  reflection: "How many of your tool arguments are names resolved against the runtime's identity rather than handles the caller already held?",
  recall: {
    q: "Define ambient authority precisely, and explain why it makes injection so much more valuable to an attacker.",
    a: "Authority is ambient when it comes from who the caller is rather than from a reference the caller was handed, so naming a target is enough to act on it.\n\nUnder ambient authority, anything that can influence the name inherits the caller's full identity. Untrusted text that reaches an argument therefore gets the whole credential behind it, not just the slice the task needed."
  },
  deepDive: "Go through my tool definitions and list every argument that is a name resolved against the runtime's own identity rather than a handle the caller was given."
},
{
  id: "authority-confused-deputy",
  track: "authority", level: "classical",
  title: "The confused deputy is the bug you will ship",
  source: "Norm Hardy, The Confused Deputy (or why capabilities might have been invented), ACM SIGOPS Operating Systems Review 22(4), October 1988",
  idea: "When a privileged service accepts a target name from a less privileged caller and acts on it with its own authority, the caller has borrowed the service's privilege without ever being granted it.",
  why: "Hardy's compiler ran with the authority to write the system's billing file. It also accepted an output filename from the user. A user who passed the billing file's name got it overwritten, not by exceeding their own rights but by asking a deputy that had those rights and no way to distinguish 'the user wants this' from 'the user is permitted this'. The deputy was not compromised. It was confused about whose intent it was serving.\n\nThe shape recurs at every layer because the ingredients are common: a component with more authority than its callers, plus an interface that takes a target as data. Server-side request forgery is a fetcher with network position taking a URL. Cross-site request forgery is a browser with cookies taking a form action. An agent runtime holding a tenant credential and taking tool arguments derived from customer-authored text is the same diagram with a language model in the deputy's chair. Once you can see the shape, you stop treating these as three unrelated vulnerability classes.",
  failureMode: "Your metadata agent runs with a service credential broad enough to read across a tenant's connections. A prompt embedded in an asset description asks it to read from a connection the requesting user cannot see and paste the result into a comment. Every authorisation check the runtime performs passes, because the runtime is genuinely allowed to do all of it.",
  experiment: "Draw the three-box diagram for one tool call: caller, deputy, target. Label the arrow from caller to deputy with what the caller supplies, and label the deputy with what authority it holds. If the caller supplies a name and the deputy holds broad authority, you have found one.",
  reflection: "Which of your tools is the deputy, and whose authority does it actually execute under?",
  recall: {
    q: "State the confused deputy in one sentence, and name three modern vulnerability classes that are instances of it.",
    a: "A privileged service performs a less privileged caller's request using its own authority, because it cannot tell the caller's wish apart from the caller's rights.\n\nSSRF is a fetcher with network position taking a URL. CSRF is a browser with ambient cookies taking a form action. An agent runtime holding a tenant credential and taking tool arguments influenced by untrusted text is the same shape."
  },
  deepDive: "Draw the confused deputy diagram for my highest-privilege tool and tell me whether the caller can steer the target."
},
{
  id: "authority-designation-carries-authority",
  track: "authority", level: "classical",
  title: "Designation and authority must travel in the same message",
  source: "Norm Hardy, The Confused Deputy, ACM SIGOPS Operating Systems Review 22(4), 1988",
  idea: "The fix for the confused deputy is not more validation of the name, it is passing a reference that already carries the permission, so there is no name left for anyone to forge.",
  why: "Every validation-based fix is a denylist of targets the deputy should refuse. It fails the moment someone invents a new spelling, a redirect, a symlink, a DNS rebind, an alias, a synonym in the catalogue. The name and the right are separate objects, so the check is an inference about a string and inferences about strings lose.\n\nHardy's point is that the two should never have been separate. If the caller hands the deputy a reference that is itself the authority to write that file, the deputy no longer has any decision to make: it writes to what it was given, and it can only be given what the caller already held. The caller's inability to reach the billing file is now a property of the message rather than a property of a check. This is why capability people say designation and authority must be unified, and it is the single most transferable idea in this corpus.",
  failureMode: "You harden the URL fetcher with a blocklist for 169.254.169.254 and RFC1918 ranges. Six months later someone adds a redirect follower, or a hostname resolves to a link-local address on second lookup, and the blocklist was never the boundary. Meanwhile a fetcher that only accepts pre-resolved connection handles has no bypass to find.",
  experiment: "Pick your riskiest name-taking tool and write the signature it would have if the argument were a handle minted upstream instead of a string. Note what would have to change in the caller. Do not implement it, just cost it.",
  reflection: "What would break in your call chain if that argument became an unforgeable handle rather than a name?",
  recall: {
    q: "Why is validating the target name a structurally weaker fix for the confused deputy than passing a capability?",
    a: "Validation keeps the name and the right as separate things and tries to infer one from the other, so every new alias, redirect or encoding is a bypass candidate.\n\nUnifying designation and authority means the reference is the permission. The deputy has no decision to make and the caller can only pass what it already held, so there is nothing to forge."
  },
  deepDive: "Rewrite my riskiest tool's signature so the target argument is an unforgeable handle rather than a name, and tell me what breaks upstream."
},
{
  id: "authority-connectivity",
  track: "authority", level: "classical",
  title: "Only connectivity begets connectivity",
  source: "Mark S. Miller, Robust Composition, PhD thesis, Johns Hopkins University, 2006",
  idea: "In an object capability system a component can only come to reach an object by being given it, by creating it, or by being introduced to it by something it already reaches, which makes reachability an analysable property of the graph rather than a runtime accident.",
  why: "The rule sounds trivial and its consequence is not. If those three are the only ways an edge appears, then the set of objects a component can ever touch is bounded by the edges it starts with plus whatever those edges can introduce. You can compute that. You can review it in a diagram. You can write it in a constructor and have the type system hold you to it.\n\nContrast the ambient world, where any component can reach any object whose name it can construct, and reachability is therefore the whole namespace filtered by identity checks scattered across the codebase. There is no graph to draw. This is why the discipline earns its keep in agent runtimes specifically: the interesting security question about a tool-calling loop is 'what is in reach of this session', and that question has an answer only if the runtime obeys the connectivity rule.",
  failureMode: "A tool implementation reaches out to a global connection registry to look up a client rather than using the one it was constructed with. The reachability diagram you drew in the design review is now fiction, and no test fails, because the lookup succeeds.",
  experiment: "Open one tool implementation and count references it obtains from module-level singletons, globals, environment variables or service locators rather than from its constructor or call arguments. Each one is an edge that does not appear in your diagram.",
  reflection: "How many edges does your tool layer create out of thin air, and which is the worst?",
  recall: {
    q: "What are the only three ways a component gains a new reference under object capability discipline, and what does that buy you?",
    a: "Initial conditions, creation, and introduction by something it already holds. Nothing else creates an edge.\n\nBecause edges only appear in those three ways, reachability becomes a static property of the object graph. You can bound and review what a component can ever touch, which is impossible when any name can be constructed and resolved against identity."
  },
  deepDive: "Audit one of my tool implementations for references it pulls from globals or service locators instead of receiving, and tell me which edges that adds."
},
{
  id: "authority-capability-myths",
  track: "authority", level: "classical",
  title: "Capabilities can be revoked and can enforce confinement",
  source: "Miller, Yee and Shapiro, Capability Myths Demolished, SRL Technical Report SRL2003-02, 2003",
  idea: "The three standing objections to capabilities - that they are equivalent to ACLs, that they cannot confine, and that they cannot be revoked - all describe bearer tokens sitting in a system that still has ambient authority, not capabilities.",
  why: "The equivalence myth comes from comparing the matrices and concluding that anything one expresses the other expresses too. True and irrelevant: the paper's point is that ACLs cannot express the delegation and least-authority patterns without a name-resolution step, and that step is where the confused deputy enters. The confinement myth comes from assuming capabilities can be copied to anyone, which is only true if there is an ambient channel to copy them over. In a pure capability system, passing a capability requires a connection you already have, so confinement is enforced by the same connectivity rule that governs everything else.\n\nThe irrevocability myth is the one worth internalising, because it is the one people repeat about API keys and think they are talking about capabilities. A capability is not a bearer token you scatter and hope. It is a reference, and references can be indirected. If you hand out a forwarder instead of the target, you can drop the forwarder later. The paper's contribution is showing that all three objections dissolve once you stop assuming ambient authority is present.",
  failureMode: "Someone in a design review says capabilities cannot be revoked, so you keep the ACL check on every call and keep the ambient credential, and now you have both the per-call latency and the confused deputy. The myth cost you the architecture.",
  experiment: "Write down which of the three myths you personally believed before today, and the one sentence that dissolves it. If you believed none of them, write down which one your platform's design implicitly assumes.",
  reflection: "Which myth is baked into an argument someone on your team has already made to you?",
  recall: {
    q: "Name the three capability myths and the common error underneath all three.",
    a: "Equivalence with ACLs, inability to confine, and irrevocability.\n\nAll three assume a capability is an unforgeable bearer token loose in a system that still has ambient authority and open channels. Remove ambient authority and the connectivity rule bounds propagation, indirection restores revocation, and the ACL comparison stops being the interesting question."
  },
  deepDive: "Take the strongest argument my team has made against capability-style tool handles and tell me which of the three myths it rests on, if any."
},
{
  id: "authority-delegation",
  track: "authority", level: "classical",
  title: "Delegation is the composition mechanism, not an exception to the model",
  source: "Miller and Shapiro, Paradigm Regained: Abstraction Mechanisms for Access Control, ASIAN 2003",
  idea: "Handing authority on to another component is the normal way systems compose, and any access model that treats it as an anomaly pushes it into shared credentials and impersonation instead.",
  why: "Real systems are chains. A user asks an agent, the agent asks a tool, the tool asks a warehouse. Authority has to travel along that chain somehow. If the model has a first-class way to pass a narrowed reference, the chain is explicit and each hop's authority is visible. If it does not, the chain still happens - it just happens by copying a credential, or by a service account that can act as anybody, or by an impersonation header that the next hop trusts because it came from inside.\n\nThose workarounds are strictly worse than modelling delegation, because they lose the attenuation. A passed capability can be narrower than the one you held. A shared service account cannot be. The moment your architecture says 'the tool layer uses the platform credential and checks the user's permissions itself', you have replaced delegation with reimplementation, and you now have two authorisation systems that must agree forever.",
  failureMode: "The agent service holds a superuser connection and filters results by the requesting user's permissions in application code. A new asset type ships without the filter. The bug is not the missing filter, it is that the tool ever held authority the user did not have.",
  experiment: "For one call chain in your runtime, write the authority at each hop: user, runtime, tool, backend. Mark every hop where the authority is wider than the hop before it. Widening hops are your delegation gaps.",
  reflection: "Where in your chain does authority get wider instead of narrower, and why was it built that way?",
  recall: {
    q: "What happens to delegation in a system that does not model it?",
    a: "It does not disappear, it moves into shared credentials, service accounts that can act as anyone, and trusted impersonation headers.\n\nThose lose attenuation. A delegated capability can be narrower than the one you held, whereas a shared credential is exactly as wide as the widest caller, and you end up reimplementing authorisation in application code that must stay in sync forever."
  },
  deepDive: "Map the authority at each hop of one call chain in my runtime and flag every hop where it gets wider rather than narrower."
},
{
  id: "authority-attenuation-caveats",
  track: "authority", level: "modern",
  title: "Attenuation turns one credential into a narrower one without a server round trip",
  source: "Birgisson, Politz, Erlingsson, Taly, Vrable and Lentczner, Macaroons: Cookies with Contextual Caveats for Decentralized Authorization in the Cloud, NDSS 2014",
  idea: "A credential built so that any holder can append restrictions and nobody can remove them lets a caller mint a strictly weaker version of its own authority locally, which is the practical primitive for giving an agent task-scoped rights derived from a user's.",
  why: "Macaroons use chained HMAC: the current signature is the key for signing the next caveat, so appending a restriction is cheap and stripping one is a forgery. The verifier replays the chain and requires every caveat to hold. That asymmetry is the whole trick. Attenuation becomes a local operation, no issuer call, no new database row, no coordination.\n\nFor an agent runtime this is the difference between handing a session the tenant credential and handing it a derived credential that says: this connection, these three assets, read only, expires in ninety seconds, and only for run id R. If a prompt injection then steers a tool call, the blast radius is what the caveats allow rather than what the tenant allows. Third-party caveats extend the same idea to discharge from another service, which is how you attach a freshness or approval check without the issuer being in the path. The cost is real: caveat semantics must be interpreted identically by every verifier, and a caveat nobody knows how to check must fail closed, which is a discipline teams routinely get wrong.",
  failureMode: "The agent holds the same warehouse credential for the whole session because minting a narrower one would mean an extra call to the auth service on every step. An injected instruction on step nine uses the credential from step one, and the audit log shows a legitimate session doing legitimate things to the wrong tables.",
  experiment: "Take one long-running agent session and list every distinct resource it touched. Then write the caveat set that would have covered exactly those and nothing else. The difference between that set and the credential it actually held is your over-grant, in objects.",
  reflection: "How many objects wide was the credential compared to how many it needed?",
  recall: {
    q: "What property of a macaroon makes attenuation possible without contacting the issuer, and what is the operational trap?",
    a: "Chained HMAC, where each signature keys the signing of the next caveat. Appending a restriction is local and cheap, removing one is a forgery, so any holder can weaken but not strengthen.\n\nThe trap is verifier semantics. Every verifier must interpret caveats identically and must fail closed on a caveat it does not understand, otherwise an unrecognised restriction quietly becomes no restriction."
  },
  deepDive: "Design the caveat set for one of my agent tool calls so the credential it carries covers exactly that call and expires with it."
},
{
  id: "authority-revocation-indirection",
  track: "authority", level: "classical",
  title: "Revocation is a level of indirection you have to build before you need it",
  source: "David D. Redell, Naming and Protection in Extendable Operating Systems, 1974 (MIT Project MAC TR-140), the caretaker pattern",
  idea: "You revoke a reference by never handing out the real one: you hand out a forwarder you control, and dropping the forwarder is the revocation.",
  why: "Redell's caretaker is an object that holds the target and passes calls through, plus a switch the grantor keeps. Revoke by flipping the switch and every future call through that forwarder fails. Nothing is recalled, nothing is searched for, nothing depends on locating copies. The forwarder was the only path.\n\nThe operational consequence is the part people miss: revocability is decided at issue time, not at incident time. If you handed out the raw reference, there is no forwarder to drop and no amount of incident-response energy creates one retroactively. This is exactly the position a team is in when an agent's tool call returns a long-lived credential straight to the model's context. You cannot revoke bytes that are already in a transcript. You can revoke a handle that resolves through you.",
  failureMode: "An integration is offboarded and you discover the only revocation available is rotating the shared secret, which breaks the eleven other consumers using it. Revocation becomes a change-managed outage, so it gets scheduled, so it does not happen.",
  experiment: "List the references your runtime hands to a tool or an agent session. For each, write the exact revocation action and how long it takes. Any row where the answer is 'rotate the shared secret' is a missing caretaker.",
  reflection: "Which reference in your runtime has no revocation path shorter than a rotation?",
  recall: {
    q: "How does the caretaker pattern revoke a capability, and why is revocability a design-time decision?",
    a: "You issue a forwarder that holds the real reference and passes calls through, keeping a switch. Flipping the switch kills every future call on that path without recalling anything.\n\nIt is design-time because the forwarder must exist before the grant. If you handed out the raw reference there is nothing to drop, and no amount of incident-response effort creates the indirection retroactively."
  },
  deepDive: "List every reference my runtime hands to a tool and tell me which ones have no revocation path other than rotating a shared secret."
},
{
  id: "authority-revocation-cache",
  track: "authority", level: "practice",
  title: "Revocation fails at the cache, not at the policy",
  source: "Butler Lampson, Computer Security in the Real World, IEEE Computer 37(6), 2004",
  idea: "The gap between revoking access and access actually stopping is set by every component holding a cached decision, and that number is a property you should be measuring rather than assuming.",
  why: "Policy revocation is a write. Effective revocation is the moment the last holder of a stale decision stops honouring it. Between those two sits every replica lagging behind the primary, every session object built at login, every sidecar with a five-minute policy cache, every JWT that is valid until its exp claim regardless of what the directory now says, and every long-lived connection authorised at handshake. Each of those is a copy of the decision made at a point in time, and none of them are consulted by your revoke call.\n\nFor an agent runtime this is worse than for a request-response service, because agent sessions are long. A tool loop that authorised at step one and runs for twenty minutes has a twenty-minute revocation window by construction. The honest engineering move is to measure the window rather than argue about it: revoke in a test tenant, then poll until the access actually fails, and write the number down. If the number is unacceptable, the fix is shortening the cached-decision lifetime or adding a revocation check at the hop that matters, both of which cost latency. That is the real tradeoff and it is worth having explicitly.",
  failureMode: "Security revokes a compromised user at 14:02. The agent runtime's session was created at 13:40 with a token valid for an hour, and the sidecar caches authorisation decisions for five minutes on top. The user's agent keeps reading customer metadata until 14:40 and the incident timeline records the revocation as complete at 14:02.",
  experiment: "In a non-production tenant, revoke one access and poll the protected operation every five seconds until it fails. Record the elapsed time. That single number is more useful than the policy document.",
  reflection: "What was your measured revocation window, and which cache contributed most of it?",
  recall: {
    q: "Why is measured revocation latency almost always longer than the policy write, and what components make up the difference?",
    a: "Because revocation is a write to policy while enforcement happens against copies of past decisions.\n\nThe difference is made of replica lag, session objects built at login, sidecar and gateway policy caches, self-contained tokens valid until expiry, and connections authorised once at handshake. Long-running agent sessions widen the window further because they authorise at the start and run for minutes."
  },
  deepDive: "Help me design a revocation-latency measurement for my agent runtime and identify which cached decision will dominate the number."
},
{
  id: "authority-pola-enumeration",
  track: "authority", level: "classical",
  title: "Least authority stays rare because nobody wants to enumerate what a task needs",
  source: "Mark S. Miller, Robust Composition, PhD thesis, Johns Hopkins University, 2006",
  idea: "The principle of least authority is unimplemented far more for organisational reasons than technical ones: it requires someone to write down, per task, the exact set of objects that task touches, and that work is boring, ongoing, and owned by nobody.",
  why: "The mechanisms have existed for fifty years. What has not existed is a party willing to maintain the enumeration. Every new feature adds an object to some task's set, and if the grant is not updated the feature breaks in production, so the rational local move is always to widen the grant once and never revisit it. Least authority decays monotonically toward most authority under normal engineering pressure, and nothing in the deployment pipeline notices.\n\nThis reframes the problem usefully. The question is not 'can we adopt POLA' but 'what makes the enumeration cheap enough that widening is no longer the path of least resistance'. Deriving grants from the code rather than from a config file. Failing closed in CI when a tool touches something outside its declared set. Making the grant an argument to the constructor so it appears in the diff. Anything that puts the enumeration where a developer already has to look. Where you cannot make it cheap, do not pretend: say the grant is broad and put the compensating control somewhere honest.",
  failureMode: "The tool role was scoped to three APIs at launch. Eighteen months later it has twelve, each added by a one-line PR titled 'fix 403 in staging', and no one has ever removed one. The role is now the union of every feature ever shipped, which is indistinguishable from admin.",
  experiment: "Take the broadest grant in your runtime and diff it against the calls actually observed in the last thirty days of logs. Count the permissions with zero observed use. That count is your unenumerated surplus.",
  reflection: "How many unused permissions did you find, and what would it take to remove one this week?",
  recall: {
    q: "Why does least authority erode over time even in teams that believe in it?",
    a: "Because enumeration is continuous work with no owner. Every feature may add an object to a task's set, and an under-wide grant fails in production while an over-wide one fails silently.\n\nSo the locally rational move is always to widen once and never revisit, and grants drift monotonically toward admin. The fix is making enumeration cheap and its violation loud, not exhorting people to be careful."
  },
  deepDive: "Compare my broadest tool grant against the calls actually observed in logs and list the permissions with no observed use."
},
{
  id: "authority-rbac-compression",
  track: "authority", level: "classical",
  title: "RBAC is a lossy compression of the access matrix",
  source: "Sandhu, Coyne, Feinstein and Youman, Role-Based Access Control Models, IEEE Computer 29(2), 1996",
  idea: "Roles factor the access matrix into subject-to-role and role-to-permission, trading precision for administrability, and role explosion is what that compression looks like when the real matrix refuses to factor.",
  why: "The factoring works when the matrix genuinely has low rank: many subjects sharing identical permission sets, a stable job-function structure, permissions that cluster. Administration then scales with the number of roles rather than the number of subjects, which was the entire 1996 argument and it was correct for the enterprise of 1996.\n\nIt degrades when the matrix has per-subject, per-object structure that no small set of roles reproduces. You get roles like `analyst_apac_readonly_excluding_pii_except_finance`, one role per exception, and the count grows toward the number of subjects. At that point the compression has failed and you are paying the administrative overhead of roles for none of the benefit. Multi-tenant metadata platforms hit this early, because tenant and asset are both real dimensions and roles have to encode their cross product. The signal is quantitative and you can check it today: roles per subject, and subjects per role.",
  failureMode: "You add per-agent scoping by minting a role per agent per tenant. Six months later the directory has forty thousand roles, nobody can answer what any of them grant, and the review process that was supposed to justify roles has become a rubber stamp because no human can read the list.",
  experiment: "Compute two numbers from your identity system: median subjects per role, and the count of roles held by exactly one subject. A large single-holder count means the compression is not working.",
  reflection: "What fraction of your roles are held by exactly one subject, and what dimension are they actually encoding?",
  recall: {
    q: "What is RBAC compressing, and what is the observable symptom that the compression has failed?",
    a: "It factors the subject-object matrix into subject-to-role and role-to-permission, so administration scales with roles rather than subjects. That works when many subjects share identical permission sets.\n\nThe failure symptom is role explosion: a growing count of roles held by exactly one subject, and role names that encode exceptions. At that point role count approaches subject count and you pay the overhead without the benefit."
  },
  deepDive: "Look at my role structure and tell me which dimension the single-holder roles are really encoding, and whether relationships would model it better."
},
{
  id: "authority-rebac-edges",
  track: "authority", level: "modern",
  title: "Relationship based authorisation scales because it stores edges",
  source: "Pang et al., Zanzibar: Google's Consistent, Global Authorization System, USENIX ATC 2019",
  idea: "Storing authority as relationship tuples of the form object, relation, subject, and answering a check API over the resulting graph, is the model that has actually survived at multi-tenant scale, consistency costs included.",
  why: "A tuple is one edge: `asset:123#viewer@user:alice`, or `asset:123#viewer@group:analytics#member`. Because subjects can themselves be sets defined by other relations, the graph expresses inheritance, group nesting and hierarchy without materialising the cross product that role explosion produces. Authorisation becomes reachability in a sparse graph, evaluated on demand, which is exactly the structure a multi-tenant catalogue needs when authority flows down connection to database to schema to table.\n\nThe honest part is the consistency machinery, because that is where the engineering cost sits. Zanzibar's zookies exist because a system that caches authorisation decisions globally can otherwise serve a stale allow after a revoke, which is the new-enemy problem: content moved into a restricted folder is still visible because the check reads a snapshot from before the move. Any relationship system you adopt or build has this problem, and if it has no equivalent of a consistency token then it has chosen availability over correctness on your behalf. Ask which it chose before you adopt it, not after.",
  failureMode: "You adopt a relationship service, cache checks aggressively for latency, and skip the consistency token because the API makes it optional. A user removed from a group keeps passing checks for the cache TTL, and your agent runtime happily reads on their behalf the whole time.",
  experiment: "Write three relationship tuples that express one real authority path in your platform, connection to database to schema to asset. If you cannot express it in tuples, write down which part resisted and why.",
  reflection: "Did your authority hierarchy express cleanly as edges, and where did it not?",
  recall: {
    q: "What does a Zanzibar-style system store instead of roles, and what is the new-enemy problem?",
    a: "Relationship tuples: object, relation, subject, where the subject may itself be a set defined by another relation. Authorisation is reachability in that sparse graph, so hierarchy and group nesting do not require materialising a cross product.\n\nThe new-enemy problem is serving a stale allow after a revoke or a move, because the check evaluated an older snapshot. Consistency tokens exist to bound it, and a system without an equivalent has silently chosen availability over correctness."
  },
  deepDive: "Model one authority path in my platform as relationship tuples and tell me where the hierarchy resists being expressed as edges."
},
{
  id: "authority-capsicum",
  track: "authority", level: "modern",
  title: "Capsicum shows what capabilities look like in a shipping kernel",
  source: "Watson, Anderson, Laurie and Kennaway, Capsicum: Practical Capabilities for UNIX, USENIX Security 2010",
  idea: "Capsicum retrofits capability discipline onto FreeBSD by treating file descriptors as capabilities with explicit rights and adding a capability mode that removes access to global namespaces, which proves the model ships and also prices the restructuring it demands.",
  why: "Two mechanisms do the work. Rights are attached to descriptors, so a descriptor can be limited to read-only or to specific operations, and can be narrowed but never widened. Capability mode is a one-way transition after which the process cannot use any global namespace: no absolute paths, no opening by name, no PID namespace, no sysctl by name. Together they enforce exactly the rule that a process can only reach what it holds. `openat` relative to a directory descriptor replaces `open` on a path, which is designation and authority unified at the syscall layer.\n\nThe expensive part is honest and reported in the paper: applications must be restructured. Anything that opened files by name when it felt like it now needs those descriptors acquired before the transition, or supplied afterwards by a more privileged component over a socket. That is the shape of every capability retrofit, including yours. An agent runtime that wants this pattern must acquire its handles up front, in an initialisation phase where the untrusted text has not arrived yet, and run the tool loop after the transition. The cost is real, the payoff is that the sandbox boundary is enforced by the kernel rather than by every future contributor remembering a check.",
  failureMode: "Your sandbox is a denylist of syscalls or a container with a network policy, and the tool process can still resolve names in the global namespace. One `open` on a path assembled from model output, and the boundary you drew in the design document never existed at runtime.",
  experiment: "For one tool process, write the list of handles it would need before entering a capability-mode-style transition. Anything it opens by name later than that point is what you would have to restructure. Count those.",
  reflection: "How many name-based opens happen after the point where untrusted text enters your process?",
  recall: {
    q: "What are the two mechanisms in Capsicum, and what does adopting them cost an application?",
    a: "Descriptor rights, which attach a narrowable set of permitted operations to each file descriptor, and capability mode, a one-way transition that removes access to global namespaces so nothing can be opened by name.\n\nThe cost is restructuring. Programs must acquire their descriptors before the transition or receive them afterwards from a more privileged process, which means the phase separation between setup and untrusted work has to be real."
  },
  deepDive: "Work out the handle set my tool process would need before a capability-mode transition and count the name-based opens that happen after untrusted text arrives."
},
{
  id: "authority-tool-list-matrix-row",
  track: "authority", level: "practice",
  title: "Your agent's tool list is a row of the access matrix",
  source: "Mark S. Miller, Robust Composition, 2006, applied to tool handles",
  idea: "The set of tools you expose to a model is that session's row in the access matrix, and the gap between who authorises each call and whose authority executes it is your confused deputy surface, written down.",
  why: "This is where the whole track lands. A tool definition is a grant. The model chooses which grants to exercise and with what arguments, and the model's choices are influenced by text you do not control. So the row is the security boundary, and everything upstream of it is advisory. Prompt-level instructions to be careful are not part of the matrix.\n\nThe two-column exercise makes the gap visible without any tooling. For each tool, write who authorises this call - the end user, a service principal, a scheduled job, nobody in particular - and whose authority it executes under - the requesting user's token, a tenant service account, a platform superuser. Where the two columns differ, the tool is a deputy and the difference is the borrowed privilege available to anything that can steer the arguments. This is a note, not a command you can run, and it is deliberately note-shaped: probing a production agent is something you schedule with a team, whereas the two columns you can write this afternoon and they will change what you build next.",
  failureMode: "The tool list is reviewed for usefulness and never for authority. The summariser reads under the user's token, the lineage crawler reads under a tenant service account, and the comment writer writes under a platform account with cross-tenant reach. Nobody drew that table, so nobody noticed that a summary of untrusted text can end with a cross-tenant write.",
  experiment: "Two columns, one row per tool your runtime exposes: who authorises this call, and whose authority it executes under. Complete it for every tool. Then circle the rows where the two differ.",
  reflection: "Which tool has the widest gap between its two columns, and what would it take to close it?",
  recall: {
    q: "What are the two columns to write for each agent tool, and what does a difference between them mean?",
    a: "Who authorises the call, and whose authority the call executes under.\n\nA difference means the tool is a confused deputy: it acts with more authority than the party requesting it holds. Anything that can influence the arguments, including untrusted text in the model's context, can borrow that difference."
  },
  deepDive: "Fill in the two columns - who authorises the call, whose authority it runs under - for every tool in my runtime and rank the gaps by blast radius."
}
);

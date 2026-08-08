/* Track: Confinement and information flow. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "confinement-lampson-note",
  track: "confinement", level: "classical",
  title: "Confinement is the problem of a program that must not leak",
  source: "Butler Lampson, A Note on the Confinement Problem, Communications of the ACM 16(10), 1973",
  idea: "A confined program is one you have decided must not transmit anything outward except through channels you chose, and the useful part of Lampson's note is the enumeration of the channels you did not choose.",
  why: "Lampson splits the leak paths three ways. Storage the program can write and something else can read later. Legitimate channels, meaning the answer it is supposed to return and the metering data it is supposed to produce, which can be modulated to carry more than they claim. And covert channels, which are not channels at all in the design, just shared state whose variation is observable: load, timing, lock contention, the paging rate.\n\nThat third category is why confinement is hard and the first two are why it is usually broken in practice. Nobody forgets to lock down the filesystem. People forget that the response string is a channel, that the log line is a channel, that the error message is a channel, and that the bill is a channel. A summariser that returns free text to a caller with different privileges has a legitimate channel of unbounded width.",
  failureMode: "You sandbox the tool executor properly, then let it write to a shared response cache keyed by tenant-supplied strings and return free-form text to the orchestrator. Two of Lampson's three categories are wide open and the sandbox report says green.",
  experiment: "Take one tool your runtime exposes. Write down every path by which a byte it computes can reach anything outside its own process: return value, logs, metrics, traces, cache writes, error strings, spans, retry counters, latency. Count them. Compare the count with the one path you designed.",
  reflection: "Which of those paths did you not know existed until you wrote the list, and who added it?",
  recall: {
    q: "Name Lampson's three categories of leak path and say which one your own systems most often forget.",
    a: "Storage the program writes, legitimate channels such as the returned result and the billing or metering data, and covert channels arising from observable shared state like timing and load.\n\nThe forgotten one is almost always legitimate channels. Storage gets locked down because it is visible in review, and covert channels get dismissed as exotic, while the response body and the log line carry arbitrary attacker-chosen content by design."
  },
  deepDive: "Walk one tool in my agent runtime through Lampson's three categories and tell me which outward paths I have not accounted for."
},
{
  id: "confinement-unsolved-not-solved",
  track: "confinement", level: "classical",
  title: "Confinement is unsolved rather than solved",
  source: "Ross Anderson, Security Engineering, 3rd edition, chapters on multilevel security",
  idea: "Total isolation solves confinement and is useless, and every degree of connection you add back to make the program worth running reopens a channel, which is why fifty years of work produced mitigations and bandwidth estimates rather than a solution.",
  why: "The confined program has to be useful, which means it takes input and produces output, which means there is a channel by construction. Once a channel exists, the only remaining questions are how wide it is and whether anything on the receiving end is listening. Multilevel secure systems spent two decades on that arithmetic: identify the shared resources, estimate the bits per second, add noise or quantise the resource until the number is small enough, accept the residual.\n\nThe operational consequence is that anyone promising you a confinement solution is selling you a bandwidth reduction and rounding. Treat it as such. The right question in a design review is not whether the sandbox leaks but what the leak rate is, what a leak of that rate buys an attacker in the time they have, and what you are prepared to pay to cut it further.",
  failureMode: "A team ships an agent sandbox described internally as isolation, and the threat model stops there. Nobody costs the residual channels, so when someone demonstrates a slow exfiltration path through response content the response is disbelief rather than a pre-agreed risk decision.",
  experiment: "Note-shaped, and honest about it. Write two sentences for your sandbox: the strongest claim you can defend about what it prevents, and the widest channel you know remains open. If the second sentence is empty you have not looked.",
  reflection: "Is your team's language for the sandbox closer to prevents or to reduces, and what would it cost to change the word in the docs?",
  recall: {
    q: "Why did fifty years of confinement research not produce a general solution?",
    a: "Because total isolation is the only complete answer and it makes the program useless. Any useful program has input and output, so a channel exists by construction.\n\nWhat the field produced instead is a method: enumerate shared resources, estimate channel bandwidth, reduce it with noise or quantisation, and make an explicit risk decision about the residual."
  },
  deepDive: "Help me write the two-sentence honest claim for my agent sandbox: what it prevents, and the widest channel it leaves open."
},
{
  id: "confinement-denning-lattice",
  track: "confinement", level: "classical",
  title: "Denning's lattice turns flow rules into label arithmetic",
  source: "Dorothy Denning, A Lattice Model of Secure Information Flow, Communications of the ACM 19(5), 1976",
  idea: "If your security classes form a lattice, the legality of any flow becomes a comparison and the label of any combination becomes a join, which is what makes automated flow checking possible at all.",
  why: "Denning's model is a set of security classes, a partial order saying which class may flow to which, and a join operator giving the class of any combination of two values. The lattice requirement is not decoration. It guarantees that any set of inputs has a unique least upper bound, so a computation over many inputs has one well-defined output label rather than an ambiguous set of candidates.\n\nThat is the difference between a policy you can check by hand on a whiteboard and one a compiler or an interpreter can check on every operation. Concatenating tenant-public text with tenant-confidential text yields confidential, not a debate. The whole apparatus of taint tracking, label propagation and information flow type systems is downstream of this one algebraic move.",
  failureMode: "Labels defined as an unordered tag set with no join. Two tainted values get combined and the code picks the first tag, or the last one, or drops both. The result is a value that is confidential in fact and public by label, and the mislabelling propagates silently from there.",
  experiment: "Write your runtime's actual security classes on paper and draw the arrows: which may flow to which. Then check the two lattice properties on your drawing - is there a top, and does every pair have a unique least upper bound. If a pair does not, you have found the case your propagation code is currently guessing.",
  reflection: "Where does your drawing have two incomparable classes that code treats as interchangeable?",
  recall: {
    q: "What does the lattice requirement buy you that a plain list of security labels does not?",
    a: "A unique least upper bound for every set of labels, so the output of a computation over multiple inputs has one defined label rather than several candidates.\n\nWithout it, combination is ambiguous and every implementation invents its own tie-break, which is where under-labelling gets in."
  },
  deepDive: "Take the data classes my agent runtime handles and tell me whether they form a lattice or whether I have incomparable pairs my code is silently resolving."
},
{
  id: "confinement-static-certification",
  track: "confinement", level: "classical",
  title: "Static certification checks flows before the program runs",
  source: "Denning and Denning, Certification of Programs for Secure Information Flow, Communications of the ACM 20(7), 1977",
  idea: "Flow policy can be verified at compile time across both explicit assignments and implicit control-dependent flows, and it is the implicit ones that hand-written checks miss.",
  why: "An explicit flow is an assignment: low gets high, obviously illegal. An implicit flow is a branch on a high value that changes what a low observer sees, even though the high value is never assigned anywhere. Branch on a secret and write different public values in each arm and you have moved the secret without ever copying it. The Dennings' certification mechanism handles this by attaching a label to the program counter itself: inside a branch on a value of class C, every write must be to a class at or above C.\n\nThis is the check no reviewer performs reliably by eye, because the illegal flow has no line of code where the two values touch. It is spread across the shape of the control graph.",
  failureMode: "A guard that refuses to include a confidential field in a response, but chooses between two response templates based on whether the field is empty. No confidential byte crosses the boundary and the attacker learns the answer anyway, one bit per request.",
  experiment: "Find one place in your codebase where a branch condition reads sensitive state and both arms write to something a less-privileged caller observes: a status code, a log level, a retry, a cache hit. One example is enough. Write down how many bits per request it carries.",
  reflection: "Does your code review checklist contain anything that would have caught that, or does it only look at assignments?",
  recall: {
    q: "What is an implicit flow, and why does labelling variables alone fail to catch it?",
    a: "An implicit flow is leakage through control dependence: a branch taken on a high value changes what a low observer sees, without the high value ever being assigned to a low variable.\n\nVariable labels only constrain assignments. Catching implicit flows requires a label on the program counter, so that everything written inside a high branch is itself constrained to high."
  },
  deepDive: "Look for implicit flows in this handler: places where a branch on sensitive state changes something an unprivileged caller can observe."
},
{
  id: "confinement-noninterference",
  track: "confinement", level: "classical",
  title: "Non-interference defines leakage as observable difference",
  source: "Goguen and Meseguer, Security Policies and Security Models, IEEE Symposium on Security and Privacy, 1982",
  idea: "A system is non-interfering if varying the high inputs makes no difference to what a low observer sees, which lets you state that a leak occurred without having to name the channel it went through.",
  why: "Every earlier definition of leakage was channel-shaped: this file, that pipe, this timing signal. Goguen and Meseguer made it extensional. Run the system twice with everything low held fixed and the high inputs changed. If the low-visible traces differ, information flowed, and it does not matter through what.\n\nThat inversion is what makes testing possible. You do not need to have imagined the attacker's channel in advance to detect that one exists, and you can no longer defend a design by saying the enumerated channels are all closed. It is also why the definition is too strong to hold literally: real systems leak something, and the practical work is quantifying the difference rather than eliminating it.",
  failureMode: "The security argument is a list of closed channels. Someone finds a new one, the list grows by an entry, and the same argument is presented again next quarter. Nothing in the method could ever have found the channel, because the method only checks the channels already on the list.",
  experiment: "Pick one agent endpoint. Construct two inputs identical in everything unprivileged and differing only in one privileged field, send both, and diff everything you can observe as an unprivileged caller: body, status, headers, timing, token counts, log lines. If the diff is non-empty you have a flow. Write down how wide it is.",
  reflection: "What did the diff contain that you would not have listed as a channel beforehand?",
  recall: {
    q: "State non-interference, and say what it gives you that an enumeration of channels does not.",
    a: "Varying high inputs must produce no change in what a low observer sees. It defines leakage by observable difference rather than by mechanism.\n\nThat means you can detect a leak you never anticipated, and a defence cannot be argued from a list of closed channels alone."
  },
  deepDive: "Design a two-run differential test for one of my agent endpoints that would detect a flow from privileged input to unprivileged output."
},
{
  id: "confinement-covert-versus-side",
  track: "confinement", level: "classical",
  title: "A covert channel is built, a side channel is found",
  source: "John Wray, An Analysis of Covert Timing Channels, IEEE Symposium on Security and Privacy, 1991; Paul Kocher, Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems, CRYPTO 1996",
  idea: "A covert channel needs a cooperating sender inside the boundary deliberately modulating a shared resource, a side channel needs only a victim behaving normally, and defending one does not defend the other.",
  why: "Wray's analysis shows how slippery the internal taxonomy is: whether a given channel counts as storage or timing depends on where you place the observer's clock, so the storage-versus-timing line is a matter of viewpoint rather than physics. What survives as a real distinction is who is at the sending end. Kocher's timing attacks extract keys from an implementation that has no sender at all, only a data-dependent execution time.\n\nThe practical consequence is that the two demand different defences. Covert channels are addressed by not running attacker-controlled code inside the boundary, or by making the shared resource unmodulable. Side channels are addressed by making the victim's own behaviour independent of the secret. Constant-time comparison does nothing about a malicious insider process, and process isolation does nothing about a leaky comparison.",
  failureMode: "A threat model that says no untrusted code runs in our process, therefore no covert channels, therefore we are done. Meanwhile the retrieval layer's cache hit and miss latencies differ by an order of magnitude and tell a caller which other tenant's documents are warm.",
  experiment: "For one shared resource in your runtime - a cache, a connection pool, a rate limiter - answer two questions in writing. Could attacker-influenced code inside the boundary modulate it deliberately? And does its normal behaviour vary with data the caller should not know? The two answers have different owners.",
  reflection: "Which of your shared resources answered yes to the second question, and would anyone have looked for it?",
  recall: {
    q: "What is the distinction between a covert channel and a side channel, and why does it change the defence?",
    a: "A covert channel requires a cooperating sender inside the boundary that deliberately modulates a shared resource. A side channel requires no sender, only a victim whose observable behaviour varies with a secret.\n\nCovert channels are countered by keeping hostile code out and making resources unmodulable. Side channels are countered by making the victim's own timing and resource use independent of the secret. Neither defence covers the other case."
  },
  deepDive: "Take the caching layer in my agent runtime and separate its covert channel exposure from its side channel exposure."
},
{
  id: "confinement-channel-bandwidth",
  track: "confinement", level: "classical",
  title: "Channel bandwidth is the number that decides whether you care",
  source: "US Department of Defense, Trusted Computer System Evaluation Criteria (DoD 5200.28-STD), 1985",
  idea: "The Orange Book made covert channel analysis a quantitative exercise by asking for bits per second, which is the move that turns an unbounded worry into a risk decision someone can sign.",
  why: "The criteria required covert channel analysis at the higher assurance levels and, crucially, required the bandwidth to be estimated and documented rather than the channel merely noted. Its guidance on covert channels treats rates above roughly a hundred bits per second as high bandwidth and rates under about one bit per second as tolerable in most environments, with auditing expected for anything in between.\n\nWhatever you think of the specific figures, the reframing is the durable contribution. An enumerated channel with no rate attached generates either panic or dismissal, and both are guesses. A rate lets you multiply: bits per second times seconds of attacker access, against the size of the thing worth stealing. A one bit per second channel and a ten thousand row credential table is a very different conversation from the same channel and a single boolean.",
  failureMode: "A finding filed as potential information disclosure via response timing with no measurement. It sits at medium severity for two years because nobody can argue it up or down, and the one channel on the same page that actually carries kilobytes per second is filed identically.",
  experiment: "Take the widest channel you found in the non-interference experiment and measure it: how many distinct outcomes can an attacker distinguish per request, and how many requests per second will your rate limiter allow. Multiply. Write the bits per second on the ticket.",
  reflection: "Given that number and your rate limits, how long would extracting something that actually matters take, and is that longer than your detection window?",
  recall: {
    q: "What did quantifying covert channel bandwidth change about how the problem is managed?",
    a: "It converted an open-ended worry into an arithmetic risk decision. A rate can be multiplied by attacker access time and compared against the size of the asset.\n\nIt also creates a defensible acceptance threshold and makes rate limiting and noise injection measurable countermeasures rather than gestures."
  },
  deepDive: "Help me estimate bits per second for this channel and turn it into a risk statement with my rate limits as an input."
},
{
  id: "confinement-language-based-flow",
  track: "confinement", level: "classical",
  title: "Language based information flow puts the policy in the type system",
  source: "Sabelfeld and Myers, Language-Based Information-Flow Security, IEEE Journal on Selected Areas in Communications 21(1), 2003",
  idea: "When labels are part of the type of a value, the compiler gives you an end-to-end confidentiality argument about the whole program instead of a per-call access decision.",
  why: "Access control answers whether this caller may perform this operation now. It says nothing about where the returned bytes go afterwards. Once a value has crossed a permitted access check it is unlabelled and free, which is exactly why access-controlled systems leak: every individual check passed. A flow-typed language keeps the label attached through assignment, arithmetic, structure construction and control dependence, so the property proved is about the program's whole behaviour rather than one gate in it.\n\nThe cost is real and worth stating plainly. You need labelled types everywhere, including libraries, and the checker rejects programs that are safe but not provably so. Sabelfeld and Myers' survey is the honest map of that trade-off, and the reason most teams end up with a partial dynamic version instead.",
  failureMode: "Every access check in the request path passes, and the confidential field still ends up in a debug log that ships to a third-party aggregator. No single call was unauthorised. The path as a whole was never examined because nothing in the system represents paths.",
  experiment: "Pick one confidential field and trace it by hand from the point it enters memory to every terminal it reaches. Do not reason about it, grep for it. Count the terminals. Compare against the one destination the access check was defending.",
  reflection: "How many of those terminals were added by someone who never saw the access check?",
  recall: {
    q: "Why does an access check give you a weaker property than a flow type?",
    a: "An access check constrains a single operation at a single moment. Once the value has been handed over it carries no restriction, so a chain of individually authorised operations can move data anywhere.\n\nA flow type keeps the label attached to the value through the whole computation, so the guarantee is about every path the data can take, not about one gate."
  },
  deepDive: "Trace one confidential field through this codebase and list every terminal it can reach, so I can compare that against what the access check assumes."
},
{
  id: "confinement-dynamic-taint",
  track: "confinement", level: "modern",
  title: "Dynamic taint tracking trades soundness for coverage",
  source: "Newsome and Song, Dynamic Taint Analysis for Automatic Detection, Analysis, and Signature Generation of Exploits on Commodity Software, NDSS 2005",
  idea: "Runtime tainting finds real flows through code you did not write and cannot analyse, and it loses them at implicit flows, serialisation boundaries and any hop outside the instrumented runtime.",
  why: "Newsome and Song's contribution was showing that marking untrusted bytes at the input and propagating the mark through execution catches exploits in binaries with no source, no annotations and no cooperation from the author. That is the trade: you give up the completeness a static analysis offers and you get coverage of the ninety percent of your process that you did not write.\n\nThe losses are specific and predictable, which is what makes the technique usable if you know them. Data-dependent control flow moves information without moving a tainted byte. Serialising to JSON and back through a queue reconstitutes the value with a clean label unless you carry the label in the envelope. Anything that leaves the instrumented runtime, into a database, a cache, another service, comes back untainted. A taint system that does not document its own blind spots will be trusted as though it has none.",
  failureMode: "Tenant text is tainted at ingest and the taint survives right up to the point where the value is written to Redis and read back by the next hop. The second hop sees a clean string and passes it to a tool that takes a resource identifier.",
  experiment: "If you have taint or provenance tracking, take one tainted value and push it through every boundary in one request path: a queue, a cache write and read, a database round trip, a subprocess. Log the label at each step and find the first place it disappears. If you have no tracking, write the list of boundaries instead - that list is the design constraint for building one.",
  reflection: "Was the label lost at a boundary you own, or at one you would have to negotiate with another team to change?",
  recall: {
    q: "Name the three places dynamic taint tracking predictably loses a label.",
    a: "Implicit flows, where a branch on tainted data changes untainted output without copying a tainted byte. Serialisation, where a value written out and read back returns with a clean label unless the envelope carries it. And any hop outside the instrumented runtime, such as a database, cache or separate service.\n\nThe technique is still worth having. It is only dangerous when its blind spots are undocumented, because then coverage gaps read as clean results."
  },
  deepDive: "Map the boundaries in my request path where a taint label would be lost, and tell me which ones I can carry a label across."
},
{
  id: "confinement-declassification",
  track: "confinement", level: "classical",
  title: "Declassification is where the real policy lives",
  source: "Sabelfeld and Sands, Dimensions and Principles of Declassification, IEEE Computer Security Foundations Workshop, 2005",
  idea: "Every useful system deliberately releases some labelled data, so the policy is not the labels, it is the four questions of what is released, who may release it, where in the system, and when.",
  why: "Non-interference forbids all flow from high to low, and no shipping system satisfies it. Password checking releases one bit about a secret. Aggregate statistics release a function of confidential rows. An agent that summarises a customer's private records for that customer releases the lot, correctly. The moment you admit a declassification primitive, the security property is entirely determined by the constraints on that primitive, and Sabelfeld and Sands' four dimensions are the axes those constraints run along.\n\nMost systems fail on who and where. What gets released is usually documented. The fact that any component holding the label can perform the release, at any point, is usually not, which means an attacker who reaches any of them has reached the declassifier. Concentrating release in a small number of named points is the whole discipline.",
  failureMode: "A redaction helper importable from anywhere in the codebase. Twenty call sites, four of them in retry paths added later, one inside a code path reachable from tenant-authored text. The policy document describes what may be released and is silent on the fact that anything may release it.",
  experiment: "Grep for your declassification primitives: the redaction helpers, the toPublic and toResponse converters, the log sanitisers, the anything-to-string functions on sensitive types. Count the call sites. That number is the size of your actual trusted computing base for confidentiality.",
  reflection: "Of those call sites, how many were added by someone who knew they were writing a declassifier?",
  recall: {
    q: "What are the four dimensions of declassification, and which two do real systems usually get wrong?",
    a: "What is released, who may release it, where in the system release happens, and when it may happen.\n\nWhat is normally documented. Who and where are normally not, so any component holding the data can declassify it from anywhere, which makes every one of those call sites part of the trusted base."
  },
  deepDive: "Find every declassification point in this codebase, the places a labelled value is converted to something releasable, and tell me how many are reachable from untrusted input."
},
{
  id: "confinement-flume-os-abstractions",
  track: "confinement", level: "modern",
  title: "Flume shows information flow control working on ordinary OS abstractions",
  source: "Krohn et al., Information Flow Control for Standard OS Abstractions, SOSP 2007",
  idea: "Labels can attach to processes, pipes and files rather than to program variables, which is the version of information flow control an infrastructure team can actually operate.",
  why: "Language-level flow control demands a labelled type system and a rewrite. Flume put the labels one level down, on processes and their communication endpoints, and enforced them at the system call boundary. An unmodified program runs inside a labelled process, and the kernel monitor refuses any send whose destination label does not dominate the sender's. The application does not have to be trusted or even aware.\n\nThe part worth carrying over is the shape, not the implementation. A small trusted monitor, coarse labels on units of execution you already have, enforcement at a boundary every message must cross. For an agent runtime that maps directly: the labelled unit is the tool invocation or the sub-agent, the monitor is the orchestrator, and the enforcement point is the call it makes on the tool's behalf. You get a weaker guarantee than flow-typed code and you get it without rewriting anything.",
  failureMode: "Flow policy defined as a coding standard: handlers are expected to check labels before egress. It holds for a year, then a new service is written by a team that never read the standard, and there is no monitor to notice because enforcement lived in the convention rather than at a boundary.",
  experiment: "Identify the single chokepoint every outbound tool call in your runtime passes through. If there is exactly one, you have somewhere to put a monitor - name the file. If there is more than one, list them, because that list is the work before any flow policy can be enforced rather than merely written down.",
  reflection: "Is your enforcement point a place in the code or a paragraph in a document?",
  recall: {
    q: "What does moving information flow control from program variables to OS abstractions cost you, and what does it buy?",
    a: "It costs precision: labels sit on whole processes and channels rather than individual values, so it over-approximates and cannot see inside a process.\n\nIt buys enforcement over unmodified, untrusted programs, with a small trusted monitor at a boundary every message must cross. That is deployable by an infrastructure team without rewriting the applications."
  },
  deepDive: "Sketch a Flume-style monitor for my agent runtime: what the labelled unit is, where the enforcement point sits, and what the labels would be."
},
{
  id: "confinement-blp-biba-duals",
  track: "confinement", level: "classical",
  title: "Bell-LaPadula and Biba are mirror images and neither is your policy",
  source: "Bell and LaPadula, Secure Computer Systems: Mathematical Foundations (MITRE, 1973); Biba, Integrity Considerations for Secure Computer Systems (MITRE TR-3153, 1977)",
  idea: "Bell-LaPadula stops information flowing down and Biba stops it flowing up, they are formal duals, and both assume a static classification lattice that your product does not have.",
  why: "Bell-LaPadula protects secrecy: no read up, no write down. A process cleared at secret cannot write to an unclassified file, because that is how secrets escape. Biba inverts every arrow to protect integrity: no read down, no write up. A high-integrity process cannot read low-integrity data, because that is how corruption enters. Same lattice, arrows reversed, and the reversal is exact enough that the two models are usually presented as one result.\n\nWhat neither gives you is a policy. They assume the classification lattice already exists, is stable, and is assigned by someone outside the system. Military classification works that way. A multi-tenant metadata platform does not: labels are per-tenant, created and destroyed at runtime, and there is no clearance authority. The models are still worth knowing precisely because they name the two directions cleanly, and the naming is what lets you say which one you are actually defending on a given path.",
  failureMode: "A design review where secrecy and integrity are argued as one property called security. The strict-confidentiality argument gets made, everyone nods, and the fact that the agent reads low-integrity tenant text and then acts with high-integrity credentials is never raised, because nobody named the direction.",
  experiment: "Take three data paths in your runtime and label each with the direction that matters: confidentiality, integrity, or both. Write the label next to each. Any path you cannot classify in one word is a path where you do not yet know what you are defending.",
  reflection: "Which direction does your existing security review process actually test for, and how do you know?",
  recall: {
    q: "How are Bell-LaPadula and Biba related, and why is neither directly usable as a product policy?",
    a: "They are duals over the same lattice. Bell-LaPadula is no read up and no write down for secrecy; Biba is no read down and no write up for integrity.\n\nNeither is usable as-is because both presuppose a static classification lattice assigned by an external authority. A multi-tenant product creates and destroys labels at runtime and has no clearance authority, so the models serve as vocabulary for the two directions rather than as a deployable policy."
  },
  deepDive: "For each data path I describe, tell me whether the risk is a Bell-LaPadula direction or a Biba direction, and say where both apply."
},
{
  id: "confinement-integrity-before-secrecy",
  track: "confinement", level: "classical",
  title: "Untrusted input threatens integrity before it threatens confidentiality",
  source: "Clark and Wilson, A Comparison of Commercial and Military Computer Security Policies, IEEE Symposium on Security and Privacy, 1987",
  idea: "Commercial systems care about well-formed transactions and separation of duty rather than secrecy levels, which makes Biba-style integrity the closer classical fit for an agent that reads customer-authored text.",
  why: "Clark and Wilson's argument is that the military model answers the wrong question for commercial computing. What a bank protects is not the secrecy of a balance but the property that balances only change through certified transformations, applied by authorised people, with the changes logged and reconcilable. Their machinery is constrained data items, transformation procedures certified to preserve integrity, and a separation of duty requirement so that the person who certifies a procedure is not the person who runs it.\n\nMap that onto an agent runtime and it fits better than any confidentiality model. Tenant-authored text is unconstrained data. A tool call that mutates the catalogue is a transformation procedure. The integrity question is whether every state change went through a certified procedure with an authenticated originator, and the honest answer in most agent designs is no, because the originator of a tool call is a model whose input included the untrusted data itself.",
  failureMode: "The whole security story is data isolation between tenants, verified and audited. Nothing checks that a mutation originated from a user's intent, so a description field containing instructions causes the agent to reclassify assets within the same tenant. No confidentiality boundary was crossed and the damage is real.",
  experiment: "List every tool in your runtime that changes state. For each one, write whether a human authorised that specific change or whether the model chose it from text. Count the second category. That is your unconstrained-input-to-transformation-procedure surface.",
  reflection: "For the tools in the second category, what is the reconciliation path if one of them fires wrongly a thousand times overnight?",
  recall: {
    q: "Why is Clark and Wilson a better starting point than Bell-LaPadula for an agent that reads customer text?",
    a: "Because the exposure is integrity, not secrecy. The risk is that untrusted input causes an unauthorised state change, and the commercial model is built around well-formed transactions, certified transformation procedures, authenticated originators and separation of duty.\n\nBell-LaPadula would classify the data and permit the mutation. Clark and Wilson asks whether the change went through a certified procedure with a traceable originator, which is the question an agent design actually fails."
  },
  deepDive: "Apply Clark and Wilson to my tool set: which tools are transformation procedures, what would certifying them mean, and where does separation of duty break."
},
{
  id: "confinement-labels-past-the-model",
  track: "confinement", level: "modern",
  title: "Labels cannot survive a model call, so track them outside it",
  source: "Beurer-Kellner et al., Defeating Prompt Injections by Design (CaMeL), arXiv:2503.18813",
  idea: "Provenance attached to a value is destroyed once that value has been paraphrased by a language model, so any flow tracking has to live in the interpreter around the model rather than inside the context window.",
  why: "A label is metadata that must travel with a value through every transformation. A language model transformation does not preserve it. Text goes in with a marker saying untrusted, the model rewrites, summarises and merges it with other text, and what comes out is one undifferentiated string. Delimiters, prefixes and system-prompt instructions to treat a region as data are not label propagation, they are a request to a component with no mechanism for honouring it.\n\nThe CaMeL design's response is to stop asking. Put the control flow in ordinary code, let the model produce a plan rather than the actions, and have an interpreter outside the model carry capabilities and provenance on the values that plan operates over. The labels then live somewhere with an enforcement point, which is the Flume shape applied to an agent. The specific system will date; the structural claim will not, because it follows from what a language model does to its input rather than from how good any particular one is.",
  failureMode: "Untrusted content is wrapped in tags with an instruction never to follow instructions inside them. The model summarises a document, the summary contains the injected instruction restated as the document's own request, and the summary carries no marker at all because the tags were consumed by the same call that produced it.",
  experiment: "Take one place your prompts mark a region as untrusted. Ask what mechanism carries that mark into the model's output. If the answer is a delimiter or an instruction, you have a convention, not a label. Write down which of your downstream checks currently depend on it.",
  reflection: "Which of your controls would still work if you assumed every model output is untrusted regardless of its inputs?",
  recall: {
    q: "Why can a provenance label not be carried through a model call, and where does it have to live instead?",
    a: "Because the model rewrites and merges its input into new text with no obligation to preserve metadata. Delimiters and system-prompt instructions are conventions the model may or may not honour, not a propagation mechanism.\n\nThe label has to live in the surrounding interpreter: control flow in ordinary code, the model producing a plan rather than actions, and provenance and capabilities carried on values by a component that can actually enforce them."
  },
  deepDive: "Show me where my runtime relies on a delimiter or a prompt instruction to carry provenance, and what carrying it in the interpreter would require."
}
);

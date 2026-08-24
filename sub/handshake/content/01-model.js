/* Track: The network security model. Ordered foundational first.
 *
 * The spine of the corpus. Everything in the later tracks is a specific
 * protocol or a specific control; this track is the set of claims you need
 * before any of those mean anything. If an entry here is wrong in your head,
 * the ingress and egress tracks will read as trivia. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "model-four-part-rule",
  track: "model", level: "policy",
  title: "A network rule is a claim about four things, and three of them are usually missing",
  source: "NIST SP 800-41 Rev. 1, Guidelines on Firewalls and Firewall Policy, 2009",
  cheat: "A rule needs source, destination, protocol and port, and the direction of the connection. Any of the four left implicit is the hole.",
  idea: "A rule that does not name a source, a destination, a protocol with its port, and which end opens the connection is not a rule, it is a hope written in a policy file.",
  why: "Each of the four is a separate way for the rule to be broader than the sentence you said out loud. Source omitted means every source, and in a cloud account that includes every workload anybody spins up next quarter. Destination omitted means the rule follows the workload as it grows into things you did not have in mind when you wrote it. Protocol omitted means the port is open to whatever speaks first. And direction omitted is the one people genuinely do not notice, because a rule that says 'the app and the database may talk' is silent on which of them can start, and those two situations have completely different consequences after one of them is compromised.\n\nThe reason this stays broken is that most policy languages let you leave three of the four blank and still save. A security group with no source restriction, a network policy with an empty selector, an allow rule on a port with no protocol: all of them parse, all of them apply, none of them will be questioned in review because the diff looks small. The four-part shape is worth holding as a template precisely because the tooling will not hold it for you.",
  failureMode: "An attacker who has landed anywhere inside the same address range gets the rule for free. The rule was written for one service to reach the metadata cache, but it named only the destination and the port, so every pod in the cluster inherits it. The compromise does not need to escalate or move laterally in any interesting sense - it just makes the connection the rule already allows, from a source nobody enumerated.",
  experiment: "Open one security group, one network policy or one ACL you own. For each rule, write the four parts out as a sentence: this source, to this destination, on this protocol and port, opening in this direction. Count the rules where you had to write 'any' for something you did not intend to be any. Ten minutes, and the output is that count.",
  reflection: "Which of the four was most often missing in what you read, and is that because the intent was broad or because the syntax made narrow expensive?",
  recall: {
    q: "What are the four parts a network rule has to name, and which one is most often silently omitted?",
    a: "Source, destination, protocol with port, and the direction in which the connection is opened. All four, or the rule is broader than the sentence you would say out loud.\n\nDirection is the one that goes missing without anybody noticing, because a rule phrased as two services being allowed to talk does not say which one may initiate, and those are different systems after one of them is compromised."
  },
  deepDive: "Take a security group or network policy I paste in and rewrite every rule in the four-part form, flagging each place where I had to write any for something I did not intend to be any."
},
{
  id: "model-internal-is-not-a-property",
  track: "model", level: "policy",
  title: "Internal is not a security property, it is a routing fact",
  source: "Cheswick and Bellovin, Firewalls and Internet Security, 1994, on the crunchy shell and soft centre",
  idea: "Being on the same network as something confers no trustworthiness on it, so a design whose only argument is that the caller is internal has no argument.",
  why: "The word internal describes where packets can go, not who is sending them. It was a useful proxy for trust exactly once, in an era when getting onto the network required physical access to a building and the set of machines on it was enumerable by a person. Every element of that has since stopped being true: contractors, laptops that spend their week on other networks, third-party SaaS integrations reaching in, CI runners, and in a cluster, whatever container image somebody pulled last week.\n\nWhat makes this durable rather than a slogan is the asymmetry it creates. The perimeter is where all the review, logging and rate limiting live, and behind it is where the unauthenticated admin endpoints, the debug ports and the databases with no password live. So the value of a single foothold inside is enormous, which means an attacker's whole strategy becomes getting one, by any route at all, including a route that is not a network attack. Phishing one laptop converts into reachability of everything the soft centre contains, and the perimeter was never wrong about any packet it saw.",
  failureMode: "An attacker phishes one engineer, runs code on that laptop while it holds a VPN session, and finds that the internal package registry, the metrics backend and three admin consoles all accept requests without authentication because they were only ever reachable from inside. None of those services was exploited. They were used exactly as designed, from a position the design assumed was trustworthy.",
  experiment: "Pick one service you run that has no authentication because it is internal. Find out concretely who can reach it: not the diagram, the actual reachable set. In a cluster that is the set of namespaces with no NetworkPolicy denying them; in a VPC it is the union of the security group sources. Write down the count of distinct workloads. Ten minutes.",
  reflection: "Was the reachable set you found the one you would have guessed, and if not, was the gap in the policy or in your mental model of what the policy meant?",
  recall: {
    q: "Why is the argument that a caller is internal not a security argument?",
    a: "Because internal describes routing, not the trustworthiness of whoever is sending. It was a usable proxy for trust only while network access required physical access to a building and the machine list was enumerable.\n\nThe design also concentrates value in a single foothold: all the review and logging sits at the perimeter, and everything unauthenticated sits behind it, so an attacker's entire objective becomes getting one position inside by any route, including a non-network one."
  },
  deepDive: "Help me enumerate what actually depends on the internal assumption in an estate I describe, and rank those dependencies by what one compromised laptop would get."
},
{
  id: "model-default-deny-is-the-last-rule",
  track: "model", level: "policy",
  title: "Default deny is a property of your last rule, not a checkbox",
  source: "Marcus Ranum, The Six Dumbest Ideas in Computer Security, 2005, where default permit is number one",
  cheat: "Read the bottom of the rule list, not the top. What happens when nothing matches is your actual default, whatever the setting says.",
  idea: "Whether a policy is deny by default is decided entirely by what happens to a connection that matches no rule, so that is the line you have to read.",
  why: "Every filter is an ordered list with an implicit final entry, and that final entry is the policy. Everything above it is an exception to it. This inverts how people read a rule set: attention goes to the top, where the specific allows are, and the one line that determines the security posture of the whole thing is the one nobody scrolls to. Worse, the two defaults fail in opposite directions. Under deny, a missing rule breaks a legitimate workflow and somebody opens a ticket within the hour. Under permit, a missing rule opens a path and nothing happens at all until it is found by someone who was looking.\n\nThe version that actually bites is not the final line but the rules above it that make it unreachable. A broad allow placed early shadows every narrower rule after it, so the policy is deny by default in its configuration and permit by default in its behaviour. This is why a rule set that has grown for two years is rarely what it says: rules get appended, not inserted, and an append after a broad allow is dead text.",
  failureMode: "An attacker probes a port that no rule mentions. In a deny-by-default estate the connection is refused and, if anybody is watching, the probe is a signal. In a permit-by-default one the connection completes, and because no rule matched, no rule logged it either. The first evidence anybody has of the path is the data leaving over it.",
  experiment: "Take one rule set and answer two questions in writing. What happens to a connection that matches nothing? And is there any rule above the bottom that is broad enough to make later rules unreachable? For the second, sort your rules by breadth rather than by order and look at what sits early. Fifteen minutes.",
  reflection: "If your default turned out to be deny, was it deny because somebody chose it, or deny because the platform shipped that way and nobody has needed to change it yet?",
  recall: {
    q: "Where in a rule set is the actual default, and what makes a deny-by-default configuration behave like permit by default?",
    a: "In the implicit final entry: whatever happens to a connection matching no rule is the policy, and every rule above it is an exception. That line is at the bottom, which is where nobody reads.\n\nA broad allow placed early shadows every narrower rule below it, so the configuration says deny and the behaviour is permit. Rule sets drift this way because rules get appended rather than inserted, and an append below a broad allow is dead text."
  },
  deepDive: "Sort a rule set I paste in by breadth rather than by order, tell me which rules are shadowed and unreachable, and tell me what my effective default actually is."
},
{
  id: "model-connection-not-packet",
  track: "model", level: "wire",
  title: "The unit of policy is the connection, which is why return traffic keeps catching people out",
  source: "RFC 2979, Behavior of and Requirements for Internet Firewalls, 2000",
  cheat: "If the filter is stateless you must allow the reply explicitly, and that reply rule is a second inbound hole with a wide source range.",
  idea: "A stateful filter decides once, when the connection opens, and lets the rest of that flow through, while a stateless one judges every packet alone and therefore needs a second rule for the traffic coming back.",
  why: "This is a mechanical difference with a large security consequence. A stateful filter holds a table of established flows, so the rule you write describes an intent - this client may open a connection to that server - and the packets going the other way are permitted because they belong to a flow you already approved. A stateless filter has no such memory, so allowing a request means separately allowing everything that looks like its reply, and 'looks like its reply' can only be expressed in terms of ports and flags. That second rule is much broader than the flow it was written for.\n\nIn practice this is why the two common cloud primitives behave differently and why people misconfigure the stateless one. A security group is stateful and needs only the direction you care about. A network ACL is stateless and needs both, including a rule allowing the high ephemeral port range inbound, which is a genuinely wide hole that exists only to carry replies. Anybody who learns on the stateful primitive and then writes the stateless one either breaks the application or opens the range and stops thinking about it.",
  failureMode: "An attacker sends packets crafted to look like the return half of a connection that was never opened: the right source port range, the right flags, no matching flow. Against a stateless filter with an ephemeral-range allow, those packets are permitted into the subnet, because the rule cannot tell a reply from something merely shaped like one. Against a stateful filter they match no entry in the flow table and are dropped without a rule ever being consulted.",
  experiment: "Find one stateless filter in your estate - a network ACL, or a device rule set written by hand. Read the inbound rules and identify the one that exists purely to carry return traffic. Write down its source range and port range. That is the size of the hole you are running to make replies work. Ten minutes.",
  reflection: "Could that return rule be narrowed, or is it wide because the stateless primitive genuinely cannot express what you meant?",
  recall: {
    q: "What does a stateless filter need that a stateful one does not, and why is that requirement dangerous?",
    a: "A second rule permitting the return traffic, because it has no memory of the connection and judges every packet independently. That rule can only be written in terms of ports and flags, so it typically allows the whole ephemeral port range inbound.\n\nThat is a wide inbound hole existing solely to carry replies, and it accepts anything shaped like a reply whether or not a matching connection was ever opened. A stateful filter drops the same packets because they match no flow."
  },
  deepDive: "Explain what my network ACLs actually allow once the return-traffic rules are taken into account, and tell me whether moving that enforcement to a stateful layer would let me delete them."
},
{
  id: "model-reachability-is-transitive",
  track: "model", level: "policy",
  title: "Reachability is transitive and your architecture diagram is not",
  source: "MITRE ATT&CK, Lateral Movement (TA0008), read as a description of what reachability composes into",
  idea: "What matters is not whether A may reach C but whether there is any path from A to C through things A may reach, and no diagram drawn by a human shows that closure.",
  why: "Every rule set is a graph, and the security question is about the transitive closure of that graph, not its edges. People reason about edges because that is what the config file lists and what the diagram draws. But an attacker on A does not need an edge to C: they need a chain, and each hop only has to be a service that will forward, proxy, query or execute on their behalf. A jump host is an obvious hop. Less obvious ones are anything that takes a URL as a parameter, any queue whose consumers have wider access than its producers, any job runner, and any service with a health check that hits an arbitrary address.\n\nThe reason this is worth stating as a principle rather than a tip is that it changes what a review is for. Reviewing a single rule for whether it is justified is close to worthless, because a justified rule can complete a path. The only review that answers the real question takes a source you consider hostile and computes what it can reach in one hop, then two, then three. That is a graph query, and the good news is that it is a graph query - the cloud providers ship reachability analysers, and a mesh or CNI with policy knows its own edges.",
  failureMode: "An attacker with code execution in a low-value batch worker cannot reach the credential store, and does not need to. The worker may reach the internal reporting API for its own metrics; the reporting API accepts a datasource parameter and will connect wherever it is pointed; and the reporting service was granted read access to the credential store two years ago for a feature that no longer exists. Three legitimate edges, each defensible on its own, and the path is complete.",
  experiment: "Pick the workload in your estate you would least mind being compromised. List everything it may open a connection to. Then, for each of those, list what they may reach. Stop at two hops. If any of it reaches something on your list of things that must never be reachable from an untrusted workload, that is today's finding. Twenty minutes with the policy files, less if you have a reachability analyser.",
  reflection: "At which hop did the path stop being something you could have predicted, and what does that say about how much your diagram is worth as a security artefact?",
  recall: {
    q: "Why is reviewing a single network rule for justification close to worthless?",
    a: "Because the security property is the transitive closure of the whole rule graph, not any one edge. A perfectly justified rule can be the hop that completes a path from a hostile source to something that must never be reachable from it.\n\nThe review that answers the real question starts from a source you assume hostile and computes what it reaches in one, two and three hops. That is a graph query, and reachability analysers and policy-aware CNIs can do it."
  },
  deepDive: "Given the workloads and rules I describe, compute the two-hop reachable set from the workload I nominate as least trusted, and tell me which hop I would not have predicted."
},
{
  id: "model-ports-are-not-services",
  track: "model", level: "wire",
  title: "A port number is a convention, not a fact about what is listening",
  source: "IANA Service Name and Transport Protocol Port Number Registry, read for what it actually is",
  cheat: "Never let a rule or an alert infer the protocol from the port. Anything can listen on 443, and outbound 443 is where tunnels live.",
  idea: "Port numbers are a registry of conventions that everybody is free to ignore, so a rule or an alert that infers the protocol from the port is inferring from something an attacker chooses.",
  why: "The registry exists so clients know where to look by default. It carries no enforcement whatever: nothing prevents a process binding SSH to 443, a database to 80, or a command and control channel to whatever port your policy allows. Filtering on port therefore controls where traffic goes, which is genuinely useful, while telling you nothing about what the traffic is. Those two get conflated constantly, and the conflation is what makes port-based policy feel stronger than it is.\n\nThe asymmetry that matters is directional. Inbound, port filtering is real: closing a port means nothing outside can reach that listener, whatever it speaks. Outbound, port filtering is nearly cosmetic, because the attacker picks the port and will pick one you allow. Since practically every estate allows outbound 443, that is where exfiltration and command traffic live, wearing a TLS record layer so that the shape is right too. A control that only reads the port has nothing left to say at that point.",
  failureMode: "An attacker with a foothold needs a channel out. Outbound policy allows 443 to anywhere, because that is what applications need, and monitoring classifies traffic by port, so the channel is recorded as HTTPS. The traffic is not HTTPS to any particular thing you approved, and it does not have to be HTTPS at all. The port allowed the connection and the classification made it invisible.",
  experiment: "Take one allowed outbound port in your policy and ask what it would take to notice that something other than the expected protocol was using it. Then check whether anything you run actually inspects, or whether the port is the whole classification. Then do the same for one inbound port. Fifteen minutes, and the honest output is usually two words: nothing does.",
  reflection: "Where in your stack does a port number get treated as a protocol identity, and is that in a rule, in a dashboard, or in a detection?",
  recall: {
    q: "What does a port-based rule actually control, and why is it much weaker outbound than inbound?",
    a: "It controls where traffic may go, and says nothing about what the traffic is, because the registry is a convention with no enforcement and anything can bind to any port.\n\nInbound it is real: a closed port cannot be reached whatever the listener speaks. Outbound the attacker chooses the port and will choose one you allow, which in practice is 443, so port-based outbound control and port-based classification both have nothing to say about the channel."
  },
  deepDive: "Look at how my monitoring classifies traffic and tell me every place a port number is standing in for a protocol identity, ordered by what an attacker gains from the substitution."
},
{
  id: "model-layer-decides-vocabulary",
  track: "model", level: "wire",
  title: "The layer you filter at decides what your rules are able to say",
  source: "Saltzer, Reed and Clark, End-to-End Arguments in System Design, ACM TOCS, 1984",
  cheat: "Write the rule as a sentence first. If it names a path, a method or a host header, no layer 3 or 4 control can enforce it and you are at the wrong layer.",
  idea: "A control can only enforce distinctions it can see, so the useful question about any network control is not how strong it is but what vocabulary it has.",
  why: "A filter at layer three sees addresses. At layer four it also sees ports and flags. At layer seven, if and only if it can read the payload, it sees methods, paths, headers and hostnames. This means a rule such as 'the reporting service may call the metadata API but only to read' is simply not expressible below layer seven: there is no packet field for read. Conversely a rule such as 'nothing in this subnet may open a connection to the internet' is expressible at layer three and gets weaker, not stronger, if you try to enforce it in an application.\n\nThe consequence people miss is what encryption does to this. Once traffic is encrypted end to end, every intermediate control loses its layer seven vocabulary and falls back to addresses, ports and whatever is left in the clear. That is not a defect, it is the end-to-end argument working as intended, and it is why enforcing an application-level rule in the middle of the network requires terminating the encryption there, which moves that box inside your trust boundary. So the layer question and the trust question are the same question, and choosing a layer seven control in the path is a decision to trust another component with plaintext.",
  failureMode: "A team writes a policy stating that a service may only read from a shared API, and implements it as a network rule to the API's address on 443. An attacker with a foothold in that service issues writes and deletes. Every packet complies with the rule, because the rule was written in a vocabulary that has no word for the distinction the team cared about.",
  experiment: "Take three rules you believe you enforce and write each as a plain sentence. Then mark, for each, the lowest layer that can see the distinction the sentence makes. Any rule whose sentence needs layer seven, enforced by a layer four control, is today's finding. Ten minutes.",
  reflection: "For the rules that need layer seven, where is the enforcement going to live, and what does putting it there add to your trust boundary?",
  recall: {
    q: "What determines whether a network control can enforce a given rule, and what does end-to-end encryption do to that?",
    a: "The vocabulary of the layer it operates at. Layer three sees addresses, layer four adds ports and flags, layer seven adds methods, paths and headers but only if it can read the payload. A rule needing a word the layer does not have cannot be enforced there at any strength.\n\nEnd-to-end encryption removes the layer seven vocabulary from every box in the middle, which is the end-to-end argument working. Getting it back means terminating encryption at that box, which puts the box inside your trust boundary."
  },
  deepDive: "For each rule I describe, tell me the lowest layer that can express it, and where terminating TLS to enforce it would move my trust boundary."
},
{
  id: "model-nat-is-not-a-firewall",
  track: "model", level: "wire",
  title: "NAT is not a firewall, and the protection people credit it with is a side effect of address exhaustion",
  source: "RFC 4864, Local Network Protection for IPv6, 2007, which was written largely to make this argument",
  idea: "Address translation blocks unsolicited inbound connections only because it has nowhere to send them, which is an accident of running out of addresses rather than a security policy.",
  why: "A translator holds a table mapping outbound flows to external port numbers. An inbound packet with no matching entry has no destination to be rewritten to, so it is dropped. That produces the same visible result as a default-deny inbound rule, which is why a generation of engineers learned to treat translation as protection. But nothing about it was designed as a control: there is no policy to review, no logging worth the name, and the behaviour changes with protocol and vendor rather than with your intent.\n\nWhere the distinction becomes concrete is everything that punches through the table legitimately. Any protocol designed to work through translation - UPnP, NAT-PMP, hole punching, and helper modules that inspect payloads to open ports on the fly - exists precisely to create inbound mappings on demand, from inside, without asking you. And it says nothing at all about outbound, which is the direction that matters for exfiltration and command traffic. Then IPv6 arrives with enough addresses that translation is unnecessary, the accidental default-deny disappears, and any estate that had been relying on it now has global reachability it never chose.",
  failureMode: "An attacker with code running on any device behind the translator uses a hole-punching protocol, or simply keeps an outbound connection open, and has a working inbound path. Nothing was bypassed. The translator did exactly what it was built to do, which is make inside-initiated flows work, and the security property people believed in was never a rule anybody wrote.",
  experiment: "Find one place in your estate where the reason nothing gets in is translation rather than a rule. Then check whether an explicit inbound deny rule also exists. Then check whether IPv6 is enabled on that path, because if it is, the translation is not in it. Fifteen minutes.",
  reflection: "How much of what you believe about inbound reachability rests on a rule you could point at, and how much on a topology that happens to work out?",
  recall: {
    q: "Why does address translation appear to block inbound connections, and what makes that different from a firewall rule?",
    a: "Because an inbound packet with no entry in the translation table has no internal destination to be rewritten to, so it is dropped. The result resembles default-deny inbound but is a consequence of address scarcity, not a policy.\n\nThere is no rule to review, little useful logging, behaviour varies by protocol and vendor, protocols like UPnP and hole punching create inbound mappings from inside on demand, it constrains outbound not at all, and it vanishes entirely once IPv6 removes the need to translate."
  },
  deepDive: "Help me find the places in an estate I describe where inbound protection is a side effect of translation rather than a rule, and what enabling IPv6 on those paths would expose."
},
{
  id: "model-zero-trust-is-about-where",
  track: "model", level: "policy",
  title: "Zero trust is a claim about where the check happens, not about trusting nothing",
  source: "NIST SP 800-207, Zero Trust Architecture, 2020",
  idea: "The model moves the authorisation decision from the network perimeter to each individual request, which relocates trust onto identity and device posture rather than abolishing it.",
  why: "The name is unfortunate and causes two opposite errors. One is reading it as a product you buy. The other is reading it literally, as though nothing is trusted, which is incoherent - the policy engine that makes the decision is trusted absolutely, as is whatever attests the identity and the device. What actually changes is the location and the granularity of the check: instead of one decision at a boundary that then covers everything behind it, there is a decision per request, made against current information about who is asking and from what.\n\nThat relocation is what buys the property people want, which is that a foothold on the network is worth much less. It also relocates the failure modes, and this is the part the marketing skips. The policy engine becomes a single point of compromise and a single point of outage. Identity becomes the thing worth attacking, so token theft and session replay move from annoyance to primary threat. Every service now depends on the decision path being fast and available, which pushes people toward caching decisions, and a cached decision is the perimeter model in miniature with a shorter fuse. The honest description is a trade of blast radius for a new critical dependency, not the removal of trust.",
  failureMode: "An attacker who steals a valid session token from a developer laptop is in a strictly better position than the same attacker inside a perimeter network, because the token is accepted by every service in the estate rather than by whatever happened to be in one subnet. The architecture did what it promised and made network position worthless; it also made identity the entire game, and identity was protected by a bearer token in a file.",
  experiment: "Pick one internal request path in your estate. Write down what is checked at each hop and when the check was made. Any hop whose answer is 'nothing, the caller is inside' is perimeter. Any hop whose answer is 'a decision made earlier and cached' needs a number: how long. Fifteen minutes.",
  reflection: "Which of the two failure modes you have moved toward is worse for you: the perimeter's large blast radius, or the policy engine as a single point of compromise?",
  recall: {
    q: "What does zero trust actually change, and what does it not remove?",
    a: "It moves the authorisation decision from one check at a network boundary to a check per request, made against current identity and device information. Network position stops conferring access.\n\nIt does not remove trust. The policy engine and the identity provider are trusted absolutely, which makes them single points of compromise and of outage, and it promotes token theft and replay to the primary threat. Caching decisions for availability rebuilds the perimeter model at a smaller scale."
  },
  deepDive: "Walk one request path in my estate and tell me, hop by hop, whether the check is per request, cached, or absent, and what the worst-case staleness is."
},
{
  id: "model-every-reader-is-in-scope",
  track: "model", level: "wire",
  title: "Every hop that can read the payload is inside your trust boundary, whether or not you drew it there",
  source: "RFC 7258, Pervasive Monitoring Is an Attack, 2014, read for its threat model rather than its politics",
  idea: "The boundary around your data is defined by the set of components that hold it in plaintext, and terminating encryption anywhere adds that component to the set.",
  why: "People draw trust boundaries around things they administer and reason about encryption as an on-off property of a link. The useful frame is the other way round: list every component that sees plaintext, and that list is the boundary, regardless of the diagram. Terminating TLS at a load balancer to inspect or route puts the balancer in. A sidecar that terminates for the workload puts the sidecar and its configuration in. An inspecting proxy that holds a private certificate authority so it can read employee traffic puts that proxy in, and it is now the highest-value target on the network because it sees everything in the clear.\n\nThe practical consequence is about who can compromise what, and it usually crosses an organisational line. A managed load balancer in plaintext mode means the provider's control plane and whoever can change that configuration are in your boundary for that data. Re-encrypting to the backend does not remove the balancer from the set, because it read the plaintext to do it. And this is exactly why the layer question and the trust question keep turning out to be one question: every application-layer control you place in the path is a component you have chosen to hand plaintext to, in exchange for a rule you could not otherwise express.",
  failureMode: "An attacker compromises the ingress controller, which is not where anybody was looking because it holds no data of its own. It terminates TLS for every service behind it, so it sees every request body and every bearer token in the clear, and it can be reconfigured to send a copy elsewhere without touching any application. The databases were encrypted at rest and in transit, and none of that was relevant.",
  experiment: "Trace one request from client to database and list every component that holds the payload in plaintext. Include load balancers, ingress controllers, sidecars, any inspecting proxy, and any managed service doing the termination. That list is your real trust boundary for that data. Twenty minutes, and the number is usually larger than people expect.",
  reflection: "Which component on that list would you have said was outside the boundary before you traced it, and who is able to change its configuration?",
  recall: {
    q: "What actually defines the trust boundary around a payload?",
    a: "The set of components that hold it in plaintext. Not the diagram, and not which parts you administer.\n\nEvery TLS termination point joins that set: load balancers, ingress controllers, sidecars, inspecting proxies. Re-encrypting to the backend does not remove a component from the set, because it read the plaintext in order to do it, and a managed terminator brings the provider's control plane in with it."
  },
  deepDive: "Trace a request path I describe and list every component that sees plaintext, then rank them by what an attacker who compromised that one component would obtain."
},
{
  id: "model-unenumerable-allowlist",
  track: "model", level: "policy",
  title: "An allowlist you cannot enumerate is a denylist wearing better clothes",
  source: "NIST SP 800-41 Rev. 1, on policy specificity, read against how cloud endpoints are actually published",
  cheat: "An allowlist entry that resolves to a shared host or a wildcard domain allows every tenant on it. Count what you admitted, not what you named.",
  idea: "An allowlist is only as strong as the precision of its entries, and an entry that names a wildcard domain, a shared host or a provider's whole address range admits everything behind it.",
  why: "The security value of an allowlist comes from the set being small and known. That property is destroyed by entries you cannot enumerate, and modern infrastructure is full of them. A wildcard for a storage provider admits every bucket any customer of that provider owns, including the attacker's. A CDN hostname resolves to shared infrastructure fronting everybody. A provider's published address range is enormous and rotates. In each case you have written down an intent and admitted a set several orders of magnitude larger.\n\nWhat makes this specifically dangerous rather than merely sloppy is that it converts an exfiltration control into a naming exercise. The attacker does not need to defeat your egress policy; they need to place their endpoint inside a set you have already allowed, and every multi-tenant cloud service is such a set, available in minutes with a credit card. That is why egress allowlists that look strong on paper stop mattering in practice, and why the honest measurement of one is not how many entries it has but how large the union of what those entries resolve to actually is.",
  failureMode: "An attacker exfiltrates to a storage bucket they created inside the same provider your allowlist already permits by wildcard. No rule is violated, nothing is bypassed, and the destination is indistinguishable at the network layer from the legitimate traffic the entry was written for. The control worked exactly as configured and provided nothing.",
  experiment: "Take one egress allowlist. For each entry, work out what it actually admits: resolve the hostnames, expand any wildcard into the set it covers, and note where an entry points at multi-tenant infrastructure anyone can join. Mark each entry enumerable or not. Twenty minutes, and the finding is the ratio.",
  reflection: "For the entries that were not enumerable, is there a narrower way to express the same need, or is this a case where the control has to move to a layer that can see more than the destination?",
  recall: {
    q: "What destroys the value of an allowlist, and why does that make egress allowlists weak in practice?",
    a: "Entries you cannot enumerate. A wildcard domain, a CDN hostname or a provider address range admits everything behind it, which is often several orders of magnitude more than the intent.\n\nIt reduces exfiltration to a naming exercise: the attacker places their endpoint inside a set you already allow, and any multi-tenant cloud service is such a set, obtainable in minutes. The honest measure of an allowlist is the size of the union its entries resolve to, not the number of entries."
  },
  deepDive: "Take an egress allowlist I paste in, expand every entry into what it actually admits, and tell me which entries make the control meaningless."
},
{
  id: "model-blast-radius-is-reachability",
  track: "model", level: "policy",
  title: "Blast radius is measured in reachable services, not in compromised hosts",
  source: "CNCF Cloud Native Security Whitepaper, on segmentation and lateral movement",
  idea: "The cost of a compromise is determined by what the compromised thing can reach, so the number worth tracking is a reachable set rather than a count of affected machines.",
  why: "Incident severity gets described in units of hosts because hosts are countable and appear in inventories. It is the wrong unit. One compromised container that can open connections to three internal services is a smaller event than one compromised container that can reach the whole cluster, and a report saying one host was affected does not distinguish them. Reachability is the unit that predicts what happens next, because lateral movement is exactly the act of spending reachability.\n\nStating it this way also makes segmentation measurable, which is the only way it improves. Segmentation projects usually get justified in the abstract and then evaluated on whether the rules got written. The useful evaluation is the reachable set from a nominated hostile starting point, measured before and after. That gives you a number that goes down, tells you when you have reached diminishing returns, and survives the argument about whether a given rule was worth its operational cost - because the rule either shrank the set or it did not.",
  failureMode: "An attacker compromises a low-privilege image-processing worker. The incident is initially scoped as one container, quickly contained, and closed. What is not measured is that the worker's namespace had no egress policy, so from there the attacker could reach the internal admin API, the metrics store and every other namespace. Nothing else was touched this time, which is a fact about the attacker's goals rather than about the containment.",
  experiment: "Nominate one workload as the hostile starting point. Count the distinct services it can currently open a connection to. Write the number down and date it. That is your baseline, and it is the only segmentation metric that is not self-congratulatory. Fifteen minutes.",
  reflection: "Is that number one you would report to a customer as your containment story, and which single rule would shrink it most?",
  recall: {
    q: "Why is a count of compromised hosts the wrong unit for blast radius?",
    a: "Because it does not distinguish a compromised workload that can reach three services from one that can reach the entire cluster, and it is reachability that determines what happens next. Lateral movement is the act of spending reachability.\n\nMeasuring the reachable set from a nominated hostile start point also makes segmentation evaluable: the number goes down or it does not, which settles arguments about whether a rule was worth its operational cost."
  },
  deepDive: "Given the workloads and policies I describe, compute the reachable set from the one I nominate as hostile and tell me the single rule change that would shrink it most."
},
{
  id: "model-inbound-fear-outbound-cost",
  track: "model", level: "policy",
  title: "Inbound is what everybody guards and outbound is what the incident is actually about",
  source: "RFC 2827 and BCP 38, Network Ingress Filtering, 2000, read for the direction it does not cover",
  idea: "Inbound filtering decides whether an attacker gets in and outbound filtering decides what it costs you once they have, and almost every estate has a considered policy for the first and a permissive default for the second.",
  why: "The asymmetry is historical and understandable. Inbound is where attacks arrive, it is where the perimeter was, and it is the direction every product and every audit asks about. Outbound is where the applications live: they need package registries, provider APIs, webhooks, telemetry endpoints, and any restriction there breaks something during business hours. So inbound gets a reviewed rule set and outbound gets allow all, or an allowlist that grew by ticket until it stopped meaning anything.\n\nBut the events that get written up as breaches are almost entirely outbound events. Data leaving, command and control traffic, a compromised build reaching for a payload, a server-side request coaxed into fetching an internal address. Each of those requires an outbound connection to complete, which means outbound is the last point where an in-progress compromise can be stopped and often the only point where it is visible. That is what makes it worth the operational pain: inbound controls reduce the probability of an incident, outbound controls reduce its cost, and cost is the term you cannot buy down after the fact.",
  failureMode: "An attacker who has achieved code execution needs to get data out and instructions in. Inbound policy is irrelevant to both, because the connections originate inside. Outbound policy allows anything on 443, so the channel establishes on the first attempt and looks like every other TLS connection the workload makes. Every control that was reviewed was pointed at the direction the attacker did not use.",
  experiment: "Write down your inbound policy for one workload, then its outbound policy, and compare the two for how much thought each shows. Then ask the question that matters: if this workload were compromised right now, which outbound destination would stop it. Ten minutes, and the answer is usually none.",
  reflection: "What would actually have to be true operationally for you to run a default-deny egress policy on one workload, and is that a technical obstacle or an ownership one?",
  recall: {
    q: "What is the division of labour between inbound and outbound filtering?",
    a: "Inbound reduces the probability of a compromise. Outbound reduces its cost, because data exfiltration, command and control, payload retrieval and coerced server-side requests all need an outbound connection to complete.\n\nOutbound is therefore the last place an in-progress compromise can be stopped and often the only place it is visible, and it is the direction that almost always has a permissive default because restricting it breaks applications during business hours."
  },
  deepDive: "Help me design a default-deny egress policy for one workload I describe, starting from what it genuinely needs to reach and naming who would have to own the exceptions."
},
{
  id: "model-shadowed-rules",
  track: "model", level: "ops",
  title: "A rule that never matches is either dead or your counters are, and you cannot tell which without looking",
  source: "NIST SP 800-41 Rev. 1, on firewall policy review and rule set maintenance",
  cheat: "Sort rules by hit count. Zero-hit rules are dead, shadowed, or the only thing standing between you and an attack you have not had yet.",
  idea: "Every rule set accumulates rules that no longer match anything, and the only way to tell a dead rule from a shadowed one from a rule that is genuinely waiting is to read the hit counters.",
  why: "Rule sets grow by append and never shrink, because deleting a rule is a change that could break production and keeping it costs nothing visible. After two years you have three kinds of rule that look identical in the config: rules for systems that no longer exist, rules made unreachable by a broader rule above them, and rules that correctly match nothing because the traffic they permit is rare or the traffic they deny has not been attempted. The first kind is clutter that makes review harder. The second is a silent misconfiguration, because somebody believes that rule is enforcing something. The third is doing its job.\n\nHit counters separate them, which is why they are the most underused security telemetry in most estates. A zero-hit allow rule is either dead or shadowed, and either way it should be understood before the next review pretends to have read it. A zero-hit deny rule at the bottom is different: it may be the most important line in the file, and its counter going from zero to non-zero is one of the highest-signal alerts you can have, because something just tried to do a thing you decided was not allowed.",
  failureMode: "An attacker makes a connection that a specific deny rule was written to block, and it succeeds, because a broad allow added eighteen months ago sits above it. Nobody noticed, because a shadowed rule and a rule that has nothing to block look exactly the same in the config file and produce exactly the same log output, which is none.",
  experiment: "Pull hit counts for one rule set and sort ascending. Take the zero-hit rules and put each in one of three buckets: dead, shadowed, or waiting. You will need the rule order to identify shadowed ones. Twenty minutes, and the deliverable is a list of deletions plus at least one alert you should have on a deny counter.",
  reflection: "Which zero-hit rule did you assume was protecting you and turned out to be unreachable, and how long had it been that way?",
  recall: {
    q: "What are the three reasons a rule can have zero hits, and why does the distinction matter?",
    a: "It is dead, meaning the system it was written for is gone; it is shadowed by a broader rule above it; or it is correctly waiting for traffic that is rare or for an attack nobody has attempted.\n\nThey are indistinguishable in the config and all produce no log output. A shadowed rule is a silent misconfiguration somebody still believes in, while a zero-hit deny rule at the bottom may be the most important line in the file, and its counter leaving zero is very high signal."
  },
  deepDive: "Given a rule set and its hit counts, sort the zero-hit rules into dead, shadowed and waiting, and tell me which deny counters I should be alerting on."
},
{
  id: "model-firewall-change-is-a-code-change",
  track: "model", level: "ops",
  title: "A rule change is a code change, and the break-glass one is still in there",
  source: "NIST SP 800-41 Rev. 1, on change management for firewall policy",
  cheat: "Diff running rules against the declared ones. Every drift is an undocumented change, and the wide one was almost certainly opened during an incident.",
  idea: "Network policy is production configuration with a large blast radius and no test suite, so its real security depends on change control and drift detection rather than on the rules themselves being good.",
  why: "A rule set can be excellent when written and wrong six months later without anybody making a decision, because the ways it changes are not the ways code changes. There is a declared version in the repository and a running version in the platform, and they diverge through console edits, provider defaults applied on resource creation, controllers that add rules on your behalf, and above all incidents. During an incident somebody widens a rule to restore service, which is the correct call, and the narrowing is a follow-up ticket that competes with feature work and loses.\n\nSo the control that matters is not the review of the diff, which teams generally do, but the detection of the changes that never had a diff. That is a comparison between declared and running state, run continuously, with the difference treated as a finding rather than as noise to be reconciled at leisure. It is also the only mechanism that reliably catches the incident-widened rule, because that rule is invisible in every artefact except the running configuration, and the person who opened it is the only one who knows it is still there.",
  failureMode: "An attacker finds a management port reachable from a wide source range because it was opened at two in the morning during an outage nine months ago and never closed. There is no ticket, the repository shows the narrow rule, the architecture diagram shows the narrow rule, and every review since has read the declared state and concluded it was fine.",
  experiment: "Pick one environment and diff running network rules against the declared ones. Every difference is an undocumented change. For each, find out when and why, and be specific about which were opened during an incident. Twenty minutes if you have the tooling, and if you do not, that absence is the finding.",
  reflection: "Of the drift you found, how much came from incidents and how much from platform defaults, and which of those two do you have any mechanism against?",
  recall: {
    q: "Why is reviewing rule diffs insufficient, and what catches what review misses?",
    a: "Because the dangerous changes never appear in a diff: console edits, provider defaults on resource creation, controllers adding rules, and above all rules widened during incidents to restore service and never narrowed again.\n\nWhat catches them is continuous comparison of declared against running state, with any difference treated as a finding. The incident-widened rule exists in no artefact except the running configuration, so nothing else will find it."
  },
  deepDive: "Help me set up a declared-versus-running comparison for network policy in the platform I describe, and tell me what to do with the drift I will find on the first run."
},
{
  id: "model-untested-policy-is-a-document",
  track: "model", level: "ops",
  title: "You do not have a network policy until something has tried to violate it and failed",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013, on validating rather than assuming",
  cheat: "For each rule that matters, run the connection it forbids and confirm the refusal. An unattempted rule is a claim, not a control.",
  idea: "A rule you have never attempted to break is an assertion about your configuration, and the only thing that converts it into a control is a connection that was refused and recorded.",
  why: "Between writing a rule and it being enforced there are many places for it to be silently untrue: it applies to a label nothing carries, it is shadowed, the controller that should enforce it is not installed in that namespace, the policy engine is failing open, or the traffic takes a path that never passes the enforcement point. None of these is visible in the configuration, which will look correct in every case. The only test that distinguishes a written rule from an enforced one is making the connection and observing the refusal.\n\nThe second half is the recording. A refusal nobody can see gives you enforcement without detection, which means the first probe and the thousandth look the same from your side, and an attacker gets to map your policy for free. So the test has two assertions, not one: the connection failed, and something logged that it was attempted. Doing this on a schedule turns a set of rules into a set of tested rules, which is also the only version that survives a platform upgrade, because upgrades change enforcement behaviour and nothing else will tell you.",
  failureMode: "An attacker in a namespace moves to a service that a NetworkPolicy explicitly forbids, and it works, because the cluster's CNI does not implement policy enforcement. The policy object exists, it is syntactically valid, it appears in every audit, and it has never done anything at all. Nobody tried the connection.",
  experiment: "Pick the three network rules whose failure would matter most. For each, make the connection from the source it forbids and confirm the refusal. Then check whether the refusal appears anywhere you could find it during an incident. Thirty minutes, and treat any rule you cannot test from a real source as a rule you cannot claim.",
  reflection: "Which of the three surprised you, and was the surprise about the rule not being enforced or about the refusal not being visible?",
  recall: {
    q: "What converts a written network rule into an enforced control, and why is refusal alone not enough?",
    a: "A connection attempted from the source it forbids and observed to be refused. Configuration cannot distinguish an enforced rule from one that matches nothing, is shadowed, is in a namespace with no enforcing controller, or sits off the traffic path.\n\nRefusal alone leaves you with enforcement and no detection, so the first probe and the thousandth look identical and an attacker maps your policy for free. The test asserts both the refusal and a record of the attempt."
  },
  deepDive: "Help me write a repeatable test plan that attempts to violate the network rules I care about most, asserting both refusal and a visible record of the attempt."
}
);

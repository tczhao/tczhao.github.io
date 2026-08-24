/* Track: Naming. Ordered foundational first.
 *
 * Resolution is the dependency nobody puts on the architecture diagram and
 * nobody reviews, and it sits underneath every other control in this corpus.
 * A hostname allowlist, a certificate check and a service call all resolve a
 * name first, and whoever answers that question decides where they go. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "naming-resolution-is-a-trust-dependency",
  track: "naming", level: "wire",
  title: "Resolution is a trust dependency underneath every other control you have",
  source: "RFC 1035, Domain Names: Implementation and Specification, 1987",
  cheat: "Whoever answers your resolution queries chooses where your traffic goes. Treat the resolver as a component in the trust boundary.",
  idea: "Almost every connection begins by asking a third party where to go, and the answer determines the destination, which makes the resolver as trusted as anything else in the path.",
  why: "Names exist so that addresses can change without every configuration changing, and the cost of that indirection is a lookup answered by something else. The component answering it decides the destination of the connection, which puts it in the same category as a router or a proxy, and unlike those it usually appears nowhere in a security review. That the answer is normally correct is not a property of the protocol, which was designed without authentication, but of the fact that nobody has interfered.\n\nWhat makes this the right first entry in the track is the ordering. A hostname-based egress allowlist resolves the name. A certificate check compares against a name that was resolved to reach the host. A service-to-service call resolves a service name. Each of those controls is downstream of an answer somebody else gave, so an attacker who can influence the answer operates before the control rather than against it. That is why resolution belongs in the threat model as a component: not because poisoning a public resolver is easy, but because there are usually several resolvers in the path, some of them yours, some of them a platform's, and no one has drawn the picture.",
  failureMode: "An attacker who can influence resolution for one name, whether by compromising a resolver, winning a race with a forged response, or simply controlling a record they should not, redirects a connection to infrastructure they hold. Every control downstream then operates on the attacker's endpoint, and each one reports success, because none of them was asking the question that was subverted.",
  experiment: "For one workload, trace the resolution path: which resolver does it use, what does that forward to, and how many components are in the chain before an authoritative answer. Then ask who administers each. Twenty minutes, and most people find one hop they did not know about.",
  reflection: "Does resolution appear anywhere in your threat model, and if not, is that because it is trusted or because nobody thought of it?",
  recall: {
    q: "Why is the resolver a trust dependency rather than infrastructure?",
    a: "Because it decides the destination of the connection, which puts it in the same category as a router or proxy, and the protocol was designed without authentication, so correct answers are a fact about nobody interfering rather than a property of the system.\n\nIt matters because it is upstream of everything else: hostname allowlists, certificate name checks and service calls all act on an answer somebody else gave, so influencing the answer operates before those controls rather than against them."
  },
  deepDive: "Trace the full resolution path for a workload I describe, naming every component in the chain and who administers each."
},
{
  id: "naming-answer-depends-on-who-asks",
  track: "naming", level: "wire",
  title: "The same name resolves differently depending on who asks and from where",
  source: "RFC 8499, DNS Terminology, 2022, on views and split-horizon configurations",
  idea: "There is no single correct answer for a name, because resolution depends on which resolver was asked, from which network, at which moment, so testing from one position tells you about that position only.",
  why: "Several mechanisms produce this and they compose. Split-horizon configurations deliberately return internal addresses to internal resolvers and public ones to everybody else. Cloud environments intercept certain names and answer them from the platform. Container platforms inject their own resolver with search domains and cluster-local names. Geographic and latency-based routing returns different answers by location. Caching means the answer you get is the one that was true when the cache filled.\n\nThe practical consequence is a testing discipline rather than a defence. If you verify that a name resolves to something safe, you have verified it for the resolver you used, from the network you were on, at that moment. A validation running in production resolves differently from your laptop, and a workload in a cluster resolves differently from a virtual machine in the same account. This is also why the previous track's advice to resolve once and connect to the address matters so much: it collapses all this variability into a single observation you can act on, rather than leaving two lookups that may land in different views.",
  failureMode: "An attacker exploits a validation that was tested from a developer machine, where an internal name does not resolve at all, and therefore appeared safe to permit. In production the same name resolves through the platform resolver to an internal address, and the validation that was proven harmless in testing permits a connection to an internal service.",
  experiment: "Take one internal hostname and resolve it from three positions: your laptop, a virtual machine in the account, and inside a container in the cluster. Compare the answers. Fifteen minutes, and if they differ, note which position your validation logic runs in.",
  reflection: "Which position do your security tests run from, and is it the same one your production code resolves from?",
  recall: {
    q: "Why is there no single correct answer for a name, and what does that mean for testing?",
    a: "Because the answer depends on which resolver was asked, from which network, at which moment: split-horizon views, cloud platform interception, container resolvers with search domains, geographic routing and caching all produce different answers.\n\nSo verifying that a name resolves safely proves it only for that resolver, network and moment. Validation running in production resolves differently from a laptop, which is why resolving once and connecting to the resolved address matters."
  },
  deepDive: "Compare how a hostname resolves from the different positions in an estate I describe and tell me which position my validation code occupies."
},
{
  id: "naming-ttl-is-revocation-latency",
  track: "naming", level: "ops",
  title: "Cache lifetime is your revocation latency for names",
  source: "RFC 1035, on the time-to-live field",
  cheat: "Sum every cache in the resolution path to get the real time for a name change to take effect. The record value is a lower bound.",
  idea: "Changing where a name points does not change where traffic goes until every cache in the path has expired its copy, and that total is longer than the value on the record.",
  why: "The lifetime on a record is an instruction to caches, and instructions are followed with variation. Recursive resolvers respect it approximately, some impose their own minimums, operating systems cache separately, language runtimes cache independently and sometimes without any expiry at all, connection pools hold addresses resolved earlier, and long-lived processes may have resolved a name once at startup. The effective time for a change to take effect is the maximum across that chain, not the number you set.\n\nThis matters at the moment you most need it to be short, which is when you are moving traffic away from something. Cutting over from a compromised endpoint, withdrawing a name during an incident, or repointing after a takeover all depend on caches letting go. A common surprise is a runtime that caches indefinitely, so a long-running process keeps using an address for its entire lifetime regardless of the record, which turns a name change into a rolling restart. Knowing that in advance is the difference between a fifteen-minute containment and discovering mid-incident that your only lever is redeploying everything.",
  failureMode: "An attacker retains traffic after you have repointed a name away from infrastructure they control, because a long-running process resolved the name at startup and caches indefinitely. The record is correct, the change was made promptly, and the traffic continues to arrive at the attacker for as long as those processes run.",
  experiment: "Pick one internal name and add up every cache in the path: record lifetime, resolver behaviour, operating system cache, runtime cache, connection pool. Then check whether your primary language runtime caches resolutions indefinitely by default. Twenty minutes.",
  reflection: "If you had to move traffic off an endpoint in the next ten minutes, would changing the name do it, and what would you do instead?",
  recall: {
    q: "Why is the record lifetime a lower bound on how long a name change takes to take effect?",
    a: "Because the effective time is the maximum across every cache in the chain: recursive resolvers that approximate or impose minimums, operating system caches, runtime caches that sometimes never expire, connection pools holding earlier resolutions, and processes that resolved once at startup.\n\nIt matters when moving traffic away from something during an incident. A runtime caching indefinitely turns a name change into a rolling restart, which is worth knowing before rather than during."
  },
  deepDive: "Calculate the real propagation time for a name change in the estate I describe, and tell me whether my runtimes cache resolutions indefinitely."
},
{
  id: "naming-dangling-record-takeover",
  track: "naming", level: "ops",
  title: "A record pointing at something you no longer own is a subdomain somebody else can claim",
  source: "RFC 1035, on delegation, read against how cloud resources are deprovisioned",
  cheat: "Audit every record that points at a provider hostname. If the resource behind it is gone, delete the record before somebody claims the name.",
  idea: "When a record points at a provider resource that has been deleted, whoever next obtains that resource name controls a hostname in your domain.",
  why: "The mechanism is simple and the consequences are large. You point a name at a provider-assigned hostname for a storage bucket, an application platform, a content delivery endpoint or a load balancer. Later the resource is deleted and the record is not, because deleting the resource is done by whoever is decommissioning the service and deleting the record is done by whoever manages the zone, and those are different people with different tickets. The provider's namespace then makes that resource name available again, and anybody who claims it is serving content on your hostname.\n\nWhat makes this more serious than a defacement is everything else in this corpus that trusts a hostname. A subdomain in your domain is inside your cookie scope, may be inside your same-site cookie boundary, may be a permitted origin in a cross-origin configuration, may be on an internal allowlist, and can obtain a valid publicly trusted certificate for that name because the claimant genuinely controls it. So a stale record converts into cookie theft, session fixation, a permitted cross-origin reader, and a trusted host, all without touching anything you operate.",
  failureMode: "An attacker enumerates your subdomains, finds one pointing at a deleted provider resource, claims that resource name, and now serves content on a hostname inside your domain with a valid certificate. From there they receive any cookie scoped to your parent domain and are treated as same-site by browsers.",
  experiment: "List every record in your zones that points at a provider hostname rather than at an address. For each, confirm the resource still exists and is yours. Twenty minutes for a small zone, and every unclaimed one is a finding to fix today.",
  reflection: "Who owns deleting records when a service is decommissioned, and is that step in the runbook?",
  recall: {
    q: "How does a subdomain takeover happen, and why is it worse than defacement?",
    a: "A record points at a provider-assigned resource hostname, the resource is deleted while the record is not because those are different owners with different tickets, and the provider makes the resource name claimable again.\n\nIt is worse than defacement because a hostname in your domain sits inside your cookie scope and same-site boundary, may be a permitted cross-origin reader or on an internal allowlist, and can obtain a valid publicly trusted certificate, since the claimant genuinely controls the name."
  },
  deepDive: "Help me audit the zones I describe for records pointing at provider resources, and tell me which are unclaimed."
},
{
  id: "naming-sni-is-what-policy-matches",
  track: "naming", level: "policy",
  title: "The name your policy matches is the one the client announced, not the one it reached",
  source: "RFC 6066, Transport Layer Security Extensions, 2011, on server name indication",
  idea: "A hostname-based network control reads the name from the handshake, which is a claim by the client, so the control must also verify that the certificate presented covers that name.",
  why: "This is the naming-track consequence of the plaintext hostname field. A proxy or firewall enforcing a hostname allowlist without terminating TLS has exactly one piece of information: the name the client said it wanted. It cannot know what the server actually is unless it also looks at the certificate the server returns, which it can do without terminating, because the certificate is presented in the clear in the older protocol version and requires more work in the newer one.\n\nThe practical distinction is between a control that reads the request and one that verifies the response. Reading the announced name is trivially defeated by a client under an attacker's control, which is the exact client you are worried about, since the workload is already compromised. Verifying that the presented certificate covers the announced name closes that, because the attacker would need a certificate for a name on your allowlist, which is a much higher bar than filling in a field. Whether your control does the second is worth knowing precisely, because the two look identical in a policy document and differ completely in what they resist.",
  failureMode: "An attacker on a compromised workload opens a connection announcing an allowed hostname while connecting to their own infrastructure, which presents a certificate for something else entirely and does not care. The egress control permits the connection on the strength of the announced name, and the channel is established through a hostname allowlist that was never checking the far end.",
  experiment: "Determine whether your hostname-based egress control verifies the presented certificate against the announced name. If the documentation is unclear, test it: connect to a host you control while announcing an allowed name, and see whether the connection is permitted. Twenty minutes.",
  reflection: "If your control only reads the announced name, is that a limitation of the product or a configuration you can change?",
  recall: {
    q: "What is the difference between a hostname control that reads the announcement and one that verifies it?",
    a: "Reading the announced name relies on a claim by the client, which is trivially forged by exactly the compromised workload you are defending against. Verifying that the presented certificate covers the announced name requires the attacker to hold a certificate for an allowlisted name, which is a much higher bar.\n\nThe two are indistinguishable in a policy document and completely different in what they resist, so it is worth testing rather than reading."
  },
  deepDive: "Test whether my egress hostname control verifies presented certificates against announced names, and tell me how to enable it if not."
},
{
  id: "naming-split-horizon-breaks-assumptions",
  track: "naming", level: "policy",
  title: "Split-horizon means the internal name is not the external name, and code assumes it is",
  source: "RFC 8499, DNS Terminology, 2022, on split-horizon DNS",
  idea: "Serving different answers to internal and external resolvers is a common and reasonable design, and it means any code that treats a name as having one meaning is wrong somewhere.",
  why: "The arrangement exists for good reasons: internal clients should reach a service directly rather than looping out through a public load balancer, and internal-only services should not have public records at all. What it produces is a name whose meaning depends on the resolver, and a set of second-order effects that catch people out. A validation that rejects internal addresses behaves differently depending on where it runs. A configuration value copied from one environment to another resolves somewhere unintended. A certificate issued for the external name may not match what an internal client connected to, or vice versa.\n\nThe security-relevant consequence is the direction of surprise. Internal resolution generally returns something more privileged: a direct address, an admin interface, a service that assumes its callers are internal. So a mistake in this area typically moves traffic toward the more sensitive answer rather than away from it, and it does so silently, because both answers are legitimate. The mitigation is naming discipline rather than a control: use distinguishable names for internal and external endpoints instead of the same name with two answers, so that a configuration mistake produces a resolution failure rather than a connection to something more privileged.",
  failureMode: "An attacker supplies a hostname that a validation running in production resolves to an internal address, having been tested in an environment where the same name resolved publicly to something harmless. The validation logic is identical in both places. The resolver is not, and the production answer is the privileged one.",
  experiment: "Find one name in your estate that resolves differently internally and externally. Note both answers and which is more privileged. Then check whether any validation or configuration treats that name as having one meaning. Twenty minutes.",
  reflection: "Would using distinct names for internal and external endpoints be feasible in your estate, or is the shared name load-bearing for something?",
  recall: {
    q: "What does split-horizon resolution cause, and which direction do its mistakes go?",
    a: "A name whose meaning depends on the resolver, so validations behave differently by environment, copied configuration resolves somewhere unintended, and certificates may not match what a client actually connected to.\n\nMistakes go toward the more privileged answer, because internal resolution typically returns a direct address or an admin interface that assumes internal callers, and both answers are legitimate so nothing signals the error. Distinguishable names make a mistake fail to resolve instead."
  },
  deepDive: "Identify the split-horizon names in an estate I describe and tell me which validations or configurations assume a single meaning."
},
{
  id: "naming-dnssec-signs-the-answer",
  track: "naming", level: "wire",
  title: "The signing extension authenticates the answer and not the channel, and covers less than you think",
  source: "RFC 4033, DNS Security Introduction and Requirements, 2005",
  idea: "Signing proves that a record is the one the zone owner published, and it does not encrypt the query, does not authenticate the resolver, and only applies where the whole delegation chain is signed.",
  why: "It is worth being precise about the guarantee because it is narrow and frequently overstated. What is provided is origin authentication and integrity for records: a validating resolver can tell that an answer came from the zone owner and was not modified. That defeats forged responses and cache poisoning for signed zones. What is not provided is confidentiality, so the query and the answer are still visible on the path, and it says nothing about the connection between your client and its resolver, which is usually the part of the path you actually share with an attacker.\n\nThe coverage limitation is the practical one. Validation only helps if the zone is signed and the delegation chain from the root is intact, and adoption is partial, so for a large fraction of names there is nothing to validate and the resolver returns an unsigned answer. There is also an operational cost that shapes adoption: signing introduces key management and a class of misconfiguration where a broken chain makes a zone unresolvable rather than merely unverified, which is a total outage. So the honest summary is a real but partial defence against forged answers, no help at all against a hostile resolver, and a separate mechanism needed for the confidentiality half.",
  failureMode: "An attacker who controls the network path between a workload and its resolver modifies answers freely, because signing protects the answer's origin and the workload's stub resolver is often not validating. Even where it is, the attacker targets an unsigned zone, of which there are many, and there is nothing to verify.",
  experiment: "Check whether your own zones are signed, and separately whether your workloads' resolvers validate signatures. Those are different questions with different owners and both are commonly no. Fifteen minutes.",
  reflection: "Is the path between your workloads and their resolver inside a boundary you trust, since that is the part signing does not help with?",
  recall: {
    q: "What does the signing extension guarantee, and what are its three limits?",
    a: "Origin authentication and integrity for records, so a validating resolver can tell an answer came unmodified from the zone owner, which defeats forged responses and cache poisoning for signed zones.\n\nIt does not encrypt the query, does not protect the client-to-resolver path where an attacker usually is, and only applies where the zone and the whole delegation chain are signed, which is partial. It also adds key management and a failure mode where a broken chain makes a zone unresolvable."
  },
  deepDive: "Tell me whether signing would help against the resolution threats in the estate I describe, and what the operational cost would be."
},
{
  id: "naming-encrypted-resolution-moves-trust",
  track: "naming", level: "policy",
  title: "Encrypting resolution moves the trust rather than removing it, and can move it out of your estate",
  source: "RFC 8484, DNS Queries over HTTPS, 2018",
  idea: "Encrypted resolution protects queries from observers on the path and gives the operator of the encrypted resolver complete visibility, which is a relocation of trust rather than a reduction.",
  why: "The privacy benefit is real: queries are no longer readable by anyone on the network between the client and the resolver. The trust does not disappear, it concentrates on whoever operates that resolver, who now sees every name every client looks up. If that is your own resolver, this is a straightforward improvement. If it is a public one configured by default in a browser or a library, you have moved your resolution trust to a third party and, more consequentially for this corpus, moved it outside your visibility.\n\nThat second effect is the one to plan for. Resolver query logs are the cheapest broad-coverage network telemetry most estates have, and they are the primary detection for resolution-based exfiltration. A workload or browser that resolves over an encrypted channel to an external provider produces no such logs, and its queries also bypass any resolution-level blocking you had. So the arrival of encrypted resolution in client defaults is simultaneously a privacy improvement for users and the loss of a detection capability for you. The response is to run your own encrypted resolver and require its use, which keeps both properties, rather than to try to prevent encryption.",
  failureMode: "An attacker on a compromised workload uses encrypted resolution to a public provider, exfiltrating over query names as before. Your resolver sees nothing because it was never asked, your resolution-level blocking never applies, and the queries appear on the network only as ordinary encrypted traffic to a reputable host that your egress policy permits.",
  experiment: "Determine whether your workloads and managed browsers can use encrypted resolution to an external provider, and whether anything forces them to your own resolvers. Fifteen minutes, and the browser answer is often yes by default.",
  reflection: "If your resolver logs are a primary detection source, what happens to that detection as encrypted resolution becomes the client default?",
  recall: {
    q: "What does encrypted resolution change, and why is it a detection problem?",
    a: "It protects queries from observers on the path and concentrates full visibility in whoever operates the encrypted resolver. With your own resolver that is an improvement; with a public one configured by default, resolution trust moves to a third party and outside your visibility.\n\nIt is a detection problem because resolver query logs are the broadest cheap telemetry most estates have and the primary detection for resolution-based exfiltration, and encrypted queries to an external provider produce none and bypass resolution-level blocking."
  },
  deepDive: "Help me work out whether workloads and browsers in the estate I describe can bypass my resolvers with encrypted resolution, and how to force them back."
},
{
  id: "naming-wildcard-one-key-many-names",
  track: "naming", level: "policy",
  title: "A wildcard certificate makes one private key cover a whole namespace",
  source: "RFC 6125, on wildcard matching in certificate names",
  cheat: "A wildcard key compromise is every subdomain at once. Use per-name certificates where automated issuance makes it cheap.",
  idea: "A wildcard certificate is accepted for every name at one level under a domain, so the key that holds it is a single credential covering everything in that namespace.",
  why: "The convenience is obvious: one certificate, one renewal, any number of hostnames. The cost is that the key becomes a credential for the whole namespace, and it usually ends up distributed to every host that needs to serve any name in it, which means many copies in many places, including places with weaker protection than the most sensitive service it covers. Compromise of any one of those copies is impersonation of all of them.\n\nThe matching rules add a second consideration people get wrong. A wildcard covers one label, so it matches a direct subdomain and not a deeper one, and it does not match the bare domain itself. That leads to deployments where a wildcard is believed to cover more than it does, and to the opposite case, where a wildcard issued at a high level covers far more names than the person requesting it had in mind. Since automated issuance made per-name certificates nearly free to operate, the balance has shifted: the operational argument for wildcards is much weaker than it was, and the remaining good uses are cases where names are created dynamically and cannot be enumerated in advance.",
  failureMode: "An attacker compromises a minor service serving one subdomain and obtains the wildcard key deployed there. They can now present a valid certificate for every name under that domain, including the primary application, an authentication endpoint and an internal admin host, none of which they touched.",
  experiment: "Find every wildcard certificate in your estate and, for each, list every host holding a copy of the key. Then note the least protected host on that list, because that is the security of the whole namespace. Twenty minutes.",
  reflection: "Would per-name certificates be operationally feasible now that issuance is automated, and what is the actual blocker?",
  recall: {
    q: "What is the cost of a wildcard certificate, and what do the matching rules add?",
    a: "The key becomes a credential for the whole namespace and is usually copied to every host serving any name in it, so compromise of the least protected copy is impersonation of all of them.\n\nThe matching rules mislead in both directions: a wildcard covers one label, so it does not match deeper subdomains or the bare domain, while a wildcard issued high in a namespace covers far more names than intended. Automated issuance has made per-name certificates cheap enough that the operational argument is weak."
  },
  deepDive: "Inventory the wildcard certificates in an estate I describe, list every host holding each key, and tell me which could move to per-name issuance."
},
{
  id: "naming-internal-names-in-public-logs",
  track: "naming", level: "ops",
  title: "Getting a public certificate for an internal name publishes that name forever",
  source: "RFC 6962, Certificate Transparency, 2013, read for its reconnaissance consequence",
  cheat: "Never obtain a publicly trusted certificate for an internal-only hostname. It enters a permanent public log.",
  idea: "Publicly trusted issuance is recorded in append-only public logs, so a certificate obtained for an internal hostname places that name in a permanent, searchable public record.",
  why: "The mechanism is the one covered in the TLS track and the consequence belongs here because it is a naming discipline problem. Somebody needs a certificate for an internal service, uses the same automated public issuance that everything else uses because it is right there and it works, and the hostname is logged. The certificate is fine. The disclosure is permanent and cannot be withdrawn, because the point of an append-only log is that entries do not leave it.\n\nWhat gets disclosed is more useful to an attacker than people expect, because internal names are descriptive. They say what a service is, which environment it belongs to, and often which team owns it, and a list of them is a map of the estate assembled with no packets sent to you. It also reveals things that are not otherwise inferable, such as the existence of a service that has no public presence at all. The discipline that avoids it is to use a private authority for internal names, which is the same conclusion the trust store entry reached from the other direction, and to keep internal names in a namespace that is separate from the public one so that the mistake is harder to make by accident.",
  failureMode: "An attacker searches the public logs for your domain and obtains a list of internal hostnames including staging environments, admin consoles, internal APIs and infrastructure components. Each name suggests what it is and where to look. No request was ever made to your infrastructure during this phase.",
  experiment: "Search the public logs for your domains and read the results for internal-sounding names. Then check whether your internal names live in a separate namespace from your public ones. Twenty minutes.",
  reflection: "For the internal names already in the logs, is there anything to do besides assuming they are known, and does that change how you protect them?",
  recall: {
    q: "Why should internal hostnames never receive publicly trusted certificates?",
    a: "Because publicly trusted issuance is recorded in append-only public logs, so the hostname becomes a permanent searchable public record that cannot be withdrawn.\n\nInternal names are descriptive, so a list of them says what each service is, which environment it belongs to and often which team owns it, and reveals services with no public presence. Use a private authority for internal names and keep them in a separate namespace so the mistake is harder to make."
  },
  deepDive: "Search for internal-looking hostnames from my domains in the public certificate logs and help me plan a private authority for internal names."
},
{
  id: "naming-service-discovery-is-dns-with-trust",
  track: "naming", level: "wire",
  title: "Cluster service discovery is resolution with a short lifetime and much more trust placed in it",
  source: "The Kubernetes documentation on DNS for services and pods",
  idea: "Inside a cluster, names are resolved by a platform resolver that every workload shares, and the answers determine which service a workload actually talks to.",
  why: "The mechanics differ from public resolution in ways that matter. Lifetimes are very short because endpoints move constantly, the resolver is a workload in the cluster rather than external infrastructure, every namespace shares it, and the names are structured so that a workload in one namespace can resolve services in every other by default. That last point makes the resolver a map of the entire cluster available to anything running in it.\n\nTwo consequences follow. The first is reconnaissance: a compromised workload can enumerate services across namespaces through resolution alone, without a single connection attempt, which makes it the cheapest and quietest discovery step available. The second is that the cluster resolver is a high-value target that is easy to overlook because it is presented as platform plumbing rather than as a security component. Compromising it, or being able to influence the records it serves, redirects service-to-service traffic across the cluster. Both consequences argue for the same things: policy that prevents workloads reaching the resolver's own administrative surface, and not relying on namespace separation as a confidentiality boundary for the existence of services.",
  failureMode: "An attacker in a compromised pod enumerates every service in every namespace by resolving names against the cluster resolver, building a complete inventory of the estate's internal architecture without attempting a single connection and without appearing in any connection log.",
  experiment: "From a pod in one namespace, resolve a service name in a different namespace and see whether it answers. Then check whether any network policy restricts which workloads may reach the cluster resolver. Fifteen minutes.",
  reflection: "Is the existence and naming of your internal services something you treat as confidential, and if so does resolution respect that?",
  recall: {
    q: "How does cluster service discovery differ from public resolution, and what are the consequences?",
    a: "Very short lifetimes because endpoints move, a resolver that is itself a workload in the cluster, shared by every namespace, with structured names that let a workload in one namespace resolve services in all the others by default.\n\nSo a compromised workload can enumerate the whole cluster through resolution alone, with no connection attempts and no connection logs; and the resolver is a high-value target presented as plumbing, since influencing its records redirects service-to-service traffic."
  },
  deepDive: "Tell me what a compromised pod could enumerate through cluster resolution in the setup I describe, and what policy would limit it."
},
{
  id: "naming-search-suffix-leaks-lookups",
  track: "naming", level: "wire",
  title: "Search suffixes turn an unqualified name into several lookups, some of them off your network",
  source: "RFC 8499, DNS Terminology, 2022, on search lists and qualification",
  idea: "A resolver configured with search domains appends each in turn to an unqualified name, so a single lookup can become several queries, and the later ones may leave your estate.",
  why: "The behaviour exists to let people type a short name, and it produces a sequence of attempts. In a cluster, an unqualified name is tried against the namespace, then the service domain, then the cluster domain, then whatever else is in the list, which commonly includes the node's own configured domains. That means a name intended to be internal can end up being queried against a public suffix, which sends the name to an external resolver and, if somebody has registered the corresponding public name, gets an answer.\n\nThe security consequences run both ways. Outward, the queries themselves leak internal service names to whoever operates the resolvers they reach, which is a quiet disclosure nobody audits. Inward, a name that fails internally and succeeds externally resolves to somebody else's infrastructure, which is a redirection triggered by a typo or by a service that has been decommissioned. That second case is the more interesting one, because it means an attacker can register a plausible public name and wait for misqualified internal lookups to arrive, and the traffic that arrives comes from inside your estate with whatever credentials the client attaches.",
  failureMode: "An attacker registers a public domain matching a pattern that internal misqualified lookups fall through to. A service whose internal name has been decommissioned now resolves through the search list to the attacker's infrastructure, and clients connect to it carrying the credentials they would have sent to the internal service.",
  experiment: "In one container, read the resolver configuration and note the search list and the number of dots required before a name is treated as absolute. Then resolve a deliberately wrong short name and observe how many queries result and where the last one goes. Twenty minutes.",
  reflection: "Do your internal clients use fully qualified names, and if not, how many queries per lookup are you generating and where do the misses go?",
  recall: {
    q: "What does a search list do, and what are its two security consequences?",
    a: "It appends each configured domain in turn to an unqualified name, so one lookup becomes several queries, and the later ones may use a public suffix and leave your estate.\n\nOutward, internal service names leak to whoever operates the resolvers those queries reach. Inward, a name that fails internally can succeed externally against somebody else's infrastructure, so an attacker can register a plausible public name and receive connections from inside your estate carrying real credentials."
  },
  deepDive: "Read the resolver configuration I paste in and tell me what queries a given unqualified name generates and which leave the estate."
},
{
  id: "naming-homographs-in-an-allowlist",
  track: "naming", level: "policy",
  title: "Two names that look identical are different names, and your allowlist compares bytes",
  source: "RFC 5890, Internationalized Domain Names for Applications, 2010",
  idea: "Names can contain characters that render identically to others, so a destination that looks like an approved one in a review can be a different name entirely.",
  why: "The encoding allows a large character repertoire, and many characters are visually indistinguishable from Latin letters at normal sizes. So a name can be constructed that renders the same as a legitimate one and is a completely different string, resolving to different infrastructure. The security-relevant point for this corpus is not phishing, which is the usual framing, but review: an allowlist entry, a configuration value or a pull request diff read by a human can contain such a name and pass, because the reviewer is comparing appearance and the system is comparing bytes.\n\nThe defences are mechanical rather than perceptual. Convert every name to its encoded form before comparing or storing it, so that what is written down is what will be resolved. Reject names mixing scripts where you do not need them. And where a name is being added to a list that grants something, display the encoded form in the interface that a human approves, since a review of a rendered name cannot catch this and a review of the encoded form can. It is worth mentioning that the same reasoning applies to case and to trailing dots, which are lesser versions of the same problem: the string a human reads and the string a resolver receives should be the same string.",
  failureMode: "An attacker submits an egress allowlist addition, or gets one accepted through a normal change process, using a name that renders identically to a permitted destination. The reviewer sees a familiar hostname and approves. The resolver sees a different name and returns the attacker's infrastructure.",
  experiment: "Take one hostname allowlist and convert every entry to its encoded form, then compare against what is displayed. Also check whether your change process shows reviewers the rendered or the encoded name. Fifteen minutes.",
  reflection: "Would your review process catch a visually identical hostname, and does anything in your tooling normalise before storing?",
  recall: {
    q: "Why can a hostname allowlist be defeated without any technical bypass?",
    a: "Because the character repertoire includes characters that render identically to Latin letters, so a different string can look the same to a reviewer while resolving to different infrastructure. The human compares appearance and the system compares bytes.\n\nThe defences are mechanical: normalise to the encoded form before comparing or storing, reject unnecessary mixed scripts, and display the encoded form in any interface where a human approves an addition."
  },
  deepDive: "Check the hostname allowlist I paste in for visually confusable entries and tell me where to normalise before storing."
},
{
  id: "naming-reverse-proves-nothing",
  track: "naming", level: "wire",
  title: "A reverse lookup proves nothing about the forward name",
  source: "RFC 8499, DNS Terminology, 2022, on reverse mapping",
  cheat: "Reverse lookups are controlled by whoever holds the address block. Never authorise on one without confirming the forward name resolves back.",
  idea: "The record mapping an address to a name is published by whoever controls that address block, so a reverse lookup returns whatever they chose to say and is not evidence of anything.",
  why: "The two directions are separate zones with separate owners. Whoever holds an address block publishes the reverse records for it, and can put any name there, including yours. So an access check that resolves the source address to a name and compares that name to an allowlist is trusting the attacker's own configuration. This is an old pattern, still present in log processing, in some access control lists, and in mail-handling rules.\n\nThe partial mitigation is a forward-confirmed lookup: resolve the address to a name, then resolve that name back to addresses, and require the original address to be among them. That closes the trivial version, because the attacker would need control of the forward zone too, which for a name in your domain they do not have. It is worth knowing this pattern by name because it is the correct way to use reverse lookups where you must, and because seeing it absent tells you a check is decorative. The stronger position, in an estate that has any of the identity mechanisms from earlier in this corpus, is not to use reverse lookups for authorisation at all and to reserve them for making logs readable.",
  failureMode: "An attacker configures the reverse record for an address they control to a hostname inside your domain. A service that resolves source addresses to names and permits anything in your domain grants access. Nothing was spoofed; the attacker published a record in a zone that was theirs to publish in.",
  experiment: "Grep for any place your code or configuration resolves an address to a name and uses the result in a decision. For each, check whether it confirms the forward direction. Fifteen minutes, and any that does not is today's finding.",
  reflection: "Are reverse lookups used anywhere in your estate for authorisation rather than for readability, and could that use be removed entirely?",
  recall: {
    q: "Why is a reverse lookup not evidence, and what is the partial fix?",
    a: "Because reverse records are published by whoever controls the address block, so the answer is whatever they chose to say, including a name in your domain. A check that authorises on it is trusting the attacker's configuration.\n\nThe partial fix is a forward-confirmed lookup: resolve the address to a name, resolve that name back, and require the original address to be present, which needs control of the forward zone too. Better still, use reverse lookups only for log readability."
  },
  deepDive: "Find every place an address is resolved to a name and used in a decision in a codebase I describe, and tell me which lack forward confirmation."
},
{
  id: "naming-registrar-is-supply-chain",
  track: "naming", level: "ops",
  title: "Your registrar and zone hosting are a supply chain with your whole namespace behind it",
  source: "NIST SP 800-81, Secure Domain Name System Deployment Guide, on registration and zone management",
  cheat: "Enable registrar lock and strong authentication on domain and zone accounts. That account can repoint every name you own.",
  idea: "Control of a domain registration or a zone hosting account is control of every name in it, which makes those accounts among the highest-value credentials in the organisation.",
  why: "Work out what an attacker with that access can do. Repoint any hostname to their infrastructure, which given automated certificate issuance also means obtaining valid publicly trusted certificates for those names, because control of the name is how issuance is validated. Redirect mail, which lets them receive password resets for other accounts. Take over any service that authenticates by domain control. Do all of it without touching a single system you operate, and with the change propagating through caches you do not control.\n\nWhat makes this a distinct entry rather than a generic account security point is that these accounts are usually managed outside the systems that protect everything else. They tend to predate current identity infrastructure, be registered to an individual rather than a role, sit outside the single sign-on estate, and be held at a vendor whose account recovery process is the actual authentication mechanism. The specific controls are correspondingly boring: registrar lock to prevent transfers, strong authentication with recovery paths that are not a personal mailbox, role ownership rather than individual, and monitoring for changes to your own records so that a repointing is noticed rather than reported by a customer.",
  failureMode: "An attacker takes over the registrar account through a support-channel recovery process, repoints the primary hostname to their infrastructure, and obtains a valid certificate for it through automated issuance because they now control the name. Users reach the attacker's site with a valid certificate and no warning, and nothing in your estate was touched.",
  experiment: "For your primary domain, check three things: whether registrar lock is on, whether the account uses strong authentication with a role-owned recovery path, and whether anything monitors your records for unexpected change. Fifteen minutes, and any no is a high-priority finding.",
  reflection: "Who can currently change your zone records, and is that list the same as the list of people you would trust with production access?",
  recall: {
    q: "Why is the registrar account among the highest-value credentials, and why is it often weakly protected?",
    a: "Because control of it repoints every name, and since automated certificate issuance validates by domain control, it also yields valid publicly trusted certificates, redirected mail and takeover of anything authenticating by domain control, all without touching your systems.\n\nIt is weakly protected because these accounts predate current identity infrastructure, are often registered to individuals rather than roles, sit outside single sign-on, and rely on a vendor recovery process as the real authentication mechanism."
  },
  deepDive: "Help me review the security of the domain registration and zone hosting accounts for an estate I describe, including recovery paths."
}
);

/* Track: Proving the far end. Ordered foundational first.
 *
 * The seam with Least Authority's credentials track is the question being
 * asked. That track asks what a credential is allowed to do. This one asks
 * what establishes, at the network layer, that the party on the other end of
 * this connection is the one you think it is - and what that establishment
 * cannot tell you. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "identity-address-is-a-location",
  track: "identity", level: "wire",
  title: "An address is a location, and treating it as an identity has never worked",
  source: "Bellovin, Security Problems in the TCP/IP Protocol Suite, Computer Communication Review, 1989",
  cheat: "Never authorise on a source address. It says where a packet claims to come from, which is not who sent it and not what is running there.",
  idea: "A source address states where a packet claims to originate, which is a routing hint rather than an authenticated fact, and in a dynamic estate it does not even reliably indicate what software is running there.",
  why: "Two separate problems, and both matter. The first is that the address is a claim: nothing in the protocol binds it to the sender, which is why source filtering at network borders exists as a recommended practice rather than as a property you get for free. On a path where an attacker can inject packets, an address is whatever they typed.\n\nThe second problem is the one that bites in a modern estate even when the address is genuine. Addresses are assigned from pools and reused within minutes. The address that belonged to a trusted batch worker at nine o'clock belongs to something else by ten, so a rule that authorises that address authorises whatever landed on it. Add shared egress, where dozens of workloads leave through one translated address, and the address identifies a group rather than a workload. Add a proxy or a mesh and every connection appears to come from the sidecar. In each case the address is truthful and useless, which is worse than it being forgeable, because it looks like it is working.",
  failureMode: "An attacker gets a workload scheduled onto a node, or simply waits for an address to be recycled, and inherits every permission that was granted to that address. Nothing is spoofed. The allowlist did exactly what it said, and what it said turned out to be about a location that changes hands.",
  experiment: "Find one rule or one application check in your estate that authorises based on a source address or range. Work out what else can currently hold an address in that range, and how quickly addresses there are recycled. Fifteen minutes, and the recycling interval is the useful number.",
  reflection: "Where you found address-based authorisation, is it there because it was the only identity available at that layer, or because it was the easiest thing to write?",
  recall: {
    q: "What are the two separate reasons a source address is not an identity?",
    a: "It is an unauthenticated claim, since nothing in the protocol binds it to the sender, which is why border source filtering is a recommended practice rather than a free property.\n\nAnd even when genuine it does not identify a workload: addresses come from pools and are recycled in minutes, shared egress translation collapses many workloads into one address, and a proxy or sidecar makes every connection appear to come from itself. A truthful useless address is worse than a forgeable one, because it looks like it is working."
  },
  deepDive: "Find the places in an estate I describe where a source address is doing the work of an identity, and tell me what identity is actually available at that layer instead."
},
{
  id: "identity-position-versus-claim",
  track: "identity", level: "policy",
  title: "Network position and identity answer different questions, and you need both answers",
  source: "NIST SP 800-207, Zero Trust Architecture, 2020, on the separation of reachability from authorisation",
  idea: "Reachability determines whether a connection can be attempted and identity determines whether it should be honoured, and a design that has only one of them has a specific, predictable gap.",
  why: "It is tempting to treat these as alternatives, and the discourse encourages it: the perimeter model is described as being replaced by identity. In practice they are complementary and they fail in opposite directions. Reachability alone gives you the flat network problem, where anything that gets a foothold inherits everything the position allows. Identity alone gives you an estate where every service is reachable by every attacker and the only thing standing between them is a credential check, so a single bug in that check, or a single stolen token, is worth the whole estate.\n\nThe useful way to hold it is that reachability decides how many parties get to attempt the identity check. Reducing it does not authorise anybody, it reduces the population of attackers who can reach the code that decides. That is worth a lot even when the identity layer is strong, because it turns an internet-wide attack surface into a small internal one, and it is worth almost everything when the identity layer has a bug, which it eventually will. This is the whole argument for keeping segmentation after adopting per-request authorisation, and the argument people skip when they treat the two as a migration rather than as layers.",
  failureMode: "An attacker finds an authentication bypass in a service that is deliberately reachable from everywhere because the architecture is identity-based. The bug is worth the entire service population immediately, with no lateral movement required, because nothing was reducing who could reach the check. The same bug in a segmented estate is worth whatever the attacker could already reach.",
  experiment: "Take one internal service. Write down the population that can currently open a connection to it, and separately the identity check it applies. Then ask the question that separates the two layers: if that check had a bypass today, how many parties could exploit it. Fifteen minutes.",
  reflection: "Has adopting per-request authorisation anywhere in your estate been used as a reason to stop caring about reachability, and was that argued or assumed?",
  recall: {
    q: "How do reachability and identity divide the work, and what does each look like when it is the only layer?",
    a: "Reachability decides how many parties can attempt the identity check; identity decides whether an attempt is honoured. Reachability alone is the flat network, where a foothold inherits everything the position allows. Identity alone means every service is reachable by every attacker, so one bug in the check or one stolen token is worth the estate.\n\nReducing reachability authorises nobody. It shrinks the population that can reach the deciding code, which matters most on the day that code has a bug."
  },
  deepDive: "For a service I describe, tell me the population that can reach it and what an authentication bypass in it would be worth, with and without segmentation."
},
{
  id: "identity-bearer-proves-possession",
  track: "identity", level: "wire",
  title: "A bearer token proves possession, and possession is transferable by definition",
  source: "RFC 6750, The OAuth 2.0 Authorization Framework: Bearer Token Usage, 2012",
  cheat: "Anything that can read a bearer token can use it from anywhere. Treat every log, dump and error report as a place it will end up.",
  idea: "A bearer credential grants access to whoever presents it, so its entire security depends on nothing else ever seeing the string, and everything in a distributed system is in the business of copying strings.",
  why: "The name is precise: the bearer is authorised. There is no binding to a client, a connection, a machine or a key, which is exactly what makes bearer tokens easy to deploy and exactly what makes them the most replayable credential in common use. The threat model is not sophisticated. It is that a string travels through many components, and components store strings: request logs, tracing spans, error reporters, crash dumps, proxy access logs, browser history, shell history, and any monitoring that captures headers.\n\nWhat follows is that the interesting question about a bearer token is not how it is validated but how many places have seen it. That is a plumbing question rather than a cryptographic one, and it is answerable. It also explains why the mitigations that actually work are about narrowing the copy surface and shortening the useful life rather than about validation: short expiry, audience restriction so a copy is only useful at one service, and binding the token to a key so possession of the string alone is insufficient. Each of those reduces what a copy is worth, because you will not stop copies happening.",
  failureMode: "An attacker reads a service token out of an application log that captured request headers during a debugging session eighteen months ago, and uses it from their own infrastructure. Nothing is bypassed and no system is compromised. The token is presented correctly and honoured correctly, from a location and by a party that were never part of anybody's model.",
  experiment: "Take one bearer token used in your estate and trace every component that handles the request carrying it. Mark each as storing, logging or forwarding. Then check one of the logging ones to see whether headers are actually captured. Twenty minutes, and the deliverable is the count of places a copy could exist.",
  reflection: "Of the places you found, which would you have to search during an incident, and could you?",
  recall: {
    q: "What does a bearer token actually prove, and what follows for how you defend it?",
    a: "Possession of a string, with no binding to a client, connection, machine or key. Whoever presents it is authorised, which makes it the most replayable credential in common use.\n\nSo the important question is how many components have seen it, since logs, traces, error reporters, crash dumps and proxy logs all store strings. The mitigations that work narrow the copy surface and the useful life: short expiry, audience restriction, and binding the token to a key so the string alone is not enough."
  },
  deepDive: "Trace where a bearer token in the request path I describe could be copied or logged, and tell me which mitigation would most reduce what a copy is worth."
},
{
  id: "identity-forwarded-header-is-a-claim",
  track: "identity", level: "wire",
  title: "The forwarded-for header is a claim from an untrusted party until you count hops",
  source: "RFC 7239, Forwarded HTTP Extension, 2014",
  cheat: "Trust the Nth value from the right, where N is the number of proxies you operate. Reading the leftmost value lets the client pick its own address.",
  idea: "Proxies append the address they saw to a header, so the header is a list in which the entries added by your own infrastructure are trustworthy and everything before them was supplied by the client.",
  why: "The mechanism is simple and the misuse is nearly universal. Each proxy appends, so the list reads oldest first: the leftmost entry is whatever the original client sent, which includes whatever an attacker chose to send, and the rightmost entries were added by the proxies closest to you. Code that wants the real client address almost always takes the leftmost value, because that is where the real client address is in the honest case, and that is precisely the position the client controls.\n\nThe correct rule is positional and depends on your topology: count the proxies you operate that append to this header, and trust that many entries from the right. Everything to the left of them is client-supplied data. This is worth internalising because the consequences land in the places that matter most: rate limiting counts against a value the attacker chooses, allowlists compare against a value the attacker chooses, audit logs record a value the attacker chooses, and geographic or fraud rules read a value the attacker chooses. One header, four controls, all reading the same forgeable field.",
  failureMode: "An attacker sends a request with the header already populated with an address that your admin allowlist permits, or with a rotating set of fake addresses to defeat rate limiting. Your edge appends the attacker's real address to the right of theirs, and the application reads the leftmost entry, which the attacker wrote. Every control keyed on client address is now reading attacker input.",
  experiment: "Find every place in your stack that reads a forwarded-for style header. For each, determine whether it takes the leftmost value or counts from the right, and whether the hop count matches the number of proxies you actually run. Twenty minutes, and any leftmost read is today's finding.",
  reflection: "If your proxy topology changed by one hop, which of the controls you found would silently start reading the wrong value?",
  recall: {
    q: "How should a forwarded-for header be read, and why is the common approach wrong?",
    a: "Count the proxies you operate that append to it and trust that many entries from the right. Everything to the left is client-supplied.\n\nThe common approach takes the leftmost value because that is where the genuine client address sits in the honest case, but it is also the position an attacker fully controls. That single field typically feeds rate limiting, allowlists, audit logs and fraud rules at once."
  },
  deepDive: "Given my proxy topology, tell me exactly which position in the forwarded-for header is trustworthy and find every place in my stack that reads it wrongly."
},
{
  id: "identity-proxy-forwards-a-claim",
  track: "identity", level: "policy",
  title: "A proxy that forwards an identity is asserting it, and the backend has to know which it is trusting",
  source: "RFC 7239, on the trust model for forwarding intermediaries",
  idea: "When an intermediary authenticates a caller and passes the result downstream, the backend is trusting the intermediary rather than the caller, and the whole arrangement collapses if the backend is reachable without going through it.",
  why: "This is the standard shape for an authenticating gateway: the edge verifies a token or a certificate, resolves who the caller is, and forwards a header saying so. It is a good pattern with one precondition that is frequently unmet. The backend has no way to distinguish a header set by the gateway from an identical header set by anybody else who can reach it, so the arrangement is only sound if the gateway is genuinely the only path in.\n\nSo it requires two things that are usually treated as separate concerns. The backend must be unreachable except through the gateway, which is a network control, and the gateway must strip any inbound copy of the header it is about to set, which is a configuration detail on a different team's component. Neither is visible from the other side, and both are easy to lose: a new route added for a batch job, a service mesh that permits direct pod-to-pod traffic, a debugging path that stayed. The identity assertion then becomes a self-service field, and the failure is total because the backend was designed to believe it.",
  failureMode: "An attacker who can reach a backend directly, bypassing the gateway, sets the identity header themselves to any user or service they like. The backend applies its normal authorisation logic to a fabricated identity. Everything works exactly as designed except that the party asserting the identity was the attacker rather than the gateway.",
  experiment: "Take one service behind an authenticating gateway. Try to reach it directly, from a source that should not be able to, and see whether the connection completes. Then check whether the gateway strips the inbound identity header. Twenty minutes, and either failure is today's finding.",
  reflection: "For the header your gateway sets, who owns the strip rule, and who would know if it were removed?",
  recall: {
    q: "What two conditions must hold for a gateway-asserted identity header to be safe?",
    a: "The backend must be unreachable except through the gateway, and the gateway must strip any inbound copy of the header before setting its own.\n\nOtherwise the backend cannot distinguish the gateway's assertion from anybody else's, and since it is designed to believe the header, the failure is total. Both conditions live on different components from the code that trusts them, and both are easily lost to a new route or a debugging path."
  },
  deepDive: "For a gateway and backend I describe, tell me how to verify that the backend is only reachable through the gateway and that the identity header is stripped on the way in."
},
{
  id: "identity-bootstrap-problem",
  track: "identity", level: "wire",
  title: "Every workload identity is bootstrapped by something, and that something is the real root of trust",
  source: "The SPIFFE specification, on attestation and the identity bootstrap",
  idea: "A workload cannot prove who it is using a credential it does not yet have, so every identity system has a first step where something else vouches for it, and the strength of the whole system is the strength of that step.",
  why: "This is the question to ask of any workload identity scheme, and it cuts through a lot of marketing. Something has to decide that this new process is entitled to an identity, and the options form a hierarchy. Weakest is a shared secret baked into an image, because anybody with the image is that workload. Better is a platform assertion, where the orchestrator vouches for what it just scheduled, which moves the root of trust into the control plane. Better again is hardware attestation, where a measurement rooted in the machine is presented, which is much harder to forge and much harder to operate.\n\nWhat this framing buys you is the ability to evaluate a design in one question: what does the very first credential depend on. A system issuing beautiful short-lived certificates on the strength of a long-lived token in an environment variable has the security of that token and the operational complexity of certificates. That is a worse position than either, and it is common, because the certificate machinery is the visible part and the bootstrap is a detail somebody handled early. The bootstrap is also the part that does not rotate, which is why it deserves the scrutiny.",
  failureMode: "An attacker who can read a container image, or who can create a pod in the right namespace, obtains the bootstrap credential and receives a legitimate workload identity from the identity system. Every certificate issued afterwards is genuine, short-lived and correctly attested. The attacker is not impersonating a workload; the system has decided they are one.",
  experiment: "Pick one workload with a platform identity and trace backwards to the very first thing that established it. Keep asking what proved that until you reach something that is not itself issued by the system. Write down what you land on. Fifteen minutes, and the answer is the root of trust whether or not anybody calls it that.",
  reflection: "Could an attacker who can schedule a workload in your platform obtain the same identity as a legitimate one, and if so, what is actually protecting scheduling?",
  recall: {
    q: "What is the bootstrap problem in workload identity, and what does it tell you about a design?",
    a: "A workload cannot prove who it is with a credential it does not yet have, so something else must vouch for it first. Options range from a shared secret in an image, which anybody with the image can use, through a platform assertion that moves the root of trust to the control plane, to hardware attestation.\n\nEvaluate any design by asking what the first credential depends on. Short-lived certificates issued on the strength of a long-lived environment variable have the security of the variable and the complexity of certificates, and the bootstrap is the part that never rotates."
  },
  deepDive: "Trace the identity bootstrap chain for a workload I describe back to its actual root of trust, and tell me what an attacker who could schedule a pod would obtain."
},
{
  id: "identity-mtls-names-does-not-authorise",
  track: "identity", level: "policy",
  title: "Getting mutual TLS working is the easy half, and it authorises nothing on its own",
  source: "NIST SP 800-207, on the distinction between authentication and policy enforcement",
  cheat: "Mutual TLS answers which workload is calling. Something still has to decide what that workload may do, and that policy is yours to write.",
  idea: "Mutual authentication tells a service which workload is on the other end of the connection, and the decision about what that workload may then do is a separate policy that a mesh will not write for you.",
  why: "The failure pattern is specific and common enough to name. A team rolls out a mesh, enables mutual TLS everywhere, and the dashboard turns green: every connection is authenticated and encrypted. The conclusion drawn is that service-to-service security is done. What has actually happened is that every service now knows the name of every caller, and by default accepts all of them. Authentication went from nothing to strong, and authorisation stayed at allow-all, which is a real improvement in attribution and no improvement at all in blast radius.\n\nThe distinction is worth holding because the two halves have very different costs. Turning on mutual authentication is largely infrastructure work that a platform team can do once. Writing authorisation policy means knowing which services legitimately call which, which requires the service owners, is never documented accurately, and is the part that gets deferred. So the honest question about a mesh deployment is not whether mutual TLS is on but how many services have an authorisation policy that denies anything. A green dashboard measures the half that was easy.",
  failureMode: "An attacker with a foothold in any workload in the mesh calls any other service. Every call is mutually authenticated with a valid short-lived certificate and is permitted, because no authorisation policy was written. The audit trail is excellent: it records precisely which workload made each call, and every one of them was allowed.",
  experiment: "In your mesh, count the services with an authorisation policy that denies something, as a fraction of all services. Then take the one you would least like reached and check whether anything stops an arbitrary workload calling it. Fifteen minutes.",
  reflection: "Is authorisation policy in your estate owned by the platform team who turned mutual TLS on, or by the service owners who know the call graph, and does that ownership actually exist?",
  recall: {
    q: "What does enabling mutual TLS across a mesh accomplish, and what does it leave undone?",
    a: "It gives every service the authenticated name of every caller, which is a large improvement in attribution and encryption. By default it accepts all of them, so authorisation remains allow-all and blast radius is unchanged.\n\nThe halves differ in cost: authentication is platform work done once, while authorisation requires knowing the real call graph, which needs service owners and is never accurately documented. The measure of a mesh deployment is how many services deny anything."
  },
  deepDive: "Help me write authorisation policy for the mesh services I describe, starting from what actually calls what rather than from what the documentation says."
},
{
  id: "identity-connection-pool-outlives-credential",
  track: "identity", level: "wire",
  title: "A pooled connection outlives the credential that opened it",
  source: "RFC 8446, on connection lifetime, read against how HTTP client libraries pool",
  idea: "Client libraries keep connections open and reuse them for later requests, so a connection authenticated once can carry traffic long after the identity that established it has expired or been revoked.",
  why: "Connection reuse is a performance necessity: setting up a new handshake per request is expensive, so every serious client keeps a pool. The consequence for identity is that authentication happened at open time and the connection does not revisit it. If the client presented a certificate that has since expired, or a token that has since been revoked, the open connection carries on. Nothing re-checks, because there is no point in the protocol where re-checking would happen.\n\nThis interacts badly with the move to short-lived credentials, which is otherwise the right direction. Certificate lifetimes get shortened to minutes on the reasoning that a stolen key expires quickly, and then a pooled connection holds for hours and the reasoning does not apply to it. The gap between credential lifetime and maximum connection lifetime is a real number in your estate, and it is usually much larger than anybody intends, because pool settings are tuned for latency by people who are not thinking about credentials. The fix is unglamorous: bound the maximum connection age below the credential lifetime, on both ends, and treat the server side as the enforcement point since you cannot rely on every client.",
  failureMode: "An attacker in possession of a stolen key keeps a connection open and continues making requests after the certificate has expired and been replaced. The credential is dead by every measure the identity system tracks, and the connection established with it is still carrying traffic because nothing in the path re-evaluates an open connection.",
  experiment: "For one internal client, find the maximum connection lifetime in its pool configuration and compare it against the lifetime of the credential it authenticates with. Write both numbers down. Fifteen minutes, and if the pool number is larger, that difference is your real revocation window.",
  reflection: "Which side of your connections could actually enforce a maximum age, and has anybody set it deliberately rather than inheriting a default?",
  recall: {
    q: "Why does connection pooling undermine short-lived credentials?",
    a: "Authentication happens once at connection open and is never revisited, because there is no point in the protocol where it would be. A pooled connection therefore carries traffic after the certificate or token that opened it has expired or been revoked.\n\nShortening credential lifetimes to minutes does nothing for a connection held for hours, so the gap between credential lifetime and maximum connection age is the real revocation window. Bound connection age below credential lifetime, and enforce it server-side since clients cannot be relied on."
  },
  deepDive: "Compare the connection pool lifetimes and credential lifetimes in the services I describe, and tell me where to enforce a maximum connection age."
},
{
  id: "identity-mutual-auth-is-asymmetric",
  track: "identity", level: "ops",
  title: "Mutual authentication is asymmetric in practice, because only one side is ever tested",
  source: "RFC 8446, on the optionality of client authentication",
  cheat: "Test client authentication by connecting with no certificate and with a wrong one. A server that accepts either is not doing mutual TLS.",
  idea: "Server authentication is exercised by every client on every connection, while client authentication is exercised only by clients that were going to present a valid certificate anyway, so its failure is invisible.",
  why: "The asymmetry is about who notices. If server authentication breaks, clients fail to connect and somebody reports it immediately. If client authentication is silently not enforced, everything works: the legitimate clients present their certificates, the server ignores them, and no test in existence covers the case of a client that presents nothing. This is why misconfigured client authentication survives for years, and why it is one of the few security properties where the absence produces literally no signal.\n\nThe configurations that produce it are ordinary. A server set to request rather than require a client certificate will accept connections without one, and the difference between those two words is one line in most implementations. A verification depth or trust anchor that is wrong may accept certificates from a wider set than intended. A load balancer terminating in front may authenticate the client and forward without conveying anything about it, leaving the backend to assume authentication happened somewhere. Each of these looks correct in the configuration file and passes every test written by someone holding a valid certificate.",
  failureMode: "An attacker connects to a service documented as requiring mutual TLS and presents no client certificate at all. The connection succeeds, because the server was configured to request rather than require one. Every legitimate client presents a certificate and is verified, so the misconfiguration has been invisible since the day it shipped.",
  experiment: "For one service that requires client certificates, connect with none, then with a certificate from a different authority. Both must be refused. Then check the backend behind any terminating proxy to see whether it can tell that client authentication happened. Twenty minutes.",
  reflection: "How many of your mutual TLS paths have ever been tested with a deliberately wrong client certificate rather than a right one?",
  recall: {
    q: "Why does misconfigured client authentication go undetected in a way server authentication does not?",
    a: "Because failure produces no signal. Legitimate clients present valid certificates and everything works whether or not the server enforces anything, and no ordinary test covers a client presenting nothing.\n\nThe usual causes are a server set to request rather than require a certificate, a wrong trust anchor or verification depth, or a terminating proxy that verifies the client and forwards nothing about it, leaving the backend to assume it happened."
  },
  deepDive: "Write me a test procedure for the mutual TLS paths I describe that asserts refusal for a missing certificate, a wrong-authority certificate and an expired one."
},
{
  id: "identity-rotation-is-the-hard-part",
  track: "identity", level: "ops",
  title: "Issuing credentials is easy and rotating them is the entire engineering problem",
  source: "The SPIFFE specification, on short-lived credentials and automatic renewal",
  idea: "Any identity system can issue, and the property that determines whether it survives contact with production is whether a credential can be replaced without a coordinated restart.",
  why: "Short-lived credentials are the correct design and they impose a requirement that is easy to underestimate: something must renew them continuously, and every consumer must pick up the new one without being restarted. That second half is where it fails. A process that reads a certificate from disk at startup and caches the parsed object will keep using it after the file is replaced, so renewal appears to work, monitoring of the file looks healthy, and the served or presented credential goes stale until something happens to restart the process.\n\nThe failure mode this produces is a correlated outage, which is the worst shape available. Credentials issued together expire together, so a renewal path that is broken breaks everywhere at once, at a time you could have predicted precisely. This is why the operational tests worth having are not about issuance at all. They are: force a rotation and confirm the process presents the new credential without a restart, and confirm that a failure to renew produces an alert with hours of margin rather than a connection error at the deadline.",
  failureMode: "There is no attacker again, which is the point. Renewal breaks quietly on a Friday, every workload continues on credentials that are valid for another twelve hours, and at three in the morning every service in the estate fails to authenticate to every other service simultaneously. The blast radius is total and the timing was knowable to the minute.",
  experiment: "Force a credential rotation on one service and confirm, from the outside, that it presents the new one without being restarted. Then break renewal deliberately in a non-production environment and see how long before something alerts. Thirty minutes, and the second half is the more valuable one.",
  reflection: "Would a renewal failure in your estate surface as an alert with hours of margin, or as a total outage at a deadline you could have calculated?",
  recall: {
    q: "Why is rotation rather than issuance the hard part of an identity system?",
    a: "Because every consumer must pick up a replacement without being restarted, and processes that read a credential at startup and cache the parsed object keep using it after the file is replaced. Renewal then appears healthy while the presented credential goes stale.\n\nThe failure is correlated: credentials issued together expire together, so a broken renewal path fails everywhere simultaneously at a precisely predictable time. The tests that matter are forcing a rotation without a restart, and confirming a renewal failure alerts with hours of margin."
  },
  deepDive: "Design a rotation test for the identity system I describe that proves credentials are picked up without a restart and that renewal failures alert early."
},
{
  id: "identity-federation-needs-a-boundary",
  track: "identity", level: "policy",
  title: "Federating identity across two trust domains needs an explicit boundary, or you have merged them",
  source: "NIST SP 800-207, on trust domains and policy enforcement between them",
  idea: "Accepting another organisation's identity assertions makes their compromise your compromise unless you constrain what those assertions are allowed to say.",
  why: "Federation is presented as a convenience, and the security consequence is a merge unless something limits it. If you trust an external issuer for identities, then whoever controls that issuer can mint an identity you will honour. That is fine and normal, and it is exactly the arrangement you want with a partner, provided the trust is bounded: this issuer may assert identities within this namespace, for these audiences, and nothing else.\n\nWithout those constraints the failure is that an external issuer asserts an identity belonging to your own namespace and you accept it, which converts their account takeover into an authentication bypass on your side. The specific mechanisms differ by protocol but the shape is constant, and the mitigations are the same three every time: constrain which names an issuer may assert, constrain which audiences a token from them is valid for, and keep the mapping from their names to your internal identifiers explicit rather than accepting their strings directly. That last one connects back to the certificate subject problem in the TLS track: a foreign identity string should be translated at the boundary, not used as an identity in your code.",
  failureMode: "An attacker who has compromised a partner's identity provider issues an assertion naming one of your internal administrative identities. Your side accepts it because the issuer is trusted and nothing constrains which names that issuer may assert. The partner has a bad day, and you have an authentication bypass on your most privileged accounts.",
  experiment: "List every external identity issuer you trust, in any protocol. For each, write down what constrains the names it may assert and the audiences its tokens are valid for. Any issuer with no constraint on either is today's finding. Twenty minutes.",
  reflection: "For each federated issuer, would you accept their security posture as your own, because at the moment that is what you have done?",
  recall: {
    q: "What has to be constrained when federating identity, and what happens without it?",
    a: "Which names the external issuer may assert, which audiences its tokens are valid for, and an explicit mapping from their names to your internal identifiers rather than using their strings directly.\n\nWithout those, an external issuer can assert an identity in your own namespace and you will accept it, which turns their account takeover into an authentication bypass on your side. Federation without constraints is a merge of trust domains."
  },
  deepDive: "For the external identity issuers I describe, tell me what constraints should be applied to each and how to verify they are actually in force."
},
{
  id: "identity-health-endpoints-unauthenticated",
  track: "identity", level: "policy",
  title: "Health and metrics endpoints are unauthenticated by convention and reachable by construction",
  source: "The Kubernetes documentation on probes, read for what the requirement actually implies",
  cheat: "Health and metrics endpoints need their own listener on their own port, reachable only from the prober and the scraper.",
  idea: "Liveness probes and metrics scrapes have to work before and independently of authentication, so those endpoints are almost always open, and they are on the same listener as everything else.",
  why: "The requirement is genuine. A probe that needs a credential cannot tell you the process is unhealthy because it cannot obtain one, and a metrics scrape that needs identity infrastructure fails exactly when identity infrastructure is what you need to observe. So these endpoints are exempted, and the exemption is correct.\n\nWhat is not correct is the usual implementation, which puts them on the same port as the application and exempts them by path. That makes the exemption a path-matching problem in the same class as every other path-matching bypass, and it means anything that can reach the application port can reach them. The content matters more than people assume: metrics endpoints routinely expose internal hostnames, queue names, tenant identifiers, version strings and request paths, which is a detailed map of the estate. Health endpoints in their verbose form list dependencies and their status, which tells an attacker what to attack and what is already failing. The fix is structural rather than a stricter path rule: a separate listener on a separate port, reachable only from the prober and the scraper.",
  failureMode: "An attacker who can reach a service enumerates its dependencies from a verbose health endpoint and its internal topology from a metrics endpoint, including hostnames of databases and queues that appear nowhere else, with no credential and no exploited bug. The reconnaissance phase is served by two endpoints that were deliberately left open for good reasons.",
  experiment: "Fetch the health and metrics endpoints of one service without credentials and read what comes back as if you were mapping the estate. Then check whether they are on a separate port from the application. Fifteen minutes.",
  reflection: "How much of your internal topology is legible from those two endpoints, and is that a bigger surface than the application they belong to?",
  recall: {
    q: "Why are health and metrics endpoints usually unauthenticated, and what is wrong with how the exemption is implemented?",
    a: "Because a probe or scrape that requires a credential fails exactly when the thing you need to observe is broken, so the exemption is correct.\n\nThe implementation is usually a path exemption on the application's own port, which makes it a path-matching bypass problem and reachable by anything that can reach the application. The content is a detailed map: internal hostnames, queue names, tenant identifiers, versions, and dependency status. The fix is a separate listener on a separate port."
  },
  deepDive: "Look at what my health and metrics endpoints expose and tell me what an attacker would learn, then help me move them to a separate listener."
},
{
  id: "identity-nonprod-credentials-in-prod",
  track: "identity", level: "ops",
  title: "The credential that works in both environments has quietly merged them",
  source: "NIST SP 800-207, on trust domain separation",
  idea: "If a staging identity is accepted by production, then staging is production for security purposes, and staging is where the controls are deliberately weaker.",
  why: "Environments are separated so that a mistake or a compromise in the low-stakes one cannot affect the high-stakes one. That separation is a property of what accepts what, not of what the environments are called. A shared trust anchor issuing to both, a shared identity provider without an audience constraint, or a single account trusted by both, all reintroduce the path. And the reason it happens is not carelessness: making them genuinely separate means duplicating issuance, trust stores and configuration, and the shortcut of one authority for everything is materially less work.\n\nWhat makes this worth an entry of its own is the asymmetry of effort involved in attacking it. Non-production environments have weaker access controls by design, more people with access, older code, debug endpoints enabled, and test data that is sometimes a copy of real data. An attacker choosing between attacking production directly and attacking staging and then walking across will pick the second every time, because it is easier and less watched. The control is a per-environment trust boundary: separate anchors, audience restrictions that name the environment, and a test that confirms a staging identity is refused by production.",
  failureMode: "An attacker compromises a staging environment, which is a much softer target with more people holding access, and finds that the workload identity it holds is accepted by the production identity system because both are issued by the same authority with no audience constraint. No production system was attacked. The path was an issuance decision made for convenience.",
  experiment: "Take a credential from your lowest environment and attempt to use it against production. It must be refused. Then check whether the trust anchors and the audience restrictions actually differ between environments, rather than only the endpoints. Twenty minutes.",
  reflection: "If staging is effectively inside your production trust boundary, is the honest response to separate them or to protect staging like production?",
  recall: {
    q: "Why does a credential accepted in both environments matter more than it seems?",
    a: "Because environment separation is a property of what accepts what, not of naming. A shared trust anchor, a shared issuer with no audience constraint, or one account trusted by both, all reconnect them.\n\nAnd the asymmetry favours the attacker: non-production has weaker access control, more holders, older code, debug endpoints and sometimes copies of real data, so attacking it and walking across is easier and less watched than attacking production directly."
  },
  deepDive: "Help me verify that credentials from my lower environments are refused by production, and design the audience constraints that would enforce it."
},
{
  id: "identity-shared-account-destroys-attribution",
  track: "identity", level: "ops",
  title: "A shared identity is an audit log that cannot answer the only question you will ask",
  source: "NIST SP 800-92, Guide to Computer Security Log Management, 2006, on accountability",
  idea: "When several people or several workloads present the same identity, every log line is correct and none of them can tell you who acted.",
  why: "Shared identities appear for practical reasons: one service account used by three jobs because creating accounts requires a ticket, one deployment credential the whole team uses, one database user for every component of an application. Each is a small convenience and each removes the property that makes logs useful. The record is not wrong, it is simply not discriminating: every action attributed to the shared name, forever.\n\nThe cost is concentrated entirely in the moment you can least afford it. During an incident the questions are which workload made this call, when did this behaviour start, and is this activity legitimate, and a shared identity answers none of them. It also makes the containment decision worse: revoking a shared credential stops the attacker and everything else using it, so the response becomes a choice between an outage and letting it continue, made under time pressure. That is the real argument for per-workload identity, and it is an incident-response argument rather than a least-privilege one, which is why it survives the objection that the permissions were the same anyway.",
  failureMode: "An attacker uses a shared service account, and the investigation cannot separate their calls from three legitimate jobs using the same identity. Containment means revoking a credential that four things depend on, so the decision escalates and stalls while the activity continues, and the timeline in the write-up has a gap that will never be filled.",
  experiment: "Find one shared identity in your estate. List everything that uses it. Then ask the incident question: if this credential were being abused right now, could you tell which of those was doing it, and could you revoke it without an outage. Fifteen minutes.",
  reflection: "For the shared identities you found, is the obstacle to splitting them technical, or is it that creating an identity in your platform is slow enough that people route around it?",
  recall: {
    q: "What is the real cost of a shared identity, given the permissions may be identical either way?",
    a: "It removes attribution. Every log line is correct and none discriminates, so during an incident you cannot say which workload made a call, when the behaviour started, or whether it is legitimate.\n\nIt also poisons containment: revoking the credential stops the attacker and every legitimate user of it, turning the response into a choice between an outage and continued compromise, decided under time pressure. The argument for per-workload identity is incident response, not least privilege."
  },
  deepDive: "Help me find shared identities in an estate I describe and work out, for each, whether it could be revoked during an incident without causing an outage."
},
{
  id: "identity-untested-until-you-present-the-wrong-one",
  track: "identity", level: "ops",
  title: "You have not tested an identity check until you have presented the wrong identity",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013, on validating controls",
  cheat: "Every identity check needs a negative test: no credential, expired, wrong issuer, wrong audience. Passing with a valid one proves nothing.",
  idea: "A test that presents a valid credential and succeeds tells you the happy path works, and says nothing about whether anything is being enforced.",
  why: "This is the same argument as the untested network rule, and it needs restating here because identity checks fail in more ways and produce even less signal. There are four negative cases and they are independent: no credential at all, an expired one, one from an unexpected issuer, and a valid one intended for a different audience. A system can enforce any subset of those. Enforcing three and missing the fourth looks identical to enforcing all four from the perspective of every legitimate client, and each missed case is a complete bypass for somebody.\n\nThe reason this is worth building into a routine rather than doing once is that these properties are not stable. A library upgrade changes a default, a configuration is regenerated from a template, an audience string is renamed during a migration, a trust anchor is added to unblock a partner integration. None of those events looks like a security change and each can silently remove one of the four checks. So the useful artefact is a small suite that presents each wrong credential and asserts refusal, run continuously, which is the only thing that will notice.",
  failureMode: "An attacker presents a token that is entirely valid and was issued for a different service. The check verifies the signature, the issuer and the expiry, and does not verify the audience, so it passes. Every legitimate client of both services has always worked correctly, and the missing check has never produced a single anomalous log line.",
  experiment: "Pick one identity check and present all four wrong credentials: absent, expired, wrong issuer, wrong audience. Assert refusal for each. Any that passes is today's finding, and the ones that fail correctly are now a test you should keep. Thirty minutes.",
  reflection: "Which of the four cases had never been tested, and which recent change could have broken it without anybody noticing?",
  recall: {
    q: "What are the four negative cases every identity check needs, and why must they be tested continuously?",
    a: "No credential, an expired one, one from an unexpected issuer, and a valid one issued for a different audience. A system can enforce any subset, and enforcing three looks identical to enforcing four from every legitimate client's point of view.\n\nContinuously, because the properties are not stable: library upgrades change defaults, templates regenerate configuration, audience strings get renamed in migrations, trust anchors get added for partner integrations. None looks like a security change and each can silently remove a check."
  },
  deepDive: "Write me a negative test suite for the identity checks in a service I describe, covering absent, expired, wrong-issuer and wrong-audience credentials."
}
);

/* Track: TLS and what it proves. Ordered foundational first.
 *
 * The track exists because TLS is the most widely deployed security protocol
 * in the estate and the most widely misread. Nearly every wrong belief about
 * it is a belief that it proves more than it does. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "tls-proves-a-name",
  track: "tls", level: "wire",
  title: "TLS proves a name, protects a channel, and authorises nothing",
  source: "RFC 8446, The Transport Layer Security Protocol Version 1.3, 2018",
  cheat: "A completed handshake means you reached the holder of a key for that name. It says nothing about what that party may do.",
  idea: "A successful handshake establishes that the far end holds the private key for a certificate covering the name you asked for, and that the bytes after it are confidential and unmodified, and it establishes nothing else.",
  why: "Three properties, and it is worth being able to name them separately because systems fail on one at a time. Server authentication says the far end holds a key bound to the name you asked for. Confidentiality says nobody on the path reads the payload. Integrity says nobody on the path changes it undetected. That is a complete list. Authorisation is not on it, freshness of the far end's permissions is not on it, and nothing about the far end's trustworthiness is on it.\n\nThe reason this matters more than it sounds is that people use the presence of TLS as an argument in the wrong place. A design review that answers 'is this call safe' with 'it is over TLS' has answered a question about the path and left the question about the endpoint untouched. If the far end is compromised, TLS works perfectly and delivers the attacker's response with full integrity. If the certificate is valid for a name an attacker controls, TLS works perfectly and tells you so. The protocol is doing its job in both cases, and its job was smaller than the claim being made.",
  failureMode: "An attacker who has compromised a third-party API you depend on serves malicious responses over a perfectly valid TLS connection. Every check passes, every log line says the connection was encrypted, and the compromise is completely invisible to any control that reasons about transport security, because nothing about transport security was violated.",
  experiment: "Find one place in a design doc or a code comment where TLS is offered as the reason something is safe. Write out which of the three properties is actually doing the work, and then write what the sentence would have to say about the endpoint to be a complete argument. Ten minutes.",
  reflection: "How often in your estate is TLS standing in for an endpoint argument that nobody has made?",
  recall: {
    q: "What are the three things TLS establishes, and what is the most common thing people wrongly add to the list?",
    a: "Server authentication, that the far end holds the private key for a certificate covering the name you asked for. Confidentiality of the payload against anyone on the path. Integrity of the payload against anyone on the path.\n\nAuthorisation is the thing wrongly added. A compromised endpoint serves malicious data over a flawless TLS connection, and every transport-level control reports success, because none of them was violated."
  },
  deepDive: "Take a design I describe where TLS is cited as the safety argument and tell me which of the three properties is load-bearing and what claim about the endpoint is still missing."
},
{
  id: "tls-which-name",
  track: "tls", level: "wire",
  title: "The handshake authenticates a name, and which name is the entire question",
  source: "RFC 6125, Representation and Verification of Domain-Based Application Service Identity, 2011",
  cheat: "Hostname verification is a separate step from chain validation. A library can do one and skip the other, and many have.",
  idea: "Certificate validation has two halves that fail independently: whether the chain is trusted, and whether the name in the certificate matches the name you intended to reach.",
  why: "These get conflated because both are usually done by one library call. They are entirely different checks. Chain validation asks whether some authority in your trust store vouches for this certificate. Name verification asks whether this certificate is for the host you meant. A certificate can be perfectly trusted and belong to somebody else, which is exactly what an attacker who can obtain any valid certificate has.\n\nThe details are where implementations go wrong. The name lives in the subject alternative name extension, and the common name field is a deprecated fallback that some code still reads. Wildcards match one label and not multiple, and not the bare domain. Internationalised names have to be compared in a canonical form. Address literals need a different comparison entirely. Every one of these has been a real vulnerability class, and every one of them is invisible if you test only against a correctly configured server, because a correct server passes a broken check too.",
  failureMode: "An attacker with any valid certificate, including one for a domain they legitimately own, intercepts a connection from a client that validates the chain and never compares the name. The chain is genuinely trusted, so nothing looks wrong at any layer, and the client has completed a secure handshake to the wrong party.",
  experiment: "Pick one client in your estate that makes outbound TLS connections. Point it at a host presenting a valid certificate for a different name and see whether it refuses. If you cannot arrange that, read the client code for whether the name check is enabled, and check the library default rather than assuming it. Twenty minutes.",
  reflection: "For the clients you could not test, is the reason technical, or is it that nobody owns the outbound side of that connection?",
  recall: {
    q: "What are the two independent halves of certificate validation, and why does passing one tell you nothing about the other?",
    a: "Chain validation, which asks whether an authority in your trust store vouches for the certificate. Name verification, which asks whether the certificate covers the host you intended to reach.\n\nThey fail independently. A fully trusted certificate belonging to someone else passes the first and fails the second, which is precisely what an attacker able to obtain any valid certificate holds. Testing against a correctly configured server passes a broken name check."
  },
  deepDive: "Review the TLS client configuration I paste in and tell me whether hostname verification is genuinely enabled, naming the library default it relies on."
},
{
  id: "tls-verify-false",
  track: "tls", level: "policy",
  title: "One line disables the whole thing, and it is the most common security defect in application code",
  source: "Georgiev and others, The Most Dangerous Code in the World, ACM CCS, 2012",
  cheat: "Grep for verify=False, InsecureSkipVerify, rejectUnauthorized:false and -k. Every hit is an unauthenticated channel that logs as encrypted.",
  idea: "Every TLS library exposes a flag that turns off verification while leaving encryption on, which produces a connection that looks secure in every log and authenticates nobody.",
  why: "The flag exists for a real reason: you need it to talk to a development server with a self-signed certificate. What makes it a systemic defect is the failure mode. Turn off verification and everything works. The connection succeeds, the payload is encrypted, monitoring records TLS, and the only thing missing is the property that made the encryption worth having. There is no error, no warning and no metric that changes. So the flag gets added during local development to unblock somebody, and it ships, and nothing ever surfaces it again.\n\nThe second reason it persists is that the alternative is more work in exactly the moment when you have the least patience for it. Doing it properly means adding the internal authority to a trust store, or issuing a real certificate for the development host. Both are five minutes of work that feel like an hour when you are trying to reproduce a bug. This is a psychological acceptability problem more than a knowledge problem, which is why finding these by grep is the reliable approach rather than expecting people to stop writing them.",
  failureMode: "An attacker on any part of the network path between the two services intercepts the connection, presents any certificate at all including a self-signed one generated on the spot, and reads and rewrites everything. The client accepts it because it was told not to check. Both ends report a healthy encrypted connection for the entire duration.",
  experiment: "Grep your codebase and configuration for the whole family: verify=False, InsecureSkipVerify, rejectUnauthorized set to false, CURLOPT_SSL_VERIFYPEER off, the -k and --insecure flags in scripts, and any custom trust manager that accepts everything. For each hit, decide whether it is a test fixture or a live path. Fifteen minutes, and the live ones are today's findings.",
  reflection: "For each live hit, what would it actually take to do it properly, and is that work owned by anyone?",
  recall: {
    q: "Why is disabling certificate verification a worse defect than it appears, given the traffic is still encrypted?",
    a: "Because encryption without authentication protects the payload from a passive observer and not at all from anyone able to sit in the path, and there is no signal that anything is wrong. The connection succeeds, monitoring records TLS, and no error or metric changes.\n\nIt persists because the flag is genuinely needed for development against self-signed certificates, and the correct alternative costs a few minutes at the moment of least patience. Finding these by grep is more reliable than expecting them not to be written."
  },
  deepDive: "Search a codebase I describe for every way TLS verification can be disabled in the languages it uses, and help me sort the hits into test fixtures and live paths."
},
{
  id: "tls-validation-is-three-things",
  track: "tls", level: "wire",
  title: "Validation is chain building, name checking and revocation, and almost nobody does the third",
  source: "RFC 5280, Internet X.509 Public Key Infrastructure Certificate and CRL Profile, 2008",
  idea: "A full validation walks a chain to a trusted root, checks the name, and checks that nothing in the chain has been revoked, and the last of those is usually skipped silently.",
  why: "Chain building is more work than it sounds: the server sends a set of certificates that may be incomplete, out of order or contain extras, and the client has to construct a path to something it trusts, checking validity dates, key usage constraints and path length at every step. Name checking is the separate step covered elsewhere in this track. Revocation is the one that gets dropped, because the mechanisms for it are slow, sometimes unavailable, and fail in a direction nobody likes.\n\nThat direction is the whole problem. If a client cannot reach the revocation service, it either fails the connection or proceeds. Failing means an outage in the revocation infrastructure becomes an outage in your application, which is unacceptable to operators, so almost every real deployment proceeds. That is called soft-fail, and it means an attacker who can block the revocation check can use a revoked certificate, which is precisely the attacker who has stolen a key and had it revoked. Knowing this is why the industry moved to short-lived certificates instead: not because revocation was fixed, but because it was not going to be.",
  failureMode: "An attacker who stole a private key, and whose certificate was duly revoked, continues to use it. The clients are configured to check revocation, but soft-fail, and the attacker who is already positioned to intercept the connection is equally able to block the small side request that would have checked. Revocation happened, was correct, and had no effect.",
  experiment: "Pick one client and find out what it does when the revocation endpoint is unreachable. Read the library documentation for the default, because it is almost never in your code. Then find out whether stapling is configured on your own servers. Twenty minutes, and the useful output is the words hard-fail or soft-fail written next to each client.",
  reflection: "Given soft-fail is the operationally sane default, what is your actual plan for a stolen key, and does it involve revocation at all?",
  recall: {
    q: "What are the three parts of certificate validation, and why is the third routinely skipped?",
    a: "Building a trusted chain, checking the name, and checking revocation. Chain building has to construct a path from a possibly incomplete or misordered set, checking dates, key usage and path length at each step.\n\nRevocation is skipped because a client unable to reach the revocation service must either fail the connection, turning revocation-infrastructure outages into application outages, or proceed. Almost everything proceeds, and an attacker positioned to intercept can also block the check. Short-lived certificates replaced revocation for this reason."
  },
  deepDive: "Tell me what my TLS clients do when revocation checking is unreachable, and whether short certificate lifetimes would give me a better answer than fixing revocation."
},
{
  id: "tls-trust-store-is-the-policy",
  track: "tls", level: "policy",
  title: "Your trust store is the policy, and you did not choose most of it",
  source: "RFC 5280, on trust anchors, read against what actually ships in an operating system trust store",
  cheat: "Any authority in your trust store can issue for any name you connect to. Count the entries, then count the ones you need.",
  idea: "Any certificate authority in your trust store can issue a valid certificate for any name, so the security of every TLS connection is bounded by the least trustworthy entry in a list you inherited.",
  why: "This is the structural weakness of the model and it is worth understanding rather than worrying about. Trust is not scoped by name: an authority operated in one jurisdiction can issue for a domain in another, and clients will accept it, because the model has no notion of which authority is supposed to be responsible for which name. Your operating system or language runtime ships with a list of them, curated by somebody else, updated by somebody else, typically over a hundred entries long.\n\nWhat makes this actionable rather than fatalistic is that the list is yours to narrow, and for internal traffic it should be extremely short. A service that only ever talks to your own internal endpoints needs exactly one trust anchor, your own, and gains nothing from the public list except exposure. That is the whole argument for a private authority for internal traffic: not that public authorities are untrustworthy, but that a hundred of them are irrelevant to a connection between two of your own services, and each one is a way for that connection to be intercepted by somebody who can obtain a certificate.",
  failureMode: "An attacker obtains a certificate for one of your internal hostnames from any of the authorities in your clients' trust stores, whether by compromising it, by social engineering its validation process, or because it was compelled. Every internal client accepts it. Nothing in your infrastructure was touched, and the connection is intercepted with a certificate that validates cleanly.",
  experiment: "Count the trust anchors in one running container image. Then take one internal service and ask how many of those it actually needs to reach the endpoints it talks to. The gap between those two numbers is the exposure you are carrying for no benefit. Fifteen minutes.",
  reflection: "Is there a class of workload in your estate that only ever makes internal connections, and what would it cost to give it a trust store with one entry?",
  recall: {
    q: "Why is a large trust store a security problem rather than a convenience?",
    a: "Because trust is not scoped by name. Any authority in the store can issue a valid certificate for any host you connect to, so the security of every connection is bounded by the least trustworthy of the hundred-plus entries you inherited from your operating system or runtime.\n\nIt is actionable because the list is yours to narrow. A workload that only reaches internal endpoints needs one anchor, your own, and gains nothing from the public list except more parties who can have your connections intercepted."
  },
  deepDive: "Help me work out which workloads in an estate I describe could run with a private trust store containing only our own authority, and what would break."
},
{
  id: "tls-self-signed-is-absent-identity",
  track: "tls", level: "wire",
  title: "A self-signed certificate is not weaker cryptography, it is an absent identity claim",
  source: "RFC 5280, on trust anchors and path validation",
  idea: "Self-signed certificates use exactly the same algorithms and key sizes as any other, and what they lack is a third party asserting that the key belongs to that name.",
  why: "The phrase sounds like a quality grade and is not. The encryption is identical. What differs is the chain: a self-signed certificate is its own issuer, so validating it means deciding to trust that specific key directly rather than deriving trust from an anchor. That is a policy decision, not a defect, and in some designs it is the stronger option, because trusting exactly one key is narrower than trusting a hundred authorities.\n\nWhich is why the interesting distinction is not signed against self-signed, but pinned against unpinned. A self-signed certificate whose exact key is distributed to clients out of band and required by them is a strong arrangement with a small trust base. The same certificate accepted by clients that skipped verification is worthless. Both are described as using a self-signed certificate, and they are opposite ends of the range. The word tells you about the issuer field and nothing about the security of the deployment.",
  failureMode: "A team is told self-signed certificates are insecure, so they turn off verification to make the connection work rather than distributing the certificate to clients. The change is recorded as accepting the self-signed certificate. It is not: it accepts every certificate, including an attacker's, and it took the one arrangement that would have been strong and made it maximally weak.",
  experiment: "Find one internal service using a self-signed certificate. Determine which of the two situations you are in: is that specific certificate distributed to and required by its clients, or did the clients stop checking? Ten minutes, and the answer is usually the second.",
  reflection: "Where in your estate would trusting exactly one key be a better arrangement than trusting the public authority list, and what stops you doing it?",
  recall: {
    q: "What does self-signed actually mean, and what is the distinction that matters more?",
    a: "That the certificate is its own issuer, so trusting it means trusting that specific key directly rather than deriving trust from an anchor. The cryptography is identical to any other certificate.\n\nThe distinction that matters is pinned against unpinned. A self-signed certificate distributed out of band and required by clients is strong with a very small trust base. The same certificate accepted by clients that stopped verifying is worthless, and both get described the same way."
  },
  deepDive: "For an internal service I describe, compare distributing its self-signed certificate to clients against issuing from a private authority, and tell me which is less work to operate."
},
{
  id: "tls-mutual-is-the-only-network-client-identity",
  track: "tls", level: "wire",
  title: "Mutual TLS is the only client identity that lives at the transport layer",
  source: "RFC 8446, on client certificate authentication",
  cheat: "Mutual TLS authenticates the connection, not the request. A pooled connection carries one client identity for every request on it.",
  idea: "Mutual TLS makes the client present a certificate too, which gives you a cryptographic client name before any application bytes are exchanged, and that is a property no bearer token can offer.",
  why: "The asymmetry of ordinary TLS is that the server proves a name and the client proves nothing, so client identity has to be established afterwards, in the application, usually with a token in a header. Mutual authentication moves it into the handshake. The consequences are worth being precise about. The identity is bound to possession of a private key rather than to a copyable string, so it does not replay: an attacker who reads a request off a log or out of memory gets a token they can reuse and a certificate they cannot. And it is established before the first application byte, so a service can refuse unknown clients without parsing anything.\n\nWhat it does not give you is granularity. The identity belongs to the connection, not the request, and connections are pooled and reused. Every request multiplexed onto one connection carries the same client name, so mutual TLS answers which workload is calling and never which user. That is why it composes with application tokens rather than replacing them: the certificate says which service, the token says on whose behalf, and a design that uses one for both questions is answering one of them wrongly.",
  failureMode: "An attacker who has stolen a service token from a log or a process replays it from anywhere and is accepted, because possession is the whole test. The same attacker with a stolen mutual TLS identity needs the private key too, and if that key is non-exportable or short-lived, the theft is worth much less. Teams that use only the token have made the first case their threat model without noticing.",
  experiment: "Pick one internal service-to-service call. Write down what identifies the caller at the transport layer and what identifies it at the application layer. If the transport answer is nothing, work out what a stolen token from that path would let somebody do and from where. Fifteen minutes.",
  reflection: "For your highest-value internal path, would mutual TLS have changed the outcome of a token leak, and what is the operational cost you would be buying that with?",
  recall: {
    q: "What does mutual TLS give you that a bearer token cannot, and what can it not answer?",
    a: "A client identity bound to possession of a private key rather than a copyable string, established during the handshake before any application bytes, so it does not replay and unknown clients can be refused without parsing anything.\n\nIt cannot answer granularity. The identity belongs to the connection, and connections are pooled, so every request on one carries the same client name. It says which workload is calling, never which user, so it composes with application tokens rather than replacing them."
  },
  deepDive: "For the service-to-service paths I describe, tell me which would meaningfully benefit from mutual TLS and which are already covered by application tokens."
},
{
  id: "tls-termination-is-a-boundary-choice",
  track: "tls", level: "policy",
  title: "Where you terminate is a trust decision, and re-encrypting does not undo it",
  source: "RFC 8446, read alongside how load balancers are actually configured",
  cheat: "Every termination point holds plaintext and joins your trust boundary. Re-encrypting to the backend does not remove it.",
  idea: "Terminating TLS anywhere gives that component the plaintext, and starting a new TLS connection onward does not retract the access it already had.",
  why: "There are three common arrangements and they are not variations of one thing. Passthrough sends the encrypted stream to the backend, so the intermediary sees addresses and the server name and nothing else, and cannot route on anything above layer four. Termination decrypts at the intermediary and forwards in the clear, which is fast, simple and puts every hop after that point inside your boundary. Re-encryption decrypts, inspects or routes, then opens a fresh connection to the backend, which protects the second hop from observers and does nothing at all about the intermediary itself.\n\nThe last point is where people get it wrong, because re-encryption is described as end-to-end encryption in most product documentation and it is not: there are two ends and the middle read everything. That is a legitimate trade, made in exchange for routing on paths, inspecting requests or applying a policy you could not otherwise express, and it should be made deliberately rather than inherited from a template. The question to ask of any deployment is simply how many components hold this plaintext, and the answer must include every managed service doing the terminating and everyone who can change its configuration.",
  failureMode: "An attacker compromises a load balancer that is configured to re-encrypt, which the team describes as encrypted end to end. It holds every request in the clear, including bearer tokens, and can be reconfigured to copy them elsewhere without touching a single application. Both TLS connections remain valid throughout.",
  experiment: "For one service, determine which of the three arrangements is in use. Then list every component between client and application that holds plaintext, including the managed ones. Compare that list against what the architecture documentation implies. Fifteen minutes.",
  reflection: "For the components you found, which are there because somebody needed a layer seven rule, and which are there because the template did it that way?",
  recall: {
    q: "What are the three TLS termination arrangements, and what is wrong with calling re-encryption end to end?",
    a: "Passthrough, where the intermediary forwards the encrypted stream and can route only on addresses and the server name. Termination, where it decrypts and forwards in the clear. Re-encryption, where it decrypts and opens a fresh connection onward.\n\nRe-encryption is not end to end because the middle read everything: it protects the second hop from observers while giving the intermediary full plaintext. That is a legitimate trade for layer seven routing or inspection, but it must be counted as a component inside the trust boundary."
  },
  deepDive: "For a load balancer configuration I paste in, tell me which termination arrangement it is and everything that consequently holds plaintext."
},
{
  id: "tls-sni-and-alpn-in-the-clear",
  track: "tls", level: "wire",
  title: "The hostname goes out in the clear before encryption starts, and that is what your policy matches on",
  source: "RFC 6066, Transport Layer Security Extensions, 2011, on server name indication",
  idea: "The client announces which host it wants in the first unencrypted message of the handshake, which is simultaneously a privacy leak and the only hostname a network control can see.",
  why: "Server name indication exists because one address serves many names and the server has to know which certificate to present before it can encrypt anything. So the name travels in plaintext in the client hello, along with the protocol list in the application layer protocol negotiation extension. Anybody on the path sees which host you are reaching, even though everything after that is protected.\n\nThat leak is also the entire basis of hostname-aware network policy. A firewall or proxy that filters egress by hostname without terminating TLS is reading this field, which has two consequences worth holding. First, it works, and it is much better than filtering by address, because addresses move and are shared. Second, it is a claim by the client rather than a verified fact, so a client under an attacker's control can send one name and connect to a server presenting a certificate for another, and a control that reads only the extension has been told a story. Encrypted variants of the extension close the privacy leak and take the control away at the same time, which is a real tension rather than a straightforward improvement.",
  failureMode: "An attacker on a compromised workload sends a server name your egress policy allows while connecting to infrastructure that serves whatever they want. The proxy permits the connection on the strength of the announced name and never verifies that the certificate presented matches it, so the allowlist was defeated by filling in a text field.",
  experiment: "Find where your egress policy filters by hostname and determine whether it also verifies the certificate presented against the name announced. Then check whether encrypted server name indication is enabled anywhere in your clients, because if it is, that control is already blind. Twenty minutes.",
  reflection: "If encrypted server name indication becomes the default in your client libraries, which of your network controls stops working, and what replaces it?",
  recall: {
    q: "Why does the hostname travel unencrypted, and what does that mean for hostname-based network policy?",
    a: "Because one address serves many names, so the server must know which certificate to present before it can encrypt. The name goes out in plaintext in the client hello, along with the protocol list.\n\nThat plaintext field is what hostname-aware egress filtering reads, which is much better than filtering by address. But it is a client claim rather than a verified fact: a malicious client can announce an allowed name and connect elsewhere unless the control also checks the certificate presented. Encrypting the extension fixes the privacy leak and removes the control."
  },
  deepDive: "Tell me whether my egress hostname filtering verifies the presented certificate against the announced name, and what encrypted server name indication would do to it."
},
{
  id: "tls-13-removed-the-downgrades",
  track: "tls", level: "wire",
  title: "Version 1.3 deleted the negotiable parts, which is why the downgrade attacks stopped",
  source: "RFC 8446, on the removal of legacy algorithms and renegotiation",
  idea: "Most historical TLS attacks exploited the protocol's flexibility rather than its cryptography, and the newest version fixed them mainly by removing options.",
  why: "A protocol that negotiates its own parameters gives an attacker in the path something to influence. The pattern behind a long list of named attacks is the same: force the negotiation toward something weak that both ends still support for compatibility, then attack that. Export-grade ciphers, static key exchange, compression, renegotiation and a long tail of block cipher padding constructions were all supported for the sake of old clients, and each was a route in.\n\nThe fix was subtraction. The newest version removed the weak ciphers rather than deprecating them, made forward secrecy mandatory rather than optional, dropped compression and legacy renegotiation, and encrypted more of the handshake so there is less for a path attacker to read or influence. The lesson generalises past TLS: a negotiable security parameter is an attack surface, and configurability that exists for compatibility with things you no longer support is pure liability. Which is also why the practical action here is a version and cipher inventory rather than a deep understanding of any single attack.",
  failureMode: "An attacker in the path exploits a server that still accepts an old version for the sake of one legacy client, and steers a modern client down to it. Both endpoints are capable of something strong. What decides the outcome is the weakest thing the server would agree to, and it agreed to it for a compatibility reason nobody has revisited in years.",
  experiment: "Inventory the minimum TLS version and the cipher list your public and internal endpoints actually accept, and check what is enabled rather than what the policy document says. For anything below the current version, find out which client that exists for and whether that client is still real. Twenty minutes.",
  reflection: "For each legacy option you found, is there a named system that needs it, or is it there because nobody has been willing to be the person who broke something?",
  recall: {
    q: "What class of weakness did TLS 1.3 mainly address, and how?",
    a: "Downgrade and negotiation attacks, which exploited the protocol's flexibility rather than its cryptography by steering both ends toward something weak that each still supported for compatibility.\n\nIt addressed them by subtraction: removing weak ciphers outright rather than deprecating them, making forward secrecy mandatory, dropping compression and legacy renegotiation, and encrypting more of the handshake. A negotiable security parameter is an attack surface, and compatibility options for systems you no longer support are pure liability."
  },
  deepDive: "Given the TLS versions and ciphers my endpoints accept, tell me which legacy options are still enabled and what would break if I removed each one."
},
{
  id: "tls-resumption-is-a-cached-decision",
  track: "tls", level: "wire",
  title: "Session resumption is a cached authentication, with all the properties of a cache",
  source: "RFC 8446, on pre-shared keys and session tickets",
  idea: "Resumption lets a client skip the full handshake by presenting a ticket from a previous one, which means the authentication in force is the one from the earlier connection rather than a fresh check.",
  why: "The full handshake is expensive, so both versions of the protocol let a client resume: present a ticket or a pre-shared key, skip the certificate exchange, and start sending. That is a real performance win and it is also a decision made earlier and replayed. The certificate that authenticated the server may since have expired, or been revoked, or been replaced because the key was stolen, and a resumed session does not notice any of that until the ticket lifetime runs out.\n\nSo ticket lifetime is a security parameter, and it belongs in the same mental bucket as token lifetime and policy cache duration: the length of time a decision made in the past continues to be honoured. It is also worth knowing that the ticket is a credential in its own right. Anything that can steal a session ticket can resume that session, which makes ticket storage and the key that encrypts tickets things worth protecting. And on the server side, a ticket encryption key that is never rotated undermines forward secrecy for every session it covers, which is one of the quieter misconfigurations in the area.",
  failureMode: "An attacker who has stolen a server's private key has it revoked and a new certificate issued. Clients with unexpired session tickets continue resuming against infrastructure the attacker controls, presenting no certificate at all because resumption skips that step. The revocation was correct and the resumption path routed around it.",
  experiment: "Find the session ticket lifetime configured on one of your public endpoints, and find out whether the ticket encryption key is rotated and how often. Write both numbers down. Fifteen minutes, and if nobody knows the second one it is almost certainly never.",
  reflection: "Does your ticket lifetime appear anywhere in your thinking about how quickly a compromised certificate stops being usable?",
  recall: {
    q: "What is the security consequence of session resumption, and what makes ticket handling itself sensitive?",
    a: "The authentication in force is the one from an earlier connection, replayed. A certificate that has since expired, been revoked or been replaced after key theft is not re-checked until the ticket lifetime expires, so that lifetime is a security parameter.\n\nThe ticket is a credential: anything that steals one can resume the session. On the server, a ticket encryption key that is never rotated undermines forward secrecy for every session it covers."
  },
  deepDive: "Help me find the session ticket lifetimes and key rotation settings across the endpoints I describe, and tell me what they add to my worst-case certificate revocation window."
},
{
  id: "tls-pinning-trades-revocability",
  track: "tls", level: "policy",
  title: "Pinning narrows the trust store to one entry and strands you when that entry changes",
  source: "RFC 7469, Public Key Pinning Extension for HTTP, 2015, and the reasons it was deprecated",
  idea: "Pinning requires a specific key or certificate rather than anything a trusted authority signed, which removes the hundred-authority exposure and replaces it with an operational commitment you may not be able to keep.",
  why: "The security argument is straightforward and strong: if a client only accepts one specific key, then no authority anywhere can issue a certificate that intercepts it. For a mobile application talking to its own backend, that closes the entire class of attack in this track that depends on obtaining a valid certificate from somewhere.\n\nThe cost is that you have made key rotation a coordinated release. The pin lives in the client, the key lives on the server, and if they diverge the client cannot connect and cannot be told anything, because the channel it would be told over is the one that is broken. That failure is total and unrecoverable for clients you cannot push to, which is why the browser-based version of this was deprecated after real sites bricked themselves. The pattern that survived is pinning with a backup pin held offline, a short pin lifetime, and pinning to an intermediate rather than a leaf. Which is to say: pinning is fine where you control both ends and can rotate them together, and a trap where you cannot.",
  failureMode: "There is no attacker in the common failure here, which is why it is worth stating. A certificate is rotated on schedule, the pin in a deployed client was not updated, and every one of those clients loses the ability to reach the service at all. The recovery path is a client update, distributed over a channel that requires the connection that no longer works.",
  experiment: "Find any pinning in your estate, including in mobile clients and internal agents. For each, answer two questions: what is the rotation procedure, and has it been rehearsed. If the answer to the second is no, that pin is an outage waiting for a certificate expiry date you already know. Fifteen minutes.",
  reflection: "Where you are not pinning, is that a decision or a default, and does the exposure it leaves you matter for that particular client?",
  recall: {
    q: "What does pinning buy, and what is the cost that got the browser version deprecated?",
    a: "It removes the exposure to every authority in the trust store: only one specific key is accepted, so nobody can intercept with a validly issued certificate.\n\nThe cost is that rotation becomes a coordinated release of client and server, and divergence is a total failure that cannot be repaired over the broken channel. Real sites bricked themselves, which is why the surviving pattern is a backup pin held offline, short pin lifetimes, pinning to an intermediate, and only where you control both ends."
  },
  deepDive: "For a client and backend I describe, tell me whether pinning is worth it, and if so design the rotation procedure including the backup pin."
},
{
  id: "tls-expiry-is-an-availability-control",
  track: "tls", level: "ops",
  title: "Certificate expiry causes far more outages than it prevents compromises",
  source: "RFC 5280, on validity periods, read against what actually takes services down",
  cheat: "Alert on days remaining, not on expiry. An expiry that pages you on the day it happens is a control that has already failed.",
  idea: "The validity period is a security mechanism that bounds how long a compromised key stays useful, and in practice its dominant effect on any given estate is scheduled downtime.",
  why: "The security purpose is real. A certificate with a fixed lifetime limits how long a stolen key works without anybody having to detect the theft or operate a revocation system, which is the same reasoning that produced short-lived credentials everywhere else. Shorter is better on that axis, and the industry has been steadily shortening it.\n\nThe operational consequence is that every certificate is a scheduled outage unless something renews it. Expiry is the ideal failure: totally predictable, precisely dated, and it still takes down services regularly, because renewal is manual somewhere, or automated for the public endpoints and not the internal ones, or automated but the reload step was missed so the process holds an old certificate in memory long after the file changed. That last one is the version that defeats monitoring, because the file on disk is current and the served certificate is not. As lifetimes get shorter this stops being survivable by hand, which makes automated issuance and renewal a reliability requirement rather than a convenience.",
  failureMode: "Nobody attacks anything. An internal certificate that no inventory covered expires at three in the morning, mutual TLS between two services starts failing closed, and the outage is diagnosed as a network fault for the first forty minutes because the error surfaces as a connection failure rather than as anything mentioning a certificate.",
  experiment: "Build the inventory: every certificate in the estate, its expiry, and what renews it. Include internal ones, client certificates, and anything in a container image. Then check one renewed service to see whether the process actually reloaded, by comparing the served certificate against the file on disk. Thirty minutes, and an incomplete inventory is itself the finding.",
  reflection: "Which certificates in your estate are renewed by a person, and what happens to those when lifetimes shorten again?",
  recall: {
    q: "What is the security purpose of certificate expiry, and what is its dominant practical effect?",
    a: "It bounds how long a stolen key remains useful without anybody detecting the theft or operating revocation, which is why lifetimes keep shortening.\n\nIts dominant practical effect is scheduled downtime, because renewal is manual somewhere, or covers public endpoints but not internal ones, or renews the file without reloading the process, which defeats file-based monitoring since the served certificate and the file disagree."
  },
  deepDive: "Help me design a certificate inventory and renewal check for the estate I describe, including how to detect a process serving an older certificate than the one on disk."
},
{
  id: "tls-transparency-is-a-monitorable-log",
  track: "tls", level: "ops",
  title: "Certificate transparency turned issuance into a public log you can watch",
  source: "RFC 6962, Certificate Transparency, 2013",
  idea: "Publicly trusted certificates are recorded in append-only logs, which means anybody can detect a certificate issued for their domain, including one they did not request.",
  why: "The model has no way to stop an authority issuing for a name it should not, so transparency attacks the problem from the other side: make every issuance visible, so misissuance is detectable after the fact rather than invisible forever. Browsers now require evidence of logging before they will accept a certificate, which makes the logs close to complete for publicly trusted issuance.\n\nThe consequence worth acting on is that you can monitor your own namespace for free, and almost nobody does. A certificate appearing for a hostname in your domain that no team requested is a high-signal event: it means either shadow infrastructure somebody stood up outside your process, or misissuance. Both are worth knowing about within hours. The second consequence points the other way and catches people out: the logs are public and they include your hostnames. Every internal service name that has ever been given a publicly trusted certificate is in a searchable public record, which is free reconnaissance for anybody mapping your estate, and it is a reason to use a private authority for internal names rather than a public one.",
  failureMode: "An attacker enumerates a target's internal service names by searching the public logs, with no packets sent to the target at all. Names like the staging admin console and the internal metrics endpoint are in there because somebody found it convenient to get a publicly trusted certificate for them, and each one is now a hostname worth trying.",
  experiment: "Search the public logs for your own domain and read the list. Look for two things: hostnames you did not know existed, and internal-sounding names that should never have been public. Twenty minutes, and both findings are actionable the same day.",
  reflection: "Of the names you found, how many were issued outside your normal process, and does anybody get alerted when a new one appears?",
  recall: {
    q: "What does certificate transparency provide, and what does it cost you?",
    a: "Public append-only logs of publicly trusted issuance, which browsers require evidence of, so misissuance for your domain becomes detectable after the fact and monitorable by anybody, including you.\n\nThe cost is that your hostnames are in a public searchable record. Any internal service name ever given a publicly trusted certificate is free reconnaissance for somebody mapping your estate, which is an argument for a private authority for internal names."
  },
  deepDive: "Help me set up certificate transparency monitoring for my domains, and tell me what to do about internal hostnames already in the public logs."
},
{
  id: "tls-revocation-does-not-scale",
  track: "tls", level: "policy",
  title: "Revocation never worked at scale, so lifetimes got shorter instead",
  source: "RFC 6960, Online Certificate Status Protocol, and the operational reasons it was bypassed",
  idea: "Every mechanism for telling clients that a certificate is no longer valid failed on latency, availability or privacy, and the industry answer was to make certificates expire fast enough that revocation matters less.",
  why: "The history is instructive because it is a design pattern rather than a story about certificates. Lists of revoked certificates grew too large to distribute. Asking an online responder per connection added a round trip to a third party, leaked which sites a user visited, and turned the responder into a dependency for every connection, which forced soft-fail. Stapling fixed the latency and privacy by having the server carry a recent signed status, but a server that omits it faces a client that must decide whether to insist, and insisting means outages.\n\nSo the resolution was to shorten validity. A certificate that lives for a matter of days is its own revocation mechanism: a stolen key expires before it can be used much, and no client needs to check anything. That is only possible with fully automated issuance and renewal, which is what actually changed in the last decade. The generalisable lesson is that a revocation mechanism nobody can afford to hard-fail on is decoration, and the reliable way to bound a stolen credential is to make credentials short-lived rather than to build machinery for withdrawing long-lived ones.",
  failureMode: "An attacker with a stolen key uses it after revocation. Clients configured to check are soft-failing; the attacker positioned to intercept can also block the status request. The revocation record is correct and public and has no effect on any connection, which is why an estate that treats revocation as its answer to key theft does not have an answer.",
  experiment: "Write down your actual answer to the question: a private key of ours is stolen today, what stops it being used. If the answer is revocation, check whether your clients hard-fail, and if they do not, the honest answer is the certificate lifetime. Ten minutes.",
  reflection: "Which of your certificates have lifetimes short enough to be their own revocation, and what stops the rest from getting there?",
  recall: {
    q: "Why did certificate revocation fail in practice, and what replaced it?",
    a: "Revocation lists grew too large to distribute; online status checks added latency, leaked browsing to a third party and became an availability dependency that forced soft-fail; stapling helped but left clients unable to insist without causing outages.\n\nShort validity periods replaced it. A certificate lasting days is its own revocation, requiring no client check, which is only possible with fully automated issuance and renewal. A mechanism nobody can afford to hard-fail on is decoration."
  },
  deepDive: "Tell me what actually bounds the usefulness of a stolen private key in the estate I describe, and what it would take to get to lifetimes short enough that revocation stops mattering."
},
{
  id: "tls-certificate-is-not-authorisation",
  track: "tls", level: "policy",
  title: "Using the certificate subject as an application identity is a category error with a long tail",
  source: "RFC 5280, on subject naming, read against how mutual TLS deployments actually do authorisation",
  cheat: "Map certificate subjects to internal identifiers at one place, and never let a subject string reach application logic as an identity.",
  idea: "A certificate says a party holds a key for a name, and turning that name into an authorisation decision requires an explicit mapping that most deployments write inline, in string comparisons, in many places.",
  why: "Once mutual TLS is working, the subject or the alternative names are the only identity available, so they get used directly. The pattern that emerges is string matching on distinguished names spread across services, and it goes wrong in the ordinary ways string matching does. Distinguished name formatting varies by library, ordering of components is not guaranteed to be stable, comparison is case-sensitive in some places and not others, and a suffix match intended to accept a namespace accepts anything ending that way. Each is a small bug in a place where the answer is a permission.\n\nThe structural fix is a single translation step: verify the certificate, extract exactly one field by an explicit rule, map it to an internal identifier through one table, and let everything downstream use the identifier. That is a small piece of code but it is the difference between one reviewable place where identity is decided and dozens of comparisons nobody can enumerate. It also makes rotation and renaming survivable, because the mapping is data rather than being distributed through conditionals in every service that happens to care.",
  failureMode: "An attacker obtains a legitimate certificate from your own internal authority for a low-privilege workload whose name happens to end with the same suffix a service is matching on. The check was written as a suffix comparison to accept a family of related workloads, so the attacker's certificate is valid, correctly issued and authorised for something it was never meant to reach.",
  experiment: "Grep for every place a certificate subject or alternative name is compared to a string. Count the sites and note the comparison style: exact, prefix, suffix, or a regular expression. Any suffix or pattern match is today's finding. Fifteen minutes.",
  reflection: "If you had to rename one internal workload tomorrow, how many places would need to change, and what does that number say about where identity is actually decided?",
  recall: {
    q: "What goes wrong when the certificate subject is used directly as an application identity?",
    a: "It becomes string matching on distinguished names spread across services, subject to library formatting differences, unstable component ordering, inconsistent case sensitivity, and suffix matches that accept more than intended. Every one of those is a small bug in a place where the answer is a permission.\n\nThe fix is one translation step: verify, extract one field by an explicit rule, map it through a single table to an internal identifier, and let downstream code use only the identifier. That makes identity decisions reviewable in one place and renames survivable."
  },
  deepDive: "Find every place certificate subjects are compared as strings in a codebase I describe, and help me design the single mapping table that should replace them."
}
);

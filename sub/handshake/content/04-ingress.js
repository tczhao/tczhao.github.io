/* Track: Ingress. Ordered foundational first.
 *
 * The edge is the one place in the estate where a request can be refused
 * before it costs anything, and it is also the component that holds the most
 * plaintext, terminates the most connections and gets reviewed least, because
 * it is usually somebody else's product. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "ingress-edge-is-where-no-is-cheap",
  track: "ingress", level: "policy",
  title: "The edge is the last place where refusing costs you nothing",
  source: "NIST SP 800-41 Rev. 1, on the placement of firewall and filtering functions",
  cheat: "Anything you can refuse at the edge, refuse at the edge. Past it, every rejection has already spent a connection, a thread and a query.",
  idea: "Work is cheapest to refuse at the first component that can decide, because every hop past it commits resources that a rejection later cannot recover.",
  why: "A request that reaches the application has already consumed a connection slot at the edge, a connection to the backend, a thread or coroutine, and often a database round trip to discover that the caller is not allowed. Refusing at the edge costs the parsing of a header. That ratio is what makes edge filtering the highest-leverage control available, and it is also why availability and security stop being separate concerns here: the same decision that blocks an unauthorised request blocks the request that would have exhausted a pool.\n\nThe corollary is a rule about where policy belongs. If a decision can be made from information available at the edge, it should be made there even if the application also checks, because the application check is about correctness and the edge check is about cost. Method and path shape, unrecognised hostnames, absent authentication headers, requests to administrative routes from outside a known range: all decidable without touching the application. What cannot be decided there is anything requiring application state, which is the honest boundary of this argument and the reason the edge is a filter rather than an authorisation layer.",
  failureMode: "An attacker sends a high volume of requests that will certainly be rejected, to a path requiring a database lookup to reject. The rejections are all correct. Each one costs a connection, a worker and a query, and the service becomes unavailable to legitimate users while behaving exactly as designed, because the refusal happened at the most expensive possible point.",
  experiment: "Take the last authorisation failure you can find in your logs and trace how far the request travelled before being refused. Count the components and whether a database was touched. Then ask which of the checks along the way could have been made from headers alone. Fifteen minutes.",
  reflection: "For the checks that could move to the edge, what is stopping them, and is it a technical constraint or that the edge is owned by a different team?",
  recall: {
    q: "Why is the edge the right place to refuse work, and what is the limit of that argument?",
    a: "Because a request reaching the application has already spent a connection slot, a backend connection, a worker and often a database query, while an edge refusal costs the parsing of a header. The same decision that blocks unauthorised requests also blocks the ones that would exhaust a pool.\n\nThe limit is application state. Anything decidable from headers and paths belongs at the edge even if the application checks too, but anything needing application state cannot move there, which makes the edge a filter rather than an authorisation layer."
  },
  deepDive: "Look at the authorisation checks in a service I describe and tell me which could be made at the edge from headers alone, and what each would save."
},
{
  id: "ingress-add-and-strip-together",
  track: "ingress", level: "policy",
  title: "Every header your edge adds must be one it also strips on the way in",
  source: "RFC 7239, Forwarded HTTP Extension, 2014, on intermediary behaviour",
  cheat: "For every header the edge sets, add an inbound strip rule. If the backend trusts it and the client can set it, the client is trusted.",
  idea: "If the edge sets a header that backends trust, and does not remove any copy arriving from the client, then the client can set it and the backends will believe them.",
  why: "This is the mechanical half of the gateway trust problem and it deserves its own statement because the fix is a specific configuration line rather than an architectural change. The edge enriches requests: authenticated user, client address, tenant, geographic region, request identifier, whether the request arrived over TLS. Backends read these because the edge is trusted to set them. Nothing in that arrangement distinguishes a header the edge set from a header the client sent, unless the edge removes inbound copies first.\n\nWhat makes this a recurring defect rather than a one-time mistake is that the strip list has to be maintained alongside the set list, and they live in different places. A new header is added to the edge configuration by one team and read in the application by another, and the strip rule is a third thing that nobody's ticket mentioned. The reliable form is a default-deny approach to enrichment: strip the entire family of internal headers on ingress by prefix, then set the ones you mean. That way a new header is protected by an existing rule instead of needing a new one.",
  failureMode: "An attacker sends a request with an internal header claiming a privileged tenant, or claiming the request arrived over TLS when it did not, or carrying an authenticated username. The edge adds its own copy but does not remove the attacker's, and the backend reads whichever comes first. Authorisation logic that was written correctly is now operating on client-supplied input.",
  experiment: "List every header your edge sets for backends to consume. For each, send a request from outside with that header already populated and see what the backend receives. Twenty minutes, and any header that survives is today's finding.",
  reflection: "Is your enrichment protected by a prefix-based strip rule, or by a list somebody has to remember to update?",
  recall: {
    q: "What has to accompany every header the edge sets, and what is the robust way to arrange it?",
    a: "An inbound strip rule removing any copy the client sent, because nothing downstream can distinguish an edge-set header from a client-set one.\n\nThe robust arrangement is default-deny enrichment: strip the whole internal header family by prefix on ingress, then set the ones you mean. Maintaining a strip list in parallel with a set list fails because they live in different places and a new header arrives without anybody's ticket mentioning the strip rule."
  },
  deepDive: "Given the headers my edge sets, write the ingress strip configuration and tell me which are currently spoofable from outside."
},
{
  id: "ingress-host-header-routes",
  track: "ingress", level: "wire",
  title: "The host header decides where the request goes and the client wrote it",
  source: "RFC 9110, HTTP Semantics, on the Host header field",
  cheat: "Match the host header against an explicit allowlist at the edge. Anything unrecognised gets refused, not routed to a default.",
  idea: "Virtual hosting means one address serves many names and the routing decision comes from a header the client controls, so every host-based rule is a rule about attacker input.",
  why: "The header exists because a single listener serves many sites and needs to know which one is wanted. That makes it the routing key, and it is entirely client-supplied. Three consequences follow. Routing can be steered toward backends the client should not reach, if any host value maps somewhere. Applications that build absolute URLs from the header will emit links and redirects pointing wherever the attacker chose, which is how password reset links end up on somebody else's domain. And caches keyed without the host, or keyed on it inconsistently, can serve one site's response for another's request.\n\nThe control is an explicit allowlist at the edge: a fixed set of known names, everything else refused rather than routed. This is the same default-deny argument as everywhere else, and the reason it gets skipped is that a catch-all is what makes adding a new hostname painless. The tell is the same as always: if adding a hostname requires no change at the edge, then the edge is accepting hostnames it has never been told about, and one of them will route somewhere interesting.",
  failureMode: "An attacker sends a request with a host header naming an internal service, and the edge routes it there because its rules match on path with a permissive default for unrecognised hosts. Alternatively they trigger a password reset with a host header pointing at their own domain, and the application emails the victim a link to the attacker's site containing a valid token.",
  experiment: "Send requests to your edge with three host headers: a name you do not serve, an internal service name, and a name with a port or trailing dot appended. Note which are refused and which are routed. Then grep your application for anywhere the host header is used to construct a URL. Twenty minutes.",
  reflection: "Can a new hostname be added to your estate without touching the edge configuration, and if so what is currently accepting it?",
  recall: {
    q: "Why is the host header dangerous, and what are its three failure modes?",
    a: "Because it is the routing key for virtual hosting and it is entirely client-supplied. Routing can be steered to backends the client should not reach; applications that build absolute URLs from it emit links and redirects to attacker-chosen domains, which is how reset tokens leak; and caches keyed inconsistently on it serve one site's response for another's request.\n\nThe control is an explicit allowlist at the edge with unrecognised names refused rather than routed to a default."
  },
  deepDive: "Test how my edge handles unexpected host headers and find everywhere my application builds a URL from the host header."
},
{
  id: "ingress-client-ip-is-a-header-downstream",
  track: "ingress", level: "wire",
  title: "Past the edge, the client address is a header, and everything downstream believes it",
  source: "RFC 7239, on the loss of transport-level source information at an intermediary",
  idea: "Terminating a connection at the edge destroys the real source address for everything behind it, so the client address downstream is whatever the edge chose to write down.",
  why: "This is a mechanical consequence rather than a misconfiguration. The edge opens its own connection to the backend, so the backend's transport-level peer is the edge, and the original address survives only as data in a header. That is fine, and it is the reason the forwarded header exists. What matters is how many things downstream consume that data without knowing it is data.\n\nThe list is longer than people expect and it spans teams. Rate limiters count against it. Geographic and fraud rules read it. Audit logs record it, which means the forensic record of an incident is built from a header. Allowlists for administrative access compare against it. Session binding, where a session is tied to the address that created it, is enforced on it. Each was written by someone who thought they were reading a network fact. And because the value is correct in the honest case, none of them has ever produced a wrong answer in testing. The mitigation is to derive it once, at a single trusted point, with correct hop counting, and to make that derived value the only one anything else may read.",
  failureMode: "An attacker defeats a rate limiter by varying a header field, appears to come from a permitted country by setting one, and writes a false address into the audit log for every request, all with the same trick. The controls are all functioning. They are reading a string that the edge was supposed to have made trustworthy and did not.",
  experiment: "Count the distinct places in your stack that consume a client address: rate limiting, logging, allowlists, session binding, analytics, fraud rules. For each, find out whether it reads the header directly or a value derived once at a trusted point. Twenty minutes.",
  reflection: "If the derivation of client address is wrong, how many controls break at once, and would any of them tell you?",
  recall: {
    q: "Why does the client address become untrustworthy behind an edge, and what is the mitigation?",
    a: "Because the edge terminates the connection and opens its own to the backend, so the backend's transport peer is the edge and the original address survives only as header data.\n\nMany controls then read that data as if it were a network fact: rate limiters, geographic and fraud rules, audit logs, admin allowlists, session binding. The mitigation is to derive the value once at a single trusted point with correct hop counting, and make that derived value the only one anything else reads."
  },
  deepDive: "Find every consumer of the client address in a stack I describe and tell me which read the raw header rather than a value derived at a trusted point."
},
{
  id: "ingress-smuggling-needs-a-reused-connection",
  track: "ingress", level: "wire",
  title: "Request smuggling needs two parsers and one reused connection, and you control the second",
  source: "James Kettle, HTTP Desync Attacks, 2019",
  idea: "Smuggling works when the edge and the origin disagree about where one request ends, and the damage requires the connection between them to be reused for another client's request.",
  why: "The disagreement comes from having two ways to state a body length, so a request carrying both can be read as one request by the edge and as two by the origin, or the reverse. The leftover bytes sit at the front of the connection buffer. That alone is a parsing bug. What turns it into a serious attack is the second condition: the edge pools its connections to the origin and puts the next client's request onto the same one, where it gets appended to the attacker's leftover fragment. The attacker has prefixed somebody else's request.\n\nSeparating the two conditions is what makes this actionable, because both are addressable and they belong to different teams. The parsing half is fixed by having one component decide: reject any request that specifies its length twice, normalise before forwarding, and keep the edge and origin on the same protocol version so their parsers agree. The reuse half is fixed by not multiplexing different clients onto one upstream connection, which costs performance and eliminates the impact entirely. Knowing that reuse is a precondition also tells you where to look first, because an estate that does not reuse upstream connections has a parsing bug rather than a smuggling vulnerability.",
  failureMode: "An attacker sends a crafted request that leaves a fragment in the edge-to-origin connection buffer. The next legitimate request on that connection is appended to the fragment, so the victim's request is executed with the attacker's method, path and headers prefixed to it. The victim receives a response to something they did not send, and the attacker can capture their credentials by choosing what the prefix does.",
  experiment: "Determine whether your edge reuses upstream connections across different client requests, which is the default in most proxies. Then check whether your edge rejects requests specifying a body length two ways, and whether the edge and origin negotiate the same protocol version. Twenty minutes.",
  reflection: "Would disabling upstream connection reuse be affordable for your highest-value path, and has anybody ever priced it?",
  recall: {
    q: "What are the two conditions for request smuggling, and why does separating them help?",
    a: "The edge and origin disagree about where a request ends, usually because it states its length two ways; and the edge reuses its upstream connection for a different client's request, so the leftover fragment prefixes theirs.\n\nSeparating them gives two independent fixes owned by different teams: reject requests that specify length twice, normalise before forwarding and keep versions aligned; or stop multiplexing different clients onto one upstream connection, which removes the impact entirely. Without reuse it is a parsing bug rather than a smuggling vulnerability."
  },
  deepDive: "Tell me whether the edge and origin configuration I paste in is exposed to request smuggling, addressing the parsing and the connection reuse conditions separately."
},
{
  id: "ingress-downgrade-reintroduces-parsing",
  track: "ingress", level: "wire",
  title: "Translating a newer protocol down to an older one at the edge rebuilds the old bugs",
  source: "RFC 9113, HTTP/2, on the message translation to and from HTTP/1.1",
  idea: "An edge speaking a modern protocol to clients and an older one to backends has to translate, and the translation reintroduces the ambiguities the newer protocol removed.",
  why: "The newer protocols removed a class of ambiguity by design: lengths are framed rather than described in text, so there is no way for a message to state its own length twice or inconsistently. That is a real improvement and it lasts exactly as far as the first component that converts back. Translating a framed message into a text protocol means writing length headers, and if the framed message contained header values that look like framing instructions in the older protocol, the conversion can produce something the backend parses differently from what the edge understood.\n\nThe practical point is about topology rather than protocol detail. Most estates run the newest version at the edge because clients and search rankings want it, and the older version to backends because that is what the application server speaks. That arrangement is a translation boundary, and translation boundaries are where parser disagreements live. It is worth knowing simply so that the question gets asked: which version does the edge speak to clients, which to backends, and if those differ, what normalises the difference. An estate speaking the same version end to end has removed a class of bug and usually did not do it deliberately.",
  failureMode: "An attacker sends a request over the newer protocol containing header values crafted to become framing instructions once translated. The edge sees one well-formed framed request; the backend receives text it parses as two. Every check the edge applied was applied to its own reading of the request, which is not the reading the backend acted on.",
  experiment: "Find out which protocol version your edge speaks to clients and which it speaks to backends. If they differ, find out whether the edge validates header values against being interpretable as framing after translation. Fifteen minutes.",
  reflection: "Is the version difference between your edge and your backends a decision, or is it whatever each component defaulted to?",
  recall: {
    q: "Why is a protocol version difference between edge and backend a security concern?",
    a: "Because the newer protocols remove length ambiguity by framing messages rather than describing lengths in text, and translating back to a text protocol reintroduces it. Header values can be crafted so that after translation the backend parses a different message than the edge understood.\n\nMost estates have this boundary without deciding to, running the newest version at the edge for clients and an older one to application servers, so the useful question is which version each hop speaks and what normalises the difference."
  },
  deepDive: "Given the protocol versions between my clients, edge and backends, tell me where translation happens and what it should be normalising."
},
{
  id: "ingress-normalisation-disagreement",
  track: "ingress", level: "wire",
  title: "The edge and the origin must agree on what a path means, or authorisation is bypassable",
  source: "RFC 3986, Uniform Resource Identifier: Generic Syntax, 2005, on normalisation",
  cheat: "Normalise the path once at the edge and forward the normalised form. Two components normalising differently is an authorisation bypass.",
  idea: "If the edge applies a rule to one reading of a path and the origin serves a different reading of the same bytes, the rule can be satisfied and evaded by the same request.",
  why: "A path can be written many ways that are equivalent after normalisation and different before it: encoded characters, double encoding, redundant separators, dot segments, mixed case where the backend is case-insensitive, semicolon parameters, and trailing characters some frameworks strip. The edge matches its rule against the form it produces, and the origin routes based on the form it produces, and there is no requirement anywhere that those be the same function.\n\nThis is worth holding as a network-layer concern rather than an application one because the rules that get bypassed are the ones written at the edge, and those are precisely the rules people rely on most: block the admin prefix from outside, require authentication on a route family, deny access to a metrics path. Each is a path comparison at a component that does not serve the path. The structural fix is to normalise once and forward the normalised form, so that only one function is in play. The weaker but useful fallback is to reject anything that changes under normalisation rather than trying to match every variant, which turns an open-ended matching problem into a closed one.",
  failureMode: "An attacker requests an administrative route with an encoded separator. The edge rule matching that prefix does not match, so the request is forwarded, and the origin decodes and normalises the path and serves the administrative route. One request satisfied the edge's rule and the origin's routing, which were reading the same bytes differently.",
  experiment: "Take one path-based rule at your edge and try to reach the protected route with encoded separators, double encoding, dot segments, and a trailing dot or semicolon. Any variant that reaches the origin is today's finding. Twenty minutes.",
  reflection: "Does your edge forward the path as received or as normalised, and does anybody know which without checking?",
  recall: {
    q: "How does a path normalisation difference become an authorisation bypass?",
    a: "The edge matches its rule against the form it normalises to and the origin routes on the form it normalises to, and nothing requires those to be the same function. Encoded characters, double encoding, redundant separators, dot segments, case, and trailing characters all produce divergence.\n\nIt matters because edge path rules are the ones most relied on: blocking admin prefixes, requiring authentication on a route family, denying metrics paths. Normalise once at the edge and forward the normalised form, or reject anything that changes under normalisation."
  },
  deepDive: "Test the path-based rules at my edge against encoding and normalisation variants, and tell me whether the edge forwards the raw or normalised path."
},
{
  id: "ingress-what-bypasses-the-edge",
  track: "ingress", level: "policy",
  title: "Find the path that skips the edge, because there always is one",
  source: "NIST SP 800-41 Rev. 1, on complete mediation of the network path",
  cheat: "List every address a backend listens on and every route that reaches it. Any path that does not traverse the edge makes every edge rule advisory.",
  idea: "Every control at the edge is worth exactly as much as the guarantee that traffic cannot arrive any other way, and that guarantee is usually untested and usually false.",
  why: "The edge is where the authentication, the rate limiting, the header stripping, the path normalisation and the logging live. All of it rests on one assumption: this is the only way in. That assumption erodes continuously and by ordinary means. A backend keeps its own public address from before the edge existed. A second load balancer is created for a migration. A batch job needs direct access and gets a route. A partner integration is pointed at the origin because the edge was adding latency. A mesh permits direct pod-to-pod traffic by default. A cloud provider assigns a public address to a resource because the template does.\n\nWhat makes this the most valuable entry in the track is the leverage. A direct path does not defeat one edge control, it defeats all of them simultaneously, and it produces no logs at the place where anybody looks. It is also findable without cleverness: enumerate what the backends listen on, enumerate the routes that reach them, and compare against the one path you meant to have. The answer is a list, and every item on it that is not the edge is a finding that outranks anything else in this track.",
  failureMode: "An attacker discovers the origin's own address, from a certificate transparency log, a stale DNS record or a response header, and connects directly. Every edge control is bypassed at once: no rate limit, no authentication gateway, no header stripping, no request logging where anybody is watching. The application receives requests it believes have already been filtered.",
  experiment: "For one service behind an edge, enumerate every address it listens on and every route that reaches it, then try to connect directly from outside the edge. Include public addresses assigned by templates and any legacy load balancer. Thirty minutes, and any success is the highest-priority finding in this track.",
  reflection: "How would you find out if a direct route were added next month, and does anything watch for it?",
  recall: {
    q: "Why is a path that bypasses the edge the most serious ingress finding?",
    a: "Because every edge control rests on the single assumption that traffic cannot arrive another way, so one direct path defeats authentication, rate limiting, header stripping, normalisation and logging simultaneously, and produces no records where anybody is looking.\n\nThe paths appear by ordinary means: legacy public addresses, a second load balancer from a migration, a direct route for a batch job, a partner pointed at the origin for latency, mesh defaults, provider templates assigning public addresses."
  },
  deepDive: "Help me enumerate every network path that reaches a backend I describe, and identify which of them bypass the edge entirely."
},
{
  id: "ingress-waf-is-signal-not-boundary",
  track: "ingress", level: "policy",
  title: "Treat a web application firewall as a signal generator, not as a boundary",
  source: "Marcus Ranum, The Six Dumbest Ideas in Computer Security, 2005, on enumerating badness",
  idea: "A rule set that matches known attack patterns is a denylist, so it stops the traffic it recognises and its value is mostly in telling you that somebody is trying.",
  why: "The mechanism is pattern matching against request content, which puts it in the enumerate-badness category: it blocks what it has seen before and what it can express. That is genuinely useful against automated scanning, mass exploitation of a published vulnerability, and buying time between disclosure and a patch. Those are real benefits worth paying for and they are all availability and tempo benefits rather than correctness ones.\n\nWhere it goes wrong is being counted as a boundary. A determined attacker rewrites the payload until it stops matching, because the space of encodings and equivalent constructions is much larger than the rule set. So a vulnerability behind one is still a vulnerability, and the honest accounting is that it raises the cost of exploitation without changing whether the bug is exploitable. The more valuable use of the same deployment is as detection: a rule firing means somebody is probing you, which is high-signal information that most teams throw away because the request was blocked. And there is a cost worth naming, which is that these products usually require terminating TLS, so adopting one puts another plaintext holder in your trust boundary.",
  failureMode: "An attacker encounters a rule that blocks their first attempt, spends twenty minutes on encoding variants until one passes, and exploits the underlying vulnerability. The block was recorded and nobody looked at it. The only lasting effect of the product was to delay the attacker slightly and to hold every request in plaintext at one more component.",
  experiment: "Look at what your rule set blocked in the last week and ask whether anybody read it. Then take one blocked pattern and see how many variants you can construct that pass. Twenty minutes, and the honest output is whether you are buying detection you are not consuming.",
  reflection: "Is your rule set counted as a mitigation anywhere in a risk register, and would you defend that position knowing it is a denylist?",
  recall: {
    q: "What is a web application firewall actually good for, and what should it not be counted as?",
    a: "Good for blunting automated scanning, mass exploitation of published vulnerabilities, and buying time between disclosure and patch. Those are tempo and availability benefits.\n\nIt should not be counted as a boundary, because it is a denylist and the space of equivalent encodings exceeds the rule set, so a bug behind it stays exploitable. Its underused value is detection: a rule firing means somebody is probing. And it usually requires TLS termination, adding another plaintext holder to the trust boundary."
  },
  deepDive: "Review what my rule set is blocking and tell me what detection value I am discarding, plus what it is being wrongly counted as mitigating."
},
{
  id: "ingress-rate-limit-needs-an-identity",
  track: "ingress", level: "policy",
  title: "A rate limit is only as good as the identity it counts against",
  source: "RFC 6585, Additional HTTP Status Codes, 2012, on the semantics of too many requests",
  cheat: "Rate limit on the strongest identity available, and make the cheap-to-rotate keys the tighter limits rather than the only ones.",
  idea: "Rate limiting is a security control that depends entirely on the attacker being unable to cheaply change the key it counts against, which makes the choice of key the whole design.",
  why: "Counting is trivial; choosing what to count is not. Each candidate key trades coverage against forgeability. A client address is available for every request and is cheap for an attacker to vary, especially from cloud infrastructure. A session or account is much harder to rotate but only exists after authentication, which is useless for protecting the login path itself. An API key is strong and identifies a customer rather than a user. A device or client fingerprint is moderately hard to change and moderately unreliable.\n\nThe design that works uses several keys at once with different limits, and puts the tightest limits on the strongest identity rather than relying on the weakest. It also needs the unauthenticated case thought through separately, because that is where the attacks are: credential stuffing, enumeration and password reset abuse all happen before there is an account to count against. And there is a failure direction to decide deliberately: when the counter store is unavailable, the limiter either allows everything or denies everything, and that choice is usually inherited from a library default rather than made.",
  failureMode: "An attacker runs credential stuffing from a few hundred cloud addresses, staying under the per-address limit on every one of them. The aggregate rate against the login endpoint is enormous and no limit is exceeded, because the only key available before authentication was the one that costs pennies to rotate.",
  experiment: "For one endpoint, write down what your rate limit counts against and estimate what it costs an attacker to change that value. Then check what happens when the counter backend is unavailable. Fifteen minutes.",
  reflection: "For your unauthenticated endpoints, what is the strongest identity available, and are you limiting on it or on the easiest one?",
  recall: {
    q: "What determines whether a rate limit works, and what is special about unauthenticated endpoints?",
    a: "Whether the attacker can cheaply change the key it counts against. Client addresses are universally available and cheap to rotate from cloud infrastructure; sessions and accounts are hard to rotate but only exist after authentication; API keys are strong but identify a customer.\n\nUnauthenticated endpoints are where the attacks are, and they have only the weakest keys, so credential stuffing spreads across addresses and exceeds no limit. Use several keys with different limits, and decide deliberately whether an unavailable counter store fails open or closed."
  },
  deepDive: "For the endpoints I describe, tell me what identity each rate limit should count against and what my unauthenticated paths are currently missing."
},
{
  id: "ingress-timeouts-must-agree",
  track: "ingress", level: "ops",
  title: "Timeouts that disagree across hops produce work nobody is waiting for",
  source: "RFC 9110, on message semantics and connection management",
  idea: "When an upstream timeout is shorter than a downstream one, the caller gives up while the work continues, which wastes the resource under exactly the conditions that caused the timeout.",
  why: "Consider an edge that waits ten seconds and an application that waits sixty. A slow request is abandoned by the edge at ten seconds, and the application keeps working for another fifty, holding a worker and a database connection for a response that nobody will read. If the client retries, that request now has two copies in flight. Under load, when timeouts are actually being hit, this multiplies rather than degrades gracefully, and it is why timeout misalignment turns a slow dependency into an outage.\n\nThe security relevance is that this is a denial-of-service amplifier an attacker can trigger deliberately and cheaply. Requests engineered to be slow, abandoned immediately by the attacker, leave the expensive work running. The attacker pays for a connection and a few bytes; you pay for a worker and a query. And it interacts with retries: a retry policy above a misaligned timeout produces several copies of every slow request, which is a system that converts latency into load. The rule is that timeouts should decrease going inward and every retry budget must be bounded, so that a slow dependency produces refusals rather than accumulating work.",
  failureMode: "An attacker sends requests designed to be slow and abandons them immediately. Each one occupies a backend worker and a database connection for the full downstream timeout, long after the edge and the attacker have both stopped caring. A trickle of cheap requests exhausts a pool, and every layer reports that it is behaving correctly.",
  experiment: "For one request path, write down the timeout at every hop from client to database, plus the retry counts. Check that they decrease inward and that the retries are bounded. Twenty minutes, and any inversion is today's finding.",
  reflection: "Under load, does your system shed requests or accumulate them, and which of the numbers you just wrote down decides that?",
  recall: {
    q: "What goes wrong when timeouts do not decrease inward, and why is it a security concern?",
    a: "The caller abandons the request while the downstream work continues, holding a worker and a connection for a response nobody will read, and retries add more copies. Under load this multiplies instead of degrading, turning a slow dependency into an outage.\n\nIt is a security concern because it is a cheap denial-of-service amplifier: an attacker sends deliberately slow requests and abandons them, paying for a connection while you pay for a worker and a query."
  },
  deepDive: "Map the timeouts and retry budgets across a request path I describe and tell me where they invert or multiply."
},
{
  id: "ingress-concurrency-is-the-target",
  track: "ingress", level: "wire",
  title: "The edge runs out of connection slots long before it runs out of processor",
  source: "RFC 9110, on connection management, read against how edge resource exhaustion actually happens",
  idea: "Attacks on availability at the edge usually target the number of concurrent connections or in-flight streams rather than computation, because those limits are much smaller and much cheaper to reach.",
  why: "The intuition that a denial-of-service attack requires volume is out of date. An edge has a bounded number of connection slots, file descriptors, worker threads and, in the newer protocols, concurrent streams per connection. Those bounds are reached by holding connections open slowly rather than by sending a lot of data: open many connections and send headers a byte at a time, or open the maximum number of streams and leave them idle, or open connections and never read the responses so that buffers fill. Each costs the attacker almost nothing to maintain.\n\nThis matters for two reasons. First, the defences are different from volumetric ones: rate limiting by request count does not help against a client making very few requests very slowly, and the controls that do help are concurrency caps per source, minimum data rate requirements, and aggressive header and idle timeouts. Second, it changes what to monitor. A saturated edge with low processor use and low request rate looks healthy on every dashboard built around throughput, so the metric worth having is concurrent connections against the configured maximum, which most teams do not display anywhere.",
  failureMode: "An attacker opens a few thousand connections from a handful of hosts and sends one header byte every few seconds on each. Request rate stays negligible, processor use stays flat, no rate limit is exceeded, and the edge stops accepting new connections because every slot is held. Every dashboard shows a healthy service that nobody can reach.",
  experiment: "Find the maximum concurrent connections and, for the newer protocol, maximum concurrent streams configured on your edge. Then find out whether either is graphed anywhere. Then check the header and idle timeouts. Fifteen minutes, and an ungraphed limit is the finding.",
  reflection: "If your edge were saturated by held connections right now, which of your dashboards would show it?",
  recall: {
    q: "Why do connection slots rather than processor time make the better target, and what defends against it?",
    a: "Because the limits are far smaller and reachable by holding connections open slowly rather than sending volume: many connections dripping header bytes, maximum idle streams per connection, or never reading responses so buffers fill. Each costs the attacker almost nothing.\n\nRate limiting by request count does not help. Concurrency caps per source, minimum data rate requirements and aggressive header and idle timeouts do. And the metric to graph is concurrent connections against the configured maximum, since throughput dashboards show a healthy service."
  },
  deepDive: "Tell me the concurrency limits on the edge I describe, whether they are monitored, and which slow-connection attacks they currently permit."
},
{
  id: "ingress-default-backend-catches-what-you-missed",
  track: "ingress", level: "policy",
  title: "The default backend serves everything you forgot to route",
  source: "NIST SP 800-41 Rev. 1, on default rules",
  idea: "An edge that routes unmatched requests to a fallback rather than refusing them has an allow-by-default routing table, and the fallback is serving requests nobody designed for.",
  why: "This is the routing-layer version of the default-deny argument, and it hides in a different place. Rules are reviewed carefully; the fallback is set once when the edge is installed and never looked at again. Whatever it points to receives every request whose host or path matched nothing, which is precisely the set of requests nobody has thought about: probes for paths that no longer exist, hostnames from a previous migration, requests to services that were decommissioned, and an attacker's enumeration.\n\nWhat is served depends on what the fallback is, and none of the common choices is good. Pointing it at the main application means unrouted requests reach real code, with the host header or path arriving in a form the application never expected. Pointing it at whichever backend happens to be first is worse and is a common accident of configuration ordering. Even pointing it at an error page leaks which requests produce a different response, which is a free enumeration oracle. The version that behaves is an explicit refusal at the edge with a uniform response, which turns unmatched requests into a signal rather than a service.",
  failureMode: "An attacker enumerates hostnames against your edge and finds that unmatched ones reach a real application, which processes the request with a host header it has never seen. Alternatively they map your estate by observing which unmatched paths return different responses, learning what exists without ever getting a successful request.",
  experiment: "Send your edge a request with a hostname you do not serve and a path that matches nothing, and see exactly what answers. Then find the fallback in the configuration and read what it points to. Fifteen minutes.",
  reflection: "Is your fallback an explicit decision with a uniform refusal, or whichever backend the configuration happened to list first?",
  recall: {
    q: "Why is the default backend a security concern, and what should it be?",
    a: "Because it makes the routing table allow-by-default: every request matching no host or path rule reaches it, which is exactly the set nobody designed for, including stale hostnames, decommissioned services and attacker enumeration.\n\nNone of the usual choices is safe. The main application receives requests with unexpected host headers; whichever backend is listed first is an accident; an error page still leaks a response-difference oracle. It should be an explicit refusal with a uniform response, so unmatched requests are a signal."
  },
  deepDive: "Tell me what my edge does with unmatched hosts and paths, and design an explicit refusal that does not leak an enumeration oracle."
},
{
  id: "ingress-admin-ports-on-the-edge",
  track: "ingress", level: "ops",
  title: "The edge has its own management interface and it is reachable more often than anyone thinks",
  source: "NIST SP 800-41 Rev. 1, on management interfaces for network devices",
  cheat: "Bind edge management, status and metrics listeners to loopback or a management interface, never to the address that serves traffic.",
  idea: "Proxies and load balancers expose configuration, status and metrics endpoints of their own, and those listeners are frequently bound to the same interface as production traffic.",
  why: "The edge is a piece of software with an administrative surface: a status page, a metrics endpoint, a configuration API, sometimes a full dynamic control interface. Those exist for legitimate operational reasons and they are extremely high value, because the edge holds plaintext for everything behind it and its configuration decides where traffic goes. An attacker with write access to that configuration can route any hostname anywhere, or add a copy destination.\n\nThe reason this recurs is defaults and templates. Many proxies bind status or admin listeners to all interfaces out of the box, container images expose them, and service meshes run administrative interfaces on the pod's own address where anything in the mesh can reach them. None of that is visible in the routing rules, because it is not routing, and it is invisible in a review that reads the request path rather than the listener list. The check is to enumerate every listener the edge process actually has open, compare against the ones meant to serve traffic, and confirm the rest are bound to loopback or to a management interface.",
  failureMode: "An attacker who has reached any workload inside the mesh queries a sidecar administrative interface bound to the pod address, reads the full cluster configuration including every service name and endpoint, and in the worse case changes routing. No application was exploited and the edge was doing what its default configuration said.",
  experiment: "On one edge or sidecar process, list every listening socket and the interface each is bound to. Compare that against the ports you believe serve traffic. Anything else bound to a routable address is today's finding. Fifteen minutes.",
  reflection: "For your service mesh, can an arbitrary workload reach another pod's administrative interface, and has anybody checked rather than assumed?",
  recall: {
    q: "Why are edge management interfaces a high-value target, and why are they often reachable?",
    a: "Because the edge holds plaintext for everything behind it and its configuration decides routing, so write access to that configuration allows redirecting any hostname or adding a copy destination.\n\nThey are reachable because defaults and templates bind status, metrics and admin listeners to all interfaces, and meshes run administrative interfaces on the pod's own address. None of it appears in the routing rules, so a review of the request path never sees it. Enumerate the process's listening sockets instead."
  },
  deepDive: "Help me enumerate the listeners on the edge and sidecar processes I describe and identify which administrative interfaces are reachable from where."
},
{
  id: "ingress-edge-is-the-highest-value-target",
  track: "ingress", level: "policy",
  title: "The edge is the single most valuable component you run, and it is usually reviewed least",
  source: "RFC 7258, Pervasive Monitoring Is an Attack, 2014, read for what a position in the path is worth",
  idea: "One component terminates every connection, holds every request in plaintext and decides where everything goes, and it is typically third-party software configured from a template.",
  why: "Add up what compromising it yields. Every request and response in the clear, including credentials, session tokens and personal data. The ability to route any hostname to any destination, including one the attacker controls. The ability to serve modified responses to every client. The certificates and private keys for every name it terminates. And it sits at a position where none of that requires touching an application, so application-level controls, audit logging and anomaly detection are all downstream of the compromise.\n\nAgainst that, the review it receives is usually the least of anything in the estate. It is somebody else's software, so the configuration is inherited from a vendor template and treated as infrastructure rather than as code. It is owned by a platform team while the risk lands on application teams, so neither reviews it as their own. Its upgrades are driven by availability rather than by security advisories. The corrective is boring and specific: the edge configuration belongs in version control with mandatory review, its dependency and image updates need a defined cadence, its administrative surface needs to be enumerated, and it needs to appear in your threat model as the component with the largest blast radius.",
  failureMode: "An attacker compromises the edge through an unpatched vulnerability in the proxy itself, which was two versions behind because upgrades were driven by availability risk. From that position they read every credential passing through, with no application logs showing anything unusual, because from the application's perspective every request looks exactly as it should.",
  experiment: "Answer three questions about your edge: what version is it running and how far behind, is its configuration in version control with review, and when was its administrative surface last enumerated. Fifteen minutes, and any question you cannot answer is the finding.",
  reflection: "Does your edge appear in your threat model as its own component with its own blast radius, or only as a line on a diagram?",
  recall: {
    q: "What makes the edge the highest-value component, and why is it under-reviewed?",
    a: "It terminates every connection, holds every request in plaintext including credentials and tokens, can route any hostname anywhere, can modify every response, and holds the private keys for every name it terminates, all without touching an application, so application-level controls are downstream of its compromise.\n\nIt is under-reviewed because it is third-party software configured from a template, treated as infrastructure rather than code, owned by a platform team while the risk lands on application teams, and upgraded on availability rather than security grounds."
  },
  deepDive: "Help me build a threat model for the edge component I describe, treating it as its own compromise scenario rather than as part of the network."
},
{
  id: "ingress-untested-from-outside",
  track: "ingress", level: "ops",
  title: "An ingress rule you have only tested from inside is not a tested rule",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013, on validation from the attacker's position",
  cheat: "Test every ingress rule from a source outside every trusted range, including from a different cloud account. Inside-out tests prove nothing.",
  idea: "Ingress controls are about what an outsider can do, so a test from a machine that is inside a trusted range, on a corporate network or behind the same edge, is testing a different question.",
  why: "The convenient place to test from is a laptop on the office network or a jump host in the same account, and every one of those has properties an attacker does not: it is in an allowlisted range, it resolves internal names, it may reach the origin directly, and its traffic may enter through a different path with different rules. A rule that passes from there has been tested against a client that was already partly trusted.\n\nThe cases this hides are exactly the ones that matter, and they are the subject of most of this track: whether the origin is reachable directly, whether the internal admin allowlist actually excludes the internet, whether internal hostnames resolve publicly, whether the edge is really the only path. Each of those returns a different answer from a genuinely external source. So the standing requirement is a test position with no trust at all, ideally in a different provider account, and a small suite that runs from there and asserts refusals. The most common outcome the first time is not a failed rule but the discovery of a path nobody knew existed.",
  failureMode: "An attacker reaches an administrative interface that the team has verified is restricted, because every verification was run from a corporate address that the allowlist permits. The rule works exactly as configured; the testing never occupied the position the rule was written to exclude.",
  experiment: "Get a shell somewhere with no relationship to your estate, ideally a different provider account, and from there attempt to reach one administrative endpoint, one internal hostname and one origin address directly. Thirty minutes, and the first run usually finds something structural.",
  reflection: "Do you have a standing untrusted test position, or is external testing something arranged for an audit?",
  recall: {
    q: "Why does testing ingress rules from inside prove nothing, and what does a real test need?",
    a: "Because the convenient test positions are already partly trusted: in allowlisted ranges, able to resolve internal names, possibly able to reach the origin directly, and entering through a different path with different rules.\n\nA real test needs a position with no trust at all, ideally in a different provider account, running a small suite that asserts refusals. The usual first finding is not a broken rule but a path nobody knew existed."
  },
  deepDive: "Help me set up a standing untrusted test position and write the ingress assertions it should run continuously against the estate I describe."
}
);

/* Track: Egress. Ordered foundational first.
 *
 * Least Authority covers server-side request forgery as an untrusted-input
 * problem and default-deny egress as a tenant isolation problem. This track
 * takes the network-control view of the same ground: not how the request gets
 * coerced, but what the connection needs in order to complete, and which
 * control is in a position to stop it. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "egress-completes-the-attack",
  track: "egress", level: "policy",
  title: "Almost every compromise needs an outbound connection to be worth anything",
  source: "MITRE ATT&CK, Command and Control (TA0011) and Exfiltration (TA0010)",
  cheat: "Egress is the last control in the chain and the only one that acts after the bug. Price it as loss reduction, not as prevention.",
  idea: "Data leaving, instructions arriving, and second-stage payloads being fetched all require a connection out, which makes egress the last place an attack can be interrupted rather than merely detected.",
  why: "Work backwards from what an attacker needs after they have execution. They need to receive instructions, or they are running a fixed script with no adaptation. They need to fetch tooling, because what they landed with is small. And they need to send data out, or the whole exercise produced nothing. Each of those is an outbound connection from your estate to somewhere they control.\n\nThat is why egress deserves its own track rather than being a footnote to ingress. Every control before it is trying to prevent the compromise; egress is the only one that operates after prevention has already failed, which is the situation you should assume you are in. It also reframes the cost argument. Restricting egress is operationally painful and it is easy to lose the argument by presenting it as another preventive control, competing against controls that stop things earlier. Presented honestly it is loss reduction: it does not change how often you are compromised, it changes what a compromise is worth. That is the term nobody can buy down after the incident.",
  failureMode: "An attacker with execution in a workload retrieves their tooling from a public host, establishes a channel that receives instructions, and sends a database extract out, all over connections the workload was permitted to make because nothing constrained where it could go. Every preventive control in the estate had already been passed, and the only remaining control was not configured.",
  experiment: "Pick one workload and write down the three questions in order: could it fetch a payload from an arbitrary host, could it maintain a connection to one, could it send a large volume of data to one. Three yes answers is the normal result and it is the finding. Ten minutes.",
  reflection: "Is egress restriction argued for in your organisation as prevention, and would it win the resourcing argument more often framed as loss reduction?",
  recall: {
    q: "Why does egress deserve separate treatment from every other network control?",
    a: "Because it is the only control that operates after prevention has failed. An attacker with execution still needs to receive instructions, fetch tooling and send data out, and all three are outbound connections.\n\nIt also reframes the cost argument: egress restriction does not reduce how often you are compromised, it reduces what a compromise is worth, which is loss reduction rather than prevention and is the term you cannot buy down afterwards."
  },
  deepDive: "For a workload I describe, walk through what an attacker with execution would need to reach outbound and tell me which of those a policy could deny without breaking the workload."
},
{
  id: "egress-resolve-then-connect",
  track: "egress", level: "wire",
  title: "Validating a name and connecting to it are two moments, and the answer can change in between",
  source: "Jackson and others, Protecting Browsers from DNS Rebinding Attacks, ACM CCS, 2007",
  cheat: "Validate the resolved address at connect time, not the hostname beforehand. Resolve once, check the address, connect to that address.",
  idea: "Code that checks a hostname against a policy and then hands the hostname to a network library performs two separate resolutions, and an attacker who controls the name can make them return different answers.",
  why: "The check reads a name, resolves it, sees an acceptable address and approves. The library then resolves the same name again to open the connection, and gets whatever the authoritative server returns this time. An attacker who controls the name serves an acceptable address for the first lookup and an internal one for the second, with a very short cache lifetime so the second lookup actually happens. Nothing is spoofed and no cache is poisoned; the name simply has two answers.\n\nThe correct shape follows directly and is worth remembering as a sequence: resolve the name yourself, check the resulting addresses against the policy, and connect to the address rather than to the name. That collapses the two moments into one. It requires a network library that will let you connect to an address while still presenting the original name for TLS and for the host header, which most will, and which is why this is a solvable problem rather than an inherent one. The general form is worth carrying past this specific attack: any security check on a name that is dereferenced again later has a gap, and the fix is always to check the thing you are about to use rather than the thing that produces it.",
  failureMode: "An attacker submits a hostname they control to a feature that fetches a URL. Your validation resolves it, sees a harmless public address and approves. Microseconds later the fetch resolves it again, gets an internal address, and the request goes to a service inside your network with the trust that comes from originating there.",
  experiment: "Find one place in your code that validates a URL or hostname before fetching it. Determine whether it connects to a resolved address or hands the hostname back to the library. Fifteen minutes, and handing back the hostname is the finding.",
  reflection: "How many URL-fetching features do you have, and were they all written by people who knew this pattern?",
  recall: {
    q: "Why is validating a hostname before fetching it insufficient, and what is the correct sequence?",
    a: "Because the check and the connection perform separate resolutions, and an attacker controlling the name can serve an acceptable address to the first and an internal one to the second, using a very short cache lifetime. Nothing is spoofed; the name has two answers.\n\nThe correct sequence is resolve once yourself, check the resulting addresses, then connect to the address while still presenting the original name for TLS and the host header."
  },
  deepDive: "Review the URL fetching code I paste in and rewrite it to resolve once, validate the address and connect to the address."
},
{
  id: "egress-redirect-is-a-second-request",
  track: "egress", level: "wire",
  title: "Your validation saw the first request and the library followed four more",
  source: "RFC 9110, HTTP Semantics, on redirection status codes",
  cheat: "Disable automatic redirect following on server-side fetches, or revalidate the destination at every hop. One check covers one request.",
  idea: "HTTP clients follow redirects by default, so a validated request to an approved destination can become an unvalidated request to any destination the first server nominates.",
  why: "This is the same class of gap as the resolution one and it is easier to miss because there is no clever timing involved. You validate a URL, the fetch succeeds, and somewhere in the middle the approved server answered with a redirect to an internal address and your client followed it without asking anyone. The validation covered request one of five. It is worth pairing with the previous entry deliberately, because a fix for one that ignores the other leaves the door open, and both are properties of the network library rather than of your code, which is why reading the defaults matters more than reading your own logic.\n\nThe options are limited and clear. Turn off automatic following and handle each hop yourself, revalidating the destination each time, which is correct and more code. Or leave it on but cap the hops and revalidate through a hook, which most libraries support. What does not work is validating once and trusting the library, and what particularly does not work is a fetch through a wrapper written by somebody who assumed the caller had validated, since the caller validated a different request.",
  failureMode: "An attacker supplies a URL on a host they control that passes every check. That host answers with a redirect to a link-local metadata address. Your client follows it, retrieves credentials, and returns them in the response body of the feature that fetched the URL, having validated only the destination the attacker was happy to disclose.",
  experiment: "For each outbound fetch in your code, find out whether the library follows redirects by default, how many it will follow, and whether your validation runs again on each. Fifteen minutes, and the library default is usually to follow.",
  reflection: "Do you have a single reviewed function for outbound fetches, or does every feature construct its own client with its own defaults?",
  recall: {
    q: "Why does validating a URL not cover the request that eventually happens?",
    a: "Because clients follow redirects by default, so an approved destination can nominate any other, including an internal address, and the library follows without revalidating. The check covered the first of several requests.\n\nEither disable automatic following and revalidate each hop yourself, or cap the hops and revalidate through the library's hook. Validating once and trusting the library does not work, and neither does a fetch wrapper that assumes its caller validated."
  },
  deepDive: "Tell me the redirect-following defaults for the HTTP clients used in a codebase I describe, and design one reviewed fetch function that handles both redirect and resolution validation."
},
{
  id: "egress-ip-literals-and-encodings",
  track: "egress", level: "wire",
  title: "There is no regular expression that identifies an internal address",
  source: "RFC 3986, Uniform Resource Identifier: Generic Syntax, 2005, on host syntax",
  cheat: "Parse to a normalised address object and check that, never the string. Decimal, octal, hex and mapped forms all defeat string matching.",
  idea: "Addresses can be written in decimal, octal, hexadecimal, shortened and mapped forms, so any check that pattern-matches the text of a host will miss encodings of the same address.",
  why: "The loopback address alone can be written as four dotted decimal numbers, as a single decimal integer, in octal, in hexadecimal, with fewer parts than four, as an IPv6 form, and as an IPv6-mapped IPv4 form. Different parsers accept different subsets, which is the real problem: your validation code and your network library may not agree on what a string means, so a check can reject one reading of a host while the library connects using another.\n\nThe consequence is that string matching is the wrong tool and no amount of pattern refinement fixes it. The approach that works is to parse the host into a normalised address object using the same resolver and parser the connection will use, then check properties of that object: is it loopback, link-local, private, unique-local, multicast, unspecified. Those are library functions in every mainstream language and they are exhaustive in a way a denylist of prefixes is not. It is also worth checking for the whole family rather than the famous ones, because the interesting internal ranges include link-local, carrier-grade translation space, and the IPv6 equivalents that a blocklist written years ago will not mention.",
  failureMode: "An attacker requests an internal address written as a single decimal integer, or as an IPv6-mapped form. The validation regular expression does not match, so the request is approved, and the network library parses it as the internal address it always was and connects there.",
  experiment: "Find one place your code checks whether a host is internal. Try the loopback address written four different ways against it. Any that pass are today's finding, and the fix is to replace the check with a parse plus property tests. Twenty minutes.",
  reflection: "Does your check cover link-local, unique-local and mapped forms, or only the private ranges someone remembered?",
  recall: {
    q: "Why can a host string never be checked with pattern matching?",
    a: "Because the same address has many textual forms - dotted decimal, a single integer, octal, hexadecimal, shortened, IPv6 and IPv6-mapped - and different parsers accept different subsets, so your validation and your network library may disagree about what a string means.\n\nParse the host into a normalised address object with the same parser the connection will use, then test its properties: loopback, link-local, private, unique-local, multicast, unspecified. Those are exhaustive where a prefix denylist is not."
  },
  deepDive: "Replace the host validation I paste in with a parse-and-check-properties version covering every internal range including the IPv6 forms."
},
{
  id: "egress-proxy-is-the-only-chokepoint",
  track: "egress", level: "policy",
  title: "A forced proxy is the only place you get a hostname, a log and a policy at once",
  source: "NIST SP 800-41 Rev. 1, on application-proxy gateways",
  idea: "Filtering egress at the network layer gives you addresses, and routing it through a proxy gives you names, decisions and a record in one component.",
  why: "The layer argument from the model track lands here concretely. A network-layer egress rule sees an address and a port, which is a weak vocabulary for a destination policy because addresses are shared, rotate, and say nothing about which of a thousand tenants on a cloud service you reached. A proxy sees the request before it becomes a connection: the hostname, and for plaintext the full path. That is the difference between allowing an address range and allowing a destination.\n\nThe cost is real and worth stating plainly. Every workload has to be configured to use it, which is the part that fails: a library that ignores proxy environment variables, a static binary, a language runtime with its own settings, an SDK that constructs its own client. So the proxy must be paired with a network rule that makes the direct path impossible, otherwise it becomes a well-instrumented suggestion. This is the same complete-mediation argument as the edge bypass, in the other direction, and the check is the same shape: try to reach the internet from a workload without using the proxy and confirm you cannot.",
  failureMode: "An attacker in a workload configured to use an egress proxy simply does not use it. They open a direct connection, which succeeds because the network rule permits outbound to the internet on the assumption that everything goes through the proxy. The proxy logs show nothing, because from its perspective nothing happened.",
  experiment: "From one workload that is supposed to use an egress proxy, attempt a direct outbound connection bypassing it. If it succeeds, the proxy is advisory. Then check one SDK in that workload for whether it honours the proxy configuration at all. Twenty minutes.",
  reflection: "Which of your workloads could bypass the proxy today, and would anything notice that they had?",
  recall: {
    q: "What does an egress proxy give you over a network-layer rule, and what must accompany it?",
    a: "A hostname rather than an address, the request before it becomes a connection, a policy decision and a log in one place. Network rules see addresses, which are shared, rotate and cannot distinguish tenants on a cloud service.\n\nIt must be accompanied by a network rule making the direct path impossible, because workloads bypass proxies routinely through libraries that ignore proxy settings, static binaries, runtime-specific configuration and SDKs that build their own clients."
  },
  deepDive: "Help me verify that the workloads I describe cannot reach the internet except through the egress proxy, and find the SDKs likely to ignore it."
},
{
  id: "egress-allowlist-by-address-fails",
  track: "egress", level: "policy",
  title: "An address-based egress allowlist is a list the attacker gets to edit",
  source: "RFC 1035, Domain Names, on the indirection between names and addresses",
  idea: "Allowing egress to a set of addresses assumes the mapping from destinations to addresses is stable and controlled by you, and for any name an attacker owns it is controlled by them.",
  why: "The mapping is the problem. If you allow the addresses behind a legitimate destination, you have allowed whatever those addresses become. For a destination on shared cloud infrastructure that is already a large set of unrelated tenants. But the sharper version is that an attacker who needs egress to their own infrastructure can point a name at any address you permit, or can obtain infrastructure inside a range you permit, which on a large provider takes minutes.\n\nThis is why hostname-based control is the meaningfully stronger form even though it reads a client-supplied field. Names are administratively controlled, they are what appear in a policy a human can review, and they can be checked against the certificate presented. Address-based control is worth having only where the destination is a specific endpoint you operate and whose addressing you control, which does exist and is where it should be used. Everywhere else, an address list is a control whose effectiveness depends on facts about the destination that you do not own and are not notified about when they change.",
  failureMode: "An attacker provisions a virtual machine in the same cloud provider and region your allowlist permits, receives an address inside the permitted range, and exfiltrates to it. The allowlist is enforced exactly as written and the destination is entirely under the attacker's control, obtained in ten minutes with a card.",
  experiment: "Take one address-based egress rule and work out what else currently lives inside the ranges it allows. For a cloud provider range, the honest answer is every customer of that provider in that region. Fifteen minutes.",
  reflection: "For each address-based rule, is the destination something you operate and address, or something whose addressing belongs to somebody else?",
  recall: {
    q: "Why is an address-based egress allowlist weak, and when is it appropriate?",
    a: "Because the mapping from destinations to addresses is not yours: shared cloud infrastructure puts unrelated tenants behind permitted addresses, and an attacker can point a name at a permitted address or obtain infrastructure inside a permitted range in minutes.\n\nIt is appropriate only for a specific endpoint you operate and whose addressing you control. Elsewhere, hostname-based control is stronger despite reading a client-supplied field, because names are administratively controlled, reviewable, and checkable against the presented certificate."
  },
  deepDive: "Look at my address-based egress rules and tell me which destinations I actually control the addressing for and which should move to hostname policy."
},
{
  id: "egress-dns-is-the-universal-hole",
  track: "egress", level: "wire",
  title: "Everything is allowed to resolve names, which makes the resolver an egress channel",
  source: "RFC 1035, Domain Names, on the query path",
  cheat: "Resolution is egress. Log queries, restrict workloads to your own resolvers, and treat high-entropy subdomain volume as exfiltration.",
  idea: "Name resolution is permitted from everywhere because nothing works without it, and a query carries attacker-chosen data to a server the attacker can operate.",
  why: "The mechanism is that a query for a name under a domain the attacker controls is delivered, through your resolver and the resolution hierarchy, to their authoritative server. The name itself carries the data: encode a chunk into a label, query it, read it off the far end. No connection to the attacker's infrastructure is ever opened from your network, so an egress policy expressed in terms of connections sees nothing. Responses can carry data back the same way, which gives a slow but complete channel.\n\nWhat makes this the most durable egress hole is that closing it is not available. You cannot deny resolution, so the controls are all about narrowing and watching: force workloads to use your own resolvers rather than any resolver they like, so the traffic is at least visible in one place; log queries, which is the highest-coverage network telemetry most estates have available; and alert on the shape of this attack, which is a large volume of unique high-entropy subdomains under one parent domain. That signature is distinctive enough to be worth a detection, and query logging is what makes it possible.",
  failureMode: "An attacker with execution but no permitted outbound connections exfiltrates by encoding data into subdomain labels and resolving them. Every egress rule holds, no connection to their infrastructure is attempted from your network, and the data arrives at their authoritative server. The only trace is in resolver logs, if they are kept.",
  experiment: "Find out whether your workloads can use arbitrary external resolvers or are forced to yours, then find out whether resolver query logs exist and how long they are kept. Fifteen minutes, and no query logging is the finding.",
  reflection: "If exfiltration happened over resolution last month, is there any data that would let you find it now?",
  recall: {
    q: "How does name resolution work as an exfiltration channel, and what can be done about it?",
    a: "A query for a name under an attacker-controlled domain is delivered through your resolver to their authoritative server, with data encoded in the labels, and responses can carry data back. No connection to the attacker is ever opened, so connection-based egress policy sees nothing.\n\nResolution cannot be denied, so the controls are narrowing and watching: force workloads onto your own resolvers, log queries as the highest-coverage telemetry available, and alert on high volumes of unique high-entropy subdomains under one parent."
  },
  deepDive: "Help me design a detection for resolution-based exfiltration given the resolver logging available in the estate I describe."
},
{
  id: "egress-low-bandwidth-channels",
  track: "egress", level: "wire",
  title: "Exfiltration does not need throughput, and the valuable data is small",
  source: "MITRE ATT&CK, Exfiltration Over Alternative Protocol (T1048)",
  idea: "The things worth stealing are measured in kilobytes, so a channel with negligible bandwidth is sufficient and volume-based detection will not see it.",
  why: "Credentials, keys, tokens, a customer list, a schema, the contents of a configuration store: all small. That changes what counts as a channel. A few hundred bytes per minute is enough, which admits everything: resolution labels, headers on requests to permitted destinations, query parameters, the timing between requests, the choice of which of several permitted destinations to contact, and content posted to a legitimate service you already allow.\n\nThe consequence is that detections built on volume are looking for the wrong shape. A rule that alerts on a large transfer catches somebody copying a database and misses the theft of the key that would let them copy it whenever they liked. It also undermines the intuition that a tightly restricted egress policy is close to airtight: if any destination is permitted for any reason, a low-bandwidth channel exists through it. That is not an argument against restricting egress, which still removes the convenient paths and forces the attacker into slow and detectable ones. It is an argument for pairing it with detection based on shape rather than size.",
  failureMode: "An attacker exfiltrates a private key over several hours by encoding it into request paths against a permitted destination. Total volume is a few kilobytes, indistinguishable from noise. Every volume threshold is far from triggering, and the estate's egress policy was working correctly the entire time.",
  experiment: "Look at your exfiltration detections and note what each is keyed on. If they are all thresholds on bytes transferred, work out what the smallest thing worth stealing from your estate is and how long it would take to leak at one kilobyte per hour. Fifteen minutes.",
  reflection: "What is the highest-value small secret in your estate, and would any of your detections notice it leaving slowly?",
  recall: {
    q: "Why is low-bandwidth exfiltration the case to design for?",
    a: "Because the valuable data is small - credentials, keys, tokens, a customer list, a schema - so a few hundred bytes per minute suffices, which admits resolution labels, headers, query parameters, timing, destination choice and posts to permitted services.\n\nVolume-based detection therefore looks for the wrong shape, catching a database copy and missing the theft of the key that enables one. Restricting egress still removes the convenient paths, but it needs pairing with detection keyed on shape rather than size."
  },
  deepDive: "Given the egress destinations I permit, tell me what low-bandwidth channels exist through them and what detection shape would catch each."
},
{
  id: "egress-webhooks-are-user-controlled",
  track: "egress", level: "policy",
  title: "A webhook is a feature that lets a customer choose your outbound destination",
  source: "OWASP guidance on server-side request forgery, applied to outbound integration features",
  cheat: "Send webhooks from an isolated egress path with its own policy, never from the workload that holds internal reachability.",
  idea: "Any feature where a user supplies a URL that your infrastructure then requests is a deliberate, documented, supported version of the vulnerability everything else in this track is about.",
  why: "Webhooks, callback URLs, avatar imports from a link, document fetching, integration endpoints, health checks a customer configures, and anything that says paste your URL here are all the same thing: user-controlled outbound requests, by design. Which means the mitigations cannot be to prevent it, and have to be about where it happens from and what that position can reach.\n\nThe structural answer is to send them from somewhere with nothing worth reaching. A dedicated sender with no internal reachability, no instance credentials, no access to the metadata service and its own restrictive egress policy turns the whole class from a serious internal exposure into an outbound nuisance. That is a much better trade than trying to validate destinations perfectly in the workload that also holds your internal reachability, because the validation has to be right every time and the isolation only has to be right once. The remaining problems are then the ordinary ones: hop limits, address checks at connect time, and a timeout, all of which are contained.",
  failureMode: "An attacker registers a webhook pointing at an internal address, or at a name that resolves to one on the second lookup. Your application dutifully posts to it from a workload with full internal reachability and an instance credential, and the response body comes back to them through the delivery log. The feature worked as specified.",
  experiment: "List every feature in your product where a user supplies a URL you then request. For each, find out which workload sends it and what that workload can reach internally. Twenty minutes, and the count of such features is usually higher than anybody expects.",
  reflection: "Could your webhook sender be moved somewhere with no internal reachability, and what would that cost compared to auditing every validation path?",
  recall: {
    q: "Why is a webhook feature the same problem as a server-side request vulnerability, and what is the structural fix?",
    a: "Because it is user-controlled outbound requests by design, along with callback URLs, link imports, document fetching and customer-configured health checks. Prevention is not available, so the question is where the request originates from.\n\nSend from a dedicated path with no internal reachability, no instance credentials, no metadata access and its own restrictive egress policy. Isolation has to be right once; per-call validation has to be right every time."
  },
  deepDive: "Help me inventory every user-supplied-URL feature in a product I describe and design an isolated sender for them."
},
{
  id: "egress-ci-has-the-widest",
  track: "egress", level: "policy",
  title: "The build pipeline has the widest egress in the estate and the least review",
  source: "NIST SP 800-218, Secure Software Development Framework, on protecting the build environment",
  idea: "Build systems are permitted to reach the whole internet because dependency resolution requires it, and they hold signing keys and deployment credentials while doing so.",
  why: "The reasoning that produced this is sound at each step. Builds need to fetch dependencies from many registries, so egress must be broad. Builds run arbitrary code from those dependencies, because that is what a build script is. Builds need credentials to publish artefacts and often to deploy. Put together, that is arbitrary code execution with broad outbound access and production credentials, in an environment that is treated as developer tooling rather than as production.\n\nWhich makes the build environment the highest-leverage target in most estates, and the one where egress restriction pays best despite being hardest. The practical moves are all about separating the phases rather than trying to constrain the whole thing: resolve dependencies in a step with no credentials, through a caching proxy so the permitted destination set is your proxy rather than the internet; run the build with no egress at all against the already-fetched dependencies; and give credentials only to a publish step that reaches exactly one destination. Each phase then has a narrow policy, which is achievable, where one phase covering everything is not.",
  failureMode: "An attacker who has compromised a dependency runs code during the build, which has both broad egress and the credentials to publish signed artefacts. They exfiltrate the signing key and publish a modified artefact. No production system was touched and every downstream consumer receives a correctly signed build.",
  experiment: "For one pipeline, write down what it can reach outbound and what credentials are present during the dependency resolution step. If credentials and broad egress coexist in the same step, that is today's finding. Twenty minutes.",
  reflection: "Is your build environment protected as production, and if not, what does it hold that production would not survive losing?",
  recall: {
    q: "What makes the build pipeline the highest-leverage egress target, and how is it narrowed?",
    a: "It runs arbitrary code from dependencies, needs broad outbound access to resolve them, and holds signing and deployment credentials, while being treated as developer tooling rather than production.\n\nNarrow it by separating phases: resolve dependencies with no credentials through a caching proxy so the permitted destination is the proxy; build with no egress against fetched dependencies; give credentials only to a publish step reaching one destination. Each phase gets an achievable policy."
  },
  deepDive: "Help me split a build pipeline I describe into phases with separate egress policies and credential scopes."
},
{
  id: "egress-registry-pulls-execute",
  track: "egress", level: "policy",
  title: "An image or package pull is egress on a path that then executes what it fetched",
  source: "NIST SP 800-218, on acquiring and verifying third-party components",
  cheat: "Pull by digest through your own registry mirror. A tag is a mutable pointer and a mirror is the only enforceable destination.",
  idea: "Pulling a dependency is an outbound connection whose payload becomes running code, which makes the destination policy and the integrity check parts of the same control.",
  why: "Most egress carries data out. This carries code in, and the code runs with whatever privileges the workload has. So the destination matters more here than anywhere else, and so does whether you got what you asked for. The two failure modes are distinct: reaching a destination you did not intend, and receiving different content from the destination you did intend. Pulling by tag exposes you to the second, because a tag is a mutable pointer that can be repointed at new content without the reference changing.\n\nThe pattern that addresses both is a registry mirror plus digests. A mirror makes the permitted destination exactly one host you operate, which is a policy you can actually enforce and a place you can scan and cache. Digests make the content immutable, so a repointed tag cannot change what you run. The combination also fixes an availability problem, since your builds stop depending on a public registry being up. It is worth noting the second-order effect on egress policy: with a mirror, your workloads need no internet egress for dependencies at all, which converts a broad rule into a single-destination one.",
  failureMode: "An attacker who has gained publish access to a dependency repoints a tag your deployment uses at an image containing their code. Your next rollout pulls it, verifies nothing beyond the tag existing, and runs it with the workload's identity and reachability. The pull was permitted, the registry was the intended one, and the content was not.",
  experiment: "Take one running workload and determine whether its image is referenced by tag or digest, and whether it pulls from your mirror or from a public registry. Then check whether the workload could pull from an arbitrary registry if its manifest said so. Fifteen minutes.",
  reflection: "How many of your deployments reference mutable tags, and what would it take to move them to digests?",
  recall: {
    q: "Why is a dependency pull a special case of egress, and what controls it?",
    a: "Because the payload becomes running code with the workload's privileges, so both the destination and the integrity of what arrives matter. The two failure modes are reaching an unintended destination and receiving different content from the intended one, the latter enabled by mutable tags.\n\nA registry mirror makes the permitted destination one host you operate and scan; digests make the content immutable. Together they also remove the need for internet egress for dependencies at all."
  },
  deepDive: "Help me move the deployments I describe to digest-pinned pulls through a mirror, and tell me what egress rules that lets me remove."
},
{
  id: "egress-third-party-sdk",
  track: "egress", level: "ops",
  title: "An SDK you added makes connections you did not write",
  source: "NIST SP 800-218, on third-party component risk",
  idea: "Libraries in your application open their own outbound connections for telemetry, configuration, feature flags and error reporting, and those destinations are not in any inventory you keep.",
  why: "You wrote the calls your code makes. You did not write the ones your dependencies make, and many of them make some: crash reporters posting stack traces, analytics libraries batching events, feature flag clients polling a control plane, observability agents streaming spans, licence checks. Each is a destination your workload contacts, chosen by a third party, changeable in a minor version bump.\n\nTwo consequences. The first is data: a crash reporter sends stack traces, which include local variables, and local variables include tokens and customer data. That is an outbound flow of exactly the material you are trying to protect, going somewhere you did not review, and it will not appear in any data flow diagram because nobody drew it. The second is that these destinations are what force your egress allowlist wide. Every entry added to make an SDK work is a permanent hole, and the honest way to find them is not to read documentation but to observe the connections a workload actually makes and compare against the ones you meant it to make. The difference is the finding.",
  failureMode: "An attacker does not need to be involved for the loss to occur: an error reporter sends a stack trace containing a customer record and a bearer token to a third party, in the normal course of operation. If an attacker is involved, they trigger errors deliberately to pull data out through a channel your egress policy explicitly permits.",
  experiment: "Capture the distinct outbound destinations one workload contacts over an hour and compare that list against the destinations you would have named from reading the code. Every extra is an SDK. Twenty minutes plus the capture, and the diff is the deliverable.",
  reflection: "For each third-party destination you found, do you know what data goes to it, and is that in any data flow documentation?",
  recall: {
    q: "Why are SDK-initiated connections a distinct egress problem?",
    a: "Because dependencies open their own outbound connections for crash reporting, analytics, feature flags, observability and licence checks, to destinations chosen by a third party and changeable in a minor version bump, and none of it appears in an inventory or a data flow diagram.\n\nThe data risk is concrete: stack traces carry local variables, which carry tokens and customer records. And these destinations are what force the allowlist wide. Find them by observing actual connections and diffing against intended ones."
  },
  deepDive: "Help me compare the destinations a workload actually contacts against the ones its code implies, and assess what data each third-party destination receives."
},
{
  id: "egress-managed-services-cannot-be-proxied",
  track: "egress", level: "policy",
  title: "Managed services make connections from infrastructure you cannot put a proxy in front of",
  source: "NIST SP 800-144, Guidelines on Security and Privacy in Public Cloud Computing, 2011",
  idea: "When a provider-run service performs an outbound request on your behalf, the connection originates outside your network, so none of your egress controls are in the path.",
  why: "A managed database replicating to an external endpoint, a serverless function invoked by a provider event source, a managed integration service calling a partner API, a data pipeline reading from a customer's warehouse: in each case the outbound connection is made by provider infrastructure. Your proxy is not in the path, your network rules are not in the path, and your flow logs may not record it. The control surface is whatever the provider exposes, which is usually a resource policy or a network configuration option rather than anything resembling your own egress policy.\n\nThis is worth its own entry because it is a growing gap rather than a legacy one, and because it is invisible in the natural way people audit egress. Enumerating what your workloads can reach will not find it, since the workload is not the thing connecting. The way to find it is to enumerate the managed services in the account and ask, for each, whether it makes outbound connections and what constrains them. Where the answer is nothing, the mitigations are provider-specific: a resource policy limiting destinations, running the service inside your own network where that option exists, or accepting the gap explicitly and compensating with logging on the provider side.",
  failureMode: "An attacker who can configure a managed integration, perhaps through a compromised console session or an over-permissive role, sets its destination to their own endpoint. Data flows from provider infrastructure directly to them. No connection leaves your network, no egress rule is consulted, and your flow logs show nothing because nothing traversed your subnets.",
  experiment: "List the managed services in one account that make outbound connections on your behalf. For each, find what constrains the destination and whether the connection appears in any log you own. Twenty minutes, and the services with no constraint are the finding.",
  reflection: "How much of your outbound data flow happens from provider infrastructure rather than from your workloads, and is that in your threat model at all?",
  recall: {
    q: "Why do managed services create an egress gap, and how do you find it?",
    a: "Because the outbound connection is made by provider infrastructure, so your proxy, network rules and flow logs are all out of the path. The only control surface is whatever the provider exposes, usually a resource policy rather than an egress policy.\n\nEnumerating what your workloads can reach will not find it, since the workload is not connecting. Enumerate managed services instead and ask, for each, whether it makes outbound connections and what constrains the destination."
  },
  deepDive: "Help me enumerate the managed services in an account I describe that make outbound connections, and what constrains each destination."
},
{
  id: "egress-shadow-mode-rollout",
  track: "egress", level: "ops",
  title: "You reach default-deny egress by logging what a deny would have blocked, not by switching it on",
  source: "NIST SP 800-41 Rev. 1, on phased firewall policy deployment",
  cheat: "Run the deny policy in log-only mode first and let it build your allowlist from observed traffic. Switching on a guessed policy is what makes it get reverted.",
  idea: "The obstacle to restricting egress is never the rule syntax, it is not knowing what the workload legitimately needs, and the way to find out is to enforce nothing and record what would have been denied.",
  why: "Every attempt to write a default-deny egress policy from first principles fails the same way. Somebody enumerates the destinations from the code and the documentation, writes the policy, turns it on, and breaks something at a time that costs them the political capital to try again. The list was incomplete because SDK destinations are not in the code, provider endpoints are not in the documentation, and the once-a-month batch job was not running that week.\n\nThe rollout that works inverts it: deploy the deny policy in a mode that logs what it would have blocked and blocks nothing, leave it long enough to catch the monthly and quarterly jobs, and let the observed traffic build the allowlist. Then enforce. That converts a guessing exercise into a measurement, and it produces the artefact you actually wanted, which is an accurate inventory of what each workload reaches. It is worth saying plainly that the waiting period is the whole method: turning it on after a week catches the daily jobs and gets reverted by the monthly one, which is how egress restriction acquires a reputation for being impossible.",
  failureMode: "There is no attacker here either. A team enables default-deny egress on a Tuesday, a quarterly reconciliation job fails the following month, the outage is attributed to the security change, and the policy is removed along with any appetite for trying again for a year.",
  experiment: "Pick one workload and deploy an egress policy in log-only mode. Set a calendar reminder for far enough out to include your longest-period job. That waiting period is the work; the policy is the easy part. Twenty minutes to deploy.",
  reflection: "What is the longest interval between runs of anything in your estate, and does your rollout plan wait that long?",
  recall: {
    q: "What is the correct way to reach default-deny egress, and why does the direct approach fail?",
    a: "Deploy the deny policy in log-only mode, record what it would have blocked, wait long enough to include monthly and quarterly jobs, let the observed traffic build the allowlist, then enforce.\n\nThe direct approach fails because a destination list derived from code and documentation is always incomplete: SDK destinations are not in the code, provider endpoints are not documented, and infrequent jobs are not running that week. Breaking something costs the capital needed to try again."
  },
  deepDive: "Design a phased log-only rollout for default-deny egress on a workload I describe, including how long to wait and what to do with the observed destinations."
}
);

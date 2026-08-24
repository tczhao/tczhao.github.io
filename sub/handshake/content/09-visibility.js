/* Track: Seeing the network. Ordered foundational first.
 *
 * Last on purpose. Every other track in this corpus is a control, and this one
 * is about whether you would know when one of them failed. It is also the
 * track that has to be honest about a trade the rest of the corpus recommends:
 * encrypting everything makes your own detection blind, and that cost is real
 * rather than something to be argued away. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "visibility-cannot-investigate-unrecorded",
  track: "visibility", level: "ops",
  title: "You cannot investigate a connection nobody recorded",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013",
  cheat: "Decide what you would need during an incident and turn it on now. Telemetry cannot be enabled retroactively.",
  idea: "Detection and investigation both operate on records that had to exist before the event, so the decision about what to record is made months before the incident that needs it.",
  why: "This is the asymmetry that makes telemetry different from every other control in this corpus. A missing rule can be added when you discover you need it and it works from that moment. A missing log cannot be added retroactively, so the question during an incident is never what would you like to know but what did you happen to be recording. That decision was made by whoever configured the platform, usually by accepting a default, at a time when nobody was thinking about investigation.\n\nWhat follows is a specific and unusual planning discipline: work backwards from the questions rather than forwards from the available data. Write the questions an incident would pose - which workload initiated this, what else did it talk to, when did this behaviour begin, did any data leave, who was authenticated - and then check whether each is answerable from what exists today. That produces a short list of gaps that are cheap to close now and impossible to close later. It also usually reveals that the volume of telemetry is high and its usefulness is low, because it accumulated by default rather than by design, which is a different problem from having too little.",
  failureMode: "An attacker's activity is discovered six weeks after it began. The investigation establishes when they were detected and cannot establish when they arrived, what they reached first, or whether data left, because internal connection records were never collected and the records that exist were retained for seven days. The write-up contains an unknown start date and an unknown scope, permanently.",
  experiment: "Write down five questions an incident would ask. For each, name the specific data source that would answer it and check that source exists and is retained long enough. Twenty minutes, and every unanswerable question is a gap that is cheap today.",
  reflection: "Of the questions you could not answer, which would you most regret during an incident, and what would it cost to start recording it this week?",
  recall: {
    q: "What makes telemetry decisions different from other controls, and what discipline follows?",
    a: "A missing rule can be added when you discover you need it. A missing log cannot be created retroactively, so during an incident the question is what you happened to be recording, and that was decided months earlier by whoever accepted a platform default.\n\nThe discipline is to work backwards from the questions an incident would pose rather than forwards from available data, then check each is answerable. That surfaces gaps that are cheap now and impossible later, and it often reveals high volume with low usefulness."
  },
  deepDive: "Help me list the questions an incident would ask in the estate I describe and check which are answerable from telemetry that exists today."
},
{
  id: "visibility-flow-logs-answer-who-not-what",
  track: "visibility", level: "wire",
  title: "Flow records answer who talked to whom, and never what was said",
  source: "RFC 7011, Specification of the IP Flow Information Export Protocol, 2013",
  idea: "Flow telemetry records the endpoints, ports, timing and byte counts of connections without any payload, which answers a specific and useful set of questions and cannot answer another set at all.",
  why: "Knowing the shape of the data source prevents both over- and under-estimating it. What a flow record contains is the two endpoints, the protocol and ports, when it started and ended, and how much data went each way. That is enough to reconstruct a communication graph, spot a workload talking to something it never talked to before, see a volume anomaly, and establish timing. Those are genuinely the questions incident response asks first, which makes flow data the highest-value-per-byte telemetry available.\n\nWhat it cannot do is tell you what happened. It will not say which request was made, what data was returned, whether the connection succeeded at the application level, or who was authenticated. So a flow record showing a connection from a workload to a database tells you the connection happened and nothing about whether a table was exfiltrated. Holding both halves of this clearly is what stops the two common errors: treating flow logs as sufficient and therefore not collecting anything richer, or dismissing them as metadata and therefore not collecting them at all, when they are cheap, complete and answer the first questions.",
  failureMode: "An attacker's connection to a database appears in flow records as a normal-looking session with a few megabytes transferred. Whether that was a routine query or the extraction of a customer table is not determinable from the record, and no application-level audit exists for that path, so the scope of the breach cannot be established from either source.",
  experiment: "Take one flow record from your estate and write down the five questions it answers and the five it does not. Then check whether anything else in your stack answers the second five for that path. Fifteen minutes.",
  reflection: "For your most sensitive data path, do you have anything that records what was accessed, or only that a connection occurred?",
  recall: {
    q: "What do flow records contain, and what are they unable to answer?",
    a: "Endpoints, protocol and ports, start and end times, and byte counts each way. That reconstructs a communication graph, reveals a workload talking to something new, shows volume anomalies and establishes timing, which are the first questions in an incident.\n\nThey cannot say which request was made, what was returned, whether the connection succeeded at the application level, or who was authenticated. So a connection to a database is visible and whether a table was exfiltrated is not."
  },
  deepDive: "For the sensitive data paths I describe, tell me what flow records would show and what additional source I would need to establish scope."
},
{
  id: "visibility-tls-leaves-you-metadata",
  track: "visibility", level: "policy",
  title: "Encrypting everything blinds your own detection, and that is a real cost",
  source: "RFC 7258, Pervasive Monitoring Is an Attack, 2014",
  idea: "The same encryption that protects traffic from an attacker on the path protects it from your own inspection, so improving confidentiality reduces detection capability, and both effects are genuine.",
  why: "This corpus recommends encrypting everything, and it should also be honest that the recommendation has a price. Once traffic is encrypted end to end, network-based detection loses the payload and is left with endpoints, timing, volumes, the announced server name and the negotiated parameters. Signature-based detection that looked for patterns in content stops working. Data loss prevention that inspected payloads stops working. The detections written before encryption was widespread quietly stop firing rather than reporting that they cannot see.\n\nThe resolution is not to encrypt less. It is to accept that detection has to move, and to know where it moves to. Two places: the endpoints, where an agent or the application itself sees plaintext before it is encrypted, and the metadata, where the remaining signals are weaker individually but sufficient in aggregate for a great deal. That relocation costs work and it changes who owns detection, from a network team with a device in the path to application and platform teams instrumenting their own services. Which is the real reason it does not happen: the trade is understood and the ownership transfer is not organised.",
  failureMode: "An attacker's exfiltration passes through a network monitoring stack that was effective five years ago and now sees only that an encrypted connection occurred. None of its content-based detections fire. None of them report being unable to see, so the dashboards look identical to the days when they were working.",
  experiment: "Take three of your network detections and determine, for each, whether it depends on payload content. For any that do, check what fraction of your traffic is now encrypted on that path. Fifteen minutes, and a payload detection on a fully encrypted path is a detection that has silently stopped.",
  reflection: "Which of your detections stopped working when encryption became universal, and did anything report that?",
  recall: {
    q: "What does universal encryption cost you, and where does detection move?",
    a: "It removes the payload from network-based detection, leaving endpoints, timing, volumes, the announced server name and negotiated parameters. Signature-based detection and payload inspection stop working, and they stop silently rather than reporting blindness.\n\nDetection moves to the endpoints, where agents or applications see plaintext before encryption, and to metadata in aggregate. That transfers ownership from a network team with a device in the path to application and platform teams, which is the part that usually fails to happen."
  },
  deepDive: "Audit the detections I describe for dependence on payload content and tell me which have silently stopped working as encryption spread."
},
{
  id: "visibility-inspection-trade",
  track: "visibility", level: "policy",
  title: "To inspect payloads in the middle you must hold plaintext there, and that is the whole trade",
  source: "Saltzer, Reed and Clark, End-to-End Arguments in System Design, ACM TOCS, 1984",
  idea: "Restoring payload visibility to a device in the path requires terminating encryption at it, which makes that device a holder of all your plaintext and a target worth more than what it protects.",
  why: "The mechanism is unavoidable: inspection requires plaintext, and getting plaintext in the middle means decrypting there, which means the device holds a private certificate authority trusted by all your clients so it can impersonate every destination. Consider what that device then is. It sees every credential, every session token and every payload for every user. It can modify responses. Its authority is trusted by every client you administer. Compromising it is worth more than compromising almost anything it was deployed to protect.\n\nSo the trade is legible and can be decided rather than defaulted into. On one side, restored payload detection and data loss inspection. On the other, a single point of total compromise, a component that must be patched with extreme urgency, and the practical consequence that certificate pinning and some modern protocol features stop working through it. Reasonable organisations land on both sides of this depending on what they are defending and against whom. The failure is landing on it without noticing, usually because an inspection appliance was deployed by a network team as a monitoring improvement and nobody costed the position it now occupies.",
  failureMode: "An attacker compromises the inspection appliance, which holds a certificate authority trusted by every managed client. They now read every session token and credential in the organisation, and can impersonate any site to any employee, from a single device that was deployed to improve visibility.",
  experiment: "Find out whether anything in your estate terminates and inspects TLS, and if so what trusts its authority. Then ask what compromising it would yield compared to compromising the most sensitive system it protects. Fifteen minutes.",
  reflection: "If you inspect, was that trade explicitly decided and by whom, and if you do not, what detection are you accepting the loss of?",
  recall: {
    q: "What does mid-path payload inspection require, and what does the device become?",
    a: "It requires terminating encryption there, which requires a private certificate authority trusted by all your clients so the device can impersonate every destination.\n\nIt becomes a holder of every credential, session token and payload, able to modify responses, trusted by every managed client, so compromising it is worth more than most of what it protects. It also breaks certificate pinning and some modern protocol features. The trade is legitimate and should be decided rather than defaulted into."
  },
  deepDive: "Help me evaluate whether TLS inspection is worth it for a specific threat I describe, and what the appliance's compromise would yield."
},
{
  id: "visibility-denied-is-the-highest-signal",
  track: "visibility", level: "ops",
  title: "A denied connection is the highest-signal line in your logs and usually the least collected",
  source: "NIST SP 800-92, Guide to Computer Security Log Management, 2006",
  cheat: "Log denies, alert when a deny counter that was always zero becomes non-zero, and never dashboard allows.",
  idea: "An allowed connection is one of millions and tells you almost nothing, while a denied one means something attempted an action you decided was not permitted, which is a small and meaningful population.",
  why: "The signal-to-noise ratio between the two is enormous and the collection effort usually goes the wrong way. Allowed connections are the normal operation of the system, so a record of one carries almost no information and there are far too many to review. A denied connection means a component tried to do something the policy forbids, and the population of those is small enough to look at. In a healthy estate most denies are misconfiguration rather than attack, which is itself worth knowing, and the residue is the interesting part.\n\nThe sharpest version is the transition rather than the volume. A deny rule whose counter has been zero for a year, becoming non-zero, is close to the highest-quality alert available anywhere: something just attempted an action that has never been attempted in the lifetime of that rule. That is far more specific than any anomaly detector, requires no baseline modelling, and produces almost no false positives by construction. It is also very rarely configured, because deny logging is often off by default for volume reasons and because dashboards get built around throughput rather than refusals.",
  failureMode: "An attacker probes a segment boundary and is refused. The refusal is enforced correctly, is not logged, and nobody learns that the probe happened. The attacker learns the boundary exists and looks for another route, having paid nothing for the attempt, and repeats until something works.",
  experiment: "Check whether denied connections are logged in your estate. Then find one deny rule whose counter is zero and set an alert for it becoming non-zero. Twenty minutes, and that single alert is often the best detection added in a month.",
  reflection: "Do your dashboards show allows or denies, and which of those would tell you something you did not already know?",
  recall: {
    q: "Why is a denied connection worth more than an allowed one, and what is the sharpest form of the signal?",
    a: "Because an allowed connection is normal operation among millions and carries almost no information, while a deny means something attempted a forbidden action, which is a small reviewable population. Most denies are misconfiguration, which is worth knowing, and the residue is the interesting part.\n\nThe sharpest form is a deny counter that has been zero for a long time becoming non-zero: something just attempted what has never been attempted, with no baseline modelling and almost no false positives."
  },
  deepDive: "Help me configure deny logging in the estate I describe and identify the deny rules whose counters should be alerted on."
},
{
  id: "visibility-dns-logs-are-cheapest-coverage",
  track: "visibility", level: "ops",
  title: "Resolution logs are the cheapest complete-coverage telemetry you can have",
  source: "RFC 1035, Domain Names, read for what the query path makes observable",
  cheat: "Log every resolver query with the asking workload. It is small, complete, unaffected by encryption of the traffic itself, and answers the first question of most investigations.",
  idea: "Every workload resolves names before connecting, the queries are small and in plaintext at your own resolver, and the result is a near-complete record of intent across the estate.",
  why: "Coverage is what makes it valuable. There is no way to opt out of resolution, so unless a workload has been forced onto an external encrypted resolver, every intended destination passes through a component you own and can log. The volume is small compared with flow or payload data because a query is tiny and one query covers many connections. And crucially it is unaffected by traffic encryption: what is inside the connection is opaque and the name that was looked up before it is not.\n\nIt also answers the question investigations actually start with, which is what did this workload try to reach. A resolution record captures intent even when the connection failed, which flow data does not do as clearly, and it captures the name rather than an address, which is what a human can act on. Two things are needed to realise the value: the query log must record which workload asked, since a log of queries with no source is much less useful, and workloads must be prevented from using resolvers you do not operate, which is the encrypted resolution problem from the naming track and the reason it belongs to both tracks.",
  failureMode: "An attacker's activity is investigated and the only telemetry that survives is resolution logs, which turns out to be enough to establish the timeline: the workload began resolving names it had never resolved before at a specific hour, and the list of them describes the attacker's infrastructure. Where those logs do not record the asking workload, the same data establishes only that somebody in the estate did it.",
  experiment: "Check three things: whether resolver queries are logged, whether the log records the asking workload, and how long they are retained. Fifteen minutes, and any no is cheap to fix relative to its value.",
  reflection: "If resolution logs were your only surviving telemetry, how much of an incident could you reconstruct?",
  recall: {
    q: "Why are resolution logs the highest-value cheap telemetry, and what two conditions make them useful?",
    a: "Because coverage is near-complete since nothing can avoid resolution, volume is small since one tiny query covers many connections, and they are unaffected by traffic encryption. They also capture intent even for failed connections, and record names rather than addresses.\n\nThe conditions are that the log records which workload asked, and that workloads cannot use resolvers you do not operate, which is the encrypted resolution problem."
  },
  deepDive: "Help me set up resolver query logging with workload attribution for the platform I describe, and tell me what retention to aim for."
},
{
  id: "visibility-ephemeral-addresses-need-time",
  track: "visibility", level: "wire",
  title: "An address without a timestamp identifies nothing in an ephemeral estate",
  source: "NIST SP 800-92, on log correlation and time synchronisation",
  idea: "Addresses are reassigned within minutes, so a record naming an address is only interpretable alongside the mapping of addresses to workloads at that exact moment, and that mapping has to have been retained too.",
  why: "This is the operational consequence of addresses not being identities. Flow logs, firewall logs and most network telemetry record addresses, because that is what the network layer knows. In an estate where workloads are created and destroyed continuously, an address in a record from three weeks ago corresponds to whatever held it then, and answering that requires a historical mapping from addresses to workloads with timestamps. Most estates have the current mapping and not the historical one, which makes older network telemetry uninterpretable.\n\nTwo requirements follow. The mapping has to be retained for at least as long as the telemetry that references it, which is a retention decision people rarely connect to their log retention. And clocks have to agree, because correlating a flow record with an orchestrator event at minute resolution fails if the two sources are skewed, and the failure is subtle: you get a plausible but wrong attribution rather than no attribution. The better answer where the platform supports it is to have the telemetry carry the workload identity directly rather than only the address, which removes the correlation step entirely and is worth asking for.",
  failureMode: "An attacker's activity is traced to an address in a flow record from a month ago. The address now belongs to an unrelated workload, and no historical mapping was retained, so the investigation cannot determine which workload was compromised. The telemetry existed and answered a question about an address rather than about a system.",
  experiment: "Take a network log entry from a month ago and try to determine which workload the address belonged to at that time. Fifteen minutes, and if you cannot, note whether the obstacle is retention of the mapping or clock skew.",
  reflection: "Is your address-to-workload history retained as long as the network telemetry that references it, and did anyone connect those two retention settings?",
  recall: {
    q: "Why is an address in old network telemetry often uninterpretable, and what does interpreting it require?",
    a: "Because addresses are reassigned within minutes in an ephemeral estate, so the address identifies whatever held it at that moment, not what holds it now.\n\nInterpreting it requires a historical address-to-workload mapping retained at least as long as the telemetry referencing it, and synchronised clocks, since skew produces plausible but wrong attribution rather than none. Better still is telemetry carrying the workload identity directly."
  },
  deepDive: "Tell me whether the estate I describe retains a historical address-to-workload mapping as long as its network telemetry, and how to fix it if not."
},
{
  id: "visibility-nat-collapses-attribution",
  track: "visibility", level: "wire",
  title: "Translation and proxies collapse many sources into one and destroy attribution",
  source: "RFC 3022, Traditional IP Network Address Translator, 2001, read for its effect on logging",
  idea: "Anything that rewrites the source address of outbound traffic makes every workload behind it look identical in every record taken downstream of it.",
  why: "Shared egress translation, a proxy, a mesh gateway and a load balancer all have this effect in the outbound direction: downstream records show the shared address, so a destination's logs and your own egress logs cannot say which workload was responsible. This is usually discovered during an incident, when a suspicious outbound connection is traced to a translation gateway and stops there.\n\nRecovering attribution requires correlating two records: the translation mapping, which says which internal source and port were rewritten to which external port at which moment, and the downstream record. That mapping is high-volume, frequently not logged at all, and short-lived where it is. So the practical guidance is to establish before you need it whether that correlation is possible, and if it is not, to place the logging upstream of the translation instead, where the source is still the workload. This is also an argument for a proxy over plain translation, since a proxy is a component that can log the workload identity and the destination hostname together, which is exactly the record that makes an outbound investigation tractable.",
  failureMode: "An attacker exfiltrates from one of four hundred workloads sharing an egress address. The destination is identified, the time is known, and which workload did it cannot be determined, because translation mappings were not logged and every record downstream shows the same source. Containment becomes a choice between doing nothing and isolating four hundred workloads.",
  experiment: "Find one shared egress point and determine whether you could attribute an outbound connection through it to a specific workload for an event last week. Fifteen minutes, and a no means your egress telemetry needs to move upstream of the translation.",
  reflection: "If a suspicious outbound connection were reported by a third party tomorrow, could you name the workload?",
  recall: {
    q: "What does source address translation do to your telemetry, and how is attribution recovered?",
    a: "It makes every workload behind it identical in every downstream record, including the destination's logs and your own egress logs, which is usually discovered mid-incident when a trace stops at the gateway.\n\nRecovery requires correlating the translation mapping - internal source and port to external port at a moment - with the downstream record, and that mapping is high-volume, often unlogged and short-lived. Better to log upstream of the translation, or use a proxy that can record workload identity and destination hostname together."
  },
  deepDive: "For the shared egress points I describe, tell me whether outbound connections are attributable to a workload and where the logging should move."
},
{
  id: "visibility-retention-is-the-window",
  track: "visibility", level: "policy",
  title: "Retention is the window in which an incident is investigable",
  source: "NIST SP 800-92, on log retention",
  idea: "Intrusions are frequently discovered long after they begin, so retention shorter than your realistic time to detection guarantees that the start of an incident is outside the record.",
  why: "The two numbers have to be compared and usually are not. Retention is set by cost and by whoever configured the platform, commonly to a week or two for high-volume network telemetry. Time to detection for a competent intrusion is routinely much longer, and for one discovered by an external party it can be months. When retention is shorter, the investigation can establish that something is happening now and cannot establish when it started, what the initial access was, or what else was touched early. Those are the three questions that determine scope, and scope is what customer notification and remediation depend on.\n\nThe useful move is not simply longer retention for everything, which is expensive at network telemetry volumes. It is tiering by question: keep the small high-value sources for a long time, and the bulky ones for a short time. Resolution logs and denied connections are small and answer the first questions, so they can be retained for months cheaply. Full flow data is large and can be shorter. That gives you a long window for the timeline and a short one for the detail, which is a much better shape than a uniform two weeks and costs less than uniform retention.",
  failureMode: "An attacker is discovered by a third party ninety days after initial access. Flow logs are retained for fourteen days. The investigation can describe the last fortnight and nothing else, so the incident report states an unknown initial access vector and an unknown scope, and the customer notification has to assume the worst because nothing narrows it.",
  experiment: "Write down your retention period for each network telemetry source next to your best estimate of time to detection. Then identify the smallest source that answers the timeline question and check whether it could be retained for months. Fifteen minutes.",
  reflection: "If an intrusion from four months ago were reported to you tomorrow, which of your sources would still have anything?",
  recall: {
    q: "How should retention be set, and what is the better shape than uniform retention?",
    a: "By comparing it against realistic time to detection, which for a competent intrusion is much longer than the week or two commonly configured for network telemetry. Shorter retention guarantees the start of the incident is outside the record, leaving initial access and scope undeterminable.\n\nThe better shape is tiering by question: retain small high-value sources such as resolution logs and denied connections for months, and bulky flow data for a shorter period. A long window for timeline and a short one for detail costs less than uniform retention."
  },
  deepDive: "Help me design tiered retention for the network telemetry in an estate I describe, given a realistic time to detection."
},
{
  id: "visibility-sampling-decides-reconstructability",
  track: "visibility", level: "wire",
  title: "Sampling decides which incidents you can reconstruct, and it was chosen for cost",
  source: "RFC 7011, on flow export and sampling",
  idea: "Most network telemetry is sampled to control volume, and a sampled record set will reliably show heavy traffic and reliably miss a small number of significant connections.",
  why: "Sampling is necessary at scale and its bias is exactly wrong for security. It preserves the statistical picture, which is what capacity planning needs, and it drops individual events, which is what an investigation needs. A single connection that established a channel, a handful of queries that extracted the interesting rows, one authentication from an unexpected source: these are precisely the events a sample is likely to miss, and their rarity is what made them significant.\n\nWhat makes this worth an entry is that the sampling rate is usually invisible to the people relying on the data. It is set in a platform configuration, expressed as a ratio, and the resulting records look complete: they are well-formed, they cover the period, and nothing marks the gaps. So an analyst concludes that a connection did not happen when the truth is that it was not sampled. Knowing your rate converts a false negative into an honest uncertainty, which is a large difference in an investigation, and it also lets you make the right argument, which is usually to sample the bulk traffic hard and keep unsampled records for the small number of high-value paths.",
  failureMode: "An attacker's single command channel connection does not appear in the flow record set because sampling dropped it. The investigation concludes there is no evidence of outbound communication from that workload, which is recorded as a finding of no exfiltration, and the records genuinely contain nothing while also not being complete.",
  experiment: "Find the sampling rate on your flow telemetry. Then compute the probability that a single short connection appears at all. Fifteen minutes, and if the answer is low, note that absence of evidence in that source means nothing.",
  reflection: "Has anybody in your organisation ever concluded that something did not happen based on a sampled source?",
  recall: {
    q: "Why is sampling bias wrong for security, and why is it dangerous in practice?",
    a: "Because it preserves the statistical picture that capacity planning needs and drops individual events, which is what investigations need. A single channel-establishing connection, a few extracting queries or one unexpected authentication are exactly what a sample misses, and their rarity is what made them significant.\n\nIt is dangerous because the rate is invisible and the records look complete, so an analyst concludes something did not happen when it merely was not sampled. Knowing the rate converts a false negative into honest uncertainty."
  },
  deepDive: "Tell me the sampling rates on the telemetry I describe and which high-value paths should be recorded unsampled."
},
{
  id: "visibility-identity-attached-to-connections",
  track: "visibility", level: "policy",
  title: "Connection records need an identity attached, or they describe plumbing rather than behaviour",
  source: "NIST SP 800-207, Zero Trust Architecture, 2020, on logging authenticated context",
  cheat: "Enrich connection records with workload and user identity at the point of collection. Addresses alone are not an audit trail.",
  idea: "A record of endpoints and ports describes the network, and a record of which workload and which user was responsible describes what happened, and only the second one is an audit trail.",
  why: "Every entry in this track so far has been working around the same limitation: network telemetry knows addresses, and addresses are not identities. Attaching identity at collection time solves it directly rather than by correlation. Where a mesh or proxy is in the path this is available, because that component authenticated the caller and knows exactly who it was, and the only question is whether its logs record it. Where an application is instrumented, it knows the authenticated user as well, which is the layer above what any network component can see.\n\nThe reason this is the right answer rather than better correlation is that correlation is fragile in exactly the ways the earlier entries described: it needs historical address mappings, synchronised clocks, and translation records, and each is a separate retention decision that can fail independently. Identity recorded at the moment of the connection needs none of that. It is worth checking specifically whether your mesh access logs include the authenticated peer identity, because that field is often available and frequently not enabled, which makes it one of the cheapest large improvements to investigative capability available.",
  failureMode: "An attacker's lateral movement is recorded in full: every connection between services appears in the mesh access logs with addresses and timing. Which workload identity made each call is not recorded, because the field was available and not enabled, so reconstructing the path requires correlating against historical address mappings that were retained for a week.",
  experiment: "Check whether your mesh or proxy access logs include the authenticated peer identity. If the field exists and is not enabled, enable it. Fifteen minutes, and this is often the single highest-value telemetry change available.",
  reflection: "How much of your incident correlation work exists only because identity was not recorded at the point of connection?",
  recall: {
    q: "Why attach identity at collection rather than correlating afterwards?",
    a: "Because correlation depends on historical address-to-workload mappings, synchronised clocks and translation records, each a separate retention decision that can fail independently, while identity recorded at the moment of connection needs none of them.\n\nA mesh or proxy already authenticated the caller and knows exactly who it was, so the only question is whether the field is enabled in its logs. An instrumented application additionally knows the authenticated user, which no network component can see."
  },
  deepDive: "Tell me whether the mesh or proxy in the estate I describe can log authenticated peer identity, and what enabling it would give me."
},
{
  id: "visibility-baseline-is-the-hard-part",
  track: "visibility", level: "ops",
  title: "Anomaly detection is easy to buy and hard to baseline, and the baseline is the product",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013, on establishing normal",
  idea: "Detecting unusual network behaviour requires knowing what usual looks like, and in an estate that deploys continuously, normal changes faster than a baseline can be established.",
  why: "The premise is sound: a workload that starts talking to something new is worth investigating. The difficulty is that in an active estate, workloads legitimately start talking to new things constantly, because deployments add dependencies, feature flags change behaviour, autoscaling creates workloads that have no history, and a new provider endpoint appears because a library was upgraded. So a naive detector produces a stream of alerts that are all real changes and almost all benign, and the response is to widen the thresholds until it stops firing, at which point it detects nothing.\n\nWhat works is narrowing the population rather than tuning the sensitivity. A baseline over a stable, small, high-value set is achievable: the destinations a payment service reaches, or the internal services a data-processing workload calls, are short lists that change rarely and where a new entry is genuinely interesting. A baseline over everything is not achievable and is where these projects die. So the useful question to ask of any anomaly detection proposal is which specific population it is baselining, and if the answer is the estate, the honest expectation is a lot of noise followed by disabled alerts.",
  failureMode: "There is no attacker in this failure. A detection deployed across the estate produces two hundred alerts a day, every one a genuine change and none of them malicious. Within a month the thresholds are widened until it is silent, and six months later a real new destination appears and produces no alert, in a system everybody believes is watching.",
  experiment: "Pick your highest-value workload and write down every destination it reached in the last week. If that list is short and stable, you have a baseline worth alerting on. Twenty minutes, and if the list is long, pick a smaller workload.",
  reflection: "Do you have any anomaly detection whose thresholds have been widened to stop the noise, and is it still counted as a control?",
  recall: {
    q: "Why does network anomaly detection usually fail, and what makes it work?",
    a: "Because normal changes constantly in an active estate: deployments add dependencies, flags change behaviour, autoscaling creates workloads with no history, library upgrades introduce endpoints. A naive detector alerts on genuine benign changes until thresholds are widened to silence.\n\nIt works by narrowing the population rather than tuning sensitivity. A short stable destination list for one high-value workload is a baseline where a new entry is genuinely interesting. A baseline over the whole estate is not achievable."
  },
  deepDive: "Help me pick the workloads in an estate I describe whose destination lists are stable enough to baseline and alert on."
},
{
  id: "visibility-unfired-detection-is-untested",
  track: "visibility", level: "ops",
  title: "A detection that has never fired is untested, exactly like an unattempted rule",
  source: "Richard Bejtlich, The Practice of Network Security Monitoring, 2013, on validating detection",
  cheat: "Trigger every detection deliberately and confirm it fires and reaches a person. Silence is not evidence that it works.",
  idea: "A detection that has produced no alerts is either watching something that has not happened or broken, and the two are indistinguishable without deliberately triggering it.",
  why: "This is the same argument as the untested network rule, and it needs stating separately because detection has more ways to break silently. The data source can stop arriving. A field can be renamed by a platform upgrade so the query matches nothing. A parser can change and the rule quietly stops matching. Retention can shorten below the detection's window. The alert can fire into a channel nobody reads or an integration that has been disconnected. Every one of these produces exactly the same observable as a quiet environment: nothing.\n\nSo the discipline is to trigger it. Generate the traffic or the event the detection is looking for, from a position that would be realistic, and confirm two things: that the alert fires, and that it reaches a person who knows what to do. The second half is the one that fails more often, because the detection engineering and the response routing are owned by different people. Doing this on a schedule rather than once matters for the same reason as with rules: platform upgrades and pipeline changes break detections continuously, and nothing else will tell you.",
  failureMode: "An attacker's activity matches a detection that was written correctly two years ago and stopped matching after a platform upgrade renamed a field. No alert fires. Every dashboard shows the detection as enabled and healthy, because healthy and never-matching look the same, and the intrusion continues for as long as it likes.",
  experiment: "Pick one detection you rely on and deliberately generate what it looks for. Confirm it fires and confirm the alert reaches a person. Thirty minutes, and if it does not fire, note how long it has been that way.",
  reflection: "How many of your detections have never fired, and how would you tell the healthy ones from the broken ones?",
  recall: {
    q: "Why is a silent detection not evidence of a quiet environment, and what does testing require?",
    a: "Because a detection breaks silently in many ways: the data source stops arriving, a platform upgrade renames a field, a parser change stops the rule matching, retention drops below its window, or the alert fires into an unread channel or a disconnected integration. All look identical to nothing happening.\n\nTesting requires generating what it looks for from a realistic position and confirming both that it fires and that it reaches a person who knows what to do, on a schedule, since upgrades break detections continuously."
  },
  deepDive: "Help me build a schedule for deliberately triggering the detections I describe, asserting both that each fires and that it reaches a responder."
},
{
  id: "visibility-log-shipping-is-egress",
  track: "visibility", level: "policy",
  title: "Your logs are a target, and shipping them is an egress path with your whole estate in it",
  source: "NIST SP 800-92, on protecting log data",
  idea: "Aggregated logs contain credentials, internal topology and the record of an attacker's activity, and the path that ships them is an outbound flow to a destination that is often external.",
  why: "Three separate concerns and they are usually all unowned. First, content: aggregated logs are a rich target because they contain tokens captured in headers, internal hostnames, query fragments, and enough topology to plan an attack. An attacker who reaches your log store may not need to reach anything else. Second, integrity: logs are the record of the attacker's activity, so the ability to delete or modify them is the ability to remove the evidence, which is why append-only storage and a copy outside the compromised estate matter.\n\nThird, and specific to this corpus, the shipping path is egress. Logs frequently go to a third-party service, which means a continuous high-volume outbound flow carrying material you would classify as sensitive if anybody classified it, to a destination that must be on every allowlist. That is a permitted channel of exactly the kind the egress track warns about, and it is a channel an attacker can use, since anything that can write to the log pipeline can send data through it. Which makes the log destination worth the same treatment as any other egress destination: named, reviewed, and understood as being inside your trust boundary for everything that passes through it.",
  failureMode: "An attacker with access to a workload writes crafted data into its logs, which the shipping pipeline dutifully sends to an external destination the attacker controls or can read. Alternatively they reach the log store and harvest tokens captured in request headers months ago, gaining credentials for systems they never touched.",
  experiment: "Answer three questions: where do your logs go, is that destination inside or outside your estate, and are your logs append-only. Then grep one day of logs for anything resembling a token. Twenty minutes, and the grep usually finds something.",
  reflection: "Is your log destination reviewed as an egress destination and as a holder of sensitive data, or only as a monitoring tool?",
  recall: {
    q: "What are the three security concerns about log aggregation?",
    a: "Content: aggregated logs hold tokens captured in headers, internal hostnames, query fragments and enough topology to plan an attack, so reaching the log store may be sufficient on its own. Integrity: logs are the record of the attacker's activity, so append-only storage and a copy outside the estate matter.\n\nAnd the shipping path is egress: a continuous high-volume outbound flow of sensitive material to a destination on every allowlist, usable by anything that can write to the pipeline."
  },
  deepDive: "Help me assess the log pipeline in an estate I describe as an egress path and as a holder of sensitive data."
},
{
  id: "visibility-list-what-an-incident-needs",
  track: "visibility", level: "ops",
  title: "Write down what an incident will need, before the incident, because you will not think of it then",
  source: "NIST SP 800-61 Rev. 2, Computer Security Incident Handling Guide, 2012",
  cheat: "Write the list of questions an incident asks and the source that answers each. Review it when the platform changes.",
  idea: "The questions an incident asks are predictable and largely the same every time, so the list can be written in advance and checked against what you actually collect.",
  why: "This entry closes the track because it converts everything in it into one artefact. The questions do not vary much: what was the earliest sign, what did the compromised workload reach, what reached it, did data leave and how much, who was authenticated for each action, which other workloads share the same exposure, and what is still happening now. Each maps to a specific data source, and each source has an existence question, a retention question and an attribution question that the preceding entries in this track have covered.\n\nWriting it as a table is worth more than it sounds, for two reasons. It turns telemetry from an open-ended cost into a bounded requirement, which is what makes the spending arguable rather than perpetual. And it is the only form in which gaps are visible before they matter, because a gap in a table is obvious and a gap in a monitoring stack is not. The maintenance discipline is to revisit it when the platform changes, since a migration or a new cluster silently resets several of the answers, and the table is the only thing that will notice.",
  failureMode: "There is no attacker in this failure either. An incident begins, the team improvises for the first six hours discovering what data exists rather than investigating, and three of the seven questions turn out to be unanswerable for reasons that were all knowable and cheap to fix a month earlier.",
  experiment: "Build the table: seven questions in the first column, the data source that answers each in the second, whether it exists and its retention in the third. Thirty minutes, and the empty cells are your telemetry roadmap in priority order.",
  reflection: "How many of the seven can you answer today, and which gap would you close first given what it costs?",
  recall: {
    q: "Why write the incident question list in advance, and what does it produce?",
    a: "Because the questions are predictable and largely the same every time - earliest sign, what the workload reached, what reached it, whether data left, who was authenticated, which workloads share the exposure, what is still happening - and during an incident you improvise instead of investigating.\n\nAs a table it turns telemetry from an open-ended cost into a bounded requirement, making the spend arguable, and it is the only form where gaps are visible before they matter. Revisit it when the platform changes, since migrations silently reset the answers."
  },
  deepDive: "Build the incident question table with me for the estate I describe, and rank the empty cells by cost to close against value."
}
);

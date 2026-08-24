/* Track: Segmentation. Ordered foundational first.
 *
 * Least Authority covers isolation as a tenancy question: silo against pool,
 * shared kernels, tenant predicates, co-residency channels. This track is the
 * network mechanics underneath that - which primitive expresses which rule,
 * where enforcement actually happens, and how a segmentation project is
 * evaluated rather than merely completed. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "segmentation-bounds-what-you-did-not-prevent",
  track: "segmentation", level: "policy",
  title: "Segmentation is the only control that acts on a compromise you failed to prevent",
  source: "CNCF Cloud Native Security Whitepaper, on segmentation and lateral movement",
  idea: "Every other control tries to stop the initial compromise, and segmentation decides what the attacker can reach once one has happened, which is the assumption you should be designing under.",
  why: "The case for it is the same shape as the case for egress restriction and it is worth making explicitly, because segmentation is usually justified with a compliance requirement rather than an argument, which makes it hard to prioritise and easy to do badly. The argument is that compromise probability is not something you can drive to zero, so the expected cost has two factors, and segmentation is the only lever on the second one.\n\nThat framing also tells you how to sequence the work. If the objective is reducing what a compromise reaches, then you start from the workloads most likely to be compromised rather than from the ones that are most sensitive, which is the opposite of how these projects usually begin. The workload that parses untrusted input, runs third-party code or has the largest attack surface is where the compromise will happen, and the segmentation that matters is the boundary immediately around it. Starting from the sensitive database and working outward produces rules that look reassuring and constrain nothing, because the attacker was never going to start there.",
  failureMode: "An attacker compromises an image-processing worker, which is the workload most likely to be compromised because it parses untrusted files. From there they reach the internal admin API, the metrics store and every other namespace, because the segmentation project spent its effort building careful boundaries around the databases and never drew one around the worker.",
  experiment: "List your workloads in order of how likely each is to be compromised, judged by whether it parses untrusted input, runs third-party code, or is internet-facing. Then check which of the top three has a boundary drawn around it. Fifteen minutes.",
  reflection: "Did your segmentation work start from the sensitive assets or from the likely entry points, and would reordering it change what you build next?",
  recall: {
    q: "What is the argument for segmentation, and what does it imply about sequencing?",
    a: "Compromise probability cannot be driven to zero, so expected cost has two factors and segmentation is the only lever on the second: what a compromise reaches once it has happened.\n\nSo the work should start from the workloads most likely to be compromised - those parsing untrusted input, running third-party code, or internet-facing - rather than from the most sensitive assets. Starting at the database and working outward produces reassuring rules that constrain nothing, because the attacker never starts there."
  },
  deepDive: "Rank the workloads I describe by likelihood of compromise and tell me which boundaries to build first on that basis."
},
{
  id: "segmentation-defined-by-what-crosses",
  track: "segmentation", level: "policy",
  title: "A segment is defined by what may cross its edge, not by a subnet mask",
  source: "NIST SP 800-41 Rev. 1, on network architecture and zone design",
  cheat: "A subnet with no rule at its edge is an address range, not a segment. The rule set is the segment.",
  idea: "Putting workloads in separate address ranges creates no boundary by itself, and the boundary is entirely constituted by the rules controlling traffic between them.",
  why: "The confusion is encouraged by tooling, where creating a subnet feels like an act of separation and appears as a distinct box in every diagram. It is not: two subnets in the same virtual network route to each other by default in most platforms, so the separation is cosmetic until something restricts it. This produces estates with elaborate address plans, a diagram full of neatly labelled zones, and full connectivity between all of them.\n\nThe corrective is to describe segments by their rules rather than their ranges. A segment is a set of workloads plus a statement of what may enter and leave it, and if you cannot state the second part then you have not got a segment. That reframing has a useful side effect on documentation, because a diagram of address ranges tells you nothing about the security architecture while a diagram of permitted flows is the security architecture. It also makes the review tractable: reviewing an address plan is unfalsifiable, and reviewing a list of permitted flows between named zones is something two people can disagree about productively.",
  failureMode: "An attacker in a workload placed in a subnet labelled as an untrusted zone in the architecture diagram opens a connection to a workload in the subnet labelled as the restricted data zone, and it succeeds, because the two are in the same virtual network and nothing was ever written to restrict traffic between them. The zones exist in the diagram only.",
  experiment: "Take two subnets your documentation describes as separate zones and try to open a connection between them. Then look for the rule that was supposed to prevent it. Fifteen minutes, and a successful connection means you have address ranges rather than segments.",
  reflection: "Could you produce a diagram of permitted flows between your zones today, and if not, what is your current diagram actually describing?",
  recall: {
    q: "Why does creating separate subnets not create a boundary?",
    a: "Because subnets in the same virtual network route to each other by default in most platforms, so the separation is cosmetic until a rule restricts it. Tooling encourages the confusion by making subnet creation feel like separation and drawing it as a distinct box.\n\nA segment is a set of workloads plus a statement of what may enter and leave. If you cannot state the second part, you have an address range. A diagram of permitted flows is the security architecture; a diagram of ranges is not."
  },
  deepDive: "Given the subnets and zones I describe, help me write the permitted-flow statement that would actually make each a segment."
},
{
  id: "segmentation-primitive-semantics-differ",
  track: "segmentation", level: "wire",
  title: "The primitives are not interchangeable, and mixing up their semantics leaves holes",
  source: "The AWS documentation on security groups and network ACLs, read for the semantic differences",
  cheat: "Know which of your primitives are stateful, which are ordered, which default to deny, and which attach to a workload rather than a range.",
  idea: "Each network policy primitive differs in whether it is stateful, whether rules are ordered, whether the default is deny, and whether it attaches to a workload or to an address range, and a rule written with the wrong model in mind fails silently.",
  why: "Four axes, and every combination exists in some platform. Statefulness decides whether you must permit return traffic separately. Ordering decides whether an early broad rule can shadow a later narrow one, or whether all rules are evaluated as a set. The default decides what an unmatched connection does. And attachment decides what the rule follows: a rule bound to a workload identity or label moves with the workload, while a rule bound to an address range applies to whatever is currently in the range.\n\nThe reason this needs to be explicit knowledge rather than intuition is that the mistakes are silent in both directions. Someone who learned on a stateful, unordered, deny-by-default, workload-attached primitive will write an address-range rule set that fails to permit return traffic, and will not understand why. Someone going the other way will write a rule assuming order matters where it does not, or assume a deny rule exists where the primitive has no deny concept at all. And the most dangerous case is a rule that appears to be enforcing something because it is syntactically valid in a model that does not include the concept it was written for.",
  failureMode: "An attacker benefits from a rule that was written to deny a specific source in a primitive that has no deny concept and evaluates its rules as a permissive set. The rule was accepted, appears in the configuration, is cited in reviews, and has never denied anything, because in that model an unmatched rule simply does not grant and cannot subtract.",
  experiment: "For each network policy primitive in your estate, write down its answer on all four axes: stateful, ordered, default, attachment. Then check one rule you rely on against those answers. Twenty minutes, and the table is worth keeping.",
  reflection: "How many distinct primitives are in play in your estate, and does anyone hold the semantics of all of them?",
  recall: {
    q: "What are the four axes on which network policy primitives differ, and why does it matter?",
    a: "Statefulness, which decides whether return traffic needs its own rule; ordering, which decides whether early broad rules shadow later narrow ones; the default for unmatched connections; and attachment, whether the rule follows a workload or applies to whatever is in an address range.\n\nIt matters because mistakes are silent. The worst case is a rule that is syntactically valid in a model lacking the concept it was written for, so it appears in reviews and has never enforced anything."
  },
  deepDive: "Build me the four-axis table for the network primitives in the platforms I use, and check the rules I paste in against it."
},
{
  id: "segmentation-netpol-deny-only-once-selected",
  track: "segmentation", level: "wire",
  title: "Cluster network policy is deny-by-default only for pods some policy already selects",
  source: "The Kubernetes documentation on network policies",
  cheat: "A pod selected by no policy accepts everything. Apply a default-deny policy per namespace first, then add allows.",
  idea: "A pod that no policy selects accepts all traffic, and a pod that any policy selects accepts only what its policies permit, so the model is deny-by-default per pod rather than per cluster.",
  why: "This is the single most misunderstood mechanic in cluster networking and the misunderstanding always runs in the unsafe direction. Writing a policy that allows a specific flow to one pod does not deny anything to any other pod. It changes that pod from accept-everything to accept-only-this, and leaves every unselected pod exactly as open as before. So a cluster with a dozen carefully written policies can still be fully connected, because the policies cover twelve pods and the other four hundred were never selected.\n\nThe correct construction is to apply a policy per namespace that selects all pods and permits nothing, which flips every pod in that namespace into the restricted state, and then add allow policies on top. That ordering matters operationally as well as conceptually: applying default-deny first will break things immediately and visibly, which is why the log-only rollout discipline from the egress track applies here too. What does not work is inferring the cluster's posture from the presence of policies, since the count of policies tells you nothing about the count of pods they select.",
  failureMode: "An attacker in a compromised pod reaches services throughout the cluster despite an inventory of network policies, because those policies select the pods that were being protected and not the pod the attacker landed in. Every policy is correct and enforced. The attacker's pod was selected by none of them and therefore accepts and initiates anything.",
  experiment: "For one namespace, count the pods and count the pods actually selected by at least one policy. The difference is the number of pods with no restrictions. Fifteen minutes, and the ratio is usually the finding.",
  reflection: "Does your cluster have a default-deny policy per namespace, and if not, what does your existing policy count actually tell you?",
  recall: {
    q: "How does cluster network policy default, and what construction is required?",
    a: "Deny-by-default per pod rather than per cluster: a pod selected by no policy accepts everything, and a pod selected by any policy accepts only what its policies permit.\n\nSo adding an allow policy for one pod denies nothing elsewhere. The required construction is a per-namespace policy selecting all pods and permitting nothing, then allow policies on top. The count of policies says nothing about the posture, only the count of pods they select does."
  },
  deepDive: "For the namespaces I describe, tell me how many pods are unselected by any policy and write the default-deny policies I need."
},
{
  id: "segmentation-policy-without-enforcement",
  track: "segmentation", level: "ops",
  title: "A policy object with no enforcing component is a document that passes audits",
  source: "The Kubernetes documentation on network policy prerequisites",
  cheat: "Confirm your cluster networking actually implements policy enforcement. A valid policy object in a cluster that ignores them enforces nothing.",
  idea: "Cluster network policies are enforced by the networking plugin rather than by the platform itself, so a cluster running a plugin that does not implement them accepts the objects and ignores them entirely.",
  why: "The specification is part of the platform and the enforcement is not. A policy object is validated for syntax, stored, returned by queries and displayed in every tool, and whether it does anything depends on a component chosen at cluster creation, possibly by somebody who has since left, possibly by a managed service default. Several widely used networking plugins do not implement policy at all, and in that case the objects are inert.\n\nWhat makes this worse than an ordinary misconfiguration is that every signal points the wrong way. The policy exists, so it appears in inventories. It is syntactically valid, so it passes review. Compliance tooling that checks for the presence of network policies finds them. Nothing anywhere reports that they are not being enforced, because from the platform's perspective nothing is wrong. This is the strongest single argument for the discipline in the model track of attempting the connection a rule forbids, because it is the only check that distinguishes an enforced policy from a stored one, and here the distinction is total rather than partial.",
  failureMode: "An attacker moves freely between pods that a policy explicitly forbids, because the cluster's networking plugin does not implement policy enforcement. Every policy object is present, valid and reported as compliant. Not one of them has ever affected a packet.",
  experiment: "Identify your cluster's networking plugin and confirm from its documentation that it implements policy enforcement. Then, regardless of the answer, apply a deny policy in a test namespace and attempt the forbidden connection. Twenty minutes, and only the second half is evidence.",
  reflection: "Has anybody ever verified enforcement in your clusters, or has the presence of policy objects been taken as sufficient?",
  recall: {
    q: "Why can a valid cluster network policy enforce nothing, and what makes it hard to notice?",
    a: "Because enforcement is provided by the networking plugin rather than the platform, and several widely used plugins do not implement it, in which case the objects are stored and ignored.\n\nEvery signal points the wrong way: the policy exists in inventories, is syntactically valid, passes review and satisfies compliance checks for the presence of policies. Nothing reports non-enforcement, so attempting the forbidden connection is the only evidence."
  },
  deepDive: "Tell me whether the networking plugin in the cluster I describe enforces network policy, and write me a test that proves it either way."
},
{
  id: "segmentation-mesh-sidecar-bypass",
  track: "segmentation", level: "wire",
  title: "A mesh enforces policy in a sidecar, so traffic that avoids the sidecar avoids the policy",
  source: "The CNCF Cloud Native Security Whitepaper, on service mesh enforcement",
  cheat: "Mesh policy applies only to traffic through the sidecar. Confirm traffic cannot leave the pod any other way before relying on it.",
  idea: "Mesh authorisation and mutual authentication are implemented by a proxy in the request path, and anything that reaches the network without passing through that proxy is unaffected by every mesh rule.",
  why: "The mesh works by intercepting the workload's traffic and redirecting it through a local proxy, usually with rules in the pod's network namespace. That interception is a mechanism with edges. Traffic to addresses excluded from redirection bypasses it. Protocols the proxy does not handle may be passed through untouched. A pod using the host's network namespace is outside the interception entirely. A workload can sometimes reach the network directly depending on how the redirection is configured and what capabilities it holds.\n\nThe consequence is that mesh policy is a strong control with a precondition, and the precondition is complete interception. That is the same complete-mediation argument as the edge bypass and the egress proxy bypass, and it should now be recognisable as the recurring shape: a control in the path is worth exactly as much as the guarantee that there is no other path. The practical form here is to enumerate what is excluded from redirection, check for pods using the host network, and test by attempting a connection that mesh policy forbids from inside a pod, which is the only way to distinguish policy that is enforced from policy that is configured.",
  failureMode: "An attacker in a compromised pod sends traffic to an address that the mesh's redirection configuration excludes, or uses a protocol the proxy passes through, and reaches a service that mesh authorisation policy explicitly forbids. The policy is correct and the proxy is healthy; the traffic never went through it.",
  experiment: "Find the redirection exclusion list in your mesh configuration and read what is excluded. Then check whether any pods run with the host network namespace. Then attempt a forbidden connection from inside a pod. Twenty minutes.",
  reflection: "Who maintains the exclusion list, and would a new entry be reviewed as a security change?",
  recall: {
    q: "What is the precondition for mesh policy to mean anything, and how does it fail?",
    a: "Complete interception of the workload's traffic by the sidecar proxy. It fails through addresses excluded from redirection, protocols the proxy passes through untouched, pods using the host network namespace, and workloads able to reach the network directly given their capabilities.\n\nThis is the same complete-mediation shape as the edge bypass and the egress proxy bypass: a control in the path is worth the guarantee that there is no other path."
  },
  deepDive: "Review the mesh redirection configuration I paste in and tell me what traffic bypasses the sidecar and therefore the policy."
},
{
  id: "segmentation-east-west-least-policy",
  track: "segmentation", level: "policy",
  title: "East-west traffic has the most volume, the least policy and the least logging",
  source: "NIST SP 800-207, Zero Trust Architecture, 2020, on internal traffic assumptions",
  idea: "Traffic between internal services vastly exceeds traffic crossing the perimeter, and it is where the fewest rules and the least visibility exist, which is precisely where lateral movement happens.",
  why: "The imbalance is historical. Perimeter traffic was the security concern for decades, so that is where the products, the rules, the logging and the review effort accumulated. Internal service-to-service traffic grew enormously with service decomposition, and it grew inside a model that assumed internal meant trusted, so it grew unpoliced. In most estates the ratio is not close: a handful of carefully reviewed ingress rules and effectively unrestricted internal connectivity carrying orders of magnitude more traffic.\n\nWhat makes this actionable is that lateral movement is by definition east-west, so the direction with the least control is the direction an attacker spends all their time in after the first minute. It also explains why detection is so poor for this phase: connection logging is usually configured at the perimeter, so the connections that constitute an intrusion's entire middle section are the ones nobody records. The practical implication is to invert the usual review effort at least once, and ask what internal flows exist, which are necessary, and which are logged, before spending more attention on a perimeter that already has several layers.",
  failureMode: "An attacker spends three weeks moving between internal services, and the only recorded evidence of any of it is at the perimeter, where they entered once and exfiltrated once. The entire middle of the intrusion happened in a direction with no rules to violate and no logs to appear in.",
  experiment: "Estimate the ratio between the number of reviewed ingress rules and the number of restricted internal flows in your estate. Then check whether internal connections are logged anywhere. Fifteen minutes, and both numbers are usually startling.",
  reflection: "If an intrusion were in its lateral movement phase right now, what record would exist of it?",
  recall: {
    q: "Why is east-west the direction that matters most and gets the least attention?",
    a: "Because lateral movement is by definition east-west, so it is where an attacker spends everything after the first minute, and it is where the fewest rules and the least logging exist, since products, rules and review accumulated at the perimeter while internal traffic grew under an assumption that internal meant trusted.\n\nIt also explains poor detection for that phase: connection logging is configured at the perimeter, so the middle of an intrusion appears nowhere."
  },
  deepDive: "Help me inventory the internal flows in an estate I describe, which are necessary, and which are logged anywhere."
},
{
  id: "segmentation-shared-services-reach-everything",
  track: "segmentation", level: "policy",
  title: "Shared services are reachable from everything by design, which makes them the natural bridge",
  source: "NIST SP 800-41 Rev. 1, on common services and least common mechanism",
  idea: "Resolution, logging, metrics, secrets and configuration services must be reachable from every workload, so each of them is a component that connects every segment you have built.",
  why: "Segmentation divides an estate into zones, and then a set of services has to be reachable from all of them or nothing works. That set is a bridge in the reachability graph, and it is a bridge you cannot remove. So the design question is not whether to allow it but what the bridge can do: whether reaching the logging service lets you read other tenants' logs, whether the metrics endpoint can be queried as well as written to, whether the configuration service exposes other segments' configuration, and whether any of them can initiate connections back.\n\nThat last point is the sharp one. A shared service that only accepts connections is a bridge attackers can use for reconnaissance and possibly for data access. A shared service that also initiates connections into segments is a bridge in both directions, and compromising it gives reach into everything. Log shippers, monitoring agents that pull rather than receive, and configuration agents that connect out are all in this category. Which means the shared services deserve the strongest boundaries in the estate precisely because they have the widest reachability, and they usually have the weakest because they are platform components that predate the segmentation work.",
  failureMode: "An attacker compromises the metrics collector, which is reachable from every segment and which pulls from endpoints in all of them. From that single position they can query every segment and read every metric, including the ones that leak internal topology, without crossing a single boundary that was written to stop them.",
  experiment: "List your shared services and, for each, note whether it only accepts connections or also initiates them into segments. Then pick the one with the widest reach and check what boundary exists around it. Twenty minutes.",
  reflection: "Do your shared services have stronger or weaker boundaries than the workloads they serve, and which would you expect?",
  recall: {
    q: "Why are shared services a segmentation problem, and which are worst?",
    a: "Because resolution, logging, metrics, secrets and configuration must be reachable from every zone, so each is an unremovable bridge in the reachability graph. The design question is what the bridge permits: cross-tenant reads, queries as well as writes, other segments' configuration.\n\nWorst are the ones that also initiate connections into segments, such as pull-based monitoring, log shippers and configuration agents, because compromising them gives reach into everything rather than only reconnaissance."
  },
  deepDive: "Enumerate the shared services in an estate I describe, note which initiate connections into segments, and tell me which needs the strongest boundary."
},
{
  id: "segmentation-hostnetwork-escapes-policy",
  track: "segmentation", level: "wire",
  title: "A workload on the host network is outside every policy written about pods",
  source: "The Kubernetes documentation on host namespaces",
  cheat: "Audit for pods using the host network. They are outside pod-level policy and mesh interception both.",
  idea: "A pod sharing the node's network namespace has the node's addresses and interfaces, so policies and interception that operate on pod networking do not apply to it.",
  why: "Pod-level network policy and mesh interception both work on the pod's own network namespace, which is what gives each pod its own address and its own rule set. A pod configured to use the host namespace instead has no separate networking to police: its traffic originates from the node, appears to come from the node, and bypasses the mechanisms that would have applied. That is not a bug, it is what the setting is for, and it exists because some workloads genuinely need it.\n\nThe security consequences are worth listing because they compound. Such a pod is not subject to pod network policy, is not intercepted by a mesh sidecar, inherits whatever reachability the node has, which is usually much broader than any pod's, and can reach services bound to the node's loopback interface, which are often unauthenticated because loopback was assumed to be private. That last one is the sharpest, because node-local services include agents and interfaces with significant privileges. So the audit is simple and worth running: enumerate pods using the host network, and for each, establish why, because the setting is often inherited from an example manifest rather than needed.",
  failureMode: "An attacker in a pod using the host network reaches a node-local agent listening on loopback with no authentication, because loopback was assumed to be reachable only from the node itself. No pod network policy applies to the attacker's pod, and no mesh rule saw the connection.",
  experiment: "List every pod in your clusters using the host network namespace. For each, find out why, and check what is listening on the node's loopback interface that such a pod could reach. Twenty minutes.",
  reflection: "For the pods that use the host network, was that a considered decision or copied from an example?",
  recall: {
    q: "Why is a pod on the host network outside your segmentation, and what is the sharpest consequence?",
    a: "Because pod network policy and mesh interception both operate on the pod's own network namespace, and a pod sharing the node's namespace has no separate networking to police, so its traffic originates from the node and bypasses both.\n\nThe sharpest consequence is reaching services bound to the node's loopback interface, which are often unauthenticated because loopback was assumed private, and node-local agents frequently hold significant privileges."
  },
  deepDive: "Help me audit for pods using the host network in a cluster I describe and identify what node-local services they could reach."
},
{
  id: "segmentation-private-endpoint-versus-peering",
  track: "segmentation", level: "policy",
  title: "Peering connects two networks and a private endpoint connects to one service",
  source: "NIST SP 800-144, Guidelines on Security and Privacy in Public Cloud Computing, 2011",
  idea: "Both arrangements let you reach something without traversing the internet, and they differ enormously in how much reachability they create.",
  why: "Peering joins two networks so that addresses in each are routable from the other, subject to whatever rules exist at either end. The reachability created is network-wide and transitive in effect if either side has further connections, which makes it a large grant that is easy to underestimate because it is configured once and then invisible. Private endpoint arrangements instead place a single service's endpoint inside your network, so what becomes reachable is that one service and nothing else, with no route to the provider's wider network and no route from theirs into yours.\n\nThe practical guidance follows directly: prefer the narrower mechanism whenever the requirement is access to a specific service, which is most of the time, and reserve peering for cases that genuinely need network-level connectivity. Where peering already exists, the important question is what rules constrain it at your end, because the default is often full reachability between the two address spaces. It is also worth checking for the transitive case, since a peer that is itself peered with a third party may make that third party reachable depending on the platform's transitivity rules, which people rarely check because the relationship was established by a different team for a different purpose.",
  failureMode: "An attacker who has compromised a partner's environment, reached through a peering connection established years ago for one integration, finds that the peering grants network-wide reachability and that nothing at your end restricts which of your services it can reach. The integration used one service; the connection permitted all of them.",
  experiment: "List every peering connection in your estate. For each, note why it exists, what it was needed for, and what rules constrain it at your end. Twenty minutes, and any with no constraining rules is today's finding.",
  reflection: "For your existing peerings, could any be replaced by a private endpoint to the one service that actually needed reaching?",
  recall: {
    q: "How do peering and private endpoints differ in what they grant?",
    a: "Peering makes the two networks' address spaces mutually routable subject to rules at each end, which is a network-wide grant that is easy to underestimate and may be transitive through the peer's own connections. A private endpoint places one service's endpoint inside your network, granting reachability to that service alone.\n\nPrefer the narrower mechanism when the requirement is a specific service. For existing peerings, check what constrains them at your end, since the default is often full reachability."
  },
  deepDive: "Review the peering connections in an estate I describe and tell me which could be replaced with a private endpoint to a single service."
},
{
  id: "segmentation-bastion-still-running",
  track: "segmentation", level: "ops",
  title: "The bastion was replaced by an identity-aware proxy and is still running",
  source: "Ward and Beyer, BeyondCorp: A New Approach to Enterprise Security, ;login:, 2014",
  idea: "Estates that adopt identity-aware access rarely decommission the jump host it replaced, which leaves a machine with broad reachability, weak authentication and no attention.",
  why: "The migration is real and beneficial: access moves from a machine you connect to and then move onward from, to a proxy that authorises each connection against an identity and a device. What happens to the old machine is that it stays. It is needed for one legacy system, or for a break-glass path, or for a team that has not migrated, and each of those is a legitimate reason for it to exist a little longer.\n\nThe security position it occupies is the problem. A jump host has broad reachability by design, since being able to reach everything was its purpose. Its authentication is usually keys rather than the identity infrastructure everything else now uses, so it sits outside your revocation path. It accumulates authorised keys, some belonging to people who have left, and shell history containing credentials. And it receives no attention, because the migration was declared complete and the monitoring effort went to the new path. The result is a machine with the reachability of the old model and the oversight of a decommissioned system, which is the worst combination available.",
  failureMode: "An attacker authenticates to a jump host with a key belonging to someone who left eighteen months ago, because the host authenticates against its own authorised keys files rather than the identity system that revoked that person's access. From there they reach everything the old access model permitted, which is most of the estate.",
  experiment: "Find every jump host still running. For each, list who can authenticate to it, when that list was last reviewed, and what it can reach. Twenty minutes, and a list containing departed staff is the finding.",
  reflection: "Is your remaining jump host inside your identity and revocation infrastructure, or does it authenticate independently?",
  recall: {
    q: "Why is a surviving jump host particularly dangerous after a migration to identity-aware access?",
    a: "Because it combines the reachability of the old model with the oversight of a decommissioned system. It was built to reach everything, it usually authenticates with keys outside the identity infrastructure and therefore outside the revocation path, it accumulates authorised keys from departed staff and credentials in shell history, and monitoring effort moved to the new path.\n\nIt survives for legitimate reasons: one legacy system, a break-glass path, an unmigrated team."
  },
  deepDive: "Help me assess the jump hosts still running in an estate I describe, who can authenticate to each, and what each can reach."
},
{
  id: "segmentation-egress-from-a-segment",
  track: "segmentation", level: "policy",
  title: "The segment nobody segmented is the one going outward",
  source: "NIST SP 800-41 Rev. 1, on outbound policy within zoned architectures",
  cheat: "A segment with restricted internal reachability and open internet egress has a boundary on three sides.",
  idea: "Segmentation projects restrict which internal services a zone may reach and routinely leave its outbound internet access wide, which makes the boundary partial in the direction that matters after a compromise.",
  why: "This is the intersection of two tracks and it is where both are commonly half-implemented. A zone is built with careful rules about which internal services it may reach, which is genuine and useful work. The rule permitting outbound to the internet stays as it was, because the workloads need package registries and provider endpoints and nobody wants to be the person who broke the build. The result is a segment that an attacker cannot easily move laterally out of and can trivially exfiltrate from, which defeats the purpose, since exfiltration is the objective and lateral movement is only the means.\n\nStating it as a property of the segment rather than as a separate egress problem makes it easier to fix, because it becomes part of the definition: a segment is characterised by what may enter, what may leave to other segments, and what may leave to the outside. A design review that asks for all three will catch this, and one that asks about internal reachability will not. It also makes the effort proportionate, since the segments where this matters most are the ones holding the most valuable data, and those are usually the ones with the least legitimate need for broad internet access.",
  failureMode: "An attacker in a well-segmented zone containing valuable data cannot reach any other internal service, which the segmentation work achieved. They do not need to. They send the data directly to their own endpoint over permitted outbound internet access, and the entire boundary was on the sides they were not using.",
  experiment: "Take the segment holding your most valuable data and write down its three boundaries: inbound, to other segments, and outbound to the internet. If the third is unrestricted, that is today's finding. Ten minutes.",
  reflection: "For your most sensitive segment, what does it legitimately need to reach on the internet, and is that list short enough to enforce?",
  recall: {
    q: "What is the boundary segmentation projects usually leave open, and why does it defeat the purpose?",
    a: "Outbound internet access. Zones get careful rules about which internal services they may reach, while the outbound rule stays as it was because workloads need registries and provider endpoints.\n\nIt defeats the purpose because exfiltration is the objective and lateral movement is only the means, so a segment that is hard to move out of and easy to exfiltrate from has a boundary on the wrong sides. A segment should be defined by all three boundaries: inbound, to other segments, and outbound."
  },
  deepDive: "For the segment I describe, define all three boundaries and tell me what its outbound allowlist would need to contain."
},
{
  id: "segmentation-flat-is-a-decision",
  track: "segmentation", level: "policy",
  title: "Flat is sometimes the right answer, and it should be a decision rather than a default",
  source: "NIST SP 800-41 Rev. 1, on balancing security requirements against operational complexity",
  idea: "Segmentation has real operational costs, and a small estate with one trust level may be correctly flat, but only if somebody chose that rather than never having considered it.",
  why: "It is worth saying plainly, because a corpus like this creates pressure toward more controls regardless of whether they earn their cost. Every boundary is a thing that can be misconfigured, that generates incidents when a legitimate flow is blocked, that has to be maintained as services change, and that makes debugging harder. In an estate with a handful of services all handling the same data at the same sensitivity, the boundaries may cost more in outages and toil than they save in blast radius.\n\nThe distinction that matters is between a considered flat design and an unconsidered one. A considered one has an explicit statement that everything in this environment is one trust zone, a defined perimeter around it, and a trigger for revisiting the decision, which is usually the arrival of a second data sensitivity level, a third-party integration, or multi-tenancy. An unconsidered flat design looks identical from the outside and has no perimeter statement, no trigger, and no record that anybody weighed it. The action for a reader in this position is to write the decision down, including the trigger, because that converts a default into an architecture and makes the next reviewer's job possible.",
  failureMode: "There is no immediate attacker here, and the failure is delayed. A flat estate takes on its first customer requiring data separation, and the segmentation work now has to happen against a fully connected estate with no boundaries to build on, under a deadline set by a contract, which is the most expensive moment to do it.",
  experiment: "If your estate is flat, write the decision down in one paragraph: everything here is one trust zone, the perimeter is this, and we will revisit when this happens. Ten minutes, and the trigger is the part that makes it useful.",
  reflection: "Is your estate flat by decision or by default, and if the former, has the trigger already been met?",
  recall: {
    q: "When is a flat network defensible, and what distinguishes a considered flat design?",
    a: "When the estate is small and everything handles the same data at the same sensitivity, so the boundaries would cost more in outages, toil and debugging difficulty than they save in blast radius.\n\nA considered design has an explicit statement that this is one trust zone, a defined perimeter, and a trigger for revisiting: a second sensitivity level, a third-party integration, or multi-tenancy. An unconsidered one looks identical and has none of those recorded."
  },
  deepDive: "Help me write down the flat-network decision for an estate I describe, including the specific triggers that should force a revisit."
},
{
  id: "segmentation-measured-before-and-after",
  track: "segmentation", level: "ops",
  title: "A segmentation project is evaluated by the reachable set, and nothing else counts",
  source: "CNCF Cloud Native Security Whitepaper, on measuring segmentation effectiveness",
  cheat: "Measure the reachable set from a nominated hostile workload before and after. Rules written is not a metric.",
  idea: "The only honest measure of segmentation work is the change in what a nominated hostile workload can reach, measured before and after, and every other metric can improve while that number does not.",
  why: "The metrics these projects usually report are activity: rules written, policies applied, namespaces covered, percentage of workloads with a policy. Every one of those can rise while reachability is unchanged, and the cluster policy mechanic earlier in this track is exactly how that happens: a hundred policies covering the wrong pods is a hundred policies. Reporting activity also removes the possibility of finishing, because there is always another rule to write.\n\nMeasuring the reachable set fixes both problems. It gives a number that goes down, which is what a stakeholder actually wants to know. It identifies diminishing returns, because at some point the next rule barely moves it. It settles arguments about whether a specific rule was worth its operational cost, since the rule either shrank the set or it did not. And it is the same measurement as the model track's blast radius entry, which means the number is comparable across the estate and over time. The one discipline it requires is fixing the starting workloads in advance and keeping them fixed, because a measurement whose starting point moves can be made to improve without anything changing.",
  failureMode: "There is no attacker in this failure, only a project that reports completion. Six months of work produces four hundred policies, full coverage in every dashboard, and a reachable set from the most likely compromise point that is one service smaller than when it started, which nobody measured and nobody knows.",
  experiment: "Nominate two or three workloads as hostile starting points, count what each can reach today, and write the numbers down with the date. That is the baseline, and it is the only artefact that makes the next six months of work assessable. Twenty minutes.",
  reflection: "What is your segmentation work currently reported on, and would that metric distinguish real progress from activity?",
  recall: {
    q: "What is the only honest measure of segmentation, and why do the usual metrics fail?",
    a: "The change in the reachable set from nominated hostile workloads, measured before and after with the starting points fixed in advance.\n\nRules written, policies applied and coverage percentages can all rise while reachability is unchanged, which is exactly what happens when policies select the wrong pods. Activity metrics also remove the possibility of finishing. The reachable set gives a number that goes down, shows diminishing returns, and settles whether a given rule earned its cost."
  },
  deepDive: "Help me establish a segmentation baseline for an estate I describe, choosing the hostile starting workloads and defining how to count the reachable set."
}
);

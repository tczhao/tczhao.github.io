/* Track: Isolation and multi-tenancy. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "isolation-boundary-is-where-the-bug-report-lands",
  track: "isolation", level: "practice",
  title: "A tenant boundary is wherever you would accept a cross-tenant bug report",
  source: "Adkins, Beyer, Blankinship, Lewandowski, Oprea and Stubblefield, Building Secure and Reliable Systems (O'Reilly, 2020)",
  idea: "Your tenant boundary is the line where a crossing becomes an incident rather than a defect, and it is only real where a mechanism sits on it.",
  why: "Most estates have no written boundary, so every engineer carries a private one. Ask three people where the tenant boundary is in your agent runtime and you will get the namespace, the database row and the request context. All three are partly right, which is another way of saying nobody can tell you what a breach is.\n\nThe useful test is the reaction test. Imagine a report saying tenant A saw tenant B's data at this point in the system. If the honest answer is 'that is a Sev1, we page and we notify', that point is on the boundary. If the answer is 'that is a bug, we fix it next sprint', it is not. Then check what stops the crossing at each Sev1 point. A convention that query authors pass tenant_id is not a mechanism. A middleware that refuses to construct a connection without a tenant scope is.",
  failureMode: "The incident review discovers the boundary was a code review habit. Someone added a background job that ran outside the request path, so it had no session, so it read across all tenants by construction. Nobody violated a rule because no rule existed in executable form.",
  experiment: "Draw your request path from ingress to storage and mark every hop. For each hop write one line: if tenant A's data appeared here under tenant B's request, is that a page or a ticket? Then for every hop marked 'page', name the mechanism enforcing it and whether a new service could bypass it by not calling that code. Count the ones where the answer is 'yes, trivially'.",
  reflection: "How many of your Sev1 hops are defended by a convention rather than a mechanism, and which one would you convert first?",
  recall: {
    q: "What distinguishes a tenant boundary from an ordinary correctness invariant, and what must sit on it?",
    a: "A boundary is a line where a crossing is treated as a security incident rather than a bug, which means it carries paging, notification and possibly regulatory duties. That reaction is what makes it a boundary rather than a preference.\n\nA line only counts once a mechanism enforces it, meaning something a new code path cannot bypass by simply not calling it. Middleware that refuses unscoped connections is a mechanism; a code review norm is not."
  },
  deepDive: "Walk my agent runtime's request path with me and help me classify each hop as page or ticket, then tell me which of the page-level hops rely on a convention that a new service could ignore."
},
{
  id: "isolation-silo-pool-bridge",
  track: "isolation", level: "practice",
  title: "Silo, pool and bridge are the three tenancy models and they price differently",
  source: "AWS, SaaS Tenant Isolation Strategies whitepaper",
  idea: "Every component in your estate independently sits in a silo, pooled or bridge model, and the isolation of the system is set by the most pooled component on the path.",
  why: "Silo means a dedicated instance of the resource per tenant, so the boundary is the resource itself. Pool means one shared instance with a logical partition inside it, so the boundary is a predicate you have to get right on every access. Bridge means some layers siloed and others pooled. The point of the vocabulary is that the choice is per component, not per platform, and teams almost never audit it component by component.\n\nThe expensive components get the attention. Someone will have thought hard about whether the database is siloed. Nobody thought about the Redis instance, the object store prefix, the vector index, the metrics backend, the log aggregator or the queue. Those are pooled by default because pooling them was free, and a pooled component on the request path means the whole path is pooled at the strength of that component's predicate.",
  failureMode: "You sell a siloed-database tier at a premium and then discover the siloed tenants share a single embedding index keyed by document id, so a nearest-neighbour query returns another tenant's chunk text. The premium bought isolation in the one place the customer asked about.",
  experiment: "List every stateful component your runtime touches, including caches, queues, blob prefixes, search and vector indexes, and the observability stack. Label each silo, pool or bridge. Circle the pooled ones and write the predicate that separates tenants inside each. Any circle with no written predicate is an open finding today.",
  reflection: "Which pooled component surprised you, and does your isolation claim to customers survive it?",
  recall: {
    q: "Why does the tenancy model have to be assessed per component rather than per product?",
    a: "Silo, pool and bridge describe a single resource, and a real system is dozens of resources on one request path. Each is independently siloed or pooled depending on what was cheap at the time.\n\nEffective isolation is set by the weakest link, so a siloed database behind a pooled cache or a pooled vector index gives you pooled-strength isolation overall. The cheap components are where the pooled ones hide."
  },
  deepDive: "Help me build a silo/pool/bridge table for every stateful component my agent runtime touches, and flag the pooled ones with no explicit tenant predicate."
},
{
  id: "isolation-namespace-is-not-a-boundary",
  track: "isolation", level: "practice",
  title: "A Kubernetes namespace is a scope for names, not a security boundary",
  source: "Kubernetes documentation, Multi-tenancy; NSA and CISA, Kubernetes Hardening Guide (2022)",
  idea: "A namespace scopes names and RBAC and says nothing about the kernel, the network, the node or the scheduler, so namespace-per-tenant is a claim that needs four further mechanisms named.",
  why: "The namespace is an authorisation scope for the API server. It partitions object names and gives RBAC something to bind to. That is the whole of what it does. Two pods in different namespaces on the same node share a kernel, can reach each other over pod-to-pod networking by default, contend for the same CPU and memory and page cache, and can be scheduled onto each other's nodes.\n\nSo when someone says namespace-per-tenant, ask which mechanism covers each of the four gaps. Kernel: a sandboxed runtime such as gVisor or a VM boundary such as Firecracker or Kata, or an accepted risk. Network: a default-deny NetworkPolicy in both directions. Node: taints, tolerations and node selectors, or a per-tenant node pool. Resource: ResourceQuota and LimitRange, plus a scheduler policy. Four named mechanisms or you have a naming convention with an RBAC binding.",
  failureMode: "A tenant workload does a DNS lookup for a service in another namespace, gets a ClusterIP, connects, and finds an internal API with no authentication because 'it is only reachable inside the cluster'. Nothing was misconfigured; the default was flat and the namespace was never going to stop it.",
  experiment: "Exec into any pod in one tenant namespace and curl a service in another. If it connects you have measured the network gap. Then run kubectl get networkpolicy --all-namespaces and count how many namespaces have a default-deny ingress policy and how many have a default-deny egress policy. The second number is usually zero.",
  reflection: "Which of the four gaps - kernel, network, node, resource - is unmechanised in your cluster, and is that a decision or an oversight?",
  recall: {
    q: "Name the four things a Kubernetes namespace does not isolate, and one mechanism for each.",
    a: "The kernel, the network, the node and shared resources. A namespace only scopes object names and gives RBAC a binding target.\n\nMechanisms: a sandboxed or virtualised runtime for the kernel, default-deny NetworkPolicy in both directions for the network, node pools with taints and selectors for placement, and ResourceQuota with LimitRange for contention."
  },
  deepDive: "For my cluster, help me write the four-mechanism table behind our namespace-per-tenant claim and identify which mechanism is missing or only partially applied.",
  expires: "2028-02-01"
},
{
  id: "isolation-shared-kernel-syscall-surface",
  track: "isolation", level: "practice",
  title: "Containers share a kernel, so the syscall table is the attack surface",
  source: "NIST SP 800-190, Application Container Security Guide (2017)",
  idea: "Container escape is kernel exploitation plus misconfiguration, so the surface you are defending is every syscall the container can reach and every host resource it was handed.",
  why: "A container is a set of namespaces and cgroups over one shared kernel. Every syscall a containerised process makes is executed by the same kernel serving every other tenant on that node. A single kernel memory-corruption bug reachable from an unprivileged syscall is a cross-tenant compromise, and the kernel is millions of lines of C that keeps producing those.\n\nIn practice most escapes are not novel kernel zero-days. They are configuration. The realistic list is short and checkable: privileged pods, added capabilities such as CAP_SYS_ADMIN, hostPath mounts including the Docker or containerd socket, hostNetwork and hostPID, and unrestricted syscall filters. Each one hands a container a piece of the host directly. Audit those before you reason about kernel CVEs, because that is where the escapes actually come from.",
  failureMode: "A build pod mounts /var/run/docker.sock so it can run docker build. Any code inside that pod, including code influenced by tenant-authored input, can create a new container with the host root filesystem mounted and full privileges. That is not an escape exploit; it is the documented behaviour of the socket you handed over.",
  experiment: "Run a cluster-wide query for pods with securityContext.privileged true, any hostPath volume, hostNetwork or hostPID true, or added capabilities. Write down the count and the owning team for each. Anything on a node that also runs tenant-influenced workloads is today's finding.",
  reflection: "Which of your privileged or host-mounting pods share a node with code that reads customer-authored text?",
  recall: {
    q: "Why is a container a weaker boundary than a VM, and what are the four common misconfigurations that produce escapes?",
    a: "Containers are namespaces and cgroups over one shared kernel, so the entire syscall interface is reachable attack surface and one kernel bug crosses every container on the node. A VM interposes a much narrower hardware interface.\n\nThe common misconfigurations are privileged pods, dangerous added capabilities, host mounts such as the container runtime socket or hostPath, and host namespaces such as hostNetwork or hostPID."
  },
  deepDive: "Audit the pod specs in this repo for privileged mode, host mounts, host namespaces and added capabilities, and tell me which ones co-schedule with tenant-influenced code."
},
{
  id: "isolation-attenuate-the-container",
  track: "isolation", level: "practice",
  title: "Seccomp, capabilities and user namespaces attenuate a container",
  source: "Kubernetes documentation, Pod Security Standards",
  idea: "Dropping all capabilities, running as non-root, enabling the RuntimeDefault seccomp profile and forbidding privilege escalation are the four settings that turn a container from packaging into partial containment.",
  why: "By default a container process runs with a substantial capability set and an unfiltered syscall interface. Each of the four settings removes a category of reachable surface rather than patching a specific bug. Dropping capabilities removes the privileged operations. Running as a non-root UID means a filesystem escape lands as an unprivileged user. RuntimeDefault seccomp blocks a large set of rarely used syscalls, which is where a disproportionate number of kernel bugs live. allowPrivilegeEscalation false stops setuid binaries regaining what you dropped.\n\nThe Pod Security Standards package these as baseline and restricted so you can enforce them admission-side rather than hoping each team sets them. Enforce restricted on tenant workload namespaces and audit elsewhere. This is attenuation, not containment: the syscalls that remain still run on the shared kernel, which is exactly why the next two entries exist.",
  failureMode: "A team sets runAsNonRoot but leaves the default capability set and no seccomp profile. A kernel bug in an obscure syscall that RuntimeDefault would have blocked is reachable, and the non-root UID buys nothing because the exploit runs in kernel context.",
  experiment: "Pick your busiest tenant-facing namespace and check whether the Pod Security admission label enforces restricted. If not, run it in warn mode for an hour and count the violations by workload. That count is the size of the migration, and it is usually smaller than the team assumes.",
  reflection: "What is actually blocking restricted enforcement in your tenant namespaces, and is it a real requirement or an unexamined default?",
  recall: {
    q: "What do the four container hardening settings each remove, and why is the result still not containment?",
    a: "Dropping capabilities removes privileged operations, non-root means a filesystem escape lands unprivileged, RuntimeDefault seccomp blocks a wide band of rarely used syscalls where many kernel bugs live, and allowPrivilegeEscalation false stops setuid regaining dropped privilege.\n\nIt is attenuation because the remaining syscalls still execute on the shared host kernel. A bug in a permitted syscall is still a cross-tenant escape."
  },
  deepDive: "Check the pod specs here against the Pod Security Standards restricted profile and give me the shortest diff that would let us enforce it.",
  expires: "2027-12-01"
},
{
  id: "isolation-gvisor-syscall-tax",
  track: "isolation", level: "modern",
  title: "gVisor buys isolation with a syscall tax",
  source: "Young, Zhu, Caldwell, Chen and Porter, The True Cost of Containing: A gVisor Case Study, USENIX HotCloud 2019",
  idea: "A userspace kernel narrows the host syscall surface dramatically and charges most on syscall-heavy and IO-heavy workloads, so the choice is per workload rather than per platform.",
  why: "gVisor implements the Linux system call interface in a userspace process, so guest syscalls are serviced by that process rather than passed to the host kernel. The host surface reachable from tenant code collapses to the much smaller set the sentry itself uses, which is the security win: a kernel bug in an obscure syscall is no longer reachable from a guest that never touches the host with it.\n\nThe cost lands where the workload interacts with the kernel. The HotCloud study measured heavy overheads on syscall-dominated and file-IO-dominated operations while CPU-bound work stayed close to native. That shape is what makes this a per-workload decision. A model-inference container that is compute-bound and network-light pays little; a build step doing hundreds of thousands of small file operations pays a lot. Measure your own workload rather than importing a benchmark number, because the ratio depends entirely on your syscall mix.",
  failureMode: "A platform team mandates gVisor everywhere, the CI image build step slows by a large multiple, developers get an exemption process, and within a quarter the exemption list includes the tenant-facing workloads that actually needed the sandbox.",
  experiment: "Take the one workload that most directly executes tenant-influenced code and run it under both runtimes with the same input. Record wall clock and, if you can, strace-count the syscalls. You now have a real number for the security-versus-latency trade for that workload instead of a general opinion.",
  reflection: "For your tenant-influenced workload, what is the measured overhead, and is that price you would pay?",
  recall: {
    q: "What does gVisor actually change about the attack surface, and where does its cost concentrate?",
    a: "It services guest system calls in a userspace kernel, so the host kernel surface reachable from tenant code shrinks to what the sentry itself invokes rather than the full syscall table.\n\nThe overhead concentrates on syscall-heavy and file-IO-heavy work, while CPU-bound work stays near native. That makes it a per-workload choice, and you should measure your own syscall mix."
  },
  deepDive: "Help me design a fair before-and-after benchmark for running our tenant-facing worker under a sandboxed runtime, including which syscall counters to capture.",
  expires: "2028-02-01"
},
{
  id: "isolation-firecracker-vm-per-task",
  track: "isolation", level: "modern",
  title: "Firecracker puts a VM boundary under a function sized workload",
  source: "Agache et al., Firecracker: Lightweight Virtualization for Serverless Applications, NSDI 2020",
  idea: "A minimal device model and fast boot make hardware virtualisation cheap enough per task that a VM becomes the practical boundary for running tenant-influenced code.",
  why: "The historical reason multi-tenant platforms used containers rather than VMs was density and start latency. Firecracker attacked both by stripping the device model to a handful of virtio devices plus a serial console and a one-button keyboard controller, giving boot times in the low hundreds of milliseconds and memory overhead of a few megabytes per microVM. That changes the economics: you can afford a VM per tenant task rather than per tenant fleet.\n\nWhat you get for it is the strongest boundary generally available in a shared-host estate. The interface between guest and host is the hardware virtualisation interface plus a small userspace VMM, not the Linux syscall table. For an agent runtime executing tenant-influenced code, generated code or model-selected tool calls, that is the right default and containers are the exception you justify. Note the operational cost is not zero: nested virtualisation is often unavailable on managed Kubernetes, so this usually means bare metal instances or a separate execution service.",
  failureMode: "You run tenant-generated code in a shared container pool because it is convenient, and a kernel bug or a runtime misconfiguration gives one tenant's generated code the node. Every credential mounted on that node across every pod on it is now in scope.",
  experiment: "Identify the single place in your system where the least trusted code executes: generated code, a customer-supplied transform, a model-chosen shell command. Write down what boundary is under it right now and whether a VM boundary is reachable there this quarter. If it is not, write down what would have to change, in one paragraph, and take that to your platform team.",
  reflection: "What is the least trusted code you run, and what exactly is the boundary under it today?",
  recall: {
    q: "What did Firecracker change that made per-task VMs practical, and why does that matter for an agent runtime?",
    a: "It cut the device model to a minimal virtio set and a tiny VMM, giving boot times in the low hundreds of milliseconds and a few megabytes of overhead per microVM, so a VM per task is affordable where previously only a VM per fleet was.\n\nFor an agent runtime the least trusted thing you execute is tenant-influenced or model-generated code, and the guest-to-host interface of a VM is far narrower than the shared Linux syscall table a container exposes."
  },
  deepDive: "Given our workload shape and cloud provider, help me cost out putting a VM boundary under the component that executes model-generated code.",
  expires: "2028-02-01"
},
{
  id: "isolation-default-deny-egress",
  track: "isolation", level: "practice",
  title: "Default deny egress is the network policy that matters",
  source: "Kubernetes documentation, Network Policies",
  idea: "Ingress rules protect your services and egress rules protect your customers, and almost every estate writes the first and skips the second.",
  why: "In a flat cluster, a pod that is compromised or that is following instructions embedded in customer text can open a connection to anywhere: another tenant's service, the cloud metadata endpoint, an internal admin API, or an attacker's collector on the public internet. Ingress policy does nothing about any of that, because the traffic originates inside. Egress policy is the control that turns an exfiltration channel into a connection refused.\n\nThis is the network expression of the lethal trifecta. An agent runtime that holds tenant credentials and reads customer-authored text already has private data and untrusted content in one process. The outbound channel is the third leg, and it is the only one of the three you can remove with a config change. Write a default-deny egress policy per tenant namespace and then allowlist the specific destinations the workload needs, including the DNS resolver, since an allowlist that forgets DNS fails closed in a confusing way and gets rolled back.",
  failureMode: "Customer-authored metadata description text tells the agent to summarise a table and post the summary to a URL. The tool that makes HTTP calls is doing exactly its job, the outbound request succeeds because nothing blocks egress, and the first evidence is in someone else's server log.",
  experiment: "Exec into a tenant workload pod and attempt three connections: the cloud metadata IP, an arbitrary external host, and a service in another tenant's namespace. Record which succeed. Then write a default-deny egress NetworkPolicy for one namespace, apply it in a non-production cluster, and count how many legitimate destinations you had to allowlist. That number is your real egress footprint and it is usually shorter than expected.",
  reflection: "How many distinct external destinations does your runtime legitimately need, and could you enumerate them without running the experiment?",
  recall: {
    q: "Why is egress policy the more important half in a multi-tenant estate, and what does an allowlist commonly forget?",
    a: "Ingress policy protects your services from inbound traffic, but cross-tenant reach, metadata service access and exfiltration all originate inside the pod. Only egress policy addresses those, and it is the one leg of the lethal trifecta removable by configuration.\n\nAllowlists commonly forget the DNS resolver, so the policy appears to break everything for unrelated reasons and gets reverted before anyone diagnoses it."
  },
  deepDive: "Help me enumerate the real outbound destinations of our agent runtime from its code and config, so I can write a default-deny egress policy with a correct allowlist."
},
{
  id: "isolation-tenant-predicate-is-the-boundary",
  track: "isolation", level: "practice",
  title: "A shared database makes the tenant predicate the only boundary",
  source: "Microsoft Azure Architecture Center, multitenant data architecture guidance",
  idea: "In a pooled schema one missing WHERE clause is a full cross-tenant breach, so the predicate has to be enforced somewhere no query author can forget it.",
  why: "Pooled storage moves the boundary from the resource to a condition inside a query. That is a legitimate design and it is what most SaaS runs on, but it means correctness of isolation now depends on every query in the codebase, forever, including the ones written under deadline by someone who joined last week and the ones a model writes at runtime.\n\nThe only durable answer is to move the predicate out of query-author hands. The options, roughly in order of strength: database-enforced row policies bound to a session variable; a mandatory data access layer where the tenant scope is a constructor argument and there is no unscoped constructor; a query interceptor that rejects statements on tenant-scoped tables lacking the predicate. Whichever you pick, the acceptance criterion is the same. A new engineer writing a plausible query on a tenant table must not be able to produce a cross-tenant read by omission.",
  failureMode: "An analytics endpoint aggregates counts across a tenant table. The aggregation is correct but the tenant predicate was left off because 'it is only counts'. The count is a cross-tenant information leak, and the code review passed because the query returned no rows of customer data.",
  experiment: "Grep your repository for raw SQL or query-builder calls against your three largest tenant-scoped tables and count how many include an explicit tenant predicate versus how many inherit one from a framework. Then write one deliberately unscoped query in a test and see whether anything at all stops it. If it runs, the predicate is a convention.",
  reflection: "Where does your tenant predicate live, and could a new engineer bypass it without noticing?",
  recall: {
    q: "In a pooled database, what has the tenant boundary become, and what is the acceptance test for enforcing it properly?",
    a: "The boundary is a predicate inside every query, so isolation now depends on the discipline of every query author including future ones and any query a model generates.\n\nThe acceptance test is that a plausible query written by someone who does not know about the predicate cannot produce a cross-tenant read. That requires database row policies, a data access layer with no unscoped constructor, or a rejecting query interceptor."
  },
  deepDive: "Look at how this codebase scopes queries to a tenant and tell me whether a new engineer could write an unscoped query on a tenant table without anything stopping them."
},
{
  id: "isolation-rls-failure-modes",
  track: "isolation", level: "practice",
  title: "Row level security fails through leaky functions, owners and bypass roles",
  source: "PostgreSQL documentation, Row Security Policies",
  idea: "Row level security is genuine database-enforced isolation with four documented bypasses, and every one of them is something an ordinary team does by accident.",
  why: "RLS is the strongest form of the pooled-database predicate because the engine applies it rather than the query author. The bypasses are documented rather than exotic. Table owners are exempt unless you set FORCE ROW LEVEL SECURITY, and applications routinely connect as the owner because that is what the migration user is. Roles with BYPASSRLS ignore policies entirely, and superuser implies it. SECURITY DEFINER functions run with the definer's rights, so a helper written for convenience can read across the policy. And the planner may evaluate a non-leakproof operator or function before the policy filter, so a crafted error message or a side effect can reveal rows the policy would have excluded.\n\nSo enabling RLS is the start. The check is: does the application connect as a non-owner role without BYPASSRLS, is FORCE set on tenant tables, is every SECURITY DEFINER function on those tables reviewed as a boundary crossing, and are you aware that the leak channel through non-leakproof functions is a real if narrow one.",
  failureMode: "RLS is enabled and tested, then a pooled connection is reused across requests without resetting the session variable that carries the tenant identity. The policy is enforcing perfectly against a stale value, so tenant B's request is filtered to tenant A's rows. The mechanism worked; the session state did not.",
  experiment: "On a non-production database, connect as your application's actual role and run SELECT current_user, then check pg_roles for rolbypassrls and rolsuper on that role, and check relforcerowsecurity on your tenant tables. Three lookups, and any of the three coming back wrong is a finding. Then list every SECURITY DEFINER function touching those tables.",
  reflection: "Does your application connect as the table owner, and if so what would it take to stop?",
  recall: {
    q: "Name the ways row level security can be bypassed even when the policy is correct.",
    a: "The table owner is exempt unless FORCE ROW LEVEL SECURITY is set, any role with BYPASSRLS or superuser ignores policies, and SECURITY DEFINER functions execute with the definer's rights and can read across the policy.\n\nAdditionally the planner can evaluate a non-leakproof function or operator before the policy filter, creating a narrow disclosure channel. Separately, connection pooling with a stale session variable makes a correct policy filter to the wrong tenant."
  },
  deepDive: "Review our Postgres setup for the four RLS bypass paths and tell me specifically whether our application role and connection pooling are safe."
},
{
  id: "isolation-tenant-id-from-session",
  track: "isolation", level: "practice",
  title: "Tenant identity comes from the session, never from a parameter",
  source: "OWASP API Security Top 10 (2023), API1 Broken Object Level Authorization",
  cheat: "Delete tenant, workspace and account parameters from tool schemas and bind the scope server-side from the session.",
  idea: "Any tenant identifier supplied by the caller is attacker-controlled, and a tenant identifier supplied by a model as a tool argument is caller-controlled through a longer path.",
  why: "Broken object level authorisation has been the top API risk in successive OWASP lists because the pattern is so natural to write. The handler takes an id, fetches the object, returns it. The check that the requester is entitled to that object is a separate line of code that is easy to omit and invisible when omitted, because the endpoint works perfectly for legitimate users.\n\nAgent runtimes make this sharply worse and most teams have not noticed. A tool schema with a tenant_id or workspace_id parameter is an API that takes the authorisation subject as input, and the caller filling it in is a language model whose context contains customer-authored text. Injected text that says 'look up the schema for workspace acme-prod' produces a well-formed tool call with an attacker-chosen scope. The fix is structural: the tenant identity must be bound to the invocation context server-side, and the tool schema must not have that field at all. If the model cannot express the wrong tenant, it cannot be talked into it.",
  failureMode: "A retrieval tool exposes a workspace parameter so it can be reused across tenants. Customer-authored table documentation contains a line addressed to the assistant naming another workspace. The model complies, the tool call is syntactically valid and correctly authenticated, and the audit log shows an authorised service account making a legitimate query.",
  experiment: "Print the JSON schema of every tool your runtime exposes and search for any parameter that names a tenant, workspace, account, org or customer. For each one found, write who fills it in. Every parameter filled in by the model is a hole. Delete the field and derive the value from the session instead.",
  reflection: "How many of your tool schemas let the model choose the scope, and which one would be worst to lose?",
  recall: {
    q: "Why is a tenant_id tool parameter a different class of bug from a tenant_id API parameter?",
    a: "Both are caller-controlled, but a tool parameter is filled in by a model whose context contains attacker-authored text, so injection converts into a syntactically valid, correctly authenticated call with an attacker-chosen scope.\n\nThe fix is to remove the field from the schema entirely and bind tenant identity to the invocation context server-side. If the model cannot express the wrong tenant, no amount of persuasion in the context produces one."
  },
  deepDive: "Go through the tool definitions in this runtime and list every parameter that lets the model choose an authorisation scope rather than inheriting it."
},
{
  id: "isolation-cache-key-is-a-channel",
  track: "isolation", level: "practice",
  title: "A shared cache key is a cross-tenant channel",
  source: "Omer Gil, Web Cache Deception Attack (Black Hat USA 2017)",
  idea: "A cache keyed on anything less than the full authorisation context will eventually serve one tenant's response to another.",
  why: "A cache is a function from key to response. If the key omits any input that the response depends on, the cache is a channel between everyone who shares that key. Web cache deception showed the general shape: an attacker gets an authenticated, personal response stored under a key the caching layer treats as public and static, then fetches it unauthenticated. The specific trick was path suffixes, but the underlying error is the key not capturing who the response was for.\n\nIn an agent runtime this recurs in several places at once and none of them look like a web cache. Memoised tool results keyed on the tool name and arguments. An LLM response cache keyed on a prompt hash, where the prompt hash is identical across tenants asking the same question but the retrieved context was not. An embedding or retrieval index keyed on document id where ids are not globally unique. A shared Redis with no key prefix discipline. In each case the rule is the same: the key must include the full authorisation context, or the cache must be partitioned per tenant so the key cannot collide.",
  failureMode: "Two tenants both have a table called orders. The retrieval cache is keyed on the query string and the table name, the second tenant's request hits a warm entry, and the answer is grounded in the first tenant's column descriptions and sample values. No error is raised because a cache hit is a success.",
  experiment: "Enumerate every cache in your request path, including in-process memoisation and any LRU decorator. For each, write the key. Any key that does not contain a tenant identifier is a cross-tenant channel unless the cache instance is itself per tenant. Count them.",
  reflection: "Which cache in your path has the weakest key, and why was it written that way?",
  recall: {
    q: "What is the general rule that web cache deception illustrates, and where does it recur in an agent runtime?",
    a: "A cache is a channel between everyone sharing a key, so the key must include every input the response depends on, including the authorisation context. Web cache deception is a specific instance where an authenticated response got stored under a key treated as public.\n\nIn an agent runtime it recurs in memoised tool results, prompt-hash response caches, retrieval and embedding indexes keyed on non-unique document ids, and shared Redis without prefix discipline."
  },
  deepDive: "Trace every cache and memoisation in this codebase and tell me which keys omit the tenant scope."
},
{
  id: "isolation-co-residency-measurement-channel",
  track: "isolation", level: "classical",
  title: "Co-residency turns contention into a measurement channel",
  source: "Ristenpart, Tromer, Shacham and Savage, Hey, You, Get Off of My Cloud, ACM CCS 2009",
  idea: "Noisy neighbour is not only an availability story, because contention on a shared resource is observable and observable contention carries information.",
  why: "Ristenpart and colleagues showed two things about a public cloud. An attacker can deliberately achieve co-residency with a chosen target rather than waiting for luck, using placement heuristics and network-topology probes to confirm it. And once co-resident, cross-VM side channels through shared microarchitectural state are available, with cache-based load measurement as the demonstrated case. That paper is the origin of taking placement itself as a security decision.\n\nThe reason it belongs in the classical section rather than the modern one is that the mechanism has not changed in seventeen years, only the specific channels have. If two tenants share a resource, the timing of that resource is a signal, and the signal is a function of the other tenant's behaviour. Your practical response is not to defeat microarchitectural side channels, which you cannot. It is to treat co-residency as a control you can set: node pools per trust tier, and hard placement rules for the workloads that touch the most sensitive data.",
  failureMode: "You treat noisy neighbour purely as a latency SLO problem and solve it with resource limits. The limits smooth the availability symptom while leaving the measurement channel entirely intact, and a tenant who cares can still infer the shape of another tenant's load from their own timings.",
  experiment: "For your most sensitive tenant tier, determine whether their workloads can currently be scheduled onto a node also running a lower-trust workload. Read the node selectors, taints and pod anti-affinity rules and answer yes or no. If yes, that is a placement decision nobody made deliberately.",
  reflection: "Is placement a control you set, or a scheduler outcome you observe?",
  recall: {
    q: "What two results did Hey, You, Get Off of My Cloud establish, and what is the practical control?",
    a: "That an attacker can deliberately achieve and confirm co-residency with a chosen target in a public cloud, and that once co-resident, cross-VM side channels through shared microarchitectural state leak information about the neighbour.\n\nThe practical control is placement: node pools per trust tier, taints and anti-affinity, so co-residency between trust levels is a decision rather than a scheduler outcome. You cannot close the microarchitectural channels themselves."
  },
  deepDive: "Look at our scheduling constraints and tell me whether high-sensitivity tenant workloads can land on the same nodes as low-trust ones."
},
{
  id: "isolation-per-tenant-keys-blast-radius",
  track: "isolation", level: "practice",
  title: "Per-tenant keys convert one compromise into one tenant",
  source: "Google, Encryption at Rest in Google Cloud whitepaper",
  idea: "The value of per-tenant keys is entirely blast radius, so the design question is who can call decrypt and under whose authority, not where the key material sits.",
  why: "Envelope encryption with a per-tenant data encryption key wrapped by a key encryption key is a well-worn pattern and the storage side of it is largely solved by a managed KMS. The security property people believe they are buying is that compromise of one key exposes one tenant. That property holds only if the decrypt operation is also scoped.\n\nIf a single service identity holds permission to decrypt with every tenant key, then compromising that service is equivalent to compromising every key, and the per-tenant split has bought you key rotation granularity and an audit trail rather than blast radius. This is the confused deputy in the shape of an IAM policy. For an agent runtime the question is sharper: when the runtime calls decrypt, which authority does the call carry? If it carries the runtime's own broad identity, then model-directed behaviour is executing against every tenant's key. If it carries a short-lived credential scoped to the tenant of the current request, the split is real.",
  failureMode: "Every tenant has their own KMS key and the encryption design review passes. The worker service account has kms.cryptoKeyVersions.useToDecrypt on the whole key ring, so a server-side request forgery or a prompt injection that reaches the decrypt path unwraps any tenant's data with one legitimate identity.",
  experiment: "Take one per-tenant key and list every principal that can call decrypt on it. Then take one of those principals and count how many tenant keys it can decrypt. If the second number is 'all of them', write down what a per-tenant scoped credential would have to look like in your runtime and how it would be minted.",
  reflection: "Does your per-tenant key split reduce blast radius, or only improve the audit trail?",
  recall: {
    q: "What condition must hold for per-tenant keys to actually reduce blast radius?",
    a: "The authority to call decrypt must be scoped per tenant, not just the key material. If one service identity can decrypt with every tenant key, compromising that identity is equivalent to compromising every key.\n\nWhat you get without scoped decrypt authority is rotation granularity and a better audit trail, which is worth something but is not blast radius reduction. In an agent runtime the decrypt call should carry a short-lived credential scoped to the current request's tenant."
  },
  deepDive: "Map which principals can decrypt which tenant keys in our setup, and help me design a per-request scoped credential for the decrypt path."
},
{
  id: "isolation-control-plane-unreachable",
  track: "isolation", level: "modern",
  title: "The control plane must not be reachable from tenant workloads",
  source: "Google, BeyondProd whitepaper (2019)",
  idea: "Tenant-influenced code that can reach the scheduler, the metadata service, the CI system or the secret store has already crossed the boundary you thought you were defending.",
  why: "BeyondProd's argument is that perimeter security fails inside a production estate for the same reason it failed at the network edge, so you need mutually authenticated service identity, workloads that do not trust each other by default, and code provenance enforced at deploy time. The multi-tenancy consequence is direct. Your tenant isolation is defined between workloads, but the control plane sits above all of them and can create, modify or read any of them.\n\nSo enumerate the reach. Can a tenant workload call the Kubernetes API server, and with what service account? Can it reach the instance metadata endpoint and mint a node-level cloud credential? Can it reach the CI system's API, or the artefact registry with write permission, or the secret store with a broad path? Every one of those is a route from a single tenant workload to authority over all tenants, and none of them are protected by anything you did at the namespace or database layer. Automount of service account tokens should be off by default, metadata access should require IMDSv2-style protections or be blocked entirely, and secret store paths should be per tenant.",
  failureMode: "A prompt injection makes the runtime fetch a URL, the URL is the cloud metadata endpoint, and the response is a node credential with permission to read the artefact registry and the shared bucket. Nothing in the tenant isolation design applies, because the code did not cross a tenant boundary. It went up.",
  experiment: "From inside one tenant workload pod, attempt in order: read the mounted service account token, call the Kubernetes API with it, curl the instance metadata endpoint, and reach your secret store. Record which four succeed. Anything that succeeds and is not required by the workload is a route from one tenant to all of them.",
  reflection: "Which control plane endpoints are reachable from your tenant workloads, and which are actually needed?",
  recall: {
    q: "Why does control plane reach defeat tenant isolation regardless of how good the tenant boundaries are?",
    a: "Tenant isolation is defined horizontally between workloads, while the control plane sits above all workloads and can create, modify or read any of them. Reaching it is a vertical escalation that no namespace, network or database predicate addresses.\n\nThe common routes are the mounted service account token, the instance metadata endpoint, the CI system or artefact registry, and an over-broad secret store path. Each turns a single compromised tenant workload into authority over every tenant."
  },
  deepDive: "Enumerate what our tenant workload pods can reach in the control plane - API server, metadata endpoint, CI, registry, secret store - and tell me which of those reaches are actually required.",
  expires: "2028-02-01"
},
{
  id: "isolation-claim-is-a-test",
  track: "isolation", level: "practice",
  title: "An isolation claim is a test you run, not a sentence you write",
  source: "Kubernetes SIG Multi-Tenancy, Multi-Tenancy Benchmarks",
  cheat: "Put one cross-tenant test in CI and assert denied rather than empty, because empty can just mean the fixture was missing.",
  idea: "Write one automated test that runs as tenant A and attempts the specific reach into tenant B your architecture forbids, then keep it in CI as the operational definition of the boundary.",
  why: "Every isolation property in this track is currently a sentence in a design document, and design documents do not fail builds. The SIG Multi-Tenancy benchmark work is useful mostly as a source of attempts to steal: run as a tenant identity and try to list other namespaces, create a privileged pod, reach a service across namespaces, read a node's details, exceed quota. Take the attempts, not the tooling, and write your own against your own claims.\n\nThe test is not exotic. Provision two fixture tenants, authenticate as A, and assert failure for each crossing you have promised does not happen: query B's rows, hit B's cache key, call a tool with B's identifier, connect to B's service, decrypt with B's key, read B's object prefix. Each assertion is one boundary. When someone later adds a background job with no session, or a cache without a tenant prefix, the assertion fails and you find out from CI rather than from a customer. This is also the only artefact that survives the team turning over, because it states the claim in a form that keeps checking itself.",
  failureMode: "The architecture document says tenants are isolated at the data layer. Eighteen months and three refactors later nobody has verified it, the original authors have left, and the first test of the claim is a customer noticing another company's table names in a search result.",
  experiment: "Write one test today. Two fixture tenants, authenticate as A, assert that the single most important cross-tenant read your system forbids returns denied and not empty. Empty and denied are different results and only one of them proves the mechanism ran. Merge it. Add a second assertion next week.",
  reflection: "What is the one crossing you would most hate to discover works, and is it now asserted in CI?",
  recall: {
    q: "What is the difference between an isolation claim and an isolation test, and why does denied-versus-empty matter?",
    a: "A claim is a sentence in a document that nothing checks and that decays silently through refactors and turnover. A test is an executable assertion that runs as tenant A, attempts a specific forbidden reach into tenant B, and fails the build when the boundary regresses.\n\nAn empty result can mean the mechanism enforced the boundary or that the fixture data was simply absent. Only an explicit denial proves enforcement ran, so assert on denial."
  },
  deepDive: "Help me write the first cross-tenant isolation test for this codebase: two fixture tenants, authenticate as one, and assert denial rather than emptiness on the most important forbidden read.",
  expires: "2027-08-01"
}
);

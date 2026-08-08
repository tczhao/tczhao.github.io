/* Track: Architecture as a cost decision. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "architecture-sets-margin",
  track: "architecture", level: "read",
  title: "Architecture sets gross margin and finance only reports it later",
  source: "Wang and Casado, The Cost of Cloud, a Trillion Dollar Paradox (Andreessen Horowitz, 2021)",
  idea: "Gross margin on an infrastructure product is decided in a handful of design reviews and merely measured at the close.",
  why: "Cost of revenue for a hosted product is mostly cloud spend, and cloud spend is a function of a short list of design choices: the tenant isolation model, the idle floor you cannot scale away, the replication factor, the default data retention, and how much traffic crosses a billed boundary. Every one of those is chosen in engineering, written into contracts and client behaviour, and expensive to reverse. Finance has two levers by comparison: raise price, and negotiate a committed-use discount. Both are worth single-digit points. An isolation model is worth a multiple.\n\nWang and Casado's argument runs the causation in that direction deliberately. They take public software companies, look at what cloud spend does to cost of revenue as those companies scale, and put a market value number on the aggregate effect across the top fifty. Read it for the direction rather than the headline: infrastructure design is treated as the independent variable and reported margin as the output.",
  failureMode: "The margin conversation starts when a CFO flags cost of revenue in a board deck, which is roughly two years after the isolation model was chosen. By then the per-tenant database, the per-tenant cluster and the ninety day retention default are all in signed agreements, so the only fix anyone can execute this quarter is a discount negotiation worth three points against a design decision that was worth thirty.",
  experiment: "Open last month's cloud bill and sort by spend. Take the top five line items. For each one, name the architecture decision that created it and the date that decision was taken. Output is a five row table with a date in every row. Any row where you cannot name a decision is spend that nobody chose.",
  reflection: "Which of your top five cost lines came from a decision that was never written down, and who would you have had to convince at the time?",
  recall: {
    q: "Why can finance not fix gross margin on an infrastructure product, and what can it actually move?",
    a: "Because the cost side is set by isolation model, idle floor, replication, retention and data movement, all chosen in engineering and locked in by contracts and client behaviour. Finance can move price and negotiate committed-use discounts.\n\nThose are worth a few points. Architecture choices are worth multiples of that, which is why the design review is the real margin meeting."
  },
  deepDive: "Here are my top five cloud cost lines and the architecture decision behind each; help me work out which ones are still reversible and what reversing them would cost in engineering months."
},
{
  id: "architecture-silo-pool-bridge",
  track: "architecture", level: "read",
  title: "Silo, pool and bridge are the three tenant isolation models",
  source: "AWS Well-Architected SaaS Lens, tenant isolation; AWS SaaS Factory isolation guidance",
  idea: "There is a published taxonomy for multi-tenant isolation and naming which one you run is the precondition for costing it.",
  why: "The SaaS Lens splits isolation into three models. Silo gives each tenant dedicated resources, so cost scales with tenant count regardless of how much any tenant uses. Pool shares resources across tenants and enforces the boundary in code and policy, so cost scales with aggregate usage. Bridge mixes the two, typically siloing the storage tier and pooling compute, or siloing the largest tenants and pooling the rest.\n\nThe taxonomy matters because these three have different cost functions, not different cost levels. Silo is a per-tenant fixed cost with a slope near zero. Pool is a near-zero fixed cost with a usage slope. Bridge is the sum. You cannot compare two designs, or forecast what a hundred more tenants does to your bill, until you know which function you are on. Most teams run bridge and describe themselves as multi-tenant, which is the vaguest possible answer.",
  failureMode: "An engineer says 'we are multi-tenant' in a cost review and the room hears 'pooled'. The actual shape is a shared compute plane and a database per tenant, so every new tenant adds a fixed monthly cost before they run a single query. The forecast built in that meeting assumes cost grows with usage and it grows with logo count instead, which is exactly wrong for a company signing small tenants.",
  experiment: "Draw your request path from ingress to storage. Label each tier silo, pool or bridge. Then, for each silo tier, write the monthly cost of one empty tenant on that tier. Output is a labelled diagram plus one dollar figure per silo tier. If you have no silo tiers, check the storage layer again.",
  reflection: "Which tier of yours is silo for reasons that were about isolation, and which is silo because it was simply easier to build that way?",
  recall: {
    q: "Name the three isolation models in the AWS SaaS Lens and the cost function each implies.",
    a: "Silo means dedicated resources per tenant, so cost is a fixed amount per tenant with almost no usage slope. Pool means shared resources with the boundary enforced in code, so cost has a near-zero fixed term and scales with aggregate usage.\n\nBridge mixes them per tier and carries both terms. Knowing which one you are on is what lets you forecast the bill against tenant count rather than guessing."
  },
  deepDive: "I will describe my tiers and how tenants are separated in each; classify them as silo, pool or bridge and tell me where my classification is self-serving."
},
{
  id: "architecture-isolation-margin-points",
  track: "architecture", level: "model",
  title: "Per-tenant isolation costs a countable number of margin points",
  source: "AWS Well-Architected SaaS Lens, tenant isolation; your own cloud bill and tenant count",
  idea: "The gap between your isolation model and a pooled alternative converts directly into gross margin points once you divide it by revenue.",
  why: "The arithmetic is short. Take the monthly cost of every resource that exists because tenants are separated: dedicated namespaces, databases, brokers, load balancers, node pools, the control plane per cluster. Call that S. Estimate what the same workloads cost pooled, call that P. The annual difference is twelve times S minus P. Divide that by annual revenue and multiply by a hundred and you have the number of gross margin points your isolation model costs. That is a sentence a CFO can act on and an engineer can defend.\n\nThe reason nobody computes it is that it needs both halves. Finance has revenue and cost of revenue but cannot tell you which resources exist for isolation reasons. Engineering knows exactly which resources those are but does not have the revenue denominator or the habit of expressing anything as a margin point. The intersection is one afternoon of work and it is currently unowned.",
  failureMode: "The team defends per-tenant isolation on security grounds without ever pricing it, so the choice never gets tested. Then a competitor prices twenty per cent below you on the same workload and nobody in the building can say whether that is a better cost structure or venture-funded discounting, because your own number was never computed.",
  experiment: "Tag or filter your bill to isolate every resource that is per-tenant. Sum it for last month, that is S. Estimate the pooled equivalent by taking aggregate utilisation across those resources and sizing for peak plus headroom, that is P. Get annual revenue from your finance business partner, this is the one number you cannot derive. Output: one number, in margin points, with your working shown.",
  reflection: "What is your isolation model costing in margin points, and is that number small enough that you would put it in a board deck yourself?",
  recall: {
    q: "How do you convert an isolation decision into margin points, and which input has to come from finance?",
    a: "Sum the monthly cost of every resource that exists only because tenants are separated, estimate the pooled equivalent, annualise the difference, then divide by annual revenue and multiply by a hundred.\n\nRevenue is the only input you cannot derive from your own bill. Ask your finance business partner for the recognised revenue figure for the same period, so the numerator and denominator cover the same months."
  },
  deepDive: "I will paste my per-tenant resource list and monthly costs; help me build the pooled counterfactual honestly, including what I would have to build to make pooling safe."
},
{
  id: "architecture-database-tenancy-shapes",
  track: "architecture", level: "model",
  title: "Database multi-tenancy has three shapes and three cost curves",
  source: "AWS Well-Architected SaaS Lens, data partitioning guidance; PostgreSQL documentation on schemas, databases and connections",
  idea: "Shared schema, schema per tenant and database per tenant differ mainly in fixed overhead per tenant, and that overhead dominates the bill when tenants are small.",
  why: "Shared schema puts a tenant identifier on every row, so the marginal cost of a tenant is the bytes they store plus the query load they generate. Schema per tenant multiplies the object count in one catalogue: every tenant brings its own tables, indexes and statistics, and planning, autovacuum and migration all scale with that object count. Database per tenant multiplies whole instances or at minimum whole catalogues, each with its own connection pool, background workers and backup schedule.\n\nThe curve crossing point is what matters. At a hundred large tenants, per-tenant databases are defensible and the operational isolation is genuinely worth something. At ten thousand small tenants, the fixed overhead per tenant swamps the data itself and you are paying to run empty machinery. Migrations make it worse in a way that never shows on the cloud bill: a schema change against one shared table is one statement, and against ten thousand schemas it is a rollout with its own failure budget and engineer weeks attached.",
  failureMode: "A team picks database per tenant for a product sold to enterprises, then launches a self-serve tier on the same architecture. Free trials each provision a database. Six months later the largest single cost line is idle databases belonging to tenants who never converted, and the tenant offboarding job that was meant to reclaim them was never written.",
  experiment: "Count your tenants and split them into deciles by stored bytes. For the bottom five deciles, compute total infrastructure cost divided by tenant count and compare it to their stored bytes at your provider's per-gigabyte rate. Output: the ratio of what a small tenant costs you to what their data alone would cost. Anything above five means you are paying for structure, not storage.",
  reflection: "At what tenant size does your current database tenancy model stop making sense, and how many of your tenants are already below that line?",
  recall: {
    q: "Why does schema per tenant get expensive in a way that is invisible on the storage line?",
    a: "The cost is object count rather than bytes. Every tenant adds tables, indexes and statistics to one catalogue, so planning, autovacuum and backup work all scale with tenant count independent of how much data anyone stores.\n\nThe worst part lands in engineering time rather than the bill: a migration that is one statement on a shared table becomes a staged rollout across thousands of schemas with its own failure modes."
  },
  deepDive: "My tenancy model at the database tier is X and my tenant size distribution is Y; help me find the crossing point where the model stops paying for itself."
},
{
  id: "architecture-namespace-vs-cluster",
  track: "architecture", level: "model",
  title: "Namespace per tenant and cluster per tenant differ mostly in control plane cost",
  source: "Kubernetes documentation, Multi-tenancy; Kubernetes SIG Multitenancy guidance; your provider's managed control plane pricing page",
  idea: "Cluster per tenant buys a harder boundary and pays for it in a fixed monthly cost multiplied by cluster count, most of which is spent before any tenant workload runs.",
  why: "The Kubernetes multi-tenancy documentation is explicit that namespaces are a soft boundary. They partition names and give you a place to hang quotas, network policy and RBAC, but the control plane, the nodes, the kernel and the CNI are shared. Cluster per tenant makes the boundary hard and duplicates everything below it.\n\nPrice the duplication rather than arguing about it. Per cluster you pay a managed control plane fee, a minimum node count that can never be zero because system daemons have to land somewhere, one copy of every cluster-scoped agent you run for logging, metrics, policy, service mesh and secrets, and at least one load balancer. Multiply that by cluster count and you have the floor. Then divide by tenants per cluster, which for cluster per tenant is one, and you have a per-tenant fixed cost that no amount of usage growth dilutes.",
  failureMode: "A cluster per tenant design is approved on isolation grounds, and the observability agents get added later without anyone re-running the cost model. Each cluster now runs a metrics agent, a log shipper, a policy controller and a mesh control plane, all sized by defaults written for a large shared cluster. The agents cost more than the tenant workload, and because they are the same in every cluster the waste is perfectly proportional to the number of tenants you win.",
  experiment: "Pick your smallest tenant cluster. Sum: the managed control plane fee, the cost of the minimum node set, every DaemonSet and cluster-scoped controller running on it, and its load balancers. That total is your per-cluster floor. Multiply by cluster count. Output: two numbers, the floor per cluster and the total, plus that total as a percentage of your monthly infrastructure spend.",
  reflection: "What fraction of your compute bill is being spent on clusters before a single tenant request arrives, and would you have approved that number if it had been on the design doc?",
  recall: {
    q: "What exactly do you pay extra for when you move from namespace per tenant to cluster per tenant?",
    a: "A managed control plane fee per cluster, a non-zero minimum node set because system daemons must be scheduled, one copy of every cluster-scoped agent for logging, metrics, policy and mesh, and at least one load balancer.\n\nAll of it is fixed cost per cluster, so with one tenant per cluster it becomes a fixed cost per tenant that usage growth never dilutes."
  },
  deepDive: "Here is the agent and DaemonSet list from one of my clusters with resource requests; help me compute the true per-cluster floor and which of those agents could run centrally instead."
},
{
  id: "architecture-always-on-control-plane",
  track: "architecture", level: "model",
  title: "An always-on control plane is the floor under your gross margin",
  source: "Knative Serving scale to zero documentation; KEDA documentation on scaling to zero",
  idea: "Any component that cannot scale to zero sets a minimum cost per tenant that no amount of usage growth will dilute away.",
  why: "Split your services into two sets: those that can go to zero replicas when idle, and those that cannot. Knative Serving and KEDA both document what it takes to be in the first set, and the requirements are the same in either system. Work arrives through something that stays up and can wake you, whether that is an activator, an event source or a scaler polling a queue. Cold start is acceptable for the traffic pattern. State lives outside the pod. Anything that fails one of those three lives in the second set forever.\n\nThe second set is your floor. Sum it and divide by tenant count and you have a per-tenant cost that is present whether the tenant is active or dormant. On a product with a long tail of low-usage tenants this is usually the single biggest per-tenant number, and it is invisible in a bill that groups spend by service rather than by whether the spend was idle.",
  failureMode: "A team celebrates that the request path autoscales, while the schedulers, leader-elected controllers, single-replica brokers and per-tenant sidecars run at fixed size around the clock. Weekend traffic drops ninety per cent and the bill drops eight per cent, which is the moment you find out what fraction of your architecture is a floor.",
  experiment: "Take last weekend and last Tuesday. Compute total infrastructure cost per hour for the quietest hour of each and the busiest hour of each. The quiet-hour figure is your floor. Divide the floor by active tenant count. Output: floor cost per tenant per month, and the floor as a percentage of your total bill.",
  reflection: "Which component in your floor would be the cheapest to move to scale to zero, and what is the only thing stopping it?",
  recall: {
    q: "What three conditions does a service have to meet before it can scale to zero, and why does the floor matter more on a long tail of small tenants?",
    a: "Something that stays up must be able to receive work and wake it, cold start must be tolerable for the traffic pattern, and state must live outside the pod. Fail any one and the service runs continuously.\n\nThe floor is a fixed cost divided by tenant count, so with many dormant or low-usage tenants it becomes the dominant per-tenant cost and no usage growth dilutes it."
  },
  deepDive: "I will list the workloads that run at fixed replica count in my system; help me sort them into cannot-go-to-zero and has-not-been-made-to, and cost the second group."
},
{
  id: "architecture-allocated-vs-used",
  track: "architecture", level: "model",
  title: "Allocated capacity is not used capacity and the gap is the bill",
  source: "Verma et al., Large-scale cluster management at Google with Borg, EuroSys 2015, resource reclamation; Tirmazi et al., Borg: the Next Generation, EuroSys 2020, eight production cells over May 2019",
  idea: "You pay for what your workloads request, they consume considerably less, and the systematic size of that gap is a published result rather than a guess.",
  why: "The Borg paper documents this directly. Google found the gap between what jobs request and what they actually use large enough to build a whole mechanism around it: Borg estimates near-term usage, calls that a reservation, and reclaims the difference between reservation and limit for lower priority work. The follow-up paper repeats the analysis across eight production cells for a month of 2019. Read the resource reclamation sections for the measured gap rather than trusting anyone's rule of thumb, including mine.\n\nOn Kubernetes you have the same gap and none of the reclamation. The scheduler places pods against requests, the cloud provider bills you for nodes sized to hold those requests, and the difference between requests and actual usage is money spent on nothing. Limits do not help, because limits do not affect placement. The number you need is the ratio of cluster-wide CPU and memory requests to cluster-wide usage at the same instant, and every cluster has it in the metrics already.",
  failureMode: "Requests are copied from whichever service the author had open last, then doubled after one incident. Nobody ever lowers them, because lowering a request has a visible downside and an invisible upside. Two years in, cluster utilisation sits under twenty per cent, and the team responds by negotiating a committed-use discount on capacity it does not need.",
  experiment: "Query your metrics for cluster-wide CPU requests and cluster-wide CPU usage over the last thirty days, and the same pair for memory. Compute the ratio at the ninety-fifth percentile of usage, not the mean, so you are not penalised for genuine off-peak. Output: two ratios. Then multiply your monthly compute spend by one minus the inverse of the CPU ratio to price the gap.",
  reflection: "Which three workloads contribute most of your request-to-usage gap, and what would have to be true for you to halve their requests?",
  recall: {
    q: "Why does the request-to-usage gap cost money on Kubernetes when it does not on Borg?",
    a: "Both systems have the gap, because engineers request more than their workloads consume. Borg measures near-term usage as a reservation and reclaims the unused difference for lower priority work.\n\nKubernetes schedules against requests and the provider bills for nodes sized to hold them, with no reclamation. The unused difference is simply paid for."
  },
  deepDive: "Here are my top workloads by CPU request with their actual p95 usage; help me pick the three where cutting requests has the best ratio of savings to risk."
},
{
  id: "architecture-headroom-price",
  track: "architecture", level: "decide",
  title: "Overprovisioning is an availability purchase you can quote a price for",
  source: "Beyer et al., Site Reliability Engineering (Google, 2016), Handling Overload and Addressing Cascading Failures; Kubernetes documentation on requests and limits",
  idea: "Headroom is a deliberate purchase of availability, so state its monthly price and make the availability target justify it.",
  why: "The SRE book treats spare capacity as a control against overload and cascading failure, not as slack. That framing is the useful one for a cost conversation, because a purchase can be priced and a target can be argued. Headroom buys you three specific things: absorption of traffic spikes faster than your autoscaler, survival of the loss of a failure domain, and time to respond during a degradation. Each has a size you can name.\n\nThe question to bring to a review is therefore not 'can we cut headroom' but 'what availability does this headroom buy and what is the cheapest way to buy the same availability'. Often the answer is not less headroom, it is load shedding, or faster scale-up, or spreading across more and smaller failure domains so that losing one costs less spare capacity. All three are engineering work that substitutes for a recurring bill, which is the trade a funding conversation can actually be built on.",
  failureMode: "Every service reserves enough capacity to survive the loss of an availability zone, and because each team decides independently, the reservations stack. The cluster is sized for every service losing a zone simultaneously, which is not a scenario. Nobody notices because no single team is wrong.",
  experiment: "Compute headroom as provisioned capacity minus p99 usage over the last thirty days, in cost terms, per environment. Then write one sentence next to it naming the failure it is there for. Output: a dollar per month figure and a named scenario. Any headroom without a named scenario is the first thing to cut.",
  reflection: "What is your annual headroom spend, and which failure scenario is it insuring against that has actually occurred in the last two years?",
  recall: {
    q: "What are the three things headroom actually buys, and what are the substitutes?",
    a: "Absorption of spikes faster than the autoscaler can react, survival of the loss of a failure domain, and time to respond during a degradation.\n\nThe substitutes are load shedding, faster scale-up, and spreading across more and smaller failure domains so losing one costs less spare capacity. Each is engineering work that replaces a recurring bill."
  },
  deepDive: "Here is my provisioned capacity, my p99 usage and my availability target; help me price the headroom and identify which portion has no named failure scenario behind it."
},
{
  id: "architecture-autoscaling-lag",
  track: "architecture", level: "model",
  title: "Autoscaling lag is paid at both ends of the curve",
  source: "Kubernetes Horizontal Pod Autoscaler documentation, sync period and stabilisation window; KEDA documentation on polling interval and cooldown period",
  idea: "Slow scale-up is paid in latency and slow scale-down is paid in money, and both are set by default parameters somebody left alone.",
  why: "The lag is the sum of named, documented delays. The metrics pipeline has a scrape interval and a reporting lag. The HPA controller has a sync period. Scale-down has a stabilisation window that deliberately holds replicas after demand falls, and the default is measured in minutes rather than seconds. If a node has to be added, add the node provisioning and image pull time on top. KEDA adds its own polling interval and cooldown period on the same principle. All of these numbers are readable from your own configuration in about ten minutes.\n\nThe cost asymmetry is what people miss. On the way up, lag shows up as latency and shed load, which is visible and gets fixed. On the way down, lag shows up as replicas running with no work, which is invisible and gets paid. If your traffic is spiky, the scale-down window can be the single largest controllable term in your compute bill, because you pay it on every spike, every day.",
  failureMode: "A service handles a five minute burst every hour on the hour. The scale-down stabilisation window is left at its default and the burst is short, so replicas never come back down between bursts. The service is effectively provisioned for peak twenty-four hours a day, and the dashboard shows autoscaling working perfectly because replica count does move.",
  experiment: "Read the actual configured values: metrics scrape interval, HPA sync period, scale-down stabilisation window, and node provisioning time from a recent scale-up event. Sum the scale-down side. Then count spikes per day and multiply spikes by lag by the cost per replica-hour of the replicas held. Output: monthly cost of scale-down lag for your spikiest service.",
  reflection: "What is your scale-down window set to, who set it, and would that person still defend the number now that you can price it?",
  recall: {
    q: "Why is scale-down lag more expensive than scale-up lag in practice?",
    a: "Scale-up lag produces latency and shed load, which is visible on dashboards and in alerts, so it gets tuned. Scale-down lag produces idle replicas, which nothing alerts on.\n\nOn spiky traffic you pay the scale-down window on every spike, every day, so it compounds into one of the largest controllable terms in the compute bill."
  },
  deepDive: "Here are my HPA and KEDA settings and my daily traffic shape; help me compute what the scale-down lag costs and what the latency risk of shortening it would be."
},
{
  id: "architecture-spot-engineering-cost",
  track: "architecture", level: "decide",
  title: "Spot capacity is a discount paid for in engineering",
  source: "AWS EC2 Spot Instances documentation on interruption notices and the Spot Instance Advisor interruption frequency data; Google Cloud Spot VMs documentation on preemption notices",
  idea: "The published spot discount is real and so is the engineering it requires, so cost the engineering before you claim the saving.",
  why: "The providers document the contract precisely. AWS gives a two minute interruption notice and publishes interruption frequency by instance type and region in the Spot Instance Advisor, which is the number you should be planning against rather than the discount. Google Cloud gives a shorter preemption notice for Spot VMs and documents that they can be reclaimed at any time. Neither promises capacity.\n\nWhat you have to build to accept that contract is the actual price. Interruption handlers that drain gracefully inside the notice window. Checkpointing for anything longer-running than the notice. Capacity diversification across several instance families and zones, because concentrating on the cheapest type is what produces correlated interruptions. Idempotent work so a re-run is safe. And a fallback to on-demand that is tested, because the failure mode is not interruption, it is interruption when no spot capacity is available at all. Price those as engineering months, amortise over a year, and compare with the discount on the workload you would actually move.",
  failureMode: "Batch jobs are moved to spot, the discount lands, and everyone is pleased. Then a capacity crunch takes out the single instance family the node group was configured for, the fallback path has never been exercised, and the pipeline is down for six hours. The incident costs more in credits and engineering time than the quarter's savings, and spot gets banned company-wide, which throws away a real saving on the workloads that were genuinely suitable.",
  experiment: "List your workloads and mark each interruptible or not, where interruptible means a kill with two minutes notice loses at most one unit of work. Take the interruptible set, price it at on-demand and at the current spot price for at least three instance families, and check each family's interruption frequency in the Spot Instance Advisor. Output: annual saving on the interruptible set, next to your honest estimate of engineering weeks to make it safe.",
  reflection: "What share of your compute is genuinely interruptible today, and what would it take to move one more workload into that set?",
  recall: {
    q: "What do you actually have to build to take the spot discount, and what is the real failure mode?",
    a: "Drain handlers that finish inside the interruption notice, checkpointing for anything longer than that notice, diversification across instance families and zones, idempotent work, and a tested on-demand fallback.\n\nThe failure mode is not a single interruption. It is correlated interruption during a capacity crunch when no spot capacity is available at all, which is exactly when the untested fallback path gets its first run."
  },
  deepDive: "Here is my workload list with runtimes and restart semantics; help me classify what is genuinely interruptible and estimate the engineering cost of moving it to spot safely."
},
{
  id: "architecture-cross-az-traffic",
  track: "architecture", level: "model",
  title: "Cross-AZ traffic is created by your topology, not by your users",
  source: "AWS EC2 data transfer pricing for traffic between Availability Zones; Kubernetes documentation on topology aware routing",
  idea: "How much of your internal chatter crosses a billed zone boundary is decided by service placement and routing policy, not by user behaviour.",
  why: "The default Kubernetes service routes to any ready endpoint anywhere in the cluster. With pods spread evenly across three zones, roughly two thirds of every internal hop leaves the zone it started in. AWS bills data transfer between availability zones in the same region per gigabyte, and it is charged on both the send and the receive side, so each crossing is billed twice. Multiply that by the number of hops in a request path and the number of requests, and a chatty microservice architecture generates a meaningful bill out of traffic that never touches the internet.\n\nThe controls are unglamorous and documented. Topology aware routing keeps traffic within a zone when endpoint distribution allows it. Zonal replica placement for caches and read replicas keeps the hot read path local. Consolidating chatty services into one process removes the hop entirely. None of this is a trade against availability if you keep the failover path across zones intact and only prefer local when local is healthy.",
  failureMode: "Nobody owns the inter-AZ line because it appears under data transfer rather than under any team's service. It grows with request volume, so it looks like a healthy sign of growth. Meanwhile the actual driver is a service mesh that added two extra hops per request, each of which now crosses a zone boundary two times out of three.",
  experiment: "Find the inter-AZ data transfer line on last month's bill and note the gigabytes. Then take your busiest request path, count the internal hops, and multiply requests by hops by average payload size by two thirds. If your estimate is within an order of magnitude of the bill, you have found the driver. Output: gigabytes, estimated driver, and the cost of the top hop.",
  reflection: "Which single hop in your architecture is generating the most cross-zone bytes, and could it be a local call instead?",
  recall: {
    q: "Why does a three zone deployment send roughly two thirds of internal traffic across a billed boundary, and what fixes it?",
    a: "Default service routing picks any ready endpoint regardless of zone, so with even spread across three zones two in three destinations are in a different zone. AWS bills that transfer per gigabyte on both send and receive.\n\nTopology aware routing prefers same-zone endpoints when the distribution allows, zonal placement of caches and read replicas keeps hot reads local, and merging chatty services removes the hop entirely."
  },
  deepDive: "Here is my service call graph with request rates and payload sizes; help me find the top three hops by cross-zone bytes and what it would take to localise each."
},
{
  id: "architecture-retention-default",
  track: "architecture", level: "decide",
  title: "Tenant data retention default is a margin lever hidden in a contract",
  source: "Regulation (EU) 2016/679 (GDPR), Article 5(1)(e) storage limitation and Article 28(3)(g); your standard customer agreement retention clause",
  idea: "The default retention period sets a recurring storage cost per tenant that compounds forever, and the law argues for shorter rather than longer.",
  why: "Retention is the rare cost lever where the legal position and the margin position agree. GDPR Article 5(1)(e) requires that personal data be kept in identifiable form no longer than necessary for the purpose. Article 28(3)(g) requires a processor to delete or return personal data at the end of the provision of services. Neither says keep everything indefinitely because storage is cheap, which is the working assumption in most systems.\n\nThe cost mechanism is compounding. Storage under an indefinite default is cumulative, so the bill grows with the integral of ingest rather than with ingest. It also multiplies through the stack: retained data is replicated, backed up, indexed, and often kept warm rather than in cold storage because nobody classified it. Halving the default retention on your largest data class halves a recurring line and reduces breach exposure at the same time, which makes it the easiest margin argument you will ever get to make in front of a security team.",
  failureMode: "The retention default was set to 'keep it' during the first enterprise deal because a prospect asked for audit history and no one wanted to lose the deal. It was never revisited, so it now applies to every tenant including the self-serve tier. Storage is the fastest growing line on the bill, most of it belongs to tenants who churned, and the deletion job for offboarded tenants does not exist.",
  experiment: "Find the retention clause in your standard customer agreement and note the committed period. Then measure the actual age distribution of stored data per tenant and the read rate by age bucket. Output: gigabytes older than the committed retention, gigabytes belonging to churned tenants, and the read rate for data over ninety days old. That last number is usually near zero and it is the argument.",
  reflection: "How much of your storage is older than you contractually have to keep, and who has to sign off on deleting it?",
  recall: {
    q: "Why is retention the one cost lever where legal and finance want the same thing?",
    a: "GDPR Article 5(1)(e) requires personal data not be kept in identifiable form longer than necessary, and Article 28(3)(g) requires deletion or return at the end of service. Shorter retention is the compliant default.\n\nIt is also the cheaper one, because retained data compounds: it is replicated, backed up and indexed, so the bill grows with cumulative ingest rather than with current ingest."
  },
  deepDive: "Here is my data age distribution and read rate by age bucket, plus my contractual retention commitment; help me build the case for a shorter default and quantify the saving."
},
{
  id: "architecture-durable-execution-cost",
  track: "architecture", level: "model",
  title: "Durable execution costs more than a queue and the difference is the guarantee",
  source: "Temporal documentation on workflow event history and Temporal Cloud pricing units (actions and storage); AWS SQS pricing documentation",
  idea: "Durable execution bills you for event history and state transitions, and that premium over a queue is the price of replayability.",
  why: "The mechanism is in the data model. A durable execution engine records every state transition of a workflow as an event and persists the history, because recovery works by replaying that history against deterministic code. So you pay twice: once per action, meaning every workflow start, activity, timer and signal, and once for storage of the history for as long as your retention setting keeps it. A queue has neither of those. SQS bills per request, with batching of multiple messages into one request, and it stores nothing after acknowledgement.\n\nThat difference is not waste, it is the product. What you buy is automatic retry with backoff, exactly-once activity effects from the workflow's point of view, timers that survive process death, and the ability to ask what a running workflow is doing. Rebuilding that on a queue means a state table, a reconciler, an idempotency layer and a scheduled sweeper, all of which you then operate. The honest comparison is cost per workflow on the engine against cost per workflow on a queue plus the engineering and operational cost of the machinery you would write.",
  failureMode: "A team uses durable execution for a high-volume, short-lived, fire-and-forget task because it is the platform they already run. Each task generates a full event history for work that never needed replay, action counts scale with request volume, and the storage line grows with retention. The engine is being charged for a guarantee that this workload does not use.",
  experiment: "Pick your highest-volume workflow type. Count the actions in one execution from its event history, and measure the history size in bytes. Multiply by monthly executions for the action cost, and by your namespace retention period for the storage cost. Output: cost per execution, split into actions and storage, next to what the same volume would cost as queue requests.",
  reflection: "Which of your workflow types is paying for replayability it never uses, and what would it take to move it to a plain queue?",
  recall: {
    q: "What exactly does a durable execution engine charge for that a queue does not, and what does the premium buy?",
    a: "Every state transition is recorded as an event, so you are billed per action for starts, activities, timers and signals, and billed again for storing the event history over your retention period. A queue bills per request and stores nothing after acknowledgement.\n\nThe premium buys automatic retry, exactly-once activity semantics from the workflow's view, durable timers, and introspection of running executions. On a queue you would build and operate that yourself."
  },
  deepDive: "Here is the event history from one execution of my busiest workflow type and my monthly volume; help me compute cost per execution and whether this workload actually needs durable execution."
},
{
  id: "architecture-run-as-unit",
  track: "architecture", level: "model",
  title: "For an agent product the unit is a run and tokens are cost of revenue",
  source: "Anthropic API pricing documentation, per-million input and output token rates; usage fields returned on each API response",
  idea: "Model spend behaves like hosting rather than research, so it belongs in cost of revenue with a per-run denominator.",
  why: "The test for cost of revenue is whether the spend is incurred in delivering the service to a customer and scales with delivery. Tokens consumed serving a customer request pass that test the same way compute and storage do. Tokens spent on evaluation and experiments do not, and should sit in research and development. If those two are mixed in one account, your gross margin is wrong in a direction that flatters you early and then deteriorates as usage grows, which is the worst possible signal to give a board.\n\nThe denominator has to be a run, not a request, because one user action fans out into many model calls: planning, tool calls, retries, summarisation of intermediate results, and a final response. Cost per request tells you nothing when the fan-out varies by a factor of twenty. Cost per run is what you can compare to price per run, and the ratio of those two is your gross margin on the product. Every API response returns its token usage, so the only work is attributing calls to a run identifier and summing.",
  failureMode: "Model spend sits in one engineering account with no run attribution, so nobody can say what a customer costs to serve. Pricing is set per seat because that is what the market does. Six months later the heaviest ten per cent of accounts are being served below cost, the average still looks fine, and the first anyone knows is when a renewal cohort turns out to be unprofitable.",
  experiment: "Add a run identifier to every model call if you do not have one. Then for last week, sum input and output tokens per run, price them at the current published rates, and compute the distribution of cost per run. Output: mean and median cost per run, and that figure next to your average revenue per run. Get the revenue side from finance and specify the period so both cover the same days.",
  reflection: "What does one run of your agent cost you, and what does one run earn?",
  recall: {
    q: "Why is a run the right denominator for agent unit economics, and which token spend does not belong in cost of revenue?",
    a: "One user action fans out into many model calls for planning, tools, retries and summarisation, so cost per request is meaningless when fan-out varies widely. Cost per run compares directly against price per run.\n\nTokens spent on evaluation, experiments and development are not incurred serving a customer, so they belong in research and development rather than cost of revenue."
  },
  deepDive: "Here is the token usage for a sample of my agent runs; help me build a cost per run model and check whether my current pricing covers the tail."
},
{
  id: "architecture-run-cost-distribution",
  track: "architecture", level: "model",
  title: "Nondeterministic run cost needs a distribution, not an average",
  source: "FinOps Foundation, FinOps for AI scope and AI cost management guidance; FinOps Framework capability documentation",
  idea: "Agent run cost has a long right tail, so capacity and price must be set against a high percentile rather than the mean.",
  why: "The tail is structural, not noise. A run that takes a wrong turn calls more tools, accumulates more context, and every subsequent call carries the larger context, so cost compounds within the run. Retries multiply it again. The result is a distribution where the mean sits well below the ninety-fifth percentile and a small fraction of runs consume a large share of total spend. That is the same shape as latency, and the same reasoning applies: you would never size a service on mean latency.\n\nThe FinOps Foundation's guidance for AI workloads makes the same point about variability and puts it in the vocabulary a finance team already uses for forecasting and anomaly detection. Practically it means three things. Price against a high percentile or cap the run. Forecast with a distribution, so an unusual month is diagnosable rather than surprising. And instrument per-run token counts as a first-class metric with alerting on the tail, because a regression in agent behaviour shows up as a cost distribution shift days before anyone notices a quality problem.",
  failureMode: "Unit economics are modelled on mean cost per run and the product is priced with a comfortable margin on that mean. In production the top few per cent of runs cost many multiples of the mean, and they cluster on exactly the customers with the messiest data, who are the enterprise accounts. The margin is fine in aggregate and negative on the accounts you most want to keep.",
  experiment: "Take the last thousand runs. Compute p50, p95, p99 and max cost per run, the ratio of p99 to p50, and the share of total spend consumed by the top five per cent of runs. Output: those five numbers. Then check whether your price covers p95 rather than the mean.",
  reflection: "What is your p99 cost per run, and what happens to your margin if the mix shifts towards the tail?",
  recall: {
    q: "Why does agent run cost have a heavy right tail, and what are the three practical consequences?",
    a: "A run that goes wrong makes more tool calls and accumulates context, and every later call carries the larger context, so cost compounds within the run. Retries multiply it again.\n\nSo price or cap against a high percentile rather than the mean, forecast with a distribution instead of an average, and alert on the tail of per-run token counts because a behaviour regression shows in cost before it shows in quality complaints."
  },
  deepDive: "Here is the per-run cost distribution from my last thousand runs; help me choose a percentile to price against and design a sensible run cap."
},
{
  id: "architecture-caching-and-batching",
  track: "architecture", level: "model",
  title: "Prompt caching and batch processing change agent unit cost structurally",
  source: "Anthropic documentation on prompt caching (cache write and cache read pricing multipliers) and the Message Batches API discount",
  idea: "Caching a stable prompt prefix and moving latency-tolerant work to batch are architecture choices with published price differences, which makes them the cheapest margin work available on an agent product.",
  why: "Prompt caching changes the structure of the input cost. Writing to the cache costs a premium over the base input rate and reading from it costs a small fraction of that rate, both published as multipliers in the documentation. So there is a break-even number of reads per write, and it is low. Whether you clear it depends on architecture: the cache is keyed on an exact prefix, so a system prompt with a timestamp in it, or tool definitions assembled in a nondeterministic order, or per-user content placed before the shared content, all destroy the hit rate. Prefix stability is a design property you can enforce.\n\nBatch processing changes the price of the whole call in exchange for latency, with the discount published against the standard rate. The architectural question is which of your work is genuinely synchronous. Scheduled enrichment, backfills, evaluation suites and anything triggered by a cron are not. Splitting your workload into interactive and deferrable is usually a routing change rather than a rewrite, and it applies the discount to the portion of spend that never needed to be fast.",
  failureMode: "The system prompt has the current timestamp injected at the top for freshness. Every request is a cache miss, the cache write premium is paid every time, and the caching feature is recorded as tried and not effective. Nobody looks at the cache hit rate in the usage response, which would have shown it immediately.",
  experiment: "Pull the usage fields from a day of API responses and compute your cache read tokens as a share of total input tokens. That is your hit rate. Separately, classify last week's model spend as interactive or deferrable and price the deferrable share at the batch rate. Output: current hit rate, achievable hit rate given your prefix structure, and the annual saving from batching the deferrable share.",
  reflection: "What is your cache hit rate right now, and what single change to your prompt assembly would raise it most?",
  recall: {
    q: "What destroys a prompt cache hit rate, and how do you decide what to send to batch?",
    a: "The cache is keyed on an exact prefix, so anything variable near the front breaks it: injected timestamps, nondeterministically ordered tool definitions, or per-user content placed before shared content. Prefix stability is a design property to enforce and the hit rate is visible in the usage fields.\n\nBatch suits anything not genuinely synchronous: scheduled enrichment, backfills, evaluation runs and cron-triggered work. Routing those to the batch endpoint applies the published discount to spend that never needed low latency."
  },
  deepDive: "Here is my prompt assembly code and a sample of usage fields; help me find what is breaking cache hits and which of my workloads should move to the batch endpoint."
},
{
  id: "architecture-region-and-instance-family",
  track: "architecture", level: "decide",
  title: "Region and instance family are margin decisions made once and paid monthly",
  source: "AWS EC2 on-demand pricing pages, which list different rates per region for the same instance type; AWS documentation on Graviton price and performance claims",
  idea: "Placement and processor family are chosen at provisioning time, rarely revisited, and quietly persist as a recurring difference in cost of revenue.",
  why: "The same instance type costs different amounts in different regions, and the spread across regions for an identical machine is large enough to matter at any real scale. Region gets picked once, usually because it is where the first engineer had an account or where the first customer was, and then everything else is provisioned next to it. Nothing ever triggers a review, because there is no alert for 'you are in an expensive region'.\n\nInstance family is the same shape of decision with a bigger lever. AWS publishes price and performance claims for its Arm-based Graviton instances against comparable x86 instances, and the price per hour difference is on the pricing page regardless of what you believe about the performance claim. Treat the vendor claim as a hypothesis and test it on your workload: build for Arm, run your own benchmark, and compute cost per unit of work rather than cost per hour. The constraint is almost never the language runtime any more, it is one dependency with a native extension, and finding out which one is a day of work against a recurring saving.",
  failureMode: "Data residency requires one region for European tenant data, so everything gets provisioned there, including CI runners, batch jobs, internal tooling and the metrics stack, none of which touch tenant data. The residency requirement is satisfied several times over and paid for on workloads that never needed it.",
  experiment: "List your three largest instance families by monthly spend. For each, look up the on-demand rate in your current region, in the cheapest region you are permitted to run non-tenant workloads in, and for the closest Graviton equivalent. Multiply each delta by your monthly hours for that family. Output: three annual figures. Then list which of your workloads have a genuine residency or latency constraint and which are simply co-located out of habit.",
  reflection: "What fraction of your compute is in an expensive region for a reason that would survive being written down?",
  recall: {
    q: "Why do region and instance family persist as margin decisions long after they are made?",
    a: "Both are chosen once at provisioning time and nothing ever triggers a review. There is no alert for running in an expensive region or on a more expensive processor family, and every subsequent resource is provisioned next to the existing ones.",
  },
  deepDive: "Here are my top instance families with monthly hours and my residency constraints; help me separate workloads that must stay put from those co-located by habit, and price the move."
},
{
  id: "architecture-repatriation-filing",
  track: "architecture", level: "read",
  title: "Repatriation is real at scale and there is a filing that shows it",
  source: "Dropbox Form S-1 (2018), Infrastructure Optimization discussion in MD and A and the selected financial data gross margin lines; Wang and Casado, The Cost of Cloud, a Trillion Dollar Paradox (Andreessen Horowitz, 2021)",
  idea: "A company disclosed the gross margin effect of moving its workloads off rented infrastructure onto its own, which is the strongest public evidence that the scale argument is not theoretical.",
  why: "Dropbox's S-1 describes a multi-year programme it calls Infrastructure Optimization, under which it moved the majority of user data onto infrastructure it built and operated itself, and it reports gross margin for the years spanning that programme. Pull the S-1, find the Infrastructure Optimization paragraphs in management's discussion and analysis, and read the gross margin line for each year in the selected financial data. Do not take my summary or anyone else's for the figures. The point is that the direction and rough magnitude are disclosed, audited and public, which is a different class of evidence from a blog post.\n\nWang and Casado build their argument on exactly this kind of disclosure and generalise it: cloud is cheaper than owning at small scale and at unpredictable load, and the relationship inverts somewhere as scale grows and load becomes predictable. The conditions matter more than the conclusion. Dropbox had an enormous, homogeneous, storage-heavy and highly predictable workload, which is close to the best possible case for owning hardware. A variable, heterogeneous workload with a small footprint is the worst case, and most companies are that.",
  failureMode: "An engineer reads the repatriation argument and proposes leaving the cloud on a workload with one hundredth of the scale, none of the predictability and no team that has ever racked a server. The cost model omits the people, the spares, the capacity lead time, the multi-site redundancy and the two years of building operational maturity, all of which the provider's margin was paying for.",
  experiment: "Read the Infrastructure Optimization section of the Dropbox S-1 and write down the gross margin figures for each disclosed year yourself. Then write down the three properties of that workload that made owning cheaper: scale, homogeneity and predictability. Score your own largest workload out of three against those properties. Output: the disclosed figures in your own notes, and your score.",
  reflection: "Does your largest workload score three out of three, and if not, which committed-use discount conversation should you be having instead?",
  recall: {
    q: "What conditions made repatriation pay for Dropbox, and why does that not generalise to most companies?",
    a: "Enormous scale, a homogeneous storage-heavy workload, and highly predictable load. Under those conditions the provider's margin exceeds the cost of building and operating your own infrastructure, and the S-1 discloses the gross margin change across the programme.\n\nMost workloads are small, heterogeneous and variable, which is precisely what rented capacity is priced for. The honest alternative at that scale is a committed-use discount, not a data centre."
  },
  deepDive: "Score my largest workload against scale, homogeneity and predictability, then tell me what the realistic alternative to repatriation is at my size and what it would save."
}
);

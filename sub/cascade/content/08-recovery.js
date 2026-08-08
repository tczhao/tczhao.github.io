/* Track: Recovery and its cost. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "recovery-mttr-distribution",
  track: "recovery", level: "mechanism",
  title: "Recovery time is a design parameter and a distribution, not an average to report",
  source: "Stepan Davidovic, Incident Metrics in SRE: Critically Evaluating MTTR and Friends (Google, 2021)",
  gateIntro: "A quarter of incident data arrives for review. Fourteen incidents, one of which ran most of a working day and eight of which closed inside twenty minutes. The summary at the top reports a mean time to recovery and a quarter-on-quarter improvement of a few minutes, and leadership wants a target for next quarter set against it. Nothing in the deck records which recovery path each incident actually took, or how long that path takes when it is exercised deliberately.",
  idea: "Stop reporting a mean time to recovery and start enumerating your recovery paths and timing each one.",
  why: "Incident durations are heavy tailed and the sample is small. A handful of long incidents dominate the mean, the variance swamps the signal, and a quarter-on-quarter delta of a few minutes is indistinguishable from noise. Davidovic's argument is blunt: with realistic incident counts, MTTR changes are not statistically detectable, so the metric cannot tell you whether an intervention worked.\n\nThe replacement is not a better average. It is to treat recovery as a set of named, enumerable paths - failover to the other region, restore from snapshot, roll the deploy back, drain and replace the node pool, flip the kill switch - and to measure each path's duration directly by exercising it. Those numbers are stable, attributable, and actionable, because each one has an owner and an engineering lever.",
  failureMode: "You spend a quarter on tooling that shaves alert-routing latency, watch MTTR go up because one long incident landed in the window, and cannot tell anyone whether the work helped. Meanwhile the restore path that actually sets your worst case has never been timed, so the number in the DR document is a guess that no one has been asked to defend.",
  experiment: "List every distinct way a production incident in your estate has ended in the last six months: rollback, restart, scale up, failover, restore, kill switch, wait for upstream. You will likely get five to eight. For each one, write down the last time it was executed and how long it took. Count how many have no measurement at all.",
  reflection: "Which recovery path in your estate has the worst combination of high likelihood and zero measurement?",
  recall: {
    q: "Why is a quarter-on-quarter MTTR improvement of a few minutes not evidence that anything got better?",
    a: "Incident durations are heavy tailed and the sample is small, so the mean is dominated by one or two long incidents and the variance is larger than the effect you are claiming. The change is not statistically detectable at realistic incident counts.\n\nThe useful measurement is per recovery path, exercised on purpose and timed, because each path has an owner and a lever."
  },
  deepDive: "Help me enumerate the distinct recovery paths in a multi-tenant Kubernetes and Temporal estate and design a cheap way to time each one in a non-production tenant."
},
{
  id: "recovery-kinesis-fleet-restart",
  track: "recovery", level: "mechanism",
  title: "AWS Kinesis, 25 November 2020: bringing the fleet back had to be slower than taking it down",
  source: "AWS, Summary of the Amazon Kinesis Event in the Northern Virginia (US-EAST-1) Region (2020)",
  gateIntro: "On the morning of 25 November 2020 Amazon Kinesis Data Streams in us-east-1 began returning elevated errors on PutRecord and related operations. A capacity addition to the service's front-end fleet had started shortly before. Many dependent AWS services degraded, including CloudWatch, Cognito, EventBridge and Lambda, and the status dashboard tooling itself was affected. Engineers had a working hypothesis within a few hours. Restoration of the front-end fleet began in the early afternoon and was not complete until late that evening.",
  idea: "When every node must learn about every other node before it can serve, the time to restart the fleet grows with the size of the fleet.",
  why: "Kinesis front-end servers each build a shard map by exchanging information with every other front-end server, one operating system thread per peer. Adding capacity pushed the thread count past an operating system limit, and once the fleet was in a bad state the only path back was a full front-end restart.\n\nThat restart could not be done quickly. Bringing servers back in large batches would have caused so much contention on the metadata exchange that the returning servers would fail to complete their map. So capacity had to be added in small increments, each waiting to converge. The recovery duration was therefore a function of fleet size, and AWS noted that the very growth that made the service successful had also lengthened the front-end bootstrap. Success made the outage longer.",
  failureMode: "You measure restart time once, when the cluster is small, and enshrine it in the runbook. Two years and four times the node count later the runbook still says forty minutes and the real number is six hours, and nobody discovers this until the day they need it.",
  experiment: "For your largest stateful cluster - ClickHouse, the Temporal history service, an Argo controller set - work out whether the cold-start time of one node depends on the number of other nodes. If it does, plot the last three months of node count against measured full-restart time and check whether the runbook number is still true.",
  reflection: "Which component in your estate has a bootstrap cost that scales with the size of the thing it is bootstrapping into?",
  recall: {
    q: "Why did Kinesis have to be restored slowly rather than all at once, and what made that duration grow over time?",
    a: "Each front-end server builds its shard map by exchanging with every other front-end server, so returning too many at once creates enough contention that none of them converge. Capacity had to come back in small increments.\n\nBecause the bootstrap cost is a function of fleet size, the recovery got slower as the service grew. Scaling the service scaled the outage."
  },
  deepDive: "Show me how to test whether restart time in my ClickHouse and Temporal clusters is superlinear in node count, without taking production down to find out."
},
{
  id: "recovery-cold-cache-capacity",
  track: "recovery", level: "mechanism",
  title: "A cold cache means you need more capacity to restart than to run",
  source: "Matt Brinkley and Jas Chhabra, Caching challenges and strategies, Amazon Builders' Library",
  gateIntro: "A read-heavy service is restarted as part of a routine rolling deploy on a Tuesday afternoon. Client-visible request rates are flat throughout and no client behaviour changed. Within seconds of the first pods coming back, the datastore behind the service sees a query rate several times higher than its normal daily peak, its connection pool saturates, and the service starts returning timeouts. The deploy completes on schedule. The datastore stays pinned and the service does not settle on its own.",
  idea: "A service fronted by a cache is provisioned for its warm hit rate, so the moment the cache is empty its dependency is asked for a multiple of the load it has ever served.",
  why: "The modal hit rate is the hidden capacity multiplier. At a 95 percent hit rate the backend has been sized, tuned and load tested for one twentieth of the request stream. Empty the cache and the backend sees the whole stream at once, which is a load it has never handled and was never intended to handle. Brinkley and Chhabra call this out directly: caching makes the system bimodal, and the cold mode has a completely different capacity requirement to the warm one.\n\nThe consequence for recovery is that a restart is not a neutral action. It converts a service from its cheap mode to its expensive mode instantaneously. Recovery therefore needs either load shedding while the cache fills, staged capacity return so only a fraction of traffic is cold at any time, or a warming pass before traffic is admitted. Doing none of these means the restart is the incident.",
  failureMode: "A ClickHouse-backed lineage endpoint runs happily on a warm mark cache. A node pool rotation cycles every replica inside ten minutes, all caches empty simultaneously, and ClickHouse takes a full scan workload it has never seen. Queries queue, the endpoint times out, and the retries make the cold load worse than the original cold load.",
  experiment: "Pick your highest-traffic cache in a non-production tenant, measure the steady-state hit rate, and multiply the current backend query rate by one over the miss rate. Compare that number to the backend's measured saturation point. If the cold number exceeds it, you do not have a restart procedure, you have a hope.",
  reflection: "Which of your caches, if emptied at peak, asks its backend for more than the backend can serve?",
  recall: {
    q: "Why can a service that runs comfortably at steady state be unable to start?",
    a: "Steady-state capacity is sized for the warm hit rate, so the backend has only ever served the miss fraction of the request stream. A cold cache presents the full stream at once, which is a multiple of anything the backend has been tested against.\n\nRecovery therefore requires shedding load, returning capacity in stages, or warming before admitting traffic. A clean restart with full traffic is the failure."
  },
  deepDive: "Work out the cold-cache multiplier for the caches in front of my ClickHouse cluster and tell me which one exceeds the cluster's measured saturation point."
},
{
  id: "recovery-azure-devops-restore-time",
  track: "recovery", level: "recovery",
  title: "Azure DevOps, 24 May 2023: nobody had timed the restore at production size",
  source: "Eric Mattingly, Azure DevOps South Brazil outage post-mortem (Microsoft, 2023)",
  gateIntro: "On 24 May 2023 Azure DevOps customers in the Brazil South scale unit lost access to the service. Microsoft established the cause quickly: a background job intended to delete obsolete Azure Cosmos DB databases had, because of a typo in a code change, deleted seventeen production databases for the scale unit instead. Point-in-time backups existed and the restore was initiated. The restore ran for many hours longer than the team's own estimate and the outage extended well past a working day.",
  idea: "A recovery time objective that has only been exercised on small data is a number with no measurement behind it.",
  why: "The restore procedure was well understood and had been run before. It had been run on small databases. At production size the restore was dramatically slower, and Microsoft's write-up notes that the restore of the large databases took an unexpectedly long time - the team had no calibrated expectation because the exercise had never been performed at that scale. There were additional delays because the restored databases came back in a state that required further configuration before the web servers could reach them.\n\nThe general shape is that restore time scales with data volume and with the number of objects, and that both of those grow silently between exercises. If the drill runs against a fixture database and production is three orders of magnitude larger, the drill validates the procedure's correctness and tells you nothing at all about its duration. Correctness and duration are separate properties and only one of them is being tested.",
  failureMode: "Your DR document says four hours because someone restored a staging tenant in four hours in 2023. The largest production tenant now holds thirty times the metadata. When it matters, the restore is still running at hour nine and you are giving customers estimates you have no basis for.",
  experiment: "Take your largest tenant's ClickHouse dataset or Postgres database, restore it into an isolated namespace, and time it with a stopwatch. Compare the number to whatever your runbook or DR document currently claims. Write the measured number and the date into the runbook.",
  reflection: "What is the largest volume of production data you have personally watched come back from a backup, and how long ago was that?",
  recall: {
    q: "What does a restore drill on a small database validate, and what does it not?",
    a: "It validates correctness: that the procedure works, the backups are readable, and the steps are in the right order. It says nothing about duration, because restore time scales with data volume and object count.\n\nAzure DevOps had a working restore procedure. What it did not have was a measured restore time at production size, so the recovery objective was an unmeasured guess."
  },
  deepDive: "Design a restore drill for my largest tenant that measures duration honestly without touching production, and tell me what it will cost to run quarterly."
},
{
  id: "recovery-gmail-offline-media",
  track: "recovery", level: "recovery",
  title: "Gmail, February 2011: the copy that survived was on media the failure could not reach",
  source: "Ben Treynor, Gmail back soon for everyone, Google Official Blog (2011)",
  gateIntro: "In late February 2011 a small fraction of Gmail users signed in to find empty accounts: no messages, no labels, no filters. Google confirmed that the accounts and their contents still existed and that this was not a deletion by the users or by any attacker. The affected accounts were scattered across the user base rather than clustered on particular machines or in a particular region. Access was restored for most affected users within a day, and for the remainder over the following days.",
  idea: "Replication protects against media failure and does nothing at all against a defect that propagates through the replicas.",
  why: "The trigger was a storage software update containing a bug. Because Gmail data is replicated across multiple datacentres, and the defect operated at the software layer above that replication, the effect reached every online copy. Redundancy of the kind that protects against a disk dying, a machine dying or a datacentre dying offers no protection here, because all the copies are being manipulated by the same defective code.\n\nWhat survived was on tape - offline media, physically outside the failure domain of the running system. That is what made the recovery possible, and it is also what set the recovery duration. Once the surviving copy is on tape, the clock is governed by locating the tapes and by restore bandwidth, not by diagnosis or by engineering skill. Diagnosis was over long before the data was back. This is why offline or otherwise logically isolated copies remain worth their cost, and why their restore bandwidth is a number worth knowing before you need it.",
  failureMode: "Your ClickHouse data is replicated three ways and you treat that as backup. A bad schema migration or a defective merge path writes through all three replicas identically. Now the only real copy is whatever object-store snapshot exists, and nobody has measured how long it takes to pull a tenant's worth of parts back out of it.",
  experiment: "For your most important dataset, name the copy that a bug in the storage or ingestion code cannot reach. If every copy you can name is written by the same code path, you do not have one. If you do have one, measure its restore throughput in gigabytes per hour and compute how long the largest tenant would take.",
  reflection: "Which of your copies would survive a defect rather than a disk failure, and how fast can you read it back?",
  recall: {
    q: "Why did replication not save Gmail in February 2011, and what set the recovery duration?",
    a: "The failure was a software defect in the storage layer, which propagated identically through every online replica. Replication defends against media and site failure, not against correct replication of a wrong result.\n\nThe surviving copy was on offline media, so the recovery clock was set by locating tapes and by restore bandwidth rather than by diagnosis."
  },
  deepDive: "Identify which copies of my ClickHouse and Postgres data are outside the failure domain of the code that writes them, and how to measure the restore bandwidth of each."
},
{
  id: "recovery-reddit-restore-not-viable",
  track: "recovery", level: "recovery",
  title: "Reddit, 14 March 2023: the restore path existed on paper and was not viable in the moment",
  source: "Reddit Engineering, You Broke Reddit: The Pi-Day Outage (2023)",
  gateIntro: "On 14 March 2023 Reddit went almost entirely dark for just over five hours. The trigger was an in-place Kubernetes control plane upgrade on the oldest and largest production cluster, a procedure that had already been run successfully on other clusters. Within minutes of the upgrade, in-cluster DNS and pod-to-pod networking began failing broadly and the site stopped serving. The team's early plan was to restore the cluster from backup, and the outage nonetheless ran for hours of forward diagnosis instead.",
  idea: "A recovery option you have never rehearsed is not an option you can choose during an incident.",
  why: "The cause was narrow: the Kubernetes 1.24 upgrade removed a long-deprecated node label that the cluster's Calico route reflector configuration was still selecting on, so the route reflectors stopped being identified and in-cluster routing collapsed. That is a small, findable thing, and it took hours to find.\n\nThe reason it took hours is that the alternative was not available. Restoring the cluster from backup had been written down but never practised, and at the moment of the outage the team judged it too uncertain to attempt on the largest and oldest cluster in the fleet, with unknown duration and unknown blast radius. So the only path was root-causing forward under full outage pressure, which is the slowest and highest variance way to end an incident. A rehearsed restore would have bounded the outage regardless of whether anyone understood the cause.",
  failureMode: "You have a documented procedure to rebuild a tenant cluster from Git and snapshots. During a real outage nobody will run it, because it has never been run, and the person on call is not going to make an untested full-cluster restore their first move at 3am. The document provides comfort in planning and nothing in the incident.",
  experiment: "Take the least-recently-upgraded cluster in your estate and check two things: what node labels, taints or API versions your networking, ingress and Argo or Temporal components select on, and when the cluster's restore-from-backup procedure was last actually executed by a human. If the answer to the second is never, that path does not exist.",
  reflection: "Which of your written recovery procedures would you refuse to run during a real incident, and why?",
  recall: {
    q: "Reddit had a documented cluster restore. Why did it not shorten the Pi-Day outage?",
    a: "It had never been rehearsed, so its duration and blast radius were unknown. During a full outage on the largest and oldest cluster, an untested restore was a worse bet than continuing to diagnose.\n\nThat left root-causing forward under full outage pressure as the only path, which is the slowest and highest variance way to end an incident. A rehearsed restore would have bounded the outage without anyone understanding the cause."
  },
  deepDive: "Help me pick one cluster and design a rehearsal of its full restore that is safe to run and that produces a measured duration."
},
{
  id: "recovery-github-reconciliation",
  track: "recovery", level: "amplifier",
  title: "GitHub, 21 October 2018: forty three seconds of partition produced a day of reconciliation",
  source: "GitHub, October 21 post-incident analysis (2018)",
  gateIntro: "At 22:52 UTC on 21 October 2018, routine maintenance to replace failing optical equipment severed connectivity between GitHub's US East Coast network hub and its primary US East Coast data centre. The link was down for 43 seconds and then came back on its own with no further intervention. GitHub then ran degraded for more than 24 hours: the site was reachable, but some users saw stale data, webhooks and Pages builds were delayed, and a large backlog accumulated. The network was healthy throughout that period.",
  idea: "When both sides of a partition accept writes, recovery is not a restart, it is a manual reconciliation whose duration has nothing to do with how long the partition lasted.",
  why: "During the 43 seconds, the automated failover system promoted a MySQL cluster in the US West Coast data centre. Writes had continued to land on the East Coast primary in the moments before the promotion, and those writes were not present on the West Coast. After the link healed, the two sides each held writes the other did not have. There was no safe automated path back, because choosing either side as authoritative discards real user data.\n\nSo the recovery work was reconciliation: replaying and merging divergent state carefully, with the site degraded throughout because it could not be run normally while the data was being repaired. The trigger duration and the recovery duration were separated by more than three orders of magnitude. This is the general property of split-brain: the cost is set by how much divergent state was created and how hard it is to merge, not by the length of the network event.",
  failureMode: "A brief network blip between availability zones causes a Temporal namespace or a controller lease to be claimed in two places. Both sides start workflows and both sides write to tenant metadata. The blip is over in a minute. You then spend the day working out, per tenant, which side's writes to keep, with the platform half-open the entire time.",
  experiment: "For each control plane component that has an automated failover - database promotion, leader election, Argo controller leases, Temporal frontend routing - write down what happens if both sides believe they are primary for one minute. Mark each as either safe (fenced, one side cannot write) or reconcile (both can write). Count the ones in the second category.",
  reflection: "Which automated failover in your estate would you rather disable than run unfenced?",
  recall: {
    q: "Why did a 43 second network partition cost GitHub more than a day?",
    a: "Automated failover promoted a database in a second site while writes were still landing in the first, so after the link healed both sides held writes the other lacked. Neither side could be discarded without losing real user data.\n\nRecovery was therefore manual reconciliation of divergent state, with the site degraded throughout. The cost is set by how much divergent state was created and how hard it is to merge, not by the length of the network event."
  },
  deepDive: "Audit the automated failovers in my Kubernetes and Temporal estate and tell me which ones can produce divergent writes rather than a fenced handover."
},
{
  id: "recovery-cloudflare-global-kill",
  track: "recovery", level: "recovery",
  title: "A tested global disable switch is a recovery capability worth building before you need it",
  source: "John Graham-Cumming, Details of the Cloudflare outage on July 2, 2019",
  gateIntro: "At 13:42 UTC on 2 July 2019, CPU utilisation across Cloudflare's global edge fleet rose to saturation and stayed there. HTTP traffic through the network dropped sharply and visitors to sites behind Cloudflare saw 502 errors worldwide. There had been no network event, no attack and no traffic spike. The most recent change to the fleet was a routine rule deployment a few minutes earlier. Traffic largely returned at 14:09 UTC, and the underlying change was not reverted until later.",
  idea: "The fastest recovery mechanism in existence is a switch that turns off one subsystem globally, and it only works if someone has used it before the incident.",
  why: "A regular expression in a newly deployed WAF rule backtracked catastrophically and consumed all available CPU on every machine in the fleet. Cloudflare's path back was not a rollback, a redeploy or a restart. It was the global WAF kill, a pre-existing mechanism that disables the WAF everywhere at once. Traffic recovered at that moment, well before the offending rule was understood or removed.\n\nWhat makes this worth generalising is that the kill switch has three properties a rollback does not. It is fast, because it changes one flag rather than shipping artefacts. It is uniform, because it takes effect everywhere at once rather than propagating through a deploy pipeline. And it is independent of diagnosis, because you can decide to disable a subsystem while still having no idea what is wrong with it. The cost is that it must exist, be reachable when the thing it disables is broken, and have been exercised by the people who will need it.",
  failureMode: "You have per-tenant feature flags but no way to disable a subsystem across all tenants at once, so during a global incident someone is looping through tenant configs by hand. Or the switch exists and lives behind the very ingress path that is saturated, so it cannot be reached at the moment it is needed.",
  experiment: "Pick your riskiest recently added subsystem - a new Temporal worker pool, a lineage enrichment path, a metadata indexing stage. Establish whether it can be disabled globally in one action, how long that takes to take effect, and whether the control plane for the switch depends on the subsystem being healthy. Then have someone who is not the author flip it in staging.",
  reflection: "Which of your subsystems has no global off switch, and what is stopping you from adding one this week?",
  recall: {
    q: "What three properties make a global kill switch a better recovery tool than a rollback?",
    a: "It is fast because it flips a flag rather than shipping artefacts, it is uniform because it applies everywhere at once instead of propagating through a pipeline, and it is independent of diagnosis because you can disable a subsystem before you understand its fault.\n\nIt only pays off if it is reachable when the subsystem is broken and someone has exercised it before the incident."
  },
  deepDive: "Help me design a global disable switch for one of my Temporal worker pools whose control path does not depend on the pool being healthy."
},
{
  id: "recovery-restart-all-at-once",
  track: "recovery", level: "recovery",
  title: "Restarting everything at once is a different failure than restarting nothing",
  source: "Mike Ulrich, Addressing Cascading Failures, Google SRE book chapter 22",
  gateIntro: "A service tier is overloaded and roughly half its tasks have died on memory exhaustion. An operator restarts the whole tier at once to clear the bad state. The tasks come up healthy, serve for tens of seconds, then begin dying again in the same pattern. Offered load from clients has not increased at any point. Each cycle of restart and collapse arrives faster than the one before, and the tier never holds.",
  idea: "A service in a cascading failure cannot be restarted back to health, because the returning fleet meets the full backlog with cold caches and empty connection pools.",
  why: "The returning tasks are in their most expensive state. Caches are empty, connection pools are unestablished, JIT and page caches are cold, and every downstream call is a first call. Simultaneously the offered load is not the normal load: it is the normal load plus everything that queued or retried while the tier was down. The tier is therefore asked to serve its worst case with its worst capacity, which it cannot do, so it dies again, which adds to the backlog, which makes the next attempt harder.\n\nUlrich's prescription is to break the loop from the load side first, not the capacity side. Drop or shed traffic, disable non-critical work, cut retries, and only then return capacity in stages so that each returning increment gets a survivable share of the load. Restarting is a legitimate tool for clearing bad in-process state, but it is never the first action in a cascade, and it is never done to the whole fleet.",
  failureMode: "Your Temporal worker deployment is thrashing on OOM. Someone runs a rollout restart across all replicas. Every worker comes back and immediately long-polls a task queue holding hours of accumulated backlog, all of them cold, all of them hitting the same database. They die together, which is worse than the state you started from because now the backlog is bigger.",
  experiment: "For your busiest Temporal task queue, work out what happens to backlog depth during a full worker restart under current traffic, and whether you have any mechanism to shed or pause work before returning capacity. If your only lever is replica count, you have one control where you need two.",
  reflection: "In your last capacity-driven incident, did anyone reduce load before adding capacity back, or was restart the first action?",
  recall: {
    q: "Why does restarting a whole tier during a cascading failure usually make it worse?",
    a: "The returning tasks have cold caches and empty connection pools, so their capacity is at its minimum, while the offered load is at its maximum because the backlog and retries accumulated during the outage. They fail again and grow the backlog.\n\nLoad has to come down first through shedding or disabling non-critical work, and capacity has to return in stages."
  },
  deepDive: "Design a staged recovery for my Temporal worker fleet that reduces offered load before returning capacity, and tell me what the load lever should be."
},
{
  id: "recovery-rollback-versus-state",
  track: "recovery", level: "mechanism",
  title: "Rolling back the code does not roll back the state the code already created",
  source: "Temporal documentation, Workflow determinism, Versioning and Patching",
  gateIntro: "A worker deployment goes out at 10:00. At 10:40 it is rolled back for an unrelated reason and the previous image is running everywhere within two minutes. Client traffic is normal throughout. From 10:42 the worker logs fill with errors, but only on a subset of executions: anything started before 10:00 completes normally, and anything started after the rollback completes normally. The affected executions are not failing, they are stuck, and they stay stuck through two further worker restarts.",
  idea: "A rollback restores the code and leaves behind every piece of durable state the newer code already created, which is why in-flight workflows break on revert.",
  why: "A Temporal workflow's correctness rests on deterministic replay: the worker re-executes the workflow function against the recorded event history and the commands it produces must match what is already in the history. Code shipped at 10:00 that adds an activity, reorders two calls or changes a timer writes those commands into the histories of every execution it touches. Roll the worker back and the old code replays those same histories, produces different commands, and the SDK raises a non-determinism error. The execution does not fail cleanly, it stops making progress, and restarting the worker does nothing because the history is durable.\n\nThe correct handling is a version gate rather than a revert. Patching or worker versioning keeps both code paths present so that old executions continue to take the branch they already committed to while new executions take the new one. The general principle is broader than Temporal: any system with durable in-flight state - a migration that has written new-format rows, a queue holding messages in a new schema, a saga midway through - has a rollback that is only a partial rollback, and the residue is where the incident lives.",
  failureMode: "During the Argo to Temporal cutover someone reverts a worker image to stop a bug. Every tenant workflow started in the intervening forty minutes wedges on non-determinism, and because they are stuck rather than failed no alert fires on error rate. You find them hours later by noticing that a tenant's crawl never finished.",
  experiment: "Query your Temporal namespace for currently open executions and their start times. Work out how many would be mid-flight during a typical forty minute deploy window on your longest-running workflow type. That number is the blast radius of a naive rollback, and if it is not zero you need a patch strategy rather than a revert plan.",
  reflection: "What is the longest-running workflow in your estate, and does your deploy runbook say revert or say patch?",
  recall: {
    q: "Why does reverting a Temporal worker image break executions that the newer image started?",
    a: "Workflow correctness depends on deterministic replay against the recorded history. The newer code wrote commands into those histories, so the older code replays them, produces different commands, and hits a non-determinism error.\n\nThe executions wedge rather than fail, restarts do not help because the history is durable, and the correct recovery is a version gate or patch that keeps both code paths available."
  },
  deepDive: "Given my longest-running workflow types, help me write a deploy runbook that uses patching and worker versioning instead of rollback, and define when a revert is still safe."
},
{
  id: "recovery-drain-duration",
  track: "recovery", level: "mechanism",
  title: "A drain takes as long as your longest in-flight unit of work, or forever",
  source: "Kubernetes documentation, Disruptions, PodDisruptionBudget and terminationGracePeriodSeconds",
  gateIntro: "A node pool rotation on a multi-tenant cluster is scheduled into a 30 minute maintenance window. Six hours later, three nodes are still cordoned and not empty. The drain command has not returned an error and is not retrying; it is simply still running. The pods that remain on those nodes all belong to the same workload class. Meanwhile the autoscaler has added replacement capacity that it cannot remove, and the cluster is running at roughly double its intended node count.",
  idea: "Drain duration is set by your longest in-flight unit of work and your disruption budgets, and a budget that can never be satisfied makes it unbounded.",
  why: "A drain evicts pods subject to two constraints. PodDisruptionBudget caps how many pods of a workload may be unavailable at once, so eviction blocks until the budget allows it. terminationGracePeriodSeconds caps how long a pod gets after SIGTERM before it is killed, so a pod doing long work either finishes inside that window or is killed mid-work. The two interact: a workload with a long grace period and a tight budget drains one pod at a time, each taking the full grace period.\n\nThe unbounded case is when the budget can never be satisfied. A single-replica deployment with minAvailable of one, or a workload whose replacement pod cannot schedule because the node pool is cordoned, means the eviction API refuses forever and the drain never completes. This is why node rotation on a cluster running hour-long tenant workflows is not a maintenance task, it is a capacity project: you either wait out the work, checkpoint it so it can be killed and resumed, or accept killing it.",
  failureMode: "Your Temporal workers hold activities that run for forty minutes and you rotate node pools monthly. Either the grace period is short and every rotation kills tenant work mid-activity, or the grace period is honest and a rotation across sixty nodes takes a day and a half. Nobody chose either of these; they are the emergent result of two defaults set by different people.",
  experiment: "For every workload in your busiest namespace, list terminationGracePeriodSeconds against the p99 duration of the work a pod holds, and list the PDB alongside the replica count. Flag every row where the grace period is shorter than p99 work, and every PDB where minAvailable equals the replica count.",
  reflection: "How long does a full node pool rotation actually take on your busiest cluster, measured rather than assumed?",
  recall: {
    q: "What two settings determine how long a node drain takes, and what makes it never finish?",
    a: "PodDisruptionBudget determines how many pods can be evicted at once, and terminationGracePeriodSeconds determines how long each gets to finish after SIGTERM. A long grace period with a tight budget serialises the drain.\n\nIt never finishes when the budget can never be satisfied, for example minAvailable equal to the replica count, or a replacement pod that cannot schedule because the pool is cordoned."
  },
  deepDive: "Audit the PDBs and grace periods in my busiest namespace against actual work durations and tell me the true cost of a full node pool rotation."
},
{
  id: "recovery-roblox-telemetry-inside",
  track: "recovery", level: "amplifier",
  title: "Roblox, October 2021: the first step of the runbook needed the telemetry that was down",
  source: "Roblox, Roblox Return to Service 10/28-10/31 2021",
  gateIntro: "On 28 October 2021 Roblox player numbers began to fall and by the evening the platform was entirely unavailable. It stayed down for 73 hours. There had been no release and no configuration change that correlated with the onset, and load was not unusual for the time of year. The investigation moved through a sequence of hypotheses over the first two days, several of which were pursued and abandoned, and the eventual cause was found only after engineers began inspecting low-level internals of one infrastructure component directly.",
  idea: "Monitoring that shares infrastructure with the thing it monitors goes blind exactly when it is needed, and every runbook that starts with a dashboard becomes a dead end.",
  why: "The failure was in the Consul cluster underneath Roblox's service discovery: a newly enabled streaming feature caused contention under load, compounded by a performance pathology in Consul's BoltDB write path. Roblox's observability systems used the same Consul cluster for service discovery. When Consul degraded, the telemetry degraded with it, so the engineers diagnosing the outage were doing so with substantially reduced visibility into the system they were diagnosing.\n\nThe amplification is not subtle. Diagnosis time is the dominant term in a long outage, and diagnosis is a search over hypotheses. Removing telemetry removes the ability to cheaply discard hypotheses, so the search becomes sequential and slow, which is exactly the pattern the write-up describes. Roblox's own follow-up was to move telemetry off the shared dependency. The rule that generalises is that your monitoring path must be outside the blast radius of the things it monitors, which usually means a different cluster, different service discovery, and ideally a different provider.",
  failureMode: "Grafana runs in the same Kubernetes cluster as the workloads, authenticates through the same ingress, and reads ClickHouse through the same service mesh. A control plane incident takes all of it out together, so the on-call opens the dashboard link in the alert and gets a spinner. The runbook's first three steps are now unavailable and the incident becomes an exercise in reading logs off nodes by hand.",
  experiment: "Draw the dependency path from an alert firing to a human reading a graph: alerting rules, notification delivery, Grafana, the datasource, service discovery, ingress, identity. Mark every hop that shares a cluster, a control plane or a provider with production. Then pick your highest-severity runbook and count how many of its first five steps depend on a marked hop.",
  reflection: "If your primary cluster's control plane were unavailable right now, which of your dashboards would still render?",
  recall: {
    q: "Why does shared infrastructure between production and observability lengthen an outage more than the lost dashboards would suggest?",
    a: "Diagnosis dominates the duration of a long outage and diagnosis is a search over hypotheses. Telemetry is what lets you discard hypotheses cheaply, so losing it turns a parallel search into a slow sequential one.\n\nRoblox lost telemetry because it used the same Consul cluster that had failed, and the investigation ran through days of abandoned hypotheses before reaching the cause."
  },
  deepDive: "Trace the dependency path from alert to rendered graph in my Grafana and ClickHouse setup and tell me which hops sit inside the blast radius of my production clusters."
},
{
  id: "recovery-crowdstrike-manual-touch",
  track: "recovery", level: "recovery",
  title: "CrowdStrike, 19 July 2024: a recovery that needs a human at each machine does not scale",
  source: "CrowdStrike, remediation guidance and External Technical Root Cause Analysis (2024)",
  gateIntro: "On 19 July 2024, beginning at 04:09 UTC, Windows hosts running a widely deployed endpoint agent began bugchecking and entering boot loops. Airlines, hospitals, broadcasters and payment networks were affected within the hour. The offending content was withdrawn at 05:27 UTC, 78 minutes after publication, and no machine that had not already received it was affected afterwards. Machines that had received it continued to fail. Recovery ran for days and in some organisations for more than a week.",
  idea: "Recovery cost is set by whether the fix can be delivered remotely, and an agent that breaks the boot path also breaks the channel you would use to fix it.",
  why: "A defective channel file caused an out-of-bounds read in the sensor's content interpreter, in a kernel-mode driver, which bugchecks the machine. The fix itself was trivial: boot into safe mode or the recovery environment and delete one file. But the machine will not boot far enough to receive an update, and the component that would have pulled the corrected content is the component that is crashing. So the remote path did not exist and the work became one human, one machine, at scale.\n\nA second amplifier turned days into weeks for some organisations. Safe mode with disk encryption requires the recovery key, and the systems holding those keys were often themselves affected, or reachable only by staff whose own machines were down. This is the recursive dependency shape: the recovery required a resource whose availability depended on the recovery. The general lesson is to ask, for any component you deploy at scale, whether a bad version of it can be corrected remotely - and if the answer depends on the component working, the remediation cost per host is a human visit.",
  failureMode: "You ship a DaemonSet or a node image change that fails on boot. The nodes never join, so no controller can reach them, and the mechanism that would roll the change back is a Kubernetes API interaction with nodes that are not in the cluster. Recovery is now per-node console work through your cloud provider, multiplied by every node in every tenant cluster.",
  experiment: "For every component that runs on the node boot path in your clusters - CNI, CSI, node agents, DaemonSets with hostNetwork, custom AMIs or node images - answer one question: if this ships broken, can it be fixed without console access to each node? Count the ones where the answer is no, and check whether their rollout is staged or global.",
  reflection: "Which change in your estate, if bad, would require touching every node individually to undo?",
  recall: {
    q: "The CrowdStrike fix was deleting one file. Why did recovery take days?",
    a: "The broken component was in the kernel boot path, so affected machines could not boot far enough to receive a corrected version, and the agent that would have pulled that correction was the crashing component. The fix had to be applied by a human at each machine.\n\nDisk encryption compounded it: safe mode needed recovery keys, and the systems holding them were often affected too."
  },
  deepDive: "List the components in my node boot path whose bad versions could not be corrected remotely, and tell me which of them currently roll out globally rather than in stages."
},
{
  id: "recovery-circleci-third-party-clock",
  track: "recovery", level: "recovery",
  title: "CircleCI, 4 January 2023: the recovery clock was set by other people's actions",
  source: "CircleCI, Incident report for January 4, 2023 security incident",
  gateIntro: "On 29 December 2022 a CircleCI customer alerted the company to suspicious GitHub OAuth activity on their account. On 4 January 2023 CircleCI published a notice telling all customers to rotate any secrets stored in the platform. The build platform itself remained fully available throughout and there was no service degradation at any point. CircleCI cut off the intruder's access and completed its own remediation comparatively quickly. The incident nevertheless remained open, with active customer guidance, for weeks afterwards.",
  idea: "When remediation requires action by parties you do not control, the incident duration is their response time, not your execution time.",
  why: "An engineer's laptop was compromised by malware that stole a valid, 2FA-backed session cookie, which let the intruder impersonate that engineer and reach production systems. Environment variables, tokens and keys belonging to customers were exfiltrated. CircleCI rotated its own credentials, rotated GitHub OAuth tokens in cooperation with GitHub, and worked with AWS to notify affected customers.\n\nNone of that closes the incident, because the exposed material belongs to customers. Every customer project secret, every deploy key, every cloud credential stored in the platform had to be rotated by the customer who owned it. CircleCI could publish guidance, provide tooling and send notifications; it could not perform the rotation. So the tail of the incident is a distribution of other organisations' change windows, staffing and appetite, and the platform stays in an exposed state for as long as any of them takes. Designing for this means reducing the number of secrets you hold, making rotation something you can perform on the customer's behalf, and knowing in advance how you would reach every affected tenant.",
  failureMode: "A tenant-scoped credential leaks from your platform. You hold connection secrets for hundreds of customer data sources. Your own remediation takes an afternoon. Then you spend six weeks emailing data engineering teams asking them to rotate warehouse credentials, with no visibility into who has done it, and the exposure window is defined by the slowest one.",
  experiment: "Count the distinct classes of customer-owned secret your platform stores - warehouse credentials, cloud roles, API tokens, webhook signing keys. For each, establish whether you could rotate it on the customer's behalf, and whether you have a current, tested channel to reach every tenant that holds one. Both answers being no is the case that makes an incident open-ended.",
  reflection: "How many customer-owned secrets does your platform hold that only the customer can rotate?",
  recall: {
    q: "Why was CircleCI's incident duration not a function of how fast CircleCI worked?",
    a: "The exposed material was customer-owned secrets stored in the platform, so remediation required every affected customer to rotate their own credentials. CircleCI could notify and provide tooling but could not perform the rotation.\n\nThe exposure window was therefore the distribution of other organisations' response times, and it stayed open for weeks after CircleCI's own work was finished."
  },
  deepDive: "Inventory the customer-owned secrets my platform stores, and tell me which ones I could rotate on the tenant's behalf versus which would make an incident open-ended."
}
);

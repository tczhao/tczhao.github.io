/* Track: Cloud COGS. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "cogs-four-components",
  track: "cogs", level: "read",
  title: "Cost of revenue for an infrastructure SaaS has four recurring components",
  source: "Confluent Form 10-K, cost of revenue discussion in Item 7 MD and A; Storment and Fuller, Cloud FinOps, chapter 1",
  idea: "Cost of revenue for an infrastructure business is hosting, the people who deliver and support the product, third party software, and amortisation, and those four behave differently as you grow.",
  why: "Gross profit is revenue minus cost of revenue, so what a company puts inside that line decides how margin moves with scale. Hosting is close to variable and tracks usage within a month. Support and delivery headcount is step-fixed and arrives in hires, so it distorts margin for a quarter each time you add a pod. Third party software is contractual and often per-seat or per-unit, so it steps at renewal. Amortisation of capitalised internal-use software and acquired technology is the ghost of a decision made a year or two ago and does not respond to anything you do this month.\n\nThis is why \"our gross margin is our cloud bill\" is wrong in a way that costs you credibility in the room. The cloud bill is one of four, and in a company with a serious support organisation it is frequently not the largest. If you argue architecture on hosting alone, someone from finance will point out that the support cost of the architecture you are proposing swamps the infrastructure saving, and they will be right.",
  failureMode: "An engineering leader presents a rearchitecture that halves compute spend and calls it a gross margin win. Finance points out that the new topology needs a dedicated on-call rotation per region, that those people are classified in cost of revenue, and that the payroll step is larger than the compute saving. The proposal dies in the room rather than in review, because the four components were never on the same page.",
  experiment: "Open Confluent's most recent 10-K on EDGAR, search for \"cost of revenue\" in Item 7, and write down every component it names. Then build the same four-row table for your own service: hosting, delivery and support payroll, third party software, amortisation. Put a monthly dollar figure in each row and mark each row variable, step-fixed or sunk. If you cannot fill the payroll row, that number belongs to your finance business partner and you need to ask for it by name.",
  reflection: "Which of your four rows was largest, and was it the one you had been optimising?",
  recall: {
    q: "Name the four recurring components of cost of revenue for an infrastructure SaaS and say how each behaves as usage grows.",
    a: "Hosting and infrastructure, which is roughly variable with usage. Support and delivery personnel, which is step-fixed and moves in hires. Third party software, which steps at contract renewal. Amortisation of capitalised and acquired software, which is sunk and does not respond to this month's usage at all.\n\nThe practical consequence is that a compute saving and a headcount step are not interchangeable currency, even though they land on the same line."
  },
  deepDive: "Here is my monthly cloud bill total and my team's shape; help me build the four-row cost of revenue table for my service and tell me exactly which numbers I have to get from finance."
},
{
  id: "cogs-support-classification",
  track: "cogs", level: "decide",
  title: "Support cost sits in cost of revenue and moves gross margin by points",
  source: "GitLab Form 10-K and Elastic Form 10-K, cost of revenue accounting policy and MD and A descriptions",
  idea: "Where a company draws the line between support that is cost of revenue and engineering that is R and D changes reported gross margin without changing a single activity.",
  why: "Classification is a policy, not a fact. An engineer who spends the day debugging a specific customer's ingestion pipeline can be booked as cost of revenue, because the work delivers the subscription, or as research and development, because the fix ships to everyone. Both treatments are defensible, both have to be applied consistently, and they produce different gross margins from identical work. Read GitLab's and Elastic's cost of revenue descriptions side by side and you will see two companies naming different sets of activities.\n\nThis matters to you specifically because the re-charter argument is a margin argument. If a large share of your team's payroll is already classified in cost of revenue, then reducing toil is directly a gross margin story and you can say so in the language the CFO reads. If it is in R and D, the same work is an operating expense story and lands in a different section of the model. You cannot make that argument until you know which bucket your people are in, and that is not knowledge engineering usually holds.",
  failureMode: "A platform team spends two quarters cutting escalation volume, then presents it as a gross margin improvement. Finance has their payroll in R and D, so the saving never touched cost of revenue, and the deck reads as if the team does not understand its own P and L. The work was real and the framing burned the credibility it should have bought.",
  experiment: "Pull the latest GitLab and Elastic 10-Ks and copy each company's cost of revenue description into a two-column note. Count the activity categories each one names and mark the ones only one of them includes. Then ask your finance business partner, the controller or FP and A lead who owns the cost of revenue allocation policy, one question: what percentage of my team's payroll is currently classified as cost of revenue? The answer is a single number and it changes what your next deck says.",
  reflection: "After you learned where your payroll is booked, did your re-charter argument get stronger or did it have to change shape?",
  recall: {
    q: "Two companies do identical customer support work and report different gross margins. What is the most likely reason, and who owns the answer at your company?",
    a: "They classify support and delivery personnel differently between cost of revenue and operating expense. The activity is the same; the accounting policy differs, and it must be applied consistently but is not standardised across companies.\n\nThe owner is the controller or FP and A lead who sets the cost of revenue allocation policy. Ask them for the share of your team's payroll sitting in cost of revenue."
  },
  deepDive: "Take these two cost of revenue descriptions I pasted from filings, list the activity categories each one includes, and tell me which differences would move reported gross margin most."
},
{
  id: "cogs-finops-capability-gap",
  track: "cogs", level: "read",
  title: "The FinOps Framework names the capabilities you do not have",
  source: "FinOps Foundation, FinOps Framework, domains and capabilities",
  idea: "The FinOps Framework publishes a fixed list of domains and capabilities, so use it as a gap audit instead of inventing a maturity model of your own.",
  why: "A published capability list does two things a homegrown one cannot. It names capabilities you have never thought about, which is the entire point of an audit, and it gives you vocabulary that a FinOps practitioner, a vendor and a CFO all already share. The framework groups capabilities under domains covering understanding usage and cost, quantifying business value, optimising usage and cost, and running the practice itself, with named capabilities such as Allocation, Data Ingestion, Reporting and Analytics, Anomaly Management, Unit Economics, Forecasting, Rate Optimization and Workload Optimization.\n\nThe framework also attaches crawl, walk and run maturity descriptions to each capability, which is what stops a self-assessment turning into self-flattery. You are not scoring yourself against your ambition; you are scoring against a written description of what walk looks like. Most infrastructure teams discover they are strong on workload optimisation, because that is engineering, and absent on allocation and unit economics, because those require joining the bill to the product.",
  failureMode: "A team builds its own five-level cloud cost maturity model in a slide, scores itself at level three, and never notices that anomaly management and unit economics are missing from the model entirely. The categories they invented were the categories they were already good at.",
  experiment: "Open the FinOps Framework capability list and score every capability crawl, walk, run or absent for your service, using the framework's own descriptions rather than your judgement. Count the absents. Then pick the single absent capability whose gap most directly blocks a per-tenant margin number and write one sentence on what it would take to reach crawl.",
  reflection: "How many capabilities did you score absent, and how many of those had you never heard named before today?",
  recall: {
    q: "Why score yourself against the FinOps Framework capability list rather than a maturity model you write yourself?",
    a: "Because a self-authored model only contains categories you already thought of, so it systematically hides the gaps that matter. The published list names capabilities such as Allocation, Anomaly Management and Unit Economics whether or not you practise them.\n\nIt also supplies crawl, walk and run descriptions, so the score is against written criteria rather than against your own ambition."
  },
  deepDive: "Walk me through the FinOps Framework capabilities one domain at a time and help me score my platform honestly, pushing back where my evidence for a walk score is thin."
},
{
  id: "cogs-focus-schema",
  track: "cogs", level: "read",
  title: "FOCUS gives every cloud bill one schema and one set of column names",
  source: "FinOps Foundation, FOCUS specification version 1.0",
  cheat: "Build every unit cost trend on EffectiveCost; on BilledCost a commitment purchase looks like a usage spike.",
  idea: "FOCUS is an open specification that defines a common schema, column names and allowed values for billing data, which is what makes cross-provider cost analysis a query rather than a project.",
  why: "Before FOCUS, every provider exported its own billing file with its own column names, its own words for the same concept and its own treatment of commitments and credits. Any cross-provider report meant writing and maintaining a bespoke normaliser per provider, which is why most organisations never had one. FOCUS defines required columns with defined semantics, including BilledCost and EffectiveCost, ListCost and ContractedCost, ChargeCategory, ServiceCategory, resource and SKU identifiers, quantities and units, and charge period timestamps.\n\nThe pair worth internalising is BilledCost against EffectiveCost. BilledCost is what appeared on the invoice for that charge period. EffectiveCost amortises commitment purchases across the period they cover, so a three year prepayment stops appearing as one enormous month. Report a unit cost trend on BilledCost and it will jump on the month you bought a commitment; report it on EffectiveCost and it reflects the economics. Which column you picked is the first question anyone competent will ask about your chart.",
  failureMode: "A per-tenant cost chart shows a step change in March. Two weeks of investigation follow. The cause was a Savings Plan purchase landing as a single billed charge in March while the underlying usage was flat, and the chart was built on BilledCost.",
  experiment: "Check whether each of your providers offers a FOCUS-conformant export and turn it on where it exists. Write one query over a single month that groups by ServiceCategory and sums BilledCost and EffectiveCost. The gap between the two totals is your commitment amortisation effect, and you should be able to say out loud which purchase caused it.",
  reflection: "Which column is your current cost dashboard actually built on, and did you know before today?",
  recall: {
    q: "What is the difference between BilledCost and EffectiveCost in FOCUS, and when does it matter?",
    a: "BilledCost is the charge as it appeared on the invoice for the period. EffectiveCost amortises commitment purchases and prepayments across the periods they cover.\n\nIt matters for any trend or unit cost series. On BilledCost, buying a commitment creates a spike that has nothing to do with usage; on EffectiveCost, the same purchase spreads across the term it bought."
  },
  deepDive: "Help me write a FOCUS query that reports monthly EffectiveCost per ServiceCategory for my account and flags any period where BilledCost and EffectiveCost diverge by more than a threshold I set."
},
{
  id: "cogs-allocation-model",
  track: "cogs", level: "model",
  title: "A bill becomes a cost only after allocation",
  source: "Storment and Fuller, Cloud FinOps, cost allocation chapter",
  idea: "A provider invoice is organised around the provider's billing constructs, so nothing on it is attributable to a tenant, a team or a feature until you push it through an allocation model you can explain out loud.",
  why: "The bill is grouped by account, service, region and SKU because that is how the provider sells. Your business is organised by tenant, product line and team. Allocation is the mapping function between those two shapes, and every per-tenant number you ever quote is a claim about that function rather than a reading off an invoice. If you cannot describe the mapping in three sentences, you do not have a number, you have an output.\n\nThe useful discipline is to force the allocation into three buckets that must sum to the invoice. Directly attributable spend carries a tenant or team identifier on the resource. Shared but allocable spend is real shared infrastructure with a defensible driver, such as a control plane or a shared cluster. Unattributable spend is everything else. Reconciling to the invoice to the dollar is what stops the model quietly dropping charge types nobody mapped, which is the most common way a cost model ends up confidently wrong.",
  failureMode: "A per-tenant cost model built from tagged compute reports total tenant cost 40 per cent below the invoice. Nobody notices, because the model was never reconciled to the bill. The missing spend was support charges, data transfer and an untagged managed database, and the margin conclusion drawn from it was wrong in the direction that flattered the team.",
  experiment: "Take last month's invoice total for one account. Produce three subtotals: directly attributable, shared but allocable, unattributable. Check they sum to the invoice within a dollar. If they do not, the difference is a charge type your model does not know exists, and finding it is today's work.",
  reflection: "What was the largest single line you had to move into the unattributable bucket, and why was it there?",
  recall: {
    q: "Why is a cloud invoice not a cost model, and what reconciliation proves your allocation is complete?",
    a: "The invoice is grouped by the provider's billing constructs, not by tenant, team or product, so nothing on it is attributable until you define a mapping. Every per-tenant figure is a claim about that mapping.\n\nCompleteness is proved by making directly attributable, shared but allocable and unattributable spend sum to the invoice total. Anything that does not reconcile is a charge type the model silently ignores."
  },
  deepDive: "Here is the service and charge type breakdown of my bill; help me sort every line into directly attributable, shared but allocable, or unattributable, and tell me what driver each shared line would need."
},
{
  id: "cogs-tag-taxonomy",
  track: "cogs", level: "decide",
  title: "A tag taxonomy is negotiated before it is designed",
  source: "FinOps Foundation, FinOps Framework Allocation capability; Storment and Fuller, Cloud FinOps, tagging and metadata chapter",
  idea: "The hard part of tagging is agreeing whose budget owns a resource, which is a political decision that happens to have a technical artefact as its output.",
  why: "Choosing tag keys looks like schema design and is actually budget arbitration. A shared Kafka cluster used by four product teams has one cost-centre tag and four candidate owners. Whoever gets named absorbs the spend into their budget and answers for it at review. The engineering work downstream, tag policies, module defaults, enforcement in CI, is straightforward and cheap. The agreement is the expensive part, and it cannot be delegated to the person writing the Terraform.\n\nTagging also has an asymmetry that makes delay costly. Tags are set at resource creation and are rarely backfilled, so every month you run without an agreed taxonomy adds resources whose ownership will have to be reconstructed later by someone reading Git history. That is why the correct sequence is to settle ownership for the top spend first, enforce it on new resources immediately, and treat the untagged tail as debt with a named owner rather than as a cleanup task that will happen someday.",
  failureMode: "A platform team ships a beautiful nine-key tag standard with no prior agreement on cost centres. Six months later, adoption is high on their own resources and near zero everywhere else, and the shared cluster carries the platform team's cost centre because they created it. The platform budget absorbed four teams' spend by default and nobody made that decision.",
  experiment: "List your ten largest resources or resource groups by monthly spend. Next to each, write the owning team from memory, without looking at any tag. Count how many you can name confidently, how many you guessed, and how many are genuinely contested between two teams. Take the contested ones to those owners this week and get a written decision on the cost centre before you touch any tag policy.",
  reflection: "Which resource was contested, and did the argument turn out to be about cost or about who controls the roadmap for it?",
  recall: {
    q: "Why does a tag taxonomy fail as a purely technical project?",
    a: "Because each tag key encodes a decision about whose budget owns a resource, and shared resources have several plausible owners. The schema cannot be finalised until those owners agree, and no amount of enforcement tooling substitutes for the agreement.\n\nDelay compounds because tags are applied at creation and rarely backfilled, so untagged resources accumulate as permanent allocation debt."
  },
  deepDive: "Help me draft the smallest tag taxonomy that would let me allocate 80 per cent of my spend, and script the ownership conversation I need to have for the shared resources."
},
{
  id: "cogs-shared-cost-rule",
  track: "cogs", level: "model",
  title: "Shared cost needs an allocation rule you can defend in a room",
  source: "FinOps Foundation, Allocation guidance on even split, proportional and fixed-rate shared cost methods",
  idea: "Shared infrastructure gets allocated by even split, proportional to a usage driver, or at a fixed rate, and the choice changes which of your tenants looks unprofitable.",
  why: "Even split divides shared cost equally across consumers. It is simple, it survives audit, and it makes your smallest tenants look catastrophic because a trial account carries the same share of the control plane as your largest enterprise. Proportional allocation spreads cost by a usage driver such as compute hours, storage or request count. It tracks reality better but only if the driver is causally related to the shared cost, and picking a driver is where most of the argument lives. Fixed-rate allocation charges a rate agreed in advance per unit, so consumers get a predictable number and the shared pool absorbs the variance.\n\nThe point of computing all three is that it converts an argument about fairness into a table. Once people can see that their per-tenant cost moves by a factor of four depending on the method, the conversation stops being about whether the platform team is padding its numbers and starts being about which driver best describes what actually consumes the control plane.",
  failureMode: "Per-tenant cost is reported with shared control plane spend split evenly. Sales sees that every tenant on the entry tier is gross margin negative and starts arguing to kill the tier. The tier was fine; the allocation method assigned a full share of fixed control plane cost to accounts that consume almost none of it.",
  experiment: "Take one month of shared control plane cost. Allocate it three ways: even split across tenants, proportional to your best usage driver, and at a fixed rate per tenant that you set. Compute the resulting total cost for your smallest tenant and your largest tenant under each method. That is six numbers. Take the table to whoever owns tenant profitability and let them pick the method with the numbers in front of them.",
  reflection: "Which method did the room pick, and was the reason stated a causal one or a political one?",
  recall: {
    q: "Name the three published shared cost allocation methods and the failure each one produces.",
    a: "Even split, which overcharges small consumers because it ignores usage. Proportional to a driver, which is only as good as the causal link between the driver and the shared cost. Fixed rate, which gives consumers predictability but leaves the shared pool carrying all the variance.\n\nComputing all three for your own shared spend turns a fairness argument into a table people can point at."
  },
  deepDive: "Here is my shared control plane spend and my tenant usage table; compute per-tenant cost under even split, proportional and fixed rate, and tell me which driver has the strongest causal claim."
},
{
  id: "cogs-unallocated-percentage",
  track: "cogs", level: "model",
  title: "Unallocated cost percentage is the honest measure of your cost data",
  source: "FinOps Foundation, FinOps Framework Allocation capability maturity criteria",
  idea: "Report the share of spend you cannot attribute before you report any per-tenant number, because that share is the error bar on everything downstream.",
  why: "Allocation coverage bounds the precision of every unit cost you quote. If a quarter of spend is unattributable, then a claim that tenant A costs twice tenant B is a claim about the three quarters you can see, and the missing quarter is not randomly distributed. Untagged resources cluster in old accounts, in manually created infrastructure and in shared services, which are exactly the places a per-tenant model is weakest. The FinOps Framework treats allocation coverage as the maturity signal for the capability for this reason.\n\nStating the number first also changes how the room reads your work. Leading with \"88 per cent of spend is allocated, here is per-tenant cost\" reads as someone who knows the limits of their model. Producing a confident per-tenant chart and then admitting under questioning that a fifth of the bill is missing reads as someone who was hoping nobody would ask, and it costs you the rest of the meeting.",
  failureMode: "A margin review concludes that the enterprise tier subsidises everyone else. Nobody had asked what share of spend was allocated. It was 62 per cent, the unallocated remainder was almost entirely the shared data plane the enterprise tenants dominate, and the conclusion reversed once it was mapped.",
  experiment: "Compute unallocated spend divided by total spend for last month, using whatever your allocation model already produces. Then compute it for the two months before that so you have a trend. Put the current figure as a single line at the top of your next cost deck, before any per-tenant number appears.",
  reflection: "What is your unallocated percentage, and is the trend moving because you improved tagging or because spend moved into places you already tag?",
  recall: {
    q: "Why does unallocated cost percentage belong at the top of a per-tenant margin report?",
    a: "Because it bounds the credibility of every number below it. Unattributable spend is not randomly distributed; it concentrates in shared services and legacy accounts, which is where per-tenant models are already weakest.\n\nStating it first also signals that you know your model's limits, rather than conceding them under questioning after the conclusions have been presented."
  },
  deepDive: "Help me compute allocation coverage from my cost export and break the unallocated remainder down by service so I know where the tagging debt actually is."
},
{
  id: "cogs-denominator",
  track: "cogs", level: "model",
  title: "Unit cost needs a denominator a customer would recognise",
  source: "FinOps Foundation, Unit Economics capability; Storment and Fuller, Cloud FinOps, unit economics chapter",
  idea: "The right denominator for unit cost is the unit your contract quotes a price in, because gross margin per unit is only computable when cost and price share a denominator.",
  why: "Cost per tenant, cost per workflow run and cost per gigabyte ingested are three different metrics that tell three different stories, and all of them are true. What decides which one you report is not which is easiest to compute from the bill; it is which one the price is quoted in. If you sell per seat and measure cost per run, then answering whether a customer is profitable requires a runs-per-seat conversion that changes with customer behaviour, and the answer moves for reasons that have nothing to do with your infrastructure.\n\nKeep the other denominators as engineering diagnostics. Cost per run is the right metric for judging whether an optimisation worked, because it isolates the thing you changed. It is the wrong metric for a margin conversation, because nobody in that room buys runs. Reporting the engineering denominator to a commercial audience is the most common way a genuinely good efficiency result fails to land.",
  failureMode: "A team halves cost per workflow run and presents it as a margin improvement. Revenue is priced per connected data source, and the tenants who benefited were the heavy-run ones already on flat-rate contracts, so gross margin barely moved. The optimisation was real; the denominator made it unreportable.",
  experiment: "Write down the unit your standard contract prices in, in the exact words the order form uses. Then compute your cost in that same unit for last month: total allocated cost divided by total units of that thing delivered. If you cannot compute it, name the specific join key you are missing, for example a mapping from contract entitlement to a metered usage record, and who owns the table it lives in.",
  reflection: "Did your priced unit and your measured unit match, and if not, what conversion ratio sits between them and how stable is it?",
  recall: {
    q: "You can compute cost per tenant, per run and per gigabyte. Which do you report to a commercial audience and why?",
    a: "The one that matches the unit the contract prices in, because gross margin per unit only exists when cost and price share a denominator. Any other denominator requires a conversion ratio that moves with customer behaviour.\n\nThe engineering denominators stay as diagnostics. Cost per run is the right way to judge an optimisation and the wrong way to argue margin."
  },
  deepDive: "My contract prices in one unit and my telemetry measures another; help me work out the conversion, how stable it is across tenants, and what I would need to instrument to price and measure in the same unit."
},
{
  id: "cogs-commitment-duration-bet",
  track: "cogs", level: "model",
  title: "Committed use discounts are a duration bet, not a discount",
  source: "AWS Savings Plans and Reserved Instances documentation; Google Cloud committed use discounts documentation; Storment and Fuller, Cloud FinOps, rate optimization chapter",
  cheat: "Break-even utilisation on a commitment is 1 minus the discount; count how many of the last twelve months fall below it.",
  idea: "A commitment exchanges a rate discount for an obligation to pay for a fixed term regardless of usage, so price it as an instrument with a break-even and a downside rather than as free money.",
  why: "There is a clean identity here. If the commitment gives you a discount of d against on-demand, and you commit to quantity Qc but only consume Qu, the commitment beats on-demand exactly when Qu divided by Qc exceeds 1 minus d. That is your break-even utilisation, and it is computable the moment the provider tells you the discount for the term and payment option you are considering. Read the discount off the provider's own pricing page for your term rather than assuming a number.\n\nWhat you are buying with that discount is term risk. Demand can fall, a tenant can churn, a rearchitecture can move you off the instance family or the service entirely, and a provider migration or a region change can strand the commitment. Longer terms carry larger discounts precisely because they carry more of this risk. The right analysis is not \"can we afford the commitment\" but \"what is the probability-weighted cost of the scenarios where we do not use it\", and the engineering roadmap is the best evidence anyone has about those scenarios. That evidence lives with you, not with finance, which is why you should be in the meeting.",
  failureMode: "Finance buys a three year commitment on a compute family in month one of a two year plan to move that workload to a managed service. The migration lands, the commitment keeps billing, and the saved engineering cost is offset by stranded capacity for eighteen months. Nobody was wrong individually; the roadmap and the purchase never met.",
  experiment: "Get the discount percentage the provider publishes for the term and payment option you are being offered. Compute break-even utilisation as one minus that discount. Then pull the last twelve months of your baseline usage for the resource in question and count how many months fell below that break-even line. Write down the number of months and take it to whoever signs the commitment.",
  reflection: "How many of the last twelve months would have failed the break-even test, and what on your roadmap could push a future month below it?",
  recall: {
    q: "State the break-even condition for a committed use discount and say what you are actually buying.",
    a: "With a discount d and a committed quantity Qc, the commitment beats on-demand when consumed quantity Qu divided by Qc is greater than 1 minus d. Below that utilisation you have paid more than on-demand would have cost.\n\nWhat you buy is a rate discount in exchange for term risk: churn, demand decline, rearchitecture or migration can all strand the commitment, and the engineering roadmap is the best available evidence on those scenarios."
  },
  deepDive: "Here is the commitment I am being offered and my last twelve months of baseline usage; compute the break-even utilisation, show the months that fail it, and help me put a number on the roadmap scenarios that would strand it."
},
{
  id: "cogs-coverage-and-utilisation",
  track: "cogs", level: "model",
  title: "Commitment coverage and commitment utilisation are two different ratios",
  source: "FinOps Foundation, FinOps Framework Rate Optimization capability",
  idea: "Coverage is the share of eligible spend running under a commitment and utilisation is the share of purchased commitment actually consumed, and you have to track both because they fail in opposite directions.",
  why: "Low coverage means eligible workloads are still paying on-demand rates, so you are leaving a discount on the table. The fix is to buy more. Low utilisation means you bought commitment you are not consuming, so you are paying for capacity that produced nothing. The fix is to buy less, or to move workloads onto the committed family. Optimise one ratio alone and you reliably break the other: a coverage target with no utilisation target is an instruction to overbuy.\n\nThe reason this catches people is that the two metrics can look fine at the portfolio level while one region or instance family is badly wrong. Aggregate utilisation of 95 per cent can hide a fully unused commitment in a region you scaled down, because the rest of the estate is consuming its own commitments. Both ratios have to be cut by whatever dimension the commitment is scoped to, which is the provider's problem as much as yours.",
  failureMode: "A quarterly goal is set as \"raise commitment coverage above 80 per cent\". Coverage hits the target. Utilisation falls because the last tranche was bought against a workload that was already shrinking, and the net effect on the bill is negative. The scorecard shows green.",
  experiment: "Compute both ratios for last month from your provider's cost data, then compute them again split by the dimension your commitments are scoped to, such as region or instance family. Find the worst cell. Put both numbers on the same chart with the target range for each, and take any cell below 90 per cent utilisation to whoever owns that workload.",
  reflection: "Which of the two ratios were you already tracking, and what did the split by scope show that the aggregate hid?",
  recall: {
    q: "Define commitment coverage and commitment utilisation, and explain why optimising one alone is dangerous.",
    a: "Coverage is the proportion of eligible usage or spend that runs under a commitment rather than on-demand. Utilisation is the proportion of the commitment you purchased that is actually consumed.\n\nPushing coverage up without watching utilisation is an instruction to overbuy, and aggregate utilisation can hide a fully stranded commitment in one region or family, so both must be cut by the scope the commitment applies to."
  },
  deepDive: "Help me build a monthly report that shows commitment coverage and utilisation side by side, split by the scope my commitments apply to, and flags any cell where one is high and the other is low."
},
{
  id: "cogs-egress",
  track: "cogs", level: "model",
  title: "Egress pricing makes the network topology decision for you",
  source: "AWS EC2 and S3 data transfer pricing documentation; Wang and Casado, The Cost of Cloud, a Trillion Dollar Paradox",
  idea: "Data transfer is priced asymmetrically and by direction and boundary, so the network topology that is cheapest is decided by the pricing page rather than by the architecture diagram.",
  why: "Ingress into the cloud is typically free while egress to the internet is charged in tiers. Traffic between availability zones is charged, and for many services it is charged on both sides, so a chatty cross-zone service pays twice for the same bytes. Cross-region replication is charged again at a different rate. None of this is visible in a topology diagram, which is why a design review can approve an architecture that is correct, resilient and quietly expensive.\n\nThe product consequence is what makes this a margin item rather than an infrastructure item. A feature that lets a customer export their full dataset, a webhook that ships every event to a customer endpoint, a multi-region read replica sold as an availability feature: each of those is a per-tenant egress rate attached to a product decision. Once you can attribute egress per tenant, you can tell which behaviours are expensive, and that is the input to whether the feature gets metered, capped, or priced.",
  failureMode: "A support tool that exports full tenant datasets is used enthusiastically by three of the largest accounts. Egress becomes a top-five line on the bill. Because the charge is booked against the service account rather than the tenant, nobody connects it to the feature, and the cost is treated as a mysterious infrastructure growth for two quarters.",
  experiment: "Pull the data transfer line items from last month's bill and group by usage type, so internet egress, cross-zone and cross-region are separate totals. Attribute each to a tenant wherever the resource is tagged. Then name the specific product behaviour driving the top three usage types. Checkable output: three usage types, three dollar figures, three named features.",
  reflection: "Which product behaviour turned out to be your most expensive per byte, and is it priced, metered or free?",
  recall: {
    q: "Why is data transfer a product decision rather than an infrastructure one?",
    a: "Because egress charges are driven by product behaviours: exports, webhooks, cross-region replicas sold as availability. The pricing is asymmetric and boundary-dependent, with internet egress tiered, cross-zone traffic often charged on both sides and cross-region charged separately.\n\nOnce egress is attributed per tenant you can see which feature is generating it, which turns it into a question about metering, capping or pricing rather than about the network."
  },
  deepDive: "Here are my data transfer line items by usage type; help me map each one to the product behaviour causing it and estimate per-tenant egress for my five largest accounts."
},
{
  id: "cogs-storage-lifecycle",
  track: "cogs", level: "model",
  title: "Storage tiering pays only when lifecycle rules run without a human",
  source: "AWS S3 storage classes and lifecycle configuration documentation",
  idea: "A cheaper storage class carries a retrieval charge, a minimum billable duration, a minimum billable object size and a per-object transition request cost, so tiering has to be modelled as a total rather than as a rate comparison.",
  why: "The storage rate is the number everyone compares and the smallest term in the model for many workloads. Transitioning objects costs a request charge per object, so a bucket with a hundred million small objects can spend more moving to a cheaper class than the class saves in a year. Infrequent access classes apply a minimum billable object size and a minimum billable storage duration, so small objects and short-lived objects are charged as if they were larger and older than they are. Retrieval is charged per gigabyte, so an archive that turns out to be read weekly is more expensive than the class you left. The numbers for each of these are on the provider's storage class and pricing pages, and the model needs all four terms, not just the first.\n\nThe second half is that tiering only pays if it is a lifecycle configuration rather than a project. A one-off cleanup saves money once and then the bucket regrows at the original class. A lifecycle rule applies to every object created afterwards, forever, with no human in the loop, which is the only version of this that compounds.",
  failureMode: "A team moves a log archive to a colder class and books the saving. The compliance team runs quarterly retrievals across the whole archive. Retrieval charges plus early deletion charges on objects that had not met the minimum duration exceed the storage saving, and the bill goes up in the quarter the audit runs.",
  experiment: "Take your largest bucket. Get object count and size distribution from storage inventory or an equivalent listing. Compute four terms for a proposed transition: annual storage saving, one-off transition request cost, expected retrieval charges at your actual read rate, and the effect of the minimum billable object size on your size distribution. If the transition cost alone exceeds three months of saving, the tiering is not the win. Then check whether a lifecycle rule exists or whether this was going to be a manual job.",
  reflection: "For your largest bucket, which of the four terms was largest, and did it change the answer?",
  recall: {
    q: "What four terms belong in a storage tiering model, and which one usually kills the case for small objects?",
    a: "Storage rate saving, per-object transition request cost, retrieval charges at the real read rate, and the minimum billable object size and duration of the target class.\n\nFor buckets with very many small objects, the per-object transition request cost combined with the minimum billable object size usually eliminates the saving, because both scale with object count rather than with bytes."
  },
  deepDive: "Here is the object count, size distribution and read rate for my largest bucket; model the four cost terms for a transition to a colder class and tell me the payback period."
},
{
  id: "cogs-observability-retention",
  track: "cogs", level: "decide",
  title: "Observability retention is a cost of revenue line engineers set directly",
  source: "Datadog log management indexing and retention documentation; Grafana Loki retention configuration",
  idea: "Index and retention settings are a spending decision made in a configuration file by an engineer who has never seen the invoice, so it needs an approval path like any other spend.",
  why: "The cost driver for log platforms is indexed volume multiplied by retention period, and both are configuration. In Datadog, indexes have retention periods and exclusion filters that decide what gets indexed at all, with archived logs held separately from indexed ones. In Loki, retention is set per stream through the compactor configuration. Either way, one line in a config file changes recurring monthly spend, the change ships in a normal pull request, and the effect appears on an invoice weeks later that the author never sees.\n\nThis is the cleanest example on the whole site of an architecture decision that a CFO later reports. It is also the easiest to govern, because there is a finite list of settings and each one has a dollar figure attached. The decision to make is not what the right retention is; it is who approves a retention or index change and what evidence they require. Once that path exists, the debate becomes an evidence-based one about which streams are actually queried after day seven.",
  failureMode: "Debug logging is enabled on a hot path to chase an incident, indexed at full volume with a thirty day retention, and never turned off. The incident closes in two days. The spend continues for a year, and it is invisible because it shows up as a gradual increase in a line nobody attributes to a pull request.",
  experiment: "List every index, retention period and sampling or exclusion filter across your telemetry stack, one row each. Put last month's cost next to each row using whatever cost breakdown your vendor gives you. Sort descending. Take the top row to the engineer who owns that config and ask what query they ran against data older than seven days in the last quarter.",
  reflection: "What was your single most expensive retention setting, and could its owner name a query that needed the full window?",
  recall: {
    q: "What is the cost driver for a log platform, and why does it escape normal spend control?",
    a: "Indexed volume multiplied by retention period. Both are set in configuration, changed through an ordinary pull request, and the cost lands on an invoice weeks later that the author never sees.\n\nThe fix is an approval path for retention and index changes with a stated evidence requirement, not a target retention number handed down centrally."
  },
  deepDive: "Here is my list of log indexes, retention windows and exclusion filters with monthly costs; help me design the approval rule and identify which streams have no evidence of being queried beyond a week."
},
{
  id: "cogs-anomaly-detection-time",
  track: "cogs", level: "model",
  title: "Cost anomaly management is a control, not an alert",
  source: "FinOps Foundation, FinOps Framework Anomaly Management capability",
  idea: "The loss from a cost anomaly is roughly its hourly rate multiplied by the time until someone acts, so detection time is the metric and the alert is only the mechanism.",
  why: "Cloud billing is post-paid and consumption is continuous, so an anomaly is a leak with a rate. If it costs a hundred dollars an hour, a monthly review process finds it after an average of two weeks of accrual plus the close cycle, and every one of those hours has already been incurred and is not refundable. Detect it in six hours and you have capped the loss at six hours of the rate. Nothing else about the process changes the arithmetic as much as that interval does.\n\nWhich is why the FinOps Framework treats this as a capability with time to detect and time to resolve as the measures, rather than as a dashboard. The engineering consequences follow directly: the detection has to run on daily or hourly data rather than monthly invoice data, it has to route to the team that can act rather than to a finance mailbox, and it needs a false positive rate low enough that people still read it in month three.",
  failureMode: "A misconfigured retry loop starts calling a paid third party API in a loop on a Friday. It is found during the monthly cost review nineteen days later. The engineering fix takes twenty minutes. The nineteen days are already paid.",
  experiment: "Take the last cost surprise you had. Find the first hour the spend rate deviated, from daily or hourly cost data, and the hour someone first acted. Multiply the hours between them by the hourly delta. That figure is what your current detection interval cost you once. Write it down and put it next to the cost of setting up a daily anomaly check.",
  reflection: "What was your detection interval in hours on the last anomaly, and what would have had to be true for it to be under twenty four?",
  recall: {
    q: "What is the metric for cost anomaly management, and why is a monthly cost review structurally inadequate?",
    a: "Time to detect, followed by time to resolve. The loss is the anomaly's rate multiplied by that interval, and post-paid billing means every hour of it is already incurred.\n\nA monthly review has an average detection lag of about half a month plus the close cycle, so it discovers anomalies only after they have been fully paid for. Detection has to run on daily or hourly data and route to the team that can act."
  },
  deepDive: "Help me design a daily cost anomaly check for my accounts that has a low enough false positive rate to survive three months, and work out what threshold to set from my own spend variance."
},
{
  id: "cogs-support-and-marketplace-fees",
  track: "cogs", level: "read",
  title: "Support plans and marketplace fees are cost of revenue you did not budget",
  source: "AWS Support plan pricing documentation; AWS Marketplace seller terms on listing fees",
  idea: "Percentage-of-spend support tiers and marketplace listing fees scale automatically with the business and almost never appear in an engineering cost model.",
  why: "AWS support plans are priced as the greater of a monthly minimum and a tiered percentage of your monthly usage, so the support charge grows every time your usage does, without anyone approving an increase. It is one of the few lines on the bill that no engineering change reduces except by reducing everything else. Marketplace listing fees take a percentage of transacted revenue when a customer buys through the provider's marketplace, which is a channel cost that arrives with a deal rather than with a workload.\n\nBoth belong in a margin conversation and neither belongs to engineering, which is exactly why they go missing. Where the marketplace fee is booked is a finance policy decision and companies differ: it can sit in cost of revenue or be treated as a selling cost. Knowing which one your company does is the difference between a gross margin bridge that reconciles and one that does not, and it is a question you can answer with a single message to your finance partner.",
  failureMode: "A team models per-tenant COGS from compute, storage and transfer, and reports a gross margin that is several points above what finance reports for the same product. The gap is the support plan percentage and the marketplace fee on the deals that closed through the marketplace. The team's model was internally consistent and did not reconcile to the P and L.",
  experiment: "Find the support charge line on last month's bill and express it as a percentage of that month's usage spend. Then send one message to your finance business partner asking two things: which P and L line marketplace listing fees are booked to, and what those fees totalled last quarter. Add both to your cost model and re-run your per-tenant number.",
  reflection: "By how many points did your per-tenant margin move once support and marketplace fees were in the model?",
  recall: {
    q: "Name two cost of revenue items that scale with the business without anyone approving them, and say who owns the classification question.",
    a: "Provider support plans, priced as the greater of a minimum and a percentage of monthly usage, and marketplace listing fees taken as a percentage of transacted revenue.\n\nWhere marketplace fees are booked, cost of revenue or selling cost, is a finance policy decision that varies by company. Your finance business partner owns it and can answer in one message."
  },
  deepDive: "Help me add provider support charges and marketplace fees to my per-tenant cost model and work out how much of the gap between my number and finance's number they explain."
},
{
  id: "cogs-finops-scopes",
  track: "cogs", level: "read",
  title: "Licences, data and model API spend are inside FinOps scope now",
  source: "FinOps Foundation, FinOps Framework Scopes covering public cloud, SaaS, licensing, data centre and AI",
  idea: "The FinOps Framework was extended beyond public cloud into scopes covering SaaS, licensing, data centre and AI, which means your third party usage-based spend is measurable with the same machinery as your cloud bill.",
  why: "The framework's core loop applies to any spend that is variable, usage-driven and billed after the fact. That was true of public cloud first, and it is now equally true of consumption-priced SaaS, of data platform contracts billed by credits or by volume, and of model API spend billed per token. The capabilities do not change: you still need ingestion of the billing data, allocation to a tenant or team, a unit cost with a sensible denominator, anomaly detection and rate optimisation through committed spend.\n\nFor an infrastructure product with any AI feature, this is now a first-order cost of revenue question rather than a curiosity. Model API spend is variable, it is driven by end-user behaviour rather than by provisioning, and it has commitment and rate optimisation structures of its own. If it is not in your cost model, your per-tenant margin is missing the fastest-growing variable line you have, and that is the one most likely to be asked about.",
  failureMode: "Per-tenant COGS is modelled carefully over cloud infrastructure while model API spend, billed on a corporate card against a single organisation account with no tenant attribution, grows into a material line. The first per-tenant question about the AI feature cannot be answered at all, because no request ever carried a tenant identifier.",
  experiment: "List every third party spend that scales with usage rather than with seats or with time: model APIs, data platforms, consumption-priced SaaS, per-request vendors. Put last month's figure and the unit driver next to each. Mark each one yes or no for whether you can attribute it to a tenant today. The count of noes is your gap list, ranked by dollars.",
  reflection: "Which usage-driven third party line is growing fastest, and can you attribute a single dollar of it to a tenant?",
  recall: {
    q: "Why does the FinOps machinery apply to model API and SaaS spend, and what usually breaks first?",
    a: "Because the framework's scopes now cover SaaS, licensing, data centre and AI alongside public cloud, and the same capabilities apply to any spend that is variable, usage-driven and billed in arrears.\n\nWhat breaks first is allocation. Third party API spend is typically billed against one organisation account with no tenant identifier on the request, so it cannot be attributed retrospectively at all."
  },
  deepDive: "Help me inventory my usage-based third party spend, pick a unit driver for each, and design the minimum request-level attribution I would need to allocate model API spend per tenant."
},
{
  id: "cogs-showback-before-chargeback",
  track: "cogs", level: "decide",
  title: "Showback earns the right to chargeback",
  source: "FinOps Foundation, FinOps Framework capability covering chargeback and showback; Storment and Fuller, Cloud FinOps, chargeback and showback chapter",
  idea: "Showback moves information and chargeback moves budget, so run showback until teams accept the numbers, then charge.",
  why: "Chargeback puts cost into a team's budget, which makes the allocation model a financial instrument that team is now paying for. If they cannot see the underlying detail, or cannot change the spend, or disagree with how shared cost was split, they will spend their energy attacking the model rather than reducing the cost. That is a rational response, and it is a permanent loss of trust in the cost data, which is much harder to rebuild than the pipeline that produced it.\n\nShowback has none of that leverage and all of the information. It exposes the same numbers with no budget consequence, which is what lets the arguments about the model happen while they are still cheap. The precondition list for moving to chargeback is concrete: allocation coverage high enough that the unallocated pool is not doing the arguing, a shared cost method the receiving teams have agreed to, cost visible at a cadence faster than the budget cycle, and levers the team can actually pull. Missing any one of those, run showback for another quarter.",
  failureMode: "Chargeback is switched on with 60 per cent allocation coverage and an even split of shared platform cost. The first month generates four disputes, all about the split rather than about usage. Two quarters later teams have built their own shadow cost spreadsheets, the central number is treated as political, and nobody optimises anything.",
  experiment: "Produce a showback for last month for three owning teams and send it to them with the allocation method written out in three sentences. Count the disputes and classify each one: is the team disputing your model, or disputing their own usage? You are ready for chargeback when the disputes are about usage. Until then the count of model disputes is your backlog.",
  reflection: "Of the objections you got back, how many were about the allocation method and how many were about the usage itself?",
  recall: {
    q: "What conditions have to hold before chargeback replaces showback?",
    a: "Allocation coverage high enough that the unallocated pool is not driving the argument, a shared cost method the receiving teams have agreed to, cost visible at a cadence faster than the budget cycle, and levers the receiving team can actually pull.\n\nThe practical test is the shape of the disputes. When teams argue about their usage rather than about your model, the model has been accepted and chargeback will change behaviour instead of trust."
  },
  deepDive: "Help me assemble a showback pack for three teams from my allocation data, write the three-sentence method statement, and set the criteria I will use to decide when to move to chargeback."
}
);

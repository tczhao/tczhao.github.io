/* Track: Pricing and packaging. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "pricing-wtp-before-build",
  track: "pricing", level: "read",
  title: "Design the product around willingness to pay, not the other way round",
  source: "Ramanujam and Tacke, Monetizing Innovation (Wiley, 2016), chapters 1 to 3",
  idea: "Pricing is a product design input, and deciding it after the build is a forecast of failure with named, documented failure types.",
  why: "The book opens with a Simon-Kucher survey of roughly 1,600 companies, in which the large majority of new products failed to hit their revenue and profit expectations. Read the introduction for the exact figure and the exact n before you quote it. The argument from that data is mechanical rather than moral: by the time you price, the engineering cost is sunk, so pricing can only ration demand for a thing that already exists. Every degree of freedom that mattered - what the thing does, who it is for, what it withholds - was spent before anyone asked what a customer would pay.\n\nThe book sorts the failures into four types, and the taxonomy is the useful part because each has a different cause. Feature shocks are overbuilt: too many features, too much cost, no willingness to pay for most of it. Minivations are underbuilt or underpriced: the right product monetised at a fraction of its value. Hidden gems are real value the organisation never brought to market because it sat outside the core. Undead are products customers never wanted and the company shipped anyway. Note that two of the four are pricing failures on a good product, not product failures.",
  failureMode: "Per-tenant isolation gets built as a compliance checkbox, lands in the base tier, and then shows up as a permanent line in your cloud bill with no matching line in ARR. The engineering cost is real and recurring, the willingness to pay was never measured, and now the price cannot be raised because the capability is already the baseline everyone has.",
  experiment: "Take the three largest items on your team's roadmap this quarter. For each, write the sentence 'a customer would pay more for this' and name the specific customer conversation, win/loss note or pricing test that supports it. Count how many of the three you can attribute to something outside your own building. The output is a number between zero and three.",
  reflection: "Which roadmap item survived attribution, and which one is a feature shock you have already funded?",
  recall: {
    q: "Name the four new-product failure types in Monetizing Innovation and say which two are pricing failures rather than product failures.",
    a: "Feature shocks (overbuilt, too much cost, no willingness to pay for most of it), minivations (right product, monetised far below its value), hidden gems (real value never brought to market), and undead (products customers never wanted).\n\nMinivations and hidden gems are pricing and commercialisation failures on products that were fine. That is why the book insists the willingness-to-pay conversation happens before the build, not after it."
  },
  deepDive: "Here are my top three roadmap items and what I actually know about customer willingness to pay for each - help me classify them against the four failure types and tell me which one I should stop."
},
{
  id: "pricing-value-metric",
  track: "pricing", level: "decide",
  title: "The value metric is the single most consequential pricing choice",
  source: "Ramanujam and Tacke, Monetizing Innovation, chapter on choosing the monetisation model",
  idea: "The unit you charge per determines how revenue expands, how forecastable it is, and which engineering work creates revenue rather than only cost.",
  why: "The book's claim is that how you charge matters more than how much. The unit is what compounds. Price per unit can be renegotiated once a year; the unit itself is embedded in every contract, every metering table, every invoice and every customer's internal budget, and changing it is a migration programme rather than a pricing decision.\n\nFour tests for a candidate unit. One, it tracks perceived value, so the customer's bill rises when they get more out of you. Two, the customer can predict it before they commit, or they will cap it. Three, you can meter it accurately and defend the number in a billing dispute. Four, and this is the one engineering owns, it correlates with your own marginal cost, so gross margin per unit is stable instead of a function of which tenant you happened to sign.",
  failureMode: "Charging per connector when your cost is driven by rows scanned. A tenant with two connectors and a billion rows a day destroys the margin, and the account team cannot expand the account because the connector count is still two. The revenue curve and the cost curve are attached to different variables, so margin drifts with customer mix and nobody can explain the drift.",
  experiment: "List the three or four plausible units for your service. For each, pull last month's per-tenant totals for that unit and last month's allocated infra cost per tenant, and compute the correlation across your tenants. You have both series already: the unit counts are in your own telemetry and the cost allocation is whatever you use to split the cloud bill. Rank the candidates by correlation. The winner on that test is not automatically the right unit, but a unit with weak correlation to your cost is a margin problem you are choosing.",
  reflection: "Which candidate unit correlated best with your cost, and is it the unit you currently charge on?",
  recall: {
    q: "What are the four tests a value metric has to pass, and which one is the engineering test?",
    a: "It tracks perceived value; the customer can predict it in advance; you can meter it accurately and defend it in a dispute; and it correlates with your own marginal cost.\n\nThe fourth is the engineering test. If the unit does not correlate with your cost, gross margin per unit varies by customer mix, and no pricing action fixes it because the problem is the denominator."
  },
  deepDive: "Here are my candidate value metrics and my per-tenant cost drivers - help me score each against the four tests and show the cost correlation arithmetic."
},
{
  id: "pricing-wtp-measurement",
  track: "pricing", level: "model",
  title: "Willingness to pay is measurable with published survey methods",
  source: "Peter van Westendorp, NSS Price Sensitivity Meter, ESOMAR Congress 1976; Ramanujam and Tacke, Monetizing Innovation, willingness-to-pay chapter",
  idea: "Willingness to pay has named, repeatable instruments behind it, so it is research you can run rather than an opinion you defer to the loudest person in the room.",
  why: "The van Westendorp Price Sensitivity Meter asks four questions about the same product: at what price is it so expensive you would not consider it, at what price is it expensive but you would still consider it, at what price is it a bargain, and at what price is it so cheap you would doubt the quality. Plot the four cumulative distributions and their intersections give you the point of marginal cheapness, the point of marginal expensiveness, the indifference price point and the optimal price point. It is fifty years old, it is documented, and it produces a range rather than a number, which is the honest output.\n\nMonetizing Innovation puts van Westendorp alongside conjoint analysis and MaxDiff and is explicit that these are complements to structured customer conversations, not replacements. For B2B infrastructure your population is small, so the instrument matters less than the discipline: ask the same four questions in the same order to enough people that you can see a distribution rather than an anecdote.",
  failureMode: "Price set by the loudest deal in the pipeline. One prospect says the number is too high, the number comes down, and that becomes the list price for every account forever - a sample of one, generalised to the whole book, with no record that it ever happened.",
  experiment: "Run the four van Westendorp questions, in order, against eight people who talk to customers weekly - account executives, customer success, solutions engineers - about one specific capability of yours. Write the four numbers each gives you into a sheet and plot the cumulative curves. Two possible results, both useful: you get an acceptable price range with intersection points, or you discover your own field organisation has no shared view of what the product is worth.",
  reflection: "What was the spread between your team's cheapest and most expensive answers to the same question?",
  recall: {
    q: "State the four van Westendorp questions and what the output of the method is.",
    a: "Too expensive to consider; expensive but still considerable; a bargain; so cheap you would question the quality. Each asked about the same product, then plotted as cumulative distributions.\n\nThe output is a range, not a point: intersections give the point of marginal cheapness, the point of marginal expensiveness, the indifference price point and the optimal price point."
  },
  deepDive: "I have raw van Westendorp responses from my field team - help me build the four cumulative curves and read the intersection points properly."
},
{
  id: "pricing-seat-forecastability",
  track: "pricing", level: "model",
  title: "Seat pricing forecasts well and expands badly",
  source: "GitLab Form 10-K, description of the seat-based subscription model and the Dollar-Based Net Retention Rate discussion",
  idea: "Seats decouple revenue from usage, which makes the forecast stable and caps net retention at the customer's headcount growth plus whatever you can win on price and tier.",
  why: "Read GitLab's 10-K for the mechanics: subscriptions sold per user per period across tiers, with the retention metric reported as Dollar-Based Net Retention Rate. GitLab also meters some things - compute minutes and storage - so read the revenue recognition note carefully rather than assuming pure seats. Under a seat model, revenue for an account is contracted seats times price. That is a low-variance forecast: you know it a year out, you can bill it in advance, and it does not move when a customer's workload spikes.\n\nThe same property caps expansion. Net revenue retention under seats decomposes into three terms only: seat growth at the account, price uplift at renewal, and tier upgrade. If your customers' headcount is flat, two of the three levers require a negotiation. And because revenue does not move with usage while your cost does, seat pricing quietly runs a cross-subsidy: light tenants fund heavy ones, and nobody notices until the heavy ones are the ones renewing.",
  failureMode: "The largest logo on the platform bought 400 seats two years ago, has since put its highest-volume pipelines on you, and now consumes several times the infrastructure of an equivalent-seat account. Revenue has not moved. It shows up as a gross margin decline that finance attributes to 'cloud costs' and engineering attributes to 'growth'.",
  experiment: "For your top ten tenants, compute allocated monthly infra cost divided by contracted seats. Seat counts come from RevOps or the billing system - name whoever owns the contracted-seat field. Rank the ten by cost per seat and take the ratio of highest to lowest. That ratio is the size of the cross-subsidy your pricing model is running.",
  reflection: "What was the ratio between your most and least expensive tenant per seat, and does your pricing have any mechanism that responds to it?",
  recall: {
    q: "Under pure seat pricing, what are the only three ways an existing account's revenue can grow?",
    a: "More seats at the account, a price uplift at renewal, and an upgrade to a higher tier. Nothing the customer does with the product between renewals moves revenue.\n\nCost, meanwhile, does move with usage. So seat pricing produces stable revenue and unstable gross margin, and the instability is invisible until you allocate cost per tenant."
  },
  deepDive: "Here are my per-tenant seat counts and allocated costs - help me quantify the cross-subsidy and work out what a usage fence would need to look like to bound it."
},
{
  id: "pricing-consumption-revenue-function",
  track: "pricing", level: "read",
  title: "Consumption pricing makes the infrastructure team a revenue function",
  source: "Snowflake Form 10-K, consumption-based revenue model and capacity arrangements in Item 7 MD and A, plus the revenue recognition note",
  idea: "When revenue is recognised as customers consume metered compute, platform availability and capacity stop being cost-avoidance arguments and become revenue arguments.",
  why: "Snowflake's filing is the clearest public description of the model. Customers buy capacity, capacity is drawn down as credits are consumed, and revenue is recognised on consumption rather than on the contract signature. Find the capacity arrangements discussion in Item 7 and the corresponding revenue recognition policy in the notes. The consequence to internalise is that unconsumed capacity sits in deferred revenue and remaining performance obligations, not in revenue. A signed contract is not revenue until the platform does work.\n\nThat inverts the funding argument for your team. Under seat pricing, an availability investment is a churn-risk argument: hypothetical, deferred, and easy for finance to discount. Under consumption pricing it is arithmetic on the current run rate. An hour of unavailability is an hour of metered units not consumed, and a latency improvement that lets a customer run more workload in a window is directly revenue-bearing. Same engineering work, a completely different sentence in the funding conversation.",
  failureMode: "A platform team on a consumption-priced product still writing reliability business cases in terms of SLO breach and support ticket volume. Finance has no way to convert that into dollars, so the request competes badly against a feature with a revenue number attached, even though the reliability work has a better one available.",
  experiment: "Open Snowflake's most recent 10-K and read the consumption and capacity arrangements paragraphs in Item 7 until you can restate in one sentence when revenue is recognised. Then, for your own service: if you are metered, compute revenue per hour at current run rate and multiply by your last twelve months of unavailability. If you are not metered, write 'not applicable' and one sentence on what argument you have to use instead.",
  reflection: "What did your last twelve months of downtime cost in metered revenue, and had anyone computed that before?",
  recall: {
    q: "Under a consumption model, what happens to a large signed contract that the customer has not yet used?",
    a: "It sits as deferred revenue and remaining performance obligation, not revenue. Revenue is recognised as the customer consumes, so the platform doing work is the revenue-triggering event.\n\nThat is what makes the infrastructure team a revenue function: availability and throughput move the recognition rate directly, not through a churn-probability argument."
  },
  deepDive: "Help me convert my team's reliability and capacity roadmap into revenue-run-rate arithmetic using my metered unit and current consumption."
},
{
  id: "pricing-hybrid-platform-fee",
  track: "pricing", level: "model",
  title: "Hybrid pricing buys forecastability back with a platform fee",
  source: "Confluent Form 10-K, Confluent Cloud consumption and committed contract discussion; Datadog published pricing documentation, per-host commitment plus on-demand usage",
  idea: "A fixed platform fee plus a metered rate splits revenue variance between you and the customer, and the fixed half should be sized to your fixed cost per tenant.",
  why: "Confluent's 10-K describes both a subscription product and a consumption cloud product with committed spend contracts, which is the hybrid in its commercial form. Datadog's published pricing is the same shape at product level: a committed per-host rate plus on-demand pricing for usage above it, with separate metered lines for logs, custom metrics and spans. Read both and notice that the fixed component is never zero.\n\nModel it as revenue equals F plus p times Q. F is the platform fee, p the price per unit, Q the volume. Your cost has the same shape: a fixed cost per tenant that exists the moment they are provisioned - control plane, isolation boundary, minimum storage footprint, baseline support - plus a marginal cost per unit. The honest sizing rule is that F covers the fixed cost per tenant and p covers marginal cost plus target margin. When F is below your fixed cost per tenant, every low-usage account loses money and your margin depends on customers being busy.",
  failureMode: "A consumption-only price with a real per-tenant fixed cost underneath it. A hundred small tenants each running a fraction of the volume needed to cover their own control plane, and a gross margin that only works because a handful of heavy accounts subsidise the rest. It looks like a great logo count right up until the heavy accounts renegotiate.",
  experiment: "Split last month's allocated cost for one representative tenant into two buckets: the part that exists whether or not they run anything (control plane share, always-on infrastructure, minimum storage, allocated support), and the part that scales with their usage. Divide the fixed bucket by tenant count. That number is the floor for a platform fee, and if you have no platform fee, it is the amount of margin you are giving away per tenant per month.",
  reflection: "What is your fixed cost per tenant per month, and what does your smallest account pay against it?",
  recall: {
    q: "In the revenue model F plus p times Q, what should F be sized against, and why is that not arbitrary?",
    a: "F should cover the fixed cost of having a tenant at all: control plane share, isolation boundary, minimum footprint, baseline support - the cost that exists at zero usage.\n\nIf F is below that, every low-usage tenant is gross margin negative and the blended margin only holds while heavy accounts subsidise them. p then covers marginal cost plus target margin on the variable half."
  },
  deepDive: "Help me split my per-tenant cost into fixed and marginal components from my cloud bill and tenant counts, then size a platform fee against the fixed half."
},
{
  id: "pricing-efficiency-cuts-revenue",
  track: "pricing", level: "decide",
  title: "Under consumption pricing an efficiency win can reduce revenue",
  source: "Snowflake Form 10-K, Item 1A risk factors - search the risk factors for the discussion of product performance and efficiency improvements affecting customer consumption",
  cheat: "Before shipping an efficiency win on a metered resource, decide with revenue whether to reprice the unit or pass it through.",
  idea: "When you meter on the resource you are optimising, shipping the optimisation transfers the saving to the customer's bill unless you deliberately change the price per unit.",
  why: "This is disclosed. Snowflake's risk factors include the point that improvements which make the platform more efficient can reduce the credits customers consume and therefore reduce revenue. Go and find the paragraph yourself - a public company telling its shareholders that making the product faster can lower revenue is a stronger artefact for a roadmap conversation than any framework.\n\nTwo effects with different time constants. Immediately, the same workload consumes fewer metered units, so revenue for that workload falls in proportion. Over a longer horizon, a cheaper unit price for the customer can induce more workload, and if demand is elastic enough the volume recovers the revenue. You cannot assume the second one. The decision to make before the work starts is which side of the meter the saving lands on: keep it as margin by holding the customer's bill flat and repricing the unit, or pass it through as a bill reduction and buy elasticity. Both are defensible. Discovering it in the quarterly revenue review is not.",
  failureMode: "The platform team ships a forty per cent compute reduction, presents it as a cost win, and in the same quarter finance sees consumption revenue soften on the affected workloads. The team gets asked why they shipped it. The answer - that nobody asked which side of the meter the saving would land on - is a process failure, not an engineering one.",
  experiment: "Take your largest planned efficiency project. Compute the annualised infrastructure saving. Then, if the resource you are optimising is the metered unit, compute the annualised reduction in metered units at current customer behaviour and multiply by your effective price per unit. Put both numbers on one line, with signs, and send it to whoever owns the revenue forecast before the work starts.",
  reflection: "For your biggest efficiency project, what is the net of the cost saving and the revenue reduction, and who signed off on it?",
  recall: {
    q: "Why can an efficiency improvement reduce revenue under consumption pricing, and what is the decision that has to be made before the work ships?",
    a: "Because revenue is metered on the resource being optimised, so the same customer workload consumes fewer billable units. The saving lands on the customer's invoice by default.\n\nThe decision is which side of the meter it lands on: reprice the unit and keep the saving as margin, or pass it through and bet on demand elasticity to recover volume. Snowflake discloses this conflict in its risk factors."
  },
  deepDive: "Here is my efficiency project and my metered unit - help me compute the cost saving against the revenue reduction and frame the reprice-or-pass-through decision."
},
{
  id: "pricing-fences",
  track: "pricing", level: "model",
  title: "Price fences segment customers without publishing a discount",
  source: "Ramanujam and Tacke, Monetizing Innovation, chapter on segmentation and differential pricing; Nagle and Muller, The Strategy and Tactics of Pricing, on segmented pricing and fences",
  idea: "A fence is an enforceable condition that qualifies a customer for a price, which is how one product serves two willingness-to-pay populations without moving the reference price for either.",
  why: "The mechanism is qualification. A published discount says the product is worth less. A fence says the product is worth the same and this buyer qualifies for a different price because of something observable about them or about what they are buying. Fences come in a few families: customer attributes such as non-profit or company size, product attributes such as SLA, region, feature set or isolation model, transaction attributes such as annual commitment, contract term or payment timing, and volume tiers.\n\nThe engineering constraint is the one that gets skipped. A fence has to be enforceable in code or in contract, and it has to be observable so you can tell when someone crosses it. A fence you cannot enforce is an honour system, and honour systems in pricing erode in exactly one direction. Before you agree to a fence in a pricing meeting, ask where it lives: an entitlement flag, a metering rule, a contractual clause with an audit right, or nowhere.",
  failureMode: "Startup pricing with no revenue or headcount test attached. Two years later it covers a well-funded company running production workload at a fraction of list, and there is no defined event that ends the discount, because 'startup' was never encoded as a checkable condition.",
  experiment: "List every distinct price your product is currently sold at, including every negotiated one. Beside each, name the fence that qualifies a buyer for it and the exact place it is enforced: entitlement flag, metering rule, contract clause, or nothing. Count the rows where the answer is nothing. That count is the number of prices that will leak.",
  reflection: "How many of your prices have no enforceable fence behind them, and which one leaks fastest?",
  recall: {
    q: "What distinguishes a price fence from a discount, and what is the engineering test for a valid fence?",
    a: "A discount lowers the price of the same offer to the same buyer, which resets their reference price. A fence sets a condition - buyer attribute, product attribute, transaction attribute, or volume - under which a different price applies, so the list price is unaffected.\n\nThe engineering test is enforceability and observability: it must live in an entitlement flag, a metering rule or a contract clause with an audit right. A fence enforced nowhere is an honour system."
  },
  deepDive: "Here is the list of prices we currently sell at - help me identify which are fenced, which are just discounts wearing a fence's name, and what each unenforced one would need to become real."
},
{
  id: "pricing-packaging",
  track: "pricing", level: "model",
  title: "Packaging is a separate decision from pricing",
  source: "Ramanujam and Tacke, Monetizing Innovation, chapter on bundling and good-better-best configuration",
  idea: "Which features sit in which tier determines whether the price points hold, and it is a product decision that has to be made outside-in from segments rather than inside-out from the feature list.",
  why: "The book's classification is the tool. Leaders are the features with high perceived value that drive the purchase decision. Fillers are low-importance features, cheap to include, that pad a tier without moving anyone. Killers are features whose presence or pricing destroys the deal - either they anger buyers when charged for, or they collapse the reason to buy a higher tier by appearing in a lower one. Build the tiers outside-in from what each segment values, and the price points hold. Build them inside-out by sorting the feature list by build cost, and you end up with tiers that no segment maps onto.\n\nFor an infrastructure product the tier boundary is entitlement code, so every packaging change is a migration with a test matrix. That gives engineering a real seat in the packaging conversation and an obligation to use it: the cheapest time to argue that a capability cannot be cleanly gated is before the tier is published.",
  failureMode: "Audit logging placed in the top tier by cost logic rather than segment logic. Every regulated buyer now has to buy the top tier. That is either excellent segmentation or a systematic loss of the mid-market, and which one it is was never decided - it fell out of a spreadsheet sorted by build cost.",
  experiment: "Write out what is in each of your tiers. Classify every item as leader, filler or killer using your own win/loss notes rather than intuition. Then cross-reference against cost: count the features that sit in your lowest paid tier, are expensive to serve, and are not leaders. Each one is a cost you are carrying that is not winning you the deal.",
  reflection: "Which expensive non-leader is sitting in your base tier, and what would happen if it moved up?",
  recall: {
    q: "What are leaders, fillers and killers, and what is the difference between outside-in and inside-out packaging?",
    a: "Leaders drive the purchase decision. Fillers are cheap, low-importance additions that pad a tier. Killers destroy value if placed or priced wrongly, either by angering buyers or by removing the reason to upgrade.\n\nOutside-in builds tiers from what each segment values. Inside-out sorts the feature list by build cost or engineering convenience and hopes segments map onto the result. Only the first makes the price points hold."
  },
  deepDive: "Here are my tiers and my per-feature serving costs - help me classify each feature as leader, filler or killer and find the expensive non-leaders sitting in the wrong tier."
},
{
  id: "pricing-discount-permanence",
  track: "pricing", level: "read",
  title: "A discount is permanent until someone pays to remove it",
  source: "Ramanujam and Tacke, Monetizing Innovation, chapters on pricing strategy and behavioural pricing; Nagle and Muller, The Strategy and Tactics of Pricing, on reference prices",
  idea: "The first invoice sets the customer's reference price, so a first-year discount is a permanent price reduction on that account unless someone spends negotiating capital to reverse it.",
  why: "Reference price is the documented mechanism in the behavioural pricing literature: buyers evaluate a price against the last one they paid, not against your list. Renewal negotiations therefore start from the discounted number. Nobody renews from list. So the discount is not a one-year concession, it is the new base, and every subsequent uplift is computed off that base, which means the gap compounds rather than closes.\n\nUnder consumption pricing the effect is worse, because the discount attaches to the price per unit and therefore applies to every unit the customer will ever consume. A twenty-five per cent discount granted when an account was small becomes a twenty-five per cent discount on ten times the volume, and if the account is also cost-heavy, growth makes the account less profitable rather than more.",
  failureMode: "A discount granted in the last week of a quarter, recorded on the order form and nowhere in any model. Three renewals later it is the number the customer cites in every negotiation, no one on the current team knows why it was given, and removing it is framed internally as a price increase on a happy customer.",
  experiment: "Ask RevOps or your finance business partner - name the person - for effective price per unit by account, meaning contracted revenue divided by contracted units, against list. Plot the distribution of realised discount across the book. Then take the three deepest discounts and compute your allocated cost per unit for those specific accounts. Check whether any of the three is priced below your own cost.",
  reflection: "Is any account in your book priced below your cost per unit, and how long has it been that way?",
  recall: {
    q: "Why does a first-year discount cost more than the first year's revenue it gives away?",
    a: "It sets the customer's reference price. Renewals negotiate from the discounted number rather than from list, and every future uplift compounds off the lowered base, so the gap to list persists for the life of the account.\n\nUnder consumption pricing it is worse: the discount is on the unit rate, so it scales with every future unit the account consumes."
  },
  deepDive: "Here is my realised price per unit by account against list and my allocated cost per unit - help me find the accounts priced below cost and quantify the lifetime cost of the discount."
},
{
  id: "pricing-grandfathering-liability",
  track: "pricing", level: "decide",
  title: "Grandfathering is a liability carried in your codebase",
  source: "Ramanujam and Tacke, Monetizing Innovation, guidance on implementing price change and migrating existing customers",
  idea: "Every legacy plan you keep alive is a metering rule, an entitlement branch, a test matrix row and a support runbook, carried by engineering forever against revenue that is flat by construction.",
  why: "Grandfathering wins by default because its cost is invisible in the place the decision is made. In the pricing meeting, keeping ten accounts on a 2021 plan costs nothing: no churn risk, no awkward conversation, no revenue change. The cost lands in engineering, spread across every future metering change that now has to be implemented and tested twice, every billing incident that has to be diagnosed against two rule sets, and every new feature whose entitlement logic has to answer a question about a plan nobody sells.\n\nThe decision is not grandfather versus force-migrate. It is: compute the migration cost, compute the carry cost, and pick. Migration cost is a project you can estimate. Carry cost is an ongoing tax you can estimate from how often the metering code changes. Neither is hard. What is hard is that nobody computes them, so the default wins by silence.",
  failureMode: "A plan sold to eleven accounts in one quarter three years ago, still requiring its own billing code path. Every metering change since has been tested against two schemas, the accounts on it have never grown because the plan has no expansion mechanic, and the total ARR on it would not fund a week of the engineering time it has consumed.",
  experiment: "Count the distinct pricing plans your billing or metering code can currently express - grep the plan enum or the rate table. For each plan, get the active account count and total ARR from finance or RevOps, and name who owns that field. Sort by ARR. Everything below the line where ARR stops being material is pure code liability. Take that list to whoever owns pricing with the plan count and the ARR beside it.",
  reflection: "How many plans does your code support, how many carry material ARR, and what is the difference?",
  recall: {
    q: "Why does grandfathering win by default, and what two numbers turn it into an actual decision?",
    a: "Because its cost lands in engineering while the decision is made in a pricing meeting where it appears free - no churn risk, no conversation, no revenue change.\n\nThe two numbers are the one-off migration cost and the ongoing carry cost, where carry is the tax every future metering and entitlement change pays to support the extra plan. Both are estimable; the default only wins when neither is computed."
  },
  deepDive: "Here is the list of plans my metering code supports and their ARR - help me estimate carry cost per plan and build the migrate-or-carry case."
},
{
  id: "pricing-agent-predictable-unit",
  track: "pricing", level: "decide",
  title: "Usage pricing for a nondeterministic agent needs a unit the customer can predict",
  source: "Anthropic API pricing documentation, per-token input and output rates with separate cache write, cache read and batch rates; Ramanujam and Tacke, Monetizing Innovation, on value metric selection",
  idea: "If the customer cannot forecast their bill before they run the workload, they will cap usage, and the pricing model becomes an adoption brake regardless of how good the product is.",
  why: "An agent's cost per task is a distribution, not a number. Token consumption varies with how many tool calls the loop takes, how much context accumulates, how often it retries. Read the published API pricing structure and note that the same logical request has several different unit costs depending on whether tokens are fresh input, cache writes, cache reads, output, or submitted through the batch interface. Passing that structure straight through to the customer as the value metric exports your variance to someone who has no way to model it.\n\nThe alternative is to charge on a unit the customer can count before they commit - a task, a resolved ticket, a document processed, a seat with a fair-use ceiling - and absorb the distribution yourself. That is a real transfer of risk and it has a price: you now need the p95 cost per unit rather than the mean, because your margin floor has to survive the tail, and you need the ability to detect when a customer's mix shifts the distribution under you.",
  failureMode: "Metering on tokens, then shipping a genuinely better agent that plans more thoroughly and makes more tool calls per task. The customer's bill rises for the same business outcome. They read it as a price increase, and the product improvement becomes a renewal risk.",
  experiment: "Pull two hundred recent runs of one task type from your traces. Compute cost per run for each. Report mean, p50, p95 and max. Then compute the ratio of p95 to p50. If it is above three, token pass-through will produce bill shock at some customer this quarter, and your margin floor needs to be set on p95 rather than the mean.",
  reflection: "What is your p95 to p50 cost ratio per task, and can a customer predict their bill within a factor of two?",
  recall: {
    q: "What does charging on a predictable unit rather than tokens actually transfer, and what number do you then need?",
    a: "It transfers cost variance from the customer to you. The customer gets a countable, forecastable unit; you absorb the distribution of tokens, retries and tool calls behind it.\n\nYou then need the p95 cost per unit, not the mean, because the margin floor has to hold in the tail. You also need monitoring for shifts in the distribution when a customer's task mix changes."
  },
  deepDive: "Here is the cost distribution across my agent runs by task type - help me pick a customer-predictable unit and set a price that survives the p95."
},
{
  id: "pricing-bill-predictability",
  track: "pricing", level: "model",
  title: "Bill predictability is a product feature with an engineering cost",
  source: "Snowflake Form 10-K, capacity arrangements discussion; AWS Budgets and AWS Cost Anomaly Detection documentation",
  idea: "Caps, credits, alerts and commitments are metering infrastructure with latency requirements, so they belong on the roadmap as features rather than in a ticket labelled billing plumbing.",
  why: "Your customer has already been trained on what good looks like. AWS ships Budgets, Cost Anomaly Detection and Cost Explorer, all documented, and Snowflake sells capacity arrangements that let a customer commit and draw down predictably. That is the reference standard a buyer brings to your metered product, and each of those capabilities is a distinct piece of engineering: real-time usage aggregation, an enforcement point in the request path, alerting with a defined delay, and reconciliation between what you showed and what you invoiced.\n\nThe requirement that gets underestimated is latency, and there are two of them. Consumption-to-visible: how long between a unit being consumed and it appearing in the usage store the customer can see. Visible-to-enforceable: how long between that and a cap actually rejecting a request. A hard spend cap is only as hard as the second number. If it is measured in hours, you can sell an alert but you cannot sell a cap, and the difference matters the first time a runaway job runs.",
  failureMode: "Sales commits to a hard spend cap. Engineering implements it as a nightly aggregation job. A customer's runaway workload burns four days of budget in ninety minutes, the cap fires the next morning, and you are now negotiating whether to invoice for usage you told them was impossible.",
  experiment: "Measure both latencies on your own system today. Emit a known unit of usage, then time how long until it appears in the customer-visible usage view, and how long until a configured limit on it would actually block a request. Two numbers, in seconds. Write them down and check them against what your contracts and sales collateral currently promise.",
  reflection: "What are your two latency numbers, and does anything you have sold require them to be lower?",
  recall: {
    q: "What are the two latencies that determine whether you can sell a hard spend cap?",
    a: "Consumption-to-visible: the delay between a unit being consumed and it appearing in the usage data the customer can see. Visible-to-enforceable: the delay between that and a limit actually rejecting a request.\n\nThe second is what a hard cap depends on. If it is hours, you can honestly sell alerts and soft budgets, not a cap."
  },
  deepDive: "Help me design the metering path for a hard spend cap on my service, including where enforcement sits and what the reconciliation story is against the invoice."
},
{
  id: "pricing-free-tier-cogs",
  track: "pricing", level: "model",
  title: "A free tier is a cost of revenue line with a conversion rate attached",
  source: "MongoDB Form 10-K, discussion of the free tier of MongoDB Atlas in Item 1 Business and Item 7 MD and A",
  idea: "Free usage consumes real infrastructure that lands in cost of revenue, so the tier is only justified by a conversion rate you actually measure and a cost per conversion you compare to CAC.",
  why: "MongoDB's filing describes the free tier of Atlas as an acquisition mechanism and discusses conversion to paid; read Item 1 for how they frame it and Item 7 for how the economics are discussed. The point to extract is where the cost sits. Free-tier infrastructure is not a marketing expense in the accounts unless someone deliberately reclassifies it - it is consumption of the same infrastructure that serves paying customers, and it depresses reported gross margin.\n\nSo the free tier has exactly one test: total free-tier infrastructure cost divided by conversions in the same period, compared against blended customer acquisition cost. If free costs more per acquired customer than paid acquisition does, it is your most expensive channel and it is hiding in the wrong line of the P and L. The second property to watch is the shape: free-tier cost scales with cumulative signups if nothing expires or reaps idle resources, which means it grows with marketing activity rather than with revenue.",
  failureMode: "A free tier with no expiry and no idle reaping. Cost is a function of every account created since launch rather than of active users, so it compounds while the conversion numerator stays flat, and it appears in the gross margin bridge as an unexplained COGS drift.",
  experiment: "Compute total infrastructure cost attributable to free-tier tenants last month from your own cost allocation. Count conversions from free to paid in the same month. Divide to get cost per conversion. Get blended CAC from finance or RevOps - name the owner of that number - and compare. Also compute what fraction of free-tier cost is consumed by accounts with no activity in thirty days.",
  reflection: "What is your free-tier cost per conversion against CAC, and how much of the cost is dormant accounts?",
  recall: {
    q: "Where does free-tier infrastructure cost land in the accounts, and what is the single test that justifies the tier?",
    a: "In cost of revenue, alongside the infrastructure serving paying customers, so it directly depresses reported gross margin unless someone reclassifies it deliberately.\n\nThe test is free-tier cost divided by conversions in the same period, compared to blended CAC. If it is higher, it is your most expensive acquisition channel and it is booked in the wrong place."
  },
  deepDive: "Help me build the free-tier unit economics from my cost allocation and conversion counts, including the dormant-account share and the comparison to CAC."
},
{
  id: "pricing-increase-as-program",
  track: "pricing", level: "read",
  title: "Executing a price increase is an operational program, not an announcement",
  source: "Ramanujam and Tacke, Monetizing Innovation, on communicating and implementing price change; Salesforce's July 2023 public list price increase announcement and its coverage",
  idea: "Segmentation, sequencing, contractual notice and migration paths determine whether an increase sticks or converts into churn, and most of that work lands on billing and entitlement systems.",
  why: "Salesforce announced a list price increase across several of its clouds in July 2023, its first in years, and it is worth reading the announcement and the coverage as an artefact: what was said, to whom, with what notice, and what was explicitly excluded. The visible part is a press release. The invisible part is the program: which segments get which increase, whether it applies to new logos only or to renewals or in-term, what each contract's notice provision actually requires, and what concession budget the field is allowed to spend to hold accounts.\n\nEngineering owns a specific slice of that program and usually finds out late. You need to run two price books in parallel through the transition, map every existing account to old or new, meter any new value metric before the first invoice under it rather than after, and be able to reverse an account's assignment when a negotiation goes the other way. None of that is hard, all of it takes a quarter, and none of it can start when the announcement date is already set.",
  failureMode: "An increase announced by email with thirty days' notice against contracts that require ninety. The commercial outcome is not a price rise, it is a legal review, a delayed effective date, and a set of customers who now know the increase is negotiable.",
  experiment: "Read Salesforce's July 2023 pricing announcement and note three things: the scope, the notice given, and what was excluded. Then, for your own product, list what your billing and entitlement systems would need in order to run two price books in parallel for one quarter with per-account assignment and reversal. Count the distinct systems that would need to change. If the count is above three, your pricing team's earliest possible effective date is further out than they think.",
  reflection: "How many systems would a price change touch in your stack, and does whoever owns pricing know that number?",
  recall: {
    q: "What does engineering owe a price increase program, and why does the timing matter?",
    a: "Two price books running in parallel through the transition, per-account assignment to old or new with the ability to reverse it after a negotiation, and metering for any new value metric in place before the first invoice under it.\n\nIt matters because that work takes a quarter and cannot start after an effective date has been announced. Contractual notice periods then set the floor on how fast the increase can actually land."
  },
  deepDive: "Help me write the engineering work-breakdown for a price change on my product: parallel price books, account assignment, new metering, and the reversal path."
},
{
  id: "pricing-margin-floor",
  track: "pricing", level: "decide",
  title: "Choose the value metric for your service and price a margin floor into it",
  source: "Ramanujam and Tacke, Monetizing Innovation, on monetisation model and price setting; your own allocated cost per unit",
  cheat: "Set a dated floor price of fully allocated cost per unit divided by one minus target margin; at seventy-five per cent that is four times cost.",
  idea: "Pick the unit, compute fully allocated cost per unit, and publish the price below which no discount may go, with a date on it.",
  why: "The arithmetic is one line. Floor price per unit equals fully allocated cost per unit divided by one minus target gross margin. At a seventy-five per cent target, the floor is four times your cost per unit. That is a number a deal desk can use without understanding your architecture, which is the entire point: you are converting an architectural fact into a commercial constraint that survives contact with a quarter-end negotiation.\n\nTwo things make it real rather than decorative. First, fully allocated means everything: compute, storage, egress, third-party model or vendor spend, and an allocation of support and on-call, because a floor computed on infrastructure alone is below water by whatever support costs. Second, it has a date and a review cadence. The floor should fall as you get more efficient, and a floor from eighteen months ago that nobody has recomputed is either leaving margin on the table or protecting a cost you no longer have.",
  failureMode: "A floor computed from the EC2 and storage lines only, with the third-party model bill and the support allocation left out. Every deal signed at the floor is quietly gross margin negative, and the discovery happens in a gross margin bridge six months later, attributed to mix.",
  experiment: "Compute it today. Cost per unit from your own allocation, with support and vendor spend included. Target gross margin from finance - name the owner, usually your FP and A partner or the CFO. Divide. Produce one number, with its unit and the date it was computed, and send it to whoever runs the deal desk along with the two inputs so they can see it move next quarter.",
  reflection: "What is your floor price per unit, what did you have to leave out because you could not get the number, and who owns that missing number?",
  recall: {
    q: "State the margin floor formula and the two things that make it real rather than decorative.",
    a: "Floor price per unit equals fully allocated cost per unit divided by one minus target gross margin. At a seventy-five per cent target that is four times cost per unit.\n\nIt is real when the allocation is genuinely full - compute, storage, egress, vendor and model spend, plus a support and on-call allocation - and when it carries a date and a review cadence so it falls as efficiency improves."
  },
  deepDive: "Help me compute a fully allocated cost per unit for my chosen value metric, including support and vendor spend, and turn it into a dated margin floor for the deal desk."
}
);

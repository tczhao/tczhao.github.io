/* Track: Reading a P and L. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "pnl-subtraction-chain",
  track: "pnl", level: "read",
  title: "The income statement is one subtraction chain from revenue to net income",
  source: "Berman and Knight, Financial Intelligence, Part Two (The Many Peculiarities of the Income Statement)",
  idea: "A P and L is a single ordered subtraction from revenue down to net income, and every cost you control lands on exactly one line of it.",
  why: "The chain is fixed. Revenue minus cost of revenue gives gross profit. Gross profit minus operating expenses, which are split into R and D, sales and marketing, and G and A, gives operating income. Operating income minus interest, other income and tax gives net income. Four subtotals, each one the input to the next.\n\nThe order is the whole point, because each subtotal has a different owner and a different benchmark. Cost of revenue is argued against gross margin percentage. R and D is argued against R and D as a share of revenue. If you do not know which line your spend sits on, you do not know which benchmark you are being measured against, and you will bring the wrong number to the room.",
  failureMode: "You save four hundred thousand dollars a year on cluster utilisation and present it as a margin win in a meeting whose scoreboard is operating margin, where it is worth a rounding error. Or the reverse: you pitch a platform team as a gross margin improvement, and the reviewer knows the headcount lands in R and D and therefore cannot move gross margin at all.",
  experiment: "Open Datadog's most recent Form 10-K, find the consolidated statements of operations, and copy the individual line items into a sheet without the printed subtotals. Recompute gross profit, operating income and net income yourself from the lines above them. Checkable output: your three subtotals match the filing exactly. If one does not, you have missed a line, and finding it is the lesson.",
  reflection: "Which line of that chain does your team's single largest cost sit on, and who in your company is accountable for that subtotal?",
  recall: {
    q: "Name the four subtotals of an income statement in order, and the class of cost subtracted to reach each one.",
    a: "Revenue minus cost of revenue gives gross profit. Gross profit minus operating expenses, being R and D, sales and marketing, and G and A, gives operating income. Operating income minus interest, other income and expense, and tax gives net income.\n\nThe order matters because each subtotal answers a different question and is owned by a different person. A cost that lands below gross profit cannot move gross margin no matter how large it is."
  },
  deepDive: "Take the cost lines I actually control and tell me which income statement subtotal each one lands on, and which benchmark that subtotal is normally argued against."
},
{
  id: "pnl-bookings-billings-revenue",
  track: "pnl", level: "read",
  title: "Bookings, billings and revenue are three different numbers",
  source: "FASB ASU 2014-09, Revenue from Contracts with Customers (ASC 606), five-step model; Datadog Form 10-K, revenue recognition accounting policy note",
  idea: "Bookings, billings and revenue are measured at three different moments in a contract's life, and only revenue appears on the income statement.",
  why: "ASC 606 sets out five steps: identify the contract, identify the performance obligations in it, determine the transaction price, allocate that price to the obligations, and recognise revenue when or as each obligation is satisfied. A hosted subscription is satisfied over time, so the revenue is recognised across the service period rather than at signature.\n\nThat produces three separate clocks. Bookings move the day the contract is signed and are a sales metric, not an accounting one. Billings move on the invoicing schedule, which may be annual up front. Revenue moves rateably as you deliver. A three-year deal signed today with an annual prepay is a large booking today, a large cash receipt today, and roughly one thirty-sixth of the contract value on this month's top line.",
  failureMode: "An announcement says the company just closed the biggest deal in its history and engineering sizes next year's capacity against that number. The bookings figure includes years two and three, which have no infrastructure cost yet and no revenue yet. Or the inverse: a team is told revenue is flat and concludes demand is flat, when billings and bookings both grew and the recognition just has not caught up.",
  experiment: "Read the revenue recognition policy note in Datadog's latest Form 10-K. Write down every performance obligation it names and mark each one as satisfied over time or at a point in time. Then take one real contract your service is on and state, in dollars, what it contributed to bookings, to billings and to revenue this month. Checkable output: three different numbers for one contract.",
  reflection: "For your own service, which of the three numbers does your leadership actually quote in reviews, and does anyone say which one they mean?",
  recall: {
    q: "Under ASC 606, what event causes revenue to be recognised, and why does that make a signed three-year contract mostly invisible on this month's income statement?",
    a: "Revenue is recognised when or as the performance obligation is satisfied. For a hosted subscription that happens continuously over the service period, so only the delivered portion appears in the current period.\n\nBookings record the contract value at signature and billings record the invoice. Both can be far larger than the recognised revenue, and neither is on the income statement."
  },
  deepDive: "Walk one of my service's contracts through the five ASC 606 steps and show me the month by month revenue, billings and cash schedule side by side."
},
{
  id: "pnl-cloud-bill-in-cogs",
  track: "pnl", level: "read",
  title: "Your cloud bill lands in cost of revenue, not operating expense",
  source: "Snowflake Form 10-K, cost of revenue discussion in Item 7 MD and A, and the cost of revenue captions in the consolidated statements of operations",
  cheat: "Ask FP and A which cloud accounts they map to cost of revenue before quoting a margin; CI and staging usually are not.",
  idea: "The portion of your cloud bill that serves production traffic sits in cost of revenue and therefore hits gross margin directly, while the rest of it sits in operating expense and does not.",
  why: "Cost of revenue holds the cost of delivering the service that was sold: third party cloud infrastructure, hosting and data centre costs, personnel who run and support the deployed service, amortisation of capitalised internal-use software, and third party licences embedded in the product. Snowflake splits cost of revenue into product and professional services and other, and discusses the third party cloud infrastructure component in MD and A, which is the clearest public statement of where a cloud bill goes.\n\nThe trap is that not all of your cloud bill qualifies. CI runners, development and staging environments, internal analytics and engineering tooling are consumed by building the product, not delivering it, and are normally booked to R and D or G and A. So somebody in finance has already drawn a line through your cloud accounts, and you probably have not seen where.",
  failureMode: "You quote total cloud spend as cost of revenue and compute a gross margin several points below the real one, because the CI account and three sandbox accounts are in your number and not in finance's. You then argue for a cost programme sized against a denominator nobody else recognises, and the argument dies on reconciliation rather than on merit.",
  experiment: "Export last month's cloud bill grouped by account or by cost allocation tag. Classify each grouping into production serving, development and test, or internal tooling. Then ask FP and A which accounts they map to cost of revenue. Checkable output: the percentage of your total cloud bill that finance books to cost of revenue, and the name of the person who owns that mapping.",
  reflection: "What percentage of your cloud bill did you assume was in cost of revenue before you asked, and what was the actual number?",
  recall: {
    q: "Why is only part of a cloud bill cost of revenue, and what determines the split?",
    a: "Cost of revenue holds the cost of delivering the sold service. Spend on building the product, such as CI, development environments and internal tooling, is an operating expense instead, usually R and D.\n\nThe split is determined by an account or tag mapping maintained by finance, not by the cloud provider and not by engineering."
  },
  deepDive: "Here is my cloud bill broken down by account and tag. Help me draft the classification into cost of revenue versus R and D, and the specific questions I should put to FP and A about their existing mapping."
},
{
  id: "pnl-gross-profit-your-service",
  track: "pnl", level: "model",
  title: "Gross profit is the only P and L line your architecture moves directly",
  source: "Berman and Knight, Financial Intelligence, Part Two; Datadog Form 10-K, consolidated statements of operations",
  idea: "Architecture changes the cost of delivering a unit of service, which is exactly the cost of revenue line, and therefore moves gross profit and nothing else on the income statement directly.",
  why: "Every architectural decision that changes production infrastructure cost lands in cost of revenue. Compaction strategy, storage tiering, per-tenant isolation, instance families, replication factor, retention defaults. Each one changes the numerator of your cost of revenue for a given amount of delivered service, and gross profit is what is left after that subtraction.\n\nEverything else your team does lands below gross profit. The engineers writing the change are R and D. The account team selling it is sales and marketing. Those lines move too, but not because of the architecture, and not on the timescale of a deploy. Gross profit is the one subtotal where a design review shows up in the numbers within a quarter.",
  failureMode: "A team spends a quarter on a migration and reports it as a cost saving with no denominator, so nobody can tell whether it improved the business. Revenue on that service grew twenty percent over the same period, cost grew eighteen percent, and the gross profit contribution actually improved, but the story told was a flat dollar saving that sounded small next to the headcount spent on it.",
  experiment: "For one month, for one service: get the revenue finance attributes to it and subtract the cost of revenue allocated to it. Where revenue attribution does not exist, use the sum of contracted ARR divided by twelve for the tenants that service serves, and label it as your estimate. Checkable output: one gross profit dollar figure and one gross margin percentage, with the two inputs and their sources written above them.",
  reflection: "What was your service's gross margin for the month, and which of the two inputs was harder to obtain?",
  recall: {
    q: "Why does an architecture change move gross profit but not operating income directly?",
    a: "It changes the cost of delivering the service, which sits in cost of revenue, above the gross profit subtotal. Operating income also moves as an arithmetic consequence, but no operating expense line changed.\n\nThe engineering headcount that made the change sits in R and D, below gross profit, and is unaffected by the change itself."
  },
  deepDive: "Given my allocated cloud bill and the tenant list my service serves, help me build the gross profit calculation and mark clearly which inputs are estimates."
},
{
  id: "pnl-margin-points-vs-dollars",
  track: "pnl", level: "model",
  title: "Gross margin percentage and gross profit dollars answer different questions",
  source: "Berman and Knight, Financial Intelligence, Part Five (Ratios: Learning What the Numbers Are Really Telling You)",
  idea: "Gross margin percentage measures the efficiency of delivery and gross profit dollars measure the size of the prize, and a decision can improve one while destroying the other.",
  why: "The percentage is a ratio, so it moves for three distinct reasons: unit cost fell, price rose, or the mix shifted towards higher-margin business. Dollars move with volume as well. That means a growing product line with below-average margins adds gross profit dollars every month while dragging the percentage down, and a shrinking one does the opposite.\n\nWhich one you should optimise depends on what is scarce. If capital is scarce and you are being valued on margin structure, points matter. If you are trying to fund a team out of the business you generate, dollars matter. The mistake is not picking wrongly, it is not noticing there was a choice and quoting whichever number happens to look better.",
  failureMode: "A team churns off the small self-serve tenants that carry heavy fixed overhead per tenant, reports a three point gross margin improvement, and is congratulated. Total gross profit dollars fell, and so did the pipeline that those tenants fed into the enterprise tier. Nobody caught it because the percentage was the only number in the deck.",
  experiment: "Take two months of your service's revenue and cost of revenue. Decompose the change in gross profit dollars into three effects: price or rate change, volume change, and unit cost change. Hold two constant while you move the third. Checkable output: the three effects sum to the total change in gross profit, and you can state which one dominated.",
  reflection: "Over the last two months, did your service's margin percentage and gross profit dollars move in the same direction, and if not, why not?",
  recall: {
    q: "Give a concrete case where gross margin percentage rises and gross profit dollars fall.",
    a: "Discontinuing a large but low-margin product line or customer segment. The remaining revenue is higher margin, so the percentage rises, but the absolute gross profit that segment contributed disappears.\n\nThe percentage measures efficiency per dollar of revenue. Dollars measure how much there is to fund the rest of the company with. Neither alone is a verdict."
  },
  deepDive: "Here are two months of revenue and cost of revenue for my service. Build the price, volume and unit cost bridge and tell me which effect dominated."
},
{
  id: "pnl-contribution-margin-per-tenant",
  track: "pnl", level: "model",
  title: "Contribution margin per tenant is not gross margin per tenant",
  source: "Berman and Knight, Financial Intelligence, Part Five; Storment and Fuller, Cloud FinOps, the unit economics chapter",
  cheat: "Quote contribution margin, not blended allocated margin, when sales asks about a discount on a dedicated-instance deal.",
  idea: "Gross margin per tenant divides shared cost across tenants by some allocation rule, while contribution margin counts only the cost that actually disappears when the tenant does.",
  why: "Allocated cost is an accounting convention. If your control plane, your observability stack and your baseline node pool exist whether you have ninety tenants or ninety-one, then dividing their cost by tenant count produces a per-tenant number that is correct for reporting and wrong for every marginal decision. Contribution margin asks the only question a pricing meeting cares about: revenue from this tenant minus the cost that would go away if they left.\n\nThe gap between the two numbers is a direct readout of your architecture. In a fully shared multi-tenant plane, marginal cost per tenant is close to zero and contribution margin approaches the price. In a dedicated-namespace or dedicated-cluster model, the baseline nodes, the per-tenant control plane components and the per-tenant observability floor are all genuinely incremental, and contribution margin collapses towards gross margin. That gap is the number nobody else in the company can compute, because finance does not know the deployment topology and engineering does not read the P and L.",
  failureMode: "Sales asks whether they can discount thirty percent to win a dedicated-instance deal. You quote the blended per-tenant gross margin, which is healthy because it is dominated by shared-plane tenants, and the deal is approved. The tenant lands on a dedicated cluster whose incremental cost was never in that average, and the deal contributes nothing.",
  experiment: "Pick one tenant on your heaviest deployment model. List every cost line attributable to them and mark each one avoidable within ninety days of their departure or not. Sum the avoidable set. Divide it into their monthly revenue for contribution margin, then compute gross margin the allocated way for the same tenant. Checkable output: two percentages that differ, and the size of the gap in dollars.",
  reflection: "How large was the gap between allocated gross margin and contribution margin for that tenant, and what part of the architecture explains it?",
  recall: {
    q: "What distinguishes contribution margin from gross margin for a single tenant, and what does the size of the gap tell you?",
    a: "Contribution margin subtracts only the costs that disappear if the tenant leaves. Gross margin also subtracts an allocated share of shared and fixed costs that would remain.\n\nA large gap means most of your cost is shared, so marginal tenants are cheap. A small gap means each tenant carries genuinely incremental infrastructure, which is what dedicated deployment models do."
  },
  deepDive: "Given my deployment topology and cost breakdown, help me sort each cost line into avoidable and unavoidable on tenant departure, and compute contribution margin for a representative tenant on each deployment model."
},
{
  id: "pnl-opex-three-ways",
  track: "pnl", level: "read",
  title: "Operating expense splits three ways and R and D is not cost of revenue",
  source: "Snowflake Form 10-K, consolidated statements of operations; FASB ASC 730, Research and Development",
  idea: "Below gross profit, operating expense splits into research and development, sales and marketing, and general and administrative, and ASC 730 requires research and development to be expensed as incurred rather than carried into cost of revenue.",
  why: "ASC 730 is the reason platform work and feature work get argued about identically in finance terms and differently in engineering terms. Both are R and D. Both are expensed in the period the salary is paid. Neither can appear in cost of revenue, so neither can improve gross margin by existing. What platform work can do is change the cost of revenue that other people's code generates, which is a second-order effect with a lag.\n\nThat is why the three captions matter to you. Your team's cost is measured as R and D as a percentage of revenue, and the benchmark for that is completely different from the benchmark for gross margin. When you argue for headcount, you are arguing on the R and D ratio. When you argue for an architecture change, you are arguing on gross margin. Bringing the second argument to a room holding the first is the most common way an infrastructure re-charter dies.",
  failureMode: "A platform investment is pitched as worth eight gross margin points. Finance reads the request as five headcount added to R and D, which is already above the peer band as a share of revenue, and the promised margin benefit is eighteen months out and not committed by anyone. The pitch loses on a line item nobody in the room named out loud.",
  experiment: "Open Snowflake's latest Form 10-K, find the consolidated statements of operations, and write down the exact operating expense captions in the order they appear. Then compute each one as a percentage of total revenue for the most recent full year. Checkable output: three or more percentages that sum to the total operating expense ratio, and you can state which caption is the largest.",
  reflection: "What is your own company's R and D as a percentage of revenue, and who could tell you?",
  recall: {
    q: "Under ASC 730, what happens to research and development spend, and why does that limit what platform work can claim?",
    a: "Research and development costs are expensed as incurred, which places them in operating expense below the gross profit line. They cannot be carried into cost of revenue.\n\nSo platform headcount can never directly improve gross margin. It can only change the cost of revenue that the deployed system generates, later, and that has to be argued separately from the headcount request."
  },
  deepDive: "Help me structure a platform investment case that argues the R and D ratio and the gross margin effect as two separate claims with separate evidence, rather than blurring them."
},
{
  id: "pnl-where-salary-is-booked",
  track: "pnl", level: "decide",
  title: "Where an engineer's salary is booked changes reported gross margin",
  source: "FASB ASC 350-40, Internal-Use Software; Snowflake Form 10-K, software development costs accounting policy note",
  idea: "The same engineer's salary produces a different reported gross margin depending on whether it is classified to cost of revenue, to research and development, or capitalised as internal-use software.",
  why: "Three destinations exist for a payroll dollar in a hosted software business. Support, technical account management and delivery personnel who serve deployed customers sit in cost of revenue. Development personnel sit in R and D. And under ASC 350-40, certain internal-use software costs incurred during the application development stage may be capitalised as an asset and then amortised, and for a hosted service that amortisation typically lands in cost of revenue over the asset's useful life.\n\nSo the same work can be an immediate hit to R and D, or an asset that drips into cost of revenue for three years. That is not a lever you get to pull opportunistically. It is an auditable classification driven by what the people actually do and which stage the work is in. But it is a real decision with real consequences, and it means a gross margin comparison against a peer is only valid once you know both companies' policies.",
  failureMode: "You benchmark your service's gross margin against a listed competitor and conclude you are six points behind. The competitor capitalises a material amount of internal-use software and amortises it over several years, and also books a smaller support organisation into cost of revenue because their support model is community-first. You are comparing two different accounting policies and calling it an architecture gap.",
  experiment: "Take the headcount roster for your service and mark each role as cost of revenue, R and D, or capitalised. Send the marked list to finance and ask them to correct it. Separately, read the software development costs policy note in Snowflake's latest Form 10-K and record whether they capitalise internal-use software and whether they state the amounts are material. Checkable output: a corrected roster, plus one sentence on the peer's policy.",
  reflection: "Which roles on your team did you misclassify, and does the correction move your service's gross margin by more or less than a point?",
  recall: {
    q: "Name the three places an engineer's salary can land in a hosted software business, and which one reaches gross margin over time rather than immediately.",
    a: "Cost of revenue for support and delivery personnel, research and development for development personnel, and a capitalised internal-use software asset under ASC 350-40.\n\nThe capitalised route reaches gross margin over time, because the asset is amortised into cost of revenue across its useful life rather than expensed at once."
  },
  deepDive: "Here is my team roster with what each person actually spends their time on. Help me draft the classification proposal and the questions I need finance to rule on."
},
{
  id: "pnl-operating-leverage",
  track: "pnl", level: "model",
  title: "Operating leverage is opex falling as a share of revenue over several years",
  source: "Confluent Form 10-K, operating expenses as a percentage of revenue in Item 7 MD and A, results of operations",
  idea: "Operating leverage is each operating expense category declining as a percentage of revenue across multiple years, which is visible only in a multi-year table and never in a single quarter.",
  why: "The mechanism is that some cost is fixed relative to revenue and some is variable. Spread a largely fixed cost base over growing revenue and the ratio falls. Sales and marketing tends to be the most variable of the three and R and D the stickiest, so the shape of the decline tells you where the leverage actually is.\n\nOne quarter tells you nothing, because a hiring pause, a delayed conference or a large one-off will move any single ratio. Three or four years of the same table tells you whether the business genuinely gets cheaper to run per dollar of revenue. Confluent, like most SaaS registrants, presents operating expenses both in dollars and as a percentage of revenue in MD and A, so the table is already built for you.",
  failureMode: "A cost programme claims credit for a two point improvement in R and D as a share of revenue. Revenue grew thirty percent that year and R and D dollars grew twenty-six percent. The ratio moved because of the denominator. The programme saved a real amount, but the number presented was not evidence of it, and the next person to check will find that out.",
  experiment: "Open Confluent's latest Form 10-K, go to results of operations in Item 7, and build a table of R and D, sales and marketing, and G and A as a percentage of revenue for every year shown. Add gross margin as a fourth row. Checkable output: you can state which categories fell, which did not, and whether the gross margin row moved in the same direction as the operating expense rows.",
  reflection: "In your reading of that table, is the operating leverage coming from cost discipline or from revenue growth, and how would you tell the difference?",
  recall: {
    q: "Why can operating leverage not be demonstrated with one quarter of data?",
    a: "Any single-period ratio moves for transient reasons, such as hiring timing, seasonal marketing spend or one-off charges, and it also moves purely because the revenue denominator changed.\n\nOperating leverage is a claim about the cost structure, so it needs several years of the same ratio, with the dollar growth rates shown alongside so you can separate the numerator from the denominator."
  },
  deepDive: "Help me build the multi-year percentage of revenue table for a company I name, and then tell me which parts of the decline are denominator effects."
},
{
  id: "pnl-net-income-least-informative",
  track: "pnl", level: "read",
  title: "Net income is the least informative line on a software P and L",
  source: "Berman and Knight, Financial Intelligence, Part Two; GitLab Form 10-K, consolidated statements of operations, other income and expense and provision for income taxes",
  idea: "Almost everything between operating income and net income is outside operating control, so net income is the line on a software P and L that tells you least about the business.",
  why: "Below operating income sit interest income on the cash and investment balance, interest expense on any debt, foreign exchange effects, changes in the fair value of investments, and the tax provision. For a company holding a large post-IPO cash balance, interest income can be a substantial number that has nothing whatsoever to do with the product. For a company with accumulated losses, the tax provision is dominated by valuation allowances and foreign taxes, and the effective rate bears little relation to the statutory one.\n\nNone of these are things an engineering organisation moves. That is why operating income, and gross margin above it, are the lines worth arguing about internally, and why analysts spend their time on the same two. Net income is where the accounting stops, not where the business is.",
  failureMode: "A team sees the company post a net loss and concludes that cost reduction anywhere is urgent. The operating loss narrowed, gross margin improved, and the net loss widened because of a mark on the investment portfolio and a foreign tax charge. The urgency was real but the diagnosis was aimed at a line nobody in engineering can reach.",
  experiment: "Open GitLab's latest Form 10-K and take the most recent fiscal year from the consolidated statements of operations. Write down operating loss and net loss, then list every line between them with its amount. Next to each, write whether your team could influence it. Checkable output: the two subtotals, the intervening lines, and a column that says no all the way down.",
  reflection: "How large was the gap between operating result and net result in that filing, and what caused most of it?",
  recall: {
    q: "What sits between operating income and net income, and why does that make net income a poor internal target?",
    a: "Interest income and expense, foreign exchange, gains and losses on investments, other non-operating items, and the tax provision.\n\nNone are moved by product or infrastructure decisions, and for a company with a large cash balance or accumulated losses they can dominate the result. Operating income and gross margin are the lines an operating team can actually affect."
  },
  deepDive: "Pull apart the gap between operating result and net result in a filing I name and tell me how much of it is cash-balance interest and how much is tax."
},
{
  id: "pnl-cash-vs-accrual",
  track: "pnl", level: "read",
  title: "Cash accounting and accrual accounting disagree by design",
  source: "Berman and Knight, Financial Intelligence, Part Four (Cash Is King)",
  idea: "Profit and cash diverge because accrual accounting deliberately matches revenue and cost to the period the work happened, not the period the money moved.",
  why: "There are three structural sources of divergence. Revenue can be recognised before or after cash arrives, which produces deferred revenue on one side and accounts receivable on the other. Costs can be paid now and expensed later, which is what capitalisation and depreciation do. And some expenses never involve cash at all, share-based compensation being the largest one in software.\n\nFor an infrastructure team the sharpest example is a multi-year prepaid commitment. Pay three years of reserved capacity up front and the cash leaves this month, but the expense is spread across thirty-six months as the prepaid asset is consumed. The cash statement and the income statement will disagree about that decision for three years, and both will be right.",
  failureMode: "You negotiate a large prepaid commitment, present the full discount as a saving in the month you signed, and finance points out the income statement shows one thirty-sixth of it. Worse, treasury was not consulted and the cash outflow landed in a quarter where cash was the constrained resource, so a decision that improved profit over three years made the immediate position worse.",
  experiment: "Take one commitment or prepay your team owns. Build two rows across the months of its term: cash outflow by month, and expense recognised by month. Checkable output: the two rows sum to the same total and have visibly different shapes, and you can name the month where the divergence is largest.",
  reflection: "For the commitment you charted, in which month is the gap between cash out and expense recognised the widest, and did anyone plan for it?",
  recall: {
    q: "Name the three structural reasons profit and cash diverge, with an infrastructure example of each.",
    a: "Timing of revenue against cash, such as an annual prepay creating deferred revenue. Timing of cost against cash, such as a reserved capacity prepay or capitalised software expensed over years. And non-cash expenses, such as share-based compensation and depreciation.\n\nNone of these indicate a problem. They are what accrual accounting is for, which is matching activity to the period it occurred in."
  },
  deepDive: "Chart the cash and accrual profiles of a commitment I describe, and tell me which quarter it hurts most in each view."
},
{
  id: "pnl-deferred-revenue",
  track: "pnl", level: "read",
  title: "Deferred revenue is a liability that means the cash already arrived",
  source: "Datadog Form 10-K, deferred revenue note and consolidated balance sheets",
  idea: "Deferred revenue is a liability recording service you have been paid for and not yet delivered, so a growing balance is a customer-funded business rather than a risk.",
  why: "When a customer prepays annually, you take the cash and take on an obligation. Accounting records the obligation as a liability and releases it into revenue as you deliver, month by month. It is the cleanest single window into how accrual mechanics work, because you can watch a cash receipt sit on the balance sheet and then walk onto the income statement over the following year.\n\nIt also encodes your billing terms. Annual up front builds deferred revenue and funds operations with customer cash. Monthly in arrears builds accounts receivable instead, and the same ARR produces a very different cash profile. Deferred revenue does not capture contracted amounts that have not been invoiced yet, which is why registrants also disclose remaining performance obligations. If you want to know what infrastructure demand is already contracted, the remaining performance obligation disclosure is a better forward signal than revenue.",
  failureMode: "An engineer reads a rising liability line as leverage or debt and concludes the company is in trouble. Or, more expensively, capacity planning is driven off recognised revenue while the deferred revenue and remaining performance obligation disclosures both show a step change in contracted commitments landing next quarter that nobody in engineering has read.",
  experiment: "In Datadog's latest Form 10-K, find the deferred revenue note and the consolidated balance sheets. Record the current and non-current deferred revenue balances and the disclosure of how much of the opening balance was recognised as revenue during the year. Then ask your own finance team what fraction of your service's contracts bill annually up front. Checkable output: the two balances, the recognition figure, and one percentage for your own book.",
  reflection: "Does your service's billing mix build deferred revenue or accounts receivable, and who chose that?",
  recall: {
    q: "Why is deferred revenue a liability, and why is a growing balance usually good news?",
    a: "Because you have been paid for service you have not yet delivered, so you owe the customer performance. It sits on the balance sheet and releases into revenue as delivery occurs.\n\nGrowth in the balance means more customers paying up front, which funds the business with customer cash rather than with capital, and signals contracted revenue that has not hit the income statement yet."
  },
  deepDive: "Explain how my service's billing terms translate into deferred revenue versus receivables, and what the remaining performance obligation disclosure would show for my book if we published one."
},
{
  id: "pnl-balance-sheet-four-lines",
  track: "pnl", level: "read",
  title: "Four balance sheet lines move when an infrastructure team changes something",
  source: "Snowflake Form 10-K, consolidated balance sheets and the leases and commitments notes; FASB ASC 842, Leases",
  idea: "Property and equipment, capitalised internal-use software, accrued expenses, and lease and purchase commitments are the four places infrastructure decisions show up outside the income statement.",
  why: "Buying hardware or building out a facility creates property and equipment, an asset depreciated over its useful life rather than expensed at purchase. Capitalised internal-use software works the same way and amortises into cost of revenue. Your unpaid cloud bill at period end sits in accrued expenses, which is why a change in payment terms moves the balance sheet without touching profit at all. And multi-year committed spend agreements with cloud providers appear as purchase obligations in the commitments note, while colocation and facility leases appear as right-of-use assets and lease liabilities under ASC 842.\n\nThe reason this matters to you and not just to accounting is that the largest infrastructure decisions are often invisible on the income statement in the period they are made. Signing a three-year committed spend agreement changes no expense line this month and creates a disclosed obligation that every investor reads.",
  failureMode: "A procurement negotiation is run purely on discount percentage. The team commits to a large multi-year spend floor, which becomes a disclosed non-cancellable purchase obligation. Two years later the architecture changes and consumption falls below the floor, and the shortfall is a real cost with no service behind it, sitting in a note that the CFO has to explain.",
  experiment: "Open Snowflake's latest Form 10-K, go to the commitments note, and find the non-cancellable purchase obligations with cloud providers, their total and their term. Then find your own company's equivalent commitment: total, remaining balance, and expiry. The owner of that number is procurement or FP and A. Checkable output: both figures written down side by side, and your consumption run rate against your own floor.",
  reflection: "Is your current consumption run rate above or below your committed floor, and how much headroom or shortfall is there at current growth?",
  recall: {
    q: "Name the four balance sheet areas an infrastructure decision moves, and give one decision that moves each.",
    a: "Property and equipment, moved by buying hardware. Capitalised internal-use software, moved by capitalising development of the platform. Accrued expenses, moved by the unpaid cloud bill at period end or by changing payment terms.\n\nAnd lease and purchase commitments, moved by signing a colocation lease or a multi-year committed spend agreement with a cloud provider. The last one is the most dangerous because it changes no income statement line in the month it is signed."
  },
  deepDive: "Given our committed spend agreement terms and current consumption run rate, work out our headroom against the floor and what an architecture change of the size I describe would do to it."
},
{
  id: "pnl-free-cash-flow",
  track: "pnl", level: "model",
  title: "Free cash flow starts at net income and adds back what was never cash",
  source: "Snowflake Form 10-K, consolidated statements of cash flows and the non-GAAP free cash flow reconciliation",
  idea: "The indirect method walks from net income to operating cash flow by adding back non-cash expenses and working capital movements, and free cash flow is that figure less capital expenditure and capitalised software.",
  why: "The reconciliation is short and worth doing by hand once. Start at net income or loss. Add back share-based compensation, depreciation and amortisation, and any other non-cash charge, because they reduced profit and never touched cash. Then adjust for working capital: an increase in deferred revenue adds cash because you collected before you delivered, an increase in receivables subtracts it because you delivered before you collected. That gives net cash provided by operating activities. Subtract purchases of property and equipment and capitalised internal-use software, and you have free cash flow as most software registrants define it in their non-GAAP tables.\n\nOnce you have walked it, you can classify your own decisions. Reducing an accrued cloud cost hits both profit and cash. Capitalising development work reduces this year's expense but not this year's cash outflow. Share-based compensation reduces profit and never touches cash, which is how a company posts a large net loss and positive free cash flow in the same year.",
  failureMode: "A programme is reported to the board as having improved cash generation. What it actually did was move spend from expensed to capitalised, which improved reported operating income and left cash exactly where it was. Anyone reading the cash flow statement sees it immediately, and the credibility cost is larger than the number.",
  experiment: "Open Snowflake's latest Form 10-K, take the consolidated statements of cash flows, and recompute free cash flow from the line items using their stated definition in the non-GAAP reconciliation. Note the two largest add-backs. Then take your three largest cost decisions this year and classify each as hits profit only, hits cash only, or hits both. Checkable output: your free cash flow figure matches the filing, plus a three-row classification of your own decisions.",
  reflection: "Which of your cost decisions this year moved profit without moving cash, and did anyone describe it as a cash saving?",
  recall: {
    q: "Starting from net income, what are the main steps to free cash flow, and why can a loss-making company be free cash flow positive?",
    a: "Add back non-cash charges such as share-based compensation and depreciation and amortisation, adjust for working capital including deferred revenue and receivables, which gives operating cash flow, then subtract capital expenditure and capitalised software.\n\nA company can be loss-making and free cash flow positive because share-based compensation is a large non-cash expense and customer prepayments increase deferred revenue, both of which add cash back to a negative starting point."
  },
  deepDive: "Take my three largest cost decisions this year and classify each as profit-only, cash-only or both, and show the working."
},
{
  id: "pnl-non-gaap-margin",
  track: "pnl", level: "read",
  title: "Non-GAAP margin is management stating what it thinks is not the business",
  source: "Datadog Form 10-K and quarterly results Form 8-K, GAAP to non-GAAP reconciliation tables",
  idea: "Every non-GAAP adjustment is an editorial claim that a real cost is not part of the ongoing business, and the list of adjustments tells you what management wants you to ignore.",
  why: "Registrants are required to reconcile any non-GAAP measure back to the nearest GAAP one, so the argument is always printed. The usual exclusions in software are share-based compensation and the employer payroll taxes on it, amortisation of acquired intangibles, acquisition and integration costs, and restructuring. Each has a defence and each has a counter. Share-based compensation is the contested one, because it is unambiguously a cost of employing people, just not a cash one, and excluding it flatters both margin and profitability for a company that pays a large share of compensation in equity.\n\nThis reaches you directly. Non-GAAP gross margin typically excludes the share-based compensation allocated to cost of revenue and the amortisation of acquired intangibles that sits there. So the gross margin number quoted at your all hands is likely a point or two above the GAAP one, and if you benchmark your internally computed service margin against a competitor's headline figure you are comparing two different measures.",
  failureMode: "You compute your service's gross margin on a full GAAP basis, including allocated share-based compensation for the support engineers, and compare it to a peer's non-GAAP headline. You conclude your architecture is uncompetitive and propose a migration. The gap was measurement, not architecture, and you find out after the design doc is circulated.",
  experiment: "Take Datadog's most recent quarterly results Form 8-K and find the GAAP to non-GAAP reconciliation tables. List every adjustment between GAAP and non-GAAP gross profit and between GAAP and non-GAAP operating income. For each one, write a single sentence on whether you accept that it is not part of the business. Then find out which basis your own company's internal margin dashboard uses. Checkable output: the adjustment list with your verdicts, and one word naming your own dashboard's basis.",
  reflection: "Which single adjustment on that list would you refuse to accept, and what is your argument for keeping it in?",
  recall: {
    q: "What are the common non-GAAP exclusions in a software gross margin, and which one is most contested?",
    a: "Share-based compensation allocated to cost of revenue and the payroll taxes on it, amortisation of acquired intangibles, and acquisition, integration or restructuring costs.\n\nShare-based compensation is the most contested, because it is a genuine cost of employing people and excluding it flatters margin for companies that pay heavily in equity. It is non-cash, not free."
  },
  deepDive: "Compare my internally computed service gross margin against a peer's published figure and tell me exactly which adjustments I have to make on each side to compare like with like."
},
{
  id: "pnl-write-your-own",
  track: "pnl", level: "decide",
  title: "Write the P and L for your own service line",
  source: "Berman and Knight, Financial Intelligence, Parts Two and Five; your own allocated cloud bill and finance's revenue attribution",
  idea: "Produce a one page income statement for your service down to gross margin, naming for every line the number's owner and the system it comes from.",
  why: "The exercise is valuable mainly for what it fails to find. Most infrastructure organisations discover that revenue attributed to a service does not exist as a maintained number, that the cloud cost allocation stops one level above the granularity they need, and that the support headcount serving their tenants is spread across two cost centres. None of that is a reason not to build the statement. It is the statement's first output.\n\nThe second output is standing. Once you can hand someone a P and L for your service with named owners against each line, the conversation about a re-charter stops being about headcount and starts being about a business unit with a margin. Finance cannot build this because they do not know which cloud spend maps to which service. Engineering has not built it because nobody reads the filing. The intersection is the asset.",
  failureMode: "The statement is built entirely from engineering-side estimates, with a revenue figure derived from a spreadsheet of contract values that has never been reconciled to the general ledger. It gets challenged in the first review on the revenue line, and the cost work, which was correct, is discarded with it.",
  experiment: "Write seven lines on one page: revenue; cost of revenue split into cloud infrastructure, support and delivery personnel, third party licences, and amortisation of capitalised software; gross profit; gross margin percentage. Against each line put the owner's name and the source system. Fill in what you can today from your own cloud bill and tenant list. Checkable output: the count of lines you filled unaided, and a single written request to finance naming the exact remaining numbers and the person you sent it to.",
  reflection: "How many of the seven lines could you fill without asking anyone, and which missing number would change the picture most?",
  recall: {
    q: "What are the lines of a service-level P and L down to gross margin, and which of them typically does not exist yet?",
    a: "Revenue, then cost of revenue split into cloud infrastructure, support and delivery personnel, third party licences and amortisation of capitalised software, then gross profit and gross margin percentage.\n\nAttributed revenue at service granularity is usually the missing one, because it is nobody's job to maintain it. It has to be requested from finance by name, and an unreconciled engineering estimate will be challenged on first reading."
  },
  deepDive: "Here is what I have for my service: the cloud bill by tag, the tenant list, and the support roster. Draft the one page P and L, mark every estimate, and write the request to finance for the numbers I cannot get."
}
);

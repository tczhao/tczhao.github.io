/* Track: Reading a filing. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "filings-four-parts-three-items",
  track: "filings", level: "read",
  title: "A 10-K has four parts and you need three items",
  source: "SEC Form 10-K general instructions; Snowflake Form 10-K, Items 1, 1A, 7 and 8",
  idea: "Learn the fixed item numbering of a 10-K once and you can go straight to the three items that carry the economics in any filer's document.",
  why: "The structure is not the company's choice. Form 10-K and Regulation S-K fix the parts and the item numbers, so Item 1A means risk factors in every filing ever made. Part I is the business and its risks. Part II is the money: Item 7 is MD and A, Item 8 is the audited financial statements and notes. Parts III and IV are governance and exhibits, and Part III is usually incorporated by reference from the proxy rather than printed.\n\nThat fixed numbering is what makes the skill transferable. Item 1 you read once per company to learn what it sells. Items 1A, 7 and 8 you read every year, in that order, and the order matters: 1A tells you what management is worried about, 7 tells you why each line moved, 8 gives you the numbers to check both against.",
  failureMode: "Reading front to back, burning fifty minutes in Item 1 boilerplate about the total addressable market, and arriving at the financial statements with no attention left. Or worse, reading somebody's summary of the filing written by a party with a position.",
  experiment: "Open the latest Snowflake 10-K on EDGAR. Use the table of contents to jump to Items 1A, 7 and 8 and write down the page number of each. Then time yourself from the EDGAR URL to the cost of revenue lines on the income statement. Under three minutes is the target, and after two attempts it should be under one.",
  reflection: "Which of the three items did you find hardest to navigate, and was that the document or your lack of a question going in?",
  recall: {
    q: "Which four item numbers in a 10-K carry the business and the economics, and which one do you only need to read once per company?",
    a: "Item 1 business, Item 1A risk factors, Item 7 MD and A, Item 8 financial statements and notes. Item 1 is the one-time orientation read; the other three are the annual pass.\n\nThe numbering is fixed by Form 10-K and Regulation S-K, so the same item number means the same section in every filer's document."
  },
  deepDive: "Walk me through the latest 10-K of a company I name, item by item, and tell me which sections I can skip for a cost structure question."
},
{
  id: "filings-risk-factor-specificity",
  track: "filings", level: "read",
  title: "Risk factors are boilerplate until one names your architecture",
  source: "Datadog Form 10-K, Item 1A risk factor on reliance on third party cloud infrastructure",
  idea: "The risk factors worth your time are the ones that name a specific vendor, dependency, region or contract, because generic risk is legal cover and specific risk is somebody's actual worry written down.",
  why: "Item 1A exists to defeat securities litigation. The incentive is to disclose every conceivable risk, which is why the section runs thirty pages and most of it could be pasted into any software company's filing without editing. That volume is not a signal.\n\nSpecificity is the signal, because specificity costs the company something. A paragraph naming a single cloud provider, a hosting concentration, a committed spend arrangement or a particular product dependency was written because a generic version would not have covered the actual exposure. Datadog's Item 1A carries a risk factor on reliance on third party cloud infrastructure. Read what it says about switching costs, pricing changes and service interruption, because that paragraph is a description of the same dependency you operate.",
  failureMode: "Dismissing Item 1A wholesale as lawyer noise, and missing that a company you compete with has disclosed a single-region dependency, a provider concentration or a pricing exposure that your own architecture shares and nobody at your company has costed.",
  experiment: "Open the latest Datadog 10-K Item 1A. Count the total number of risk factor headings, then count the ones that name a specific vendor, product, region, contract or technical dependency. Write both numbers and the ratio. Then read the specific ones and mark which describe an exposure your own service also has.",
  reflection: "Which named dependency in that section maps onto your own architecture, and could you state what it would cost you if it broke?",
  recall: {
    q: "What is the one-line test for whether a risk factor is worth reading?",
    a: "Could this paragraph be copy-pasted into any other software company's 10-K without editing? If yes, skip it. If it names a vendor, region, contract or technical dependency, it describes a real exposure somebody was worried enough about to disclose specifically."
  },
  deepDive: "Read Item 1A of a filing I give you and pull out only the non-generic risk factors, then tell me which ones describe exposures my own multi-tenant architecture also has."
},
{
  id: "filings-mda-walk",
  track: "filings", level: "read",
  title: "MD and A is management explaining every delta you care about",
  source: "MongoDB Form 10-K, Item 7 MD and A, results of operations comparison",
  idea: "The results of operations section of MD and A gives you every material line, its change year over year, and management's stated cause for the change, in prose.",
  why: "Regulation S-K Item 303 requires management to discuss the results of operations and describe the causes of material changes, not just report them. So the comparison tables give you line, prior period, current period, dollar change and percent change, and the paragraph underneath names the drivers.\n\nFor your purposes the cost of revenue paragraph is the whole point. That is where you find out whether the increase was cloud hosting, personnel in the delivery organisation, amortisation of capitalised internal-use software, or data centre costs, and in what order of magnitude. It is your cost line, decomposed and explained by the CFO, in words, once a year. No screener gives you that.",
  failureMode: "Pulling the line items from a stock screener or a financial data terminal and never opening the filing, so you know cost of revenue rose fourteen percent but not whether that was compute, support salaries or an acquisition, which are three completely different stories about the same number.",
  experiment: "In the latest MongoDB 10-K Item 7, find the cost of revenue comparison. Copy the sentence naming the drivers of the change into your notes verbatim and rank the drivers in the order management listed them, which is usually the order of magnitude. Then write the equivalent sentence for your own service's last twelve months of infrastructure spend. If you cannot, you do not know your own cost drivers as well as MongoDB's CFO knows theirs.",
  reflection: "Could you write the cost of revenue driver sentence for your own service without asking anyone, and if not, which number are you missing?",
  recall: {
    q: "What does Regulation S-K Item 303 force management to provide that the face of the financial statements does not?",
    a: "The cause of each material change, in prose. The statements give you the delta; MD and A has to explain why it happened.\n\nThat is why the cost of revenue paragraph in Item 7 is the fastest route into a company's cost structure."
  },
  deepDive: "Take the cost of revenue discussion from a 10-K I paste in and turn it into a ranked list of cost drivers with the magnitude management implied for each."
},
{
  id: "filings-revenue-disaggregation",
  track: "filings", level: "read",
  title: "The revenue note disaggregates what the income statement combines",
  source: "Confluent Form 10-K, revenue recognition note, disaggregation of revenue",
  idea: "The revenue footnote splits revenue into categories with different economics, which the single revenue line on the income statement deliberately hides.",
  why: "ASC 606-10-50-5 requires revenue to be disaggregated into categories that depict how the nature, amount and timing of revenue and cash flows are affected by economic factors. In practice that means by offering and by geography, in a table in the revenue note.\n\nConfluent's disaggregation separates its cloud offering from its self-managed platform offering, plus services. Those carry completely different cost structures: the cloud line drags hosting COGS with it and the self-managed line does not. Blended subscription gross margin is therefore a weighted average of two different businesses, and a mix shift toward cloud moves the blend down every quarter even if both underlying margins are improving.",
  failureMode: "Watching a competitor's blended gross margin fall, concluding their infrastructure efficiency is degrading, and building a strategy on it, when the real cause is a mix shift toward the hosted product and each product's own margin is flat or rising.",
  experiment: "Pull the disaggregation table from Confluent's latest 10-K. Write down each category as a percent of total revenue for both periods shown, and compute the change in each share. That delta is the mix shift. Then do the same for your own service split by deployment model, and ask finance which of those splits they actually maintain in the ledger.",
  reflection: "What percentage of your own revenue sits in the offering that carries the cloud bill, and is that share rising or falling?",
  recall: {
    q: "Why can blended gross margin fall while every individual product's margin is improving?",
    a: "Because blended margin is a weighted average, and a mix shift toward the lower-margin offering pulls the average down regardless of what each component is doing.\n\nThe revenue disaggregation table in the ASC 606 note is where you get the weights to separate mix from performance."
  },
  deepDive: "Given a revenue disaggregation table I paste in, decompose the change in blended gross margin into a mix effect and a rate effect."
},
{
  id: "filings-cost-of-revenue-split",
  track: "filings", level: "model",
  title: "Cost of revenue detail lives in MD and A, not in the notes",
  source: "Snowflake Form 10-K, Item 7 MD and A, product and professional services cost of revenue discussion",
  idea: "There is no cost of revenue footnote in US GAAP, so you derive product gross margin and services gross margin from the face of the income statement and get the explanation from MD and A.",
  why: "Companies with a meaningful services business present revenue and cost of revenue split on the face of the statement. Snowflake presents product revenue and professional services and other revenue, with matching cost lines. Two subtractions and two divisions gives you two gross margins. The notes will not help you further; the narrative is in Item 7.\n\nThe split matters because professional services is usually run near or below breakeven on purpose. It is an adoption and land cost wearing a revenue costume, and its margin has nothing to do with your architecture. Blending it into one company gross margin drags the number down and hides the product margin, which is the only one that responds to what you build.",
  failureMode: "Quoting the blended company gross margin in a planning meeting, being corrected by someone from finance who works in product margin, and losing the room for the rest of the session. The two numbers can be materially apart and they are not interchangeable.",
  experiment: "From Snowflake's latest income statement, compute product gross margin and professional services gross margin for the most recent full year, and write the gap between them in percentage points. Then split your own COGS into the part driven by running the product and the part driven by humans serving customers, and compute both. Finance owns the classification of the services cost centre; ask which cost centres roll into cost of revenue before you compute anything.",
  reflection: "How many percentage points apart are your product and services gross margins, and which one has your leadership been quoting?",
  recall: {
    q: "Where do you find the split between product and services cost of revenue, and why does the blend mislead?",
    a: "On the face of the income statement when the company presents it, with the explanation in Item 7 MD and A. There is no cost of revenue footnote.\n\nThe blend misleads because professional services is deliberately run near breakeven as an adoption cost, so it drags the blended margin down and masks the product margin, which is the one architecture actually moves."
  },
  deepDive: "Help me split my own cost of revenue into product and services buckets and compute both margins, and tell me which line items I am likely misclassifying."
},
{
  id: "filings-rpo",
  track: "filings", level: "read",
  title: "Remaining performance obligation is contracted revenue not yet recognised",
  source: "Snowflake Form 10-K, revenue note, remaining performance obligation disclosure including the portion expected within twelve months",
  idea: "RPO is the total contracted value not yet recognised as revenue, and it shows committed future demand that deferred revenue alone cannot.",
  why: "Deferred revenue only captures what has been invoiced. A three-year contract billed annually puts one year into deferred revenue and leaves the remaining two years off the balance sheet entirely. ASC 606-10-50-13 closes that gap by requiring disclosure of the transaction price allocated to remaining performance obligations, and when the company expects to recognise it. Snowflake discloses total RPO along with the percentage expected within the next twelve months.\n\nThe split is the useful part. Current RPO divided by total RPO is a duration proxy. A rising total with a falling current share means the company is signing longer contracts, which changes the cash profile and, for you, means committed load you have to build capacity for well ahead of the revenue arriving.",
  failureMode: "Using deferred revenue growth as your demand signal. A shift to multi-year contracts billed annually moves committed value out of deferred revenue and into non-current RPO, so deferred looks flat while the contracted book is growing, and you plan capacity against the wrong series.",
  experiment: "In Snowflake's latest 10-K revenue note, write down total RPO and the stated percentage expected within twelve months, then compute the non-current portion. Pull the same two figures from the prior year filing and compute how the current share moved. Then ask your own finance team what fraction of your service's contracted ARR sits in contracts longer than twelve months, and who owns that number.",
  reflection: "Does your capacity plan run off billed revenue or contracted revenue, and how far apart are those two numbers?",
  recall: {
    q: "What does RPO capture that deferred revenue does not, and what does the twelve-month split tell you?",
    a: "RPO includes contracted amounts not yet invoiced, so it captures the unbilled years of a multi-year deal that never touch the balance sheet. Deferred revenue is only the invoiced portion.\n\nThe percentage expected within twelve months is a duration proxy: a falling current share with a rising total means the company is signing longer contracts."
  },
  deepDive: "Given RPO and deferred revenue figures from a filing, help me infer average contract duration and what it implies about the capacity that has to be funded ahead of revenue."
},
{
  id: "filings-one-segment",
  track: "filings", level: "read",
  title: "One reportable segment is a disclosure choice with consequences",
  source: "ASC 280 segment reporting as amended by ASU 2023-07; Elastic Form 10-K, segment information note",
  idea: "Almost every infrastructure software company reports a single reportable segment, which is why product-level economics have to be inferred rather than read.",
  why: "ASC 280 uses the management approach: reportable segments follow how the chief operating decision maker allocates resources and assesses performance. If the CEO reviews one consolidated P and L, one segment is the honest answer, and it is also the answer that requires the least disclosure. No product-level revenue, no product-level margin, no product-level asset base.\n\nASU 2023-07 tightened this. Single-segment entities now have to disclose the significant segment expense categories regularly provided to the CODM, plus other segment items. That is genuinely new detail on the expense side, and what a company chose to call significant is itself informative: those are the categories leadership looks at monthly.",
  failureMode: "Assuming a competitor's disclosed gross margin describes the specific product you compete with. It is a blend across offerings with different hosting intensities, and the product you care about could be ten points either side of the reported number.",
  experiment: "Read the segment note in Elastic's latest 10-K. Write down the number of reportable segments and the expense categories disclosed under the CODM requirement. Then write down the expense categories your own leadership reviews monthly. If your internal list is longer and more granular than the disclosed one, note that you have visibility a public reader does not, and that this asymmetry runs both ways when you read a rival.",
  reflection: "Which expense categories does your CODM actually see monthly, and would you be comfortable if they were the ones disclosed?",
  recall: {
    q: "Why does one reportable segment usually mean you cannot read product-level margin, and what did ASU 2023-07 add?",
    a: "ASC 280 follows the management approach, so a company whose CODM reviews a single consolidated P and L reports one segment and owes no product-level revenue or margin disclosure.\n\nASU 2023-07 requires even single-segment entities to disclose the significant segment expense categories regularly provided to the CODM, which puts new detail on the expense side."
  },
  deepDive: "Help me estimate product-level gross margin for a single-segment company using whatever disaggregation, expense categories and MD and A commentary the filing does give."
},
{
  id: "filings-sbc-allocation",
  track: "filings", level: "read",
  title: "Stock-based compensation is allocated across cost of revenue and every opex line",
  source: "Datadog Form 10-K, stock-based compensation note showing allocation by financial statement line",
  idea: "Equity expense follows the employee, so the portion belonging to people classified in cost of revenue sits inside the gross margin you are measured on.",
  why: "ASC 718 requires share-based compensation to be classified in the same line as the cash compensation of the employees who earned it. Support engineers, cloud operations, managed service delivery and technical account management usually sit in cost of revenue, so their equity does too. The SBC footnote gives you the allocation table by financial statement line.\n\nThe consequence is uncomfortable. Gross margin carries a non-cash charge that scales with delivery headcount and with the share price. Move a team from research and development into an on-call delivery function and reported gross margin falls without a single dollar of cloud spend changing. Run a project that cuts cloud cost by two points and lose it to a reorg and a share price rally.",
  failureMode: "Committing to a gross margin improvement from an infrastructure project, delivering the infrastructure saving, and watching the margin go the wrong way because headcount was reclassified into cost of revenue mid-year. You then have to explain a number you did not control.",
  experiment: "Find the SBC allocation table in Datadog's latest 10-K and write down the amount sitting in cost of revenue versus each operating expense line. Compute SBC in cost of revenue as a percentage of total cost of revenue. Then ask your finance partner which of your own headcount is classified in cost of revenue today, and whether any reclassification is planned this year.",
  reflection: "How much of your service's cost of revenue is people rather than infrastructure, and does anyone hold you accountable for the difference?",
  recall: {
    q: "Why can gross margin move without any change in infrastructure spend?",
    a: "Because cost of revenue includes the compensation, cash and equity, of employees classified as delivery. ASC 718 puts share-based compensation in the same line as those employees' cash pay.\n\nSo a reorg that moves engineers into a delivery function, or a rising share price, moves gross margin with no change in cloud spend at all."
  },
  deepDive: "Help me build a bridge that separates the infrastructure-driven and headcount-driven components of my gross margin change over the last year."
},
{
  id: "filings-cloud-commitments",
  track: "filings", level: "read",
  title: "Cloud purchase commitments are disclosed and they reveal the negotiation",
  source: "Snowflake Form 10-K, commitments and contingencies note, non-cancelable purchase obligations with cloud infrastructure providers",
  idea: "The non-cancellable purchase obligations table shows committed cloud spend by year, which is the shape of the discount deal the company struck with its provider.",
  why: "Unconditional purchase obligations have to be disclosed, and companies with large hosting arrangements break out committed spend to cloud infrastructure providers with a maturity profile by year. Snowflake's commitments note carries exactly this.\n\nThe maturity shape tells you what was traded. A large commitment with a long tail means a deep discount bought by taking volume risk. A ramped commitment, small in year one and large in year four, means the company forecast growth and pre-sold it to the provider. Either way the commitment converts variable COGS into fixed cost. That is the whole trade: you buy a lower unit rate by giving up the option to spend less.",
  failureMode: "Negotiating your own committed use discount purely on the headline percentage, without modelling what a demand miss does. If usage lands below commitment you pay for capacity you did not consume, and it arrives as gross margin compression that no engineering work can cut away, because the spend is contractual.",
  experiment: "Read Snowflake's commitments note and copy the by-year maturity of cloud purchase obligations into a table. Divide the total commitment by the most recent year's total cost of revenue for a rough sense of how many years of current spend is locked, and treat it as directional since cost of revenue includes more than hosting. Then get your own organisation's committed spend and remaining term from procurement and compute the same ratio against your annual cloud bill.",
  reflection: "What is your own committed spend as a multiple of last year's actual cloud consumption, and what happens to margin if demand comes in twenty percent light?",
  recall: {
    q: "What does a committed use discount actually do to the shape of your cost structure?",
    a: "It converts variable cost into fixed cost. You get a lower unit rate in exchange for giving up the ability to spend less if demand disappoints.\n\nThe by-year maturity table in the commitments note shows how much of that trade a company made and over what horizon."
  },
  deepDive: "Model the margin impact of a committed use discount at three demand scenarios, given my current cloud run rate and a commitment level I will supply."
},
{
  id: "filings-s1-once",
  track: "filings", level: "read",
  title: "An S-1 discloses unit data the company never repeats",
  source: "GitLab Form S-1 and HashiCorp Form S-1, customer and retention disclosures absent from later 10-Ks",
  idea: "A registration statement over-discloses once because there is no trading history to price against, so the S-1 carries unit metrics the company quietly drops afterwards.",
  why: "Form S-1 has to give an investor enough to value a company with no public track record. That pushes companies to publish customer counts by band, cohort expansion charts, net retention definitions and sometimes revenue detail by offering, at a level of granularity nobody requires them to sustain. After the IPO, key business metrics in Item 7 are voluntary, so the ones that stop flattering the story get retired.\n\nGitLab and HashiCorp both filed S-1s in 2021 with customer and retention disclosures. HashiCorp's public record is now closed after the IBM acquisition, which makes it a clean, finite set to compare: S-1 to final 10-K, and you can see exactly what survived.",
  failureMode: "Benchmarking against a company's current 10-K, finding no cohort or retention data, and concluding it was never published. It was published once, it is still on EDGAR, and the definitions section of the S-1 usually explains the metric better than any later filing does.",
  experiment: "Pull GitLab's S-1 and its most recent 10-K. List every key business metric defined in each and mark the ones that disappeared. Do the same for HashiCorp's S-1 against its final 10-K. A metric both companies dropped is one the sector stopped wanting to show, and that is worth knowing before you propose it as an internal target.",
  reflection: "Which metric would your own company be least comfortable publishing every quarter, and why is that the one you should be tracking?",
  recall: {
    q: "Why does an S-1 contain unit data that later 10-Ks do not?",
    a: "An S-1 has to support valuation with no trading history, so companies over-disclose customer bands, cohort behaviour and retention. Post-IPO, key business metrics in Item 7 are voluntary, so unflattering ones get dropped.\n\nThe old filing stays on EDGAR, which means the data is still available even when the current 10-K omits it."
  },
  deepDive: "Compare the key business metrics defined in a company's S-1 against its latest 10-K and tell me which were dropped and what the omission implies."
},
{
  id: "filings-competitor-filing",
  track: "filings", level: "model",
  title: "A competitor's filing is the cheapest market research you have",
  source: "Elastic Form 10-K, Item 1 business and competition discussion",
  idea: "A rival's Item 1 describes your shared market under legal liability, which makes it a more disciplined source than any vendor website or analyst grid.",
  why: "Item 1 must describe the business, the markets served and the competitive landscape, and the filing is signed by officers who carry personal liability for material misstatements. That constraint does not eliminate positioning, but it does put a floor under it that marketing material has no reason to respect. Elastic's Item 1 names competitors and describes the segments it is addressing.\n\nRead it in two passes. First pass, extract the claims: which market, which competitors, which differentiation. Second pass, test each claim against Item 7 and Item 8 in the same document. If the company says it is winning enterprise, check the customer threshold counts and the retention metric. If it says a product line is strategic, check whether the revenue note discloses it separately. A claim with no number behind it anywhere in the same filing is positioning, and now you know which parts are which.",
  failureMode: "Sourcing competitive intelligence from a vendor's website or an analyst quadrant, where nobody is liable for anything, and putting it into a strategy document that then justifies a roadmap decision.",
  experiment: "Read the competition discussion in Elastic's latest Item 1. Write down every claim about market position or differentiation, one per line. Then for each, go find the number elsewhere in the same filing that supports it, and score it: supported, unsupported, or contradicted. Report the three scores. Repeat on the company you most directly compete with.",
  reflection: "Which claim in your own company's positioning would score unsupported if a competitor ran this exercise on your filing or your pitch deck?",
  recall: {
    q: "What is the two-pass method for reading a competitor's filing?",
    a: "First pass through Item 1 to extract the claims about market, competitors and differentiation. Second pass through Items 7 and 8 to find a number in the same document that supports or contradicts each claim.\n\nClaims with no supporting number in the filing are positioning, and separating the two is the whole exercise."
  },
  deepDive: "Take a competitor's Item 1 that I paste in, extract every market-position claim, and tell me which numbers elsewhere in the filing would test each one."
},
{
  id: "filings-earnings-call-qa",
  track: "filings", level: "read",
  title: "Prepared remarks are marketing and the question period is the disclosure",
  source: "Form 8-K Item 2.02 results of operations furnishings and the accompanying quarterly earnings call transcript",
  idea: "The unrehearsed cost and margin commentary on an earnings call is in the analyst question period, not the prepared remarks.",
  why: "The quarterly earnings release is furnished on Form 8-K under Item 2.02, drafted by investor relations, reviewed by counsel and finance, and then read aloud almost verbatim in the first half of the call. That half contains nothing the 8-K did not already say.\n\nThe second half is different. Sell-side analysts cover the whole sector, know exactly what the peers disclosed last week, and ask about the thing management chose not to volunteer. Margin questions are the ones to read: an analyst asking why product gross margin moved will frequently get an answer naming the specific driver, a hardware refresh, a data centre migration, a renegotiated cloud contract, a pricing change. That level of causal detail rarely appears in the 10-K in any form.",
  failureMode: "Reading only the press release, concluding a competitor's margin move is unexplained, and building an internal narrative around it, when management already explained the cause in plain language on the call three months ago.",
  experiment: "Pull the most recent Item 2.02 8-K for a company you compete with, plus the call transcript for the same quarter. Read only the question and answer section. Write down every question that touched gross margin or cost of revenue with management's answer in one line each. Then count how many of those facts appear anywhere in the press release. The gap is your answer on where the disclosure lives.",
  reflection: "What did management say about cost structure on the call that you could not have got from any filing, and does it change your view of their architecture?",
  recall: {
    q: "Why is the analyst question period more informative than the prepared remarks?",
    a: "The prepared remarks are the Item 2.02 press release read aloud, so they contain nothing new. The question period puts sector-covering analysts, who know what peers disclosed, in front of management asking about what was not volunteered.\n\nThat is where you get causal explanations for margin movement that never appear in the 10-K."
  },
  deepDive: "Read an earnings call transcript I supply and extract only the cost of revenue and margin exchanges from the question period, with the driver management named in each."
},
{
  id: "filings-10q",
  track: "filings", level: "read",
  title: "The 10-Q is faster and reviewed rather than audited",
  source: "SEC Form 10-Q general instructions; Datadog Form 10-Q",
  idea: "Quarterly filings give you three extra data points a year at a lower assurance level, with condensed footnotes and a risk factors section that is a diff rather than a full statement.",
  why: "Under the Form 10-Q instructions and Rule 10-01 of Regulation S-X, interim statements are condensed and the auditor performs a review rather than an audit. A review is analytical procedures and inquiry; it does not test controls or substantiate balances the way an audit does. Lower assurance buys a much faster turnaround, roughly forty days after quarter end instead of sixty or more.\n\nWhat survives into the 10-Q: the income statement, the revenue disaggregation and segment notes, RPO, and an MD and A comparison. What thins out: accounting policy notes, most commitments detail, and Item 1A, which usually states only material changes since the 10-K. That last one is a feature. A short risk factors section in a 10-Q is a diff, and a new paragraph appearing there mid-year is a company telling you something changed.",
  failureMode: "Waiting for the annual filing to notice a margin trend that was visible three quarters earlier, or reading a 10-Q's two-paragraph Item 1A and concluding the company has almost no risks, when the section only lists what changed.",
  experiment: "Open Datadog's latest 10-Q and time how long it takes you to reach the cost of revenue lines. Then build a four-point quarterly gross margin series from the last four 10-Qs and plot it. Note whether the trend was visible before the annual filing would have shown it. Also read Item 1A and confirm for yourself that it is stated as changes only.",
  reflection: "Does a four-quarter series change any conclusion you had drawn from the annual number alone?",
  recall: {
    q: "What is the trade you make by reading a 10-Q instead of waiting for the 10-K?",
    a: "You get the data roughly four to six months sooner and three extra observations a year, at the cost of a review rather than an audit and condensed footnotes.\n\nItem 1A in a 10-Q states only material changes since the annual filing, so a new paragraph there mid-year is a signal rather than boilerplate."
  },
  deepDive: "Help me build a quarterly gross margin series from a set of 10-Q figures I supply, and tell me whether the trend is signal or seasonality."
},
{
  id: "filings-proxy-incentives",
  track: "filings", level: "read",
  title: "The proxy statement shows what executives are paid to move",
  source: "Datadog DEF 14A proxy statement, compensation discussion and analysis",
  idea: "The incentive plan metrics in the compensation discussion and analysis tell you which numbers leadership will personally defend in a planning meeting.",
  why: "Regulation S-K Item 402 requires the CD&A to describe the objectives of the compensation programme, the measures used in incentive awards, and how performance against them determines payout. So the proxy names the exact metrics and often their weightings, for both the annual cash bonus and any performance share units.\n\nThis is directly usable in a funding argument. If the annual plan weights revenue and free cash flow with no margin component, a gross margin project competes for attention against nothing that pays anyone. If operating margin or free cash flow is in the plan, then framing your infrastructure work as a COGS reduction with a stated payback puts it inside a metric someone senior is compensated on. If the plan is pure growth, reframe the identical work as capacity to serve more tenants at the same spend.",
  failureMode: "Pitching a cost reduction to a leadership team compensated entirely on revenue growth and net retention, and losing the funding to a feature with a worse return, because the feature sits inside somebody's bonus and your project sits outside every one of them.",
  experiment: "Read the CD&A in Datadog's latest DEF 14A. List the performance measures in the annual incentive plan with their weightings, and the measures used in any performance-based equity. Then find your own company's equivalent: a public company has a proxy, a private one has a board deck your VP has read. Write the single sentence that connects your project to the highest-weighted metric, and use it in your next funding conversation.",
  reflection: "Which metric in your leadership's incentive plan does your project move, and can you state the connection in one sentence without hedging?",
  recall: {
    q: "What does the CD&A give you that a strategy deck does not?",
    a: "The specific performance measures and weightings that determine executive payout, disclosed under Regulation S-K Item 402.\n\nThat tells you which numbers leadership is personally paid to move, which predicts what gets funded far better than any stated strategy."
  },
  deepDive: "Help me reframe an infrastructure cost project so it lands inside the highest-weighted metric in my leadership's incentive plan, which I will describe."
},
{
  id: "filings-customer-thresholds",
  track: "filings", level: "read",
  title: "The customer count threshold is chosen, and the choice states the strategy",
  source: "Datadog Form 10-K, Item 7 key metrics, customers above stated ARR thresholds",
  idea: "Customer counts are voluntary disclosures, so the ARR band a company chooses to report above is a statement about which segment it believes it is winning.",
  why: "No rule requires customer counts. They appear as key business metrics in Item 7 because management chose to publish them, which means the bands were selected. A company reporting customers above a six-figure ARR threshold is telling you the enterprise transition is the story it wants judged. Adding a higher band later means the largest accounts became the growth engine. Removing a band means it stopped being flattering, and removal is as informative as addition.\n\nThe counts also give you a clean directional series, which total revenue divided by total customers does not, because that average is a mix artefact. The trap is definitional: read the footnote under the table. Companies differ on whether a customer is a paying account, a contracting entity with subsidiaries rolled up, or something else, and when a definition changes the historical series is not always restated.",
  failureMode: "Comparing two companies' customer counts directly when one counts contracting entities with all subsidiaries consolidated and the other counts paying accounts. The numbers are not the same unit, and the difference is only in the metric definition footnote.",
  experiment: "In the latest Datadog 10-K Item 7 key metrics, write down every customer threshold disclosed and copy the definition footnote. Open the prior year 10-K and check the same table for any change to the bands or the definition. Then write down which customer threshold your own company reports internally, who chose it, and what it would say about your strategy if it were public.",
  reflection: "If your company had to publish one customer band, which one would leadership choose, and what does that choice admit?",
  recall: {
    q: "Why is a change to a disclosed customer threshold worth noticing?",
    a: "Customer counts are voluntary, so the bands are chosen. Adding a higher band signals that large accounts have become the growth story; removing one signals it stopped being flattering.\n\nAlways read the definition footnote, because companies count customers differently and a redefinition can break the series without the history being restated."
  },
  deepDive: "Compare the customer metric definitions of two companies I name and tell me whether their counts are actually comparable."
},
{
  id: "filings-forty-minute-brief",
  track: "filings", level: "decide",
  title: "Read a filing down to a one-page brief in forty minutes",
  source: "Snowflake Form 10-K as the worked example against Items 1A, 7 and 8",
  idea: "A fixed five-stop checklist turns any 10-K into a one-page brief in forty minutes, and the fixedness is what makes the skill survive the day you need it under pressure.",
  why: "Everything you need is always in the same five places, so retrieval should be mechanical rather than exploratory. The order is: revenue disaggregation note for the mix, income statement for gross margin by line, MD and A results of operations for the causation sentences, commitments note for cloud obligations and their maturity, Item 1A for the non-generic risk factors. RPO and the key metrics table if time remains.\n\nThe constraint is the output, not the input. One page: revenue split with the mix shift, product gross margin and its direction, the drivers management named for the cost of revenue change, the committed cloud spend and its shape, and the three specific risk factors. If a finding does not fit on the page it did not matter, and forcing that judgement during the read is what keeps you to forty minutes.",
  failureMode: "Reading a filing without a target question and producing twelve pages of notes you never reopen. Or the other failure, which is opening the filing at nine on the morning of the meeting and discovering the read needs two hours you do not have.",
  experiment: "Do it now. Snowflake's latest 10-K, a timer set to forty minutes, one page against the five headings above. When the timer stops, check your page against Item 8 for anything you got wrong, and note which stop cost you the most time. Keep the template as a file. The second company takes about twenty five minutes and the fourth takes fifteen.",
  reflection: "Which of the five stops slowed you down, and was it the document's layout or your own uncertainty about what you were looking for?",
  recall: {
    q: "Name the five stops of the forty-minute filing read, in order.",
    a: "Revenue disaggregation note for the mix, income statement for gross margin by line, MD and A results of operations for the causation sentences, commitments note for cloud obligations and maturity, Item 1A for the non-generic risk factors.\n\nThe output constraint of a single page is what enforces the time budget, because it forces you to judge relevance while reading rather than afterwards."
  },
  deepDive: "Run the five-stop checklist with me against a filing I choose, and challenge anything I put on the page that does not earn its place."
}
);

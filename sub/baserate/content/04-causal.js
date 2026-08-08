/* Track: Causal structure. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "causal-three-rungs",
  track: "causal", level: "core",
  title: "Association, intervention and counterfactual are three separate rungs and data alone only reaches the first",
  source: "Judea Pearl and Dana Mackenzie, The Book of Why, 2018",
  idea: "Seeing, doing and imagining are formally different queries, and a table of what happened answers only the first of them.",
  why: "Rung one asks what is the probability of Y given that I observe X, which is a function of the joint distribution and nothing else. Rung two asks what is the probability of Y if I set X, written p(y given do(x)), which is a property of a different distribution: the one you would get by intervening. Rung three asks what would have happened to this particular unit had X been different, which requires a model that can generate the unrealised branch. Each rung needs strictly more than the one below it.\n\nThe consequence is unforgiving and it is the whole reason this track exists. No amount of observational data, however clean and however large, promotes a rung-one quantity to a rung-two answer. The promotion is always bought with an assumption supplied from outside the data: a claim about which variables cause which, which you cannot read off the table you are looking at. You can be wrong about that assumption and the data will never tell you.",
  failureMode: "A Grafana panel shows tenants on the new agent planner filing 12 per cent fewer support tickets. That is rung one. The sentence in the deck is that the planner reduces tickets by 12 per cent, which is rung two, and the only thing standing between the two is an unstated belief that early adopters would have filed the same tickets as everyone else. Early adopters are almost never that.",
  experiment: "Take the last review deck or dashboard you presented and pull out three numerical claims. For each, write two lines: the query that produced it, and the sentence the room walked out with. Label each line rung one, two or three. Count the claims where the query was rung one and the takeaway was rung two. That count is your exposure.",
  reflection: "For the claim with the biggest gap between query and takeaway, what assumption would have to be true for the takeaway to follow, and would you defend it out loud?",
  recall: {
    q: "Why can no observational dataset, at any size, answer a do-question on its own?",
    a: "Because p(y given x) and p(y given do(x)) are quantities in two different distributions, and the data only samples the first. Sample size shrinks the error bar on the wrong quantity.\n\nThe bridge between them is a causal assumption about the structure generating the data, which is external to the data and has to be argued for."
  },
  deepDive: "Here are three claims from my last review; for each, tell me which rung the query answered, which rung the audience heard, and what assumption closes the gap."
},
{
  id: "causal-fundamental-problem",
  track: "causal", level: "core",
  title: "You can never observe both outcomes for the same unit",
  source: "Paul W. Holland, Statistics and Causal Inference, Journal of the American Statistical Association, 1986",
  idea: "An individual causal effect is the difference between two potential outcomes of which exactly one is ever realised, so every causal estimate is a missing data problem closed by an assumption.",
  why: "Write Y(1) for what happens to a unit under treatment and Y(0) for what happens to the same unit without it. The causal effect for that unit is Y(1) minus Y(0). You observe one term. The other is not noisy, not badly measured and not expensive to collect: it does not exist. Holland calls this the fundamental problem of causal inference and it is not a practical limitation you can engineer around.\n\nHolland then names the two ways out, and every method you will ever use is one of them. The scientific solution assumes homogeneity: this unit before the change is a valid stand-in for this unit after, or unit A is interchangeable with unit B. The statistical solution gives up on the individual and estimates the average of Y(1) minus Y(0) over a population, which randomisation makes possible because it makes the treated and untreated groups exchangeable in expectation. Nothing recovers the individual effect. When someone asks whether the change helped this tenant, the honest answer starts by saying which of Holland's two substitutions you are making.",
  failureMode: "A before-and-after on p95 workflow latency across a deploy. The pre-deploy day is silently doing duty as Y(0) for the post-deploy population, which assumes the only thing that changed between Tuesday and Wednesday was the deploy. Traffic mix, a customer's backfill and an upstream provider's bad afternoon are all sitting in the estimate with no way to separate them.",
  experiment: "Take one before-and-after number you have quoted in the last month. Write the two potential outcomes as explicit sentences: what you observed, and what you are treating as the unobserved counterpart. Then write the one sentence of assumption that licenses the substitution. If you cannot write that third sentence in under twenty words, the number is a description of two time windows, not an effect.",
  reflection: "Was your missing cell filled by homogeneity across time, homogeneity across units, or randomisation, and which of the three would a sceptical reviewer attack first?",
  recall: {
    q: "Holland says there are two solutions to the fundamental problem. What are they and what does each give up?",
    a: "The scientific solution assumes unit homogeneity or temporal stability, so another unit or another time period stands in for the missing potential outcome. It gives up on the assumption being testable.\n\nThe statistical solution estimates an average effect over a population, typically via randomisation, which makes groups exchangeable. It gives up on the individual effect entirely."
  },
  deepDive: "For this before-and-after comparison I am about to present, write out the two potential outcomes explicitly and name the substitution assumption I am relying on without having said so."
},
{
  id: "causal-draw-the-dag",
  track: "causal", level: "core",
  title: "Draw the graph before you write the query",
  source: "Sander Greenland, Judea Pearl and James M. Robins, Causal Diagrams for Epidemiologic Research, Epidemiology, 1999",
  idea: "A directed acyclic graph makes your causal assumptions explicit and checkable before any estimation, and drawing it usually surfaces the disagreement in the room faster than the analysis would.",
  why: "A DAG is a set of nodes and arrows where an arrow from A to B asserts that A may directly cause B. What carries the weight is not the arrows you draw but the ones you leave out: a missing arrow is a firm claim of no direct effect, and a missing node is a firm claim that no unmeasured common cause exists. Greenland, Pearl and Robins show that once the graph is on paper, questions that were previously matters of taste - is this a confounder, should I adjust for it - become mechanical consequences of the structure.\n\nThe organisational effect is separate from the statistical one and often larger. Two engineers who agree on a metric will routinely disagree about whether tenant size causes both feature adoption and ticket volume, and that disagreement stays invisible in a conversation about which columns to group by. It becomes impossible to hide the moment both of them have to draw the same arrow.",
  failureMode: "A team spends a week arguing about whether to segment an adoption metric by tenant tier, plan, region and seat count. Nobody has said what any of those variables is doing causally, so the argument is about which cuts look interesting rather than which cuts are required, and it terminates when someone gets tired rather than when it is settled.",
  experiment: "Take a claim you have to defend this week. On paper, draw six to eight nodes and every arrow you believe in, including a node for anything unmeasured you think matters. Then have one colleague draw the same graph independently without seeing yours. Count the edges you disagree on. Any count above zero is the real agenda for the next meeting.",
  reflection: "Which single arrow did you and your colleague disagree about, and would the analysis you planned give a different answer under each version?",
  recall: {
    q: "In a causal DAG, which carries the stronger assumption: an arrow you drew or an arrow you omitted?",
    a: "The omission. Drawing an arrow says A may affect B, which is weak and cheap. Omitting one asserts there is no direct effect at all.\n\nThe same applies to nodes: leaving out an unmeasured common cause is the strongest claim on the page, and it is the one nobody notices you made."
  },
  deepDive: "Here is the claim and the variables I have; help me draw the DAG, and be explicit about which absent arrows I am committing to."
},
{
  id: "causal-backdoor",
  track: "causal", level: "core",
  title: "The backdoor criterion tells you exactly what to adjust for",
  source: "Judea Pearl, Causal Diagrams for Empirical Research, Biometrika, 1995",
  idea: "A set of variables identifies the effect of X on Y when it contains no descendant of X and it blocks every path from X to Y that starts with an arrow pointing into X.",
  why: "A backdoor path is any path from treatment to outcome whose first edge points into the treatment. Those are the paths that carry association you did not cause. The criterion has two clauses and both matter: the set must block all of them, and it must contain no descendant of the treatment. When it holds, p(y given do(x)) equals the sum over strata z of p(y given x and z) times p(z), which is exactly the standardised or stratified estimate you already know how to compute.\n\nWhat this buys you is that adjust for everything we have stops being a matter of judgement and becomes a decidable question against a graph. Some variables must be in the set, some must be kept out, and the criterion tells you which. It also tells you when no set of the variables you measured will do, which is a real and useful answer: the effect is not identified from this data and no cleverer regression changes that.",
  failureMode: "A regression on feature adoption with tenant tier, seat count, region, monthly workflow volume and support tickets in the last 30 days as controls. Support tickets in the last 30 days is downstream of adoption. Including it violates the second clause, and the coefficient on adoption is now the effect that does not run through tickets, which is not the number anyone in the room thinks they are reading.",
  experiment: "Take yesterday's DAG. Write down every path from your treatment node to your outcome node that begins with an arrow into treatment. For each, name the variable you would condition on to block it. Then check every variable already in your query against the descendant-of-treatment clause and remove the ones that fail. Rerun the estimate with the corrected set and record both numbers.",
  reflection: "Did the corrected adjustment set move the estimate, and if it barely moved, is that because the confounding was weak or because your graph is missing a node?",
  forecast: { q: "When I rerun my current comparison with the backdoor-justified adjustment set instead of the controls already in the query, will the point estimate move by more than 20 per cent?" },
  recall: {
    q: "State both clauses of the backdoor criterion, and say what the second one protects you from.",
    a: "The set must block every path from treatment to outcome that begins with an arrow into treatment, and it must contain no descendant of the treatment.\n\nThe second clause keeps you from conditioning on things the treatment caused. Doing so either removes part of the effect you are trying to measure, when the descendant is a mediator, or opens a collider path and manufactures bias."
  },
  deepDive: "Given this DAG and this list of columns currently in my query, tell me which ones the backdoor criterion requires, which are harmless, and which must come out."
},
{
  id: "causal-d-separation",
  track: "causal", level: "advanced",
  title: "D-separation is the rule for reading independence off a graph",
  source: "Judea Pearl, Causality: Models, Reasoning, and Inference, second edition, 2009",
  idea: "Chains and forks transmit association until you condition on the middle node, colliders block it until you condition on the collider or a descendant of it, and those three patterns are the entire grammar.",
  why: "Every path between two nodes decomposes into three local shapes. A chain, where A points to B and B points to C, transmits association and is blocked by conditioning on B. A fork, where B points to both A and C, transmits association and is blocked by conditioning on B. A collider, where both A and C point to B, is blocked by default and is opened by conditioning on B or on any descendant of B. A whole path is blocked if any single node along it blocks it; two nodes are d-separated given a set Z if every path between them is blocked.\n\nThe payoff is that d-separation converts graph structure into testable predictions. If your graph says A and C are d-separated given B, then the data must show A and C roughly independent within strata of B. That is a claim you can run. It is also the only part of a causal model you can falsify with observational data, which makes it the cheapest sanity check available before you start estimating anything.",
  failureMode: "Someone conditions on a variable because it is correlated with both treatment and outcome, without asking which of the three shapes it sits in. Correlated with both is equally consistent with a fork, which you should adjust for, and a collider, which you must not. The correlation pattern is identical; only the graph distinguishes them.",
  experiment: "Take your DAG and pick two nodes your graph says should be conditionally independent given some third variable. Test it: in ClickHouse or a spreadsheet, compute the correlation between the two overall, then within each stratum of the conditioning variable. If the within-stratum correlations stay large, your graph is wrong somewhere and you have found it before it cost you an estimate.",
  reflection: "Which implied independence did you test, did it survive, and if it did not, which arrow are you now considering adding?",
  recall: {
    q: "Two variables are correlated with each other and with your treatment. What single question decides whether you adjust for one of them?",
    a: "Which of the three shapes it occupies on the path in question. A non-collider on a backdoor path, chain or fork, should be conditioned on to block it. A collider should be left alone, because conditioning opens it.\n\nThe observed correlations cannot tell you which case you are in. Only the graph can, which is why the graph has to come first."
  },
  deepDive: "From this DAG, list three conditional independences it implies that I can test against my data, ranked by how badly a failure would damage the model."
},
{
  id: "causal-collider",
  track: "causal", level: "advanced",
  title: "Conditioning on a common effect creates a correlation that was never there",
  source: "Felix Elwert and Christopher Winship, Endogenous Selection Bias: The Problem of Conditioning on a Collider Variable, Annual Review of Sociology, 2014",
  idea: "Two independent causes of the same outcome become dependent the moment you restrict to a value of that outcome, so controlling for a downstream variable manufactures the association you then go on to interpret.",
  why: "Suppose an incident fires if either a risky deploy happens or traffic spikes, and the two are independent in the wild. Now look only at incidents. Within that set, learning there was no traffic spike tells you a risky deploy almost certainly happened, because something had to cause the incident. Two independent causes are now strongly negatively associated, and nothing about the world changed: you changed the sample. Elwert and Winship call this endogenous selection bias and show that conditioning, stratifying, filtering and sampling on a common effect are all the same operation.\n\nThe reason this is worth two entries is that it inverts the instinct that more controls make an estimate safer. Adding a variable to a regression is conditioning. If that variable is a common effect of the treatment and the outcome, or of their causes, the adjustment does not reduce bias, it creates bias that did not exist in the unadjusted estimate. There is no amount of data that fixes it and no diagnostic in the regression output that flags it.",
  failureMode: "Among escalated tickets, tenants using the agent feature resolve slower. Escalation is caused both by the feature being involved and by the ticket being hard. Restrict to escalated tickets and you have conditioned on the collider, so feature use and difficulty are now correlated inside your sample. The finding is an artefact of the filter in the WHERE clause.",
  experiment: "Build the smallest possible demonstration and keep it. Generate 10,000 rows with two independent random columns A and B, uniform on zero to one, in ClickHouse or a spreadsheet. Define C as 1 when A plus B exceeds 1.2. Compute the correlation of A and B over all rows, then over rows with C equal to 1. The first should sit near zero, the second clearly negative. Then go find the C in your own most recent query.",
  reflection: "Which filter in your current metric definition is a collider, and what would the number look like without it?",
  forecast: { q: "In my synthetic collider run, will the within-collider correlation between A and B come out below minus 0.3?" },
  recall: {
    q: "Why does adding a control variable sometimes increase bias rather than reduce it?",
    a: "Because adjustment is conditioning, and conditioning on a common effect of two variables makes them dependent. If the control is a collider on a path between treatment and outcome, the unadjusted estimate was unbiased and the adjusted one is not.\n\nNothing in the regression output distinguishes this from a useful control. Only the causal graph does."
  },
  deepDive: "Here is the WHERE clause and the control list for my current analysis; tell me which of these are colliders or descendants of colliders given my DAG."
},
{
  id: "causal-berkson",
  track: "causal", level: "advanced",
  title: "Berkson's paradox is why the population you sampled invented your finding",
  source: "Joseph Berkson, Limitations of the Application of Fourfold Table Analysis to Hospital Data, Biometrics Bulletin, 1946",
  idea: "Restricting to hospitalised patients makes unrelated diseases appear negatively correlated, and restricting to escalated tickets, retried workflows or sampled failures does the same thing to your metrics.",
  why: "Berkson's argument was about hospital records. If either of two conditions raises your chance of being admitted, then among the admitted, having one condition partially explains why you are there and so lowers the odds you have the other. He worked it through as a fourfold table and showed the induced association can be large enough to look like a clinical finding. The structure is the collider from the previous entry, discovered in a specific applied setting three decades before anyone drew the graph.\n\nThe reason to know it by name rather than only as a collider is that hospital admission is the exact shape of most of the data you actually query. Escalated tickets, retried workflows, sampled traces, incidents with a postmortem, tenants who responded to the survey: in every case, membership in the table is caused by several of the variables in the table. The dataset is a hospital and you did not choose the admissions policy.",
  failureMode: "Trace sampling that keeps a trace if it is slow or if it errored. Among sampled traces, latency and error rate look negatively related, so someone concludes that errors fail fast and are cheap. Both statements are properties of the sampling rule. The unsampled population says nothing of the kind.",
  experiment: "Find one table you routinely query that is already filtered by an outcome: failed workflows, escalated tickets, sampled traces. Pick two attributes on it. Compute their correlation within the filtered table, then again over the unfiltered population if you can reach it. If you cannot reach the unfiltered population, that is the finding, and say so in writing. Fall back to the synthetic version: two independent columns admitted when either exceeds a threshold.",
  reflection: "Name the admissions policy for the table you looked at. Who wrote it, and were they thinking about your analysis when they did?",
  recall: {
    q: "You are analysing a table that only contains escalated cases. What is the specific mechanism that can produce a correlation between two genuinely unrelated attributes?",
    a: "If both attributes independently raise the chance of escalation, then within the escalated set they compete to explain why the case is there. Observing one reduces the need for the other, so they appear negatively associated.\n\nBerkson showed this for hospital admission in 1946. The size of the induced association depends on how strongly each attribute drives selection."
  },
  deepDive: "For this filtered table I query daily, work out what the selection rule is and which pairs of columns it could induce a spurious association between."
},
{
  id: "causal-good-and-bad-controls",
  track: "causal", level: "applied",
  title: "Some controls help, some do nothing and some destroy the estimate",
  source: "Carlos Cinelli, Andrew Forney and Judea Pearl, A Crash Course in Good and Bad Controls, Sociological Methods and Research, 2022",
  idea: "For each canonical graph shape there is a settled answer about whether adjusting for a variable removes bias, adds bias or only changes precision, and the paper enumerates them.",
  why: "Cinelli, Forney and Pearl walk through a numbered series of small graphs and give the verdict for each. Good controls block a backdoor path and are required. Neutral controls change nothing about bias but do move the standard error, and the direction depends on which side they sit: a cause of the outcome only improves precision, while a cause of the treatment only makes the estimate noisier. Bad controls are mediators, descendants of the treatment, colliders, and the M-bias case where a variable that is a pure pre-treatment collider opens a path that was closed.\n\nThe M-bias case is the one worth memorising, because it breaks the last rule of thumb people fall back on. Adjust only for pre-treatment variables sounds safe and is not: a pre-treatment variable can be a collider between two unmeasured causes, and conditioning on it opens a path from treatment to outcome that did not exist before. Timing does not classify a control. Only position in the graph does.",
  failureMode: "A reviewer asks why a variable is not in the model and the analyst adds it because it is cheap to add and looks responsible. Nobody asks which shape it occupies. Over three review rounds the model accumulates eleven controls, at least one mediator among them, and the coefficient has drifted with no record of which addition moved it.",
  experiment: "Take the covariate list from the most recent analysis your team ran and put it in a spreadsheet, one row per variable. Add three columns: position in the DAG, verdict from the paper, and keep or drop. Fill every row. Count the drops. Then rerun with the reduced set and record how far the estimate moved.",
  reflection: "How many of your controls were there for a stated causal reason rather than because someone asked for them in review?",
  recall: {
    q: "Why is adjust only for pre-treatment variables an unsafe rule?",
    a: "Because a pre-treatment variable can be a collider between two unmeasured causes, one feeding the treatment and one feeding the outcome. Conditioning on it opens a path that was blocked and introduces bias where there was none. That is M-bias.\n\nWhat classifies a control is its position in the graph, not whether it was measured before treatment."
  },
  deepDive: "Here is my covariate list and my DAG; classify each variable as good, neutral-precision-improving, neutral-precision-harming or bad, and tell me which single drop matters most."
},
{
  id: "causal-mediators",
  track: "causal", level: "advanced",
  title: "Total effect and direct effect are different questions and mediators separate them",
  source: "Tyler J. VanderWeele, Explanation in Causal Inference: Methods for Mediation and Interaction, 2015",
  idea: "Controlling for a mediator gives you the direct effect rather than a cleaner total effect, and natural direct and indirect effects require assumptions strictly stronger than the total effect ever needed.",
  why: "If your feature changes an outcome partly by changing latency, then latency is a mediator. The total effect is what the feature does overall. The controlled direct effect is what it does with latency held fixed at some value. Both are legitimate quantities and they answer different decisions: total effect for should we ship it, direct effect for is there a mechanism here beyond the one we already know about. Adjusting for the mediator does not sharpen the total effect, it silently replaces it.\n\nVanderWeele is precise about the price. Identifying a total effect needs no unmeasured confounding of the treatment-outcome relationship. Decomposing it into natural direct and indirect effects needs that, plus no unmeasured confounding of mediator and outcome, plus no unmeasured confounding of treatment and mediator, plus no confounder of the mediator-outcome relationship that is itself affected by treatment. That last condition is the one that fails in practice and it cannot be fixed by measuring more covariates, because the offending variable is downstream of the treatment by construction.",
  failureMode: "An agent feature improves task success. Someone controls for tokens consumed to see the effect net of cost, gets a much smaller coefficient, and reports that the feature barely works. Tokens are a mediator: the feature works partly by spending more of them. The reported number answers a question nobody asked and undercuts a decision that should have been made on the total effect.",
  experiment: "Pick one metric where you have a plausible mediator sitting in the same table. Compute the difference between groups unadjusted, then again within strata of the mediator. Write both numbers down side by side and label them total and controlled direct. Then write one sentence saying which of the two the decision in front of you actually needs.",
  reflection: "Was the gap between the two numbers treated as noise the last time you saw it, and what was the mediator?",
  recall: {
    q: "You adjust for a mediator and the effect shrinks. What have you learned and what have you not learned?",
    a: "You have learned that part of the effect travels through that mediator, and you now have an estimate of the direct effect. You have not learned that the total effect is smaller than you thought, and you have not found a bias.\n\nThe total effect is unchanged. You computed a different quantity and it needs stronger assumptions than the one you started with."
  },
  deepDive: "Given this metric and this candidate mediator, tell me which of the total effect and the direct effect my current decision actually needs, and what I would be assuming to claim the other."
},
{
  id: "causal-berkeley-simpson",
  track: "causal", level: "core",
  title: "Berkeley was not discriminating in admissions and the aggregate table said it was",
  source: "P. J. Bickel, E. A. Hammel and J. W. O'Connell, Sex Bias in Graduate Admissions: Data from Berkeley, Science, 1975",
  idea: "The university-wide admission rate favoured men while nearly every individual department was neutral or favoured women, because women applied disproportionately to departments that admitted fewer of everyone.",
  why: "In the 1973 Berkeley graduate admissions data, roughly 44 per cent of male applicants and 35 per cent of female applicants were admitted, a gap large enough to look like a legal problem. Bickel, Hammel and O'Connell broke it out by department and the gap mostly vanished or reversed, leaving a small bias in favour of women once department was accounted for. In the largest of the six departments they tabulated, 62 per cent of male applicants and 82 per cent of female applicants were admitted. Department was doing the work: departments differ enormously in how selective they are, and the two groups applied to different mixes.\n\nThis is Simpson's paradox and the important part is that the arithmetic is never in dispute. Both the aggregate and the strata are correct as computed. What decides which one answers your question is causal: department sits between applicant and admission, and if choosing a department is part of the process you are asking about, conditioning on it removes part of what you wanted to measure. The paper is careful about exactly this. There is no rule that says always stratify. There is a graph, and the graph tells you which table to read.",
  failureMode: "A quarterly report shows agent-assisted workflows have a higher failure rate than manual ones. Broken out by workflow type, agent-assisted is equal or better in every type, because the agent is enabled first on the hardest workflows. The aggregate is arithmetically right and operationally backwards, and it will be the number that reaches the exec summary.",
  experiment: "Take an aggregate rate you report weekly, split by a treatment-like flag. Stratify it by the most obvious grouping variable you have: workflow type, tenant tier, region. Count the strata where the sign of the difference flips relative to the aggregate. Then write one sentence saying whether the grouping variable is a common cause of both flag and outcome, which means read the strata, or something the treatment causes, which means read the aggregate.",
  reflection: "Did any stratum flip, and could you defend your choice of table to someone who preferred the other one?",
  forecast: { q: "When I stratify my headline weekly rate by workflow type, will at least one stratum reverse the sign of the aggregate difference?" },
  recall: {
    q: "Both the pooled table and the stratified table are correct. What decides which one you should quote?",
    a: "The causal role of the stratifying variable. If it is a common cause of treatment and outcome, it is a confounder and you read the strata. If the treatment causes it, stratifying removes part of the effect and you read the pooled table.\n\nAt Berkeley, department choice preceded and drove admission rates, so the stratified table was the informative one. No statistical test could have told you that."
  },
  deepDive: "Here is an aggregate that reverses when I stratify; help me work out whether the stratifying variable is a confounder or a mediator, and which table I should put in the deck."
},
{
  id: "causal-ecological-fallacy",
  track: "causal", level: "applied",
  title: "A correlation between group averages is not a correlation between individuals",
  source: "W. S. Robinson, Ecological Correlations and the Behavior of Individuals, American Sociological Review, 1950",
  idea: "Robinson showed the same two variables correlating at about 0.77 across US states and about 0.20 across individuals, and the two numbers have no fixed relationship to each other.",
  why: "Robinson took 1930 census data on race and literacy and computed the correlation two ways. At the individual level it was around 0.20. Across the 48 states, using each state's percentages, it rose to roughly 0.77, and across the nine larger census divisions it was higher still, close to 0.95. Aggregation was not adding precision. It was measuring a different thing, because within-group variation is discarded and any variable that differs between groups gets folded into the association.\n\nRobinson's conclusion is stronger than a caution. He argues that the ecological correlation is not an estimate of the individual correlation at all, so there is no correction factor and no sample size at which they converge. They can differ in magnitude and they can differ in sign. This matters to you because almost every metric you have is already an aggregate: per-tenant averages, per-region rates, per-workflow-type success rates. A relationship between those columns is a statement about tenants, regions and workflow types, not about the requests or users inside them.",
  failureMode: "Tenants with higher agent adoption have higher retention, correlation 0.6 across 200 tenants. The sentence that follows is that users who adopt the agent stay longer. The data cannot support it: large enterprise tenants both adopt more and retain more, and inside any single tenant the individual relationship could be flat or negative.",
  experiment: "Pick a relationship you believe in that you have only ever seen at the aggregate level. Compute it both ways: once across the group means, once across the underlying rows. If you can only get the aggregate version, say so explicitly in whatever you write next. Record the two correlations. A gap of more than a factor of two is common and worth knowing about before someone else finds it.",
  reflection: "Which of the claims you currently make about users are actually claims about tenants?",
  recall: {
    q: "If the correlation across group averages is 0.9, what does that tell you about the correlation across individuals?",
    a: "Almost nothing. Robinson's point is that the ecological correlation is a different quantity, not a noisy version of the individual one, so there is no correction and no convergence with more groups.\n\nThe two can differ by a factor of four, as in his census example, and they can carry opposite signs."
  },
  deepDive: "This correlation is computed across per-tenant averages; tell me what it can and cannot support as a claim, and what row-level query would test the individual version."
},
{
  id: "causal-selection-bias-structure",
  track: "causal", level: "advanced",
  title: "Selection bias is a structural problem with a graph, not a vague worry about sampling",
  source: "Miguel A. Hernan, Sonia Hernandez-Diaz and James M. Robins, A Structural Approach to Selection Bias, Epidemiology, 2004",
  idea: "Loss to follow up, self selection and conditioning on being in the dataset are the same collider structure, which means you can draw the bias and reason about whether adjustment can remove it.",
  why: "Hernan, Hernandez-Diaz and Robins add a selection node S to the graph, where S equals 1 means the unit made it into your analysis, and note that every analysis implicitly conditions on S equal to 1. Bias appears when S is a common effect of the treatment, or a cause of it, and the outcome, or a cause of it. Draw those arrows and the bias is visible as an open collider path. Draw them and find no such pair of arrows, and there is no selection bias regardless of how non-random the sample feels.\n\nThe practical benefit is that it separates selection bias from confounding, which are usually blurred together as sample quality. Confounding is a common cause and is sometimes removable by adjusting for it. Selection bias is a common effect, and adjustment for the selection variable is what created it, so the fix is different: you either need the variables that block the induced path, or inverse probability of selection weights, or you need to admit the effect is not identified from the data you kept.",
  failureMode: "Success rate is computed over workflows that reached a terminal state. Workflows that hang are excluded because they have no outcome row. Whether a workflow hangs depends on both the feature under test and on how hard the task was, which also drives success. The completed-only table conditions on a collider and the feature looks better than it is, by an amount nobody can bound from that table.",
  experiment: "Write down, for your main metric, what S equals 1 means in one sentence: which rows made it in. Then draw the arrows into S. If arrows come from both the treatment side and the outcome side, you have selection bias and you can now say so precisely. Quantify the exposure by counting excluded rows: run the same query without the completion or eligibility filter and compare row counts.",
  reflection: "What fraction of rows does your metric silently exclude, and is that fraction different between your treatment and control groups?",
  recall: {
    q: "What is the structural difference between confounding and selection bias?",
    a: "Confounding comes from a common cause of treatment and outcome. Selection bias comes from conditioning on a common effect of the treatment, or a cause of it, and the outcome, or a cause of it.\n\nThe distinction matters because adjustment is the cure for the first and the cause of the second. For selection bias you need blocking variables, selection weights, or an admission that the data cannot answer it."
  },
  deepDive: "Help me draw the selection node for this metric: here is the query, tell me what conditions on being in the result set and whether that creates a collider path."
},
{
  id: "causal-sutva",
  track: "causal", level: "advanced",
  title: "SUTVA is the assumption you break the moment units interact",
  source: "Guido W. Imbens and Donald B. Rubin, Causal Inference for Statistics, Social, and Biomedical Sciences, 2015",
  idea: "The potential outcomes framework assumes no interference between units and a single version of each treatment, and a shared agent runtime violates both.",
  why: "Writing Y_i(1) and Y_i(0) for unit i already assumes something substantial: that unit i's outcome depends only on unit i's own treatment assignment. Imbens and Rubin call this the stable unit treatment value assumption and split it in two. No interference means one unit's assignment does not affect another unit's outcome. No hidden versions of treatment means that being treated is one well defined thing rather than a family of different things wearing the same label.\n\nBoth fail routinely in a shared runtime. If treated tenants run heavier agent workloads on the same worker pool, they consume capacity that control tenants needed, so control latency degrades and the measured difference is inflated by an amount that has nothing to do with the feature. Hidden versions fails just as quietly: the treatment is a prompt template and a model version that both changed twice during the experiment, so treated is an average over three different interventions and the estimate corresponds to none of them.",
  failureMode: "A 50-50 rollout of an agent feature across tenants sharing one Temporal task queue. Treated workflows queue more work, control workflows wait behind them, and control p95 rises. The experiment reports a latency improvement for the treated arm that is partly a latency regression manufactured in the control arm. Doubling the sample makes the number more precise and no less wrong.",
  experiment: "For your current or next experiment, answer two questions in writing. First, name every resource treated and control units share: task queues, worker pools, rate limits, caches, database connections. Second, list every version of the treatment that shipped during the window, from git log or the feature flag audit trail. Any shared resource is an interference risk; any count above one on the second question means your treatment label is an average.",
  reflection: "Which shared resource is most likely to carry interference in your setup, and what would you have to change to isolate it?",
  recall: {
    q: "Name the two halves of SUTVA and give a runtime example of each failing.",
    a: "No interference: one unit's treatment does not affect another unit's outcome. It fails when treated and control tenants share a worker pool, so treated load degrades control latency.\n\nNo hidden versions of treatment: being treated means one well defined thing. It fails when the prompt template or model version changed mid-experiment, so the treated arm is an average over several distinct interventions."
  },
  deepDive: "Here is my experiment design and the infrastructure the two arms share; tell me where SUTVA breaks and what the direction of the resulting bias would be."
},
{
  id: "causal-identification-conditions",
  track: "causal", level: "core",
  title: "Exchangeability, positivity and consistency are the three conditions every causal estimate rests on",
  source: "Miguel A. Hernan and James M. Robins, Causal Inference: What If, 2020",
  idea: "You need no unmeasured confounding within strata, a nonzero probability of every treatment level in every stratum, and a well defined intervention, and if you cannot state all three your number is a description.",
  why: "Hernan and Robins reduce the whole business to three conditions. Conditional exchangeability says that within strata of your measured covariates, treated and untreated units would have had the same outcome distribution had they been assigned the same way. It is untestable and it is what a DAG and the backdoor criterion are for. Positivity says every stratum contains both treated and untreated units with nonzero probability, otherwise you are extrapolating rather than comparing. Consistency says the observed outcome under the treatment a unit actually received equals that unit's potential outcome under that treatment, which requires the intervention to be well defined enough that there is only one such outcome.\n\nThe useful asymmetry is that only one of the three is untestable. Positivity is an empirical check on your own data: cross-tabulate treatment against your adjustment strata and look for empty cells. Consistency is a writing exercise: state the intervention precisely enough that two engineers would implement it the same way. Doing both takes an afternoon and tells you whether exchangeability is even worth arguing about.",
  failureMode: "An adjusted comparison across tenant tier, region and plan produces a clean-looking number. Three of the twelve strata contain no treated tenants at all and two contain fewer than five. The model interpolated those cells from the functional form. The estimate is partly a property of choosing a linear specification and nothing in the output says so.",
  experiment: "Build the positivity table today. Cross-tabulate your treatment indicator against every variable in your adjustment set, in ClickHouse or a pivot table. Count cells with zero in either arm and cells with fewer than ten. Then write the consistency sentence: what exactly is the intervention, in words precise enough to implement. Both outputs are checkable and both take under an hour.",
  reflection: "How many of your strata were empty or near-empty, and does the estimate survive dropping them?",
  recall: {
    q: "Of exchangeability, positivity and consistency, which can you check against your data and how?",
    a: "Positivity, directly: cross-tabulate treatment against the adjustment strata and look for cells with no treated or no untreated units. Empty cells mean the estimate there comes from the model's functional form, not from data.\n\nConsistency is checked by writing the intervention down precisely rather than by querying. Exchangeability is untestable and rests entirely on the causal graph you argued for."
  },
  deepDive: "Here is my treatment definition and adjustment set; write the positivity cross-tab I should run and tell me whether my intervention is defined precisely enough for consistency."
},
{
  id: "causal-target-trial",
  track: "causal", level: "applied",
  title: "Specify the randomised trial you would have run, then emulate it",
  source: "Miguel A. Hernan and James M. Robins, Using Big Data to Emulate a Target Trial When a Randomized Trial Is Not Available, American Journal of Epidemiology, 2016",
  idea: "Write the protocol first - eligibility, treatment strategies, assignment, start of follow up, outcome, causal contrast, analysis plan - and the ill-defined interventions and immortal time show up before you touch the data.",
  why: "Hernan and Robins argue that most failures of observational analysis are not statistical but specification failures, and that they become visible the moment you are forced to write the protocol of the randomised trial you cannot run. The seven components are ordinary: who is eligible, which strategies are being compared, how assignment happens, when follow up starts, what the outcome is, which contrast you want, how you will analyse it. The discipline is that all seven have to be answered before the query is written.\n\nThe component that catches most errors is when follow up starts. In observational data the tempting choice is the moment a unit adopted the treatment, and that choice guarantees immortal time bias: to be classified as an adopter, a unit had to survive long enough to adopt. Survival gets attributed to the treatment. In a real trial, assignment and start of follow up coincide by construction, which is why writing the protocol makes the problem obvious and why staring at the data does not.",
  failureMode: "Tenants who enabled the agent feature retained better than those who did not, measured from enable date. A tenant that churned in month two never had the chance to enable it in month four, so the non-adopter group is stuffed with early churners by construction. The retention lift is partly a definition, and the size of that part is unknown without redoing the design.",
  experiment: "Open a spreadsheet with seven rows: eligibility, treatment strategies, assignment procedure, start of follow up, outcome and measurement window, causal contrast, analysis plan. Fill every row for a comparison you are currently making. The rows you cannot fill are the finding. Pay particular attention to whether your start of follow up is the same moment as your assignment; if it is not, you have immortal time.",
  reflection: "Which row was hardest to fill, and did filling it change the query you were about to write?",
  forecast: { q: "After writing the seven-row protocol for my current comparison, will I change the start of follow up from what the query currently uses?" },
  recall: {
    q: "What is immortal time bias and which component of the target trial protocol exposes it?",
    a: "It is the bias created when a unit must survive some period in order to be classified into the treated group, so that survival is credited to the treatment. Follow up time before the unit could possibly have been treated is immortal by construction.\n\nThe start-of-follow-up component exposes it. In a randomised trial, assignment and start of follow up coincide; if your observational analysis separates them, you have it."
  },
  deepDive: "Here is the comparison I want to make from historical data; write the target trial protocol for it and tell me which components I cannot currently emulate."
},
{
  id: "causal-probabilities-of-causation",
  track: "causal", level: "advanced",
  title: "Did this change cause that incident is a rung three question with bounds, not a point answer",
  source: "Judea Pearl and Jin Tian, Probabilities of Causation: Bounds and Identification, Annals of Mathematics and Artificial Intelligence, 2000",
  idea: "Probability of necessity and probability of sufficiency are distinct quantities, usually only partially identified, and attribution claims in postmortems assert one of them without saying which.",
  why: "Probability of necessity is the chance that, given the deploy happened and the incident happened, the incident would not have happened without the deploy. Probability of sufficiency is the chance that, given the deploy did not happen and no incident occurred, introducing the deploy would have caused one. They are different numbers and they can be far apart: a change can be necessary for an incident that it is very unlikely to cause in general, which is precisely what a rare interaction looks like.\n\nPearl and Tian show that these are counterfactual quantities, rung three, and that observational and even experimental data usually only bound them rather than pin them down. With no confounding, the excess risk ratio - the incident rate with the change minus the rate without, divided by the rate with - is a lower bound on probability of necessity, and it becomes exactly equal to it under monotonicity, meaning the change never prevents an incident that would otherwise have occurred. So there is a computable number here, but it is a bound with named conditions rather than an answer, and the conditions belong in the document rather than in your head.",
  failureMode: "A postmortem says the root cause was the connector deploy. Read as probability of necessity it claims the incident would not have happened otherwise, which the timeline cannot establish because two other changes landed the same hour. Read as probability of sufficiency it claims the deploy would generally cause this, which the 40 identical deploys that caused nothing contradict. The sentence is doing both jobs and neither is checked.",
  experiment: "Take your last three postmortems. For each root cause sentence, mark whether it is claiming necessity or sufficiency. Then compute the crude bound for one of them: from incident records, get the incident rate in deploy windows and in matched non-deploy windows, and form the excess risk ratio as rate with minus rate without, over rate with. Write that number next to the sentence and label it a lower bound on necessity that only holds if the deploy windows are otherwise comparable.",
  reflection: "For the root cause you tested, was the excess risk ratio anywhere near the confidence the postmortem expressed?",
  recall: {
    q: "Distinguish probability of necessity from probability of sufficiency, and say why a postmortem needs to pick one.",
    a: "Necessity: given both the change and the incident occurred, the chance the incident would not have occurred without the change. Sufficiency: given neither occurred, the chance that introducing the change would have produced the incident.\n\nA rare interaction can score high on necessity and very low on sufficiency. Root cause statements read as necessity claims but are usually defended with sufficiency-style evidence, and the two need different data."
  },
  deepDive: "Here is a root cause statement from a postmortem; tell me whether it is a necessity or a sufficiency claim and what data would bound it."
}
);

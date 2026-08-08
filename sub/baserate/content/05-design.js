/* Track: Study design and identification. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "design-randomisation-reference-distribution",
  track: "design", level: "core",
  title: "Randomisation buys you a known distribution for the test statistic, not balance in your particular trial",
  source: "Ronald A. Fisher, The Design of Experiments, 1935",
  idea: "The physical act of randomising is what licenses the reference distribution you compare your result against.",
  why: "Fisher's argument is mechanical. If you physically randomise assignment, then under the null of no treatment effect each unit's outcome is fixed and only the labels moved. You can enumerate every assignment that could have happened, recompute the statistic under each, and read off where your observed value sits. The p-value is a statement about the randomisation you actually performed, not about an assumed population or an assumed error distribution.\n\nWhat randomisation does to confounding follows from the same fact. It makes the distribution of every covariate, measured or not, the same across arms in expectation. In any single trial an unmeasured covariate can split badly. The guarantee is over repetitions, and the reference distribution already prices that variability in. So randomisation converts confounding from a thing you must argue about into a thing with a known error rate.",
  failureMode: "You run a fifty-fifty split on an agent feature, notice after the fact that the treatment arm caught more enterprise tenants, and quietly reweight. Your p-value no longer corresponds to any enumerable set of assignments, and the only guarantee Fisher gave you is the one you just discarded.",
  experiment: "Take the last completed A/B or canary you have in ClickHouse or Grafana. Instead of trusting the t-test, run a permutation test: hold the outcome column fixed, shuffle the arm labels ten thousand times, recompute the difference in means each time, and count the fraction of shuffles at least as extreme as the observed difference. Compare that to the p-value your dashboard reports. If you have no experiment to hand, generate two hundred synthetic rows with a true effect of zero and confirm the permutation p-values come out roughly uniform.",
  reflection: "How far apart were the permutation p-value and the parametric one, and would that gap have changed the ship decision?",
  recall: {
    q: "Why does physically randomising, rather than assuming a model, license the p-value you report?",
    a: "Under the null the outcomes are fixed and only the assignment labels vary, so the set of assignments that could have occurred is enumerable and the p-value is read off that reference distribution.\n\nNothing about the population distribution has to be assumed. The randomisation itself is the probability model."
  },
  deepDive: "Help me write a permutation test for my last rollout and state exactly what the reference distribution is in that setup."
},
{
  id: "design-no-baseline-balance-tests",
  track: "design", level: "applied",
  title: "Never run a significance test on baseline covariates",
  source: "Stephen Senn, Testing for Baseline Balance in Clinical Trials, Statistics in Medicine, 1994",
  idea: "In a randomised trial the null hypothesis a baseline balance test examines is true by construction, so the test carries no information.",
  why: "Senn's point is that the arms were drawn from the same distribution because you drew them that way. The test is therefore calibrated to reject at its nominal rate and every rejection is a false positive. A small p-value on a baseline covariate tells you a coin came up heads, not that the trial is compromised.\n\nThe decision that actually matters is whether to adjust for a covariate, and that should be made on prognostic grounds before the data exist. If tenant size predicts the outcome, adjust for it whether or not it looks balanced. If it does not predict the outcome, adjusting because a chance imbalance appeared makes the model choice a function of the realised data, which inflates the error rate and buys nothing.",
  failureMode: "The Table 1 with p-values habit. Twenty baseline covariates, one lands at p equals 0.03, and someone asks to rerun the randomisation. You have now conditioned the entire analysis on a coin flip, and the rerun is not a fresh randomisation, it is a search.",
  experiment: "Pull the assignment table from your most recent experiment. Compute standardised mean differences, the difference in means divided by the pooled standard deviation, for the five covariates you believe most strongly predict the outcome. Do not compute p-values. Then write the covariate adjustment list for the next experiment, commit it to the repo before that experiment starts, and check afterwards whether it survived contact with the readout.",
  reflection: "Which covariates made your prespecified adjustment list, and what evidence rather than intuition put each one there?",
  recall: {
    q: "Randomisation was executed correctly and a baseline covariate comes out at p equals 0.02. What has gone wrong?",
    a: "Nothing. Under correct randomisation the null of no baseline difference is true by construction, so a small p-value is a false positive arriving at exactly the advertised rate.\n\nThe right response is to keep to the prespecified adjustment set chosen on prognostic grounds, not to react to the imbalance."
  },
  deepDive: "Look at my experiment's baseline table and tell me which covariates deserve prespecified adjustment on prognostic grounds."
},
{
  id: "design-rct-not-automatically-top",
  track: "design", level: "core",
  title: "An RCT is not automatically better evidence than a well designed observational study",
  source: "Angus Deaton and Nancy Cartwright, Understanding and Misunderstanding Randomized Controlled Trials, Social Science and Medicine, 2018",
  idea: "Randomisation gives an unbiased estimate of an average effect in the trial sample and says nothing about precision, mechanism or transport.",
  why: "Deaton and Cartwright separate three things that get conflated. Unbiasedness is a property of the estimator over hypothetical repetitions and says nothing about the error in your one trial. Precision is a separate matter: randomising does not shrink variance, and with the skewed outcomes typical of latency, spend or token counts a single trial can be badly off while remaining perfectly unbiased. And the estimand is a sample average, which with heterogeneous effects can be a number that describes nobody in the sample.\n\nThe average effect also carries no mechanism. It does not tell you why the effect appeared, so it does not tell you whether it will appear in a different tenant, a different region or on the next model version. An observational study with a credible identification argument plus a known mechanism can support a stronger claim about what happens next than a clean trial with no theory attached. That is why a fixed hierarchy of evidence, with RCTs pinned at the top, misleads.",
  failureMode: "\"We ran an A/B, so this is settled.\" The A/B ran for two weeks on self-serve tenants with a median of four connected assets, the effect was carried by a handful of heavy users, and the feature now ships to enterprise accounts with hundreds of thousands of assets. Internally valid, externally irrelevant.",
  experiment: "Take the last A/B decision you signed off. Write three sentences: the exact population that was randomised, the estimand you actually estimated, and the population the decision now governs. Then query ClickHouse for the share of traffic under that decision which was represented in the randomised sample. Record the number.",
  reflection: "What fraction of the traffic your last decision governs was actually in the trial, and does that number bother you?",
  forecast: { q: "Will the share of currently governed traffic that was represented in my last A/B come out below fifty per cent?" },
  recall: {
    q: "Randomisation makes the estimate unbiased. Name three things it does not give you.",
    a: "Precision, mechanism and transportability. Unbiasedness is a property over repetitions, not a bound on the error in this trial, and randomising does nothing to reduce variance.\n\nIt also produces a sample average that may describe no individual unit, and it explains nothing about why the effect occurred, which is what you would need to predict whether it recurs elsewhere."
  },
  deepDive: "Given the population I randomised and the population my decision now covers, tell me which specific claim my A/B actually supports."
},
{
  id: "design-design-before-outcomes",
  track: "design", level: "core",
  title: "Design the observational study before you look at the outcomes",
  source: "Paul R. Rosenbaum, Design of Observational Studies, 2010",
  idea: "Every choice about comparison groups, matching and covariates must be fixed while the outcomes are still hidden.",
  why: "Rosenbaum's framing is that an observational study should be built to imitate the randomised experiment you cannot run. The design stage, meaning who is compared with whom, on which covariates, with what caliper and over what outcome window, corresponds exactly to the part of a trial that happens before any outcome exists. Do that part with outcomes visible and you can search, consciously or not, over specifications until the answer is agreeable. No interval computed afterwards accounts for that search.\n\nFixing the design first also makes the study checkable. A design settled in advance can be assessed against balance diagnostics, which use no outcome data, and can carry a prespecified sensitivity analysis. A design tuned against the outcome is indistinguishable from an untuned one when someone else reads the doc, which is precisely why the discipline has to be procedural rather than a matter of good intentions.",
  failureMode: "A \"did the new planner help?\" analysis where the analyst tries three definitions of the comparison cohort, keeps the one where the difference clears significance, and reports that one. The other two never appear in the document and nobody who reads it can tell.",
  experiment: "For an observational comparison you are about to run, say tenants who adopted a feature versus those who did not, write the design document first: cohort definitions, the covariates you will match or adjust on, the outcome window, and the sensitivity analysis you will report. Commit it before you run a single query touching the outcome column. Then run it once and report what comes out.",
  reflection: "Did you change anything in the design after seeing the first outcome number, and if so, exactly what?",
  recall: {
    q: "What does it mean to say an observational study has a design stage, and how do you know you are still in it?",
    a: "The design stage is every decision that a randomised trial would make before outcomes exist: cohorts, matching, covariates, calipers, outcome window, sensitivity analysis. You are still in it if all your diagnostics use covariates only.\n\nThe moment you look at an outcome, further design changes become an outcome-informed search that no downstream p-value corrects for."
  },
  deepDive: "Review my observational design document and tell me which of its choices could only have been made by someone who had already seen the outcome."
},
{
  id: "design-propensity-score-balancing",
  track: "design", level: "core",
  title: "The propensity score reduces a many-dimensional balancing problem to one number",
  source: "Paul R. Rosenbaum and Donald B. Rubin, The Central Role of the Propensity Score in Observational Studies for Causal Effects, Biometrika, 1983",
  idea: "The probability of treatment given the covariates is a balancing score: conditioning on it balances every covariate that went into it.",
  why: "Rosenbaum and Rubin's result is that if treatment assignment is strongly ignorable given a covariate vector X, it is also strongly ignorable given the single number e(X), the probability of treatment given X. So instead of hunting for comparison units that match on twenty covariates, which fails in high dimension because nothing matches on everything at once, you match on one number and the twenty balance in expectation.\n\nThe scope of the guarantee is exactly the covariates in the model. The score does nothing whatever about anything unmeasured. A propensity model with thirty predictors is not more robust to hidden confounding than one with three; it balances thirty things rather than three. Overlap matters too: units with fitted scores near zero or one have no counterparts, so dropping them silently redefines the estimand as the effect over the region of common support.",
  failureMode: "You match tenants on region, plan tier, seat count and connector count, then report the adopters' retention advantage. What actually drove adoption was one engaged data steward, which you never recorded. The propensity score cannot see her, so the estimate stays confounded no matter how tidy the balance table looks.",
  experiment: "Fit a logistic regression of \"adopted feature X\" on the tenant covariates you already have in ClickHouse. Take the fitted probability for each tenant and plot two histograms of it, treated and untreated, on the same axis. Read off the number of treated tenants whose score exceeds the largest untreated score. Those have no possible comparison unit and must leave the analysis; count them and say what fraction of the treated group they were.",
  reflection: "How many treated tenants fell outside common support, and what does dropping them do to the population your estimate describes?",
  recall: {
    q: "What exactly does conditioning on the propensity score buy you, and what does it leave untouched?",
    a: "It reduces balancing on many covariates to balancing on one number: given strong ignorability on X, conditioning on the scalar probability of treatment given X balances X in expectation.\n\nIt leaves untouched everything not in X. Unmeasured confounding is entirely unaffected by the size or sophistication of the propensity model."
  },
  deepDive: "Here are the covariates in my propensity model; name the confounder most likely missing from it and how I could proxy for it."
},
{
  id: "design-matching-is-a-design-choice",
  track: "design", level: "applied",
  title: "Matching is a design choice with named failure modes",
  source: "Elizabeth A. Stuart, Matching Methods for Causal Inference: A Review and a Look Forward, Statistical Science, 2010",
  idea: "The matching method is a decision with explicit trade-offs, and the only thing that validates it is covariate balance after matching.",
  why: "Stuart lays out the axes: with or without replacement, one-to-one or one-to-many, caliper or no caliper, nearest neighbour on the score or exact on a few key variables, greedy or optimal or full matching. Each buys balance at a price. A caliper improves balance but discards treated units, which changes the estimand from the effect on all treated to the effect on the matchable treated. Matching with replacement improves balance but cuts the effective sample size and needs a variance formula that accounts for reused controls.\n\nNone of this is settled by argument. The check is the balance table: standardised mean differences for every covariate before and after, plus variance ratios and something about the tails, because two distributions can share a mean and differ everywhere else. Because these diagnostics use no outcome data, you may iterate on the matching method as much as you like without contaminating anything. That is what the design stage is for.",
  failureMode: "One-to-one nearest neighbour matching with no caliper on a data set where the treated group is far smaller than the control pool. Every treated unit gets a \"match\", several of them absurd, and the balance table is never printed. The paired means look reassuring and the pairs are junk.",
  experiment: "Take the propensity model from the previous entry. Match one-to-one nearest neighbour twice: once with no caliper, once with a caliper of 0.2 standard deviations of the logit of the score. Print standardised mean differences for every covariate under both, plus the count of treated units retained. Note which covariates the caliper fixed and how much sample it cost.",
  reflection: "Which covariate had the worst standardised mean difference after matching, and is it one that predicts your outcome?",
  forecast: { q: "Will the calipered match bring every covariate's standardised mean difference below 0.1?" },
  recall: {
    q: "You cannot decide between two matching specifications. What do you compare, and why is it safe to keep iterating?",
    a: "Compare balance: standardised mean differences for every covariate, variance ratios, and the tails, along with how many treated units each specification retains.\n\nIt is safe to iterate because none of those diagnostics touch the outcome, so the search cannot bias the effect estimate. Iterating after you have seen the outcome is a different activity entirely."
  },
  deepDive: "Here is my post-matching balance table; tell me whether this match is good enough to interpret and which covariate worries you most."
},
{
  id: "design-propensity-matching-paradox",
  track: "design", level: "advanced",
  title: "Propensity score matching can increase imbalance the harder you try",
  source: "Gary King and Richard Nielsen, Why Propensity Scores Should Not Be Used for Matching, Political Analysis, 2019",
  idea: "Pruning observations to tighten a propensity score match can make covariate imbalance worse, and it gets worse the more you prune.",
  why: "King and Nielsen's argument turns on what the score approximates. Matching on the propensity score targets a completely randomised experiment, where covariates balance only on average, rather than a fully blocked experiment, where they balance within strata. Once pruning has taken you to the point where the remaining units resemble a completely randomised sample, every further pair you remove is removed essentially at random with respect to the covariates. Deleting units at random from an already balanced set does not improve balance; on average it degrades it, while also raising variance and model dependence.\n\nThe mechanism is dimension collapse. Two units with the same propensity score can differ wildly in the underlying covariates, because the score only summarises the probability of treatment, not the covariate profile. Methods that use the covariates directly, such as Mahalanobis distance matching, coarsened exact matching or full matching on covariates, target the blocked experiment instead and do not exhibit the paradox.",
  failureMode: "An analyst tightens the caliper from 0.2 to 0.05, reports that the match is now \"tighter\", and the balance table quietly degrades on two covariates while the pair count halves. The point estimate moves and nobody can say whether that was the better balance, the smaller sample, or noise.",
  experiment: "Rerun your match at a sequence of calipers: 0.5, 0.2, 0.1, 0.05, 0.02. For each one record the number of matched pairs and the mean absolute standardised difference across all covariates. Plot mean imbalance against units pruned. If the curve bottoms out and then turns upward, you have reproduced the paradox on your own data and you know where to stop.",
  reflection: "Where did your imbalance curve bottom out, and were you about to prune past that point?",
  recall: {
    q: "Why can pruning more aggressively on the propensity score make balance worse rather than better?",
    a: "Because propensity matching approximates a completely randomised experiment, not a blocked one. Past the point where the matched set already looks randomised, further pruning removes units at random with respect to covariates, which on average worsens balance and increases variance and model dependence.\n\nMatching on the covariates directly, for example Mahalanobis or coarsened exact matching, targets the blocked experiment and avoids this."
  },
  deepDive: "Plot my imbalance-versus-pruning curve from these caliper runs and tell me which caliper to fix on."
},
{
  id: "design-sensitivity-gamma",
  track: "design", level: "advanced",
  title: "State how strong the hidden confounder would have to be to overturn your result",
  source: "Paul R. Rosenbaum, Observational Studies, second edition, 2002",
  idea: "A sensitivity analysis reports the amount of hidden bias your conclusion can absorb before it stops holding.",
  why: "Rosenbaum's device is a parameter, conventionally Gamma, that bounds how much two units with identical measured covariates may differ in their odds of receiving treatment. Gamma equal to 1 is the randomised case. Gamma equal to 2 says one unit of a pair could be twice as likely to be treated for reasons you never observed. For each Gamma you compute the worst-case p-value across every hidden assignment pattern consistent with that bound, and you report the largest Gamma at which the worst case is still significant.\n\nThis converts \"but there could be confounding\" from an unanswerable objection into a quantity domain experts can argue about. Saying the conclusion survives to Gamma equal to 3.5 invites the useful question of whether any plausible unmeasured factor could triple the odds of treatment. That is a conversation about the world rather than about statistics, and it is one your reviewers are qualified to have.",
  failureMode: "An observational readout that ends \"we controlled for the main confounders\". A reviewer says \"what about self-selection\", the discussion goes in circles because neither side has a number, and the study dies of an objection that might have been worth 1.2 on the Gamma scale.",
  experiment: "Take a matched-pair observational comparison you already have, adopters versus matched non-adopters on a binary outcome. Count the discordant pairs, meaning the pairs where exactly one unit succeeded. Under a given Gamma the probability that a discordant pair favours treatment is bounded between 1/(1+Gamma) and Gamma/(1+Gamma). Recompute the one-sided binomial p-value using the unfavourable bound for Gamma equal to 1, 1.5, 2 and 3, and report the largest Gamma that still clears 0.05. Two counts and a spreadsheet.",
  reflection: "What Gamma did your result survive to, and can you name a real unmeasured factor of that strength?",
  recall: {
    q: "What does the sensitivity parameter Gamma quantify, and why is reporting it better than saying you adjusted for confounders?",
    a: "Gamma bounds how much two units with identical measured covariates could differ in their odds of treatment because of something unmeasured. You report the largest Gamma at which the worst-case p-value still clears your threshold.\n\nIt is better because it turns an unfalsifiable objection into a number, so the argument becomes whether any real factor is that strong rather than whether confounding is conceivable."
  },
  deepDive: "Walk me through computing a Rosenbaum sensitivity bound on my matched pairs and tell me what Gamma is defensible in my domain."
},
{
  id: "design-e-value",
  track: "design", level: "applied",
  title: "The E-value is a sensitivity analysis you can compute from a risk ratio alone",
  source: "Tyler J. VanderWeele and Peng Ding, Sensitivity Analysis in Observational Research: Introducing the E-Value, Annals of Internal Medicine, 2017",
  idea: "The E-value is the minimum association an unmeasured confounder would need with both treatment and outcome to explain away your observed effect.",
  why: "For an observed risk ratio RR of at least 1, the E-value is RR plus the square root of RR times RR minus 1. It is the smallest value such that an unmeasured confounder associated with both the treatment and the outcome by at least that much, on the risk ratio scale and conditional on the measured covariates, could account for the whole observed association. If RR is below 1, take its reciprocal first and apply the same formula.\n\nCompute it twice: once for the point estimate and once for the confidence limit closest to the null, which is the number that should drive the decision. A risk ratio of 1.2 has an E-value of about 1.69. A risk ratio of 2 has an E-value of about 3.41. It requires no additional data and no assumption about the confounder's direction or distribution, which is exactly why it is cheap enough to make routine on every observational claim you publish internally.",
  failureMode: "A readout claims a twenty per cent relative lift in weekly active usage among tenants who enabled the agent. That is an E-value of about 1.69, which a mild unmeasured factor clears easily: engaged tenants both switch on new features and use the product more. Nobody computed it, so the twenty per cent went onto a QBR slide unqualified.",
  experiment: "Find the last observational relative-difference claim in one of your documents and express it as a risk ratio. Compute RR plus the square root of RR times RR minus 1 for both the point estimate and the confidence limit nearer the null. Write both numbers into the document beside the claim. A spreadsheet with two cells is enough.",
  reflection: "What was the E-value at the confidence limit, and can you name a covariate already in your data with an association that strong?",
  forecast: { q: "Will the E-value at the confidence limit for my next observational claim come out below 2?" },
  recall: {
    q: "State the E-value formula for a risk ratio above 1 and say precisely what quantity it describes.",
    a: "E-value equals RR plus the square root of RR times RR minus 1. For a risk ratio below 1, take the reciprocal first.\n\nIt is the minimum strength of association, on the risk ratio scale, that an unmeasured confounder would need with both the treatment and the outcome, conditional on measured covariates, to fully explain away the observed effect."
  },
  deepDive: "Compute E-values for the point estimate and confidence limit of this claim and tell me whether the number is defensible."
},
{
  id: "design-find-the-accident",
  track: "design", level: "applied",
  title: "Look for the accident in the world that assigned treatment for you",
  source: "Joshua D. Angrist and Jorn-Steffen Pischke, Mostly Harmless Econometrics, 2009",
  idea: "Identification comes first and estimation second, so the question to ask is what variation in the treatment is as good as randomly assigned.",
  why: "Angrist and Pischke open with four questions: what is the causal relationship of interest, what experiment could ideally measure it, what is your identification strategy, and what is your mode of statistical inference. The third is where most production analyses fall over. You need to name the accident: a rollout order set by a scheduler, a regional feature flag, a capacity limit, a pricing tier boundary, a migration wave. Once you can name it, the estimator follows almost mechanically.\n\nThe discipline protects you in the other direction too. Most causal claims in product analytics fail at the identification question, and discovering that in ten minutes is worth far more than three days of specification search that produces a confidently wrong coefficient. If there is no accident, the honest output is a descriptive claim, clearly labelled as one.",
  failureMode: "A regression of retention on \"used the agent at least once\" with fifteen controls. There is no accident anywhere in it, because tenants chose to use the agent. The coefficient describes who chose, dressed up as an effect of choosing.",
  experiment: "Pick a causal question your team currently answers with a controlled regression or a raw cohort comparison. Write out Angrist and Pischke's four questions and answer each in a sentence. Then go looking through your systems for one accident: a Temporal workflow rollout ordered by something unrelated to tenant quality, a flag enabled by region, a queue threshold, a scheduler tie-break. Either name it or write down that there isn't one.",
  reflection: "Did you find an accident, and if not, what does that mean for the claim you were about to make?",
  recall: {
    q: "What is the identification question, and what should you do when the honest answer is that there is no accident?",
    a: "It asks what variation in the treatment is as good as randomly assigned, and it must be answered before any estimator is chosen.\n\nWhen there is no such variation, no set of controls rescues the regression. Downgrade the claim to a description of who selected into treatment, and label it that way."
  },
  deepDive: "Here is my causal question and the systems I have; help me find any variation in treatment that is plausibly as good as random."
},
{
  id: "design-late-compliers",
  track: "design", level: "advanced",
  title: "An instrument estimates the effect on compliers only",
  source: "Joshua D. Angrist, Guido W. Imbens and Donald B. Rubin, Identification of Causal Effects Using Instrumental Variables, Journal of the American Statistical Association, 1996",
  idea: "Under relevance, exclusion, independence and monotonicity, instrumental variables recovers the average effect for the subgroup the instrument moved.",
  why: "Angrist, Imbens and Rubin partition the population by response to the instrument: always-takers, never-takers, compliers and defiers. Monotonicity is the assumption that there are no defiers. Always-takers and never-takers contribute nothing, because the instrument does not change their treatment status, so the Wald ratio, the difference in outcomes divided by the difference in take-up, is the average effect among compliers. That is the local average treatment effect.\n\nThe complier group is defined by the instrument rather than chosen by you, and no unit can be individually identified as one. What you can do is estimate its size, which is just the first-stage difference in take-up, and characterise it by comparing complier covariate means against the population. Do that before you report anything, because a LATE estimated off eight per cent of your users is a fact about those eight per cent.",
  failureMode: "You use \"was shown the upgrade banner\" as an instrument for \"enabled the agent\". The banner also changes what users expect the product to do, so it reaches the outcome through a channel other than enablement. Exclusion fails, and the whole banner effect gets divided by a small take-up difference, which inflates the estimate rather than merely biasing it.",
  experiment: "For any instrument you are considering, compute the first stage: take-up rate among instrumented units minus take-up rate among the rest. That difference is your complier share. If it is under about ten per cent, note that the estimate will be both narrow in scope and imprecise, since a small denominator magnifies everything. Then write one sentence naming the channel through which exclusion could fail, and one saying why you believe it does not.",
  reflection: "What is your complier share, and how do those users differ from the population on the covariates you have?",
  recall: {
    q: "Name the four IV assumptions and say what makes the estimand local rather than average.",
    a: "Relevance, exclusion, independence and monotonicity. Relevance means the instrument moves take-up, exclusion that it affects the outcome only through take-up, independence that it is as good as randomly assigned, monotonicity that nobody responds in the opposite direction.\n\nIt is local because the instrument only shifts compliers, so only their outcomes enter the ratio. Monotonicity is what makes that subgroup coherent by ruling out defiers."
  },
  deepDive: "Assess my proposed instrument against relevance, exclusion, independence and monotonicity, and tell me which one is weakest."
},
{
  id: "design-threshold-natural-experiment",
  track: "design", level: "applied",
  title: "A threshold in an existing policy is a natural experiment",
  source: "Donald L. Thistlethwaite and Donald T. Campbell, Regression-Discontinuity Analysis: An Alternative to the Ex Post Facto Experiment, Journal of Educational Psychology, 1960",
  idea: "Units just above and just below a cutoff are comparable, so a jump in the outcome at the cutoff identifies the effect there.",
  why: "Thistlethwaite and Campbell's original case was awards handed out above a test score cutoff. Whatever generally determines the running variable, close enough to the threshold the difference between 79 and 80 is noise. So if everything else is continuous at the cutoff and the outcome jumps, the jump is attributable to the treatment. You get an estimate without anyone having run an experiment.\n\nThe assumption with teeth is that nobody can precisely manipulate their position on the running variable. If units can place themselves just over the line, then the ones just above differ from the ones just below in exactly the way that matters. The standard diagnostic is the density of the running variable at the cutoff: a spike on one side, or a hole on the other, is evidence of sorting. Note also that the estimate is local to the cutoff, so a discontinuity at a hundred-seat threshold says nothing about ten-seat tenants.",
  failureMode: "Rate limits and quota tiers are full of thresholds and full of manipulation. If tenants approaching a thousand-asset limit trim assets to stay under it, then the ones just below the line are the careful ones and the ones just above are not. The discontinuity you measure is the effect of being careful.",
  experiment: "List the numeric thresholds already baked into your product and infrastructure: rate limits, quota tiers, retry caps, plan boundaries, autoscaling triggers, timeout values. Pick one and plot a fine-binned histogram of the running variable around the cutoff in ClickHouse. Look for a spike or a hole. A smooth density means you have a candidate natural experiment; a lumpy one means you have discovered that people game the threshold, which is worth knowing on its own.",
  reflection: "Which threshold had a smooth density, and what outcome would you compare either side of it?",
  forecast: { q: "Will the density of the running variable at the threshold I picked look smooth at the cutoff, with no visible spike or hole?" },
  recall: {
    q: "What single assumption does a regression discontinuity design stand on, and how do you check it?",
    a: "That nobody can precisely manipulate their position on the running variable, so assignment just either side of the cutoff is effectively arbitrary.\n\nYou check it by plotting the density of the running variable around the cutoff and looking for a spike or a hole, which would indicate sorting. The estimate is also local to the cutoff and does not extrapolate."
  },
  deepDive: "Here are the thresholds in my system; tell me which is the best regression discontinuity candidate and what would invalidate it."
},
{
  id: "design-parallel-trends",
  track: "design", level: "core",
  title: "Difference in differences works only if the untreated trend would have been parallel",
  source: "David Card and Alan B. Krueger, Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania, American Economic Review, 1994",
  idea: "Subtracting the control group's change from the treated group's change removes fixed differences and common shocks, and nothing else.",
  why: "Card and Krueger compared fast food employment in New Jersey, where the minimum wage rose, with eastern Pennsylvania, where it did not, before and after the change. Differencing within each state removes anything fixed about that state; differencing across states removes anything that hit both in the same period. What survives is the treatment effect plus any difference in the underlying trends.\n\nThat last term is the whole game, and it is a counterfactual, so it is not testable. What you can do is look at pre-treatment periods and check whether the two series moved together before treatment. Parallel pre-trends are evidence, not proof, because something could have changed at exactly the moment treatment did. Note also that parallel trends is scale-dependent: two series parallel in levels are generally not parallel in logs, so the functional form is part of the assumption rather than a presentation choice.",
  failureMode: "You compare tenants who got the new agent runtime in the first wave against those who did not, before and after. The first wave was chosen because those tenants were growing and vocal. They were already on a steeper trajectory, and your difference in differences hands that trajectory to the rollout.",
  experiment: "Take a rollout you can put a date on. In ClickHouse, pull the weekly metric for treated and untreated groups for at least eight weeks before the rollout and plot both series. Do not compute the difference in differences yet. Look at the pre-period: are the lines parallel, and are they still parallel in logs as well as levels? Compute the estimate only if the answer is yes, and if it is no, say so instead of estimating.",
  reflection: "Were your pre-trends parallel in levels, in logs, in both or in neither?",
  recall: {
    q: "Difference in differences removes two things and assumes a third. Name all three.",
    a: "It removes time-invariant differences between the groups and shocks common to both groups over the period. It assumes the two groups' outcomes would have moved in parallel in the absence of treatment.\n\nThat assumption is a counterfactual and therefore untestable. Parallel pre-trends are supporting evidence only, and parallelism depends on scale, so levels and logs are different assumptions."
  },
  deepDive: "Look at my pre-period series for treated and control and tell me whether parallel trends is credible here in levels or in logs."
},
{
  id: "design-staggered-twfe",
  track: "design", level: "advanced",
  title: "Staggered rollouts break the standard difference in differences estimator",
  source: "Andrew Goodman-Bacon, Difference-in-Differences with Variation in Treatment Timing, Journal of Econometrics, 2021",
  idea: "With staggered timing the two-way fixed effects coefficient is a weighted average of every two-group comparison in the data, and some weights can be negative.",
  why: "Goodman-Bacon decomposes the two-way fixed effects estimate into every possible two-by-two comparison: early-treated against never-treated, late-treated against never-treated, early against late before the late group switches on, and the troublesome one, late-treated against already-treated early units used as controls. The weights come from group sizes and the variance of the treatment indicator within each pair, which peaks for cohorts treated near the middle of the panel.\n\nIf treatment effects are constant over time, the already-treated comparison is harmless because the early group's effect differences out. If effects grow or decay, which is the normal case for a product rollout where adoption ramps for weeks after enablement, the early group's changing effect enters that comparison with the opposite sign. The aggregate coefficient can then be smaller than every individual unit's effect, or the wrong sign entirely.",
  failureMode: "A phased rollout across tenants over six months, analysed with a tenant fixed effect, a week fixed effect and a treated dummy. Adoption ramps for three months after each tenant is switched on. The coefficient lands near zero and someone concludes the feature does nothing, when what happened is that late switchers were compared against early switchers mid-ramp.",
  experiment: "For your last staggered rollout, list the distinct treatment start dates, the number of units in each cohort, and the number of units never treated. If the never-treated group is small, most of the identification is coming from cohort-against-cohort comparisons and the standard estimator is at risk. Then run an event study instead: regress the outcome on leads and lags relative to each unit's own treatment date and plot the coefficients. A flat pre-period and a ramping post-period is the picture you want.",
  reflection: "How many never-treated units did you have, and what did the event study plot look like before treatment?",
  recall: {
    q: "Why does a staggered rollout with a ramping effect break the standard two-way fixed effects estimator?",
    a: "Because the coefficient is a weighted average of all two-by-two comparisons, including ones that use already-treated units as controls for later-treated units.\n\nWhen the effect changes over time, the already-treated control group's own evolving effect enters with the opposite sign, so those comparisons can carry negative weight and drag the aggregate towards zero or past it."
  },
  deepDive: "Here are my rollout cohorts and their start dates; tell me whether two-way fixed effects is safe and what to run instead."
},
{
  id: "design-transportability",
  track: "design", level: "advanced",
  title: "Transporting a result to a new population is a separate identification problem",
  source: "Elias Bareinboim and Judea Pearl, Causal Inference and the Data-Fusion Problem, Proceedings of the National Academy of Sciences, 2016",
  idea: "Whether a finding carries to a new population is a formal question with its own criteria, not a judgement call.",
  why: "Bareinboim and Pearl add selection diagrams: the causal graph for the source population, annotated with markers on the mechanisms that differ in the target. Given that diagram there are algorithms that decide whether the target effect is computable from source experimental data plus target observational data, and if it is, they return the formula. The answer can also be no, in which case no reweighting scheme recovers it and you need fresh measurement.\n\nThe practical content is that transport requires you to name what differs. If the only difference between trial tenants and new tenants is the distribution of a covariate you measured, and that covariate does not modify the mechanism in some unmeasured way, you can reweight. If what differs is the mechanism itself, a different model version, a different retrieval path, a different definition of the outcome metric, then the estimate does not transport and reweighting on tenant demographics only conceals that.",
  failureMode: "An agent accuracy number established on English-language, Snowflake-backed tenants gets quoted for a Databricks-backed tenant operating in another language. The difference is not a covariate distribution, it is a different retrieval path and a different judge prompt. Reweighting by tenant size cannot repair it.",
  experiment: "Take your headline agent quality number and the population it was measured on. On paper, draw the small graph: input distribution, retrieval, model, judge, outcome. Mark every node where the target population differs from the measured one. Count how many marked nodes sit on the causal path to the outcome. For each one, write down what you would have to measure in the target population to transport the number.",
  reflection: "How many nodes did you mark, and is the honest answer that you need a fresh measurement rather than a reweighting?",
  recall: {
    q: "What does a selection diagram add to a causal graph, and what question does it let you answer?",
    a: "It annotates the graph with markers on the mechanisms that differ between the source and target populations.\n\nWith it you can decide formally whether the target effect is identifiable from source experimental data plus target observational data, and obtain the transport formula when it is. When it is not identifiable, the answer is that you must measure in the target rather than reweight."
  },
  deepDive: "Help me draw the selection diagram between the population I measured agent quality on and the tenant I am about to quote it for."
}
);

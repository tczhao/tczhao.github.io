/* Track: Uncertainty and intervals. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "uncertainty-wald-fails",
  track: "uncertainty", level: "core",
  title: "The Wald interval fails precisely at small n and extreme p",
  source: "Lawrence D. Brown, T. Tony Cai and Anirban DasGupta, Interval Estimation for a Binomial Proportion, Statistical Science, 2001",
  cheat: "Use Wilson, not Wald, for proportions: 1 failure in 30 traces means the rate could be one in six, not zero.",
  idea: "The textbook interval for a proportion, p-hat plus or minus 1.96 times the square root of p-hat times one minus p-hat over n, has coverage that oscillates chaotically and can sit far below 95 percent even at large n.",
  why: "The Wald interval estimates its own standard error from the same p-hat it is centred on. When p-hat lands near zero or one, that estimated standard error shrinks towards zero, so the interval narrows exactly when the estimate is least trustworthy. At p-hat of zero or one it collapses to a point, which claims perfect certainty from the least informative possible data.\n\nBrown, Cai and DasGupta computed exact coverage rather than trusting the asymptotics, and found it is not a smooth approach to 95 percent from below. It jumps around as n and p move, because the underlying binomial is discrete, and the dips do not disappear with sample size. Their recommendation is the Wilson score interval, which inverts the test using the null standard error instead: it centres at p-hat plus z squared over 2n, all divided by one plus z squared over n, so it is pulled towards one half and never leaves the zero-to-one range.",
  failureMode: "You judge 30 agent traces and 1 fails. Wald gives a failure rate of 0.033 plus or minus 0.064, so the lower bound is negative and you round it to zero and tell the review the failure rate could be zero. Wilson gives roughly 0.006 to 0.167, which is the honest statement: the failure rate could be one in six.",
  experiment: "Enumerate exact coverage yourself in twenty lines of Node or a spreadsheet. Fix n at 40. For each true p from 0.01 to 0.50 in steps of 0.01, sum the binomial probability of every outcome x from 0 to 40 whose Wald interval contains p. Plot the result against p. Checkable output: the minimum coverage across that grid, which will be well under 0.95 and will not be a smooth curve. Repeat with Wilson and compare the minimum.",
  reflection: "What is the smallest denominator in any percentage currently on your team's dashboard, and what does its Wilson interval look like?",
  recall: {
    q: "Why does the Wald interval get narrower exactly when your estimate is least reliable?",
    a: "Its half-width is driven by the square root of p-hat times one minus p-hat, which is estimated from the same data. As p-hat approaches zero or one that quantity approaches zero, so the interval shrinks to nothing at the extremes.\n\nWilson avoids this by inverting the score test, so the width is set by the range of true p values consistent with the data rather than by a plug-in estimate."
  },
  forecast: { q: "When I recompute the Wilson interval for the headline pass rate on our current agent eval, will the lower bound sit below the threshold we have been quoting as met?" },
  deepDive: "Here is a proportion I have to defend in a review, with its numerator and denominator: compute the Wald, Wilson and Agresti-Coull intervals and tell me which decisions change."
},
{
  id: "uncertainty-se-vs-sd",
  track: "uncertainty", level: "core",
  title: "Standard error and standard deviation answer different questions",
  source: "Douglas G. Altman and J. Martin Bland, Standard Deviations and Standard Errors, BMJ, 2005",
  idea: "The standard deviation describes how spread out the observations are and does not shrink with more data, while the standard error describes how precisely you know a summary statistic and shrinks as one over the square root of n.",
  why: "Standard deviation is a property of the population you are sampling. If agent latency has a standard deviation of four seconds, collecting a million more traces will not change that; it will only pin the number down more exactly. Standard error is a property of your estimate. The standard error of the mean is the standard deviation divided by the square root of n, so it goes to zero as you collect more data.\n\nAltman and Bland make the practical point that the two get confused because both are reported as plus or minus a number after a mean. The test is what the reader should conclude. Mean plus or minus one standard deviation says roughly two thirds of individual cases fall in that band. Mean plus or minus two standard errors says the true mean is plausibly in that band. Those are different claims and the second is always narrower, so quoting the standard error when someone wanted the spread makes your system look far more consistent than it is.",
  failureMode: "A latency slide says p50 is 3.1 seconds plus or minus 0.1. Someone reads that as a guarantee that nearly every request lands between 3.0 and 3.2 and writes it into an SLO. It was a standard error over 40,000 requests. The actual spread has a standard deviation of 4 seconds and the p99 is 22 seconds.",
  experiment: "Pull one day of agent run durations from ClickHouse. Compute the standard deviation and the standard error of the mean. Then take a random 10 percent subsample and compute both again. Checkable output: the standard deviation is roughly unchanged, the standard error is about three times larger. If the standard deviation moved much, your metric is not stationary within the day and that is a separate finding worth writing down.",
  reflection: "Find one plus-or-minus on a dashboard or slide your team owns. Which of the two is it, and which did the reader assume?",
  recall: {
    q: "You double your sample size. What happens to the standard deviation and to the standard error of the mean?",
    a: "The standard deviation is an estimate of population spread, so it stays roughly the same and just becomes better determined. The standard error of the mean falls by a factor of the square root of two, about 29 percent.\n\nThis is why standard error is the wrong number to quote when someone asks how variable the system is, and the right one when they ask how well you know the average."
  },
  deepDive: "I have a metric with a mean, a standard deviation and a sample size: tell me which of the two dispersion numbers belongs on the slide given the decision the audience is making."
},
{
  id: "uncertainty-ci-not-probability",
  track: "uncertainty", level: "core",
  title: "A confidence interval does not contain the parameter with 95 percent probability",
  source: "Rink Hoekstra, Richard D. Morey, Jeffrey N. Rouder and Eric-Jan Wagenmakers, Robust Misinterpretation of Confidence Intervals, Psychonomic Bulletin and Review, 2014",
  idea: "The only defensible reading of a 95 percent confidence interval is that the procedure that produced it covers the true value 95 percent of the time in repeated use, not that this particular interval has a 95 percent chance of containing the parameter.",
  why: "Once you have computed an interval from data, the true parameter is either inside it or it is not. There is no probability left in a frequentist framework, because the parameter is not random. The randomness lived in the sampling, and the 95 percent is a property of the recipe, not of the output of one run of the recipe.\n\nHoekstra and colleagues put six false statements about an interval in front of first-year students, master's students and working researchers. All three groups endorsed them at broadly similar rates, and the researchers were not meaningfully better than the students. That is the useful finding: this is not a gap that seniority closes, so you should assume the misreading is live in every review you sit in, including your own head. If you want a statement of the form there is a 95 percent probability the value is in here, you need a Bayesian credible interval and an explicit prior.",
  failureMode: "The eval shows a 4 point improvement with an interval of minus 1 to plus 9. Someone says there is a 95 percent chance the true gain is between minus 1 and 9, and then reasons that since most of the interval is positive, there is roughly a 90 percent chance the change helped. Neither the probability nor the arithmetic on top of it is licensed by a confidence interval.",
  experiment: "Simulate the definition. Draw 1,000 samples of n equals 40 from a Bernoulli with true p equals 0.30, compute a Wilson interval for each, and count how many contain 0.30. Checkable output: a count near 950. Then pick any single one of those intervals and note that it either contains 0.30 or does not. That is the whole distinction in one script.",
  reflection: "Write the sentence you would actually say in a review to describe an interval, without using the word probability. Does it still carry the point you needed to make?",
  recall: {
    q: "What does the 95 percent in a 95 percent confidence interval attach to?",
    a: "To the procedure, over hypothetical repetitions of the sampling. If you repeated the study many times, 95 percent of the intervals the method produces would cover the true value.\n\nOnce a specific interval is computed, the parameter is either in it or not. Any probability statement about this particular interval needs a prior and a Bayesian credible interval."
  },
  deepDive: "Rewrite this interval statement from my review deck so that it is technically correct and still lands with a non-statistical audience."
},
{
  id: "uncertainty-plus-four",
  track: "uncertainty", level: "applied",
  title: "Adding two successes and two failures fixes most of the small sample problem",
  source: "Alan Agresti and Brent A. Coull, Approximate Is Better Than Exact for Interval Estimation of Binomial Proportions, The American Statistician, 1998",
  idea: "Add two to the successes and two to the failures, then run the ordinary Wald formula on the adjusted counts, and you get near nominal coverage with arithmetic you can do in a spreadsheet.",
  why: "The adjustment is p-tilde equals x plus 2 over n plus 4, then p-tilde plus or minus 1.96 times the square root of p-tilde times one minus p-tilde over n plus 4. The two pseudo-successes and two pseudo-failures drag the centre towards one half, which is exactly where the Wald standard error stops collapsing. It approximates the Wilson centre with no extra algebra.\n\nAgresti and Coull's argument in the title is the one worth internalising: the approximate interval beats the exact one on average coverage, because exactness in the Clopper-Pearson sense buys a guarantee by being far too wide almost everywhere. Plus four is the interval to reach for when you are standing at a whiteboard with a numerator and a denominator and no statistics package.",
  failureMode: "Two of forty traces failed. Wald says 0.05 plus or minus 0.068, so minus 0.018 to 0.118, and you quietly clip the negative bound. Plus four says 4 over 44 equals 0.091, interval 0.006 to 0.176. The upper bound moved from 12 percent to 18 percent, which is the difference between shipping and running another forty traces.",
  experiment: "Take three real proportions your team quotes, ideally with different denominators, and compute Wald and plus four for each in a spreadsheet. Checkable output: for each one, the absolute difference in the upper bound. Note which of the three has a decision that flips. If none do, you have learnt that your intervals are not currently load-bearing, which is also worth knowing.",
  reflection: "For the tightest denominator you found, what would the plus four interval need to look like before you would sign off?",
  recall: {
    q: "State the plus four interval and say why the pseudo-counts help.",
    a: "Compute p-tilde as x plus 2 over n plus 4, then apply the usual Wald formula using p-tilde and n plus 4 throughout.\n\nThe pseudo-counts pull the centre away from zero and one, which is where the Wald standard error collapses towards zero and produces absurdly narrow or out-of-range intervals."
  },
  forecast: { q: "For the next eval batch I review, will the plus four upper bound on the failure rate exceed our stated tolerance?" },
  deepDive: "Give me a spreadsheet-ready formula for the plus four interval and check my arithmetic on these three proportions."
},
{
  id: "uncertainty-clopper-pearson",
  track: "uncertainty", level: "advanced",
  title: "The exact binomial interval is exact about the wrong thing",
  source: "C. J. Clopper and E. S. Pearson, The Use of Confidence or Fiducial Limits Illustrated in the Case of the Binomial, Biometrika, 1934",
  idea: "Clopper-Pearson guarantees coverage of at least 95 percent by being systematically wider than it needs to be, which is a real cost paid for a guarantee you probably did not need.",
  why: "Clopper and Pearson built the interval by inverting the exact binomial test: the bounds are the values of p at which the observed count sits at the tail cutoff. Because the binomial is discrete, you can almost never hit exactly 5 percent in the tails, so the construction takes the next conservative step. The result is coverage of at least 95 percent, often 97 or 98 percent, and never below.\n\nThe word exact refers to the use of the exact binomial distribution rather than a normal approximation. It does not mean the interval is exactly 95 percent, and in practice it is not. Wider intervals mean you fail to detect real differences you could have detected at the same sample size. If the cost of overstating your certainty is a regulator or a safety claim, take the guarantee. If the cost is another week of labelling because the interval straddled your threshold, you have bought insurance against a risk you were not carrying.",
  failureMode: "A team adopts exact intervals across the board because exact sounds rigorous. Every eval comparison now straddles zero, nothing ever reaches a conclusion, and the practical response is that people stop putting intervals on anything.",
  experiment: "For n equals 50 and x equals 10, compute Clopper-Pearson, Wilson and plus four. Clopper-Pearson bounds come from the beta quantiles: lower is the 0.025 quantile of Beta(x, n minus x plus 1), upper is the 0.975 quantile of Beta(x plus 1, n minus x). Checkable output: the three widths, ranked. Clopper-Pearson will be widest. Decide, in writing, which decision in your current quarter would justify that extra width.",
  reflection: "Name a number you report where you would genuinely rather be too wide than too narrow. If you cannot name one, that tells you which default to pick.",
  recall: {
    q: "What is exact about the exact binomial interval, and what is the price?",
    a: "It uses the exact binomial distribution rather than a normal approximation, and it guarantees coverage of at least the nominal level. It is not exactly 95 percent.\n\nThe price is systematic over-width, which reduces your ability to detect real differences at a fixed sample size."
  },
  deepDive: "Given the decision I am about to make and its asymmetric costs, argue for or against using Clopper-Pearson rather than Wilson here."
},
{
  id: "uncertainty-bootstrap",
  track: "uncertainty", level: "core",
  title: "The bootstrap turns any statistic into an interval by resampling your own data",
  source: "Bradley Efron, Bootstrap Methods: Another Look at the Jackknife, Annals of Statistics, 1979",
  idea: "Resample your observations with replacement, recompute the statistic on each resample, and the spread of those recomputed values estimates the sampling distribution of the statistic.",
  why: "The logic is a substitution. You want the distribution of your statistic under repeated sampling from the population, but you only sampled once. Efron's move is to treat the empirical distribution of your data as a stand-in for the population and sample from it. Draw n observations with replacement, compute the statistic, repeat a few thousand times, and take the 2.5th and 97.5th percentiles of the results.\n\nThe reason this matters for your work is that closed-form standard errors exist for means and proportions and essentially nothing else you care about. p95 latency, the ratio of two rates, the median cost per resolved ticket, the difference in trimmed means between two agent versions: none of these have a standard error you can look up, and all of them are one loop away from an interval. The bootstrap does not require you to know the shape of the underlying distribution, which is the whole point.",
  failureMode: "The p95 latency chart shows 22 seconds this week against 19 last week and someone declares a regression. Nobody has any idea how much a p95 over 3,000 runs moves week to week from noise alone. A bootstrap on last week's runs alone would have shown a p95 interval of 17 to 24 seconds.",
  experiment: "Pull one week of agent run durations from ClickHouse into a list. Resample with replacement 2,000 times, take the p95 of each resample, and read off the 2.5th and 97.5th percentiles of those 2,000 numbers. Checkable output: an interval around your p95. Compare its width to the week-on-week change your team last treated as a signal.",
  reflection: "Which recurring chart in your review would look different if every point on it carried a bootstrap interval?",
  recall: {
    q: "What population does the bootstrap actually sample from, and why is that legitimate?",
    a: "It samples from the empirical distribution of your data, drawing n observations with replacement. The substitution is legitimate when your sample is a reasonable stand-in for the population, which requires independent observations and a sample large enough for the empirical distribution to be a decent approximation.\n\nWhat you get back is the sampling variability of the statistic, which lets you build an interval for statistics that have no closed-form standard error."
  },
  deepDive: "Write me the twenty lines of code to bootstrap an interval for this specific statistic on this specific column, and tell me what could make it wrong."
},
{
  id: "uncertainty-bootstrap-limits",
  track: "uncertainty", level: "advanced",
  title: "The bootstrap fails at the tails, at the extremes and when the data are dependent",
  source: "Bradley Efron and Robert J. Tibshirani, An Introduction to the Bootstrap, 1993",
  idea: "Percentile bootstrap intervals are biased for skewed statistics and BCa corrects much of that, but no bootstrap variant rescues you for maxima, for very small samples, or for observations that are not independent.",
  why: "Three distinct failures. First, bias and skew: the plain percentile interval assumes the bootstrap distribution is centred and symmetric around the truth, which fails for things like variance ratios and correlations. BCa adjusts for bias and for how the standard error changes with the parameter, and Efron and Tibshirani treat it as the default rather than an optional refinement.\n\nSecond, extremes. The bootstrap estimate of the sample maximum is broken by construction: resampling can never produce a value larger than the largest observation you saw, so the bootstrap distribution of the maximum is a lump of atoms below a hard ceiling. Any statistic that depends on the far tail inherits some of this. Third, dependence. Resampling individual rows destroys the correlation structure, so if your traces come in bursts, or repeat per tenant, or share a prompt template, the plain bootstrap will report intervals that are far too narrow. The fix is to resample the independent unit: whole tenants, whole sessions, whole blocks of time.",
  failureMode: "You bootstrap 5,000 agent traces to get an interval on the failure rate and get plus or minus 0.6 points. But those traces came from 30 tenants and failures cluster hard by tenant schema. Resampling tenants instead of traces gives plus or minus 3 points, and only the second number is honest.",
  experiment: "Take your trace table and bootstrap the same statistic two ways: resampling rows, and resampling the assignment unit, whichever that is, tenant or session or workflow. Checkable output: the ratio of the two interval widths. If it is above about 1.5, every row-level interval your team has ever quoted on this metric is too narrow.",
  reflection: "What is the independent unit in your data, and can you actually name it, or have you been assuming it is the row?",
  recall: {
    q: "Name the three situations where the bootstrap does not save you, and the fix for each where one exists.",
    a: "Skewed or biased statistics, where BCa corrects for bias and for a standard error that changes with the parameter. Extreme-value statistics like the maximum, where there is no fix because resampling cannot exceed the largest observed value. Dependent data, where the fix is to resample the independent unit rather than the row: whole clusters, sessions or blocks.\n\nSmall samples are a fourth caveat: with very few observations the empirical distribution is a poor stand-in for the population and no resampling scheme repairs that."
  },
  deepDive: "Look at the structure of this dataset and tell me what the correct resampling unit is and whether BCa is worth the extra code here."
},
{
  id: "uncertainty-power-analysis",
  track: "uncertainty", level: "core",
  title: "Power analysis tells you the sample size you need before you look at the data",
  source: "Jacob Cohen, Statistical Power Analysis for the Behavioral Sciences, second edition, 1988",
  idea: "Power is the probability of detecting an effect of a stated size if it is real, and fixing the smallest effect worth detecting is what converts a vague ambition into a countable number of labelled examples.",
  why: "Four quantities are locked together: sample size, effect size, significance level and power. Fix any three and the fourth follows. The one that people skip is effect size, because naming it forces you to say out loud how much improvement would actually change your decision, and that is a product question rather than a statistical one.\n\nFor comparing two proportions the working rule is n per arm of roughly 16 times p times one minus p, divided by the squared difference you want to detect, for 80 percent power at the 5 percent level. Put your real numbers in. Going from an 80 percent pass rate to 85 percent needs about 900 items per arm. That is the honest answer, and it is almost always more than the eval set you have. Cohen's contribution was also cultural: he documented how routinely published work was underpowered, and the same is true of eval sets today.",
  failureMode: "You run 100 prompts against both agent versions, see 78 against 83 percent, and cannot conclude anything. With 100 per arm the design had roughly 15 percent power to detect a 5 point difference, so the result was uninformative before you started. The two days of labelling were spent to learn nothing.",
  experiment: "Take the comparison you most want to run this quarter. Write down the current rate and the smallest improvement that would change your decision. Compute 16 times p times one minus p divided by that difference squared. Checkable output: one number, the items needed per arm. Put it next to the size of the eval set you actually have.",
  reflection: "If the required n is more than you can label, which do you move: the effect size you will accept, the power you will accept, or the plan?",
  recall: {
    q: "What is the quantity people leave out of a power calculation, and why is leaving it out fatal?",
    a: "The minimum effect size worth detecting. Without it the calculation has no answer, because sample size, effect size, alpha and power are four quantities with three degrees of freedom.\n\nIt gets skipped because naming it is a product decision, not a statistical one: you have to state how much improvement would actually change what you do."
  },
  forecast: { q: "Will the eval set I plan to use for the next ship decision be at least half the size that a power calculation says I need?" },
  deepDive: "Here is my current rate, my target improvement and my labelling budget: tell me what power I actually have and what I should change."
},
{
  id: "uncertainty-type-s-and-m",
  track: "uncertainty", level: "advanced",
  title: "An underpowered study that reaches significance has overstated the effect",
  source: "Andrew Gelman and John Carlin, Beyond Power Calculations: Assessing Type S (Sign) and Type M (Magnitude) Errors, Perspectives on Psychological Science, 2014",
  idea: "When power is low, the estimates that clear the significance threshold are the exaggerated ones by construction, so the useful questions are the probability of getting the sign wrong and the expected inflation factor.",
  why: "Significance is a filter on the magnitude of the estimate. To reach it, the estimate must be at least about two standard errors from zero. If the true effect is small relative to the standard error, the only samples that pass that filter are the ones where noise happened to push the estimate up. So conditional on being significant, the estimate is inflated. This is a mechanical consequence of the filter, not a bias in anyone's conduct.\n\nGelman and Carlin name two quantities. The type S error rate is the probability that a significant estimate has the wrong sign. The type M error, or exaggeration ratio, is the expected magnitude of a significant estimate divided by the true effect. In their worked example, a design with power around 6 percent carries roughly a one-in-four chance of getting the sign backwards and inflates the effect by close to an order of magnitude. Both are computable from an assumed true effect and your standard error, before you have any data.",
  failureMode: "A 60-item eval shows the new prompt beating the old one by 12 points, significant. You ship it and the production metric moves by 1 point. Nobody committed fraud. A 60-item eval could only have produced a significant result if the observed gap was large, so the significant result was guaranteed to overstate whatever was really there.",
  experiment: "Take a recent significant eval result. Assume the true effect is the size you would consider a genuine win, say a third of what you observed. Simulate: draw 10,000 studies at your actual n with that true effect, keep only the significant ones, and take the mean of their estimates. Checkable output: the ratio of that mean to the true effect you assumed. If it is above 2, your significant results are not usable as effect size estimates.",
  reflection: "Which shipped change in the last year had a production impact far smaller than its eval result predicted, and was the eval underpowered?",
  recall: {
    q: "Why is a significant result from an underpowered study biased upward?",
    a: "Significance requires the estimate to be roughly two standard errors from zero. When the true effect is small relative to the standard error, only the samples where noise pushed the estimate away from zero clear that bar.\n\nConditioning on significance therefore selects the exaggerated estimates. The exaggeration ratio quantifies it, and the type S error rate gives the probability that the sign is wrong as well."
  },
  deepDive: "Given my sample size and a plausible true effect, compute the type S error rate and exaggeration ratio for the result I am about to present."
},
{
  id: "uncertainty-paired-comparison",
  track: "uncertainty", level: "applied",
  title: "Running both variants on the same inputs removes the between-item variance for free",
  source: "George E. P. Box, J. Stuart Hunter and William G. Hunter, Statistics for Experimenters, second edition, 2005",
  idea: "A paired design analyses the within-pair differences, so item difficulty cancels and you detect the same effect with far fewer items than an unpaired design needs.",
  why: "In an unpaired comparison, the variance you are fighting is the variance across items: some prompts are hard for every model and some are easy for every model, and that spread swamps the difference you care about. Pair the design, run both variants on the same item, and analyse the per-item difference. Item difficulty appears in both terms and subtracts out.\n\nThe arithmetic: the variance of a difference is Var(A) plus Var(B) minus twice the covariance. With equal variances and a correlation of 0.7 between the two variants' scores on the same item, the paired variance is 0.6 times sigma squared against 2 times sigma squared unpaired, a factor of more than three fewer items for the same precision. Box, Hunter and Hunter's classic illustration is two shoe sole materials tested on the left and right foot of the same ten boys, where the pairing removes the enormous variation in how hard individual boys are on their shoes. Your eval items are the boys. For pass or fail outcomes the analogue counts only the items where the two variants disagree, since the ones where both pass or both fail carry no information about the difference.",
  failureMode: "Someone splits the 400-item eval set into two halves, runs the old agent on one half and the new one on the other, and compares. The comparison now carries the full between-item variance plus whatever imbalance the split introduced, for no gain. Running both on all 400 costs twice the inference and buys several times the precision.",
  experiment: "Take your last A-versus-B eval where both variants saw the same items. Compute the difference two ways: as the difference of the two mean scores with an unpaired standard error, and as the mean of the per-item differences with its own standard error. Checkable output: the ratio of the two standard errors, and the correlation between the two variants' per-item scores. The higher that correlation, the bigger the free win.",
  reflection: "Is there anywhere in your current eval pipeline where the two arms do not see identical inputs, and is there a real reason for it?",
  recall: {
    q: "Where does the precision gain in a paired comparison come from?",
    a: "From the covariance term. The variance of a per-item difference is Var(A) plus Var(B) minus twice the covariance between them, so any variation shared by both arms, principally item difficulty, cancels out.\n\nThe more strongly the two variants' scores correlate across items, the larger the reduction. At a correlation of 0.7 the paired variance is under a third of the unpaired one."
  },
  deepDive: "Look at how my eval harness assigns items to variants and tell me whether I am leaving a paired analysis on the table."
},
{
  id: "uncertainty-cuped",
  track: "uncertainty", level: "applied",
  title: "Pre-period data shrinks your variance without changing your estimate",
  source: "Alex Deng, Ya Xu, Ron Kohavi and Toby Walker, Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data, WSDM, 2013",
  idea: "CUPED subtracts off the part of the metric that a pre-experiment covariate predicts, cutting variance by roughly the square of the correlation while leaving the treatment effect unbiased.",
  why: "Take your outcome Y and a covariate X measured before the experiment started, typically the same metric over the previous fortnight. Define Y adjusted as Y minus theta times X minus the mean of X, where theta is the covariance of Y and X divided by the variance of X. Because X was measured before assignment, it cannot be affected by treatment, so subtracting it removes variance without shifting the expected difference between arms. The variance of the adjusted metric is the original variance times one minus rho squared, where rho is the correlation between Y and X.\n\nThat squared relationship is worth internalising. A correlation of 0.5 buys you 25 percent variance reduction. A correlation of 0.9 buys 81 percent, which is a fourfold effective increase in sample size. Deng and colleagues reported large reductions on real Bing metrics using the same metric from the pre-period as the covariate, which is almost always the strongest available predictor.",
  failureMode: "A team wants to test a change to agent routing but per-tenant usage is wildly heterogeneous, so the metric is dominated by which large tenants landed in which arm. They conclude the experiment needs six weeks. The pre-period usage for those same tenants is available and correlates at 0.85 with the outcome, which would have cut the required duration by most of that.",
  experiment: "Pick a metric you track per tenant in ClickHouse. Pull it for two consecutive fortnights. Compute the correlation between the two periods. Checkable output: rho, and one minus rho squared, which is the fraction of variance a CUPED adjustment would leave you with. Anything above rho of 0.6 means you are currently running experiments substantially longer than necessary.",
  reflection: "Which of your experiment metrics has a pre-period version available, and has anyone ever checked its autocorrelation?",
  recall: {
    q: "Why does adjusting for a pre-experiment covariate not bias the treatment effect?",
    a: "Because the covariate was measured before randomisation, treatment cannot have influenced it. Its expected value is the same in both arms, so subtracting a multiple of it shifts both arms equally and leaves the difference unchanged.\n\nAdjusting for a covariate measured after assignment would not be safe, since treatment could have moved it and you would be conditioning on a collider or removing part of the effect."
  },
  forecast: { q: "When I compute the fortnight-to-fortnight correlation for our main per-tenant experiment metric, will it come out above 0.6?" },
  deepDive: "Help me pick a pre-period covariate for this experiment metric and estimate the variance reduction before I commit to a runtime."
},
{
  id: "uncertainty-clustering",
  track: "uncertainty", level: "applied",
  title: "Repeated measurements of the same unit are not independent observations",
  source: "A. Colin Cameron and Douglas L. Miller, A Practitioner's Guide to Cluster-Robust Inference, Journal of Human Resources, 2015",
  idea: "Treating a thousand traces from fifty tenants as a thousand independent samples understates the standard error by a factor set by the intra-cluster correlation, and the fix is to cluster at the level at which treatment was assigned.",
  why: "The standard error of a mean assumes independent draws. Traces from one tenant are not independent: they share a schema, a prompt style, a set of connectors and a user population, so if one fails there is elevated probability that others do too. The classic inflation factor is one plus m minus one times rho, where m is the average number of observations per cluster and rho is the intra-cluster correlation. With twenty traces per tenant and a modest rho of 0.1, that is 2.9, so your true standard error is about 1.7 times what you computed.\n\nCameron and Miller's practical guidance is to cluster at the level of treatment assignment, not at the finest level available, and to be wary when the number of clusters is small. With fifty tenants you are near the edge of where cluster-robust standard errors behave; with ten you are past it and need a wild cluster bootstrap or a design-based alternative. The number that matters for your precision is the number of clusters, not the number of rows.",
  failureMode: "An eval reports a 2.1 point improvement, standard error 0.5, computed over 4,000 traces. The traces come from 12 tenants. Clustered at the tenant, the standard error is 1.4 and the improvement is indistinguishable from nothing. The dashboard has been reporting the row-level number for six months.",
  experiment: "For your main quality metric, run the same aggregate twice in ClickHouse: once with the naive standard error over rows, once by first collapsing to one number per tenant and computing the standard error over those tenant means. Checkable output: the ratio, and the count of distinct tenants. If the tenant count is under 30, note that too, because it changes which method you should be using.",
  reflection: "How many independent clusters does your headline quality number actually rest on, as opposed to how many rows?",
  recall: {
    q: "You have 4,000 traces from 20 tenants with an intra-cluster correlation of 0.15. Roughly how wrong is the naive standard error?",
    a: "The average cluster size is 200, so the design effect is one plus 199 times 0.15, about 30. The standard error is understated by the square root of that, roughly a factor of five and a half.\n\nThe effective sample size is closer to 130 than to 4,000, and with only 20 clusters you should also be cautious about cluster-robust standard errors and consider a wild cluster bootstrap."
  },
  deepDive: "Given this table schema, tell me what my clusters are, how many I have, and whether cluster-robust standard errors are safe at that count."
},
{
  id: "uncertainty-eval-error-bars",
  track: "uncertainty", level: "applied",
  title: "Every eval number needs an error bar, and the arithmetic is not hard",
  source: "Evan Miller, Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations, arXiv 2411.00640, 2024",
  idea: "Treat the eval set as a sample from a distribution of questions you care about, report the standard error of the mean score, and use paired differences and clustered resampling when questions share a source.",
  why: "Miller's framing is the load-bearing part. An eval score is not a measurement of the model; it is an estimate of the model's expected score over a population of questions, computed from a finite sample. Once you accept that, the standard error of the mean is the obvious next line, and for a pass rate over n independent questions it is the square root of p times one minus p over n. On a 200-item eval at 80 percent, that is 2.8 points, so the interval is roughly 74 to 86.\n\nHe sets out several practical recommendations that go past the basic interval: cluster your standard errors when questions come in related groups, such as multiple items drawn from the same document; reduce within-question variance by using the model's answer probabilities or by resampling answers rather than taking a single draw; analyse paired differences when comparing two models on the same questions; and use power analysis to decide how many questions the comparison needs before running it. The recurring point is that the eval number and the eval difference are different estimands with different variances, and the difference is the one you usually care about.",
  failureMode: "A model card reports 82.4 percent on a 150-item benchmark and the next release reports 84.1 percent, presented as an improvement. The standard error on each is about 3 points, and the paired standard error on the difference, which is what should have been reported, was never computed.",
  experiment: "Take your team's current eval leaderboard. For every score on it, add the standard error of the mean using the square root of p times one minus p over n. Checkable output: the number of ranking positions on that leaderboard that are within two standard errors of each other. Report that count to whoever owns the leaderboard.",
  reflection: "How many of the model comparisons your team has made this quarter would survive their own error bars?",
  recall: {
    q: "What is the estimand behind an eval score, and what follows from naming it?",
    a: "The model's expected score over the population of questions the eval set is meant to represent. The eval set is a finite sample from that population.\n\nOnce it is a sample statistic it has a standard error, roughly the square root of p times one minus p over n for a pass rate, and comparisons between models should be analysed as paired differences on the same questions rather than as two independent scores."
  },
  forecast: { q: "After I add standard errors to our eval leaderboard, will at least two of the current rankings turn out to be within two standard errors of each other?" },
  deepDive: "Take our eval results file and add the standard errors and paired difference intervals Miller recommends, then tell me which comparisons no longer hold."
},
{
  id: "uncertainty-small-eval-clt",
  track: "uncertainty", level: "advanced",
  title: "Below a few hundred items the normal approximation stops protecting you",
  source: "Sam Bowyer, Laurence Aitchison and Desi R. Ivanova, Position: Don't Use the CLT in LLM Evals With Fewer Than a Few Hundred Datapoints, arXiv 2503.01747, 2025",
  idea: "For the small, skewed and clustered eval sets that are normal in practice, central limit theorem intervals quietly undercover and Bayesian or exact methods should be the default instead.",
  why: "The central limit theorem is an asymptotic result, and how fast it kicks in depends on the shape of what you are averaging. Bernoulli scores near zero or one are strongly skewed, so the sampling distribution of the mean is skewed too, and a symmetric normal interval sits in the wrong place. Bowyer, Aitchison and Ivanova argue that eval sets below a few hundred items sit squarely inside the regime where this matters, and that this is not an edge case but the common case: bespoke internal evals are routinely tens of items.\n\nTheir position is to use Bayesian methods, which give a posterior over the score that is well behaved at any n, rather than a normal interval whose coverage degrades silently. The same argument applies with more force to paired comparisons on small sets and to clustered eval sets, where both the skew and the dependence push in the same direction. The practical rule: below roughly a few hundred items, treat a plus-or-minus from a normal approximation as a lower bound on your real uncertainty.",
  failureMode: "A 40-item internal eval for a new agent skill reports 92.5 percent plus or minus 8 from a normal approximation. The upper bound exceeds 100 percent, someone clips it, and the interval is now asymmetric for the wrong reason. A beta posterior would have given a properly asymmetric interval without the clipping.",
  experiment: "Take your smallest internal eval set. Compute three intervals for its pass rate: normal approximation, Wilson, and the 95 percent credible interval from a Beta posterior with a uniform prior, which is Beta of x plus 1 and n minus x plus 1. Checkable output: the three lower bounds. Note whether the normal upper bound leaves the unit interval. Then count how many internal evals your team runs below 200 items.",
  reflection: "What is the median size of the eval sets your team makes decisions on, and is it above or below a few hundred?",
  recall: {
    q: "Why does the central limit theorem fail you specifically on small eval sets, rather than just being imprecise?",
    a: "The CLT is asymptotic and its convergence rate depends on skew. Bernoulli scores near zero or one are heavily skewed, so at small n the sampling distribution of the mean is skewed and a symmetric interval is misplaced, undercovering on one side.\n\nThe symptom is coverage below nominal without any warning, plus bounds that can leave the zero-to-one range. Bayesian posteriors and exact methods behave correctly at any n."
  },
  deepDive: "For this small eval set, give me the beta posterior interval and tell me how far off the normal approximation was."
},
{
  id: "uncertainty-twenty-five-misreadings",
  track: "uncertainty", level: "applied",
  title: "Twenty five ways to misread a p-value, an interval or a power calculation",
  source: "Sander Greenland, Stephen J. Senn, Kenneth J. Rothman, John B. Carlin, Charles Poole, Steven N. Goodman and Douglas G. Altman, Statistical Tests, P Values, Confidence Intervals, and Power: A Guide to Misinterpretations, European Journal of Epidemiology, 2016",
  cheat: "Non-significant is not no effect: read the interval's upper bound, because minus 1 to plus 9 points hides the year's biggest win.",
  idea: "Greenland and colleagues enumerate and correct twenty five specific misinterpretations, and two of them cause most of the damage in engineering review meetings.",
  why: "The first damaging one: a non-significant result means there is no effect. It does not. It means the data are compatible with no effect, and they are also compatible with every other value inside the interval, including large ones. The correct response to a non-significant result is to read the upper bound of the interval and ask whether an effect that size would matter. If it would, you have not ruled it out, you have failed to measure it.\n\nThe second: two studies disagree because one was significant and the other was not. Two results can be highly compatible while landing on opposite sides of a threshold, since a p of 0.04 and a p of 0.06 are almost the same evidence. The difference between significant and non-significant is not itself significant. The paper's broader framing is that a p-value measures compatibility between the data and a model that includes the test hypothesis plus every other assumption in the analysis, so a small p-value can indict any of those assumptions, not just the hypothesis you were interested in.",
  failureMode: "The eval comparison comes back at p equals 0.11 and the decision is recorded in Jira as no difference between the variants. The interval ran from minus 1 to plus 9 points. Nine points would have been the largest quality win of the year, and the ticket now says it does not exist.",
  experiment: "Search your Jira board or decision log for the phrases no difference, no impact and did not move. For each hit, find the underlying number and check whether an interval was ever computed. Checkable output: the count of decisions recorded as no effect where the upper bound was never looked at. Pick the worst one and recompute it.",
  reflection: "Rewrite the last no difference conclusion you signed off, using the upper bound of the interval instead of the p-value.",
  recall: {
    q: "Your comparison comes back non-significant. What is the correct next question?",
    a: "What is the upper bound of the interval, and would an effect that large matter to the decision? Non-significance means the data are compatible with no effect, not that no effect exists.\n\nIf the upper bound covers an effect you would care about, the study was uninformative rather than negative, and the honest report is that you failed to measure it."
  },
  deepDive: "Here is a comparison someone has called a null result: tell me what the interval actually rules out and what it does not."
},
{
  id: "uncertainty-beta-posterior",
  track: "uncertainty", level: "advanced",
  title: "With a tiny eval set a posterior beats an interval",
  source: "Andrew Gelman, John B. Carlin, Hal S. Stern, David B. Dunson, Aki Vehtari and Donald B. Rubin, Bayesian Data Analysis, third edition, 2013",
  idea: "A beta prior updated by successes and failures gives a full posterior over the pass rate, which behaves sensibly at zero failures out of twenty where the Wald interval degenerates to a point.",
  why: "The beta is conjugate to the binomial, so the update is arithmetic rather than computation: start with Beta(a, b), observe x successes in n trials, and the posterior is Beta(a plus x, b plus n minus x). With a uniform Beta(1,1) prior and 20 passes out of 20, the posterior is Beta(21,1), with mean 21 over 22 or 0.955 and a 95 percent credible interval running from about 0.867 to 1. The Wald interval at that data gives 1.0 plus or minus 0.0, which is a claim of certainty from twenty observations.\n\nThe deeper advantage is not interval width. Wilson gives about 0.839 to 1 here and Clopper-Pearson about 0.832 to 1, neither of which is absurd. It is that a posterior is a distribution you can put through a decision. You can ask directly for the probability that the true pass rate exceeds 0.9 and get a number, which you cannot do with a confidence interval. You can carry last quarter's results in as the prior instead of throwing them away. And the interval is asymmetric by construction, so it never leaves the zero-to-one range. Gelman and colleagues are also explicit that the prior is an assumption to be stated and checked, not a free parameter to tune until the answer is pleasing.",
  failureMode: "A new agent skill passes 20 out of 20 on its smoke eval and the ship decision records the pass rate as 100 percent. The honest statement is that the pass rate is probably above 87 percent, which for a customer-facing action means roughly one failure in eight runs is still on the table.",
  experiment: "Take a small eval where you got a perfect or near-perfect score. Compute the Beta(1 plus x, 1 plus n minus x) posterior and read off the 2.5th percentile, which most spreadsheets expose as a beta inverse function. Checkable output: the lower bound, and the posterior probability that the true rate exceeds whatever threshold you actually need. State that probability in the ship decision instead of the raw score.",
  reflection: "Which perfect score in your recent history was actually a statement about fewer than thirty observations?",
  recall: {
    q: "What does a Bayesian posterior give you at 20 out of 20 that a confidence interval does not?",
    a: "A distribution over the pass rate, so you can compute the probability that it exceeds a threshold you care about, and carry prior results forward as the prior rather than discarding them. A confidence interval licenses no probability statement about the parameter.\n\nWith a uniform prior the posterior is Beta(21,1), mean about 0.955, with a lower bound near 0.867. The Wald interval at the same data collapses to a point at 1.0."
  },
  deepDive: "Set up a beta posterior for this small eval, justify the prior, and give me the probability that the true rate clears my threshold."
}
);

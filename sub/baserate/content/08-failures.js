/* Track: How inference goes wrong. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "failures-prior-odds",
  track: "failures", level: "core",
  title: "Whether a finding is true depends mostly on the prior odds, not the p-value",
  source: "John P. A. Ioannidis, Why Most Published Research Findings Are False, PLoS Medicine, 2005",
  idea: "The probability that a significant result is true is set by the pre-study odds, the power and the amount of searching, and a p-value under 0.05 tells you almost nothing on its own.",
  why: "Ioannidis writes the positive predictive value of a claimed finding in terms of R, the pre-study odds that the relationship being tested is real. With power called beta-complement and false positive rate alpha, PPV is (power times R) divided by (power times R plus alpha). Put power at 0.8, alpha at 0.05 and R at 1 in 10, and PPV is 0.08 divided by 0.13, about 0.62. Drop R to 1 in 1000 and PPV falls to about 0.016. Same p-value, same test, wildly different meaning, and nothing changed except how plausible the hypothesis was before you looked.\n\nHe then adds two multipliers. Bias u, the fraction of null findings that get converted into reported findings by analytic choices, and n, the number of independent teams chasing the same question. Both push PPV down, and the corollaries follow directly: smaller studies, smaller effect sizes, more tested relationships, more analytic flexibility and hotter fields all mean a lower chance that a published positive is real. None of this requires anyone to be dishonest. It is arithmetic on the search space.",
  failureMode: "Someone runs twenty prompt variants against an eval set, one comes back significantly better at p equals 0.03, and it ships. The prior that any given prompt tweak moves task success is maybe one in twenty, power on a 200-item eval is nearer 0.4 than 0.8, and the search was over twenty candidates. The PPV of that winner is closer to a coin flip than to 0.95, and it will not reproduce next quarter.",
  experiment: "Take the last three claims of the form X improved Y that your team acted on. For each, write down honestly what odds you would have given the claim before seeing the data, then compute PPV as (power times R) over (power times R plus 0.05), using 0.5 for power unless you actually ran a power calculation. Three numbers. Write them next to the three claims.",
  reflection: "Which of the three had a prior high enough that the result was worth believing, and which one only looked convincing because the p-value was small?",
  recall: {
    q: "Two teams each report a significant result at p equals 0.05 with the same power. One tested a mechanism with strong prior support, the other tested a hunch. Why do their findings differ in credibility when the p-values are identical?",
    a: "PPV depends on the pre-study odds R as well as alpha and power. The false positive rate alpha applies to the whole mass of false hypotheses being tested, so when R is low, the 0.05 slice of a large false pool swamps the true positives.\n\nThe p-value is a statement about data given the null. It contains no information about how likely the null was to begin with, so it cannot be converted into a probability that the finding is true without supplying R."
  },
  forecast: { q: "When I compute PPV for the last three internal improvement claims, will at least one come out below 0.5?" },
  deepDive: "Help me estimate honest pre-study odds for the specific agent-feature hypotheses my team is currently testing, and tell me which of them are not worth running at our sample size."
},
{
  id: "failures-researcher-degrees-of-freedom",
  track: "failures", level: "core",
  title: "Undisclosed analytic flexibility makes any hypothesis significant",
  source: "Joseph P. Simmons, Leif D. Nelson and Uri Simonsohn, False-Positive Psychology, Psychological Science, 2011",
  idea: "Four ordinary and individually defensible analytic choices, left undisclosed, raise the false positive rate from five percent to over sixty.",
  why: "Simmons, Nelson and Simonsohn simulated four degrees of freedom that nobody would call cheating. Reporting whichever of two correlated dependent variables worked, taken alone, lifts the false positive rate from 5 percent to about 9.5 percent. Adding ten more observations per cell after peeking lifts it to about 7.7 percent. Controlling for gender or the gender interaction, about 11.7 percent. Dropping one of three conditions, about 12.6 percent. Combine all four and the rate goes to roughly 61 percent.\n\nThe mechanism is that each choice is made after seeing which version of the result looks better, so the effective number of tests is the product of the branches, not one. The paper then demonstrated it live by producing significant evidence that listening to a particular Beatles song made participants younger, which is impossible, using only the flexibility available in a normal analysis. Their prescription is disclosure: state the stopping rule in advance, report all conditions, report all measures, report results with and without covariates.",
  failureMode: "An agent eval is run, the aggregate score is flat, so someone excludes the timeouts as infrastructure noise, reports only the tasks with a gold answer, switches from exact match to a judge score because exact match is too harsh, and adds fifty more cases because the sample felt small. Each step has a defence. The result is a number with an unstated denominator and a false positive rate that no longer resembles five percent.",
  experiment: "Open the last eval report your team produced and count the decisions that could defensibly have gone the other way: filters, exclusions, metric definition, judge choice, sample stopping point, aggregation level. Write the count. If it is four or more, the nominal significance of anything in that report is not five percent.",
  reflection: "How many degrees of freedom did you find, and which of them were fixed before the data came in rather than after?",
  recall: {
    q: "What was the combined false positive rate in the Simmons, Nelson and Simonsohn simulation, and what were the four degrees of freedom?",
    a: "About 61 percent at a nominal 0.05 threshold. The four were: choosing between two correlated dependent variables, adding observations after peeking, including or excluding a gender covariate or interaction, and dropping one of three experimental conditions.\n\nTheir fix is disclosure rather than prohibition: declare the stopping rule up front, list every condition and measure collected, and show results both with and without each covariate."
  },
  deepDive: "Take my current eval protocol and list every analytic decision in it that is currently made after seeing results, then propose a version where each is fixed in advance."
},
{
  id: "failures-forking-paths",
  track: "failures", level: "core",
  title: "You do not have to run many analyses to be p-hacking",
  source: "Andrew Gelman and Eric Loken, The Statistical Crisis in Science, American Scientist, 2014",
  cheat: "One test picked after seeing the data still costs the family: list the splits you would have tried and divide 0.05 by that count.",
  idea: "A single analysis chosen in response to the data carries the same inflation as running every analysis you would have chosen under other data.",
  why: "Gelman and Loken call this the garden of forking paths. The multiple comparisons correction is usually taught as a penalty for tests you actually performed, which lets an honest analyst off the hook: I only ran one regression, so no correction is needed. But the reference distribution for a p-value is over hypothetical repetitions of the whole procedure, and the procedure includes the analyst. If the data had come out differently you would have split by a different segment, or used a different cutoff, or reported the interaction instead of the main effect. Those unrun branches are part of the sampling distribution whether or not you visited them.\n\nThis is the version that bites careful people. It needs no fishing expedition and no intent. It only needs that the specific comparison you reported was contingent on features of the data you had already seen. The defence is not more discipline in the moment; it is preregistration of the analysis, or splitting the data so that the choice is made on one half and the estimate on the other.",
  failureMode: "You look at agent task success by tenant and notice the enterprise segment looks better, so you test enterprise versus everyone else and get p equals 0.02. You ran one test. But if the pattern had been in trial accounts, or in a region, or in one workflow type, you would have tested that instead. The honest correction is for the family of segment splits you would have considered, and that family has maybe fifteen members.",
  experiment: "Take a segment-level finding currently in play. Before checking anything, write the list of segment splits you would have found interesting had the data pointed there: tenant tier, region, connector type, workflow type, cohort age. Count them. Then divide 0.05 by that count and check whether your finding still clears the bar.",
  reflection: "Did your finding survive the Bonferroni bar over the paths you would have taken, and if not, what would you need to run to rescue it?",
  recall: {
    q: "Why does the garden of forking paths apply to an analyst who ran exactly one statistical test?",
    a: "Because the p-value is defined over repetitions of the entire data-dependent procedure, and the procedure includes the analyst choosing which test to run after seeing the data. The branches not taken still belong to the sampling distribution.\n\nThe practical consequence is that only a preregistered analysis, or one specified on held-out data, has the nominal error rate it claims."
  },
  deepDive: "Given a finding I will describe, enumerate the forking paths I plausibly would have taken under different data, and tell me how much that inflates my error rate."
},
{
  id: "failures-harking",
  track: "failures", level: "applied",
  title: "Presenting a discovered pattern as a prior prediction destroys the test",
  source: "Norbert L. Kerr, HARKing: Hypothesizing After the Results Are Known, Personality and Social Psychology Review, 1998",
  idea: "Reframing an exploratory finding as a hypothesis you held in advance removes the only property that made the confirmation informative, which is that it could have failed.",
  why: "Kerr's term for this is HARKing. A hypothesis stated before the data has a real chance of being contradicted by the data. A hypothesis extracted from the data cannot be contradicted by that same data, because it was fitted to it. The narrative is identical in both cases, which is exactly the problem: the write-up reads as a confirmed prediction, and the reader has no way to tell that the prediction was retrofitted.\n\nKerr lists the costs. It translates Type I errors into hard-to-eradicate theory, because a fluke now has a mechanism attached. It hides the disconfirming evidence that the analysis actually produced. It presents post hoc reasoning as a priori reasoning, which misleads about how much the data constrained the conclusion. Exploration is legitimate and necessary; the damage is done by relabelling it.",
  failureMode: "An agent release ships and week-over-week retention is up. Someone writes the launch review as if the retention gain was the goal, when the plan named latency and tool-call accuracy. The retention story becomes team folklore, gets baked into the next roadmap, and nobody ever runs the test that would have caught it, because the question already appears answered.",
  experiment: "Pull the last three launch reviews or project retros. For each, find the original ticket or design doc and compare the metric named there against the metric celebrated in the review. Count the mismatches. A mismatch is not automatically wrong, but each one is a hypothesis that was written after the results.",
  reflection: "How many of the three reviews named a different success metric than the plan did, and was the change ever flagged as a change?",
  recall: {
    q: "What does HARKing cost you, given that the exploratory finding might well be real?",
    a: "It converts a hypothesis-generating result into an apparently hypothesis-confirming one, so the finding is never subjected to a test it could fail. Kerr's specific concern is that Type I errors get promoted into theory that is then hard to remove.\n\nThe fix is not to ban exploration but to label it, and to hold the discovered hypothesis for a fresh dataset."
  },
  deepDive: "Read my last project retro against the original design doc and tell me which conclusions were predictions and which were discoveries dressed as predictions."
},
{
  id: "failures-p-value-misreading",
  track: "failures", level: "core",
  title: "A p-value does not measure the probability that the hypothesis is true",
  source: "Ronald L. Wasserstein and Nicole A. Lazar, The ASA's Statement on p-Values: Context, Process, and Purpose, The American Statistician, 2016",
  idea: "A p-value measures how incompatible the data are with a specified model including the null, and nothing about the probability that the studied hypothesis is true or that the result matters.",
  why: "The ASA statement sets out six principles. P-values can indicate how incompatible the data are with a specified statistical model. P-values do not measure the probability that the studied hypothesis is true, nor the probability that the data were produced by chance alone. Scientific conclusions and business decisions should not be based only on whether a p-value passes a threshold. Proper inference requires full reporting and transparency. A p-value does not measure the size of an effect or the importance of a result. And by itself a p-value does not provide a good measure of evidence regarding a model or hypothesis.\n\nThe fourth principle is the one people skip and the one that matters most for the others. Cherry-picking promising findings, or reporting only the analyses that produced small p-values, renders the reported p-values uninterpretable. So the number is only as meaningful as the disclosure around it, which means a p-value in a Slack message with no protocol attached carries roughly zero information.",
  failureMode: "A dashboard shows the new retrieval strategy beat the old one at p equals 0.04 and the room reads that as a 96 percent chance the new strategy is better. It is not that. It is a statement that data this extreme would occur 4 percent of the time if the two strategies were identical and every modelling assumption held, which for a metric with a heavy tail and correlated sessions is already doubtful.",
  experiment: "Find a p-value in a document your team produced in the last month. Write, in one sentence, the exact statement it licenses, starting with the words if there were no difference. Then check whether the document's conclusion is stronger than that sentence.",
  reflection: "Was the conclusion in that document supportable by the sentence you wrote, or did it quietly convert a p-value into a probability that the effect is real?",
  recall: {
    q: "State what a p-value is, and name the ASA principle that makes most reported p-values uninterpretable.",
    a: "It is the probability, under a specified model including the null hypothesis, of data at least as extreme as what was observed. It is not the probability the hypothesis is true and it says nothing about effect size.\n\nThe principle about full reporting and transparency: selective reporting of analyses or outcomes destroys the interpretation of any p-value that survives the selection."
  },
  deepDive: "Take a significance claim I am about to present and rewrite it as a statement about effect size and uncertainty that does not lean on the threshold."
},
{
  id: "failures-file-drawer",
  track: "failures", level: "applied",
  title: "The studies you can see are a biased sample of the studies that were run",
  source: "Robert Rosenthal, The File Drawer Problem and Tolerance for Null Results, Psychological Bulletin, 1979",
  idea: "When null results go unpublished, the visible literature overstates every effect it contains, and the same mechanism runs inside a company through the experiments people remember.",
  why: "Rosenthal named the extreme case: journals filled with the five percent of studies that produced Type I errors while the ninety-five percent that found nothing sit in file drawers. His tolerance calculation asks how many unpublished null studies would be needed to push a summarised effect back to non-significance. If that fail-safe number is small, the finding is one filing cabinet away from disappearing.\n\nInside an organisation the filter is different but the shape is the same. Experiments that shipped get written up, get a launch post and get cited in the next planning doc. Experiments that came back flat get abandoned without a document, and the person who ran them moves on. Six months later the team's prior on whether this class of change works is built entirely from the surviving arm of the sample.",
  failureMode: "Your team believes that adding retrieval context improves agent accuracy because the three times it worked have design docs and the four times it did nothing were closed as won't do with no comment. The belief is real, the evidence base is a survivorship-filtered sample, and the next person to propose it will cite the three.",
  experiment: "In Jira, query the last two quarters for tickets under your experiment or spike label and classify each as shipped, reverted or abandoned. Count all three. Then count how many of the abandoned ones have any written outcome at all. That ratio is your file drawer.",
  reflection: "What fraction of your abandoned experiments left any written record, and what would the team's prior look like if they all had?",
  recall: {
    q: "What is Rosenthal's fail-safe number, and what is the organisational equivalent of the file drawer?",
    a: "It is the number of unpublished null studies that would have to exist to reduce a summarised significant effect to non-significance. A small fail-safe number means the finding is fragile to publication bias.\n\nInside a company the file drawer is the set of experiments that were run and never written up, usually because they found nothing, which makes the surviving record of what works systematically optimistic."
  },
  deepDive: "Help me design a lightweight null-result record for my team that people will actually fill in when an experiment finds nothing."
},
{
  id: "failures-outcome-switching",
  track: "failures", level: "applied",
  title: "Outcomes get swapped between protocol and publication more often than not",
  source: "An-Wen Chan, Asbjorn Hrobjartsson, Mette T. Haahr, Peter C. Gotzsche and Douglas G. Altman, Empirical Evidence for Selective Reporting of Outcomes in Randomized Trials, JAMA, 2004",
  idea: "Comparing what a study said it would measure against what it reported shows that most studies changed, added or dropped a primary outcome, and that significant outcomes were the ones that survived.",
  why: "Chan and colleagues obtained the protocols for a cohort of randomised trials and compared them with the published articles. Around half of efficacy outcomes and around two thirds of harm outcomes were incompletely reported per trial. Statistically significant results were substantially more likely to be fully reported than non-significant ones. And in roughly sixty percent of trials, at least one primary outcome had been changed, newly introduced or omitted between protocol and paper.\n\nThis is the empirical measurement of the mechanism the previous entries describe. It is not a simulation and it is not a theory about incentives. It is a direct audit of protocol against publication, and it shows the filter operating at the level of which outcome gets called primary. The reason preregistration works is that it makes exactly this comparison possible; without a protocol on record there is nothing to audit against.",
  failureMode: "The design doc for the agent launch names two success criteria: median task completion time and human escalation rate. The launch review reports task completion time, a new satisfaction proxy and nothing about escalations. Escalations went the wrong way. No one lied; the outcome set was quietly reshaped around what moved.",
  experiment: "Pick your three most recent shipped features. For each, open the original design doc, list the success metrics it named, then open whatever review or dashboard is used to claim success and list the metrics reported there. Compute the fraction of originally named metrics that were actually reported. One number.",
  reflection: "What fraction of your prespecified metrics got reported, and were the missing ones the ones that did not move?",
  recall: {
    q: "What did Chan and colleagues find when they compared trial protocols against the published papers?",
    a: "Most trials had at least one primary outcome that was changed, introduced or omitted between the protocol and the publication, and outcomes with statistically significant results were far more likely to be reported in full.\n\nThe audit is only possible because a protocol existed. Without a prespecified outcome on record, outcome switching is undetectable from the paper alone."
  },
  deepDive: "Review the metric list in my current design doc and tell me which ones I am likely to quietly drop if they do not move, and how to prevent that."
},
{
  id: "failures-replication-rate",
  track: "failures", level: "core",
  title: "Replication rates are the empirical test of a field's methods",
  source: "Open Science Collaboration, Estimating the Reproducibility of Psychological Science, Science, 2015",
  idea: "When a hundred psychology findings were replicated with high-powered direct replications, about thirty-six percent produced significant results and the average effect size was roughly half the original.",
  why: "Ninety-seven percent of the original studies reported significant results. Thirty-six percent of the replications did. Mean effect size dropped from about 0.40 to about 0.20, and only around half of the original effect sizes fell inside the ninety-five percent confidence interval of the replication. These were not sloppy replications: they were run with the original materials where possible and powered above the originals.\n\nWhat makes this the load-bearing entry rather than another critique is that it measures the output rather than arguing about the process. Everything in this track predicts a low replication rate: low prior odds, undisclosed flexibility, forking paths, outcome switching and the file drawer all combine to inflate the published effect. The replication rate is the check on whether those mechanisms are actually operating at scale, and it came back saying yes. Your team's equivalent is the rate at which last quarter's wins are still visible this quarter.",
  failureMode: "An agent quality improvement is measured once, at launch, on a 300-case eval, and never measured again. Two quarters later the aggregate quality number has not moved despite six such wins. Nobody re-ran any of them, so nobody knows which of the six were real and which were the thirty-six percent.",
  experiment: "List every quality or performance improvement your team claimed in the last two quarters. Pick the three cheapest to re-measure and re-run their original measurement today, on fresh data, unchanged. Count how many still show the claimed effect. That is your replication rate, from a sample of three.",
  reflection: "How many of the three held up, and if fewer than all three, what did the ones that failed have in common with each other?",
  recall: {
    q: "In the Open Science Collaboration replication project, what fraction of replications were significant and what happened to effect sizes?",
    a: "About thirty-six percent of the hundred replications produced statistically significant results, against ninety-seven percent of the originals, and mean effect size fell to roughly half, from around 0.40 to around 0.20.\n\nThe replications were generally higher-powered than the originals, so low power in the replication does not explain the gap. It is the expected output of a literature filtered by significance."
  },
  forecast: { q: "Of the three claimed improvements I re-measure this month, will at least two still show the effect?" },
  deepDive: "Help me pick which of my team's past quality claims are worth re-measuring, ranked by how much current roadmap weight rests on them."
},
{
  id: "failures-regression-to-mean",
  track: "failures", level: "applied",
  title: "Extreme measurements move back towards average without anyone doing anything",
  source: "Adrian G. Barnett, Jolieke C. van der Pols and Annette J. Dobson, Regression to the Mean: What It Is and How to Deal With It, International Journal of Epidemiology, 2005",
  cheat: "Judge a fix on the worst week against unselected weeks: at correlation 0.6, ten points below the mean rebounds four by itself.",
  idea: "Selecting the worst-performing week, tenant or model and then intervening guarantees an apparent improvement, because extreme values contain measurement noise that does not repeat.",
  why: "Barnett and colleagues give the arithmetic. If two measurements of the same unit correlate at r, and you select a unit whose first measurement sits d away from the mean, the expected second measurement sits r times d away from the mean. Any r below 1 pulls it in. The noisier the metric, the lower r, and the larger the free improvement you get for doing nothing.\n\nThe trap is that selection on the extreme is exactly how operational work starts. You do not investigate an average week; you investigate the bad one. So every intervention in operations is applied to a selected extreme, and every one of them shows improvement afterwards. Barnett's remedies are the ones you would expect: a randomised control group measured over the same period, or a prespecified comparison against the trend of the unselected population, or using a separate baseline measurement from the one used for selection.",
  failureMode: "P99 agent latency spikes in one week, you spend the sprint on a caching change, and next week P99 is down thirty percent. The caching change may have done nothing. Every other week that was not selected also drifted towards the mean, and you never looked at them, so you have no counterfactual and the caching work now has a fabricated track record.",
  experiment: "In Grafana or ClickHouse, pull a weekly metric for the last twenty weeks across all tenants. Find the five worst tenant-weeks. For each, look up the same tenant's value the following week and note whether it improved. Then do the same for five randomly chosen tenant-weeks. Compare the two improvement rates.",
  reflection: "How much of the improvement after your worst weeks is reproduced by the random sample, which means it was never yours?",
  recall: {
    q: "If a metric's week-to-week correlation is 0.6 and you select a tenant sitting ten points below the mean, what do you expect next week before any intervention?",
    a: "About six points below the mean, so an apparent four-point improvement from nothing. The expected next value is the mean plus r times the deviation.\n\nThe only defences are a control group over the same period, a prespecified comparison against the unselected trend, or selecting on one measurement and evaluating on a different one."
  },
  deepDive: "Look at an intervention I made after a bad week and help me build the unselected-comparison baseline that would tell me whether it did anything."
},
{
  id: "failures-reusable-holdout",
  track: "failures", level: "advanced",
  title: "Reusing a holdout set repeatedly turns it into a training set",
  source: "Cynthia Dwork, Vitaly Feldman, Moritz Hardt, Toniann Pitassi, Omer Reingold and Aaron Roth, The Reusable Holdout: Preserving Validity in Adaptive Data Analysis, Science, 2015",
  idea: "A holdout set gives an unbiased estimate only for analyses chosen independently of it, and every decision you make after looking at it spends some of that guarantee.",
  why: "The standard argument for a holdout assumes the model was fixed before the holdout was touched. In practice you check the holdout, change something because of what you saw, and check again. Each round leaks information from the holdout into the model, so after enough rounds the holdout score is an optimistic training score wearing a different name. Dwork and colleagues show this is not a small effect: in their classification demonstration the naive holdout tracks a rising accuracy that is entirely illusory while true accuracy stays flat.\n\nTheir mechanism, Thresholdout, does two things. It compares the holdout answer to the training answer and only reports the holdout value when the two differ by more than a noisy threshold, otherwise returning the training value. And it charges a fixed budget each time the threshold is exceeded, refusing further queries once the budget is spent. The calibrated noise is what stops the analyst from reverse-engineering the holdout through many small queries, and the budget is what makes the remaining guarantee finite and stated rather than assumed.",
  failureMode: "Your agent eval set has been the same 500 cases for eight months. Prompt changes, model swaps, tool descriptions and retry logic have all been tuned against it, one iteration at a time. The current score of 0.84 is not an estimate of production performance on those 500 cases; it is the result of a long optimisation against them, and the difference is invisible from inside.",
  experiment: "Count how many distinct changes have been evaluated against your current eval set since it was created. Check git log on the eval config or the prompt directory if the count is not written down. Then hold out a fresh random slice of production traffic, size fifty at minimum, label it and score the current system on it. Compare the two numbers.",
  reflection: "What is the gap between your long-serving eval set and the fresh slice, and how many adaptive rounds did it take to open that gap?",
  recall: {
    q: "Why does a holdout set stop being valid under adaptive reuse, and what two things does Thresholdout add?",
    a: "Each look at the holdout followed by a change to the model leaks holdout information into the model, so the holdout progressively becomes part of the training signal and its estimate becomes optimistic.\n\nThresholdout adds calibrated noise, reporting the holdout value only when it differs from the training value by more than a noisy threshold, and a query budget that is charged on each such deviation and cuts off further answers when exhausted."
  },
  deepDive: "Design a rotation and budget policy for my agent eval set so that the headline number stays meaningful across a quarter of iteration."
},
{
  id: "failures-benchmark-overfit",
  track: "failures", level: "applied",
  title: "Test sets that everyone optimises against stop measuring generalisation",
  source: "Benjamin Recht, Rebecca Roelofs, Ludwig Schmidt and Vaishaal Shankar, Do ImageNet Classifiers Generalize to ImageNet?, ICML, 2019",
  idea: "Rebuilding a benchmark from scratch by its original protocol dropped every model's accuracy, which means a decade of reported progress was partly measured against one fixed sample rather than the distribution behind it.",
  why: "Recht and colleagues constructed new test sets for CIFAR-10 and ImageNet by following the original data collection protocols as closely as they could, then scored existing models on them without any retraining. Accuracy fell for every model tested: by roughly three to fifteen points on CIFAR-10 and roughly eleven to fourteen points on ImageNet. Model rankings were largely preserved, and better models on the original set were still better on the new one, so the ordering survived even though the absolute numbers did not.\n\nTwo readings matter. First, the absolute number attached to a heavily used benchmark is an estimate for that sample, not for the distribution, and the gap grows with how much community effort has gone into the sample. Second, ordering can survive while calibration does not, which is why a leaderboard remains useful for choosing between systems long after it has stopped being useful for predicting deployed performance.",
  failureMode: "Your agent scores 0.84 on the internal benchmark and you tell the exec review the agent completes eighty-four percent of tasks. Production is at sixty. The benchmark was never a sample of production tasks in the first place, and eighteen months of tuning have widened whatever gap existed at the start.",
  experiment: "Rebuild a small test set the way the original was built. Sample fifty real tasks from production logs in ClickHouse or Temporal history using the same selection rule your eval set claims to use, label them the same way, and score the current system. Report both numbers side by side with the difference.",
  reflection: "How large is the drop on the fresh sample, and does the ranking between your two candidate configurations survive it?",
  recall: {
    q: "What happened when Recht and colleagues built a fresh ImageNet test set by the original protocol, and which conclusion survived?",
    a: "Every model's accuracy dropped, by roughly eleven to fourteen points on ImageNet, with no retraining and no change of protocol. The absolute numbers did not transfer.\n\nThe relative ordering largely did. Models better on the original set stayed better on the new one, so a saturated benchmark can still rank systems while badly overstating deployed performance."
  },
  forecast: { q: "When I score the current agent on a fresh fifty-task sample from production, will accuracy drop by more than five points against the standing eval set?" },
  deepDive: "Help me write a sampling rule for a rebuildable eval set so I can regenerate a fresh one from production traffic each quarter."
},
{
  id: "failures-multiverse",
  track: "failures", level: "advanced",
  title: "Run every defensible version of the analysis and show the spread",
  source: "Sara Steegen, Francis Tuerlinckx, Andrew Gelman and Wolf Vanpaemel, Increasing Transparency Through a Multiverse Analysis, Perspectives on Psychological Science, 2016",
  idea: "A multiverse analysis enumerates the reasonable data-processing and modelling choices, runs all their combinations, and reports the distribution of results instead of one arbitrary path through it.",
  why: "Steegen and colleagues point out that a raw dataset does not determine a single processed dataset. Exclusion rules, coding of ambiguous cases, cut-points for continuous variables and choice of derived measures each have several defensible settings, and the analyst picks one path and reports one result. The multiverse instead crosses the choices, producing a set of datasets and a set of results, and reports the whole distribution: how many specifications give a significant result, and how the effect size moves across them.\n\nThe value is that fragility becomes visible rather than hidden. If the conclusion holds across most of the multiverse, you have learned something robust. If it holds in three specifications out of ninety-six, you have learned that the original single-path report was a selection from a mostly null distribution, and no amount of defending the chosen path changes that. It converts the forking-paths problem from an unmeasurable worry into a computed spread.",
  failureMode: "The A/B readout says the new agent config wins by four points. It also happens to exclude sessions under ten seconds, count a partial completion as a success, aggregate by session rather than by user, and window at fourteen days. Flip any two of those and the win is one point or negative. Nobody flips them, because the first version already answered the question.",
  experiment: "Take your current headline comparison and list the binary choices in it: include or exclude short sessions, per-user or per-session aggregation, judge score or exact match, seven or fourteen day window, cap outliers or not. Pick five. Run all thirty-two combinations in a spreadsheet or a single ClickHouse query with a GROUP BY over the flags. Report the minimum, median and maximum effect.",
  reflection: "What is the spread of the effect across your thirty-two specifications, and does it include zero?",
  recall: {
    q: "What does a multiverse analysis report that a single analysis does not, and what does it tell you when the result is significant in only a few specifications?",
    a: "It reports the distribution of results across every combination of defensible processing and modelling choices, rather than the single result from one path through them.\n\nA result significant in only a few specifications tells you the original report was a selection from a largely null distribution. The fragility is the finding, and defending the chosen path does not repair it."
  },
  forecast: { q: "Will the spread of my headline effect across thirty-two defensible specifications include zero?" },
  deepDive: "Help me enumerate the defensible processing choices in my current A/B readout and write the query that computes all of them at once."
},
{
  id: "failures-severity",
  track: "failures", level: "advanced",
  title: "A test is only evidence if it could have failed",
  source: "Deborah G. Mayo, Statistical Inference as Severe Testing: How to Get Beyond the Statistics Wars, 2018",
  idea: "A claim is warranted only to the degree that it has passed a test that would probably have produced a worse result had the claim been false.",
  why: "Mayo's severity requirement has two parts. The claim must fit the data, and the test must have had a high probability of producing a result that fits less well, had the claim been false. The second part is the whole content. A test that would have passed the claim regardless of its truth gives no warrant, however impressive the fit looks, and this is what unites everything else in this track: flexible analysis, forking paths, HARKing and a saturated benchmark all work by lowering the probability that the test would have failed.\n\nThis reframes what to ask about a result. Not is p below 0.05, but what result would this procedure have produced if the effect were zero, and how likely was that. A large sample with a tiny effect passes significance while being a severe test of almost nothing interesting; a well-designed small study with a prespecified prediction can be severe. Severity is a property of the test and the specific claim together, not of the data alone, which is why the same p-value can be strong or worthless depending on the procedure that generated it.",
  failureMode: "The go or no-go review asks whether the agent beat the baseline on the eval, and it did. Nobody asks what the eval would have shown had the agent been no better, and the honest answer is that with the current judge, the current task mix and the current pass criterion it would also have shown a win. The review is a ceremony, not a test, and it will approve the next release too.",
  experiment: "Take the ship or no-ship criterion you will apply to your next release and write down, before running it, what result you would see if the change had no effect at all. If you cannot name a plausible outcome of that criterion that would block the release, the criterion is not a test. Rewrite it until you can.",
  reflection: "What specific outcome would have stopped your last release, and did the criterion you actually used make that outcome possible?",
  recall: {
    q: "State the severity requirement in two parts, and say why a passing test can still give zero warrant.",
    a: "First, the data must fit the claim. Second, the test must have had a high probability of producing a result that fits the claim less well, had the claim been false.\n\nA test that would have passed regardless of the claim's truth satisfies the first part and fails the second, so passing it carries no information. That is what analytic flexibility, HARKing and an over-optimised benchmark all do: they drive the probability of failure towards zero."
  },
  deepDive: "Take the ship criterion for my next agent release and tell me what it would have shown under a null change, then help me make it severe."
}
);

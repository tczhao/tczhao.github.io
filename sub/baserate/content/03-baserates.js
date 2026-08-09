/* Track: Base rates and conditionals. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "baserates-natural-frequencies",
  track: "baserates", level: "core",
  title: "Bayes becomes mental arithmetic when you drop probabilities and count people",
  source: "Gerd Gigerenzer and Ulrich Hoffrage, How to Improve Bayesian Reasoning Without Instruction: Frequency Formats, Psychological Review, 1995",
  idea: "Restate any conditional-probability problem as counts out of a fixed population and the correct answer stops requiring a formula.",
  why: "Gigerenzer and Hoffrage gave the same fifteen problems in two formats. In the standard probability format - a one percent base rate, an eighty percent hit rate, a 9.6 percent false positive rate - about sixteen percent of answers were Bayesian. In natural frequencies - out of every thousand cases, ten have it, eight of those test positive, and ninety-five of the remaining nine hundred and ninety test positive anyway - about forty-six percent were. No instruction, no training, same subjects, same underlying numbers.\n\nThe mechanism is that natural frequencies carry the base rate inside them. When you say ninety-five of nine hundred and ninety, the denominator is already in the sentence, so there is nothing left to normalise. Probability format strips the base rate out into a separate number that then has to be reinserted by an operation most people do not perform. The answer here is eight out of a hundred and three, which is under eight percent, and you can see it without writing anything down.",
  failureMode: "Someone reports that the injection detector has ninety-two percent accuracy and the room hears that a flagged tool call is ninety-two percent likely to be an injection. Nobody asks how many tool calls per day there are, so nobody notices that at your volume the detector produces four hundred false flags for every real one.",
  experiment: "Take the alert rule that pages you most often. Pull ninety days of firings from Grafana alerting history and count them. Then count how many of those firings have a linked incident or a Jira ticket that was not closed as noise. Write the result as a sentence in the natural-frequency form: out of N firings, X were real and N minus X were not. Read that sentence out loud. If your alert history is not queryable, do it with last month's pages from your on-call handover doc.",
  reflection: "What was the sentence, and did the number surprise you?",
  recall: {
    q: "Why does the frequency format produce more correct Bayesian answers than the probability format, given that both encode identical information?",
    a: "Because natural frequencies keep the base rate embedded in the counts rather than stating it as a separate probability that has to be reinserted. Saying ninety-five out of nine hundred and ninety already carries the denominator, so no normalisation step is required.\n\nGigerenzer and Hoffrage measured this at roughly sixteen percent correct under probability format versus roughly forty-six percent under frequency format, with no instruction given."
  },
  deepDive: "Take a conditional-probability claim someone made in a review this week and rewrite it for me as natural frequencies out of ten thousand cases."
},
{
  id: "baserates-representativeness",
  track: "baserates", level: "core",
  title: "People substitute resemblance for probability and discard the base rate",
  source: "Daniel Kahneman and Amos Tversky, On the Psychology of Prediction, Psychological Review, 1973",
  idea: "When a case resembles a category, judgement of how likely it belongs to that category ignores how common the category is.",
  why: "Kahneman and Tversky described a person drawn from a pool of a hundred professionals and asked which profession they belonged to. One group was told the pool was seventy engineers and thirty lawyers, the other thirty engineers and seventy lawyers. Given a description that sounded engineer-like, both groups gave essentially the same answer. The stated base rate, which was the only thing that differed, moved almost nothing.\n\nThe substitution is the point. Asked a hard question - how probable is this - people answer an easy one - how much does this resemble the type. Resemblance is a similarity judgement and similarity has no denominator, so it cannot possibly encode prevalence. The base rate did move judgements when subjects were given no description at all, which shows they can use it and simply stop once a story is available.",
  failureMode: "A trace comes in with a stack trace that looks exactly like the vector-store timeout you spent two days on last quarter. It looks like that, so it gets triaged as that, and nobody checks that vector-store timeouts are two percent of failures this month while a new tool-schema validation error is forty percent.",
  experiment: "Open your last ten incident or bug triage decisions in Jira. For each one, write down the first hypothesis someone stated and the actual root cause. Then pull the frequency distribution of root causes over the last quarter. Count how many first hypotheses were the most-resembling cause rather than the most-common cause, and how many of those turned out wrong.",
  reflection: "How many of the ten first hypotheses were resemblance-driven, and what was the hit rate?",
  recall: {
    q: "What is the experimental result that shows base-rate neglect rather than merely poor estimation?",
    a: "Kahneman and Tversky varied the pool composition between seventy-thirty and thirty-seventy while holding the personality description fixed. Subjects gave essentially the same probability in both conditions, meaning the base rate carried almost no weight.\n\nThe same subjects did use the base rate when no description was supplied, so the failure is substitution of a similarity judgement for a probability judgement, not an inability to reason about proportions."
  },
  deepDive: "Give me the current distribution of root causes for my service and tell me which of my standing diagnostic instincts it contradicts."
},
{
  id: "baserates-ppv-low-prevalence",
  track: "baserates", level: "core",
  title: "A 99 percent accurate detector for a one in a thousand event is wrong most times it fires",
  source: "David M. Eddy, Probabilistic Reasoning in Clinical Medicine: Problems and Opportunities, in Judgment Under Uncertainty, 1982",
  cheat: "A 99 percent detector at one in a thousand prevalence is right nine percent of the times it fires, so buy specificity not sensitivity.",
  idea: "At low prevalence the positive predictive value of a detector is dominated by false positives no matter how good the detector is.",
  why: "The formula is worth holding in plain text. Positive predictive value equals prevalence times sensitivity, divided by that same quantity plus one minus prevalence times the false positive rate. The numerator scales with prevalence. The second term in the denominator scales with one minus prevalence, which at low prevalence is essentially one. So the denominator barely notices the detector and is set almost entirely by how much healthy traffic there is.\n\nRun it. Prevalence one in a thousand, sensitivity ninety-nine percent, specificity ninety-nine percent. Out of ten thousand cases, ten are real and about ten of those fire. Nine thousand nine hundred and ninety are not real and about a hundred of those fire anyway. Ten true out of a hundred and ten firings is nine percent. Eddy's medical version is worse still: he found that most physicians given a mammography problem with a one percent base rate answered around seventy-five percent when the correct answer was under eight percent, and that the published literature itself contained the same error.",
  failureMode: "You ship an agent-output safety classifier benchmarked at ninety-nine percent on a balanced eval set. In production, harmful outputs are one in two thousand. The classifier now generates roughly twenty false blocks for every real catch, support opens tickets about legitimate queries being refused, and the fix that gets proposed is to lower the threshold, which is the wrong lever.",
  experiment: "Pick one detector you own - an alert rule, a guardrail classifier, an anomaly monitor. Get three numbers: firings over ninety days from Grafana, total events evaluated over the same window from ClickHouse, and confirmed true positives from your incident or ticket record. Compute observed precision as true positives over firings, then back out the implied specificity from the false positives over the non-event population. Compare that implied specificity to whatever number was on the slide when the detector shipped.",
  reflection: "What was the observed precision, and how far is the implied specificity from the claimed one?",
  forecast: { q: "Will the ninety-day observed precision of my noisiest alert rule come out below twenty percent?" },
  recall: {
    q: "State the positive predictive value formula in words, and say which term dominates at low prevalence.",
    a: "PPV equals prevalence times sensitivity, divided by prevalence times sensitivity plus one minus prevalence times the false positive rate. At low prevalence the one minus prevalence factor is close to one, so the false positive term dominates the denominator.\n\nThat means PPV is governed by the size of the negative population rather than by the quality of the detector, which is why improving sensitivity buys almost nothing and improving specificity buys almost everything."
  },
  deepDive: "Here are my detector's sensitivity, specificity and production prevalence: compute the PPV and tell me what specificity I would need to reach a precision of one in two."
},
{
  id: "baserates-test-vs-population",
  track: "baserates", level: "applied",
  title: "Sensitivity and specificity are properties of the test, predictive values are properties of the population",
  source: "Douglas G. Altman and J. Martin Bland, Statistics Notes: Diagnostic Tests 1 and 2, BMJ, 1994",
  idea: "Sensitivity and specificity stay fixed as prevalence changes while positive and negative predictive value move with it.",
  why: "Altman and Bland split this across two notes deliberately. Sensitivity is the proportion of true cases the test catches and specificity is the proportion of true non-cases it clears. Both are conditioned on truth, so they are computed within the columns of the confusion matrix and do not depend on how many of each column there are. Predictive values are conditioned on the test result, computed across the rows, and the row totals depend entirely on the mix.\n\nThis is why the eval number and the production number can both be honest and completely different. A detector validated on a set curated to be half positives has a prevalence of fifty percent by construction. Move it to traffic where the real rate is one in a thousand and every column-wise statistic survives intact while every row-wise statistic collapses. Altman and Bland also note the corollary that gets forgotten: at low prevalence negative predictive value is near perfect almost for free, so quoting it is close to meaningless.",
  failureMode: "The model card reports precision and recall from the eval set. Someone in the ship review reads precision as the thing that will happen in production. It will not, because the eval set was balanced and production is not, and nobody has written down what production prevalence actually is.",
  experiment: "Find the eval set for a classifier your team ships. Count its positive rate. Then estimate the production positive rate from ClickHouse, or from a hand-labelled sample of two hundred production events if you have no labels. Recompute the eval-set precision at production prevalence using the PPV formula, holding sensitivity and specificity fixed. Put both precision numbers on the same line in a spreadsheet.",
  reflection: "What were the two precision numbers, and which one is currently on the model card?",
  recall: {
    q: "Why can a classifier's precision drop by an order of magnitude in production while its sensitivity and specificity are unchanged?",
    a: "Sensitivity and specificity are conditioned on the true class, so they are computed within columns of the confusion matrix and are invariant to class mix. Precision is conditioned on the prediction, computed across a row, and the row composition depends on prevalence.\n\nA balanced eval set fixes prevalence at fifty percent by construction. Production prevalence is usually orders of magnitude lower, so the false positive contribution to the positive row grows and precision falls even though the test itself is identical."
  },
  deepDive: "Take my eval-set confusion matrix and my estimated production prevalence and rewrite the whole matrix as it would look on a day of real traffic."
},
{
  id: "baserates-likelihood-ratio",
  track: "baserates", level: "applied",
  title: "Posterior odds equal prior odds times the likelihood ratio",
  source: "David L. Sackett, Sharon E. Straus, W. Scott Richardson, William Rosenberg and R. Brian Haynes, Evidence-Based Medicine: How to Practice and Teach EBM, second edition, 2000",
  cheat: "Update by multiplying prior odds by the likelihood ratio: a signal at two is not confirmation, above ten usually shifts a decision.",
  idea: "Working in odds turns Bayesian updating into a single multiplication you can do without a calculator.",
  why: "In odds form Bayes has no denominator to normalise. Posterior odds equal prior odds times the likelihood ratio. The likelihood ratio for a positive result is sensitivity divided by one minus specificity: how much more often this result appears when the thing is true than when it is not. For a negative result it is one minus sensitivity divided by specificity. Convert back at the end with probability equals odds divided by one plus odds.\n\nSackett and colleagues pushed this format because clinicians need it at the bedside, and the same argument applies at three in the morning on call. A prevalence of one in a thousand is prior odds of about one to a thousand. A detector with ninety-nine percent sensitivity and ninety-nine percent specificity has a likelihood ratio of ninety-nine to one. Multiply and you get about one to ten, which is roughly nine percent, matching the long-hand answer with one multiplication. Their rough guide is that a likelihood ratio above ten or below one tenth usually shifts a decision, and one between about a third and three rarely shifts anything.",
  failureMode: "A second signal fires and the room treats it as confirmation, but the signal has a likelihood ratio near two. Two is not confirmation. Starting from prior odds of one in five hundred, a likelihood ratio of two lands you at one in two hundred and fifty, and you have just diverted three engineers on a quarter of one percent.",
  experiment: "Write down the three signals you actually use to decide whether a production anomaly is real. For each, estimate its likelihood ratio from history: how often it appears during real incidents divided by how often it appears during normal operation. Grafana over a known incident window gives you the numerator and a matched quiet window gives you the denominator. Rank the three by likelihood ratio and check whether that ranking matches the order in which you actually consult them.",
  reflection: "Which of your three signals has the highest likelihood ratio, and is it the one you look at first?",
  recall: {
    q: "Give the odds form of Bayes and the likelihood ratio for a positive test.",
    a: "Posterior odds equal prior odds times the likelihood ratio. The likelihood ratio for a positive result is sensitivity divided by one minus specificity, and for a negative result it is one minus sensitivity divided by specificity.\n\nConvert odds back to probability with odds divided by one plus odds. Sackett's rough guide is that ratios above ten or below one tenth usually change a decision and ratios between roughly one third and three usually do not."
  },
  deepDive: "Help me estimate the likelihood ratio of each triage signal I use from my incident history, and tell me which ones are not worth checking."
},
{
  id: "baserates-weight-of-evidence",
  track: "baserates", level: "advanced",
  title: "Evidence has a weight you can add up",
  source: "I. J. Good, Probability and the Weighing of Evidence, 1950",
  idea: "The log of the likelihood ratio is the weight of evidence, and it adds across independent signals instead of multiplying.",
  why: "Good formalised this from the Bletchley Park work with Turing. Define the weight of evidence in favour of a hypothesis as the log of the likelihood ratio. Because logs turn products into sums, the odds-form update becomes addition: log posterior odds equals log prior odds plus the weight of each independent piece of evidence. Good and Turing worked in decibans, which is ten times the base-ten log, because a deciban is roughly the smallest change in plausibility a person can perceive.\n\nThe practical payoff is that weight is on a scale you can budget against. A likelihood ratio of ten is ten decibans. Getting from prior odds of one in a thousand to even odds costs thirty decibans, so you need three independent tens or one enormous signal. And the independence condition becomes visible rather than assumed: two alerts that both fire off the same upstream saturation are not two signals, they are one signal counted twice, and adding their weights inflates your confidence by the amount of their shared cause.",
  failureMode: "The dashboard shows five red panels and the room reads five confirmations. Four of them are downstream of the same queue backing up, so the honest weight is one signal plus a rounding error, and the incident channel commits to a root cause that the fifth, independent signal was actually arguing against.",
  experiment: "Take one recent incident. List the signals that fired. For each pair, check in Grafana whether they have ever fired independently of each other over the last ninety days. Any pair that has never separated is one signal. Count how many distinct signals you actually had, then compare it to how many people believed they had at the time.",
  reflection: "How many of the signals in that incident were genuinely independent?",
  recall: {
    q: "What is the weight of evidence and what does working in it buy you over working in likelihood ratios?",
    a: "The weight of evidence is the log of the likelihood ratio. Because logs convert multiplication to addition, independent evidence accumulates by summing weights, which makes the total budget to move from a low prior to even odds explicit.\n\nGood and Turing used decibans, ten times the base-ten log. The framing also makes the independence assumption visible, because two correlated signals contribute far less than the sum of their individual weights."
  },
  deepDive: "Given these alerts and their historical co-firing rates, tell me how much independent weight of evidence I actually have."
},
{
  id: "baserates-transposed-conditional",
  track: "baserates", level: "core",
  title: "The probability of the evidence given innocence is not the probability of innocence given the evidence",
  source: "William C. Thompson and Edward L. Schumann, Interpretation of Statistical Evidence in Criminal Trials: The Prosecutor's Fallacy and the Defense Attorney's Fallacy, Law and Human Behavior, 1987",
  idea: "Swapping the two sides of a conditional probability is a different claim with a different answer, and the swap is almost never noticed.",
  why: "Thompson and Schumann named and tested two errors. The prosecutor's fallacy takes a one in a thousand chance of a match given innocence and reports it as a one in a thousand chance of innocence given a match. Those are only equal if the prior odds are even, which in a city of a million suspects they are emphatically not: a thousand other people also match. The defence attorney's fallacy is the mirror error, arguing that because a thousand people match the evidence is worthless, which ignores that it moved the odds from one in a million to one in a thousand.\n\nThey ran it on mock jurors and both framings shifted verdicts, which matters because it shows the error is not a failure to compute but a failure to notice that two different quantities are being conflated. Engineering runs on the same conflation. The probability of seeing this failure signature given cause X is a property of X. The probability of cause X given this signature depends on how common X was to begin with, and you cannot get the second from the first without the base rate.",
  failureMode: "The postmortem says this error pattern only ever occurs when the connection pool is exhausted, therefore the pool was exhausted. Read literally that is a statement about the probability of the signature given pool exhaustion. If pool exhaustion happens once a quarter and the signature appeared four times this week, the inference is running backwards and the real cause is still open.",
  experiment: "Grep the root-cause field of your last twenty closed incidents for phrases of the form only happens when, always means, or is a sure sign of. For each hit, ask which conditional it states and which one the author needed. Then check the ClickHouse or log record for how often that signature appeared without the named cause. Count how many of the twenty survive.",
  reflection: "How many transposed conditionals did you find in your own postmortems?",
  recall: {
    q: "Name both fallacies Thompson and Schumann described and say what each one gets wrong.",
    a: "The prosecutor's fallacy transposes the conditional, reporting the probability of the evidence given innocence as if it were the probability of innocence given the evidence. It ignores the prior, so in a large suspect pool many innocent people also match.\n\nThe defence attorney's fallacy is the mirror: because many people match, the evidence is dismissed as worthless. That ignores that the evidence still multiplied the odds by a large factor, moving the case from one in a million to one in a thousand."
  },
  deepDive: "Read this postmortem's root-cause statement and tell me which conditional it actually establishes."
},
{
  id: "baserates-independence-multiplication",
  track: "baserates", level: "applied",
  title: "Multiplying two probabilities assumes an independence you have not checked",
  source: "Royal Statistical Society, press release on the Sally Clark case, 23 October 2001",
  idea: "The product rule for two events only holds when the events are independent, and shared causes are the normal case rather than the exception.",
  why: "The Royal Statistical Society issued a public statement objecting to evidence given in the Sally Clark trial, where a single-event rate had been squared to produce the probability of two events in one family. The society's objection was that the calculation had no statistical basis, because the approach assumes the two events are independent when there may be genetic or environmental factors that make a second event more likely once the first has happened. The statement also noted that even a very small probability of the evidence under one hypothesis says nothing on its own without comparing it to the probability under the alternative.\n\nThe engineering form is everywhere. Two requests in a session are not two independent draws from your per-request failure rate: they hit the same pod, the same warm cache, the same degraded upstream, the same tenant's oversized workspace. If per-request failure is one percent, the probability that a twenty-step agent run completes is not ninety-nine percent to the twentieth power, because the steps share almost every failure mode they have.",
  failureMode: "The reliability estimate for a multi-step agent workflow is computed as per-step success raised to the number of steps, and it comes out at eighty-two percent. Observed completion is sixty percent, because when step three fails on a tenant it is because that tenant's catalogue is enormous, and steps four through twelve are about to fail for the same reason.",
  experiment: "In your Temporal workflow histories, take one multi-step workflow and compute two numbers over the last thirty days: the per-activity failure rate, and the actual whole-workflow completion rate. Then compute the completion rate the independence assumption predicts, which is one minus the per-activity failure rate raised to the number of activities. Put the predicted and observed numbers side by side. Then group failures by tenant or by pod and see whether the failures cluster.",
  reflection: "What was the gap between predicted and observed completion, and did the failures cluster?",
  recall: {
    q: "What was the Royal Statistical Society's objection, and what is its engineering analogue?",
    a: "The society objected that squaring a single-event rate to obtain a two-event rate has no statistical basis, because it assumes independence when genetic or environmental factors may make the second event more likely after the first. It also noted that a small probability under one hypothesis means nothing without the probability under the alternative.\n\nThe analogue is estimating multi-step reliability by raising per-step success to a power. Steps in one session share infrastructure, tenant, and cache state, so failures cluster and the independence estimate is optimistic."
  },
  deepDive: "Take my Temporal activity failure rates and tell me how to test whether the failures within a single workflow run are independent."
},
{
  id: "baserates-detection-ceiling",
  track: "baserates", level: "applied",
  title: "Intrusion detection is limited by the base rate, not by the detector",
  source: "Stefan Axelsson, The Base-Rate Fallacy and the Difficulty of Intrusion Detection, ACM Transactions on Information and System Security, 2000",
  idea: "For any rare-event detector, the false alarm rate you need is set by the event's prevalence and is usually far below what anyone has built.",
  why: "Axelsson worked the arithmetic rather than asserting it. He assumed a realistic installation processing on the order of a million audit records a day containing a couple of dozen intrusion records, and asked what false alarm rate would be required for the Bayesian detection rate - the probability that an alarm signals a real intrusion - to reach even fifty percent. The answer came out around one in a hundred thousand. He called this the limiting factor for the performance of an intrusion detection system, and argued the field had been optimising the wrong quantity.\n\nGeneralise it and you get a ceiling on every rare-event detector you will ever operate. To reach a precision of p when prevalence is r, the false positive rate must be roughly r over one minus r, times one minus p over p, times sensitivity. Put in a one in fifty thousand prevalence and a fifty percent precision target and you need a false positive rate near two in a hundred thousand. That is not a tuning problem, it is a statement about what the detector would have to be, and no amount of threshold adjustment gets you there if the detector is not that good.",
  failureMode: "You build an anomaly detector for agent runs that go off the rails. It looks strong offline. In production it fires two hundred times a day against three real incidents a month, the on-call mutes the channel in week two, and the three real incidents are then missed by a detector that technically caught them.",
  experiment: "For one rare-event detector you own, write down the target precision you would need for someone to act on it without checking, and the true prevalence estimated from ClickHouse. Solve the arithmetic above for the required false positive rate. Then compute the detector's actual false positive rate from ninety days of firings over ninety days of negative events. Report the ratio between required and actual.",
  reflection: "By what factor does your detector miss the false positive rate its own precision target requires?",
  forecast: { q: "Will any single anomaly detector in our stack show a measured ninety-day precision above fifty percent?" },
  recall: {
    q: "What did Axelsson compute, and what is the general form of the result?",
    a: "For a realistic intrusion prevalence he showed the false alarm rate must be on the order of one in a hundred thousand for an alarm to be even fifty percent likely to be real, and named the base rate as the limiting factor on intrusion detection performance.\n\nGenerally, to reach precision p at prevalence r the false positive rate must be roughly r over one minus r, times one minus p over p, times sensitivity. As prevalence falls, the required false positive rate falls proportionally, which puts a hard ceiling on rare-event detection independent of tuning."
  },
  deepDive: "Given this prevalence and this precision target, compute the false positive rate my detector would need and tell me whether that is physically plausible."
},
{
  id: "baserates-precision-target",
  track: "baserates", level: "applied",
  title: "Set your alert thresholds from a precision target, not from a threshold that feels right",
  source: "Betsy Beyer, Niall Richard Murphy, David K. Rensin, Kent Kawahara and Stephen Thorne, The Site Reliability Workbook, chapter on Alerting on SLOs, 2018",
  idea: "Alerting has four measurable attributes that trade against each other, and choosing a threshold without naming which one you are buying is guessing.",
  why: "The workbook chapter names precision, recall, detection time and reset time, and works through six successive alerting strategies showing what each buys and costs. A short window catches fast burns but has poor precision, because a brief spike consumes little budget yet trips the rule. A long window has good precision but slow detection and, worse, a long reset time, so the page keeps firing for hours after the problem is fixed.\n\nMultiwindow multi-burn-rate is the mechanism that resolves this. You alert on a fast burn rate over a short window and a slower burn rate over a long window, each requiring a shorter confirmation window to still be burning, which gives you both fast detection of severe burns and precision on slow ones, with a reset time of roughly a twelfth of the long window. The example given is a fourteen point four times burn rate over one hour, which corresponds to consuming two percent of a thirty-day budget, paging; and a six times burn rate over six hours, five percent of budget, also paging. The point is not the constants, it is that you pick them from a stated precision and detection-time target rather than from the number that looked reasonable when the dashboard was built.",
  failureMode: "The CPU threshold is eighty percent because it has been eighty percent since 2021. Nobody can say what precision that buys, so nobody can argue for changing it, so it fires eleven times a week and every one of those pages is triaged by muscle memory rather than judgement.",
  experiment: "Pick your noisiest paging rule. From Grafana, count its firings over thirty days and how many corresponded to real user-visible degradation. That is precision. Now write down the precision you would accept and the detection time you need. Compute the burn rate that consumes your chosen fraction of the error budget over your chosen window: burn rate equals budget fraction consumed divided by window length as a fraction of the budget period. Draft the replacement rule as a two-window condition and put it in a spreadsheet before you touch the alerting config.",
  reflection: "What precision does the current rule deliver, and what does the drafted replacement target?",
  forecast: { q: "If I ship the multiwindow replacement rule, will its page count over the following thirty days be at least fifty percent lower than the current rule's?" },
  recall: {
    q: "Name the four alerting attributes and say what multiwindow multi-burn-rate alerting buys.",
    a: "Precision, recall, detection time and reset time. Short windows give fast detection and poor precision; long windows give precision but slow detection and long reset times where the alert keeps firing after resolution.\n\nMultiwindow multi-burn-rate combines a fast burn rate on a short window with a slower burn rate on a long window, each gated by a shorter confirmation window. That gives fast detection of severe burns, precision on slow burns, and a reset time around a twelfth of the long window."
  },
  deepDive: "Help me convert this static threshold alert into a multiwindow burn-rate rule against my SLO, and state the precision it should deliver."
},
{
  id: "baserates-screening-criteria",
  track: "baserates", level: "applied",
  title: "Screening a population is a different decision from testing a suspect case",
  source: "J. M. G. Wilson and G. Jungner, Principles and Practice of Screening for Disease, WHO, 1968",
  idea: "Running a test across everyone rather than on cases you already suspect changes the prior, the cost structure and the ethics of the decision.",
  why: "Wilson and Jungner set out criteria that a screening programme must meet before it is worth running. Among them: the condition should be an important health problem, there should be an accepted treatment, facilities for diagnosis and treatment should be available, there should be a recognisable early stage, a suitable test should exist, the test should be acceptable to the population, and the cost should be economically balanced against the benefit as a whole. The criteria are not statistical niceties. They exist because screening a low-prevalence population necessarily imposes real costs on people who were never going to have the condition, and those costs need to be paid for by something.\n\nTesting a suspect case is different because the prior is already elevated by whatever made you suspect. Same test, same sensitivity and specificity, entirely different predictive value and entirely different cost balance. This is the distinction between running your guardrail model on every request and running it on requests that already tripped a cheap upstream filter: two-stage screening raises the prior for the expensive stage, which is exactly why medicine screens then confirms.",
  failureMode: "A quality classifier gets turned on for one hundred percent of agent responses because it was cheap to enable. Most flags are on responses that were fine. The team that has to review flags cannot keep up, so the review queue becomes a rubber stamp, and the programme now costs money and produces no signal - which is the failure Wilson and Jungner's cost criterion is meant to prevent.",
  experiment: "List every automated check that currently runs against one hundred percent of some population - all requests, all PRs, all tenants, all workflow runs. For each, write one line answering three of the criteria: is the thing it detects actually important, is there an accepted action when it fires, and is the total cost of acting on all its firings balanced against the benefit. Count how many survive all three.",
  reflection: "Which of your blanket checks failed the criteria, and what would the two-stage version look like?",
  recall: {
    q: "Why does Wilson and Jungner's framework treat screening as needing separate justification from testing?",
    a: "Because screening applies a test to a population where prevalence is low, so most positives are false and most of the cost lands on people who never had the condition. That cost has to be justified by an important condition, an accepted treatment, an acceptable test and a favourable overall cost balance.\n\nTesting a suspect case starts from an elevated prior, so the same test yields a much higher predictive value and a different cost calculation. Two-stage designs exist to raise the prior before the expensive test runs."
  },
  deepDive: "Take this blanket check I run on every request and design the cheap first stage that would make the expensive second stage worth running."
},
{
  id: "baserates-denominator",
  track: "baserates", level: "applied",
  title: "The denominator is the argument",
  source: "Kenneth J. Rothman, Sander Greenland and Timothy L. Lash, Modern Epidemiology, third edition, 2008",
  idea: "Risk, rate and odds have different denominators and therefore make different claims, and a chart can switch between them without looking like it changed.",
  why: "Rothman, Greenland and Lash separate the measures precisely. Risk is a proportion: cases divided by the number of people at risk over a stated period, dimensionless, bounded between zero and one, and meaningless without the period. An incidence rate has person-time in the denominator, so it carries units of one over time and is unbounded above. Odds is cases divided by non-cases. The three answer different questions and only approximate each other when the risk is small.\n\nThe engineering translation is exact. Error rate per request, error rate per session, and errors per tenant-hour are three different numbers with three different denominators, and a service can look better on one while getting worse on another. A retry loop lowers per-session failure while raising per-request failure. A change that makes long sessions more common lowers per-request error while every user's experience gets worse. Choosing the denominator is where the claim is made, and it is usually made silently by whoever wrote the query.",
  failureMode: "The reliability dashboard switches from errors per request to errors per session when sessions get longer, and the line goes down. Nothing improved. The population under the line changed, and the graph carries no annotation saying so, so the next quarterly review reports an improvement that never happened.",
  experiment: "Take your headline reliability number. Open the query. Write down the exact denominator in words, including the time window and the population filter. Then compute the same numerator against two other defensible denominators - per session and per tenant-hour, say - over the same thirty days in ClickHouse. Put all three on one row. Check whether they move in the same direction over the last three months.",
  reflection: "Did the three denominators agree on direction, and which one is on the dashboard?",
  recall: {
    q: "Distinguish risk, rate and odds by their denominators and say when they diverge.",
    a: "Risk is cases over the number at risk during a stated period, dimensionless and bounded by one. An incidence rate is cases over person-time, with units of one over time and no upper bound. Odds is cases over non-cases.\n\nThey approximate each other only when risk is small. As risk grows, odds exceeds risk and the rate diverges from both, so quoting one while meaning another silently changes the claim."
  },
  deepDive: "Here is my reliability query: tell me exactly what population sits in the denominator and what alternative denominator would tell a different story."
},
{
  id: "baserates-prior-shift",
  track: "baserates", level: "advanced",
  title: "When the traffic mix shifts, your classifier's outputs are wrong even though the model is unchanged",
  source: "Marco Saerens, Patrice Latinne and Christine Decaestecker, Adjusting the Outputs of a Classifier to New a Priori Probabilities, Neural Computation, 2002",
  idea: "Under prior shift the class-conditional densities are unchanged but the base rates move, and posteriors have to be rescaled or they are miscalibrated.",
  why: "Prior shift is the case where the probability of the features given the class stays the same but the class proportions change. The model learned posteriors that bake in the training-set priors, so when deployment priors differ the outputs are systematically wrong in a specific, correctable direction. Saerens, Latinne and Decaestecker give an expectation-maximisation procedure that estimates the new priors from unlabelled deployment data alone: start with the training priors, rescale each posterior by the ratio of new prior to old prior and renormalise, average the adjusted posteriors to get a better prior estimate, and repeat until it settles.\n\nThe reason this matters more for agent systems than for classical ML is that the mix moves constantly and for reasons unrelated to the model. Onboard one large enterprise tenant and your query distribution shifts overnight. Ship a feature that makes a rare workflow common and the base rate of the failure mode your guardrail was tuned for changes by an order of magnitude. The model is fine. Its calibration is not, and nothing in your monitoring will say so unless you are tracking the predicted positive rate against a labelled sample.",
  failureMode: "The confidence scores from the routing model were trusted enough to auto-approve above 0.9. Then a new tenant arrived with a different query mix and the fraction of traffic in the class the model was trained to be confident about halved. The threshold now auto-approves a class of requests it was never calibrated for, and there is no alarm because the model's own outputs still look confident.",
  experiment: "Pull the distribution of your classifier's predicted classes by month for the last six months from ClickHouse. Plot the predicted positive rate over time. Any step change that lines up with a tenant onboarding, a release, or a seasonal shift is a prior-shift candidate. Then hand-label one hundred events from the earliest month and one hundred from the latest and compare the true positive rates. If they differ, implement the rescaling: multiply each posterior by new prior over old prior and renormalise.",
  reflection: "Did the true positive rate move between the two months, and by how much?",
  forecast: { q: "Will this month's predicted positive rate for my classifier differ from last month's by more than twenty percent in relative terms?" },
  recall: {
    q: "What is prior shift and what does the Saerens procedure do about it?",
    a: "Prior shift is when the class-conditional feature distributions are unchanged but the class base rates differ between training and deployment. Posteriors learned under the old priors are then systematically miscalibrated.\n\nThe Saerens, Latinne and Decaestecker procedure uses EM on unlabelled deployment data: rescale each posterior by the ratio of estimated new prior to training prior, renormalise, average the adjusted posteriors to re-estimate the priors, and iterate to convergence."
  },
  deepDive: "Help me detect prior shift in my classifier from unlabelled production data and work out whether rescaling the posteriors would change any decisions."
},
{
  id: "baserates-reference-class",
  track: "baserates", level: "advanced",
  title: "Choosing the reference class is where the judgement lives",
  source: "Alan Hajek, The Reference Class Problem Is Your Problem Too, Synthese, 2007",
  idea: "Every frequency is a frequency within some class, and no formal rule tells you which class to use.",
  why: "Hajek's argument is that the reference class problem, long treated as an embarrassment specific to frequentism, afflicts every interpretation of probability including the subjective ones. A single event belongs to indefinitely many classes at once. This deployment is a deployment, a Friday deployment, a deployment of this service, a deployment touching the schema, a deployment by this engineer. Each class yields a different frequency and all of them are true statements about frequencies. Nothing in probability theory adjudicates between them.\n\nThe operative tension is that narrower classes are more relevant to the case in front of you but have fewer members, so their frequencies are noisier. Widen the class and you buy precision at the cost of relevance; narrow it and you buy relevance at the cost of precision. There is no formula for the trade, which means the choice is a judgement you are making whether or not you admit it. The discipline available is to state the class explicitly, and to check whether the answer changes materially across two or three defensible alternatives. If it does, the disagreement in the room is about the class, not about the number.",
  failureMode: "Someone says this kind of migration usually takes two weeks. Pressed on what kind means, it turns out to be three migrations, one of which was a rename. The estimate carries the authority of a frequency and the sample size of an anecdote, and the wider class of all schema migrations on this service says six weeks.",
  experiment: "Take an estimate you are about to give - a delivery date, a failure probability, an incident duration. Write down three reference classes you could draw it from, from narrow to broad, and get the count and the frequency for each from Jira or your incident record. Put the three numbers in a spreadsheet with their sample sizes. State which one you are using and why, in one sentence, in the document where the estimate appears.",
  reflection: "How far apart were the three classes, and which did you commit to?",
  recall: {
    q: "State the reference class problem and the trade-off it forces.",
    a: "Any single event belongs to indefinitely many classes, each with a different frequency, and probability theory provides no rule for choosing among them. Hajek argues this affects subjective interpretations as much as frequentist ones.\n\nThe trade-off is relevance against sample size: narrower classes match the case better but have fewer members and noisier frequencies, wider classes are more precise but less applicable. The practical response is to name the class explicitly and check whether the answer is stable across two or three defensible alternatives."
  },
  deepDive: "Give me three defensible reference classes for this estimate along with their sample sizes, and tell me whether the answer is stable across them."
}
);

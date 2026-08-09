/* Track: Measurement and validity. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "validity-construct-first",
  track: "validity", level: "core",
  title: "Construct validity is the question you answer before any statistics",
  source: "Lee J. Cronbach and Paul E. Meehl, Construct Validity in Psychological Tests, Psychological Bulletin, 1955",
  idea: "A metric means nothing until you can state the unobservable construct it stands for and the network of predictions that would show it stands for that and not something else.",
  why: "Cronbach and Meehl's move was to stop treating validity as a property of a number and start treating it as an argument about a theory. You name the construct, you write down the nomological network - the other constructs and observables it should relate to, and in which direction - and every relation in that network becomes a test the measure can fail. Confirmations accumulate into a case that the number is about the construct rather than about something that merely travels with it.\n\nThe price of this framing is that a failed prediction is ambiguous. Either the measure is wrong or the theory is wrong, and the data cannot tell you which. That ambiguity is not a defect of the method, it is the actual situation you are in, and a validity claim made without a network has simply assumed the answer instead of arguing for it.",
  failureMode: "You ship agent quality as the share of sessions with no user retry. It reads 94 percent. A release makes the agent slower, users abandon instead of retrying, and quality goes up. Nobody can show the number is wrong, because nobody ever wrote down what it was supposed to be a measure of.",
  experiment: "Take the single metric your dashboard uses most often to decide something. In a text file, write one sentence naming the unobservable construct it stands for. Then write three predictions the construct implies: two things this number must move with, and one thing it must not. Mark which of the three you have ever actually checked against data. Count them.",
  reflection: "Which of your three predictions would you least like to test, and what does that reluctance tell you about the metric?",
  recall: {
    q: "What does Cronbach and Meehl's nomological network require you to produce before claiming a measure is valid, and what stays ambiguous when one of its predictions fails?",
    a: "A written set of relations between the construct and other constructs and observables, so the measure generates predictions that could come out wrong rather than just producing numbers.\n\nA failure inside the network cannot separate a bad measure from a bad theory. You learn that something in the pair is broken, never which half."
  },
  deepDive: "Here is a metric my team reports weekly - help me write out its nomological network and find the prediction most likely to embarrass it."
},
{
  id: "validity-three-claims",
  track: "validity", level: "core",
  title: "Content, criterion and construct validity are three separate claims with three separate burdens of proof",
  source: "AERA, APA and NCME, Standards for Educational and Psychological Testing, 2014",
  idea: "Covering the domain, predicting an external outcome and measuring the construct are different arguments, and evidence for one is not evidence for another.",
  why: "Content evidence asks whether the items span the domain, and it is settled by judgement about coverage rather than by any coefficient. Criterion evidence asks whether the score predicts an external outcome, and it is a correlation you can compute against something you already have. Construct evidence asks whether the score behaves the way the construct should behave across the whole network. Three questions, three kinds of evidence, and a strong answer to one leaves the other two untouched.\n\nThe 2014 Standards go further and fold all of this into a single validity argument with distinct sources of evidence: content, response processes, internal structure, relations to other variables, and the consequences of use. The reframing matters because it puts the burden on the interpretation you intend, not on the instrument. The same eval can be valid for tracking regressions and invalid for choosing between two models, and the certificate does not transfer.",
  failureMode: "Your eval set of 200 prompts correlates 0.7 with human thumbs up, and the design doc calls the eval validated. That is one piece of criterion evidence against one noisy criterion. Nobody checked whether the 200 prompts span what users actually ask, so the eval is silent about the third of traffic it never sampled and will stay green while that third rots.",
  experiment: "For your main agent eval, write three lines and fill them today. Content: what fraction of the request categories in last month's ClickHouse traffic appear in the eval set. Criterion: which external outcome the score predicts, and the correlation. Construct: what the score would do if the agent got worse in a way the eval does not sample. Any line you cannot fill is a claim you have been making without evidence.",
  reflection: "Which of the three lines was blank, and what is the cheapest experiment that would fill it?",
  recall: {
    q: "You have shown your eval score correlates 0.7 with human ratings. Which validity claims does that support, and which are still unsupported?",
    a: "It supports a criterion claim against that one human rating, and only for the population you sampled. It says nothing about content coverage, because a set of prompts that all come from the easy third of traffic can correlate perfectly with ratings on that third.\n\nIt also says nothing about construct validity, since the score and the rating could share the same bias, for example both rewarding fluency over correctness."
  },
  deepDive: "Take my eval suite and tell me which of the Standards' sources of evidence I have, which I am missing, and which missing one bites first."
},
{
  id: "validity-reliability-ceiling",
  track: "validity", level: "core",
  title: "Reliability caps validity but never establishes it",
  source: "Frederic M. Lord and Melvin R. Novick, Statistical Theories of Mental Test Scores, 1968",
  idea: "A perfectly repeatable measurement of the wrong thing is perfectly reliable and completely invalid.",
  why: "Classical test theory writes an observed score as true score plus error, with error uncorrelated with the true score. Reliability is then the ratio of true score variance to observed score variance, estimated in practice as the correlation between parallel measurements. Notice what true score means here: it is the long run expectation of the procedure itself, not the thing you meant to measure. Reliability is therefore a statement about the procedure's consistency with itself, and consistency with yourself is available to any fixed rule, including a wrong one.\n\nThe one thing reliability does buy you is a ceiling. A measure's correlation with any other variable is bounded above by the square root of its reliability, so a measure with reliability 0.36 cannot correlate above 0.6 with anything, however valid the construct behind it. Low reliability is fatal, high reliability is merely permissive.",
  failureMode: "Your LLM judge at temperature zero returns the same score for the same trace every time, and that gets reported as evidence the judge is good. All it establishes is determinism. A judge that silently scores on response length is perfectly reliable too, and will keep telling you the verbose model is the better one for as long as you let it.",
  experiment: "Run your judge twice over the same 100 traces, once at temperature zero and once at your production temperature, and correlate the two runs. That is a reliability estimate. Separately, correlate the judge's score with response length in characters on the same 100 traces. Write both numbers down.",
  reflection: "What did the judge's score correlate with more strongly, its own second run or the length of the response?",
  recall: {
    q: "State the classical test theory decomposition and the ceiling it places on validity. Why does high reliability fail to establish that you are measuring the right thing?",
    a: "Observed score equals true score plus error, and reliability is true score variance divided by observed score variance. A measure's correlation with anything else cannot exceed the square root of its reliability.\n\nTrue score is defined as the expected value of the procedure over replications, so it is whatever the procedure stably captures. A rule that consistently measures verbosity has a true score, high reliability, and no validity for quality."
  },
  forecast: { q: "Will the correlation between your judge's score and response length in characters come out above 0.4?" },
  deepDive: "Help me design a parallel-forms reliability check for my LLM judge that does not just re-run the same prompt at the same temperature."
},
{
  id: "validity-attenuation",
  track: "validity", level: "core",
  title: "Measurement error drags every correlation towards zero",
  source: "Charles Spearman, The Proof and Measurement of Association Between Two Things, American Journal of Psychology, 1904",
  idea: "An observed correlation equals the true correlation times the square root of the product of the two reliabilities, so noise in either measure makes a real relationship look smaller than it is.",
  why: "Spearman's attenuation result: observed r equals true r times the square root of (reliability of x times reliability of y). Run it forwards to see the damage. A true correlation of 0.6 between two measures with reliability 0.7 each shows up as 0.6 times 0.7, which is 0.42. Drop both reliabilities to 0.5 and the same relationship reads 0.30. Nothing changed in the world; you looked through a dirtier lens.\n\nRun it backwards and you get the disattenuated estimate: divide the observed correlation by the square root of the product of reliabilities. Two cautions. The correction inflates sampling error along with the estimate, so a corrected correlation needs a wider interval than the raw one. And it assumes the two error terms are independent. If the same judge scores both variables, the errors are correlated, and the bias flips direction: shared method noise inflates the correlation instead of shrinking it.",
  failureMode: "You test whether a new retrieval step improves answer quality, find a correlation of 0.15, and conclude the effect is negligible. Your quality label has a test-retest reliability of 0.49. The retrieval flag is measured exactly, so the disattenuated estimate is 0.15 divided by 0.7, which is 0.21. You did not measure a small effect, you measured a moderate one through a noisy instrument and then killed the work.",
  experiment: "Pick one correlation your team has quoted between two metrics. Estimate each side's reliability: for a human or judge label, re-score 50 items and correlate the two passes; for a system metric, split the month into odd and even days and correlate the two halves. Divide the quoted correlation by the square root of the product. Write both the raw and the corrected number in the same sentence.",
  reflection: "How much of the effect you dismissed was real, and would the corrected number have changed the decision?",
  recall: {
    q: "Write the attenuation formula in words, and give the one condition under which measurement error inflates a correlation instead of shrinking it.",
    a: "Observed correlation equals true correlation times the square root of the product of the two reliabilities, so the observed value is always the smaller one under classical assumptions.\n\nThe exception is correlated errors. If the same instrument, rater or judge produces both measures, their errors share a component, and that shared method variance pushes the observed correlation above the true one."
  },
  deepDive: "Given my measured reliabilities, tell me the smallest true correlation I could detect at my current sample size, and whether the study was ever worth running."
},
{
  id: "validity-alpha-limits",
  track: "validity", level: "applied",
  title: "Cronbach's alpha measures internal consistency and nothing else you want",
  source: "Klaas Sijtsma, On the Use, the Misuse, and the Very Limited Usefulness of Cronbach's Alpha, Psychometrika, 2009",
  idea: "Alpha is a lower bound on reliability under assumptions people rarely check, it rises with item count regardless of item quality, and it says nothing about unidimensionality or validity.",
  why: "Alpha is k over (k minus 1), times one minus the ratio of the summed item variances to the total score variance, where k is the number of items. The k term is the problem in plain sight: hold average inter-item correlation fixed and add items, and alpha climbs on arithmetic alone. Sijtsma's argument is that alpha is a lower bound to reliability only under conditions that are rarely tested, that it is often a poor bound, and that better bounds exist and are computable.\n\nThe deeper misuse is treating alpha as evidence of a single underlying dimension. It is not. A scale made of two clearly distinct clusters of items can post a high alpha, because alpha responds to average covariance and does not care about its structure. High alpha tells you the items move together. It cannot tell you why, and it certainly cannot tell you they move with the construct.",
  failureMode: "Your eval rubric has twelve dimensions, alpha comes out at 0.91, and someone records the rubric as validated. Twelve items with mediocre correlations get you to 0.91 arithmetically. Worse, high alpha here is bad news rather than good: if the twelve dimensions are that redundant, you are paying twelve annotation costs to collect roughly one signal.",
  experiment: "Pull per-dimension scores for 100 traces from your rubric into a spreadsheet and compute the correlation matrix. Find the dimension with the highest average correlation to the rest. Delete it and recompute the overall pass or fail decision for every trace. Count how many decisions changed. If the answer is zero, that dimension is annotation cost with no informational return.",
  reflection: "How many of your rubric dimensions could you drop without changing a single ship decision?",
  recall: {
    q: "Two rubrics both report alpha of 0.9, one with four items and one with sixteen. What can you conclude about their reliability and their dimensionality?",
    a: "Very little about either. Alpha rises with item count at fixed average inter-item correlation, so the sixteen-item rubric can hit 0.9 with much weaker items than the four-item one.\n\nNeither number speaks to dimensionality. A rubric measuring two separate things can post a high alpha, and alpha is a lower bound on reliability only under assumptions that neither report has checked."
  },
  deepDive: "Here is the correlation matrix for my rubric dimensions - tell me how many distinct things it is actually measuring and which items are redundant."
},
{
  id: "validity-kappa-chance",
  track: "validity", level: "core",
  title: "Cohen's kappa exists because raw agreement counts the agreements chance would have given you anyway",
  source: "Jacob Cohen, A Coefficient of Agreement for Nominal Scales, Educational and Psychological Measurement, 1960",
  cheat: "Quote kappa with the matrix and both marginals: reviewers who each pass 95 percent hit 0.905 agreement by habit alone.",
  idea: "Kappa is observed agreement minus expected agreement, divided by one minus expected agreement, so the agreement the marginals alone would have produced scores zero.",
  why: "Expected agreement is what two raters would hit by matching their own habits with no communication at all. For each category, multiply the two raters' marginal rates for that category and sum across categories. Two reviewers who each pass 95 percent of traces have expected agreement of 0.95 times 0.95 plus 0.05 times 0.05, which is 0.905. If they actually agree on 90 percent of traces, kappa is (0.90 minus 0.905) divided by 0.095, which is about negative 0.05. Ninety percent agreement, worse than chance.\n\nThe denominator is the part people skip. One minus expected agreement is the headroom available above chance, so kappa asks what fraction of the achievable improvement the raters actually achieved. When the headroom is small, ordinary variation in the numerator swings kappa hard, which is why kappa always has to be read next to its marginals.",
  failureMode: "Two engineers review 200 traces, agree on 184, and the eval design doc records 92 percent inter-rater agreement as proof the rubric is clear. Both flagged 6 percent of traces as failures. Expected agreement is 0.8872, so kappa is 0.29. The rubric is not clear, it is just being applied to a stream where almost everything passes.",
  experiment: "Take any two-rater labelling you already have, or run one today on 100 traces with a colleague. Build the confusion matrix. Compute observed agreement, then expected agreement as the sum over categories of the product of the two raters' marginal rates, then kappa. Put kappa, the matrix and both marginals in the same place, and never quote the first without the others.",
  reflection: "How far apart were your raw agreement and your kappa, and which one had been getting quoted?",
  recall: {
    q: "Two raters each approve 90 percent of items and agree on 84 percent of them. Compute expected agreement and kappa, and say what it means.",
    a: "Expected agreement is 0.9 times 0.9 plus 0.1 times 0.1, which is 0.82. Kappa is (0.84 minus 0.82) divided by (1 minus 0.82), which is 0.02 divided by 0.18, or about 0.11.\n\nEighty four percent agreement is barely above what two raters would reach by independently following their own approval habits. The raters have almost no shared understanding of the boundary case."
  },
  forecast: { q: "Will the kappa from your next two-rater labelling round come out below 0.6?" },
  deepDive: "Here is my two-rater confusion matrix - compute kappa, tell me what the marginals are doing to it, and say whether the rubric or the sample is the problem."
},
{
  id: "validity-kappa-prevalence",
  track: "validity", level: "advanced",
  title: "Kappa collapses when the classes are unbalanced, which is exactly your situation",
  source: "Alvan R. Feinstein and Domenic V. Cicchetti, High Agreement but Low Kappa: I. The Problems of Two Paradoxes, Journal of Clinical Epidemiology, 1990",
  idea: "At extreme prevalence, high raw agreement can produce a near zero kappa, and a small shift in the marginals swings kappa wildly, so a kappa without its confusion matrix and base rate is uninterpretable.",
  why: "Feinstein and Cicchetti set out two paradoxes. The first: when one category dominates, expected agreement climbs towards observed agreement, the denominator shrinks towards zero, and kappa is squeezed out of the range where it means anything. The second is more uncomfortable: unbalanced marginals, meaning the two raters differ in how often they use each category, can raise kappa relative to balanced marginals at the same observed agreement. So a pair of raters with a systematic bias between them can score better than an unbiased pair.\n\nThe practical consequence is that kappa is not comparable across samples with different base rates. Byrt, Bishop and Carlin later formalised this as separate prevalence and bias indices reported alongside kappa, which is the right habit: report the confusion matrix and let the reader see which paradox is operating.",
  failureMode: "Your agent fails on 2 percent of traces. Two reviewers agree on 193 of 200, which is 96.5 percent, but one flagged 5 failures and the other flagged 4 and they only overlapped on 1. Expected agreement is 0.956, so kappa is 0.20 and the team concludes the rubric is broken and spends a week rewriting it. The rubric may be fine. At 2 percent prevalence there is almost no headroom for kappa to occupy, and the fix is to enrich the sample with suspected failures, not to rewrite the instrument.",
  experiment: "Take your last two-rater table. Recompute kappa after moving three traces from agreed-pass into agreed-fail, then again after moving three from agreed-pass into disagreement. Note how far kappa travels for a change of 1.5 percent of the data. Then build an enriched sample: pull 100 traces your monitoring already flags as suspicious, relabel those, and compute kappa there.",
  reflection: "How much did kappa move on three relabelled traces, and what did the enriched sample say that the raw sample could not?",
  recall: {
    q: "Raw agreement is 97 percent and kappa is 0.2. Give the two explanations Feinstein and Cicchetti would offer, and the diagnostic that separates them.",
    a: "Either the positive class is so rare that expected agreement nearly equals observed agreement, leaving no headroom, or the raters have unbalanced marginals distorting the chance correction.\n\nThe diagnostic is the confusion matrix itself. Compare the two raters' marginal rates: if they are similar and extreme, it is prevalence; if they differ substantially, it is bias. Kappa alone cannot distinguish them."
  },
  deepDive: "My failure rate is low single digits and kappa keeps coming out near zero - design me a stratified relabelling sample that makes the agreement number interpretable."
},
{
  id: "validity-agreement-threshold",
  track: "validity", level: "applied",
  title: "How much inter-annotator agreement is enough is a claim about your task, not a universal threshold",
  source: "Ron Artstein and Massimo Poesio, Inter-Coder Agreement for Computational Linguistics, Computational Linguistics, 2008",
  idea: "The habitual cutoffs were borrowed from other fields with no theoretical backing, and the standard you need depends on how much downstream error your labels can absorb.",
  why: "Artstein and Poesio trace the cutoffs in circulation back to their origins and find nothing underneath them. The verbal ladder from fair to moderate to substantial to almost perfect was offered by its authors as an arbitrary descriptive convenience, and the 0.8 and 0.67 lines were tentative suggestions in a different discipline. None of them was derived from any consequence of annotation error, and none of them knows anything about your task.\n\nTheir alternative is to reason downstream. Annotation noise propagates into whatever you compute from the labels, and the question worth asking is whether the noise is small relative to the difference you intend to act on. An agreement level that is comfortably sufficient for reporting a coarse trend can be nowhere near sufficient for ranking two model versions three points apart.",
  failureMode: "You accept a judge rubric at kappa 0.61 because a blog post said 0.6 counts as substantial, then use it to choose between two model versions that differ by 3 points on a 100-trace eval. At that agreement level the label noise alone moves the eval score by more than 3 points run to run, so the decision is a coin flip with a citation attached to it.",
  experiment: "Work out the agreement you need instead of grading the agreement you have. Fix the smallest quality difference you would act on. In a spreadsheet, take your current label column, add a column that flips each label independently with probability equal to your observed disagreement rate, recompute the eval score, and copy that row 200 times. Read off the 5th and 95th percentiles of the simulated scores. If that spread is wider than the difference you planned to act on, your labels cannot support the decision.",
  reflection: "What is the smallest difference your current labels can actually resolve, and how does it compare to the difference you have been acting on?",
  recall: {
    q: "Someone reports kappa of 0.7 and calls it substantial agreement. What is wrong with the inference, and what should you ask for instead?",
    a: "The verbal labels were published as arbitrary descriptions, not as thresholds derived from any consequence of error, so calling 0.7 substantial adds no information to the number.\n\nAsk what decision the labels feed and how much the label noise moves that decision. The usable answer is a simulated spread in the downstream quantity, compared against the smallest difference you would act on."
  },
  forecast: { q: "Will the simulated 5th-to-95th-percentile spread from label noise come out wider than the eval difference you were planning to act on?" },
  deepDive: "Given my disagreement rate and eval size, simulate how much of my measured model gap is label noise and tell me what sample size would fix it."
},
{
  id: "validity-krippendorff-alpha",
  track: "validity", level: "advanced",
  title: "Krippendorff's alpha handles the messy annotation setup you actually have",
  source: "Klaus Krippendorff, Content Analysis: An Introduction to Its Methodology",
  idea: "Alpha generalises chance-corrected agreement to any number of coders, missing judgements and ordinal or interval categories, which is what three people labelling overlapping subsets of traces requires.",
  why: "Alpha is one minus observed disagreement divided by expected disagreement. Two design choices do the work. First, it is computed over a coincidence matrix of value pairs rather than over rater pairs, so coders need not all label the same items and a trace with only one label simply contributes nothing rather than breaking the calculation. Second, disagreement is defined through a difference function chosen to match the level of measurement.\n\nThat second choice is the one that matters for rubrics. Under a nominal difference function, a 1 against a 5 and a 4 against a 5 are the same event. Under an ordinal or interval function, the distance is squared, so wild disagreement costs far more than adjacent-category noise. Since almost every eval rubric is ordinal and almost every reported agreement number treats it as nominal, most teams are punishing themselves for rounding.",
  failureMode: "Three reviewers each label an overlapping subset of traces on a 1 to 5 rubric. You compute pairwise Cohen's kappa on the three intersections, get three different numbers, and average them. The average has no interpretation, it silently discards every trace that only one person labelled, and it charges a 4 against a 5 the same as a 1 against a 5.",
  experiment: "Export your annotations as one row per item, coder and value, leaving gaps where a coder did not label an item. Compute alpha with an interval or ordinal difference function, then recompute it with the nominal one. The gap between the two numbers is the share of your disagreement that is adjacent-category noise rather than real conflict. If the gap is large, your raters agree more than your reporting says.",
  reflection: "How much did your agreement number improve when the rubric was treated as ordinal rather than nominal?",
  recall: {
    q: "You have three annotators labelling overlapping but unequal subsets on a 1 to 5 scale. Why does averaging pairwise kappa fail, and what does alpha do differently?",
    a: "Pairwise kappa only sees items both members of a pair labelled, so items with a single label are dropped and each pair is computed on a different sample. Averaging numbers from different samples produces something with no defined meaning.\n\nAlpha works from a coincidence matrix over all value pairs regardless of who produced them, tolerating missing judgements, and it applies a difference function so an ordinal scale is scored by distance rather than by exact match."
  },
  deepDive: "Here is my annotation export with three coders and gaps - compute Krippendorff's alpha under nominal and ordinal difference functions and tell me which disagreements are actually costing me."
},
{
  id: "validity-mtmm",
  track: "validity", level: "advanced",
  title: "Two methods of measuring the same thing should agree more than two methods of measuring different things",
  source: "Donald T. Campbell and Donald W. Fiske, Convergent and Discriminant Validation by the Multitrait-Multimethod Matrix, Psychological Bulletin, 1959",
  idea: "Lay out every trait against every method and check that the trait explains more of the variance than the instrument does.",
  why: "Build the matrix: traits down one side, methods across the other, correlations in every cell. Four kinds of cell result. Same trait and same method sits on the diagonal and is just reliability. Same trait measured two different ways is the convergent cell and should be high. Different traits measured the same way is the discriminant cell and must be lower than the convergent one. Different traits measured different ways should be lowest of all.\n\nThe inequality that has to hold is convergent above heterotrait-monomethod. When it fails, the shared instrument is contributing more common variance than the shared trait, which means your dimensions are properties of the measuring device rather than of the thing measured. This is the single most likely failure in LLM-based evaluation, where every dimension usually comes out of one judge model and therefore inherits one set of idiosyncrasies.",
  failureMode: "Helpfulness and factual accuracy both come from the same judge prompt and correlate 0.8. Helpfulness from the judge and helpfulness from a human correlate 0.45. The different-trait-same-method cell beats the same-trait-different-method cell, so the matrix is telling you plainly that you are measuring the judge, not the two traits.",
  experiment: "Pick two eval dimensions you believe are distinct, and two ways of scoring each: your judge and a human pass, or two judges built on differently worded prompts. Score 60 traces on all four combinations and put the four by four correlation matrix in a spreadsheet. Check one inequality: is same-trait-different-method higher than different-trait-same-method? Write down the two numbers.",
  reflection: "Did the inequality hold, and if not, how much of your rubric is method variance wearing two labels?",
  recall: {
    q: "Name the two cells of a multitrait-multimethod matrix whose comparison decides discriminant validity, and say what it means when the comparison goes the wrong way.",
    a: "Compare the monotrait-heteromethod cell, the same trait measured two different ways, against the heterotrait-monomethod cell, two different traits measured the same way. The first should be larger.\n\nWhen the second is larger, the method contributes more shared variance than the trait does. Your supposedly distinct dimensions are mostly an artefact of the instrument, and separating them in reporting is misleading."
  },
  deepDive: "Help me design a minimal multitrait-multimethod matrix for my eval rubric using two judge prompts and a small human pass, and tell me the smallest sample that would make it readable."
},
{
  id: "validity-operationalisation",
  track: "validity", level: "applied",
  title: "Operationalisation is a lossy compression you are responsible for",
  source: "Percy W. Bridgman, The Logic of Modern Physics, 1927",
  idea: "An operational definition makes a fuzzy construct countable by declaring the procedure that produces the count, which means the procedure is the definition and everything the procedure cannot see is now invisible to you.",
  why: "Bridgman's claim was that a concept is synonymous with the corresponding set of operations. Length is what the measuring procedure yields, and if you change the procedure you have changed the concept. As a theory of meaning this was later rejected, precisely because it implies two ways of measuring the same thing define two different things, which is the problem Cronbach and Meehl set out to solve. As a discipline for engineers it survives intact.\n\nWhat survives is the obligation. Once you write the procedure down completely, with every filter and exclusion visible, the gap between the procedure and the thing you claim to be measuring stops being hidden. You do not get to close that gap, but you do get to know its size, and knowing its size is what separates a metric you can defend from one you merely publish.",
  failureMode: "Task success is operationalised as the Temporal workflow reaching a completed state. A run where the agent finished confidently with a wrong answer counts as a success. A run where the user got exactly what they needed and closed the tab before the final activity counts as a failure. The definition is not wrong, it is just not what anyone in the room means by success, and nobody wrote the gap down.",
  experiment: "Write the exact procedure that produces your headline metric: the query, the filters, the exclusions, the time window, the deduplication rule. Underneath it, write the sentence you actually say in leadership meetings about what the metric means. Now mark every word in that sentence the procedure does not touch. That list is your measurement debt, and it should go in the dashboard description today.",
  reflection: "Which word in your leadership sentence is doing the most work that the procedure cannot support?",
  recall: {
    q: "What does an operational definition buy you, what does it cost, and why did strict operationism fail as a theory of meaning?",
    a: "It buys countability and reproducibility: the procedure fully determines the number, so two people running it get the same answer. It costs everything the procedure cannot observe, which becomes invisible rather than merely unmeasured.\n\nStrict operationism failed because it makes each measuring procedure define its own concept, so two methods of measuring temperature would be measuring two different things. Constructs exist above their operations, which is why construct validity had to be invented."
  },
  deepDive: "Here is the SQL behind my headline metric and the sentence I say about it - list every gap between the two and rank them by how much they could embarrass me."
},
{
  id: "validity-surrogate",
  track: "validity", level: "advanced",
  title: "A surrogate metric has to carry the whole treatment effect, not just correlate with the outcome",
  source: "Ross L. Prentice, Surrogate Endpoints in Clinical Trials: Definition and Operational Criteria, Statistics in Medicine, 1989",
  idea: "Prentice's criterion requires the true endpoint to be conditionally independent of the treatment once you condition on the surrogate, a bar almost no proxy metric clears.",
  why: "Prentice defines a valid surrogate as one where a test of no treatment effect on the surrogate is also a valid test of no treatment effect on the true endpoint. His operational criteria require the treatment to affect the surrogate, the treatment to affect the true endpoint, the surrogate to predict the true endpoint, and, the hard one, the full effect of the treatment on the true endpoint to be captured by the surrogate. Formally, the distribution of the true endpoint given the surrogate must not depend on the treatment.\n\nCorrelation gets you nowhere near this. A surrogate can track the outcome beautifully across observed variation and still sit off the pathway the intervention travels down, or on only one of several pathways. The clinical literature is full of cases where a treatment moved the surrogate in the desired direction while moving mortality the wrong way, which is exactly what happens when you optimise against a measure that merely correlates.",
  failureMode: "You adopt tool-call success rate as a proxy for agent quality because it correlates 0.6 with human ratings. Someone ships silent retries on failed tool calls. Tool-call success rate rises, latency rises, quality falls. The correlation was never the mechanism, so an intervention that moves the proxy without moving the outcome is not an edge case, it is the first thing optimisation finds.",
  experiment: "Run Prentice's fourth criterion against one change you have already shipped. You need weekly points where you have both the proxy and a real outcome measure, before and after. In a spreadsheet, regress the outcome on the proxy alone, then on the proxy plus a zero-one indicator for post-change. If the indicator keeps a meaningful coefficient, the proxy did not capture the effect and cannot stand in for the outcome. Twenty weekly points is enough to see it.",
  reflection: "Did your proxy absorb the effect of the change, or did the change indicator survive next to it?",
  recall: {
    q: "Your proxy correlates 0.8 with the outcome you care about. What does Prentice's criterion additionally demand, and what goes wrong if you skip it?",
    a: "It demands that once you know the surrogate, the treatment tells you nothing more about the outcome. The surrogate has to sit on the whole causal pathway from intervention to outcome, not merely covary with the outcome.\n\nSkip it and you can find interventions that move the proxy through a route that bypasses the outcome entirely. Optimisation will find those routes first, because they are cheaper than improving the real thing."
  },
  deepDive: "Take my proxy metric and the outcome it stands in for, and test whether the proxy absorbs the effect of a change or just correlates with the outcome."
},
{
  id: "validity-goodhart",
  track: "validity", level: "core",
  title: "A measure under pressure stops being a measure",
  source: "Charles Goodhart, Problems of Monetary Management: The UK Experience, 1975",
  idea: "Any observed statistical regularity collapses once pressure is placed on it for control purposes, because the relationship you exploited was never structural.",
  why: "Goodhart was watching monetary aggregates. The stable relationship between a particular measure of money and nominal income held for as long as it was merely being observed. The moment it became a target, banks and depositors reorganised their behaviour around the definition, the money that mattered moved into whatever the aggregate did not count, and the regularity dissolved. The relationship was a description of how a system behaved when nobody was leaning on it.\n\nThe general form is that correlations estimated under one regime are not invariant to changing the regime, because the agents inside the system respond to the rule. This is why a metric that has been reliable for two years tells you nothing about how it will behave in the first quarter after it becomes an objective. The evidence for its reliability was gathered under conditions you have just abolished.",
  failureMode: "P95 latency was a fair summary of user experience until it became a team objective. Six months later the slowest requests are cut off early and returned as degraded answers. P95 is green, satisfaction is flat, and both facts are consequences of the same change. The relationship between p95 and experience was a property of a system nobody was optimising.",
  experiment: "List the three metrics in your team's goals this quarter. For each, spend five minutes writing the cheapest way to move it without improving the thing it stands for. If you cannot find one, ask the engineer who has to hit the number, because they will have found it already. Then check the last two quarters of data for the signature: the targeted metric improving while a related untargeted metric flatlines.",
  reflection: "Which of your three goal metrics has the cheapest gaming route, and is anyone already on it?",
  recall: {
    q: "Why does a metric's two-year track record of tracking the thing you care about provide no assurance once you make it a target?",
    a: "The track record was gathered under a regime where nobody was optimising the metric. Making it a target changes the behaviour of the people inside the system, and the correlation was a property of that behaviour rather than a structural fact.\n\nSo the evidence and the new conditions do not overlap. You need a fresh check of whether the metric and the outcome still move together after the target is imposed, not the historical correlation."
  },
  deepDive: "Here are the metrics in my team's quarterly goals - find the cheapest way to move each one without improving the underlying thing, and tell me which one I should stop targeting."
},
{
  id: "validity-campbell-law",
  track: "validity", level: "applied",
  title: "The more a quantitative indicator drives decisions, the faster it corrupts what it monitors",
  source: "Donald T. Campbell, Assessing the Impact of Planned Social Change, Evaluation and Program Planning, 1979",
  cheat: "Goodhart says stop trusting the number; Campbell says the work drifts, so make unmeasured territory somebody's explicit job.",
  idea: "Campbell's law is the stronger claim: the indicator does not merely stop working, the process it monitors deforms itself to feed the indicator.",
  why: "Campbell's formulation is that the more any quantitative social indicator is used for social decision making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the processes it is intended to monitor. Two mechanisms, and the second is the dangerous one. The first is straightforward manipulation of the number. The second is honest reallocation of real effort towards whatever the indicator can see, which looks exactly like diligent work and produces no guilt in anyone.\n\nThis is why Campbell bites harder than Goodhart in an engineering organisation. Goodhart says the correlation breaks. Campbell says the underlying system reshapes itself around the measurement, so the thing you originally cared about is not merely mismeasured, it is now genuinely worse, and the people who made it worse were following the priorities you gave them.",
  failureMode: "Eval pass rate becomes the release gate. Nobody cheats, nobody games anything. What happens is that every hard case the eval does not contain stops getting engineering attention, because attention follows the score. Twelve months on, the eval sits at 96 percent and the support queue is full of failure modes the eval has never sampled and nobody was rewarded for fixing.",
  experiment: "Open your Jira board for the last two quarters and classify every completed ticket in the agent area into two buckets: moves a tracked metric, or fixes something real that no tracked metric sees. Compute the ratio for each quarter. Then look at the second bucket's absolute count over time. If it is shrinking, Campbell's law is running inside your team and you now have a number for it.",
  reflection: "What was the ratio, which way is it moving, and what was the last thing you fixed that no metric would have noticed?",
  recall: {
    q: "Distinguish Campbell's law from Goodhart's law, and say why the distinction changes what you should do about it.",
    a: "Goodhart is about the measure: pressure on a statistical regularity breaks the regularity, so the number stops tracking the thing. Campbell is about the system: the process being measured reorganises itself around the indicator, so the underlying reality degrades.\n\nGoodhart's remedy is to stop trusting the number. Campbell's remedy has to be organisational, because the damage is real work redirected. You need unmeasured territory to be somebody's explicit job, not just a caveat on the dashboard."
  },
  deepDive: "Help me classify my team's last two quarters of tickets into metric-driven and metric-invisible work, and tell me whether the balance is drifting."
},
{
  id: "validity-crud-factor",
  track: "validity", level: "advanced",
  title: "In a large enough dataset everything correlates with everything",
  source: "Paul E. Meehl, Why Summaries of Research on Psychological Theories Are Often Uninterpretable, Psychological Reports, 1990",
  idea: "In complex open systems the true correlation between any two variables is essentially never zero, so rejecting a null of exactly zero is a statement about your sample size rather than about your theory.",
  why: "Meehl called it the crud factor. Everything in an open system is connected to everything else through some chain of common causes, so the population correlation between two arbitrary variables is small but not zero. He backed this with a large survey of Minnesota schoolchildren in which the great majority of all pairwise cross-tabulations among dozens of unrelated variables came out statistically significant, simply because the sample ran to tens of thousands.\n\nThe consequence for inference is severe. If the null of exactly zero is always false, then a large enough sample rejects it every time, and a directional prediction from a vague theory has close to a fifty percent chance of being confirmed before the theory contributes anything. Significance under those conditions is weak corroboration. What earns credit is a risky prediction: a specific magnitude with an interval that the crud factor alone would not produce.",
  failureMode: "You have 400,000 sessions in ClickHouse and every A/B comparison you run comes back significant, including the one where the change was a copy tweak on an empty state. You start believing tiny effects because the p-values look decisive. The p-value is working correctly. At that sample size it is detecting the crud, and you are treating detection as importance.",
  experiment: "Pick ten columns from a large table that have no plausible relationship to each other: request hour, payload size, retry count, tenant tier as an integer, and so on. Compute all 45 pairwise correlations over a month of data. Count how many clear significance at 0.05, and write down the median absolute correlation. That median is your local crud factor, and any effect you want to claim has to clear it by a visible margin.",
  reflection: "What is your local crud factor, and how many of the effects you have shipped on this quarter are larger than it?",
  recall: {
    q: "Why does statistical significance provide weak corroboration for a directional hypothesis in a large observational dataset?",
    a: "Because the null of exactly zero is essentially never true in an open system. Variables are linked through webs of common causes, so a large enough sample will reject the null whatever you test, and the rejection reflects sample size rather than the theory.\n\nA directional prediction then starts with roughly a coin flip's chance of being confirmed by crud alone. Corroboration requires a prediction the crud factor could not have produced: a stated magnitude, with an interval, that the data could have fallen outside."
  },
  forecast: { q: "Will the median absolute correlation across your 45 unrelated column pairs come out above 0.05?" },
  deepDive: "Given my sample sizes, tell me what effect size stops being crud and starts being a finding, and how to write that threshold into our experiment template."
}
);

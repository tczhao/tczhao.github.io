/* Track: Technical and evidential prose. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "evidential-claim-and-boundary",
  track: "evidential", level: "sentence",
  title: "State the claim you can defend, then mark where your knowledge stops",
  source: "Michael Alley, The Craft of Scientific Writing",
  gatePrompt: "Paste a paragraph you wrote. Underline every claim, and beside each one write, in four words or fewer, the evidence you would produce if a reviewer asked how you know. Any claim with nothing beside it gets narrowed or gets a boundary.",
  fallback: "The new scheduler handles our workloads better than the old one and will keep up as the fleet grows. We benchmarked it against the current runtime last sprint and it came out ahead on every measure we looked at. There is no reason to expect trouble at higher tenant counts, so we are comfortable recommending it as the default for all teams.",
  idea: "Narrow the claim until your evidence covers it, then say in the same paragraph what you did not test.",
  why: "A technical reader evaluates a claim by hunting for its edge. That is the whole move: find the case where it breaks, and the claim collapses. An unbounded claim hands the reader the entire search space and gives them nothing to check against, so they either take it on faith or spend the rest of the document looking for your counterexample instead of following your argument.\n\nNaming the boundary yourself ends the hunt. You have already told them where an exception would live, which converts their scepticism into a specific question you can answer. It also reads as authority rather than caution, because only someone who actually ran the thing knows where it stops.",
  failureMode: "Universals with no denominator behind them: \"there is no reason to expect trouble at higher tenant counts\" when the load test topped out at fifty. The tell is a sentence that would be equally true if you had run no experiment at all. A reviewer who knows the domain will pick the one case you did not cover, and from then on the entire document is being read for what else you overstated.",
  experiment: "Take the strongest claim in something you wrote this week and write out the single sentence a hostile reviewer would use to defeat it. If that sentence is true, narrow the claim until it is false. If it is not true, add it to the paragraph as the stated boundary.",
  reflection: "Which claim did you have to narrow, and did narrowing it make the document weaker or just smaller?",
  recall: {
    q: "Why does an explicit boundary make a claim more persuasive rather than less?",
    a: "Because it makes the claim checkable. A bounded claim tells the reader exactly which cases would falsify it, so their scepticism turns into a specific answerable question instead of a general search for your blind spot.\n\nIt also signals that you know the shape of your own evidence, which is what distinguishes someone who ran the test from someone who is repeating a result."
  },
  deepDive: "Here is a paragraph from a design doc I am about to circulate - find the claims my evidence does not actually cover, and show me the boundary sentence I should be writing for the worst one."
},
{
  id: "evidential-denominator-in-the-sentence",
  track: "evidential", level: "sentence",
  title: "A ratio without its denominator in the same sentence is not evidence",
  source: "Michael Alley, The Craft of Scientific Writing",
  gatePrompt: "Paste a paragraph you wrote. Circle every percentage, multiple and \"up by\" phrase, and write the raw base next to it. Rewrite one of those sentences so the base sits inside the sentence rather than in your head.",
  fallback: "Retry volume was up over 300 percent in the hour after the rollout and the failure rate more than doubled, so we rolled back at 14:20. Error budget burn for the day came in at roughly 40 percent higher than a normal Tuesday. The change is clearly not safe to reship without further work on the connector timeout path.",
  idea: "Put the base count in the same sentence as the ratio, or drop the ratio and give the counts.",
  why: "A percentage is a compression that throws away the one number the reader needs to judge whether to care. Three retries becoming twelve and thirty thousand becoming a hundred and twenty thousand are both \"up 300 percent\", and they call for entirely different responses. Readers know this, so a bare ratio triggers one of two failure responses: discount it as spin, or fill in a base from imagination, which is usually far larger than the real one.\n\nPutting the base in the sentence also disciplines you. Many ratios stop being worth writing once you have to say out loud that the numerator moved from four to sixteen.",
  failureMode: "An incident summary built entirely from ratios: \"error rates jumped 40 percent, retries tripled, budget burn was up a third.\" Nothing in it survives the question \"out of how many?\" The severe version is a ratio of a ratio, such as a 50 percent increase in a rate that was already a percentage, which no reader can unpack without asking you.",
  experiment: "Open the last incident write-up or metrics update you sent. Count the percentages and multiples in it, then count how many have their base in the same sentence. Fix the ones that do not, and note how many of the ratios you deleted rather than repaired.",
  reflection: "How many of your ratios stopped being interesting once you wrote the base beside them?",
  recall: {
    q: "What are the two things a reader does when a ratio arrives without its denominator?",
    a: "They either discount the number as rhetoric, or they invent a base and over-read it. Both are worse than the plain counts, because you have lost control of the magnitude the reader is now reasoning with.\n\nStating the base in the same sentence is what turns a ratio from a rhetorical move into evidence."
  },
  deepDive: "Take the numbers in this incident write-up and tell me which ratios are doing real work and which ones are hiding a base I should be stating instead."
},
{
  id: "evidential-significant-figures",
  track: "evidential", level: "sentence",
  title: "Significant figures are a claim about precision, so do not inherit them from a calculator",
  source: "Michael Alley, The Craft of Scientific Writing",
  gatePrompt: "Paste a paragraph you wrote that contains measured numbers. For each one, write down the sample size and the precision of the instrument that produced it, then cut every digit the measurement cannot support.",
  fallback: "Across the sample the cache hit rate improved from 91.24382 percent to 94.5561 percent, and the mean saving works out at 12.4173 ms per request. The run covered about twenty minutes of afternoon traffic on one replica. On that basis the change pays for itself inside a quarter.",
  idea: "Round every reported number to the digits your measurement actually resolves, and say what the sample was.",
  why: "Digits are a statement, not formatting. Writing 12.4173 ms asserts that a repeat of the experiment would land within a ten-thousandth of a millisecond, and a reader who knows the domain reads that as either a measurement you cannot have made or a number you have not thought about. Either way the precision that was meant to sound rigorous becomes the reason to distrust the rest.\n\nThe reverse also holds. Honest rounding plus a sample size lets a reader estimate the noise themselves and decide whether your effect clears it, which is the calculation they were going to run anyway.",
  failureMode: "Spreadsheet residue in prose: \"a 43.7182 percent reduction\" from a twenty minute sample on one host. The same document usually pairs it with a vague sample description, so the reader gets six digits of precision on a quantity whose population is undefined. The fix is not tidying. Reporting three real digits and two invented ones is a false statement about what you measured.",
  experiment: "Search your last analysis or benchmark note for any number with more than three digits after the decimal point. For each, write the sample size beside it and cut back to the digits that survive. Count how many numbers changed.",
  reflection: "Which number in your draft was claiming a precision you could not reproduce tomorrow?",
  recall: {
    q: "Why is trimming significant figures a correctness fix rather than a style fix?",
    a: "Because the number of digits is itself a claim: it asserts the resolution at which the quantity was measured. Reporting more digits than the measurement supports states something false about the experiment.\n\nA reader who spots it stops trusting the analysis, not just the formatting, because it shows the numbers were copied rather than interpreted."
  },
  deepDive: "Here are the raw results and the paragraph I wrote about them - tell me how many significant figures each reported number is entitled to and why."
},
{
  id: "evidential-units-and-scale",
  track: "evidential", level: "sentence",
  title: "Units and their scale are part of the argument, not decoration",
  source: "Michael Alley, The Craft of Scientific Writing",
  gatePrompt: "Paste a paragraph with quantities in it. For each quantity, write the same number in the next unit up and the next unit down, and mark any place where the unit you chose makes the number look more convenient than it is.",
  fallback: "The new audit hook adds 0.25 seconds to each workflow start and costs roughly 40 dollars a day to run. Set against an annual platform spend in the millions this is immaterial, and a quarter of a second is not something anyone is going to notice on a job that runs for minutes. Recommend we enable it fleet-wide next sprint.",
  idea: "Choose the unit and the aggregation window that match the decision, and use the same basis on both sides of a comparison.",
  why: "The reader forms a size judgement before they evaluate anything, and the unit is what sets it. 250 ms and 0.25 seconds are the same quantity, but one lands in the register of latency budgets, where it is enormous, and the other in the register of human patience, where it is nothing. You have framed the conclusion in the choice of noun.\n\nMismatched aggregation does the same job more quietly. Per-request cost against annual budget makes any per-request cost vanish. Holding the basis constant on both sides forces the comparison the reader would have made if they had the raw numbers.",
  failureMode: "Cost stated per run and benefit stated per year, or latency stated in seconds when every other number in the system is in milliseconds. \"Adds 0.0004 dollars per invocation\" is technically true and useless next to a fleet doing two hundred million invocations a month. The tell is that switching every quantity to a common basis reverses the recommendation.",
  experiment: "Take the last proposal you wrote that compares a cost to a benefit. Restate both on the same basis, per request and then per month, and check whether the conclusion survives. Write down which unit you had originally chosen for each side.",
  reflection: "Did any of your quantities change register when you moved them to a common basis, and did that change what you would recommend?",
  recall: {
    q: "How can two accurate quantities produce a misleading comparison?",
    a: "By using different bases or scales on the two sides: cost per invocation against spend per year, or milliseconds on one side and seconds on the other. Each number is true, and the ratio the reader forms between them is not.\n\nFixing it means restating both sides on a single basis before the comparison is made."
  },
  deepDive: "Check the quantities in this proposal for mismatched units or aggregation windows, and tell me whether the recommendation survives a common basis."
},
{
  id: "evidential-uncertainty-words-need-a-scale",
  track: "evidential", level: "sentence",
  title: "Uncertainty words need a fixed scale or they mean whatever the reader wants",
  source: "Sherman Kent, \"Words of Estimative Probability\"",
  gatePrompt: "Paste a paragraph containing at least one hedge. Beside each of \"likely\", \"possible\", \"unlikely\", \"probable\" and friends, write the percentage you meant. Then ask one colleague what they read it as and write their number next to yours.",
  fallback: "It is likely that the dual-write window has to stay open for a second sprint. There is a real possibility that the backfill saturates the read replica during business hours, and it is conceivable though unlikely that we find schema drift on the older tenants. On balance we think the risk is manageable.",
  idea: "Attach a number or an agreed numeric band to every probability word, or delete the word.",
  why: "Kent's point, which has been reproduced many times since, is that estimative words have no shared scale. Readers given the same sentence assign \"probable\" anywhere from about 60 to 90 percent, and \"a real possibility\" spans nearly the whole range. The writer feels precise because they had a specific figure in mind; the reader receives a word and supplies their own, usually the one that suits their prior.\n\nThe damage is invisible at the time and shows up later. Everyone agreed on the sentence, so nobody detected the disagreement, and after the outcome each side can honestly claim the words meant what they now need them to mean.",
  failureMode: "A risk section built from a ladder of adverbs: \"likely\", \"a real possibility\", \"conceivable though unlikely\", with no anchors. Two readers walk out of the review agreeing on the text and holding estimates that differ by a factor of five. The other tell is a hedge stack, such as \"it is possible that we may potentially need\", which is three uncertainty markers doing the work of none.",
  experiment: "Take your last risk or status section, list every probability word, and write your intended percentage beside each. Send the list without your numbers to one colleague and ask for theirs. Count the pairs more than twenty points apart.",
  reflection: "Where did your number and your colleague's number diverge most, and what would have gone wrong if nobody had checked?",
  recall: {
    q: "What is the failure mode of an unanchored probability word, and what makes it hard to catch?",
    a: "Readers substitute their own probability, and the spread across readers is very wide, so a sentence everyone agrees with can encode estimates that differ several-fold. Nothing in the review surfaces the disagreement, because the words matched.\n\nThe fix is a fixed vocabulary with numeric anchors, agreed once and reused, or plain numbers in place of the words."
  },
  deepDive: "Here is my risk section - tell me the percentage each hedge is likely to be read as, and propose a fixed vocabulary I can reuse across these docs."
},
{
  id: "evidential-range-beats-adverb",
  track: "evidential", level: "sentence",
  title: "Prefer a range with a number to an adverb with a shrug",
  source: "Philip Tetlock and Dan Gardner, Superforecasting",
  gatePrompt: "Paste a paragraph containing a forecast or an estimate. Replace every soft qualifier with an explicit interval and a date, then mark which of your new intervals you would actually bet on.",
  fallback: "The migration should be substantially complete by end of quarter, assuming no major surprises. We expect the bulk of the remaining tenants to have moved by then and the tail should not take too much longer. Barring anything unforeseen, the legacy path can be decommissioned shortly afterwards.",
  idea: "Give an interval with numbers and a resolution date instead of a qualifier that cannot be wrong.",
  why: "Tetlock's finding is that calibration comes from feedback, and feedback needs a statement that can be scored. \"Substantially complete\" cannot resolve, so it produces no error signal, so your estimates never improve. A number with a date resolves against reality on a known day and tells you, and everyone else, how far off you were.\n\nThe reader gets something too. A vague qualifier moves the risk onto them: they still have to decide whether to staff for eight tenants or eighty, and now they must do it on your adverb. An interval transfers your actual belief, including how uncertain you are, which is the information they came for.",
  failureMode: "Unfalsifiable status prose: \"substantially complete\", \"the tail should not take too much longer\", \"barring anything unforeseen\". Six weeks later nobody can say whether the estimate was wrong, only that they feel misled. The giveaway is that the sentence would still be defensible at any outcome between 40 and 100 percent done.",
  experiment: "Take three estimates from your last status update and rewrite each as a range plus a date, in the form \"between X and Y by DD Mon\". Put them somewhere you will see them on that date, and check them when it arrives.",
  reflection: "Which of your intervals felt uncomfortably narrow to commit to, and was that discomfort about the estimate or about being scored?",
  recall: {
    q: "Why does a numeric interval improve your forecasting where a qualifier does not?",
    a: "Because an interval resolves. It can be checked against what happened, which generates the error signal that calibration requires, whereas a qualifier stays true whatever occurs and so teaches you nothing.\n\nIt also transfers the real belief to the reader, including its width, instead of making them guess how much uncertainty your adverb was carrying."
  },
  deepDive: "Turn the soft estimates in this status update into scoreable intervals with dates, and tell me which ones I have probably made too wide to be useful."
},
{
  id: "evidential-caption-states-the-finding",
  track: "evidential", level: "paragraph",
  title: "A caption should state the finding, not name the axes",
  source: "Michael Alley, The Craft of Scientific Presentations",
  gatePrompt: "Find a document of yours with a chart in it. Cover the body text and read only the captions. Write down the argument you can reconstruct from captions alone, then rewrite one caption as a full sentence that asserts what the figure shows.",
  fallback: "Figure 3: p99 workflow start latency by region, January to March. Figure 4: retry counts over the same period, split by connector type. Both charts are discussed in the analysis section below. The regional breakdown is included for completeness.",
  idea: "Write each caption as the assertion the figure supports, in a full sentence with the subject and the direction of the effect in it.",
  why: "Readers of technical documents skim on figures. They page through, read the captions, and only drop into the prose where a caption interests them. A caption that names the axes tells them what is plotted but nothing about why you plotted it, so the skimming reader collects a set of labelled rectangles and no argument, and the argument was the point of the document.\n\nAlley's assertion-evidence discipline also works backwards on you. If you cannot write the caption as a claim, the figure has no finding in it and probably belongs in an appendix. Forcing the sentence is a cheap test of whether each chart is earning its space.\n\nThe caption is also where you get to name the comparison. \"Latency by region\" leaves the reader to find the interesting region; \"latency in ap-south-1 tripled while other regions were flat\" points at it and makes the chart verification rather than exploration.",
  failureMode: "Captions that are titles: \"Figure 3: p99 latency by region, January to March.\" Nothing in it can be wrong, which means nothing in it is a claim. The variant that looks better and is not is the caption that defers, such as \"discussed in the analysis section below\", which asks the reader to hold an unexplained chart in memory until you get to it.",
  experiment: "Take a deck or design doc of yours with three or more figures. Rewrite every caption as an assertion with a direction in it, then read only the captions top to bottom and check whether they form the argument. Note any figure whose caption you could not turn into a claim.",
  reflection: "Did the caption-only pass reproduce your argument, and which figure turned out to have no finding in it?",
  recall: {
    q: "What test does an assertion-style caption apply to the figure itself?",
    a: "If you cannot write the caption as a claim with a subject and a direction, the figure has no finding and is probably decoration or appendix material.\n\nThe caption is also the only prose a skimming reader reliably reads, so it has to carry the point rather than the axis labels."
  },
  deepDive: "Here are the figures and captions from my design doc - rewrite the captions as assertions, and tell me which figures have no finding in them."
},
{
  id: "evidential-divide-the-labour",
  track: "evidential", level: "document",
  title: "Divide the labour: prose says what it means, the graphic shows that it is true",
  source: "Edward Tufte, The Visual Display of Quantitative Information",
  gatePrompt: "Find a document of yours that has a chart or table. Highlight every sentence that restates a value already visible in the graphic. Delete them, and write in their place one sentence saying what the pattern means and one saying where it stops holding.",
  fallback: "As Figure 2 shows, mean queue depth was 210 in January, 240 in February, 260 in March and 255 in April. Figure 2 plots these four monthly values for the primary cluster. The trend across the first quarter is therefore upward. Further detail is available in the linked dashboard.",
  idea: "Let the graphic carry the values and let the prose carry the interpretation, the mechanism and the limits.",
  why: "A chart and a sentence are good at different things. The eye reads magnitude, trend and outlier from a graphic far faster than from a list, so prose that recites the values is spending the reader's attention on work the chart already did, at a worse exchange rate. Meanwhile the thing the chart cannot say is what the pattern means, what caused it and where it stops being true, and that is precisely what gets crowded out when the paragraph is busy reading numbers aloud.\n\nThere is a second effect on the writer. Recitation feels like analysis while you are producing it, which is why the habit survives. A document where the prose is forbidden from restating values has nowhere to hide: either you have an interpretation or the section is empty, and finding out which one is the useful part.\n\nThe division also tells you when a chart is not needed. Four numbers with no shape do not need a chart, and a sentence carrying a single comparison does not need a figure to support it.",
  failureMode: "The narrated chart: \"As Figure 2 shows, mean queue depth was 210 in January, 240 in February, 260 in March.\" The reader has now read the same data twice and still does not know whether 260 is bad, what changed in March, or whether April's dip is a reversal or noise. The mirror-image failure is a figure dropped in with no prose at all, leaving the reader to infer which of the six visible patterns you meant them to notice.",
  experiment: "Open your most recent document containing a chart. Count the sentences that restate values from it, delete them, and write one interpretation sentence and one limits sentence in their place. Check that the section is shorter and says more.",
  reflection: "After deleting the recitation, did you have an interpretation ready, or did you discover the section had none?",
  recall: {
    q: "What is each medium doing when prose and graphic divide the labour properly?",
    a: "The graphic carries the values, the trend and the outliers, because the eye extracts those faster than a sentence can deliver them. The prose carries what the pattern means, what caused it and where it stops holding, which no chart can state.\n\nProse that restates the values is paying twice for one delivery and crowding out the only content it was uniquely able to provide."
  },
  deepDive: "Here is a results section with two charts - tell me which sentences are just narrating the figures and what interpretation should replace them."
},
{
  id: "evidential-iso-reader-outcomes",
  track: "evidential", level: "document",
  title: "ISO 24495-1 grades plain language on reader outcomes, not on a score",
  source: "ISO 24495-1:2023, Plain language, Part 1: Governing principles and guidelines",
  gatePrompt: "Take a document of yours with a real audience. Name the single reader and the single thing they must do after reading. Then mark every paragraph that does not help them find it, understand it or do it.",
  fallback: "I ran the runbook through a readability checker and it scores at about grade nine, so it should be fine for anyone on call. The sentences are short, we cut most of the jargon, and the acronyms are all expanded on first use. I think it is ready to publish.",
  idea: "Test the document against what its reader can actually find, understand and do, not against a grade level.",
  why: "Readability formulas count syllables and sentence length. They are indifferent to whether the right information exists, whether it is where the reader will look, and whether following it produces the intended action, which is why a short-sentenced runbook can score well and still strand someone at 3am. ISO 24495-1 defines plain language by reader outcomes instead: the reader finds what they need, understands it, and can use it.\n\nThe practical consequence is that the standard is testable and the score is not. Outcomes generate an experiment you can run with two people from the actual audience, and the failures it surfaces are structural: the rollback step is buried under a heading nobody would search, the precondition arrives after the command that depends on it. No formula reports those, and no amount of shortening sentences fixes them.\n\nIt also changes what a review is for. A reviewer asked whether the prose is clear will tell you about commas. A reviewer asked to carry out the task from the document alone will tell you where it breaks.",
  failureMode: "Clarity claimed by proxy: a grade level, a word count, or the fact that the acronyms are expanded. The document reads smoothly and the on-call engineer still cannot locate the rollback procedure, because it sits in a section titled \"Operational considerations\" behind two paragraphs of background. Every sentence is plain and the document is not.",
  experiment: "Pick one runbook or guide you own. Write down the three things a reader must be able to do with it, then hand it to someone who has not used it and watch them attempt one, without answering questions. Record where they stop, and fix that before anything else.",
  reflection: "What did your reader fail to find, and was it missing or merely misplaced?",
  recall: {
    q: "What does ISO 24495-1 substitute for a readability score, and why does that matter in practice?",
    a: "Reader outcomes: whether the reader can find what they need, understand it and use it. That is measurable with real readers, whereas a grade level measures sentence and word length only.\n\nIt matters because the common failures are structural rather than lexical - information missing, misplaced, or ordered wrongly - and no formula detects those."
  },
  deepDive: "Here is a runbook I own - design a short observation test against find, understand and use, and predict where a first-time reader will stop."
},
{
  id: "evidential-write-for-the-action",
  track: "evidential", level: "document",
  title: "Write for the action the reader has to take",
  source: "Federal Plain Language Guidelines, plainlanguage.gov",
  gatePrompt: "Take something you wrote that asks other people to do something. Write the required action, the deadline and the audience on a separate line, then check how far down the document each of those three currently appears.",
  fallback: "Over the last quarter the platform team has been consolidating workflow execution onto the new runtime, which reduces our operational surface and unblocks the multi-region work planned for H2. The rollout has gone well and we are grateful for everyone's patience during the dual-write period. Teams still on the legacy runtime will need to update their pipeline definitions before the cutover; details are in the appendix.",
  idea: "Open with what the reader must do, by when, in the words they use for it, and put the context after.",
  why: "A reader of an announcement is running one query: does this create work for me, and if so what and when. Everything before the answer is read at low attention, and much of it is not read at all. Context first inverts the priority: your reason for writing goes at the top and their reason for reading goes in the last clause, where a sizeable fraction of the audience never reaches it.\n\nVocabulary decides whether they recognise the work as theirs. You call it \"pipeline definitions\" because that is the internal noun; they call it \"my DAG\" or \"the connector config\", and a reader scanning for their own object misses the sentence entirely. Using their term is not a courtesy, it is what makes the item findable.\n\nThe deadline belongs beside the action, not in the appendix. Separating them produces the common outcome where everyone knows a migration is happening, nobody knows their own date, and the platform team concludes the comms were ignored.",
  failureMode: "The buried ask: two paragraphs of programme narrative and thanks, then \"teams still on the legacy runtime will need to update their pipeline definitions before the cutover; details are in the appendix.\" No date, no named audience, no owner, and the object named in a vocabulary the audience does not use. It will be followed by a second announcement complaining that the first was not actioned.",
  experiment: "Take the last announcement you sent that required action from other teams. Rewrite it so the first sentence names the audience, the action and the date, and confirm that the action noun is the word those teams use. Count the lines the reader now passes before reaching the ask.",
  reflection: "How far into your original did the required action appear, and whose vocabulary was it written in?",
  recall: {
    q: "What three things belong in the opening of a document that asks people to do something?",
    a: "Who has to act, what they have to do, and by when - stated in the vocabulary that audience already uses for the object.\n\nContext, rationale and thanks come after. A reader scanning for their own work stops as soon as they conclude there is none, so anything behind the narrative is effectively unpublished."
  },
  deepDive: "Here is a migration announcement I am about to send - tell me where the ask is buried, and whether I am naming the work in the recipients' vocabulary or mine."
}
);

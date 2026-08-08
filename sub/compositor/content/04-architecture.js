/* Track: Sentence architecture. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "architecture-cumulative-sentence",
  track: "architecture", level: "sentence",
  title: "The cumulative sentence puts the base clause first and adds everything after it",
  source: "Francis Christensen, A Generative Rhetoric of the Sentence",
  gatePrompt: "Find the longest sentence in your paragraph. Mark the word where the main clause finishes, then count the words before that mark. If the count is above eight, rewrite the sentence so the main clause completes first and every qualification follows it.",
  fallback: "Because the shard rebalancer holds a global lock while it recomputes ownership, and because that recomputation walks every tenant in the cluster rather than only the ones affected by the move, writes to unrelated tenants stall for the duration. Given the size of the largest region and the current tenant count, which has roughly tripled since the rebalancer was written, that duration is now between forty and ninety seconds.",
  idea: "Assert the main thing in a short base clause, then extend the sentence with free modifiers that add to what you have already said.",
  why: "An incomplete main clause is an open obligation. Until the subject meets its verb and the predication closes, the reader is holding unattached material with nowhere to put it, and every extra word before closure raises the cost of the next one. That is why a front-loaded sentence gets harder as it gets longer, and why a cumulative one does not.\n\nOnce the base clause lands, the proposition is stored. Everything after it attaches to something already understood, so each addition is cheap: the reader is refining a commitment rather than deferring one. This is how a fifty-word sentence can read faster than a twenty-five word one.",
  failureMode: "The sentence spends its first two lines qualifying a claim it has not made yet. \"Given the volume of writes during backfill and the fact that compaction has never been tuned for the current shard count, latency degrades.\" Twenty-two words of setup for a three-word point. The reader has to hold all the setup, discover what it was setup for, then re-read it to attach it.",
  experiment: "Take the three longest sentences in your last design doc. For each, write down the word position where the main clause closes. Rewrite any that close after word eight and note the new position. You should end with three numbers that all dropped.",
  reflection: "Which of your rewrites got longer rather than shorter, and did it get easier to read anyway?",
  recall: {
    q: "Why does adding twenty words after the base clause cost the reader less than adding twenty words before it?",
    a: "Before the base clause, the reader is holding material that has nothing to attach to, because the predication has not closed. Working memory is carrying an open obligation and each additional word extends it.\n\nAfter the base clause, the proposition is already committed. Each free modifier refines something the reader has stored, so it can be processed and discharged immediately."
  },
  deepDive: "Here is a paragraph from my design doc: find the sentences whose main clause closes late and show me one of them rebuilt as a cumulative sentence."
},
{
  id: "architecture-levels-of-generality",
  track: "architecture", level: "sentence",
  title: "Every addition is a downshift to a lower level of generality",
  source: "Francis Christensen, A Generative Rhetoric of the Sentence",
  gatePrompt: "Take one sentence from your paragraph and number its parts: 1 for the base clause, 2 for anything modifying the base clause, 3 for anything modifying a level 2. Write the sequence out beside the sentence, for example 1-2-3-2.",
  fallback: "The migration introduced meaningful risk to the platform, creating exposure the team considered material, and raising concerns about the overall stability of the release window. We mitigated where possible and monitored the rollout closely, which gave us confidence that the approach was sound.",
  idea: "Each addition should sit at a lower level of generality than the thing it modifies, moving from assertion towards the concrete.",
  why: "A modifier is read as an answer to an unasked question: such as? how? how do you know? Those questions all point downward, towards particulars. A modifier that answers them discharges the question and the reader moves on.\n\nA modifier at the same level of generality as its base answers nothing. The reader asks \"such as?\", receives another abstraction, and asks again. The sentence grows without descending, which is why over-written prose can feel both long and empty. Numbering the levels makes this visible without any appeal to taste: if the sequence is 1-2-2-2 and every 2 is another abstraction, the sentence never got anywhere.",
  failureMode: "Additions that restate rather than specify. \"The rollout was risky, presenting significant challenges, with implications for delivery.\" Three levels, no facts. Nothing in the sentence could be checked, contradicted or acted on, because it never descends past the abstraction it opened with.",
  experiment: "Number the levels in five consecutive sentences from something you wrote this week. Count how many never reach a level 3, then count how many reach level 3 with something a reader could verify. Two numbers, and the gap between them is your work.",
  reflection: "Where did you write a level 2 that was really a level 1 said again in different words?",
  recall: {
    q: "What is the reader doing that makes a same-level modifier feel like padding?",
    a: "Reading a modifier as an answer to a downward question: such as, how, in what way. Those questions are requests for particulars.\n\nA modifier pitched at the same level of generality returns another abstraction, so the question stays open. The sentence gets longer while the reader's search for the concrete referent goes unresolved."
  },
  deepDive: "Number the modification levels in this paragraph of mine and point out every addition that failed to descend to something concrete."
},
{
  id: "architecture-modifier-position",
  track: "architecture", level: "sentence",
  title: "Modifiers before the base clause suspend; modifiers after it accumulate",
  source: "Francis Christensen, A Generative Rhetoric of the Sentence",
  gatePrompt: "Mark every sentence in your paragraph that opens with a phrase or clause before its subject. Count them. Then move the opener to the end in half of them and read both versions aloud.",
  fallback: "After reviewing the last three incidents, we found the same failure in each of them. Following a discussion with the storage team and a look at the retention config, it became clear that the compaction job had never been tuned for the new shard count. In order to avoid a repeat during the December change freeze, we have raised the job memory limit and added an alert on compaction backlog.",
  idea: "Choose initial, medial or final position for a modifier by the effect you want, because initial suspends, medial interrupts and final accumulates.",
  why: "Position determines what the reader is doing while they read the modifier. An initial modifier arrives before there is anything to attach it to, so it is held in suspense and it colours everything that follows: useful when the qualification genuinely governs the whole claim. A medial modifier splits a frame the reader has already opened, which is why it feels like an aside and why a long one is painful. A final modifier attaches to a closed proposition, so it can be as long as you like.\n\nThe failure is not any one position. It is using the same position every time, because then position stops carrying information. If every sentence opens with a participial phrase, the reader learns nothing from the fact that this one does.",
  failureMode: "Every sentence entering through the same door. \"Following the incident, we...\", \"After reviewing the logs, we...\", \"In order to prevent recurrence, we...\" The prose acquires a plodding, briefing-note gait, and the qualifications that actually matter are indistinguishable from the ones that are just throat-clearing.",
  experiment: "Take a page you wrote. Tally the sentences by where the first modifier sits: initial, medial, final. If initial is more than a third of the total, convert the weakest ones to final position and re-tally. Two distributions, before and after.",
  reflection: "Of the openers you moved to the end, which one lost something real, and what was it doing up front?",
  recall: {
    q: "What does an initial modifier do to the reader that a final one does not?",
    a: "It arrives before there is a proposition to attach to, so the reader holds it in suspense and applies it retroactively to the whole main clause once that clause arrives.\n\nThat is worth the cost when the qualification genuinely governs the claim. It is wasted when the modifier only adds detail, because a final modifier attaches to a closed proposition at no cost."
  },
  deepDive: "Tally where the modifiers sit in this piece of mine and tell me which initial modifiers are earning their position and which are habit."
},
{
  id: "architecture-resumptive-summative",
  track: "architecture", level: "sentence",
  title: "Resumptive and summative modifiers let a sentence continue past its natural stop",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find every \"which\" in your paragraph. For each one, write two alternatives: one that repeats the noun it refers to, and one that names in a fresh noun what the whole preceding clause amounted to. Keep whichever of the three is clearest.",
  fallback: "We moved the retry budget into the sidecar, which meant the service no longer had to track attempts itself, which removed the last piece of shared mutable state, which had been the main obstacle to running more than one replica. This is something we should have done at the start of the year.",
  idea: "When a sentence needs to keep going, repeat a key noun or name what the clause just did, instead of hanging another relative clause off the end.",
  why: "A relative pronoun points backwards without saying where. The reader has to search for the antecedent, and the search space is everything before it: a noun, a phrase, or the whole clause. One \"which\" is a short search. A chain of them means each search starts from a position the reader is no longer sure about, and the sentence dissolves.\n\nA resumptive modifier repeats the noun, so the antecedent is supplied rather than searched for. A summative modifier goes further: it hands the reader a noun that names what the preceding clause amounted to, which both closes the search and advances the argument, because choosing the noun is an act of interpretation. \"...running more than one replica, a constraint that had shaped the service since 2022.\"",
  failureMode: "The which-chain, which is what a sentence does when it wants to continue and has no other mechanism. \"We moved the retry budget into the sidecar, which meant the service no longer had to track attempts, which removed the last piece of shared state, which had been the main obstacle to more replicas.\" By the third \"which\" the reader cannot say whether it points at the sidecar, the removal, or the whole preceding clause, and the sentence ends by trailing off rather than closing.",
  experiment: "Count the relative pronouns in your last long email or doc. Find the longest chain of them in a single sentence. Rewrite that sentence using one resumptive and one summative modifier, and count the pronouns again.",
  reflection: "When you wrote the summative noun, did you have to decide something you had been leaving vague?",
  recall: {
    q: "What is the difference between a resumptive and a summative modifier, and what does each fix?",
    a: "A resumptive modifier repeats a key noun from the clause just finished, then continues from it. It fixes an unclear antecedent by supplying the referent instead of pointing at it.\n\nA summative modifier introduces a new noun that names what the whole preceding clause amounted to, then modifies that. It fixes a clause-level \"which\" and forces you to interpret your own sentence rather than gesture at it."
  },
  deepDive: "Find the relative-pronoun chains in this draft of mine and show me one of them rewritten with a summative modifier."
},
{
  id: "architecture-level-diagram",
  track: "architecture", level: "paragraph",
  title: "Diagram a paragraph by levels and count how many sentences never leave level one",
  source: "Francis Christensen, A Generative Rhetoric of the Sentence",
  gatePrompt: "Write your paragraph out one sentence per line. Beside each line write the deepest modification level that sentence reaches: 1 for a bare base clause, 2 or 3 if it carries additions. Total the lines marked 1.",
  fallback: "The consumer lag alert fired at 02:14. The on-call engineer acknowledged it. The lag was caused by a slow downstream write. The write was slow because an index was missing. We added the index at 03:40. Lag cleared by 04:05.",
  idea: "Diagram a paragraph by modification level and treat a column of ones as a diagnosis rather than a style.",
  why: "A base clause asserts. It does not develop. A paragraph made only of base clauses hands the reader a sequence of propositions and leaves them to work out the relations, the weighting and the detail, because none of that has been written down. It reads as terse, which is often mistaken for clear, but the reader is doing the work you skipped.\n\nThe level diagram is useful precisely because it is mechanical. It does not ask whether the prose is good. It asks how much of what you know made it onto the page as development rather than assertion, and a column of ones answers that immediately.",
  failureMode: "Incident notes and status updates written as a list of facts with no subordination. Every fact arrives at the same rank, so the reader cannot tell which one was the cause, which was a symptom and which was incidental. The paragraph is accurate and almost useless to anyone who was not there.",
  experiment: "Diagram the last incident summary or status update you wrote. Write the level column. If more than two thirds are ones, rewrite the paragraph as three sentences, each with at least one level-2 addition, and diagram it again.",
  reflection: "When you merged the base clauses, which relation between them did you have to make explicit for the first time?",
  recall: {
    q: "What is a reader forced to do when a paragraph is nothing but base clauses?",
    a: "Supply the development themselves. Every proposition arrives at the same rank with no subordination, so the reader has to infer cause, weighting and relevance from adjacency alone.\n\nThe result reads terse rather than clear. The writer's knowledge of how the facts relate never reached the page."
  },
  deepDive: "Diagram this paragraph of mine by modification level and tell me which of the base clauses should have absorbed the ones around it."
},
{
  id: "architecture-texture",
  track: "architecture", level: "paragraph",
  title: "Texture: all base clauses is thin, all modification is mush",
  source: "Francis Christensen, A Generative Rhetoric of the Sentence",
  gatePrompt: "Count the words in your paragraph that sit inside free modifiers, meaning anything set off by commas before or after a main clause. Divide by the total word count and write the percentage at the top.",
  fallback: "The rollout, staged across three regions and paced by a canary that watched error rate and p99 latency, both of which had been recalibrated after the September incident, itself a consequence of thresholds set for a much smaller fleet, proceeded largely as expected, allowing for some noise in the Sydney region, where the smaller node pool has always made the percentiles jumpy.",
  idea: "Aim for a mix of assertion and development, because prose that is all base clauses is thin and prose that is all modification has nothing to hold on to.",
  why: "Texture is the ratio of assertion to development across a passage, and both extremes are diagnosable rather than a matter of preference. The base clause is where a reader commits a proposition to memory. Modification adjusts a proposition already committed. With too few base clauses, the reader is adjusting continuously without ever having stored anything, which is the specific sensation of reading dense prose and retaining none of it.\n\nAt the other extreme, all assertion and no development, the reader stores a lot and understands none of the relations. Neither failure is about sentence length. A short paragraph can be mush and a long one can be thin.",
  failureMode: "A single sentence carrying a whole paragraph of content, hinged on one weak verb. \"The rollout, staged across three regions and paced by a canary that watched error rate and p99 latency, both of which had been recalibrated after the September incident, proceeded largely as expected.\" The only thing asserted is that the rollout proceeded as expected: sixty words are hanging off an eight-word spine. The reader finishes with a lot of detail and no proposition worth keeping.",
  experiment: "Take two paragraphs you wrote, one that felt easy and one that felt like a slog. Compute the free-modifier percentage for both. If either is under 10 per cent or over 55 per cent, rewrite it towards the middle and note whether the reading changed.",
  reflection: "Which of your two paragraphs was closer to an extreme, and did the percentage match your instinct about which one was worse?",
  recall: {
    q: "What exactly is wrong with a paragraph that is nearly all modification?",
    a: "Base clauses are where a reader commits a proposition to memory; modifiers adjust a proposition already committed. With almost no base clauses, the reader is continuously adjusting without ever having stored anything.\n\nThat produces the specific experience of reading dense prose closely and retaining nothing from it, even though every phrase was comprehensible on its own."
  },
  deepDive: "Compute the assertion-to-modification balance in this passage of mine and tell me which paragraph is thin and which is mush."
},
{
  id: "architecture-stand-alone",
  track: "architecture", level: "sentence",
  title: "Klinkenborg's test is whether the sentence can stand up alone",
  source: "Verlyn Klinkenborg, Several Short Sentences About Writing",
  gatePrompt: "Copy your paragraph into a scratch file, then delete every sentence but one and read what is left. Do this for each sentence in turn and mark the ones that stop meaning anything on their own.",
  fallback: "This has been a problem for a while now. It gets noticeably worse whenever the batch size goes up, which it did last quarter. That is the main reason we are proposing the change. The alternative was considered and rejected earlier in the year.",
  idea: "Every sentence should carry enough of its own subject and claim that it still means something when lifted out of the paragraph.",
  why: "Readers do not read in order. They land mid-paragraph, skim back, re-read one line in a review comment, or quote a single sentence into a thread. A sentence propped up by its neighbours breaks the moment it is moved, and it gets moved constantly.\n\nThe mechanism inside the paragraph is the same one. \"This\", \"it\" and \"that approach\" each impose a backward lookup, and the lookups compound: by the fourth sentence the reader is resolving a pronoun whose antecedent was itself a pronoun. Naming the subject is not repetition, it is the thing that lets a reader enter anywhere.",
  failureMode: "Paragraphs where the subject is named once and then referred to for five sentences. \"That is the main reason we are proposing the change.\" Quoted into a Slack thread, that sentence conveys nothing at all, and quoting into a Slack thread is what happens to most sentences in a design doc.",
  experiment: "Take the last doc you wrote and pull out five sentences at random into a new file, in isolation. Count how many are comprehensible without the surrounding text. Rewrite the failures in place and re-run the pull.",
  reflection: "Which sentence did you have to name a subject in, and did the paragraph get worse for the repetition?",
  recall: {
    q: "Why does the stand-alone test matter, given that the sentence will in fact be read in its paragraph?",
    a: "Because it will not be. Readers skim, land mid-paragraph, re-read one line, and quote single sentences into reviews and threads, so sentences are routinely read out of position.\n\nAnd the same lookup cost applies in place: chains of \"this\", \"it\" and \"that\" compound, until the reader is resolving a pronoun whose antecedent was itself a pronoun."
  },
  deepDive: "Pull five sentences at random out of this doc of mine and tell me which ones collapse without their neighbours."
},
{
  id: "architecture-coordination-subordination",
  track: "architecture", level: "sentence",
  title: "Coordination claims two things are equal; subordination assigns rank",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Circle every \"and\" in your paragraph that joins two full clauses. For each, decide which of the two clauses is the point, then rewrite the other as a subordinate clause.",
  fallback: "We upgraded the operator to 1.9 and the reconcile loop started dropping events under load and we rolled back within the hour. The team reviewed the changelog and there was no mention of the new rate limiter and we have filed an issue upstream.",
  idea: "Use \"and\" between clauses only when the two genuinely matter the same amount, and subordinate whenever one of them is the point.",
  why: "Grammatical rank is read as informational rank. Two clauses joined by \"and\" tell the reader they are peers: equally important, equally worth remembering. That is a claim, and most of the time it is false, because one of the clauses is the finding and the other is the circumstance.\n\nSubordination does the ranking for the reader. \"After we upgraded the operator to 1.9, the reconcile loop began dropping events under load\" says which fact is the news. A chain of coordinated clauses says nothing about relative weight, so the reader has to guess, and readers default to weighting the last one, which is often just the last thing that happened.",
  failureMode: "The and-chain, which is what writing under time pressure produces. \"We reviewed the changelog and there was no mention of the rate limiter and we have filed an issue upstream.\" Three facts at equal rank. The important one, that the vendor shipped an unannounced behavioural change, is not even stated: it is left as an inference between two coordinated clauses.",
  experiment: "Count clause-joining \"and\"s in your last two documents. For each one, write a single word in the margin naming which clause is the point. Convert every case where you could name one, and count the remaining \"and\"s.",
  reflection: "How many of your coordinated pairs turned out to be genuinely equal in weight?",
  recall: {
    q: "What claim is a writer making every time they join two clauses with \"and\"?",
    a: "That the two clauses are peers: equally important, equally worth remembering. Readers map grammatical rank onto informational rank.\n\nUsually the claim is false, because one clause is the finding and the other is circumstance. Subordinating the circumstance does the ranking for the reader rather than leaving them to infer it."
  },
  deepDive: "Find the and-chains in this draft of mine and tell me, for each, which clause I should have subordinated."
},
{
  id: "architecture-parallelism",
  track: "architecture", level: "sentence",
  title: "Parallel structure carries three ideas without making them a list",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find a bulleted list in something you wrote this week, or three consecutive short sentences on one theme. Rewrite them as a single sentence with three items in identical grammatical shape, then put the two versions side by side.",
  fallback: "The new scheduler reduces queue time. It also gives us per-tenant fairness, which the enterprise accounts have been asking for. Another benefit is that we can drain a node without cancelling running work.",
  idea: "When three ideas belong to the same frame, put them in one sentence in identical grammatical shape rather than splitting them into separate sentences or bullets.",
  why: "Repeated syntax lets the reader reuse a parse. Once the shape of the first item is established, the second and third are slotted into a frame that is already built, so the marginal cost of the third item is close to zero. That is why a well-formed triple reads faster than three separate sentences carrying the same content.\n\nParallelism also states the relation by form instead of asserting it. Three items in identical shape are visibly members of one set: you never have to write \"these three benefits are related\". A bulleted list does this too, but at a price. Bullets suppress the connective tissue between items and licence you to leave the relation unexamined, which is why a list of five bullets often turns out to contain two real points and three restatements.",
  failureMode: "Coordinate ideas dissolved into separate sentences with different shapes, so nothing marks them as a set. \"The new scheduler reduces queue time. It also gives us per-tenant fairness. Another benefit is that...\" The reader has to notice, unaided, that these three sentences are one argument, and the phrase \"another benefit is that\" is the writer admitting the structure was not there.",
  experiment: "Take the longest bulleted list in your most recent doc. Rewrite it as one or two sentences using parallel structure. Count the items before and after: if the count drops, the bullets were hiding duplicates.",
  reflection: "Did forcing your items into one shape reveal that one of them did not belong?",
  recall: {
    q: "Why is a three-item parallel sentence often better than three bullets carrying the same content?",
    a: "Repeated syntax lets the reader reuse the parse of the first item, so the second and third slot into a frame that is already built, and identical shape states the relation by form rather than asserting it.\n\nBullets suppress the connective tissue between items and let the relation go unexamined, which is how a five-bullet list ends up holding two real points and three restatements."
  },
  deepDive: "Take this bulleted list from my doc, rewrite it as parallel prose, and tell me which items collapsed into each other when you did."
},
{
  id: "architecture-faulty-parallelism",
  track: "architecture", level: "sentence",
  title: "Faulty parallelism breaks a promise the sentence already made",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find every sentence in your paragraph with two or more items joined by \"and\" or \"or\". Read the frame plus each item separately, out loud, and mark any item that does not fit the frame on its own.",
  fallback: "The runbook covers restarting the collector, how to drain a node, and escalation paths for a page after midnight. Reviewers should check that the change is reversible, tested in staging, and whether the metrics dashboard has been updated.",
  idea: "Once two coordinated items share a frame, every later item must fit that same frame.",
  why: "Coordination sets up a prediction. From the first item the reader infers a slot with a specific grammatical shape, and from then on they are pattern-matching rather than parsing from scratch. That prediction is the whole efficiency gain of a coordinate series.\n\nA mismatched item invalidates the prediction, so the reader has to abandon the partial parse and rebuild the frame around the exception. The cost is not that the sentence becomes ambiguous, because usually it does not. The cost is a stumble the reader notices and attributes to carelessness, which is expensive in a document whose job is to make you look like you thought this through.",
  failureMode: "The series that changes shape at the last item, which is where it almost always happens, because the last item was added in a later edit. \"Check that the change is reversible, tested in staging, and whether the dashboard has been updated.\" The frame is \"check that the change is X\". The third item does not fit it and the reader has to re-enter the sentence to work out what it attaches to.",
  experiment: "Search your last document for \"and\" and \"or\". For every coordinate series, write out the frame plus each item as a separate short sentence. Count how many series produce at least one sentence that does not work.",
  reflection: "In the faults you found, was the broken item the last one, and had you added it after the fact?",
  recall: {
    q: "Why does faulty parallelism read as an error even when the sentence is grammatical and unambiguous?",
    a: "Because coordination sets up a prediction. From the first item the reader infers a slot with a specific grammatical shape and switches from parsing to pattern-matching.\n\nA mismatched item invalidates that prediction and forces a rebuild of the frame. The reader registers the stumble and attributes it to carelessness, independent of whether the meaning was ever in doubt."
  },
  deepDive: "Check every coordinate series in this document of mine by expanding the frame plus each item, and list the ones that break."
},
{
  id: "architecture-end-weight",
  track: "architecture", level: "sentence",
  title: "English drags weight to the end, so put the heaviest element there",
  source: "Steven Pinker, The Sense of Style",
  gatePrompt: "For each sentence in your paragraph, underline the longest phrase and note whether it lands at the end. Pick one sentence where it does not, and rewrite so it does.",
  fallback: "The fact that the retention policy applies per workspace rather than per connector, which most customers only discover during their first audit, is documented. We flagged that the two clusters running on the older node pool, the ones scheduled for replacement in Q3 but still carrying about a third of production traffic, are affected.",
  idea: "Put the longest and most complex phrase last, and keep the opening of the sentence short.",
  why: "A heavy phrase early in a sentence has to be held while the rest of the frame is still open. The reader is carrying a large, fully parsed chunk with nowhere to attach it, because the verb has not arrived. Move the same phrase to the end and it arrives when the frame is nearly closed, so it can be discharged as it is read rather than stored.\n\nEnd weight and the stress position usually want the same thing, which is convenient. The end of a sentence is both the cheapest place to process complexity and the place a reader takes as most emphatic, so the element you most want remembered and the element that is hardest to parse are usually the same element. When they are not, you have a real choice to make, and that is worth noticing rather than resolving by reflex.",
  failureMode: "A subject that is a paragraph and a predicate that is two words. \"The fact that the retention policy applies per workspace rather than per connector, which most customers only discover during their first audit, is documented.\" Thirty words of subject and then \"is documented\". By the time the verb arrives the reader has forgotten what it is a verb for.",
  experiment: "Find the five longest subjects in your last document, counted in words from sentence start to main verb. Rewrite any over ten words so the heavy material moves after the verb. Re-measure and note the new maximum.",
  reflection: "In the sentence you rewrote, did moving the heavy phrase to the end also change what the sentence emphasised, and was that an improvement?",
  recall: {
    q: "What are the two separate reasons for putting the heaviest phrase at the end?",
    a: "Processing: a heavy phrase early has to be held while the syntactic frame is still open, whereas at the end it arrives when the frame is nearly closed and can be discharged as it is read.\n\nEmphasis: readers take the end of a sentence as its stress position. The two usually agree, and when they disagree you have a genuine choice to make rather than a rule to apply."
  },
  deepDive: "Measure the subject lengths in this piece of mine and show me the worst offender rewritten with the weight moved to the end."
},
{
  id: "architecture-length-variance",
  track: "architecture", level: "paragraph",
  title: "Vary sentence length deliberately and save the short one for the point",
  source: "Verlyn Klinkenborg, Several Short Sentences About Writing",
  gatePrompt: "Count the words in every sentence of your paragraph and write the numbers out in a row. If no number is under eight, rewrite your single most important sentence until one of them is.",
  fallback: "The design doc proposes moving the workflow history store off the shared Postgres instance and onto a dedicated cluster with its own retention policy. This would remove the noisy-neighbour behaviour we have seen during large backfills and would let us tune vacuum settings for a write-heavy workload. The cost is roughly eleven thousand dollars a year, which is materially less than the engineering time we currently spend on incident response for this one component.",
  idea: "Treat sentence length as an instrument: run long while you develop, then drop to a short sentence at the point you most want remembered.",
  why: "Readers build a running expectation of sentence length from the sentences they have just read. A sentence that breaks the pattern gets attention for free, and the sharpest break available is a short sentence after several long ones. Nothing in the wording has to do the work.\n\nThere is a second effect. A short sentence closes its syntax immediately, so the whole proposition lands as one chunk with no held material. That combination, cheap to process and unexpected, is why the shortest sentence in a paragraph is read as its most emphatic, whether or not you intended it. Which means uniform length is not neutral: it spends the emphasis on nothing.",
  failureMode: "Paragraphs where every sentence runs 25 to 35 words, competent and unreadable, the standard output of a careful engineer writing a design doc at 5pm. Nothing is wrong with any individual sentence. There is also no signal anywhere about which of the six claims is the one you should carry into the meeting.",
  experiment: "Take three paragraphs from your last doc and write the word count of each sentence as a row of numbers. Find the paragraph with the narrowest spread and rewrite it so the shortest sentence is under eight words and is the claim you most want kept.",
  reflection: "Once you had a short sentence in the paragraph, did it turn out to be the right sentence to emphasise?",
  recall: {
    q: "Why is the shortest sentence in a paragraph read as its most emphatic, regardless of intent?",
    a: "Readers build a running expectation of sentence length, and a break in that pattern draws attention on its own. A short sentence after long ones is the sharpest available break.\n\nIt also closes its syntax immediately, so the proposition lands in one chunk with nothing held open. Cheap to process and unexpected at once, which is why uniform length is not neutral: it spends the emphasis on nothing."
  },
  deepDive: "Give me the sentence-length profile of this piece of mine paragraph by paragraph, and tell me where a short sentence would be doing the most work."
},
{
  id: "architecture-periodic-sentence",
  track: "architecture", level: "sentence",
  title: "The periodic sentence earns its delay only when the delay is the payload",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find any sentence in your recent writing where the main verb arrives after twelve or more words. Write down, in a few words, what the reader gets when the delay finally ends. If it is ordinary, flatten the sentence.",
  fallback: "After eighteen months of running the two systems in parallel, three failed cutover attempts, and a good deal of argument about whether any of it was worth the effort, we finished the migration. Having weighed the options carefully and consulted the affected teams, we decided to proceed.",
  idea: "Suspend the main clause only when what arrives at the end is worth the wait.",
  why: "Suspension is borrowing. Holding the main clause back keeps a syntactic frame open, and the reader carries every intervening phrase unattached until it closes. They tolerate that because the delay is itself a signal: a writer who makes you wait is promising the wait is the point.\n\nSo the debt has to be repaid at the close. A periodic sentence whose main clause turns out to be \"we finished the migration\" or \"we decided to proceed\" has spent the reader's patience and returned nothing, and the reader learns to discount the next suspension you attempt. The technique is strong and self-limiting: it works because it is rare, so using it for ordinary content destroys it.",
  failureMode: "Ceremonial build-up to a flat landing. \"Having weighed the options carefully and consulted the affected teams, we decided to proceed.\" Fourteen words of preamble to reach a decision the reader assumed on the first line. Worse, the preamble is content-free: nobody claims to have weighed the options carelessly.",
  experiment: "Search your last two docs for sentences beginning with \"Having\", \"After\", \"Given\" or \"While\". For each, cover the opener and read the main clause alone. Count how many main clauses are strong enough that you would still delay them.",
  reflection: "Of the suspended sentences you found, how many were building tension and how many were just clearing their throat?",
  recall: {
    q: "What does a periodic sentence borrow from the reader, and what repays it?",
    a: "It borrows working memory and patience: the main clause is withheld, so the frame stays open and every intervening phrase is carried unattached.\n\nOnly a payload that could not have gone anywhere else repays it. A suspension that lands on an ordinary main clause spends the patience and returns nothing, and teaches the reader to discount your next one."
  },
  deepDive: "Find the suspended sentences in this draft of mine and tell me which ones have a payoff worth the delay."
},
{
  id: "architecture-colon",
  track: "architecture", level: "sentence",
  title: "A colon is a promise that what follows explains what came before",
  source: "Bryan Garner, Garner's Modern English Usage",
  gatePrompt: "Find every colon in something you wrote this week. Cover what comes after each one, write down what you predict should follow from the clause before it, then uncover and compare.",
  fallback: "There is one thing to note: the rollout is scheduled for Thursday and the runbook is in the usual place. We have three concerns about the vendor: capacity, and the fact that they have still not confirmed a maintenance window.",
  idea: "Use a colon when the material after it delivers on a specific expectation created by the clause before it.",
  why: "A colon is structural, not ornamental. It tells the reader to stop expecting a new proposition and to expect the completion of the current one, which narrows their prediction sharply: an amplification, a list, an example, a definition. That narrowing is the entire value, because it makes the next clause cheaper to read.\n\nWhich is also the failure mode. If the clause before the colon says \"one thing\" and two things follow, or says \"three concerns\" and two appear, the reader has committed to a prediction that the sentence then contradicts. A comma or a full stop would have made no promise and could not have broken one. The colon is worth using precisely because it can fail.",
  failureMode: "Colons that announce a shape the sentence does not deliver. \"There is one thing to note: the rollout is Thursday and the runbook is in the usual place.\" Two things, announced as one. Or a colon dropped in where a full stop belongs, so it promises explanation and delivers an unrelated fact.",
  experiment: "Grep your last three documents for colons. For each, write the prediction the left side creates in one phrase, and tick it if the right side matched. Report the ratio.",
  reflection: "Which of your colons was doing real structural work, and which was there because the sentence felt like it wanted one?",
  recall: {
    q: "What prediction does a colon create, and how does a colon fail?",
    a: "It tells the reader to stop expecting a new proposition and to expect the completion of the current one: an amplification, list, example or definition. The narrowed prediction is what makes the following clause cheap to read.\n\nIt fails when the right side does not deliver the announced shape - one thing promised and two supplied, three concerns promised and two listed. A comma makes no promise and so cannot break one."
  },
  deepDive: "Check every colon in this document of mine against what its left side promises, and flag the ones that do not deliver."
},
{
  id: "architecture-semicolon",
  track: "architecture", level: "sentence",
  title: "A semicolon claims that two sentences are one thought",
  source: "Bryan Garner, Garner's Modern English Usage",
  gatePrompt: "Find every semicolon in your recent writing. Replace each with a full stop and read the resulting pair aloud. Restore the semicolon only where the full stop clearly severed something.",
  fallback: "The backfill finished on Sunday; the dashboard has been updated. Capacity planning for next quarter is still open; please send your numbers to the shared doc by Friday; the template is linked in the channel topic.",
  idea: "Use a semicolon only where two independent clauses are close enough that a full stop would break the thought.",
  why: "Punctuation between clauses is an instruction about closure. A full stop tells the reader to close the proposition, clear the buffer and start fresh. A semicolon tells them to hold the first clause open because the second one completes or turns it, and the pair should be evaluated together.\n\nSo a semicolon between unrelated clauses leaves the reader holding something they have no use for. They keep the first clause active, read the second, find no relation, and discharge both, having paid the cost for nothing. This is why a semicolon chain is worse than a comma splice: the splice at least signals haste, whereas the chain claims a unity of thought that is not there.",
  failureMode: "The semicolon used as a slightly grander comma, usually in announcements and status updates. \"Capacity planning is still open; please send your numbers by Friday; the template is in the channel topic.\" Three unrelated instructions welded into one thought. The reader is being told these connect, and they do not.",
  experiment: "Count the semicolons in your last month of writing. For each, apply the full-stop swap and decide in one word whether anything broke. Report how many survived, and be suspicious if it is most of them.",
  reflection: "Of the semicolons you kept, what was the relation between the clauses, and could you name it in a word?",
  recall: {
    q: "What instruction does a semicolon give the reader that a full stop does not?",
    a: "Hold the first clause open. A full stop says close the proposition and start fresh; a semicolon says the second clause completes or turns the first, so evaluate the pair together.\n\nWhen the clauses are unrelated the reader holds the first for nothing. The semicolon claimed a unity of thought that was not there, which is why a chain of them is worse than a comma splice."
  },
  deepDive: "Apply the full-stop swap to every semicolon in this piece of mine and tell me which ones actually earned their place."
},
{
  id: "architecture-fragment",
  track: "architecture", level: "sentence",
  title: "A fragment works when the fragment is the emphasis",
  source: "Verlyn Klinkenborg, Several Short Sentences About Writing",
  gatePrompt: "Find every sentence in your recent writing that has no finite verb. Mark each one \"meant it\" or \"did not\", and rewrite the ones you did not mean into full sentences.",
  fallback: "Two options on the table. Rebuild the indexer on the new streaming client, which the team has wanted to do since March. Or leave it and accept the lag during backfills. Which we have been doing for a year now and nobody outside the team has complained.",
  idea: "A fragment reads as emphasis only when the sentences around it are complete and controlled.",
  why: "A fragment has no grammatical signal marking it as intentional. The reader infers intent from context, and the only context available is the quality of the neighbouring sentences. Against a run of well-formed, deliberate sentences, a fragment is an obvious break in a pattern the writer clearly controls, so it reads as emphasis. Amid loose, comma-spliced, half-edited prose it reads as one more thing that got away.\n\nThe practical consequence is uncomfortable: you do not earn the right to a fragment inside the fragment. You earn it in the four sentences before it. This also explains why fragments survive edits badly, since a fragment that worked in a tight paragraph stops working the moment you loosen the paragraph around it.",
  failureMode: "Fragments produced by editing rather than by intent, which is most of them. \"Or leave it and accept the lag during backfills. Which we have been doing for a year.\" That \"which\" clause was the tail of a longer sentence that got cut in half, and it reads as an unfinished revision because everything near it is also slightly unfinished.",
  experiment: "Search your last document for sentences without a finite verb. For each, look at the two sentences either side and judge whether they are tight enough to make the fragment read as deliberate. Keep only the fragments that pass, and count how many you deleted.",
  reflection: "For the fragment you kept, what were the sentences around it doing that made it read as a choice?",
  recall: {
    q: "What determines whether a fragment reads as emphasis or as a mistake?",
    a: "The sentences around it. A fragment carries no grammatical marker of intent, so the reader infers intent from whether the writer visibly controls the neighbouring prose.\n\nAgainst tight, well-formed sentences it is a deliberate break in a pattern. Amid loose or half-edited prose it is one more thing that got away. You earn the fragment in the sentences before it, not in the fragment."
  },
  deepDive: "Find the verbless sentences in this draft of mine and tell me, for each, whether the surrounding prose is tight enough to make it read as deliberate."
}
);

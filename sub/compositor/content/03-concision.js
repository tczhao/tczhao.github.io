/* Track: Concision. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "concision-paramedic-method",
  track: "concision", level: "sentence",
  title: "The paramedic method is a procedure you run, not an attitude you hold",
  source: "Richard Lanham, Revising Prose",
  gatePrompt: "Take the longest sentence in your paragraph. Circle every preposition. Then write above it the answer to \"who is kicking whom\", rewrite the sentence with that pair as subject and verb, and write the before and after word counts in the margin.",
  fallback: "There has been a considerable amount of discussion within the platform team with respect to the question of the retention of workflow execution history in the primary cluster. It is the view of the team that a reduction in the retention window from thirty days to seven would be of benefit in terms of the reduction of storage cost. A decision on the part of the working group is expected in advance of the end of the quarter.",
  idea: "Run a fixed five-step sequence on the sentence: circle the prepositions, find the action, ask who is kicking whom, make that pair the subject and the active verb, and delete the run-up to the main clause.",
  why: "Prepositions are the joints where a sentence has been extended rather than rebuilt. When the actor and the action get dissolved into nouns, English has no way to reconnect them except \"of\", \"by\", \"in\" and \"with\", so a string of prepositions is a reliable physical marker of a buried verb. You do not have to judge whether the sentence feels heavy; you count circles.\n\nThat is the point of running it as a procedure. Taste is expensive and unreliable at five in the afternoon. A scan with a fixed output - the kicker, the kickee, the verb - produces the same revision whether you are fresh or not, and it produces it on the sentences you would otherwise have read past because you already knew what they meant.",
  failureMode: "Sentences whose subject is an abstraction and whose only verb is a form of \"be\" or \"have\", strung together with four or five prepositions: \"A decision on the part of the working group is expected in advance of the end of the quarter.\" Nobody in that sentence does anything. The working group decides by Friday, but you have to reconstruct that.",
  experiment: "Take the three longest sentences from something you shipped this week. Circle the prepositions in each, write the kicker and the kickee above it, then rewrite. Record the word count before and after. If a rewrite is not at least a quarter shorter, you skipped the kicker-and-kickee step and only trimmed.",
  reflection: "Which step did you want to skip, and what did skipping it cost you on that sentence?",
  recall: {
    q: "Name the steps of the paramedic method in order, and say which one does the actual work.",
    a: "Circle the prepositions. Circle the \"is\" forms. Find the action. Ask who is kicking whom. Put that pair into a simple active verb, then start fast by cutting the slow windup.\n\nStep four does the work. Circling prepositions only locates the damage; naming the kicker and the kickee is what gives you a subject and a verb to rebuild around. Everything else is diagnosis."
  },
  deepDive: "Here is a paragraph from my current draft. Run the paramedic method on it one step at a time, showing me the circled prepositions and the kicker-kickee pair for each sentence before you show me any rewrite."
},
{
  id: "concision-lard-factor",
  track: "concision", level: "paragraph",
  title: "Compute the lard factor so you know when you are finished cutting",
  source: "Richard Lanham, Revising Prose",
  gatePrompt: "Count the words in your paragraph and write the number down. Revise it, count again, and write the lard factor at the top as a percentage: original minus revised, divided by original.",
  fallback: "The purpose of this section is to provide an overview of the approach that we are proposing with regard to the migration of the scheduling service off of the legacy cluster. It is important to note that there are a number of different considerations that will need to be taken into account, including but not limited to the matter of the availability requirements of the downstream consumers of the service. Our recommendation at this point in time is that the migration should be carried out in a phased manner over the course of the next two quarters.",
  idea: "Divide the words you removed by the words you started with, and treat that percentage as the output of the revision rather than a side effect of it.",
  why: "Cutting without a number is governed by fatigue. You stop when the paragraph stops annoying you, which happens well before it stops wasting the reader's time, because by the fourth read you no longer see your own filler. A target converts an open-ended aesthetic task into a bounded one with a stopping rule, and bounded tasks survive bad afternoons.\n\nThe number also calibrates you against yourself. After twenty paragraphs you know your own baseline: a first draft that yields fifty per cent is normal for most working prose, and a paragraph that yields fifteen is either genuinely tight or one you did not attack. Which of those it is, you can usually tell by whether the fifteen came from adjectives or from restructured sentences.",
  failureMode: "Revision that reads as motion without distance. The writer swaps \"utilise\" for \"use\", changes two adjectives, declares the paragraph tightened, and ships something four words shorter than the draft. Every sentence still opens with \"The purpose of this section is to provide an overview of\" and the reader still pays for it.",
  experiment: "Compute the lard factor on the last three paragraphs you wrote for work. Write the three numbers in your notes. Then take whichever scored lowest and cut it again with the explicit target of fifty per cent, and note what you had to restructure rather than trim to get there.",
  reflection: "What was your lard factor, and which cut felt like it removed meaning but did not?",
  recall: {
    q: "What is the lard factor, how do you compute it, and what does a figure under twenty per cent usually mean?",
    a: "It is the proportion of the original draft removed by revision: original words minus revised words, over original words. Lanham uses it to make revision measurable rather than impressionistic.\n\nUnder twenty per cent usually means you trimmed words instead of rebuilding sentences. Real reductions come from turning nominalizations back into verbs and deleting whole clauses of setup, not from deleting adjectives."
  },
  deepDive: "Take this paragraph, give me your revision, and report the lard factor. Then tell me which of the cuts were structural and which were cosmetic."
},
{
  id: "concision-nominalization-train",
  track: "concision", level: "sentence",
  title: "Every nominalization drags two prepositions and an article behind it",
  source: "Richard Lanham, Revising Prose",
  gatePrompt: "Highlight every occurrence of \" of the \" in your paragraph. Count them. Convert the three that sit closest to the start of a sentence back into verbs and write the new word count.",
  fallback: "The implementation of the new rate limiter resulted in a reduction in the number of retries issued by the ingestion workers. Verification of the correctness of the configuration was performed by the on-call engineer prior to the enablement of the feature flag in production. The expectation of the team is that a further reduction in error rate will follow.",
  idea: "Count a nominalization as roughly four words, not one, because it cannot take a subject or an object directly and has to hire prepositions and articles to stand in for both.",
  why: "\"Verify\" takes an object without help: the engineer verified the config. \"Verification\" cannot. It needs \"of\" for its object and \"by\" for its subject, and each of those prepositions needs an article and often another noun. So one buried verb costs about four extra words, and three per sentence costs a dozen. This is why nominalization-heavy prose is long in a way that no amount of adjective trimming will fix.\n\nThe reader pays a second time. Function words carry no propositional content, but they still have to be parsed and held while the reader waits for the real predicate. A sentence with three prepositional chains keeps them in a holding pattern for twenty words before anything happens.",
  failureMode: "Prose where the verbs are all \"resulted in\", \"was performed by\" and \"is\", and the actual events are nouns: \"Verification of the correctness of the configuration was performed by the on-call engineer prior to the enablement of the feature flag.\" Twenty words. \"The on-call engineer checked the config before enabling the flag\" is ten and names the same events.",
  experiment: "Search your last design doc for \" of the \". Record the hit count. Convert ten of them by turning the noun back into a verb and giving it a real subject, then record the total word count before and after those ten edits. Divide to get the average saving per conversion.",
  reflection: "What was your average word saving per conversion, and which nominalization did you keep on purpose?",
  recall: {
    q: "Why is a nominalization a length problem and not only a clarity problem? Give the arithmetic.",
    a: "A verb takes its subject and object directly. A noun made from that verb cannot, so it borrows \"of\" for the object and \"by\" or \"in\" for the subject, and each preposition brings an article and a noun with it.\n\nThat is roughly four extra words per buried verb. Three nominalizations in a sentence add about a dozen words that carry no content, which is why converting them back is the single highest-yield cut available."
  },
  deepDive: "Find every nominalization in this passage, and for each one show me the verb it came from and the prepositions it is dragging, before you propose a rewrite."
},
{
  id: "concision-slow-windup",
  track: "concision", level: "paragraph",
  title: "The slow windup: your first two sentences are throat clearing",
  source: "Richard Lanham, Revising Prose",
  gatePrompt: "Delete the first sentence of your paragraph and read what remains. If nothing was lost, delete the new first sentence and read again. Mark the sentence where you had to stop, and count how many you removed.",
  fallback: "Before getting into the specifics it is probably worth setting a bit of context. As many of you will already know, the platform team has been looking at CI build times for a while now, and this has come up in a few different forums. What we have found is that ninety per cent of the wall clock time in a CI run is spent restoring a dependency cache that misses on almost every pull request.",
  idea: "Delete the run-up sentences in which you get ready to make your point, and open on the point itself.",
  why: "The windup exists because writing is thinking, and you need a few sentences to reach the claim. The reader does not need those sentences, because they arrive already oriented by the title, the channel and the thread. What is warm-up for you is dead air for them.\n\nThe compounding cost is worse than the words. Readers learn the shape of your openings within a handful of documents. Once they know your first two sentences are context, they start skipping them, and the one time you lead with the finding they skip that too. A fast open is partly about this document and mostly about being the kind of writer whose first line is worth reading.",
  failureMode: "A paragraph whose news is in sentence three: \"Before getting into the specifics it is probably worth setting a bit of context. As many of you will already know, the platform team has been looking at CI build times for a while now. What we have found is that ninety per cent of the wall clock time is spent restoring a dependency cache that misses on almost every pull request.\" The third sentence is the whole message, and the first two say only that a message is coming.",
  experiment: "Open the last four Slack posts or docs you wrote. Delete the first sentence of each. Count how many of the four lost anything at all. Then, for the ones that survived, check whether the second sentence would also have gone.",
  reflection: "How many first sentences survived the cut, and what were the survivors doing that the others were not?",
  recall: {
    q: "Why does a reader not need the context sentences that the writer needed to write?",
    a: "The writer uses them to reach the claim; the reader arrives with the orientation already supplied by the title, thread or subject line. Warm-up is a cost of composition, not a service to the reader.\n\nThe secondary cost is that habitual windups train readers to skip your openings, so the day you lead with the finding it gets skipped along with the throat clearing."
  },
  deepDive: "Tell me which sentence in this paragraph is the first one that carries news, and what the sentences before it were doing for me rather than for the reader."
},
{
  id: "concision-metadiscourse",
  track: "concision", level: "sentence",
  title: "Metadiscourse is writing about your writing, and nobody asked for it",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Mark every phrase in your paragraph that describes your own writing or reading process rather than the subject: \"it should be noted\", \"in this section\", \"as mentioned above\", \"we will now discuss\". Count them, then label each one delete or convert.",
  fallback: "It should be noted at the outset that this document does not attempt to cover the storage layer. In this section we will describe the changes we are proposing to the scheduler, and we will then go on to discuss the rollout sequence. It is worth pointing out that the reader should bear in mind that the dates given here remain provisional.",
  idea: "Cut the phrases that narrate your document, or convert them into structure the reader can see, such as a heading or a bullet.",
  why: "Metadiscourse occupies the subject and verb slots, which are exactly the positions a reader scans for the actor and the action. \"It should be noted that queue depth doubled\" puts an empty subject and a modal in the two most attended positions and demotes the actual claim to a subordinate clause. The reader has to strip the frame before the content arrives.\n\nSome of it is not deletable, only relocatable. \"In this section we will describe the rollout\" is a heading pretending to be a sentence. Headings do that job in one line, permanently visible, and cost the reader nothing while they read the section. That is the conversion case, and it is why a blanket delete rule produces documents that are hard to navigate.",
  failureMode: "Sentences whose grammatical subject is the document: \"It is worth pointing out that the reader should bear in mind that the dates given here remain provisional.\" Sixteen words to say the dates are provisional. The claim is buried under two layers of the writer talking about telling you something.",
  experiment: "Search your last doc for \"it should be noted\", \"it is important to\", \"in this section\", \"we will now\", \"as mentioned above\" and \"it is worth\". Record the hit count. Classify each hit as delete or convert to a heading, and report the two counts separately.",
  reflection: "How many were deletes and how many were headings in disguise?",
  recall: {
    q: "What are the two disposals for metadiscourse, and how do you tell which one applies?",
    a: "Delete it, or convert it into visible structure. Pure framing like \"it should be noted that\" and \"it is worth pointing out that\" is always deletable, because the claim behind it is the sentence you wanted.\n\nNavigational metadiscourse - \"in this section we will cover the rollout\" - is doing real work for the reader, so it converts into a heading or a list rather than disappearing. A heading does the job once and stays visible."
  },
  deepDive: "Point out every piece of metadiscourse in this draft and tell me which ones should become headings rather than simply vanishing."
},
{
  id: "concision-redundant-pairs",
  track: "concision", level: "sentence",
  title: "Redundant pairs say one thing twice and sound thorough doing it",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find every \"and\" in your paragraph that joins two adjectives or two nouns. For each one, delete the weaker half and read the sentence aloud. Count how many deletions changed the meaning.",
  fallback: "Each and every tenant will be fully and completely migrated before we deprecate the old endpoint. First and foremost we need a clear and unambiguous definition of what counts as a successful cutover, because any and all rollback decisions will hinge on it. Hopes and expectations here are that the whole exercise is done and finished inside a single maintenance window.",
  idea: "Delete one member of any pair whose halves mean the same thing.",
  why: "The second half of a redundant pair adds no proposition, so the reader parses it, finds nothing new, and discards it. The cost is not only the word. Doubling is a recognisable tic of writing that is performing thoroughness, and once a reader has spotted two of them they start discounting the confidence of every other claim on the page.\n\nThe habit is inherited. After the Norman conquest, English legal writing paired an Anglo-Saxon word with its French or Latin equivalent so that both audiences were covered: will and testament, cease and desist, breaking and entering. That reason expired several centuries ago, but the rhythm is still in the language and still feels formal, which is why it reappears whenever someone is writing to sound official.",
  failureMode: "Prose with a doubled adjective in every other clause: \"Each and every tenant will be fully and completely migrated.\" The sentence is making a real commitment, and the doubling makes it read as if the writer is padding a commitment they are not sure they can keep.",
  experiment: "Search your last two documents for \" and \". For each hit where both sides are the same part of speech, delete one side and ask whether the claim changed. Record the number of pairs you could delete and the number you kept, and check that the kept ones genuinely name two different things.",
  reflection: "Which pair did you keep, and what does its second half say that the first does not?",
  recall: {
    q: "Where do redundant pairs come from historically, and what is the test for deleting one?",
    a: "They come from post-conquest English legal drafting, which paired a native word with its French or Latin equivalent so both readerships were covered. Will and testament, cease and desist. The rhythm survived the reason.\n\nThe test is subtraction: delete one half and see whether the claim changes. \"Full and complete\" survives as \"complete\". \"Terms and conditions\" is arguably two things in contract law, so it survives the test where \"first and foremost\" does not."
  },
  deepDive: "List the redundant pairs in this passage and, for each, tell me which half to keep and why that half rather than the other."
},
{
  id: "concision-implied-modifiers",
  track: "concision", level: "sentence",
  title: "Some modifiers are already inside the noun they modify",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "List every adjective-noun pair in your paragraph. Say the opposite adjective aloud with the same noun. Cross out the adjective wherever the opposite names nothing that exists in your domain, and count the crossings.",
  fallback: "The final outcome of the failover exercise was that the standby region came up eleven minutes late. Past history suggests this is the usual result on cold infrastructure, so our future plans include advance planning for a warm standby in the second half. The basic fundamentals have not changed: we cannot honestly promise a fifteen minute recovery until something is already running.",
  idea: "Cut the adjective when its meaning is already contained in the noun.",
  why: "An adjective sets up a contrast. When the reader meets \"advance planning\" they briefly entertain the category of planning that is not in advance, find that no such thing exists, and drop the word. That is a small cost paid many times, and it accumulates into the sense that the writing is inflated even when the reader cannot say which words to remove.\n\nThe test is whether the negation names something real in your domain, and this is where a blanket rule goes wrong. \"Final outcome\" is usually redundant, but in a migration with interim cutover states, \"final\" earns its place because interim outcomes exist and you are distinguishing them. \"Advance planning\" never earns it. Run the negation test rather than memorising a blacklist.",
  failureMode: "Sentences padded with adjectives that restate the noun: \"Past history suggests this is the usual result, so our future plans include advance planning for a warm standby.\" History is past, plans are future, planning is in advance. Three words removed and the sentence loses nothing.",
  experiment: "Take your last written recommendation. List every adjective-noun pair. For each, write the negated adjective with the same noun and mark whether that thing exists in your work. Delete the adjectives that fail, and count how many you deleted against how many you kept.",
  reflection: "Which redundant modifier did you argue for keeping, and did the negation test actually support you?",
  recall: {
    q: "What is the test for a redundant modifier, and why is a blacklist the wrong tool?",
    a: "Negate the adjective and ask whether the resulting category exists in your domain. \"Retroactive planning\" does not exist, so \"advance planning\" is redundant. \"Interim outcome\" does exist in a phased migration, so \"final outcome\" can be doing work there.\n\nA blacklist fails because the same pair is redundant in one document and load-bearing in another. The test is contextual, which is why it has to be run rather than recalled."
  },
  deepDive: "Run the negation test on every adjective in this passage and tell me which ones survive it in the context of the system I am describing."
},
{
  id: "concision-obvious",
  track: "concision", level: "sentence",
  title: "Cut whatever the reader would have supplied without you",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Name the specific reader of your paragraph. Then mark every sentence that reader could reconstruct from the sentence before it. Delete those and count what you removed.",
  fallback: "To reproduce the bug you will need access to the staging cluster, which you can request in the platform channel. Once you have been granted access, log in. Now imagine a situation in which two workers pick up the same task at the same moment and both attempt to write the result. As is well known, this is a race condition.",
  idea: "Delete the sentences that state what a competent reader had already inferred from the sentence before.",
  why: "Every sentence carries an implicit promise that it will change the reader's state. A sentence that reports an inference they have already made breaks that promise, and after two or three breaks they downgrade the whole document to skimming. At that point they also skip the sentences that did carry news, which is how belabouring the obvious costs you more than its own word count.\n\nWith a senior reader there is a second cost that is not about attention. Spelling out an inference is a public estimate of what they can work out, and they read it as one. \"As is well known, this is a race condition\" tells a staff engineer that you were not sure they would recognise a race condition.",
  failureMode: "Instructions that narrate the trivial steps: \"Once you have been granted access, log in.\" Or explanations that name the concept after describing it in full: \"Two workers pick up the same task and both write the result. As is well known, this is a race condition.\" The reader got there a sentence earlier and is now waiting.",
  experiment: "Take the last technical explanation you sent a peer. Mark every sentence whose deletion would still let that specific person reconstruct it. Delete them, send the shortened version to that person, and ask directly whether anything is now missing. Record what they say.",
  reflection: "Did your reader flag anything as missing, and were you cutting for them or protecting yourself?",
  recall: {
    q: "\"Obvious\" depends on the reader, so what is the operational test?",
    a: "Name the actual reader, then ask what they can reconstruct from the preceding sentence without help. Anything they can reconstruct comes out. The test is unanswerable until you have named someone specific, which is why writing for a vague audience produces the most padding.\n\nThe cost of getting it wrong is asymmetric: an unnecessary sentence trains the reader to skim, while a missing one prompts a single question you can answer."
  },
  deepDive: "My reader is a staff engineer on an adjacent team. Tell me which sentences here they would have inferred anyway, and which ones I have wrongly assumed they already know."
},
{
  id: "concision-stock-phrases",
  track: "concision", level: "sentence",
  title: '"In the event that" is three words doing the work of "if"',
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: 'Search your paragraph for "in order to", "due to the fact that", "at this point in time", "with regard to", "prior to" and "in the event that". Replace every hit with its one-word equivalent and write the number of words you removed.',
  fallback: "In the event that the primary broker becomes unavailable, the consumer group will rebalance. Due to the fact that a rebalance takes up to ninety seconds, we have decided that in the majority of instances we should fail closed rather than degrade. It is possible that we will revisit this at a later point in time, in the event that the latency requirements change.",
  idea: "Learn the closed list of stock phrases and their one-word replacements, so the substitution happens by recall rather than by invention.",
  why: "These phrases are stored and retrieved as single chunks. That is why they do not feel long while you are writing: \"in the event that\" costs you one act of retrieval, the same as \"if\". The reader pays per word, so the cost only appears on the other side of the page, which means no amount of rereading your own draft will make them feel expensive.\n\nBecause the writing cost is invisible, the fix cannot be judgement. It has to be a list you can run mechanically: in the event that becomes if; due to the fact that becomes because; in the majority of instances becomes usually; at this point in time becomes now; at a later point in time becomes later; for the purpose of and in order to become to; with regard to and with respect to become about; prior to becomes before; subsequent to becomes after; in the absence of becomes without; has the ability to becomes can.",
  failureMode: "Prose that is grammatical, clear and thirty per cent longer than it needs to be: \"Due to the fact that a rebalance takes up to ninety seconds, we have decided that in the majority of instances we should fail closed.\" Nothing is confusing. Ten words are doing the work of four, and the effect is that the document feels heavier than its content.",
  experiment: "Put six of these phrases into a find list in your editor. Run it over the last document you wrote and record the hit count for each phrase. Do the substitutions. Run the same list next week over a new document and compare the counts, so you can see whether the habit is actually changing.",
  reflection: "Which phrase had the highest count, and did you notice yourself writing it this week?",
  recall: {
    q: "Why does the fix for stock phrases have to be a memorised list rather than an editorial judgement?",
    a: "They are lexicalized chunks, retrieved as one unit, so they cost the writer nothing to produce and do not feel long on rereading. The asymmetry between production cost and reading cost is invisible from inside the draft.\n\nA memorised list turns the fix into a find-and-replace pass that does not depend on noticing anything. In the event that becomes if, due to the fact that becomes because, prior to becomes before, and so on."
  },
  deepDive: "Scan this document for stock phrases, give me the hit count per phrase and the total words I would save, then let me do the replacing."
},
{
  id: "concision-empty-modifiers",
  track: "concision", level: "sentence",
  title: "Empty modifiers make a sentence longer and weaker in the same stroke",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Highlight every instance of very, quite, rather, fairly, certain, particular, various, actually, basically and generally in your paragraph. Delete all of them, reread, and reinstate only those whose absence changes a fact. Write the ratio reinstated.",
  fallback: "There are certain aspects of the retry configuration that are actually quite problematic in particular deployments. Individual workers will generally keep retrying for a fairly long time, which in a given cluster can be virtually indistinguishable from a hang. We should probably look at various options for capping this at some point.",
  idea: "Delete the modifiers that add no quantity and no restriction, and let the noun or the verb carry the claim.",
  why: "An empty modifier sits in the stressed position immediately before the noun, so the reader allocates attention proportional to that position and receives nothing. \"Certain aspects of the retry configuration\" gets the same processing as \"three aspects\" and delivers less than \"aspects\" alone.\n\nThe second effect is worse for a manager. A scalar modifier signals that you considered stronger wordings and declined them, so \"quite problematic\" reads as a deliberate step down from \"problematic\". You have spent a word to reduce your own force. In a document that exists to get a decision made, that is the opposite of what you were paying for.",
  failureMode: "A sentence where every noun has a vague quantifier attached: \"There are certain aspects of the retry configuration that are actually quite problematic in particular deployments.\" Which aspects, how problematic, which deployments. The modifiers create the shape of specificity without any of it, and the reader cannot act on the sentence.",
  experiment: "Run the highlight list over your last document and count the hits. Delete every one, then reinstate only the modifiers whose removal changed a fact, and record the reinstatement ratio. Anywhere you wanted to keep a vague quantifier, replace it with the actual number instead and see whether you know it.",
  reflection: "Where did deleting a vague modifier reveal that you did not have the number?",
  recall: {
    q: "Empty modifiers cost words. What is the second, larger cost?",
    a: "They weaken the claim. A scalar modifier signals that you considered a stronger word and chose not to use it, so \"quite problematic\" reads as a deliberate downgrade from \"problematic\" and invites the reader to discount your assessment.\n\nSo you pay words to lose force. In a document written to get a decision made, that is the whole document working against itself."
  },
  deepDive: "Flag the empty modifiers in this draft, and for each one tell me whether I should delete it or replace it with a number I have not bothered to look up."
},
{
  id: "concision-clearly-obviously",
  track: "concision", level: "sentence",
  title: '"Clearly" and "obviously" assert what you have not shown',
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: 'Find every "clearly", "obviously", "of course", "needless to say" and "it goes without saying" in your paragraph. Beside each, write the one sentence of evidence you would give if challenged. Count the ones where you could not write it.',
  fallback: "Clearly the right move is to put the scheduler behind the same ingress as the API. Obviously that widens the blast radius somewhat, but of course the alternative is a second ingress path that nobody will remember to patch. It is self-evident that we should not be maintaining two of these.",
  idea: "Delete the words that instruct the reader to agree, and put the evidence there instead.",
  why: "\"Obviously\" is an instruction to skip the verification step. A reader who already agrees does not need the instruction. A reader who does not agree now knows precisely which claim you could not support, because you have flagged it yourself: writers reach for these words at exactly the points where the argument is thinnest, and experienced readers have learned that correlation.\n\nWith senior readers there is a status effect on top. \"Obviously\" makes disagreement expensive, because objecting now means admitting you missed something obvious. Readers notice the manoeuvre, and it converts what should have been a technical objection into a question about whether you argue in good faith.",
  failureMode: "An argument whose load-bearing links are all asserted: \"Clearly the right move is to put the scheduler behind the same ingress as the API. Obviously that widens the blast radius somewhat, but of course the alternative is worse.\" Three claims, three intensifiers, no evidence. Whoever disagrees now has to fight the framing before they can discuss the design.",
  experiment: "Grep your last three documents for clearly, obviously, of course, needless to say and it goes without saying. For each hit, write the single sentence of evidence you would offer under challenge. Report the fraction where you could not produce one, and rewrite those sentences with the evidence in place of the word.",
  reflection: "Which of your \"obviously\" claims turned out to be the one you had not tested?",
  recall: {
    q: "What does \"obviously\" communicate to a reader who does not already agree with you?",
    a: "That this is the claim you could not support. Writers deploy these words where the argument is weakest, and readers who have noticed the pattern use them as a map of where to push.\n\nWith a senior reader there is also a status cost: the word makes objecting an admission of stupidity, which readers detect and resent, turning a design discussion into an argument about how you argue."
  },
  deepDive: "Find every place in this argument where I have asserted rather than shown, and tell me what evidence each of those sentences would need."
},
{
  id: "concision-load-bearing-hedge",
  track: "concision", level: "sentence",
  title: "Hedging a load-bearing claim is not caution, it is abdication",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Find the one sentence in your paragraph that carries the decision. Count the hedges in it: may, might, could, possibly, perhaps, somewhat, tend to, in some cases, we would suggest. Rewrite it with at most one, attached to a number or a named condition.",
  fallback: "It may perhaps be the case that a move to a single regional control plane would, in some circumstances, tend to reduce the operational load on the on-call rotation somewhat. We would suggest that this could possibly be worth considering as an option for next quarter, although there may well be factors that we have not fully taken into account at this stage.",
  idea: "Put at most one hedge on the sentence that carries your recommendation, and attach it to the specific quantity you are uncertain about.",
  why: "Hedges are legitimate. They mark the boundary of your evidence, and a writer who never hedges is either lucky or lying. The failure is stacking. Each hedge reads as an independent discount, and the reader multiplies them, so four hedges on one claim leave a proposition too weak to act on. The reader's options are to ignore the sentence or to send the analysis back, and both of those move the decision from you to them.\n\nThe diagnostic is to ask what decision the sentence is meant to enable. If someone has to choose after reading it, the sentence needs precision rather than softness: \"roughly thirty per cent lower, plus or minus ten, assuming the current alert volume\" is more honest than \"could possibly tend to reduce somewhat\", and it is also shorter. Fog is not the same as calibration.",
  failureMode: "A recommendation that recommends nothing: \"We would suggest that this could possibly be worth considering as an option for next quarter.\" Fifteen words, no claim, no owner, no date. The writer has protected themselves and left the reader with a decision they came to this document to have made for them.",
  experiment: "Open your last recommendation document. Find the single sentence a decision maker would quote. Count its hedges. Rewrite so at most one survives and it attaches to a named number or condition, then check whether you would defend the new sentence in a review. If you would not, the hedging was hiding a gap in the analysis rather than expressing one.",
  reflection: "After removing the hedges, did the claim hold up, or did it turn out you did not have the evidence?",
  recall: {
    q: "When is a hedge doing work, and when is it abdication?",
    a: "It is doing work when it marks a specific boundary of evidence: one hedge, attached to the quantity or condition you are genuinely unsure about, ideally with a range. That is calibration and it helps the reader decide.\n\nIt is abdication when hedges stack on the sentence that carries the recommendation. The reader multiplies the discounts, cannot act, and returns the decision to you. Precision, not softness, is the honest form of caution."
  },
  deepDive: "Identify the sentence in this document that a decision maker will quote, count its hedges, and tell me which single hedge is worth keeping and what it should attach to."
},
{
  id: "concision-negatives",
  track: "concision", level: "sentence",
  title: "A negative costs the reader a computation, so state the positive",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Count the negations in your paragraph, including unless, without, except, prevent, avoid, preclude and fail. Rewrite every sentence that carries more than one so that it carries at most one, and write both counts down.",
  fallback: "Do not disable the canary route unless the rollout has not completed. We are unable to avoid blocking writes to the shard while the reindex is running, so no deploy should proceed without first confirming that no backfill is in flight. Failure to check this has not been uncommon.",
  idea: "State what is true or what to do, and reserve negation for the cases where the positive form does not exist.",
  why: "A negative is an instruction to build the positive proposition and then invert it. That is one extra operation held in working memory. Two negatives in the same clause force the reader to hold an inversion while parsing the rest of the sentence, and under load they routinely drop one and take away the opposite of what you wrote. In a runbook, that is an outage.\n\nThe count is higher than it looks, because English carries negation inside ordinary words. Prevent, avoid, preclude, fail, doubt, unless, without and except are all negatives without using \"not\". \"No deploy should proceed without confirming that no backfill is in flight\" contains three, and the reader has to resolve all of them before they know whether to press the button.",
  failureMode: "Runbook and alert text that needs decoding under pressure: \"Do not disable the canary route unless the rollout has not completed.\" Someone at three in the morning has to work out that they should leave the route enabled while the rollout is still running, and they have a fifty per cent chance of getting it backwards.",
  experiment: "Take the last runbook step or alert description you wrote. Count every negation including the hidden ones. Rewrite so no sentence carries more than one, then read the original aloud to someone on-call and ask them to state the action. Note whether they get it right first time.",
  reflection: "Did your on-call reader decode the original correctly, and how long did they take?",
  recall: {
    q: "Name three words that count as negatives without using \"not\", and say why they matter.",
    a: "Prevent, avoid, preclude, fail, doubt, unless, without and except all carry negation inside the word. They matter because the reader's cost is per negation, not per \"not\", so a sentence can look positive and still demand three inversions.\n\nEach inversion is an operation in working memory. Two in a clause is where readers begin dropping one and reversing the meaning, which is why runbook steps should carry at most one."
  },
  deepDive: "Count the negations in this runbook text, including the ones hidden inside verbs, and show me one step rewritten in the positive."
},
{
  id: "concision-not-brevity",
  track: "concision", level: "paragraph",
  title: "Concision is not brevity: three sentences can be worse than nine",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Take your shortest paragraph. Between each pair of adjacent sentences, write the inference a reader must make to get from one to the next. Mark every inference you would not bet a new hire on making.",
  fallback: "We are moving to a sharded control plane with tenants pinned to shards. Rebalancing stays manual until the placement service lands. Cost neutral, failure domain shrinks, recommend we proceed this quarter.",
  idea: "Cut the words that do no work, not the words that carry the argument, and judge the result by what the reader has to reconstruct rather than by length.",
  why: "Concision targets propositional emptiness, not word count. Compression past a threshold does not remove work, it moves it: the links you cut still have to be built, and now the reader builds them from their own assumptions rather than your evidence. You have not saved anything, you have outsourced it and lost control of the answer.\n\nWhat gets cut first is exactly what should not. Transitions and warrants feel redundant to the writer because the writer can already see the connection. \"Cost neutral, failure domain shrinks, recommend we proceed\" is three claims with the reasoning between them deleted, and the reader who does not already know why pinning makes cost neutral has no way in. Nine sentences that each add a proposition are more concise, in the only sense that matters, than three that force three reconstructions.",
  failureMode: "Telegraphic summaries that read as decisive and land as unreadable: \"Cost neutral, failure domain shrinks, recommend we proceed this quarter.\" Every noun is a compressed argument. The people who can decode it are the people who were in the design review, which means the summary works only for the audience that did not need it.",
  experiment: "Take the shortest paragraph you wrote this week. For each sentence, write the inference the reader must make to reach the next one. Where you find an inference you would not bet a new hire on, add the missing sentence back. Count how many sentences you added, and check whether the paragraph is now longer and better.",
  reflection: "How many sentences did you have to add back, and were they transitions or warrants?",
  recall: {
    q: "What does concision actually target, and what is the failure mode of over-compression?",
    a: "It targets words that carry no proposition. Length is a symptom, not the metric, which is why a longer paragraph can be the more concise one.\n\nOver-compression moves work rather than removing it. The reader has to reconstruct the links you deleted, and they reconstruct them from their own assumptions. Transitions and warrants go first because the writer can already see the connection, so the sentences most worth keeping are the ones that feel most redundant to write."
  },
  deepDive: "This summary feels tight to me. Tell me which inferences a reader outside the design review has to make to follow it, and which of them they will get wrong."
}
);

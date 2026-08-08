/* Track: Shape of an argument. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "argument-answer-at-the-top",
  track: "argument", level: "document",
  title: "Put the answer at the top and make everything below it support",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Open a document you wrote in the last month. Find the single sentence that states what you actually want the reader to do or believe, note which page it is on, then paste it as the new first sentence and read the old opening after it.",
  fallback: "We have run the connector scheduler on Argo Workflows since 2022, and over that period the number of tenant workflows has grown roughly fourfold. Several teams have raised concerns about controller memory during the nightly peak, and last quarter we evaluated Temporal, Airflow and a bespoke scheduler against our requirements. This document walks through what we found, including the load test results and the cost model. Our recommendation, set out in section 5, is to move to Temporal over the next two quarters.",
  idea: "State the conclusion in the first paragraph and arrange everything after it as support for that conclusion.",
  why: "A reader builds meaning by fitting each new sentence into a structure they are already holding. Without the conclusion, there is no structure to fit anything into, so every fact you supply is stored loose and unclassified. That storage is expensive, it fills up, and by the time your answer arrives the reader has dropped half the evidence that was supposed to justify it.\n\nAnswer-first also changes what a partial read costs you. A pyramid can be cut at any depth and the reader who stops there is still holding something true, just less detailed. A chronology cut at any depth leaves them holding something false, because the qualifier that reverses it was in the part they did not reach.",
  failureMode: "The document reads as a tour of your investigation with the payoff at the end. The giveaway phrase is a forward reference: \"Our recommendation, set out in section 5, is...\" If the answer needs a cross-reference to find, it is in the wrong place.",
  experiment: "Take the last decision doc you sent. Delete everything above your recommendation, promote the recommendation to the first line, then reinsert only the deleted sentences that a reader would need to accept it. Count how many sentences you did not reinsert.",
  reflection: "Which sentences from the old opening did you fail to find a home for, and what does that say about why you wrote them?",
  recall: {
    q: "Why does answer-first help a reader who abandons the document halfway rather than only one who reads it all?",
    a: "A pyramid is true at every depth, so a reader who stops at level two holds a correct if coarse version of your case. A document ordered by discovery is only true once complete, because the conclusion that reframes everything sits at the bottom.\n\nMost of your readers stop early. Design for them."
  },
  deepDive: "Here is a doc I am about to send: tell me which sentence should be its first sentence and how far down that sentence currently sits."
},
{
  id: "argument-value-not-clarity",
  track: "argument", level: "document",
  title: "Clear and correct is not the same as valuable to a particular reader",
  source: "Larry McEnerney, \"The Craft of Writing Effectively\"",
  gatePrompt: "Take something you wrote for other people. Write one sentence naming the specific reader and the specific problem of theirs it changes. If you cannot name a problem that is theirs rather than yours, mark the document.",
  fallback: "This document describes how the workflow retry mechanism works. Retries are configured per activity with an initial interval, a backoff coefficient and a maximum attempt count. When an activity fails, the worker schedules the next attempt according to those parameters. The defaults are three attempts with a two second initial interval.",
  idea: "A document earns attention by changing what a specific group of readers believes about a problem they already have, not by being accurate and well organised.",
  why: "Clarity and correctness are properties of the text. Value is a property of the relationship between the text and a reader who is already worrying about something. Your reader is not an empty vessel waiting to be filled with accurate information; they have a live problem, a limited budget of attention, and a standing set of beliefs your document either disturbs or does not.\n\nThis is why perfectly clean documents get no response. Nothing in them contradicted anything the reader already thought. Prose that creates value names the instability first: something the reader believes is wrong, or costly, or no longer true.",
  failureMode: "A document that reads like reference material sent to people who did not ask for reference material. It explains a mechanism accurately, nobody replies, and you conclude the team does not read docs. The tell is that you could delete the audience line and send it to any team without changing a word.",
  experiment: "Pick a doc that got no engagement. Write the sentence \"Before reading this, you probably believe X\" and then \"After reading this, you should believe Y instead.\" If X and Y are the same, that is why nobody replied.",
  reflection: "For your last document, whose problem was it solving, and could that person have named the problem before you wrote?",
  recall: {
    q: "What does a document need beyond clarity and correctness before a busy reader will spend time on it?",
    a: "It needs to change something the reader currently believes about a problem the reader already has. Value lives in the gap between their existing belief and what you are showing them.\n\nA document that only transfers accurate information into an untroubled mind creates no value, however well it is written."
  },
  deepDive: "Read this doc and tell me what belief it is trying to overturn, and whether the intended reader actually holds that belief."
},
{
  id: "argument-write-to-think-vs-read",
  track: "argument", level: "document",
  title: "Writing to think and writing to be read are two different documents",
  source: "Larry McEnerney, \"The Craft of Writing Effectively\"",
  gatePrompt: "Take a draft you worked something out in. Number its paragraphs, then write next to each one whether it is there because it was a step in your thinking or because the reader needs it. Count the first kind.",
  fallback: "We started with the CPU metrics on the worker nodes, which looked normal across the window. We then checked the database connection pool, and while the pool was near its limit at 02:20, it was not saturated. Next we pulled a goroutine dump from one of the stuck workers. That is when we noticed that the activity heartbeat timeout was set to 30 seconds while the activity itself routinely takes 45.",
  idea: "The draft that helped you work something out is organised around your discovery, and it has to be rebuilt around the reader's questions before it is sent.",
  why: "Thinking on the page is chronological and exploratory by necessity: you write the dead ends because at the time you did not know they were dead ends. That structure is a faithful record of a search. It is a terrible interface, because it makes the reader repeat the search in order to reach the finding.\n\nThe rebuild is not editing. Editing improves sentences inside an existing structure. What is needed is a different top: the finding, then the two or three things that make it credible, then the eliminated alternatives compressed to a clause. The exploratory draft becomes source material, not a first draft.",
  failureMode: "Prose that narrates elimination. \"We then checked the connection pool, and while it was near its limit, it was not saturated.\" Nobody asked about the connection pool. It is in the document because it was in your afternoon.",
  experiment: "Take your last investigation write-up. Write the finding as a single sentence on a blank page, then pull up only the evidence a sceptic would demand for that sentence. Compare the word count with the original.",
  reflection: "What survived the rebuild, and what were you keeping only because it cost you time to find out it did not matter?",
  recall: {
    q: "What structural change turns a thinking draft into a reading draft?",
    a: "The organising principle changes from the order in which you learned things to the order in which the reader needs them, which means the finding moves to the top and eliminated paths compress to a clause or vanish.\n\nIt is a rebuild rather than an edit, because improving the sentences of a chronology still leaves a chronology."
  },
  deepDive: "This draft is how I worked the problem out; help me identify what the reader actually needs from it and what was only scaffolding."
},
{
  id: "argument-scqa-opening",
  track: "argument", level: "paragraph",
  title: "SCQA builds an opening that earns the answer instead of delaying it",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Take the opening paragraph of a doc you wrote. Label each sentence S, C, Q or A for situation, complication, question or answer. Write down which of the four are missing.",
  fallback: "We should move the connector scheduler to Temporal. Temporal gives us durable execution, a better SDK story, and a managed option that removes the Cassandra operational burden. The migration would take about two quarters and needs one engineer full time from October.",
  idea: "Open with the stable situation, the change that destabilised it, and the question that change raises, then give your answer as the reply to that question.",
  why: "Answer-first fails when the reader has no question in mind, because an answer to an unasked question reads as an assertion out of nowhere and invites argument rather than attention. The situation and complication install the question in the reader's head so that your answer arrives as a reply rather than a demand.\n\nThe sequence works because each element is something the reader already accepts. The situation is uncontroversial by construction. The complication is the fact that made you write. By the time you reach the answer, the reader has agreed to two things and is waiting for the third, which is a very different posture from being told what to do in sentence one.",
  failureMode: "An opening that is all answer. \"We should move the connector scheduler to Temporal. Temporal gives us durable execution...\" The reader's first thought is not \"how?\" but \"who says the current one is broken?\", and the doc never answers that because it assumed the complication was shared.",
  experiment: "Rewrite the opening of your most recent proposal as four sentences, one each for situation, complication, question and answer, in that order. Show it to someone who was not in the meeting and ask them to state the question.",
  reflection: "Was the complication in your opening actually a complication for the reader, or only for you?",
  recall: {
    q: "What does the complication in SCQA do that the situation cannot?",
    a: "The situation establishes shared ground the reader will not dispute; the complication is the change or tension that makes the ground insufficient, which is what generates the question. Without it the reader has no reason to want an answer.\n\nAn opening with a situation but no complication reads as background. An opening with a complication but no situation reads as alarm."
  },
  deepDive: "Here is my opening paragraph: mark where the situation, complication and question are, and tell me which one I skipped."
},
{
  id: "argument-readers-next-question",
  track: "argument", level: "document",
  title: "The reader's next question is the thing that drives the pyramid downward",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "List the section headings of a doc you wrote. Beside each, write the reader question it answers, in the reader's words. Mark any heading where you cannot write a question.",
  fallback: "Section 2: Background on Kubernetes custom resources. Argo Workflows is implemented as a set of CRDs reconciled by a controller. A CRD extends the Kubernetes API with a new resource type, and the controller pattern reconciles observed state towards desired state on each event. Our workflows are stored as Workflow and WorkflowTemplate resources in the tenant namespace.",
  idea: "Every level of a document exists to answer the question raised by the level above it, so a section that answers no question should not be there.",
  why: "A statement at the top of a pyramid always provokes a predictable question: how, why, or which ones. \"Move the scheduler to Temporal\" provokes \"why?\". The level below must be the answer to exactly that. This is what makes structure feel inevitable rather than arbitrary, because the reader generated the question themselves a moment before you answered it.\n\nThe test also works as a knife. When you cannot state the question a section answers, the section is there for a different reason: you knew the material, or the template had a slot, or you wanted to show the work. None of those are the reader's reasons.",
  failureMode: "The orphan background section. A page explaining CRDs and the controller pattern inside a migration proposal read by people who operate the cluster. It answers a question nobody in the audience has, and its presence makes the reader wonder what else you have misjudged about them.",
  experiment: "For each section of your current draft, write the question it answers as a literal question in the reader's voice. Delete or merge every section where the question is one the reader would not ask.",
  reflection: "Which section did you struggle to write a question for, and what was it really doing in the document?",
  recall: {
    q: "How do you tell whether a section belongs in a document?",
    a: "State the question raised by the level above it and check that the section answers that question. Sections that answer no reader question are there for the author's reasons, not the reader's.\n\nThe three questions a statement can provoke are why, how and which ones. If a section answers none of them, it is orphaned."
  },
  deepDive: "Go through my section headings and tell me, for each, what reader question it answers and which ones answer nothing."
},
{
  id: "argument-mece-groups",
  track: "argument", level: "document",
  title: "Groups must be mutually exclusive and collectively exhaustive or the reader keeps score",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Find a list of three or more items in a doc you wrote. Check every pair for overlap and write down any item that could belong in two buckets. Then name one thing the list leaves out.",
  fallback: "The risks fall into three categories: technical risk, migration risk, and risk to the connector team's roadmap. Technical risk covers the dual-write window and the schema change on the runs table. Migration risk covers the dual-write window running longer than planned and the tenants still on agent versions below 2.14. Roadmap risk is that the two engineers doing the migration are the same two who own the Snowflake connector.",
  idea: "Group items so that nothing appears twice and nothing that matters is left out.",
  why: "A reader processes a list by trying to build a mental model of the whole from the parts. Overlap breaks that: when the dual-write window shows up under two categories, the reader stops reading and starts auditing, because they cannot tell whether you have one risk or two. Gaps break it differently: the reader silently supplies the missing item, and now they are reading your document while holding an objection.\n\nBoth failures cost more than the grouping saved. The grouping was supposed to reduce the reader's load from six items to three. A grouping they have to check costs more than the ungrouped list.",
  failureMode: "Categories that are not parallel, so items slide between them. \"Technical risk, migration risk, and risk to the roadmap\" mixes a subject-matter axis with a project-phase axis with an organisational axis, which guarantees the dual-write window lands in two of them.",
  experiment: "Take the last grouped list you wrote. Draw the three buckets, place every item, and mark any item you had to think about for more than two seconds. Regroup on a single axis until no item hesitates.",
  reflection: "What axis were your categories actually on, and were they all on the same one?",
  recall: {
    q: "What does overlap in a grouping cost a reader, and how is that different from a gap?",
    a: "Overlap makes the reader audit for double counting, because the same item appearing twice suggests the parts do not sum to the whole. A gap makes the reader supply the missing item themselves and read the rest with an unvoiced objection.\n\nOverlap usually comes from mixing axes; gaps usually come from listing what you happened to think of rather than deriving the set."
  },
  deepDive: "Check this list of risks for overlap and for anything obvious it leaves out, and tell me what axis the categories are on."
},
{
  id: "argument-headings-state-insight",
  track: "argument", level: "paragraph",
  title: "A group's heading must state the insight, not name the category",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Look at the headings in a doc you wrote. Rewrite one label heading as a full sentence that states what you found, then check whether the section below still needs its first paragraph.",
  fallback: "Considerations. The rollout depends on every tenant agent being on version 2.14 or later, and roughly 40 tenants are on older builds with no upgrade scheduled. Next steps. We will contact those tenants during September and begin the migration in October, starting with the smallest workspaces.",
  idea: "Write headings as sentences that assert the finding, not as nouns that name the topic.",
  why: "A label heading tells the reader what the section is about and nothing more, which means the reader must read the section to learn whether they needed to. A heading that asserts something does the summarising work itself: the reader gets the point immediately and reads on only for the evidence.\n\nThere is a second effect on you. Forcing the heading into a sentence exposes sections that have no finding. \"Considerations\" can cover anything, so it never fails. \"Forty tenants cannot be migrated until they upgrade the agent\" either is your point or is not, and you can tell within a second.",
  failureMode: "Nouns doing the work of claims. \"Considerations\", \"Next steps\", \"Analysis\", \"Discussion\". Each is a container, and the reader has to open all of them to find out which one held the thing that changes their decision.",
  experiment: "Convert every heading in your current draft into a full sentence with a verb. Any heading you cannot convert marks a section with no finding in it.",
  reflection: "Which heading refused to become a sentence, and what did that tell you about the section?",
  recall: {
    q: "What does a heading written as a sentence do that a label heading cannot?",
    a: "It delivers the section's finding before the section is read, so a skimming reader gets the argument and a careful reader gets the evidence. It also fails loudly when a section has no finding, which a noun label never does.\n\n\"Three risks\" is a container. \"The migration fails if the dual-write window exceeds a week\" is the argument."
  },
  deepDive: "Rewrite my headings as assertions and tell me which sections turned out to have no assertion in them."
},
{
  id: "argument-order-within-a-group",
  track: "argument", level: "document",
  title: "Order inside a group by time, structure or degree, never by accident",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Take a list of four or more items you wrote. Write down the ordering principle in three words. If you cannot, reorder the list by time, by structure or by importance and see which one fits.",
  fallback: "The main things to sort out before October are the Helm chart changes, the on-call runbook, the schema migration on the runs table, tenant comms, the load test against staging, and a decision about whether we keep the old cluster warm for a fortnight after cutover.",
  idea: "Choose one of the three defensible orders for a group - chronological, structural, or by degree of importance - and apply it consistently.",
  why: "A reader assumes that adjacency means something. Given a list, they will infer an ordering principle whether or not you supplied one, and then they will read the inference back as your argument: the first item is the most important, or the sequence is the plan. If your real order was the order things occurred to you, the reader is now holding a claim you did not make.\n\nA declared order also does work you would otherwise do in prose. A list ordered by time is a plan and needs no sentence saying so. A list ordered by degree is a prioritisation and needs no sentence saying so.",
  failureMode: "The brain-dump list. \"Helm chart changes, the on-call runbook, the schema migration, tenant comms, the load test, and a decision about the old cluster.\" Two of those are blocking, three are cleanup and one is a decision, and the ordering hides all of it.",
  experiment: "Take the longest list in your current draft, name its ordering principle out loud, then reorder it under whichever of the three rules actually applies. Note whether the reorder changed what the list is arguing.",
  reflection: "Did the reader-visible meaning of your list change when you fixed the order, and if so, which version was true?",
  recall: {
    q: "Name the three defensible orderings for a group and what each one signals.",
    a: "Chronological order signals a process or plan. Structural order signals that the parts make up a whole, such as regions or components. Degree order signals a ranking by importance or size.\n\nAny other order still signals something to the reader, just not something you chose."
  },
  deepDive: "Here is a list from my doc: tell me what ordering principle a reader would infer and which of the three I should actually use."
},
{
  id: "argument-deductive-vs-inductive",
  track: "argument", level: "document",
  title: "Deductive order convinces one reader; inductive order survives many",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Find an argument you wrote with three or more steps. Mark whether each step depends on the one before it. If they chain, write down which single step, if rejected, kills the whole thing.",
  fallback: "Any workflow whose event history exceeds 4MB fails to load on the worker. Adding per-asset lineage events will push the connector sync history past 4MB for our largest tenants. Therefore the connector sync workflow will start failing at the next release, and we must shard it into child workflows before we ship lineage.",
  idea: "Support a claim with several independent reasons rather than a chain of dependent steps whenever the document has more than one reader.",
  why: "A deductive chain is a series where each step depends on the last, so its strength is the strength of its weakest link. One reader who rejects the middle premise has rejected the conclusion, and there is nothing left in the document to fall back on. In a review with six readers, the probability that nobody objects to any link is low.\n\nAn inductive grouping fails gracefully. Three independent reasons for the same conclusion mean a reader who kills one still faces two. It also skims better: the reader can read the three summary sentences and stop, whereas a chain read partially yields a premise rather than a conclusion.",
  failureMode: "The therefore-chain. \"Any history over 4MB fails. Lineage events will push us over 4MB. Therefore we must shard.\" A reviewer who says \"our largest tenant is at 900KB\" has ended the discussion, and your other reasons for sharding never got into the room.",
  experiment: "Take a chained argument from a recent doc and convert it: state the conclusion, then find two or three reasons that hold independently of each other. If you can only find one, say so explicitly rather than dressing it as three.",
  reflection: "When you tried to make your reasons independent, did you discover you only ever had one?",
  recall: {
    q: "Why do long documents with multiple readers prefer inductive to deductive ordering?",
    a: "A deductive chain collapses entirely if any single link is rejected, and with several reviewers the chance of every link surviving is small. An inductive grouping of independent reasons degrades gracefully, losing one reason rather than the conclusion.\n\nInductive groupings also skim correctly, because the top of each reason is already a complete point."
  },
  deepDive: "Look at this argument and tell me whether it is a chain or a grouping, and which link a hostile reviewer would cut."
},
{
  id: "argument-top-down-then-bottom-up",
  track: "argument", level: "document",
  title: "Build the pyramid top down, then check it bottom up",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Take a doc you finished. Cover the recommendation, read only the supporting sections, and write down the conclusion they lead to. Compare it with what you actually recommended.",
  fallback: "Our recommendation is to run Temporal on Temporal Cloud rather than self-hosting it. Self-hosting means operating a Cassandra cluster, and nobody currently on the team has done that. Temporal Cloud bills per action, which at our current volume comes to roughly four thousand dollars a month against about nine hundred in compute if we self-host. The SDK work is identical either way, so the migration effort does not change.",
  idea: "Draft from the conclusion downward, then read the evidence upward and check that it produces the conclusion you drafted.",
  why: "Top-down drafting is how you get a structure at all: committing to the answer forces you to decide what the supporting groups are and stops the document turning into a chronology. But it has a specific failure mode, which is that you will happily write supporting sections that do not, in aggregate, support anything.\n\nThe bottom-up read is the audit. Reading upward you are asking one question at each level: does this set of statements actually sum to the statement above it? That is a different cognitive task from writing them, which is why it catches things the writing pass cannot. Doing only one of the two passes gives you either a shapeless document or a confident one that does not hold.",
  failureMode: "A recommendation with evidence that cuts the other way and is never reconciled. The doc recommends managed hosting, then reports that managed costs four times more and leaves the number sitting there. The author never read upward, so they never noticed the paragraph arguing against them.",
  experiment: "On your current draft, read only the section headings and topic sentences, bottom to top, and write the conclusion they imply. If it is not your recommendation, fix the evidence or fix the recommendation.",
  reflection: "Reading upward, did your evidence produce your conclusion, or did you find a paragraph arguing the other side unanswered?",
  recall: {
    q: "What does the bottom-up pass catch that the top-down pass cannot?",
    a: "It catches groups whose members do not sum to the statement above them, including evidence that argues against your own recommendation and was left unreconciled. Writing downward you are elaborating; reading upward you are testing.\n\nTop-down alone gives a shapely document that may not hold. Bottom-up alone gives a chronology."
  },
  deepDive: "Read only the headings and first sentences of my draft, bottom to top, and tell me what conclusion they add up to."
},
{
  id: "argument-buried-lede",
  track: "argument", level: "paragraph",
  title: "The buried lede is a structural fault, not a stylistic one",
  source: "William Zinsser, On Writing Well",
  gatePrompt: "Take a paragraph you wrote. Find the sentence that would change what the reader does, and mark its position. If it is not first, cut it out and paste it at the front before reading on.",
  fallback: "The alert fired at 02:14 and the on-call acknowledged within four minutes. Initial triage focused on the ingress layer, since the error rate looked highest at the edge, and we spent about forty minutes there before widening the search. The dashboards we were reading during triage were pointed at the wrong cluster, which is why the edge looked like the problem.",
  idea: "When the load-bearing sentence is in the middle of the paragraph, move it to the front rather than improving the sentences above it.",
  why: "A buried lede is not a failure of phrasing, so phrasing cannot fix it. The reader allocates attention by position: the first sentence of a paragraph is read as the paragraph's claim and everything after it as elaboration. Put your finding in position three and the reader has already filed the paragraph under whatever position one said, and your finding arrives as a detail of something else.\n\nThe reason this is hard to catch in your own prose is that you wrote the sentences in the order you thought of them, and the important one usually arrives last because it took the longest to arrive. Recency in composition becomes lateness on the page.",
  failureMode: "A paragraph whose real content is its last clause. Two sentences of timeline, then \"the dashboards we were reading were pointed at the wrong cluster.\" That is the incident. Everything before it is the setting, and it was given the first two thirds of the reader's attention.",
  experiment: "Take the last three paragraphs you wrote. In each, circle the sentence that carries the point and write down its position. Move any that are not first, then delete whatever no longer earns its place.",
  reflection: "In how many of the three was the point in the last sentence, and what were the earlier sentences doing?",
  recall: {
    q: "Why can a buried lede not be fixed by rewriting the opening sentences?",
    a: "Because the fault is position, not wording. Readers treat the first sentence as the paragraph's claim, so a better-written first sentence just makes the wrong thing more prominent.\n\nThe fix is to move the load-bearing sentence to the front and then delete whatever no longer earns its space."
  },
  deepDive: "For each paragraph in this draft, tell me which sentence carries the point and whether it is in the first position."
},
{
  id: "argument-when-claim-first-fails",
  track: "argument", level: "document",
  title: "Claim first fails when the reader will reject the claim before the evidence",
  source: "Richard E. Young, Alton L. Becker and Kenneth L. Pike, Rhetoric: Discovery and Change",
  gatePrompt: "Take a doc aimed at someone with a stake in the current arrangement. Read only the first sentence as they would, and write their one-line reply. If the reply is a defence, rewrite the opening to start from something they already believe.",
  fallback: "The connector framework should be owned by the platform team rather than by integrations. Integrations has shipped fourteen connectors in two years, but the framework itself has had no maintainer since the original author left, and three of the last five production incidents traced back to it. We propose the transfer takes effect at the start of next quarter.",
  idea: "With a reader who is invested in the position you are arguing against, establish shared ground and their view before stating your conclusion.",
  why: "Answer-first works because it gives the reader a structure to hang facts on. It stops working when the answer itself is the thing under threat, because a reader who feels attacked in sentence one reads the rest as prosecution material and spends their attention building a rebuttal rather than a model. Everything you write after that point is processed adversarially.\n\nThe Rogerian move is to spend the opening demonstrating that you understand their position and the conditions under which it is correct. That is not softening. It removes the reason to defend, so the evidence gets read as evidence. You still land the claim; you land it after the ground that makes it inevitable rather than before.",
  failureMode: "A conclusion that reads as a verdict on the reader. \"The connector framework should be owned by the platform team rather than by integrations.\" The integrations lead has stopped reading and started drafting, and your incident data never gets evaluated on its merits.",
  experiment: "Take a proposal that will cost someone something. Write the first paragraph as a statement of their position in terms they would endorse, then add the fact that makes it insufficient, then your claim. Send it to a neutral third party and ask whether the opening sounds fair.",
  reflection: "Could the person losing something read your opening and recognise their own view in it?",
  recall: {
    q: "When should you not lead with your conclusion, and what replaces it?",
    a: "When the reader is invested in the position you are displacing, because a claim-first opening triggers defence and everything after it gets read adversarially. Replace it with a statement of their position and the conditions under which it holds, then the fact that makes it insufficient.\n\nThe conclusion still appears, just after the ground that makes it hard to reject."
  },
  deepDive: "Read the first paragraph of this proposal as the person who loses something, and tell me what their first reaction would be."
},
{
  id: "argument-unstated-warrant",
  track: "argument", level: "paragraph",
  title: "The step you did not write is the one they will argue with",
  source: "Stephen Toulmin, The Uses of Argument",
  gatePrompt: "Take a paragraph where you draw a conclusion from data. Write the sentence that has to be true for the data to license the conclusion. Check whether that sentence appears anywhere in the doc.",
  fallback: "p99 latency on the search endpoint rose from 180ms to 420ms in the week after the index change shipped. Error rates were flat over the same period and no tenant has raised a ticket. We should roll the index change back before the release freeze on Friday.",
  idea: "Name the assumption that licenses the move from your evidence to your claim, because that assumption is what reviewers are really disputing.",
  why: "An argument has data and a claim, and between them a warrant: the general principle that makes this data count as support for this claim. Writers state data and claim because those are the parts they researched. The warrant stays implicit because it feels obvious, and it feels obvious because you have been inside the problem for a fortnight.\n\nWhen a reviewer pushes back on your numbers and the conversation goes in circles, the usual cause is that they accept the numbers and reject the warrant. Two people arguing about whether 420ms is real when the actual disagreement is whether 420ms matters will not converge, because neither has named the thing they disagree about.",
  failureMode: "Data, then \"we should\", with nothing between them. \"p99 rose from 180ms to 420ms. We should roll back.\" The unstated warrant is that search p99 under 200ms outranks whatever the index change bought, and that is precisely what the person who shipped the index will contest.",
  experiment: "Find a recommendation in a recent doc. Write the missing sentence in the form \"this matters because we hold that X\", insert it, and see whether the recommendation still looks as obvious as it did.",
  reflection: "Once you wrote the warrant down, did you still believe it?",
  recall: {
    q: "What is a warrant, and why do disputes about data often turn out to be disputes about it?",
    a: "A warrant is the general principle that licenses treating this data as support for this claim. It is usually left unstated because it feels self-evident to the author.\n\nReviewers who cannot name the warrant attack the data instead, so the argument circles: one side defends the measurement while the other rejects its relevance."
  },
  deepDive: "For each recommendation in this doc, write out the unstated assumption that connects the evidence to the conclusion."
},
{
  id: "argument-name-your-non-goals",
  track: "argument", level: "document",
  title: "Naming your non-goals deletes half the review comments in advance",
  source: "Wayne Booth, Gregory Colomb and Joseph Williams, The Craft of Research",
  gatePrompt: "Take a proposal you wrote. List the three questions you expect in review that begin with \"what about\". Write a one-line non-goal for each and add them as a section.",
  fallback: "This proposal covers replacing the Argo-based connector scheduler with Temporal for tenant-facing workflows. The migration runs tenant by tenant with a dual-write period of up to a week per tenant. We expect the whole programme to take two quarters with one engineer full time and a second for the cutover weeks.",
  idea: "State what you deliberately excluded and why, in the document, before the reader thinks to ask.",
  why: "A reader evaluating a proposal is running a search for holes, and every hole they find without your help reduces their trust in the rest. A named non-goal converts a hole into evidence of judgement: you saw it, you decided, here is the reason. The same fact, unnamed, reads as something you missed.\n\nIt is also cheap. Three lines in the document replace three review comments, three replies, and the two days of latency between them. The economics are unusually good for something that feels like admitting weakness.",
  failureMode: "A scope section that lists only what is in scope. \"This proposal covers replacing the Argo scheduler for tenant-facing workflows.\" Review then produces \"what about the internal clusters?\", \"what about marketplace packages?\", \"did you look at Airflow?\", each of which you had already decided and none of which is written down.",
  experiment: "Before sending your next proposal, write the three \"what about\" questions you expect and answer each in one line under a Non-goals heading. After review, count how many of the three still came up as comments.",
  reflection: "Which of your predicted objections still arrived, and was that because the non-goal was unconvincing or because it was buried?",
  recall: {
    q: "Why does naming a non-goal build credibility rather than expose a weakness?",
    a: "An excluded item the reader finds on their own reads as an oversight and casts doubt on the rest of the analysis. The same item, named with a reason, reads as a decision and demonstrates the boundary was chosen.\n\nIt is also cheaper: three lines up front replace a round trip of review comments."
  },
  deepDive: "Read this proposal as a sceptical reviewer and list the \"what about\" questions I should pre-empt as non-goals."
},
{
  id: "argument-design-the-skim-path",
  track: "argument", level: "document",
  title: "Write for the reader who will read four lines and then decide",
  source: "Larry McEnerney, \"The Craft of Writing Effectively\"",
  gatePrompt: "Open a decision doc you wrote. Read only the title, the first two lines, and the headings. Write down the decision a reader would make from that alone, then compare it to the one you wanted.",
  fallback: "Following the incident review in June, the platform team was asked to evaluate options for the connector scheduler. We looked at four options over six weeks, spoke to three teams who have run similar migrations, and ran a load test against a staging cluster sized to production. The results, along with the cost model and the risks we identified, are set out below in the order we investigated them.",
  idea: "Design the skim path first - title, opening lines, headings, and the first sentence of each section - and treat the full read as the optional case.",
  why: "The people who approve things read in a narrow window between two meetings, and their default is to defer rather than decide. A skim that yields nothing actionable does not produce a careful read later; it produces \"let's discuss in the sync\", which is the outcome the document existed to avoid.\n\nSo the skim path is not a courtesy layer over the real document. It is the document as most readers will experience it, and the full text is the appendix that survives scrutiny when someone pushes back. Writing in that order also disciplines the argument, because a case that cannot be carried by a title and five sentences usually is not a case yet.",
  failureMode: "An opening that spends its four lines on provenance. \"Following the incident review in June, the platform team was asked to evaluate options...\" A skimmer learns that work happened and that the results are below, which is the one thing they could already infer from the document existing.",
  experiment: "Take a decision doc and strip it to title, first two sentences and headings. Send only that to someone who has not read it and ask what they would approve. If they cannot answer, the skim path does not exist.",
  reflection: "What decision did your skim path actually support, and how far was it from the one you wanted?",
  recall: {
    q: "What happens when a decision document has no working skim path?",
    a: "The busy approver defers rather than reading closely, so the document produces a meeting instead of a decision. Skimming is the default mode, not a degraded one.\n\nDesigning title, opening lines and headings to carry the decision also tests the argument, because a case that cannot survive five sentences is usually not ready."
  },
  deepDive: "Strip this doc to its title, first two sentences and headings, and tell me what decision that alone supports."
},
{
  id: "argument-headings-carry-the-case",
  track: "argument", level: "document",
  title: "Headings should carry the argument, so the headings alone can be read",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Extract the headings from a doc you wrote into a plain list, in order. Read the list on its own and write down the argument it makes. Note where it stops making one.",
  fallback: "The document is structured as follows. Background. Current architecture. Options considered. Cost analysis. Risks and mitigations. Recommendation. Appendix A: load test results. Appendix B: cost model assumptions.",
  idea: "Make the sequence of headings a complete, readable version of the argument, so the contents page is the short form of the document.",
  why: "This is the single-entry test for whether a pyramid exists. If the headings in order state a claim and then the reasons for it, the structure is sound, because the reader can hold the whole case in one screen. If the headings are a list of topics, there is no structure - there is a set of containers whose relationship lives only in your head.\n\nIt is also the harshest test available, because it strips away every sentence you could have used to paper over a gap. Two adjacent headings that do not connect are a visible break in the argument, whereas the same break inside prose gets smoothed by a transition.",
  failureMode: "The template contents page. \"Background. Current architecture. Options considered. Cost analysis. Risks. Recommendation.\" That list describes the genre of the document. It could sit in front of a proposal to adopt Temporal or a proposal to reject it, which means it carries none of the argument.",
  experiment: "Paste your headings into a plain list and hand it to someone who has not seen the doc. Ask them to state your recommendation and the reasons for it from the list alone, and write down where they had to guess.",
  reflection: "Where did your heading list break, and was that a missing section or a missing idea?",
  recall: {
    q: "What is the test for whether a document's structure holds, using only its headings?",
    a: "Read the headings alone, in order, and see whether they state a claim followed by the reasons that support it. If they do, the pyramid is real; if they name topics, the structure exists only in the author's head.\n\nA contents page that would fit equally well in front of the opposite recommendation carries none of the argument."
  },
  deepDive: "Here are my headings in order: tell me what argument they make on their own and where the sequence breaks."
},
{
  id: "argument-signpost-the-turns",
  track: "argument", level: "paragraph",
  title: "Signpost the turns, not the straightaways",
  source: "William Zinsser, On Writing Well",
  gatePrompt: "Take a page you wrote and highlight every transitional word or phrase. Delete each one, reread, and restore only those whose absence changed the meaning. Count how many you restored.",
  fallback: "First, we assessed the cost, which comes out roughly flat between the two options. In addition, we looked at operational load, and self-hosting adds an on-call surface we do not have the staff for. It is also worth noting that the SDK work is the same either way. Finally, in summary, we recommend Temporal Cloud.",
  idea: "Use transitions where the argument changes direction and nowhere else.",
  why: "Transitions are instructions about how to relate the next sentence to the last one. A reader moving straight ahead does not need an instruction, because continuation is their default assumption. Supplying one anyway adds words without adding information, and worse, it teaches the reader that your signposts carry no signal, so the one that mattered gets skimmed past too.\n\nThe transitions that earn their place mark reversals and concessions: but, however, even so, in spite of that. Those genuinely change the reader's expectation, and without them the reader has to back up and re-derive the relationship. Additive signposts almost never do that work.",
  failureMode: "A paragraph strung on ordinals and additives. \"First... In addition... It is also worth noting... Finally, in summary...\" Every one of those points forward, none of them turns, and the paragraph would read identically with all four deleted.",
  experiment: "On your last page of prose, delete every \"in addition\", \"furthermore\", \"moreover\", \"it is worth noting\" and \"finally\". Reread and restore only where a sentence became hard to place. Record the ratio.",
  reflection: "Of the transitions you deleted, how many did you restore, and what did the survivors have in common?",
  recall: {
    q: "Which transitions earn their place and which are padding?",
    a: "Ones that mark a reversal or concession earn their place, because they change what the reader expects next and prevent a re-read. Additive and ordinal transitions mostly restate the default assumption of continuation.\n\nOveruse also devalues the real ones: a reader trained to skip your signposts will skip the one that mattered."
  },
  deepDive: "Highlight every transition in this page and tell me which ones mark an actual change of direction."
},
{
  id: "argument-summary-in-miniature",
  track: "argument", level: "document",
  title: "An executive summary is the document in miniature, not an abstract of it",
  source: "Barbara Minto, The Pyramid Principle",
  gatePrompt: "Take the summary of a doc you wrote and give it to someone without the body. Ask them what they would decide. Write down whether it matches the decision the full document supports.",
  fallback: "This document evaluates options for the connector scheduler, describes the current architecture and its limits under the nightly peak, sets out a cost model for each option, and lists the risks and open questions raised during review. A recommendation is given in section 6, and the load test data supporting it is in Appendix A.",
  idea: "Write the summary so that acting on it alone produces the same decision as reading the whole document.",
  why: "An abstract describes the document from outside: here is what this text contains. A summary reproduces the document at lower resolution: here is the answer, here are the two or three things that make it hold, here is what it costs. The first tells the reader that a decision exists somewhere below. The second lets them make it.\n\nThe proportion matters as much as the content. If a risk consumes a third of the body and no line of the summary, a reader acting on the summary is making a decision the full document would not support, and you have built a trap rather than a shortcut. Test by treating the summary as the whole artefact and asking what it authorises.",
  failureMode: "A summary written as a table of contents in sentences. \"This document evaluates options, describes the current architecture, sets out a cost model, and lists the risks. A recommendation is given in section 6.\" No reader can act on that, and everyone who tried has to open the document anyway.",
  experiment: "Take your last summary, delete every clause that describes the document rather than stating something about the world, and see what remains. Rebuild it as answer, two supports and one cost, in proportion to the body.",
  reflection: "Would someone acting only on your summary have made the same call as someone who read the whole thing?",
  recall: {
    q: "What distinguishes a summary from an abstract, and what is the test?",
    a: "An abstract describes what the document contains; a summary restates the document's answer and main supports at lower resolution. The test is whether a reader who acts on the summary alone reaches the same decision as one who read the body.\n\nProportion is part of it: a risk that dominates the body and is absent from the summary turns the summary into a trap."
  },
  deepDive: "Read only my executive summary and tell me what decision it authorises, then read the body and tell me whether they agree."
}
);

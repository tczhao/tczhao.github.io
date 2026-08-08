/* Track: Revision, and editing others. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "revision-two-passes",
  track: "revision", level: "document",
  title: "The structural edit and the line edit are separate passes, and doing both at once does neither",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Paste something you are drafting. Before reading on, go through the edits you have already made to it and mark each one S (structural: moved, merged, cut, resequenced) or L (line: word choice, clause order, rhythm). Write the two counts.",
  fallback: "The retention policy for workflow history is the second problem, and it is the more expensive of the two. As noted above, we hold every execution record indefinitely, which is why the cluster now carries eleven months of state that nothing will ever read. Retention, then, is where the cost lives. We return to retention in the sizing section below.",
  idea: "Settle what the document is made of before you touch how any of it is written.",
  why: "A sentence has no fixed quality. It has a job, and the job is set by the structure around it: what the reader already knows when they arrive, what the sentence must hand to the next one. Change the section order and the same sentence is now doing different work, usually badly. Polishing before the structure is fixed means polishing against a brief that has not been written.\n\nThe second mechanism is in your head, not the reader's. Effort creates commitment. A section you spent forty minutes tightening is a section you will argue to keep, and you will not experience that as sunk cost, you will experience it as the section being good.",
  failureMode: "A draft where every sentence is clean and the document still does not work. Three sections make the same point three well-written times, nobody can say which is the real one, and the review comes back asking for the thing that was supposed to be in section two. The tell in your own behaviour is defending a paragraph on the grounds that it reads well.",
  experiment: "Open your current draft. Do not delete anything yet - mark the two sections you are least confident belong. Now estimate the minutes of line editing already spent inside them. That number is the waste, and it is also the reason you are about to argue for keeping them.",
  reflection: "Which section did you defend because you had already polished it, rather than because the document needs it?",
  recall: {
    q: "Line editing before the structure is settled is wasteful. Name the second, worse cost.",
    a: "It commits you. Effort spent on a section converts into a felt judgement that the section is good, so the structural decision gets made by where you happened to spend time.\n\nThere is also a correctness cost: a sentence's job is defined by the structure around it, so editing it before the order is fixed means editing against an unwritten brief."
  },
  deepDive: "Here is my draft and the section order I am unsure about - do a structural pass only, tell me what to move, merge or cut, and refuse to touch a single sentence."
},
{
  id: "revision-first-draft",
  track: "revision", level: "document",
  title: "A first draft is not supposed to be good, and treating that as failure is the trap",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Paste the roughest thing you have in progress. Before reading on, count how many times you have rewritten its opening paragraph, and write one sentence at the top saying what this draft is for: producing material, or being read.",
  fallback: "This document proposes a path forward for our workflow orchestration estate. It is intended to provide the necessary context, to outline the options available to us, and to set out a recommendation. Before doing so, it is worth briefly establishing why this is a question worth asking at all, and what has changed since we last looked at it.",
  idea: "The first draft's product is material, not prose, so judge it on whether the whole thing exists.",
  why: "Generating and selecting are different operations and they interfere. Selection needs a candidate set, and the candidate set does not exist until the argument has been written all the way to the end. Judging paragraph two against a finished standard stops the draft before it has produced the thing the judgement is supposed to operate on.\n\nThis bites hardest on people who already write well. Fluency means your bad first draft is still legible, so you read it as a finished attempt that failed, rather than as raw stock. The engineer who writes clumsily gets to the end because they never expected page one to sound right.",
  failureMode: "Three days in, two paragraphs long, and both of them beautiful. The doc that was due Tuesday is a well-made opening and an outline. Meanwhile the thinking that the draft was supposed to do - discovering that option B collapses in the multi-tenant case - has not happened, because you never wrote as far as option B.",
  experiment: "Set twenty-five minutes and write your current piece all the way to the end at whatever quality falls out, using bracketed placeholders like [get the actual p99] wherever you would normally stop and check. Count the placeholders at the end. That list is the real remaining work, and you could not have seen it from paragraph two.",
  reflection: "What did writing to the end tell you about the argument that you could not have found by polishing the opening?",
  recall: {
    q: "Why does strong writing ability make the first-draft trap worse rather than better?",
    a: "Because a fluent writer's first draft is legible, so it reads as a finished attempt that came out weak, rather than as raw material behaving exactly as intended.\n\nThe writer who cannot make page one sound right has no temptation to stop and fix it, so they reach the end, where the actual structural discoveries are."
  },
  deepDive: "I have a fast complete draft full of placeholders - read it as material rather than prose and tell me what the argument actually turned out to be."
},
{
  id: "revision-structure-on-a-card",
  track: "revision", level: "document",
  title: "Structure is decided before sentences, and it can be drawn on a card",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Take a document you are drafting. On paper, write each section as a single labelled box, then draw an arrow from each box to every box it depends on. Count the arrows that point backwards, from an early box to a later one.",
  fallback: "We have added a circuit breaker on the metadata service client and raised the pool ceiling to 200. The underlying issue was that the connection pool exhausted during the reindex, which we did not detect for forty minutes because the saturation alert was scoped to the API tier only. Ingestion was unavailable for tenants on the shared cluster for most of that window.",
  idea: "Draw the parts and their dependencies as a physical diagram, then permute the diagram rather than the prose.",
  why: "Order decides what the reader is holding in working memory when each claim arrives. A claim that lands before the thing it depends on forces a re-read, and re-reads are silent - the reader does not report them, they just come away thinking the document was heavy.\n\nOn a card, reordering costs a second. In prose, reordering costs a rewrite, because every transition and every back-reference is welded to the current sequence. So the medium you plan in determines how many orderings you will actually consider. Most documents get one, the order the writer happened to think of things in.",
  failureMode: "An incident write-up that opens with the fix. 'We have added a circuit breaker and raised the pool ceiling' is meaningless to a reader who does not yet know what broke or who it hurt, so they park it, read on, and reconstruct the meaning three sentences later. The document is not wrong anywhere. It is just being read backwards.",
  experiment: "Write each section of your current draft on its own line, one line per section, then deal the lines into two different orders. If no ordering is worse than the one you have, the document has no structure - it is a list, and you should say so or find the argument.",
  reflection: "Which arrow pointed backwards, and what did the reader have to hold in memory to survive it?",
  recall: {
    q: "Why plan structure on cards rather than by moving paragraphs in the draft?",
    a: "Because the cost of trying an ordering determines how many orderings you try. On cards it is free, in prose every move drags transitions and back-references with it, so you consider exactly one order: the one you thought of things in.\n\nThe reader's cost of a bad order is invisible to you - they re-read silently and report only that the document felt heavy."
  },
  deepDive: "Here are my sections as a bare list - propose two orderings other than mine and say what each one assumes about what the reader already knows."
},
{
  id: "revision-reverse-outline",
  track: "revision", level: "document",
  title: "Reverse outline: one line per paragraph, then read only the lines",
  source: "Joseph M. Williams, Style: Lessons in Clarity and Grace",
  gatePrompt: "Take something of yours longer than a page. In a separate file, write one line summarising each paragraph, in order. Then read only that list and mark every line that repeats an earlier one, and every paragraph whose line you could not write.",
  fallback: "The migration will be executed in three waves, grouped by tenant tier. Wave sequencing is by tier so that the smallest blast radius goes first. As described above, we sequence the waves by tenant tier in order to limit exposure early in the rollout. Rollback for each wave is independent, and each wave is gated on the previous wave holding for forty-eight hours.",
  idea: "Summarise each paragraph in one line and then evaluate the document from the lines alone.",
  why: "Local fluency masks global incoherence. Reading your own prose, each paragraph is well made and carries you into the next, so the sequence feels earned even when two paragraphs are the same paragraph. Stripping to one line per unit removes the fluency and puts the duplicates next to each other on a single screen, at a granularity where your eye can compare them.\n\nThe second yield is the paragraphs you cannot summarise. A paragraph that resists a one-line summary is doing two jobs or none, and both are structural faults you were never going to see while reading it in place.",
  failureMode: "A document that reads well and produces the same three reviewer questions every time. The answers are in there, spread across four paragraphs in three places, so no reader assembles them. Or the middle section that everyone skims: on the outline it summarises to 'context about the previous architecture', which is not a point, which is why nobody read it.",
  experiment: "Reverse-outline your current draft. Report two numbers: how many lines duplicate another line, and how many paragraphs you could not summarise at all. Merge the first group, and for the second, either write the missing point sentence or delete the paragraph.",
  reflection: "Which paragraph could you not write a line for, and was it doing two jobs or none?",
  recall: {
    q: "A reverse outline finds two distinct classes of fault. Name both.",
    a: "Duplication: paragraphs that summarise to the same line are the same paragraph written twice, and this is invisible in prose because local fluency carries you past both.\n\nEmptiness or overload: a paragraph you cannot summarise in one line is doing two jobs or none. Both need a structural decision, not a line edit."
  },
  deepDive: "Here is my reverse outline with the prose removed - tell me which lines are the same point and where the argument skips a step."
},
{
  id: "revision-box-doubtful-words",
  track: "revision", level: "sentence",
  title: "Box every word you are not sure of and look each one up",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Take a paragraph you wrote. Draw a box around every word you chose approximately rather than exactly. Look up two of them and write the definition next to the box.",
  fallback: "The service degraded gracefully under the load, and the failover was largely seamless. We mitigated the incident by throttling ingestion, which effectively resolved the customer impact, although a handful of tenants continued to see some latency for a period afterwards.",
  idea: "Run a pass whose only job is to interrogate the words you settled for.",
  why: "Approximate words survive every other pass because nothing is wrong with them. They are grammatical, idiomatic and roughly right, so a structural edit does not reach them and a rhythm edit likes them fine. The only thing that catches them is a pass that asks, of one word at a time, whether this is the word.\n\nOn the reader's side, the damage is quiet. 'Largely seamless' installs a picture, and it is the wrong picture, but the reader cannot locate the error because the sentence never made a checkable claim. They come away confidently misinformed, which is worse than being confused, because confusion at least prompts a question.",
  failureMode: "Incident prose that sounds precise and commits to nothing: 'we mitigated the impact and a handful of tenants saw some latency for a period'. How many tenants, how much latency, how long, and did mitigating mean fixing or hiding. Every one of those words was chosen at 5pm as the nearest available and never revisited.",
  experiment: "Take one paragraph of your last write-up, box every doubtful word, look each up, and count how many you replace. If you replaced fewer than one in ten of the boxed words, you did not box honestly - go again and box the ones you were defending.",
  reflection: "Which boxed word turned out to mean something other than what you were using it for?",
  recall: {
    q: "Why does a structural pass and a rhythm pass both fail to catch an approximate word?",
    a: "Because nothing is wrong with it. It is grammatical, idiomatic and roughly right, so neither pass has a trigger. Only a pass dedicated to word-by-word doubt has one.\n\nAnd the reader cannot flag it either: the sentence makes no checkable claim, so instead of being confused they are confidently given the wrong picture."
  },
  deepDive: "Here is a paragraph with the words I am unsure of marked - for each one, tell me what it currently claims and what I probably meant."
},
{
  id: "revision-greening",
  track: "revision", level: "paragraph",
  title: "Greening: cut a fixed percentage and let the constraint make the choices",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Take a paragraph you wrote and count the words. Cut it by fifteen percent without losing a single claim, and write the before and after counts.",
  fallback: "In order to ensure that we are able to provide adequate visibility into the health of the ingestion pipeline, we are proposing the addition of a small number of additional metrics, which will be emitted by the worker at the point at which each batch completes. It is worth noting that these metrics are intended to be complementary to the existing dashboards rather than a replacement for them, and that the additional cardinality involved is expected to be fairly minimal.",
  idea: "Commit to removing a set proportion, then find it, rather than cutting whatever you already disliked.",
  why: "Voluntary cutting only removes what you had already conceded was weak, which is a small and already-known set. A quota forces you to compare things you like against each other, and comparison is the only operation that produces a ranking. That is the whole mechanism: the constraint makes you rank, and ranking is what you were avoiding.\n\nThe term comes from Time, where cuts were marked with a green pencil and a writer was told to green a piece by a set number of lines with nothing of substance lost. The instruction sounds impossible and is routinely met, which is itself the evidence.",
  failureMode: "A paragraph that is not wrong anywhere and forty percent longer than its content: 'in order to ensure that we are able to provide adequate visibility'. Six words are doing the job of two, no single phrase is bad enough to trigger a cut, and the reader pays for all of it in attention they will not have for the paragraph that matters.",
  experiment: "Take the longest paragraph in your current draft, count the words, and cut fifteen percent. Then hand both versions to someone and ask which claim went missing. Usually none did, and that answer is what recalibrates you for the next draft.",
  reflection: "What did the quota make you cut that you would never have volunteered?",
  recall: {
    q: "Why does a percentage quota cut better than 'remove what is unnecessary'?",
    a: "Because 'remove what is unnecessary' only reaches material you had already judged weak, which you would have cut anyway. The set is small and known.\n\nA quota forces comparison between things you like, and comparison is the only operation that ranks them. The ranking is the work you were avoiding."
  },
  deepDive: "Cut this paragraph by fifteen percent, show me only the deletions rather than a rewrite, and tell me which claim you came closest to losing."
},
{
  id: "revision-read-aloud",
  track: "revision", level: "paragraph",
  title: "Read it aloud, because your ear catches what your eye forgives",
  source: "William Zinsser, On Writing Well",
  gatePrompt: "Read a paragraph you wrote out loud at normal speaking pace. Mark every place you ran out of breath, stumbled, or had to go back. Count the marks.",
  fallback: "The decision to move the scheduler off the shared cluster, which was taken after the March incident and which the platform team has been planning for since, is intended to reduce coupling between tenant workloads and control plane availability. The work required to move the scheduler off the shared cluster is estimated at six weeks. The risk associated with moving the scheduler off the shared cluster is that the migration window overlaps the reindex.",
  idea: "Read the draft aloud and treat every stumble as a defect report.",
  why: "Silent reading repairs. Your eye takes in a clause, the parser fixes the ordering, and you never register that the repair happened - especially in your own prose, where you are reading your intention rather than the words. Speech is real-time and physical, so the repair has nowhere to hide.\n\nBreath is the specific instrument. A thirty-word subject means you run out of air before the verb, which is exactly the load the reader is carrying silently. Repetition is the other one: the ear is far more sensitive to a repeated phrase than the eye, which is why three sentences opening with the same seven words are unbearable spoken and invisible on screen.",
  failureMode: "Prose nobody would ever say. 'The work required to move the scheduler off the shared cluster is estimated at six weeks. The risk associated with moving the scheduler off the shared cluster is...' On screen it reads as consistent terminology. Aloud it is a drone, and the drone is telling you those three sentences should be one sentence with a list.",
  experiment: "Read your current draft aloud, standing, at the pace you would use in a meeting. Mark every breath failure and every stumble, then fix only those. Count them before and after - the second reading should be clean, and if it is not you fixed the wrong thing.",
  reflection: "Where did you run out of breath, and what was the subject doing at that point?",
  recall: {
    q: "What does reading aloud detect that silent reading cannot, and why?",
    a: "Over-long subjects and unintended repetition. Silent reading repairs clause order and skips repeated phrases without reporting it, and in your own prose you are reading your intention rather than the words.\n\nSpeech is real-time and constrained by breath, so a thirty-word subject shows up as running out of air, which is a physical version of the load the reader carries silently."
  },
  deepDive: "Mark the places in this paragraph where a person reading aloud would run out of breath, and tell me what is wrong with each subject."
},
{
  id: "revision-last-pass",
  track: "revision", level: "document",
  title: "Know which pass is the last one",
  source: "William Zinsser, On Writing Well",
  gatePrompt: "Take a draft you keep returning to. Write in one sentence what would make it done, then list the changes still outstanding and cross out every one the sentence does not cover.",
  fallback: "We believe, on the basis of the current data, that the ingestion regression is most likely - though not certainly - attributable to the client library upgrade. Some reviewers have suggested the pool change as an alternative explanation, and while that remains possible, we are not currently persuaded by it. In any case our recommendation, which we would characterise as provisional, is to roll back the library first.",
  idea: "Decide in advance what would make the draft done, and stop when it is.",
  why: "Revision has a crossover point. Early passes remove errors, which is monotonic improvement. Later passes are trading between options that are close to equal, so each change fixes one thing and breaks another, and you cannot tell which direction you are moving because you have lost the ability to read the draft cold.\n\nWithout a stated done condition the draft is also open to every reviewer. Each comment reopens the whole document, and since it is easier to add a qualifier than to relitigate a claim, the draft accretes hedges. The register drifts from decision to defence, and the reader can hear it.",
  failureMode: "A recommendation that has survived four reviewers and now reads like a legal filing: 'most likely, though not certainly, attributable', 'while that remains possible', 'which we would characterise as provisional'. Every hedge was added to settle one comment. Together they say the author does not want to be held to anything, which is not what anyone meant.",
  experiment: "Before your next pass on your current draft, write the done condition in one sentence - something like 'a reader on the connectors team can state the recommendation and one risk after a single read'. Run the pass, then count the edits it produced that the sentence does not justify. Revert those.",
  reflection: "What was your done condition, and how many of this pass's edits failed to serve it?",
  recall: {
    q: "Beyond diminishing returns, what specifically goes wrong in late revision passes?",
    a: "Changes start trading one flaw for another, because the remaining problems are ties rather than errors, and you have lost the ability to read the draft cold enough to judge.\n\nWith no stated done condition, every reviewer comment reopens the document, and the cheapest way to settle a comment is a hedge. The draft accretes qualifiers until its register shifts from decision to defence."
  },
  deepDive: "Here is my draft and my one-sentence done condition - tell me which remaining changes are needed and which are me trading one flaw for another."
},
{
  id: "revision-own-fault-list",
  track: "revision", level: "document",
  title: "Keep a list of your own recurring faults and edit for them by name",
  source: "Verlyn Klinkenborg, Several Short Sentences About Writing",
  gatePrompt: "Take three things you wrote in the past month. Find one fault that appears in all three, name it in five words or fewer, and start the list.",
  fallback: "There is an expectation that the migration will require coordination with the connectors team. It is worth noting that the identification of affected tenants has not yet been completed. There are also several open questions around the sequencing of the schema change relative to the rollout of the new worker image.",
  idea: "Write down your five recurring faults and edit for them by name, one at a time.",
  why: "Unlisted self-editing is a search over an unbounded space, so what you find is whatever is most salient on that particular reading, which is usually whatever you fixed last time. The frequency distribution is ignored entirely.\n\nYour actual faults are a short closed set - most writers have four or five, and they are stable for years. Named, they convert editing from taste into a pass with a stop condition, which means you can finish. Several of them also have a literal textual signature, so the pass becomes a grep rather than a reading.",
  failureMode: "The same three tics in every document you have written since 2022. 'There is an expectation that', 'it is worth noting that', 'there are several open questions around' - three sentences, three empty openers, and the real subjects arrive at word five. You do not see them because they are your normal, and every reading of your own draft renormalises them further.",
  experiment: "Write your five faults down now, phrased as detectors rather than aspirations. Then grep your last document for the two with a textual signature - 'there is', 'it is worth noting', 'in order to' - and report the hit count. That number is your baseline.",
  reflection: "Which fault appeared in all three documents, and what does its presence tell you about how you start sentences?",
  recall: {
    q: "Why does a written list of your own faults beat editing carefully by feel?",
    a: "Editing by feel searches an unbounded space and surfaces whatever is salient that day, usually whatever you fixed most recently. Frequency is ignored.\n\nA list makes the search finite, so the pass terminates, and several faults have literal string signatures, which turns part of the pass into a grep with a countable result."
  },
  deepDive: "Read these three things I wrote and tell me the four faults that appear in all of them, phrased as detectors I can run myself."
},
{
  id: "revision-diagnose-root-fault",
  track: "revision", level: "document",
  title: "Diagnose before you prescribe: find the fault that causes the other faults",
  source: "George Gopen, Expectations: Teaching Writing from the Reader's Perspective",
  gatePrompt: "Take a draft you are about to review. List every problem you can see, then draw an arrow from each problem to any other problem it could have caused. Circle the one with the most arrows leaving it.",
  fallback: "Coordination with the connectors team was not established early, and as a result there was a period during which the schema change was being developed in parallel with the ingestion refactor. Duplication of validation logic occurred. The eventual reconciliation of the two implementations, which was carried out in June, required changes on both sides, and further delay was introduced by the need to re-run the backfill.",
  idea: "Find the single fault generating the symptoms and comment on that one.",
  why: "Prose faults cluster because they share a cause. A writer who never puts a person in the subject position produces passives, nominalisations, long subjects and missing agents all at once, and those look like four problems to a reviewer working symptom by symptom. Fix the cause and most of the list evaporates without being mentioned.\n\nThere is a reception mechanism too. Volume is read as severity: a page of small corrections says 'this is bad throughout' regardless of what any individual comment says. And a list of symptoms is applied mechanically, so the writer produces this document corrected and the next document identical.",
  failureMode: "Twelve comments on one paragraph - passive here, nominalisation there, this sentence is too long, unclear who did this. One cause: no sentence has a human or a system as its subject. 'Duplication of validation logic occurred' has no one in it, and neither does anything around it. The twelve comments teach nothing; the one diagnosis is portable.",
  experiment: "On the next draft you review, write out your full comment list, then fix the root fault yourself on one paragraph and re-read the rest. Count how many of your comments are now unnecessary. Delete those before sending, and send the diagnosis plus the one fixed paragraph.",
  reflection: "What was the root fault, and how many of your comments turned out to be symptoms of it?",
  recall: {
    q: "Two reasons a symptom-by-symptom comment list is worse than one diagnosis. Name both.",
    a: "It does not transfer: symptoms get applied mechanically, so this document improves and the next one is identical. The diagnosis is portable, the corrections are not.\n\nAnd volume reads as severity. A page of small comments tells the writer the document is bad throughout, which is both demoralising and, usually, false."
  },
  deepDive: "Here is a draft and my list of complaints about it - tell me which single fault is generating most of them."
},
{
  id: "revision-name-the-move",
  track: "revision", level: "paragraph",
  title: "A useful review comment names the move, not the symptom",
  source: "George Gopen, Expectations: Teaching Writing from the Reader's Perspective",
  gatePrompt: "Find a review comment you left in the past fortnight. Rewrite it so that it names the fault in terms that would also apply to a different document, then put the two versions side by side.",
  fallback: "This is confusing, maybe reword? Also this paragraph feels long. I would probably say something like 'the connection pool exhausted during the reindex and we did not catch it for forty minutes'. Rest of the section looks fine to me.",
  idea: "Name the fault in reusable terms rather than pointing at where it hurts.",
  why: "A symptom comment transfers one repair. A named fault transfers a detector, which the writer can run on every paragraph they write afterwards. The difference compounds across a team: one is a fix, the other is a capability.\n\nHanding over a rewritten sentence is the worst version, because it looks maximally helpful and teaches least - the writer accepts it, learns that you will supply the good sentence, and brings you the next draft in the same condition. A named fault is also arguable. The writer can say the subject is consistent and you have misread, and that argument is the evidence they engaged with the diagnosis rather than applying it.",
  failureMode: "'This is confusing, maybe reword?' followed by your rewritten version of the sentence. The writer takes your sentence, the paragraph improves, and nothing was learned by anyone. Compare: 'this paragraph has four different grammatical subjects, so the reader never settles on whose story it is' - which they can check themselves, disagree with, and apply next Tuesday.",
  experiment: "Take the last five comments you left on someone's document and classify each as named-fault, symptom, or rewrite. Write the three counts. If fewer than two are named-fault, your reviews are costing you an hour each and teaching nothing.",
  reflection: "Of your last five comments, how many named a fault the writer could detect for themselves next time?",
  recall: {
    q: "Why is handing over a rewritten sentence the least useful form of review comment?",
    a: "It looks maximally helpful and transfers the least. The writer gets the fix without the rule, so the next draft arrives in the same condition and now depends on you.\n\nA named fault transfers a detector instead, and it is arguable - the writer can push back, which is the evidence they engaged rather than complied."
  },
  deepDive: "Here are the comments I left on a colleague's draft - rewrite each one so it names a fault they could detect themselves, and flag any that were just my preference."
},
{
  id: "revision-report-the-reading",
  track: "revision", level: "paragraph",
  title: "Describe your experience as a reader instead of delivering a verdict",
  source: "George Gopen, Expectations: Teaching Writing from the Reader's Perspective",
  gatePrompt: "Take a paragraph someone else wrote. Write two comments on it: one verdict ('this is unclear') and one report ('I expected the point here and found the history instead'). Mark which of the two the writer could argue with.",
  fallback: "Unclear. This section does not work for me and the argument is not tight enough, so the conclusion does not really follow. Needs another pass before I can approve it.",
  idea: "When you cannot name the fault, report exactly what happened to you as you read, and where.",
  why: "A verdict is a claim about the text, so the writer's only options are to accept it or resist it, and neither tells them where to put their hands. A report is a fact about one reader at one position in the document, and facts about readers are not arguable - the writer cannot tell you that you did not experience that.\n\nThe report also carries the repair information for free. 'I expected the point here' says where the expectation was set and where it was violated, which is the pair of coordinates you need to fix it. This is the honest fallback for entries you cannot diagnose: name the move when you can, report the reading when you cannot, and never guess a diagnosis to sound authoritative.",
  failureMode: "'Unclear. This section does not work for me and the argument is not tight enough.' Three verdicts, no coordinates. The writer now knows a senior person is unhappy somewhere in eight paragraphs, which converts directly into an anxious rewrite of the parts that were fine.",
  experiment: "On the next document you review, convert every verdict-shaped comment into a report with a position: what you expected at that point, what you found instead. Count how many you could not convert - those are the ones where you had a reaction and no reading behind it.",
  reflection: "Which of your comments was a verdict you could not convert into something that actually happened to you as a reader?",
  recall: {
    q: "What makes 'I expected the recommendation here and found more history' more useful than 'this is unclear'?",
    a: "It is a fact about one reader rather than a claim about the text, so it cannot be resisted, only worked with.\n\nAnd it carries coordinates: where the expectation was set and where it was violated. That pair is what the repair needs, and a verdict supplies neither."
  },
  deepDive: "Read this document as a first-time reader and report where your expectations were set and where they were violated, without telling me whether it is good."
},
{
  id: "revision-edit-what-fails",
  track: "revision", level: "paragraph",
  title: "Edit what fails, not what merely differs from how you would have written it",
  source: "William Zinsser, On Writing Well",
  gatePrompt: "Open a document you edited for someone else. Mark each change you made F (a reader would have stumbled) or P (you would have written it differently). Count the P changes.",
  fallback: "We turned the reindex off at 9:40 and things settled down within a couple of minutes. Nobody had thought about what happens when two backfills overlap, so we are adding a lock. It is not clever but it will stop this exact thing happening again.",
  idea: "Change only what would make a reader stumble, and leave everything that is merely not your sentence.",
  why: "Readers stumble on real things: an ambiguous pronoun, a subject that does not match the topic, emphasis landing on the wrong word, a reference to something not yet introduced. They do not stumble on a word you would not have chosen, or on a plain sentence where you would have written a shaped one.\n\nEvery preference edit is a false positive, and false positives are expensive twice. They spend the writer's attention on nothing, and they teach the writer to predict your ear rather than the reader's, which is a worse target because you are one person and you are not the audience. Run that across a team for a year and every document sounds like you, which feels like a quality bar and is actually a loss of range.",
  failureMode: "A colleague writes 'it is not clever but it will stop this exact thing happening again' and you change it to 'the mitigation is unsophisticated but sufficient to prevent recurrence'. Nothing was wrong. You removed a person from the sentence and replaced them with a register, and the writer learns to arrive pre-flattened next time.",
  experiment: "Edit a colleague's paragraph as you normally would, then undo every change you cannot attach to a specific reader failure you could name. Count what survives. Under half means the pass was a rewrite wearing an edit's clothing.",
  reflection: "Which change did you have to undo, and what was the real reason you made it?",
  recall: {
    q: "What is the compounding cost of editing to preference rather than to failure?",
    a: "The writer starts optimising for your ear instead of the reader's, which is a worse target: you are one person, and you are not the audience.\n\nAcross a team it converges every document onto one voice, which reads like a quality bar and is a loss of range - and it consumes the review attention that should have gone to faults that actually break comprehension."
  },
  deepDive: "Here is my edit of someone else's paragraph - for each change, tell me whether a reader would have stumbled without it or whether I was imposing my ear."
},
{
  id: "revision-error-budget",
  track: "revision", level: "sentence",
  title: "Most of what you would flag, no reader ever noticed",
  source: "Joseph M. Williams, \"The Phenomenology of Error\"",
  gatePrompt: "Take a page of your own prose. Mark every error you would flag in someone else's writing, then mark the subset that would change what a reader understands. Write both counts.",
  fallback: "The worker retries the batch which failed, but we cap it at three attempts. Operations was asked to manually re-run anything over the cap. When the scheduler hands a batch to the poller it logs the attempt count, so we can tell them apart.",
  idea: "Spend your flagging budget on faults that change comprehension and ignore the rest.",
  why: "Williams demonstrated the point by planting errors throughout the essay in which he was discussing them, and reporting that readers who were explicitly hunting for errors found very few. What people notice is not what the rulebook lists - it is heavily determined by what they are reading for and who they think wrote it.\n\nSo the flags divide sharply. An ambiguous pronoun changes what the reader believes and they will never know it happened, which is exactly why you must catch it. A split infinitive changes nothing, and flagging it spends the same unit of the writer's attention and goodwill as the pronoun did, for zero return.",
  failureMode: "A review that flags 'which' for 'that' and a split infinitive, and misses that 'it logs the attempt count' could be the scheduler or the poller, and that 'tell them apart' has no antecedent at all. The rule faults were visible. The comprehension faults required reading for meaning, which the rule-hunting pass actively prevents.",
  experiment: "Take your last review. Sort the flags into rule-flags and comprehension-flags and write the ratio. If more than a third are rule-flags with no comprehension cost, delete them from the next review and see whether anyone notices the difference.",
  reflection: "Which comprehension fault did you miss on a page where you caught three rule faults?",
  recall: {
    q: "What did Williams do in 'The Phenomenology of Error', and what follows for your reviews?",
    a: "He planted errors throughout the article that was itself about error, and reported that readers looking for errors found very few of them. Noticing depends on what you are reading for and who you think wrote it, not on the rulebook.\n\nSo flags should be rationed to faults that change comprehension. A rule-flag costs the same attention and goodwill as an ambiguous pronoun and returns nothing."
  },
  deepDive: "Review this page twice - once hunting rule violations and once reading only for meaning - and show me what each pass caught that the other missed."
},
{
  id: "revision-hand-it-back",
  track: "revision", level: "document",
  title: "Hand the draft back when the fault is structural, and say which fault",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Find a document you fixed yourself rather than sending back. Write the one-sentence diagnosis you would have sent instead, and write down how long your fix took.",
  fallback: "The current orchestration setup has grown organically since 2022 and now spans two clusters, three scheduling mechanisms and a set of scripts that nobody owns. Various teams have raised concerns about it at different points. This document walks through the history, the current state, and some considerations for the future.",
  idea: "Return a structurally broken draft with the diagnosis and one worked example rather than repairing it yourself.",
  why: "Structure is the thinking. Deciding what the document claims, what the reader must hold first, and which sections earn their place is the same work as deciding what you believe. Doing it for someone removes the only part that transfers, and you will do it again on their next draft, and the one after.\n\nOwnership is the second mechanism, and it is the one that bites in a review meeting. An author who did not choose the structure cannot defend it under questioning, because they do not know why the third section is third. At that point you own the document and everyone in the room can tell.",
  failureMode: "A design doc whose opening promises a walk through 'the history, the current state, and some considerations for the future' and never states what is being proposed. No line edit reaches this. If you restructure it yourself you have written their design doc, and they will bring you the next one in the same shape, because nobody told them the shape was the problem.",
  experiment: "On the next structurally broken draft, send back one sentence of diagnosis plus one section reworked as a demonstration, with a deadline. When it returns, compare it to what you would have written. Note the gap, and note whether the gap actually costs the reader anything.",
  reflection: "What did you fix yourself last time, and what would the one-sentence diagnosis have been?",
  recall: {
    q: "Two costs of restructuring someone's draft for them. Name both.",
    a: "The learning: structure is the thinking, so doing it for them removes the only part of the exercise that transfers, and you will do it again next time.\n\nThe ownership: an author who did not choose the structure cannot defend it under questioning in the review, because they do not know why section three is third. You now own the document, visibly."
  },
  deepDive: "Here is a structurally broken draft from someone on my team - give me the one-sentence diagnosis to send back and pick which single section I should rework as the example."
},
{
  id: "revision-editing-is-management",
  track: "revision", level: "document",
  title: "Editing someone's draft is a management act and it costs them something",
  source: "John McPhee, Draft No. 4",
  gatePrompt: "Take the last draft you reviewed. Count your comments, then write in one sentence what the edit was for. Cross out every comment that sentence does not pay for, and count what is left.",
  fallback: "Left about forty comments, most of them small. I have rewritten the summary and the risks section, changed the headings to match our template, and flagged a few places where the tone felt off. Happy to jump on a call if going through them all is easier.",
  idea: "Decide what the edit is for before deciding how much of it to do.",
  why: "Comments are received as judgements of the writer, not of the text, and volume dominates content. Forty small comments say 'this is bad' no matter how gentle each one is, because the reader of a comment thread cannot help integrating. The currency you are spending is the writer's willingness to bring you the next draft without pre-flinching, and it depletes per comment, not per unit of severity.\n\nThe purposes also conflict. Shipping this document well means fixing what matters and leaving the rest. Making this person better means commenting on the recurring fault and leaving the specific fixes alone. Pursuing both at full strength is the default, and it is the most expensive option available.",
  failureMode: "Forty comments, a rewritten summary, headings changed to match a template, and an offer to jump on a call. Every element was well meant. What arrives at the other end is a document the author no longer recognises and a message that they are not trusted to produce one, and the next draft they write will be aimed at surviving your review rather than at its reader.",
  experiment: "Before your next review, write the purpose in one sentence and set a comment budget - five is a real number for a good draft. Then review, count what you actually left, and report the overrun. The gap between the budget and the count is the part of the edit that was for you.",
  reflection: "What was that edit for, and what did it cost the person on the other end?",
  recall: {
    q: "Why does the number of comments matter independently of how severe each one is?",
    a: "Because comments are read as judgement of the writer rather than the text, and volume integrates: forty small ones say the document is bad regardless of their content.\n\nThe resource being spent is the writer's willingness to bring you the next draft unflinching, and it depletes per comment, not per unit of severity."
  },
  deepDive: "Here is a draft and my review of it - tell me which comments serve shipping this document, which serve making this person better, and which serve neither."
}
);

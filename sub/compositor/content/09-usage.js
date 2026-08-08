/* Track: Usage, myths and the evidence. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "usage-rule-or-superstition",
  track: "usage", level: "sentence",
  title: "A rule has evidence behind it; a superstition only has confidence",
  source: "Bryan Garner, Garner's Modern English Usage",
  gatePrompt: "Paste a paragraph you wrote, and beside it paste one correction you made to someone else's writing this month. For each rule you applied, write one line naming the evidence for it and one line naming the reader it protects. Cross out every rule where both lines came out blank.",
  fallback: "Editorial pass on the migration doc before it goes to the customer. Do not start sentences with \"But\" or \"And\", do not end a sentence with a preposition, and change every restrictive \"which\" to \"that\" throughout. Also \"data\" takes a plural verb, so please fix the four places where it does not. These are basic rules and we should be holding the bar on anything that leaves the team.",
  idea: "Before you enforce a rule, name the evidence behind it, the reader it protects, and whether writers you admire actually observe it.",
  why: "Usage advice arrives in two kinds and they feel identical from the inside. One kind tracks something real about how readers process English: an ambiguity that costs a re-read, a distinction that carries meaning, a form so widely observed by careful writers that its absence registers as error. The other kind is inherited assertion, often traceable to one nineteenth-century schoolmaster reasoning from Latin, and it survives because nobody has ever been asked for the evidence.\n\nGarner's three questions separate them, because a real rule answers all three and a superstition answers none. What evidence supports it: corpus data, editorial practice, a demonstrable ambiguity. Who is harmed: a specific reader misreading a specific sentence. Do careful writers observe it: check ten pages of prose you respect. A rule that fails all three still costs you something. It spends editing attention that should be going to characters, actions and sentence order, and it spends credibility with the writer you are correcting, who can usually tell the difference even if they cannot name it.",
  failureMode: "Review comments that stack real problems and folklore at the same volume: \"the second paragraph buries the recommendation, and do not open a sentence with 'But'.\" The writer now has to guess which of your notes is load-bearing, and the safest guess is that none of them are. Worse is the correction that damages a sentence to satisfy a rule nobody can defend, such as fronting a preposition into \"the failure mode about which we warned\", so the clause stalls at exactly the point it should be carrying weight.",
  experiment: "Open the last three sets of review comments you left on someone's writing. Sort every note into two piles: about the reader's comprehension, and about a rule. For each rule note, write down where you learned that rule. Count the ones you cannot source, and stop enforcing them.",
  reflection: "Which rule turned out to be one you have enforced for years without ever knowing where it came from?",
  recall: {
    q: "What three questions separate a usage rule from a superstition?",
    a: "What evidence supports it, who is harmed when it is broken, and whether careful writers actually observe it. A real rule answers all three with something concrete: corpus data or settled editorial practice, a specific reader misreading a specific sentence, and prose you respect that follows it.\n\nA superstition answers none of them. Its whole support is the confidence of whoever taught it to you."
  },
  deepDive: "Here are the edits I made to a colleague's draft - tell me which ones I can defend on evidence and which ones are folklore I picked up somewhere and never checked."
},
{
  id: "usage-language-change-index",
  track: "usage", level: "sentence",
  title: "The Language-Change Index gives you a scale instead of a verdict",
  source: "Bryan Garner, Garner's Modern English Usage",
  gatePrompt: "Paste a paragraph you wrote. Mark every word or construction you hesitated over, and put each one on a five-point scale from \"rejected by everyone\" to \"nobody notices any more\". Rewrite only the ones you placed at one or two.",
  fallback: "Comments on the runbook. It uses \"impact\" as a verb in four places and \"leverage\" as a verb in two, and neither of those is a word. \"Comprise\" is used backwards in the overview. There is also a \"none of the checks are\" in the rollback section. I have marked all of them as errors; please fix everything before this gets merged, the bar for published runbooks should be the same as for customer docs.",
  idea: "Place each contested usage on a five-stage scale from rejected to fully accepted, then let the stage decide whether you correct it, allow it or ignore it.",
  why: "Garner's index runs from Stage 1, rejected and still an error to nearly everyone, through Stage 3, where a form is widespread but still draws objection from careful readers, up to Stage 5, where the old objection survives in a handful of holdouts. The taxonomy is not the point. The point is that a position replaces a verdict, and a position tells you what to do.\n\nThe mechanism on the reader's side is distraction cost. A Stage 1 usage makes some portion of your readers stop and quietly reassess your competence, which is a genuine cost to whatever you were arguing. A Stage 5 usage costs nothing with anyone who was not already looking for a fight. Between the two, the deciding question is audience: an internal design doc and a customer-facing incident notice sit at different points on the same scale, so the identical word can be unremarkable in one and worth twenty seconds of your time in the other.",
  failureMode: "Editing everything to one standard. A reviewer flags \"impact\" as a verb, \"none of the checks are\", and a genuinely ambiguous \"only\" in a single pass, all labelled errors, and the writer dutifully fixes the two that were never wrong and misses the one that was. The other version is the writer who freezes mid-paragraph to litigate \"comprise\" and loses the thread of the argument they were three sentences into making.",
  experiment: "List the five usages you most often correct in other people's drafts. Beside each, write the stage you believe it sits at, then look three of them up in a usage dictionary. Count how many you had placed two or more stages below where the evidence puts them.",
  reflection: "Which usage were you treating as an error that turns out to be near the top of the scale?",
  recall: {
    q: "Why is a five-stage scale more useful than a right-or-wrong verdict on a contested usage?",
    a: "Because the stage tells you what the usage actually costs a reader. A Stage 1 form makes readers question your competence; a Stage 5 form costs nothing with anyone who is not already hunting for errors. The decision to correct depends on that cost and on who is reading.\n\nA binary verdict throws the information away, so you spend the same editing attention on a settled question as on a live one."
  },
  deepDive: "Go through the usages I flagged in this draft, place each on Garner's Language-Change Index, and tell me which are worth changing for this specific audience."
},
{
  id: "usage-strunk-and-white",
  track: "usage", level: "document",
  title: "Fifty years of stupid grammar advice: how Strunk and White survived being wrong",
  source: "Geoffrey K. Pullum, \"50 Years of Stupid Grammar Advice\"",
  gatePrompt: "Open the writing guidance your team actually cites: a style page, an onboarding doc, a review checklist. Mark every rule that comes with an example, then check whether the example is genuinely an instance of the thing the rule names. Write the count of examples that are not.",
  fallback: "Team writing standards, section 2. Use the active voice. Strunk and White is the reference here and every engineer should keep a copy on the desk. Sentences such as \"There were three retries recorded before the circuit opened\" are passive and weak, so rewrite them with a real subject. Reviewers should flag any sentence containing a form of \"to be\" and ask the author to justify it.",
  idea: "Check the examples under a rule before you adopt the rule, because a confidently written guide can be wrong about its own cases.",
  why: "Pullum's demonstration is specific and checkable. Under the heading urging the active voice, Elements of Style offers examples that contain no passive at all. \"There were a great number of dead leaves lying on the ground\" is an existential construction, not a passive one. The authors could not reliably identify the construction their own rule was about, and the book has still sold in the millions and shaped how generations were taught to write.\n\nThat transmission mechanism is the part worth understanding, because it operates on your team's style page too. Folklore spreads on tone, not evidence. A short, confident, unhedged imperative is cheap to remember, cheap to repeat, and impossible to argue with inside a review comment, while the accurate statement is longer and arrives with conditions attached. The wrong rule outcompetes the right one on transmission, and it keeps winning until somebody checks the examples.",
  failureMode: "A team standard that says \"avoid the passive\" and in practice flags every sentence containing a form of \"to be\". Engineers rewrite \"there were three retries before the circuit opened\" into something longer and worse, while the genuinely evasive passives sail through: \"the record was deleted\", agent unnamed, in an incident write-up, which is the one sentence in the document where the missing subject matters.",
  experiment: "Take your team's writing guidance and pick the three rules it states most confidently. For each, find a paragraph of prose you consider genuinely good, from any source, and check whether it obeys the rule. Write down the violation count you find in prose you already rated highly.",
  reflection: "Which rule on your team's page survived contact with prose you admire, and which one did not?",
  recall: {
    q: "What did Pullum show about the passive-voice section of Elements of Style, and why does it matter beyond that one book?",
    a: "Several of the examples the book presents as passives are not passives at all, so the authors could not reliably identify the construction their own rule targeted. The book's authority came from its brevity and tone rather than its accuracy.\n\nIt matters because that is how usage folklore propagates in general. A short confident imperative is easier to remember and repeat than a correct statement with conditions, so it wins on transmission rather than on truth, including on your own team's style page."
  },
  deepDive: "Here is my team's writing guidance - check each rule's examples against what the rule actually claims, and tell me which rules I should delete outright."
},
{
  id: "usage-split-infinitive",
  track: "usage", level: "sentence",
  title: "Split the infinitive when the meaning requires it",
  source: "Bryan Garner, Garner's Modern English Usage",
  gatePrompt: "Paste a paragraph you wrote. Find every infinitive with an adverb near it and write out both placements, inside and outside. Keep the one where the adverb attaches to the verb you meant, and mark any sentence where the unsplit version is ambiguous.",
  fallback: "We intend fully to migrate the remaining tenants before the code freeze. The new scheduler is expected to produce an increase of more than double on write throughput, and operators will be asked promptly to acknowledge any alert raised during the window. If a connector fails mid-cutover we will need quickly to decide whether to roll back or push forward, so the on-call should be briefed the day before.",
  idea: "Put the adverb where it modifies the verb you meant, which is often between \"to\" and the verb.",
  why: "There is nothing in the grammar of English the prohibition could rest on. It was imported by nineteenth-century grammarians reasoning from Latin, where the infinitive is one word and cannot be split, and it has been rejected by every serious usage authority since Fowler. Garner treats it as a superstition, not a close call.\n\nThe cost of obeying it is not aesthetic. Adverb placement in English carries scope, so moving the adverb moves what it modifies. \"We expect to more than double throughput\" has no unsplit form at all. \"We plan quickly to review each connector\" leaves the reader to work out whether the planning is quick or the review is, and they will feel the hesitation before they resolve it. A reader who parses your sentence twice is a larger cost than a reader who was never going to object in the first place.",
  failureMode: "Adverbs exiled into positions that build a garden path: \"operators will be asked promptly to acknowledge any alert\", where \"promptly\" can attach to the asking or the acknowledging, and only one of those is what the runbook needs to say. The extreme case is the sentence that cannot be unsplit and gets inflated instead, so \"expected to more than double\" becomes \"expected to produce an increase of more than double\", eight words to avoid two.",
  experiment: "Search your last long document for every adverb sitting immediately before the word \"to\". Read each sentence again with the adverb moved inside the infinitive and decide which version says what you meant. Count how many you move and how many you leave.",
  reflection: "How many of your adverbs were outside the infinitive purely out of habit, and did any of them change meaning when you moved them in?",
  recall: {
    q: "What is the actual cost of avoiding a split infinitive?",
    a: "Adverb placement in English determines scope, so moving an adverb out of the infinitive can change or blur what it modifies. \"Asked promptly to acknowledge\" is ambiguous in a way that \"asked to promptly acknowledge\" is not, and some constructions such as \"to more than double\" have no unsplit form.\n\nThe prohibition came from applying Latin, where the infinitive is a single word, to a language where it is two. No reader is helped by it."
  },
  deepDive: "Find the infinitives in this draft where I moved the adverb out to avoid a split, and tell me which of them changed meaning when I did."
},
{
  id: "usage-stranded-prepositions",
  track: "usage", level: "sentence",
  title: "The preposition rule was imported from Latin and never fit English",
  source: "Rodney Huddleston and Geoffrey K. Pullum, The Cambridge Grammar of the English Language",
  gatePrompt: "Paste a paragraph you wrote. Find every \"which\" or \"whom\" with a preposition standing in front of it, rewrite each with the preposition at the end of its clause, and mark the version you would actually say out loud.",
  fallback: "This is the failure mode about which we warned in the March design review. The replica to which the backfill writes is the same one from which the tenant API reads, and that is the condition under which the saturation we saw on Tuesday occurs. Someone needs to decide with which team the connector timeout fix now sits, and by when we expect it.",
  idea: "Leave the preposition at the end of the clause when that is where English puts it.",
  why: "Preposition stranding is native to English, attested for more than a thousand years, and in several constructions it is the only grammatical option. You cannot front the preposition in \"the replica the backfill writes to\" while also dropping the relative pronoun, and you cannot front it at all in a prepositional passive such as \"the queue was written to twice\". A rule that forbids what the grammar obliges you to do is not a rule about English.\n\nOn the reader's side, fronting has a measurable effect on processing. \"The condition under which the saturation occurs\" makes the reader hold an unresolved prepositional phrase across the whole relative clause before the verb arrives. Occasionally that formality is exactly what you want. Applied to every clause in a paragraph because of a rule, it reads as a legal filing, and readers start skimming at precisely the point where the technical content lives.",
  failureMode: "A design doc where every relative clause has been formalised: \"the failure mode about which we warned\", \"the team with which the fix sits\", \"the window during which the backfill runs\". Each one is grammatical, and the accumulation is unreadable. The reliable tell is that you would say none of them to the person sitting next to you.",
  experiment: "Take a paragraph you wrote for a document that leaves your team and read it aloud. Wherever you stumble or hear yourself performing, check for a fronted preposition and put it back at the end. Count how many you moved, and note whether the paragraph lost any precision or only lost formality.",
  reflection: "Did any of the sentences you unfronted actually lose precision, or did they only lose ceremony?",
  recall: {
    q: "Why can the prohibition on ending a clause with a preposition not be a rule of English?",
    a: "Because English requires stranding in several constructions. Prepositional passives such as \"the queue was written to twice\", and relative clauses with the pronoun omitted, have no fronted equivalent at all. A rule that bans a form the grammar obliges you to use is describing some other language.\n\nIt was imported by analogy with Latin, where the construction genuinely does not exist."
  },
  deepDive: "Go through this document for fronted prepositions and tell me which ones are earning their formality and which ones are just the rule talking."
},
{
  id: "usage-which-and-that",
  track: "usage", level: "sentence",
  title: "\"Which\" against \"that\" is house style dressed as grammar",
  source: "Geoffrey K. Pullum, \"50 Years of Stupid Grammar Advice\"",
  gatePrompt: "Paste a paragraph you wrote. Mark every relative clause, then label each one: does it identify which thing you mean, or add information about a thing already identified? Fix the commas to match, and ignore the choice of word entirely until they do.",
  fallback: "The scheduler that we rolled out in March is now carrying all tenant traffic. The backfill job that saturated the read replica has been moved to the overnight window. The audit hook that adds a quarter second to every workflow start is the last item outstanding, and the runbook that covers it still needs a rewrite before we hand it to support.",
  idea: "The commas carry the restrictive distinction; the choice between \"which\" and \"that\" is a house convention you either adopt deliberately or drop.",
  why: "Restrictive \"which\" has been in continuous use by good writers for centuries and remains ordinary in British editing. The preference for \"that\" in restrictive clauses began as a reform proposal and spread through American editorial practice and Strunk and White. Pullum's observation is that its own advocates break it constantly, E. B. White included, which is the signature of a convention rather than a rule.\n\nWhat actually carries meaning is the punctuation. \"The connector that we deprecated\" and \"the connector, which we deprecated,\" tell a reader different things: the first says there are several connectors and this is the one, the second says there is one and here is a fact about it. Get the commas wrong and the reader miscounts your nouns and quietly builds the wrong model of your system. Get the word wrong and a copy editor changes it. Those are not the same size of error, and treating them as one spends your attention on the smaller one.",
  failureMode: "A mechanical which-to-that pass that strips the commas along with the word, so every non-restrictive clause turns restrictive. \"The audit hook that adds a quarter second to every start\" now implies there are several audit hooks and this is the slow one. Nobody catches it in review, because every sentence is perfectly grammatical, and the reader walks away believing in components that do not exist.",
  experiment: "Take a design doc you wrote and list every relative clause in it. For each, ask whether deleting the clause would change which thing you are talking about. Where the answer is no, the clause needs commas. Count the ones missing them, and ignore every \"which\" and \"that\" while you do it.",
  reflection: "How many of your relative clauses had the wrong commas, and did any of them make a reader think there is more of something than there is?",
  recall: {
    q: "What separates the restrictive and non-restrictive distinction from the \"which\" versus \"that\" rule?",
    a: "The distinction is real and it is carried by the commas. A restrictive clause identifies which thing you mean; a non-restrictive one adds information about a thing already identified. Getting the commas wrong changes what the reader believes exists.\n\nThe word choice is an editorial convention, standard in American house styles and not in British ones. Follow it if your style guide says so. It is not a grammar error either way."
  },
  deepDive: "Check the relative clauses in this draft for comma errors and tell me where the punctuation is telling my reader something I did not mean."
},
{
  id: "usage-none-and-initial-and",
  track: "usage", level: "sentence",
  title: "\"None\" was never singular and \"and\" has always opened sentences",
  source: "Merriam-Webster's Dictionary of English Usage",
  gatePrompt: "Paste a paragraph you wrote. Circle every \"Additionally\", \"Furthermore\", \"That said\" and \"However\" standing at the front of a sentence, and rewrite each as \"And\", \"But\" or \"So\". Read both versions aloud and keep the one that sounds like you.",
  fallback: "None of the four connectors was reporting healthy at 09:10, and none of the alerts was routed to the on-call rotation. Additionally, the status dashboard was serving data that was twenty minutes stale. That having been said, customer impact was limited to a single tenant on the shared cluster. Furthermore, we have since corrected the routing rule and added a synthetic check.",
  idea: "Look the rule up before you enforce it, because both of these prohibitions are contradicted by the entire recorded history of the language.",
  why: "\"None\" descends from Old English nan and has taken plural verbs since the ninth century; the singular-only claim is an argument from etymology that no major usage authority has supported in a hundred years. Sentence-initial \"and\" and \"but\" are attested continuously from Old English through every period of English prose since. Neither prohibition has ever described the language it claims to govern.\n\nThey survive because they are cheap to state and because the cost of avoiding them is invisible to the person paying it. Substituting \"additionally\" for \"and\" drops four syllables of Latinate connective at exactly the point where the reader is working out how this sentence relates to the last one. The heavier the connective, the more that relation reads as bureaucratic rather than logical, and a paragraph of them reads as a document written to be filed. Two minutes in a usage dictionary before you correct someone is what stops you spreading that cost across every draft you touch.",
  failureMode: "Paragraphs strung together on heavy connectives because the light ones were forbidden: \"Additionally, the dashboard was showing stale data. That having been said, customer impact was limited. Furthermore, we have corrected the routing rule.\" Three sentences, three throat-clearings, and the actual logical relations are now weaker than \"and\", \"but\" and \"so\" would have made them. The \"none\" version is quieter: \"none of the four connectors was reporting healthy\" is not wrong, but it was chosen out of fear rather than for a singular sense, and the writer will defend it in review as correctness.",
  experiment: "Open your last incident write-up and count the sentence-initial connectives of three syllables or more. Replace half of them with \"And\", \"But\" or \"So\", then read the paragraph aloud. Write down whether anything became less clear, or only less formal.",
  reflection: "Which of the two prohibitions had you genuinely internalised, and what has it been costing your sentences?",
  recall: {
    q: "What does the corpus evidence say about \"none\" taking a plural verb and about opening a sentence with \"and\"?",
    a: "Both are attested throughout the recorded history of English. \"None\" has taken plural verbs since Old English, and sentence-initial \"and\" and \"but\" run continuously from the earliest prose onward. Neither prohibition has ever matched the language.\n\nThe practical move is the habit: any contested correction is worth two minutes in a usage dictionary before you make it, because the cost of the workaround lands on every sentence that follows."
  },
  deepDive: "Take the connectives in this draft and tell me which heavy ones I reached for out of habit, and what each sentence would do with a plain \"but\" instead."
},
{
  id: "usage-readability-formulas",
  track: "usage", level: "document",
  title: "Readability formulas count syllables, and ISO 24495-1 declines to rely on them",
  source: "ISO 24495-1:2023, Plain language, Part 1: Governing principles and guidelines",
  gatePrompt: "Take a document you wrote for a reader outside your team. Write down the one thing that reader has to do after reading it, then mark every place in the document where that action is described. If it appears once, in the middle, note that before you read on.",
  fallback: "We put the migration guide through a readability checker and brought it from grade 14 down to grade 9 by splitting the long sentences and replacing words of three syllables or more. It now scores as plain English, so we are treating the clarity action item as closed. Two of the three pilot customers did still call support to ask which step to run first, but the document meets the bar we set for the quarter.",
  idea: "Judge a document by whether its intended reader can find, understand and use what they need, not by a grade-level score.",
  why: "Flesch-Kincaid and its relatives compute a number from average sentence length and average syllables per word. That is the whole input. They were fitted decades ago against comprehension tests on schoolchildren reading continuous prose, and they cannot see organisation, whether a term is familiar to your audience, whether steps appear in the order the reader performs them, or whether the reader succeeded at the task. ISO 24495-1 defines plain language by reader outcome instead: the intended readers can find what they need, understand it, and use it.\n\nThe measurement problem is that the formulas are trivially gameable in the wrong direction. Splitting one accurate sentence into three choppy ones improves the score. So does swapping a precise technical term for a longer vague phrase, because \"deprecate\" scores worse than \"stop using it the way we said before\". You can optimise a document into a better number and a worse reader, and nothing in the score will tell you that is what happened.",
  failureMode: "A migration guide taken from grade 14 to grade 9 by shortening sentences and words, shipped as \"now plain English\", while pilot customers still ring support to ask which step comes first. The score moved because sentence length moved. The ordering, the unstated prerequisite and the undefined term are all exactly as they were, because the formula never looked at any of them.",
  experiment: "Take a document you have already shipped and find two people from its intended audience. Ask each to perform the task the document exists for while you watch in silence, and write down every point where they stop, backtrack or ask you a question. Compare that count against whatever readability score the document earns.",
  reflection: "Where did your readers actually stall, and would any readability formula have found that spot?",
  recall: {
    q: "What do readability formulas measure, and what does ISO 24495-1 use in place of them?",
    a: "They compute a score from average sentence length and average syllables per word, and nothing else. They cannot see organisation, task order, term familiarity, or whether a reader succeeded at what they came to do.\n\nISO 24495-1 defines plain language by reader outcome: the intended readers can find what they need, understand it, and use it. That is testable with actual readers, and a grade-level score is not."
  },
  deepDive: "Help me design a five-question check for this document that tests whether a real reader can complete the task, rather than whether my sentences are short."
}
);

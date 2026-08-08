/* Track: Compliance as cost and gate. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "compliance-soc2-is-an-attestation",
  track: "compliance", level: "read",
  title: "SOC 2 is an attestation against published criteria, not a certification",
  source: "AICPA, Trust Services Criteria, TSP Section 100 (2017 criteria with revised points of focus, 2022)",
  idea: "There is no such thing as being SOC 2 certified; there is a CPA firm's opinion on whether your own described controls met published criteria over a stated scope.",
  why: "The Trust Services Criteria are a real, readable document. The common criteria are organised into series - control environment, communication, risk assessment, monitoring, control activities, logical and physical access, system operations, change management, and risk mitigation. Each criterion has points of focus underneath it that describe what an auditor expects to see. None of that is a logo. It is a control list you can print and tick.\n\nThe money follows from that structure. The audit fee is a function of scope and of how much evidence the auditor has to sample. The engineering cost is a function of how many of those criteria you satisfy with an automated, queryable control versus a person doing a quarterly ritual in a spreadsheet. Reading the criteria is how you find out which of the two you are buying.",
  failureMode: "The team treats SOC 2 as a badge procured by the security lead, so nobody in engineering ever reads the criteria. Then an auditor asks for evidence of quarterly logical access reviews across every in-scope system, and it turns out access to the Kubernetes clusters was never in the described system boundary, or was, and there is no record. The remediation lands in a sprint that was budgeted for product work.",
  experiment: "Get a copy of TSP Section 100 or your auditor's criteria mapping. Count the common criteria in scope for your report. For each one, write A if a query or automated job produces the evidence, and M if a human produces it manually. Report the ratio. That ratio is your recurring compliance labour bill.",
  reflection: "How many criteria are in your scope, and what fraction of them are satisfied manually?",
  recall: {
    q: "Why is 'SOC 2 certified' a category error, and what is the document that actually defines what you are being measured against?",
    a: "SOC 2 is an attestation engagement: a CPA firm issues an opinion on management's description of a system and on whether the controls in it met the applicable criteria. There is no certificate and no certifying body.\n\nThe measuring stick is the AICPA Trust Services Criteria, TSP Section 100, which enumerates the common criteria and their points of focus. It is a readable control list, and reading it converts a sales logo into an engineering backlog."
  },
  deepDive: "Help me map the SOC 2 common criteria to the controls my platform already enforces in code, and mark the ones that today depend on a human remembering to do something."
},
{
  id: "compliance-five-categories-scope",
  track: "compliance", level: "decide",
  title: "There are five trust services categories and you probably scope two",
  source: "AICPA, Trust Services Criteria: Security, Availability, Processing Integrity, Confidentiality, Privacy",
  idea: "Scope is a choice you make, Security is the only mandatory category, and each additional category you add buys audit fee and permanent evidence work.",
  why: "Security - the common criteria - is required in every SOC 2. Availability, Confidentiality, Processing Integrity and Privacy are optional add-ons, each with its own additional criteria. Most infrastructure vendors scope Security plus Availability, sometimes plus Confidentiality. Processing Integrity and Privacy are the expensive tail: Privacy in particular pulls in notice, choice, retention and disposal criteria that touch product surfaces, not just platform.\n\nThe decision is economic and it is reversible only upward. Adding a category mid-year means the observation period for the new criteria starts fresh, so you cannot bolt Privacy on in October and have it covered by a December report. Deciding scope is therefore a twelve-month commitment made by someone who should know what each category costs in engineer-hours.",
  failureMode: "Sales agrees to Processing Integrity because a prospect's questionnaire mentioned it, without anyone checking that Processing Integrity criteria require demonstrable completeness and accuracy controls over data processing. For a pipeline product that is a large body of reconciliation and error-handling evidence that does not exist yet, and it now has to exist for a full observation period before the report can say anything.",
  experiment: "Open your current SOC 2 report or your auditor's engagement letter and write down exactly which categories are in scope. Then look at the last ten security questionnaires from deals and count how many actually asked for a category you do not have. If the answer is zero, you have your evidence for not expanding scope.",
  reflection: "Which categories are in your report, and how many deals in the last year actually required one you do not carry?",
  recall: {
    q: "Which trust services category is mandatory in a SOC 2, and what is the cost structure of adding another one?",
    a: "Security, expressed as the common criteria, is mandatory. Availability, Confidentiality, Processing Integrity and Privacy are elective.\n\nEach elective category adds its own criteria, its own evidence, and its own audit fee, and for a Type 2 the new criteria need their own observation period before they can appear in a report. Scope expansion is a twelve-month decision, not a quarter-end one."
  },
  deepDive: "Given my product's data flows, help me argue which trust services categories are genuinely load-bearing for our deals and which would be scope we pay for and never get asked about."
},
{
  id: "compliance-type-1-versus-type-2",
  track: "compliance", level: "read",
  title: "Type 1 is a photograph and Type 2 is a film with a stated period",
  source: "AICPA, SSAE No. 18, AT-C Section 205 (examination engagements); AICPA SOC 2 reporting guidance",
  idea: "A Type 1 opines on control design at a single date, a Type 2 opines on operating effectiveness across a stated period, and the period is why a Type 2 cannot be conjured for a deal that is closing this quarter.",
  why: "Type 1 asks whether the controls were suitably designed as of a date. Type 2 asks whether they operated effectively throughout a period, which the report states explicitly on its cover. The auditor samples events from inside that window: change tickets, access reviews, incident records, onboarding and offboarding. If the control did not exist for the first two months of the window, there is nothing to sample and the report says so.\n\nThat makes the observation period a lead-time constraint in the same category as a hardware order. You cannot compress it with money. The only lever is starting earlier, and the only way to know when to start is to know which deals will demand a Type 2 and when.",
  failureMode: "A large prospect asks for a Type 2 in November. The team has a Type 1 from March and assumes the auditor can upgrade it. Instead the observation period has to run forward from whenever the controls actually started operating, and the report lands well after the prospect's procurement deadline. The deal slips a quarter or closes with a contractual commitment to deliver a report by a date the team cannot control.",
  experiment: "Find your last SOC 2 report and read the period stated on the front. Write down the start date, the end date, and the report issue date, then compute the gap between period end and issue. That gap is your reporting lag, and it is the number sales needs when they promise a report to a prospect.",
  reflection: "What is your observation period, and how many days after period end did the report actually issue?",
  recall: {
    q: "What exactly does a Type 2 report add over a Type 1, and why does that make it impossible to produce on demand?",
    a: "A Type 1 opines only on whether controls were suitably designed at a point in time. A Type 2 also opines on whether they operated effectively throughout a stated period, and the auditor tests samples drawn from inside that period.\n\nBecause the evidence has to accumulate over calendar time, no amount of spend shortens it. A Type 2 has a lead time, plus a further lag between period end and report issue."
  },
  deepDive: "Help me build a backwards schedule from a target report issue date to the date our controls must all be operating, given a Type 2 observation period and a reporting lag."
},
{
  id: "compliance-report-section-four",
  track: "compliance", level: "read",
  title: "A SOC 2 report has numbered sections and the exceptions are in section four",
  source: "AICPA SOC 2 report structure: service auditor's report, management assertion, system description, tests of controls and results, other information",
  idea: "Reading a vendor's SOC 2 means going to the tests of controls and the exceptions, not to the opinion letter at the front.",
  why: "The report has a predictable shape. The independent service auditor's report carries the opinion. Management's assertion follows. Then the system description, written by management, defines the boundary: which services, which environments, which subservice organisations are carved out. Then the section that matters, the auditor's tests of controls with the results, where any exceptions are written down alongside management's response. A final section may carry unaudited other information.\n\nAn unqualified opinion at the front is compatible with a list of exceptions in the back, because the auditor can conclude that the exceptions were not material to the criteria overall. So the opinion tells you almost nothing about operational reality. The tests section tells you what actually failed, how often, and what management said about it. It also tells you the complementary user entity controls, which are the things the report assumes you are doing.",
  failureMode: "A procurement process collects vendor SOC 2 reports, checks that the opinion is unqualified, files them, and moves on. Nobody reads the system description, so nobody notices that the vendor's report covers a different product line than the one being bought, or that the database layer is carved out to a subservice organisation whose report nobody requested.",
  experiment: "Take the SOC 2 report of one vendor you already depend on. Go straight to the tests of controls section and count the exceptions. Then read the system description and write down one sentence on what is inside the boundary and what is carved out. Compare that boundary to the service you actually consume.",
  reflection: "For the vendor you checked, how many exceptions were listed, and did the described system boundary actually cover what you buy?",
  recall: {
    q: "Where in a SOC 2 report do you find what actually failed, and why is an unqualified opinion not an answer to that question?",
    a: "In the tests of controls section, where the auditor lists each test performed, the result, and any exceptions with management's response. The system description before it defines the boundary the tests apply to.\n\nAn unqualified opinion can coexist with exceptions, because the auditor judges whether they were material to the criteria as a whole. Reading only the opinion tells you a judgement was made, not what it was made about."
  },
  deepDive: "Walk through a vendor SOC 2 with me section by section and help me write a short internal note on the boundary, the exceptions, and the complementary user entity controls we are implicitly on the hook for."
},
{
  id: "compliance-carve-out-versus-inclusive",
  track: "compliance", level: "decide",
  title: "Carve-out and inclusive methods decide whether your vendors are in your report",
  source: "AICPA SOC 2 guidance on subservice organisations, the carve-out and inclusive methods, and complementary user entity controls",
  idea: "You choose whether your subservice organisations are examined inside your report or excluded from it, and that choice moves work between your auditor, your team, and your customer.",
  why: "Under the carve-out method, the subservice organisation's controls are described but excluded from the scope of the auditor's testing, and the report lists complementary subservice organisation controls that the reader must assess separately. Under the inclusive method, the subservice organisation's relevant controls are described and tested inside your report, which requires their cooperation and their assertion. Almost everyone carves out the hyperscaler, because AWS is not going to participate in your engagement.\n\nThe consequence is that carve-out pushes assessment work onto your customer, who now has to obtain and read your cloud provider's report as well as yours. That is fine when the carved-out party is a household name with a public report, and it is friction when it is a small vendor your customer has never heard of. Every carve-out is a small tax on every future deal review.",
  failureMode: "The system description carves out a niche vendor handling a real part of the data path, and the report offers complementary subservice organisation controls the customer must evaluate. Enterprise security review stalls because the customer cannot get that vendor's report, and the deal now depends on a third party's audit calendar rather than on yours.",
  experiment: "List the subservice organisations named in your own system description. For each, note whether it is carved out, whether it publishes a SOC 2 or ISO certificate a customer can obtain without a call, and whether it sits in the data path or only in support systems. Count how many are both in the data path and hard to verify.",
  reflection: "How many of your carved-out subservice organisations are in the customer data path and cannot be verified from a public document?",
  recall: {
    q: "What is the practical difference between carve-out and inclusive treatment of a subservice organisation, and who absorbs the leftover work?",
    a: "Carve-out describes the subservice organisation but excludes its controls from testing, and lists complementary subservice organisation controls. Inclusive brings its relevant controls inside the description and the auditor's testing, which needs that vendor's participation.\n\nCarve-out shifts assessment onto the reader of your report. Every carved-out vendor that a customer cannot independently verify becomes recurring friction in security review."
  },
  deepDive: "Help me decide, vendor by vendor, whether carving out is cheap or expensive for us, based on where each sits in the data path and how easily a customer can obtain its own report."
},
{
  id: "compliance-27001-clauses-are-the-system",
  track: "compliance", level: "read",
  title: "ISO/IEC 27001:2022 clauses four to ten are a management system, not controls",
  source: "ISO/IEC 27001:2022, clauses 4 to 10 (context, leadership, planning, support, operation, performance evaluation, improvement)",
  idea: "The certifiable part of ISO 27001 is the management system defined in clauses 4 to 10, and Annex A is only the reference control set that the planning clause draws on.",
  why: "Engineers reading ISO 27001 for the first time skip to Annex A because it looks like the technical part. It is not the requirement. The requirements are the numbered clauses: define the scope and interested parties, get documented leadership commitment and a policy, run a risk assessment and risk treatment process, provide resources and competence, operate the thing, evaluate performance through monitoring, internal audit and management review, and drive corrective action and continual improvement.\n\nThat structure is why 27001 costs what it costs. A certification body audits whether the management loop actually runs - whether risk assessments are performed on a defined cadence, whether internal audit found things, whether management review produced decisions. You cannot satisfy that with good engineering alone, and you cannot satisfy it in a fortnight, because it audits the existence of a repeating process over time.",
  failureMode: "A team with genuinely strong technical controls fails a stage two audit on clause 9 and clause 10: no internal audit programme, no management review minutes, no record of corrective actions closed. The controls were fine. The evidence that anyone governs them did not exist, and the finding is a nonconformity that has to be closed before certification.",
  experiment: "Open ISO/IEC 27001:2022 and list clauses 4 to 10 by title. For each, write down the artefact your organisation would hand an auditor tomorrow and who owns it. Count the clauses where the answer is 'nobody' or 'we would have to write it'.",
  reflection: "Which of clauses 4 to 10 has no named owner and no existing artefact in your organisation?",
  recall: {
    q: "In ISO/IEC 27001:2022, what is actually certified, and what role does Annex A play?",
    a: "The information security management system defined by clauses 4 to 10 is what gets certified: context, leadership, planning, support, operation, performance evaluation and improvement. The auditor tests that this loop runs.\n\nAnnex A is a reference set of controls used during risk treatment planning under clause 6. It is an input to the management system, not the thing being certified."
  },
  deepDive: "Map ISO/IEC 27001:2022 clauses 4 to 10 against what my organisation already does, and tell me which clauses would produce nonconformities today."
},
{
  id: "compliance-annex-a-ninety-three",
  track: "compliance", level: "read",
  title: "Annex A is ninety three controls in four themes after the 2022 revision",
  source: "ISO/IEC 27001:2022 Annex A; ISO/IEC 27002:2022 (organisational, people, physical, technological themes)",
  idea: "The 2022 revision restructured Annex A into ninety three controls under four themes, so any checklist, tooling mapping or consultant deck written against the 2013 annex is stale.",
  why: "The 2013 annex had 114 controls in fourteen clauses. The 2022 annex has 93 controls grouped as organisational, people, physical and technological, with several 2013 controls merged and a set of new ones added covering areas like threat intelligence, information security for cloud services, ICT readiness for business continuity, data masking, data leakage prevention, monitoring activities, web filtering and secure coding. ISO/IEC 27002:2022 carries the implementation guidance and the attributes used to slice the set.\n\nThis matters practically because internal control libraries, GRC tool mappings and existing Statements of Applicability were built on the old numbering. A migration is a real piece of work: re-map every control, justify the new ones, and rewrite the SoA. Treating it as a renumbering exercise produces an SoA that does not match the standard being audited.",
  failureMode: "The security tooling exports a control mapping labelled ISO 27001 that is silently against the 2013 annex. Nobody notices until the auditor asks how the new cloud services control and the secure coding control are addressed, and there is no entry for either in the Statement of Applicability because those controls did not exist in the mapping the tool shipped.",
  experiment: "Take whatever control mapping your GRC tool or spreadsheet exports for ISO 27001 and count the controls. If it is 114, it is the 2013 annex. If it is 93, check that the four theme groupings are present. Then list the controls in the 2022 annex that have no corresponding row in your mapping.",
  reflection: "Is your control library against the 2013 or the 2022 annex, and how many 2022 controls are unmapped?",
  recall: {
    q: "How did Annex A change in the 2022 revision, and why does that break existing control mappings?",
    a: "It went from 114 controls in fourteen clauses to 93 controls in four themes: organisational, people, physical and technological. Controls were merged and a set of new ones added, including cloud services, threat intelligence, data masking, monitoring and secure coding.\n\nMappings and Statements of Applicability built on the 2013 numbering therefore have both wrong identifiers and missing rows for the new controls."
  },
  deepDive: "Help me audit our existing ISO control mapping against the 2022 Annex A and produce the list of controls we have no entry for."
},
{
  id: "compliance-statement-of-applicability",
  track: "compliance", level: "model",
  title: "The Statement of Applicability is the document that gets audited",
  source: "ISO/IEC 27001:2022, clause 6.1.3 d) requiring a Statement of Applicability with justification for inclusions and exclusions",
  idea: "Clause 6.1.3 d) requires a document that states, for every Annex A control, whether it applies, why, and whether it is implemented, and that document is where the real workload is measured.",
  why: "The standard requires the SoA to contain the necessary controls, justification for their inclusion, whether they are implemented, and justification for excluding any Annex A control. That is 93 rows, each needing a decision and a defensible reason. Exclusion is legitimate - a company with no physical data centre can exclude parts of the physical theme - but each exclusion has to be argued, not just left blank.\n\nModel it as work: rows times average effort to write the justification and gather the implementation evidence. That is the honest first-year estimate for the control side of certification, on top of the management system clauses. Then note which rows will need refreshing every year because their evidence is periodic rather than structural. The refresh count, not the total, is your recurring cost.",
  failureMode: "The SoA is filled in by one person in a fortnight with justifications copied from a template. At audit, the assessor picks half a dozen rows at random and asks to see the implementation evidence. Two of them describe controls the company does not operate, which is a nonconformity for the SoA being inaccurate rather than for the control being absent.",
  experiment: "Build the SoA skeleton: 93 rows, columns for applicable, justification, implemented, evidence location, owner. Fill in ten rows properly and time yourself. Multiply out to 93 and add your own overhead factor for the harder rows. That is your first-year SoA estimate in engineer-hours; write it down before anyone quotes a number from feel.",
  reflection: "What did ten honest SoA rows cost you in minutes, and what does that extrapolate to across 93?",
  recall: {
    q: "What does ISO/IEC 27001 clause 6.1.3 d) require, and why is it the best proxy for the size of the control workload?",
    a: "It requires a Statement of Applicability listing the necessary controls, the justification for including them, whether they are implemented, and the justification for excluding any Annex A control.\n\nBecause every one of the 93 Annex A controls needs a decision, a written justification and, where included, locatable evidence, the SoA row count times per-row effort is a defensible bottom-up estimate for the control side of certification."
  },
  deepDive: "Help me draft the column structure and a few worked example rows for a Statement of Applicability against the 2022 Annex A, then estimate the total effort from a timed sample."
},
{
  id: "compliance-caiq-answer-once",
  track: "compliance", level: "model",
  title: "CAIQ lets you answer the security questionnaire once",
  source: "Cloud Security Alliance, Consensus Assessments Initiative Questionnaire v4 and Cloud Controls Matrix v4; CSA STAR registry Level 1 self-assessment",
  idea: "The CAIQ is a published standard questionnaire mapped to the Cloud Controls Matrix, and publishing a completed one to the STAR registry converts repeated per-deal sales work into a single maintained artefact.",
  why: "The CAIQ is the question set that accompanies the CCM control domains. A completed CAIQ answers, in the questionnaire's own vocabulary, most of what a bespoke enterprise questionnaire will ask, because the bespoke questionnaires were largely derived from the same control taxonomies. STAR Level 1 is a self-assessment: you publish the completed CAIQ or CCM mapping to a public registry, at no audit fee, and prospects can read it before they send you anything.\n\nThe economics are the point. A bespoke questionnaire is marginal cost per deal, paid in engineer interrupts. A maintained CAIQ is a fixed cost paid once and refreshed periodically. The saving is real only if you actually push back and offer the CAIQ instead of filling in the customer's spreadsheet, which is a sales process change, not an engineering one.",
  failureMode: "The CAIQ gets completed once, published, and then never updated. Eighteen months later it describes an architecture that no longer exists, and a prospect's assessor finds a contradiction between the public CAIQ and the current SOC 2 system description. That contradiction is worse than never having published, because it looks like a control failure rather than a stale document.",
  experiment: "Take the last five security questionnaires your team completed. For each question, mark whether an answer already exists in a completed CAIQ. Report the percentage coverage. If it is high, the case for maintaining a CAIQ and offering it first is arithmetic, not preference.",
  reflection: "What percentage of your last five questionnaires would a maintained CAIQ have answered without an engineer touching it?",
  recall: {
    q: "What is the CAIQ, and what specifically changes in the cost structure of answering security questionnaires when you maintain one?",
    a: "The CAIQ is the Cloud Security Alliance's standard questionnaire aligned to the Cloud Controls Matrix, publishable as a STAR Level 1 self-assessment on a public registry.\n\nIt converts a per-deal marginal cost, paid in engineer interrupts, into a fixed cost paid once and refreshed on a cadence. The saving only materialises if sales offers the CAIQ instead of filling in each customer's own spreadsheet."
  },
  deepDive: "Take our last few completed security questionnaires and help me work out how much of them a maintained CAIQ would have covered, and what the refresh cadence should be."
},
{
  id: "compliance-gdpr-article-28-clauses",
  track: "compliance", level: "read",
  title: "GDPR Article 28 lists the clauses a processor contract must contain",
  source: "Regulation (EU) 2016/679, Article 28(3), subparagraphs (a) to (h)",
  idea: "Article 28(3) enumerates in law what a controller-to-processor contract must say, and several of those enumerated items are engineering commitments rather than legal boilerplate.",
  why: "The article requires the contract to bind the processor to process only on documented instructions, ensure personnel confidentiality, take Article 32 security measures, respect the conditions on engaging sub-processors, assist the controller in responding to data subject rights requests, assist with security, breach notification and impact assessment obligations, delete or return personal data at the end of the service, and make available the information needed to demonstrate compliance including submitting to audits and inspections.\n\nRead that list as a backlog. Assisting with data subject rights means an actual mechanism to find and export one person's data across your stores. Delete or return at end of service means deletion that is verifiable across backups and derived data. Submitting to audits means a process for handling customer audit requests without a director improvising. These are build items with owners, and they appear in the contract whether or not anyone built them.",
  failureMode: "Legal signs a DPA containing the standard Article 28(3) clauses. Two years later a customer exercises the audit right and asks for evidence of deletion after contract termination for a prior tenant. Nobody can demonstrate that the tenant's data left the analytics warehouse and the backup snapshots, because deletion was implemented as a tenant flag flip in the primary database only.",
  experiment: "Read Article 28(3)(a) to (h) - it is short. For each subparagraph, write the name of the system or runbook in your stack that delivers it. Count how many have no named system. Those are the contractual commitments currently backed by nothing.",
  reflection: "Which Article 28(3) obligations does your architecture currently not deliver, and which is closest to being tested by a real customer request?",
  recall: {
    q: "Name three Article 28(3) obligations that are engineering work rather than legal drafting, and say why.",
    a: "Assisting with data subject rights requires a mechanism to locate and export or erase one individual's data across every store. Deletion or return at end of service requires verifiable erasure including derived data and backups. Making information available for audits and inspections requires a repeatable evidence process.\n\nEach one is a system that either exists or does not. The contract asserts them regardless, which is why signing precedes building far more often than it should."
  },
  deepDive: "Go through Article 28(3)(a) to (h) with me and map each obligation to a specific system or runbook in our stack, flagging the ones with no owner."
},
{
  id: "compliance-subprocessor-is-customer-facing",
  track: "compliance", level: "decide",
  title: "Adding a subprocessor is a customer-facing act with a notice period",
  source: "Regulation (EU) 2016/679, Article 28(2) on prior authorisation and the right to object, and Article 28(4) on flow-down of obligations",
  idea: "Under a general written authorisation the processor must inform the controller of intended changes to subprocessors and give them a chance to object, which makes picking a new vendor a contractual event rather than an internal build decision.",
  why: "Article 28(2) says a processor shall not engage another processor without prior specific or general written authorisation, and where the authorisation is general, must inform the controller of intended additions or replacements and give the controller the opportunity to object. Article 28(4) requires the same data protection obligations to be imposed on the sub-processor by contract. In practice a DPA turns this into a published subprocessor list and a notice period, often with a right for the customer to terminate if they object.\n\nSo the true cost of adopting a new SaaS dependency is not just its invoice. It is the notice period before you can route production data through it, the DPA you have to get signed with flow-down terms, the update to a public list, and the possibility that a customer objects and you carry a bespoke exception. A build-versus-buy comparison that omits those is understating buy.",
  failureMode: "An engineering team adopts a hosted vector database or an observability vendor and starts sending tenant data through it the same week. It is not on the published subprocessor list and no notice ran. A customer discovers it during their annual review, and the remediation is a contractual conversation, potentially a breach of the DPA, and an emergency migration off a vendor that was working fine.",
  experiment: "Pull your published subprocessor list. Separately, pull the list of external services that receive customer data from production - check egress destinations or the vendor spend list, not memory. Diff the two. Report the count of services in the second list and not the first.",
  reflection: "How many services receive production customer data without appearing on your published subprocessor list?",
  recall: {
    q: "What does Article 28(2) require when you add a new subprocessor under a general authorisation, and how does that change a build-versus-buy calculation?",
    a: "You must inform the controller of the intended addition or replacement and give them the opportunity to object, and under 28(4) you must impose equivalent data protection obligations on the subprocessor by contract.\n\nBuying therefore carries a notice period before production data can flow, contract work, a public list update, and objection risk. Omitting those from the comparison systematically flatters buy over build."
  },
  deepDive: "Help me build a checklist for adopting a new vendor that touches customer data, covering the subprocessor notice, the flow-down terms, and who signs off."
},
{
  id: "compliance-residency-architecture-cost",
  track: "compliance", level: "model",
  title: "Data residency is an architecture cost driven by Chapter V",
  source: "Regulation (EU) 2016/679, Chapter V, Articles 44 to 49; European Commission Standard Contractual Clauses, Implementing Decision (EU) 2021/914",
  idea: "GDPR restricts transfers rather than mandating residency, but the commercial answer customers accept is a regional deployment, and that is paid in duplicated fixed infrastructure.",
  why: "Chapter V permits transfers on the basis of an adequacy decision, appropriate safeguards such as the 2021 Standard Contractual Clauses with a transfer impact assessment, or a narrow set of derogations. None of it says the data must physically stay in the EU. But the version of that answer a procurement team will accept without a legal argument is an EU region, so residency becomes a de facto product requirement.\n\nCost it as fixed, not marginal. A second region duplicates the control plane, the observability stack, the CI and deployment pipeline targets, the on-call surface, and every singleton service you assumed there would be exactly one of. Your per-tenant marginal cost barely moves; your fixed base steps up. That means residency has a break-even tenant count, and it is computable from your own bill.",
  failureMode: "Residency is promised as a configuration flag. Then the migration finds the singletons: a global metadata service, a single-region managed queue, a licence server, a billing pipeline. Each is a small project. The second region ships two quarters late and the ongoing cost was budgeted as a percentage uplift when it was actually a near-duplicate of the fixed base.",
  experiment: "Split your current cloud bill into two buckets: costs that scale with tenants or usage, and costs that would be duplicated wholesale by standing up a second region. Report the second bucket as an annual number. That is the floor price of a residency commitment, before any engineering time.",
  reflection: "What is the annual duplicated-fixed-cost figure for a second region, and how many EU-resident tenants at your current ACV would cover it?",
  recall: {
    q: "Does GDPR require EU data to stay in the EU, and how should the cost of a residency commitment be modelled?",
    a: "No. Chapter V restricts transfers to third countries, permitting them under an adequacy decision, appropriate safeguards such as the 2021 Standard Contractual Clauses with a transfer impact assessment, or specific derogations. Residency is a commercial answer, not a statutory one.\n\nModel it as a step in fixed cost: a duplicated control plane, observability, pipelines and on-call. Marginal per-tenant cost barely changes, so residency has a break-even tenant count you can compute from your own bill."
  },
  deepDive: "Help me split my cloud bill into duplicated-fixed and per-tenant-marginal so I can compute the break-even tenant count for a second region."
},
{
  id: "compliance-seventy-two-hours-is-engineering",
  track: "compliance", level: "model",
  title: "Seventy two hours is an engineering requirement, not a legal one",
  source: "Regulation (EU) 2016/679, Article 33 (notification to the supervisory authority) and Article 34 (communication to the data subject)",
  idea: "Article 33's seventy two hour clock starts on awareness, which means it specifies a detection, scoping and forensics capability you must have built and staffed before the event.",
  why: "Article 33 requires notification to the supervisory authority without undue delay and, where feasible, not later than seventy two hours after becoming aware of a personal data breach, with the notification describing the nature of the breach, the categories and approximate number of data subjects and records concerned, the likely consequences and the measures taken. Article 34 adds communication to affected individuals where the risk is high.\n\nRead the required content, not the deadline. To describe the categories and approximate numbers within seventy two hours you need log retention long enough to reconstruct the window, audit logs that record which tenant's records were accessed rather than just that a query ran, and someone competent available on a weekend. If your access logs roll at seven days and the intrusion started five weeks ago, you cannot produce that notification content at any speed. The deadline is a specification for retention and log granularity.",
  failureMode: "An incident is detected on a Friday. The team can prove unauthorised access to a service account but cannot determine which tenants' records were read, because application logs record the query but not the rows returned, and object storage access logging was never enabled on the bucket. The seventy two hours are spent building the forensic capability instead of using it.",
  experiment: "Pick one realistic breach scenario in your system. Walk the question 'which tenants and roughly how many records were affected' back through the logs you actually retain today, and write down the first place the trail goes cold. Then check the retention period on that log source.",
  reflection: "In your worst realistic scenario, where does the forensic trail go cold, and what retention change would fix it?",
  recall: {
    q: "What does Article 33 require you to be able to state within seventy two hours, and what does that imply about logging?",
    a: "The nature of the breach, the categories and approximate number of data subjects and records concerned, the likely consequences, and the measures taken or proposed. The clock runs from awareness.\n\nProducing that content requires log retention that covers the whole intrusion window and log granularity that attributes access to tenants and records, not just to services. The deadline is really a retention and granularity specification."
  },
  deepDive: "Take a realistic breach scenario for my architecture and help me trace whether our current logs could answer the Article 33 content requirements inside the window."
},
{
  id: "compliance-questionnaire-cycle-time",
  track: "compliance", level: "model",
  title: "The security questionnaire is a sales gate with a measurable cycle time",
  source: "Cloud Security Alliance CAIQ v4 as the standard question set; your own CRM stage timestamps for receipt and clearance",
  idea: "Measure the days from questionnaire receipt to security clearance and you convert a recurring engineering complaint into a pipeline number that finance and sales already know how to argue about.",
  why: "Security review sits in the deal path like any other stage, and stages have durations. If you timestamp receipt of the questionnaire and clearance by the customer's security team, you get a distribution: median, tail, and the fraction of deals where security review is the longest stage. That number belongs to revenue operations, and once it exists the compliance programme can be argued as cycle-time reduction rather than as overhead.\n\nThe second number is engineer-hours per questionnaire. Multiply by questionnaires per quarter and you have the direct labour cost. Put the two side by side: labour cost, and days added to the sales cycle. A maintained CAIQ, a trust page, and a pre-answered question bank are investments against both, and the payback is computable rather than asserted.",
  failureMode: "The team knows questionnaires are painful but has no measurement, so the ask for headcount or tooling is phrased as 'security reviews are eating us'. That loses to any request with a number attached. Meanwhile nobody notices that the median clearance time doubled after the company moved upmarket, because nothing was being tracked when it changed.",
  experiment: "Ask revenue operations for two timestamps on every deal in the last two quarters that involved a security review: questionnaire received, security cleared. Compute the median and the ninetieth percentile in days. Separately, ask your engineers to estimate hours spent per questionnaire. Report both numbers in one line.",
  reflection: "What is your median and ninetieth percentile questionnaire cycle time, and how many engineer-hours per questionnaire sit behind it?",
  recall: {
    q: "What two numbers turn security questionnaires from a complaint into an investment case, and where do they come from?",
    a: "Cycle time from questionnaire receipt to security clearance, taken from CRM stage timestamps and reported as a median and a tail percentile. And engineer-hours per questionnaire times questionnaires per quarter, which is the direct labour cost.\n\nTogether they let you price a CAIQ, a trust page or a question bank against days removed from the sales cycle and hours returned to engineering."
  },
  deepDive: "Help me define the two CRM timestamps I need for questionnaire cycle time and the exact query to compute the median and ninetieth percentile."
},
{
  id: "compliance-evidence-is-a-workload",
  track: "compliance", level: "model",
  title: "Audit evidence is a recurring engineering workload you can automate",
  source: "ISO/IEC 27001:2022 clause 9 on performance evaluation; AICPA Trust Services Criteria common criteria evidence expectations",
  idea: "Access reviews, change records and log samples recur every period on a fixed cadence, so count the hours they consume before deciding what is worth automating.",
  why: "Both frameworks demand periodic, evidenced activity. ISO clause 9 requires monitoring and measurement, an internal audit programme, and management review, each on a defined cadence with records. The SOC 2 common criteria expect evidence that logical access was reviewed, that changes went through the described process, that monitoring produced alerts and that incidents were handled. Every one of those is a task that happens again next quarter and next year.\n\nThat makes it a maintenance workload with an annual hour count, and maintenance workloads are the right candidates for automation because the payback is linear in periods. The choice is per activity, not global: a quarterly access review across five systems is worth a script; an annual management review is worth a calendar invite and a template. You cannot make that call without the hours, and nobody tracks the hours unless someone asks them to.",
  failureMode: "Evidence collection is absorbed invisibly. Three engineers each lose two days a quarter to screenshots, CSV exports and chasing approvals, and none of it appears in any plan, so it never competes for automation effort. The first visible sign is a missed deadline during audit fieldwork, at which point the response is heroics rather than a build.",
  experiment: "List every recurring compliance activity with its cadence: access reviews, vulnerability scan review, backup restore tests, internal audit, management review, policy attestations. Estimate hours per occurrence and multiply by occurrences per year. Sort descending. The top three lines are your automation candidates, in order.",
  reflection: "What is your total annual evidence-collection hour count, and which three activities account for most of it?",
  recall: {
    q: "Why is compliance evidence a good automation target, and what do you need before choosing what to automate?",
    a: "Because the activities recur on a fixed cadence, so automation pays back linearly in periods rather than once. ISO clause 9 and the SOC 2 common criteria both demand periodic evidenced activity.\n\nYou need hours per occurrence times occurrences per year, per activity, sorted. Without that list, automation effort goes to whatever irritated someone most recently rather than to the largest line."
  },
  deepDive: "Help me build the recurring compliance activity inventory with cadence and hours, and rank the automation candidates by annual hours saved."
},
{
  id: "compliance-vulnerability-management-cost",
  track: "compliance", level: "read",
  title: "Vulnerability management and penetration testing are recurring costs with named controls",
  source: "ISO/IEC 27001:2022 Annex A 8.8, management of technical vulnerabilities; AICPA Trust Services Criteria CC7 series on system operations",
  idea: "Vulnerability management is a named control in both frameworks, which makes the scanning spend and the remediation queue compliance obligations with deadlines rather than discretionary hygiene.",
  why: "Annex A 8.8 requires information about technical vulnerabilities to be obtained, exposure evaluated and appropriate measures taken. The Trust Services Criteria CC7 series covers detection of vulnerabilities and anomalies, evaluation of security events, and response. Neither prescribes a tool or an SLA, but both expect you to have defined your own and then to be able to show that you met it.\n\nThat last part is where the cost lands. Once you write 'critical vulnerabilities remediated within N days' into a policy, the auditor samples against N, and every overdue item is a potential exception. So the policy SLA is a commitment on engineering capacity, and setting it aggressively to look good is a way of buying yourself audit findings. Meanwhile the annual penetration test is a hard cash line and the remediation of its findings is a hard capacity line, both of which recur.",
  failureMode: "The policy says critical findings are remediated in fifteen days because that number looked defensible when it was written. Two years on, the scanner reports hundreds of criticals a month across container base images, the queue is permanently overdue, and the auditor samples ten items of which six breached the stated SLA. The finding is not that the software is insecure; it is that the organisation does not follow its own policy.",
  experiment: "Find your written remediation SLA for critical and high severity findings. Pull the last ninety days of findings and compute the fraction closed inside the stated window. If it is below ninety percent, you have either a capacity problem or a policy that needs rewriting to a number you actually meet.",
  reflection: "What fraction of your critical findings met your own stated remediation SLA in the last ninety days?",
  recall: {
    q: "Which controls make vulnerability management a compliance obligation, and what is the trap in writing the remediation SLA?",
    a: "ISO/IEC 27001:2022 Annex A 8.8 on management of technical vulnerabilities, and the Trust Services Criteria CC7 series on detection, evaluation and response.\n\nNeither dictates the SLA, so you set it - and then the auditor samples against the number you wrote. An aggressive SLA you cannot meet converts a capacity shortfall into an audit exception."
  },
  deepDive: "Help me check whether our written vulnerability remediation SLA matches our actual closure rate, and what a defensible SLA would be given our throughput."
},
{
  id: "compliance-fedramp-declined-on-purpose",
  track: "compliance", level: "decide",
  title: "FedRAMP is a program you decline on purpose",
  source: "FedRAMP authorisation process documentation; NIST SP 800-53 Revision 5 control baselines used for the Low, Moderate and High profiles",
  idea: "Read the baseline control count and the authorisation path, then write down the annual public-sector revenue that would justify pursuing it, so the decision is a recorded threshold rather than a recurring argument.",
  why: "FedRAMP authorisation is built on NIST SP 800-53 Rev 5 control baselines, with the Moderate baseline running to several hundred controls before FedRAMP's own additions and parameter settings. On top of the control work sits an agency sponsor or the programme's authorisation path, a Third Party Assessment Organisation, a System Security Plan and its attachments, continuous monitoring with monthly deliverables, and typically a boundary that is separate from your commercial environment. The precise control counts are published: pull the current baseline workbook and count the rows rather than trusting a number in a blog post.\n\nThe decision is a threshold, not a debate. Estimate the initial cost and the annual continuous-monitoring cost, both in cash and in engineer-years, then divide by your gross margin to get the revenue required to cover it, then divide by your public-sector ACV to get the deal count. Write that deal count on a page. Every future FedRAMP conversation becomes 'do we have that pipeline yet', which takes a minute instead of a quarter.",
  failureMode: "FedRAMP is relitigated every time a federal prospect appears, because no threshold was ever written down. Each cycle burns leadership time, and the answer eventually becomes yes on the basis of a single large opportunity, with no model for the separate environment and the monthly continuous-monitoring deliverables that arrive forever afterwards.",
  experiment: "Download the current FedRAMP Moderate baseline and count the controls. Then write a one-page threshold memo: estimated initial cost, estimated annual continuous monitoring cost, your gross margin, and the resulting annual public-sector revenue and deal count required. Circulate it and get it agreed.",
  reflection: "What annual public-sector revenue would justify FedRAMP for you, and how far is current pipeline from it?",
  recall: {
    q: "What makes FedRAMP structurally more expensive than SOC 2 or ISO 27001, and what should the output of the decision be?",
    a: "It layers a large prescriptive NIST SP 800-53 baseline, a third party assessment organisation, an authorisation path with a sponsor, a System Security Plan, and perpetual monthly continuous monitoring on top of a boundary that is usually a separate environment from commercial.\n\nThe output should be a written revenue and deal-count threshold derived from cost divided by gross margin, so the question is answered by checking pipeline rather than by re-arguing."
  },
  deepDive: "Help me build the FedRAMP threshold memo: what cost components to estimate, and how to turn them into a required public-sector revenue number at our gross margin."
},
{
  id: "compliance-cost-per-deal-per-engineer-week",
  track: "compliance", level: "decide",
  title: "State the cost of compliance per deal and per engineer-week",
  source: "ISO/IEC 27001:2022 and AICPA Trust Services Criteria scope documents for the obligation set; audit fees from finance and tracked evidence hours from your own team",
  idea: "Express the whole compliance programme as two numbers - cost per closed deal and engineer-weeks per year - so it can be argued as an investment with a payback rather than absorbed as background friction.",
  why: "Cash and capacity are the two currencies leadership allocates in, and compliance consumes both, but it is usually reported in neither. The cash side is audit fees, penetration testing, GRC tooling and any external consulting; the audit fee number is owned by finance and is a line in the general ledger, so ask for it by name rather than estimating. The capacity side is the evidence inventory hours plus questionnaire hours plus remediation hours, converted to engineer-weeks.\n\nDivide the cash by closed deals in the same period to get cost per deal. Report the capacity as engineer-weeks per year against your team's total. Now the programme has a denominator. It can be compared to the deals it gates, it can be traded against a headcount request, and an automation proposal can be scored by how many engineer-weeks it returns. Compliance without a denominator always loses the budget conversation, because it is the only line in the meeting that cannot state its own size.",
  failureMode: "The compliance programme is described as necessary and never as expensive, so its true cost is spread across a dozen sprints as unplanned interrupts. When leadership later asks why platform velocity is low, nobody can attribute any part of it to compliance, and the automation investment that would return the capacity is never funded because the capacity was never visible.",
  experiment: "Assemble both numbers this week. From finance, ask for the annual spend on audit fees, penetration testing and GRC tooling; name those lines specifically. From your own tracking, total the annual evidence, questionnaire and remediation hours and convert to engineer-weeks. Divide the cash by deals closed in the same year. Write the two figures in one sentence and take it to your next planning meeting.",
  reflection: "What are your two numbers, and what did the person who owns the budget say when you stated them?",
  recall: {
    q: "What are the two numbers that make a compliance programme arguable, and where does each come from?",
    a: "Cash cost per closed deal - audit fees, penetration testing, GRC tooling and consulting from finance, divided by deals closed in the period. And engineer-weeks per year - evidence, questionnaire and remediation hours from your own tracking.\n\nOne makes compliance comparable to the revenue it gates. The other makes it tradeable against headcount and scoreable for automation. Without a denominator it is the only line in the room that cannot state its size."
  },
  deepDive: "Help me assemble the cost-per-deal and engineer-weeks-per-year figures for our compliance programme, naming exactly which general ledger lines to request from finance."
}
);

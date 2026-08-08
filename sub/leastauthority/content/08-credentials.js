/* Track: Credentials and delegation. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "credentials-where-secrets-live",
  track: "credentials", level: "practice",
  title: "Where a secret lives decides who can read it",
  source: "OWASP Cheat Sheet Series, Secrets Management",
  idea: "Choose a secret's storage by comparing its leak paths, not by comparing how quickly you can wire it up.",
  why: "An environment variable is readable at /proc/<pid>/environ, inherited by every child process the service spawns, captured by container inspection, and serialised by any crash handler or error reporter that dumps the environment. A mounted file drops the inheritance and crash-dump paths but is readable by anything that can exec into the container or read the node's filesystem. A secret fetched from a store at runtime has no at-rest copy in the workload at all, so its leak path collapses to the strength of the identity the workload uses to authenticate, plus whatever the process does with the value once it has it.\n\nThose are three different attacker prerequisites: read a crash report, get exec on a pod, or forge a workload identity. Convenience ranks them in exactly the wrong order, which is why the comparison has to be written down rather than felt.",
  failureMode: "A global exception handler serialises the process environment into the error payload so support can debug faster. Every unhandled 500 ships the tenant's warehouse password to a third-party error tracker, where it is now retained under someone else's deletion policy.",
  experiment: "Pick one service in your runtime. List every secret it consumes and where it comes from. For each, write three lines: who can read it from the running process, who can read it at rest, and who receives it if the process crashes. Count how many are readable by anyone holding pod exec in that namespace.",
  reflection: "Which of your secrets is in the environment purely because that was the fastest thing to write, and what would it cost to move it?",
  recall: {
    q: "Name the distinct leak path that an environment variable has and a mounted file does not.",
    a: "Two of them. Environment variables are inherited by child processes, so anything the service shells out to gets the secret for free. They are also captured by crash handlers and error reporters that dump the process environment.\n\nA mounted file has its own path instead: anyone with exec into the container, or read access to the node filesystem, can cat it."
  },
  deepDive: "Walk through my service's secret inventory with me and rank each one by the attacker prerequisite needed to read it, then tell me which move buys the most reduction for the least work."
},
{
  id: "credentials-kubernetes-secrets",
  track: "credentials", level: "practice",
  title: "Kubernetes Secrets are encoded, not encrypted, by default",
  source: "Kubernetes documentation, Good practices for Kubernetes Secrets",
  idea: "A Secret object is a distribution mechanism, and treating it as a protection mechanism is how tenant credentials end up readable by half the platform.",
  why: "Without an EncryptionConfiguration on the API server, Secret data sits in etcd as base64, which is an encoding and not a cipher. Anyone with a backup of etcd has the plaintext. Managed control planes vary in what they encrypt by default, so this is a thing to verify on your cluster rather than assume.\n\nThe larger problem is access rather than storage. RBAC get or list on secrets in a namespace yields every secret in it. So does the ability to create a Pod in that namespace, because you can mount any secret in the namespace and read it out of your own container. So does node-level access, since the kubelet fetches the secrets for every pod scheduled there. The namespace, not the Secret object, is the real security boundary.",
  failureMode: "A debugging Role grants get on secrets scoped to a namespace, which reads as narrow in review. That namespace also holds the connector credentials for forty tenants, so one on-call engineer's token is a full credential dump.",
  experiment: "For one namespace holding tenant credentials, run kubectl auth can-i get secrets and kubectl auth can-i create pods against every service account bound in it. Count the accounts that come back yes on either. That count is the number of identities holding every secret in the namespace.",
  reflection: "How many of the identities that count returned were ones you would have named before running it?",
  recall: {
    q: "Why does the ability to create a Pod in a namespace amount to read access on every Secret in it?",
    a: "Because a Pod spec can mount any Secret in its own namespace. Create a pod that mounts the secret, exec in, read the file. No RBAC verb on secrets is required.\n\nThe consequence is that namespace membership, not the Secret object, is the boundary. Separate tenants by namespace or cluster, not by Secret name."
  },
  deepDive: "Help me work out whether my tenant credentials belong in Kubernetes Secrets at all, or whether the runtime should fetch them per task from a store using its workload identity.",
  expires: "2028-02-01"
},
{
  id: "credentials-workload-identity",
  track: "credentials", level: "modern",
  title: "Workload identity replaces the long lived key with an attested one",
  source: "SPIFFE and SPIRE specifications (CNCF)",
  idea: "When a workload proves what it is in order to receive a short lived credential, rotation stops being an operation and becomes a property of the system.",
  why: "SPIFFE gives a workload a document, an SVID, that carries a name of the form spiffe://trust-domain/path and is issued only after attestation. A node attestor establishes which machine is asking, and a workload attestor establishes which process on that machine is asking, using facts the process cannot assert about itself: its uid, its binary path, its container labels. The credential is bound to that identity and issued with a TTL measured in minutes.\n\nThe security gain is specific. A stolen SVID expires before an attacker has finished cataloguing what it opens, and there is no static key sitting in a CI variable or a config repo to be stolen in the first place. The gain is also bounded: an attacker who achieves code execution inside the attested workload gets a valid SVID on request. Workload identity kills theft at rest, not code execution.",
  failureMode: "One static API key is generated during a launch, pasted into a CI variable, and copied into three services over two years. Nobody can enumerate the consumers, so it is never rotated, and it remains valid long after the engineer who created it has left.",
  experiment: "Count the credentials in your runtime that have no expiry. Any key that would still work in a year is one. Write the number down, then pick the one with the widest reach and work out what attestation would have to be true for a broker to mint it on demand instead.",
  reflection: "Of your no-expiry credentials, which one has a consumer list you genuinely cannot reconstruct?",
  recall: {
    q: "What does workload identity actually eliminate, and what does it leave untouched?",
    a: "It eliminates the long-lived secret at rest. There is no static key to leak from a config repo, a CI variable or a backup, and any credential that does leak expires in minutes.\n\nIt leaves code execution untouched. An attacker running inside the attested workload passes attestation by definition and can request a fresh credential. Short-lived identity is a containment control, not an intrusion control."
  },
  deepDive: "Sketch what attestation would look like for my agent runtime and tell me honestly what the short TTL does and does not buy me given the process reads customer-authored text.",
  expires: "2028-02-01"
},
{
  id: "credentials-token-audience",
  track: "credentials", level: "practice",
  title: "A token without an audience is a confused deputy waiting to happen",
  source: "IETF RFC 8707, Resource Indicators for OAuth 2.0",
  idea: "If any service will accept a token minted for another service, the weakest service you call holds your authority everywhere.",
  why: "A bearer token is ambient authority. Whoever holds it wields it, and the only thing that narrows where it can be wielded is the audience the issuer stamped on it and the audience check the receiver performs. RFC 8707 gives the client a way to ask for a token scoped to a named resource, so the token the agent hands to a reporting tool is not the token that opens the metadata store.\n\nWithout it you have rebuilt Hardy's confused deputy with modern plumbing. The agent has authority at every internal service. It passes a token to a tool in order to get work done. That tool, or anything that has compromised it, now replays the token elsewhere and the receiving service sees a valid signature and a live expiry and complies.",
  failureMode: "One internal issuer mints tokens with aud set to a single value shared by the whole platform, and every service validates signature and expiry only. A third-party connector the agent calls logs request headers. Anyone with read access to those logs can now read the metadata store as the agent.",
  experiment: "Take one token your runtime hands to a tool. Decode the payload and read the aud claim. Then present that same token to a different internal service in staging. If it is accepted, you do not have audience restriction, you have a signature check.",
  reflection: "Which internal service would you least like to hold your agent's authority, and does it currently hold it?",
  recall: {
    q: "State the failure in one sentence: what does a missing audience check turn every downstream service into?",
    a: "It turns every service you call into a holder of your full authority, because the token it receives is accepted everywhere your identity is accepted.\n\nThe fix is two-sided. The issuer must stamp a specific audience per resource, and every receiver must reject tokens whose audience is not itself. Only one half is worthless."
  },
  deepDive: "Map the tokens flowing through my tool calls and tell me which downstream service could replay one against a service it should never reach."
},
{
  id: "credentials-oauth-failure-modes",
  track: "credentials", level: "practice",
  title: "The OAuth flows that keep failing fail in the same four ways",
  source: "IETF RFC 9700, OAuth 2.0 Security Best Current Practice",
  idea: "Loose redirect URI matching, an unprotected authorisation response, bearer tokens with no sender constraint, and the grants the BCP has ruled out account for most real OAuth incidents.",
  why: "Redirect URIs must be compared by exact string match. Wildcards, prefix matching and open redirectors inside a registered host all give an attacker a place to have the authorisation code delivered. The authorisation response needs CSRF and code-injection protection, which today means PKCE, with state reserved for carrying application context. Bearer tokens are usable by whoever holds them, so a token that is not sender-constrained by mTLS or DPoP is a token that survives interception intact.\n\nThe fourth is the one people are slowest to act on. The BCP rules the implicit grant out and rules the resource owner password credentials grant out entirely. Both still appear in internal tools because they were easy in 2016, and both are worth grepping for before you spend a week on anything subtler.",
  failureMode: "A registered redirect URI of the form https://app.example.com/* passes review because the host is right. An unrelated page on that host has an open redirect, so the authorisation code is delivered to the attacker and exchanged before the user's page finishes loading.",
  experiment: "Pull the client registration for every OAuth client your platform owns and grep the redirect URI lists for wildcards, plain http, and localhost entries in production clients. Then grep your codebase for response_type=token and for grant_type=password. Report both counts.",
  reflection: "Which of the four applies to a client you own, and is it yours to fix or someone else's?",
  recall: {
    q: "Name the four recurring OAuth failure classes without looking.",
    a: "Loose redirect URI matching rather than exact string comparison. An authorisation response with no CSRF or code-injection protection. Bearer tokens with no sender constraint, so interception is sufficient to use them.\n\nAnd continued use of grants the BCP has ruled out, specifically the implicit grant and the resource owner password credentials grant."
  },
  deepDive: "Review the OAuth client configuration I paste against the four failure classes and tell me which one is real for me rather than theoretical.",
  expires: "2028-02-01"
},
{
  id: "credentials-pkce",
  track: "credentials", level: "practice",
  title: "PKCE turns an intercepted authorisation code into nothing",
  source: "IETF RFC 7636, Proof Key for Code Exchange",
  idea: "Binding the code exchange to a fresh secret the client generated for that one request is why the authorisation code flow is now the recommended flow for every client type.",
  why: "The client generates a random code_verifier per authorisation request, sends the SHA-256 hash of it as the code_challenge, and must present the original verifier at the token endpoint. An attacker who steals the code has stolen half of a pair. Without the verifier, the exchange fails, and the verifier never travelled on the channel the code travelled on.\n\nThe plain challenge method offers nothing to an attacker who could see the authorisation request, so S256 is the only method worth registering. PKCE started as a fix for public clients on mobile, where a malicious app can claim a custom URI scheme, but the BCP now recommends it for confidential clients too, because it also blocks code injection into a legitimate client's session.",
  failureMode: "An agent authorises against a tenant's system through a browser flow on a shared runner. The code lands in a redirect that a co-resident process observes in the process list, and without a verifier the attacker exchanges it for a token that is indistinguishable from the real one.",
  experiment: "Capture one authorisation request your platform issues and check for code_challenge and code_challenge_method=S256. Then try the token exchange without a code_verifier and confirm the authorisation server rejects it. A server that accepts the exchange anyway has PKCE in the request and not in the enforcement.",
  reflection: "Did the server actually enforce the verifier, or did your client merely send one?",
  recall: {
    q: "What exactly does the attacker who intercepts an authorisation code lack when PKCE is in use?",
    a: "The code_verifier: the random value the legitimate client generated for that single request and never sent on the redirect channel. Only its hash went out, as the code_challenge.\n\nThe token endpoint recomputes the hash from the presented verifier and rejects the exchange if it does not match the challenge bound to the code. Possession of the code alone is worth nothing."
  },
  deepDive: "Check whether the authorisation servers my runtime talks to enforce the verifier rather than merely accepting the challenge, and tell me how to test it."
},
{
  id: "credentials-actor-claim",
  track: "credentials", level: "practice",
  title: "On behalf of a user and acting as a service are different claims with different audits",
  source: "IETF RFC 8693, OAuth 2.0 Token Exchange",
  idea: "Delegation carries an explicit actor claim so the log can say the agent acted for this user, and collapsing it into impersonation destroys the only record that can answer who was responsible.",
  why: "Token exchange takes a subject token and optionally an actor token and returns a token whose sub identifies the user and whose act claim identifies the party acting for them. Chains nest, so a three-hop delegation is recoverable from the token. Impersonation is the other mode: the issued token simply claims to be the user, with nothing distinguishing it from the user's own session.\n\nThe difference only shows up on the worst day. With delegation, the audit trail says this agent performed this action for this user under this authority, which is a sentence an incident review can act on. With impersonation, the log says the user did it, the user denies it, and you have no mechanism to establish which is true. That is not a logging gap you can patch afterwards, because the information was never minted.",
  failureMode: "The audit log shows a tenant admin bulk-deleted assets at 3am. The admin was asleep. The runtime had exchanged their consent for a token that carried their subject and no actor claim, so nothing in the record distinguishes the agent's action from theirs, and the incident review stalls on a question the data cannot answer.",
  experiment: "Pick one tool your runtime exposes and write two columns: who authorises this call, and whose authority it executes under. Then pull one real audit record for that tool and check whether both columns are recoverable from it. Most runtimes find the second column is missing entirely.",
  reflection: "For the tool you chose, could you prove to a customer that the agent and not their admin did the thing?",
  recall: {
    q: "What does the act claim record that a plain impersonation token cannot?",
    a: "The identity of the party actually performing the action, alongside the sub claim identifying whose authority it runs under. Delegation chains nest, so multiple hops stay recoverable.\n\nAn impersonation token asserts only the user. The audit log attributes the action to a human who did not perform it, and no later analysis can separate the two."
  },
  deepDive: "Take one tool in my runtime and design the token exchange for it so the audit record names both the user and the agent."
},
{
  id: "credentials-unused-permissions",
  track: "credentials", level: "practice",
  title: "Service account sprawl is measured in permissions nobody has used",
  source: "AWS documentation, IAM Access Analyzer unused access findings",
  idea: "The tractable form of least privilege in a live estate is deleting the permissions telemetry shows have never been exercised, on a schedule.",
  why: "Least privilege designed up front loses to reality: nobody knows the true minimum, so the grant is generous and never revisited. Least privilege measured after the fact is tractable, because last-accessed telemetry answers the question directly. Unused access analysis surfaces roles nothing has assumed, credentials nothing has used, and permissions the principal holds but has never exercised.\n\nOne caveat keeps this honest. Last-accessed data covers a trailing tracking window, so a permission exercised once a quarter or once a year can appear unused. Treat findings as a review queue rather than an autodelete list, and prefer denying by policy for a period before removing the grant, so the breakage arrives as an alert rather than a mystery.",
  failureMode: "A connector role accumulated write permissions during a migration three years ago. The migration finished, the permissions stayed, and the agent now runs under a role that can drop tables in a system it only ever reads from.",
  experiment: "Enable unused access analysis on one account and count the findings. Then count how many of the flagged roles you can name an owner for within five minutes. The gap between those two numbers is the actual size of the problem.",
  reflection: "Who is going to run this next quarter, and is that person named or merely implied?",
  recall: {
    q: "Why is measured least privilege more tractable than designed least privilege, and what is the trap in acting on the measurement?",
    a: "Because nobody can state the true minimum in advance, but telemetry can state what was actually used. Deleting the never-exercised permissions converges on the minimum without needing to know it up front.\n\nThe trap is the trailing tracking window. Anything used quarterly or annually reads as unused, so findings are a review queue, and denying before removing turns a future breakage into an alert."
  },
  deepDive: "Design a quarterly unused-permission review for my runtime's service accounts that a person will actually run, including who owns it and what the output is.",
  expires: "2027-11-01"
},
{
  id: "credentials-scoped-broker",
  track: "credentials", level: "practice",
  title: "Broker a scoped credential per task instead of holding the tenant's",
  source: "AWS documentation, STS session policies and session tags",
  idea: "A broker that mints a narrowed, tenant-tagged, short-lived credential for each task keeps the agent process from ever holding authority broader than the work in front of it.",
  why: "A session policy is evaluated as an intersection with the role's policy, so the effective permissions of a session can be far narrower than the role even though the role is shared. Session tags travel with the credential and can be referenced in resource policy conditions, which is how a single role becomes safely multi-tenant: the tag decides which tenant's data the session can touch, and the session cannot alter its own tag.\n\nThis is the control that matters most for an agent runtime specifically. The runtime reads customer-authored text, so you must assume the instruction stream can be steered. What you can still decide is the size of the authority available when it is steered. If the credential in hand was minted for read on one tenant's catalogue for the next five minutes, injected text asking for another tenant's data hits an authorisation failure rather than a judgement call.",
  failureMode: "The runtime holds one role with read and write access to every tenant's storage, because that was simpler than a broker. A tenant pastes a crafted asset description, the agent is talked into reading a path from a different tenant prefix, and nothing in the credential objects because the credential was never told which tenant this task belonged to.",
  experiment: "For one tool call your runtime makes, write the session policy you would attach if the credential were minted per task. Name the actions, the resource, the tenant tag condition and the duration. If you cannot get it under ten lines, the tool surface is too broad to broker and that is the finding.",
  reflection: "Where in your call path does the tenant identity stop being carried and start being assumed?",
  recall: {
    q: "How does a session policy plus a session tag turn a shared role into a per-tenant credential?",
    a: "The session policy intersects with the role policy, so the session's effective permissions are the narrower of the two even though every task assumes the same role. The session tag is set at assume time and cannot be changed by the session.\n\nResource policies condition on the tag, so the credential can only reach the tagged tenant's resources. Broad role, narrow session, per-task blast radius."
  },
  deepDive: "Design the credential broker for my agent runtime: what it takes as input, what it mints, and where in the call path it sits relative to the model loop.",
  expires: "2027-11-01"
},
{
  id: "credentials-rehearsed-rotation",
  track: "credentials", level: "practice",
  title: "Rotation is an operation you have rehearsed or it is a plan you have written",
  source: "NIST SP 800-57 Part 1 Revision 5, Recommendation for Key Management",
  idea: "Cryptoperiods, overlapping validity and a dual-key window are what make rotation routine, and a rotation first attempted during an incident will find the consumer nobody documented.",
  why: "NIST separates the period in which a key may be used to protect new material from the longer period in which it must still be accepted to process old material. That gap is the whole design. A new key is issued and distributed while the old one is still valid, consumers migrate, and only then is the old key retired. Verifiers accept both throughout the overlap, which is what turns rotation from a cutover into a rolling change.\n\nWithout the overlap, rotation is a synchronised outage across every consumer, so it gets deferred, so the cryptoperiod becomes unbounded, so the eventual forced rotation is both urgent and unrehearsed. The failure is never the cryptography. It is the consumer that was configured by hand in 2023 and appears in no manifest.",
  failureMode: "A key is rotated at 2am during a leak response. The API traffic recovers, so the incident closes. Three days later finance notices the nightly reconciliation job has produced no output since the rotation, because it read the old key from a config file nobody had inventoried.",
  experiment: "Rotate one non-production credential end to end today and time it. Record two numbers: how many consumers you had to touch, and how many of them were absent from the documentation you started with. The second number is your rehearsal deficit.",
  reflection: "Which production credential would you least like to rotate right now, and what specifically makes it frightening?",
  recall: {
    q: "What does a dual-key overlap window buy you that a straight cutover does not?",
    a: "It lets consumers migrate independently. Both keys are accepted for the duration, so rotation becomes a rolling change rather than a synchronised outage that every consumer has to attend.\n\nWithout it, rotation is expensive enough to defer indefinitely, and the first real attempt happens under incident pressure against an incomplete consumer list."
  },
  deepDive: "Help me write a rotation rehearsal for the credential in my runtime with the widest reach, including how I discover consumers I do not know about."
},
{
  id: "credentials-log-leakage",
  track: "credentials", level: "practice",
  title: "Credentials leak through logs, traces and error payloads",
  source: "MITRE CWE-532, Insertion of Sensitive Information into Log File",
  idea: "Redaction has to live in the emitter, because every default in your stack copies headers and request objects outward before any log pipeline sees them.",
  why: "Exception objects carry the request that caused them. HTTP client libraries log full requests on retry. Structured loggers serialise whole objects, including the config struct holding the password. Tracing instrumentation captures request metadata onto spans, and spans go to a backend with a different access model to your logs. None of these are bugs. They are the behaviours you asked for when you enabled observability.\n\nScrubbing downstream is a filter, not a control: it catches patterns it knows and misses your platform's own credential format. The reliable move is a type whose string and debug representations are redacted, so the value cannot be printed by accident at any call site. Rust's secrecy crate, a Go type with a String method that returns a fixed marker, a Python class overriding __repr__. The point is that the leak becomes impossible at the point of emission rather than filtered somewhere later.",
  failureMode: "A 500 handler logs the full inbound request, headers included, so every failed tenant call writes an Authorization header into logs that ship to a third-party SaaS. Revocation is now the easy part; getting the value deleted from a vendor's retention tier is a support ticket.",
  experiment: "Search one service's last 24 hours of logs and traces for 'Bearer ', 'authorization', 'apikey' and 'token='. Count the hits. Then check whether your own platform's credential prefix is in the redaction list at all, and add it if it is not.",
  reflection: "If a credential appeared in your logs an hour ago, which systems would you now have to ask to delete it?",
  recall: {
    q: "Why is redacting in the log pipeline insufficient?",
    a: "Because the pipeline only matches patterns it knows, and your platform's own credential format is not one of them. It also runs after the value has already been written, shipped and possibly indexed.\n\nRedaction at the emitter, via a type whose printed representation is a fixed marker, makes the disclosure impossible at the call site rather than filtered afterwards."
  },
  deepDive: "Review how my runtime logs tool calls and errors, and tell me every place a credential could reach a log, a span or an error payload."
},
{
  id: "credentials-context-window",
  track: "credentials", level: "modern",
  title: "The context window is a log you do not control",
  source: "OWASP Top 10 for LLM Applications (2025), LLM02 Sensitive Information Disclosure",
  idea: "A credential placed in model context is a credential disclosed, because context is copied to the provider, into traces, into summarised memory and potentially into the next response.",
  why: "Everything in context has already left your process. It goes to the inference provider, it is written to whatever trace backend you use for debugging, it is frequently compacted into a memory or summary that outlives the session, and it may be echoed into output. Each of those has a different retention policy and a different access list, and none of them were designed as a secret store.\n\nThere is a second property that makes this worse than an ordinary logging leak. Context has no access control. A model instructed to keep a value secret will surrender it under a sufficiently well-crafted instruction in the untrusted text it is also reading, and that text is customer-authored in most real deployments. The design consequence is that tools must never take a credential as a parameter. The model passes a reference, and the runtime substitutes the credential at the call boundary, outside the loop the model can influence.",
  failureMode: "A tool schema declares an api_key parameter so the model can call a tenant's system. The key is now in the prompt, in the trace the team shares while debugging, and in the eval dataset built from production traces. It also appears verbatim the first time a customer-authored asset description asks the assistant to repeat its instructions.",
  experiment: "List every tool schema your runtime exposes and count the parameters that are, or contain, a credential. The target is zero. For any that are not zero, write the one-line change: the model passes a connection reference, the runtime resolves it to a credential after the model has finished choosing.",
  reflection: "For any credential your runtime handles, can you state confidently that it has never entered a context window?",
  recall: {
    q: "Name three places a credential in model context ends up besides the model.",
    a: "The inference provider's request path, your tracing or observability backend, and any summary or long-term memory the runtime compacts the session into. Shared debugging links and eval datasets built from production traces are common fourth and fifth destinations.\n\nAnd because context has no access control, the value can also be surfaced in output by injected text in the documents the model is reading."
  },
  deepDive: "Audit my tool schemas for credential-shaped parameters and show me the reference-plus-substitution pattern applied to the worst one.",
  expires: "2027-08-01"
},
{
  id: "credentials-push-protection",
  track: "credentials", level: "practice",
  title: "Push protection stops the commit, which is not the same as stopping the leak",
  source: "GitHub documentation, secret scanning and push protection",
  idea: "Scanning catches the common patterns at the cheapest possible point and misses everything else, so treat it as a filter on volume while rotation remains the control.",
  why: "Push protection works because many providers issue credentials with distinctive high-entropy prefixes that can be matched with near-zero false positives, and blocking at push time is the only moment a leak is free to fix. That is genuine value and worth having on every repository. It just has a precisely shaped blind spot.\n\nIt does not know your platform's internal credential format unless you wrote a custom pattern for it. It does not see the secret pasted into a ticket, a chat thread, a wiki page or a model context. It does not help with what was pushed before the feature was enabled. And a developer under deadline can bypass the block, which is the intended behaviour of the bypass button. So the invariant has to be stated independently of the tool: any credential that has touched a repository is rotated, whether or not the push was blocked.",
  failureMode: "Push protection is enabled and the dashboard is green, so the team concludes the problem is handled. The platform's own tenant tokens have no distinctive prefix and no custom pattern, and they have been committed to service repositories for a year without a single alert.",
  experiment: "Take one credential format your own platform issues and check whether it would match any existing pattern. If not, write a custom pattern today and run it across your organisation's history. Report the hit count. Any non-zero result is a rotation list, not a backlog item.",
  reflection: "Does your team currently believe scanning is the control, and where did that belief come from?",
  recall: {
    q: "What is push protection good at, and what invariant has to hold regardless of it?",
    a: "It is good at blocking well-known credential formats at the cheapest moment, before the secret exists in history. Keep it on everywhere.\n\nThe invariant that has to hold independently: any credential that has touched a repository gets rotated. Custom formats, prior history, bypasses, and secrets pasted into tickets or chat are all outside what the scanner can see."
  },
  deepDive: "Help me write a custom secret-scanning pattern for my platform's credential format and work out what to do with the historical hits.",
  expires: "2027-08-01"
},
{
  id: "credentials-leak-response",
  track: "credentials", level: "practice",
  title: "When a credential leaks, assume it was used",
  source: "Adkins et al., Building Secure and Reliable Systems (O'Reilly, 2020), crisis management",
  idea: "The order is revoke, then rotate, then hunt for use, and every one of those steps needs to be written down before the day you need it.",
  why: "Teams invert the order because rotation feels productive and revocation causes a visible outage. But the leaked credential is valid until revoked, and credentials exposed publicly are found by automated scanners far faster than by humans. Every minute spent preparing a clean rotation is a minute the attacker still holds access. Containment first, restoration second, investigation third, which is the standard incident structure applied to a credential rather than a service.\n\nThe reason this is a runbook and not a principle is that the hard part is decision latency at 2am. Someone has to know the exact revocation command, what breaks when it runs, and who is authorised to accept that breakage. If those three facts have to be discovered during the incident, the team will stall on them, and stalling is indistinguishable from choosing not to contain.",
  failureMode: "A key is found in a public gist at 2am. Nobody on call knows whether revoking it takes down the ingestion pipeline, so the decision is escalated and waits for morning. The credential stays live for six hours, and the subsequent investigation has to cover all six.",
  experiment: "Pick the credential in your runtime with the widest blast radius and write three lines: the exact command that revokes it, what breaks when you run that command, and the named person who is paged. If you cannot complete all three within ten minutes, you have a plan and not a runbook, and the finding is the gap.",
  reflection: "For your widest-reach credential, who is actually authorised to accept the outage that revoking it causes?",
  recall: {
    q: "State the response order and the reason the natural instinct gets it wrong.",
    a: "Revoke, rotate, then hunt for use. Containment before restoration before investigation.\n\nThe instinct is to rotate first because preparing a clean replacement feels like progress and revocation causes an immediate outage. But the leaked credential works until it is revoked, and automated scanners find publicly exposed credentials in minutes, so every minute of preparation is a minute of attacker access."
  },
  deepDive: "Write the leak-response runbook for my runtime's tenant credentials: revocation command, blast radius, named owner, and the query that shows whether the credential was used."
}
);

/* Track: Untrusted input. Ordered foundational first. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "input-one-bug",
  track: "input", level: "classical",
  title: "Injection is one bug wearing different costumes",
  source: "OWASP Top 10 (2021), A03 Injection",
  idea: "Every injection is untrusted data reaching a position where an interpreter reads it as structure, so the fix is always separating structure from data before the interpreter sees either.",
  why: "An interpreter turns a string into a tree. SQL, a shell, a template engine, an LDAP filter, an XPath evaluator, a log parser and a YAML loader all do the same thing: they scan characters, decide which are syntax and which are content, and build a structure they then execute. Injection happens when attacker-controlled characters land on the syntax side of that decision. The vulnerability is not the quote character, it is that the decision about structure was made after the attacker's text was already in the string.\n\nThat is why the long list of injection names is a taxonomy of interpreters, not a taxonomy of bugs. It also tells you where to look in a system you have not read: find the places that build a string and hand it to something that parses. In an agent runtime those places multiply, because every new tool is a new interpreter and the model is generating the strings.",
  failureMode: "A tenant names an asset with a quote and a boolean clause. Your search layer concatenates the display name into a backend query, the clause is parsed as syntax, and the filter that scoped results to one tenant is now optional. Nothing crashes, no error is logged, and the response looks like a normal result set.",
  experiment: "Take one request path through your service and write down every interpreter the data reaches: the database driver, the search query builder, the templating layer, the log formatter, the downstream HTTP client, the shell in any subprocess. Count them. Most engineers guess three and find seven.",
  reflection: "Which interpreter on that list did you forget existed, and who would notice if data reached it as syntax?",
  recall: {
    q: "Why is escaping described as a mitigation for injection rather than a fix?",
    a: "Escaping still builds one string and lets the interpreter decide what is syntax, so it depends on your escaper agreeing exactly with that interpreter's grammar, in every encoding and context. A fix removes the decision: structure is supplied through a channel the data cannot reach, so no input can change the parse.\n\nThat is why parameterised queries and argument vectors are boundaries and escaping is not."
  },
  deepDive: "Walk one request path through my service and list every interpreter the payload reaches, flagging each place a string is built rather than a structure passed."
},
{
  id: "input-parameterisation",
  track: "input", level: "classical",
  title: "Parameterisation works because the parser sees structure before data",
  source: "OWASP Cheat Sheet Series, SQL Injection Prevention",
  cheat: "Binds cannot cover identifiers, so table names, sort keys and column names need an allowlist of permitted values instead.",
  idea: "A bound parameter cannot change a query's parse tree, which is what makes parameterisation a boundary and escaping only a mitigation.",
  why: "When you prepare a statement, the database parses the SQL text with placeholders in it and produces a plan. Values arrive afterwards, out of band, and are bound into slots in that already-fixed tree. There is no sequence of characters a parameter can contain that alters the tree, because the tree existed before the value did. The ordering is the whole mechanism.\n\nEscaping inverts that order. You transform the value, concatenate it, and the parser decides afterwards. Now correctness depends on your escaper modelling the interpreter's grammar exactly, including its character set handling, its quoting modes and its version. Every historic escape bypass has been a disagreement between those two models. Note also what parameterisation does not cover: identifiers, table names, ORDER BY columns and LIMIT expressions are structure, not data, so they need an allowlist rather than a bind.",
  failureMode: "A team parameterises every value and then builds the sort clause by string concatenation because the driver rejected a placeholder there. A tenant-supplied sort field carries a subquery, and one unparameterised fragment reintroduces the whole bug class the other ninety-nine calls avoided.",
  experiment: "Grep your data access layer for string concatenation or f-string interpolation into SQL. For each hit, classify it as value or identifier. Values must become binds today. Identifiers must become a lookup against a hardcoded set of permitted column names.",
  reflection: "How many of your dynamic identifiers turned out to have a small fixed set of legal values that nobody had written down?",
  recall: {
    q: "What can a bound parameter never do, and what does that leave uncovered?",
    a: "It can never change the parse tree, because the statement was parsed before the value existed. Any character it contains is data by construction.\n\nIt leaves identifiers uncovered: table names, column names, sort keys and other structural fragments cannot be bound, so those need an allowlist of permitted values rather than escaping."
  },
  deepDive: "Review my data access layer and separate the places that interpolate values from the places that interpolate identifiers, since only the first can be fixed with binds."
},
{
  id: "input-argv",
  track: "input", level: "classical",
  title: "Pass an argument vector, never a command string",
  source: "MITRE CWE-78, OS Command Injection",
  idea: "Shell injection exists because a string is handed to a shell that parses it, so exec with an explicit argv removes the parser rather than sanitising its input.",
  why: "There are two families of process-spawning calls. One takes a string and runs it through a shell, which applies word splitting, quote handling, globbing, variable expansion, command substitution, pipelines and redirection before anything executes. The other takes an array where element zero is the program and the rest are arguments delivered straight to execve. In the second family there is no grammar for an argument to escape from, because no grammar is applied.\n\nSo the defence is not filtering metacharacters, it is choosing the second family. Python's subprocess with a list and shell=False, Go's exec.Command, Node's execFile or spawn without a shell, Java's ProcessBuilder. Two residues remain. Arguments beginning with a hyphen can still be read as flags by the target program, which is argument injection rather than shell injection, so use a double hyphen separator or validate the leading character. And the environment you pass is also input.",
  failureMode: "A connector runs a CLI export with the tenant's database name interpolated into a shell string. The name contains a command substitution, the shell evaluates it before the exporter starts, and the substituted command reads the pod's mounted service account token. The exporter then runs normally and the job reports success.",
  experiment: "Grep for shell=True, exec, system, popen, sh -c and backticks across your services. For each hit, decide whether a shell feature is genuinely required. Count how many are there only because someone wanted a pipeline, which a two-process argv pair would give them without a parser.",
  reflection: "Which of your shell calls exists purely for a pipe or a glob, and what would replacing it cost in lines?",
  recall: {
    q: "Why does passing an argument vector eliminate shell injection rather than reduce it?",
    a: "The shell is the interpreter. With an argv there is no shell in the path, so the argument strings are delivered to execve as opaque bytes and no character in them is ever treated as syntax.\n\nThe residual risk is argument injection: an argument that looks like a flag can still change the target program's behaviour, which is a different bug with a different fix."
  },
  deepDive: "Find every process spawn in my codebase that goes through a shell and show me the argv rewrite for each, including where a double hyphen separator is needed."
},
{
  id: "input-template",
  track: "input", level: "modern",
  title: "Server side template injection turns a string into code execution",
  source: "James Kettle, Server-Side Template Injection: RCE for the Modern Web App, Black Hat USA 2015",
  idea: "Concatenating user data into a template makes the template engine your interpreter, and template engines are far more powerful than the developer who reached for one assumed.",
  why: "A template engine is a small language with variable lookup, attribute traversal, method calls and filters. Most engines expose the host language's object graph, so from any reachable object you can usually walk to a class, then to its base classes, then to a subclass that opens files or spawns processes. That is why the classic Jinja proof of concept is a chain of attribute accesses rather than an exploit payload: the power was already there.\n\nThe bug appears when a template is built from user input rather than rendered with user input as data. Rendering a fixed template with a context dictionary is safe. Passing a user string to the template compiler is handing over an interpreter. The same shape now appears in agent systems, where a prompt template assembled by string concatenation from retrieved text is the identical mistake one abstraction layer up.",
  failureMode: "A notification feature lets tenants customise an email subject line with placeholders. The subject is compiled as a template so the placeholders resolve. A tenant submits an attribute traversal expression, and the rendering worker, which holds the platform's SMTP and storage credentials, executes it.",
  experiment: "Search for any call that compiles a template from a variable rather than from a file or a constant. In your agent code, do the same for prompt assembly: find every place retrieved or tenant text is concatenated into a template string rather than passed as a parameter. Write down the count for both.",
  reflection: "Where does your product deliberately let a customer supply a template, and what identity does that render run under?",
  recall: {
    q: "What is the difference between rendering a template with user data and building a template from user data?",
    a: "Rendering with user data passes the input as a value into a fixed template, so it can only ever be substituted into a slot. Building from user data compiles the input, which makes it program text for a language with attribute traversal and method calls.\n\nBecause template engines usually expose the host object graph, that second case is normally full code execution, not just information disclosure."
  },
  deepDive: "Audit where my service compiles templates from variables, including LLM prompt assembly, and show me how to move each to parameterised rendering.",
  expires: "2028-02-01"
},
{
  id: "input-desync",
  track: "input", level: "modern",
  title: "Header injection and request smuggling exploit two parsers disagreeing",
  source: "James Kettle, HTTP Desync Attacks: Request Smuggling Reborn (PortSwigger, 2019)",
  idea: "When a front end and a back end disagree about where a message ends, one attacker request becomes a prefix on somebody else's, which is the general shape of every parser mismatch.",
  why: "HTTP gives two ways to state a body length, Content-Length and Transfer-Encoding, and it gives implementations room to differ on precedence, on obfuscated encoding values and on malformed header lines. If the proxy believes a request ends at byte 40 and the origin believes it ends at byte 35, the trailing five bytes sit in the origin's buffer and get prepended to whatever request arrives next on that reused connection. The victim's request is now attacker-controlled at its start, which means the attacker chooses the victim's path, headers and authentication context.\n\nHeader injection through a CRLF in a value is the same fault at smaller scale: a value crosses into the position where header names live. Both cases share a precondition worth generalising. Any time two components parse the same bytes and only one of them makes the security decision, the decision is only as sound as their agreement.",
  failureMode: "Your gateway strips an internal tenant-identity header before forwarding, and the origin trusts it. A desync lets an attacker prefix a victim connection with their own request line and their own tenant header, so a request that the gateway never inspected arrives at the origin wearing an identity the gateway would have rejected.",
  experiment: "Draw the chain of things that parse HTTP in front of one of your services: CDN, load balancer, ingress controller, service mesh sidecar, application server. Count the distinct implementations. Then check which of them your identity headers are trusted from, and whether the origin would notice if that header arrived from elsewhere.",
  reflection: "How many separate HTTP implementations sit between the internet and your agent runtime, and does any security decision depend on all of them agreeing?",
  recall: {
    q: "What is the general condition that request smuggling is a specific instance of?",
    a: "Two components parse the same bytes with different grammars, and a security decision is made by one and enforced by the other. The gap between the two parses is the exploitable surface.\n\nSmuggling is the version where the disagreement is about message boundaries on a reused connection, which lets one client's bytes become a prefix on another client's request."
  },
  deepDive: "Map every component that parses HTTP in front of my service and tell me which security decisions depend on those parsers agreeing.",
  expires: "2028-02-01"
},
{
  id: "input-log-sink",
  track: "input", level: "practice",
  title: "A log line is an injection sink for whoever reads it next",
  source: "MITRE CWE-117, Improper Output Neutralization for Logs",
  idea: "Logs are consumed by parsers, dashboards, alert rules and increasingly by agents, so unescaped input written to a log is unescaped input delivered to all of them.",
  why: "Writing to a log feels like output, which is why it is rarely treated as a sink. It is not output, it is input to the next system. A newline in a user-controlled field forges a log entry. Delimiter characters break field alignment in a structured parser and shift values into the wrong columns. Control sequences reach a terminal when an engineer greps the file. The Log4Shell class went further and showed that a formatter can itself be an interpreter with network reach.\n\nThe reason this belongs in an agent runtime's threat model is the newest consumer. When an on-call agent reads logs to triage an incident, a log line is model context, and tenant-authored text inside it is untrusted instruction arriving through a channel nobody classified as an input. Log the field as a quoted value in a structured format, encode control characters, and treat a log line the same way you would treat a rendered page.",
  failureMode: "A tenant sets an asset description containing a newline and a forged line that mimics your audit format, claiming an admin approved an export. The line lands in the audit index and in the incident agent's context window. A human reviewer reading the dashboard sees two entries and cannot tell which one your code wrote.",
  experiment: "Write a tenant-controlled string containing a newline, a tab and your log format's delimiter into a non-production record, then look at how it renders in your log store and in any dashboard built on it. Check whether it produced one entry or two. If an agent reads these logs, paste the resulting line into its context and see what it does.",
  reflection: "Who and what reads your logs today, and which of those consumers would act on a forged line?",
  recall: {
    q: "Why does log injection matter more once an agent reads the logs?",
    a: "A log line consumed by a model is context, and text inside it is indistinguishable from instruction. Attacker-controlled fields in a log therefore become a write primitive into the agent's prompt through a channel nobody registered as an input surface.\n\nThe classical harms remain: forged audit entries, broken structured parsing, and control sequences reaching an engineer's terminal."
  },
  deepDive: "Show me every place my services log a tenant-controlled field unquoted, and tell me which downstream consumer would be misled first.",
  expires: "2027-12-01"
},
{
  id: "input-parse-dont-validate",
  track: "input", level: "modern",
  title: "Parse, do not validate",
  source: "Alexis King, Parse, Don't Validate (2019)",
  idea: "Convert untrusted input into a type that cannot represent the invalid case, so the check happens once at the edge instead of being re-asserted at every use.",
  why: "A validator takes a value, decides it is acceptable, and returns nothing. The knowledge it produced is thrown away, so every downstream function either re-checks or trusts. A parser takes the same value and returns a narrower type, which carries the proof in the type system. Downstream code that receives a TenantId rather than a string cannot be passed an arbitrary string without going through the parser again.\n\nThe security consequence is about drift, not elegance. Validated-then-trusted code accumulates paths that skip the check: a new caller, a retry that reconstructs the value from a queue, a background job that reads the raw field from the database. Each is a small change that nobody reviews as a security change, because the check still exists somewhere. Parsing at the boundary makes the skipped path a type error rather than a vulnerability, which moves detection from production to compile time.",
  failureMode: "Your HTTP handler validates that a path segment is a UUID before looking up a tenant. Six months later an event consumer processes the same identifier off a queue and never validates, because the value was already checked once, upstream, in a service the consumer's author never read.",
  experiment: "Pick the most security-relevant identifier in your system, probably the tenant identifier. Grep for its type. If it is a bare string, count the functions that accept it and the number of distinct places it is validated. Both numbers should make the argument for you.",
  reflection: "What would it cost to make your tenant identifier a distinct type with one constructor, and which existing call sites would stop compiling?",
  recall: {
    q: "What does a parser return that a validator does not, and why does that matter for security?",
    a: "A parser returns a narrower type that encodes the check in its existence, whereas a validator returns nothing and leaves the caller holding the original wide type. The proof survives the call.\n\nThat matters because unchecked paths become type errors instead of runtime vulnerabilities, so a new caller that skips the boundary cannot compile rather than silently trusting."
  },
  deepDive: "Take my tenant identifier and show me the smallest refactor that turns it into a parsed type with a single construction point."
},
{
  id: "input-parser-differential",
  track: "input", level: "modern",
  title: "Parser differentials are the root of format confusion",
  source: "Sassaman, Patterson, Bratus and Locasto, Security Applications of Formal Language Theory, IEEE Systems Journal, 2013",
  idea: "Two implementations of the same format will disagree on edge inputs, so any security decision made by one parser and acted on by another is only as sound as that agreement.",
  why: "Formats specified in prose rather than grammar get implemented from examples, and implementations differ at the edges: duplicate keys in a JSON object, integer overflow in a length field, trailing bytes after a structure ends, comments where the spec is silent, Unicode escapes that one library resolves and another does not. Each difference is harmless until two implementations sit on a path where one authorises and the other executes.\n\nThe language-theoretic framing is the useful part. Recognition should be a single step performed by one component, on the full input, before any decision, and everything downstream should receive the recognised structure rather than the original bytes. Systems that re-parse the same bytes at several layers are betting on agreement they have never tested. This is exactly the JWT and policy-document failure pattern: a gateway parses a token, a service parses it again with a different library, and a duplicate claim resolves differently in the two.",
  failureMode: "Your authorisation service reads the first occurrence of a duplicate JSON key and denies the request based on it. Your application reads the last occurrence and acts on the other value. One document, two truths, and the deny decision applied to a field nobody executed.",
  experiment: "Take one document your system parses in more than one place, an authorisation policy or a JWT payload. Feed the same bytes with a duplicate key to both libraries and print what each returns. If both give the same answer, add a trailing byte and a big integer and try again.",
  reflection: "Which document in your stack is parsed by more than one library, and have you ever tested that they agree?",
  recall: {
    q: "State the condition that turns a parser difference into a vulnerability.",
    a: "One parser makes a security decision and a different parser produces the value that is acted upon, from the same input bytes. Any disagreement between them is then a gap between what was authorised and what was executed.\n\nThe structural remedy is to recognise input once, in one component, and pass the recognised structure downstream rather than the raw bytes."
  },
  deepDive: "Find every document in my system that gets parsed by two different libraries and help me build a differential test for each pair."
},
{
  id: "input-deserialisation",
  track: "input", level: "modern",
  title: "Deserialisation hands the attacker your object graph",
  source: "Muñoz and Mirosh, Friday the 13th: JSON Attacks, Black Hat USA 2017",
  idea: "Any format that can name types and invoke constructors is a program, and gadget chains already present in your dependency tree turn that program into execution.",
  why: "Polymorphic deserialisation exists so a serialised object can be restored to its original class. To do that, the format must carry a type name and the library must instantiate it, run its setters and often call lifecycle hooks. That is a small scripting language whose vocabulary is every class on your classpath. The attacker does not need to ship code, only to name classes you already depend on and chain their side effects until something loads a remote resource or spawns a process. Muñoz and Mirosh showed this is not a Java serialisation quirk: the same shape appears in JSON and XML libraries across .NET and the JVM whenever type information is honoured.\n\nThe practical rule is that the vocabulary is the vulnerability. Disable polymorphic type handling, deserialise into a fixed concrete target type rather than a general object, and if you truly need polymorphism, use a closed allowlist of permitted types rather than a denylist of known gadgets. Denylists of gadget classes have been bypassed with every new release of a popular library.",
  failureMode: "A cache layer stores workflow state as a typed serialised blob. An attacker who can write one cache key, or who reaches the queue that feeds it, supplies a type name from a library your framework pulled in transitively. Restoring the state calls a setter that opens a URL, and the worker deserialising it holds tenant credentials.",
  experiment: "Grep for polymorphic type handling in your serialisers: enableDefaultTyping, TypeNameHandling, ObjectInputStream, yaml.load without a safe loader, pickle. For each hit, write down where the bytes come from and whether any path lets an untrusted party influence them.",
  reflection: "Which of your deserialisation sites reads bytes that a tenant, a queue or a cache could influence, and could it deserialise into a fixed type instead?",
  recall: {
    q: "Why is blocking known gadget classes a losing strategy for deserialisation?",
    a: "The attacker's vocabulary is every type reachable on your classpath, and that set changes with every dependency upgrade, so a denylist is a bet that you enumerated a set you do not control. New gadget chains are published faster than blocklists are updated.\n\nThe fix is to remove the capability: deserialise into a fixed concrete type, or permit only an explicit allowlist of types."
  },
  deepDive: "Audit my serialisation configuration for polymorphic type handling and show me which sites can be pinned to a concrete target type.",
  expires: "2028-02-01"
},
{
  id: "input-ssrf-metadata",
  track: "input", level: "modern",
  title: "SSRF became critical when the metadata endpoint held credentials",
  source: "AWS documentation, Instance Metadata Service Version 2 (IMDSv2)",
  idea: "Server side request forgery graduated from a curiosity to a credential theft primitive because the cloud put an unauthenticated secret vending machine on a link-local address.",
  why: "SSRF was long treated as an internal port scanner: mildly useful, hard to monetise. Then every major cloud placed an instance metadata service on 169.254.169.254, reachable over plain HTTP with no authentication, returning temporary role credentials to anything running on the host. Any function that fetches a URL for a user became a credential read. IMDSv2 changes the shape by requiring a PUT to obtain a session token and setting a low IP TTL on responses, which defeats the plain GET that most SSRF primitives give an attacker, but only where it is enforced rather than merely available.\n\nThe defence has two independent parts and both are needed. Enforce IMDSv2 as required, or better, give workloads identity through a projected service account token so there is no host credential endpoint to reach. Separately, treat every outbound fetch as a request that needs its own authorisation: resolve the hostname yourself, check the resolved address against an allowlist of permitted destinations, then connect to that address, because checking the hostname and then handing the URL to a client re-resolves it and loses the check.",
  failureMode: "Your metadata platform lets a tenant register a webhook or a schema URL. The fetcher runs in a pod on a node whose metadata service still accepts IMDSv1. A tenant points the URL at the metadata address, receives the node role's credentials in the response body your product helpfully shows them, and now holds cloud access scoped far wider than their tenant.",
  experiment: "List every feature that fetches a URL a user supplied: webhooks, avatar imports, schema references, connector endpoints, and any agent tool that browses. For each, check whether IMDSv2 is set to required on the hosts it runs on, and whether the destination check happens against the resolved IP or the hostname string.",
  reflection: "Which of your user-supplied-URL features could reach a link-local address today, and which team owns the answer?",
  recall: {
    q: "What is a DNS rebinding bypass of an SSRF allowlist, and what stops it?",
    a: "The application resolves the hostname, sees a permitted public address, then passes the URL to an HTTP client that resolves it again and gets an internal address the second time. The check and the connection used different resolutions.\n\nThe fix is to resolve once and connect to the validated IP address directly, rejecting redirects to unvalidated destinations, rather than validating a string and letting the client resolve it."
  },
  deepDive: "Inventory every outbound fetch my platform makes on a user-supplied URL and tell me which ones validate the resolved address rather than the hostname.",
  expires: "2028-02-01"
},
{
  id: "input-canonicalise",
  track: "input", level: "classical",
  title: "Canonicalise first, then check, or you check the wrong string",
  source: "MITRE CWE-22, Improper Limitation of a Pathname to a Restricted Directory",
  cheat: "Resolve the path first, then check containment against the base, because a check before resolution tests the wrong string.",
  idea: "Path traversal survives because validation runs on a representation the filesystem later resolves differently, so the order of the two operations is the entire defence.",
  why: "A path is not a name, it is an expression the operating system evaluates: dot-dot segments, symlinks, mount points, trailing slashes, case folding on some filesystems, alternate encodings of the separator, and on Windows short names and device names. Any check performed before that evaluation is a check on one of many strings that all denote the same file. Resolve first with the platform's real resolver, then compare the result against the base directory with a prefix check that respects segment boundaries, then open the resolved path.\n\nEven that has a race, because a symlink can be swapped between the resolve and the open. Where it matters, hold the directory open and use openat with the no-follow flag, or do the work inside a container whose filesystem does not contain anything worth reaching. And note that the same principle generalises well beyond paths: URLs, hostnames, email addresses and identifiers all have multiple representations, and any check that runs before normalisation is checking a string the consumer will never see.",
  failureMode: "An export feature joins a tenant-supplied filename onto a base directory and rejects anything containing dot-dot. The tenant supplies a URL-encoded separator that the web framework decodes after the check, or a symlink created by an earlier upload, and the resolved path lands outside the base. The service reads a config file and returns it as an export.",
  experiment: "Find every place your code joins user input into a filesystem path. For each, check the order: is the resolve call before or after the safety check? Write a test that passes a dot-dot sequence, a URL-encoded separator and a symlink, and confirm all three are rejected.",
  reflection: "Where in your stack does a check run on a string that something downstream will normalise differently?",
  recall: {
    q: "Why must canonicalisation precede validation rather than follow it?",
    a: "The filesystem resolves the path when it opens the file, and many distinct strings resolve to the same file. Validating before resolution checks a representation that is not the one acted upon.\n\nResolving first collapses all representations to one, so the prefix check is made against the same path the open call will use. The remaining gap is the race between resolve and open, which needs openat with no-follow or a filesystem with nothing worth reaching."
  },
  deepDive: "Show me every path join on user input in my codebase and whether the containment check runs before or after resolution."
},
{
  id: "input-unicode",
  track: "input", level: "modern",
  title: "Invisible Unicode changes what a reviewer sees",
  source: "Boucher and Anderson, Trojan Source: Invisible Vulnerabilities (USENIX Security 2023)",
  idea: "Bidirectional overrides, homoglyphs and zero width characters make rendered text differ from parsed text, which breaks human review as a security control.",
  why: "Compilers and interpreters read code points in logical order. Editors and review interfaces render them through the Unicode bidirectional algorithm, which reorders runs of text according to embedded control characters. Insert a right-to-left override inside a comment and the reviewer sees a line whose visible order is not the order the compiler consumes, so a return or a conditional can appear to be inside a comment while being executed. Homoglyphs do the same to identifiers: two functions whose names render identically resolve to different symbols. Zero width characters split tokens that look joined.\n\nThe consequence for a security programme is specific. Human review is a control you rely on for merges, for policy documents, for approving an agent's proposed action. That control assumes rendered text equals parsed text, and Unicode breaks the assumption at the presentation layer where no scanner is looking. The defence is mechanical: reject or escape bidirectional control characters and unexpected scripts at ingestion, and make your review tooling render them visibly rather than faithfully.",
  failureMode: "An approval prompt shows an engineer a diff, or shows an operator an agent's proposed tool call, containing a bidirectional override. The rendered string reads as a read-only query against a test dataset. The bytes that execute say something else. The approval is recorded, correctly, as human-authorised.",
  experiment: "Scan your repository and your tenant-authored content store for characters in the ranges U+202A to U+202E, U+2066 to U+2069, and U+200B to U+200D. Count the hits. Then check whether your CI or your linter would have failed on any of them.",
  reflection: "Where does a human approval in your system depend on rendered text matching parsed text, and what enforces that today?",
  recall: {
    q: "What security control does Trojan Source attack, and why is it not a compiler bug?",
    a: "It attacks human review. The compiler and the editor both behave to specification: one reads logical code point order, the other applies the bidirectional algorithm for display, and the two orders differ.\n\nBecause both layers are correct, the fix belongs at ingestion and in tooling: reject or visibly escape bidirectional controls and unexpected scripts rather than expecting reviewers to spot them."
  },
  deepDive: "Write me a check that fails CI on bidirectional control characters and mixed-script identifiers in code and in tenant-authored content.",
  expires: "2028-02-01"
},
{
  id: "input-decompression",
  track: "input", level: "practice",
  title: "Decompression turns a small request into an outage",
  source: "David Fifield, A Better Zip Bomb (USENIX WOOT 2019)",
  idea: "Every expansion step needs a hard output limit and a nesting limit enforced during decompression, because inspecting the compressed size proves nothing about the output.",
  why: "Compression ratios are unbounded in practice. Fifield's construction reaches roughly twenty-eight million to one in a single non-recursive layer by overlapping files so that one stream of deflate output is shared across many entries, which also defeats the common defence of checking the declared uncompressed size in the archive headers. Recursive archives and XML entity expansion get similar leverage by different means. The attacker's cost is a few tens of kilobytes; yours is memory, disk and a stalled worker.\n\nThe only reliable control is a limit on the output side, checked as bytes are produced, not before. Stream through a counting reader and abort at a threshold. Bound nesting depth explicitly. Bound wall clock time and CPU on the whole operation. Give the decompressing worker its own memory limit and its own process so that killing it does not take the request path with it. This is a denial-of-service class rather than a confidentiality class, which is precisely why it gets deferred: it fails an availability objective that nobody wrote down.",
  failureMode: "A tenant uploads a forty kilobyte archive to a metadata import endpoint. The importer decompresses in memory to size the payload, the pod's memory limit is hit, the pod is OOM killed, and the queue redelivers the same message to the next pod. One upload rolls through the whole worker pool until someone finds and deletes the message.",
  experiment: "Send a zip bomb to a non-production instance of any endpoint that accepts an archive, an upload or a gzip-encoded body. Watch memory on the worker. Check whether the request is refused at a byte threshold, or whether the process dies. Then check whether the message is redelivered.",
  reflection: "Which of your ingestion paths expands input, and does any of them enforce a limit on output bytes rather than input bytes?",
  recall: {
    q: "Why is checking an archive's declared uncompressed size an inadequate defence?",
    a: "The declared size is attacker-controlled metadata, and overlapping constructions produce far more output than the headers admit while remaining a valid archive. The number you check is not the number you will produce.\n\nThe control has to sit on the output side: count bytes as they are produced and abort at a hard threshold, with a separate nesting depth limit and a memory-bounded worker."
  },
  deepDive: "List every place my services decompress or expand input and tell me which ones enforce an output byte limit during streaming."
},
{
  id: "input-content-sniffing",
  track: "input", level: "classical",
  title: "Content sniffing lets the receiver decide what your data is",
  source: "Barth, Caballero and Song, Secure Content Sniffing for Web Browsers, IEEE Symposium on Security and Privacy, 2009",
  idea: "When the declared type and the sniffed type disagree, the consumer's guess wins, so type confusion is a decision made outside your code.",
  why: "Consumers sniff because publishers mislabel. A browser that trusted every Content-Type would render broken sites, so it inspects leading bytes and sometimes overrides the header. That heuristic is an attack surface: a file that is a valid image by its declared type and a valid script by its first bytes becomes whichever the consumer decides, and the decision happens on the consumer's side of the trust boundary. Barth and colleagues showed the trade-off is real and quantifiable, and the settled answer was to give servers a way to opt out rather than to make every publisher correct.\n\nSo the controls are: send an accurate Content-Type, send X-Content-Type-Options nosniff, serve user-uploaded files from a separate origin so a misinterpretation cannot reach your session cookies, and force a download disposition where rendering is not needed. The general principle outlives HTTP. Any time you hand bytes to a consumer that infers their type, you have delegated a security decision, and the same applies to a tool result whose format an agent infers from its content.",
  failureMode: "Your platform stores tenant-uploaded documentation attachments and serves them from the app domain with a type derived from the file extension. A tenant uploads a polyglot that a browser sniffs as HTML. Another tenant's user opens it, script runs on your origin, and the session it reads belongs to your product rather than to the uploader.",
  experiment: "Fetch one user-uploaded file from your product and read the response headers. Check three things: is Content-Type accurate, is nosniff present, and is the host a different origin from your application. Any missing item is a finding you can file today.",
  reflection: "Which origin serves your user-uploaded content, and what would running as that origin give an attacker?",
  recall: {
    q: "Why is serving uploads from a separate origin a stronger control than getting the Content-Type right?",
    a: "Correct headers depend on your labelling being right and the consumer honouring it, and consumers sniff precisely because labels are often wrong. A separate origin removes the value of being misinterpreted: script that runs there has no access to your application's cookies or same-origin data.\n\nHeaders such as nosniff and a download disposition are still worth setting, but they narrow the guess rather than removing the consequence."
  },
  deepDive: "Review how my platform serves tenant-uploaded files and tell me what an attacker gains from a sniffed type on that origin."
},
{
  id: "input-allowlist",
  track: "input", level: "classical",
  title: "Enumerating badness loses, so allowlist",
  source: "Marcus Ranum, The Six Dumbest Ideas in Computer Security (2005)",
  idea: "A denylist is a bet that you have imagined every bad input, and the set of bad inputs is unbounded while the set of good ones is usually small and writable.",
  why: "This is a cardinality argument, not a slogan. The set of malicious inputs is generated by an adversary who reads your filter, and it grows with every encoding, every parser quirk and every new library version. The set of acceptable inputs is generated by your product requirements, and someone can usually write it down in an afternoon. Betting on the enumerable set is the only bet with a bounded maintenance cost, and it fails closed: an input you did not anticipate is rejected rather than admitted.\n\nThe honest part is where allowlists are hard, because handing someone the slogan without this is how it gets ignored. Free text fields have no small legal set, so they need parameterisation at the sink instead. Composed grammars, URLs and email addresses among them, have legal sets that are difficult to specify correctly. Allowlists impose a real product cost: someone must own additions, and if that queue is slow, teams route around the control. Choose allowlists for routing, file access, network destinations, deserialisation types and identifiers, and choose structural separation for the rest.",
  failureMode: "An egress filter blocks a list of known-bad domains for your agent's browsing tool. The model, following instructions embedded in a retrieved page, sends tenant data to a domain registered that morning. The filter records an allow, because the domain was not on the list of things somebody had already imagined.",
  experiment: "Pick one control in your stack that is currently a denylist, most likely egress filtering or a content filter. Write the allowlist version: enumerate the destinations or values your system actually needs. Count the entries. If the number is under fifty, you have just costed the migration.",
  reflection: "For the denylist you looked at, who would own the request queue for additions once it became an allowlist?",
  recall: {
    q: "Give the cardinality argument for allowlists in one line, and name the case where it does not apply.",
    a: "The bad set is adversarially generated and unbounded; the good set is requirements-generated and usually small and enumerable, so only the second is maintainable and it fails closed.\n\nIt does not apply to genuinely open-ended input such as free text, where there is no small legal set. Those need structural separation at the sink, parameterisation or an argument vector, rather than any list."
  },
  deepDive: "Take my agent runtime's egress controls and help me write the allowlist version, including who owns additions."
},
{
  id: "input-weird-machines",
  track: "input", level: "classical",
  title: "Every exploit is input programming a machine you did not know you built",
  source: "Bratus, Locasto, Patterson, Sassaman and Shubina, Exploit Programming: From Buffer Overflows to Weird Machines and Theory of Computation, USENIX ;login: 2011",
  idea: "Data becomes instruction wherever an interpreter exists, so the security question for any new component is which interpreter it exposes and to whom.",
  why: "The weird machine framing says that a program under unexpected input is not simply malfunctioning, it is executing a different computation whose instruction set is made of the program's own state transitions. Exploitation is programming that machine. A buffer overflow is one instruction set, a gadget chain is another, a parser differential is another. Once you see it this way, the interesting question stops being which characters to filter and becomes which computation your component makes available and who can drive it.\n\nThis is the bridge to the agent material and the reason it belongs at the end of the track. A language model with tools is the most permissive interpreter anyone has ever put in a production request path: its instruction set is natural language, its input includes every document it retrieves, and its effects are the tools you registered. Every technique in this track was a special case of data reaching a position where something read it as structure. Prompt injection is the general case, with a parser you cannot specify and a grammar nobody can write down.",
  failureMode: "A team ships a tool that lets the agent read tenant documents and a second tool that posts to a webhook. Neither is a vulnerability. Together with retrieved text they compose an instruction set that reads data under the runtime's authority and emits it, and no review caught it because reviews were scoped to one tool at a time.",
  experiment: "Write two columns for one tool your runtime exposes: who authorises this call, and whose authority it executes under. If the columns differ, you have found a confused deputy. This is a note rather than a command, and it should take about ten minutes per tool.",
  reflection: "For the tool you picked, what computation does the combination of its inputs and effects make available that you did not intend to offer?",
  recall: {
    q: "Restate prompt injection in the vocabulary of this track.",
    a: "It is data reaching a position where an interpreter reads it as structure, which is the same fault as SQL injection or template injection. The difference is that the interpreter is a language model, its grammar cannot be specified, and there is no parameterised form that separates instruction from data.\n\nThat is why the defence has to move from sanitising input to constraining authority and effects, which is where the next track starts."
  },
  deepDive: "For each tool in my agent runtime, tell me which interpreter it exposes, who can drive it, and what authority it executes under."
}
);

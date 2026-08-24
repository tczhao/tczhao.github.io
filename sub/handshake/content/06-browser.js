/* Track: The browser as a network client. Ordered foundational first.
 *
 * The framing is deliberate. Most material on this ground treats it as web
 * application security, which puts the emphasis on the application. Read as
 * network security it is simpler and more useful: the browser is a client that
 * makes connections on behalf of two parties at once, your page and whatever
 * page the user has open in the next tab, and every mechanism here exists to
 * keep those two apart. */
(window.LESSONS = window.LESSONS || []).push(
{
  id: "browser-origin-is-the-boundary",
  track: "browser", level: "wire",
  title: "The origin is the boundary, and it is scheme plus host plus port",
  source: "RFC 6454, The Web Origin Concept, 2011",
  cheat: "Same origin means identical scheme, host and port. A different port or a different subdomain is a different origin.",
  idea: "The browser's entire security model is organised around the origin, a triple of scheme, host and port, and anything differing in any of the three is a separate security principal.",
  why: "Getting the definition exactly right is load-bearing, because most confusion in this area comes from an intuition that a company owns a domain and therefore everything under it is one thing. The browser does not agree. Two subdomains are different origins. The same host on two ports is two origins. The same host over plaintext and over TLS is two origins, which is why mixed content is a boundary violation rather than an inconvenience.\n\nThe reason this precision matters practically is that people reason about their site as an origin and deploy it as several. A static asset host, an API on a different subdomain, a documentation site, a customer-content host and a plaintext redirect endpoint are five origins, and the isolation between them is real: script in one cannot read another. That is a benefit to be preserved rather than an obstacle, and the common mistake is dissolving it for convenience by relaxing the boundary in ways the later entries in this track cover. It is also worth knowing where the origin is not the unit, because cookies scope by domain rather than by origin, which is the single most confusing inconsistency in the model and gets its own entry.",
  failureMode: "An attacker who finds a scripting vulnerability on a marketing subdomain expects to be confined there, and is, until they discover that the main application shares cookies scoped to the parent domain. The origin boundary held exactly as specified; the credential boundary was drawn differently, and the two are not the same shape.",
  experiment: "List every origin your product serves, by the strict definition: every distinct scheme, host and port combination. Include asset hosts, API subdomains, documentation and anything serving user-uploaded content. Ten minutes, and the count is usually higher than the mental model.",
  reflection: "Which pairs of your origins are isolated from each other in a way you are relying on, and which have you deliberately connected?",
  recall: {
    q: "What exactly is an origin, and what is the one place the browser does not use it as the unit?",
    a: "The triple of scheme, host and port. Any difference in any of the three makes a separate security principal, so two subdomains, two ports, and plaintext against TLS are all different origins.\n\nCookies are the exception: they scope by domain rather than by origin, which means a cookie can be shared across origins that are otherwise isolated. That mismatch is the most confusing inconsistency in the model."
  },
  deepDive: "Enumerate the origins in a product I describe by the strict definition, and tell me which isolation boundaries between them I am relying on."
},
{
  id: "browser-sop-restricts-reading",
  track: "browser", level: "wire",
  title: "Same-origin policy restricts reading, and does almost nothing about sending",
  source: "The WHATWG Fetch standard, on the distinction between opaque and readable responses",
  cheat: "The browser will send a cross-origin request and just hide the response. Any state change on a request the browser will send is exposed.",
  idea: "A page can cause the browser to send requests to any origin, and what the policy prevents is reading the responses, which is a much narrower guarantee than people assume.",
  why: "The asymmetry is the single most important fact in this track. A page from one origin can submit a form, load an image, include a script or make a fetch to any other origin, and the browser will send that request, attach cookies where the rules allow, and deliver it. What it will not do is let the originating page read what came back. So confidentiality of the response is protected and the effect of the request is not.\n\nEverything else in browser security follows from that. It is why cross-site request forgery exists as a category: the attack does not need to read anything, only to cause a state change. It is why a mechanism for relaxing the read restriction is not an access control, since the restriction was never about access. And it is why a state-changing endpoint that relies on being called from your own page is unprotected by default, because the browser is perfectly willing to call it from anywhere. The practical rule is to sort your endpoints by whether they change state, and to know that for those the policy contributes nothing.",
  failureMode: "An attacker hosts a page that submits a form to your application's account-deletion endpoint. A logged-in user visits it, the browser sends the request with their cookies attached, and the account is deleted. The attacker never sees a single byte of any response, and did not need to.",
  experiment: "Take one state-changing endpoint and construct an ordinary HTML form on a different origin that submits to it. See whether it succeeds. Fifteen minutes, and success means the endpoint's only protection was that nobody had tried.",
  reflection: "How many of your state-changing endpoints are protected by something other than the assumption that requests come from your own pages?",
  recall: {
    q: "What does same-origin policy actually prevent, and what does it permit?",
    a: "It prevents a page from reading responses from another origin. It permits the page from causing the browser to send requests to any origin, with cookies attached where the cookie rules allow.\n\nSo response confidentiality is protected and request effect is not, which is why cross-site request forgery exists, why relaxing the read restriction is not an access control, and why any state-changing endpoint relying on being called from your own page is unprotected."
  },
  deepDive: "For the endpoints I describe, tell me which change state and are therefore unprotected by same-origin policy, and what each needs instead."
},
{
  id: "browser-csrf-is-ambient-credentials",
  track: "browser", level: "wire",
  title: "Cross-site request forgery exists because cookies are attached without being asked for",
  source: "RFC 6265, HTTP State Management Mechanism, 2011, on automatic cookie transmission",
  idea: "A cookie is sent by the browser on every matching request regardless of what caused it, so the credential is ambient rather than presented, and any page can spend it.",
  why: "The distinction between an ambient credential and a presented one is the whole mechanism. A bearer token in a header is presented: some code decided to attach it, so a request from an attacker's page will not carry it, because their script cannot read your token and does not run in your origin. A cookie is ambient: the browser attaches it based on the destination, with no reference to what initiated the request. So a request from any page anywhere carries the user's session.\n\nThis explains why the same vulnerability class does not exist for token-based APIs, and it explains what the mitigations are actually doing. A synchroniser token or a custom header works because it converts the credential from ambient to presented: the request now needs something only your own origin can supply. Checking the origin or referrer works because it examines what initiated the request, which is the information the cookie mechanism ignores. And the cookie attribute that limits cross-site sending is an attempt to make cookies less ambient by default. All three are addressing the same root cause from different directions, which is worth seeing, because a team that has one usually thinks they need all three.",
  failureMode: "An attacker sends a logged-in user a link to a page containing a hidden form that posts to your funds-transfer endpoint. The browser attaches the session cookie because the destination matches, the request is indistinguishable from a legitimate one at the server, and the transfer completes. The user's only action was visiting a page.",
  experiment: "Take one state-changing endpoint and determine which of the three protections it has: a token the attacker cannot obtain, a check on what initiated the request, or reliance on a cookie attribute. Then verify the one you find actually works by testing without it. Twenty minutes.",
  reflection: "Which of your endpoints depend solely on a cookie attribute for this, and are you comfortable with a defence that lives in the browser rather than in your code?",
  recall: {
    q: "What is the root cause of cross-site request forgery, and how do the three mitigations relate to it?",
    a: "Cookies are ambient credentials: the browser attaches them based on destination, with no reference to what initiated the request, so any page can spend the user's session. Header-borne tokens are presented rather than ambient, which is why token APIs do not have this class.\n\nA synchroniser token or custom header converts the credential to presented; an origin or referrer check examines the initiator the cookie mechanism ignores; the cross-site cookie attribute makes cookies less ambient by default. All three address the same cause."
  },
  deepDive: "Audit the cross-site request protections on the endpoints I describe and tell me which are relying on a browser-side default."
},
{
  id: "browser-cors-relaxes-not-restricts",
  track: "browser", level: "policy",
  title: "Cross-origin resource sharing relaxes the read rule and is not an access control",
  source: "The WHATWG Fetch standard, on cross-origin resource sharing",
  cheat: "These headers grant other origins the right to read your responses. They never restrict anyone, and they are not authorisation.",
  idea: "The mechanism exists to let a server permit specific other origins to read its responses, so every header in it widens access and none of them narrows it.",
  why: "The misconception is common enough to be worth stating as the point of the entry: people configure it believing they are restricting who can call an endpoint. It does the opposite. Without any of it, the browser already sends cross-origin requests and merely hides the responses. Adding these headers tells the browser to stop hiding them from a nominated origin. So a permissive configuration is a grant, and a missing configuration is not a vulnerability.\n\nTwo consequences follow. First, it provides no protection whatsoever for state-changing endpoints, because the request was always being sent; a team that treats it as an access control has protected nothing while believing they have. Second, over-permissive configuration is a real vulnerability in the read direction: allowing any origin to read authenticated responses lets any page the user visits pull their data out of your API. The headers deserve the same review as any other grant, which means the question to ask of each one is which origin is being given the right to read what, and whether that origin still needs it.",
  failureMode: "An attacker's page makes an authenticated request to your API and reads the response, because the configuration permits any origin and credentials. The user's data is exfiltrated by any page they visit while logged in. Everything worked as configured, and the configuration was written by somebody who thought they were adding a restriction.",
  experiment: "List every endpoint that returns these headers and, for each, write down which origins are granted read access and whether credentials are permitted. Then check whether any of the granted origins is a wildcard or reflects the request. Twenty minutes.",
  reflection: "Is anything in your estate relying on this mechanism as an access control, and how would you find out?",
  recall: {
    q: "What does cross-origin resource sharing do, and what does it never do?",
    a: "It permits nominated other origins to read your responses, which the browser would otherwise hide. Every part of it widens access.\n\nIt never restricts anyone, so a missing configuration is not a vulnerability and it provides no protection at all for state-changing endpoints, because the request was always sent. Over-permissive configuration is a genuine read-direction vulnerability: any origin plus credentials means any page the user visits can pull their data from your API."
  },
  deepDive: "Review the cross-origin headers on the endpoints I paste in and tell me which origins are being granted read access to authenticated data."
},
{
  id: "browser-reflected-origin-is-no-policy",
  track: "browser", level: "policy",
  title: "Reflecting the request origin back is the same as allowing everyone",
  source: "The WHATWG Fetch standard, on the interaction of allowed origin with credentials",
  cheat: "Never echo the request origin into the allow header. Match against a fixed list and send nothing when there is no match.",
  idea: "A server that copies whatever origin the request claimed into the header permitting that origin has written a policy that approves every origin, one at a time.",
  why: "The pattern arises from a genuine constraint. The specification does not allow a wildcard together with credentials, so a developer who needs credentialed cross-origin reads from several origins cannot list them all in one static header. The apparently obvious solution is to echo back whatever origin the request carried, which satisfies the browser and produces something that looks specific in every individual response.\n\nIt is a wildcard with extra steps, and worse than a wildcard because it works with credentials. Any page can send a request, will have its own origin reflected back as permitted, and can then read the authenticated response. The correct implementation is a fixed allowlist compared exactly: if the request origin is in the list, echo that one value; if it is not, send no header at all and let the browser hide the response. The failure mode to avoid while implementing it is a substring or suffix comparison, since a check for a domain ending in your name matches an attacker's domain that ends the same way, which is the certificate-subject problem from the TLS track reappearing in a different header.",
  failureMode: "An attacker hosts a page that fetches your authenticated API endpoint with credentials. Their origin is reflected into the permitting header, the browser therefore allows the read, and the response containing the user's data is delivered to the attacker's script. Every response looked correctly scoped to a single origin.",
  experiment: "Send a request to one of your endpoints with an origin header naming a domain you do not own, and see whether it comes back reflected. Then try one that is a suffix of a legitimate origin. Fifteen minutes, and either reflection is today's finding.",
  reflection: "If your allowlist is a suffix or pattern match rather than an exact comparison, what domain would satisfy it that you do not own?",
  recall: {
    q: "Why is reflecting the request origin equivalent to allowing everyone, and what is the correct implementation?",
    a: "Because every requesting page has its own origin echoed back as permitted, so all of them are approved one at a time, and unlike a wildcard this works with credentials, so authenticated responses become readable by any page.\n\nCorrect is a fixed allowlist with exact comparison: echo the one matching value, or send no header at all. Suffix and pattern matches fail, because a domain ending the same way as yours satisfies them."
  },
  deepDive: "Test whether the endpoints I describe reflect the request origin, and write me an exact-match allowlist implementation."
},
{
  id: "browser-preflight-is-not-authorisation",
  track: "browser", level: "wire",
  title: "A preflight asks a question about headers, and answering it is not an authorisation decision",
  source: "The WHATWG Fetch standard, on preflight requests",
  idea: "For requests that are not simple, the browser first asks the server which methods and headers are permitted, and that exchange is a compatibility negotiation rather than a permission check.",
  why: "It is easy to read the preflight as the browser asking permission, and that reading produces two errors. The first is believing that requests which trigger a preflight are therefore protected: they are not, the preflight only governs whether the browser will proceed to send the real request from script and read the response. The second, more serious, is that plenty of requests trigger no preflight at all. Simple requests, meaning particular methods with a small set of content types, are sent immediately with no prior question asked.\n\nThat second point is where the real exposure sits, because it means a state-changing endpoint reached by an ordinary method with a plain content type is called cross-origin with no preflight and no opportunity to refuse. Which is why relying on the mechanism as a defence fails in exactly the case that matters. It also explains a common confusion, where a team observes that their fetch is blocked and concludes the endpoint is protected, without noticing that the block happened after the state change, or that the same request submitted as a plain form would not be blocked at all.",
  failureMode: "An attacker calls a state-changing endpoint cross-origin using a method and content type that qualify as simple. No preflight occurs, the request is sent with cookies, and the state change happens. The attacker's script is then prevented from reading the response, which they did not want, and the team's belief that cross-origin requests are checked in advance was wrong for this whole class.",
  experiment: "Take one state-changing endpoint and determine whether a cross-origin request to it triggers a preflight. If it does not, note what the endpoint's actual protection is. Fifteen minutes.",
  reflection: "Has anybody in your team ever cited a blocked fetch as evidence that an endpoint is protected, and was the state change already done by then?",
  recall: {
    q: "What is a preflight for, and why can it not be a defence?",
    a: "It asks the server which methods and headers are permitted before the browser sends a non-simple request from script, which is a compatibility negotiation rather than a permission check.\n\nIt cannot be a defence because simple requests - particular methods with a small set of content types - trigger no preflight and are sent immediately. A state-changing endpoint reachable that way is called cross-origin with no chance to refuse, and a blocked fetch often means the read was blocked after the state change."
  },
  deepDive: "For each endpoint I describe, tell me whether a cross-origin call would trigger a preflight and what its actual protection is."
},
{
  id: "browser-cookie-scope-is-not-origin",
  track: "browser", level: "wire",
  title: "Cookies scope by domain, not by origin, which is the model's sharpest inconsistency",
  source: "RFC 6265, HTTP State Management Mechanism, 2011, on the domain and path attributes",
  cheat: "A cookie set on the parent domain goes to every subdomain, including ones you do not control. Set cookies host-only unless sharing is the point.",
  idea: "Everything else in the browser is scoped to an origin and cookies are scoped to a domain and path, so a cookie can be readable and sendable across origins that are otherwise fully isolated.",
  why: "The consequences run in both directions. A cookie set for a parent domain is attached to requests for every subdomain of it, so a session cookie set that way is sent to any subdomain, including one serving user content, one operated by a different team, and one that is a stale record pointing at infrastructure somebody else now controls. Conversely a subdomain can set a cookie on the parent domain, which means a compromised or hostile subdomain can write cookies that the main application will receive, which is the mechanism behind session fixation across subdomains.\n\nThe path attribute does not help, because the isolation it appears to provide is not enforced against script from the same domain. And the scheme is not part of the scope either, so a cookie can be sent over plaintext to a host that also answers on TLS unless it is marked otherwise. What follows practically is a short list of decisions worth making deliberately rather than inheriting: set cookies host-only unless cross-subdomain sharing is a requirement, mark them so they are only sent over TLS, and treat every subdomain that shares a cookie scope as being inside the same security boundary as the application.",
  failureMode: "An attacker who controls any subdomain of your parent domain, perhaps through a stale record pointing at deprovisioned infrastructure, sets a cookie scoped to the parent. The main application receives it and treats it as a session. The origin boundary was never crossed, because cookies never respected it.",
  experiment: "List your cookies and note which are scoped to a parent domain rather than host-only. For each of those, enumerate every subdomain that consequently receives it, including any you do not operate. Twenty minutes.",
  reflection: "How many subdomains are inside your session cookie's scope, and do you control all of them?",
  recall: {
    q: "How does cookie scoping differ from the origin model, and what are the consequences in each direction?",
    a: "Cookies scope by domain and path rather than by scheme, host and port. A cookie set on a parent domain is sent to every subdomain, including user-content hosts, other teams' services and stale records pointing at infrastructure you no longer control.\n\nIn the other direction, a subdomain can set cookies on the parent, which the main application receives, enabling session fixation. Path provides no isolation against same-domain script, and scheme is not part of the scope unless the cookie is marked."
  },
  deepDive: "List the cookies in a product I describe, tell me which are parent-scoped, and enumerate every subdomain that consequently receives them."
},
{
  id: "browser-samesite-changed-the-default",
  track: "browser", level: "policy",
  title: "The cross-site cookie attribute changed the default and did not remove the problem",
  source: "RFC 6265, on the same-site attribute",
  idea: "Browsers now decline to attach cookies to many cross-site requests by default, which removes the easiest version of the attack and leaves several paths open.",
  why: "The change is genuinely valuable: a cookie that is not attached to a cross-site request cannot be spent by another page, which defeats the classic hidden-form attack without any application change. That is a rare thing in security, a default that improved for everybody. It should not be mistaken for the end of the class.\n\nWhat remains is worth knowing specifically. Same-site is not same-origin: it is evaluated on the registrable domain, so a different subdomain is the same site, and a hostile or compromised subdomain is not restricted at all. The intermediate setting still attaches cookies to top-level navigations with ordinary methods, so an attack that works through a link rather than a background request still carries the session. Some browsers apply a grace period after a cookie is set. And any endpoint reached through a means the browser treats as same-site, or by a client that is not a browser, is unaffected. So the honest position is that this raised the floor, and an application whose only protection is the browser's default has delegated a security property to somebody else's release notes.",
  failureMode: "An attacker uses a hostile subdomain, obtained through a stale record, to make the request. The browser considers it the same site, attaches the cookie, and the state change proceeds. The default that would have stopped a third-party page does not apply, because the definition of site is broader than the definition of origin.",
  experiment: "For one session cookie, note its declared attribute value and then reason through the three remaining paths: a subdomain you do not control, a top-level navigation with an ordinary method, and a non-browser client. Fifteen minutes.",
  reflection: "Do your endpoints have a protection that works independently of the browser default, and if not, is that a decision or an inheritance?",
  recall: {
    q: "What does the cross-site cookie attribute fix, and what does it leave?",
    a: "It stops cookies being attached to many cross-site requests, defeating the classic hidden-form attack with no application change.\n\nIt leaves subdomains, because same-site is evaluated on the registrable domain rather than the origin, so a hostile subdomain is unrestricted; top-level navigations with ordinary methods under the intermediate setting; browser grace periods after a cookie is set; and any non-browser client. Relying on it alone delegates a security property to a browser's release notes."
  },
  deepDive: "For the session cookies I describe, tell me which cross-site paths remain open given their attributes and my subdomain estate."
},
{
  id: "browser-csp-is-page-egress-policy",
  track: "browser", level: "policy",
  title: "Content security policy is an egress policy for the page",
  source: "The W3C Content Security Policy Level 3 specification",
  cheat: "Read a content security policy as a destination allowlist for the page. Every source directive is an egress rule for one kind of request.",
  idea: "The mechanism is a list of destinations the page is permitted to load from and connect to, which makes it the same kind of control as a network egress policy, enforced by the browser on your behalf.",
  why: "Reading it this way is more useful than reading it as an anti-scripting feature, because it explains the structure. Each directive names a kind of request and the destinations permitted for it: where script may come from, where styles may come from, where images may come from, where the page may open connections to. That is a destination allowlist per request type, which is exactly an egress policy, and every intuition from the egress track transfers, including that an allowlist you cannot enumerate is not much of one.\n\nThe consequence is a shift in what the policy is for. Restricting where script comes from limits code execution, which is the well-known use. Restricting where the page may connect to limits what an attacker who already has script execution can do with it, which is the loss-reduction use and the one that survives a scripting vulnerability. Both matter, and only the second one is still working after the thing you were trying to prevent has happened. That parity with the network case is why the directive governing connections deserves separate attention, and gets it in the next entry.",
  failureMode: "An attacker with a scripting vulnerability on a page with a policy that restricts script sources but permits connections anywhere loads no external script, because they do not need to, and simply reads the page's data and sends it to their own endpoint. The policy prevented the delivery mechanism it was written for and permitted the objective.",
  experiment: "Take one page's policy and rewrite it as a table: request type, permitted destinations. Then mark which entries are enumerable and which are wildcards or broad hosts. Fifteen minutes, and the table is more legible than the header.",
  reflection: "Does your policy restrict where the page may send data as tightly as where it may load code from?",
  recall: {
    q: "What is the most useful way to read a content security policy, and what does that reveal?",
    a: "As a destination allowlist per request type, which makes it an egress policy enforced by the browser, so every intuition from network egress transfers, including that an unenumerable allowlist is weak.\n\nIt reveals two distinct purposes: restricting script sources limits code execution, and restricting connection destinations limits what an attacker who already has execution can do. Only the second is still working after the vulnerability you were preventing has occurred."
  },
  deepDive: "Rewrite the content security policy I paste in as a destination table by request type, and tell me which entries are not enumerable."
},
{
  id: "browser-connect-src-is-the-exfil-directive",
  track: "browser", level: "policy",
  title: "The connection directive is the one that limits exfiltration, and it is the one people leave open",
  source: "The W3C Content Security Policy Level 3 specification, on the connect and form action directives",
  cheat: "Restrict page connections and form targets to your own origins. Script restrictions do not stop data leaving once script is running.",
  idea: "Restricting where a page may open connections and submit forms is what bounds the damage of script execution, because everything else in a policy is about preventing the execution rather than limiting it.",
  why: "Once arbitrary script is running in your origin, it can read whatever the page can read, and the only remaining question is where it can send it. That question is answered by the directives governing connections, form submission, and to a lesser extent the destinations for images and other subresources, since a request to load an image is a request that carries a URL of the attacker's choosing.\n\nThis is the browser-side version of the argument that egress is the control operating after prevention has failed, and it has the same practical shape: it is harder to configure because you have to know every destination your page legitimately talks to, and it is worth more than the preventive directives because it works on the bad day. It also has the same failure mode, where an entry added to make an analytics or error-reporting library work becomes a permanent permitted destination, and any script running in the page can use it. Closing the obvious channels while leaving one broad entry open is common and mostly cosmetic, which is why the audit that matters is the destination table rather than the presence of a policy.",
  failureMode: "An attacker with script execution in your page reads a session token and the contents of the document, then sends both to their endpoint by setting an image source with the data encoded in the query string. The policy restricted script sources tightly and left image destinations open, because nobody thought of an image tag as an outbound channel.",
  experiment: "Check whether your policy restricts connections, form submission targets and image sources. For each that is open or broad, work out what a script running in the page could send through it. Fifteen minutes.",
  reflection: "Which permitted destination in your policy exists for a third-party library, and what could an attacker send through it?",
  recall: {
    q: "Which parts of a content security policy limit exfiltration, and why do they matter more than the rest?",
    a: "The directives governing connections, form submission targets, and subresource destinations such as images, since loading an image is a request carrying an attacker-chosen URL.\n\nThey matter more because once script is running in your origin it can read what the page can read, and the only remaining question is where it can send it. The preventive directives have already failed by then. The common failure is one broad entry added for a third-party library."
  },
  deepDive: "Tell me what an attacker with script execution could exfiltrate through the destinations my content security policy currently permits."
},
{
  id: "browser-nonce-makes-csp-real",
  track: "browser", level: "policy",
  title: "A host allowlist for script is weak, and a nonce or hash is what makes the policy mean something",
  source: "The W3C Content Security Policy Level 3 specification, on nonces and strict-dynamic",
  idea: "Permitting script by host means permitting every script on that host, and identifying script by a per-response nonce or a content hash permits exactly the scripts you intended.",
  why: "This is the enumerability problem again, in its browser form. A policy permitting script from a content delivery network permits every file any customer of that network has ever put there, including ones that will execute whatever a parameter tells them to. A policy permitting script from your own domain permits any file an attacker can get onto your own domain, including an uploaded one served from the wrong host, or a response that reflects input. In both cases the allowlist is a set nobody can enumerate.\n\nA nonce replaces the question. The server generates a fresh unguessable value per response, puts it in the policy and on the script tags it intended, and the browser runs only tags carrying it. An injected script tag has no nonce and does not run, whatever host it names. A hash does the same for static content without needing per-response generation. This is the difference between a policy that constrains where script comes from and one that constrains which script runs, and it is why a host-based policy is often described as providing little real protection while a nonce-based one is a genuine control.",
  failureMode: "An attacker injects a script tag naming a permitted content delivery network and a file on it that executes attacker-supplied parameters. The policy permits that host, so the browser runs it. The injection is successful against a policy that appeared restrictive and was matching on the wrong property.",
  experiment: "Look at your script directive. If it names hosts, pick one and consider what else is served from it. If it uses a nonce, verify the nonce actually changes per response rather than being a fixed value in a template. Fifteen minutes, and a static nonce is worse than none because it looks correct.",
  reflection: "Would moving to a nonce-based policy be a template change or an architectural one for your application, and has anybody scoped it?",
  recall: {
    q: "Why is a host-based script policy weak, and what does a nonce change?",
    a: "Because permitting a host permits everything on it: every file any customer of a content delivery network has published, or any file an attacker can get onto your own domain, including uploads and reflected responses. The allowlist is unenumerable.\n\nA nonce is a fresh unguessable per-response value present in the policy and on intended script tags, so only those run regardless of host. A hash does the same for static content. That shifts the policy from constraining where script comes from to which script runs."
  },
  deepDive: "Assess the script directive I paste in and tell me what moving to a nonce-based policy would require in the framework I describe."
},
{
  id: "browser-sri-pins-content",
  track: "browser", level: "wire",
  title: "Subresource integrity pins the content and does nothing about the host",
  source: "The W3C Subresource Integrity specification",
  idea: "An integrity attribute makes the browser refuse a subresource whose content does not match a hash you specified, which protects against the file changing and not against the host being reachable.",
  why: "The threat it addresses is precise: you depend on a file served by somebody else, and that file could be replaced, either by a compromise of the host or by the operator. Pinning the hash means a replaced file simply does not execute. That is a real and narrow guarantee and it is the correct tool for third-party script you must load from a third party.\n\nWhat it does not do is worth being clear about. It says nothing about the request itself, which still happens, so the third party still sees the user's address and headers on every page load. It only applies to subresources you have declared, so anything loaded dynamically by script is unprotected unless the code does its own checking. And it converts an availability characteristic into a hard failure: when the third party changes the file legitimately, your page loses that resource entirely, which is the correct security behaviour and an outage. That last point is why adoption is patchy, and it is worth deciding deliberately rather than discovering during an incident that a vendor's routine update broke a page.",
  failureMode: "An attacker compromises a widely used script host and replaces a file. Pages that pinned the hash break, which is the mechanism working. Pages that did not execute the attacker's code with full access to their own origin, and the compromise propagates to every site that trusted the host rather than the content.",
  experiment: "List every third-party script and stylesheet your pages load. For each, note whether it has an integrity attribute. Then check whether any are loaded dynamically by script, where the attribute does not apply. Fifteen minutes.",
  reflection: "For the third-party resources without integrity attributes, is the reason that the vendor updates the file at a URL that does not change?",
  recall: {
    q: "What does subresource integrity guarantee, and what are its three limits?",
    a: "That a subresource whose content does not match the specified hash will not execute, which protects against the file being replaced by a host compromise or by the operator.\n\nThe limits: the request still happens, so the third party still sees the user; it applies only to declared subresources, not to anything loaded dynamically by script; and a legitimate vendor update breaks the page, which is correct behaviour and an outage."
  },
  deepDive: "Inventory the third-party subresources in a page I describe, tell me which lack integrity attributes, and which are loaded in ways the attribute cannot cover."
},
{
  id: "browser-postmessage-star-target",
  track: "browser", level: "wire",
  title: "Cross-document messaging has an origin parameter on both sides and both get skipped",
  source: "The WHATWG HTML standard, on cross-document messaging",
  cheat: "Always pass a specific target origin when sending, and always check the sender origin when receiving. A wildcard on either side is the bug.",
  idea: "The messaging interface lets a sender restrict which origin may receive a message and lets a receiver check which origin sent one, and code routinely does neither.",
  why: "The mechanism is the sanctioned way for documents on different origins to communicate, which means it is a deliberate hole in the isolation, with two checks provided to keep it narrow. On the sending side, passing a wildcard target means the message is delivered whatever origin currently occupies the target frame or window, which an attacker can influence by navigating it. On the receiving side, handling a message without checking its origin means accepting instructions from any page that can obtain a reference to yours.\n\nBoth omissions are common and they compose badly. A sender that broadcasts to any origin leaks whatever the message contains, which is often a token, because this interface is a popular way to pass credentials from a login popup back to an opener. A receiver that does not check origin will act on any message, which turns a messaging handler into an unauthenticated entry point into your page's code with whatever privileges that code has. The rule is short enough to hold: name the target origin when sending, check the sender origin when receiving, and validate the message shape as untrusted input in both cases.",
  failureMode: "An attacker frames your page, or is framed by it, and sends a message that your handler acts on because it never checks the sender. Alternatively they navigate a frame your page broadcasts into, and receive a message containing an authentication token that was sent with a wildcard target.",
  experiment: "Grep for every message send and every message handler in your front-end code. For each send, check whether a specific target origin is given. For each handler, check whether the sender origin is verified. Fifteen minutes, and any wildcard or missing check is today's finding.",
  reflection: "Does any of your authentication flow pass a token through this interface, and is the target origin specific there?",
  recall: {
    q: "What are the two checks in cross-document messaging, and what happens without each?",
    a: "The sender can restrict which origin may receive the message, and the receiver can check which origin sent it.\n\nWithout the first, a wildcard target delivers the message to whatever origin currently occupies the target frame, which an attacker can influence by navigating it, leaking tokens that are often passed this way. Without the second, the handler acts on messages from any page that can get a reference, turning it into an unauthenticated entry point."
  },
  deepDive: "Find every cross-document message send and handler in the code I describe and tell me which are missing an origin restriction or check."
},
{
  id: "browser-mixed-content-breaks",
  track: "browser", level: "wire",
  title: "Mixed content is a boundary violation, which is why browsers break it rather than warn",
  source: "The W3C Mixed Content specification",
  idea: "A page loaded over TLS that pulls a subresource over plaintext has given up its integrity guarantee for the whole document, so browsers block it rather than displaying a warning.",
  why: "The reasoning is about what a script can do. If a page served securely loads a script over plaintext, anyone on the path can replace that script, and a replaced script runs with the full authority of the page's origin: it can read the document, read accessible storage, make authenticated requests. The security of the whole page therefore reduces to the security of its least protected subresource, which is why this is a violation of the origin boundary rather than a partial weakness. Passive content such as an image is less severe, since it cannot execute, but it still leaks the request and can be substituted.\n\nBrowsers moved from warning to blocking because a warning puts the decision on a user who has no way to evaluate it, and because the failure was silent in practice. The consequence for you is that mixed content presents as a broken feature rather than a security finding, which changes who notices and how it gets triaged. That is worth knowing because it means the bug report will say a widget stopped working, and the underlying cause is a plaintext dependency that has probably existed for a while and may exist in other places nobody has loaded yet.",
  failureMode: "An attacker on the network path replaces a script that a secure page loads over plaintext. Their code runs with the page's origin, reads the session and the document, and the page's own TLS made no difference, because the weakest subresource set the security of the whole document.",
  experiment: "Load your main pages and check the browser console for blocked mixed content. Then grep your templates and configuration for plaintext scheme references. Fifteen minutes, and the grep usually finds ones the pages you tested did not exercise.",
  reflection: "If a mixed content block were reported to your team, would it be triaged as a security finding or as a broken widget?",
  recall: {
    q: "Why do browsers block mixed content rather than warning about it?",
    a: "Because a script loaded over plaintext into a secure page can be replaced by anyone on the path, and the replacement runs with the page's full origin authority, able to read the document, storage and make authenticated requests. The security of the page reduces to that of its weakest subresource.\n\nWarnings put an unevaluable decision on the user and were ignored. The practical consequence is that it presents as a broken feature, so it gets triaged as a bug rather than as a security finding."
  },
  deepDive: "Help me find every plaintext subresource reference in a codebase I describe, including ones on pages that are rarely loaded."
},
{
  id: "browser-page-can-reach-loopback",
  track: "browser", level: "wire",
  title: "A page in a user's browser can reach services on their own machine and network",
  source: "The W3C Private Network Access specification, on requests to more private address spaces",
  cheat: "Any service listening on a developer's loopback or home network is reachable from any page they visit. Bind development servers with authentication.",
  idea: "The browser is a network client sitting inside the user's network, so a page from anywhere can cause requests to loopback addresses and local network devices that no external attacker could reach directly.",
  why: "This inverts the usual direction and is the most under-appreciated fact in the track. An attacker's page cannot reach a developer's local service from their own infrastructure. It can reach it through the developer's browser, because the browser is inside the network and will send requests wherever the page asks. Same-origin policy hides the responses, which limits reading, and does nothing about the effect, so anything that changes state on a locally reachable service is exposed. Development servers with debug endpoints, container management interfaces, home network devices with unauthenticated administration, and local databases with no password are all in scope.\n\nCombined with resolution rebinding, the read restriction can also be defeated in some configurations, since a name that resolves first to the attacker's address and then to a local one can appear same-origin to the browser. Browsers have been adding protections that require a permission check before a public page may make requests into more private address spaces, which is the right structural fix and is not universally available or applied to every case. The durable action is on your side rather than the browser's: local services need authentication and should bind to loopback rather than to every interface, and that applies to developer tooling, which is where the unauthenticated services actually are.",
  failureMode: "An attacker's page, visited by a developer, sends requests to services listening on that developer's machine: a debug endpoint that executes code, a container management socket exposed over a local port, a database with no password. The developer's own browser performs the requests, from inside the network, with no credential needed because none was ever configured for something only reachable locally.",
  experiment: "On one development machine, list the services listening on loopback and on the local network interface, and note which require authentication. Then consider that each is reachable from any page that machine visits. Fifteen minutes.",
  reflection: "How many unauthenticated services are listening on your team's development machines right now, and does anybody think of those as network-exposed?",
  recall: {
    q: "How can a page reach services an external attacker cannot, and what is the durable mitigation?",
    a: "Because the browser is a network client inside the user's network and will send requests wherever the page asks, including loopback and local network addresses. Same-origin policy hides responses but not effects, so state-changing local services are exposed, and rebinding can sometimes defeat the read restriction too.\n\nBrowser protections requiring permission for requests into more private address spaces help but are not universal. The durable mitigation is authentication on local services and binding to loopback rather than every interface, especially for developer tooling."
  },
  deepDive: "Help me audit what is listening on a development machine I describe and which of those a visited page could reach and change."
}
);

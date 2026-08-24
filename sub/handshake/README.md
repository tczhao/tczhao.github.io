# Handshake

Daily notes on application security at the network layer. What is allowed to talk to what,
over what, and what proves the far end is who it claims.

136 entries, 4.5 months of daily content, across 9 tracks.

## Why this one, given Least Authority exists

They look adjacent and they are not, and the seam is worth stating because getting it wrong
would make one of them redundant.

Least Authority asks **who is allowed to act**: authority, capabilities, confinement, the
boundary around a running agent. This one asks a question a layer down and a layer out:
**which endpoint may open a connection to which other endpoint**, and what proves the far
end is who it claims.

The practical test for where an entry belongs:

| If the fix is a change to... | It belongs in |
| --- | --- |
| a permission check, a token scope, a capability | Least Authority |
| a rule, a certificate, a listener, a route | here |

Least Authority would call a token holding too much scope the bug. Here the bug is that the
caller could reach the port at all, and the token never came into it.

Five entries were deliberately reframed rather than written where the two corpora would
otherwise have collided. Least Authority covers server-side request forgery as an
untrusted-input problem, default-deny egress as tenant isolation, namespaces as a
non-boundary, request desync as a parser differential, and token audience as a credential
scope. This corpus takes the network-control view of the same ground in each case: not how
the request gets coerced but what the connection needs in order to complete; not the tenant
blast radius but the log-only rollout that gets you to default-deny; not the namespace but
the host-network pod that escapes pod-level policy; not the parser differential but the
reused upstream connection that turns it into an attack; not the scope but the pooled
connection that outlives the credential.

## Tracks

Ordered so the round-robin first cycle serves the model track first and the detection track
last, which is also the order to read them in: the model is the set of claims the rest
depend on, and visibility is about detecting failures of the other eight.

| Track | Entries | What it covers |
| --- | --- | --- |
| The network security model | 16 | Rule shape, default deny as a property of the last rule, statefulness and return traffic, transitive reachability, layers and vocabulary, ports as convention, blast radius, shadowed rules, drift, verification. |
| TLS and what it proves | 16 | What the handshake establishes and what it does not. Which name, the two halves of validation, the one-line disable, trust stores, pinning, mutual authentication, resumption as a cached decision, why revocation lost to short lifetimes. |
| Proving the far end | 15 | Addresses as locations, position against claim, bearer tokens as possession, the identity bootstrap, forwarded headers, gateway-asserted identity, pooled connections outliving credentials, rotation, federation, shared identities. |
| Ingress | 16 | Where refusing is cheap, header add-and-strip, host header routing, client address as data, smuggling as two parsers plus one reused connection, normalisation disagreement, the path that skips the edge, concurrency as the target. |
| Egress | 14 | Resolve-then-connect, redirects as second requests, why no regular expression finds an internal address, forced proxies, resolution as the universal channel, low-bandwidth exfiltration, webhooks, the build pipeline, log-only rollout. |
| The browser as a network client | 15 | The origin triple, why same-origin restricts reading and not sending, ambient credentials, cross-origin sharing as a grant, reflected origins, cookie scope against origin scope, content security policy read as egress policy, reaching the user's own loopback. |
| Naming | 15 | Resolution as a trust dependency, answers that depend on who asks, cache lifetime as revocation latency, dangling records, split horizon, signing versus encrypting, wildcards, search suffixes, homographs, the registrar as supply chain. |
| Segmentation | 14 | What a segment actually is, primitive semantics on four axes, cluster policy as deny-only-once-selected, policy with no enforcing plugin, sidecar bypass, east-west, shared services as bridges, flat as a decision, measuring the reachable set. |
| Seeing the network | 15 | Telemetry that cannot be enabled retroactively, what flow records answer, what encryption costs your own detection, the inspection trade, denies as the highest signal, attribution under translation, retention against time to detection, untested detections. |

## Mechanics, and the two that were deliberately left off

**Recall.** Leitner boxes at 1 / 3 / 7 / 16 / 35 days. Due cards come before the day's entry,
because pulling something back out of your head is what moves it.

**The rule sheet.** The one view not built to slow you down. Rows lead with what to do and
demote the claim to the line underneath, because this is the tab you open with the policy
file already in front of you. It is opt-in rather than filtered: an entry earns a row when it
is a rule you can apply with your hands on the config, and is denied one when it is a
mechanism or a history, because those are why the rules exist and a one-line version of them
would be worse than nothing. 70 of 136 entries carry a row, and the page states the 66 it
leaves off rather than implying the rows are the whole corpus.

**No gate.** A commit-before-you-read gate is the right mechanic where the answer is a
judgement you can be wrong about in an interesting way, which is why Cascade asks you to name
the mechanism and Andon asks you to draft the sentence. Most of this material is a rule with a
mechanism under it. Gating "what does a stateless filter need that a stateful one does not"
behind a guess buys friction rather than calibration.

**No expiry.** Least Authority expires 54 of its 140 entries and is right to, because half of
that corpus is eighteen months old. The load-bearing half of this one is protocol behaviour
from the 1980s and 1990s that has outlived every product built on top of it. What does turn
over here is vendor defaults, and those do not belong in a corpus you revisit for a year.

That leaves recall and the rule sheet, which is the honest configuration rather than a thin
one. This is a corpus of rules, and a rule you cannot hold in your head while editing the
policy has not finished being learned.

## Levels

Which of three an entry is really about, because the same topic can be any of them and the
failure modes differ.

- **On the wire** (52) - protocol behaviour you cannot argue with.
- **Policy** (56) - how you express the rule.
- **Operations** (28) - what happens to the rule over the following two years, which is where
  most of them die.

The operations skew is smaller on purpose. Those entries are the ones with no attacker in the
failure mode, and there is a limit to how many times a corpus can say the control decayed
before it stops landing.

## Running it

```
npm run build     # validate the corpus, then inline everything into dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

`dist/index.html` is the shippable artifact: one file, no external requests, works offline.
`dev.html` is the same page with its parts still linked, for iterating without a build step.
Neither needs a server.

To validate one track while writing it, without a full build:

```
node ../_shared/lib/check-file.js content/05-egress.js
```

## How a day works

1. Due recall cards from earlier entries first.
2. Today's entry: the rule, what is actually going on underneath it, what an attacker does
   with it, something to trace today, and a reflection you answer in the page.
3. Log it. The entry joins the review rotation and the streak advances.

**Take it further** composes a prompt for Claude carrying whatever you wrote, so the
conversation starts from your estate rather than the abstraction.

## The daily action is a trace, not a note

Every entry's action is something you can run or read out of a real system inside twenty
minutes: read the bottom of a rule set, resolve what an allowlist entry actually admits, pull
hit counters, diff declared against running state, connect with the wrong client certificate,
enumerate what a pod can resolve, attempt a connection a rule forbids.

Least Authority's stated failure mode is that roughly half its daily actions resolve to a note
or a diagram, which turns you into a well-read reviewer of other people's designs. This
corpus is on the other side of that line by construction, because network policy is
inspectable in a way that agent authority boundaries are not. If the actions here start
resolving to notes, that is the signal that a track has drifted into architecture commentary.

## Known limits

- **Sources are pointers, not established facts.** Citations were written and self-checked by
  the author. They have not been independently verified against the original works. Treat a
  citation as somewhere to go next rather than as a fact already settled. The standards
  documents referenced - the RFCs, the NIST special publications, the W3C and WHATWG specs -
  are all freely available, which is part of why they were chosen over textbooks.
- **Vendor specifics are deliberately thin.** Entries name mechanisms rather than product
  configuration, because the mechanism outlives the product and the configuration would be
  the first thing to go stale in a corpus with no expiry mechanic. The cost is that a reader
  who wants the exact flag has to go and find it.
- **Visually checked on one engine only.** Unlike its siblings, this one has been rendered in
  a real browser: `dist/index.html` was opened in headless Chromium and the daily entry, the
  rule sheet and both themes were checked by eye. Only Chromium, only at desktop width, and
  only those three views. Nothing has been checked in Firefox or Safari, at narrow widths, or
  with a screen reader.
- **The corpus has not been read end to end by a second person.** 136 entries were written in
  one pass. The build enforces structure and the tests enforce that every entry renders, and
  neither can tell you that an entry is wrong.
- **Notes live in one browser.** Export and import are in **Progress**. Use them.

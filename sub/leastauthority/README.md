# Least Authority

Daily field notes on securing systems that act on untrusted input. One principle a day,
from the 1970s canon through to agent tool permissioning.

140 entries, 4.6 months of daily content, across 9 tracks.

## Why this one

An agent runtime inside a multi-tenant metadata platform holds tenant credentials, reads
customer-authored text and calls tools. That is the lethal trifecta by construction, and
security is the function most able to kill a charter. The classical half is what makes
the modern half legible.

## What is different about it

**Expiry.** 54 of 140 entries carry a date past which the claim is more likely to be
folklore than fact. A lapsed entry leaves the sequence and the review deck rather than
being quietly reinforced, and stays visible in the library, marked.

The distribution is the point: nothing in principles, authority or confinement, because
Saltzer and Schroeder does not go stale. Everything in prompt injection. Fifteen of
sixteen in agent defences. A security corpus with no expiry dates is a folklore
generator.

## Tracks

| Track | Entries |
| --- | --- |
| Principles | 16 |
| Authority and capabilities | 16 |
| Confinement and information flow | 14 |
| Isolation and multi-tenancy | 16 |
| Untrusted input | 16 |
| Prompt injection and agent boundaries | 18 |
| Agent defences | 16 |
| Credentials and delegation | 14 |
| Threat modelling and review | 14 |

## Sources

Saltzer and Schroeder (1975). Lampson on protection (1971) and confinement (1973). Norm
Hardy, *The Confused Deputy* (1988). Denning's lattice model (1976). Mark Miller, *Robust
Composition*, and *Capability Myths Demolished*. Ross Anderson, *Security Engineering*.
Greshake et al. (AISec 2023). Debenedetti et al., AgentDojo (NeurIPS 2024). CaMeL.
Simon Willison on prompt injection. OWASP's agentic top ten.

## Running it

```
npm run build     # inline everything into a single self-contained dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

`dist/index.html` is the shippable artifact: one file, no external requests, works
offline. `dev.html` is the same page with its parts still linked, for iterating without a
build step. Neither needs a server.

## How a day works

1. Due recall cards from earlier entries come first. Recall before reading - pulling something back out of your head is what moves it.
2. Today's entry: the idea, why it holds, the failure mode it prevents, something concrete to run today, and a reflection you answer in the page.
3. Log it. The entry joins the review rotation and the streak advances.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote so the conversation starts from your real situation rather
than the abstraction.

## The cheatsheet

The one view that is not a study aid. Everything else here is built to slow you
down; this tab is built to be read at speed, so the row leads with what to do and
demotes the claim to the line underneath it.

Nothing in this corpus carries a replication verdict, so there is nothing to
derive a filter from and the row is opt-in: `cheatsheet: true`, and an entry
appears if it was written a `cheat` line. That is a selection rather than a
filter, and the page says so - it states the 122 entries it leaves off rather
than implying 18 is the whole corpus.

An entry earns a row when it is a rule you can hold while writing the code. It is denied one when it is an attack or a history - those are why the rules exist, and they need their full account to land.

## When to abandon it

Roughly half the daily actions here resolve to a note or a diagram rather than a command,
because probing a production agent is something you schedule with a team. If the notes
stop turning into scheduled work by week three, this is making you a well-read reviewer
of other people's designs rather than the person who ships the control.

## Design of the engine

**The daily pick.** `days[date]` is written once and then read back forever. The obvious
alternative, `daysSinceEpoch % corpusLength`, is wrong: miss a Tuesday and that entry is
gone for good. Assign-and-record means reloads are stable, history is an honest log, a
missed day pushes content forward, and you cannot refresh to skip ahead. That last
property is what makes a commitment mean anything.

**Sequence order.** Round-robin across tracks, rotating the track order each cycle. Each
track file is ordered foundational first, so the opening cycle serves the most
foundational entry from every track before anything advanced. No seeded RNG, which
matters because `Math.random` would break day-stability.

**Review scheduling.** Leitner boxes at 1 / 3 / 7 / 16 / 35 days. `reviewInterval()` in
`engine/app.js` is the only place an interval is defined - it is the policy dial, and
three alternatives are documented at the call site.

**Storage.** One versioned `localStorage` key. Partial or older records merge onto a blank
rather than crashing, a corrupt record falls back to a clean slate, and a browser that
blocks storage gets an explicit warning rather than silently losing notes. Export and
import are in **Progress** - worth using, because a year of writing lives in one browser.

## The build refuses bad content

`lib/build.js` checks required fields, unique slug ids, known tracks and levels, that
every track has entries, that a declared mechanic is actually used and an undeclared one
is not, and that expiry and forecast dates parse. It also scans the raw source for
mistyped escapes, because `\P` parses silently to `P` and a swallowed paragraph break is
otherwise invisible until you happen to land on that day's entry. Em dashes fail the
build.

`lib/check-file.js` runs the same rules against a single file, so a corpus can be written
and validated one track at a time.

## Layout

```
site.js           the whole identity: key, tracks, copy, mechanics, palette
content/*.js      track files, ordered foundational first
engine/
  index.html      shell, filled in at boot from the site config
  styles.css      base design system, both themes, token-driven
  components.css  gate, expiry, attempts log, forecast book
  app.js          state, scheduling, gates, forecasts, routing, rendering
lib/
  build.js        validates the corpus, then inlines the engine into dist/
  themes.js       turns the palette into token overrides
  check-file.js   validates one content file, for authoring in progress
test/
  harness.js      boots the real app.js against an injected DOM
  engine.test.js  mechanics, against synthetic fixtures
  site.test.js    contracts this site has to meet
  fixtures/       two synthetic sites, one with every mechanic on, one with none
```

The engine here is a copy. Five sibling projects under `claude-build/` carry byte-identical
copies of `engine/`, `lib/` and `test/`, so each site stands alone - and so a fix to the
engine has to be applied six times. That was a deliberate trade of maintenance cost for
independence.

## Known limits

- Not opened in a real browser. The engine is tested by driving the shipped `app.js`
  against an injected DOM, and every entry is rendered through that harness, but nothing
  here has verified the visual result.
- Sources were written and self-checked by the authors of each track, and several
  corrected the curriculum where it was wrong. They have not been independently verified
  against the original works. Treat a citation as a pointer worth following rather than as
  a fact already established.
- Notes live in one browser. Take backups.

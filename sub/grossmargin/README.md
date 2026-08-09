# Gross Margin

A daily ledger on the unit economics of a B2B infrastructure SaaS. One idea a day, from
the cloud bill your architecture sets to the board metrics that decide your headcount.

150 entries, 4.9 months of daily content, across 9 tracks.

## Why this one

You already operate a P and L line, the multi-tenant cloud bill, without ever having read
a P and L. The funding decision for your team gets made in dollars and payback while you
argue in engineering.

The scarce asset is the intersection. Finance cannot compute what per-tenant isolation
does to gross margin because they do not know the architecture, and nobody in engineering
computes it because they do not read the filing.

## What is different about it

**Every entry cites a filing, a paper, a standard, or a benchmark with a stated n.** That
is a content rule rather than an engine feature, and it is the only thing standing between
this and 150 days of confident heuristics that read authoritative and are not true.

Where a specific figure was not verifiable, the entry says where to find the disclosure
instead of quoting a number. A scan of all 150 entries for a hard number sitting near a
named company returns nothing.

## Tracks

| Track | Entries |
| --- | --- |
| Reading a P and L | 16 |
| Cloud COGS | 18 |
| Architecture as a cost decision | 18 |
| SaaS metrics with an n | 18 |
| Pricing and packaging | 16 |
| Reading a filing | 16 |
| Capital allocation | 14 |
| What investors actually price | 16 |
| Compliance as cost and gate | 18 |

## Sources

Snowflake, Datadog, MongoDB, Confluent, GitLab, Elastic and HashiCorp filings. Damodaran's
NYU valuation material. Mauboussin's Counterpoint Global papers. Berman and Knight,
*Financial Intelligence*. Ramanujam and Tacke, *Monetizing Innovation*. Thorndike, *The
Outsiders*. Storment and Fuller, *Cloud FinOps*. The FinOps Framework and the FOCUS
specification. Bessemer's Rule of X. SOC 2 Trust Services Criteria, ISO/IEC 27001:2022
Annex A, GDPR Article 28.

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
filter, and the page says so - it states the 132 entries it leaves off rather
than implying 18 is the whole corpus.

An entry earns a row when it is a decision you make or a formula you apply. It is denied one when it teaches a way of reading a statement, because a lens is not a row.

## When to abandon it

This is the vegetable on the shelf and it hands you its own exit: one hour with a CFO and
the last board deck gets you most of the facts for free. Build the habit only if you want
that hour to be productive. Expect to ship short.

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

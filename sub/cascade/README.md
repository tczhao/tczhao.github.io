# Cascade

A daily case library of production failure mechanisms. One incident a day, and you
have to commit a call before the write-up opens.

130 entries, 4.3 months of daily content, across 9 tracks.

## Why this one

You have seen most of these shapes once. What this trains is recognition speed - naming
the mechanism in seconds rather than deriving it in minutes - because at 2am derivation
is too slow.

Treat this as a diagnostic drill rather than a concept corpus. There are roughly 35
recurring mechanism classes here spread across 130 cases, and repeated instances of one
shape is the training regime, not padding. It is how aviation and medicine teach
diagnosis.

## What is different about it

**The gate, and it is mandatory.** You see the incident as it appeared from outside, with
no mechanism named, and you must write what fired, what amplified it and what made
recovery slow before the write-up unlocks. Your call is frozen on commit and kept. In six
months the value of this page is the record of the calls you got wrong.

Without the gate this is a war-story feed inside three weeks. The cases are entertaining,
which is exactly why the commitment cannot be optional.

## Tracks

| Track | Entries |
| --- | --- |
| Retry and amplification | 16 |
| Saturation and queueing | 16 |
| Metastable failure | 12 |
| Configuration and deploy | 16 |
| Data, schema and migration | 16 |
| Time, clocks and expiry | 12 |
| Dependency and control plane | 14 |
| Recovery and its cost | 14 |
| Detection and human factors | 14 |

## Sources

The danluu/post-mortems collection. Cloudflare, AWS, GitHub, Google Cloud, Azure, Reddit,
CircleCI, Datadog and Atlassian public write-ups. The GitLab 2017 database incident. The
Amazon Builders' Library and Marc Brooker. Bronson et al., *Metastable Failures in
Distributed Systems* (HotOS 2021) and Huang et al. (OSDI 2022). Sidney Dekker, Richard
Cook, Diane Vaughan, Rasmussen, Bainbridge, Allspaw, the CAIB Columbia report and NTSB
material.

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

1. Call it before you read it. The entry stays shut until you commit an answer, and what you write is frozen the moment it opens.
2. Due recall cards from earlier entries, if any.
3. Today's entry, then a reflection you answer in the page.
4. Log it. The entry joins the review rotation and the streak advances.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote, including the answer you committed before reading, so the conversation starts from your real situation rather
than the abstraction.

## The cheatsheet

The one view that is not a study aid. Everything else here is built to slow you
down; this tab is built to be read at speed, so the row leads with what to do and
demotes the claim to the line underneath it.

Nothing in this corpus carries a replication verdict, so there is nothing to
derive a filter from and the row is opt-in: `cheatsheet: true`, and an entry
appears if it was written a `cheat` line. That is a selection rather than a
filter, and the page says so - it states the 112 entries it leaves off rather
than implying 18 is the whole corpus.

An entry earns a row when it is a move you might need mid-incident. It is denied one when it explains a mechanism, because mechanisms are what you read on a quiet afternoon and not what you reach for at three in the morning.

## When to abandon it

Read your own committed calls back at day 40. If they are landing on the symptom rather
than the mechanism, and not improving, the corpus is entertaining you rather than
training you.

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

# Base Rate

A daily notebook on measurement and inference. One idea a day, a forecast book that
scores you, and old ideas resurfacing as recall questions.

135 entries, 4.4 months of daily content, across 9 tracks.

## Why this one

You are about to be the person who decides whether an agent feature is good enough to
ship, and the definition of working migrates to whoever can produce a defensible number.
This covers the discipline that separates a number that means something from a number
that merely exists.

## What is different about it

**The forecast book.** The only self-scoring mechanic here. 46 entries seed a forecast
about your own work; you set a probability and a resolution date, and the page keeps a
Brier score and a calibration plot. Brier is the mean squared error of a probability
against a binary outcome, so lower is better and an always-fifty-percent forecaster
scores exactly 0.25. A site that cannot detect its own inertness will feel productive
while teaching nothing.

## Tracks

| Track | Entries |
| --- | --- |
| Measurement and validity | 15 |
| Uncertainty and intervals | 16 |
| Base rates and conditionals | 14 |
| Causal structure | 16 |
| Study design and identification | 15 |
| Experiments in production | 16 |
| Evaluating models and judges | 18 |
| How inference goes wrong | 13 |
| Forecasting and calibration | 12 |

## Sources

Hernan and Robins, *Causal Inference: What If*. Pearl. Rosenbaum. Angrist and Pischke.
Cronbach and Meehl (1955). Ioannidis (2005). Simmons, Nelson and Simonsohn (2011).
Gelman and Loken. Mayo on severe testing. Gigerenzer on natural frequencies. Kohavi,
Tang and Xu. Brier (1950) and Murphy's decomposition. Tetlock. Shankar et al. on
validating LLM judges. Evan Miller on error bars for evals.

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
filter, and the page says so - it states the 117 entries it leaves off rather
than implying 18 is the whole corpus.

An entry earns a row when the useful part is a check you can run against a number in front of you. It is denied one when the value is in the working - most of this corpus teaches you to derive something, and a derivation does not fit in a row.

## When to abandon it

If the Brier score has not moved after thirty resolved forecasts, the reading is not
reaching your judgement and the site is a statistics course you are auditing.

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

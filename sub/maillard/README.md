# Maillard

Daily kitchen notes on the chemistry under the cooking. One mechanism a day, and a log of
what actually happened in the pan.

160 entries, 5.3 months of daily content, across 8 tracks.

## Why this one

The only one of these that is deliberately not about work. It fires at 7pm in a kitchen
rather than at 7am at a desk, so it never competes with anything else for the same
attention, and a bad quarter cannot consume the resource it needs.

## What is different about it

**No review deck.** The knowledge is procedural: recalling that collagen converts to
gelatin near 70C is trivia unless the braise is on the stove. So the second tab is not a
Leitner deck, it is a dated record of what happened the last time you actually cooked the
thing, and that is the only review worth doing here.

Mechanism over recipe throughout. Temperatures in Celsius, weights in grams. Where the
folklore is wrong the entry says so and says where it came from: searing and moisture
traces to Liebig in 1847 and was disproved by weighing the meat.

## Tracks

| Track | Entries |
| --- | --- |
| Proteins and heat | 24 |
| Browning | 22 |
| Emulsions and foams | 20 |
| Starch, gels and thickening | 20 |
| Flavour chemistry and perception | 20 |
| Acid, salt and fermentation | 20 |
| Heat transfer and equipment | 18 |
| One tradition in depth | 16 |

## Sources

Harold McGee, *On Food and Cooking* and *Nose Dive*. Herve This. Nathan Myhrvold,
*Modernist Cuisine*. Kenji Lopez-Alt, *The Food Lab*. Shirley Corriher. Peter Barham.
Mouritsen and Styrbaek, *Umami* and *Mouthfeel*. Harry Nursten, *The Maillard Reaction*.
Fuchsia Dunlop, *The Food of Sichuan*. Samin Nosrat. Cook's Illustrated.

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

1. Today's entry: what is happening, the chemistry, what goes wrong, and something to try tonight.
2. Log it, with what you measured.
3. Later, in the kitchen log, record what happened when you actually cooked it.

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
filter, and the page says so - it states the 144 entries it leaves off rather
than implying 16 is the whole corpus.

An entry earns a row when it is something to do at the stove, with a temperature, a timing or a ratio attached. It is denied one when it explains what is happening, which is worth reading once and is not what you check mid-cook.

## When to abandon it

It changes no decision that matters, and it faces a cheaper substitute that beats it
outright: cook more often and read the relevant McGee chapter whenever a dish fails. If
the kitchen log is empty at week three, take the substitute.

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

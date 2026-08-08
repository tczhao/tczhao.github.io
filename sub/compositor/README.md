# Compositor

A daily workbook for prose craft. One move a day, applied to a paragraph you actually
wrote, and old moves resurfacing as recall questions so the vocabulary sticks.

136 entries, 4.5 months of daily content, across 9 tracks.

## Why this one

Your output changed medium. The artifact you are judged on is now the charter, the
deprecation plan, the review comment and the incident write-up, and no corpus followed
the change. This is the layer between typographic rules you already have and structural
instincts you already have: nominalization, character-action alignment, topic strings,
the stress position, the cumulative sentence.

The payoff is not writing better. It is being able to edit someone else's paragraph and
say why in one sentence, which is how you raise a team's floor without becoming its
bottleneck.

## What is different about it

**The gate.** The worked example stays shut until you paste a paragraph of your own and
edit it. What you write is frozen the moment the example appears, because an editable
answer is not a commitment. Every entry ships a fallback paragraph of realistic bad
engineering prose, flawed in exactly the way that entry teaches, so a day you wrote
nothing is still playable. Five consecutive fallback days is the signal that the target
stopped being your own output, which was the entire reason to build this one.

## Tracks

| Track | Entries |
| --- | --- |
| Characters and actions | 20 |
| Cohesion and coherence | 20 |
| Concision | 14 |
| Sentence architecture | 16 |
| Shape of an argument | 18 |
| Register and audience | 14 |
| Revision, and editing others | 16 |
| Technical and evidential prose | 10 |
| Usage, myths and the evidence | 8 |

## Sources

Joseph Williams, *Style: Lessons in Clarity and Grace*. George Gopen and Judith Swan,
*The Science of Scientific Writing*. Francis Christensen's generative rhetoric. Richard
Lanham's paramedic method. Barbara Minto, *The Pyramid Principle*. Larry McEnerney's
Chicago lecture. Steven Pinker on Thomas and Turner. John McPhee, *Draft No. 4*.
Zinsser, Klinkenborg, Garner, Pullum, Alley, ISO 24495-1:2023.

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

1. Bring a paragraph. The entry stays shut until you commit an answer, and what you write is frozen the moment it opens.
2. Due recall cards from earlier entries, if any.
3. Today's entry, then a reflection you answer in the page.
4. Log it. The entry joins the review rotation and the streak advances.

## The worked example

Every entry ships a `fallback`, a deliberately flawed specimen for a day you wrote
nothing of your own, and a `worked` example: that same specimen after the move has
been applied, followed by a short note on what changed and what it cost. It renders
directly under the failure mode, so the pair reads as diagnosis then repair, and it
is only reachable past the gate.

The field exists because the gate promised it three separate times - "before you
read the worked example", "the worked example opens once you have pasted something
of yours and edited it", "reading the answer first is the one way to learn nothing
here" - and for a long while no entry carried one. A gate that names a reward it
cannot produce teaches the reader to stop believing the copy.

`extraRequired` enforces it, so the build refuses an entry without one.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote, including the answer you committed before reading, so the conversation starts from your real situation rather
than the abstraction.

## When to abandon it

On day one, take a 200-word paragraph from a teammate's design doc and write a
one-paragraph edit note. Do it again on day 45 with a different paragraph and read the
two side by side. If the day-45 note is not visibly more specific, naming the move
rather than the symptom, abandon it. The site produced vocabulary, you already had
taste, and vocabulary was never the gap.

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

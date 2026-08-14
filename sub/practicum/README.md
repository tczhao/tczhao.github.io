# Practicum

A daily logbook for management practice. One entry a day, an experiment to run at
work, and old entries resurfacing as recall questions so the material actually sticks.

152 entries - five months of daily content - drawn from the management canon and
tagged by level, from running one team through leading across an org.

## Running it

```
npm run build     # validate the corpus, then inline the shared engine into dist/index.html
npm test          # 69 engine checks against fixtures, then 12 contracts against this site
npm run check     # both
```

For local development, build once and open `dev.html`. It links the shared
engine and this site's parts in place rather than inlining them, so editing an
entry needs a reload and nothing else. Both `dev.html` and `theme.css` are
generated, and neither is tracked.

`dist/index.html` is the shippable artifact: one file, no external requests, works
offline.

## How a day works

1. If cards are due from earlier entries, they come first. Recall before reading -
   pulling something back out of your head is what moves it.
2. Today's entry: the idea, why it holds, the failure mode it prevents, one concrete
   thing to try today, and a reflection prompt you answer in the page.
3. Log it. The entry enters the review rotation and the streak advances.

There is also a **Take it further** button that composes a prompt for Claude, with
whatever you wrote in the reflection field folded into it, so the conversation starts
about your actual situation rather than the abstraction.

## Design of the engine

**The daily pick.** `days[date]` is written once and then read back forever. The
obvious alternative, `daysSinceEpoch % corpusLength`, is wrong: miss a Tuesday and
that entry is gone for good. Assign-and-record means reloads are stable, history is
an honest log, a missed day pushes content forward, and you cannot refresh to skip
ahead.

**Sequence order.** Round-robin across the twelve tracks, rotating the track order
each cycle. Each track file is ordered foundational-first, so the opening cycle
serves the twelve most foundational entries before anything advanced. No seeded RNG
needed, which matters because `Math.random` would break day-stability.

**Review scheduling.** Leitner boxes at 1 / 3 / 7 / 16 / 35 days, declared as
`intervals` in `site.js`. `reviewInterval()` in the shared engine is the only place
the grading policy is defined, and three alternatives are documented at the call site.

**Storage.** One versioned `localStorage` key. Partial or older records merge onto a
blank rather than crashing, a corrupt record falls back to a clean slate, and a
browser that blocks storage gets an explicit warning rather than silently losing
notes. Export and import are in **Progress** - worth using, because a year of journal
entries lives in one browser.

**The cheatsheet.** The one view that is not a study aid. Everything else here is
built to slow you down; that tab is built to be read before a one-to-one you are
already late for, so the row leads with what to do and demotes the claim to the
line underneath.

Nothing in this corpus grades its own evidence, so there is no verdict to filter
on and the row is opt-in: an entry appears if it carries a `cheat` field. That is
a selection rather than a filter, and the page states the count it leaves out
rather than implying it is the whole corpus.

The selection bar is deliberately high, because management writing compresses into
platitude faster than any other material here. An entry earns a row when the useful
part is a rule, an ordering or a specific move, and it is denied one when the value
lives in the reasoning and a one-liner would be a fortune cookie. Most entries do
not earn a row.

## Layout

```
site.js                 config: tracks, levels, intervals, cheatsheet, palette, copy
content/*.js            twelve track files, one per theme
dist/index.html         the shippable artifact
../_shared/             the engine, the build and the tests, shared with ten sibling sites
```

The engine, stylesheet and page shell live in `_shared` and are not this site's to
edit. Practicum is where they came from - it ran its own copy of all three for long
enough that the shared engine grew features this site never got - so what remains
here is the corpus and the configuration that distinguishes it.

`_shared/lib/build.js` refuses to build on a bad corpus. It checks required fields,
unique slug ids, known tracks and levels - and scans the raw source for mistyped
escapes, lone `\n`, and markdown that would reach the reader as literal `##`, because
`\P` parses silently to `P` and a swallowed paragraph break is otherwise invisible
until you happen to land on that day's entry.

## Design notes

The visual identity is an engineering lab notebook rather than a self-help app: pale
technical paper stock, a 28px graph field locked to the prose baseline, drafting blue
for structure, oxide red-pen reserved for anything that asks you to act. Entry
numbering is the one structural device and it earns its place, since the entries
genuinely are an ordered sequence.

Type resolves entirely from system faces in four roles - slab display, text serif,
grotesque UI, mono data. The Artifact CSP blocks font hosts, so a linked webfont
would fail silently to a default.

## Attribution

Each entry credits the source of the idea and summarises rather than quoting. The
material draws on Grove, Drucker, Rumelt, Brooks, Conway, Edmondson, Lencioni,
Kim Scott, Skelton and Pais, Larson, Fournier, Dekker, Allspaw, Meadows, Kahneman,
Fisher and Ury, Maslach and others named per entry.

## Known limits

- Not opened in a real browser. The engine is tested by driving the shipped engine
  against an injected DOM, and the stylesheet by static contract checks, but nothing
  here has verified the visual result. Playwright would need installing first.
- The palette is declared in `site.js` and the soft and line variants are derived
  from it at a fixed alpha rather than written down. The hand-tuned values this site
  carried before differed from the derived ones by up to 0.02 alpha on four tokens,
  which is the one thing the move to the shared engine did not reproduce exactly.
- 152 entries is five months. After that the sequence begins a second pass rather
  than stopping.
- Notes live in one browser. Take backups.

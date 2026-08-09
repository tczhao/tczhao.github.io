# Tare

What survives fees, tax, inflation and you. One entry a day on personal finance
in Australia, and the entry stays shut until you have done its arithmetic against
your own figures.

## Running it

```
npm run build     # inline the shared engine and this corpus into dist/index.html
npm test          # engine behaviour plus this site's contracts
npm run check     # both
```

The engine lives in `../_shared` and is shared with every other site in this
family. `dev.html` links it in place, so open that for local work and there is no
build step in the loop. `dist/index.html` is the shippable artifact: one file, no
external requests, works offline.

## How a day works

1. The entry opens with a situation and a question, and nothing else. Above the
   fold there is a number to work out, not a number to read.
2. If the sum needs figures the site does not have yet, it asks for those first -
   only the ones today's expression actually names.
3. You write your answer. The site computes its own and keeps the signed gap.
4. The entry opens: the claim, its citation, its verdict, the mechanism, and
   something to run against your own position.

## The two gates

**The arithmetic gate.** Every entry whose answer is a number you can derive
declares it as an expression over a small profile of your own figures. The entry
will not reveal its figure until you have written yours. What it stores is the
signed gap rather than a mark, because the useful quantity is which direction you
are consistently wrong in - a reader reliably optimistic about their own tax
position learns more from the lean than from a score.

Profile figures live in this browser under the same versioned key as everything
else, are included in the export, and are never sent anywhere.

**The evidence gate.** Every entry carries a citation, the numbers behind it, and
one of seven verdicts. `build.js` refuses to build without them.

| Verdict | Means |
| --- | --- |
| `replicated` | independently re-run on new data, effect held |
| `single` | one study or one team, never repeated. Not disputed, untested |
| `contested` | credible teams reach different conclusions |
| `failed` | re-run preregistered, the effect did not appear |
| `overclaimed` | real effect, far smaller than the popular version |
| `craft` | practitioner knowledge, no controlled evidence |
| `statute` | a legislated fact. Carries `asAt` and `sourceUrl` |

`single` and `overclaimed` exist because a four-value version of this list had
nowhere to put a never-repeated study or a redundant construct, and both ended up
filed as something stronger than the evidence supports.

Intervals are optional here and `requireInterval` is off, because much of the
useful evidence in this field is historical simulation over overlapping periods,
which has a failure rate and a SAFEMAX but no confidence interval. Where an
interval *is* given, both bounds are mandatory - a one-sided quote manufactures
precision, and that is the failure this gate exists to prevent.

## The cheatsheet

`cheatsheet: { verdicts: ['statute', 'replicated'] }` adds a tab holding the nine
entries here that are actually settled. That filter is the opposite of Nomogram's,
which takes only `replicated`, and it is the opposite for a reason: this corpus
has exactly one replicated finding and ten resting on a single study, so a
replication filter would produce a one-row page that told you nothing.

What is genuinely settled in this material is the legislation. A cap is a cap
because somebody wrote it down, and every statute entry carries the date it was
true and a link to the primary source. Those dates ride along onto the row, so a
figure never appears without the year it belongs to - which matters more here than
anywhere else, because statute moves every July.

The one replicated finding rides along because it earned it.

## Citation rot

Expiry retires a claim the author already knew would go stale. `reverifyDays`
retires the author's confidence in one they thought was settled: any entry whose
`verifiedOn` is more than 180 days old renders dashed and marked. Nothing leaves
the sequence, because a stale citation is still true more often than not. It is
just no longer checked.

Roughly half this corpus is statute, and statute moves every July.

## Layout

```
site.js               config, profile fields, palette, every visible string
content/*.js          one file per track
../_shared/engine/    app.js, expr.js, the stylesheets, the page shell
../_shared/lib/       build.js, themes.js, check-file.js
../_shared/test/      engine behaviour and per-site contracts
```

`../_shared/engine/expr.js` is the arithmetic evaluator. It is not `eval` and not
a `Function` constructor: this page holds the reader's own financial figures, and
an expression is content rather than code. The grammar is an allowlist - decimal
numbers, declared identifiers, four operators, brackets and a leading sign - so a
call, a subscript or a property access never reaches an evaluator. `build.js`
compiles every expression and checks its identifiers against the declared
profile, which is what stops a typo surfacing as a blank answer months later on
the one day that entry comes up.

## Known limits

- The corpus is short and deliberately so. Entries are added when their sources
  have been read, not to fill a calendar.
- Three tracks that belong here are not listed, because nothing has been checked
  for them yet: risk capacity and sequence, property and leverage, the behaviour
  gap. An empty track is a promise the corpus has not kept.
- Notes and profile live in one browser. Take backups from Progress.

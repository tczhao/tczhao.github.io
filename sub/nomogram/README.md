# Nomogram

What training does, and how well that is known. One entry a day on physical
capacity, and you write down how big you think the effect is before the paper
tells you.

30 entries across six tracks: cardiorespiratory fitness, strength and resistance,
ageing curves, sleep and measurement, load and injury, and signal versus noise in
nutrition.

## Running it

```
npm run build     # inline the shared engine and this corpus into dist/index.html
npm test          # engine behaviour plus this site's contracts
npm run check     # both
```

The engine lives in `../_shared` and is shared with every other site in this
family. `dev.html` links it in place; `dist/index.html` is the shippable
artifact, self-contained and offline.

## The interval is the point

`requireInterval` is **on** here, unlike Tare. Sports medicine and exercise
physiology report confidence intervals as a matter of course, so an entry without
one is a signal the paper was not read properly rather than a finding that
genuinely lacks an interval. `build.js` refuses to build a measured claim that
has no interval, and refuses one that has only a single bound.

That second rule exists because of a specific miss. An earlier draft of the
protein entry quoted Morton's breakpoint as "1.62 g/kg/day, with the interval
extending to roughly 2.2" and omitted that the lower bound is 1.03 - which is to
say the breakpoint is estimated so imprecisely it is compatible with roughly the
general-population RDA doubled. One bound reads as precision. Both bounds read as
what was actually measured.

## Verdicts

Every entry carries one of seven, and the mix is deliberately unflattering:

| Verdict | Means |
| --- | --- |
| `replicated` | independently re-run on new data, effect held |
| `single` | one study or one team, never repeated. Not disputed, untested |
| `contested` | credible teams reach different conclusions |
| `failed` | re-run preregistered, the effect did not appear |
| `overclaimed` | real effect, far smaller than the popular version |
| `craft` | practitioner knowledge, no controlled evidence |
| `statute` | a legislated or official fact. Carries `asAt` and `sourceUrl` |

The sleep track is where the popular literature is furthest ahead of its
evidence, and it is written to say so. Consumer trackers detect over 90% of sleep
epochs but at a specificity of roughly 29 to 52%, which means they call almost
everything sleep - so they overestimate total sleep time in exactly the people
who need the measurement.

## The cheatsheet

`cheatsheet: { verdicts: ['replicated'] }` adds a tab that is the exact opposite
of the rest of the site. Everything else here is built to slow you down; that
page is built to be read at speed, which is why it is restricted to the one
verdict that survived being re-run by somebody else. Fourteen of thirty entries
qualify.

The filter is derived rather than chosen. The corpus already grades its own
evidence, so the cheatsheet reads that grade instead of asking the author which
entries they rate - which would put the judgement straight back into the one
place this site takes it out of. Sites whose corpus carries no verdict use the
opt-in form, `cheatsheet: true`, where an entry appears if it was written a
`cheat` line; that is a selection and those pages say so.

Each row leads with what to do and demotes the claim to the line underneath it,
which is the inverse of the library. By the time you are on the cheatsheet you
have read the entry - what you have forgotten is the consequence, not the
finding. Both bounds of the interval travel with the row, because a cheatsheet
is precisely where a number gets laundered into sounding settled.

The other sixteen entries are not hidden, they are counted. A page showing
fourteen findings without saying sixteen were withheld would read as the whole
corpus, and this site exists to make the thinness visible. `build.js` refuses a
`cheat` line on any verdict other than `replicated`, and refuses a `replicated`
entry that has no `cheat` line.

## Citation rot

`reverifyDays` is 180. An entry whose `verifiedOn` is older than that renders
dashed and marked as not re-checked. Nothing leaves the sequence: a stale
citation is usually still true, it is just no longer checked.

## How this corpus was built

Drafted with primary-source search, then independently fact-checked by a separate
pass instructed to refute rather than agree, then revised against those verdicts.
Of 30 entries in this site, 10 came back clean and 20 needed correction. Entries
whose central claim did not survive the check were dropped rather than softened.

Two errors caught in that pass are worth recording, because both would have
passed any automated field check:

- Sensitivity and sleep-staging accuracy figures attributed to a meta-analysis
  that states explicitly that it did not assess staging performance. Real numbers,
  bolted onto a citation that disclaims them.
- An entry citing a paper whose conclusion is that consumer devices are *not*
  reliable for total sleep time, in support of the claim that total sleep time is
  usable.

## Known limits

- 30 entries is a month. Entries are added when their sources have been read.
- Nothing here is medical advice, and several tracks describe evidence that is
  contested on purpose.
- Notes live in one browser. Take backups from Progress.

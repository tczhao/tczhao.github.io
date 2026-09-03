# Standing Order

The wealth that comes from what you install, not what you know. One entry a day, and
the entry stays shut until you have written the instruction you would actually set up.

## Why this one

The best-established result in personal finance is hostile to the existence of personal
finance writing. Fernandes, Lynch and Netemeyer pooled 168 papers and found that
interventions to improve financial literacy accounted for about a tenth of one percent
of the variance in later financial behaviour, decaying toward nothing inside twenty
months. Kaiser, Lusardi, Menkhoff and Urban restricted the pool to randomised trials
and recovered a real effect of roughly a tenth of a standard deviation, which is small
but not zero.

Take the generous number. Then put it beside what a single administrative change buys:
retirement plan participation moving from the high thirties to the mid eighties in
percentage points, contribution rates tripling over three years, automatic contributions
passing through to total saving at around eighty-five cents in the dollar while a tax
subsidy delivers about one. Those are not tenths of a standard deviation. They are step
changes, and they arrive without anybody understanding anything.

So a site that teaches you things is the wrong shape. Every entry here terminates in an
instruction you set up once and then forget about. Reading this is not the mechanism.
The standing order is.

## What is different about it

**The gate asks for the instruction, not the answer.** Every entry opens with a
situation and closes above the fold, and it stays shut until you have written the
amount, the day it runs, and the accounts either end. That is deliberately not the
arithmetic gate its sibling uses. You cannot compute a standing order, and what
transfers here is having written one.

**The forecast book scores your own follow-through.** Roughly a third of entries seed a
forecast about your behaviour rather than about markets: will this transfer still be
running in ninety days. You set a probability, the page keeps a Brier score and a
calibration plot, and Brier is mean squared error against the outcome, so lower is
better and always saying fifty percent scores exactly 0.25.

That is the only mechanic here that cannot be argued with. A site about habits whose
readers install nothing would otherwise feel productive for months. Two counters make
the difference visible: instructions written measures installs, and the Brier score
measures whether you know yourself.

## Tracks

| Track | Entries |
| --- | --- |
| Defaults and automation | 16 |
| The savings rate arithmetic | 15 |
| Commitment and friction | 16 |
| What you control and what you forecast | 15 |
| Earnings and human capital | 15 |
| Shocks, windfalls and ruin | 15 |
| Where the money sits | 14 |
| What this field does not know | 14 |
| Building the thing that survives you | 15 |

Ordered so the opening cycle runs from the mechanism that works without you through to
the part no instruction can carry. Each track file is ordered foundational first, so the
first cycle serves the most foundational entry from every track before anything
advanced.

## Levels

Not a difficulty scale. An escalation in how much of you the thing needs, which is the
only dimension that matters once you accept that attention is the scarce input.

| Level | Means |
| --- | --- |
| `standing` | set once, runs without you |
| `annual` | wants one afternoon a year |
| `judgement` | cannot be delegated to an instruction at all |

## The evidence gate

Every entry carries a citation, what was actually done to get it, and one of seven
verdicts. `build.js` refuses to build without them.

| Verdict | Means |
| --- | --- |
| `replicated` | independently re-run on new data, effect held |
| `single` | one study or one team, never repeated. Not disputed, untested |
| `contested` | credible teams reach different conclusions |
| `failed` | re-run preregistered, the effect did not appear |
| `overclaimed` | real effect, far smaller than the popular version |
| `craft` | practitioner knowledge, no controlled evidence |
| `statute` | a legislated fact. Carries `asAt` and `sourceUrl` |

`craft` is load-bearing here rather than an admission of defeat. There is no randomised
trial on how to name a bank account, and most of the install mechanics in the last track
are genuinely craft. An entry whose `evidence` field opens "No trial." and then gives
the operational rationale is doing its job. A fabricated citation would not be.

`overclaimed` gets heavy use, because this field is full of findings that are real and
sold far past their effect size, and saying so is the most useful thing the site does.

`requireInterval` is off, for the same reason it is off in Tare and Andon. The strongest
evidence here is natural experiments and administrative data - Danish tax records,
Norwegian wealth registers, Swedish lottery registers, plan switchovers at single firms -
and those report a point estimate against an enormous n rather than a quoted interval.
Demanding both bounds would buy invented numbers rather than rigour. Where a source does
report an interval the entry carries it, and both bounds are mandatory, because a
one-sided quote manufactures precision and that is the failure the gate exists to
prevent.

## The cheatsheet

`cheatsheet: { verdicts: ['replicated', 'statute'] }`. One tab, read at speed, holding
only the entries that rest on a finding that has actually been replicated or on a number
somebody legislated. Every other verdict is withheld, and the page states how many
entries it left off rather than implying the list is the corpus.

The list is short. That shortness is the editorial claim, not a gap. Most of what gets
said confidently about building wealth rests on one study, on one country's best century,
or on nothing at all.

## Citation rot

`reverifyDays: 180` marks any entry whose `verifiedOn` is more than six months old as
dashed and unchecked. Nothing leaves the sequence, because a stale citation is still true
more often than not. It is just no longer checked.

This matters most for the statute entries, which move every July.

## The boundary with Tare

There are two personal finance sites in this family and they are not the same site.

**Tare** is defensive: what survives fees, tax, inflation and you. Australian statute,
fee arithmetic, superannuation caps, property and leverage, sequence risk, safe
withdrawal rates. Its gate is arithmetic - you compute a number against your own figures
before the entry opens.

**Standing Order** is accumulative: what you install so that saving happens while you
are not thinking about it. Defaults, commitment, savings rate, income, account
architecture. Its gate is an instruction.

Where the two touch, Tare owns it. Nothing here recomputes Australian fee drag, super
caps, Division 293, gearing or withdrawal rates.

## Running it

```
npm run build     # validate the corpus, then inline everything into dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

`dist/index.html` is the shippable artifact: one file, no external requests, works
offline. `dev.html` is the same page with its parts still linked, for iterating without a
build step. Neither needs a server.

To validate one track while writing it, before its siblings exist:

```
node ../_shared/lib/check-file.js content/03-commitment.js
```

## How a day works

1. Due recall cards from earlier entries come first. Recall before reading, because
   pulling something back out of your head is what moves it.
2. Today's entry opens with a situation and a question, and nothing else. It stays shut
   until you have written an instruction of your own.
3. The entry opens: the claim, its citation, its verdict, the mechanism, what it costs to
   get wrong, and the instruction written out.
4. Install it. Log it. The entry joins the review rotation and the streak advances.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote, so the conversation starts from your real position rather than the
abstraction.

## The build refuses bad content

`lib/build.js` checks required fields, unique slug ids, known tracks and levels, that
every track has entries, that a declared mechanic is actually used and an undeclared one
is not, that statute entries carry a date and a primary source, and that forecast dates
parse. It also scans the raw source for mistyped escapes, because `\P` parses silently to
`P` and a swallowed paragraph break is otherwise invisible until you happen to land on
that day's entry. Em dashes fail the build.

The cheatsheet filter is enforced in both directions: an entry with a qualifying verdict
and no cheat line is a hole in the page, and a cheat line on a verdict that never renders
is dead content. Both are silent without the check.

## Layout

```
site.js               config, gate copy, palette, every visible string
content/*.js          one file per track, ordered foundational first
../_shared/engine/    app.js, expr.js, the stylesheets, the page shell
../_shared/lib/       build.js, themes.js, check-file.js
../_shared/test/      engine behaviour and per-site contracts
```

The engine is shared with every other site in this family, so a fix here is a fix
everywhere and a regression here is a regression everywhere. Run `npm test` in a sibling
before changing anything under `_shared`.

## When to abandon it

If instructions written has not moved in a month, stop reading this and go set up one
transfer. The site would then be exactly the thing its own first entry warns you about:
financial education, working at about a tenth of one percent.

If the Brier score on your own follow-through is worse than 0.25 after twenty resolved
forecasts, you are systematically wrong about what you will do, and the useful response
is smaller instructions rather than better ones.

## Known limits

- Not opened in a real browser. The engine is tested by driving the shipped `app.js`
  against an injected DOM, and every entry renders through that harness, but nothing here
  has verified the visual result.
- Citations were written from knowledge of the literature and self-checked, not fetched
  and read line by line during authoring. Treat a citation as a pointer worth following
  rather than as a fact already established. Where a figure was not certain it was
  written qualitatively rather than invented, which is why the prose says "roughly the
  mid eighties in percentage points" more often than it gives a decimal.
- The `sourceUrl` on statute entries was not fetched. Check it on first read; government
  sites reorganise.
- Most of the strongest commitment evidence comes from randomised trials in the
  Philippines, Kenya and India, on households facing liquidity constraints an Australian
  professional does not. The mechanism probably transports. The effect size does not, and
  the entries say so.
- Notes live in one browser. Take backups from Progress.

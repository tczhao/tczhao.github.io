# Contact Patch

Daily notes on what four hands of rubber can actually do. One mechanism a day, and a log of
what happened the last time you drove it.

30 entries so far, 1.0 months of daily content, across 2 of a planned 9 tracks.

## Why this one

Two halves that argue with each other. The physics half is settled and mostly ignored. The
epidemiology half is settled and mostly unwelcome, because its central finding is that
teaching people the physics does not make them safer.

Both are here on purpose. A site carrying only the first would be a track-day blog. A site
carrying only the second would have nothing to practise.

## What is different about it

**The corpus contradicts its own premise, in the second track, on the record.** `risk-training-does-not-transfer` is
the first entry of the crash-data track and `risk-technique-is-the-small-lever` is the last,
and between them they say that everything in the physics track is true and none of it is
evidence that knowing it will make you safer. The honest reason to learn this material is
that it is interesting and it makes driving a better experience. Claiming a safety benefit
would be doing what the training industry does.

**No review deck.** Knowing that lateral force peaks near seven degrees of slip is trivia at
a desk. The only place it exists is a corner you are already in. So the second tab is a
dated record of what happened the last time you drove, which is the only review a
procedural skill responds to. Same call as Maillard, for a stronger reason.

**Craft is excluded from the cheatsheet, and that exclusion is the editorial claim.** Driving
instruction is mostly craft presented as fact, and a page built to be read at speed is
exactly where that laundering would happen. Two entries here are filed `craft` and say so in
their own evidence line.

**No experiment explores a limit in traffic.** Every `experiment` field is either
observational on a road you were driving anyway, or explicitly requires a closed skid pan or
a hired circuit. `grip-slip-angle` is the only one that asks for a limit at all and it names
the venue. This is a hard rule for the remaining seven tracks.

## Tracks

| Track | Entries |
| --- | --- |
| The contact patch | 15 |
| What the crash data says | 15 |

Seven more planned and none declared, because `build.js` refuses a track with no entries:
load transfer, vision and scanning, braking, line and rotation, low grip, what the
electronics actually do, and one discipline in depth.

## Verdicts

`requireInterval` is off, and the split runs down the middle of the corpus. Crash
epidemiology reports odds ratios with bounds as a matter of course and those entries carry
them. Vehicle dynamics reports measured curves, not confidence intervals, and demanding one
would buy invented numbers rather than rigour.

| Verdict | Entries |
| --- | --- |
| replicated | 20 |
| overclaimed | 3 |
| contested | 2 |
| craft | 2 |
| single | 2 |
| failed | 1 |
| statute | 0 |

Six of the seven are exercised. `statute` is declared in `cheatsheet.verdicts` and empty:
the road-rule and design-rule entries belong there, none have landed, and the build will
demand a cheat line and a primary source link from the first one that does.

## Sources

Milliken and Milliken, *Race Car Vehicle Dynamics*. Hans Pacejka, *Tyre and Vehicle
Dynamics*. Carroll Smith, *Tune to Win*. Paul Haney, *The Racing and High-Performance Tire*.
Ross Bentley, *Speed Secrets*. K. A. Grosch on rubber friction.

Rune Elvik and colleagues, *The Handbook of Road Safety Measures*. The Cochrane review of
post-licence driver education. McEvoy and colleagues in the *BMJ* on mobile phones.
Williamson and Feyer on sleep deprivation. Nilsson's power model and Elvik's re-analyses.
Erke on electronic stability control. Svenson on self-assessment. Horswill and McKenna on
hazard perception.

## Running it

```
npm run build     # inline everything into a single self-contained dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

## Known limits

- **The citations have not been checked against primary sources.** Every `evidence` field was
  written from knowledge of the literature, not from the paper in front of the author. The
  effect sizes and study designs are believed correct and the verdicts are believed
  conservative, but no entry carries `verifiedOn` and `reverifyDays` is deliberately unset,
  because setting either would assert a check that has not happened. Three intervals are
  quoted numerically and are the highest-value things to confirm first: the odds ratio in
  `risk-phone-use-quadruples-it`, the exponent range in
  `risk-fatal-crashes-scale-with-speed`, and the reduction band in
  `risk-esc-is-the-largest-single-gain`. The last of those is a spread of central estimates
  across meta-analyses rather than a confidence interval, and its `measure` string says so.
- Not opened in a real browser. The engine is tested by driving the shipped `app.js` against
  an injected DOM, and all 30 entries render through that harness, but nothing here has
  verified the visual result.
- Notes live in one browser. Take backups from **Progress**.

## When to abandon it

The site's own crash-data track says technique is a small lever. So the test is not whether
it makes you safer, because it will not. The test is whether the drive log has entries in
it. If you have read three weeks of this and never once noticed the thing on an actual road,
the material is not reaching the only place it could exist, and there is nothing here worth
continuing for.

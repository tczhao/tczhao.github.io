# Andon

Daily practice in saying the unwelcome thing, in the room, in time. One move a day,
and the entry stays shut until you have written the sentence you would actually say.

135 entries, 4.4 months of daily content, across 9 tracks.

Named after the cord on a Toyota line that any worker can pull to stop production,
because that is the argument the whole site makes: what determines whether people speak
is the mechanism, not the nerve. A culture that asks for courage is asking the least
powerful person in the room to supply the thing the organisation failed to build.

## Why this one

Every other site in this family gates on a judgement - name the mechanism, put your
number down. This one gates on a sentence, and that is the entire design.

The failure mode of this material is uniquely specific. People read about candour,
agree with all of it, and then say nothing. Agreement is free. Composing the words you
would use, in advance, to a named person, is the only part that survives contact with
the meeting. If the gate asked what you would raise rather than what you would say, the
site would teach nothing.

So every entry opens on a scenario and stays shut until you have typed a sentence of
your own. What you wrote is frozen on commit and kept, which means in six months the
journal is a record of what you were and were not willing to say.

## The evidence gate, and why it earns its place here

No subject is more heavily colonised by social psychology that did not survive.
Asch is quoted as proof that people cave when it shows roughly the opposite two thirds
of the time. The thirty-eight silent witnesses were largely a newspaper's invention.
Groupthink is a vocabulary rather than a finding. Seven per cent of communication is
not the words. A site that teaches you to challenge a confident claim cannot itself run
on folklore, so every entry carries its source and a verdict on how well established it
is.

| Verdict | Entries |
| --- | --- |
| Craft, no trial behind it | 92 |
| Replicated | 17 |
| One study, never repeated | 14 |
| Contested | 8 |
| Real, but overclaimed | 4 |

Craft is the honest majority and not an embarrassment. The two-challenge rule was
written by aviation and adopted by medicine because it works in the room, not because
anyone randomised it. Saying so is more useful than dressing it in a citation.

`requireInterval` is off deliberately. The organisational behaviour literature here
reports coefficients over survey scales, and the aviation and production material has
no trial behind it at all. Demanding an interval would buy invented numbers.

## Tracks

Ordered as the act itself runs. The last two are the ones people skip.

| Track | Entries |
| --- | --- |
| Noticing the disagreement | 15 |
| Framing the objection | 15 |
| The sentence itself | 15 |
| Disagreeing upward | 15 |
| Working the room | 15 |
| Dissent in writing | 15 |
| When it does not land | 15 |
| Being disagreed with | 15 |
| After you have said it | 15 |

Levels grade by what it costs you rather than by seniority, because seniority is the
wrong axis: a staff engineer contradicting a VP in front of the board is doing
something a VP contradicting a peer is not.

## Sources

Amy Edmondson on psychological safety and the nursing-unit inversion. Detert and
Burris on managerial openness, and Detert and Edmondson on implicit voice theories.
Morrison and Milliken on organisational silence. Hirschman, *Exit, Voice, and Loyalty*.
Charlan Nemeth on authentic versus assigned dissent. Argyris on defensive routines and
the left-hand column. Diane Vaughan on normalisation of deviance. Fischhoff on
hindsight. Tetlock on expert judgement and the forecasting tournaments. Stasser and
Titus on shared information. Staw on escalation of commitment. Kluger and DeNisi on
feedback interventions. Sherman Kent on estimative words.

Crew resource management and the TeamSTEPPS two-challenge and CUS scripts. Ohno and
the Toyota Production System. The Rogers Commission record of Roger Boisjoly's July
1985 memo, and the Columbia Accident Investigation Board on the imagery requests and
the email that was drafted and not sent.

## The two accident cases point in opposite directions

Both sit in the written-dissent track and they are there together on purpose.

Boisjoly wrote the memo more than six months in advance, named the failure mode, and
named the consequence in the plainest available terms. The launch happened. Being right
in writing is what made the investigation possible and it is not a mechanism that stops
anything.

Rocha drafted the email and did not send it, later describing his reluctance to be seen
as an alarmist. A warning always looks disproportionate before the event and obvious
after it, and rereading a draft makes it worse rather than better.

Write it down, and do not mistake having written it for having prevented anything.

## The cheatsheet

The one view that is not a study aid. Everything else here is built to slow you down;
this tab is built to be read at speed, because in the moment you need a sentence you
will not be composing prose.

Nothing in this corpus derives a filter from its verdicts, and a verdict filter would
be the wrong instrument anyway: the rows worth carrying are sentences, and sentences
are craft, so filtering on `replicated` would produce a near-empty page implying the
useful material was the thin research rather than the thick practice.

So the row is opt-in and the bar is mechanical: **an entry earns a row only if the line
hands you words to say.** 40 rows out of 135. The 95 withheld explain why something
works rather than giving you wording, and the page states that count rather than
implying 40 is the whole corpus.

## Running it

```
npm run build     # inline everything into a single self-contained dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

`dist/index.html` is the shippable artifact: one file, 745 KB, no external requests,
works offline. `dev.html` is the same page with its parts still linked, for iterating
without a build step. Neither needs a server.

## How a day works

1. If cards are due from earlier entries, they come first. Answer them out loud, in the
   words you would use. Recognising the move is not the skill; producing the sentence
   with your pulse up is.
2. Today's scenario. Write the sentence you would actually say, to that person, in that
   room. The entry does not open until you have.
3. The entry: the move, what is behind it, why it works, how it goes wrong, and the
   wording. Then something to use this week.
4. Log what you actually said, to whom, and what happened.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote, so the conversation starts from the conversation you actually have
to have rather than the abstraction.

## Layout

```
site.js           the whole identity: key, tracks, copy, mechanics, palette
content/*.js      nine track files, ordered foundational first
```

The engine, build and tests live in `../_shared` and are shared with every sibling
site. `lib/build.js` refuses to build on a bad corpus: it checks required fields,
unique slug ids, known tracks and levels, that every declared mechanic is used and no
undeclared one is, and that verdicts are from the permitted set. It scans the raw
source for mistyped escapes, because `\P` parses silently to `P`, and for lone `\n`,
because paragraphs break on `\n\n` and a single one renders as a space. Em dashes fail
the build.

`test/site.test.js` additionally refuses any `gateIntro` that shares a seven-word
sequence with its own `idea` or `why`, which is how a scenario leaks its answer in
practice.

## Known limits

- Not opened in a real browser. Every entry is rendered through an injected DOM in the
  test harness and the stylesheet is checked by static contract, but nothing here has
  verified the visual result.
- Sources were written and self-checked by the author. They have not been
  independently verified against the original works. Treat a citation as a pointer
  worth following rather than as a fact already established, which is advice this
  particular site should be held to more strictly than most.
- The verdicts are one person's calls. Where a body of work is large and mixed,
  compressing it to one of six labels loses information, and the `evidence` field
  rather than the chip is where the actual claim lives.
- 135 entries is 4.4 months. After that the sequence begins a second pass.
- Notes live in one browser. Take backups from **Progress**.

## When to abandon it

If the journal shows you drafting sentences and the reflection field shows you never
said any of them, this is not working and reading more entries will not fix it. The
number that matters is in the second field, not the first.

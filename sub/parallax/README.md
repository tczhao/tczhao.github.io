# Parallax

What you sent and what they received. One move a day, and the rewrite stays shut until
you have written down how your own draft is about to be misread.

45 entries, 1.5 months of daily content, across 9 tracks.

Named after the apparent shift of an object against its background when the observer
moves, because that is the claim the whole site makes: the message you sent and the
message they received are two different objects, and the difference is not carelessness.
It is geometry. You are standing somewhere else, holding context they do not have.

## Why this one, when Compositor and Andon already exist

The seam is deliberate and worth stating, because all three sit in the same room.

**Compositor** works on how a sentence reads, drilled on paragraphs you wrote.
**Andon** works on whether you say the unwelcome thing at all. Parallax starts after
both: the thing is worth saying, the prose is fine, and the reader still took away
something you did not send. The unit here is a whole message and the axis is the
reader's position rather than the quality of the writing.

The founding example is a true reply that failed. Every clause in it was accurate, the
policy behind it was right, and it read to its recipient as a brush-off, because the
sentence establishing that their week had counted was in last place and the triage
policy was in first. Nothing in Compositor's toolkit catches that. It is not a sentence
problem.

## The gate, and why it is predict-the-misread

Every entry opens on a draft and stays shut until you have written what the reader will
take away from it.

The alternative was the obvious one, rewrite the draft before the worked version opens,
which is Compositor's gate applied to whole messages. It teaches the fix for the entry
in front of you. The misread is the half that generalises, because in six months you
will not remember the moves and you will still have to look at your own draft from the
other chair. Getting the misreading down in writing, before the rewrite opens, is the
only version of that skill you can practise alone.

What you write is frozen on commit, which means the journal becomes a record of how
often you could see it coming before somebody told you.

## The evidence gate

On, and it earns its place here. This subject is more heavily colonised by confident
folklore than almost any other: the seven per cent figure, the belief that tone survives
text intact, the tapping study quoted as a measurement when it is one unpublished
dissertation. A site about being misread cannot itself run on claims nobody checked.

| Verdict | Entries |
| --- | --- |
| Craft, no trial behind it | 36 |
| Replicated | 5 |
| Real, but overclaimed | 2 |
| Contested | 1 |
| One study, never repeated | 1 |

Craft is the honest majority and not an embarrassment. Nobody has tested whether putting
the verdict on somebody's contribution in sentence one changes whether they report
again, and nobody is going to. Saying so is more useful than dressing it in a citation.

The five entries that do rest on real findings are load-bearing in a different way: the
curse of knowledge, the negativity asymmetry, reference dependence, estimative words,
and the feedback meta-analysis where over a third of interventions made performance
worse. The two `overclaimed` entries exist because this corpus would be dishonest
without them. One is the 7-38-55 figure, which measured how listeners infer liking from
a single word in a contradicting tone. The other is the scanning research, where the
serial position work was done on word lists and the F-pattern on early web pages, and
neither was measured for the medium you write in.

`requireInterval` is off deliberately. What research exists here reports effects over
survey scales and small lab tasks, and the ordering claims that make up most of the
corpus have never been isolated by anyone. Demanding an interval would buy invented
numbers.

## Tracks

Ordered as drafting runs. The last three are the ones people skip.

| Track | Entries |
| --- | --- |
| The live question | 5 |
| Where the answer goes | 5 |
| Standing | 5 |
| The boundary | 5 |
| This case, not the policy | 5 |
| What it will read as | 5 |
| Distance | 5 |
| The commitment | 5 |
| After it lands | 5 |

Levels grade by how far the message travels and how hard it is to take back. A reply
reaches one person who can ask you what you meant. A broadcast reaches people who
cannot. Something on the record is read later, by people who were not there, with none
of the context that made it sound reasonable at the time.

## The cheatsheet

40 rows of 45. The bar is mechanical: an entry earns a row only if the line hands you
something to do to a draft. The five withheld are diagnoses rather than moves. Two are
corrections to folklore, and knowing a claim is false is not something you reach for
with a message half-written. Two are about reading a situation before you draft. One is
the four-way taxonomy of why a message failed, which is work you do afterwards.

That ratio is high compared with the sibling sites, and it is honest rather than lax:
this subject really is mostly moves. The page states the withheld count rather than
implying 40 is the whole corpus.

## Sources

Peter Block on the presenting problem. Barbara Minto on the pyramid. Camerer,
Loewenstein and Weber on the curse of knowledge, and Elizabeth Newton's tapping study,
which is an illustration rather than a measurement. Kluger and DeNisi's meta-analysis of
feedback interventions. Kruger, Epley, Parker and Ng on egocentrism over email. Albert
Mehrabian's 1967 experiments, and what was done with them afterwards. Baumeister,
Bratslavsky, Finkenauer and Vohs on the negativity asymmetry, with Rozin and Royzman
alongside. Kahneman and Tversky on reference dependence. Brown and Levinson on face, and
the cross-cultural work contesting it. Sherman Kent on words of estimative probability.
Chris Argyris on the left-hand column. Detert and Burris on managerial openness.
Mitigated speech from aviation crew resource management, and operational reporting
convention on labelling a message by what it obliges.

## Running it

```
npm run build     # inline everything into a single self-contained dist/index.html
npm test          # engine mechanics, then this site's contracts
npm run check     # both
```

`dist/index.html` is the shippable artifact: one file, 353 KB, no external requests,
works offline. `dev.html` is the same page with its parts still linked, for iterating
without a build step. Neither needs a server.

## How a day works

1. If cards are due from earlier entries, they come first. Answer with the move rather
   than the principle. Knowing that readers drift is not the skill.
2. Today's draft. Write what the reader takes away from it. The entry does not open
   until you have.
3. The entry: the move, what is behind it, why the gap opens, how it goes wrong, and the
   rewrite next to what you predicted.
4. Log what you actually sent and whether the reply told you it landed.

There is also a **Take it further** button that composes a prompt for Claude carrying
whatever you wrote, so the conversation starts from the message you actually have to
send.

## Layout

```
site.js           the whole identity: key, tracks, copy, mechanics, palette
content/*.js      nine track files, ordered foundational first
```

The engine, build and tests live in `../_shared` and are shared with every sibling site.
`lib/build.js` refuses to build on a bad corpus: required fields, unique slug ids, known
tracks and levels, verdicts from the permitted set. It scans raw source for mistyped
escapes, because `\P` parses silently to `P`, and for lone `\n`, because paragraphs
break on `\n\n` and a single one renders as a space. Em dashes fail the build.

`test/site.test.js` additionally refuses any `gateIntro` sharing a seven-word sequence
with its own `idea` or `why`, which is how a draft leaks its own diagnosis in practice.
It caught one during the build of this corpus, in the entry on messages that failed to
land, where the explanation quoted the draft back at itself.

## Known limits

- Not opened in a real browser. Every entry renders through an injected DOM in the test
  harness and the stylesheet is checked by static contract, but nothing here has verified
  the visual result.
- Tile image is a Troughton & Simms theodolite, CC0, credited in `img/tiles/CREDITS.md`.
- Only one entry is drawn from a real message. The remaining 44 scenarios are invented,
  and they are plausible rather than observed. A corpus of this kind is worth what its
  examples are worth, and the flagship entry is better than the rest for exactly that
  reason.
- Tenant identifiers in the worked examples are synthetic. The real ones from the
  original message were replaced, because this repository is public.
- The verdicts are one person's calls, and the sources were self-checked rather than
  independently verified. Treat a citation as a pointer worth following.
- 45 entries is about six weeks. After that the sequence begins a second pass.
- Notes live in one browser. Take backups from **Progress**.

## When to abandon it

If the journal shows you predicting the misread accurately every time and the reflection
field shows the replies you get back have not changed, the diagnosis was never the
bottleneck and this is the wrong instrument. The number that matters is in the second
field.

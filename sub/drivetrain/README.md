# Drivetrain

A daily drill book for the translation between platform work and the business. One entry a
day: a specimen from platform work, a move you make before the entry opens, the worked
answer, and one thing to run at work this week. Old entries resurface as recall questions.

54 entries across nine tracks, about 1.8 months of daily content. This is a first cut; the
tracks are built to take more.

## Why this one

Platform engineers are handed requirements with the business problem already stripped out,
then asked why their updates do not land with the people who fund the platform. The two are
the same gap. The engine room and the business speak different languages, and the
translation between them is a skill that can be practised like any other.

The siblings cover the parts. Gross Margin teaches the finance vocabulary, Compositor the
sentence, Parallax what the reader actually received, Practicum management. None drills the
translation itself: a ticket traced back to the problem it was written for, the problem
priced, the cheapest fix chosen on business terms, the result said outcome first, and a
metric owned afterwards.

The name is the mechanical metaphor and a nod to prior art. An engine's output is worth
nothing until the drivetrain delivers it to the road. Howard, Zwemer and Loukides's
"Drivetrain Approach" (O'Reilly Radar, 2012) makes the same argument about data products:
start from the objective and the levers you control, and build the model last.

## Running it

```
npm run build     # validate the corpus, then inline the shared engine into dist/index.html
npm test          # engine checks against fixtures, then the contracts against this site
npm run check     # both
```

For local development, build once and open `dev.html`. It links the shared engine and
this site's parts in place rather than inlining them. Both `dev.html` and `theme.css` are
generated, and neither is tracked.

`dist/index.html` is the shippable artifact: one file, no external requests, works offline.

## How a day works

1. Due recall cards from earlier entries come first. Answer out loud, in two sentences, as
   if a director had just asked you.
2. Today's entry opens shut. Most entries hand you a specimen and a move: take a ticket, an
   update or a question from your own week, or the specimen if you have nothing to hand,
   and do the move. Commit, and the entry opens with the worked answer beside your attempt.
3. Some entries ask for a number instead. The first time an entry needs one of your
   platform's figures it asks for it; you then write your own estimate, and the page shows
   the figure computed from your numbers and how far off you were.
4. Log what you found. **Take it further** composes a prompt for Claude carrying your
   committed attempt and your log, so the conversation starts from your real situation.

## The two gates

**The specimen gate** is Compositor's mechanism. The gap between your attempt and the
worked answer is the lesson, which is why the answer stays covered until you commit, and
why your attempt is frozen once you do. Every worked answer ends by saying what the move
cost: the number that had to be found, the commitment made in public, the claim that can
now be wrong. A move that costs nothing is not one anybody skips.

**The arithmetic gate** is Tare's. Leading with a number is only possible if you know the
numbers, and most engineers cannot state their company's contract value or customer count.
The profile asks for each figure the first time an entry needs it, never as a settings page
up front. The useful quantity is not any single answer but the direction you are
consistently wrong in. Each entry shows your gap; see the known limits before reading the
aggregate on **Progress**.

| Profile field | Used for |
| --- | --- |
| Paying customers | headroom, cost to serve, churn, revenue share |
| Average annual contract value | cost of delay, churn, revenue share |
| New customers per month | headroom, cost of delay |
| The platform's customer ceiling | headroom |
| Monthly cloud bill | cost to serve, payback, revenue share |
| Loaded cost of an engineer-week | toil, payback, waiting time |
| Engineers on the platform | waiting time |
| Customers lost per year | churn |

All of it is held in the browser, never sent anywhere, and included in the export.

## Tracks

| Track | Entries | What it drills |
| --- | --- | --- |
| The problem behind the ticket | 6 | recovering the problem a ticket was written for |
| How platform work reaches the business | 6 | the four routes: room to grow, retention, margin, velocity |
| Put a number on it | 6 | headroom as a date, cost of delay, ranges, denominators |
| The cheapest thing that works | 6 | no-code options, rigour by cost of failure, payback, subtraction |
| Outcome first | 6 | problem, approach, impact; translating mechanism into consequence |
| Pick the channel | 6 | message, doc or meeting; pre-wiring; the update that survives forwarding |
| Hold the room | 6 | answering the question asked, the distinctions you will be asked about |
| Own a metric | 6 | outcomes over workstreams, baselines, three numbers that pull apart |
| Find the problem nobody assigned | 6 | reading the bets, counting the queue, the one-page proposal |

Each file is ordered foundational first, and the sequence round-robins across tracks, so
the first nine days serve the most foundational entry of every track.

## The rules the corpus was written to

- Every specimen comes from platform work: a ticket, a draft update, a status report, a
  question from a director. The reader assumed throughout is a senior platform engineer.
- Numbers in specimens and worked answers are synthetic and internally consistent, and are
  never attributed to a real company. Where an entry cites a real finding, it was listed
  for fact-checking.
- People are roles, never names. The obstacle in a scene is a problem, a constraint or a
  competing approach, never a colleague behaving badly.
- Every experiment produces a fact or an artifact: a number found, a message sent, a
  question asked, a draft rewritten.
- Sources are summarised rather than quoted, and credited per entry.
- What a sibling already teaches is not taught again. Answer-first and naming the ask live
  in Practicum, finance definitions in Gross Margin, sentence craft in Compositor.

## Layout

```
site.js                 config: tracks, profile, gate, copy, palette
content/*.js            nine track files, ordered foundational first
dist/index.html         the shippable artifact
../_shared/             the engine, the build and the tests, shared with the sibling sites
```

## Design notes

A workshop manual rather than a business book: cool grey service-manual stock, petrol teal
for structure, and safety orange kept for anything that asks you to act. The display face
is DIN, the industrial lettering of engineering drawings and road signs, resolved from
system fonts (DIN Alternate on macOS, Bahnschrift on Windows) because the Artifact CSP
blocks font hosts.

## Known limits

- 54 entries is under two months. After that the sequence begins a second pass rather than
  stopping. The tracks were scoped to take more.
- Sources were self-checked by the writer of each track and then by a separate fact-check
  pass over every source, attribution, figure and worked sum in all 54 entries. One
  co-author's name was wrong and was corrected, nine claims were tightened to what their
  source supports, and nothing had to be removed. A review afterwards fixed three
  technical details in specimens. Several citations were confirmed through the authors'
  own pages and secondary summaries rather than the book text, so treat a citation as a
  pointer worth following rather than as a fact already established.
- The aggregate on **Progress** pools every committed estimate regardless of unit, so a
  three-month miss and a fifty-thousand-dollar miss land in the same median. Read the gap
  on each entry; the aggregate means little here until the engine scores relative error.
- Computed figures print without thousands separators, as in 249230.77 dollars of annual
  contract value.
- The gate cannot tell an attempt from a pasted specimen. **Use this one** fills the box,
  and committing it unedited opens the entry. The specimen is there for days with nothing
  of your own; five in a row is the signal the drill has stopped working.
- Checked in headless Chrome at 1280px and at a true 390px phone layout, in both themes:
  the gate locked and then opened by a commit, the arithmetic gate asking for only the
  three figures its sum needs and then scoring an estimate, and the cheatsheet, library
  and progress views. Not yet used by a person on a real phone.
- Notes and figures live in one browser. Take backups: export and import are in
  **Progress**.

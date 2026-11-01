# Marginalia (批注)

Mao's Selected Works, read for method and checked against the record, in Chinese. One
entry a day: the thesis, the argument, the error the text was written against, what
happened when the idea met practice, and one thing to try at work. Old entries resurface
as recall questions.

150 entries across ten tracks, drawn from all five volumes of 《毛泽东选集》 and
tagged by volume. The page, the entries and the interface are all Simplified Chinese.

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

## Why every entry carries the record

Practicum's sources are management writers whose advice was never tested at the scale of a
country. These were. So `worked`, which other sites use for a worked example, is required
here and shown as 实践记录: what happened when the idea met practice, including where Mao
or the Party broke it. The engine places it straight after the error the text was written
against, so the argument is compared with its outcome before the reader is asked to apply
anything.

The gap is often the lesson. 《反对本本主义》 says a cadre who pronounces without
investigating will fail; in 1959 the defence minister who had investigated the Great Leap
was removed for what he reported. The entry states the 1930 argument at full strength and
lets the record make the comparison.

The rules the corpus was written to:

- The record names its sources in the prose: historians and their books, the Party's own
  1981 resolution, the primary texts. Where scholars disagree about a number, the entry
  gives the range and says so. Anything that could not be sourced was left out.
- Summarise rather than quote. Short phrases from the original appear in “ ” and were
  checked verbatim against the source text; long passages do not.
- What a text says is kept apart from what was done in its name.
- Neither hagiography nor polemic: no epithets in either direction, and no moralising
  sentence at the end of a paragraph.

## The exercises

The reader assumed by every 今天试一试 is a senior platform engineer. War texts transfer to
that work only at the level of method (concentration, sequencing, initiative, timing). The
obstacle in an exercise is always a problem, a constraint or a competing approach, never a
colleague. Texts that do not transfer at all, such as land reform or the suppression
campaigns, are read as history, and their exercise is an analysis of the reader's own
environment rather than a borrowed vocabulary.

## Sources and editions

- Volumes one to four follow the 1991 second edition, which added 《反对本本主义》 (1930)
  to volume one. Volume five follows the 1977 edition. Volume five was published under Hua
  Guofeng and later withdrawn from circulation; it is included because it holds the
  post-1949 texts most often cited, and labelled like the rest.
- The texts are the revised ones. The manuscripts were revised and authorised by Mao
  before the 1950s editions, and the 1991 edition revised the notes. Where an argument
  depends on its date, the entry says the published text is the revised one.
- Source lines give the Chinese title and the date exactly as the edition prints them,
  with the volume, e.g. 《实践论》（一九三七年七月），第一卷. The one change is that a date
  range printed with a dash reads 至, because the house rule bans dashes.
- The working copies were the transcriptions on marxists.org (中文马克思主义文库), checked
  against each page's own title and date line.

## Layout

```
site.js                 config: tracks, the volume facet, copy, palette, language
content/*.js            ten track files, one per theme
dist/index.html         the shippable artifact
../_shared/             the engine, the build and the tests, shared with the sibling sites
```

## Design notes

A reader's working copy rather than a red book: warm book stock, graphite for structure,
and the red pencil kept for anything that asks you to act. Red is the colour the source is
usually dressed in, so here it marks the reader's annotations and never the text. The
display face is a book face with a Song face behind it for the Chinese.

The site declares `lang: 'zh-CN'`, which sets the page language at build time, makes
Listen choose a Chinese voice and Chinese sentence breaks, formats dates in Chinese, and
turns off the browser's faked italics for Chinese text. Every other label comes from the
site's own copy, since the engine's defaults are English.

## Known limits

- The record is a selection. One to three paragraphs cannot carry the historiography of
  the Great Leap or the Anti-Rightist Campaign, and the entries do not pretend to.
- Listen needs a Chinese voice installed in the browser. Without one it says so rather than reading in English.
- The record blocks were fact-checked claim by claim: 470 of the highest-risk claims (numbers, dates, quotations, attributions) were looked up, 396 were confirmed and 15 were corrected, and claims that could not be confirmed were removed or marked as unverified in the text. Claims not among those 470 were not checked. Several entries rest on a single secondary article and say so; check the figures against the source before quoting.
- Notes live in one browser. Take backups.

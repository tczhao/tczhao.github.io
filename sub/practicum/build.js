#!/usr/bin/env node
/*
 * Inlines src/ into a single self-contained dist/index.html.
 *
 * The Artifact CSP blocks every external host, so nothing may stay linked.
 * Validation runs first and refuses to build on a bad corpus - a typo in a
 * lesson is invisible in the rendered page until you happen to land on that
 * day's entry, so it has to fail here instead.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

const TRACKS = [
  'leverage', 'people', 'trust', 'decisions', 'communication', 'systems',
  'strategy', 'influence', 'performance', 'hiring', 'change', 'self'
];
const LEVELS = ['team', 'cross', 'both'];
const REQUIRED = ['id', 'track', 'level', 'title', 'source', 'idea', 'why',
  'failureMode', 'experiment', 'reflection', 'deepDive'];

function contentFiles() {
  return fs.readdirSync(path.join(SRC, 'content'))
    .filter(f => f.endsWith('.js'))
    .sort();
}

/* Raw-source checks. These have to run on the text rather than the parsed
 * strings: `\P` parses silently to `P`, so a mistyped `\n\n` is undetectable
 * after the fact. */
function checkSource(file, text) {
  const errs = [];
  const legal = new Set(['n', '"', "'", '\\', 't', 'r', 'u']);
  const re = /\\(.)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (!legal.has(m[1])) {
      const line = text.slice(0, m.index).split('\n').length;
      errs.push(`${file}:${line} suspicious escape \\${m[1]} (meant \\n?)`);
    }
  }
  if (text.includes('—')) {
    const line = text.slice(0, text.indexOf('—')).split('\n').length;
    errs.push(`${file}:${line} em dash found, use spaced hyphens`);
  }
  return errs;
}

function loadLessons() {
  const win = { LESSONS: [] };
  const errs = [];
  for (const f of contentFiles()) {
    const p = path.join(SRC, 'content', f);
    const text = fs.readFileSync(p, 'utf8');
    errs.push(...checkSource(f, text));
    try {
      new Function('window', text)(win);
    } catch (e) {
      errs.push(`${f}: failed to parse - ${e.message}`);
    }
  }
  return { lessons: win.LESSONS, errs };
}

function validate(lessons) {
  const errs = [];
  const seen = new Set();
  const perTrack = {};
  let cheatRows = 0;

  if (!lessons.length) errs.push('corpus is empty');

  for (const l of lessons) {
    const where = l && l.id ? l.id : '(missing id)';
    if (!l || typeof l !== 'object') { errs.push('non-object lesson'); continue; }

    for (const k of REQUIRED) {
      if (!l[k] || String(l[k]).trim() === '') errs.push(`${where}: missing ${k}`);
    }
    if (!l.recall || !l.recall.q || !l.recall.a) errs.push(`${where}: missing recall q/a`);

    if (seen.has(l.id)) errs.push(`${where}: duplicate id`);
    seen.add(l.id);

    if (!TRACKS.includes(l.track)) errs.push(`${where}: unknown track "${l.track}"`);
    if (!LEVELS.includes(l.level)) errs.push(`${where}: unknown level "${l.level}"`);

    // Sequence order and library links depend on ids being URL-clean slugs.
    if (l.id && !/^[a-z0-9-]+$/.test(l.id)) errs.push(`${where}: id is not a clean slug`);

    /* The cheat line is optional - it is itself the selection of what reaches
       the cheatsheet - so only its shape is checked. A line that runs to a
       second paragraph is a line that was written as prose and will render as
       one unreadable row. */
    if (l.cheat !== undefined) {
      if (String(l.cheat).trim() === '') errs.push(`${where}: cheat is empty`);
      else if (/\n/.test(String(l.cheat))) {
        errs.push(`${where}: cheat must be one line - the cheatsheet renders it as a single row`);
      }
      cheatRows++;
    }

    perTrack[l.track] = (perTrack[l.track] || 0) + 1;
  }

  for (const t of TRACKS) {
    if (!perTrack[t]) errs.push(`track "${t}" has no lessons`);
  }

  // A cheatsheet tab with nothing on it reads as a broken page.
  if (!cheatRows) errs.push('no entry carries a cheat line - the cheatsheet would be blank');

  return { errs, perTrack };
}

function inline() {
  let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(SRC, 'styles.css'), 'utf8');

  html = html.replace(
    '<link rel="stylesheet" href="styles.css">',
    '<style>\n' + css + '\n</style>'
  );

  // A literal </script> inside inlined JS would close the tag early.
  const guard = js => js.replace(/<\/script/gi, '<\\/script');

  for (const f of contentFiles()) {
    const js = fs.readFileSync(path.join(SRC, 'content', f), 'utf8');
    html = html.replace(
      `<script src="content/${f}"></script>`,
      '<script>\n' + guard(js) + '\n</script>'
    );
  }

  const app = fs.readFileSync(path.join(SRC, 'app.js'), 'utf8');
  html = html.replace('<script src="app.js"></script>', '<script>\n' + guard(app) + '\n</script>');

  if (html.includes('src="content/') || html.includes('href="styles.css"') || html.includes('src="app.js"')) {
    throw new Error('inlining incomplete - a src/href reference survived');
  }
  return html;
}

function main() {
  const { lessons, errs: loadErrs } = loadLessons();
  const { errs: valErrs, perTrack } = validate(lessons);
  const errs = [...loadErrs, ...valErrs];

  if (errs.length) {
    console.error('Validation failed:\n');
    errs.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  const html = inline();
  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, 'index.html'), html);

  const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
  console.log(`Built dist/index.html - ${lessons.length} lessons, ${kb} KB`);
  console.log(`Daily content for ${lessons.length} days (${(lessons.length / 30.4).toFixed(1)} months)\n`);
  for (const t of TRACKS) console.log(`  ${String(perTrack[t]).padStart(3)}  ${t}`);
}

main();

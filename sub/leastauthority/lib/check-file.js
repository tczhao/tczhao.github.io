#!/usr/bin/env node
/*
 * Validates a single content file, so a track can be written and checked
 * without every other one existing yet.
 *
 *   node lib/check-file.js <content-file.js>
 *
 * Exits 0 and prints a one-line summary when clean, exits 1 with a list
 * otherwise. Same rules the full build applies, minus the whole-corpus checks
 * (every track populated, ids unique across files) that cannot be answered
 * from one file.
 */
const fs = require('fs');
const path = require('path');
const { loadSite, checkSource, validate, ROOT } = require('./build');

function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node lib/check-file.js <content-file.js>');
    process.exit(2);
  }

  const { config, errs: cfgErrs } = loadSite();
  if (cfgErrs.length) { cfgErrs.forEach(e => console.error(e)); process.exit(1); }

  // Accept a bare filename, a content/-prefixed path, or an absolute one.
  const candidates = path.isAbsolute(file) ? [file] : [
    path.join(ROOT, 'content', file),
    path.join(ROOT, file),
    path.resolve(file)
  ];
  const p = candidates.find(c => fs.existsSync(c));
  if (!p) {
    console.error('no such file. Tried:\n' + candidates.map(c => '  ' + c).join('\n'));
    process.exit(1);
  }

  const text = fs.readFileSync(p, 'utf8');
  const errs = checkSource(path.basename(p), text);

  const win = { LESSONS: [] };
  try {
    new Function('window', text)(win);
  } catch (e) {
    console.error('PARSE ERROR: ' + e.message);
    process.exit(1);
  }

  // Only the tracks this file covers, so a per-file run does not complain that
  // the other tracks are empty.
  const covered = new Set(win.LESSONS.map(l => l.track));
  const scoped = Object.assign({}, config, {
    tracks: config.tracks.filter(t => covered.has(t.id) || covered.size === 0)
  });
  errs.push(...validate(scoped, win.LESSONS).errs);

  win.LESSONS
    .filter(l => !config.tracks.some(t => t.id === l.track))
    .forEach(l => errs.push(`${l.id}: track "${l.track}" is not in site.js`));

  if (errs.length) {
    console.error(`${errs.length} problem(s) in ${path.basename(p)}:\n`);
    errs.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  const words = win.LESSONS.reduce((n, l) =>
    n + [l.idea, l.why, l.failureMode, l.experiment].join(' ').split(/\s+/).length, 0);
  console.log(`OK  ${path.basename(p)}  ${win.LESSONS.length} entries  ` +
    `${[...covered].join(', ')}  ~${Math.round(words / win.LESSONS.length)} words/entry`);
}

main();

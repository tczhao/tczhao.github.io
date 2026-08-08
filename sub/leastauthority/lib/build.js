#!/usr/bin/env node
/*
 * Validates this site's corpus, then inlines the engine and the content into a
 * single self-contained dist/index.html.
 *
 * The Artifact CSP blocks every external host, so nothing may stay linked.
 * Validation runs first and refuses to build on a bad corpus - a typo in an
 * entry is invisible in the rendered page until you happen to land on that
 * day, so it has to fail here instead.
 *
 *   node lib/build.js
 */
const fs = require('fs');
const path = require('path');
const { themeCSS, validatePalette } = require('./themes');

const ROOT = path.join(__dirname, '..');
const ENGINE = path.join(ROOT, 'engine');
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');

const CORE_REQUIRED = ['id', 'track', 'title', 'source', 'idea', 'why',
  'failureMode', 'experiment', 'reflection', 'deepDive'];

function contentFiles() {
  if (!fs.existsSync(CONTENT)) return [];
  return fs.readdirSync(CONTENT).filter(f => f.endsWith('.js')).sort();
}

/* Raw-source checks. These have to run on the text rather than the parsed
 * strings: `\P` parses silently to `P`, so a mistyped `\n\n` is undetectable
 * after the fact. The em dash check enforces a house rule that is otherwise
 * only caught by reading every entry. */
function checkSource(file, text) {
  const errs = [];
  const legal = new Set(['n', '"', "'", '\\', 't', 'r', 'u', '/']);
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

function loadSite() {
  const p = path.join(ROOT, 'site.js');
  if (!fs.existsSync(p)) return { config: null, errs: ['no site.js at the project root'] };
  const win = {};
  try {
    new Function('window', fs.readFileSync(p, 'utf8'))(win);
  } catch (e) {
    return { config: null, errs: [`site.js: failed to parse - ${e.message}`] };
  }
  return { config: win.SITE || null, errs: win.SITE ? [] : ['site.js: did not set window.SITE'] };
}

function loadEntries() {
  const win = { LESSONS: [] };
  const errs = [];
  for (const f of contentFiles()) {
    const text = fs.readFileSync(path.join(CONTENT, f), 'utf8');
    errs.push(...checkSource(f, text));
    try {
      new Function('window', text)(win);
    } catch (e) {
      errs.push(`${f}: failed to parse - ${e.message}`);
    }
  }
  return { entries: win.LESSONS, errs };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function validateConfig(cfg) {
  const errs = [];
  if (!cfg) return ['no config'];
  for (const k of ['key', 'slug', 'name', 'tagline', 'tracks']) {
    if (!cfg[k]) errs.push(`site.js: missing ${k}`);
  }
  if (cfg.tracks && !cfg.tracks.every(t => t && t.id && t.name)) {
    errs.push('site.js: every track needs an id and a name');
  }
  if (cfg.review && !['leitner', 'none'].includes(cfg.review)) {
    errs.push(`site.js: unknown review model "${cfg.review}"`);
  }
  if (cfg.gate && !cfg.gate.label) errs.push('site.js: a gate needs a label');
  errs.push(...validatePalette(cfg.palette).map(e => 'site.js: ' + e));
  return errs;
}

function validate(cfg, entries) {
  const errs = [];
  const seen = new Set();
  const perTrack = {};
  const trackIds = (cfg.tracks || []).map(t => t.id);
  const levelIds = Object.keys(cfg.levels || {});
  const needsRecall = cfg.review !== 'none';
  const extra = cfg.extraRequired || [];

  if (!entries.length) errs.push('corpus is empty');

  for (const l of entries) {
    const where = l && l.id ? l.id : '(missing id)';
    if (!l || typeof l !== 'object') { errs.push('non-object entry'); continue; }

    for (const k of CORE_REQUIRED.concat(extra)) {
      if (!l[k] || String(l[k]).trim() === '') errs.push(`${where}: missing ${k}`);
    }
    if (needsRecall && (!l.recall || !l.recall.q || !l.recall.a)) {
      errs.push(`${where}: missing recall q/a`);
    }

    if (seen.has(l.id)) errs.push(`${where}: duplicate id`);
    seen.add(l.id);

    if (!trackIds.includes(l.track)) errs.push(`${where}: unknown track "${l.track}"`);
    if (levelIds.length && !levelIds.includes(l.level)) errs.push(`${where}: unknown level "${l.level}"`);

    // Sequence order and library links depend on ids being URL-clean slugs.
    if (l.id && !/^[a-z0-9-]+$/.test(l.id)) errs.push(`${where}: id is not a clean slug`);

    // An expiry that does not parse silently never fires, which is the worst
    // outcome for a mechanic whose whole job is to make staleness loud.
    if (l.expires !== undefined) {
      if (!cfg.expiry) errs.push(`${where}: has expires but the site does not enable expiry`);
      if (!ISO_DATE.test(String(l.expires))) errs.push(`${where}: expires "${l.expires}" is not YYYY-MM-DD`);
    }
    if (l.forecast !== undefined) {
      if (!cfg.forecastBook) errs.push(`${where}: has a forecast but the site has no forecast book`);
      if (!l.forecast.q) errs.push(`${where}: forecast has no question`);
      if (l.forecast.resolvesOn && !ISO_DATE.test(String(l.forecast.resolvesOn))) {
        errs.push(`${where}: forecast.resolvesOn "${l.forecast.resolvesOn}" is not YYYY-MM-DD`);
      }
    }
    if (l.gateIntro !== undefined && !cfg.gate) {
      errs.push(`${where}: has gateIntro but the site has no gate`);
    }

    perTrack[l.track] = (perTrack[l.track] || 0) + 1;
  }

  for (const t of trackIds) {
    if (!perTrack[t]) errs.push(`track "${t}" has no entries`);
  }

  return { errs, perTrack };
}

/* A literal </script> inside inlined JS would close the tag early. */
const guard = js => js.replace(/<\/script/gi, '<\\/script');

function assemble(cfg, mode) {
  const shell = fs.readFileSync(path.join(ENGINE, 'index.html'), 'utf8');
  const files = contentFiles();
  const theme = themeCSS(cfg);

  // Written out so the linked dev page picks up palette edits without a
  // separate step. dist inlines the same string rather than re-reading it.
  fs.writeFileSync(path.join(ROOT, 'theme.css'), theme);

  let styles, scripts;
  if (mode === 'dist') {
    const sheets = [
      fs.readFileSync(path.join(ENGINE, 'styles.css'), 'utf8'),
      fs.readFileSync(path.join(ENGINE, 'components.css'), 'utf8'),
      theme
    ];
    styles = '<style>\n' + sheets.join('\n') + '\n</style>';

    const js = [fs.readFileSync(path.join(ROOT, 'site.js'), 'utf8')]
      .concat(files.map(f => fs.readFileSync(path.join(CONTENT, f), 'utf8')))
      .concat([fs.readFileSync(path.join(ENGINE, 'app.js'), 'utf8')]);
    scripts = js.map(s => '<script>\n' + guard(s) + '\n</script>').join('\n');
  } else {
    styles = ['engine/styles.css', 'engine/components.css', 'theme.css']
      .map(h => `<link rel="stylesheet" href="${h}">`).join('\n');
    scripts = ['site.js']
      .concat(files.map(f => 'content/' + f))
      .concat(['engine/app.js'])
      .map(s => `<script src="${s}"></script>`).join('\n');
  }

  let html = shell
    .replace('<!--STYLES-->', styles)
    .replace('<!--SCRIPTS-->', scripts)
    .replace('<title>Daily</title>', `<title>${cfg.name} - ${cfg.tagline}</title>`);

  if (mode === 'dist' && (html.includes('<link rel="stylesheet"') || /<script src=/.test(html))) {
    throw new Error('inlining incomplete - a src/href reference survived');
  }
  return html;
}

function build() {
  const { config, errs: cfgLoadErrs } = loadSite();
  const cfgErrs = cfgLoadErrs.concat(config ? validateConfig(config) : []);
  if (cfgErrs.length) return { errs: cfgErrs };

  const { entries, errs: loadErrs } = loadEntries();
  const { errs: valErrs, perTrack } = validate(config, entries);
  const errs = [...loadErrs, ...valErrs];
  if (errs.length) return { errs };

  fs.mkdirSync(DIST, { recursive: true });
  const html = assemble(config, 'dist');
  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  fs.writeFileSync(path.join(ROOT, 'dev.html'), assemble(config, 'dev'));

  return { errs: [], config, entries, perTrack, kb: Math.round(Buffer.byteLength(html) / 1024) };
}

function main() {
  const r = build();
  if (r.errs.length) {
    console.error('Validation failed:\n');
    r.errs.slice(0, 40).forEach(e => console.error('  ' + e));
    if (r.errs.length > 40) console.error(`  ... and ${r.errs.length - 40} more`);
    process.exit(1);
  }
  console.log(`${r.config.name} - ${r.entries.length} entries, ${r.kb} KB, ` +
    `${(r.entries.length / 30.4).toFixed(1)} months`);
  for (const t of r.config.tracks) {
    console.log(`  ${String(r.perTrack[t.id] || 0).padStart(3)}  ${t.name}`);
  }
}

if (require.main === module) main();

module.exports = { build, validate, validateConfig, checkSource, loadSite, loadEntries, ROOT, ENGINE, CONTENT };

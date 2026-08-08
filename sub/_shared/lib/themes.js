/*
 * Turns a site's palette into token overrides.
 *
 * The base sheet declares dark twice - once under prefers-color-scheme for
 * people who never touch the toggle, once under [data-theme="dark"] so an
 * explicit choice wins. Both carry the same specificity as anything a theme
 * could write into :root, so an override has to restate all three blocks.
 * Doing that by hand six times is six chances to mistype a hex, which is why
 * this generates it instead.
 *
 * Soft and line variants are derived rather than declared. They are always the
 * same colour at a fixed alpha, and a palette that lets them drift is a
 * palette that will drift.
 */

const ALPHA = {
  light: { soft: 0.085, line: 0.30, grid: 0.055, gridMajor: 0.10 },
  dark: { soft: 0.13, line: 0.34, grid: 0.055, gridMajor: 0.085 }
};

function rgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgba(hex, a) {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const REQUIRED = ['paper', 'paperRaised', 'paperSunk', 'gridTint', 'rule', 'ruleStrong',
  'ink', 'inkMuted', 'inkFaint', 'accent', 'accentInk', 'action', 'solid', 'shaky'];

function validatePalette(palette) {
  const errs = [];
  if (!palette) return ['site.js: no palette'];
  for (const mode of ['light', 'dark']) {
    if (!palette[mode]) { errs.push(`palette: missing ${mode}`); continue; }
    for (const k of REQUIRED) {
      const v = palette[mode][k];
      if (!v) errs.push(`palette.${mode}: missing ${k}`);
      else if (!/^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$/.test(v)) {
        errs.push(`palette.${mode}.${k}: "${v}" is not a hex colour`);
      }
    }
  }
  return errs;
}

function tokens(p, mode) {
  const a = ALPHA[mode];
  return [
    ['--paper', p.paper],
    ['--paper-raised', p.paperRaised],
    ['--paper-sunk', p.paperSunk],
    ['--grid', rgba(p.gridTint, a.grid)],
    ['--grid-major', rgba(p.gridTint, a.gridMajor)],
    ['--rule', p.rule],
    ['--rule-strong', p.ruleStrong],
    ['--ink', p.ink],
    ['--ink-muted', p.inkMuted],
    ['--ink-faint', p.inkFaint],
    ['--accent', p.accent],
    ['--accent-ink', p.accentInk],
    ['--accent-soft', rgba(p.accent, a.soft)],
    ['--accent-line', rgba(p.accent, a.line)],
    ['--action', p.action],
    ['--action-soft', rgba(p.action, a.soft)],
    ['--action-line', rgba(p.action, a.line)],
    ['--solid', p.solid],
    ['--shaky', p.shaky]
  ].map(([k, v]) => `  ${k}: ${v};`).join('\n');
}

function themeCSS(cfg) {
  const p = cfg.palette;
  const light = tokens(p.light, 'light');
  const dark = tokens(p.dark, 'dark');
  const face = p.faceDisplay ? `\n  --face-display: ${p.faceDisplay};` : '';

  return `/* ${cfg.name} - theme tokens, generated from the palette in site.js */
:root {
${light}${face}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${dark.split('\n').map(l => '  ' + l).join('\n')}
  }
}

:root[data-theme="dark"] {
${dark}
}
`;
}

module.exports = { themeCSS, validatePalette };

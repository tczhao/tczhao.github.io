"""Generate a self-contained, statically readable timeline from canonical JSON."""
import argparse
import html
import json
import re
from pathlib import Path
from validate_data import validate

ROOT = Path(__file__).resolve().parent
THEMES = {'politics': 'Power & governance', 'economy': 'Economy & trade',
          'geopolitics': 'World affairs', 'health': 'Health & society',
          'rights': 'Rights & freedoms', 'society': 'Population & society',
          'technology': 'Technology & industry', 'climate': 'Climate & energy'}
esc = html.escape


def date_label(event):
    value = event['start']
    precision = event['date_precision']
    if precision == 'year':
        return value[:4] + ' · annual milestone'
    if precision == 'half-year':
        return ('H1 ' if int(value[5:7]) <= 6 else 'H2 ') + value[:4]
    if precision == 'month':
        return value[:7] + ' · month-level date'
    return value + (' → ' + event['end'] if event['end'] else '')


def event_html(event, names, by_id):
    parts = [f'<article class="event {esc(event["themes"][0])}" id="{esc(event["id"])}">',
             '<div class="meta"><span>' + esc(' · '.join(THEMES[t] for t in event['themes'])) + '</span>',
             f'<span>{esc(date_label(event))}</span></div>',
             '<p class="event-countries">' + esc(' / '.join(names[c] for c in event['countries'])) + '</p>',
             f'<h3>{esc(event["title"])}</h3><p class="facts">{esc(event["facts"])}</p>',
             '<details><summary>Explore context &amp; reflections</summary>']
    for label, key in [('Context & interpretation', 'interpretation'), ('Consequences', 'consequences'), ('General reflection', 'reflection')]:
        parts.append(f'<div class="{key}"><h4>{esc(label)}</h4><p>{esc(event[key])}</p></div>')
    if event.get('affected_groups'):
        parts.append('<h4>Affected groups</h4><p>' + esc(' · '.join(event['affected_groups'])) + '</p>')
    if event['related_events']:
        parts.append('<div class="connections"><h4>Connected events</h4><ul>')
        for link in event['related_events']:
            target = esc(link['id'])
            parts.append(f'<li><a href="#{target}" data-event-link="{target}">{esc(by_id[link["id"]]["title"])}</a><span> — {esc(link["relationship"])}</span></li>')
        parts.append('</ul></div>')
    parts.append('<div class="sources"><h4>Read the sources</h4>')
    for source in event['sources']:
        parts.append(f'<div class="source"><a href="{esc(source["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{esc(source["title"])} ↗</a><small>{esc(source["publisher"])} · Accessed {esc(source["accessed"])}</small><small>{esc(source["supports"])}</small></div>')
    parts.append('</div></details></article>')
    return '\n'.join(parts)


def generate():
    validate(ROOT, quiet=True)
    data = json.loads((ROOT / 'data/events.json').read_text())
    gdp = json.loads((ROOT / 'data/gdp.json').read_text())
    data['coverage_note'] = 'Curated coverage in every year for all ten economies. Depth varies: China retains the largest initial collection. Shared events are stored once.'
    names = {country['id']: country['name'] for country in data['countries']}
    by_id = {event['id']: event for event in data['events']}
    years = sorted({event['start'][:4] for event in data['events']})
    sections = []
    for year in years:
        sections.append(f'<section class="year-section" data-year="{year}"><h2 class="year" id="year-{year}">{year}</h2><p class="year-summary">{esc(data["year_summaries"][year])}</p>')
        sections.extend(event_html(event, names, by_id) for event in data['events'] if event['start'].startswith(year))
        sections.append('</section>')
    options = ['<optgroup label="Top ten · 2025 nominal GDP">']
    options.extend(f'<option value="{esc(country)}">{esc(names[country])}</option>' for country in data['cohort'])
    options.append('</optgroup><optgroup label="Connections only · partial coverage">')
    options.extend(f'<option value="{esc(country["id"])}">{esc(country["name"])} (connections)</option>' for country in data['countries'] if country['id'] not in data['cohort'])
    options.append('</optgroup>')
    rows = []
    for country in gdp['countries']:
        observation = next(row for row in country['series'] if row['year'] == gdp['selection_year'])
        count = sum(country['id'] in event['countries'] for event in data['events'])
        rows.append(f'<tr><td>{country["selection_rank"]}</td><td>{esc(country["name"])}</td><td>{observation["value_usd"] / 1e12:.3f}</td><td>{count}</td></tr>')
    # A JSON script is inert, but HTML still recognizes its closing tag. Escape HTML-sensitive characters.
    embedded = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('&', '\\u0026').replace('<', '\\u003c').replace('>', '\\u003e').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    values = {
        'CSS': (ROOT / 'timeline.css').read_text(), 'JS': (ROOT / 'timeline.js').read_text(),
        'EVENT_COUNT': str(len(data['events'])), 'SOURCE_COUNT': str(len({source['url'] for event in data['events'] for source in event['sources']})),
        'GDP_UPDATED': esc(gdp['source_updated']), 'GDP_REPORTING': str(gdp['reporting_economies_by_year'][str(gdp['selection_year'])]),
        'GDP_ROWS': '\n'.join(rows), 'COUNTRY_OPTIONS': '\n'.join(options),
        'THEME_BUTTONS': '<button type="button" data-theme="all" class="selected" aria-pressed="true">All threads</button>' + ''.join(f'<button type="button" data-theme="{key}" aria-pressed="false">{esc(value)}</button>' for key, value in THEMES.items()),
        'YEAR_LINKS': ''.join(f'<a href="#year-{year}" data-year="{year}">{year}</a>' for year in years),
        'EVENTS': '\n'.join(sections), 'EDITORIAL': esc(data['editorial_note']), 'DATA': embedded,
        'RESEARCHED': esc(data['researched_on']), 'SCOPE': esc(data['coverage_note'])}
    template = (ROOT / 'templates/index.html').read_text()
    return re.sub(r'__([A-Z_]+)__', lambda match: values[match.group(1)], template)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify the generated HTML is current without writing it')
    args = parser.parse_args()
    content = generate()
    output = ROOT / 'index.html'
    if args.check:
        if not output.exists() or output.read_text() != content:
            raise SystemExit('index.html is stale. Run python3 world-history-learning/build.py')
        print('Generated HTML is current.')
    else:
        temporary = output.with_suffix('.html.tmp')
        temporary.write_text(content)
        temporary.replace(output)
        print(f'Generated {output} ({len(content.encode()):,} bytes). Open it directly; no server needed.')


if __name__ == '__main__':
    main()

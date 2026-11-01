"""Check portable timeline data before rendering or extending the collection."""
import json
from collections import Counter
from datetime import date
from pathlib import Path
from urllib.parse import urlparse


def validate(root=None, quiet=False):
    root = Path(root) if root else Path(__file__).resolve().parent
    data = json.loads((root / 'data/events.json').read_text())
    events = data['events']
    ids = {event['id'] for event in events}
    assert len(ids) == len(events), 'Duplicate event IDs'
    country_ids = {country['id'] for country in data['countries']}
    assert len(country_ids) == len(data['countries']), 'Duplicate country IDs'
    start = date.fromisoformat(data['coverage']['start'])
    end = date.fromisoformat(data['coverage']['end'])
    themes = {'politics', 'economy', 'geopolitics', 'health', 'rights', 'society', 'technology', 'climate'}
    assert events == sorted(events, key=lambda event: (event['start'], event['id'])), 'Events are not chronological'
    for event in events:
        label = event['id']
        event_start = date.fromisoformat(event['start'])
        assert start <= event_start <= end, f'{label}: outside coverage'
        if event['end']:
            assert event_start <= date.fromisoformat(event['end']) <= end, f'{label}: invalid date range'
        assert event['date_precision'] in {'day', 'month', 'year', 'half-year'}, f'{label}: invalid precision'
        assert event['countries'] and set(event['countries']) <= country_ids, f'{label}: unknown country'
        assert event['themes'] and set(event['themes']) <= themes, f'{label}: unknown theme'
        for field in ('title', 'facts', 'interpretation', 'consequences', 'reflection'):
            assert isinstance(event[field], str) and event[field].strip(), f'{label}: missing {field}'
        assert event['sources'], f'{label}: no sources'
        for source in event['sources']:
            url = urlparse(source['url'])
            assert url.scheme == 'https' and url.hostname and not url.username and not url.password, f'{label}: unsafe source URL'
            assert all(source.get(key) for key in ('publisher', 'title', 'supports', 'accessed')), f'{label}: incomplete source metadata'
            date.fromisoformat(source['accessed'])
        for link in event['related_events']:
            assert link['id'] in ids and link['id'] != label and link['relationship'], f'{label}: invalid relationship'
    years = Counter(event['start'][:4] for event in events)
    assert set(years) == set(data['year_summaries']), 'Year summaries and event years differ'
    gdp = json.loads((root / 'data/gdp.json').read_text())
    assert len(data['cohort']) == 10 and len(set(data['cohort'])) == 10, 'Expected ten distinct cohort countries'
    assert data['cohort'] == gdp['cohort'], 'Event and GDP cohorts differ'
    assert set(data['cohort']) <= country_ids, 'Missing cohort country metadata'
    for country in data['cohort']:
        represented = {event['start'][:4] for event in events if country in event['countries']}
        assert set(years) <= represented, f'{country}: missing year coverage'
    for country in gdp['countries']:
        assert len(country['series']) == 10, 'Expected ten GDP observations'
        assert {row['year'] for row in country['series']} == set(range(2016, 2026)), 'GDP years differ'
        assert all(row['value_usd'] is not None and row['value_usd'] > 0 for row in country['series']), 'Missing cohort GDP observation'
    assert [country['selection_rank'] for country in gdp['countries']] == list(range(1, 11)), 'GDP rank order differs'
    urls = {source['url'] for event in events for source in event['sources']}
    if quiet:
        return data
    print(f'Validated {len(events)} events, {len(urls)} distinct source URLs, {len(country_ids)} country associations, and all related-event links.')
    print('Events per year:', ', '.join(f'{year}: {count}' for year, count in sorted(years.items())))


if __name__ == '__main__':
    validate()

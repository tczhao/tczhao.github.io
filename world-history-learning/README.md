# Worldlines

A sourced, static timeline covering **2016–2025** across a fixed cohort of the **ten largest economies by 2025 nominal GDP** in the saved World Bank data release. The collection contains **156 events and 182 distinct source URLs**. Every cohort country has events in every year. Depth varies: China retains the deeper initial collection.

## Open the page

Open `index.html` directly in your browser. No Python server, package installation, internet connection, or runtime JSON fetch is needed to read and filter it. External source links require internet access when selected.

The generated HTML includes all event cards, embedded data, CSS and JavaScript. The timeline is also readable with JavaScript disabled. For static hosting, publish this folder with `index.html` and `data/`; the source-data download links use the accompanying files. The event-data download button also works from the embedded copy when JavaScript is enabled.

## Refresh after editing data

From the repository root:

```sh
python3 world-history-learning/build.py
```

Or from this folder:

```sh
python3 build.py
```

Then reload the page. Python runs only at generation time. It does not serve the website. The generator validates the dataset before replacing the output and produces deterministic HTML without inserting a changing build timestamp.

The same workflow applies to manual and AI edits:

1. Add or amend records in `data/events.json`, preserving existing event IDs.
2. Research the changes and update their sources, source-support notes and research dates.
3. Update country metadata, year summaries or GDP metadata when relevant.
4. Run the generator and checks below.
5. Commit/publish the regenerated HTML and accompanying data through the repository’s normal process.

Do not edit `index.html` directly: regeneration overwrites it. Change `templates/index.html`, `timeline.css`, or `timeline.js` for presentation changes. The Python standard library is sufficient; no direct dependencies were added.

## Country selection and GDP data

The fixed 2025 cohort, in saved rank order, is: United States, China, Germany, Japan, United Kingdom, India, France, Russia, Italy and Canada. The World Bank WDI snapshot was updated **8 October 2026** and retrieved **1 November 2026**.

`data/gdp.json` contains ten annual values for each selected country, annual ranks among reporting economies, the indicator, units, selection rule, source URL and reporting-economy counts. The measure is **NY.GDP.MKTP.CD: GDP in current US dollars**, not purchasing-power-parity GDP, real growth or GDP per person.

`data/gdp-worldbank-raw.json` and `data/worldbank-countries.json` preserve the downloaded API responses. Aggregates are excluded from rankings using the World Bank country metadata. Missing observations are not converted to zero. Current-dollar ranks can change with exchange rates and revisions; the cohort is not reselected for each historical year. Countries outside it appear only as connections and are labeled accordingly.

To update the GDP snapshot, retrieve the same public World Bank indicator and country-metadata endpoints recorded in the saved files, recalculate ranks excluding aggregates, and update `gdp.json` and event-country metadata consistently. Reconsidering the cohort is an explicit editorial change: new GDP data does not silently create a researched history for a newly selected country.

## Files

- `data/events.json`: canonical shared event records and metadata.
- `data/gdp.json`: normalized GDP series, ranking and selection provenance.
- `data/gdp-worldbank-raw.json`, `data/worldbank-countries.json`: reproducible source snapshots.
- `build.py`: validation and static HTML generation.
- `templates/index.html`, `timeline.css`, `timeline.js`: presentation source.
- `index.html`: generated, standalone reading and filtering experience.
- `validate_data.py`, `test_build.py`: integrity and generator checks.
- `RESEARCH.md`: collection scope, source approach and coverage limits.
- `CHINA_RESEARCH.md`: deeper guide to the initial China collection.
- `PLAN.md`: original plan and subsequent scope decisions.

## Shared event model

A shared event appears once, with multiple country associations. Countries are entry points into one chronology, not independent copies of events. Associations mean involvement or direct relevance, not a territorial sovereignty judgment. Regions remain separate from country identifiers.

Each event contains stable ID, start date, optional end date, date precision, themes, factual account, interpretation, consequences, general reflection, sources and typed related-event links. Source records include a title, publisher, URL, access date and description of support. Reflections are editorial analysis rather than personal reactions or universal laws.

Year-, month- and half-year-precision dates are sorting anchors and are labeled as such. The current model covers common-era modern dates; BCE support and time-dependent historical states need a separate calendar/entity extension before expanding across centuries. JSON is embedded with HTML-sensitive characters escaped, while visible content is HTML-escaped during generation.

## Checks

```sh
python3 world-history-learning/validate_data.py
python3 world-history-learning/build.py --check
python3 -m unittest discover -s world-history-learning -p 'test_*.py'
node --check world-history-learning/timeline.js
```

Integrity checks cover IDs, dates, source URLs and metadata, event relationships, cohort/GDP consistency and every-year coverage for all ten countries. Regression tests cover deterministic output, pre-rendered content and protection against embedded JSON terminating its script tag. Local Chrome checks cover direct-file loading and interactive filters; results are recorded in `RESEARCH.md`.

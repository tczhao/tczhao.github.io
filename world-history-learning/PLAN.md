# World History Learning Project

## Goal

Build a source-backed understanding of world events, starting with individual countries and eventually connecting them in a world-view webpage.

## Approach

1. **Start with one country and one period.** Collect 10–20 key events around a major transformation, such as state formation, industrialization, revolution, or independence. Test the approach before collecting an entire country's history.
2. **Use a consistent event format.** Record dates, what happened, causes, consequences, affected groups, sources, and connections to events elsewhere.
3. **Build a simple country webpage early.** Start with a timeline and expandable explanations. Use the prototype to identify gaps and decide whether maps, themes, or additional context would help.
4. **Add a second country with overlapping history.** Test comparisons, shared events, and cross-country connections.
5. **Expand into a world view.** Connect the material through time, trade, migration, war, ideas, and institutions.

## Three Layers of Learning

| Layer | Purpose |
| --- | --- |
| Established facts | What happened, when, and who was involved? |
| Historical interpretations | Why did it happen, and where do historians disagree? |
| General reflections | What broader patterns, tensions, or questions does the event illustrate? |

General reflections are analytical rather than personal. Ground them in evidence, acknowledge exceptions, and avoid presenting historical patterns as universal laws.

Example reflection: Rapid economic growth can coexist with political exclusion, creating tensions that prosperity alone does not resolve.

## Event Data Structure

Treat countries as entry points while storing events independently. Borders and states change, and a single event may connect several countries.

For each event, capture:

- Stable event ID and title
- Date or date range, including uncertainty where relevant
- Geographic associations and relevant historical states or regions
- Established facts and affected groups
- Causes and consequences, distinguishing evidence from interpretation
- Historical interpretations and disagreements
- General reflections
- Themes
- Related event IDs and the nature of each connection
- Sources supporting the claims

Country pages and the eventual world view should reuse the same event records.

## First Milestone

Create one compelling country page explaining a historical transformation through 10–20 connected events, with sources and visible uncertainty.

Initial choices still to make:

- First country
- Historical period or transformation
- Intended audience and depth

Choose the technology and detailed page design after the initial content sample helps clarify the requirements.

## Scope decisions — 1 November 2026

- Start with China, 2016–2025, and retain the initial researched collection.
- Expand to a fixed cohort of the ten largest economies by **2025 nominal GDP** in the saved World Bank WDI snapshot. Use one ranking vintage, not changing annual membership or PPP rankings.
- Save both historical event data and the GDP selection evidence. Shared events have one record with multiple country associations.
- Generate `index.html` with `python3 world-history-learning/build.py` after data changes. The output contains the timeline, styles, interactions and embedded data and opens directly without a server.
- Validate data before each build and check that every selected country has event coverage in each year. Coverage depth can differ and should be disclosed.

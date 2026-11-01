# Ten economies, 2016–2025: collection research notes

Research date: 1 November 2026. The timeline covers ten complete calendar years, **2016–2025**. Later reports are used where they document outcomes inside that period.

## Scope and country selection

The cohort is fixed using 2025 nominal GDP observations in the World Bank’s saved WDI release, updated 8 October 2026: United States, China, Germany, Japan, United Kingdom, India, France, Russia, Italy and Canada. This is not the union of every country that entered a top-ten ranking during the decade, and it is not a PPP ranking. The data source is [World Bank GDP in current US dollars](https://data.worldbank.org/indicator/NY.GDP.MKTP.CD). GDP is a starting scope choice, not a judgment about whose history matters.

The raw API responses and normalized annual series are saved under `data/`. Revision vintage matters: an older ranking may list a different country or order. The normalized file records how many economies have observations in each year; absent data is not zero.

The event collection has **156 unique records with 182 distinct source URLs**, covering all ten years for every selected country. Counts include shared events, so country counts do not sum to the unique-event total.

| Country | Associated events | Years covered |
| --- | ---: | ---: |
| United States | 29 | 10 |
| China | 53 | 10 |
| Germany | 18 | 10 |
| Japan | 17 | 10 |
| United Kingdom | 16 | 10 |
| India | 14 | 10 |
| France | 19 | 10 |
| Russia | 17 | 10 |
| Italy | 18 | 10 |
| Canada | 16 | 10 |

China’s earlier collection is substantially deeper. These are researched starting collections, not equivalent country encyclopedias. Other countries in the selector have connected-event coverage only, explicitly labeled in the page.

## Research approach

Each record distinguishes a sourced factual milestone from interpretation, consequences and general reflection. The reflections are analytical rather than personal; they are not presented as historians’ consensus or as universal lessons.

Institutional sources establish laws, elections, treaty milestones, statistics, official assessments and announcements. Their own political justifications remain attributed to the institution. Reuters, AP and other reporting provide chronology and context. Retrospective reports are useful for correcting early provisional figures. Some articles are available through syndication hosts, and some indexed sources restrict full-page retrieval; source access is not a guarantee of future availability.

The sources are attached at event level with support notes, rather than providing sentence-by-sentence provenance. This pass is not a systematic academic literature review. Where a record discusses a contested causal explanation, it labels the limitation rather than implying that chronology proves causation.

## Country-level themes

- **United States:** electoral institutions and transfer of power; tax and infrastructure policy; racial justice and policing; reproductive rights; interest-rate and financial risks; climate-industrial policy; trade confrontation.
- **China:** political consolidation; Hong Kong and Xinjiang; pandemic containment and reopening; housing and household confidence; birth policy and aging; science, AI and clean-energy industry; international competition and diplomacy. See `CHINA_RESEARCH.md` for the original thematic guide.
- **Germany:** party-system fragmentation and succession; climate and nuclear policy; the security response to Russia’s invasion; coalition conflict and changing borrowing rules.
- **Japan:** disasters and recovery; demographic pressure and foreign workers; political succession; pandemic-era Olympics; security strategy; the exit from negative interest rates.
- **United Kingdom:** the referendum-to-withdrawal sequence; housing safety; vaccination and climate diplomacy; bond-market disruption; Northern Ireland arrangements; electoral change and the stages of social-policy legislation.
- **India:** currency and tax reform; LGBTQ rights; constitutional autonomy; pandemic capacity; farm protests; domestic scientific and defense capabilities; coalition politics and border crisis management.
- **France:** terrorism and public security; party-system change; purchasing-power protests; pandemic rules; pensions and reproductive freedom; fragile parliamentary support for fiscal policy.
- **Russia:** restricted political competition and dissent; succession rules; political imprisonment; the invasion of Ukraine and mobilization; international criminal accountability; mutiny and diplomacy.
- **Italy:** constitutional reform and coalition changes; banking and infrastructure oversight; pandemic and recovery; leadership change; flooding; citizenship and international financing for Ukraine.
- **Canada:** wildfire and heat resilience; targeted violence and belonging; cannabis regulation; minority government; border coordination; emergency powers; drug coverage and leadership transition.

## Shared timeline decisions

Shared records cover the pandemic characterization, EU recovery agreement, EU–Japan trade agreement, USMCA, Glasgow Climate Pact, Russia’s full-scale invasion and G7 financing for Ukraine. Their country associations indicate documented participation or direct relevance, not every indirect effect worldwide. For example, the invasion entry includes Ukraine and directly involved G7 countries, while China’s relationship with Russia has its own preceding record.

Existing China–US and China–India records retain their stable IDs and appear automatically in the new countries’ filters. This avoids manufacturing separate versions of the same event to inflate country coverage.

## Important distinctions retained in the data

- GDP at current exchange rates versus PPP, real growth and GDP per person.
- Electoral vote/seat outcomes versus national vote shares and the conditions of competition.
- A referendum result, treaty signing, legal commencement and practical implementation.
- Parliamentary approval in one chamber versus enactment; an arrest warrant versus conviction.
- A constitutional court’s ruling versus public acceptance or an independent policy evaluation.
- A partial tariff rollback versus abolition of all duties; a ceasefire versus a political settlement.
- Installed energy capacity versus generation and emissions; sales share versus the existing vehicle fleet.
- Policy announcements and intended targets versus realized outcomes.

## Coverage limits

The collection is strongest on institutional turning points and major crises. It needs further depth on labor, migration, Indigenous histories, disability, rural experiences, local variation, healthcare beyond COVID, cultural change and longer-run distributional outcomes. Security events should not crowd out everyday social history as the project grows.

Comparing countries requires attention to different institutions and starting conditions. A shared year does not imply identical exposure to a shock, and equal event counts would not establish balanced coverage. Related-event links describe a connection explicitly; they do not automatically claim causation.

## Technical verification

The page is generated from saved data into pre-rendered HTML, with embedded CSS, JavaScript and JSON. It does not require Python or a JSON fetch at reading time. The generator is deterministic, validates before replacement, and escapes both visible text and embedded JSON.

Dataset integrity and generator regression checks pass. A fresh local Chrome profile was used to verify direct `file://` loading. Browser interaction and responsive checks are recorded after completion below. External source availability and the completeness of historical interpretation are separate from these technical checks.

Chrome verification completed: direct-file rendering and 28 interaction/layout assertions passed at 1440px and a 500px narrow viewport. These cover country counts and ten-year visibility for every cohort member, theme filtering, search, empty state, reset, related-event navigation, partial-coverage notices and horizontal overflow. A separate Chrome page-target check at a true 390px emulated viewport also passed direct-file rendering, country filtering, reset and horizontal-overflow checks. Desktop and true 390px screenshots were reviewed.

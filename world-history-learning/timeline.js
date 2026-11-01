/* The generator embeds the data. No fetch, server, or external assets are needed. */
(() => {
  'use strict';
  const data = JSON.parse(document.getElementById('timeline-data').textContent);
  const country = document.getElementById('country');
  const search = document.getElementById('search');
  const buttons = [...document.querySelectorAll('[data-theme]')];
  const sections = [...document.querySelectorAll('.year-section')];
  const cards = new Map(data.events.map(event => [event.id, document.getElementById(event.id)]));
  const countries = new Map(data.countries.map(item => [item.id, item.name]));
  const cohort = new Set(data.cohort);
  const summaries = new Map(sections.map(section => [section.dataset.year, section.querySelector('.year-summary')]));
  let activeTheme = 'all';
  const searchable = new Map(data.events.map(event => [event.id,
    [event.title, event.facts, event.interpretation, event.consequences, event.reflection,
      ...event.regions, ...event.themes, ...(event.affected_groups || []),
      ...event.countries.map(id => countries.get(id) || id)].join(' ').toLocaleLowerCase()
  ]));
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    const visibleYears = new Set();
    let count = 0;
    for (const event of data.events) {
      const visible = (!country.value || event.countries.includes(country.value)) &&
        (activeTheme === 'all' || event.themes.includes(activeTheme)) && searchable.get(event.id).includes(query);
      cards.get(event.id).hidden = !visible;
      if (visible) { count++; visibleYears.add(event.start.slice(0, 4)); }
    }
    for (const section of sections) {
      const year = section.dataset.year;
      section.hidden = !visibleYears.has(year);
      const summary = summaries.get(year);
      const text = country.value ? data.country_year_summaries?.[country.value]?.[year] : data.year_summaries[year];
      summary.textContent = text || '';
      summary.hidden = !text;
    }
    for (const link of document.querySelectorAll('#years a')) link.hidden = !visibleYears.has(link.dataset.year);
    for (const button of buttons) {
      const selected = button.dataset.theme === activeTheme;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    document.getElementById('count').textContent = `${count} turning points / ${data.coverage.start.slice(0, 4)}–${data.coverage.end.slice(0, 4)}`;
    document.getElementById('empty').hidden = count !== 0;
    document.getElementById('scope-note').textContent = country.value && !cohort.has(country.value)
      ? `${countries.get(country.value)} appears through connected events only; a decade collection has not yet been researched.`
      : data.coverage_note;
  }
  function reset() { country.value = ''; search.value = ''; activeTheme = 'all'; filter(); }
  for (const button of buttons) button.addEventListener('click', () => { activeTheme = button.dataset.theme; filter(); });
  country.addEventListener('change', filter);
  search.addEventListener('input', filter);
  document.getElementById('reset').addEventListener('click', reset);
  for (const link of document.querySelectorAll('[data-event-link]')) {
    link.addEventListener('click', () => {
      reset();
      const card = cards.get(link.dataset.eventLink);
      if (card) card.querySelector('details').open = true;
    });
  }
  document.getElementById('data-download').addEventListener('click', event => {
    event.preventDefault();
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2) + '\n'], {type: 'application/json'}));
    const link = document.createElement('a');
    link.href = url; link.download = 'worldlines-events.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  // Deep links remain valid even if the event was hidden by a previous browser state.
  function revealHash() {
    const id = location.hash.slice(1);
    const card = cards.get(id);
    if (card) { reset(); card.querySelector('details').open = true; card.scrollIntoView(); }
  }
  reset();
  revealHash();
  window.addEventListener('hashchange', revealHash);
})();

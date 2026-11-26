const dom = globalThis.document;
const PAGE_SIZE = 120;
const format = new Intl.NumberFormat();
const fields = Object.fromEntries([
    'catalog-count', 'author-search', 'authors', 'scope-title', 'scope-count',
    'filters', 'table', 'sets', 'type', 'sort', 'search', 'rows', 'status',
    'previous', 'next'
].map(id => [id, dom.getElementById(id)]));
const catalog = JSON.parse(dom.getElementById('catalog').textContent);
const authors = catalog.map((author, id) => ({ ...author, id }));
const state = { author: null, sections: [], rows: [], filtered: [], page: 0 };

function element(tag, text, className) {
    const node = dom.createElement(tag);
    if (text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function option(value, label) {
    const node = element('option', label);
    node.value = value;
    return node;
}

function authorButton(author) {
    const button = element('button', null);
    button.type = 'button';
    button.setAttribute('aria-current', String(author === state.author));
    const count = format.format(author.total);
    button.append(element('span', author.name), element('span', count));
    button.addEventListener('click', () => selectAuthor(author));
    return button;
}

function renderAuthors() {
    const query = fields['author-search'].value.trim().toLowerCase();
    const matching = authors.filter(author => author.name.toLowerCase().includes(query));
    fields.authors.replaceChildren(...matching.map(authorButton));
}

async function unpack(author) {
    const script = dom.getElementById(`shard-${author.id}`);
    const characters = atob(script.textContent);
    const bytes = Uint8Array.from(characters, character => character.charCodeAt(0));
    const body = new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'));
    return new Response(body).json();
}

async function selectAuthor(author) {
    state.author = author;
    state.sections = [];
    fields['scope-title'].textContent = author.name;
    fields['scope-count'].textContent = '';
    fields.sets.replaceChildren(option('', 'All sets'));
    fields.rows.replaceChildren();
    fields.status.textContent = 'Loading gaps…';
    fields.next.disabled = true;
    fields.previous.disabled = true;
    renderAuthors();

    try {
        const sections = await unpack(author);
        if (state.author !== author) return;
        state.sections = sections;
        for (const [index, set] of author.sets.entries()) {
            const count = format.format(set.affected);
            fields.sets.append(option(String(index), `${set.name} · ${count}`));
        }
        updateScope();
    } catch (error) {
        if (state.author === author)
            fields.status.textContent = `Could not read gaps: ${error.message}`;
    }
}

function mergeRow(groups, [text, cards, types, contexts, examples], setName) {
    if (!groups.has(text)) groups.set(text, [text, 0, new Set(), new Set(), []]);
    const row = groups.get(text);
    row[1] += cards;
    for (const type of types) row[2].add(type);
    for (const context of contexts) row[3].add(context);
    for (const name of examples.slice(0, 5 - row[4].length))
        row[4].push(`${name} (${setName})`);
}

function rowsForAuthor() {
    const groups = new Map();
    for (const [index, rows] of state.sections.entries()) {
        const set = state.author.sets[index];
        for (const row of rows) mergeRow(groups, row, set.name);
    }
    return [...groups.values()].map(([text, count, types, contexts, examples]) =>
        [text, count, [...types], [...contexts], examples]);
}

function updateScope() {
    if (!state.sections.length) return;
    const setIndex = fields.sets.value;
    const set = setIndex === '' ? null : state.author.sets[Number(setIndex)];
    state.rows = set ? state.sections[Number(setIndex)] : rowsForAuthor();
    const cards = format.format(set?.affected ?? state.author.total);
    const unique = format.format(state.rows.length);
    const authorTotal = state.author.sets.reduce((sum, row) => sum + row.total, 0);
    const total = set?.total ?? authorTotal;
    const coverage = `${cards} of ${format.format(total)} card entries affected`;
    fields['scope-count'].textContent = `${coverage} · ${unique} distinct gaps`;
    const selected = fields.type.value;
    const types = [...new Set(state.rows.flatMap(row => row[2]))].sort();
    const options = types.map(type => option(type, type));
    fields.type.replaceChildren(option('', 'All types'), ...options);
    if (types.includes(selected)) fields.type.value = selected;
    applyFilters();
}

const compare = {
    frequency: (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    type: (a, b) => a[2][0].localeCompare(b[2][0]) || compare.frequency(a, b),
    text: (a, b) => a[0].localeCompare(b[0])
};

function matches([text, count, types, contexts], query, type) {
    if (type && !types.includes(type)) return false;
    return !query || [text, ...contexts].some(part => part.toLowerCase().includes(query));
}

function applyFilters() {
    if (!state.sections.length) return;
    const query = fields.search.value.trim().toLowerCase();
    state.filtered = state.rows.filter(row => matches(row, query, fields.type.value));
    state.filtered.sort(compare[fields.sort.value]);
    state.page = 0;
    renderRows();
}

function renderRow([text, count, types, contexts, examples]) {
    const details = element('details', null);
    const summary = element('summary', null);
    const type = element('span', [...types].sort().join(', '), 'type');
    type.title = type.textContent;
    summary.append(element('span', format.format(count), 'frequency'), type,
                   element('span', text || '(empty span)', 'gap'));
    const body = element('div', null, 'details');
    body.append(element('p', `Context: ${contexts.join(' · ')}`),
                element('p', `Examples: ${examples.join(' · ')}`));
    details.append(summary, body);
    return details;
}

function renderRows() {
    const total = state.filtered.length;
    const start = state.page * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);
    fields.rows.replaceChildren(...state.filtered.slice(start, end).map(renderRow));
    fields.table.scrollTop = 0;
    const range = `${format.format(start + 1)}–${format.format(end)}`;
    fields.status.textContent = total ? `${range} of ${format.format(total)} gaps`
        : 'No gaps match these filters.';
    fields.previous.disabled = state.page === 0;
    fields.next.disabled = end === total;
}

function changePage(delta) {
    state.page += delta;
    renderRows();
    fields['scope-title'].scrollIntoView({ block: 'nearest' });
}

fields['author-search'].addEventListener('input', renderAuthors);
fields.filters.addEventListener('submit', event => event.preventDefault());
fields.sets.addEventListener('change', updateScope);
fields.type.addEventListener('change', applyFilters);
fields.sort.addEventListener('change', applyFilters);
fields.search.addEventListener('input', applyFilters);
fields.previous.addEventListener('click', () => changePage(-1));
fields.next.addEventListener('click', () => changePage(1));

const setCount = authors.reduce((sum, author) => sum + author.sets.length, 0);
const ownerCount = format.format(authors.length);
const setLabel = format.format(setCount);
fields['catalog-count'].textContent = `${ownerCount} owners · ${setLabel} sets`;
authors.sort((a, b) => a.name.localeCompare(b.name));
const byAffected = (best, author) => author.total > best.total ? author : best;
const largest = authors.reduce(byAffected, { total: 0 });
renderAuthors();
if (largest.total) selectAuthor(largest);

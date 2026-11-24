export const $ = selector => document.querySelector(selector);

export function element(tag, { className, text, title } = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    if (title) node.title = title;
    node.append(...children);
    return node;
}

export function chip(text, className, title) {
    return element('span', { className: `chip ${className}`, text, title });
}

export async function getJson(url, options) {
    const response = await fetch(url, options);
    if (response.ok) return response.json();
    const body = await response.json();
    throw new Error(body.error ?? response.statusText);
}

export function highlight(textElement, raw) {
    const text = textElement.dataset.text;
    const index = raw ? text.indexOf(raw) : -1;
    if (index < 0) return void (textElement.textContent = text);
    textElement.replaceChildren(
        text.slice(0, index),
        element('mark', { text: raw }),
        text.slice(index + raw.length)
    );
}

export function openPathTo(tree, id) {
    const target = tree.querySelector(`.node[data-id="${id}"]`);
    for (let node = target; node && node !== tree; node = node.parentElement)
        if (node.tagName === 'DETAILS') node.open = true;
    return target;
}

function revealNode(tree, id) {
    const target = openPathTo(tree, id);
    if (!target) return;
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    target.classList.add('flash');
    setTimeout(() => target.classList.remove('flash'), 1200);
}

function formatRef(value, tree) {
    const label = `#${value.ref ?? '?'} ${value.kind} “${value.raw ?? ''}”`;
    const link = element('span', { className: 'ref', text: label });
    const reveal = () => revealNode(tree, value.ref);
    if (value.ref !== null) link.addEventListener('click', reveal);
    return link;
}

function isRef(value) {
    return value && typeof value === 'object' && 'kind' in value && 'ref' in value;
}

function formatValue(value, tree) {
    if (isRef(value)) return formatRef(value, tree);
    if (Array.isArray(value) && value.some(isRef))
        return element('span', {}, value.flatMap(item => [formatValue(item, tree), ' ']));
    if (value && typeof value === 'object') return JSON.stringify(value);
    return String(value);
}

function propertiesElement(properties, tree) {
    const row = ([name, value]) => element('tr', {}, [
        element('td', { text: name }),
        element('td', {}, [formatValue(value, tree)])
    ]);
    const rows = Object.entries(properties).map(row);
    return element('details', { className: 'props' }, [
        element('summary', { text: `properties (${rows.length})` }),
        element('table', {}, [element('tbody', {}, rows)])
    ]);
}

function statusChips(node) {
    const chips = [];
    if (node.role !== 'child') chips.push(chip(node.role, 'muted'));
    if (node.annotations?.forOpponent) chips.push(chip('for opponent', 'muted'));
    const isLeafGap = !node.isRecognized && !node.children.length;
    if (isLeafGap) chips.push(chip('unrecognized', 'bad'));
    if (node.isOpaque) chips.push(chip('opaque', 'warn'));
    return chips;
}

function annotationChips(node) {
    const tags = (node.annotations?.tags ?? []).map(tag => chip(tag, 'tag'));
    const inspections = node.annotations?.inspections ?? [];
    const pie = inspections.map(id => chip(id, 'pie', 'pie inspection'));
    return [...statusChips(node), ...tags, ...pie];
}

function nodeClasses(node, gapIds) {
    const classes = ['node'];
    if (gapIds.has(node.id)) classes.push('gap');
    if (!node.isRecognized) classes.push('unrecognized');
    if (node.isOpaque) classes.push('opaque');
    return classes.join(' ');
}

function nodeElement(node, context) {
    const summary = element('summary', { title: node.lineage.join(' → ') }, [
        element('span', { className: 'kind', text: node.kind }),
        element('span', { className: 'raw', text: node.raw }),
        ...annotationChips(node)
    ]);
    const showRaw = () => highlight(context.textElement, node.raw);
    summary.addEventListener('mouseenter', showRaw);
    const children = node.children.map(child => nodeElement(child, context));
    const details = element('details', { className: nodeClasses(node, context.gapIds) }, [
        summary,
        propertiesElement(node.properties, context.tree),
        element('div', { className: 'children' }, children)
    ]);
    details.dataset.id = node.id;
    details.open = true;
    return details;
}

export function setAllOpen(tree, open) {
    for (const details of tree.querySelectorAll('.node')) details.open = open;
}

export function toolbar(tree) {
    const expand = element('button', { text: 'Expand all' });
    const collapse = element('button', { text: 'Collapse all' });
    expand.addEventListener('click', () => setAllOpen(tree, true));
    collapse.addEventListener('click', () => setAllOpen(tree, false));
    return element('div', { className: 'toolbar' }, [expand, collapse]);
}

export function faceTree(face, textElement, gapIds = new Set()) {
    const tree = element('div', { className: 'tree' });
    tree.append(nodeElement(face.tree, { textElement, tree, gapIds }));
    tree.addEventListener('mouseleave', () => highlight(textElement, ''));
    return tree;
}

export function faceText(face) {
    const textElement = element('p', { className: 'card-text', text: face.text });
    textElement.dataset.text = face.text;
    return textElement;
}

export function faceElement(face) {
    const textElement = faceText(face);
    const tree = faceTree(face, textElement);
    const status = face.recognized
        ? chip('fully recognized', 'tag')
        : chip('partly recognized', 'bad');
    const unread = face.unrecognized.map(span => chip(span, 'bad', 'unrecognized'));
    const name = element('span', { text: face.name });
    return element('section', { className: 'panel face' }, [
        element('h2', {}, [name, element('span', { text: face.manaCost })]),
        element('small', { text: `${face.typeLine} · colors ${face.colors}` }),
        textElement,
        element('div', {}, [status, ...unread]),
        toolbar(tree),
        tree
    ]);
}

function tagChips(card) {
    const entries = Object.entries(card.tags);
    if (!entries.length) return [element('span', { text: 'none' })];
    return entries.map(([tag, evidence]) => {
        const confirmed = card.scryfallTags.includes(tag);
        const className = confirmed ? 'tag' : 'tag miss';
        return chip(tag, className, `${confirmed ? 'Scryfall agrees. ' : ''}${evidence}`);
    });
}

function pieChips(card) {
    if (!card.pieFlags.length) return [element('span', { text: 'none' })];
    return card.pieFlags.map(flag =>
        chip(`${flag.inspection} (${flag.offending.join('')})`, 'pie', flag.evidence));
}

export function summaryElement(card) {
    const children = [];
    if (card.image) children.push(element('img', { title: card.name }));
    if (card.image) children.at(-1).src = card.image;
    const list = element('dl', {}, [
        element('dt', { text: 'Tags (solid = Scryfall agrees)' }),
        element('dd', {}, tagChips(card)),
        element('dt', { text: 'Pie flags' }),
        element('dd', {}, pieChips(card))
    ]);
    children.push(element('div', { className: 'panel' }, [list]));
    return element('aside', {}, children);
}

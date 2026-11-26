import scryfallParents from './scryfallTagParents.json' with { type: 'json' };
import { GRAVEYARD_RETURN_TAGS } from './graveyardReturnTags.js';

const aliases = new Map([['draw-engine', 'repeatable-pure-draw']]);

const parents = new Map(Object.entries(scryfallParents));

function addParents(tag, broaderTags) {
    parents.set(tag, [...new Set([...(parents.get(tag) ?? []), ...broaderTags])]);
}

for (const { tag } of GRAVEYARD_RETURN_TAGS) {
    if (tag.startsWith('regrowth-') || tag === 'mass-regrowth')
        addParents(tag, ['regrowth']);
}

export function canonicalTag(tag) {
    return aliases.get(tag) ?? tag;
}

function ancestorsOf(source) {
    const root = canonicalTag(source);
    const pending = [root];
    const visited = new Set();
    for (const tag of pending) {
        if (visited.has(tag)) continue;
        visited.add(tag);
        pending.push(...(parents.get(tag) ?? []));
    }
    visited.delete(root);
    return [...visited];
}

export function inheritedTagSources(tags, { includeAssigned = false } = {}) {
    const explicit = new Set(tags);
    const inherited = new Map();
    for (const source of explicit) {
        const implicit = ancestorsOf(source)
            .filter(tag => includeAssigned || !explicit.has(tag));
        for (const tag of implicit) {
            const sources = inherited.get(tag) ?? [];
            sources.push(source);
            inherited.set(tag, sources);
        }
    }
    return inherited;
}

export function equivalentTags(tags = []) {
    const all = new Set([...tags, ...tags.map(canonicalTag)]);
    for (const [alias, canonical] of aliases)
        if (all.has(canonical)) all.add(alias);
    return [...all];
}

export function effectiveTags(tags = []) {
    return equivalentTags([...tags, ...inheritedTagSources(tags).keys()]);
}

export function specificTags(tags) {
    const canonical = [...new Set(tags.map(canonicalTag))];
    const implied = new Set(canonical.flatMap(ancestorsOf));
    return canonical.filter(tag => !implied.has(tag));
}

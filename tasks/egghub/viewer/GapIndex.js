import path from 'node:path';
import { gzipSync } from 'node:zlib';

const SOURCE_ROW = /#\d+$/;
const SAMPLE_LIMIT = 4;

function setName(file) {
    return path.basename(file, '.json');
}

function compactRow([text, row]) {
    return [text, row.cards, [...row.types].sort(), [...row.contexts], row.examples];
}

function entryGaps(gaps) {
    const byText = new Map();
    for (const [text, context, kind] of gaps) {
        if (!byText.has(text)) byText.set(text, []);
        byText.get(text).push([context, kind]);
    }
    return byText;
}

export default class GapIndex {
    constructor() {
        this.authors = new Map();
        this.sets = new Map();
    }

    setFor(id) {
        const file = id.replace(SOURCE_ROW, '');
        if (this.sets.has(file)) return this.sets.get(file);
        const [author] = file.split(path.sep);
        const set = { file, name: setName(file), affected: 0, total: 0, gaps: new Map() };
        if (!this.authors.has(author)) this.authors.set(author, []);
        this.authors.get(author).push(set);
        this.sets.set(file, set);
        return set;
    }

    addCard(id) {
        this.setFor(id).total++;
    }

    add([id, name, gaps]) {
        const set = this.setFor(id);
        set.affected++;
        for (const [text, entries] of entryGaps(gaps))
            this.record(set, text, entries, name);
    }

    record(set, text, entries, name) {
        if (!set.gaps.has(text)) {
            set.gaps.set(text, {
                cards: 0, types: new Set(), contexts: new Set(), examples: []
            });
        }
        const row = set.gaps.get(text);
        row.cards++;
        for (const [context, kind] of entries) {
            row.types.add(kind);
            row.contexts.add(context);
        }
        if (row.examples.length < SAMPLE_LIMIT) row.examples.push(name);
    }

    *pack() {
        for (const [name, sets] of this.authors) {
            const list = sets.map(({ file, name, affected, total, gaps }) =>
                ({ file, name, affected, total, gaps: gaps.size }));
            const total = sets.reduce((sum, set) => sum + set.affected, 0);
            const rows = sets.map(set => [...set.gaps].map(compactRow));
            const data = gzipSync(JSON.stringify(rows)).toString('base64');
            yield { name, total, sets: list, data };
        }
    }
}

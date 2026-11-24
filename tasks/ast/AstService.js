import fs from 'node:fs';
import { readJson } from '../shared/files.js';
import { PATHS } from '../shared/paths.js';
import { createCorpusScribe } from '../corpus/corpusScribe.js';
import { parseCardFaces } from '../corpus/pieCorpus.js';
import AstSerializer from './AstSerializer.js';
import annotateFace from './annotateFace.js';
import { PieInspector, CardColors } from '../../src/index.js';
import normalizeCardText from '../../src/core/normalizeCardText.js';

const SEARCH_LIMIT = 20;

function readProfiles() {
    return fs.existsSync(PATHS.pieProfiles) ? readJson(PATHS.pieProfiles) : {};
}

function customCard({ name = 'Custom card', typeLine = '', manaCost = '', text = '' }) {
    const colors = CardColors.fromManaCost(manaCost).colors;
    const face = {
        name, type_line: typeLine, mana_cost: manaCost, oracle_text: text, colors
    };
    const card = { name, type_line: typeLine, mana_cost: manaCost, colors };
    return { ...card, faces: [face], tags: [] };
}

function mergeTags(faces) {
    const tags = {};
    for (const { parsed } of faces)
        for (const [tag, evidence] of parsed.tags) tags[tag] ??= evidence;
    return tags;
}

export default class AstService {
    constructor() {
        this.corpus = readJson(PATHS.corpus);
        this.scribe = createCorpusScribe(this.corpus);
        this.pie = new PieInspector({ profiles: readProfiles() });
        this.byName = new Map(this.corpus.map(card => [card.name.toLowerCase(), card]));
    }

    search(query) {
        const needle = query.trim().toLowerCase();
        if (!needle) return [];
        const names = [...this.byName.keys()].filter(name => name.includes(needle));
        return names.slice(0, SEARCH_LIMIT).map(name => this.byName.get(name).name);
    }

    findCard(name) {
        return this.byName.get(name.trim().toLowerCase()) ?? null;
    }

    inspectName(name) {
        const card = this.findCard(name);
        return card ? this.inspect(card) : null;
    }

    inspectText(fields) {
        return this.inspect(customCard(fields));
    }

    describeFace(face, source) {
        const annotations = annotateFace(face.parsed, this.pie.inspections);
        return {
            name: source.name,
            typeLine: source.type_line ?? '',
            manaCost: source.mana_cost ?? '',
            text: normalizeCardText(source.oracle_text ?? '', source.name),
            colors: String(face.colors),
            recognized: face.parsed.isFullyRecognized,
            unrecognized: face.parsed.unrecognized,
            tree: new AstSerializer(annotations).serialize(face.parsed.text)
        };
    }

    inspect(card) {
        const faces = parseCardFaces(this.scribe, card);
        return {
            name: card.name,
            image: card.image ?? null,
            scryfallUri: card.scryfall_uri ?? null,
            scryfallTags: card.tags ?? [],
            tags: mergeTags(faces),
            pieFlags: this.pie.inspect(faces).map(flag => flag.toJSON()),
            faces: faces.map((face, index) => this.describeFace(face, card.faces[index]))
        };
    }
}

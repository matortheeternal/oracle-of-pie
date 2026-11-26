import path from 'node:path';
import { readJson } from '../shared/files.js';

const MARKUP = /\[\/?(?:i|b|u|s)\]/gi;
const INVISIBLE = /[\u200B\u200E\u200F\uFEFF]/g;
const DOUBLE_QUOTES = /[“”]/g;
const APOSTROPHES = /[‘’]/g;
const BASIC_COLORS = /[WUBRG]/g;
const COMBINED_NAME = /\s+\/\/\s+/;
const NON_GAME_CARDS = new Set(['token', 'rulestip', 'designation']);

function normalizeText(text) {
    return String(text ?? '').replace(MARKUP, '').replace(INVISIBLE, '')
        .replace(DOUBLE_QUOTES, '"').replace(APOSTROPHES, '\'').trim();
}

function rulesOf(row, suffix) {
    const rules = normalizeText(row[`rules_text${suffix}`]);
    const special = normalizeText(row[`special_text${suffix}`]);
    if (!rules && special) return { oracle_text: special, rules_source: 'special_text' };
    return {
        oracle_text: rules,
        rules_source: 'rules_text',
        alternate_rules: special && special !== rules ? special : null
    };
}

function exportFace(row, suffix, name) {
    const color = String(row[`color${suffix}`] ?? '').toUpperCase();
    return {
        name,
        type_line: row[`type${suffix}`] ?? '',
        mana_cost: row[`cost${suffix}`] ?? '',
        colors: color.match(BASIC_COLORS) ?? [],
        loyalty: row[`loyalty${suffix}`] || null,
        ...rulesOf(row, suffix)
    };
}

function hasBack(row) {
    return Boolean(row.card_name2 || row.type2 || row.rules_text2 || row.special_text2);
}

function uniqueNames(row) {
    const primary = normalizeText(row.card_name);
    const secondary = normalizeText(row.card_name2);
    const [left, right] = primary.split(COMBINED_NAME);
    return [left, secondary.split(COMBINED_NAME).at(-1) || right || left];
}

function facesOf(row) {
    const [front, back] = uniqueNames(row);
    const faces = [exportFace(row, '', front)];
    if (hasBack(row)) faces.push(exportFace(row, '2', back));
    return faces;
}

export default class EggHubSet {
    constructor(root, file) {
        const set = readJson(file);
        if (!Array.isArray(set.cards)) throw new Error('Missing EggHub cards array');
        this.file = path.relative(root, file);
        this.project = path.dirname(this.file);
        this.rows = set.cards;
    }

    *cards() {
        for (const [index, row] of this.rows.entries()) {
            if (NON_GAME_CARDS.has(row.shape)) continue;
            yield this.card(row, index);
        }
    }

    card(row, index) {
        const sideText = normalizeText(row.rules_text3);
        const faces = facesOf(row);
        return {
            id: `${this.file}#${index + 1}`,
            name: faces.map(face => face.name).join(' // '),
            project: this.project,
            set: row.set ?? null,
            collector_number: row.number ?? null,
            layout: row.shape,
            faces,
            shared_rules_text: sideText || null
        };
    }
}

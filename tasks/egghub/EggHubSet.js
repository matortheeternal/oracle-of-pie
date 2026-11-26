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

function rulesOf(row, suffix, prepareText) {
    const rules = normalizeText(row[`rules_text${suffix}`]);
    const special = normalizeText(row[`special_text${suffix}`]);
    const original = rules || special;
    const repaired = prepareText(original);
    return {
        oracle_text: repaired,
        rules_source: rules || !special ? 'rules_text' : 'special_text',
        alternate_rules: rules && special && special !== rules ? special : null,
        ...(repaired !== original && { original_rules_text: original })
    };
}

function exportFace(row, suffix, name, prepareText) {
    const color = String(row[`color${suffix}`] ?? '').toUpperCase();
    return {
        name,
        type_line: row[`type${suffix}`] ?? '',
        mana_cost: row[`cost${suffix}`] ?? '',
        colors: color.match(BASIC_COLORS) ?? [],
        loyalty: row[`loyalty${suffix}`] || null,
        ...rulesOf(row, suffix, prepareText)
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

function facesOf(row, prepareText) {
    const [front, back] = uniqueNames(row);
    const faces = [exportFace(row, '', front, prepareText)];
    if (hasBack(row)) faces.push(exportFace(row, '2', back, prepareText));
    return faces;
}

export default class EggHubSet {
    constructor(root, file, { prepareText = text => text } = {}) {
        this.prepareText = prepareText;
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
        const originalSideText = normalizeText(row.rules_text3);
        const sideText = this.prepareText(originalSideText);
        const faces = facesOf(row, this.prepareText);
        return {
            id: `${this.file}#${index + 1}`,
            name: faces.map(face => face.name).join(' // '),
            project: this.project,
            set: row.set ?? null,
            collector_number: row.number ?? null,
            layout: row.shape,
            faces,
            shared_rules_text: sideText || null,
            ...(sideText !== originalSideText && {
                original_shared_rules_text: originalSideText
            })
        };
    }
}

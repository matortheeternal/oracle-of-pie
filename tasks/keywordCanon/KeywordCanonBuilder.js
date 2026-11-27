import { COLORS, ColorProfile, canonTiers } from '../../src/index.js';
import { textLines, abilityTextIn } from './keywordLines.js';
import { mostCommon, tally } from './tally.js';
import { keywordColors } from './keywordColors.js';

const PRINTED_FLOOR = 'tertiary';
const NONE = 'none';

function newUsage() {
    return {
        cards: 0, abilityCards: 0, mono: {}, colored: {}, sets: new Set(),
        texts: new Map(), types: new Map()
    };
}

function increment(counts, colors) {
    for (const color of colors) counts[color] = (counts[color] ?? 0) + 1;
}

const COLORED_SYMBOL = /\{[^}]*[WUBRG][^}]*\}/;

function exampleText(texts) {
    const colorless = new Map([...texts].filter(([text]) => !COLORED_SYMBOL.test(text)));
    return mostCommon(colorless.size ? colorless : texts);
}

function withPrintedFloor(tiers, counts) {
    const floored = ([color, tier]) =>
        [color, tier === NONE && counts[color] ? PRINTED_FLOOR : tier];
    return Object.fromEntries(Object.entries(tiers).map(floored));
}

export default class KeywordCanonBuilder {
    constructor() {
        this.totals = Object.fromEntries(COLORS.map(color => [color, 0]));
        this.usage = new Map();
    }

    usageOf(keyword) {
        const key = keyword.toLowerCase();
        if (!this.usage.has(key)) this.usage.set(key, newUsage());
        return this.usage.get(key);
    }

    addCard(card) {
        if (card.colors.length === 1) this.totals[card.colors[0]]++;
        const lines = textLines(card.text);
        for (const keyword of card.keywords) this.addKeyword(keyword, lines, card);
    }

    addKeyword(keyword, lines, card) {
        const usage = this.usageOf(keyword);
        usage.cards++;
        usage.sets.add(card.set);
        this.addAbilityText(usage, abilityTextIn(lines, keyword), card);
        const colors = keywordColors(card, keyword);
        if (colors.length === 1) increment(usage.mono, colors);
        increment(usage.colored, colors);
    }

    addAbilityText(usage, text, card) {
        if (!text) return;
        usage.abilityCards++;
        tally(usage.texts, text);
        tally(usage.types, card.type);
    }

    isAbility(usage) {
        return usage.abilityCards * 2 >= usage.cards;
    }

    entry(usage) {
        const hasMono = Object.keys(usage.mono).length > 0;
        const counts = hasMono ? usage.mono : usage.colored;
        const profile = new ColorProfile({ counts, totals: this.totals });
        const tiers = withPrintedFloor(canonTiers(profile), counts);
        const example = {
            typeLine: mostCommon(usage.types),
            text: exampleText(usage.texts)
        };
        return { canonCards: profile.support(), sets: usage.sets.size, tiers, example };
    }

    build() {
        const usages = [...this.usage];
        const abilities = usages.filter(([, usage]) => this.isAbility(usage));
        abilities.sort(([a], [b]) => a.localeCompare(b));
        const entries = abilities.map(([key, usage]) => [key, this.entry(usage)]);
        return Object.fromEntries(entries);
    }
}

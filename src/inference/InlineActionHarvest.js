import SpellAbility from '../abilities/SpellAbility.js';
import { TYPE_WORDS } from '../phrases/vocabulary.js';

const ACTION_WITH_REMINDER = new RegExp(
    '(?:^|[,:;.]+ | (?:and|or|then|may) )(?<name>[a-z][a-z-]+)\\. '
        + '\\((?<reminder>[^()]+)\\)', 'gi'
);
const TOKEN_SHORTHAND = /\b(create (?:a|an) (?:Treasure|Clue|Food|Blood))(?=[.,;]|$)/gi;
const NEWLINE = /\n+/;
const MINIMUM_CARDS = 2;

function isActionBody(ability) {
    return ability instanceof SpellAbility && ability.body.effects.length > 0;
}

export default class InlineActionHarvest {
    constructor(scribe) {
        this.scribe = scribe;
        this.actions = new Map();
    }

    addCard(card) {
        for (const face of card.faces) {
            for (const line of (face.oracle_text ?? face.rulesText ?? '').split(NEWLINE))
                this.addLine(line.trim(), card.name);
        }
    }

    addLine(line, cardName) {
        for (const { groups } of line.matchAll(ACTION_WITH_REMINDER)) {
            const name = groups.name.toLowerCase();
            const reminder = groups.reminder.replace(TOKEN_SHORTHAND, '$1 token');
            if (!this.actions.has(name)) this.actions.set(name, new Map());
            const variants = this.actions.get(name);
            if (!variants.has(reminder)) variants.set(reminder, new Set());
            variants.get(reminder).add(cardName);
        }
    }

    definitionFor(name, variants) {
        if (variants.size !== 1) return null;
        const [[reminder, cards]] = variants;
        if (cards.size < MINIMUM_CARDS || this.isReserved(name)) return null;
        if (this.scribe.parseText(`${name}.`).isRecognized) return null;
        if (!this.isModeledReminder(reminder)) return null;
        return { name, reminder, cards: cards.size, examples: [...cards].slice(0, 5) };
    }

    isModeledReminder(reminder) {
        const parsed = this.scribe.parseText(reminder);
        if (!parsed.isRecognized || !parsed.abilities.length) return false;
        if (!parsed.abilities.every(isActionBody)) return false;
        return ![...parsed.walk()].some(([node]) => node.isOpaque);
    }

    isReserved(name) {
        const title = name[0].toUpperCase() + name.slice(1);
        return Object.hasOwn(TYPE_WORDS, name) || this.scribe.isKeyword(name)
            || this.scribe.definitions.isNoncreatureSubtype(title);
    }

    get definitions() {
        return [...this.actions].map(([name, variants]) =>
            this.definitionFor(name, variants)).filter(Boolean);
    }
}

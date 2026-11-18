import ObjectEffect from './ObjectEffect.js';

const COPY = /^copy /i;
const FOR_EACH = /^for each [^,.]+/i;
const REPETITIONS = /^(?:twice|\w+ times)(?: instead)?/i;
const SPELL = /\bspells?\b/i;
const PERMANENT_SPELL = /\b(?:creature|permanent|artifact|enchantment|aura) spells?\b/i;

function isNonpermanentSpell(text) {
    return SPELL.test(text) && !PERMANENT_SPELL.test(text);
}

export default class CopyEffect extends ObjectEffect {
    static get pattern() {
        return COPY;
    }

    parseArguments(match) {
        super.parseArguments(match);
        const multiplier = this.consumeText(FOR_EACH) ?? this.consumeText(REPETITIONS);
        this.isMultiplied = Boolean(multiplier);
    }

    get copiesNonpermanentSpell() {
        return this.phrases.some(phrase => isNonpermanentSpell(phrase.raw));
    }
}

import ObjectEffect from './ObjectEffect.js';

const COPY = /^copy /i;
const FOR_EACH = /^for each (?:[^,.]|, (?=non))+/i;
const REPETITIONS = /^(?:twice|\w+ times)(?: instead)?/i;
const COPY_NAMES = '(?:the copy|the copies|it|they|the token)';
const NONLEGENDARY = new RegExp(
    `^,? except ${COPY_NAMES} (?:isn't|aren't) legendary`, 'i'
);
const SPELL = /\bspells?\b/i;
const PERMANENT_SPELL = /\b(?:creature|permanent|artifact|enchantment|aura) spells?\b/i;

const OTHER_SPELL_TYPES = [
    'artifact', 'enchantment', 'creature', 'permanent', 'land', 'battle', 'planeswalker'
];

function isInstantOrSorcerySpell(phrase) {
    return phrase.hasExactType('spell')
        && (phrase.hasExactType('instant') || phrase.hasExactType('sorcery'))
        && !OTHER_SPELL_TYPES.some(type => phrase.hasExactType(type));
}

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
        this.isNonlegendary = Boolean(this.consumeText(NONLEGENDARY));
    }

    get copiesInstantOrSorcery() {
        return this.phrases.some(phrase => isInstantOrSorcerySpell(phrase.resolved));
    }

    get copiesNonpermanentSpell() {
        return this.phrases.some(phrase => isNonpermanentSpell(phrase.raw));
    }
}

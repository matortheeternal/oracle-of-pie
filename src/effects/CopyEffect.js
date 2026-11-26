import ObjectEffect from './ObjectEffect.js';
import { COPY_EXCEPTION } from '../values/copyException.js';

const COPY = /^(?:copy|copies) /i;
const ARTIFACT_SOURCE = /^from an artifact source\b/i;
const NONARTIFACT_SOURCE = /^from an? (?<source>creature|enchantment) source\b/i;
const LEGENDARY_SOURCE = /^from another legendary source that's not a commander\b/i;
const FOR_EACH = /^for each (?:[^,.]|, (?=non))+/i;
const WHEN_CAST = /^when you cast it\b/i;
const TEMPTING_COPIES = new RegExp(
    '^once plus an additional time for each opponent who copied the spell this way\\b',
    'i'
);
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
        const multiplier = this.consumeText(TEMPTING_COPIES)
            ?? this.consumeText(FOR_EACH) ?? this.consumeText(REPETITIONS);
        this.multiplier = multiplier?.[0] ?? null;
        this.isMultiplied = Boolean(multiplier);
        this.isNonlegendary = Boolean(this.consumeText(NONLEGENDARY));
        this.exception = this.consumeText(COPY_EXCEPTION)?.[0] ?? null;
        this.onCast = Boolean(this.consumeText(WHEN_CAST));
        this.fromArtifact = Boolean(this.consumeText(ARTIFACT_SOURCE));
        const source = this.consumeText(NONARTIFACT_SOURCE)?.groups.source;
        this.otherSourceType = source ?? null;
        this.fromOtherLegendaryNoncommander = Boolean(this.consumeText(LEGENDARY_SOURCE));
    }

    get copiesInstantOrSorcery() {
        return this.phrases.some(phrase => isInstantOrSorcerySpell(phrase.resolved));
    }

    get copiesNonpermanentSpell() {
        return this.phrases.some(phrase => isNonpermanentSpell(phrase.raw));
    }
}

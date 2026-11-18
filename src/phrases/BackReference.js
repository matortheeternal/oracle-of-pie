import Phrase from './Phrase.js';

const BACK_REFERENCE_ALTERNATIVES = [
    'it',
    'them',
    'itself',
    'him',
    'her',
    'that (?:creature|card|permanent|spell|token|land|artifact|enchantment|planeswalker)',
    'those (?:creatures|cards|permanents|tokens|spells)',
    'the exiled cards?',
    'the (?:creature|token|tokens|card|permanent)',
    'each of them',
    'one of them',
    '(?:two|three|four|five|\\d+|x) of them',
    '(?:one|two|three|\\d+|x) of those (?:cards|creatures|permanents)',
    'each of those creatures',
    'the rest',
    'the cop(?:y|ies)',
    'that one'
];
const BACK_REFERENCE = new RegExp(
    `^(${BACK_REFERENCE_ALTERNATIVES.join('|')})\\b`, 'i'
);
const TYPE_IN_REFERENCE_ALTERNATIVES = [
    'creature',
    'card',
    'permanent',
    'spell',
    'token',
    'land',
    'artifact',
    'enchantment',
    'planeswalker'
];
const TYPE_IN_REFERENCE = new RegExp(
    `(${TYPE_IN_REFERENCE_ALTERNATIVES.join('|')})`, 'i'
);

export default class BackReference extends Phrase {
    static match(scribe, str) {
        return str.match(BACK_REFERENCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.reference = match[1].toLowerCase();
        const objectType = this.reference.match(TYPE_IN_REFERENCE)?.[1];
        this.objectType = objectType?.toLowerCase() ?? null;
    }

    get isBackReference() {
        return true;
    }

    get refersToExiled() {
        return this.reference.startsWith('the exiled');
    }

    get resolved() {
        return this.antecedent?.resolved ?? this;
    }

    get refersToSelf() {
        return Boolean(this.antecedent?.refersToSelf);
    }

    get controlledByYou() {
        return Boolean(this.antecedent?.controlledByYou);
    }

    get isCardInZone() {
        return Boolean(this.antecedent?.isCardInZone);
    }

    resolveTo(antecedent) {
        const descriptor = { value: antecedent, configurable: true };
        Object.defineProperty(this, 'antecedent', descriptor);
        antecedent?.resolved.references.push(this);
    }

    accepts(candidate) {
        return !this.refersToExiled || Boolean(candidate.owner?.isExile);
    }

    hasType(type) {
        return this.objectType === type || Boolean(this.antecedent?.hasType(type));
    }
}

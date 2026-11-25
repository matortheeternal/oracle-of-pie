import Phrase from './Phrase.js';
import { MODIFIER_PARSERS } from './modifiers/index.js';

const REMAINDER = 'the rest';
const REMAINDER_OF = /^the rest of /;
const BACK_REFERENCE_ALTERNATIVES = [
    'the sacrificed (?:creature|artifact|card|permanent)',
    'the (?:creature|artifact|permanent|land|enchantment|spell|card) that '
        + '(?:attacked|blocked|was sacrificed|entered|died)(?: this way)?',
    'the (?:token|creature) created this way',
    '(?:one|two|three) of the (?:exiled|revealed|milled) cards',
    '(?:one|two|three) of the (?:creature )?cards (?:revealed|milled|exiled) this way',
    'all of (?:those|them)(?: counters)?',
    'each of those (?:cards|tokens|permanents)',
    '(?:any|either) of those (?:cards|tokens|permanents)',
    'that many of (?:those|the) (?:cards|creatures|tokens)',
    'all (?:the )?revealed cards',
    'cards revealed this way',
    'those (?:revealed|exiled) cards',
    'both (?:of those |the )?cards',
    'all (?:of )?them',
    'the other(?= (?:into|on|onto|to) )',
    'any number of (?:the|those) (?:copies|cards|tokens)',
    'either of them',
    'either of those (?:creatures|permanents|tokens)',
    'both of them',
    'the revealed cards',
    'any number of them',
    'the rest of them',
    'those counters',
    'the other cards',
    'those tokens',
    'it',
    'them',
    'itself',
    'him',
    'her',
    'that (?:creature|permanent|artifact|land|enchantment) card',
    'that (?:artifact creature|enchantment creature|creature spell|permanent spell)',
    'that (?:creature|card|permanent|spell|token|land|artifact|enchantment|planeswalker)',
    'those (?:creatures|cards|permanents|tokens|spells)',
    'the (?:exiled|revealed|chosen|discarded|milled) cards?',
    'the (?:creature|token|tokens|card|permanent)',
    'each of them',
    'one of them',
    'one(?= (?:into|onto|on the|on top) )',
    '(?:any number|one|two|three) of (?:the|those) (?:chosen |permanent )?cards',
    '(?:up to |any number of )?(?:one|two|three|four|five|\\d+|x) of them',
    '(?:one|two|three|\\d+|x) of those (?:cards|creatures|permanents|tokens|lands)',
    'the (?:amassed Army|Army you amassed)',
    'each of those creatures',
    'the rest of (?:the|those)(?: revealed| exiled)? cards',
    REMAINDER,
    '(?:the|that) cop(?:y|ies)',
    'the chosen spell',
    'that one',
    '(?:one|each) of (?:those|the|their) piles',
    '(?:one|that|the other) pile',
    'the other(?= into )'
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

function wasExiled(candidate, phrase) {
    return Boolean(candidate.owner?.isExile || phrase.owner?.isExile);
}

export default class BackReference extends Phrase {
    static match(scribe, str) {
        return str.match(BACK_REFERENCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.reference = match[1].toLowerCase();
        const objectType = this.reference.match(TYPE_IN_REFERENCE)?.[1];
        this.objectType = objectType?.toLowerCase() ?? null;
        this.modifiers = this.consumeAll(MODIFIER_PARSERS, []);
        this.state = this.modifiers.find(modifier => modifier.state) ?? null;
    }

    get children() {
        return this.modifiers;
    }

    get isBackReference() {
        return true;
    }

    get isRemainder() {
        return this.reference === REMAINDER || REMAINDER_OF.test(this.reference);
    }

    get refersToExiled() {
        return this.reference.startsWith('the exiled');
    }

    get refersToExiledCard() {
        const root = this.resolved;
        if (root.owner?.isExile) return true;
        const earlier = root.references.slice(0, root.references.indexOf(this));
        return earlier.some(reference => reference.owner?.isExile);
    }

    get resolved() {
        return this.antecedent?.resolved ?? this;
    }

    get refersToSelf() {
        return Boolean(this.antecedent?.refersToSelf);
    }

    get controlledByYou() {
        return this.modifiers.some(modifier => modifier.controlledByYou)
            || Boolean(this.antecedent?.controlledByYou);
    }

    get isCardInZone() {
        const inOffBoardZone = this.modifiers.some(
            modifier => modifier.zone && modifier.zone !== 'battlefield'
        );
        return inOffBoardZone || Boolean(this.antecedent?.isCardInZone);
    }

    resolveTo(antecedent) {
        const descriptor = { value: antecedent, configurable: true };
        Object.defineProperty(this, 'antecedent', descriptor);
        antecedent?.resolved.references.push(this);
    }

    accepts(candidate, phrase = candidate) {
        if (this.refersToExiled && !wasExiled(candidate, phrase)) return false;
        return this.acceptsType(candidate);
    }

    acceptsType(candidate) {
        if (this.objectType !== 'spell') return !candidate.requiresTypedReference;
        return Boolean(candidate.hasType?.('spell'));
    }

    allowsTypeAlone(type) {
        if (this.objectType === type) return true;
        return Boolean(this.antecedent?.allowsTypeAlone(type));
    }

    hasType(type) {
        return this.objectType === type || Boolean(this.antecedent?.hasType(type));
    }
}

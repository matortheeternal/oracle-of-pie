import Phrase from './Phrase.js';
import { MODIFIER_PARSERS } from './modifiers/index.js';
import RelationModifier from './modifiers/RelationModifier.js';
import { TYPE_WORDS } from './vocabulary.js';
import { classifyWord, TYPE, SUBTYPE, QUALIFIER, EXCLUSION } from './wordClass.js';
import NegatedWord from './NegatedWord.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const N = NUMBER_PATTERN;
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];
const ORDINAL = `(?:${ORDINALS.join('|')})`;
const ORDINAL_WORD = new RegExp(`\\b${ORDINAL}$`);
const DETERMINER_ALTERNATIVES = [
    `${N} or (${N}) (?:other )?target`,
    `up to (${N}) (?:other )?target`,
    'any number of (?:other )?target',
    `(${N}) (?:other )?target`,
    `up to (${N})`,
    'up to that many',
    'another target', 'other target', 'target', 'each other', 'each', 'all other',
    'all', 'another', 'one or more', `(${N}) or more`, 'any number of', 'any', N,
    `the ${ORDINAL}`, 'the', 'that', 'those', 'your(?= commanders?\\b)'
];
const DETERMINER = new RegExp(`^(${DETERMINER_ALTERNATIVES.join('|')})\\b`, 'i');
const WORD = /^([A-Za-z][A-Za-z'-]*)(?=[\s,.;:"]|$)/;
const TYPE_JOINER = /^(?:,? ?(?:and\/or|or|and) |, )/;
const COMMANDER = 'commander';
const CHOSEN = 'chosen';
const MASS_DETERMINER = /^(each|all)/i;
const TARGET_DETERMINER = /target/i;
const OTHER = /\b(?:an)?other\b/i;
const PLURAL = /s$/;
const PERMANENT_TYPES = [
    'creature', 'artifact', 'enchantment', 'land', 'planeswalker', 'battle', 'permanent'
];
const ADJECTIVAL_TYPES = new Set(['card', 'spell', 'token', 'permanent']);

const PLURAL_S = /(?<=[^s])s$/;
function nextWordClass(scribe, str) {
    const match = str.match(WORD);
    return match ? classifyWord(scribe, match[1]) : null;
}

function ordinalOf(determiner) {
    const word = determiner?.match(ORDINAL_WORD)?.[0];
    return word ? ORDINALS.indexOf(word) + 1 : null;
}

function isLoneType(group, type) {
    if (!group.includes(type)) return false;
    return !group.some(other => other !== type && PERMANENT_TYPES.includes(other));
}

function singular(word) {
    return word.replace(PLURAL_S, '');
}

const WORD_ADDERS = {
    [TYPE]: 'addType',
    [SUBTYPE]: 'addSubtype',
    [QUALIFIER]: 'addQualifier',
    [EXCLUSION]: 'addExclusion'
};

export default class NounPhrase extends Phrase {
    static match(scribe, str) {
        const determiner = str.match(DETERMINER);
        const rest = determiner ? str.slice(determiner[0].length).trimStart() : str;
        if (!nextWordClass(scribe, rest)) return null;
        return determiner ?? [''];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.determiner = match[1]?.toLowerCase() ?? null;
        this.count = numberValue(match.slice(2).find(Boolean) ?? '1');
        this.ordinal = ordinalOf(this.determiner);
        this.qualifiers = [];
        this.exclusions = [];
        this.types = [];
        this.subtypes = [];
        this.pluralTypes = false;
        this.typeGroups = [];
        this.followsType = false;
        this.consumeWords();
        this.modifiers = this.consumeAll(MODIFIER_PARSERS, []);
    }

    consumeWords() {
        while (this.consumeWord() || this.consumeJoiner()) continue;
    }

    consumeWord() {
        if (RelationModifier.match(this.scribe, this.remainingStr)) return false;
        const match = this.remainingStr.match(WORD);
        const wordClass = match && classifyWord(this.scribe, match[1]);
        if (!wordClass) return false;
        this.consumeText(WORD);
        this.addWord(match[1], wordClass);
        return true;
    }

    consumeJoiner() {
        const joiner = this.remainingStr.match(TYPE_JOINER);
        if (!joiner || !this.hasWords) return false;
        const next = this.remainingStr.slice(joiner[0].length);
        if (!nextWordClass(this.scribe, next)) return false;
        this.consumeText(TYPE_JOINER);
        this.followsType = false;
        return true;
    }

    addWord(word, wordClass) {
        this.followsType = wordClass === TYPE && this.followsType;
        this[WORD_ADDERS[wordClass]](word);
    }

    addQualifier(word) {
        this.qualifiers.push(word.toLowerCase());
    }

    addExclusion(word) {
        this.exclusions.push(new NegatedWord(this.scribe, word));
    }

    addSubtype(word) {
        this.subtypes.push(word);
        this.pluralTypes = this.pluralTypes || PLURAL.test(word);
    }

    addType(word) {
        const lower = word.toLowerCase();
        const type = TYPE_WORDS[lower];
        this.groupType(type);
        if (this.types.length && this.isAdjectivalType(type))
            this.qualifiers.push(this.types.pop());
        this.types.push(type);
        this.pluralTypes = this.pluralTypes || PLURAL.test(lower);
    }

    groupType(type) {
        if (this.followsType) this.typeGroups.at(-1).push(type);
        if (!this.followsType) this.typeGroups.push([type]);
        this.followsType = true;
    }

    allowsTypeAlone(type) {
        if (this.types.includes('permanent')) return this.hasType(type);
        return this.typeGroups.some(group => isLoneType(group, type));
    }

    hasTypeConjunction(conjunction) {
        const types = conjunction.split(' ');
        return this.typeGroups.some(group => types.every(type => group.includes(type)));
    }

    isAdjectivalType(type) {
        return ADJECTIVAL_TYPES.has(type);
    }

    get hasWords() {
        const words = [this.types, this.subtypes, this.qualifiers, this.exclusions];
        return words.some(list => list.length > 0);
    }

    get children() {
        return this.modifiers;
    }

    get isRecognized() {
        if (this.isCommanderGroup) return true;
        return Boolean(this.types.length || this.subtypes.length);
    }

    get isTargeted() {
        return TARGET_DETERMINER.test(this.determiner ?? '');
    }

    get declaresMultipleTargets() {
        return this.isTargeted && this.count > 1;
    }

    get excludesSelf() {
        return OTHER.test(this.determiner ?? '') || this.qualifiers.includes('other');
    }

    get isBoundedByPreviousCount() {
        return this.determiner === 'up to that many';
    }

    get isMass() {
        if (!this.determiner) return Boolean(this.pluralTypes);
        return MASS_DETERMINER.test(this.determiner);
    }

    get isRelativeGroup() {
        if (this.qualifiers.includes(CHOSEN)) return true;
        return this.modifiers.some(modifier => modifier.relatesToObject);
    }

    get isCommanderGroup() {
        return this.qualifiers.includes(COMMANDER);
    }

    get controlledByYou() {
        return this.modifiers.some(modifier => modifier.controlledByYou);
    }

    get controlledByOpponent() {
        return this.modifiers.some(modifier => modifier.controlledByOpponent);
    }

    get zone() {
        return this.modifiers.map(modifier => modifier.zone).find(Boolean) ?? null;
    }

    get zoneOwnedByYou() {
        return this.modifiers.some(modifier => modifier.ownedByYou);
    }

    get isCardInZone() {
        if (this.zone && this.zone !== 'battlefield') return true;
        return this.types.includes('card') || this.qualifiers.includes('card');
    }

    get requiredKeywords() {
        return this.modifiers.flatMap(modifier => modifier.keywords);
    }

    hasSubtype(subtype) {
        return this.subtypes.some(word => word === subtype || singular(word) === subtype);
    }

    requiresKeyword(keyword) {
        return this.requiredKeywords.includes(keyword.toLowerCase());
    }

    hasType(type) {
        if (this.excludesType(type)) return false;
        return this.hasExactType(type) || this.impliesType(type);
    }

    excludes(wordClass, word) {
        return this.exclusions.some(exclusion => exclusion.excludes(wordClass, word));
    }

    excludesType(type) {
        return this.excludes(TYPE, type);
    }

    excludesSubtype(subtype) {
        return this.excludes(SUBTYPE, subtype);
    }

    excludesQualifier(qualifier) {
        return this.excludes(QUALIFIER, qualifier);
    }

    impliesType(type) {
        if (type === 'player' || type === 'spell') return false;
        if (this.types.includes('permanent')) return true;
        return type === 'creature' && !this.types.length && this.namesCreatureSubtype;
    }

    get namesCreatureSubtype() {
        const definitions = this.scribe.definitions;
        const isCreatureSubtype = subtype =>
            !definitions.isNoncreatureSubtype(singular(subtype));
        return this.subtypes.some(isCreatureSubtype);
    }

    get isPermanentObject() {
        if (this.hasExactType('spell')) return false;
        return PERMANENT_TYPES.some(type => this.hasType(type));
    }

    get hasSubtypes() {
        return this.subtypes.length > 0;
    }

    hasExactType(type) {
        return this.types.includes(type) || this.qualifiers.includes(type);
    }

    hasQualifier(qualifier) {
        return this.qualifiers.includes(qualifier);
    }
}

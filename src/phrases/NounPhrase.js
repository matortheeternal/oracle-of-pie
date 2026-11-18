import Phrase from './Phrase.js';
import { MODIFIER_PARSERS } from './modifiers/index.js';
import {
    TYPE_WORDS, QUALIFIER_WORDS, NEGATED_QUALIFIER, SUBTYPE_WORD, NONCREATURE_SUBTYPES
} from './vocabulary.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const N = NUMBER_PATTERN;
const DETERMINER_ALTERNATIVES = [
    `up to (${N}) (?:other )?target`,
    'any number of (?:other )?target',
    `(${N}) (?:other )?target`,
    `up to (${N})`,
    'up to that many',
    'another target', 'other target', 'target', 'each other', 'each', 'all other',
    'all', 'another', 'one or more', 'any number of', 'any', N, 'the', 'that', 'those'
];
const DETERMINER = new RegExp(`^(${DETERMINER_ALTERNATIVES.join('|')})\\b`, 'i');
const WORD = /^([A-Za-z][A-Za-z'-]*)(?=[\s,.;:"]|$)/;
const TYPE_JOINER = /^(?:,? ?(?:and\/or|or|and) |, )/;
const COMMANDER = 'commander';
const CHOSEN = 'chosen';
const MASS_DETERMINER = /^(each|all)/i;
const TARGET_DETERMINER = /target/i;
const PLURAL = /s$/;
const PERMANENT_TYPES = [
    'creature', 'artifact', 'enchantment', 'land', 'planeswalker', 'battle', 'permanent'
];
const ADJECTIVAL_TYPES = new Set(['card', 'spell', 'token', 'permanent']);

const PLURAL_S = /(?<=[^s])s$/;
function classifyWord(word) {
    const lower = word.toLowerCase();
    if (Object.hasOwn(TYPE_WORDS, lower)) return 'type';
    if (QUALIFIER_WORDS.has(lower) || NEGATED_QUALIFIER.test(word)) return 'qualifier';
    if (SUBTYPE_WORD.test(word)) return 'subtype';
    return null;
}

function nextWordClass(str) {
    const match = str.match(WORD);
    return match ? classifyWord(match[1]) : null;
}

function isLoneType(group, type) {
    if (!group.includes(type)) return false;
    return !group.some(other => other !== type && PERMANENT_TYPES.includes(other));
}

function singular(word) {
    return word.replace(PLURAL_S, '');
}

export default class NounPhrase extends Phrase {
    static match(scribe, str) {
        const determiner = str.match(DETERMINER);
        const rest = determiner ? str.slice(determiner[0].length).trimStart() : str;
        if (!nextWordClass(rest)) return null;
        return determiner ?? [''];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.determiner = match[1]?.toLowerCase() ?? null;
        this.count = numberValue(match[2] ?? match[3] ?? match[4] ?? '1');
        this.qualifiers = [];
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
        const match = this.remainingStr.match(WORD);
        const wordClass = match && classifyWord(match[1]);
        if (!wordClass) return false;
        this.consumeText(WORD);
        this.addWord(match[1], wordClass);
        return true;
    }

    consumeJoiner() {
        const joiner = this.remainingStr.match(TYPE_JOINER);
        if (!joiner || !this.hasWords) return false;
        if (!nextWordClass(this.remainingStr.slice(joiner[0].length))) return false;
        this.consumeText(TYPE_JOINER);
        this.followsType = false;
        return true;
    }

    addWord(word, wordClass) {
        const lower = word.toLowerCase();
        this.followsType = wordClass === 'type' && this.followsType;
        if (wordClass === 'type') return this.addType(lower);
        if (wordClass === 'subtype') return this.addSubtype(word);
        this.qualifiers.push(lower);
    }

    addSubtype(word) {
        this.subtypes.push(word);
        this.pluralTypes = this.pluralTypes || PLURAL.test(word);
    }

    addType(word) {
        const type = TYPE_WORDS[word];
        this.groupType(type);
        if (this.types.length && this.isAdjectivalType(type))
            this.qualifiers.push(this.types.pop());
        this.types.push(type);
        this.pluralTypes = this.pluralTypes || PLURAL.test(word);
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

    isAdjectivalType(type) {
        return ADJECTIVAL_TYPES.has(type);
    }

    get hasWords() {
        const words = [this.types, this.subtypes, this.qualifiers];
        return words.some(list => list.length > 0);
    }

    get children() {
        return this.modifiers;
    }

    get isRecognized() {
        return Boolean(this.types.length || this.subtypes.length);
    }

    get isTargeted() {
        return TARGET_DETERMINER.test(this.determiner ?? '');
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
        return this.modifiers.map(modifier => modifier.keyword).filter(Boolean);
    }

    hasType(type) {
        return this.hasExactType(type) || this.impliesType(type);
    }

    impliesType(type) {
        if (type === 'player' || type === 'spell') return false;
        if (this.types.includes('permanent')) return true;
        return type === 'creature' && !this.types.length && this.namesCreatureSubtype;
    }

    get namesCreatureSubtype() {
        const isCreatureSubtype = subtype => !NONCREATURE_SUBTYPES.has(singular(subtype));
        return this.subtypes.some(isCreatureSubtype);
    }

    get isPermanentObject() {
        if (this.hasExactType('spell')) return false;
        return PERMANENT_TYPES.some(type => this.hasType(type));
    }

    hasExactType(type) {
        return this.types.includes(type) || this.qualifiers.includes(type);
    }

    hasQualifier(qualifier) {
        return this.qualifiers.includes(qualifier);
    }
}

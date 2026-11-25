import { ActivationCost } from 'mana-scribe';
import Node from '../core/Node.js';

const PARAMETER_ALTERNATIVES = [
    '(?:Food|land) \\d+',
    'with [^.]+',
    '\\{[^}]+\\}(?:\\{[^}]+\\})*',
    '\\d+',
    'X',
    'from the (?:color of your choice|chosen colou?r)',
    'from everything',
    'from (?:spells|[a-z]+) and from (?:permanents|[a-z]+)',
    'from [a-z]+(?: and from [a-z]+)*',
    'legendary creature \\{[^}]+\\}(?:\\{[^}]+\\})*',
    '(?:commander|citizen|hero|planeswalker|wizard) \\{[^}]+\\}(?:\\{[^}]+\\})*',
    'onto (?:instant or sorcery|arcane) \\{[^}]+\\}(?:\\{[^}]+\\})*',
    '[a-z]+ [A-Z][a-z]+',
    'N'
];
const MANA_PARAMETER = /^\{/;
const NAMED_PARTNER = / with$/;
const PARAMETER = new RegExp(
    `^(?:—| )?(${PARAMETER_ALTERNATIVES.join('|')})(?![\\w'-])`
);
const COST = '\\{[^}]+\\}(?:\\{[^}]+\\})*';
const COLOR = '(?:white|blue|black|red|green|colorless)';
const COLORS = `${COLOR}(?:, ${COLOR})*(?:,? (?:or|and)(?: from)? ${COLOR})?`;
const FROM_QUALIFIERS = [
    'the (?:chosen )?player',
    'multicolored', 'monocolored',
    'the colors? of (?:your choice|that creature)',
    'the chosen (?:color|player|card type|card name)',
    'the player of your choice',
    'the card type of your choice',
    'the colors? among [^,.]+',
    'the mana value of the chosen quality',
    'each of (?:its|that creature\'s) colors',
    'each of your opponents',
    'mana value (?:of the chosen quality|among artifacts you control'
        + '|other than the chosen number)',
    'mana value \\d+ or (?:less|greater)',
    '(?:activated and triggered abilities|spells and from permanents)'
        + ' that were cast this turn',
    'activated and triggered abilities',
    'artifacts, creatures, and enchantments',
    'each color',
    'the chosen quality',
    'that color',
    `${COLORS}(?: or from the color of your choice)?`,
    '(?!player and |creature and |land and )[A-Za-z]+ creatures?',
    '(?:[a-z]+ and from )*[a-z]+'
];
const FROM_DETAIL = FROM_QUALIFIERS.join('|');
const FROM = new RegExp(`^(from (?:${FROM_DETAIL}))\\b`, 'i');
const FROM_AFTER_KEYWORD = new RegExp(`^(${FROM_DETAIL})\\b`, 'i');
const EQUIP = new RegExp(`^((?:legendary creature |creature token |[\\w-]+ )?${COST})`);
const ENCHANT_TARGETS = [
    'artifact creature', 'artifact or creature',
    'creature or Vehicle', 'creature or land',
    'creature or planeswalker', 'player or planeswalker', 'creature you control',
    'land you control', 'permanent you control', 'opponent', 'creature', 'land', 'player',
    'artifact', 'enchantment', 'permanent', 'planeswalker', 'Vehicle', 'Room'
];
const ENCHANT = new RegExp(`^(${ENCHANT_TARGETS.join('|')})(?= and ")\\b`, 'i');
const DEFINED_PARAMETER = {
    protection: FROM,
    hexproof: FROM,
    'hexproof from': FROM_AFTER_KEYWORD,
    equip: EQUIP,
    enchant: ENCHANT
};

export default class Keyword extends Node {
    static match(scribe, str) {
        return str.match(scribe.keywordPattern);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.name = match[1].toLowerCase();
        const pattern = DEFINED_PARAMETER[this.name];
        const defined = pattern && this.remainingStr.match(pattern);
        const parameter = defined ?? this.remainingStr.match(PARAMETER);
        this.parameter = parameter?.[1] ?? null;
        if (parameter?.[0])
            this.remainingStr = this.remainingStr.slice(parameter[0].length);
    }

    get takesName() {
        return NAMED_PARTNER.test(this.name);
    }

    get hasManaParameter() {
        return MANA_PARAMETER.test(this.parameter ?? '');
    }

    get manaColors() {
        if (!MANA_PARAMETER.test(this.parameter ?? '')) return [];
        return ActivationCost.parse(this.parameter).colors;
    }
}

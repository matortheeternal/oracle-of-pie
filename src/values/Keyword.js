import { ActivationCost } from 'mana-scribe';
import Node from '../core/Node.js';

const PARAMETER_ALTERNATIVES = [
    '(?:artifact|creature|enchantment) \\d+',
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
    'the last chosen color',
    'last chosen color',
    'the player of your choice',
    'the card type of your choice',
    'the colors? among [^,.]+',
    'the mana value of the chosen quality',
    'each of (?:its|that creature\'s) colors',
    'each of your opponents',
    'mana value (?:of the chosen quality|among artifacts you control'
        + '|other than the chosen number)',
    'each mana value (?:of the chosen quality|among artifacts you control'
        + '|other than the chosen number)',
    'that player',
    'Ring-bearers',
    'mana value \\d+ or (?:less|greater)',
    '(?:activated and triggered abilities|spells and from permanents)'
        + ' that were cast this turn',
    'activated and triggered abilities',
    'artifacts, creatures, and enchantments',
    'each color(?: that\'s not in your commander\'s color identity)?',
    'the chosen quality',
    'that color',
    `${COLORS}(?: or from the color of your choice)?`,
    '(?!player and |creature and |land and )[A-Za-z]+ creatures?',
    '(?:[a-z]+ and from )*[a-z]+'
];
const FROM_DETAIL = FROM_QUALIFIERS.join('|');
const FROM = new RegExp(`^(from (?:${FROM_DETAIL}))\\b`, 'i');
const FROM_AFTER_KEYWORD = new RegExp(`^(${FROM_DETAIL})\\b`, 'i');
const EQUIP_TYPE = '[\\w-]+(?:, [\\w-]+)*(?:,? or [\\w-]+)?';
const EQUIP = new RegExp(
    `^((?:legendary creature |creature token |${EQUIP_TYPE} )?${COST})`
);
const EQUIP_ALTERNATIVE = new RegExp(`^ or (${COST})`);
const EMERGE = new RegExp(
    `^(from [A-Za-z]+(?: or [A-Za-z]+| creature)? ${COST})`
);
const ENCHANT_TARGETS = [
    'artifact creature', 'artifact or creature',
    'creature or Vehicle', 'creature or land',
    'creature or planeswalker', 'player or planeswalker', 'creature you control',
    'land you control', 'permanent you control', 'opponent', 'creature', 'land', 'player',
    'artifact', 'enchantment', 'permanent', 'planeswalker', 'Vehicle', 'Room',
    '[A-Z][a-z]+ you control'
];
const ENCHANT = new RegExp(`^(${ENCHANT_TARGETS.join('|')})\\b(?= and "|[.]?$)`);
const DEFINED_PARAMETER = {
    protection: FROM,
    hexproof: FROM,
    'hexproof from': FROM_AFTER_KEYWORD,
    equip: EQUIP,
    enchant: ENCHANT,
    emerge: EMERGE
};
const TYPE_SPECIFIC = /^(?<type>artifact|creature|enchantment) (offering|landwalk)\b/i;

export default class Keyword extends Node {
    static match(scribe, str) {
        return str.match(scribe.keywordPattern) ?? this.matchTypeSpecific(scribe, str);
    }

    static matchTypeSpecific(scribe, str) {
        const match = str.match(TYPE_SPECIFIC);
        if (!match || !scribe.isKeyword(match[2])) return null;
        return [match[0], match[2], match.groups.type];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.name = match[1].toLowerCase();
        this.readParameter(match[2]);
        this.alternativeEquipCost = this.readAlternativeEquipCost();
    }

    readParameter(defaultParameter) {
        const definition = this.scribe.definitions.keywords.definitionFor(this.name);
        const configured = definition?.parameterPattern;
        if (configured) return this.readConfiguredParameter(configured);
        const pattern = DEFINED_PARAMETER[this.name];
        const defined = pattern && this.remainingStr.match(pattern);
        const parameter = defined ?? this.remainingStr.match(PARAMETER);
        this.parameter = parameter?.[1] ?? defaultParameter ?? null;
        this.consumeParameter(parameter);
    }

    readConfiguredParameter(pattern) {
        const parameter = this.remainingStr.match(pattern);
        this.parameters = parameter?.groups ?? null;
        this.parameter = this.parameters?.cost ?? parameter?.[1] ?? null;
        this.consumeParameter(parameter);
    }

    consumeParameter(parameter) {
        if (parameter?.[0])
            this.remainingStr = this.remainingStr.slice(parameter[0].length);
    }

    readAlternativeEquipCost() {
        if (this.name !== 'equip' || !this.hasManaParameter) return null;
        const alternative = this.remainingStr.match(EQUIP_ALTERNATIVE);
        if (!alternative) return null;
        this.remainingStr = this.remainingStr.slice(alternative[0].length);
        return alternative[1];
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

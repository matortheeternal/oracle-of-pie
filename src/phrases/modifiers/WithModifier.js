import Modifier from './Modifier.js';

const BEFORE_DESTINATION = '(?=,|\\.|$| (?:into|onto|from|until)\\b'
    + '| to (?:its|their) owners?'
    + '| (?:and put|can|can\'t|gets?|gains?|has|have|are|is|deals?) )';
const WITH_ALTERNATIVES = [
    '(?:base )?(?:power and toughness|power|toughness) [0-9]+/[0-9]+',
    'mana cost (?:\\{[^}]+\\})+(?: or (?:\\{[^}]+\\})+)?',
    '(?:an? )?(?:even|odd) mana value',
    '(?:lesser|greater|equal) (?:power|toughness)',
    'power',
    'toughness',
    'mana value',
    'base power and toughness', 'base power',
    'equal or lesser toughness',
    'the greatest toughness',
    'different powers', 'different toughnesses',
    'equal or lesser mana value',
    'lesser mana value',
    'greater mana value',
    'total power',
    'total mana value',
    'converted mana cost',
    'an? (?:[\\w+\\-/]+ )?counter on it',
    'one or more (?:[\\w+\\-/]+ )?counters on (?:it|them)',
    '[\\w+\\-/]+ counters on (?:it|them)',
    'counters on (?:it|them)',
    '(?:one|two|three|four|five|six|seven|eight|nine|ten) [a-z]+'
        + ' counters? on (?:it|them)',
    `the greatest (?:power|mana value)[^,.]*?${BEFORE_DESTINATION}`,
    'the same name as (?:that|the chosen|the exiled) (?:card|permanent|creature)',
    'the same name as [^,.]+',
    'the same mana value as (?:that|the chosen) (?:card|permanent|creature)',
    'that name',
    'different names',
    'the chosen name',
    '\\{X\\} in (?:its|their) mana costs?',
    'an? [a-z]+ (?:mana )?ability'
];
const COMPARED = `[^,.]+?${BEFORE_DESTINATION}`;
const COMPARISON_ALTERNATIVES = [
    ' (?:greater|less) than (?:its|their) (?:power|toughness)\\b',
    ' (?:greater|less) than (?:its|their) base (?:power|toughness)\\b',
    ' (?:\\d+|X|N)(?:, (?:\\d+|X|N))*,? or (?:\\d+|X|N)\\b',
    ' (?:\\d+|X|N) plus \\d+\\b',
    '(?: (?:and|or) toughness)? (?:\\d+|X|N) or (?:less|greater|more)',
    `(?: or toughness)? less than (?:or equal to )?${COMPARED}`,
    ' less than (?:the|that) (?:creature|permanent) that died',
    `(?: or toughness)? greater than ${COMPARED}`,
    ` equal to ${COMPARED}`,
    ' (?:\\d+|X|N)\\b',
    ' (?:[0-9]+|X)/(?:[0-9]+|X)\\b',
    ' (?:than|as) (?:that|the chosen) (?:spell|card|permanent)\\b',
    ' of the chosen (?:quality|number|value)'
];
const WITH = new RegExp(
    `^(?:each )?(with|without|and has) (${WITH_ALTERNATIVES.join('|')})(?![\\w-])`
        + `(${COMPARISON_ALTERNATIVES.join('|')})?`,
    'i'
);

const SAME_PROPERTY = /^the same (?:name|mana value) as /;
const FIXED_PT = /^(?:base )?(?:power and toughness|power|toughness) \d+\/\d+$/;

export default class WithModifier extends Modifier {
    static match(scribe, str) {
        return str.match(WITH);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.negated = match[1].toLowerCase() === 'without';
        this.property = match[2].toLowerCase();
        this.comparison = match[3]?.trim() ?? null;
    }

    get relatesToObject() {
        return SAME_PROPERTY.test(this.property);
    }

    get requiresFixedStats() {
        return FIXED_PT.test(this.property);
    }
}

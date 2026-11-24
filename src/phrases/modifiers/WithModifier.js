import Modifier from './Modifier.js';

const BEFORE_DESTINATION = '(?=,|\\.|$| to (?:its|their) owners?\'?s? hands?| until\\b)';
const WITH_ALTERNATIVES = [
    'power',
    'toughness',
    'mana value',
    'total power',
    'total mana value',
    'converted mana cost',
    'an? (?:[\\w+\\-/]+ )?counter on it',
    'one or more (?:[\\w+\\-/]+ )?counters on (?:it|them)',
    '[\\w+\\-/]+ counters on (?:it|them)',
    'counters on (?:it|them)',
    `the greatest (?:power|mana value)[^,.]*?${BEFORE_DESTINATION}`,
    'the same name as [^,.]+',
    'that name',
    'different names',
    'the chosen name',
    '\\{X\\} in (?:its|their) mana costs?',
    'an? [a-z]+ (?:mana )?ability'
];
const COMPARED = `[^,.]+?${BEFORE_DESTINATION}`;
const COMPARISON_ALTERNATIVES = [
    ' (?:greater|less) than (?:its|their) (?:power|toughness)\\b',
    '(?: or toughness)? (?:\\d+|X|N) or (?:less|greater|more)',
    `(?: or toughness)? less than ${COMPARED}`,
    `(?: or toughness)? greater than ${COMPARED}`,
    ` equal to ${COMPARED}`,
    ' (?:\\d+|X|N)\\b',
    ' of the chosen quality'
];
const WITH = new RegExp(
    `^(with|without) (${WITH_ALTERNATIVES.join('|')})\\b`
        + `(${COMPARISON_ALTERNATIVES.join('|')})?`,
    'i'
);

const SAME_NAME = /^the same name as /;

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
        return SAME_NAME.test(this.property);
    }
}

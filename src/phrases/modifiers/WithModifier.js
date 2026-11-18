import Modifier from './Modifier.js';

const WITH_ALTERNATIVES = [
    'flying',
    'reach',
    'defender',
    'trample',
    'deathtouch',
    'haste',
    'vigilance',
    'menace',
    'first strike',
    'power',
    'toughness',
    'mana value',
    'total power',
    'converted mana cost',
    'a [\\w+\\-/]+ counter on it',
    '[\\w+\\-/]+ counters on (?:it|them)',
    'counters on (?:it|them)',
    'the greatest power[^,.]*',
    'the same name as [^,.]+',
    'that name',
    'an? [a-z]+ (?:mana )?ability'
];
const COMPARISON_ALTERNATIVES = [
    '(?: or toughness)? (?:\\d+|X|N) or (?:less|greater|more)',
    '(?: or toughness)? less than [^,.]+',
    '(?: or toughness)? greater than [^,.]+',
    ' equal to [^,.]+',
    ' (?:\\d+|X|N)(?=[,.]|$)'
];
const WITH = new RegExp(
    `^(with|without) (${WITH_ALTERNATIVES.join('|')})\\b`
        + `(${COMPARISON_ALTERNATIVES.join('|')})?`,
    'i'
);

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

    get keyword() {
        return this.comparison || this.negated ? null : this.property;
    }
}

import Parser from '../../core/Parser.js';

const CONDITIONS = [
    'with (?:a single|[0-9]+ or more) targets?',
    'that\'s (?:[0-9]+ or more colors|white, blue, black, or red)',
    'using teamwork',
    'other than (?:your|their) first spell (?:that|each) turn',
    'from an artifact source',
    'that mana is spent to (?:cast|activate) (?:it|~|this spell)',
    'while ~ is attacking'
];
const CAST_CONDITION = new RegExp('^(?:' + CONDITIONS.join('|') + ')\\b', 'i');

export default class SpellCastCondition extends Parser {
    static match(scribe, str) {
        return str.match(CAST_CONDITION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.condition = match[0].toLowerCase();
    }
}

import Parser from '../../core/Parser.js';

const CONDITIONS = [
    'with one or more targets',
    'with (?:one or more )?(?:white|blue|black|red|green) mana symbols? in its mana cost',
    'with a mana cost that contains \\{X\\}',
    'that\'s exactly two colors',
    'you don\'t own',
    'they don\'t own',
    'other than ~',
    'or a Dragon spell',
    'or creature spell with doctor\'s companion',
    'or a spell that targets a creature you control',
    ', \\d+, or \\d+',
    'other than the first spell they cast each turn or copies a spell',
    'that doesn\'t share a creature type with a creature you control'
        + ' or a creature card in your graveyard',
    'with (?:a single|[0-9]+ or more) targets?',
    'that\'s (?:[0-9]+ or more colors|white, blue, black, or red)',
    'using teamwork',
    'other than (?:your|their) first spell (?:that|each) turn',
    'from an artifact source',
    'that mana is spent to (?:cast|activate) (?:it|~|this spell)',
    'while ~ is attacking',
    'while casting a spell with emerge',
    'while you\'re activating a craft ability'
];
const CAST_CONDITION = new RegExp('^(?:' + CONDITIONS.join('|') + ')(?!\\w)', 'i');

export default class SpellCastCondition extends Parser {
    static match(scribe, str) {
        return str.match(CAST_CONDITION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.condition = match[0].toLowerCase();
    }
}

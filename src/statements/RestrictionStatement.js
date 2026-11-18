import Statement from './Statement.js';

const RESTRICTION_ALTERNATIVES = [
    'activate (?:only|this ability only) [^.]*',
    'this ability triggers only [^.]*',
    'do this only [^.]*',
    '(?:~|this spell) can\'t be countered[^.]*',
    'spend this mana only [^.]*',
    'it\'s still a land',
    'you may choose new targets for the cop(?:y|ies)',
    'you may choose the same mode more than once',
    'any player may [^.]*',
    'a deck can have any number of [^.]*',
    'you may look at the top card of your library any time',
    'put the rest [^.]*',
    'you choose [^.]+ from (?:it|among them|their hand)',
    'level \\d+[^.]*',
    '\\d+\\+ ?\\|[^.]*',
    '\\d+\\/\\d+'
];
const RESTRICTION = new RegExp(
    `^(${RESTRICTION_ALTERNATIVES.join('|')})$`, 'i'
);

export default class RestrictionStatement extends Statement {
    static match(scribe, str) {
        return str.match(RESTRICTION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match[1];
    }
}

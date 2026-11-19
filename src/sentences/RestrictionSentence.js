import Sentence from './Sentence.js';

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

const ONLY_ONCE = /\bonly once\b(?! each)/i;
const LIMITED_USES = /\bonly (?:once|twice|\w+ times) each\b/i;

export default class RestrictionSentence extends Sentence {
    static matchStatement(scribe, text) {
        return text.match(RESTRICTION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.text = match.statement[1];
    }

    get limitsToOnce() {
        return ONLY_ONCE.test(this.text);
    }

    get limitsUses() {
        return this.limitsToOnce || LIMITED_USES.test(this.text);
    }
}

import Parser from '../core/Parser.js';
import PhraseList from '../phrases/PhraseList.js';

const TYPE_TEST = new RegExp(
    '^(?<subject>it|they|that card|that creature)(?:\'s| is| are) '
        + '(?<description>(?:an? |not an? )?[a-z -]+)$', 'i'
);
const NEGATION = /^not /i;

export default class TrailingPredicate extends Parser {
    static match(scribe, str) {
        const match = str.match(TYPE_TEST);
        if (!match) return null;
        const text = match.groups.description.replace(NEGATION, '');
        const listMatch = PhraseList.match(scribe, text);
        if (!listMatch) return null;
        const types = PhraseList.parse(scribe, listMatch, text);
        return types.isRecognized && !types.remainingStr
            ? Object.assign(match, { types }) : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.subjectText = match.groups.subject.toLowerCase();
        this.negated = NEGATION.test(match.groups.description);
        this.types = match.types;
    }

    get children() {
        return [this.types];
    }
}

import Parser from '../core/Parser.js';
import NounPhrase from '../phrases/NounPhrase.js';
import QuotedAbility from '../values/QuotedAbility.js';

const DESCRIPTION = /^(?<text>(?:target |\d+\/\d+ )[^]+?)\.?$/i;
const QUOTE_JOINER = /^and (?=["'])/i;

function readQuotedAbility(parser, rest) {
    if (!QUOTE_JOINER.test(rest)) return null;
    return parser.parseNext(rest.replace(QUOTE_JOINER, ''), [QuotedAbility]);
}

export default class ModeOption extends Parser {
    static match(scribe, str) {
        const match = str.match(DESCRIPTION);
        if (!match) return null;
        const parser = new Parser(scribe);
        const phrase = parser.parseNext(match.groups.text, [NounPhrase]);
        if (!phrase?.isRecognized) return null;
        if (!phrase.stats && !phrase.isCardInZone) return null;
        const quote = readQuotedAbility(parser, phrase.remainingStr);
        const leftover = quote?.remainingStr ?? phrase.remainingStr;
        return leftover ? null : Object.assign(match, { phrase, quote });
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.phrase = match.phrase;
        this.quotedAbility = match.quote;
    }

    get children() {
        return [this.phrase, this.quotedAbility].filter(Boolean);
    }
}

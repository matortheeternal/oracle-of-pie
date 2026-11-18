import Parser from '../core/Parser.js';
import { PHRASE_PARSERS } from './index.js';

const MAY = /^may /i;
const JOINER = /^(?:,? ?(?:and\/or|and|or) |, )/;

export default class PhraseList extends Parser {
    static get parsers() {
        return PHRASE_PARSERS;
    }

    static match(scribe, str) {
        return this.parsers.some(parser => parser.match(scribe, str)) ? [''] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.phrases = [this.consume(this.constructor.parsers)];
        while (this.consumeNextPhrase()) continue;
    }

    consumeNextPhrase() {
        const joiner = this.remainingStr.match(JOINER);
        if (!joiner) return false;
        const rest = this.remainingStr.slice(joiner[0].length);
        const phrase = this.parseNext(rest, this.constructor.parsers);
        if (!phrase || this.startsClause(phrase)) return false;
        this.remainingStr = phrase.remainingStr;
        this.phrases.push(phrase);
        return true;
    }

    startsClause(phrase) {
        return this.scribe.startsEffect(phrase.remainingStr.replace(MAY, ''));
    }

    get children() {
        return this.phrases;
    }

    some(predicate) {
        return this.phrases.some(predicate);
    }

    every(predicate) {
        return this.phrases.every(predicate);
    }
}

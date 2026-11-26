import Parser from '../core/Parser.js';
import { PHRASE_PARSERS } from './index.js';

const MAY = /^may /i;
const COMMA_PREFIX = /^,/;
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
        this.connectors = [];
        while (this.consumeNextPhrase()) continue;
    }

    get joiner() {
        return JOINER;
    }

    consumeNextPhrase() {
        const joiner = this.remainingStr.match(this.joiner);
        if (!joiner) return false;
        const rest = this.remainingStr.slice(joiner[0].length);
        if (this.scribe.startsEffect(rest)) return false;
        const phrase = this.parseNext(rest, this.constructor.parsers);
        if (!phrase?.isRecognized || this.startsClause(phrase)) return false;
        this.remainingStr = phrase.remainingStr;
        this.phrases.push(phrase);
        this.connectors.push(joiner[0].trim().replace(COMMA_PREFIX, '').trim());
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

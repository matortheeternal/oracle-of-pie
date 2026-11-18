import Parser from '../core/Parser.js';
import { STATEMENT_PARSERS } from './index.js';

const SENTENCE = /^((?:"[^"]*"|[^."]|\.(?=\d))+)(?:\.|$)/;
const THEN = /^then,? /i;

export default class Sentence extends Parser {
    static match(scribe, str) {
        return str.match(SENTENCE);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        const text = match[1].trim();
        this.followsPrevious = THEN.test(text);
        this.statement = this.parseNext(text.replace(THEN, ''), STATEMENT_PARSERS);
    }

    get children() {
        return [this.statement].filter(Boolean);
    }

    get effects() {
        return this.statement?.effects ?? [];
    }

    childContext(context) {
        return { ...context, sentence: this };
    }
}

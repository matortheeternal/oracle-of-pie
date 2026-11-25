import Parser from '../core/Parser.js';
import Keyword from './Keyword.js';

const SEPARATOR = /^(?:,? ?(?:and|or) |[,;] )/i;
const CHOICE = /^your choice of /i;

export default class KeywordList extends Parser {
    static match(scribe, str) {
        return Keyword.match(scribe, str.replace(CHOICE, '')) ? [''] : null;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.consumeText(CHOICE);
        this.keywords = [this.consume([Keyword])];
        while (this.continuesWithKeyword()) {
            this.consumeText(SEPARATOR);
            this.keywords.push(this.consume([Keyword]));
        }
    }

    continuesWithKeyword() {
        if (!SEPARATOR.test(this.remainingStr)) return false;
        const next = this.remainingStr.replace(SEPARATOR, '');
        return Boolean(Keyword.match(this.scribe, next));
    }

    get names() {
        return this.keywords.map(keyword => keyword.name);
    }

    get children() {
        return this.keywords;
    }
}

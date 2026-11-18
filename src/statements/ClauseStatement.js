import Statement from './Statement.js';

const ALWAYS = /^/;

export default class ClauseStatement extends Statement {
    static match(scribe, str) {
        return str.match(ALWAYS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.clauses = this.consumeClauses();
    }

    get children() {
        return [this.clauses].filter(Boolean);
    }
}

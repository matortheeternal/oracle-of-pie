import Statement from './Statement.js';

const REPLACEMENT = /^if ([^,]+?) would ([^,]+), (?=.+\binstead\b)/i;

export default class ReplacementStatement extends Statement {
    static match(scribe, str) {
        return str.match(REPLACEMENT);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.event = `${match[1]} would ${match[2]}`;
        this.replacement = this.consumeClauses();
    }

    get children() {
        return [this.replacement].filter(Boolean);
    }
}

import Statement from './Statement.js';

const CONDITION_ALTERNATIVES = [
    'if',
    'as long as',
    'unless',
    'when you do',
    'if you do',
    'if you don\'t',
    'otherwise',
    'during your turn',
    'during each of your turns',
    'for each [^,]+',
    'until end of turn',
    'until your next turn',
    'until the end of your next turn',
    'this turn',
    'at the beginning of [^,]+',
    'as ~ enters',
    'as this [a-z]+ enters',
    'once each turn',
    'once during each of your turns',
    'for as long as [^,]+',
    'as an additional cost to cast this spell',
    'as long as [^,]+'
];
const CONDITION = new RegExp(
    `^(${CONDITION_ALTERNATIVES.join('|')})\\b([^,]*), `, 'i'
);

export default class ConditionalStatement extends Statement {
    static match(scribe, str) {
        return str.match(CONDITION);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.condition = `${match[1]}${match[2]}`.trim();
        this.clauses = this.consumeClauses();
    }

    get children() {
        return [this.clauses].filter(Boolean);
    }
}

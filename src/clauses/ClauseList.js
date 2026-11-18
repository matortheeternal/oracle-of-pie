import Parser from '../core/Parser.js';
import Clause from './Clause.js';
import TrailingCondition from './TrailingCondition.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

const CONNECTOR = /^(?:,? ?and then |,? ?then |, and |; |and |, )/i;

export default class ClauseList extends Parser {
    static match(scribe, str) {
        return [''];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.clauses = [this.consume([Clause])];
        while (this.consumeNextClause()) continue;
        this.condition = this.consume([TrailingCondition]);
        this.unrecognized = this.consume([UnrecognizedText]);
    }

    consumeNextClause() {
        const connector = this.remainingStr.match(CONNECTOR);
        if (!connector) return false;
        const rest = this.remainingStr.slice(connector[0].length);
        const startsEffect = Clause.startsEffect(this.scribe, rest);
        if (!startsEffect && !this.startsSubjectEffect(rest)) return false;
        this.consumeText(CONNECTOR);
        this.clauses.push(this.consume([Clause]));
        return true;
    }

    startsSubjectEffect(str) {
        const clause = Clause.parse(this.scribe, [''], str);
        return Boolean(clause.effect);
    }

    get children() {
        return [...this.clauses, this.condition, this.unrecognized].filter(Boolean);
    }

    get effects() {
        return this.clauses.map(clause => clause.effect).filter(Boolean);
    }
}

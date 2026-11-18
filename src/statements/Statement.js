import Parser from '../core/Parser.js';
import ClauseList from '../clauses/ClauseList.js';

export default class Statement extends Parser {
    consumeClauses() {
        return this.consume([ClauseList]);
    }

    get isInterveningIf() {
        return false;
    }

    get isAdditionalCost() {
        return false;
    }

    get isIfYouDo() {
        return false;
    }

    get limitsToOnce() {
        return false;
    }

    get limitsUses() {
        return false;
    }

    get isConditional() {
        return false;
    }

    get effects() {
        return this.children.flatMap(child => child.effects ?? []);
    }
}

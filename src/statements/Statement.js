import Parser from '../core/Parser.js';
import ClauseList from '../clauses/ClauseList.js';

export default class Statement extends Parser {
    consumeClauses() {
        return this.consume([ClauseList]);
    }

    get effects() {
        return this.children.flatMap(child => child.effects ?? []);
    }
}

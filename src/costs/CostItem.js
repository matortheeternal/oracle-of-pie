import Parser from '../core/Parser.js';

export default class CostItem extends Parser {
    get manaColors() {
        return [];
    }

    get discardsSelf() {
        return false;
    }

    get discards() {
        return false;
    }
}

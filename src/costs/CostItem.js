import Parser from '../core/Parser.js';

export default class CostItem extends Parser {
    get manaColors() {
        return [];
    }

    get discardsSelf() {
        return false;
    }

    get manaValue() {
        return 0;
    }

    get hasVariableMana() {
        return false;
    }

    get includesTap() {
        return false;
    }

    get removesSource() {
        return false;
    }

    get sacrificesOther() {
        return false;
    }

    get discards() {
        return false;
    }
}

import { ActivationCost } from 'mana-scribe';
import CostItem from './CostItem.js';

const SYMBOLS = /^(?:\{[^}]+\})+/;

export default class ManaCostItem extends CostItem {
    static match(scribe, str) {
        return str.match(SYMBOLS);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.cost = ActivationCost.parse(match[0]);
        this.symbols = this.cost.toString(true, false);
    }

    get manaColors() {
        return this.cost.colors;
    }

    get includesTap() {
        return this.cost.symbols.some(symbol => symbol.type === 'tap');
    }

    toJSON() {
        return { node: this.constructor.name, symbols: this.symbols };
    }
}

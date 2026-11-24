import { ActivationCost, ManaCost } from 'mana-scribe';
import CostItem from './CostItem.js';

const SYMBOLS = /^(?:\{[^}]+\})+/;
const VARIABLE_MANA = 'variableMana';
const PHYREXIAN_SYMBOL = /\/P\}/i;
const PHYREXIAN = /phyrexian/i;
const MANA_SYMBOL_CLASSES = new Set(ManaCost.allowedSymbols);

function requiresMana(symbol) {
    return MANA_SYMBOL_CLASSES.has(symbol.constructor) && !PHYREXIAN.test(symbol.type);
}

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

    get manaValue() {
        return this.cost.symbols.reduce((sum, symbol) => sum + symbol.cmcValue(), 0);
    }

    get hasVariableMana() {
        return this.cost.symbols.some(symbol => symbol.type === VARIABLE_MANA);
    }

    get paysLife() {
        return PHYREXIAN_SYMBOL.test(this.raw);
    }

    get hasOnlyManaSymbols() {
        return this.cost.symbols.every(requiresMana);
    }

    get includesTap() {
        return this.cost.symbols.some(symbol => symbol.type === 'tap');
    }

    toJSON() {
        return { node: this.constructor.name, symbols: this.symbols };
    }
}

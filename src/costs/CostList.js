import Parser from '../core/Parser.js';
import ManaCostItem from './ManaCostItem.js';
import LoyaltyCost from './LoyaltyCost.js';
import TextCost from './TextCost.js';
import SacrificeCost from './SacrificeCost.js';
import ExileCost from './ExileCost.js';
import ReturnCost from './ReturnCost.js';
import ActionCost from './ActionCost.js';
import RemoveCountersCost from './RemoveCountersCost.js';
import TapObjectsCost from './TapObjectsCost.js';
import UnrecognizedCost from './UnrecognizedCost.js';

const COST_PARSERS = [
    ManaCostItem, LoyaltyCost, RemoveCountersCost, TapObjectsCost, TextCost,
    SacrificeCost, ExileCost, ReturnCost, ActionCost, UnrecognizedCost
];
const SEPARATOR = /^(?:, ?(?:and )?|(?<alternative> *or )| *and | )/;

export default class CostList extends Parser {
    static match(scribe, str) {
        return [''];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.items = [this.consume(COST_PARSERS)].filter(Boolean);
        while (this.readNextItem()) continue;
    }

    readNextItem() {
        const separator = this.consumeText(SEPARATOR);
        if (!separator || !this.remainingStr) return false;
        const item = this.consume(COST_PARSERS);
        if (!item) return false;
        item.isAlternative = Boolean(separator.groups.alternative);
        this.items.push(item);
        return true;
    }

    get children() {
        return this.items;
    }

    get manaColors() {
        return [...new Set(this.items.flatMap(item => item.manaColors))];
    }

    get discardsOtherCards() {
        return this.items.some(item => item.discards && !item.discardsSelf);
    }

    get manaValue() {
        return this.items.reduce((sum, item) => sum + item.manaValue, 0);
    }

    manaValueAtLeast(minimum) {
        return this.manaValue >= minimum;
    }

    get hasVariableMana() {
        return this.items.some(item => item.hasVariableMana);
    }

    get paysMana() {
        return this.manaValue > 0 || this.hasVariableMana;
    }

    get includesTap() {
        return this.items.some(item => item.includesTap);
    }

    get removesSource() {
        return this.items.some(item => item.removesSource);
    }

    get sacrificesOther() {
        return this.items.some(item => item.sacrificesOther);
    }

    get paysLife() {
        return this.items.some(item => item.paysLife);
    }

    get removesCounters() {
        return this.items.some(item => item.removesCounters);
    }

    get isOnlyDiscard() {
        return this.items.length === 1 && this.discards;
    }

    get loyaltyLoss() {
        return Math.max(0, ...this.items.map(item => item.loyaltyLoss));
    }

    get discards() {
        return this.items.some(item => item.discards);
    }
}

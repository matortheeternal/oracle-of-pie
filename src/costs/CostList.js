import Parser from '../core/Parser.js';
import ManaCostItem from './ManaCostItem.js';
import LoyaltyCost from './LoyaltyCost.js';
import TextCost from './TextCost.js';
import SacrificeCost from './SacrificeCost.js';
import ExileCost from './ExileCost.js';
import ReturnCost from './ReturnCost.js';
import UnrecognizedCost from './UnrecognizedCost.js';

const COST_PARSERS = [
    ManaCostItem, LoyaltyCost, TextCost, SacrificeCost, ExileCost, ReturnCost,
    UnrecognizedCost
];
const SEPARATOR = /^,? (?:and )?/;

export default class CostList extends Parser {
    static match(scribe, str) {
        return [''];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.items = [this.consume(COST_PARSERS)].filter(Boolean);
        while (this.consumeText(SEPARATOR) && this.remainingStr)
            this.items.push(this.consume(COST_PARSERS));
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

    get discards() {
        return this.items.some(item => item.discards);
    }
}

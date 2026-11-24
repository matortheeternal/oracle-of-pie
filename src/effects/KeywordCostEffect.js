import Effect from './Effect.js';
import CostList from '../costs/CostList.js';

const KEYWORD_COST = new RegExp(
    '^(?:the|its) (?<keyword>[a-z][a-z ]*?) cost is equal to '
    + '(?:its|that card\'s|the card\'s|that spell\'s) mana cost'
    + '(?: reduced by (?<reduction>(?:\\{[^}]+\\})+))?', 'i'
);
const PLUS = /^plus /i;

export default class KeywordCostEffect extends Effect {
    static get pattern() {
        return KEYWORD_COST;
    }

    parseArguments(match) {
        this.keyword = match.groups.keyword.toLowerCase();
        this.reduction = match.groups.reduction ?? null;
        this.additionalCost = this.consumeText(PLUS) ? this.consume([CostList]) : null;
    }

    get parts() {
        return [this.additionalCost].filter(Boolean);
    }

    get equalsManaCost() {
        return true;
    }
}

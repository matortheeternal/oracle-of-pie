import CostItem from './CostItem.js';

const LOYALTY = /^\[?([+\-−]?)(\d+|X)\]?$/;

export default class LoyaltyCost extends CostItem {
    static match(scribe, str) {
        return str.match(LOYALTY);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.change = `${match[1].replace('−', '-')}${match[2]}`;
    }

    get loyaltyLoss() {
        const amount = Number(this.change);
        return amount < 0 ? -amount : 0;
    }
}

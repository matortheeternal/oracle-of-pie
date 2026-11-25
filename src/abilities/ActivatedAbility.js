import BodyAbility from './BodyAbility.js';
import CostList from '../costs/CostList.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

const NESTED_QUOTE = '(?<!\\w)\'(?:[^\']|\'(?=\\w))*\'(?!\\w)';
const QUOTED_COST = '"[^"]*"|' + NESTED_QUOTE;
const UNQUOTED = '(?!(?<!\\w)\')[^:"]';
const COST_PART = '(?!\\btarget\\b)(?:' + QUOTED_COST + '|' + UNQUOTED + ')';
const ACTIVATED = new RegExp(`^(exhaust — )?((?:${COST_PART})+?): ([\\s\\S]+)$`, 'i');

export default class ActivatedAbility extends BodyAbility {
    static match(scribe, str) {
        return str.match(ACTIVATED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.isExhaust = Boolean(match[1]);
        this.cost = CostList.parse(scribe, [''], match[2]);
        this.costLeftover = UnrecognizedText.fromLeftover(scribe, this.cost.remainingStr);
    }

    get parts() {
        return [this.cost, this.costLeftover, this.body].filter(Boolean);
    }

    get isRepeatable() {
        if (this.isExhaust || this.cost.removesSource || this.reminderLimitsToOnce)
            return false;
        return !this.consumesSource;
    }

    get loyaltyLoss() {
        return this.cost.loyaltyLoss;
    }

    get manaColors() {
        return this.cost.manaColors;
    }
}

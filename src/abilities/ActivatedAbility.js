import BodyAbility from './BodyAbility.js';
import CostList from '../costs/CostList.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

const ACTIVATED = /^(exhaust — )?((?:"[^"]*"|[^:"])+?): ([\s\S]+)$/i;

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
        if (this.isExhaust || this.cost.removesSource) return false;
        return !this.consumesSource;
    }

    get manaColors() {
        return this.cost.manaColors;
    }
}

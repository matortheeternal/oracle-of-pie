import BodyAbility from './BodyAbility.js';
import CostList from '../costs/CostList.js';
import UnrecognizedText from '../values/UnrecognizedText.js';

const ACTIVATED = /^((?:"[^"]*"|[^:"])+?): ([\s\S]+)$/;

export default class ActivatedAbility extends BodyAbility {
    static match(scribe, str) {
        return str.match(ACTIVATED);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.cost = CostList.parse(scribe, [''], match[1]);
        this.costLeftover = UnrecognizedText.fromLeftover(scribe, this.cost.remainingStr);
    }

    get parts() {
        return [this.cost, this.costLeftover, this.body].filter(Boolean);
    }

    get manaColors() {
        return this.cost.manaColors;
    }
}

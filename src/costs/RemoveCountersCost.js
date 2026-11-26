import ActionCost from './ActionCost.js';
import RemoveCountersEffect from '../effects/RemoveCountersEffect.js';

export default class RemoveCountersCost extends ActionCost {
    static get actionParsers() {
        return [RemoveCountersEffect];
    }

    get removesCounters() {
        return true;
    }
}

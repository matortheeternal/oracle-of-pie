import TriggerEvent from './TriggerEvent.js';

const BECOMES_MONSTROUS = /^(?<subject>.+?) becomes? monstrous\b/i;

export default class BecomesMonstrousEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_MONSTROUS;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

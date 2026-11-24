import TriggerEvent from './TriggerEvent.js';

const MILLED = /^(?<subject>.+?) (?:is|are) milled\b/i;

export default class MilledEvent extends TriggerEvent {
    static get pattern() {
        return MILLED;
    }

    get isRepeatable() {
        return true;
    }
}

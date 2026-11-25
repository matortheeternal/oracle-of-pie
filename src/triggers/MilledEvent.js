import TriggerEvent from './TriggerEvent.js';
import ThisWay from './qualifiers/ThisWay.js';

const MILLED = /^(?<subject>.+?) (?:is|are) milled\b/i;

export default class MilledEvent extends TriggerEvent {
    static get pattern() {
        return MILLED;
    }

    static get qualifierParsers() {
        return [ThisWay];
    }

    get isRepeatable() {
        return true;
    }
}

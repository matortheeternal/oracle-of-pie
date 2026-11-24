import TriggerEvent from './TriggerEvent.js';

const RING_TEMPTS = /^the ring tempts (?<subject>you)\b/i;

export default class RingTemptsEvent extends TriggerEvent {
    static get pattern() {
        return RING_TEMPTS;
    }
}

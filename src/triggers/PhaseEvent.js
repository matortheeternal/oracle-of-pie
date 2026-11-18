import TriggerEvent from './TriggerEvent.js';

const PHASE = /^the beginning of (?<subject>.+)$/i;

export default class PhaseEvent extends TriggerEvent {
    static get pattern() {
        return PHASE;
    }
}

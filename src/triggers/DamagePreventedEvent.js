import TriggerEvent from './TriggerEvent.js';

const DAMAGE_PREVENTED = /^damage\b.*\bis prevented\b/i;

export default class DamagePreventedEvent extends TriggerEvent {
    static get pattern() {
        return DAMAGE_PREVENTED;
    }
}

import TriggerEvent from './TriggerEvent.js';

const DEALS = /^(?<subject>.+?) deals? (?:combat )?damage\b/i;

export default class DealsDamageEvent extends TriggerEvent {
    static get pattern() {
        return DEALS;
    }
}

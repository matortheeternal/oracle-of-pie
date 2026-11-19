import TriggerEvent from './TriggerEvent.js';

const DEALS = /^(?<subject>.+?) deals? (?:combat )?damage\b/i;
const COMBAT = /\bcombat damage\b/i;

export default class DealsDamageEvent extends TriggerEvent {
    static get pattern() {
        return DEALS;
    }

    get isCombat() {
        return COMBAT.test(this.raw);
    }
}

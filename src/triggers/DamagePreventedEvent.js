import TriggerEvent from './TriggerEvent.js';

const DAMAGE_PREVENTED = /^damage\b.*\bis prevented\b( this way)?/i;

export default class DamagePreventedEvent extends TriggerEvent {
    static get pattern() {
        return DAMAGE_PREVENTED;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.linksToPrevention = Boolean(match[1]);
    }
}

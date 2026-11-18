import TriggerEvent from './TriggerEvent.js';

const ENTERS = /^(?<subject>.+?) enters?\b/i;

export default class EntersEvent extends TriggerEvent {
    static get pattern() {
        return ENTERS;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

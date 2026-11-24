import TriggerEvent from './TriggerEvent.js';

const BECOMES_PLOTTED = /^(?<subject>.+?) becomes? plotted\b/i;

export default class BecomesPlottedEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_PLOTTED;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

import TriggerEvent from './TriggerEvent.js';

const EXPLORES = /^(?<subject>.+?) explores?\b/i;

export default class ExploresEvent extends TriggerEvent {
    static get pattern() {
        return EXPLORES;
    }

    parseObjectPhrase() {
        return null;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

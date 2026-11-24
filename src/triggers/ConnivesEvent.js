import TriggerEvent from './TriggerEvent.js';

const CONNIVES = /^(?<subject>.+?) connives?\b/i;

export default class ConnivesEvent extends TriggerEvent {
    static get pattern() {
        return CONNIVES;
    }

    parseObjectPhrase() {
        return null;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

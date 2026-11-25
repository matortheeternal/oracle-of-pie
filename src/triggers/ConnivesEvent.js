import TriggerEvent from './TriggerEvent.js';
import ThisWay from './qualifiers/ThisWay.js';

const CONNIVES = /^(?<subject>.+?) connives?\b/i;

export default class ConnivesEvent extends TriggerEvent {
    static get pattern() {
        return CONNIVES;
    }

    parseObjectPhrase() {
        return null;
    }

    static get qualifierParsers() {
        return [ThisWay];
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

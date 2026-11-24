import TriggerEvent from './TriggerEvent.js';

const ANY = /^/;

export default class OtherEvent extends TriggerEvent {
    static get pattern() {
        return ANY;
    }

    get isUnsupported() {
        return true;
    }

    get isRepeatable() {
        return false;
    }
}

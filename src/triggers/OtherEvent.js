import TriggerEvent from './TriggerEvent.js';

const ANY = /^/;

export default class OtherEvent extends TriggerEvent {
    static get pattern() {
        return ANY;
    }

    get isRepeatable() {
        return false;
    }
}

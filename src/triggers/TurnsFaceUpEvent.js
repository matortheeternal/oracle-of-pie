import TriggerEvent from './TriggerEvent.js';

const TURNS_FACE_UP = /^(?<subject>.+?) (?:is|are) turned face up\b/i;

export default class TurnsFaceUpEvent extends TriggerEvent {
    static get pattern() {
        return TURNS_FACE_UP;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

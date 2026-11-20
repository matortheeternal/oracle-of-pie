import TriggerEvent from './TriggerEvent.js';

const TURNS_FACE_UP = /^(?<subject>.+?) (?:is|are) turned face up\b/i;
const ALTERNATIVE_SUBJECT = /\bor another\b/i;

export default class TurnsFaceUpEvent extends TriggerEvent {
    static get pattern() {
        return TURNS_FACE_UP;
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        if (match && ALTERNATIVE_SUBJECT.test(match.groups.subject)) return null;
        return match;
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

import TriggerEvent from './TriggerEvent.js';

const FACES_DILEMMA = /^(?<subject>.+?) faces? a dilemma\b/i;

export default class FacesDilemmaEvent extends TriggerEvent {
    static get pattern() {
        return FACES_DILEMMA;
    }
}

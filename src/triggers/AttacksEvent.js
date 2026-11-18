import TriggerEvent from './TriggerEvent.js';

const ATTACKS = /^(?<subject>.+?) attacks?\b/i;

export default class AttacksEvent extends TriggerEvent {
    static get pattern() {
        return ATTACKS;
    }
}

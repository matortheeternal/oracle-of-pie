import TriggerEvent from './TriggerEvent.js';

const ROLLS_DICE = /^(?<subject>.+?) rolls? (?:one or more dice|a die)\b/i;

export default class RollsDiceEvent extends TriggerEvent {
    static get pattern() {
        return ROLLS_DICE;
    }
}

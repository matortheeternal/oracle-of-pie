import ActionEvent from './ActionEvent.js';

const BECOMES_ATTACHED
    = /^(?<subject>.+?) becomes? attached to(?= (?:an?|one or more)\b)/i;

export default class BecomesAttachedEvent extends ActionEvent {
    static get pattern() {
        return BECOMES_ATTACHED;
    }
}

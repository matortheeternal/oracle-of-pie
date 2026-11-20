import TriggerEvent from './TriggerEvent.js';

const SCRY = /^(?<subject>.+?) (?:scry|scries)\b/i;

export default class ScryEvent extends TriggerEvent {
    static get pattern() {
        return SCRY;
    }
}

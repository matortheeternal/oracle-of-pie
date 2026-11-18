import TriggerEvent from './TriggerEvent.js';

const TARGETED = /^(?<subject>.+?) becomes? the target of\b/i;

export default class TargetedEvent extends TriggerEvent {
    static get pattern() {
        return TARGETED;
    }
}

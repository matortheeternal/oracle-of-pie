import TriggerEvent from './TriggerEvent.js';
import StepWindow from './qualifiers/StepWindow.js';

const BECOMES_UNTAPPED = /^(?<subject>.+?) becomes? untapped\b/i;

export default class BecomesUntappedEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_UNTAPPED;
    }

    static get qualifierParsers() {
        return [StepWindow];
    }
}

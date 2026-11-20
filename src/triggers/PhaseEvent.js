import TriggerEvent from './TriggerEvent.js';
import TurnStep from './steps/TurnStep.js';
import { STEP_PARSERS } from './steps/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const PHASE = /^the beginning of (?<subject>.+)$/i;

export default class PhaseEvent extends TriggerEvent {
    static get pattern() {
        return PHASE;
    }

    static get subjectParsers() {
        return [...STEP_PARSERS, ...PHRASE_PARSERS];
    }

    get step() {
        return this.subjectPhrase instanceof TurnStep ? this.subjectPhrase : null;
    }
}

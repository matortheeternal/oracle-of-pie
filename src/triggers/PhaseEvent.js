import TriggerEvent from './TriggerEvent.js';
import TurnStep from './steps/TurnStep.js';
import { STEP_PARSERS } from './steps/index.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const PHASE = /^(?:the )?(?<boundary>beginning|end) of (?<subject>.+)$/i;
const TIMING = /^(?:this turn|on your next turn|this combat)$/i;

export default class PhaseEvent extends TriggerEvent {
    static get pattern() {
        return PHASE;
    }

    static get subjectParsers() {
        return [...STEP_PARSERS, ...PHRASE_PARSERS];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.boundary = match.groups.boundary.toLowerCase();
    }

    get step() {
        return this.subjectPhrase instanceof TurnStep ? this.subjectPhrase : null;
    }

    unreadSubjectText() {
        const rest = this.subjectPhrase?.remainingStr ?? this.subject;
        if (!this.step || !TIMING.test(rest)) return super.unreadSubjectText();
        this.timing = rest.toLowerCase();
        return null;
    }
}

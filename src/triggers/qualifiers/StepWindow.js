import Parser from '../../core/Parser.js';

const STEP_WINDOW = /^during (your|each|an opponent's) (untap|upkeep|draw|end) step\b/i;

export default class StepWindow extends Parser {
    static match(scribe, str) {
        return str.match(STEP_WINDOW);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.stepOwner = match[1].toLowerCase();
        this.step = match[2].toLowerCase();
    }

    get isUntapStep() {
        return this.step === 'untap';
    }
}

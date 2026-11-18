import Effect from './Effect.js';

const PHASE = /^phases? (out|in)\b/i;
const OUT = 'out';

export default class PhaseEffect extends Effect {
    static get pattern() {
        return PHASE;
    }

    parseArguments(match) {
        this.direction = match[1].toLowerCase();
    }

    get phasesOut() {
        return this.direction === OUT;
    }
}

import Effect from './Effect.js';

const MODIFIED_COUNT = '(that many (?:plus|minus) \\w+|twice that many)';
const MODIFIED_COUNTERS = `${MODIFIED_COUNT} [^,.]*?counters?[^,.]* instead`;
const COUNTER_MODIFICATION = new RegExp(`^${MODIFIED_COUNTERS}`, 'i');
const REDUCTION = /\bminus\b/i;

export default class CounterModificationEffect extends Effect {
    static get pattern() {
        return COUNTER_MODIFICATION;
    }

    parseArguments(match) {
        this.modification = match[1].toLowerCase();
    }

    get increasesCounters() {
        return !REDUCTION.test(this.modification);
    }
}

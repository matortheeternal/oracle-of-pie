import ObjectEffect from './ObjectEffect.js';

const COUNTER_KIND = '(each kind of|[+\\-−]\\d+/[+\\-−]\\d+|\\w+)';
const DOUBLED = `the number of ${COUNTER_KIND} counters? on `;
const EACH_KIND_YOU_HAVE = /^double the number of (each kind of) counter you have\b/i;
const DOUBLE_COUNTERS = new RegExp(`^double ${DOUBLED}`, 'i');
const EACH_KIND = 'each kind of';

export default class DoubleCountersEffect extends ObjectEffect {
    static get pattern() {
        return DOUBLE_COUNTERS;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(EACH_KIND_YOU_HAVE);
    }

    parseArguments(match) {
        this.counterKind = match[1].toLowerCase();
        this.doublesPlayerCounters = EACH_KIND_YOU_HAVE.test(match[0]);
        if (!this.doublesPlayerCounters) super.parseArguments(match);
    }

    get isComplete() {
        return this.doublesPlayerCounters || super.isComplete;
    }

    get doublesAllKinds() {
        return this.counterKind === EACH_KIND;
    }
}

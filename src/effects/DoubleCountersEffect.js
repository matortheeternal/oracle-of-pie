import ObjectEffect from './ObjectEffect.js';

const COUNTER_KIND = '(each kind of|[+\\-−]\\d+/[+\\-−]\\d+|\\w+)';
const DOUBLED = `the number of ${COUNTER_KIND} counters? on `;
const DOUBLE_COUNTERS = new RegExp(`^double ${DOUBLED}`, 'i');
const EACH_KIND = 'each kind of';

export default class DoubleCountersEffect extends ObjectEffect {
    static get pattern() {
        return DOUBLE_COUNTERS;
    }

    parseArguments(match) {
        this.counterKind = match[1].toLowerCase();
        super.parseArguments(match);
    }

    get doublesAllKinds() {
        return this.counterKind === EACH_KIND;
    }
}

import StateCondition from './StateCondition.js';

const COUNTER_KIND = '(?:(?<kind>[+-]\\d+/[+-]\\d+|[a-z]+) )?';
const COUNTERS_ON = new RegExp(
    `^while (?:it|~|this [a-z]+) has an? ${COUNTER_KIND}counter on it\\b`, 'i'
);

export default class CountersOnCondition extends StateCondition {
    static get pattern() {
        return COUNTERS_ON;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.counterKind = match.groups.kind?.toLowerCase() ?? null;
    }
}

import Effect from './Effect.js';

const COUNT = 'that many (?:plus|minus) \\w+|twice that many|that many';
const KIND = '[+−-]\\d+/[+−-]\\d+|[a-z]+';
const COUNTERS = `(?:(?<kind>${KIND}) counters?|of each of those kinds of counters)`;
const RECIPIENT = '(?<recipient>it|them|that (?:creature|permanent|player))';
const COUNTER_MODIFICATION = new RegExp(
    `^(?<gets>gets? )?(?<count>${COUNT}) ${COUNTERS}(?<adjustment> minus one)?`
        + `(?: (?:is|are) put on ${RECIPIENT})? instead\\b`,
    'i'
);
const REDUCTION = /\bminus\b/i;

export default class CounterModificationEffect extends Effect {
    static get pattern() {
        return COUNTER_MODIFICATION;
    }

    parseArguments(match) {
        const { count, adjustment, kind, recipient, gets } = match.groups;
        this.modification = [count, adjustment].filter(Boolean).join('').toLowerCase();
        this.counterKind = kind?.toLowerCase() ?? null;
        this.recipient = recipient?.toLowerCase() ?? null;
        this.isPlayerCounter = Boolean(gets);
    }

    get increasesCounters() {
        return !REDUCTION.test(this.modification);
    }
}

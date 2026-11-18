import Effect from './Effect.js';
import Amount from '../values/Amount.js';
import { normalizeCounterKind, isPlusOneKind, lowersToughness } from './counterKinds.js';

const COUNTERS_ON_IT = '.*counters? on (?:it|them)\\b';
const ENTERS_WITH = new RegExp(
    `^enters? (?:the battlefield )?(?:tapped )?with (?=${COUNTERS_ON_IT})`, 'i'
);
const ADDITIONAL = /^additional /i;
const KIND = '[+\\-−]\\d+\\/[+\\-−]\\d+|[a-z]+(?: [a-z]+)?';
const COUNTER_KIND = new RegExp(`^(${KIND}) counters? on (?:it|them)\\b`, 'i');

export default class EntersWithCountersEffect extends Effect {
    static get pattern() {
        return ENTERS_WITH;
    }

    parseArguments(match) {
        this.amount = this.consume([Amount]);
        this.isAdditional = Boolean(this.consumeText(ADDITIONAL));
        this.kind = normalizeCounterKind(this.consumeText(COUNTER_KIND)?.[1]);
    }

    get parts() {
        return [this.amount].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.kind);
    }

    get phrases() {
        return [this.subject].filter(Boolean);
    }

    get isPlusCounters() {
        return isPlusOneKind(this.kind);
    }

    get isMinusCounters() {
        return lowersToughness(this.kind);
    }
}

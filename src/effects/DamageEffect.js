import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const DEALS = /^deals? /i;
const COUNT = `(${NUMBER_PATTERN}|that much|twice that much|N)`;
const POWER_OWNER = `(its|their|~'s|that creature's|this creature's)`;
const AMOUNT = new RegExp(
    `^(?:${COUNT} damage(?: divided as you choose)?`
        + `|damage equal to (?:${POWER_OWNER} power|[^,.]+?)(?= to )`
        + '|damage(?= to ))',
    'i'
);
const TO_TARGETS = /^(?:to|among) /i;
const FOR_EACH = /^for each [^,.]+/i;
const EACH_OF = /^each of /i;
const EQUAL_TO = /^equal to [^,.]+/i;
const PING_LIMIT = 2;

export default class DamageEffect extends Effect {
    static get pattern() {
        return DEALS;
    }

    parseArguments(match) {
        const amount = this.consumeText(AMOUNT);
        this.amountText = amount?.[0] ?? null;
        this.isPowerBased = Boolean(amount?.[2]);
        this.targets = this.consumeText(TO_TARGETS) ? this.consumeTargets() : null;
        this.consumeText(FOR_EACH) ?? this.consumeText(EQUAL_TO);
    }

    consumeTargets() {
        this.consumeText(EACH_OF);
        return this.consume([PhraseList]);
    }

    get fixedAmount() {
        const count = this.amountText?.split(' ')[0] ?? '';
        return numberValue(count) ?? null;
    }

    get isPing() {
        const amount = this.fixedAmount;
        return amount !== null && amount <= PING_LIMIT;
    }

    get parts() {
        return [this.targets].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.amountText && this.targets);
    }

    get phrases() {
        return this.targets?.phrases ?? [];
    }
}

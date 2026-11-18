import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const DEALS = /^deals? /i;
const COUNT = `(${NUMBER_PATTERN}|that much|twice that much|N)`;
const POWER_OWNER = `(its|their|~'s|that creature's|this creature's)`;
const AMOUNT = new RegExp(
    `^(?:${COUNT} damage(?: divided as you choose)?`
        + `|damage equal to (?:${POWER_OWNER} power|[^,.]+?)(?= to ))`,
    'i'
);
const TO_TARGETS = /^(?:to|among) /i;
const FOR_EACH = /^for each [^,.]+/i;

export default class DamageEffect extends Effect {
    static get pattern() {
        return DEALS;
    }

    parseArguments(match) {
        const amount = this.consumeText(AMOUNT);
        this.amountText = amount?.[0] ?? null;
        this.isPowerBased = Boolean(amount?.[2]);
        this.targets = this.consumeText(TO_TARGETS) ? this.consume([PhraseList]) : null;
        this.consumeText(FOR_EACH);
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

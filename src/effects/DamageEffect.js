import Effect from './Effect.js';
import AdditionalDamage from '../values/AdditionalDamage.js';
import PhraseList from '../phrases/PhraseList.js';
import SelfOrAnother from '../triggers/subjects/SelfOrAnother.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';
import {
    scalesAmountWithManaValue, usesCreatureCount
} from '../values/quantityDependencies.js';

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
const FOR_EACH = /^for each (?:[^,.]|, (?=non))+/i;
const EACH_OF = /^each of /i;
const INSTEAD = /^instead\b/i;
const EQUAL_TO = /^equal to [^,.]+/i;
const PING_LIMIT = 2;
const CREATURE_STAT = /\b(?:power|toughness)\b/i;
const SOURCE_POWER_OWNERS = ['its', '~\'s', 'this creature\'s'];

export default class DamageEffect extends Effect {
    static get pattern() {
        return DEALS;
    }

    parseArguments(match) {
        const amount = this.consumeText(AMOUNT);
        this.amountText = amount?.[0] ?? null;
        this.powerOwner = amount?.[2]?.toLowerCase() ?? null;
        this.targets = this.consumeText(TO_TARGETS) ? this.consumeTargets() : null;
        this.additionalDamage = this.targets ? this.consume([AdditionalDamage]) : null;
        this.replacesAmount = Boolean(!this.targets && this.consumeText(INSTEAD));
        const scaling = this.consumeText(FOR_EACH) ?? this.consumeText(EQUAL_TO);
        this.scalingText = scaling?.[0] ?? null;
    }

    consumeTargets() {
        this.consumeText(EACH_OF);
        return this.consume([PhraseList]);
    }

    get fixedAmount() {
        const count = this.amountText?.split(' ')[0] ?? '';
        return numberValue(count) ?? null;
    }

    get scalesWithCreatureStats() {
        return CREATURE_STAT.test(`${this.amountText} ${this.scalingText}`);
    }

    get isPowerBased() {
        return Boolean(this.powerOwner);
    }

    get usesActingCreaturePower() {
        return this.powerOwner === 'its'
            && this.actingSubject?.resolved instanceof SelfOrAnother;
    }

    get usesSourcePower() {
        if (this.usesActingCreaturePower) return false;
        return SOURCE_POWER_OWNERS.includes(this.powerOwner)
            && Boolean(this.actingSubject?.refersToSelf);
    }

    get usesManaValue() {
        return scalesAmountWithManaValue(this.amountText)
            || scalesAmountWithManaValue(this.scalingText);
    }

    get usesCreatureCount() {
        return usesCreatureCount(this.scalingText);
    }

    get isPing() {
        const amount = this.fixedAmount;
        return amount !== null && amount <= PING_LIMIT;
    }

    get parts() {
        return [this.targets, this.additionalDamage].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.amountText && (this.targets || this.replacesAmount));
    }

    get phrases() {
        const additional = this.additionalDamage?.phrases ?? [];
        return [...this.targets?.phrases ?? [], ...additional];
    }
}

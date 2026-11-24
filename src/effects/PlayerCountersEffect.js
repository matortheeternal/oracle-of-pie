import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const ENERGY = '\\{E\\}';
const COUNTER_AMOUNT = `${NUMBER_PATTERN}|that many|an amount of`;
const COUNTED = `(?:(?:${ENERGY})+|(\\w+) counters?\\b)`;
const PLAYER_COUNTERS = new RegExp(
    `^gets? (?:((?:${ENERGY})+)|(${COUNTER_AMOUNT}) ${COUNTED})`, 'i'
);
const ENERGY_KIND = 'energy';
const ENERGY_SYMBOL = /\{E\}/g;

export default class PlayerCountersEffect extends Effect {
    static get pattern() {
        return PLAYER_COUNTERS;
    }

    parseArguments(match) {
        this.counterKind = match[3]?.toLowerCase() ?? ENERGY_KIND;
        this.amountText = match[2] ?? String(match[1].match(ENERGY_SYMBOL).length);
    }

    get givesEnergy() {
        return this.counterKind === ENERGY_KIND;
    }
}

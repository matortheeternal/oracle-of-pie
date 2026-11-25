import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const ENERGY = '\\{E\\}';
const SCALED_AMOUNT = '(?:twice )?that many|a number of|an amount of|an additional';
const COUNTER_AMOUNT = NUMBER_PATTERN + '|' + SCALED_AMOUNT;
const COUNTED = `(?:(?:${ENERGY})+|(\\w+) counters?\\b)(?<scaling> equal to [^,.]+)?`;
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
        this.scaling = match.groups.scaling?.trim() ?? null;
        this.amountText = match[2] ?? String(match[1].match(ENERGY_SYMBOL).length);
    }

    get givesEnergy() {
        return this.counterKind === ENERGY_KIND;
    }
}

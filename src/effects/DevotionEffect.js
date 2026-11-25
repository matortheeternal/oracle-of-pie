import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const DEVOTION = new RegExp(
    '^your devotion to each color (?<combinations>and each combination of colors )?'
        + `is increased by (?<amount>${NUMBER_PATTERN})\\b`,
    'i'
);

export default class DevotionEffect extends Effect {
    static get pattern() {
        return DEVOTION;
    }

    parseArguments(match) {
        this.increasesBy = numberValue(match.groups.amount);
        this.includesColorCombinations = Boolean(match.groups.combinations);
    }
}

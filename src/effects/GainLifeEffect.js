import LifeEffect, { LIFE_AMOUNT } from './LifeEffect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const ADJUSTED_AMOUNT = `that much life plus ${NUMBER_PATTERN}\\b`;
const RADIATION = /^gains? (life) rather than lose life from radiation\b/i;
const GAIN_LIFE = new RegExp(`^gains? (${ADJUSTED_AMOUNT}|${LIFE_AMOUNT})`, 'i');

export default class GainLifeEffect extends LifeEffect {
    static get pattern() {
        return GAIN_LIFE;
    }

    static match(scribe, str) {
        return str.match(RADIATION) ?? super.match(scribe, str);
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.replacesRadiationLifeLoss = RADIATION.test(match[0]);
    }
}

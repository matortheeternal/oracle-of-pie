import LifeEffect, { LIFE_AMOUNT } from './LifeEffect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const ADJUSTED_AMOUNT = `that much life plus ${NUMBER_PATTERN}\\b`;
const GAIN_LIFE = new RegExp(`^gains? (${ADJUSTED_AMOUNT}|${LIFE_AMOUNT})`, 'i');

export default class GainLifeEffect extends LifeEffect {
    static get pattern() {
        return GAIN_LIFE;
    }
}

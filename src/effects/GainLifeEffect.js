import LifeEffect, { LIFE_AMOUNT } from './LifeEffect.js';

const GAIN_LIFE = new RegExp(`^gains? (${LIFE_AMOUNT})`, 'i');

export default class GainLifeEffect extends LifeEffect {
    static get pattern() {
        return GAIN_LIFE;
    }
}

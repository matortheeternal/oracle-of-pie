import LifeEffect, { LIFE_AMOUNT } from './LifeEffect.js';

const LOSE_LIFE = new RegExp(`^loses? (${LIFE_AMOUNT})`, 'i');

export default class LoseLifeEffect extends LifeEffect {
    static get pattern() {
        return LOSE_LIFE;
    }
}

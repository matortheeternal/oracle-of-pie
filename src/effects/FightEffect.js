import ObjectEffect from './ObjectEffect.js';

const FIGHT = /^fights? /i;

export default class FightEffect extends ObjectEffect {
    static get pattern() {
        return FIGHT;
    }
}

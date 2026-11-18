import ObjectEffect from './ObjectEffect.js';

const SACRIFICE = /^sacrifices? /i;

export default class SacrificeEffect extends ObjectEffect {
    static get pattern() {
        return SACRIFICE;
    }
}

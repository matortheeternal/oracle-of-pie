import ObjectEffect from './ObjectEffect.js';

const UNTAP = /^untaps? (?!untapped)/i;

export default class UntapEffect extends ObjectEffect {
    static get pattern() {
        return UNTAP;
    }
}

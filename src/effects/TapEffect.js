import ObjectEffect from './ObjectEffect.js';

const TAP = /^taps? (?!untapped)/i;

export default class TapEffect extends ObjectEffect {
    static get pattern() {
        return TAP;
    }
}

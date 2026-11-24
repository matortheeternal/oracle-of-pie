import ObjectEffect from './ObjectEffect.js';

const REVEAL = /^reveals? (?!(?:their|your|his or her) hand)/i;

export default class RevealEffect extends ObjectEffect {
    static get pattern() {
        return REVEAL;
    }
}

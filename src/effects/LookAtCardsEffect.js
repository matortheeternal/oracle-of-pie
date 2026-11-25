import ObjectEffect from './ObjectEffect.js';

const LOOK_AT_KNOWN_CARDS = /^looks? at (?=(?:it|them|that card|those cards)\b)/i;

export default class LookAtCardsEffect extends ObjectEffect {
    static get pattern() {
        return LOOK_AT_KNOWN_CARDS;
    }

    get isPlayerAction() {
        return true;
    }
}

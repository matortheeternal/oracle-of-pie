import ObjectEffect from './ObjectEffect.js';

const PRESERVE = /^this effect doesn't remove (?=(?:Auras?|Equipment)\b)/i;

export default class PreserveAttachmentsEffect extends ObjectEffect {
    static get pattern() {
        return PRESERVE;
    }
}

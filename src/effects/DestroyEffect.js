import ObjectEffect from './ObjectEffect.js';

const DESTROY = /^destroys? /i;

export default class DestroyEffect extends ObjectEffect {
    static get pattern() {
        return DESTROY;
    }

    get removesPermanently() {
        return true;
    }
}

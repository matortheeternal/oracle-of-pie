import ObjectEffect from './ObjectEffect.js';

const GAIN_CONTROL = /^gains? control of /i;

export default class GainControlEffect extends ObjectEffect {
    static get pattern() {
        return GAIN_CONTROL;
    }
}

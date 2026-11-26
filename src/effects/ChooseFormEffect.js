import ObjectEffect from './ObjectEffect.js';

const CHOOSE_FORM = /^becomes? your choice of /i;

export default class ChooseFormEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE_FORM;
    }

    get isComplete() {
        return this.phrases.length > 1;
    }
}

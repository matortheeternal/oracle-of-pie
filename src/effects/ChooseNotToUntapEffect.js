import ObjectEffect from './ObjectEffect.js';

const CHOOSE_NOT_TO_UNTAP = /^chooses? not to untap /i;
const TIMING = /^during (?:your|its controller's) untap step/i;

export default class ChooseNotToUntapEffect extends ObjectEffect {
    static get pattern() {
        return CHOOSE_NOT_TO_UNTAP;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.consumeText(TIMING);
    }
}

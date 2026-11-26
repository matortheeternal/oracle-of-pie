import ObjectEffect from './ObjectEffect.js';

const NONMANA_ABILITY = /^that (?:isn't|is not) a mana ability\b/i;
const DESTROY = /^destroys? /i;

export default class DestroyEffect extends ObjectEffect {
    static get pattern() {
        return DESTROY;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.requiresNonmanaAbility = Boolean(this.consumeText(NONMANA_ABILITY));
    }

    get removesPermanently() {
        return true;
    }
}

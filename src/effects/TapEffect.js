import ObjectEffect from './ObjectEffect.js';

const TAP = /^taps? (?<untap>or untap )?(?!untapped)/i;

export default class TapEffect extends ObjectEffect {
    static get pattern() {
        return TAP;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.mayUntap = Boolean(match.groups.untap);
    }
}

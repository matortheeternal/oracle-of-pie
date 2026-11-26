import ObjectEffect from './ObjectEffect.js';

const TAP = /^taps? (?:(?<untap>or untap )|(?<goad>and goad ))?(?!untapped)/i;

export default class TapEffect extends ObjectEffect {
    static get pattern() {
        return TAP;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.mayUntap = Boolean(match.groups.untap);
        this.goads = Boolean(match.groups.goad);
    }
}

import ObjectEffect from './ObjectEffect.js';

const UNTAP = /^untaps? (?<goad>and goad )?(?!untapped)/i;
const STEP_OWNERS = '(?:each|each other player\'s|your|its controller\'s)';
const TIMING = new RegExp(`^during (?<step>${STEP_OWNERS} untap step)`, 'i');

export default class UntapEffect extends ObjectEffect {
    static get pattern() {
        return UNTAP;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.goads = Boolean(match.groups.goad);
        this.untapStep = this.consumeText(TIMING)?.groups.step.toLowerCase() ?? null;
    }
}

import ObjectEffect from './ObjectEffect.js';

const SACRIFICE = /^sacrifices? /i;
const ALTERNATIVE = /^or (?:pays? [^,.]+|discards? [^,.]+)/i;
const TIMING = /^at (?:end of combat|the beginning of [^,.]+)/i;

export default class SacrificeEffect extends ObjectEffect {
    static get pattern() {
        return SACRIFICE;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.alternative = this.consumeText(ALTERNATIVE)?.[0] ?? null;
        this.timing = this.consumeText(TIMING)?.[0] ?? null;
    }

    get hasAlternative() {
        return Boolean(this.alternative);
    }

    get isDelayed() {
        return Boolean(this.timing);
    }
}

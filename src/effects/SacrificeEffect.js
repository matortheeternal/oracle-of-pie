import ObjectEffect from './ObjectEffect.js';

const SACRIFICE = /^sacrifices? /i;
const PASSIVE_SACRIFICE = /^(?:is|are) sacrificed(?=$|\b when )/i;
const ALTERNATIVE = /^or (?:pays? [^,.]+|discards? [^,.]+)/i;
const SAME_WAY = /^the same way\b/i;
const TIMING = new RegExp(
    '^(?:when (?:it enters|they enter)|at (?:end of combat|the'
        + ' beginning of [^,.]+))', 'i'
);

export default class SacrificeEffect extends ObjectEffect {
    static get pattern() {
        return SACRIFICE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(PASSIVE_SACRIFICE);
    }

    parseArguments(match) {
        this.isPassive = PASSIVE_SACRIFICE.test(match[0]);
        super.parseArguments(match);
        this.alternative = this.consumeText(ALTERNATIVE)?.[0] ?? null;
        this.repeatsPriorSelection = Boolean(this.consumeText(SAME_WAY));
        this.timing = this.consumeText(TIMING)?.[0] ?? null;
    }

    get isComplete() {
        return this.isPassive || super.isComplete;
    }

    get phrases() {
        return this.isPassive ? [this.subject].filter(Boolean) : super.phrases;
    }

    get hasAlternative() {
        return Boolean(this.alternative);
    }

    get consumesSource() {
        if (this.isDelayed || !this.affectsYou) return false;
        return this.phrases.some(phrase => phrase.refersToSelf);
    }

    get isDelayed() {
        return Boolean(this.timing);
    }
}

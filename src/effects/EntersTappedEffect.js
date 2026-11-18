import Effect from './Effect.js';

const ENTERS_TAPPED = /^enters? tapped(?! and attacking)\b/i;
const UNLESS = /^unless ([^,.]+)/i;

export default class EntersTappedEffect extends Effect {
    static get pattern() {
        return ENTERS_TAPPED;
    }

    parseArguments(match) {
        this.unless = this.consumeText(UNLESS)?.[1] ?? null;
    }

    get isConditional() {
        return Boolean(this.unless);
    }
}

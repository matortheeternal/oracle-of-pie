import ObjectEffect from './ObjectEffect.js';

const DAMAGE = /^damage (?:isn't|is not) removed from /i;
const CLEANUP = /^during cleanup steps?\b/i;

export default class RetainDamageEffect extends ObjectEffect {
    static get pattern() {
        return DAMAGE;
    }

    parseArguments(match) {
        super.parseArguments(match);
        this.duringCleanup = Boolean(this.consumeText(CLEANUP));
    }

    get isComplete() {
        return this.duringCleanup && super.isComplete;
    }
}

import Effect from './Effect.js';

const PAYMENT = /^pays? (?<owner>its|their) (?<name>[a-z-]+) cost\b/i;
const MODE_PAYMENT = /^pays? this cost for each mode chosen beyond the first\b/i;
const ALTERNATIVE = /^rather than (?:pay(?:ing) )?(?:its|their) mana costs?\b/i;

export default class PayNamedCostEffect extends Effect {
    static get pattern() {
        return PAYMENT;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(MODE_PAYMENT);
    }

    parseArguments(match) {
        this.costOwner = match.groups?.owner.toLowerCase() ?? null;
        this.costName = match.groups?.name.toLowerCase() ?? null;
        this.paysPerExtraMode = !match.groups;
        this.replacesManaCost = Boolean(this.consumeText(ALTERNATIVE));
    }
}

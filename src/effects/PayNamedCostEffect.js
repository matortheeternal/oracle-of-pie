import Effect from './Effect.js';

const PAYMENT = /^pays? (?<owner>its|their) (?<name>[a-z-]+) cost\b/i;
const ALTERNATIVE = /^rather than (?:pay(?:ing) )?(?:its|their) mana costs?\b/i;

export default class PayNamedCostEffect extends Effect {
    static get pattern() {
        return PAYMENT;
    }

    parseArguments(match) {
        this.costOwner = match.groups.owner.toLowerCase();
        this.costName = match.groups.name.toLowerCase();
        this.replacesManaCost = Boolean(this.consumeText(ALTERNATIVE));
    }
}

import Effect from './Effect.js';

const EXCESS_DAMAGE = /^excess damage is dealt to (?<recipient>[^,.]+?) instead\b/i;

export default class ExcessDamageEffect extends Effect {
    static get pattern() {
        return EXCESS_DAMAGE;
    }

    parseArguments(match) {
        this.recipient = match.groups.recipient.toLowerCase();
    }
}

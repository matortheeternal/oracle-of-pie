import Effect from './Effect.js';

const ENTERS_TAPPED = /^enters? tapped(?<attacking> and attacking(?: that player)?)?\b/i;
const ATTACK_PLAYER = /^(?:that player|that opponent)\b/i;
const WITH_COUNTERS = /^and with ([^,.]+ counters? on it)/i;
const UNLESS = /^unless ([^,.]+)/i;

export default class EntersTappedEffect extends Effect {
    static get pattern() {
        return ENTERS_TAPPED;
    }

    parseArguments(match) {
        this.isAttacking = Boolean(match.groups.attacking);
        this.attackRecipient = this.isAttacking
            ? this.consumeText(ATTACK_PLAYER)?.[0] : null;
        this.counters = this.consumeText(WITH_COUNTERS)?.[1] ?? null;
        this.unless = this.consumeText(UNLESS)?.[1] ?? null;
    }

    get isConditional() {
        return Boolean(this.unless);
    }
}

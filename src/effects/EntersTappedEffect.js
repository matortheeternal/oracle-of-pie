import Effect from './Effect.js';

const ENTERS_TAPPED = new RegExp(
    '^enters? (?:the battlefield )?tapped'
        + '(?<attacking> and attacking(?: that player)?)?\\b', 'i'
);
const ATTACK_PLAYER = /^(?:that player|that opponent)\b/i;
const WITH_COUNTERS = /^and with ([^,.]+ counters? on it)/i;
const UNLESS = /^unless ([^,.]+)/i;
const EARLY_TURNS = new RegExp(
    '^unless (it\'s your first, second, or third turn of the game)\\b', 'i'
);

export default class EntersTappedEffect extends Effect {
    static get pattern() {
        return ENTERS_TAPPED;
    }

    parseArguments(match) {
        this.isAttacking = Boolean(match.groups.attacking);
        this.attackRecipient = this.isAttacking
            ? this.consumeText(ATTACK_PLAYER)?.[0] : null;
        this.counters = this.consumeText(WITH_COUNTERS)?.[1] ?? null;
        const exception = this.consumeText(EARLY_TURNS) ?? this.consumeText(UNLESS);
        this.unless = exception?.[1] ?? null;
    }

    get isConditional() {
        return Boolean(this.unless);
    }
}

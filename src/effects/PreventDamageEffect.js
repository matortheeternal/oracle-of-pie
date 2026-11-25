import Effect from './Effect.js';

const PREVENT_AMOUNT = '(all but \\w+ of that|all|the next \\w+|\\w+ of that|that|the)';
const DAMAGE = '(?:(combat|noncombat) )?damage(?: that would be dealt)?';
const PREVENTED = `${PREVENT_AMOUNT} ${DAMAGE}`;
const PREVENT_DAMAGE = new RegExp(`^prevent ${PREVENTED}`, 'i');
const SCOPE = /^[^,.]+/;
const UNRESTRICTED_SCOPE = /^(?:this turn)?$/i;

export default class PreventDamageEffect extends Effect {
    static get pattern() {
        return PREVENT_DAMAGE;
    }

    parseArguments(match) {
        this.isAll = match[1].toLowerCase() === 'all';
        this.damageKind = match[2]?.toLowerCase() ?? null;
        this.scope = this.consumeText(SCOPE)?.[0].trim() ?? '';
    }

    get isUnrestricted() {
        return UNRESTRICTED_SCOPE.test(this.scope);
    }

    get isCombatOnly() {
        return this.damageKind === 'combat';
    }
}

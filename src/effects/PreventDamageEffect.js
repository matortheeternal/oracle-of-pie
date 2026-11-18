import Effect from './Effect.js';

const PREVENT_AMOUNT = '(all|the next \\w+)';
const PREVENTED = `${PREVENT_AMOUNT} (combat )?damage that would be dealt`;
const PREVENT_DAMAGE = new RegExp(`^prevent ${PREVENTED}`, 'i');
const SCOPE = /^[^,.]+/;
const UNRESTRICTED_SCOPE = /^(?:this turn)?$/i;

export default class PreventDamageEffect extends Effect {
    static get pattern() {
        return PREVENT_DAMAGE;
    }

    parseArguments(match) {
        this.isAll = match[1].toLowerCase() === 'all';
        this.isCombatOnly = Boolean(match[2]);
        this.scope = this.consumeText(SCOPE)?.[0].trim() ?? '';
    }

    get isUnrestricted() {
        return UNRESTRICTED_SCOPE.test(this.scope);
    }
}

import Effect from './Effect.js';

const PREVENTION_BAN = /^(?<combat>combat )?damage can't be prevented\b/i;

export default class PreventionBanEffect extends Effect {
    static get pattern() {
        return PREVENTION_BAN;
    }

    parseArguments(match) {
        this.combatOnly = Boolean(match.groups.combat);
    }
}

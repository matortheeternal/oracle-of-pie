import Effect from './Effect.js';

const PREVENTION_BAN = new RegExp(
    '^(?<combat>combat )?damage(?: that would be dealt by'
        + ' (?<source>[^,.]+?))? can\'t be prevented\\b', 'i'
);

export default class PreventionBanEffect extends Effect {
    static get pattern() {
        return PREVENTION_BAN;
    }

    parseArguments(match) {
        this.combatOnly = Boolean(match.groups.combat);
        this.source = match.groups.source ?? null;
    }
}

import Effect from './Effect.js';

const SPENDING_RULE = new RegExp(
    '^(?<mana>this mana|mana of any (?:type|color)) (?<permission>can\'t|can) '
    + 'be spent (?:only )?to (?<use>[^,.]+)', 'i'
);
const ACTIVE_SPENDING = new RegExp(
    '^(?:spend|can spend) (?<only>only )?(?<mana>mana of (?:any type|the chosen color)'
        + '|mana produced by [^,.]+?) to (?<use>[^,.]+)', 'i'
);

export default class ManaSpendingRuleEffect extends Effect {
    static get pattern() {
        return SPENDING_RULE;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(ACTIVE_SPENDING);
    }

    parseArguments(match) {
        this.mana = match.groups.mana.toLowerCase();
        this.isRestriction = Boolean(match.groups.only)
            || match.groups.permission?.toLowerCase() === 'can\'t';
        this.use = match.groups.use;
    }

    get allowsAnyType() {
        return this.mana.startsWith('mana of any');
    }
}

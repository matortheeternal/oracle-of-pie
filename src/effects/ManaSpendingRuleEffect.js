import Effect from './Effect.js';

const SPENDING_RULE = new RegExp(
    '^(?<mana>this mana|mana of any (?:type|color)) (?<permission>can\'t|can) '
    + 'be spent (?:only )?to (?<use>[^,.]+)', 'i'
);

export default class ManaSpendingRuleEffect extends Effect {
    static get pattern() {
        return SPENDING_RULE;
    }

    parseArguments(match) {
        this.mana = match.groups.mana.toLowerCase();
        this.isRestriction = match.groups.permission.toLowerCase() === 'can\'t';
        this.use = match.groups.use;
    }

    get allowsAnyType() {
        return this.mana.startsWith('mana of any');
    }
}

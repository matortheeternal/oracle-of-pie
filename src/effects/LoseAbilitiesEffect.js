import Effect from './Effect.js';

const LOSE_ABILITIES = new RegExp(
    '^(?:loses? all (?<other>other )?abilities(?<mana> except mana abilities)?'
        + '|(?:has|have) no abilities)\\b', 'i'
);

export default class LoseAbilitiesEffect extends Effect {
    static get pattern() {
        return LOSE_ABILITIES;
    }

    parseArguments(match) {
        this.keepsSelf = Boolean(match.groups.other);
        this.keepsManaAbilities = Boolean(match.groups.mana);
    }
}

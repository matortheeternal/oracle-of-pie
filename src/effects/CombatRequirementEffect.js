import Effect from './Effect.js';

const COMBAT_REQUIREMENT = /^(attack|block)s? each (?:combat|turn) if able/i;
const ATTACK = 'attack';

export default class CombatRequirementEffect extends Effect {
    static get pattern() {
        return COMBAT_REQUIREMENT;
    }

    parseArguments(match) {
        this.requirement = match[1].toLowerCase();
    }

    get mustAttack() {
        return this.requirement === ATTACK;
    }
}

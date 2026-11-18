import Effect from './Effect.js';

const COMBAT_WINDOW = '(?:each|this) (?:combat|turn) if able';
const EACH_COMBAT = `(attack|block)s?(?: or blocks?)?(?: [^,.]*?)? ${COMBAT_WINDOW}`;
const MUST_BE_BLOCKED = 'must (be blocked)[^,.]* if able';
const COMBAT_REQUIREMENT = new RegExp(`^(?:${EACH_COMBAT}|${MUST_BE_BLOCKED})`, 'i');
const ATTACK = 'attack';

export default class CombatRequirementEffect extends Effect {
    static get pattern() {
        return COMBAT_REQUIREMENT;
    }

    parseArguments(match) {
        this.requirement = (match[1] ?? match[2]).toLowerCase();
    }

    get mustAttack() {
        return this.requirement === ATTACK;
    }
}

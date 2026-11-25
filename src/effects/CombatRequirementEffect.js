import Effect from './Effect.js';

const COMBAT_WINDOW = '(?:each|this) (?:combat|turn) if able';
const EACH_COMBAT = `(attack|block)s?(?: or blocks?)?(?: [^,.]*?)? ${COMBAT_WINDOW}`;
const MUST_BE_BLOCKED = 'must (be blocked)[^,.]* if able';
const NEXT_COMBAT = 'attacks? during (?:its|their) controller\'s next combat phase'
    + ' if able';
const REQUIRED_ATTACK = 'must attack with at least one creature each combat if able';
const COMBAT_REQUIREMENT = new RegExp(
    `^(?:${EACH_COMBAT}|${MUST_BE_BLOCKED}|(?<attack>${NEXT_COMBAT}|${REQUIRED_ATTACK}))`,
    'i'
);
const ATTACK = 'attack';

export default class CombatRequirementEffect extends Effect {
    static get pattern() {
        return COMBAT_REQUIREMENT;
    }

    parseArguments(match) {
        const requirement = match.groups.attack ? ATTACK : match[1] ?? match[2];
        this.requirement = requirement.toLowerCase();
    }

    get mustAttack() {
        return this.requirement === ATTACK;
    }
}

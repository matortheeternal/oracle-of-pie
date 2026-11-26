import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const COMBAT_WINDOW = '(?:each|this) (?:combat|turn) if able';
const EACH_COMBAT = `(attack|block)s?(?: or blocks?)?(?: [^,.]*?)? ${COMBAT_WINDOW}`;
const MUST_ACT = `must (attack|block) ${COMBAT_WINDOW}`;
const MUST_BE_BLOCKED = 'must (be blocked)[^,.]* if able';
const NEXT_COMBAT = 'attacks? during (?:its|their) controller\'s next combat phase'
    + ' if able';
const REQUIRED_ATTACK = 'must attack with at least one creature each combat if able';
const COMBAT_REQUIREMENT = new RegExp(
    `^(?:${EACH_COMBAT}|${MUST_BE_BLOCKED}|${MUST_ACT}|`
        + `(?<attack>${NEXT_COMBAT}|${REQUIRED_ATTACK}))`,
    'i'
);
const ATTACK = 'attack';
const TARGETED_REQUIREMENT = /^(?<withDefenders>must attack) (?=[^,.]+ with at least )/i;
const OTHER_PLAYER = /^and attacks? a player other than (?<excluded>you) if able\b/i;
const MINIMUM_ATTACKERS = new RegExp(
    `^with at least (?<count>${NUMBER_PATTERN}) creatures? ${COMBAT_WINDOW}`, 'i'
);

export default class CombatRequirementEffect extends Effect {
    static get pattern() {
        return COMBAT_REQUIREMENT;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(TARGETED_REQUIREMENT);
    }

    parseArguments(match) {
        const wording = match[1] ?? match[2] ?? match[3] ?? ATTACK;
        const requirement = match.groups?.attack ? ATTACK : wording;
        this.requirement = requirement.toLowerCase();
        this.excludedPlayer = this.consumeText(OTHER_PLAYER)?.groups.excluded ?? null;
        this.requiresDefenders = Boolean(match.groups?.withDefenders);
        if (!this.requiresDefenders) return;
        this.defenders = this.consume([PhraseList]);
        const minimum = this.consumeText(MINIMUM_ATTACKERS)?.groups.count;
        this.minimumAttackers = minimum ? numberValue(minimum) : null;
    }

    get parts() {
        return [this.defenders].filter(Boolean);
    }

    get isComplete() {
        if (!this.requiresDefenders) return true;
        return Boolean(this.defenders && this.minimumAttackers);
    }

    get mustAttack() {
        return this.requirement === ATTACK;
    }
}

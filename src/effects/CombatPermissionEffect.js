import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const COMBAT_PERMISSION = /^(?:can|may) (attack|block) ([^,.]+)/i;
const DIRECTIONAL_ATTACK = new RegExp(
    '^attack only the nearest opponent in the chosen direction and planeswalkers '
        + 'controlled by that opponent\\b', 'i'
);
const EXTRA_BLOCKERS = new RegExp(
    `^(?:an additional (?:${NUMBER_PATTERN} )?creatures?|any number of creatures)`
        + '(?: each combat| this turn)?(?: as long as .+)?$',
    'i'
);

export default class CombatPermissionEffect extends Effect {
    static get pattern() {
        return COMBAT_PERMISSION;
    }

    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(DIRECTIONAL_ATTACK);
    }

    parseArguments(match) {
        this.usesChosenDirection = DIRECTIONAL_ATTACK.test(match[0]);
        this.action = match[1]?.toLowerCase() ?? 'attack';
        this.permission = match[2] ?? null;
    }

    get allowsAdditionalBlocks() {
        return this.action === 'block' && EXTRA_BLOCKERS.test(this.permission);
    }
}

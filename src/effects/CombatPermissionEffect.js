import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const COMBAT_PERMISSION = /^can (attack|block) ([^,.]+)/i;
const EXTRA_BLOCKERS = new RegExp(
    `^(?:an additional (?:${NUMBER_PATTERN} )?creatures?|any number of creatures)`
        + '(?: each combat| this turn)?(?: as long as .+)?$',
    'i'
);

export default class CombatPermissionEffect extends Effect {
    static get pattern() {
        return COMBAT_PERMISSION;
    }

    parseArguments(match) {
        this.action = match[1].toLowerCase();
        this.permission = match[2];
    }

    get allowsAdditionalBlocks() {
        return this.action === 'block' && EXTRA_BLOCKERS.test(this.permission);
    }
}

import Effect from './Effect.js';

const COMBAT_PERMISSION = /^can (attack|block) ([^,.]+)/i;

export default class CombatPermissionEffect extends Effect {
    static get pattern() {
        return COMBAT_PERMISSION;
    }

    parseArguments(match) {
        this.action = match[1].toLowerCase();
        this.permission = match[2];
    }
}

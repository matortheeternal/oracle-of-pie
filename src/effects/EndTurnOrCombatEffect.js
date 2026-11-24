import Effect from './Effect.js';

const END_TURN_OR_COMBAT = /^end the (turn|combat phase)\b/i;

export default class EndTurnOrCombatEffect extends Effect {
    static get pattern() {
        return END_TURN_OR_COMBAT;
    }

    parseArguments(match) {
        this.ends = match[1].toLowerCase();
    }
}

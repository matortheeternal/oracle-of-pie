import Effect from './Effect.js';

const ROLL_DIE = /^rolls? (a|two|three) d(\d+)/i;
const ROLL_MODIFIER = /^\s*and add ([^.]+)/i;

export default class RollDieEffect extends Effect {
    static get pattern() {
        return ROLL_DIE;
    }

    parseArguments(match) {
        this.sides = Number(match[2]);
        this.modifier = this.consumeText(ROLL_MODIFIER)?.[1] ?? null;
    }
}

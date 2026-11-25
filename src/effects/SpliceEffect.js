import Effect from './Effect.js';

const SPLICE = /^adds? this card's effects to (?<spell>that spell|it)\b/i;

export default class SpliceEffect extends Effect {
    static get pattern() {
        return SPLICE;
    }

    parseArguments(match) {
        this.spell = match.groups.spell.toLowerCase();
    }
}

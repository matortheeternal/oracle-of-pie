import Effect from './Effect.js';

const ROUND = /^round (up|down)( each time)?\b/i;

export default class RoundingEffect extends Effect {
    static get pattern() {
        return ROUND;
    }

    parseArguments(match) {
        this.direction = match[1].toLowerCase();
        this.appliesRepeatedly = Boolean(match[2]);
    }
}

import Effect from './Effect.js';

const ENTERS_UNTAPPED = /^enters? untapped\b/i;

export default class EntersUntappedEffect extends Effect {
    static get pattern() {
        return ENTERS_UNTAPPED;
    }
}

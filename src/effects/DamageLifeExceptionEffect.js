import Effect from './Effect.js';

const EXCEPTION = /^damage doesn't cause you to lose life\b/i;

export default class DamageLifeExceptionEffect extends Effect {
    static get pattern() {
        return EXCEPTION;
    }
}

import Effect from './Effect.js';

const EXCEPTION = /^this ability doesn't affect its color identity\b/i;

export default class ColorIdentityExceptionEffect extends Effect {
    static get pattern() {
        return EXCEPTION;
    }
}

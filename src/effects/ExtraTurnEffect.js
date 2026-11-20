import Effect from './Effect.js';

const EXTRA_TURN = /^takes? an extra turn\b(?: after this one\b)?/i;

export default class ExtraTurnEffect extends Effect {
    static get pattern() {
        return EXTRA_TURN;
    }
}

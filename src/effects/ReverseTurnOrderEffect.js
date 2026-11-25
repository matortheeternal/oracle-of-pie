import Effect from './Effect.js';

const REVERSE = /^reverse the game's turn order\b/i;

export default class ReverseTurnOrderEffect extends Effect {
    static get pattern() {
        return REVERSE;
    }
}

import Effect from './Effect.js';

const BEGIN_GAME = /^begin the game with [^,.]+ on the battlefield/i;

export default class BeginGameEffect extends Effect {
    static get pattern() {
        return BEGIN_GAME;
    }
}

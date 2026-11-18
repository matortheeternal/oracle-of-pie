import Effect from './Effect.js';

const GAME_RESULT = /^(win|lose)s? the game/i;
const WIN = 'win';

export default class GameResultEffect extends Effect {
    static get pattern() {
        return GAME_RESULT;
    }

    parseArguments(match) {
        this.result = match[1].toLowerCase();
    }

    get winsGame() {
        return this.result === WIN;
    }
}

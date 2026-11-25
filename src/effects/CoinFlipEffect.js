import Effect from './Effect.js';

const FLIP_COIN = /^flips? (?:a|two|\w+) coins?/i;

const UNTIL_LOSS = /^until you lose a flip\b/i;

export default class CoinFlipEffect extends Effect {
    parseArguments() {
        this.repeatsUntilLoss = Boolean(this.consumeText(UNTIL_LOSS));
    }

    static get pattern() {
        return FLIP_COIN;
    }
}

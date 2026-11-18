import Effect from './Effect.js';

const FLIP_COIN = /^flips? (?:a|two|\w+) coins?/i;

export default class CoinFlipEffect extends Effect {
    static get pattern() {
        return FLIP_COIN;
    }
}

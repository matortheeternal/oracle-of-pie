import Effect from './Effect.js';

const FLIP_COIN = /^flips? (?:that many|one or more|\w+) coins?\b/i;

const GUARANTEED_WIN = new RegExp(
    '^those coins come up (?<face>heads|tails) and you win those flips\\b', 'i'
);
const UNTIL_LOSS = /^until you lose a flip\b/i;

export default class CoinFlipEffect extends Effect {
    static match(scribe, str) {
        return super.match(scribe, str) ?? str.match(GUARANTEED_WIN);
    }

    parseArguments(match) {
        this.winningFace = match.groups?.face ?? null;
        this.repeatsUntilLoss = Boolean(this.consumeText(UNTIL_LOSS));
    }

    static get pattern() {
        return FLIP_COIN;
    }
}

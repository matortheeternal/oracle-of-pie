import Effect from './Effect.js';

const REVEAL_HAND = /^reveals? (?:their|your|his or her) hand/i;

export default class RevealHandEffect extends Effect {
    static get pattern() {
        return REVEAL_HAND;
    }
}

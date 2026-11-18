import Effect from './Effect.js';

const ZONES = '(?:hand(?: and graveyard)?|graveyard(?: and hand)?)';
const SHUFFLE = new RegExp(
    `^shuffles? (?:their|your) (${ZONES}) into (?:their|your) library`, 'i'
);
const HAND = /\bhand\b/i;

export default class ShuffleIntoLibraryEffect extends Effect {
    static get pattern() {
        return SHUFFLE;
    }

    parseArguments(match) {
        this.zones = match[1];
    }

    get shufflesHand() {
        return HAND.test(this.zones);
    }
}

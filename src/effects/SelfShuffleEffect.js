import Effect from './Effect.js';

const SELF_SHUFFLE = /^~'s owner shuffles (?:it|him|her|them) into their library/i;

export default class SelfShuffleEffect extends Effect {
    static get pattern() {
        return SELF_SHUFFLE;
    }

    parseArguments(match) {
        this.destination = 'library';
    }

    get consumesSource() {
        return true;
    }
}

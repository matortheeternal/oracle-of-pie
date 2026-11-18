import Effect from './Effect.js';

const REVEAL_UNTIL = new RegExp(
    '^reveals? cards from the top of (?:your|their|his or her|its owner\'s) library '
    + 'until ',
    'i'
);
const FOUND_CARD = /^[^,.]+?(?= and |,|\.|$)/i;

export default class RevealUntilEffect extends Effect {
    static get pattern() {
        return REVEAL_UNTIL;
    }

    parseArguments(match) {
        this.foundCard = this.consumeText(FOUND_CARD)?.[0] ?? null;
    }

    get isComplete() {
        return Boolean(this.foundCard);
    }
}

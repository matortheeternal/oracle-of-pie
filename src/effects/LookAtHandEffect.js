import Effect from './Effect.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const OWNERS = [
    'target opponent', 'target player', 'an opponent', 'each opponent', 'that player',
    'defending player'
];
const LOOK_AT_HAND = new RegExp(
    `^looks? at (?<owner>${OWNERS.join('|')})'s hand\\b`, 'i'
);

export default class LookAtHandEffect extends Effect {
    static get pattern() {
        return LOOK_AT_HAND;
    }

    parseArguments(match) {
        this.handOwner = match.groups.owner.toLowerCase();
        const cards = `the cards in ${this.handOwner}'s hand`;
        this.handCards = this.parseNext(cards, PHRASE_PARSERS);
    }

    get referenceSeeds() {
        return [this.handCards].filter(Boolean);
    }
}

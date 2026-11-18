import Effect from './Effect.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const OWNER = '(?:your|their|his or her|its owner\'s)';
const ZONE = `(?:the top of ${OWNER} library|${OWNER} (?:sideboard|graveyard|hand))`;
const DIG_UNTIL = new RegExp(
    `^(?:reveals?|exiles?) cards from ${ZONE}(?: at random)? until `,
    'i'
);
const FINDER = /^(?:you|they|he or she|that player) (?:reveals?|exiles?) /i;
const PASSIVE_FIND = /^(?:is|are) (?:revealed|exiled)\b/i;

export default class DigUntilEffect extends Effect {
    static get pattern() {
        return DIG_UNTIL;
    }

    parseArguments(match) {
        this.consumeText(FINDER);
        this.foundCard = this.consume(PHRASE_PARSERS);
        this.consumeText(PASSIVE_FIND);
    }

    get parts() {
        return [this.foundCard].filter(Boolean);
    }

    get phrases() {
        return [this.foundCard].filter(Boolean);
    }

    get findsRandomCard() {
        return true;
    }

    get isComplete() {
        return Boolean(this.foundCard);
    }
}

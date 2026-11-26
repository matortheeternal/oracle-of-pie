import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const OWNER = '(?:your|their|his or her|its owner\'s)';
const LIBRARY_TOP = `the top of (?:${OWNER} library|it)`;
const ZONE = `(?:${LIBRARY_TOP}|${OWNER} (?:sideboard|graveyard|hand))`;
const DIG_UNTIL = new RegExp(
    `^(?:reveals?|exiles?) cards from ${ZONE}(?: at random)? until `,
    'i'
);
const MANA_VALUE_LIMIT = new RegExp(
    '^(?:that player|they) (?:has|have) exiled cards with total mana value '
        + '(?<minimum>\\d+) or greater(?: this way)?\\b', 'i'
);
const FINDER = /^(?:you|they|he or she|that player) (?:reveals?|exiles?) /i;
const PASSIVE_FIND = /^(?:is|are) (?:revealed|exiled)\b/i;
const QUANTITY = /^equal to the number of (?<source>[a-z-]+) sacrificed this way\b/i;

export default class DigUntilEffect extends Effect {
    static get pattern() {
        return DIG_UNTIL;
    }

    parseArguments(match) {
        const limit = this.consumeText(MANA_VALUE_LIMIT);
        this.minimumTotalManaValue = limit ? Number(limit.groups.minimum) : null;
        if (limit) return;
        this.consumeText(FINDER);
        this.foundCards = this.consume([PhraseList]);
        this.foundCard = this.foundCards?.phrases[0] ?? null;
        this.consumeText(PASSIVE_FIND);
        this.countsSacrificed = this.consumeText(QUANTITY)?.groups.source ?? null;
    }

    get parts() {
        return this.phrases;
    }

    get phrases() {
        return this.foundCards?.phrases ?? [];
    }

    get findsRandomCard() {
        return true;
    }

    get isComplete() {
        return Boolean(this.foundCard) || this.minimumTotalManaValue !== null;
    }
}

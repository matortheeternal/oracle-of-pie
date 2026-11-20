import Effect from './Effect.js';
import PhraseList from '../phrases/PhraseList.js';

const SEARCH_ALTERNATIVES = [
    'your',
    'their',
    'target player\'s',
    'its owner\'s',
    'that player\'s'
];
const SEARCH = new RegExp(
    `^search(?:es)? (?:${SEARCH_ALTERNATIVES.join('|')}) library`
        + '(?: and(?:\\/or)? (?:your )?graveyard)? for ',
    'i'
);
const WHERE_X = /^, where X is [^,.]+/i;
const REVEAL = /^,? reveal (?:it|them|that card|those cards)/i;
const PUT_DESTINATION_ALTERNATIVES = [
    'into your hand',
    'onto the battlefield(?: tapped)?(?: under your control)?',
    'into your graveyard',
    'on top of your library',
    'into exile'
];
const PUT_OBJECT = '(?:it|them|that card|those cards|one of them|the rest)';
const SPLIT_DESTINATION = new RegExp(
    '^,? (?:and |then )?put one (onto the battlefield tapped) '
        + 'and the other into your hand',
    'i'
);
const PUT_DESTINATION = new RegExp(
    `^,? (?:and |then )?put ${PUT_OBJECT}(?: (?:onto|into) [^,.]+?)? `
        + `(${PUT_DESTINATION_ALTERNATIVES.join('|')})`,
    'i'
);
const SHUFFLE = /^,? (?:then |and )?shuffle/i;

function isLandPhrase(phrase) {
    if (phrase.hasExactType?.('land')) return true;
    return Boolean(phrase.subtypes?.some(isBasicLandType));
}

export default class SearchLibraryEffect extends Effect {
    static get pattern() {
        return SEARCH;
    }

    parseArguments(match) {
        this.wanted = this.consume([PhraseList]);
        this.consumeText(WHERE_X);
        this.revealed = Boolean(this.consumeText(REVEAL));
        const split = this.consumeText(SPLIT_DESTINATION);
        this.splitsBetweenBattlefieldAndHand = Boolean(split);
        const destination = split ?? this.consumeText(PUT_DESTINATION);
        this.destination = destination?.[1].toLowerCase() ?? null;
        this.shuffles = Boolean(this.consumeText(SHUFFLE));
    }

    get parts() {
        return [this.wanted].filter(Boolean);
    }

    get isComplete() {
        return Boolean(this.wanted);
    }

    get phrases() {
        return this.wanted?.phrases ?? [];
    }

    get findsLand() {
        return Boolean(this.wanted?.some(isLandPhrase));
    }

    get toHand() {
        return Boolean(this.destination?.includes('hand'));
    }

    get toBattlefield() {
        return Boolean(this.destination?.includes('battlefield'));
    }
}

const BASIC_LAND_TYPES = new Set(['Plains', 'Island', 'Swamp', 'Mountain', 'Forest']);

function isBasicLandType(subtype) {
    return BASIC_LAND_TYPES.has(subtype);
}

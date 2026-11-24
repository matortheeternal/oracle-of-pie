import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LOOK_VERB = '(?:look at|reveal|reveals|exile|exiles)';
const TOP_CARDS = `(?:(${NUMBER_PATTERN}) cards|card)`;
const OWNERS = `your|their|target player's|that player's|each player's`;
const LOOK = new RegExp(
    `^${LOOK_VERB} the top ${TOP_CARDS} of (?<owner>${OWNERS}) library(?: face down)?`,
    'i'
);

export default class LookAtTopEffect extends Effect {
    static get pattern() {
        return LOOK;
    }

    parseArguments(match) {
        this.verb = match[0].split(' ')[0].toLowerCase();
        this.libraryOwner = match.groups.owner.toLowerCase();
        this.cardCount = match[1]?.toLowerCase() ?? null;
    }

    get looksAtOneCard() {
        return !this.cardCount;
    }

    get looksInYourLibrary() {
        return this.libraryOwner === 'your';
    }
}

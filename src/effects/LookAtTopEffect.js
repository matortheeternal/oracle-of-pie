import Effect from './Effect.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LOOK_VERB = '(?:look at|reveal|reveals|exile|exiles)';
const COUNT = `${NUMBER_PATTERN}|that many`;
const TOP_CARDS = `(?:the top (?:(?<count>${COUNT}) cards|card) of`
    + `|(?<fromCount>${COUNT}) cards from the top of)`;
const OWNERS = `your|their|target player's|that player's|each player's`;
const LOOK = new RegExp(
    `^${LOOK_VERB} ${TOP_CARDS} (?<owner>${OWNERS}) library(?: face down)?`,
    'i'
);

export default class LookAtTopEffect extends Effect {
    static get pattern() {
        return LOOK;
    }

    parseArguments(match) {
        this.verb = match[0].split(' ')[0].toLowerCase();
        this.libraryOwner = match.groups.owner.toLowerCase();
        const count = match.groups.count ?? match.groups.fromCount;
        this.cardCount = count?.toLowerCase() ?? null;
    }

    get looksAtOneCard() {
        return !this.cardCount;
    }

    get looksInYourLibrary() {
        return this.libraryOwner === 'your';
    }
}

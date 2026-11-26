import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const SEARCH_LIMIT = new RegExp(
    `^search(?:es)? the top (?<count>${NUMBER_PATTERN}) cards of that library instead\\b`,
    'i'
);

export default class LibrarySearchLimitEffect extends Effect {
    static get pattern() {
        return SEARCH_LIMIT;
    }

    parseArguments(match) {
        this.topCardLimit = numberValue(match.groups.count);
    }
}

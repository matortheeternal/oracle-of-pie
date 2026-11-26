import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const EXTRA_LAND = new RegExp(
    `^plays? (${NUMBER_PATTERN}) additional lands?(?: on each of (your|their) turns)?`,
    'i'
);

export default class ExtraLandEffect extends Effect {
    static get pattern() {
        return EXTRA_LAND;
    }

    parseArguments(match) {
        this.count = numberValue(match[1]);
        this.turnOwner = match[2]?.toLowerCase() ?? null;
    }
}

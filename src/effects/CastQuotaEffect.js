import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const QUOTA = new RegExp(
    '^(?:can|may) cast (?:only |no more than )(?<count>' + NUMBER_PATTERN + ') '
        + '(?<additional>more )?spells? (?<window>this turn|each turn)\\b', 'i'
);

export default class CastQuotaEffect extends Effect {
    static get pattern() {
        return QUOTA;
    }

    parseArguments(match) {
        const { count, additional, window } = match.groups;
        this.limit = numberValue(count);
        this.appliesToAdditionalSpells = Boolean(additional);
        this.window = window.toLowerCase();
    }
}

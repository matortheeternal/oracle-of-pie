import Effect from './Effect.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const LIFE_TOTAL_ASSIGNMENT = new RegExp(
    `^(your|each player's|(?:up to one )?target player's|its controller's)`
        + ' life total becomes? ('
        + `${NUMBER_PATTERN}\\b|equal to your starting life total`
        + '|half (?:your|their) starting life total(?:, rounded (?:up|down))?'
        + '|the (?:total toughness of creatures you control'
        + '|lowest life total among all players))'
        + '(?=$|[,.]| and )',
    'i'
);

export default class SetLifeTotalEffect extends Effect {
    static get pattern() {
        return LIFE_TOTAL_ASSIGNMENT;
    }

    parseArguments(match) {
        this.lifeTotalOwner = match[1].toLowerCase();
        this.valueText = match[2].toLowerCase();
        const value = numberValue(this.valueText);
        this.fixedValue = Number.isFinite(value) ? value : null;
    }
}

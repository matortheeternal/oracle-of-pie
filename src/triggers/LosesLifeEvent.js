import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { NUMBER_PATTERN } from '../values/numberWords.js';

const LOSES_LIFE = new RegExp(
    '^(?<subject>.+?)(?: each)? (?<gainsOr>gains? or )?loses? (?:(?<amount>(?:exactly )?'
        + NUMBER_PATTERN + ') )?life\\b', 'i'
);

export default class LosesLifeEvent extends TriggerEvent {
    static get pattern() {
        return LOSES_LIFE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.amount = match.groups.amount ?? null;
        this.includesLifeGain = Boolean(match.groups.gainsOr);
    }
}

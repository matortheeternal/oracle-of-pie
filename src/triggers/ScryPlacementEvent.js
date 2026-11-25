import TriggerEvent from './TriggerEvent.js';
import { NUMBER_PATTERN, numberValue } from '../values/numberWords.js';

const PLACE_DURING_SCRY = new RegExp(
    '^(?<subject>.+?) chooses? to put '
        + `(?<count>${NUMBER_PATTERN})(?<orMore> or more)? cards? `
        + 'on the bottom of (?<owner>your|their) library while scrying\\b',
    'i'
);

export default class ScryPlacementEvent extends TriggerEvent {
    static get pattern() {
        return PLACE_DURING_SCRY;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.count = numberValue(match.groups.count);
        this.isMinimum = Boolean(match.groups.orMore);
        this.libraryOwner = match.groups.owner.toLowerCase();
    }
}

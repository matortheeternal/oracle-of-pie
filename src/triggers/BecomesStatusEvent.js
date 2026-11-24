import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const BECOMES_STATUS = /^(?<subject>.+?) becomes? (?<status>crewed|saddled)\b/i;

export default class BecomesStatusEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_STATUS;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.status = match.groups.status.toLowerCase();
    }
}

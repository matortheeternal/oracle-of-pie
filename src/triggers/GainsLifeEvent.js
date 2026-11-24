import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const GAINS_LIFE = /^(?<subject>.+?) gains? life\b/i;

export default class GainsLifeEvent extends TriggerEvent {
    static get pattern() {
        return GAINS_LIFE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}

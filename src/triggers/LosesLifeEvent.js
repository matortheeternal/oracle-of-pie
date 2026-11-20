import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const LOSES_LIFE = /^(?<subject>.+?) loses? life\b/i;

export default class LosesLifeEvent extends TriggerEvent {
    static get pattern() {
        return LOSES_LIFE;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}

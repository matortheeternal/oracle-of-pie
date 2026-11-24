import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const SURVEIL = /^(?<subject>.+?) surveils?\b/i;

export default class SurveilEvent extends TriggerEvent {
    static get pattern() {
        return SURVEIL;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}

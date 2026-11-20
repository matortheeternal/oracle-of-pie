import TriggerEvent from './TriggerEvent.js';
import TargetingSource from './objects/TargetingSource.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const TARGETED = /^(?<subject>.+?) becomes? the target of\b/i;

export default class TargetedEvent extends TriggerEvent {
    static get pattern() {
        return TARGETED;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    parseObjectPhrase() {
        return this.consume([TargetingSource]);
    }
}

import ConsumingEvent from './ConsumingEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const DISCARDS = /^(?<subject>.+?) discards?\b/i;

export default class DiscardsEvent extends ConsumingEvent {
    static get pattern() {
        return DISCARDS;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}

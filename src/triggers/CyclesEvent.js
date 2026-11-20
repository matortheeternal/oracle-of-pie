import ConsumingEvent from './ConsumingEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const CYCLES = /^(?<subject>.+?) cycles?\b/i;

export default class CyclesEvent extends ConsumingEvent {
    static get pattern() {
        return CYCLES;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }
}

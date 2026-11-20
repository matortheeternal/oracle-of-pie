import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import TapState from './qualifiers/TapState.js';

const ENTERS = /^(?<subject>.+?) enters?\b/i;

export default class EntersEvent extends TriggerEvent {
    static get pattern() {
        return ENTERS;
    }

    static get qualifierParsers() {
        return [TapState, TurnWindow];
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

import TriggerEvent from './TriggerEvent.js';
import ThisWay from './qualifiers/ThisWay.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import TapState from './qualifiers/TapState.js';
import ZoneOrigin from './qualifiers/ZoneOrigin.js';
import Arrival from './qualifiers/Arrival.js';

const ENTERS = /^(?<subject>.+?) enters?\b(?: the battlefield\b)?/i;

export default class EntersEvent extends TriggerEvent {
    static get pattern() {
        return ENTERS;
    }

    static get qualifierParsers() {
        return [TapState, TurnWindow, ZoneOrigin, Arrival, ThisWay];
    }

    get isRepeatable() {
        return !this.isSelf;
    }
}

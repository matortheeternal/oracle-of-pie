import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const GETS_ENERGY = /^(?<subject>.+?) gets? one or more \{E\}(?=$|[ ,.])/i;

export default class GetsEnergyEvent extends TriggerEvent {
    static get pattern() {
        return GETS_ENERGY;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }
}

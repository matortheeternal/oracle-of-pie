import TriggerEvent from './TriggerEvent.js';
import ForMana from './qualifiers/ForMana.js';

const TAPPED = /^(?<subject>.+?) is tapped(?= for\b)/i;

export default class TappedForManaEvent extends TriggerEvent {
    static get pattern() {
        return TAPPED;
    }

    static get qualifierParsers() {
        return [ForMana];
    }
}

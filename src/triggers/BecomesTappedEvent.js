import TriggerEvent from './TriggerEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import SpellCastCondition from './qualifiers/SpellCastCondition.js';

const BECOMES_TAPPED = /^(?<subject>.+?) becomes? tapped\b/i;

export default class BecomesTappedEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_TAPPED;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow, SpellCastCondition];
    }
}

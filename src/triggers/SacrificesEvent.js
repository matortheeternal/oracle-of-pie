import ConsumingEvent from './ConsumingEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import SpellCastCondition from './qualifiers/SpellCastCondition.js';

const SACRIFICES = /^(?<subject>.+?) sacrifices?\b/i;

export default class SacrificesEvent extends ConsumingEvent {
    static get pattern() {
        return SACRIFICES;
    }

    static get qualifierParsers() {
        return [TurnWindow, SpellCastCondition];
    }

    parseObjectPhrase() {
        const phrase = super.parseObjectPhrase();
        if (phrase) phrase.hasLeftBattlefield = true;
        for (const other of this.additionalObjects) other.hasLeftBattlefield = true;
        return phrase;
    }
}

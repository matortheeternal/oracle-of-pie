import ConsumingEvent from './ConsumingEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';

const SACRIFICES = /^(?<subject>.+?) sacrifices?\b/i;

export default class SacrificesEvent extends ConsumingEvent {
    static get pattern() {
        return SACRIFICES;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    parseObjectPhrase() {
        const phrase = super.parseObjectPhrase();
        if (phrase) phrase.hasLeftBattlefield = true;
        return phrase;
    }
}

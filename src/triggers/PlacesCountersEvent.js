import ActionEvent from './ActionEvent.js';
import PlacedCounters from './subjects/PlacedCounters.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const PLACES = /^(?<subject>.+?) puts? (?=(?:an?|one or more) )/i;
const ON = /^on /i;

export default class PlacesCountersEvent extends ActionEvent {
    static get pattern() {
        return PLACES;
    }

    static get objectParsers() {
        return [PlacedCounters];
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    static match(scribe, str) {
        const match = super.match(scribe, str);
        if (!match) return null;
        const counters = PlacedCounters.match(scribe, str.slice(match[0].length));
        return counters ? match : null;
    }

    parseParticipants() {
        super.parseParticipants();
        this.recipient = this.consumeText(ON) ? this.consume(PHRASE_PARSERS) : null;
    }

    get counters() {
        return this.objectPhrase;
    }

    get objectParticipants() {
        return [...super.objectParticipants, this.recipient];
    }
}

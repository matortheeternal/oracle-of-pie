import TriggerEvent from './TriggerEvent.js';
import PlacedCounters from './subjects/PlacedCounters.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const COUNTERS_PUT = /^(?<subject>.+?) (?:is|are) put on\b/i;

export default class CountersPutEvent extends TriggerEvent {
    static get pattern() {
        return COUNTERS_PUT;
    }

    static get subjectParsers() {
        return [PlacedCounters];
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow];
    }

    parseObjectPhrase() {
        return this.consume(PHRASE_PARSERS);
    }

    get counters() {
        return this.subjectPhrase instanceof PlacedCounters ? this.subjectPhrase : null;
    }

    get recipient() {
        return this.objectPhrase;
    }

    get isRepeatable() {
        return !this.counters?.isThreshold;
    }
}

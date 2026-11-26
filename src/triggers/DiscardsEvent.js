import ConsumingEvent from './ConsumingEvent.js';
import FirstTime from './qualifiers/FirstTime.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import AtRandom from './qualifiers/AtRandom.js';

const DISCARDS = /^(?<subject>.+?) discards?\b/i;
const CAUSED_DISCARD = /^(?<cause>.+?) causes? (?<subject>you|that player) to discard\b/i;

export default class DiscardsEvent extends ConsumingEvent {
    static get pattern() {
        return DISCARDS;
    }

    static match(scribe, str) {
        return str.match(CAUSED_DISCARD) ?? super.match(scribe, str);
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.cause = match.groups.cause ?? null;
    }

    static get qualifierParsers() {
        return [FirstTime, TurnWindow, AtRandom];
    }
}

import TriggerEvent from './TriggerEvent.js';
import TurnWindow from './qualifiers/TurnWindow.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const BECOMES_BLOCKED = /^(?<subject>.+?) becomes? blocked\b/i;
const BY = /^by /i;

export default class BecomesBlockedEvent extends TriggerEvent {
    static get pattern() {
        return BECOMES_BLOCKED;
    }

    static get qualifierParsers() {
        return [TurnWindow];
    }

    parseObjectPhrase() {
        if (!this.consumeText(BY)) return null;
        return this.consume(PHRASE_PARSERS);
    }

    get blocker() {
        return this.objectPhrase;
    }
}

import TriggerEvent from './TriggerEvent.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const DEALS = /^(?<subject>.+?) deals? (?:combat )?damage\b/i;
const COMBAT = /\bcombat damage\b/i;
const TO = /^to /i;

export default class DealsDamageEvent extends TriggerEvent {
    static get pattern() {
        return DEALS;
    }

    parseObjectPhrase() {
        const recipient = this.remainingStr.match(TO);
        if (!recipient) return null;
        const text = this.remainingStr.slice(recipient[0].length);
        const phrase = this.parseNext(text, PHRASE_PARSERS);
        if (phrase) this.remainingStr = phrase.remainingStr;
        return phrase;
    }

    get recipient() {
        return this.objectPhrase;
    }

    get isCombat() {
        return COMBAT.test(this.raw);
    }
}

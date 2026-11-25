import TriggerEvent from './TriggerEvent.js';
import { PHRASE_PARSERS } from '../phrases/index.js';

const SPENT = /^that mana is spent to (?<action>cast|activate) /i;

export default class SpentManaEvent extends TriggerEvent {
    static get pattern() {
        return SPENT;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.action = match.groups.action;
    }

    parseObjectPhrase() {
        return this.consume(PHRASE_PARSERS);
    }
}

import TriggerSentence from './TriggerSentence.js';
import Parser from '../core/Parser.js';
import { TRIGGER_EVENTS } from '../triggers/index.js';

const NEXT = /^(the next time) ([^,]+), (.+)$/i;
const WOULD = /\bwould /i;

export default class NextOccurrenceSentence extends TriggerSentence {
    static matchStatement(scribe, text) {
        const match = text.match(NEXT);
        if (!match) return null;
        const [, opening, eventText, body] = match;
        const event = new Parser(scribe).parseNext(
            eventText.replace(WOULD, ''), TRIGGER_EVENTS
        );
        if (!event?.isRecognized) return null;
        return [opening + ' ', opening, eventText, event, body];
    }

    get isReplacementWindow() {
        return WOULD.test(this.trigger);
    }
}

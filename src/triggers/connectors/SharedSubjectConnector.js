import EventConnector from './EventConnector.js';
import { readSimpleEvent } from '../simpleEvents.js';

const OR = /^(?:,? ?or |, (?!and ))/i;

export default class SharedSubjectConnector extends EventConnector {
    static get pattern() {
        return OR;
    }

    static readEvent(scribe, previous, text) {
        if (!previous.subject) return null;
        const event = readSimpleEvent(scribe, `${previous.subject} ${text}`);
        event?.shareSubject(text);
        return event;
    }
}

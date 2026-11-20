import EventConnector from './EventConnector.js';
import { readSimpleEvent } from '../simpleEvents.js';

const OR_AT_OR_WHEN = /^,?\s*(?:or|and) (?:at|whenever|when) |^,?\s*or /i;

export default class IndependentEventConnector extends EventConnector {
    static get pattern() {
        return OR_AT_OR_WHEN;
    }

    static readEvent(scribe, previous, text) {
        return readSimpleEvent(scribe, text);
    }
}

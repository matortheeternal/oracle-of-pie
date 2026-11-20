import Parser from '../core/Parser.js';
import { readSimpleEvent } from './simpleEvents.js';
import { EVENT_CONNECTORS } from './connectors/index.js';

function readAlternative(scribe, previous) {
    for (const connector of EVENT_CONNECTORS) {
        const event = connector.read(scribe, previous);
        if (event) return event;
    }
    return null;
}

function readAlternatives(scribe, first) {
    const events = [first];
    let next = readAlternative(scribe, first);
    while (next) {
        events.push(next);
        next = readAlternative(scribe, next);
    }
    return events;
}

export default class CompoundEvent extends Parser {
    static match(scribe, str) {
        const first = readSimpleEvent(scribe, str);
        if (!first) return null;
        const events = readAlternatives(scribe, first);
        return events.length > 1 ? Object.assign([''], { events }) : null;
    }

    static parse(scribe, match, str) {
        const compound = super.parse(scribe, match, str);
        compound.lastEvent.consumeUnreadText();
        compound.remainingStr = compound.lastEvent.remainingStr;
        return compound;
    }

    constructor(scribe, match, str) {
        super(scribe, match, str);
        this.events = match.events;
        this.remainingStr = this.lastEvent.remainingStr;
    }

    get lastEvent() {
        return this.events.at(-1);
    }

    get children() {
        return this.events;
    }

    get alternatives() {
        return this.events;
    }

    get isRepeatable() {
        return this.events.some(event => event.isRepeatable);
    }
}

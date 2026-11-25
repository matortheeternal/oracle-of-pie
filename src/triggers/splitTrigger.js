import Parser from '../core/Parser.js';
import { TRIGGER_EVENTS } from './index.js';

const BOUNDARY = /"[^"]*"|, |\.(?!\d)/g;
const COMMA = ', ';
const PERIOD = '.';

function candidates(rest) {
    const candidates = [];
    for (const { 0: boundary, index } of rest.matchAll(BOUNDARY)) {
        if (boundary === PERIOD) break;
        if (boundary !== COMMA) continue;
        candidates.push([rest.slice(0, index), rest.slice(index + boundary.length)]);
    }
    return candidates;
}

function selectBoundary(parser, options) {
    const complete = [];
    const readable = [];
    for (const [eventText, body] of options) {
        const event = parser.parseNext(eventText, TRIGGER_EVENTS);
        const split = [eventText, event, body];
        const recognized = event.isRecognized;
        const hasBody = parser.scribe.startsModeledClause(body);
        if (recognized && hasBody) return split;
        if (recognized) complete.push(split);
        if (hasBody) readable.push(split);
    }
    return complete[0] ?? readable[0];
}

function incompleteBoundary(parser, rest) {
    let index = rest.indexOf(COMMA);
    while (index >= 0) {
        const body = rest.slice(index + COMMA.length);
        if (parser.scribe.startsClause(body)) {
            const eventText = rest.slice(0, index);
            return [eventText, parser.parseNext(eventText, TRIGGER_EVENTS), body];
        }
        index = rest.indexOf(COMMA, index + COMMA.length);
    }
    return null;
}

export default function splitTrigger(scribe, rest) {
    const parser = new Parser(scribe);
    return selectBoundary(parser, candidates(rest)) ?? incompleteBoundary(parser, rest);
}
